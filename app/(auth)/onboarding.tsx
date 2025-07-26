import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
  G,
} from "react-native-svg";

const { width, height } = Dimensions.get("window");

const Onboarding = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onboardingData = [
    {
      id: 1,
      title: "Welcome to",
      subtitle: "LisstIn",
      description:
        "Listen to Your Money, List Your Dreams\nYour intelligent companion for smart expense\nmanagement and financial goal achievement",
      illustration: "welcome",
    },
    {
      id: 2,
      title: "Smart",
      subtitle: "Categorization",
      description:
        "AI-powered expense categorization into\nWants, Needs, and Desires for better\nfinancial awareness and control",
      illustration: "categories",
    },
    {
      id: 3,
      title: "Voice-Powered",
      subtitle: "AI Assistant",
      description:
        "Get personalized financial guidance through\nintelligent voice interactions.\nSpeak naturally, receive expert insights",
      illustration: "voice",
    },
    {
      id: 4,
      title: "Learn &",
      subtitle: "Achieve Goals",
      description:
        "Access professional financial education\nand track your progress with gamified\nachievements and milestone rewards",
      illustration: "learning",
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
      router.push("/(auth)/signup");
    }
  };

  const handleSkip = () => {
    router.push("/(auth)/signup");
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(contentOffsetX / width);
    setCurrentPage(pageIndex);
  };

  const renderIllustration = (type: string) => {
    switch (type) {
      case "welcome":
        return (
          <Svg width="280" height="280" viewBox="0 0 280 280">
            <Defs>
              <LinearGradient
                id="phoneGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#FF8C42" />
                <Stop offset="50%" stopColor="#FF6B35" />
                <Stop offset="100%" stopColor="#E94A1F" />
              </LinearGradient>
              <LinearGradient
                id="screenGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#2D3748" />
                <Stop offset="100%" stopColor="#1A202C" />
              </LinearGradient>
            </Defs>

            {/* Main Phone Body */}
            <Path
              d="M100 50 L180 50 Q200 50 200 70 L200 210 Q200 230 180 230 L100 230 Q80 230 80 210 L80 70 Q80 50 100 50 Z"
              fill="url(#phoneGradient)"
              stroke="#B45309"
              strokeWidth="3"
            />

            {/* Screen */}
            <Rect
              x="90"
              y="70"
              width="100"
              height="140"
              fill="url(#screenGradient)"
              rx="8"
            />

            {/* Logo */}
            <Circle cx="140" cy="110" r="12" fill="#FF8C42" />
            <SvgText
              x="135"
              y="115"
              fontSize="14"
              fill="#FFFFFF"
              fontWeight="bold"
            >
              Li
            </SvgText>

            {/* Category Icons */}
            <G opacity="0.9">
              <Circle cx="110" cy="140" r="8" fill="#FF6B6B" />
              <SvgText x="122" y="145" fontSize="11" fill="#E2E8F0">
                Wants
              </SvgText>

              <Circle cx="110" cy="160" r="8" fill="#e34c00" />
              <SvgText x="122" y="165" fontSize="11" fill="#E2E8F0">
                Needs
              </SvgText>

              <Circle cx="110" cy="180" r="8" fill="#45B7D1" />
              <SvgText x="122" y="185" fontSize="11" fill="#E2E8F0">
                Desires
              </SvgText>
            </G>

            {/* Floating Elements */}
            <Circle cx="240" cy="80" r="15" fill="#FF8C42" opacity="0.7">
              <Animated.View />
            </Circle>
            <SvgText
              x="236"
              y="86"
              fontSize="16"
              fill="#FFFFFF"
              fontWeight="bold"
            >
              ₹
            </SvgText>

            <Circle cx="50" cy="120" r="12" fill="#FF6B35" opacity="0.6" />
            <Path
              d="M46 115 L54 115 M50 111 L50 119"
              stroke="#FFFFFF"
              strokeWidth="2"
            />

            <Circle cx="220" cy="180" r="10" fill="#FFD700" opacity="0.8" />
            <Path
              d="M216 176 L220 180 L224 176 L224 184 L216 184 Z"
              fill="#FFFFFF"
            />
          </Svg>
        );

      case "categories":
        return (
          <Svg width="280" height="280" viewBox="0 0 280 280">
            <Defs>
              <LinearGradient
                id="dashboardGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#2D3748" />
                <Stop offset="100%" stopColor="#1A202C" />
              </LinearGradient>
            </Defs>

            {/* Dashboard Container */}
            <Rect
              x="40"
              y="60"
              width="200"
              height="160"
              fill="url(#dashboardGradient)"
              rx="20"
              stroke="#4A5568"
              strokeWidth="2"
            />

            {/* Header */}
            <Rect
              x="50"
              y="70"
              width="180"
              height="30"
              fill="#FF8C42"
              rx="10"
            />
            <SvgText
              x="140"
              y="88"
              fontSize="14"
              fill="#FFFFFF"
              textAnchor="middle"
              fontWeight="bold"
            >
              Smart Categories
            </SvgText>

            {/* Category Cards */}
            <G opacity="0.95">
              <Rect
                x="60"
                y="120"
                width="50"
                height="40"
                fill="#FF6B6B"
                rx="12"
                stroke="#FF5555"
                strokeWidth="1"
              />
              <SvgText
                x="85"
                y="138"
                fontSize="11"
                fill="#FFFFFF"
                textAnchor="middle"
                fontWeight="600"
              >
                Wants
              </SvgText>
              <SvgText x="85" y="150" fontSize="8" fill="#FFE4E1">
                Entertainment
              </SvgText>

              <Rect
                x="115"
                y="120"
                width="50"
                height="40"
                fill="#e34c00"
                rx="12"
                stroke="#3BD9DB"
                strokeWidth="1"
              />
              <SvgText
                x="140"
                y="138"
                fontSize="11"
                fill="#FFFFFF"
                textAnchor="middle"
                fontWeight="600"
              >
                Needs
              </SvgText>
              <SvgText x="140" y="150" fontSize="8" fill="#E0F7FA">
                Essentials
              </SvgText>

              <Rect
                x="170"
                y="120"
                width="50"
                height="40"
                fill="#45B7D1"
                rx="12"
                stroke="#3B9AE1"
                strokeWidth="1"
              />
              <SvgText
                x="195"
                y="138"
                fontSize="11"
                fill="#FFFFFF"
                textAnchor="middle"
                fontWeight="600"
              >
                Desires
              </SvgText>
              <SvgText x="195" y="150" fontSize="8" fill="#E1F5FE">
                Goals
              </SvgText>
            </G>

            {/* AI Brain */}
            <Circle cx="140" cy="185" r="18" fill="#FF8C42" opacity="0.9" />
            <SvgText
              x="135"
              y="191"
              fontSize="12"
              fill="#FFFFFF"
              fontWeight="bold"
            >
              AI
            </SvgText>

            {/* Connection Lines */}
            <Path
              d="M85 160 Q140 170 140 167"
              stroke="#FF8C42"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
            <Path
              d="M140 160 Q140 165 140 167"
              stroke="#FF8C42"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
            <Path
              d="M195 160 Q140 170 140 167"
              stroke="#FF8C42"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
          </Svg>
        );

      case "voice":
        return (
          <Svg width="280" height="280" viewBox="0 0 280 280">
            <Defs>
              <LinearGradient
                id="micGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#FF8C42" />
                <Stop offset="100%" stopColor="#E94A1F" />
              </LinearGradient>
            </Defs>

            {/* Microphone Stand */}
            <Rect
              x="135"
              y="180"
              width="10"
              height="60"
              fill="#4A5568"
              rx="5"
            />
            <Rect x="120" y="235" width="40" height="8" fill="#4A5568" rx="4" />

            {/* Microphone Body */}
            <Rect
              x="115"
              y="80"
              width="50"
              height="100"
              fill="url(#micGradient)"
              rx="25"
              stroke="#B45309"
              strokeWidth="3"
            />

            {/* Microphone Grille */}
            <G opacity="0.8">
              <Path d="M125 100 L155 100" stroke="#FFFFFF" strokeWidth="1.5" />
              <Path d="M125 110 L155 110" stroke="#FFFFFF" strokeWidth="1.5" />
              <Path d="M125 120 L155 120" stroke="#FFFFFF" strokeWidth="1.5" />
              <Path d="M125 130 L155 130" stroke="#FFFFFF" strokeWidth="1.5" />
              <Path d="M125 140 L155 140" stroke="#FFFFFF" strokeWidth="1.5" />
              <Path d="M125 150 L155 150" stroke="#FFFFFF" strokeWidth="1.5" />
              <Path d="M125 160 L155 160" stroke="#FFFFFF" strokeWidth="1.5" />
            </G>

            {/* Sound Waves */}
            <G opacity="0.7">
              <Path
                d="M180 110 Q200 130 180 150"
                stroke="#FF8C42"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <Path
                d="M190 100 Q220 130 190 160"
                stroke="#FF6B35"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <Path
                d="M200 90 Q240 130 200 170"
                stroke="#FFD700"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />

              <Path
                d="M100 110 Q80 130 100 150"
                stroke="#FF8C42"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <Path
                d="M90 100 Q60 130 90 160"
                stroke="#FF6B35"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <Path
                d="M80 90 Q40 130 80 170"
                stroke="#FFD700"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </G>

            {/* AI Assistant Face */}
            <Circle
              cx="140"
              cy="50"
              r="25"
              fill="#2D3748"
              stroke="#FF8C42"
              strokeWidth="2"
            />
            <Circle cx="132" cy="45" r="3" fill="#e34c00" />
            <Circle cx="148" cy="45" r="3" fill="#e34c00" />
            <Path
              d="M130 55 Q140 60 150 55"
              stroke="#e34c00"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </Svg>
        );

      case "learning":
        return (
          <Svg width="280" height="280" viewBox="0 0 280 280">
            <Defs>
              <LinearGradient
                id="screenLearningGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#2D3748" />
                <Stop offset="100%" stopColor="#1A202C" />
              </LinearGradient>
            </Defs>

            {/* Laptop Base */}
            <Rect
              x="60"
              y="180"
              width="160"
              height="80"
              fill="#4A5568"
              rx="8"
            />
            <Rect
              x="70"
              y="190"
              width="140"
              height="60"
              fill="#2D3748"
              rx="4"
            />

            {/* Laptop Screen */}
            <Rect
              x="80"
              y="70"
              width="120"
              height="110"
              fill="url(#screenLearningGradient)"
              rx="12"
              stroke="#FF8C42"
              strokeWidth="3"
            />

            {/* Video Player */}
            <Rect
              x="90"
              y="90"
              width="100"
              height="60"
              fill="#1A202C"
              rx="8"
              stroke="#4A5568"
              strokeWidth="1"
            />
            <Circle cx="140" cy="120" r="15" fill="#FF8C42" />
            <Path d="M135 110 L150 120 L135 130 Z" fill="#FFFFFF" />

            {/* Progress Bar */}
            <Rect x="90" y="160" width="100" height="6" fill="#4A5568" rx="3" />
            <Rect x="90" y="160" width="65" height="6" fill="#FF8C42" rx="3" />

            {/* Achievement Badges */}
            <Circle
              cx="50"
              cy="50"
              r="20"
              fill="#FFD700"
              stroke="#F59E0B"
              strokeWidth="2"
            />
            <SvgText
              x="47"
              y="56"
              fontSize="12"
              fill="#FFFFFF"
              fontWeight="bold"
            >
              1st
            </SvgText>

            <Circle
              cx="230"
              cy="60"
              r="18"
              fill="#FF6B6B"
              stroke="#EF4444"
              strokeWidth="2"
            />
            <Path
              d="M225 55 L230 60 L235 55 L235 65 L225 65 Z"
              fill="#FFFFFF"
            />

            <Circle
              cx="40"
              cy="150"
              r="16"
              fill="#e34c00"
              stroke="#06B6D4"
              strokeWidth="2"
            />
            <Path
              d="M35 145 L38 150 L45 140"
              stroke="#FFFFFF"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Knowledge Graph */}
            <G opacity="0.6">
              <Circle cx="250" cy="120" r="8" fill="#FF8C42" />
              <Circle cx="240" cy="140" r="6" fill="#e34c00" />
              <Circle cx="255" cy="145" r="5" fill="#FFD700" />

              <Path d="M250 120 L240 140" stroke="#FF8C42" strokeWidth="1" />
              <Path d="M250 120 L255 145" stroke="#FF8C42" strokeWidth="1" />
            </G>

            {/* Floating Elements */}
            <Circle cx="25" cy="220" r="12" fill="#45B7D1" opacity="0.7" />
            <SvgText
              x="22"
              y="225"
              fontSize="10"
              fill="#FFFFFF"
              fontWeight="bold"
            >
              $
            </SvgText>
          </Svg>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

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
              <View style={styles.illustrationContainer}>
                {renderIllustration(item.illustration)}
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.welcomeTitle}>{item.title}</Text>
                <Text style={styles.appTitle}>{item.subtitle}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.bottomContainer}>
          <View style={styles.indicatorContainer}>
            {onboardingData.map((_, index) => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ];

              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [10, 30, 10],
                extrapolate: "clamp",
              });

              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.indicator,
                    {
                      width: dotWidth,
                      opacity,
                      backgroundColor:
                        index === currentPage ? "#FF8C42" : "#4A5568",
                    },
                  ]}
                />
              );
            })}
          </View>

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
                {currentPage === onboardingData.length - 1
                  ? "Get Started"
                  : "Continue"}
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
    backgroundColor: "#0A0E13",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 10,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  pageContainer: {
    width: width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  illustrationContainer: {
    marginBottom: 50,
    alignItems: "center",
    shadowColor: "#FF8C42",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  textContainer: {
    alignItems: "center",
    maxWidth: width - 80,
  },
  welcomeTitle: {
    fontSize: 28,
    color: "#E2E8F0",
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "300",
    letterSpacing: 1,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FF8C42",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: 1.5,
    textShadowColor: "rgba(255, 140, 66, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  description: {
    fontSize: 17,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: 10,
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  bottomContainer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
    alignItems: "center",
  },
  indicatorContainer: {
    flexDirection: "row",
    marginBottom: 40,
    height: 10,
    alignItems: "center",
  },
  indicator: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#4A5568",
  },
  backButtonText: {
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  nextButton: {
    backgroundColor: "#FF8C42",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#FF8C42",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    minWidth: 160,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
});

export default Onboarding;
