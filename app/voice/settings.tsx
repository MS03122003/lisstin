import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const VoiceSettings = () => {
  const router = useRouter();
  
  // Voice settings state
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoProcessing, setAutoProcessing] = useState(true);
  const [saveTranscriptions, setSaveTranscriptions] = useState(true);
  const [voiceToText, setVoiceToText] = useState(true);
  const [smartSuggestions, setSmartSuggestions] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  
  // Audio settings
  const [microphoneGain, setMicrophoneGain] = useState('medium');
  const [noiseReduction, setNoiseReduction] = useState(true);
  const [speakerPhone, setSpeakerPhone] = useState(false);
  const [audioQuality, setAudioQuality] = useState('high');
  
  // Privacy settings
  const [dataEncryption, setDataEncryption] = useState(true);
  const [autoDelete, setAutoDelete] = useState(false);
  const [cloudSync, setCloudSync] = useState(true);
  const [anonymousAnalytics, setAnonymousAnalytics] = useState(true);

  // Language and AI settings
  const [language, setLanguage] = useState('english');
  const [aiModel, setAiModel] = useState('advanced');
  const [confidenceThreshold, setConfidenceThreshold] = useState('medium');

  const handleTestMicrophone = () => {
    Alert.alert(
      'Microphone Test',
      'Starting microphone test... Speak for 5 seconds.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Test', onPress: () => {
          // Simulate microphone test
          setTimeout(() => {
            Alert.alert('Test Complete', 'Microphone is working properly! Audio quality: Good');
          }, 3000);
        }}
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Voice History',
      'This will permanently delete all your voice recordings and transcriptions. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('History Cleared', 'All voice history has been deleted.');
          }
        }
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all voice settings to their default values.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            // Reset all settings to defaults
            setVoiceEnabled(true);
            setAutoProcessing(true);
            setSaveTranscriptions(true);
            setVoiceToText(true);
            setSmartSuggestions(true);
            setOfflineMode(false);
            setMicrophoneGain('medium');
            setNoiseReduction(true);
            setSpeakerPhone(false);
            setAudioQuality('high');
            setDataEncryption(true);
            setAutoDelete(false);
            setCloudSync(true);
            setAnonymousAnalytics(true);
            setLanguage('english');
            setAiModel('advanced');
            setConfidenceThreshold('medium');
            
            Alert.alert('Settings Reset', 'All settings have been reset to defaults.');
          }
        }
      ]
    );
  };

  const renderSettingSection = (title: string, children: React.ReactNode) => (
    <View style={styles.settingSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const renderToggleSetting = (
    title: string,
    description: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    icon?: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        {icon && (
          <View style={styles.settingIcon}>
            <Ionicons name={icon as any} size={20} color="#CBD5E0" />
          </View>
        )}
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#2D3748', true: '#e34c00' }}
        thumbColor={value ? '#FFFFFF' : '#CBD5E0'}
      />
    </View>
  );

  const renderSelectSetting = (
    title: string,
    description: string,
    value: string,
    options: { label: string; value: string }[],
    onValueChange: (value: string) => void,
    icon?: string
  ) => (
    <TouchableOpacity style={styles.settingItem}>
      <View style={styles.settingLeft}>
        {icon && (
          <View style={styles.settingIcon}>
            <Ionicons name={icon as any} size={20} color="#CBD5E0" />
          </View>
        )}
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
          <Text style={styles.settingValue}>
            Current: {options.find(opt => opt.value === value)?.label || value}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
    </TouchableOpacity>
  );

  const renderActionSetting = (
    title: string,
    description: string,
    onPress: () => void,
    icon?: string,
    color?: string
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        {icon && (
          <View style={[styles.settingIcon, color && { backgroundColor: color }]}>
            <Ionicons name={icon as any} size={20} color={color ? '#FFFFFF' : '#CBD5E0'} />
          </View>
        )}
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, color && { color }]}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#CBD5E0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voice Settings</Text>
        <TouchableOpacity onPress={handleResetSettings}>
          <Ionicons name="refresh-outline" size={24} color="#CBD5E0" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Core Voice Features */}
        {renderSettingSection('Voice Features', (
          <>
            {renderToggleSetting(
              'Voice Recognition',
              'Enable voice input for expenses and notes',
              voiceEnabled,
              setVoiceEnabled,
              'mic-outline'
            )}
            
            {renderToggleSetting(
              'Auto Processing',
              'Automatically process and categorize voice inputs',
              autoProcessing,
              setAutoProcessing,
              'cog-outline'
            )}
            
            {renderToggleSetting(
              'Save Transcriptions',
              'Keep text versions of your voice recordings',
              saveTranscriptions,
              setSaveTranscriptions,
              'document-text-outline'
            )}
            
            {renderToggleSetting(
              'Voice to Text',
              'Convert voice recordings to text automatically',
              voiceToText,
              setVoiceToText,
              'chatbubble-outline'
            )}
            
            {renderToggleSetting(
              'Smart Suggestions',
              'Get AI-powered suggestions during voice input',
              smartSuggestions,
              setSmartSuggestions,
              'bulb-outline'
            )}
            
            {renderToggleSetting(
              'Offline Mode',
              'Enable basic voice features without internet',
              offlineMode,
              setOfflineMode,
              'cloud-offline-outline'
            )}
          </>
        ))}

        {/* Audio Settings */}
        {renderSettingSection('Audio Settings', (
          <>
            {renderSelectSetting(
              'Microphone Sensitivity',
              'Adjust microphone input sensitivity',
              microphoneGain,
              [
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' }
              ],
              setMicrophoneGain,
              'mic-outline'
            )}
            
            {renderToggleSetting(
              'Noise Reduction',
              'Reduce background noise during recording',
              noiseReduction,
              setNoiseReduction,
              'volume-off-outline'
            )}
            
            {renderToggleSetting(
              'Speaker Phone Default',
              'Use speaker phone for voice calls by default',
              speakerPhone,
              setSpeakerPhone,
              'volume-high-outline'
            )}
            
            {renderSelectSetting(
              'Audio Quality',
              'Recording quality for voice inputs',
              audioQuality,
              [
                { label: 'Standard', value: 'standard' },
                { label: 'High', value: 'high' },
                { label: 'Ultra', value: 'ultra' }
              ],
              setAudioQuality,
              'musical-notes-outline'
            )}
            
            {renderActionSetting(
              'Test Microphone',
              'Check if your microphone is working properly',
              handleTestMicrophone,
              'checkmark-circle-outline',
              '#e34c00'
            )}
          </>
        ))}

        {/* Language & AI */}
        {renderSettingSection('Language & AI', (
          <>
            {renderSelectSetting(
              'Language',
              'Voice recognition and processing language',
              language,
              [
                { label: 'English', value: 'english' },
                { label: 'Hindi', value: 'hindi' },
                { label: 'Tamil', value: 'tamil' }
              ],
              setLanguage,
              'language-outline'
            )}
            
            {renderSelectSetting(
              'AI Model',
              'AI processing model for voice recognition',
              aiModel,
              [
                { label: 'Basic', value: 'basic' },
                { label: 'Standard', value: 'standard' },
                { label: 'Advanced', value: 'advanced' }
              ],
              setAiModel,
              'brain-outline'
            )}
            
            {renderSelectSetting(
              'Confidence Threshold',
              'Minimum confidence for AI processing',
              confidenceThreshold,
              [
                { label: 'Low (70%)', value: 'low' },
                { label: 'Medium (85%)', value: 'medium' },
                { label: 'High (95%)', value: 'high' }
              ],
              setConfidenceThreshold,
              'shield-checkmark-outline'
            )}
          </>
        ))}

        {/* Privacy & Security */}
        {renderSettingSection('Privacy & Security', (
          <>
            {renderToggleSetting(
              'Data Encryption',
              'Encrypt voice data and transcriptions',
              dataEncryption,
              setDataEncryption,
              'lock-closed-outline'
            )}
            
            {renderToggleSetting(
              'Auto Delete',
              'Automatically delete voice recordings after 30 days',
              autoDelete,
              setAutoDelete,
              'trash-outline'
            )}
            
            {renderToggleSetting(
              'Cloud Sync',
              'Sync voice data across your devices',
              cloudSync,
              setCloudSync,
              'cloud-outline'
            )}
            
            {renderToggleSetting(
              'Anonymous Analytics',
              'Help improve voice features with anonymous usage data',
              anonymousAnalytics,
              setAnonymousAnalytics,
              'analytics-outline'
            )}
          </>
        ))}

        {/* Data Management */}
        {renderSettingSection('Data Management', (
          <>
            {renderActionSetting(
              'Clear Voice History',
              'Delete all voice recordings and transcriptions',
              handleClearHistory,
              'trash-outline',
              '#FF6B6B'
            )}
            
            {renderActionSetting(
              'Export Voice Data',
              'Download your voice data and transcriptions',
              () => Alert.alert('Export Started', 'Your voice data export will be ready shortly.'),
              'download-outline',
              '#e34c00'
            )}
            
            {renderActionSetting(
              'Voice Usage Statistics',
              'View detailed statistics about your voice usage',
              () => router.push('/voice/stats'),
              'bar-chart-outline'
            )}
          </>
        ))}

        {/* Help & Support */}
        {renderSettingSection('Help & Support', (
          <>
            {renderActionSetting(
              'Voice Setup Guide',
              'Learn how to optimize voice features',
              () => router.push('/help/voice-setup'),
              'help-circle-outline'
            )}
            
            {renderActionSetting(
              'Troubleshooting',
              'Fix common voice recognition issues',
              () => router.push('/help/voice-troubleshooting'),
              'construct-outline'
            )}
            
            {renderActionSetting(
              'Report Voice Issue',
              'Report problems with voice recognition',
              () => Alert.alert('Report Issue', 'Voice issue reporting form will open.'),
              'bug-outline'
            )}
          </>
        ))}

        {/* App Information */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>Voice Engine Version</Text>
          <Text style={styles.appInfoValue}>LisstIn Voice AI v2.1.0</Text>
          <Text style={styles.appInfoDescription}>
            Powered by advanced machine learning models for accurate voice recognition and financial data extraction.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1419',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  settingSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionContent: {
    backgroundColor: '#1A202C',
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D3748',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    lineHeight: 18,
  },
  settingValue: {
    fontSize: 12,
    color: '#e34c00',
    marginTop: 4,
    fontWeight: '500',
  },
  appInfo: {
    backgroundColor: '#1A202C',
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2D3748',
    alignItems: 'center',
  },
  appInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  appInfoValue: {
    fontSize: 14,
    color: '#e34c00',
    fontWeight: '500',
    marginBottom: 12,
  },
  appInfoDescription: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default VoiceSettings;
