import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FILTERS = [
  { key: "all", label: "الكل" },
  { key: "nearest", label: "الأقرب" },
  { key: "new", label: "الجديدة" },
  { key: "favorite", label: "المفضلة" },
];

const mockResults = [
  { id: "1", name: "مطعم البرجر", desc: "الأقرب إليك" },
  { id: "2", name: "بيتزا هت", desc: "جديد" },
  { id: "3", name: "مطعم الشاورما", desc: "مفضل لديك" },
];

const DeliverySearch = () => {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // فلترة النتائج حسب الفلتر المختار (محاكاة)
  const filteredResults = mockResults.filter((item) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "nearest") return item.desc.includes("الأقرب");
    if (selectedFilter === "new") return item.desc.includes("جديد");
    if (selectedFilter === "favorite") return item.desc.includes("مفضل");
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="search"
          size={22}
          color="#FF7A00"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.input}
          placeholder="ابحث عن مطعم أو منتج..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#AAA"
        />
      </View>
      <View style={styles.filtersRow}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterBox,
              selectedFilter === filter.key && styles.filterBoxActive,
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.key && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredResults.filter(
          (item) => item.name.includes(search) || item.desc.includes(search)
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text style={styles.resultName}>{item.name}</Text>
            <Text style={styles.resultDesc}>{item.desc}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>لا توجد نتائج مطابقة</Text>
        }
        style={{ marginTop: 16 }}
      />
    </SafeAreaView>
  );
};

export default DeliverySearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: "#333",
  },
  filtersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  filterBox: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    paddingVertical: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  filterBoxActive: {
    backgroundColor: "#FF7A00",
  },
  filterText: {
    color: "#888",
    fontFamily: "Cairo-SemiBold",
    fontSize: 15,
  },
  filterTextActive: {
    color: "#FFF",
  },
  resultItem: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  resultName: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    color: "#222",
  },
  resultDesc: {
    fontFamily: "Cairo-Regular",
    fontSize: 13,
    color: "#FF7A00",
    marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    color: "#AAA",
    fontFamily: "Cairo-Regular",
    marginTop: 32,
    fontSize: 16,
  },
});
