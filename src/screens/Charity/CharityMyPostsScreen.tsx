// screens/CharityMyPostsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import axiosInstance from "utils/api/axiosInstance";
import COLORS from "constants/colors";

export default function CharityMyPostsScreen() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get("/charity/mine");
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={posts}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>لا توجد مشاركات خيرية حتى الآن</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>نوع التبرع:</Text>
              <Text style={styles.value}>{item.type}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>المحتوى:</Text>
              <Text style={styles.value}>{item.content}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>الكمية:</Text>
              <Text style={styles.value}>{item.quantity}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>المنطقة:</Text>
              <Text style={styles.value}>{item.area}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>الحالة:</Text>
              <Text style={[styles.value, styles.statusValue]}>
                {item.status || "قيد المراجعة"}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    // ظل أندرويد
    elevation: 2,
    // ظل iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: COLORS.text,
  },
  value: {
    flex: 1,
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: COLORS.text,
    textAlign: "right",
    marginLeft: 8,
  },
  statusValue: {
    color: COLORS.primary,
    fontFamily: "Cairo-Bold",
  },
  emptyText: {
    textAlign: "center",
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: COLORS.lightText,
    marginTop: 40,
  },
});
