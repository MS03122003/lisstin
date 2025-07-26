import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const VoiceRecord = () => {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'processing' | 'completed'>('idle');
  const [transcription, setTranscription] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
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
  }, [isRecording, pulseAnim, waveAnim]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingState('recording');
    setRecordingDuration(0);
    setTranscription('');
    setExtractedData(null);
    
    // Simulate recording start
    console.log('Started voice recording');
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingState('processing');
    
    // Simulate processing
    setTimeout(() => {
      const mockTranscription = "I spent three hundred and fifty rupees on coffee and pastry at Starbucks this morning";
      const mockExtractedData = {
        amount: 350,
        description: "Coffee and pastry at Starbucks",
        suggestedCategory: "wants",
        confidence: 92,
        time: "this morning"
      };
      
      setTranscription(mockTranscription);
      setExtractedData(mockExtractedData);
      setRecordingState('completed');
    }, 2000);
  };

  const handleSaveExpense = () => {
    if (extractedData) {
      // Navigate to add expense with pre-filled data
      router.push({
        pathname: '/expense/add',
        params: {
          amount: extractedData.amount.toString(),
          description: extractedData.description,
          category: extractedData.suggestedCategory,
          voiceProcessed: 'true'
        }
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderVoiceWaves = () => {
    const waves = Array.from({ length: 5 }, (_, i) => i);
    
    return (
      <Svg width="200" height="100" viewBox="0 0 200 100">
        {waves.map((wave, index) => {
          const animatedHeight = waveAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [10, 40 + index * 5],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View key={wave}>
              <Path
                d={`M ${40 + index * 30} 50 L ${40 + index * 30} ${50 - 20} L ${40 + index * 30} ${50 + 20} Z`}
                fill="#e34c00"
                opacity={0.8 - index * 0.1}
              />
            </Animated.View>
          );
        })}
      </Svg>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#CBD5E0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voice Expense Log</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Recording State Display */}
        <View style={styles.stateContainer}>
          <Text style={styles.stateTitle}>
            {recordingState === 'idle' && 'Ready to Listen'}
            {recordingState === 'recording' && 'Recording...'}
            {recordingState === 'processing' && 'Processing...'}
            {recordingState === 'completed' && 'Analysis Complete'}
          </Text>
          
          {recordingState === 'recording' && (
            <Text style={styles.recordingDuration}>{formatDuration(recordingDuration)}</Text>
          )}
          
          <Text style={styles.stateDescription}>
            {recordingState === 'idle' && 'Tap the microphone and describe your expense naturally'}
            {recordingState === 'recording' && 'Speak clearly about what you spent and how much'}
            {recordingState === 'processing' && 'Analyzing your voice input with AI...'}
            {recordingState === 'completed' && 'Your expense has been processed successfully'}
          </Text>
        </View>

        {/* Voice Visualizer */}
        <View style={styles.visualizerContainer}>
          {(recordingState === 'recording' || recordingState === 'processing') && renderVoiceWaves()}
          
          {/* Main Recording Button */}
          <Animated.View style={[
            styles.recordingButtonContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}>
            <TouchableOpacity
              style={[
                styles.recordingButton,
                {
                  backgroundColor: 
                    recordingState === 'recording' ? '#FF6B6B' :
                    recordingState === 'processing' ? '#FFD700' :
                    recordingState === 'completed' ? '#e34c00' : '#e34c00'
                }
              ]}
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

        {/* Transcription Display */}
        {transcription && (
          <View style={styles.transcriptionContainer}>
            <Text style={styles.transcriptionTitle}>What you said:</Text>
            <View style={styles.transcriptionBox}>
              <Text style={styles.transcriptionText}>"{transcription}"</Text>
            </View>
          </View>
        )}

        {/* Extracted Data Display */}
        {extractedData && (
          <View style={styles.extractedDataContainer}>
            <Text style={styles.extractedDataTitle}>AI Analysis:</Text>
            <View style={styles.extractedDataBox}>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Amount:</Text>
                <Text style={styles.dataValue}>₹{extractedData.amount}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Description:</Text>
                <Text style={styles.dataValue}>{extractedData.description}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Category:</Text>
                <View style={styles.categoryChip}>
                  <Text style={styles.categoryText}>{extractedData.suggestedCategory}</Text>
                </View>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Confidence:</Text>
                <Text style={styles.confidenceValue}>{extractedData.confidence}%</Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {recordingState === 'completed' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveExpense}>
              <Text style={styles.saveButtonText}>Save Expense</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => {
                setRecordingState('idle');
                setTranscription('');
                setExtractedData(null);
                setRecordingDuration(0);
              }}
            >
              <Ionicons name="refresh" size={20} color="#6B7280" />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Voice Input Tips:</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#e34c00" />
              <Text style={styles.tipText}>Speak clearly and at normal pace</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#e34c00" />
              <Text style={styles.tipText}>Include the amount and what you bought</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#e34c00" />
              <Text style={styles.tipText}>Mention the store or context if relevant</Text>
            </View>
          </View>
        </View>
      </View>
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
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stateContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  stateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  recordingDuration: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e34c00',
    marginBottom: 8,
  },
  stateDescription: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  visualizerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginBottom: 40,
  },
  recordingButtonContainer: {
    position: 'absolute',
  },
  recordingButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  transcriptionContainer: {
    marginBottom: 24,
  },
  transcriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  transcriptionBox: {
    backgroundColor: '#1A202C',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  transcriptionText: {
    fontSize: 14,
    color: '#CBD5E0',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  extractedDataContainer: {
    marginBottom: 32,
  },
  extractedDataTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  extractedDataBox: {
    backgroundColor: '#1A202C',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2D3748',
    gap: 12,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 14,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  dataValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  categoryChip: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  confidenceValue: {
    fontSize: 14,
    color: '#e34c00',
    fontWeight: '600',
  },
  actionButtons: {
    gap: 16,
    marginBottom: 32,
  },
  saveButton: {
    backgroundColor: '#e34c00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A202C',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  retryButtonText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  tipsContainer: {
    backgroundColor: '#1A202C',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    fontSize: 14,
    color: '#A0AEC0',
    marginLeft: 12,
  },
});

export default VoiceRecord;
