import { Text, View } from "react-native";
import Header  from "@/components/header";

export default function AIScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <Text style={{ fontSize: 20, fontWeight: "600", textAlign: "center", marginTop: 20 }}>
        🤖 AI Screen
      </Text>
    </View>
  );
}
