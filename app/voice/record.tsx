import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const VoiceRecord = () => {
  const router = useRouter();
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'processing' | 'completed'>('idle');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [recordingType, setRecordingType] = useState<'expense' | 'income' | 'note'>('expense');

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  const recordingTypes = [
    {
      id: 'expense',
      title: 'Log Expense',
      description: 'Record what you spent money on',
      icon: 'trending-down',
      color: '#FF6B6B',
      examples: ['I spent ₹300 on coffee at Starbucks', 'Bought groceries for ₹2500']
    },
    {
      id: 'income',
      title: 'Log Income',
      description: 'Record money you received',
      icon: 'trending-up',
      color: '#e34c00',
      examples: ['Received salary of ₹25000', 'Got ₹500 from freelance work']
    },
    {
      id: 'note',
      title: 'Financial Note',
      description: 'Record thoughts or observations',
      icon: 'mic',
      color: '#FFD700',
      examples: ['Need to reduce dining out expenses', 'Planning to invest in mutual funds']
    }
  ];

  const [recentRecordings] = useState([
    {
      id: 1,
      type: 'expense',
      transcription: 'I spent three hundred rupees on coffee and pastry at Café Coffee Day',
      extractedData: { amount: 300, description: 'Coffee and pastry at CCD', category: 'wants' },
      timestamp: '2025-01-24 14:30',
      processed: true,
    },
    {
      id: 2,
      type: 'income',
      transcription: 'Received freelance payment of five thousand rupees',
      extractedData: { amount: 5000, description: 'Freelance payment', category: 'income' },
      timestamp: '2025-01-24 10:15',
      processed: true,
    },
    {
      id: 3,
      type: 'note',
      transcription: 'I need to start saving more for my emergency fund',
      extractedData: { note: 'Emergency fund savings goal', category: 'planning' },
      timestamp: '2025-01-23 18:45',
      processed: true,
    },
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (recordingState === 'recording') {
      timer = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // Start animations
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      pulseAnim.setValue(1);
      waveAnim.setValue(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [recordingState, pulseAnim, waveAnim]);

  const startRecording = () => {
    setRecordingState('recording');
    setRecordingDuration(0);
    setTranscription('');
    setExtractedData(null);
    console.log('Started recording:', recordingType);
  };

  const stopRecording = () => {
    setRecordingState('processing');
    
    // Simulate processing delay
    setTimeout(() => {
      processRecording();
    }, 2000);
  };

  const processRecording = () => {
    // Simulate AI processing based on recording type
    let mockTranscription = '';
    let mockExtractedData = null;

    switch (recordingType) {
      case 'expense':
        mockTranscription = "I spent two hundred and fifty rupees on lunch at McDonald's today";
        mockExtractedData = {
          amount: 250,
          description: "Lunch at McDonald's",
          category: 'wants',
          confidence: 94,
          date: new Date().toISOString().split('T')[0]
        };
        break;
      case 'income':
        mockTranscription = "I received three thousand rupees as a bonus from work";
        mockExtractedData = {
          amount: 3000,
          description: "Work bonus",
          category: 'income',
          confidence: 97,
          date: new Date().toISOString().split('T')[0]
        };
        break;
      case 'note':
        mockTranscription = "I should start tracking my daily coffee expenses more carefully";
        mockExtractedData = {
          note: "Track daily coffee expenses",
          category: 'planning',
          confidence: 92,
          date: new Date().toISOString().split('T')[0],
          actionItems: ['Set coffee budget', 'Track daily coffee purchases']
        };
        break;
    }

    setTranscription(mockTranscription);
    setExtractedData(mockExtractedData);
    setRecordingState('completed');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    if (extractedData) {
      console.log('Saving recording:', extractedData);
      Alert.alert(
        'Saved Successfully',
        `Your ${recordingType} has been processed and saved to your account.`,
        [
          { text: 'Add Another', onPress: resetRecording },
          { text: 'View Details', onPress: () => router.push('/(tabs)/expenses') },
          { text: 'Done', onPress: () => router.back() }
        ]
      );
    }
  };

  const resetRecording = () => {
    setRecordingState('idle');
    setRecordingDuration(0);
    setTranscription('');
    setExtractedData(null);
  };

  const renderVoiceWaves = () => {
    const waves = Array.from({ length: 5 }, (_, i) => i);
    
    return (
      <Svg width="200" height="100" viewBox="0 0 200 100">
        {waves.map((wave, index) => {
          const animatedOpacity = waveAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View key={wave} style={{ opacity: animatedOpacity }}>
              <Path
                d={`M ${30 + index * 30} 50 L ${30 + index * 30} ${30 - index * 3} L ${30 + index * 30} ${70 + index * 3} Z`}
                fill="#e34c00"
                opacity={0.8 - index * 0.1}
              />
            </Animated.View>
          );
        })}
      </Svg>
    );
  };

  const renderRecordingTypeSelector = () => (
    <View style={styles.typeSelectorContainer}>
      <Text style={styles.sectionTitle}>What would you like to record?</Text>
      
      {recordingTypes.map((type) => (
        <TouchableOpacity
          key={type.id}
          style={[
            styles.typeCard,
            recordingType === type.id && styles.selectedTypeCard,
            { borderColor: type.color }
          ]}
          onPress={() => setRecordingType(type.id as any)}
        >
          <View style={[styles.typeIcon, { backgroundColor: type.color }]}>
            <Ionicons name={type.icon as any} size={24} color="#FFFFFF" />
          </View>
          
          <View style={styles.typeContent}>
            <Text style={styles.typeTitle}>{type.title}</Text>
            <Text style={styles.typeDescription}>{type.description}</Text>
            
            <View style={styles.examplesContainer}>
              <Text style={styles.examplesLabel}>Examples:</Text>
              {type.examples.map((example, index) => (
                <Text key={index} style={styles.exampleText}>• {example}</Text>
              ))}
            </View>
          </View>
          
          {recordingType === type.id && (
            <View style={styles.selectedIndicator}>
              <Ionicons name="checkmark-circle" size={24} color={type.color} />
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderRecordingInterface = () => (
    <View style={styles.recordingInterface}>
      <View style={styles.recordingHeader}>
        <Text style={styles.recordingTitle}>
          {recordingState === 'recording' && 'Recording...'}
          {recordingState === 'processing' && 'Processing...'}
          {recordingState === 'completed' && 'Recording Complete'}
        </Text>
        
        {recordingState === 'recording' && (
          <Text style={styles.recordingDuration}>{formatDuration(recordingDuration)}</Text>
        )}
      </View>

      <View style={styles.visualizerContainer}>
        {(recordingState === 'recording' || recordingState === 'processing') && renderVoiceWaves()}
        
        <Animated.View style={[
          styles.recordButton,
          { 
            transform: [{ scale: pulseAnim }],
            backgroundColor: recordingState === 'recording' ? '#FF6B6B' : 
                            recordingState === 'processing' ? '#FFD700' : '#e34c00'
          }
        ]}>
          <TouchableOpacity
            style={styles.recordButtonTouch}
            onPress={recordingState === 'recording' ? stopRecording : startRecording}
            disabled={recordingState === 'processing'}
          >
            <Ionicons 
              name={
                recordingState === 'recording' ? 'stop' :
                recordingState === 'processing' ? 'hourglass' :
                recordingState === 'completed' ? 'checkmark' : 'mic'
              } 
              size={40} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Text style={styles.recordingInstructions}>
        {recordingState === 'idle' && 'Tap the microphone and speak naturally'}
        {recordingState === 'recording' && 'Speak clearly about your financial transaction'}
        {recordingState === 'processing' && 'Analyzing your voice input with AI...'}
        {recordingState === 'completed' && 'Your recording has been processed successfully'}
      </Text>
    </View>
  );

  const renderResults = () => (
    <View style={styles.resultsContainer}>
      <Text style={styles.sectionTitle}>AI Analysis Results</Text>
      
      {/* Transcription */}
      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Ionicons name="document-text-outline" size={20} color="#e34c00" />
          <Text style={styles.resultTitle}>What you said</Text>
        </View>
        <Text style={styles.transcriptionText}>"{transcription}"</Text>
      </View>

      {/* Extracted Data */}
      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Ionicons name="analytics-outline" size={20} color="#FFD700" />
          <Text style={styles.resultTitle}>Extracted Information</Text>
        </View>
        
        {extractedData && (
          <View style={styles.extractedDataContainer}>
            {extractedData.amount && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Amount:</Text>
                <Text style={styles.dataValue}>₹{extractedData.amount}</Text>
              </View>
            )}
            
            {extractedData.description && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Description:</Text>
                <Text style={styles.dataValue}>{extractedData.description}</Text>
              </View>
            )}
            
            {extractedData.category && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Category:</Text>
                <View style={[styles.categoryChip, { 
                  backgroundColor: extractedData.category === 'wants' ? '#FF6B6B' :
                                   extractedData.category === 'needs' ? '#e34c00' :
                                   extractedData.category === 'desires' ? '#45B7D1' : '#6B7280'
                }]}>
                  <Text style={styles.categoryText}>{extractedData.category}</Text>
                </View>
              </View>
            )}

            {extractedData.note && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Note:</Text>
                <Text style={styles.dataValue}>{extractedData.note}</Text>
              </View>
            )}

            {extractedData.actionItems && (
              <View style={styles.dataColumn}>
                <Text style={styles.dataLabel}>Action Items:</Text>
                {extractedData.actionItems.map((item: string, index: number) => (
                  <Text key={index} style={styles.actionItem}>• {item}</Text>
                ))}
              </View>
            )}
            
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>AI Confidence:</Text>
              <Text style={styles.confidenceValue}>{extractedData.confidence}%</Text>
            </View>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save & Process</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.retryButton} onPress={resetRecording}>
          <Ionicons name="refresh" size={20} color="#6B7280" />
          <Text style={styles.retryButtonText}>Record Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRecentRecordings = () => (
    <View style={styles.recentContainer}>
      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>Recent Recordings</Text>
        <TouchableOpacity onPress={() => router.push('/voice/history')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {recentRecordings.slice(0, 3).map((recording) => (
        <View key={recording.id} style={styles.recentItem}>
          <View style={[
            styles.recentTypeIcon,
            { backgroundColor: recordingTypes.find(t => t.id === recording.type)?.color || '#6B7280' }
          ]}>
            <Ionicons 
              name={recordingTypes.find(t => t.id === recording.type)?.icon as any || 'mic'} 
              size={16} 
              color="#FFFFFF" 
            />
          </View>
          
          <View style={styles.recentContent}>
            <Text style={styles.recentTranscription} numberOfLines={2}>
              {recording.transcription}
            </Text>
            <Text style={styles.recentTimestamp}>{recording.timestamp}</Text>
          </View>
          
          <View style={styles.recentStatus}>
            <Ionicons name="checkmark-circle" size={16} color="#e34c00" />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#CBD5E0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voice Recording</Text>
        <TouchableOpacity onPress={() => router.push('/voice/settings')}>
          <Ionicons name="settings-outline" size={24} color="#CBD5E0" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {recordingState === 'idle' && renderRecordingTypeSelector()}
        
        {recordingState !== 'idle' && renderRecordingInterface()}
        
        {recordingState === 'completed' && renderResults()}
        
        {recordingState === 'idle' && renderRecentRecordings()}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  typeSelectorContainer: {
    padding: 20,
  },
  typeCard: {
    flexDirection: 'row',
    backgroundColor: '#1A202C',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#2D3748',
    position: 'relative',
  },
  selectedTypeCard: {
    backgroundColor: '#1A202C40',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  typeContent: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 12,
  },
  examplesContainer: {
    marginTop: 8,
  },
  examplesLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 12,
    color: '#CBD5E0',
    marginBottom: 2,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  recordingInterface: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  recordingHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  recordingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  recordingDuration: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e34c00',
  },
  visualizerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginBottom: 40,
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  recordButtonTouch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingInstructions: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  resultsContainer: {
    padding: 20,
  },
  resultCard: {
    backgroundColor: '#1A202C',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  transcriptionText: {
    fontSize: 16,
    color: '#CBD5E0',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  extractedDataContainer: {
    gap: 12,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataColumn: {
    gap: 4,
  },
  dataLabel: {
    fontSize: 14,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  dataValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actionItem: {
    fontSize: 14,
    color: '#CBD5E0',
    marginLeft: 8,
  },
  confidenceValue: {
    fontSize: 16,
    color: '#e34c00',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#e34c00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  retryButton: {
    flex: 1,
    backgroundColor: '#1A202C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  retryButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  recentContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#e34c00',
    fontWeight: '500',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  recentTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentTranscription: {
    fontSize: 14,
    color: '#CBD5E0',
    marginBottom: 4,
  },
  recentTimestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  recentStatus: {
    marginLeft: 12,
  },
});

export default VoiceRecord;
