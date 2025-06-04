
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyCollections = () => {
  const [tab, setTab] = useState<"favorites" | "archived">("favorites");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("firebase-token");
      const endpoint = tab === "favorites" ? "/users/favorites" : "/users/archived-products";

      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل التحميل");
      setProducts(data);
    } catch (err) {
      console.error("❌", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [tab]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>{item.price} ﷼</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab("favorites")} style={[styles.tab, tab === "favorites" && styles.activeTab]}>
          <Text>محفوظاتي</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab("archived")} style={[styles.tab, tab === "archived" && styles.activeTab]}>
          <Text>أرشيفي</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  tabs: { flexDirection: "row", marginBottom: 16 },
  tab: { flex: 1, padding: 12, alignItems: "center", backgroundColor: "#eee" },
  activeTab: { backgroundColor: "#ccc" },
  card: { padding: 16, borderWidth: 1, borderColor: "#ddd", marginBottom: 8 },
  title: { fontWeight: "bold", fontSize: 16 }
});

export default MyCollections;
