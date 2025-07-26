import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "./Header";
import ExpenseHistory from "./ExpenseHistory";

const Home = () => {
  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        <ExpenseHistory />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
});
