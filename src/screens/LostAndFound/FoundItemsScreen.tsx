// screens/FoundItemsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const categories = ["الكل", "محفظة", "هاتف", "وثائق", "مفتاح"];
const governorates = ["الكل", "أمانة العاصمة", "عدن", "تعز", "إب"];

const FoundItemsScreen = ({ navigation }: any) => {
  const [foundItems, setFoundItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedGovernorate, setSelectedGovernorate] = useState("الكل");

const loadItems = async () => {
  try {
    const res = await fetch("https://your-backend-api.com/api/lostfound?type=found");
    const data = await res.json();
    setFoundItems(data);
  } catch (err) {
    console.error("خطأ في جلب البيانات:", err);
  }
};


  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadItems);
    return unsubscribe;
  }, [navigation]);

 const filtered = foundItems.filter(
  (item) =>
    (selectedCategory === "الكل" || item.category === selectedCategory) &&
    (selectedGovernorate === "الكل" ||
      item.location?.governorate === selectedGovernorate)
);


  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
navigation.navigate("LostAndFoundDetails", { item })
      }
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>
        {item.category} • {item.governorate}
      </Text>
      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleDateString("ar-SA")}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>فلترة الموجودات</Text>

      <ScrollView horizontal style={styles.filters}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setSelectedCategory(c)}
            style={[styles.filter, selectedCategory === c && styles.active]}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === c && styles.activeText,
              ]}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView horizontal style={styles.filters}>
        {governorates.map((g) => (
          <TouchableOpacity
            key={g}
            onPress={() => setSelectedGovernorate(g)}
            style={[styles.filter, selectedGovernorate === g && styles.active]}
          >
            <Text
              style={[
                styles.filterText,
                selectedGovernorate === g && styles.activeText,
              ]}
            >
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

    <FlatList
  data={filtered}
  keyExtractor={(item) => item._id}
  renderItem={renderItem}
  contentContainerStyle={{ padding: 16 }}
  refreshing={false}
  onRefresh={loadItems}
/>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  sectionTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 20,
    textAlign: "center",
    marginVertical: 16,
    color: "#3E2723",
  },
  filters: {
    flexDirection: "row-reverse",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  filter: {
    backgroundColor: "#EEE",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  active: {
    backgroundColor: "#D84315",
  },
  filterText: {
    fontFamily: "Cairo-Regular",
    color: "#555",
  },
  activeText: {
    color: "#FFF",
    fontFamily: "Cairo-Bold",
  },
  card: {
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    marginBottom: 6,
    color: "#3E2723",
  },
  meta: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#666",
  },
  date: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
});

export default FoundItemsScreen;
