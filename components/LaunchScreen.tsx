import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const LaunchScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations sequence
    const animationSequence = Animated.sequence([
      // Fade in and scale logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Slide up tagline
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);

    // Start pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    animationSequence.start();
    
    // Start pulse after initial animation
    setTimeout(() => {
      pulseAnimation.start();
    }, 1000);

    return () => {
      pulseAnimation.stop();
    };
  }, [fadeAnim, scaleAnim, pulseAnim, slideAnim]);

  const renderLogo = () => (
    <Svg width="120" height="120" viewBox="0 0 120 120">
      <Defs>
        <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#e34c00" />
          <Stop offset="50%" stopColor="#44A08D" />
          <Stop offset="100%" stopColor="#e34c00" />
        </LinearGradient>
      </Defs>
      
      {/* Outer ring */}
      <Circle 
        cx="60" 
        cy="60" 
        r="55" 
        fill="none" 
        stroke="url(#logoGradient)" 
        strokeWidth="2" 
        opacity="0.3" 
      />
      
      {/* Middle ring */}
      <Circle 
        cx="60" 
        cy="60" 
        r="40" 
        fill="none" 
        stroke="url(#logoGradient)" 
        strokeWidth="3" 
        opacity="0.6" 
      />
      
      {/* Main logo circle */}
      <Circle cx="60" cy="60" r="25" fill="url(#logoGradient)" />
      
      {/* Logo text */}
      <G>
        <SvgText 
          x="60" 
          y="68" 
          fontSize="18" 
          fill="#FFFFFF" 
          fontWeight="bold" 
          textAnchor="middle"
          fontFamily="System"
        >
          Li
        </SvgText>
      </G>
    </Svg>
  );

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0F1419"
        translucent={false}
      />
      
      <View style={styles.container}>
        {/* Background gradient elements */}
        <View style={styles.backgroundCircle1} />
        <View style={styles.backgroundCircle2} />
        <View style={styles.backgroundCircle3} />

        {/* Main content */}
        <View style={styles.content}>
          {/* Animated logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: Animated.multiply(scaleAnim, pulseAnim) },
                ],
              },
            ]}
          >
            {renderLogo()}
          </Animated.View>

          {/* App name */}
          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.appName}>LisstIn</Text>
          </Animated.View>

          {/* Tagline */}
          <Animated.View
            style={[
              styles.taglineContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.tagline}>Listen to Your Money</Text>
            <Text style={styles.subtitle}>List Your Dreams</Text>
          </Animated.View>

          {/* Loading indicator */}
          <Animated.View
            style={[
              styles.loadingContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.loadingBar}>
              <Animated.View
                style={[
                  styles.loadingProgress,
                  {
                    transform: [{ scaleX: pulseAnim }],
                  },
                ]}
              />
            </View>
            <Text style={styles.loadingText}>Initializing your financial journey...</Text>
          </Animated.View>
        </View>

        {/* Bottom branding */}
        <Animated.View
          style={[
            styles.bottomContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2025 LisstIn. All rights reserved.</Text>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1419',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#e34c00',
    opacity: 0.05,
  },
  backgroundCircle2: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#44A08D',
    opacity: 0.03,
  },
  backgroundCircle3: {
    position: 'absolute',
    top: height * 0.3,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#e34c00',
    opacity: 0.04,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 30,
  },
  titleContainer: {
    marginBottom: 20,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    textAlign: 'center',
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  tagline: {
    fontSize: 18,
    color: '#e34c00',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#e34c00',
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 280,
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#2D3748',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loadingProgress: {
    width: '60%',
    height: '100%',
    backgroundColor: '#e34c00',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  copyrightText: {
    fontSize: 11,
    color: '#4A5568',
    textAlign: 'center',
  },
});

export default LaunchScreen;