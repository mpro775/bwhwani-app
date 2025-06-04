// screens/TransportScreen.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "types/navigation";

const TransportScreen = () => {
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TransportBooking'>;

const navigation = useNavigation<NavigationProp>();

const handleSelect = (category: 'waslni' | 'heavy') => {
  navigation.navigate("TransportBooking", { category });
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>اختر نوع النقل</Text>

      <Pressable style={styles.option} onPress={() => handleSelect("waslni")}>
        <Ionicons name="woman-outline" size={36} color="#e91e63" />
        <Text style={styles.optionText}>نقل نسائي</Text>
      </Pressable>

      <Pressable style={styles.option} onPress={() => handleSelect("heavy")}>
        <MaterialIcons name="local-shipping" size={36} color="#3f51b5" />
        <Text style={styles.optionText}>نقل أثاث ومعدات</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: "Cairo-Bold",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 24,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  optionText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 18,
    marginLeft: 16,
  },
});

export default TransportScreen;
