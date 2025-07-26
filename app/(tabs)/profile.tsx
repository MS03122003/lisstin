import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const Profile = () => {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  const userStats = {
    totalExpenses: 21,
    monthlySavings: 30000,
    categoriesOptimized: 85,
    learningStreak: 7,
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'personal-info',
          title: 'Personal Information',
          icon: 'person-outline',
          action: () => router.push('/profile/personal-info'),
        },
        {
          id: 'financial-goals',
          title: 'Financial Goals',
          icon: 'flag-outline',
          action: () => router.push('/profile/goals'),
        },
        {
          id: 'budget-settings',
          title: 'Budget Settings',
          icon: 'calculator-outline',
          action: () => router.push('/profile/budget'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          icon: 'notifications-outline',
          toggle: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          id: 'biometric',
          title: 'Biometric Authentication',
          icon: 'finger-print-outline',
          toggle: biometricEnabled,
          onToggle: setBiometricEnabled,
        },
        {
          id: 'dark-mode',
          title: 'Dark Mode',
          icon: 'moon-outline',
          toggle: darkModeEnabled,
          onToggle: setDarkModeEnabled,
        },
        {
          id: 'language',
          title: 'Language',
          icon: 'language-outline',
          subtitle: 'English',
          action: () => router.push('/profile/language'),
        },
      ],
    },
    {
      title: 'Data & Privacy',
      items: [
        {
          id: 'export-data',
          title: 'Export Data',
          icon: 'download-outline',
          action: () => Alert.alert('Export Data', 'Your data export will be ready in a few minutes.'),
        },
        {
          id: 'data-usage',
          title: 'Data Usage',
          icon: 'analytics-outline',
          action: () => router.push('/profile/data-usage'),
        },
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          icon: 'shield-checkmark-outline',
          action: () => router.push('/profile/privacy'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help-center',
          title: 'Help Center',
          icon: 'help-circle-outline',
          action: () => router.push('/profile/help'),
        },
        {
          id: 'contact-support',
          title: 'Contact Support',
          icon: 'chatbubble-outline',
          action: () => Alert.alert('Contact Support', 'Opening support chat...'),
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          icon: 'star-outline',
          action: () => router.push('/profile/feedback'),
        },
        {
          id: 'rate-app',
          title: 'Rate LisstIn',
          icon: 'heart-outline',
          action: () => Alert.alert('Rate App', 'Thank you for supporting LisstIn!'),
        },
      ],
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Handle logout logic
            router.replace('/(auth)/signup');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>MS</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Mahabuf Sheriff H</Text>
            <Text style={styles.userEmail}>mssheriff114@gmail.com</Text>
            <View style={styles.membershipBadge}>
              <Ionicons name="diamond" size={14} color="#FFD700" />
              <Text style={styles.membershipText}>Premium Member</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => router.push('/profile/edit')}
          >
            <Ionicons name="create-outline" size={20} color="#e34c00" />
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your LisstIn Journey</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="receipt-outline" size={24} color="#e34c00" />
              </View>
              <Text style={styles.statNumber}>{userStats.totalExpenses}</Text>
              <Text style={styles.statLabel}>Total Expenses</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="trending-up-outline" size={24} color="#FFD700" />
              </View>
              <Text style={styles.statNumber}>₹{userStats.monthlySavings.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Monthly Savings</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="analytics-outline" size={24} color="#FF6B6B" />
              </View>
              <Text style={styles.statNumber}>{userStats.categoriesOptimized}%</Text>
              <Text style={styles.statLabel}>Categories Optimized</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="flame-outline" size={24} color="#45B7D1" />
              </View>
              <Text style={styles.statNumber}>{userStats.learningStreak}</Text>
              <Text style={styles.statLabel}>Learning Streak</Text>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            <View style={styles.menuItems}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    itemIndex === section.items.length - 1 && styles.lastMenuItem
                  ]}
                  onPress={item.action}
                  disabled={item.toggle !== undefined}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuItemIcon}>
                      <Ionicons name={item.icon as any} size={20} color="#CBD5E0" />
                    </View>
                    <View style={styles.menuItemContent}>
                      <Text style={styles.menuItemTitle}>{item.title}</Text>
                      {item.subtitle && (
                        <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.menuItemRight}>
                    {item.toggle !== undefined ? (
                      <Switch
                        value={item.toggle}
                        onValueChange={item.onToggle}
                        trackColor={{ false: '#2D3748', true: '#e34c00' }}
                        thumbColor={item.toggle ? '#FFFFFF' : '#CBD5E0'}
                      />
                    ) : (
                      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App Information */}
        <View style={styles.appInfoContainer}>
          <View style={styles.appInfoHeader}>
            <View style={styles.appLogo}>
              <Text style={styles.appLogoText}>Li</Text>
            </View>
            <View>
              <Text style={styles.appName}>LisstIn</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
            </View>
          </View>

          <View style={styles.appInfoLinks}>
            <TouchableOpacity style={styles.infoLink}>
              <Text style={styles.infoLinkText}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.infoLinkSeparator}>•</Text>
            <TouchableOpacity style={styles.infoLink}>
              <Text style={styles.infoLinkText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#1A202C',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e34c00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e34c00',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1A202C',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 8,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  membershipText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
    marginLeft: 4,
  },
  editProfileButton: {
    padding: 8,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1A202C',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '47%',
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2D3748',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  menuItems: {
    backgroundColor: '#1A202C',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D3748',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  menuItemRight: {
    alignItems: 'center',
  },
  appInfoContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  appInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  appLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e34c00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  appVersion: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  appInfoLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLink: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  infoLinkText: {
    fontSize: 14,
    color: '#e34c00',
    fontWeight: '500',
  },
  infoLinkSeparator: {
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A202C',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    marginBottom: 32,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default Profile;
