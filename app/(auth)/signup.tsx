import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { authAPI } from "../../src/service/api";

const AuthScreen = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.phoneNumber) {
      Alert.alert("Error", "Please enter your phone number");
      return false;
    }

    if (!isLogin && (!formData.name || !formData.email)) {
      Alert.alert("Error", "Please fill in all required fields");
      return false;
    }

    // Validate 10-digit Indian phone number
    if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      Alert.alert(
        "Error",
        "Please enter a valid 10-digit Indian mobile number"
      );
      return false;
    }

    if (!isLogin) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Alert.alert("Error", "Please enter a valid email address");
        return false;
      }
    }

    return true;
  };

  const submitUserData = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log("=== SUBMITTING USER DATA ===");
      console.log("Phone number:", formData.phoneNumber);
      console.log("Is Login:", isLogin);

      const response = await authAPI.submitUserData(
        formData.phoneNumber,
        isLogin
          ? {}
          : {
              name: formData.name,
              email: formData.email,
            },
        isLogin,
        "1407160787155250027" // Your DLT ID
      );

      console.log("Response received:", response);

      if (response.success) {
        setShowOTPModal(true);
        Alert.alert(
          "OTP Sent!",
          `A 6-digit OTP has been sent to +91${formData.phoneNumber}. Please check your messages.`
        );
      } else {
        Alert.alert("Error", response.error || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("=== SUBMISSION ERROR ===");
      console.error("Error message:", error.message);
      Alert.alert("Error", error.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      console.log("=== VERIFYING OTP ===");
      console.log("Phone:", formData.phoneNumber, "OTP:", otp);

      const response = await authAPI.verifyOTP(formData.phoneNumber, otp);

      if (response.success) {
        setShowOTPModal(false);
        Alert.alert("Success!", "OTP verified successfully!", [
          {
            text: "OK",
            onPress: () => {
              // Clear form
              setFormData({ name: "", email: "", phoneNumber: "" });
              setOtp("");
              // Navigate to next screen
              router.replace("/(tabs)/dashboard");
            },
          },
        ]);
      } else {
        Alert.alert("Error", response.error || "Invalid OTP");
      }
    } catch (error: any) {
      console.error("OTP Verification Error:", error);
      Alert.alert("Error", error.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    try {
      const response = await authAPI.resendOTP(formData.phoneNumber);

      if (response.success) {
        Alert.alert(
          "OTP Resent",
          "A new OTP has been sent to your phone number"
        );
      } else {
        Alert.alert("Error", response.error || "Failed to resend OTP");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const renderLogo = () => (
    <Svg width="120" height="120" viewBox="0 0 120 120">
      <Circle cx="60" cy="60" r="50" fill="#e34c00" opacity="0.2" />
      <Circle cx="60" cy="60" r="35" fill="#e34c00" opacity="0.4" />
      <Circle cx="60" cy="60" r="20" fill="#e34c00" />
      <G>
        <SvgText
          x="60"
          y="65"
          fontSize="16"
          fill="#FFFFFF"
          fontWeight="bold"
          textAnchor="middle"
        >
          Li
        </SvgText>
      </G>
    </Svg>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#A0AEC0" />
          </TouchableOpacity>
        </View>

        {/* Logo & Branding */}
        <View style={styles.logoContainer}>
          {renderLogo()}
          <Text style={styles.brandTitle}>LisstIn</Text>
          <Text style={styles.brandSubtitle}>
            {isLogin ? "Welcome back!" : "Join the financial revolution"}
          </Text>
          <Text style={styles.brandDescription}>
            {isLogin
              ? "Enter your phone number to sign in"
              : "Start categorizing your expenses with AI"}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Toggle Login/Signup */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, isLogin && styles.activeToggle]}
              onPress={() => setIsLogin(true)}
            >
              <Text
                style={[styles.toggleText, isLogin && styles.activeToggleText]}
              >
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, !isLogin && styles.activeToggle]}
              onPress={() => setIsLogin(false)}
            >
              <Text
                style={[styles.toggleText, !isLogin && styles.activeToggleText]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            {!isLogin && (
              <>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your full name"
                    placeholderTextColor="#6B7280"
                    value={formData.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor="#6B7280"
                    value={formData.email}
                    onChangeText={(text) => handleInputChange("email", text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </>
            )}

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.phoneContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={[styles.textInput, styles.phoneInput]}
                  placeholder="Enter 10-digit mobile number"
                  placeholderTextColor="#6B7280"
                  value={formData.phoneNumber}
                  onChangeText={(text) =>
                    handleInputChange(
                      "phoneNumber",
                      text.replace(/[^0-9]/g, "")
                    )
                  }
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.authButton, loading && styles.authButtonDisabled]}
            onPress={submitUserData}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.authButtonText}>Send OTP</Text>
            )}
          </TouchableOpacity>

          {/* Terms & Privacy */}
          {!isLogin && (
            <Text style={styles.termsText}>
              By creating an account, you agree to our{" "}
              <Text style={styles.linkText}>Terms of Service</Text> and{" "}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          )}
        </View>
      </ScrollView>

      {/* OTP Modal */}
      <Modal
        visible={showOTPModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowOTPModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <Text style={styles.modalSubtitle}>
              We've sent a 6-digit code to +91{formData.phoneNumber}
            </Text>

            <TextInput
              style={styles.otpInput}
              placeholder="Enter 6-digit OTP"
              placeholderTextColor="#6B7280"
              value={otp}
              onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              maxLength={6}
              autoFocus={true}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.verifyButton]}
                onPress={verifyOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.verifyButtonText}>Verify OTP</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.resendButton]}
                onPress={resendOTP}
                disabled={loading}
              >
                <Text style={styles.resendButtonText}>Resend OTP</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowOTPModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Updated styles with OTP modal styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1419",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A202C",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#e34c00",
    marginTop: 16,
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 18,
    color: "#CBD5E0",
    marginTop: 8,
    fontWeight: "500",
  },
  brandDescription: {
    fontSize: 14,
    color: "#A0AEC0",
    marginTop: 4,
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    paddingTop: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#1A202C",
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: "#e34c00",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#A0AEC0",
  },
  activeToggleText: {
    color: "#FFFFFF",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#CBD5E0",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#1A202C",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#2D3748",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryCode: {
    backgroundColor: "#1A202C",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#2D3748",
    marginRight: 8,
    minWidth: 60,
    textAlign: "center",
  },
  phoneInput: {
    flex: 1,
  },
  authButton: {
    backgroundColor: "#e34c00",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 32,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  authButtonDisabled: {
    backgroundColor: "#2D3748",
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  termsText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  linkText: {
    color: "#e34c00",
    fontWeight: "500",
  },
  // OTP Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1A202C",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#A0AEC0",
    textAlign: "center",
    marginBottom: 24,
  },
  otpInput: {
    backgroundColor: "#0F1419",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#2D3748",
    textAlign: "center",
    letterSpacing: 4,
    marginBottom: 24,
  },
  modalButtons: {
    gap: 12,
  },
  modalButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  verifyButton: {
    backgroundColor: "#e34c00",
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  resendButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e34c00",
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e34c00",
  },
  cancelButton: {
    backgroundColor: "transparent",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#A0AEC0",
  },
});

export default AuthScreen;
