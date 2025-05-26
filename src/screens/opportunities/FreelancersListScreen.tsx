import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
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

const FreelancersListScreen = ({ navigation }: any) => {
  const [selectedService, setSelectedService] = useState("الكل");
  const [selectedGovernorate, setSelectedGovernorate] = useState("الكل");

  const filtered = freelancers.filter(
    (f) =>
      (selectedService === "الكل" || f.service === selectedService) &&
      (selectedGovernorate === "الكل" || f.governorate === selectedGovernorate)
  );

  const renderCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("FreelancerDetails", { freelancer: item })
      }
    >
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.chipContainer}>
          <Text style={styles.chip}>{item.service}</Text>
          <Text style={styles.locationChip}>
            <Ionicons name="location" size={12} color="#D84315" />{" "}
            {item.governorate}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{item.description}</Text>

      <TouchableOpacity
        style={styles.contactButton}
        onPress={() => {
          /* Add contact logic */
        }}
      >
        <Text style={styles.contactButtonText}>اتصل الآن: {item.phone}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filters Section */}
      <View style={styles.filtersContainer}>
        <FilterDropdown
          label="نوع الخدمة"
          options={services}
          selected={selectedService}
          onSelect={setSelectedService}
        />
        <FilterDropdown
          label="الموقع"
          options={governorates}
          selected={selectedGovernorate}
          onSelect={setSelectedGovernorate}
        />
      </View>

      {/* Freelancers List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people" size={48} color="#D84315" />
            <Text style={styles.emptyText}>لا يوجد مزودي خدمات حالياً</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddFreelancer")}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

// Data and Constants
const freelancers = [
  {
    id: "1",
    name: "أحمد عادل",
    service: "تصميم",
    governorate: "أمانة العاصمة",
    phone: "777123456",
    description: "مصمم شعارات وواجهات محترف",
  },
  {
    id: "2",
    name: "ريم محمد",
    service: "برمجة",
    governorate: "عدن",
    phone: "778888999",
    description: "مبرمجة React Native بخبرة 3 سنوات",
  },
];

const services = ["الكل", "برمجة", "تصميم", "كتابة", "تسويق"];
const governorates = ["الكل", "أمانة العاصمة", "عدن", "تعز"];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  filtersContainer: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
    padding: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  dropdownContainer: {
    width: "48%",
    marginBottom: 8,
  },
  dropdownHeader: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEE",
    backgroundColor: "#F8F9FA",
  },
  dropdownCompact: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownLabelSmall: {
    fontSize: 10,
    color: "#9E9E9E",
    fontFamily: "Cairo-Regular",
  },
  dropdownSelectionCompact: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  dropdownSelectedTextSmall: {
    fontSize: 14,
    fontFamily: "Cairo-SemiBold",
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
    width: "70%",
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
  name: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: "#2C3E50",
    flex: 1,
  },
  chipContainer: {
    flexDirection: "row-reverse",
    gap: 8,
    alignItems: "center",
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
  locationChip: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 12,
    color: "#D84315",
  },
  description: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 12,
    textAlign: "right",
  },
  contactButton: {
    backgroundColor: "#D84315",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  contactButtonText: {
    color: "#FFF",
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
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
  fab: {
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
  },
});

export default FreelancersListScreen;
