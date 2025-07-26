import { Ionicons } from '@expo/vector-icons';
import React, { memo, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface OTPModalProps {
  visible: boolean;
  phoneNumber: string;
  loading: boolean;
  onVerify: (code: string) => void;
  onResend: () => void;
  onClose: () => void;
}

const OTPModal: React.FC<OTPModalProps> = memo(
  ({ visible, phoneNumber, loading, onVerify, onResend, onClose }) => {
    const [code, setCode] = useState('');

    // Clear the input when the modal is closed
    useEffect(() => {
      if (!visible) setCode('');
    }, [visible]);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enter OTP</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="#A0AEC0" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Enter the 6-digit code sent to {phoneNumber}
            </Text>

            <TextInput
              style={styles.otpInput}
              placeholder="Enter 6-digit OTP"
              placeholderTextColor="#6B7280"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              textAlign="center"
            />

            <TouchableOpacity
              style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
              onPress={() => onVerify(code)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.verifyButtonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={onResend}
              disabled={loading}
            >
              <Text style={styles.resendButtonText}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
);

OTPModal.displayName = 'OTPModal';

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1A202C',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  otpInput: {
    backgroundColor: '#0F1419',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 24,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2D3748',
    marginBottom: 24,
    letterSpacing: 8,
  },
  verifyButton: {
    backgroundColor: '#e34c00',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyButtonDisabled: {
    backgroundColor: '#2D3748',
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  resendButtonText: {
    fontSize: 14,
    color: '#e34c00',
    fontWeight: '500',
  },
});

export default OTPModal;
