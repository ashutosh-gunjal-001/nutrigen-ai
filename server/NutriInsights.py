import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('USDA_API_KEY')
if not API_KEY:
    raise ValueError("No USDA_API_KEY found in environment variables")

BASE_URL = "https://api.nal.usda.gov/fdc/v1"

def search_food(query, page_size=5):
    url = f"{BASE_URL}/foods/search"
    params = {
        "api_key": API_KEY,
        "query": query,
        "pageSize": page_size
    }
    response = requests.get(url, params=params)
    return response.json()

def get_food_details(fdc_id):
    url = f"{BASE_URL}/food/{fdc_id}"
    params = {
        "api_key": API_KEY
    }
    response = requests.get(url, params=params)
    return response.json()

def list_foods(data_type="Survey (FNDDS)", page_size=5, page_number=1):
    url = f"{BASE_URL}/foods/list"
    params = {
        "api_key": API_KEY,
        "dataType": data_type,
        "pageSize": page_size,
        "pageNumber": page_number
    }
    response = requests.get(url, params=params)
    return response.json()

def get_multiple_foods(fdc_ids):
    url = f"{BASE_URL}/foods"
    headers = {
        "Content-Type": "application/json"
    }
    params = {
        "api_key": API_KEY
    }
    data = {
        "fdcIds": fdc_ids
    }
    response = requests.post(url, headers=headers, params=params, json=data)
    return response.json()

def get_nutrients_by_name(fdc_id, nutrient_name):
    data = get_food_details(fdc_id)
    nutrients = data.get("foodNutrients", [])
    result = {}
    for nutrient in nutrients:
        if nutrient_name.lower() in nutrient["nutrientName"].lower():
            result[nutrient["nutrientName"]] = {
                "value": nutrient.get("value"),
                "unit": nutrient.get("unitName")
            }
    return result

def parse_search_results(search_data):
    foods = search_data.get('foods', [])
    return [
        {
            'id': food.get('fdcId'),
            'name': food.get('description'),
            'brand': food.get('brandOwner'),
            'dataType': food.get('dataType')
        }
        for food in foods
    ]

def parse_food_details(food_data):
    nutrients = {
        'calories': 0,
        'protein': 0,
        'fat': 0,
        'carbs': 0,
        'fiber': 0,
        'micronutrients': {}
    }

    nutrient_map = {
        'Energy': 'calories',
        'Protein': 'protein',
        'Total lipid (fat)': 'fat',
        'Carbohydrate, by difference': 'carbs',
        'Fiber, total dietary': 'fiber',
    }

    for nutrient in food_data.get('foodNutrients', []):
        nutrient_name = nutrient.get('nutrient', {}).get('name')
        value = nutrient.get('amount', 0)
        unit = nutrient.get('unitName', '').lower()

        found = False
        for key, mapped_key in nutrient_map.items():
            if key.lower() in nutrient_name.lower():
                if mapped_key != 'calories' and value is not None:
                    if unit == 'mg':
                        value /= 1000
                    elif unit == 'µg' or unit == 'ug':
                        value /= 1000000
                
                nutrients[mapped_key] = round(value, 2) if value is not None else 0
                found = True
                break
        
        if not found:
            if nutrient_name and value is not None:
                nutrients['micronutrients'][nutrient_name] = f"{value} {unit}"

    return {
        'fdcId': food_data.get('fdcId'),
        'name': food_data.get('description'),
        'brand': food_data.get('brandOwner'),
        'nutrients': nutrients
    }
