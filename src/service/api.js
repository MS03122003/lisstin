import Constants from 'expo-constants';

// Get API base URL from app config or use default
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://10.71.204.70:5000/api';

console.log('API_BASE_URL configured:', API_BASE_URL);

class AuthAPI {
  async makeRequest(endpoint, options) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Making request to: ${url}`);
    console.log('Request options:', JSON.stringify(options, null, 2));

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      console.log(`Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorText;
        } catch {
          errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  /**
   * Submit user data and send OTP
   */
  async submitUserData(
    phoneNumber, 
    userData, 
    isLogin,
    DLT_TE_ID = '1407160787155250027'
  ) {
    console.log('=== SUBMIT USER DATA ===');
    console.log('Phone:', phoneNumber);
    console.log('User data:', userData);
    console.log('Is login:', isLogin);

    return this.makeRequest('/submit-user-data', {
      method: 'POST',
      body: JSON.stringify({
        phoneNumber,
        userData,
        isLogin,
        DLT_TE_ID,
      }),
    });
  }

  /**
   * Verify OTP
   */
  async verifyOTP(phoneNumber, otp) {
    console.log('=== VERIFY OTP ===');
    console.log('Phone:', phoneNumber);
    console.log('OTP:', otp);

    return this.makeRequest('/verify-otp', {
      method: 'POST',
      body: JSON.stringify({
        phoneNumber,
        otp,
      }),
    });
  }

  /**
   * Resend OTP
   */
  async resendOTP(
    phoneNumber, 
    DLT_TE_ID = '1407160787155250027'
  ) {
    console.log('=== RESEND OTP ===');
    console.log('Phone:', phoneNumber);

    return this.makeRequest('/resend-otp', {
      method: 'POST',
      body: JSON.stringify({
        phoneNumber,
        DLT_TE_ID,
      }),
    });
  }

  /**
   * Get user profile by user ID
   */
  async getUserProfile(userId) {
    console.log('=== GET USER PROFILE ===');
    console.log('User ID:', userId);

    return this.makeRequest(`/get-user-profile/${userId}`, {
      method: 'GET',
    });
  }

  /**
   * Get user profile by phone number
   */
  async getUserByPhone(phoneNumber) {
    console.log('=== GET USER BY PHONE ===');
    console.log('Phone:', phoneNumber);

    return this.makeRequest(`/get-user-by-phone/${phoneNumber}`, {
      method: 'GET',
    });
  }

  /**
   * Get all users (admin function)
   */
  async getAllUsers() {
    console.log('=== GET ALL USERS ===');

    return this.makeRequest('/get-all-users', {
      method: 'GET',
    });
  }

  /**
   * Health check
   */
  async healthCheck() {
    const url = `${API_BASE_URL.replace('/api', '')}/health`;
    console.log('Health check URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Test network connectivity
   */
  async testConnection() {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const authAPI = new AuthAPI();

// Export default
export default authAPI;

// Utility functions
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return cleaned.substring(2);
  }
  
  return cleaned;
};

export const normalizePhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (!cleaned.startsWith('91') && cleaned.length === 10) {
    return '91' + cleaned;
  }
  
  return cleaned;
};
