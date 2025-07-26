import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from dotenv import load_dotenv
from datetime import datetime, timedelta
import random

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin SDK
cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred)

# Get Firestore client
db = firestore.client()
def sendSMS(mobile, otp, DLT_TE_ID):
    """
    Send SMS using SSD Web API
    """
    # Normalize mobile number to start with '91'
    if not mobile.startswith('91'):
        mobile = '91' + mobile  # ADD '91' prefix

    message = f"Your ListNow account OTP is: {otp}.\n Please DO NOT SHARE this OTP with anyone"
    
    params = {
        'authkey': os.getenv('SSD_WEB_AUTH_KEY'),
        'mobiles': mobile,
        'message': message,
        'sender': 'FRNTGR',
        'route': '4',
        'country': '91',
        'DLT_TE_ID': DLT_TE_ID,
        'response': 'json',
    }

    try:
        print("Sending SMS with params:", params)
        response = requests.get('http://sms.ssdweb.in/api/sendhttp.php', params=params, timeout=10)
        
        # Debug the actual response
        print("Raw SMS API Response:", response.text)
        
        if response.status_code == 200:
            try:
                resp_json = response.json()
                print("Parsed SMS API Response:", resp_json)
                
                # Check different possible success indicators
                if (resp_json.get('type') == 'success' or 
                    resp_json.get('status') == 'success' or
                    resp_json.get('ErrorCode') == '000' or  # Common success code
                    'success' in str(resp_json).lower()):
                    print(f"SMS sent successfully to {mobile}")
                    return True
                else:
                    print("SMS API Error:", resp_json)
                    return False
            except ValueError as e:
                print("Failed to parse JSON response:", response.text)
                return False
        else:
            print("SMS request failed status code:", response.status_code)
            print("Response:", response.text)
            return False
    except Exception as e:
        print("Error sending OTP SMS:", e)
        return False


