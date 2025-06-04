import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, Alert } from 'react-native';
import axiosInstance from 'utils/api/axiosInstance';

const CouponListScreen = () => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState('');

  const fetchCoupons = async () => {
    try {
      const res = await axiosInstance.get("/coupons/user"); // يُفضل إنشاء هذا المسار لاحقًا
      setCoupons(res.data);
    } catch {
      setCoupons([]);
    }
  };

  const validateCoupon = async () => {
    try {
      const res = await axiosInstance.post("/coupons/validate", { code });
      Alert.alert("✅ صالح", `الكوبون يعطي ${res.data.coupon.value} ${res.data.coupon.type === "percentage" ? "%" : "YER"}`);
    } catch (err: any) {
      Alert.alert("❌ خطأ", err.response?.data?.error || "فشل التحقق");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>كوبوناتك</Text>

      <FlatList
        data={coupons}
        keyExtractor={(item:any) => item.code}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.code}>{item.code}</Text>
            <Text>
              {item.type === "percentage" ? `خصم ${item.value}%` :
               item.type === "fixed" ? `خصم ${item.value} YER` :
               `شحن مجاني`}
            </Text>
            <Text>صالحة حتى: {new Date(item.expiryDate).toLocaleDateString()}</Text>
          </View>
        )}
      />

      <TextInput style={styles.input} value={code} onChangeText={setCode} placeholder="أدخل كود الكوبون" />
      <Button title="تحقق من الكوبون" onPress={validateCoupon} />
    </View>
  );
};

export default CouponListScreen;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 22, marginBottom: 15 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10 },
  card: { padding: 15, marginBottom: 10, backgroundColor: "#f9f9f9", borderRadius: 8 },
  code: { fontWeight: 'bold', fontSize: 16 },
});
