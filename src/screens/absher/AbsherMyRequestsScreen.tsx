// screens/AbsherMyRequestsScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import axiosInstance from "utils/api/axiosInstance";
import COLORS from "constants/colors"; // تأكد من وجود ملف ألوان ثابت
import { MaterialIcons } from "@expo/vector-icons";

export default function AbsherMyRequestsScreen() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get("/absher/my-requests");
      setRequests(res.data.requests);
    } catch (err) {
      console.log("❌ فشل في تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.primary} />;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مرفوض": return "#D32F2F";
      case "مقبول": return "#388E3C";
      case "قيد المراجعة":
      default: return "#F57C00";
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <MaterialIcons name="home-repair-service" size={20} color={COLORS.primary} />
        <Text style={styles.category}>{item.category}</Text>
      </View>
      <Text style={styles.detail}>📍 الموقع: {item.location}</Text>
      <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
        🕒 الحالة: {item.status}
      </Text>
      {item.assignedProvider && (
        <Text style={styles.detail}>👤 مزود الخدمة: {item.assignedProvider}</Text>
      )}
      {item.response && (
        <Text style={styles.detail}>💬 الرد: {item.response}</Text>
      )}
    </View>
  );

  return (
    <FlatList
      style={{ padding: 16 }}
      data={requests}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      ListEmptyComponent={<Text style={styles.empty}>لا توجد طلبات بعد</Text>}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    color: COLORS.primary,
  },
  detail: {
    fontSize: 14,
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#888",
  },
});
