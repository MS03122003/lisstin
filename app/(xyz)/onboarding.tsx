import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import {
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const Onboarding = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onboardingData = [
    {
      id: 1,
      title: 'Welcome to',
      subtitle: 'LisstIn',
      description: 'Listen to Your Money, List Your Dreams\nYour smart companion for categorizing expenses\nand achieving financial goals',
      illustration: 'welcome',
    },
    {
      id: 2,
      title: 'Smart Categories',
      subtitle: 'Wants • Needs • Desires',
      description: 'Our AI automatically categorizes your expenses\ninto Wants, Needs, and Desires to help you\nunderstand your spending patterns',
      illustration: 'categories',
    },
    {
      id: 3,
      title: 'Voice AI',
      subtitle: 'Counseling',
      description: 'Get personalized financial advice through\nvoice calls with our AI counselor.\nJust speak, and LisstIn will listen!',
      illustration: 'voice',
    },
    {
      id: 4,
      title: 'Learn &',
      subtitle: 'Grow',
      description: 'Access curated financial education content\nand earn achievements as you build\nhealthy money habits',
      illustration: 'learning',
    },
  ];

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      scrollViewRef.current?.scrollTo({
        x: nextPage * width,
        animated: true,
      });
    } else {
      // Navigate to the combined auth page
      router.push('/(auth)/login');
    }
  };

  const handleSkip = () => {
    // Navigate to the combined auth page
    router.push('/(auth)/auth');
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(contentOffsetX / width);
    setCurrentPage(pageIndex);
  };

  const renderIllustration = (type: string) => {
    switch (type) {
      case 'welcome':
        return (
          <Svg width="250" height="250" viewBox="0 0 250 250">
            <Defs>
              <LinearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#667eea" />
                <Stop offset="100%" stopColor="#764ba2" />
              </LinearGradient>
            </Defs>
            
            {/* Phone/Device outline */}
            <Path
              d="M90 60 L160 60 Q170 60 170 70 L170 180 Q170 190 160 190 L90 190 Q80 190 80 180 L80 70 Q80 60 90 60 Z"
              fill="url(#phoneGradient)"
              stroke="#667eea"
              strokeWidth="2"
            />
            
            {/* Screen content - LisstIn logo area */}
            <Circle cx="125" cy="100" r="8" fill="#FFD700" />
            <SvgText x="115" y="105" fontSize="12" fill="#FFD700" fontWeight="bold">Li</SvgText>
            
            {/* Category indicators */}
            <Circle cx="95" cy="130" r="6" fill="#FF6B6B" />
            <SvgText x="105" y="135" fontSize="10" fill="#FFFFFF">Wants</SvgText>
            
            <Circle cx="95" cy="145" r="6" fill="#e34c00" />
            <SvgText x="105" y="150" fontSize="10" fill="#FFFFFF">Needs</SvgText>
            
            <Circle cx="95" cy="160" r="6" fill="#45B7D1" />
            <SvgText x="105" y="165" fontSize="10" fill="#FFFFFF">Desires</SvgText>
            
            {/* Floating money symbols */}
            <Circle cx="200" cy="80" r="12" fill="#FFD700" opacity="0.8" />
            <SvgText x="196" y="85" fontSize="14" fill="#FFFFFF" fontWeight="bold">₹</SvgText>
            
            <Circle cx="40" cy="120" r="10" fill="#FF6B6B" opacity="0.8" />
            <SvgText x="37" y="125" fontSize="12" fill="#FFFFFF" fontWeight="bold">$</SvgText>
            
            <Circle cx="210" cy="160" r="8" fill="#e34c00" opacity="0.8" />
            <SvgText x="207" y="164" fontSize="10" fill="#FFFFFF" fontWeight="bold">€</SvgText>
          </Svg>
        );

      case 'categories':
        return (
          <Svg width="250" height="250" viewBox="0 0 250 250">
            {/* Three category sections */}
            <Rect x="50" y="70" width="150" height="110" fill="#1A202C" rx="15" stroke="#4A5568" strokeWidth="2" />
            
            {/* Wants section */}
            <Rect x="60" y="80" width="40" height="30" fill="#FF6B6B" rx="8" />
            <SvgText x="75" y="98" fontSize="10" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">Wants</SvgText>
            <SvgText x="80" y="115" fontSize="8" fill="#CBD5E0">Coffee, Movies</SvgText>
            <SvgText x="80" y="125" fontSize="8" fill="#CBD5E0">Shopping</SvgText>
            
            {/* Needs section */}
            <Rect x="105" y="80" width="40" height="30" fill="#e34c00" rx="8" />
            <SvgText x="120" y="98" fontSize="10" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">Needs</SvgText>
            <SvgText x="125" y="115" fontSize="8" fill="#CBD5E0">Groceries</SvgText>
            <SvgText x="125" y="125" fontSize="8" fill="#CBD5E0">Transport</SvgText>
            
            {/* Desires section */}
            <Rect x="150" y="80" width="40" height="30" fill="#45B7D1" rx="8" />
            <SvgText x="165" y="98" fontSize="10" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">Desires</SvgText>
            <SvgText x="170" y="115" fontSize="8" fill="#CBD5E0">Gadgets</SvgText>
            <SvgText x="170" y="125" fontSize="8" fill="#CBD5E0">Travel</SvgText>
            
            {/* AI brain symbol */}
            <Circle cx="125" cy="150" r="15" fill="#667eea" opacity="0.3" />
            <Path d="M115 145 Q125 140 135 145 Q130 155 125 160 Q120 155 115 145" fill="#667eea" />
            <SvgText x="119" y="154" fontSize="8" fill="#FFFFFF" fontWeight="bold">AI</SvgText>
            
            {/* Connecting lines */}
            <Path d="M80 110 L115 140" stroke="#667eea" strokeWidth="2" strokeDasharray="3,3" />
            <Path d="M125 110 L125 135" stroke="#667eea" strokeWidth="2" strokeDasharray="3,3" />
            <Path d="M170 110 L135 140" stroke="#667eea" strokeWidth="2" strokeDasharray="3,3" />
          </Svg>
        );

      case 'voice':
        return (
          <Svg width="250" height="250" viewBox="0 0 250 250">
            {/* Phone with voice waves */}
            <Rect x="100" y="80" width="50" height="90" fill="#1A202C" rx="15" stroke="#e34c00" strokeWidth="3" />
            
            {/* Microphone icon */}
            <Circle cx="125" cy="115" r="8" fill="#e34c00" />
            <Rect x="123" y="125" width="4" height="8" fill="#e34c00" />
            <Path d="M120 133 L130 133" stroke="#e34c00" strokeWidth="2" />
            
            {/* Voice waves */}
            <Path d="M170 100 Q180 110 170 120" stroke="#FFD700" strokeWidth="3" fill="none" strokeLinecap="round" />
            <Path d="M175 95 Q190 110 175 125" stroke="#FFD700" strokeWidth="3" fill="none" strokeLinecap="round" />
            <Path d="M180 90 Q200 110 180 130" stroke="#FFD700" strokeWidth="3" fill="none" strokeLinecap="round" />
            
            <Path d="M80 100 Q70 110 80 120" stroke="#FF6B6B" strokeWidth="3" fill="none" strokeLinecap="round" />
            <Path d="M75 95 Q60 110 75 125" stroke="#FF6B6B" strokeWidth="3" fill="none" strokeLinecap="round" />
            <Path d="M70 90 Q50 110 70 130" stroke="#FF6B6B" strokeWidth="3" fill="none" strokeLinecap="round" />
            
            {/* AI assistant icon */}
            <Circle cx="125" cy="190" r="20" fill="#667eea" opacity="0.3" />
            <Circle cx="120" cy="185" r="2" fill="#FFFFFF" />
            <Circle cx="130" cy="185" r="2" fill="#FFFFFF" />
            <Path d="M115 195 Q125 200 135 195" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" />
            
            {/* Speech bubble */}
            <Path d="M170 50 Q190 50 190 70 L190 85 Q190 95 180 95 L160 95 L165 105 L155 95 Q150 95 150 85 L150 70 Q150 50 170 50" fill="#e34c00" opacity="0.8" />
            <SvgText x="170" y="75" fontSize="8" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">Financial</SvgText>
            <SvgText x="170" y="85" fontSize="8" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">Advice</SvgText>
          </Svg>
        );

      case 'learning':
        return (
          <Svg width="250" height="250" viewBox="0 0 250 250">
            {/* Book/Learning platform */}
            <Rect x="80" y="90" width="90" height="70" fill="#1A202C" rx="10" stroke="#667eea" strokeWidth="2" />
            
            {/* YouTube play button style */}
            <Circle cx="125" cy="125" r="20" fill="#FF0000" opacity="0.8" />
            <Path d="M120 115 L135 125 L120 135 Z" fill="#FFFFFF" />
            
            {/* Achievement badges around */}
            <Circle cx="60" cy="70" r="15" fill="#FFD700" />
            <SvgText x="57" y="75" fontSize="10" fill="#FFFFFF" fontWeight="bold">1st</SvgText>
            
            <Circle cx="190" cy="70" r="15" fill="#FF6B6B" />
            <Path d="M185 65 L190 70 L195 65 L195 75 L185 75 Z" fill="#FFFFFF" />
            
            <Circle cx="60" cy="180" r="15" fill="#e34c00" />
            <SvgText x="57" y="185" fontSize="12" fill="#FFFFFF" fontWeight="bold">★</SvgText>
            
            <Circle cx="190" cy="180" r="15" fill="#45B7D1" />
            <Path d="M185 175 Q190 170 195 175 Q190 185 185 175" fill="#FFFFFF" />
            
            {/* Progress indicators */}
            <Rect x="85" y="170" width="80" height="4" fill="#4A5568" rx="2" />
            <Rect x="85" y="170" width="60" height="4" fill="#e34c00" rx="2" />
            
            {/* Knowledge points floating */}
            <Circle cx="40" cy="125" r="6" fill="#FFD700" opacity="0.6" />
            <SvgText x="37" y="129" fontSize="8" fill="#FFFFFF">₹</SvgText>
            
            <Circle cx="210" cy="125" r="6" fill="#FF6B6B" opacity="0.6" />
            <SvgText x="207" y="129" fontSize="8" fill="#FFFFFF">%</SvgText>
            
            {/* Learning path */}
            <Path d="M125 60 Q100 80 125 100 Q150 120 125 140 Q100 160 125 180" 
                  stroke="#667eea" strokeWidth="3" fill="none" strokeDasharray="5,5" opacity="0.5" />
          </Svg>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header with Skip button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Pages */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { 
              useNativeDriver: false,
              listener: handleScroll,
            }
          )}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {onboardingData.map((item, index) => (
            <View key={item.id} style={styles.pageContainer}>
              {/* Illustration */}
              <View style={styles.illustrationContainer}>
                {renderIllustration(item.illustration)}
              </View>

              {/* Text Content */}
              <View style={styles.textContainer}>
                <Text style={styles.welcomeTitle}>{item.title}</Text>
                <Text style={styles.appTitle}>{item.subtitle}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomContainer}>
          {/* Page Indicators */}
          <View style={styles.indicatorContainer}>
            {onboardingData.map((_, index) => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ];

              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [8, 20, 8],
                extrapolate: 'clamp',
              });

              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.4, 1, 0.4],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.indicator,
                    {
                      width: dotWidth,
                      opacity,
                      backgroundColor: index === currentPage ? '#e34c00' : '#4A5568',
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            {currentPage > 0 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  const prevPage = currentPage - 1;
                  setCurrentPage(prevPage);
                  scrollViewRef.current?.scrollTo({
                    x: prevPage * width,
                    animated: true,
                  });
                }}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {currentPage === onboardingData.length - 1 ? 'Start LisstIn Journey' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1419', // Dark background matching LisstIn theme
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  pageContainer: {
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  illustrationContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 26,
    color: '#CBD5E0',
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: '300',
  },
  appTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#e34c00', // LisstIn brand color
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  description: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  bottomContainer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    height: 8,
    alignItems: 'center',
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  backButtonText: {
    fontSize: 16,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#e34c00', // LisstIn brand color
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    minWidth: 140,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Onboarding;
