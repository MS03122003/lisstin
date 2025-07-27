import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';

const LisstInCall = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState({
    dial_code: '+91',
    code: 'IN',
    flag: '🇮🇳',
    name: { en: 'India' }
  });
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name');
      return false;
    }

    if (!phone.trim()) {
      Alert.alert('Validation Error', 'Please enter your phone number');
      return false;
    }

    // Basic mobile number validation (digits only, minimum 7 digits)
    const mobileRegex = /^\d{7,15}$/;
    if (!mobileRegex.test(phone)) {
      Alert.alert('Validation Error', 'Please enter a valid mobile number (7-15 digits)');
      return false;
    }

    return true;
  };

  const sendFormData = async (formData) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('https://lisstin-771501118812.asia-south1.run.app/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('Form submitted successfully:', responseData);
        return { success: true, data: responseData };
      } else {
        console.error('Server error:', responseData);
        return { 
          success: false, 
          error: responseData.message || 'Server error occurred' 
        };
      }
    } catch (error) {
      console.error('Network error:', error);
      return { 
        success: false, 
        error: 'Network error. Please check your internet connection.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      // Simplified form data with just name and complete phone number
      const formData = {
        name: name.trim(),
        phone: selectedCountryCode.dial_code + phone, // Format: +91xxxxxxxxxx
      };

      console.log('Submitting form data:', formData);
      
      const result = await sendFormData(formData);
      
      if (result.success) {
        Alert.alert(
          'Call Request Submitted',
          `Thank you ${name}! We will call you at ${selectedCountryCode.dial_code}${phone}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setName('');
                setPhone('');
                setSelectedCountryCode({
                  dial_code: '+91',
                  code: 'IN',
                  flag: '🇮🇳',
                  name: { en: 'India' }
                });
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Submission Failed',
          result.error || 'Something went wrong. Please try again.',
          [
            {
              text: 'OK',
            },
          ]
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>LisstIn Call</Text>
            <Text style={styles.headerSubtitle}>Get a personalized call from our experts</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="call" size={32} color="#e34c00" />
          </View>
        </View>

        {/* Form Content */}
        <View style={styles.formContainer}>
          {/* Name Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor="#6B7280"
                autoCapitalize="words"
                autoComplete="name"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Mobile Number Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View style={styles.mobileInputContainer}>
              {/* Country Code Selector */}
              <TouchableOpacity
                style={styles.countrySelector}
                onPress={() => setShowCountryPicker(true)}
                disabled={isLoading}
              >
                <Text style={styles.countryFlag}>{selectedCountryCode.flag}</Text>
                <Text style={styles.selectedCountryCode}>{selectedCountryCode.dial_code}</Text>
                <Ionicons name="chevron-down" size={16} color="#6B7280" />
              </TouchableOpacity>

              {/* Mobile Number Input */}
              <View style={styles.mobileInput}>
                <Ionicons name="call-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter mobile number"
                  placeholderTextColor="#6B7280"
                  keyboardType="numeric"
                  autoComplete="tel"
                  editable={!isLoading}
                />
              </View>
            </View>
            <Text style={styles.helperText}>
              We'll call you on this number to discuss your LisstIn experience
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" style={styles.submitIcon} />
            ) : (
              <Ionicons name="call" size={20} color="#FFFFFF" style={styles.submitIcon} />
            )}
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Submitting...' : 'Request Call'}
            </Text>
          </TouchableOpacity>

          {/* Additional Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={16} color="#e34c00" />
              <Text style={styles.infoText}>We'll call within a few minutes</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#e34c00" />
              <Text style={styles.infoText}>Your information is secure</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#e34c00" />
              <Text style={styles.infoText}>Free consultation call</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Country Picker Modal */}
      <CountryPicker
        show={showCountryPicker}
        pickerButtonOnPress={(item) => {
          setSelectedCountryCode(item);
          setShowCountryPicker(false);
        }}
        onBackdropPress={() => setShowCountryPicker(false)}
        lang="en"
        style={{
          modal: {
            height: '70%',
            backgroundColor: '#1A202C',
          },
          backdrop: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
          textInput: {
            height: 50,
            borderRadius: 12,
            backgroundColor: '#2D3748',
            color: '#FFFFFF',
            paddingHorizontal: 16,
            fontSize: 16,
            borderWidth: 1,
            borderColor: '#4A5568',
          },
          countryButtonStyles: {
            height: 60,
            backgroundColor: '#1A202C',
            borderBottomWidth: 1,
            borderBottomColor: '#2D3748',
          },
          searchMessageText: {
            color: '#A0AEC0',
            fontSize: 16,
          },
          countryMessageContainer: {
            backgroundColor: '#1A202C',
          },
          flag: {
            fontSize: 24,
          },
          dialCode: {
            color: '#e34c00',
            fontSize: 16,
            fontWeight: '600',
          },
          countryName: {
            color: '#FFFFFF',
            fontSize: 16,
          },
        }}
        searchMessage="Search country"
        inputPlaceholder="Search by country name or code"
        popularCountries={['IN', 'US', 'GB', 'CA', 'AU']}
        excludedCountries={[]}
        initialState={selectedCountryCode.dial_code}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1419',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e34c0020',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  mobileInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
    paddingHorizontal: 12,
    paddingVertical: 14,
    minWidth: 100,
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 6,
  },
  selectedCountryCode: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 6,
  },
  mobileInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
    marginLeft: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e34c00',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#7A3D1A',
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoSection: {
    backgroundColor: '#1A202C',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#CBD5E0',
    marginLeft: 8,
  },
});

export default LisstInCall;
