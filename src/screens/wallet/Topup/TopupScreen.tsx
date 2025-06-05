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
  Image,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "utils/api/axiosInstance";
import COLORS from "constants/colors";

// بيانات الشبكات (يمكنك تعديل مسارات الشعار حسب مشروعك)
const networks = [
  {
    label: "سبأفون",
    value: "sabafon_500",
    logo: require("../../../../assets/networks/sabafon.png"),
  },
  {
    label: "يو",
    value: "you_500",
    logo: require("../../../../assets/networks/you.png"),
  },
  {
    label: "يمن موبايل",
    value: "yemenmobile_500",
    logo: require("../../../../assets/networks/ymobile.png"),
  },
];

// نحسب عرض البطاقة بناءً على عرض الشاشة
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2; // (حجم الشاشة - الحواف) / 2

export default function TopupScreen() {
  // selectedNetwork === null يعني ما اخترنا أي بطاقة بعد
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);

  // دالة استدعاء الشحن
  const handleTopup = async () => {
    if (!recipient) {
      return Alert.alert("تنبيه", "الرجاء إدخال رقم الهاتف");
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("firebase-token");
      const res = await axiosInstance.post(
        "/topup",
        { product: selectedNetwork, recipient },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("تمت العملية", `النتيجة: ${res.data.status}`);
    } catch (err: any) {
      Alert.alert(
        "فشل الشحن",
        err.response?.data?.message || "حدث خطأ غير متوقع"
      );
    } finally {
      setLoading(false);
    }
  };

  // إذا لم يختر المستخدم شبكة بعد، نعرض شبكة من البطاقات
  if (!selectedNetwork) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>اختر شبكة الشحن</Text>
        <View style={styles.grid}>
          {networks.map((net) => (
            <TouchableOpacity
              key={net.value}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => {
                setSelectedNetwork(net.value);
                setSelectedLabel(net.label);
              }}
            >
              <Image
                source={net.logo}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.cardLabel}>{net.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  // عندما يختار المستخدم شبكة، نعرض واجهة إدخال الرقم وزر الشحن
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          // للعودة لاختيار الشبكة
          setSelectedNetwork(null);
          setSelectedLabel("");
          setRecipient("");
        }}
        style={styles.backButton}
      >
        <Text style={styles.backText}>◀ رجوع</Text>
      </TouchableOpacity>

      <View style={styles.selectedInfo}>
        <Text style={styles.selectedLabelText}>الشبكة المختارة:</Text>
        <Text style={styles.networkName}>{selectedLabel}</Text>
      </View>

      <Text style={styles.label}>رقم الهاتف</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: 7"
        placeholderTextColor={COLORS.lightText}
        keyboardType="numeric"
        value={recipient}
        onChangeText={setRecipient}
      />

      <TouchableOpacity
        onPress={handleTopup}
        style={[styles.button, loading && { opacity: 0.7 }]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>شحن الرصيد</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // الحاوية العامة
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },

  // عنوان شاشة اختيار الشبكة
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

  // بطاقة الشبكة الواحدة
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
    // ظل خفيف لرفع المظهر
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // صورة الشعار داخل البطاقة
  logo: {
    width: CARD_WIDTH * 0.6,
    height: CARD_WIDTH * 0.4,
    marginBottom: 12,
  },

  // اسم الشبكة تحت الشعار
  cardLabel: {
    fontSize: 18,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
  },

  // زر العودة عند اختيار الشبكة
  backButton: {
    marginBottom: 15,
  },
  backText: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.primary,
  },

  // القسم الذي يعرض الشبكة المختارة
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
  networkName: {
    fontSize: 18,
    fontFamily: "Cairo-Regular",
    color: COLORS.primary,
  },

  // عنوان حقل الرقم
  label: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
    marginBottom: 8,
  },

  // حقل إدخال رقم الهاتف
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

  // زر الشحن
  button: {
    backgroundColor: COLORS.primary,
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
