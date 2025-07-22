import { Text, View } from "react-native";
import Header from "../../components/header"; // adjust if folder is different

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>👤 Profile Screen</Text>
      </View>
    </View>
  );
}
