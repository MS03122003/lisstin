import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-250));
  const navigation = useNavigation();

  const toggleMenu = () => {
    if (menuOpen) {
      // Close menu - slide left
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuOpen(false));
    } else {
      // Open menu - slide right
      setMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -250,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuOpen(false));
  };

  const navigateTo = (screen: string) => {
    closeMenu();
    navigation.navigate(screen as never);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerContainer}>
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={toggleMenu}>
            <Feather name="menu" size={26} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>FRANTIGER</Text>
        </View>

        {/* <TouchableOpacity onPress={() => alert("Profile tapped!")}>
          <Ionicons name="person-circle-outline" size={30} color="#333" />
        </TouchableOpacity> */}
      </View>

      {/* Overlay */}
      {menuOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeMenu}
        />
      )}

      {/* Side Menu */}
      {menuOpen && (
        <Animated.View
          style={[
            styles.menuContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.menuHeader}>
            <Text style={styles.menuHeaderText}>Menu</Text>
            <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo("Expense")}
          >
            <Ionicons
              name="wallet-outline"
              size={20}
              color="#333"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo("Goal")}
          >
            <Ionicons
              name="flag-outline"
              size={20}
              color="#333"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Goal Simulator</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo("Payment")}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#333"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Upcoming Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo("Insight")}
          >
            <Ionicons
              name="analytics-outline"
              size={20}
              color="#333"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Insights</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo("Account")}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color="#333"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>My Account</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#a9a5a5ff",
    elevation: 3,
    zIndex: 1000,
  },
  headerContainer: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#8e8c8cff",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 999,
    height: Dimensions.get("window").height,
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 250,
    height: Dimensions.get("window").height,
    backgroundColor: "#ffffff",
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f8f8f8",
  },
  menuHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
});
