// screens/WithdrawScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import axiosInstance from "utils/api/axiosInstance";
import COLORS from "constants/colors";

export default function WithdrawScreen() {
  const [amount, setAmount] = useState("");
  const [accountInfo, setAccountInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const requestWithdrawal = async () => {
    if (!amount.trim() || !accountInfo.trim()) {
      return Alert.alert("تنبيه", "الرجاء تعبئة كل الحقول");
    }

    setLoading(true);
    try {
      await axiosInstance.post("/wallet/withdraw-request", {
        amount: Number(amount),
        accountInfo,
        method: "agent",
      });
      Alert.alert("نجاح", "تم إرسال طلبك إلى الإدارة للمراجعة");
      setAmount("");
      setAccountInfo("");
    } catch (err: any) {
      Alert.alert("حدث خطأ", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>طلب سحب رصيد</Text>

      <Text style={styles.label}>المبلغ المطلوب سحبه</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: 5000"
        placeholderTextColor={COLORS.lightText}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>تفاصيل الحساب / الوكيل</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="اكتب تفاصيل الحساب أو بيانات الوكيل"
        placeholderTextColor={COLORS.lightText}
        value={accountInfo}
        onChangeText={setAccountInfo}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        onPress={requestWithdrawal}
        style={[styles.button, loading && { opacity: 0.7 }]}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>طلب سحب</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // خلفية بيضاء متناسقة
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontFamily: "Cairo-Regular",
    color: COLORS.primary,
    marginBottom: 25,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightText,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: COLORS.primary, // لون البوتون (#8B4B47)
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Cairo-Regular",
  },
});
