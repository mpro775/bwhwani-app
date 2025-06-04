import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import { DeliveryOrder } from "types/DeliverySubOrder";

interface SubOrder {
  _id: string;
  storeId: string;
  items: { productId: string; quantity: number; price: number }[];
  deliveryStatus?: "pending" | "delivered" | "on_the_way";
}

interface Order {
  _id: string;
  subOrders: SubOrder[];
}

const VendorDashboardScreen = () => {
const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  axios.get<DeliveryOrder[]>("/vendor/orders").then(res => setOrders(res.data));
});
  useEffect(() => {
    const fetchVendorOrders = async () => {
      try {
        const response = await axios.get("/vendor/orders"); // تأكد من وجود التوكن
        setOrders(response.data);
      } catch (error) {
        console.error("فشل في جلب الطلبات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorOrders();
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>طلبات المتجر</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.orderBox}>
            <Text style={styles.orderTitle}>طلب #{item._id.slice(-4)}</Text>
            {item.subOrders.map((sub, index) => (
              <View key={index} style={styles.subOrder}>
                <Text>المتجر: {sub.storeId}</Text>
                <Text>الحالة: {sub.deliveryStatus}</Text>
                <Text>العناصر:</Text>
                {sub.items.map((i, idx) => (
                  <Text key={idx}>
                    - المنتج: {i.productId} | الكمية: {i.quantity}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  orderBox: { borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8 },
  orderTitle: { fontWeight: "bold", marginBottom: 8 },
  subOrder: { marginTop: 8, padding: 4, backgroundColor: "#f9f9f9", borderRadius: 6 },
});

export default VendorDashboardScreen;
