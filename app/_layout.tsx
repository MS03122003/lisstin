import React, { useState, useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, StatusBar } from 'react-native';
import LaunchScreen from '../components/LaunchScreen';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showLaunch, setShowLaunch] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate app initialization (you can add real initialization logic here)
        // For example: loading user data, checking authentication, etc.
        await new Promise(resolve => setTimeout(resolve, 3000)); // Minimum 3 seconds
        
        // Additional initialization tasks can go here
        // await loadUserData();
        // await initializeAnalytics();
        // await checkAppUpdates();
        
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setShowLaunch(false);
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, []);

  if (showLaunch || !isReady) {
    return <LaunchScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0F1419"
        translucent={false}
      />
      
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#0F1419',
          },
          animation: Platform.OS === 'ios' ? 'default' : 'fade',
        }}
      >
        {/* Authentication group */}
        <Stack.Screen 
          name="(auth)" 
          options={{ 
            headerShown: false,
            gestureEnabled: false, // Prevent swipe back on auth screens
          }} 
        />
        
        {/* Main app tabs */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
          }} 
        />
        
        {/* Individual screen groups */}
        <Stack.Screen 
          name="expense" 
          options={{ 
            headerShown: false,
            presentation: 'modal', // Modal presentation for expense screens
          }} 
        />
        
        <Stack.Screen 
          name="voice" 
          options={{ 
            headerShown: false,
            presentation: 'modal',
          }} 
        />
        
        <Stack.Screen 
          name="learning" 
          options={{ 
            headerShown: false,
          }} 
        />
        
        <Stack.Screen 
          name="profile" 
          options={{ 
            headerShown: false,
          }} 
        />
        
        {/* Legacy routes (if you have them) */}
        <Stack.Screen 
          name="transactions" 
          options={{ 
            headerShown: false,
          }} 
        />
        
        <Stack.Screen 
          name="analysis" 
          options={{ 
            headerShown: false,
          }} 
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
