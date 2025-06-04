
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";

const HorizontalCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/market/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("❌ فشل تحميل الفئات", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.icon }} style={styles.icon} />
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>الفئات</Text>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  card: { alignItems: "center", padding: 10, backgroundColor: "#f2f2f2", borderRadius: 8 },
  icon: { width: 50, height: 50, borderRadius: 25, marginBottom: 4 },
  title: { fontSize: 14 }
});

export default HorizontalCategories;
