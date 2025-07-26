// app/fi/fi-mcp-code.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FiMcpCode = () => {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Check if already connected
    checkConnectionStatus();
    
    // Focus first input on mount
    inputRefs.current[0]?.focus();

    // Start subtle pulse animation for logo
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [pulseAnim]);

  const checkConnectionStatus = async () => {
    try {
      const status = await AsyncStorage.getItem('fiMoneyConnected');
      if (status === 'true') {
        setIsConnected(true);
        // Pre-fill code for demonstration
        setCode(['1', '2', '3', '4', '5', '6']);
      }
    } catch (error) {
      console.log('Error checking connection status:', error);
    }
  };

  const handleCodeChange = (text: string, index: number) => {
    // Only allow numeric input
    if (!/^\d*$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (text && index === 5 && newCode.every(digit => digit !== '')) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      // Focus previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const saveConnectionStatus = async (status: boolean) => {
    try {
      await AsyncStorage.setItem('fiMoneyConnected', status.toString());
    } catch (error) {
      console.log('Error saving connection status:', error);
    }
  };

  const handleSubmit = async (enteredCode?: string) => {
    const codeToValidate = enteredCode || code.join('');
    
    if (codeToValidate.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter all 6 digits');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to validate FI-MCP code
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, accept any 6-digit code
      // In production, validate against your backend
      if (codeToValidate.length === 6) {
        // Set connection status to true
        setIsConnected(true);
        await saveConnectionStatus(true);
        
        // Show success message
        Alert.alert(
          'Connection Successful! 🎉',
          'Your Fi Money MCP has been successfully connected to LisstIn. Your transactions will now sync automatically.',
          [
            {
              text: 'Continue to Dashboard',
              onPress: () => {
                router.replace({
                  pathname: '/(tabs)/dashboard',
                  params: { fiConnected: 'true' }
                });
              },
            },
          ]
        );
      } else {
        throw new Error('Invalid code');
      }
    } catch (error) {
      Alert.alert(
        'Verification Failed',
        'Invalid FI-MCP code. Please check your code and try again.',
        [{ text: 'Try Again', onPress: () => clearCode() }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearCode = () => {
    setCode(['', '', '', '', '', '']);
    setIsConnected(false);
    inputRefs.current[0]?.focus();
  };

  const resendCode = () => {
    Alert.alert(
      'Resend Code',
      'A new FI-MCP verification code will be sent to your registered contact.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Resend', 
          onPress: () => {
            Alert.alert('Code Sent', 'New verification code has been sent.');
            clearCode();
          }
        },
      ]
    );
  };

  const renderLogo = () => (
    <Animated.View
      style={[
        styles.logoContainer,
        { transform: [{ scale: pulseAnim }] }
      ]}
    >
      <Svg width="80" height="80" viewBox="0 0 120 120">
        <Defs>
          <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#e34c00" />
            <Stop offset="50%" stopColor="#44A08D" />
            <Stop offset="100%" stopColor="#e34c00" />
          </LinearGradient>
        </Defs>
        
        {/* Outer ring */}
        <Circle 
          cx="60" 
          cy="60" 
          r="55" 
          fill="none" 
          stroke="url(#logoGradient)" 
          strokeWidth="2" 
          opacity="0.3" 
        />
        
        {/* Main logo circle */}
        <Circle cx="60" cy="60" r="35" fill="url(#logoGradient)" />
        
        {/* Logo text */}
        <G>
          <SvgText 
            x="60" 
            y="68" 
            fontSize="20" 
            fill="#FFFFFF" 
            fontWeight="bold" 
            textAnchor="middle"
            fontFamily="System"
          >
            Li
          </SvgText>
        </G>
        
        {/* Connection indicator */}
        {isConnected && (
          <Circle cx="85" cy="35" r="8" fill="#10B981" />
        )}
      </Svg>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#CBD5E0" />
          </TouchableOpacity>
          
          {/* Connection Status Indicator */}
          <View style={styles.headerStatus}>
            <View style={[
              styles.statusDot,
              { backgroundColor: isConnected ? '#10B981' : '#6B7280' }
            ]} />
            <Text style={[
              styles.statusText,
              { color: isConnected ? '#10B981' : '#6B7280' }
            ]}>
              {isConnected ? 'Connected' : 'Not Connected'}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Logo and Branding */}
          {renderLogo()}
          
          <Text style={styles.brandTitle}>LisstIn</Text>
          <Text style={styles.brandSubtitle}>Listen to Your Money • List Your Dreams</Text>

          {/* Connection Status Message */}
          {isConnected && (
            <View style={styles.successBanner}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.successText}>Fi Money MCP Connected Successfully!</Text>
            </View>
          )}

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.title}>Enter FI-MCP Code</Text>
            <Text style={styles.subtitle}>
              Please enter the 6-digit Financial Institution - Multi-Channel Platform code to proceed
            </Text>

            {/* Code Input Fields */}
            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.codeInput,
                    digit && styles.codeInputFilled,
                    isConnected && styles.codeInputConnected,
                  ]}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  selectTextOnFocus
                  placeholder="•"
                  placeholderTextColor="#6B7280"
                  editable={!isConnected}
                />
              ))}
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                code.every(digit => digit !== '') && styles.submitButtonActive,
                isLoading && styles.submitButtonLoading,
                isConnected && styles.submitButtonConnected,
              ]}
              onPress={() => isConnected ? router.replace('/(tabs)/dashboard') : handleSubmit()}
              disabled={isLoading || (!isConnected && !code.every(digit => digit !== ''))}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Animated.View
                    style={[
                      styles.loadingSpinner,
                      {
                        transform: [
                          {
                            rotate: pulseAnim.interpolate({
                              inputRange: [1, 1.05],
                              outputRange: ['0deg', '360deg'],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Ionicons name="sync" size={20} color="#FFFFFF" />
                  </Animated.View>
                  <Text style={styles.submitButtonText}>Verifying...</Text>
                </View>
              ) : isConnected ? (
                <>
                  <Ionicons name="home" size={20} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Go to Dashboard</Text>
                </>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Verify Code</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Helper Actions */}
            {!isConnected && (
              <View style={styles.helperActions}>
                <TouchableOpacity onPress={clearCode}>
                  <Text style={styles.helperActionText}>Clear Code</Text>
                </TouchableOpacity>
                
                <Text style={styles.helperSeparator}>•</Text>
                
                <TouchableOpacity onPress={resendCode}>
                  <Text style={styles.helperActionText}>Resend Code</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Disconnect Option for Connected State */}
            {isConnected && (
              <TouchableOpacity 
                style={styles.disconnectButton}
                onPress={() => {
                  Alert.alert(
                    'Disconnect Fi Money',
                    'Are you sure you want to disconnect your Fi Money account?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Disconnect',
                        style: 'destructive',
                        onPress: async () => {
                          setIsConnected(false);
                          await saveConnectionStatus(false);
                          clearCode();
                        },
                      },
                    ]
                  );
                }}
              >
                <Ionicons name="unlink" size={16} color="#FF6B6B" />
                <Text style={styles.disconnectText}>Disconnect Account</Text>
              </TouchableOpacity>
            )}

            {/* Security Notice */}
            <View style={styles.securityNotice}>
              <Ionicons name="shield-checkmark" size={16} color="#e34c00" />
              <Text style={styles.securityText}>
                This code ensures secure access to your financial data
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have a FI-MCP code? Contact your financial institution
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1419',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginTop: 40,
    marginBottom: 24,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#e34c00',
    textAlign: 'center',
    marginBottom: 24,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#10B981',
    gap: 8,
  },
  successText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  mainContent: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
    marginBottom: 40,
    gap: 12,
  },
  codeInput: {
    flex: 1,
    height: 56,
    backgroundColor: '#1A202C',
    borderWidth: 2,
    borderColor: '#2D3748',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  codeInputFilled: {
    borderColor: '#e34c00',
    backgroundColor: '#1A202C',
  },
  codeInputConnected: {
    borderColor: '#10B981',
    backgroundColor: '#1A202C',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D3748',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    maxWidth: 300,
    gap: 8,
    opacity: 0.6,
  },
  submitButtonActive: {
    backgroundColor: '#e34c00',
    opacity: 1,
  },
  submitButtonLoading: {
    backgroundColor: '#e34c00',
    opacity: 0.8,
  },
  submitButtonConnected: {
    backgroundColor: '#10B981',
    opacity: 1,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingSpinner: {
    // Animation handled in component
  },
  helperActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 16,
  },
  helperActionText: {
    fontSize: 14,
    color: '#e34c00',
    fontWeight: '500',
  },
  helperSeparator: {
    fontSize: 14,
    color: '#6B7280',
  },
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  disconnectText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 32,
    gap: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#A0AEC0',
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default FiMcpCode;