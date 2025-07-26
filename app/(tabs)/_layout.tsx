import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text, View } from 'react-native';

// Custom header component for Dashboard
const DashboardHeader = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <View style={{
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#e34c00',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    }}>
      <Text style={{
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
      }}>
        Li
      </Text>
    </View>
    <Text style={{
      fontSize: 18,
      fontWeight: '600',
      color: '#e34c00',
    }}>
      LisstIn
    </Text>
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#e34c00',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#1A202C',
          borderTopColor: '#2D3748',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 25 : 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: '#0F1419',
          borderBottomColor: '#2D3748',
          borderBottomWidth: 1,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
          headerTitle: () => <DashboardHeader />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
  name="website"
  options={{
    title: 'LisstIn AI',
    tabBarIcon: ({ color, size }) => (
      <MaterialCommunityIcons name="robot" size={size} color={color} />
    ),
    headerShown: false,
  }}
/>
      {/* <Tabs.Screen
        name="website"
        options={{
          title: 'Website',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="globe-outline" size={size} color={color} />
          ),
        }}
      /> */}


      <Tabs.Screen
        name="learning"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