@app.route('/api/submit-user-data', methods=['POST'])
def submit_user_data():
    """
    Handle user signup/login and send OTP
    """
    try:
        data = request.get_json()
        phone_number = data.get('phoneNumber')
        user_data = data.get('userData', {})
        is_login = data.get('isLogin', True)
        DLT_TE_ID = data.get('DLT_TE_ID', '1407160787155250027')  # Replace with your actual DLT ID
        
        print(f"=== SUBMIT USER DATA REQUEST ===")
        print(f"Phone: {phone_number}, isLogin: {is_login}")
        print(f"User data: {user_data}")

        if not phone_number:
            return jsonify({'error': 'Phone number is required'}), 400

        # Validate phone number (10 digits for Indian numbers)
        if not phone_number.isdigit() or len(phone_number) != 10:
            return jsonify({'error': 'Please enter a valid 10-digit mobile number'}), 400

        # Normalize phone number
        normalized_phone = phone_number if phone_number.startswith('91') else '91' + phone_number

        users_ref = db.collection('users')
        query = users_ref.where(filter=FieldFilter('phoneNumber', '==', normalized_phone)).get()

        # Generate 6-digit OTP
        otp = ''.join([str(d) for d in random.choices(range(10), k=6)])
        otp_expiry = datetime.utcnow() + timedelta(minutes=2)

        if is_login:
            # Login flow
            if not query:
                return jsonify({'error': 'User not found. Please sign up first.'}), 404

            user_doc = query[0]
            existing_data = user_doc.to_dict()
            user_id = user_doc.id

            # Update Firestore with OTP info
            users_ref.document(user_id).update({
                'lastLogin': firestore.SERVER_TIMESTAMP,
                'otp': otp,
                'otpExpiresAt': otp_expiry,
                'isFIconnect': False,
            })

            # Send OTP SMS
            sms_sent = sendSMS(normalized_phone, otp, DLT_TE_ID)
            if not sms_sent:
                return jsonify({'error': 'Failed to send OTP. Please try again.'}), 500

            return jsonify({
                'success': True,
                'message': 'Login OTP sent successfully',
                'debug_otp': otp,  # Remove in production
                'user': {
                    'id': user_id,
                    'name': existing_data.get('name'),
                    'email': existing_data.get('email'),
                    'phoneNumber': existing_data.get('phoneNumber'),
                }
            }), 200

        else:
            # Signup flow
            if query:
                return jsonify({'error': 'User already exists. Please login instead.'}), 409

            if not user_data.get('name') or not user_data.get('email'):
                return jsonify({'error': 'Name and email are required for signup'}), 400

            # Validate email
            import re
            email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
            if not re.match(email_regex, user_data.get('email')):
                return jsonify({'error': 'Please enter a valid email address'}), 400

            new_user_data = {
                'name': user_data.get('name'),
                'email': user_data.get('email'),
                'phoneNumber': normalized_phone,
                'createdAt': firestore.SERVER_TIMESTAMP,
                'lastLogin': firestore.SERVER_TIMESTAMP,
                'isActive': True,
                'profileComplete': True,
                'otp': otp,
                'otpExpiresAt': otp_expiry,
                'isFIconnect': False,
                'emailVerified': False,
                'phoneVerified': False,  # Will be True after OTP verification
            }

            doc_ref = users_ref.add(new_user_data)
            user_id = doc_ref[1].id

            # Send OTP SMS
            sms_sent = sendSMS(normalized_phone, otp, DLT_TE_ID)
            if not sms_sent:
                # If SMS fails, delete the created user
                users_ref.document(user_id).delete()
                return jsonify({'error': 'Failed to send OTP. Please try again.'}), 500

            print(f"Created user {user_id} and sent OTP")

            return jsonify({
                'success': True,
                'message': 'Signup OTP sent successfully',
                'debug_otp': otp,  # Remove in production
                'user': {
                    'id': user_id,
                    'name': new_user_data['name'],
                    'email': new_user_data['email'],
                    'phoneNumber': new_user_data['phoneNumber'],
                }
            }), 201

    except Exception as e:
        print(f"Error in submit_user_data: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    """
    Verify OTP and complete authentication
    """
    try:
        data = request.get_json()
        phone_number = data.get('phoneNumber')
        otp = data.get('otp')

        print(f"=== VERIFY OTP REQUEST ===")
        print(f"Phone: {phone_number}, OTP: {otp}")

        if not phone_number or not otp:
            return jsonify({'error': 'Phone number and OTP are required'}), 400

        # Validate OTP format
        if not otp.isdigit() or len(otp) != 6:
            return jsonify({'error': 'Please enter a valid 6-digit OTP'}), 400

        normalized_phone = phone_number if phone_number.startswith('91') else '91' + phone_number

        users_ref = db.collection('users')
        query = users_ref.where(filter=FieldFilter('phoneNumber', '==', normalized_phone)).get()

        if not query:
            return jsonify({'error': 'User not found'}), 404

        user_doc = query[0]
        user_data = user_doc.to_dict()
        user_id = user_doc.id

        stored_otp = user_data.get('otp')
        otp_expires_at = user_data.get('otpExpiresAt')

        if not stored_otp:
            return jsonify({'error': 'OTP not found. Please request a new OTP.'}), 400
        
        # Check if OTP expired
        if datetime.utcnow() > otp_expires_at.replace(tzinfo=None):
            # Clear expired OTP
            users_ref.document(user_id).update({
                'otp': firestore.DELETE_FIELD,
                'otpExpiresAt': firestore.DELETE_FIELD,
            })
            return jsonify({'error': 'OTP expired. Please request a new OTP.'}), 400

        # Verify OTP
        if stored_otp != otp:
            return jsonify({'error': 'Invalid OTP. Please check and try again.'}), 400

        # OTP verified successfully - update user status
        users_ref.document(user_id).update({
            'isFIconnect': True,
            'phoneVerified': True,
            'lastVerifiedAt': firestore.SERVER_TIMESTAMP,
            'otp': firestore.DELETE_FIELD,
            'otpExpiresAt': firestore.DELETE_FIELD,
        })

        print(f"OTP verified successfully for user {user_id}")

        return jsonify({
            'success': True,
            'message': 'OTP verified successfully',
            'user': {
                'id': user_id,
                'name': user_data.get('name'),
                'email': user_data.get('email'),
                'phoneNumber': user_data.get('phoneNumber'),
                'verified': True,
            }
        }), 200

    except Exception as e:
        print(f"Error verifying OTP: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/resend-otp', methods=['POST'])
def resend_otp():
    """
    Resend OTP to user
    """
    try:
        data = request.get_json()
        phone_number = data.get('phoneNumber')
        DLT_TE_ID = data.get('DLT_TE_ID', 'YOUR_DEFAULT_DLT_ID')

        print(f"=== RESEND OTP REQUEST ===")
        print(f"Phone: {phone_number}")

        if not phone_number:
            return jsonify({'error': 'Phone number is required'}), 400

        normalized_phone = phone_number if phone_number.startswith('91') else '91' + phone_number

        users_ref = db.collection('users')
        query = users_ref.where(filter=FieldFilter('phoneNumber', '==', normalized_phone)).get()

        if not query:
            return jsonify({'error': 'User not found'}), 404

        user_doc = query[0]
        user_id = user_doc.id

        # Generate new OTP
        otp = ''.join([str(d) for d in random.choices(range(10), k=6)])
        otp_expiry = datetime.utcnow() + timedelta(minutes=2)

        # Update with new OTP
        users_ref.document(user_id).update({
            'otp': otp,
            'otpExpiresAt': otp_expiry,
        })

        # Send OTP SMS
        sms_sent = sendSMS(normalized_phone, otp, DLT_TE_ID)
        if not sms_sent:
            return jsonify({'error': 'Failed to resend OTP. Please try again.'}), 500

        return jsonify({
            'success': True,
            'message': 'OTP resent successfully',
            'debug_otp': otp  # Remove in production
        }), 200

    except Exception as e:
        print(f"Error resending OTP: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-all-users', methods=['GET'])
def get_all_users():
    """
    Get all users (for admin/debugging purposes)
    """
    try:
        users_ref = db.collection('users')
        docs = users_ref.stream()
        
        users = []
        for doc in docs:
            user_data = doc.to_dict()
            user_data['id'] = doc.id
            # Remove sensitive data
            user_data.pop('otp', None)
            user_data.pop('otpExpiresAt', None)
            users.append(user_data)
        
        return jsonify({
            'success': True,
            'users': users,
            'count': len(users)
        }), 200
        
    except Exception as e:
        print(f"Error getting users: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """
    Health check endpoint
    """
    return jsonify({
        'status': 'healthy',
        'message': 'LisstIn API server is running',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    }), 200

if __name__ == '__main__':
    print("Starting LisstIn Flask API server...")
    print("Environment variables loaded:")
    print(f"- Firebase Project ID: {os.getenv('FIREBASE_PROJECT_ID', 'Not set')}")
    print(f"- SMS API Key: {'Set' if os.getenv('SSD_WEB_AUTH_KEY') else 'Not set'}")
    app.run(debug=True, host='0.0.0.0', port=5000)