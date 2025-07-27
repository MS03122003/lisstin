import React, { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "../context/UserContext";
import { View, ActivityIndicator, StyleSheet } from "react-native";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return; // Wait for auth check to complete

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    console.log("AuthGuard - User:", user);
    console.log("AuthGuard - Is Authenticated:", isAuthenticated);
    console.log("AuthGuard - Current segments:", segments);

    if (!isAuthenticated && !inAuthGroup) {
      // User is not authenticated and not in auth screens
      console.log("Redirecting to auth...");
      router.replace("/(auth)/signup");
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated but still in auth screens
      console.log("Redirecting to dashboard...");
      router.replace("/(tabs)/dashboard");
    }
  }, [user, loading, isAuthenticated, segments]);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e34c00" />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F1419",
  },
});

export default AuthGuard;
