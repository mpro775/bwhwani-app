// screens/CharityMyPostsScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";

export default function CharityMyPostsScreen() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("https://yourapi.com/charity/mine", {
        headers: { Authorization: "Bearer token" },
      });
      setPosts(res.data.donations);
    } catch (error) {
      console.log("فشل في تحميل التبرعات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <FlatList
      style={{ padding: 16 }}
      data={posts}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={{ backgroundColor: "#f8f8f8", padding: 16, borderRadius: 12, marginBottom: 12 }}>
          <Text style={{ fontWeight: "bold" }}>نوع التبرع: {item.type}</Text>
          <Text>المحتوى: {item.content}</Text>
          <Text>الكمية: {item.quantity}</Text>
          <Text>المنطقة: {item.area}</Text>
          <Text>الحالة: {item.status || "قيد المراجعة"}</Text>
        </View>
      )}
    />
  );
}
