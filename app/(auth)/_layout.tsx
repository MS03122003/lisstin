import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      {/* <Stack.Screen name="fi-mcp-code" options={{ headerShown: false }} /> */}
    </Stack>
  );
}
