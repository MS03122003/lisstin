import { router } from 'expo-router';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Animated, 
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';


const { width } = Dimensions.get('window');


// Get status bar height
const getStatusBarHeight = () => {
  if (Platform.OS === 'android') {
    return StatusBar.currentHeight || 24;
  }
  // For iOS, you can use a library like react-native-iphone-x-helper
  // or use a default safe value
  return 44; // Default iOS status bar height
};


interface HeaderProps {
  greeting?: string;
  userName?: string;
  onMenuPress?: () => void;
}


interface MenuItem {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
}


const Header: React.FC<HeaderProps> = ({ 
  greeting = "Good Evening", 
  userName = "John Doe",
  onMenuPress 
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-width))[0];


  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'Dashboard',
      icon: 'home',
      onPress: () => {
        console.log('Dashboard pressed');
        closeMenu();
      }
    },
    {
      id: '2',
      title: 'Transactions',
      icon: 'list',
      onPress: () => {
         router.push('/transactions');
        closeMenu();
      }
    },
    {
      id: '3',
      title: 'Analytics',
      icon: 'chart',
      onPress: () => {
         router.push('/analysis');
        closeMenu();
      }
    },
    {
      id: '4',
      title: 'Budget',
      icon: 'target',
      onPress: () => {
        console.log('Budget pressed');
        closeMenu();
      }
    },
    {
      id: '5',
      title: 'Profile',
      icon: 'user',
      onPress: () => {
        console.log('Profile pressed');
        closeMenu();
      }
    },
    {
      id: '6',
      title: 'Settings',
      icon: 'settings',
      onPress: () => {
        console.log('Settings pressed');
        closeMenu();
      }
    },
  ];


  const openMenu = () => {
    setIsMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    onMenuPress?.();
  };


  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsMenuVisible(false);
    });
  };


  const HamburgerIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24">
      <Line x1="3" y1="6" x2="21" y2="6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
      <Line x1="3" y1="12" x2="21" y2="12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
      <Line x1="3" y1="18" x2="21" y2="18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );


  const getMenuIcon = (iconType: string) => {
    switch (iconType) {
      case 'home':
        return (
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <Path 
              d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" 
              stroke="#00D4AA" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <Path 
              d="M9 22V12h6v10" 
              stroke="#00D4AA" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'list':
        return (
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <Line x1="8" y1="6" x2="21" y2="6" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round"/>
            <Line x1="8" y1="12" x2="21" y2="12" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round"/>
            <Line x1="8" y1="18" x2="21" y2="18" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round"/>
            <Line x1="3" y1="6" x2="3.01" y2="6" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round"/>
            <Line x1="3" y1="12" x2="3.01" y2="12" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round"/>
            <Line x1="3" y1="18" x2="3.01" y2="18" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round"/>
          </Svg>
        );
      case 'chart':
        return (
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <Path 
              d="M18 20V10M12 20V4M6 20v-6" 
              stroke="#00D4AA" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'target':
        return (
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <Path 
              d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" 
              stroke="#00D4AA" 
              strokeWidth="2"
            />
            <Path 
              d="M12 18c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z" 
              stroke="#00D4AA" 
              strokeWidth="2"
            />
            <Path 
              d="M12 14c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" 
              stroke="#00D4AA" 
              strokeWidth="2"
            />
          </Svg>
        );
      case 'user':
        return (
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <Path 
              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" 
              stroke="#00D4AA" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <Path 
              d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" 
              stroke="#00D4AA" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'settings':
        return (
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <Path 
              d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" 
              stroke="#00D4AA" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <Path 
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" 
              stroke="#00D4AA" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </Svg>
        );
      default:
        return null;
    }
  };


  return (
    <>
      <View style={[styles.header, { paddingTop: getStatusBarHeight() + 10 }]}>
        {/* Left side - Menu and App Name */}
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
            <HamburgerIcon />
          </TouchableOpacity>
          <View style={styles.appInfo}>
            <Text style={styles.appName}>LisstIn</Text>
            <Text style={styles.appTagline}>Let AI speak with Money</Text>
          </View>
        </View>


        {/* Right side - User Info */}
        {/* <View style={styles.headerRight}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View> */}
      </View>


      {/* Slide-out Menu Modal */}
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeMenu}
        >
          <Animated.View 
            style={[
              styles.menuContainer,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              {/* Menu Header */}
              <View style={[styles.menuHeader, { paddingTop: getStatusBarHeight() + 20 }]}>
                <Text style={styles.menuAppName}>LisstIn</Text>
                <Text style={styles.menuSubtitle}>Financial Management</Text>
                <TouchableOpacity style={styles.closeButton} onPress={closeMenu}>
                  <Svg width="20" height="20" viewBox="0 0 24 24">
                    <Line x1="18" y1="6" x2="6" y2="18" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                    <Line x1="6" y1="6" x2="18" y2="18" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                  </Svg>
                </TouchableOpacity>
              </View>


              {/* User Info in Menu */}
              <View style={styles.menuUserInfo}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userInitial}>{userName.charAt(0)}</Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.menuUserName}>{userName}</Text>
                  <Text style={styles.menuUserGreeting}>{greeting}</Text>
                </View>
              </View>


              {/* Menu Items */}
              <View style={styles.menuItems}>
                {menuItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={item.onPress}
                  >
                    <View style={styles.menuItemIcon}>
                      {getMenuIcon(item.icon)}
                    </View>
                    <Text style={styles.menuItemText}>{item.title}</Text>
                    <Svg width="16" height="16" viewBox="0 0 24 24">
                      <Path 
                        d="M9 18l6-6-6-6" 
                        stroke="#999" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </TouchableOpacity>
                ))}
              </View>


              {/* Menu Footer */}
              <View style={styles.menuFooter}>
                <TouchableOpacity style={styles.logoutButton} onPress={closeMenu}>
                  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <Path 
                      d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" 
                      stroke="#FF6B6B" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </Svg>
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 5,
    // Removed paddingTop as it's now dynamic
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  appTagline: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  greeting: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  
  // Modal and Menu Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  menuHeader: {
    backgroundColor: '#00D4AA',
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: 'relative',
    // paddingTop is now dynamic
  },
  menuAppName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  menuSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  closeButton: {
    position: 'absolute',
    top: getStatusBarHeight() + 20,
    right: 20,
    padding: 8,
  },
  menuUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F8F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00D4AA',
  },
  userDetails: {
    flex: 1,
  },
  menuUserName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  menuUserGreeting: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  menuItems: {
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  menuFooter: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
});


export default Header;