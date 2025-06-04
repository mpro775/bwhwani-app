import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "types/navigation";

type WaslniOrder = {
  _id: string;
  fromLocation: { address: string };
  toLocation: { address: string };
  status: string;
  reviewed?: boolean;
};

const MyTransportOrdersScreen = () => {
  const [loading, setLoading] = useState(true);
const [orders, setOrders] = useState<WaslniOrder[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
type NavProp = NativeStackNavigationProp<RootStackParamList, "MyTransportOrders">;
const navigation = useNavigation<NavProp>();

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("firebase-token");
      const { data } = await axios.get("/waslni/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data.filter((order: any) =>
        activeTab === "active"
          ? order.status !== "delivered"
          : order.status === "delivered"
      ));
    } catch (error) {
      console.error("❌ فشل جلب الطلبات:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.address}>من: {item.fromLocation?.address}</Text>
      <Text style={styles.address}>إلى: {item.toLocation?.address}</Text>
      <Text style={styles.status}>الحالة: {item.status}</Text>
      {item.status === "delivered" && !item.reviewed && (
        <TouchableOpacity
          style={styles.rateButton}
          onPress={() => navigation.navigate("RateDriver", { id: item._id })}
        >
          <Text style={styles.rateButtonText}>قيّم السائق</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab("active")}>
          <Text style={[styles.tab, activeTab === "active" && styles.activeTab]}>نشط</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("completed")}>
          <Text style={[styles.tab, activeTab === "completed" && styles.activeTab]}>منتهي</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#D84315" />
      ) : (
        <FlatList data={orders} renderItem={renderItem} keyExtractor={(item) => item._id} />
      )}
    </View>
  );
};

export default MyTransportOrdersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  tabs: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  tab: { fontSize: 18, fontFamily: "Cairo-Regular", color: "#888" },
  activeTab: { color: "#D84315", fontFamily: "Cairo-Bold" },
  card: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 10 },
  address: { fontFamily: "Cairo-Regular", fontSize: 14, marginBottom: 4 },
  status: { fontFamily: "Cairo-SemiBold", fontSize: 14, color: "#555" },
  rateButton: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 6, marginTop: 8 },
  rateButtonText: { color: "#fff", textAlign: "center", fontFamily: "Cairo-Bold" },
});
