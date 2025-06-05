// screens/GamePackagesScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "utils/api/axiosInstance";
import COLORS from "constants/colors";

// قائمة باقات الألعاب مع مسار شعار كل باقة
const gamePackages = [
  {
    label: "PUBG - 60 UC",
    value: "pubg_60uc",
    logo: require("../../../../assets/packages/pubg.png"),
  },
  {
    label: "FreeFire - 310 Diamonds",
    value: "freefire_310",
    logo: require("../../../../assets/packages/freefire.png"),
  },
  {
    label: "Google Play - $10",
    value: "google_10",
    logo: require("../../../../assets/packages/google.png"),
  },
  {
    label: "iTunes - $15",
    value: "itunes_15",
    logo: require("../../../../assets/packages/itunes.png"),
  },
];

// نحسب عرض البطاقة بناءً على عرض الشاشة
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2; // (عرض الشاشة - الحواف: 20 + 20) - مسافة بين البطاقتين: 20، مقسوم على 2

export default function GamePackagesScreen() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [playerId, setPlayerId] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!playerId) {
      return Alert.alert("تنبيه", "الرجاء إدخال معرف اللاعب أو الحساب");
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("firebase-token");
      const res = await axiosInstance.post(
        "/api/topup",
        { product: selectedPackage, recipient: playerId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("تم الشراء", `النتيجة: ${res.data.status}`);
    } catch (err: any) {
      Alert.alert(
        "فشل العملية",
        err.response?.data?.message || "خطأ غير معروف"
      );
    } finally {
      setLoading(false);
    }
  };

  // إذا لم يُختَر باقة بعد، نعرض البطاقات
  if (!selectedPackage) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>اختر باقة اللعبة</Text>
        <View style={styles.grid}>
          {gamePackages.map((pkg) => (
            <TouchableOpacity
              key={pkg.value}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => {
                setSelectedPackage(pkg.value);
                setSelectedLabel(pkg.label);
              }}
            >
              <Image source={pkg.logo} style={styles.logo} resizeMode="contain" />
              <Text style={styles.cardLabel}>{pkg.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  // بعد اختيار الباقة: نعرض فورم إدخال معرف اللاعب وزر الشراء
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          // العودة لاختيار الباقة
          setSelectedPackage(null);
          setSelectedLabel("");
          setPlayerId("");
        }}
        style={styles.backButton}
      >
        <Text style={styles.backText}>◀ رجوع</Text>
      </TouchableOpacity>

      <View style={styles.selectedInfo}>
        <Text style={styles.selectedLabelText}>الباقة المختارة:</Text>
        <Text style={styles.packageName}>{selectedLabel}</Text>
      </View>

      <Text style={styles.label}>معرّف اللاعب / الحساب</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: 123456789"
        placeholderTextColor={COLORS.lightText}
        value={playerId}
        onChangeText={setPlayerId}
      />

      <TouchableOpacity
        onPress={handlePurchase}
        style={[styles.button, loading && { opacity: 0.7 }]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>شراء الباقة</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // الحاوية الرئيسية
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },

  // عنوان اختيار الباقة
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // شعار الباقة داخل البطاقة
  logo: {
    width: CARD_WIDTH * 0.6,
    height: CARD_WIDTH * 0.4,
    marginBottom: 12,
  },

  // نص اسم الباقة داخل البطاقة
  cardLabel: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
    textAlign: "center",
  },

  // زر العودة بعد اختيار الباقة
  backButton: {
    marginBottom: 15,
  },
  backText: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.primary,
  },

  // قسم يعرض الباقة المختارة
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
  packageName: {
    fontSize: 18,
    fontFamily: "Cairo-Regular",
    color: COLORS.primary,
  },

  // عنوان حقل إدخال معرف اللاعب
  label: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
    marginBottom: 8,
  },

  // حقل إدخال معرف اللاعب
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

  // زر الشراء
  button: {
    backgroundColor: COLORS.accent, // لون البوتون (#8B4B47)
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Cairo-Regular",
    textAlign: "center",
  },
});
