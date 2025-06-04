import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Button, StyleSheet } from "react-native";
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

const DeliveryDriverOrdersScreen = () => {
const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  axios.get<DeliveryOrder[]>("/vendor/orders").then(res => setOrders(res.data));
});
  const fetchOrders = async () => {
    try {
      const res = await axios.get("/driver/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("خطأ في جلب الطلبات:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (subOrderId: string, newStatus: string) => {
    try {
      await axios.patch(`/delivery/${subOrderId}/status`, { status: newStatus });
      fetchOrders(); // إعادة التحميل
    } catch (err) {
      console.error("خطأ في تحديث الحالة:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>طلبات التوصيل</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.orderBox}>
            <Text>طلب #{item._id.slice(-4)}</Text>
            {item.subOrders.map((sub) => (
              <View key={sub._id} style={styles.subOrder}>
                <Text>متجر: {sub.storeId}</Text>
                <Text>الحالة: {sub.deliveryStatus}</Text>
                <Button
                  title="تم التوصيل"
                  onPress={() => updateStatus(sub._id, "delivered")}
                />
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
  subOrder: { marginTop: 8, padding: 4, backgroundColor: "#e0f7fa", borderRadius: 6 },
});

export default DeliveryDriverOrdersScreen;
