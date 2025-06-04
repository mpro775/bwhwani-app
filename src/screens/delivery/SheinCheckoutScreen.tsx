import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from "react-native";
import axiosInstance from "utils/api/axiosInstance";

const SheinCheckoutScreen = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axiosInstance.get("/shein/cart").then((res) => setItems(res.data.items));
  }, []);

  const handleCheckout = async () => {
    try {
      await axiosInstance.post("/orders/shein/checkout");
      Alert.alert("✅ تم الطلب", "تم تنفيذ الطلب والدفع عبر المحفظة.");
    } catch (e) {
      Alert.alert("❌ فشل", "لم يتم تنفيذ الطلب.");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={items}
        keyExtractor={(item: any) => item.productId}
        renderItem={({ item }: any) => (
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <Image source={{ uri: item.image }} style={{ width: 60, height: 60 }} />
            <View style={{ marginLeft: 12 }}>
              <Text>{item.name}</Text>
              <Text>{item.price} ر.س</Text>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={{ backgroundColor: "#D84315", padding: 16, borderRadius: 8, marginTop: 20 }}
        onPress={handleCheckout}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>تأكيد الطلب والدفع</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SheinCheckoutScreen;
