import { View, Text, StyleSheet } from "react-native";
import Header from "../components/header"; // adjust if folder is different

export default function Expense() {
  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.text}>This is the Expense Page</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" , backgroundColor: "#f8f8f8" },
  text: { fontSize: 20, color: "#333" },
});
