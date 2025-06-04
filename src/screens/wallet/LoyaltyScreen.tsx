import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import axiosInstance from 'utils/api/axiosInstance';

const LoyaltyScreen = () => {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPoints = async () => {
    try {
      const res = await axiosInstance.get("/wallet"); // يفترض أن يعيد wallet.loyaltyPoints
setPoints(res.data.balance.loyaltyPoints || 0);
    } catch (err) {
      console.error("فشل في جلب النقاط");
    }
  };

  const handleRedeem = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/coupons/redeem");
      Alert.alert("تم بنجاح", `تم تحويل النقاط إلى كوبون بقيمة ${res.data.coupon.value} YER`);
      fetchPoints();
    } catch (err: any) {
      Alert.alert("خطأ", err.response?.data?.error || "حدث خطأ");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>رصيد النقاط</Text>
      <Text style={styles.points}>{points} نقطة</Text>
      <Button title="استبدل 100 نقطة بكوبون" onPress={handleRedeem} disabled={points < 100 || loading} />
    </View>
  );
};

export default LoyaltyScreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, marginBottom: 10 },
  points: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 }
});
