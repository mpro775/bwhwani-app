// screens/CouponListScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import axiosInstance from "utils/api/axiosInstance";
import COLORS from "constants/colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40; // عرض البطاقة مع الحواف (20 + 20)

export default function CouponListScreen() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [code, setCode] = useState<string>("");
  const [loadingCoupons, setLoadingCoupons] = useState<boolean>(true);
  const [validating, setValidating] = useState<boolean>(false);

  const fetchCoupons = async () => {
    try {
      setLoadingCoupons(true);
      const res = await axiosInstance.get("/coupons/user"); // يُرجى التأكد من المسار الفعلي في الباك
      setCoupons(res.data);
    } catch (err) {
      console.error("فشل في جلب الكوبونات:", err);
      setCoupons([]);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const validateCoupon = async () => {
    if (!code.trim()) {
      return Alert.alert("تنبيه", "الرجاء إدخال كود الكوبون");
    }

    setValidating(true);
    try {
      const res = await axiosInstance.post("/coupons/validate", { code });
      const { coupon } = res.data;
      const valueText =
        coupon.type === "percentage"
          ? `${coupon.value}%`
          : coupon.type === "fixed"
          ? `${coupon.value} YER`
          : "شحن مجاني";
      Alert.alert("✅ صالح", `الكوبون يعطي ${valueText}`);
      setCode("");
      fetchCoupons(); // إعادة جلب الكوبونات بعد التحقق
    } catch (err: any) {
      Alert.alert(
        "❌ خطأ",
        err.response?.data?.error || "فشل التحقق من الكوبون"
      );
    } finally {
      setValidating(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const renderCoupon = ({ item }: { item: any }) => {
    // صياغة نص العرض بناءً على نوع الكوبون
    const discountText =
      item.type === "percentage"
        ? `خصم ${item.value}%`
        : item.type === "fixed"
        ? `خصم ${item.value} YER`
        : `شحن مجاني`;

    return (
      <View style={styles.card}>
        <Text style={styles.code}>{item.code}</Text>
        <Text style={styles.discount}>{discountText}</Text>
        <Text style={styles.expiry}>
          صالحة حتى: {new Date(item.expiryDate).toLocaleDateString()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>كوبوناتك</Text>

      {loadingCoupons ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginVertical: 20 }}
        />
      ) : coupons.length === 0 ? (
        <Text style={styles.emptyText}>لا توجد كوبونات متاحة</Text>
      ) : (
        <FlatList
          data={coupons}
          keyExtractor={(item) => item.code}
          renderItem={renderCoupon}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="أدخل كود الكوبون"
        placeholderTextColor={COLORS.lightText}
      />
      <TouchableOpacity
        onPress={validateCoupon}
        style={[styles.button, validating && { opacity: 0.7 }]}
        disabled={validating}
        activeOpacity={0.7}
      >
        {validating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>تحقّق من الكوبون</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Cairo-Regular",
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  code: {
    fontSize: 18,
    fontFamily: "Cairo-Regular",
    color: COLORS.blue,
    marginBottom: 8,
  },
  discount: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
    marginBottom: 6,
  },
  expiry: {
    fontSize: 14,
    fontFamily: "Cairo-Regular",
    color: COLORS.lightText,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.lightText,
    textAlign: "center",
    marginVertical: 20,
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
    marginVertical: 15,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 17,
    fontFamily: "Cairo-Regular",
    color: "#fff",
  },
});
