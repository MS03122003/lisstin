import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const VoiceCounselor = () => {
  const router = useRouter();
  const [callState, setCallState] = useState<'idle' | 'connecting' | 'active' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [conversationSummary, setConversationSummary] = useState<string[]>([]);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  const counselingTopics = [
    {
      id: 'budget-help',
      title: 'Budget Planning Help',
      description: 'Get guidance on creating and managing your budget',
      icon: 'calculator-outline',
      color: '#e34c00',
    },
    {
      id: 'expense-analysis',
      title: 'Expense Analysis',
      description: 'Analyze your spending patterns and get recommendations',
      icon: 'analytics-outline',
      color: '#FFD700',
    },
    {
      id: 'saving-goals',
      title: 'Saving Goals',
      description: 'Set and achieve your financial saving objectives',
      icon: 'flag-outline',
      color: '#45B7D1',
    },
    {
      id: 'debt-management',
      title: 'Debt Management',
      description: 'Strategies for managing and reducing debt',
      icon: 'trending-down-outline',
      color: '#FF6B6B',
    },
    {
      id: 'investment-advice',
      title: 'Investment Guidance',
      description: 'Learn about investment options suitable for you',
      icon: 'trending-up-outline',
      color: '#9F7AEA',
    },
    {
      id: 'general-chat',
      title: 'General Financial Chat',
      description: 'Open discussion about any financial concerns',
      icon: 'chatbubble-outline',
      color: '#38B2AC',
    },
  ];

  const [callHistory] = useState([
    {
      id: 1,
      topic: 'Budget Planning Help',
      duration: '12:45',
      date: '2025-01-24',
      summary: 'Discussed monthly budget allocation and expense categorization',
      rating: 5,
    },
    {
      id: 2,
      topic: 'Investment Guidance',
      duration: '8:30',
      date: '2025-01-22',
      summary: 'Learned about SIP investments and risk management',
      rating: 4,
    },
    {
      id: 3,
      topic: 'Expense Analysis',
      duration: '15:20',
      date: '2025-01-20',
      summary: 'Analyzed spending patterns and identified areas for improvement',
      rating: 5,
    },
  ]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (callState === 'active') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // Start animations
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 3000,
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
  }, [callState, pulseAnim, waveAnim]);

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = (topic?: string) => {
    setCurrentTopic(topic || 'General Financial Chat');
    setCallState('connecting');
    setCallDuration(0);
    setShowTopicModal(false);

    // Simulate connection delay
    setTimeout(() => {
      setCallState('active');
      // Simulate AI greeting
      setConversationSummary([
        `Hello! I'm your LisstIn AI Financial Counselor. I understand you'd like to discuss ${topic || 'general financial matters'}. How can I help you today?`
      ]);
    }, 2000);
  };

  const handleEndCall = () => {
    setCallState('ended');
    
    // Show call summary after a brief delay
    setTimeout(() => {
      Alert.alert(
        'Call Ended',
        `Great conversation! We discussed ${currentTopic}. Your insights have been saved to your profile.`,
        [
          { text: 'Rate Call', onPress: showRatingModal },
          { text: 'View Summary', onPress: () => router.push('/voice/history') },
          { text: 'Done', onPress: resetCall }
        ]
      );
    }, 1000);
  };

  const showRatingModal = () => {
    Alert.alert(
      'Rate Your Experience',
      'How was your conversation with the AI counselor?',
      [
        { text: '⭐⭐⭐⭐⭐ Excellent', onPress: () => saveRating(5) },
        { text: '⭐⭐⭐⭐ Good', onPress: () => saveRating(4) },
        { text: '⭐⭐⭐ Average', onPress: () => saveRating(3) },
        { text: '⭐⭐ Poor', onPress: () => saveRating(2) },
        { text: '⭐ Very Poor', onPress: () => saveRating(1) },
      ]
    );
  };

  const saveRating = (rating: number) => {
    console.log('Call rated:', rating);
    resetCall();
  };

  const resetCall = () => {
    setCallState('idle');
    setCallDuration(0);
    setCurrentTopic(null);
    setConversationSummary([]);
    setIsMuted(false);
    setIsSpeakerOn(false);
  };

  const renderVoiceWaves = () => {
    const waves = Array.from({ length: 5 }, (_, i) => i);
    
    return (
      <Svg width="200" height="100" viewBox="0 0 200 100">
        {waves.map((wave, index) => {
          const animatedHeight = waveAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 60 + index * 8],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View key={wave}>
              <Path
                d={`M ${40 + index * 30} 50 L ${40 + index * 30} ${30 - index * 2} L ${40 + index * 30} ${70 + index * 2} Z`}
                fill="#e34c00"
                opacity={0.9 - index * 0.15}
              />
            </Animated.View>
          );
        })}
      </Svg>
    );
  };

  const renderIdleState = () => (
    <View style={styles.idleContainer}>
      <View style={styles.counselorAvatar}>
        <Ionicons name="person" size={64} color="#FFFFFF" />
      </View>
      
      <Text style={styles.counselorTitle}>AI Financial Counselor</Text>
      <Text style={styles.counselorSubtitle}>
        Get personalized financial advice through voice conversation
      </Text>

      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <Ionicons name="mic" size={20} color="#e34c00" />
          <Text style={styles.featureText}>Voice Recognition</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="brain" size={20} color="#e34c00" />
          <Text style={styles.featureText}>AI Powered</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="shield-checkmark" size={20} color="#e34c00" />
          <Text style={styles.featureText}>Private & Secure</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.startCallButton}
        onPress={() => setShowTopicModal(true)}
      >
        <Ionicons name="call" size={24} color="#FFFFFF" />
        <Text style={styles.startCallButtonText}>Start Conversation</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.quickCallButton}
        onPress={() => handleStartCall()}
      >
        <Text style={styles.quickCallButtonText}>Quick Call (General Topic)</Text>
      </TouchableOpacity>
    </View>
  );

  const renderActiveCall = () => (
    <View style={styles.activeCallContainer}>
      <View style={styles.callHeader}>
        <Text style={styles.callTopic}>{currentTopic}</Text>
        <Text style={styles.callDuration}>{formatCallDuration(callDuration)}</Text>
      </View>

      <View style={styles.visualizerContainer}>
        {renderVoiceWaves()}
        
        <Animated.View style={[
          styles.counselorAvatarActive,
          { transform: [{ scale: pulseAnim }] }
        ]}>
          <Ionicons name="person" size={48} color="#FFFFFF" />
        </Animated.View>
      </View>

      <View style={styles.conversationStatus}>
        <Text style={styles.statusText}>AI is listening...</Text>
        <Text style={styles.statusSubtext}>Speak naturally about your financial concerns</Text>
      </View>

      <View style={styles.callControls}>
        <TouchableOpacity 
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={() => setIsMuted(!isMuted)}
        >
          <Ionicons 
            name={isMuted ? "mic-off" : "mic"} 
            size={24} 
            color={isMuted ? "#FF6B6B" : "#FFFFFF"} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.endCallButton}
          onPress={handleEndCall}
        >
          <Ionicons name="call" size={32} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, isSpeakerOn && styles.controlButtonActive]}
          onPress={() => setIsSpeakerOn(!isSpeakerOn)}
        >
          <Ionicons 
            name={isSpeakerOn ? "volume-high" : "volume-medium"} 
            size={24} 
            color={isSpeakerOn ? "#e34c00" : "#FFFFFF"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConnectingState = () => (
    <View style={styles.connectingContainer}>
      <Animated.View style={[
        styles.connectingAvatar,
        { transform: [{ scale: pulseAnim }] }
      ]}>
        <Ionicons name="person" size={48} color="#FFFFFF" />
      </Animated.View>
      
      <Text style={styles.connectingText}>Connecting to AI Counselor...</Text>
      <Text style={styles.connectingSubtext}>Setting up secure voice channel</Text>
    </View>
  );

  const renderRecentHistory = () => (
    <View style={styles.historyContainer}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Recent Conversations</Text>
        <TouchableOpacity onPress={() => router.push('/voice/history')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {callHistory.slice(0, 3).map((call) => (
        <View key={call.id} style={styles.historyItem}>
          <View style={styles.historyItemContent}>
            <Text style={styles.historyItemTitle}>{call.topic}</Text>
            <Text style={styles.historyItemSummary}>{call.summary}</Text>
            <View style={styles.historyItemMeta}>
              <Text style={styles.historyItemDate}>{call.date}</Text>
              <Text style={styles.historyItemDuration}>{call.duration}</Text>
              <View style={styles.ratingContainer}>
                {Array.from({ length: call.rating }, (_, i) => (
                  <Ionicons key={i} name="star" size={12} color="#FFD700" />
                ))}
              </View>
            </View>
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
        <Text style={styles.headerTitle}>Voice Counselor</Text>
        <TouchableOpacity onPress={() => router.push('/voice/settings')}>
          <Ionicons name="settings-outline" size={24} color="#CBD5E0" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {callState === 'idle' && renderIdleState()}
        {callState === 'connecting' && renderConnectingState()}
        {callState === 'active' && renderActiveCall()}
        
        {callState === 'idle' && renderRecentHistory()}
      </ScrollView>

      {/* Topic Selection Modal */}
      <Modal
        visible={showTopicModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTopicModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose a Topic</Text>
              <TouchableOpacity onPress={() => setShowTopicModal(false)}>
                <Ionicons name="close" size={24} color="#CBD5E0" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.topicsContainer} showsVerticalScrollIndicator={false}>
              {counselingTopics.map((topic) => (
                <TouchableOpacity
                  key={topic.id}
                  style={styles.topicCard}
                  onPress={() => handleStartCall(topic.title)}
                >
                  <View style={[styles.topicIcon, { backgroundColor: topic.color }]}>
                    <Ionicons name={topic.icon as any} size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.topicContent}>
                    <Text style={styles.topicTitle}>{topic.title}</Text>
                    <Text style={styles.topicDescription}>{topic.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  idleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  counselorAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e34c00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  counselorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  counselorSubtitle: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 12,
    color: '#CBD5E0',
    marginTop: 8,
    textAlign: 'center',
  },
  startCallButton: {
    backgroundColor: '#e34c00',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  startCallButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  quickCallButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  quickCallButtonText: {
    color: '#e34c00',
    fontSize: 16,
    fontWeight: '500',
  },
  connectingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  connectingAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e34c00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  connectingText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  connectingSubtext: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  activeCallContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  callHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  callTopic: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  callDuration: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e34c00',
  },
  visualizerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginBottom: 40,
  },
  counselorAvatarActive: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e34c00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationStatus: {
    alignItems: 'center',
    marginBottom: 60,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2D3748',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#4A5568',
  },
  endCallButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '135deg' }],
  },
  historyContainer: {
    padding: 20,
    marginTop: 32,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  viewAllText: {
    fontSize: 14,
    color: '#e34c00',
    fontWeight: '500',
  },
  historyItem: {
    backgroundColor: '#1A202C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  historyItemContent: {},
  historyItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  historyItemSummary: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 8,
    lineHeight: 20,
  },
  historyItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyItemDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  historyItemDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A202C',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  topicsContainer: {
    padding: 24,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  topicContent: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    lineHeight: 18,
  },
});

export default VoiceCounselor;
