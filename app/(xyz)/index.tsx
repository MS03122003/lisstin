import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Polyline } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const AuthScreen = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/(auth)/auth');
  };

  const handleSignUp = () => {
  router.push('/(auth)/welcome');  // Changed from /(auth)/signup
};

  const handleForgotPassword = () => {
    // Handle forgot password logic
    console.log('Forgot password pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Chart Icon */}
        <View style={styles.iconContainer}>
          <Svg width="80" height="80" viewBox="0 0 80 80">
            {/* Bar chart bars */}
            <Path d="M15 65 L15 45 L25 45 L25 65 Z" fill="#00D4AA" />
            <Path d="M30 65 L30 35 L40 35 L40 65 Z" fill="#00D4AA" />
            <Path d="M45 65 L45 25 L55 25 L55 65 Z" fill="#00D4AA" />
            <Path d="M60 65 L60 30 L70 30 L70 65 Z" fill="#00D4AA" />
            
            {/* Upward arrow */}
            <Polyline
              points="60,25 65,15 70,25"
              fill="none"
              stroke="#00D4AA"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path d="M65 15 L65 35" stroke="#00D4AA" strokeWidth="3" strokeLinecap="round" />
          </Svg>
        </View>

        {/* App Name */}
        <Text style={styles.appName}>FinWise</Text>
        
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Track expenses, set budgets, and achieve{'\n'}
          your financial goals with ease.
        </Text>

        {/* Buttons Container */}
        <View style={styles.buttonContainer}>
          {/* Log In Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Forgot Password Link */}
          <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00D4AA',
    marginBottom: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 60,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#00D4AA',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 25,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    marginBottom: 20,
  },
  signupButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '500',
  },
  forgotPasswordContainer: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#666666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default AuthScreen;
