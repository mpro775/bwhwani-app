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
  Image,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "utils/api/axiosInstance";
import COLORS from "constants/colors";

// قائمة الخدمات مع مسار شعار كل خدمة
const services = [
  {
    label: "كهرباء",
    value: "electricity_1000",
    logo: require("../../../../assets/services/electricity.png"),
  },
  {
    label: "ماء",
    value: "water_500",
    logo: require("../../../../assets/services/water.png"),
  },
  {
    label: "إنترنت",
    value: "internet_2500",
    logo: require("../../../../assets/services/internet.png"),
  },
];

// حساب عرض البطاقة بحيث تظهر بطاقتان في كل صف مع مسافات مناسبة
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2; // (عرض الشاشة - حواف  : 20+20) - مسافة بين البطاقتين (20) مقسوم على 2

export default function PayBillScreen() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);

  // دالة معالجة الدفع
  const handlePay = async () => {
    if (!account) {
      return Alert.alert("تنبيه", "الرجاء إدخال رقم الحساب");
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("firebase-token");
      const res = await axiosInstance.post(
        "/pay-bill",
        { product: selectedService, recipient: account },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("تم الدفع", `النتيجة: ${res.data.status}`);
    } catch (err: any) {
      Alert.alert(
        "فشل الدفع",
        err.response?.data?.message || "حدث خطأ غير متوقع"
      );
    } finally {
      setLoading(false);
    }
  };

  // إذا لم يُحدَّد خدمة بعد، نعرض بطاقات الخدمات
  if (!selectedService) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>اختر نوع الفاتورة</Text>
        <View style={styles.grid}>
          {services.map((svc) => (
            <TouchableOpacity
              key={svc.value}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => {
                setSelectedService(svc.value);
                setSelectedLabel(svc.label);
              }}
            >
              <Image source={svc.logo} style={styles.logo} resizeMode="contain" />
              <Text style={styles.cardLabel}>{svc.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  // بعد اختيار الخدمة، نعرض واجهة إدخال رقم الحساب وزر الدفع
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          // العودة لاختيار الخدمة من جديد
          setSelectedService(null);
          setSelectedLabel("");
          setAccount("");
        }}
        style={styles.backButton}
      >
        <Text style={styles.backText}>◀ رجوع</Text>
      </TouchableOpacity>

      <View style={styles.selectedInfo}>
        <Text style={styles.selectedLabelText}>الخدمة المختارة:</Text>
        <Text style={styles.serviceName}>{selectedLabel}</Text>
      </View>

      <Text style={styles.label}>رقم الحساب</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: 100456789"
        placeholderTextColor={COLORS.lightText}
        keyboardType="numeric"
        value={account}
        onChangeText={setAccount}
      />

      <TouchableOpacity
        onPress={handlePay}
        style={[styles.button, loading && { opacity: 0.7 }]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>تسديد الفاتورة</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // الحاوية الأساسية
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },

  // عنوان صفحة اختيار الخدمة
  title: {
    fontSize: 22,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
    marginBottom: 20,
  },

  // شبكة البطاقات
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  // تصميم البطاقة الواحدة
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
    // ظل خفيف لإبراز البطاقة
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // شعار الخدمة داخل البطاقة
  logo: {
    width: CARD_WIDTH * 0.5,
    height: CARD_WIDTH * 0.3,
    marginBottom: 12,
  },

  // نص اسم الخدمة داخل البطاقة
  cardLabel: {
    fontSize: 18,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
  },

  // زر العودة بعد اختيار الخدمة
  backButton: {
    marginBottom: 15,
  },
  backText: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.primary,
  },

  // قسم يعرض اسم الخدمة المختارة
  selectedInfo: {
    marginBottom: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedLabelText: {
    fontSize: 18,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
    marginRight: 8,
  },
  serviceName: {
    fontSize: 18,
    fontFamily: "Cairo-Regular",
    color: COLORS.primary,
  },

  // عنوان حقل إدخال رقم الحساب
  label: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
    marginBottom: 8,
  },

  // حقل إدخال رقم الحساب
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
  },

  // زر الدفع
  button: {
    backgroundColor: COLORS.primary, // اللون الثانوي (بني داكن)
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Cairo-Regular",
    textAlign: "center",
  },
});
