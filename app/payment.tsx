import Header from "@/components/header";
import { View, Text, StyleSheet } from "react-native";

export default function Payment() {
  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.text}>This is the Payment Page</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f8f8" },
  text: { fontSize: 20 , color: "#333" },
});
