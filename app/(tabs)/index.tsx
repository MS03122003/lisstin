import React from "react";
import { View, StyleSheet } from "react-native";
import Home from "../../components/home"; // adjust if folder is different

const IndexScreen = () => {
  return (
    <View style={styles.container}>
      <Home />
    </View>
  );
};

export default IndexScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
