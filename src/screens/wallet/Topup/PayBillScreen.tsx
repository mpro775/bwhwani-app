// screens/PayBillScreen.tsx
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
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "utils/api/axiosInstance";

const services = [
  { label: "كهرباء", value: "electricity_1000" },
  { label: "ماء", value: "water_500" },
  { label: "إنترنت", value: "internet_2500" },
];

export default function PayBillScreen() {
  const [service, setService] = useState(services[0].value);
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!account) return Alert.alert("أدخل رقم الحساب");

    setLoading(true);
    try {
                const token = await AsyncStorage.getItem("firebase-token");

      const res = await axiosInstance.post(
  "/pay-bill",
  { product: service, recipient: account },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
      Alert.alert("تم الدفع", `النتيجة: ${res.data.status}`);
    } catch (err: any) {
      Alert.alert("فشل الدفع", err.response?.data?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>اختر نوع الفاتورة</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={service} onValueChange={(value) => setService(value)}>
          {services.map((s) => (
            <Picker.Item label={s.label} value={s.value} key={s.value} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>رقم الحساب</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: 100456789"
        keyboardType="numeric"
        value={account}
        onChangeText={setAccount}
      />

      <TouchableOpacity onPress={handlePay} style={styles.button}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>تسديد الفاتورة</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, marginVertical: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10 },
  pickerWrapper: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5 },
  button: { backgroundColor: "#5D4037", padding: 15, marginTop: 20, borderRadius: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16 },
});
