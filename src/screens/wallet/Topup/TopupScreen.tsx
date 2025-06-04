// screens/TopupScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "utils/api/axiosInstance";

const networks = [
  { label: "Sabafon", value: "sabafon_500" },
  { label: "YOU", value: "you_500" },
  { label: "Yemen Mobile", value: "yemenmobile_500" },
];

export default function TopupScreen() {
  const [network, setNetwork] = useState(networks[0].value);
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTopup = async () => {
    if (!recipient) return Alert.alert("الرجاء إدخال رقم الهاتف");

    setLoading(true);
    try {
        const token = await AsyncStorage.getItem("firebase-token");

      const res = await axiosInstance.post(
  "/topup",
  { product: network, recipient },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
      Alert.alert("تمت العملية", `النتيجة: ${res.data.status}`);
    } catch (err: any) {
      Alert.alert("فشل الشحن", err.response?.data?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>اختر الشبكة</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={network} onValueChange={(value) => setNetwork(value)}>
          {networks.map((n) => (
            <Picker.Item label={n.label} value={n.value} key={n.value} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>رقم الهاتف</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: 733XXXXXXX"
        keyboardType="numeric"
        value={recipient}
        onChangeText={setRecipient}
      />

      <TouchableOpacity onPress={handleTopup} style={styles.button}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>شحن الرصيد</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, marginVertical: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10 },
  pickerWrapper: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5 },
  button: { backgroundColor: "#D84315", padding: 15, marginTop: 20, borderRadius: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16 },
});
