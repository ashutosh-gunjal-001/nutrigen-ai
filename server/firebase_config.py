import firebase_admin
from firebase_admin import credentials, firestore, auth
from firebase_admin import auth as firebase_auth
import datetime
import jwt
import os
import json
from dotenv import load_dotenv

load_dotenv()

firebase_credentials = {
    "type": os.getenv("FIREBASE_TYPE"),
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
    "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL")
}

cred = credentials.Certificate(firebase_credentials)
firebase_admin.initialize_app(cred)

db = firestore.client()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DELTA = datetime.timedelta(days=1)

def create_custom_token(uid, additional_claims=None):
    """Generate a custom token for the specified UID"""
    payload = {
        'uid': uid,
        'exp': datetime.datetime.utcnow() + JWT_EXPIRATION_DELTA,
        'iat': datetime.datetime.utcnow(),
    }
    if additional_claims:
        payload.update(additional_claims)
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_custom_token(token):
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception('Token expired')
    except jwt.InvalidTokenError:
        raise Exception('Invalid token')
