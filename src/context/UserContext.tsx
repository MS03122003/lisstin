import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, UserData, ApiResponse } from '../service/api';

interface UserContextType {
  user: UserData | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: UserData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updateData: Partial<UserData>) => Promise<void>;
  refreshUser: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'lisst_in_user';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && user.phoneVerified && user.isFIconnect;

  // Load user from storage on app start
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      
      if (userData) {
        const parsedUser: UserData = JSON.parse(userData);
        console.log('Loaded user from storage:', parsedUser);
        setUser(parsedUser);
        
        // Refresh user data from server in background
        setTimeout(() => {
          refreshUserData(parsedUser.phoneNumber);
        }, 1000);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      // Clear corrupted data
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async (phoneNumber: string) => {
    try {
      console.log('Refreshing user data for:', phoneNumber);
      const response: ApiResponse = await authAPI.getUserProfile(phoneNumber);
      
      if (response.success && response.user) {
        console.log('User data refreshed:', response.user);
        setUser(response.user);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
      } else {
        console.warn('Failed to refresh user data:', response.error);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // Don't throw error, just log it
    }
  };

  const login = async (userData: UserData) => {
    try {
      console.log('Logging in user:', userData);
      setUser(userData);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user to storage:', error);
      throw new Error('Failed to save user data');
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user');
      setUser(null);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Error during logout:', error);
      throw new Error('Failed to logout');
    }
  };

  const updateProfile = async (updateData: Partial<UserData>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      console.log('Updating profile:', updateData);
      const response: ApiResponse = await authAPI.updateUserProfile(
        user.phoneNumber, 
        updateData
      );
      
      if (response.success && response.user) {
        console.log('Profile updated successfully:', response.user);
        setUser(response.user);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (!user) {
      console.warn('No user to refresh');
      return;
    }
    
    await refreshUserData(user.phoneNumber);
  };

  const deleteAccount = async () => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      console.log('Deleting account for:', user.phoneNumber);
      const response: ApiResponse = await authAPI.deleteUserAccount(user.phoneNumber);
      
      if (response.success) {
        console.log('Account deleted successfully');
        await logout();
      } else {
        throw new Error(response.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  const contextValue: UserContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    refreshUser,
    deleteAccount,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Hook for authentication status
export const useAuth = () => {
  const { user, loading, isAuthenticated } = useUser();
  return { user, loading, isAuthenticated };
};

export default UserProvider;
