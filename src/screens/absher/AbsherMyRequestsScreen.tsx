// screens/AbsherMyRequestsScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";

export default function AbsherMyRequestsScreen() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("https://yourapi.com/absher/my-requests", {
        headers: { Authorization: "Bearer token" },
      });
      setRequests(res.data.requests);
    } catch (err) {
      console.log("فشل في تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <FlatList
      style={{ padding: 16 }}
      data={requests}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={{ backgroundColor: "#fff", padding: 16, borderRadius: 12, marginBottom: 12 }}>
          <Text style={{ fontWeight: "bold" }}>الخدمة: {item.category}</Text>
          <Text>الموقع: {item.location}</Text>
          <Text>الحالة: {item.status}</Text>
          {item.assignedProvider && <Text>مزود الخدمة: {item.assignedProvider}</Text>}
          {item.response && <Text>الرد: {item.response}</Text>}
        </View>
      )}
    />
  );
}
