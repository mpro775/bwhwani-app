import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";

const types = ["الكل", "محفظة", "هاتف", "أوراق", "مفتاح"];
const locations = ["الكل", "أمانة العاصمة", "عدن", "تعز"];
const statuses = ["الكل", "مفقود", "تم العثور عليه"];

type LostItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  status: string;
};

const LostItemsScreen = ({ navigation }: any) => {
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [selectedType, setSelectedType] = useState("الكل");
  const [selectedLocation, setSelectedLocation] = useState("الكل");
  const [selectedStatus, setSelectedStatus] = useState("الكل");
  const [loading, setLoading] = useState(true);

  const loadLostItems = async () => {
    try {
      const data = await AsyncStorage.getItem("lost-items");
      if (data) setLostItems(JSON.parse(data));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadLostItems);
    return unsubscribe;
  }, [navigation]);

  const filtered = lostItems.filter(
    (item: LostItem) =>
      (selectedType === "الكل" || item.type === selectedType) &&
      (selectedLocation === "الكل" || item.location === selectedLocation) &&
      (selectedStatus === "الكل" || item.status === selectedStatus)
  );

  const renderStatusIndicator = (status: string) => {
    const statusColors: Record<"مفقود" | "تم العثور عليه", string> = {
      مفقود: "#D84315",
      "تم العثور عليه": "#4CAF50",
    };
    const color = statusColors[status as "مفقود" | "تم العثور عليه"];

    return (
      <View style={[styles.statusDot, { backgroundColor: color || "#999" }]} />
    );
  };

  const renderItem = ({ item }: { item: LostItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("LostAndFoundDetailsScreen", { item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        {renderStatusIndicator(item.status)}
      </View>

      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <Ionicons name="pricetag" size={16} color="#D84315" />
          <Text style={styles.metaText}>{item.type}</Text>
        </View>

        <View style={styles.metaItem}>
          <Ionicons name="location" size={16} color="#D84315" />
          <Text style={styles.metaText}>{item.location}</Text>
        </View>
      </View>

      <Text style={styles.date}>
        {new Date(item.date).toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D84315" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filters Section */}
      <View style={styles.dropdownFilters}>
        <Text style={styles.filterTitle}>فلترة حسب:</Text>

        <View style={styles.row}>
          {[
            {
              label: "النوع",
              value: selectedType,
              set: setSelectedType,
              list: types,
            },
            {
              label: "الموقع",
              value: selectedLocation,
              set: setSelectedLocation,
              list: locations,
            },
            {
              label: "الحالة",
              value: selectedStatus,
              set: setSelectedStatus,
              list: statuses,
            },
          ].map((filter, index) => (
            <View style={styles.dropdownWrapper} key={index}>
              <Text style={styles.dropdownLabel}>{filter.label}:</Text>
              <View style={styles.dropdownTouchable}>
                <RNPickerSelect
                  value={filter.value}
                  onValueChange={filter.set}
                  items={filter.list.map((val) => ({ label: val, value: val }))}
                  style={pickerSelectStyles}
                  placeholder={{}}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => (
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color="#666"
                      style={{ marginLeft: 10 }}
                    />
                  )}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Items List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={require("../../../assets/empty-box.png")}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>لا توجد نتائج مطابقة للبحث</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddLostItemScreen")}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 12,
    color: "#333",
    fontFamily: "Cairo-Regular",
  },
  inputAndroid: {
    fontSize: 12,
    color: "#333",
    fontFamily: "Cairo-Regular",
  },
  iconContainer: {
    top: 12,
    right: 50,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownFilters: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  dropdownTouchable: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  dropdownWrapper: {
    width: "31%", // لجعلها بجانب بعض
    marginBottom: 12,
  },

  dropdownLabel: {
    fontFamily: "Cairo-Bold",
    fontSize: 12,
    color: "#3E2723",
    marginBottom: 4,
  },

  filterContainer: {
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  filterTitle: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
    textAlign: "right",
  },
  filterGroup: {
    gap: 8,
    paddingHorizontal: 8,
  },
  filterBtn: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: "#D84315",
  },
  filterText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    color: "#666",
  },
  activeText: {
    color: "#FFF",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: "#2C3E50",
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  metaContainer: {
    flexDirection: "row-reverse",
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#666",
  },
  date: {
    fontFamily: "Cairo-Regular",
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
  listContent: {
    paddingVertical: 16,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  emptyText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: "#9E9E9E",
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    left: 24,
    backgroundColor: "#D84315",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default LostItemsScreen;
