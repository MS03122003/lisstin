import { Ionicons } from '@expo/vector-icons';
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

const VoiceAI = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [currentMode, setCurrentMode] = useState<'idle' | 'recording' | 'calling'>('idle');
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  // Sample conversation history
  const [conversationHistory] = useState([
    {
      id: 1,
      type: 'user',
      message: 'I spent ₹2000 on groceries today',
      timestamp: '2:30 PM',
    },
    {
      id: 2,
      type: 'ai',
      message: 'Great! I\'ve categorized that as "Needs" since groceries are essential. Your monthly grocery budget is looking healthy at 60% utilized.',
      timestamp: '2:31 PM',
    },
    {
      id: 3,
      type: 'user',
      message: 'Should I invest in mutual funds?',
      timestamp: '2:32 PM',
    },
    {
      id: 4,
      type: 'ai',
      message: 'Based on your spending pattern, you have good savings potential. Mutual funds are great for long-term goals. Would you like me to explain SIP investments?',
      timestamp: '2:33 PM',
    },
  ]);

  const [quickQuestions] = useState([
    'How much should I save monthly?',
    'Analyze my spending pattern',
    'Help me set a budget',
    'Investment advice for beginners',
    'How to reduce unnecessary expenses?',
    'Emergency fund planning',
  ]);

  useEffect(() => {
    if (currentMode === 'recording' || currentMode === 'calling') {
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Wave animation
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
  }, [currentMode, pulseAnim, waveAnim]);

  const handleVoiceRecording = () => {
    if (currentMode === 'idle') {
      setCurrentMode('recording');
      setIsRecording(true);
      // Start voice recording logic here
      console.log('Started voice recording');
      
      // Simulate recording for 3 seconds
      setTimeout(() => {
        setCurrentMode('idle');
        setIsRecording(false);
        Alert.alert('Voice Note Recorded', 'Your expense has been logged successfully!');
      }, 3000);
    } else if (currentMode === 'recording') {
      setCurrentMode('idle');
      setIsRecording(false);
      console.log('Stopped voice recording');
    }
  };

  const handleVoiceCall = () => {
    if (currentMode === 'idle') {
      setCurrentMode('calling');
      setIsConnected(true);
      setCallDuration(0);
      
      // Start call timer
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // Simulate call for demo
      setTimeout(() => {
        setCurrentMode('idle');
        setIsConnected(false);
        setCallDuration(0);
        clearInterval(timer);
        Alert.alert('Call Ended', 'Thanks for the great conversation! Your insights have been saved.');
      }, 10000);
      
      console.log('Started voice call');
    } else if (currentMode === 'calling') {
      setCurrentMode('idle');
      setIsConnected(false);
      setCallDuration(0);
      console.log('Ended voice call');
    }
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderVoiceVisualizer = () => {
    const waves = [1, 2, 3, 4, 5];
    
    return (
      <Svg width="200" height="100" viewBox="0 0 200 100">
        {waves.map((wave, index) => {
          const animatedOpacity = waveAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
            extrapolate: 'clamp',
          });

          const delay = index * 0.2;
          const animatedHeight = waveAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [20, 60, 20],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View key={wave} style={{ opacity: animatedOpacity }}>
              <Path
                d={`M ${30 + index * 30} 50 L ${30 + index * 30} ${50 - (20 + index * 5)} L ${30 + index * 30} ${50 + (20 + index * 5)} Z`}
                fill="#e34c00"
                opacity={0.7 - index * 0.1}
              />
            </Animated.View>
          );
        })}
      </Svg>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Status Header */}
        <View style={styles.statusHeader}>
          <View style={styles.statusIndicator}>
            <View style={[
              styles.statusDot,
              { backgroundColor: currentMode === 'idle' ? '#6B7280' : '#e34c00' }
            ]} />
            <Text style={styles.statusText}>
              {currentMode === 'idle' && 'Ready to Listen'}
              {currentMode === 'recording' && 'Recording...'}
              {currentMode === 'calling' && `In Call • ${formatCallDuration(callDuration)}`}
            </Text>
          </View>
          <TouchableOpacity style={styles.historyButton}>
            <Ionicons name="time-outline" size={20} color="#CBD5E0" />
          </TouchableOpacity>
        </View>

        {/* Voice Control Center */}
        <View style={styles.voiceControlCenter}>
          <Text style={styles.centerTitle}>AI Financial Counselor</Text>
          <Text style={styles.centerSubtitle}>
            {currentMode === 'idle' && 'Tap to start voice interaction'}
            {currentMode === 'recording' && 'Listening to your expense...'}
            {currentMode === 'calling' && 'Connected with your AI counselor'}
          </Text>

          {/* Voice Visualizer */}
          <View style={styles.visualizerContainer}>
            {(currentMode === 'recording' || currentMode === 'calling') && renderVoiceVisualizer()}
            
            {/* Main Voice Button */}
            <Animated.View style={[
              styles.mainVoiceButton,
              { transform: [{ scale: pulseAnim }] }
            ]}>
              <TouchableOpacity
                style={[
                  styles.voiceButton,
                  {
                    backgroundColor: currentMode === 'recording' ? '#FF6B6B' : 
                                   currentMode === 'calling' ? '#FFD700' : '#e34c00'
                  }
                ]}
                onPress={currentMode === 'calling' ? handleVoiceCall : handleVoiceRecording}
              >
                <Ionicons 
                  name={
                    currentMode === 'recording' ? 'stop' :
                    currentMode === 'calling' ? 'call' : 'mic'
                  } 
                  size={32} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, { opacity: currentMode !== 'idle' ? 0.5 : 1 }]}
              onPress={handleVoiceRecording}
              disabled={currentMode !== 'idle'}
            >
              <Ionicons name="mic-circle-outline" size={24} color="#e34c00" />
              <Text style={styles.actionButtonText}>Voice Log</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, { opacity: currentMode !== 'idle' ? 0.5 : 1 }]}
              onPress={handleVoiceCall}
              disabled={currentMode !== 'idle'}
            >
              <Ionicons name="call-outline" size={24} color="#FF6B6B" />
              <Text style={styles.actionButtonText}>AI Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Questions */}
        <View style={styles.quickQuestionsContainer}>
          <Text style={styles.sectionTitle}>Quick Questions</Text>
          <Text style={styles.sectionSubtitle}>Tap to ask common financial questions</Text>
          
          <View style={styles.questionsGrid}>
            {quickQuestions.map((question, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.questionCard}
                onPress={() => {
                  Alert.alert('Question Selected', `"${question}" - This would start a voice conversation with the AI.`);
                }}
              >
                <Text style={styles.questionText}>{question}</Text>
                <Ionicons name="chevron-forward" size={16} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Conversations */}
        <View style={styles.conversationsContainer}>
          <View style={styles.conversationsHeader}>
            <Text style={styles.sectionTitle}>Recent Conversations</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.conversationCard}>
            {conversationHistory.map((message) => (
              <View key={message.id} style={[
                styles.messageContainer,
                { alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start' }
              ]}>
                <View style={[
                  styles.messageBubble,
                  {
                    backgroundColor: message.type === 'user' ? '#e34c00' : '#1A202C',
                    borderColor: message.type === 'user' ? '#e34c00' : '#2D3748',
                  }
                ]}>
                  <Text style={[
                    styles.messageText,
                    { color: message.type === 'user' ? '#FFFFFF' : '#CBD5E0' }
                  ]}>
                    {message.message}
                  </Text>
                  <Text style={[
                    styles.messageTime,
                    { color: message.type === 'user' ? '#E0F2F1' : '#6B7280' }
                  ]}>
                    {message.timestamp}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* AI Capabilities */}
        <View style={styles.capabilitiesContainer}>
          <Text style={styles.sectionTitle}>What I Can Help With</Text>
          
          <View style={styles.capabilitiesGrid}>
            <View style={styles.capabilityCard}>
              <Ionicons name="analytics-outline" size={24} color="#e34c00" />
              <Text style={styles.capabilityTitle}>Expense Analysis</Text>
              <Text style={styles.capabilityDescription}>
                Analyze spending patterns and categorize expenses automatically
              </Text>
            </View>

            <View style={styles.capabilityCard}>
              <Ionicons name="trending-up-outline" size={24} color="#FFD700" />
              <Text style={styles.capabilityTitle}>Investment Advice</Text>
              <Text style={styles.capabilityDescription}>
                Get personalized investment recommendations based on your profile
              </Text>
            </View>

            <View style={styles.capabilityCard}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#45B7D1" />
              <Text style={styles.capabilityTitle}>Budget Planning</Text>
              <Text style={styles.capabilityDescription}>
                Create and manage budgets using the Wants-Needs-Desires framework
              </Text>
            </View>

            <View style={styles.capabilityCard}>
              <Ionicons name="school-outline" size={24} color="#FF6B6B" />
              <Text style={styles.capabilityTitle}>Financial Education</Text>
              <Text style={styles.capabilityDescription}>
                Learn financial concepts through interactive conversations
              </Text>
            </View>
          </View>
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
  scrollView: {
    flex: 1,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#CBD5E0',
    fontWeight: '500',
  },
  historyButton: {
    padding: 8,
  },
  voiceControlCenter: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  centerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  centerSubtitle: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 32,
  },
  visualizerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    height: 120,
    justifyContent: 'center',
  },
  mainVoiceButton: {
    position: 'absolute',
  },
  voiceButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#CBD5E0',
    marginTop: 4,
    fontWeight: '500',
  },
  quickQuestionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 16,
  },
  questionsGrid: {
    gap: 8,
  },
  questionCard: {
    backgroundColor: '#1A202C',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  questionText: {
    fontSize: 14,
    color: '#CBD5E0',
    flex: 1,
    fontWeight: '500',
  },
  conversationsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  conversationsHeader: {
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
  conversationCard: {
    backgroundColor: '#1A202C',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  capabilitiesContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  capabilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  capabilityCard: {
    backgroundColor: '#1A202C',
    padding: 16,
    borderRadius: 12,
    width: '47%',
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  capabilityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  capabilityDescription: {
    fontSize: 12,
    color: '#A0AEC0',
    lineHeight: 16,
  },
});

export default VoiceAI;
