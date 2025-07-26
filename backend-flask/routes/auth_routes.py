from flask import Blueprint, request, jsonify
from services.otp_service import OTPService
from services.user_service import UserService

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    phone_number = data.get('phoneNumber')
    
    if not phone_number:
        return jsonify({'error': 'Phone number is required'}), 400
    
    result = OTPService.send_otp(phone_number)
    
    if result['success']:
        return jsonify(result), 200
    else:
        return jsonify(result), 500

@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    phone_number = data.get('phoneNumber')
    otp = data.get('otp')
    user_data = data.get('userData', {})
    is_login = data.get('isLogin', True)
    
    if not phone_number or not otp:
        return jsonify({'error': 'Phone number and OTP are required'}), 400
    
    # Verify OTP
    if not OTPService.verify_otp(phone_number, otp):
        return jsonify({'error': 'Invalid or expired OTP'}), 400
    
    # Handle user authentication
    result = UserService.authenticate_user(phone_number, user_data, is_login)
    
    if result['success']:
        return jsonify(result), 200
    else:
        return jsonify(result), 400
