// screens/LoyaltyScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import axiosInstance from "utils/api/axiosInstance";
import COLORS from "constants/colors";

export default function LoyaltyScreen() {
  const [points, setPoints] = useState<number>(0);
  const [loadingPoints, setLoadingPoints] = useState<boolean>(true);
  const [redeeming, setRedeeming] = useState<boolean>(false);

  const fetchPoints = async () => {
    try {
      setLoadingPoints(true);
      const res = await axiosInstance.get("/wallet"); // يفترض أن يُرجع wallet.loyaltyPoints
      setPoints(res.data.balance.loyaltyPoints || 0);
    } catch (err) {
      console.error("فشل في جلب النقاط:", err);
      Alert.alert("خطأ", "تعذر جلب نقاط الولاء");
    } finally {
      setLoadingPoints(false);
    }
  };

  const handleRedeem = async () => {
    setRedeeming(true);
    try {
      const res = await axiosInstance.post("/coupons/redeem");
      Alert.alert(
        "تم بنجاح",
        `تم تحويل النقاط إلى كوبون بقيمة ${res.data.coupon.value} YER`
      );
      fetchPoints();
    } catch (err: any) {
      Alert.alert("خطأ", err.response?.data?.error || "حدث خطأ");
    } finally {
      setRedeeming(false);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>رصيد نقاط الولاء</Text>

      {loadingPoints ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />
      ) : (
        <View style={styles.pointsCard}>
          <Text style={styles.pointsText}>{points}</Text>
          <Text style={styles.pointsUnit}>نقطة</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={handleRedeem}
        style={[
          styles.redeemButton,
          (points < 100 || redeeming) && { opacity: 0.6 },
        ]}
        disabled={points < 100 || redeeming}
        activeOpacity={0.7}
      >
        {redeeming ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.redeemButtonText}>
            استبدل 100 نقطة بكوبون
          </Text>
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
    fontSize: 22,
    fontFamily: "Cairo-Regular",
    color: COLORS.primary,
    marginBottom: 30,
    textAlign: "center",
  },
  pointsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 30,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsText: {
    fontSize: 48,
    fontFamily: "Cairo-Regular",
    color: COLORS.accent,
  },
  pointsUnit: {
    fontSize: 18,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
    marginTop: 5,
  },
  redeemButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  redeemButtonText: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: "#fff",
  },
});
