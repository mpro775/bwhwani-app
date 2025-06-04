// screens/GamePackagesScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "utils/api/axiosInstance";

const gamePackages = [
  { label: "PUBG - 60 UC", value: "pubg_60uc" },
  { label: "FreeFire - 310 Diamonds", value: "freefire_310" },
  { label: "Google Play - $10", value: "google_10" },
  { label: "iTunes - $15", value: "itunes_15" },
];

export default function GamePackagesScreen() {
  const [product, setProduct] = useState(gamePackages[0].value);
  const [playerId, setPlayerId] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!playerId) return Alert.alert("أدخل معرف اللاعب");

    setLoading(true);
    try {
                const token = await AsyncStorage.getItem("firebase-token");

      const res = await  axiosInstance.post(
  "/api/topup",
  { product, recipient: playerId },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
      Alert.alert("تم الشراء", `النتيجة: ${res.data.status}`);
    } catch (err: any) {
      Alert.alert("فشل العملية", err.response?.data?.message || "خطأ غير معروف");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>اختر الباقة</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={product} onValueChange={(v) => setProduct(v)}>
          {gamePackages.map((p) => (
            <Picker.Item label={p.label} value={p.value} key={p.value} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>معرّف اللاعب / الحساب</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: 123456789"
        value={playerId}
        onChangeText={setPlayerId}
      />

      <TouchableOpacity onPress={handlePurchase} style={styles.button}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>شراء الباقة</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#FFF8F0" },
  label: { fontSize: 16, fontWeight: "bold", marginVertical: 10, color: "#3E2723" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10 },
  pickerWrapper: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5 },
  button: {
    backgroundColor: "#8B4B47",
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16 },
});
