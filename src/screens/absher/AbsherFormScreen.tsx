// screens/AbsherFormScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "utils/api/axiosInstance";
import COLORS from "constants/colors";

export default function AbsherFormScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { category }: any = route.params;

  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!location.trim() || !details.trim()) {
      Alert.alert("تنبيه", "يرجى ملء جميع الحقول");
      return;
    }

    setLoading(true);
    try {
      // 1. احصل على Firebase ID Token من الذاكرة المحلية
      const idToken = await AsyncStorage.getItem("firebase-idToken");
      if (!idToken) {
        Alert.alert("خطأ", "لم يتم العثور على التوكن. يرجى تسجيل الدخول مرة أخرى");
        setLoading(false);
        return;
      }

      // 2. أرسل الطلب مع إضافة الهيدر Authorization
      const response = await axiosInstance.post(
        "/absher/request",
        {
          category,
          location,
          details,
        
        }
      );

      // إذا وصلنا هنا يعني الخادم أعاد 201 أو 200
      Alert.alert("تم الإرسال", response.data.message || "تم إرسال طلبك بنجاح");
      navigation.goBack();
    // داخل catch في handleSubmit
    }catch (err: any) {
  console.log("=== خطأ أثناء الإرسال ===");
  console.log("error.message:", err.message);
  if (err.response) {
    console.log("status:", err.response.status);
    console.log("headers:", err.response.headers);
    console.log("data:", err.response.data);
  }
  let serverMessage = "فشل في إرسال الطلب";
  if (err.response?.data?.message) {
    serverMessage = err.response.data.message;
  }
  Alert.alert("خطأ", serverMessage);
}
finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerText}>طلب خدمة</Text>
        <Text style={styles.subHeaderText}>{category}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>📍 الموقع</Text>
          <TextInput
            placeholder="مثال: صنعاء، شارع الزبيري"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
            placeholderTextColor={COLORS.lightText}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>📝 التفاصيل</Text>
          <TextInput
            placeholder="يرجى كتابة تفاصيل الخدمة المطلوبة"
            value={details}
            onChangeText={setDetails}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textArea]}
            placeholderTextColor={COLORS.lightText}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>إرسال الطلب</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 20,
  },
  headerText: {
    fontFamily: "Cairo-Bold",
    fontSize: 24,
    color: COLORS.primary,
    textAlign: "right",
    marginBottom: 4,
  },
  subHeaderText: {
    fontFamily: "Cairo-Regular",
    fontSize: 18,
    color: COLORS.accent,
    textAlign: "right",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: COLORS.text,
    textAlign: "right",
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  textArea: {
    height: 120,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3, // ظل أندرويد
    shadowColor: "#000", // ظل iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  submitButtonText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 18,
    color: "#FFF",
  },
});
