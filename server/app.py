from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from firebase_config import db, auth, create_custom_token, verify_custom_token
from firebase_admin import firestore
from functools import wraps
import json
from AI.chat import get_ai_response
from AI.mealPlanner import generate_meal_plan
from NutriInsights import search_food, get_food_details, parse_search_results, parse_food_details
from datetime import datetime, timedelta

app = Flask(__name__)

app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app, 
     resources={
         r"/*": {
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True
         }
     })

class AuthError(Exception):
    def __init__(self, error, status_code=401):
        self.error = error
        self.status_code = status_code

@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise AuthError({
                'code': 'authorization_header_missing',
                'description': 'Authorization header is expected.'
            }, 401)
            
        token = auth_header.split(' ')[1]
        try:
            payload = verify_custom_token(token)
            request.current_user = payload
        except Exception as e:
            raise AuthError({
                'code': 'invalid_token',
                'description': 'The token is invalid or expired.'
            }, 401)
            
        return f(*args, **kwargs)
    return decorated

@app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
        
    data = request.get_json()
    
    try:
        user = auth.create_user(
            email=data['email'],
            password=data['password']
        )
        
        health_details = {
            'age': data.get('age', ''),
            'gender': data.get('gender', ''),
            'height': data.get('height', ''),
            'weight': data.get('weight', ''),
            'dietPreference': data.get('dietPreference', ''),
            'goal': data.get('goal', ''),
            'activityLevel': data.get('activityLevel', ''),
            'allergies': data.get('allergies', '')
        }

        user_data = {
            'uid': user.uid,
            'email': data['email'],
            'created_at': firestore.SERVER_TIMESTAMP,
            'name': data.get('name', ''),
            'healthDetails': health_details
        }
        
        db.collection('users').document(user.uid).set(user_data)
        
        token = create_custom_token(user.uid)
        
        return jsonify({
            'message': 'User created successfully',
            'token': token,
            'user': {
                'uid': user.uid,
                'email': user.email,
                'name': user_data.get('name', ''),
                'healthDetails': health_details
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    try:
        user = auth.get_user_by_email(data['email'])
        
        token = create_custom_token(user.uid)
        
        user_doc = db.collection('users').document(user.uid).get()
        user_data = user_doc.to_dict() if user_doc.exists else {'email': user.email}
        
        return jsonify({
            'token': token,
            'user': {
                'uid': user.uid,
                'email': user.email,
                'name': user_data.get('name', ''),
                'healthDetails': user_data.get('healthDetails', {})
            }
        })
        
    except Exception as e:
        return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/api/me', methods=['GET'])
@requires_auth
def get_current_user():
    user_id = request.current_user['uid']
    user_doc = db.collection('users').document(user_id).get()
    
    if not user_doc.exists:
        return jsonify({'error': 'User not found'}), 404
        
    user_data = user_doc.to_dict()
    return jsonify(user_data)

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
@requires_auth
def chat():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
    
    try:
        data = request.get_json()
        chat_history = data.get('messages', [])
        
        if not chat_history:
            return jsonify({'error': 'No messages provided'}), 400
            
        last_message = chat_history[-1].get('content', '') if chat_history else ''
        
        user_ref = db.collection('users').document(request.current_user['uid'])
        user_doc = user_ref.get()
        
        user_info = None
        if user_doc.exists:
            user_data = user_doc.to_dict()
            user_info = user_data.get('healthDetails', {})
        
        ai_response = get_ai_response(chat_history, user_info)
        
        return jsonify({
            'reply': ai_response,
            'message': last_message
        })
    except Exception as e:
        app.logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/generate-meal-plan', methods=['POST'])
@requires_auth
def create_meal_plan():
    try:
        user_id = request.current_user['uid']
        user_doc = db.collection('users').document(user_id).get()

        if not user_doc.exists:
            return jsonify({'error': 'User not found'}), 404

        user_data = user_doc.to_dict()
        health_details = user_data.get('healthDetails', {})

        name = user_data.get('name', 'User')
        age = health_details.get('age')
        gender = health_details.get('gender')
        height = health_details.get('height')
        weight = health_details.get('weight')
        diet_preference = health_details.get('dietPreference')
        goal = health_details.get('goal')
        activity_level = health_details.get('activityLevel')
        allergies = health_details.get('allergies', '')

        meal_plan_json = generate_meal_plan(
            name=name,
            age=age,
            gender=gender,
            height=height,
            weight=weight,
            diet_preference=diet_preference,
            goal=goal,
            activity_level=activity_level,
            allergies=allergies
        )

        meal_plan_data = json.loads(meal_plan_json)

        db.collection('mealPlans').document(user_id).set(meal_plan_data)

        return jsonify({'message': 'Meal plan generated and saved successfully', 'meal_plan': meal_plan_data}), 200

    except Exception as e:
        app.logger.error(f"Error in meal plan generation: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/meal-plan', methods=['GET'])
@requires_auth
def get_meal_plan():
    try:
        user_id = request.current_user['uid']
        meal_plan_doc = db.collection('mealPlans').document(user_id).get()

        if not meal_plan_doc.exists:
            return jsonify({'error': 'Meal plan not found'}), 404

        return jsonify(meal_plan_doc.to_dict()), 200

    except Exception as e:
        app.logger.error(f"Error fetching meal plan: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/nutrition/search', methods=['GET'])
def search_food_route():
    query = request.args.get('q')
    if not query:
        return jsonify({'error': 'Query parameter "q" is required'}), 400
    
    try:
        search_results = search_food(query)
        if 'error' in search_results or 'errors' in search_results:
             return jsonify({'error': 'Error from external API', 'details': search_results}), 502
        
        parsed_results = parse_search_results(search_results)
        return jsonify(parsed_results)

    except Exception as e:
        app.logger.error(f"Error in food search: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/nutrition/food/<int:fdc_id>', methods=['GET'])
def get_food_details_route(fdc_id):
    try:
        food_details = get_food_details(fdc_id)
        if food_details.get('Error') or food_details.get('error'):
             return jsonify({'error': 'Food not found or API error', 'details': food_details}), 404
        
        parsed_details = parse_food_details(food_details)
        return jsonify(parsed_details)
        
    except Exception as e:
        app.logger.error(f"Error fetching food details: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/log-meal', methods=['POST'])
@requires_auth
def log_meal():
    """Log that the user has consumed at least one meal today and update their streak.
    Expected JSON body can optionally include `meal` details, but is not required for streak.
    """
    try:
        user_id = request.current_user['uid']
        today = datetime.utcnow().date()

        log_ref = db.collection('mealLogs').document(user_id)
        log_doc = log_ref.get()

        if log_doc.exists:
            data = log_doc.to_dict()
            last_logged = data.get('last_logged_date')
            current_streak = data.get('current_streak', 0)

            if last_logged:
                last_logged_date = last_logged.date() if isinstance(last_logged, datetime) else datetime.strptime(last_logged, "%Y-%m-%d").date()
            else:
                last_logged_date = None

            if last_logged_date == today:
                return jsonify({'message': 'Meal already logged today', 'streak': current_streak}), 200
            elif last_logged_date == today - timedelta(days=1):
                current_streak += 1
            else:
                current_streak = 1
        else:
            current_streak = 1

        log_entry = {
            'timestamp': firestore.SERVER_TIMESTAMP,
            'meal': request.get_json(silent=True) or {}
        }

        log_ref.set({
            'last_logged_date': today.isoformat(),
            'current_streak': current_streak,
        }, merge=True)

        log_ref.collection('entries').add(log_entry)

        return jsonify({'message': 'Meal logged', 'streak': current_streak}), 200
    except Exception as e:
        app.logger.error(f"Error logging meal: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500


@app.route('/api/streak', methods=['GET'])
@requires_auth
def get_streak():
    """Return the user's current meal logging streak in days."""
    try:
        user_id = request.current_user['uid']
        log_doc = db.collection('mealLogs').document(user_id).get()
        if not log_doc.exists:
            return jsonify({'streak': 0}), 200

        data = log_doc.to_dict()
        current_streak = data.get('current_streak', 0)
        last_logged = data.get('last_logged_date')

        if last_logged:
            last_logged_date = last_logged.date() if isinstance(last_logged, datetime) else datetime.strptime(last_logged, "%Y-%m-%d").date()
            today = datetime.utcnow().date()
            if last_logged_date < today - timedelta(days=1):
                current_streak = 0
                db.collection('mealLogs').document(user_id).update({'current_streak': 0})

        return jsonify({'streak': current_streak}), 200
    except Exception as e:
        app.logger.error(f"Error fetching streak: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
