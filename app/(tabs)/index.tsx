import React from "react";
import { View, StyleSheet } from "react-native";
import Home from "../../components/home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Expense from "../expense";
import Goal from "../goal";
import Payment from "../payment";
import Insight from "../insights";
import Account from "../account";

const Stack = createNativeStackNavigator();

const IndexScreen = () => {
  return (
    <View style={styles.container}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Expense" component={Expense} />
        <Stack.Screen name="Goal" component={Goal} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Insight" component={Insight} />
        <Stack.Screen name="Account" component={Account} />
      </Stack.Navigator>
    </View>
  );
};

export default IndexScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // white background
  },
});
