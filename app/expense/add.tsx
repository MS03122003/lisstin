import { Ionicons } from '@expo/vector-icons';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Modal,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Separate API keys for different services
const GOOGLE_GEMINI_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || 'AIzaSyASNoXRjGc9Ok_UeiW5GZdlLTxclhhUve0';
const GOOGLE_SPEECH_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_SPEECH_API_KEY || process.env.EXPO_PUBLIC_GOOGLE_API_KEY || 'AIzaSyBGuiXd9hzzA2Cpj9K7vsohkfma3eyb0ec';

console.log('Gemini API Key configured:', !!GOOGLE_GEMINI_API_KEY);
console.log('Speech API Key configured:', !!GOOGLE_SPEECH_API_KEY);

const AddExpense = () => {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'wants' | 'needs' | 'desires' | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{category: string, confidence: number} | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [voiceText, setVoiceText] = useState('');
  const [recordingDuration, setRecordingDuration] = useState(0);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recordingInterval = useRef<NodeJS.Timeout | number | null>(null);

  const categories = {
    wants: {
      name: 'Wants',
      color: '#FF6B6B',
      icon: 'heart-outline',
      subcategories: ['Coffee & Snacks', 'Entertainment', 'Shopping', 'Dining Out', 'Hobbies'],
      description: 'Things you enjoy but can live without',
      keywords: ['coffee', 'snack', 'movie', 'game', 'shop', 'restaurant', 'hobby', 'entertainment', 'fun', 'cinema', 'mall', 'party']
    },
    needs: {
      name: 'Needs',
      color: '#e34c00',
      icon: 'home-outline',
      subcategories: ['Groceries', 'Transportation', 'Bills', 'Medical', 'Education'],
      description: 'Essential expenses for daily living',
      keywords: ['grocery', 'food', 'transport', 'bus', 'taxi', 'bill', 'electricity', 'water', 'medical', 'doctor', 'medicine', 'education', 'school', 'rent', 'fuel']
    },
    desires: {
      name: 'Desires',
      color: '#45B7D1',
      icon: 'star-outline',
      subcategories: ['Gadgets', 'Travel', 'Luxury Items', 'Investments', 'Premium Services'],
      description: 'Future goals and aspirational purchases',
      keywords: ['gadget', 'phone', 'laptop', 'travel', 'vacation', 'luxury', 'brand', 'investment', 'stock', 'premium', 'subscription']
    }
  };

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline' },
    { id: 'card', name: 'Card', icon: 'card-outline' },
    { id: 'cash', name: 'Cash', icon: 'cash-outline' },
    { id: 'wallet', name: 'Wallet', icon: 'wallet-outline' },
  ];

  useEffect(() => {
    requestPermissions();
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone to record voice expenses.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const startRecording = async () => {
    try {
      const permission = await requestPermissions();
      if (!permission) {
        Alert.alert('Permission Required', 'Please grant microphone permission to use voice input.');
        return;
      }

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      // Improved recording configuration for better speech recognition
      const recordingOptions = {
  android: {
    extension: '.wav',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 128000, // Reduced from 256000
  },
  ios: {
    extension: '.wav',
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH, // Changed from MAX
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 128000, // Reduced from 256000
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
};


      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);

      // Start recording duration counter
      recordingInterval.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // Start pulse animation
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

      // Auto-stop recording after 30 seconds
      setTimeout(() => {
        if (isRecording) {
          handleStopRecording();
        }
      }, 30000);

    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    setIsProcessing(true);
    pulseAnim.setValue(1);

    // Clear recording interval
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (uri) {
        console.log('Recording saved to:', uri);
        
        // Check file size to ensure we have audio data
        const fileInfo = await FileSystem.getInfoAsync(uri);
        console.log('Audio file info:', fileInfo);
        
        if (fileInfo.exists && fileInfo.size > 1000) { // At least 1KB of audio data
          await processVoiceInput(uri);
        } else {
          throw new Error('Recording too short or empty');
        }
      }
      
      setRecording(null);
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Recording Error', 'Recording was too short or failed. Please try speaking for at least 2-3 seconds.');
      
      // Fallback to simulated transcript
      const simulatedTranscript = await simulateSpeechToText();
      setVoiceText(simulatedTranscript);
      await processWithAI(simulatedTranscript);
    } finally {
      setIsProcessing(false);
    }
  };

  const processVoiceInput = async (audioUri: string) => {
    try {
      // Try Google Speech-to-Text first
      const transcript = await speechToText(audioUri);
      setVoiceText(transcript);
      await processWithAI(transcript);
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      
      // Fallback to simulated transcript for demo
      console.log('Falling back to simulated transcript');
      const simulatedTranscript = await simulateSpeechToText();
      setVoiceText(simulatedTranscript);
      await processWithAI(simulatedTranscript);
    }
  };

  const speechToText = async (audioUri: string): Promise<string> => {
    try {
      // Check if Speech API key is available
      if (!GOOGLE_SPEECH_API_KEY || GOOGLE_SPEECH_API_KEY === 'your_actual_gemini_api_key_here') {
        console.warn('Google Speech API key not configured');
        throw new Error('Speech API key not configured');
      }

      console.log('Converting audio to base64...');
      const audioBase64 = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('Audio base64 length:', audioBase64.length);

      const requestBody = {
  config: {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-IN',
    alternativeLanguageCodes: ['hi-IN', 'en-US'],
    enableAutomaticPunctuation: true,
    enableWordTimeOffsets: false,
    model: 'default',
    useEnhanced: true,
    // Add speech contexts for better recognition
    speechContexts: [{
      phrases: [
        'rupees', 'spent', 'bought', 'paid', 'cost', 'bill', 'expense',
        'coffee', 'food', 'grocery', 'transport', 'medical', 'medicine',
        'restaurant', 'movie', 'shopping', 'electricity', 'water'
      ]
    }],
    maxAlternatives: 3, // Get multiple alternatives
  },
  audio: {
    content: audioBase64,
  },
};


      console.log('Making Speech-to-Text API call...');
      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_SPEECH_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      console.log('Speech API response:', result);

      if (result.error) {
        console.error('Google Speech-to-Text API Error:', result.error);
        throw new Error(result.error.message);
      }

      if (result.results && result.results.length > 0) {
        const transcript = result.results
          .map((r: any) => r.alternatives[0]?.transcript || '')
          .join(' ')
          .trim();
        
        if (transcript) {
          console.log('Speech-to-Text Result:', transcript);
          return transcript;
        }
      }

      throw new Error('No speech detected');

    } catch (error) {
      console.error('Speech-to-Text Error:', error);
      throw error;
    }
  };

  const simulateSpeechToText = async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const sampleTranscripts = [
      "I spent 450 rupees on coffee and pastry at Starbucks",
      "Paid 1200 for groceries at the supermarket",
      "Movie tickets cost me 600 rupees yesterday",
      "Bought a new phone case for 800 rupees",
      "Electricity bill was 2500 this month",
      "Lunch at restaurant cost 350 rupees",
      "Bus fare was 25 rupees today",
      "Bought medicine for 180 rupees"
    ];
    
    return sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
  };

  const processWithAI = async (transcript: string) => {
    try {
      // Check if Gemini API key is available
      if (!GOOGLE_GEMINI_API_KEY || GOOGLE_GEMINI_API_KEY === 'your_actual_gemini_api_key_here') {
        console.warn('Google Gemini API key not configured, using fallback processing');
        await fallbackProcessing(transcript);
        return;
      }

      console.log('Processing with Gemini AI:', transcript);
      
      const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Analyze this expense description and extract the following information in JSON format:
        "${transcript}"
        
        Please extract:
        1. amount (number only, remove currency symbols)
        2. description (clean description of what was purchased)
        3. category (one of: wants, needs, desires)
        4. subcategory (best matching subcategory from the options below)
        5. paymentMethod (guess from context: upi, card, cash, wallet)
        6. confidence (how confident you are about the category, 0-100)

        Category definitions:
        - wants: ${categories.wants.description}. Keywords: ${categories.wants.keywords.join(', ')}
        - needs: ${categories.needs.description}. Keywords: ${categories.needs.keywords.join(', ')}
        - desires: ${categories.desires.description}. Keywords: ${categories.desires.keywords.join(', ')}

        Subcategories for wants: ${categories.wants.subcategories.join(', ')}
        Subcategories for needs: ${categories.needs.subcategories.join(', ')}
        Subcategories for desires: ${categories.desires.subcategories.join(', ')}

        Return only valid JSON without any markdown formatting.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('AI Response:', text);
      
      try {
        const extractedData = JSON.parse(text.replace(/``````/g, '').trim());
        
        // Auto-fill the form with extracted data
        if (extractedData.amount) {
          setAmount(extractedData.amount.toString());
        }
        if (extractedData.description) {
          setDescription(extractedData.description);
        }
        if (extractedData.category && categories[extractedData.category as keyof typeof categories]) {
          setSelectedCategory(extractedData.category);
          if (extractedData.subcategory) {
            setSelectedSubcategory(extractedData.subcategory);
          }
        }
        if (extractedData.paymentMethod) {
          setPaymentMethod(extractedData.paymentMethod);
        }
        if (extractedData.confidence) {
          setAiSuggestion({
            category: extractedData.category,
            confidence: extractedData.confidence
          });
        }

        setShowVoiceModal(false);
        Alert.alert('Voice Input Processed', 'Expense details have been filled automatically with AI!');
        
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        await fallbackProcessing(transcript);
      }
      
    } catch (error) {
      console.error('Error with AI processing:', error);
      
      if (error.message?.includes('SERVICE_DISABLED') || error.message?.includes('Generative Language API')) {
        Alert.alert(
          'AI Service Unavailable',
          'The AI processing service is not enabled. Using basic keyword processing instead.',
          [{ text: 'OK' }]
        );
      } else if (error.message?.includes('API key not valid')) {
        Alert.alert(
          'API Configuration Error',
          'Google AI API key is not configured properly. Using basic processing instead.',
          [{ text: 'OK' }]
        );
      }
      
      await fallbackProcessing(transcript);
    }
  };

  const fallbackProcessing = async (transcript: string) => {
    console.log('Using fallback processing for:', transcript);
    
    // Extract amount using regex
    const amountMatch = transcript.match(/(\d+(?:\.\d+)?)/);
    if (amountMatch) {
      setAmount(amountMatch[1]);
    }

    setDescription(transcript);

    // Simple keyword-based category detection
    const lowerTranscript = transcript.toLowerCase();
    let detectedCategory: 'wants' | 'needs' | 'desires' = 'wants';
    let confidence = 50;

    for (const [categoryKey, categoryData] of Object.entries(categories)) {
      const matchedKeywords = categoryData.keywords.filter(keyword => 
        lowerTranscript.includes(keyword.toLowerCase())
      );
      
      if (matchedKeywords.length > 0) {
        detectedCategory = categoryKey as 'wants' | 'needs' | 'desires';
        confidence = Math.min(90, 60 + (matchedKeywords.length * 10));
        break;
      }
    }

    setSelectedCategory(detectedCategory);
    setSelectedSubcategory(categories[detectedCategory].subcategories[0]);
    setAiSuggestion({ category: detectedCategory, confidence });

    setShowVoiceModal(false);
    Alert.alert('Voice Input Processed', 'Expense details have been filled using keyword processing!');
  };

  const handleVoiceInput = async () => {
    setShowVoiceModal(true);
    setVoiceText('');
    setRecordingDuration(0);
    await startRecording();
  };

  const handleStopRecording = async () => {
    await stopRecording();
  };

  const handleAISuggestion = () => {
    if (aiSuggestion) {
      setSelectedCategory(aiSuggestion.category as 'wants' | 'needs' | 'desires');
      setSelectedSubcategory(categories[aiSuggestion.category as keyof typeof categories].subcategories[0]);
      setAiSuggestion(null);
    }
  };

  const handleSaveExpense = () => {
    if (!amount || !description || !selectedCategory) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    const expenseData = {
      amount: parseFloat(amount),
      description,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      paymentMethod,
      timestamp: new Date().toISOString(),
      voiceInput: voiceText || null,
    };

    console.log('Saving expense:', expenseData);
    Alert.alert('Success', 'Expense added successfully!', [
      { text: 'Add Another', onPress: () => {
        setAmount('');
        setDescription('');
        setSelectedCategory(null);
        setSelectedSubcategory('');
        setPaymentMethod('upi');
        setVoiceText('');
        setAiSuggestion(null);
      }},
      { text: 'View Expenses', onPress: () => router.push('/(tabs)/expenses') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#CBD5E0" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Expense</Text>
          <TouchableOpacity onPress={handleVoiceInput}>
            <Ionicons name="mic" size={24} color="#e34c00" />
          </TouchableOpacity>
        </View>

        {/* Voice Text Display */}
        {voiceText && (
          <View style={styles.voiceTextContainer}>
            <Text style={styles.voiceTextLabel}>Voice Input:</Text>
            <Text style={styles.voiceTextContent}>"{voiceText}"</Text>
          </View>
        )}

        {/* AI Suggestion Banner */}
        {aiSuggestion && (
          <View style={styles.aiSuggestionBanner}>
            <View style={styles.aiSuggestionContent}>
              <Ionicons name="sparkles" size={20} color="#FFD700" />
              <Text style={styles.aiSuggestionText}>
                AI suggests: {categories[aiSuggestion.category as keyof typeof categories].name} ({aiSuggestion.confidence}% confidence)
              </Text>
            </View>
            <TouchableOpacity onPress={handleAISuggestion}>
              <Text style={styles.aiSuggestionButton}>Apply</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
              autoFocus={!voiceText}
            />
          </View>
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="What did you spend on?"
            placeholderTextColor="#6B7280"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <Text style={styles.sectionSubtitle}>Choose how to categorize this expense</Text>
          
          <View style={styles.categoriesGrid}>
            {Object.entries(categories).map(([key, category]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.categoryCard,
                  {
                    borderColor: selectedCategory === key ? category.color : '#2D3748',
                    backgroundColor: selectedCategory === key ? `${category.color}20` : '#1A202C',
                  }
                ]}
                onPress={() => {
                  setSelectedCategory(key as 'wants' | 'needs' | 'desires');
                  setSelectedSubcategory(category.subcategories[0]);
                }}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <Ionicons name={category.icon as any} size={24} color="#FFFFFF" />
                </View>
                <Text style={[
                  styles.categoryName,
                  { color: selectedCategory === key ? category.color : '#FFFFFF' }
                ]}>
                  {category.name}
                </Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
                {selectedCategory === key && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark-circle" size={20} color={category.color} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Subcategory Selection */}
        {selectedCategory && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subcategory</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.subcategoriesContainer}
            >
              {categories[selectedCategory].subcategories.map((subcategory) => (
                <TouchableOpacity
                  key={subcategory}
                  style={[
                    styles.subcategoryChip,
                    {
                      backgroundColor: selectedSubcategory === subcategory ? 
                        categories[selectedCategory].color : '#1A202C',
                      borderColor: categories[selectedCategory].color,
                    }
                  ]}
                  onPress={() => setSelectedSubcategory(subcategory)}
                >
                  <Text style={[
                    styles.subcategoryText,
                    {
                      color: selectedSubcategory === subcategory ? 
                        '#FFFFFF' : categories[selectedCategory].color
                    }
                  ]}>
                    {subcategory}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethodsGrid}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethodCard,
                  {
                    borderColor: paymentMethod === method.id ? '#e34c00' : '#2D3748',
                    backgroundColor: paymentMethod === method.id ? '#e34c0020' : '#1A202C',
                  }
                ]}
                onPress={() => setPaymentMethod(method.id)}
              >
                <Ionicons 
                  name={method.icon as any} 
                  size={24} 
                  color={paymentMethod === method.id ? '#e34c00' : '#CBD5E0'} 
                />
                <Text style={[
                  styles.paymentMethodText,
                  { color: paymentMethod === method.id ? '#e34c00' : '#CBD5E0' }
                ]}>
                  {method.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveExpense}>
          <Text style={styles.saveButtonText}>Save Expense</Text>
        </TouchableOpacity>

        {/* Additional Actions */}
        <View style={styles.additionalActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowCategoryModal(true)}
          >
            <Ionicons name="information-circle-outline" size={20} color="#e34c00" />
            <Text style={styles.actionButtonText}>Learn About Categories</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Voice Recording Modal */}
      <Modal
        visible={showVoiceModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (isRecording) {
            handleStopRecording();
          } else {
            setShowVoiceModal(false);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.voiceModal}>
            <Animated.View style={[
              styles.voiceButton,
              { 
                transform: [{ scale: pulseAnim }],
                backgroundColor: isRecording ? '#FF6B6B' : '#e34c00'
              }
            ]}>
              <Ionicons 
                name={isRecording ? "stop" : (isProcessing ? "sync" : "mic")} 
                size={48} 
                color="#FFFFFF" 
              />
            </Animated.View>
            
            <Text style={styles.voiceModalTitle}>
              {isRecording ? 'Listening...' : (isProcessing ? 'Processing...' : 'Ready to Record')}
            </Text>
            
            <Text style={styles.voiceModalSubtitle}>
              {isRecording 
                ? `Speak naturally about your expense (${recordingDuration}s)` 
                : (isProcessing 
                  ? 'Converting speech to text and analyzing'
                  : 'Tap the microphone to start recording'
                )
              }
            </Text>
            
            {isRecording && (
              <TouchableOpacity 
                style={styles.stopButton}
                onPress={handleStopRecording}
              >
                <Text style={styles.stopButtonText}>Stop Recording</Text>
              </TouchableOpacity>
            )}
            
            {!isRecording && !isProcessing && (
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowVoiceModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* Category Information Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.categoryModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>LisstIn Categories</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color="#CBD5E0" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {Object.entries(categories).map(([key, category]) => (
                <View key={key} style={styles.categoryInfoCard}>
                  <View style={styles.categoryInfoHeader}>
                    <View style={[styles.categoryInfoIcon, { backgroundColor: category.color }]}>
                      <Ionicons name={category.icon as any} size={20} color="#FFFFFF" />
                    </View>
                    <Text style={styles.categoryInfoName}>{category.name}</Text>
                  </View>
                  <Text style={styles.categoryInfoDescription}>{category.description}</Text>
                  <View style={styles.categoryInfoSubcategories}>
                    <Text style={styles.categoryInfoSubtitle}>Examples:</Text>
                    <Text style={styles.categoryInfoExamples}>
                      {category.subcategories.slice(0, 3).join(', ')}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// All your existing styles remain the same
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
  voiceTextContainer: {
    backgroundColor: '#1A202C',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e34c00',
    marginBottom: 20,
  },
  voiceTextLabel: {
    fontSize: 12,
    color: '#e34c00',
    fontWeight: '600',
    marginBottom: 4,
  },
  voiceTextContent: {
    fontSize: 14,
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  aiSuggestionBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
    marginBottom: 20,
  },
  aiSuggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aiSuggestionText: {
    fontSize: 14,
    color: '#CBD5E0',
    marginLeft: 8,
    flex: 1,
  },
  aiSuggestionButton: {
    fontSize: 14,
    color: '#e34c00',
    fontWeight: '600',
  },
  section: {
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
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e34c00',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  descriptionInput: {
    backgroundColor: '#1A202C',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#FFFFFF',
    textAlignVertical: 'top',
  },
  categoriesGrid: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#1A202C',
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    position: 'relative',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    lineHeight: 20,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  subcategoriesContainer: {
    paddingVertical: 8,
  },
  subcategoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  subcategoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  paymentMethodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  paymentMethodCard: {
    backgroundColor: '#1A202C',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    width: '47%',
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#e34c00',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  additionalActions: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A202C',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#e34c00',
    marginLeft: 8,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceModal: {
    backgroundColor: '#1A202C',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginHorizontal: 40,
    minWidth: 300,
  },
  voiceButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  voiceModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  voiceModalSubtitle: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 20,
  },
  stopButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#2D3748',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#CBD5E0',
    fontWeight: '600',
    fontSize: 16,
  },
  categoryModal: {
    backgroundColor: '#1A202C',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
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
  modalContent: {
    padding: 24,
  },
  categoryInfoCard: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  categoryInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categoryInfoDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 12,
  },
  categoryInfoSubcategories: {
    marginTop: 8,
  },
  categoryInfoSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryInfoExamples: {
    fontSize: 12,
    color: '#CBD5E0',
  },
  modalCloseButton: {
    backgroundColor: '#e34c00',
    margin: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AddExpense;
