// screens/opportunities/OpportunitiesListScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { getStoredOpportunities } from "../../utils/opportunitiesStorage";
import { opportunities as initialData } from "../../data/opportunities";
import { Ionicons } from "@expo/vector-icons";

// Dropdown Component
const FilterDropdown = ({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setVisible(true)}
      >
        <View style={styles.dropdownCompact}>
          <Text style={styles.dropdownLabelSmall}>{label}</Text>
          <View style={styles.dropdownSelectionCompact}>
            <Text style={styles.dropdownSelectedTextSmall}>{selected}</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </View>
        </View>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdownList}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.dropdownItem,
                  selected === option && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  onSelect(option);
                  setVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selected === option && styles.dropdownItemActiveText,
                  ]}
                >
                  {option}
                </Text>
                {selected === option && (
                  <Ionicons name="checkmark" size={16} color="#D84315" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const OpportunitiesListScreen = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedType, setSelectedType] = useState("الكل");
  const [selectedGovernorate, setSelectedGovernorate] = useState("الكل");
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await getStoredOpportunities();
        setOpportunities(saved?.length ? saved : initialData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filtered = opportunities
    .filter((item) =>
      selectedCategory === "الكل" ? true : item.category === selectedCategory
    )
    .filter((item) =>
      selectedType === "الكل" ? true : item.type === selectedType
    )
    .filter((item) =>
      selectedGovernorate === "الكل"
        ? true
        : item.governorate === selectedGovernorate
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const renderCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("OpportunityDetails", { opportunity: item })
      }
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.chipContainer}>
          <Text style={styles.chip}>{item.type}</Text>
          <Text style={styles.chip}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.location}>
          <Ionicons name="location" size={14} color="#D84315" />
          <Text style={styles.governorate}>{item.governorate}</Text>
        </View>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString("ar-YE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>
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
      <View style={styles.filtersContainer}>
        <FilterDropdown
          label="نوع الفرصة"
          options={types}
          selected={selectedType}
          onSelect={setSelectedType}
        />
        <FilterDropdown
          label="التصنيف"
          options={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <FilterDropdown
          label="الموقع"
          options={governorates}
          selected={selectedGovernorate}
          onSelect={setSelectedGovernorate}
        />
      </View>

      {/* Opportunities List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="briefcase" size={48} color="#D84315" />
            <Text style={styles.emptyText}>لا توجد فرص متاحة حالياً</Text>
          </View>
        }
      />

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("AddOpportunity")}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fab, styles.secondaryFab]}
          onPress={() => navigation.navigate("FreelancersList")}
        >
          <Ionicons name="people" size={24} color="#D84315" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const categories = ["الكل", "برمجة", "تصميم", "تسويق", "كتابة"];
const types = ["الكل", "مهنة", "توظيف", "خدمة"];
const governorates = ["الكل", "أمانة العاصمة", "عدن", "تعز"];

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
  filtersContainer: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    fontFamily: "Cairo-SemiBold",

    gap: 8,
    padding: 12,
    backgroundColor: "#FFF",
  },

  dropdownContainer: {
    width: "48%", // لعرض عنصرين بجانب بعض
    marginBottom: 8,
    fontFamily: "Cairo-SemiBold",
  },

  dropdownHeader: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    fontFamily: "Cairo-SemiBold",

    borderColor: "#EEE",
    backgroundColor: "#F8F9FA",
  },

  dropdownCompact: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Cairo-SemiBold",
  },
  dropdownLabelSmall: {
    fontSize: 10,
    color: "#9E9E9E",
    fontFamily: "Cairo-SemiBold",

    marginLeft: 4,
  },
  dropdownSelectionCompact: {
    flexDirection: "row-reverse",
    alignItems: "center",
    fontFamily: "Cairo-SemiBold",
    fontSize: 12,

    gap: 4,
  },

  dropdownSelection: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "Cairo-SemiBold",
  },
  dropdownSelectedTextSmall: {
    fontSize: 12,
    fontFamily: "Cairo-SemiBold",
  },
  dropdownSelectedText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownList: {
    backgroundColor: "#FFF",
    width: "70%", // تصغير حجم القائمة
    borderRadius: 8,
    elevation: 4,
  },
  dropdownItem: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  dropdownItemActive: {
    backgroundColor: "#FBE9E7",
  },
  dropdownItemText: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#666",
  },
  dropdownItemActiveText: {
    color: "#D84315",
    fontFamily: "Cairo-SemiBold",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 12,
    marginBottom: 12,
  },
  title: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: "#2C3E50",
    marginBottom: 8,
    textAlign: "right",
  },
  chipContainer: {
    flexDirection: "row-reverse",
    gap: 8,
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: "#F3E5F5",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontFamily: "Cairo-SemiBold",
    fontSize: 12,
    color: "#7B1FA2",
  },
  cardFooter: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  location: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  governorate: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    color: "#D84315",
  },
  date: {
    fontFamily: "Cairo-Regular",
    fontSize: 12,
    color: "#9E9E9E",
  },
  listContent: {
    paddingVertical: 16,
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: "#9E9E9E",
    marginTop: 16,
  },
  fabContainer: {
    position: "absolute",
    bottom: 24,
    left: 24,
    gap: 12,
  },
  fab: {
    backgroundColor: "#D84315",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  secondaryFab: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#D84315",
  },
});

export default OpportunitiesListScreen;
