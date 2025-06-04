import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import { API_URL } from "utils/api/config";


export default function OTPVerificationScreen() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const { email, userId } = route.params || {};

  const handleVerify = async () => {
    if (!userId || !code) {
      Alert.alert(
        "بيانات ناقصة",
        "يرجى التأكد من أن رمز التحقق ومعرف المستخدم موجودان."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/users/otp/verify`, {
        code,
        userId,
        email, // أضف هذا
        purpose: "verifyEmail",
      });

      if (response.data.message === "تم التحقق بنجاح") {
        Alert.alert("🎉 تم التحقق", "تم تأكيد بريدك الإلكتروني بنجاح.");
        navigation.replace("MainApp"); // ✏️ غيّرها حسب ما تريد
      } else {
        Alert.alert("❌ خطأ", "رمز التحقق غير صالح أو منتهي.");
      }
    } catch (err) {
      console.error("❌ Axios Error:", err);
      Alert.alert(
        "فشل التحقق",
        "حدث خطأ أثناء محاولة التحقق. تأكد من الاتصال بالإنترنت."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>أدخل رمز التحقق</Text>
      <Text style={styles.subtitle}>تم إرسال رمز تحقق إلى بريدك: {email}</Text>

      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        placeholder="رمز مكون من 6 أرقام"
        maxLength={6}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>تحقق الآن</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#D84315",
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});
