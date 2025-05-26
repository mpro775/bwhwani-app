// screens/BloodTypesScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { bloodDonors } from "../../data/bloodDonors";

const GovernorateDropdown = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (gov: string) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const governorates = ["الكل", "أمانة العاصمة", "عدن", "تعز", "حضرموت"];

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setVisible(!visible)}
      >
        <Text style={styles.dropdownHeaderText}>{selected}</Text>
        <Ionicons
          name={visible ? "caret-up" : "caret-down"}
          size={16}
          color="#555"
        />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdownList}>
            {governorates.map((gov) => (
              <TouchableOpacity
                key={gov}
                style={[
                  styles.dropdownItem,
                  selected === gov && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  onSelect(gov);
                  setVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selected === gov && styles.dropdownItemTextActive,
                  ]}
                >
                  {gov}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const BloodTypesScreen = ({ navigation }: any) => {
  const [selectedGovernorate, setSelectedGovernorate] = useState("الكل");
  const [selectedType, setSelectedType] = useState("الكل");
  const bloodTypes = ["الكل", "A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];

  const filteredDonors = bloodDonors.filter(
    (d) =>
      (selectedGovernorate === "الكل" ||
        d.governorate === selectedGovernorate) &&
      (selectedType === "الكل" || d.bloodType === selectedType)
  );

  const renderDonor = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("BloodChatScreen", { donor: item })}
    >
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.governorate}>{item.governorate}</Text>
          <Text style={styles.bloodType}>{item.bloodType}</Text>
        </View>
        <Text
          style={[
            styles.status,
            { color: item.status === "متاح" ? "#4CAF50" : "#9E9E9E" },
          ]}
        >
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filtersContainer}>
        <GovernorateDropdown
          selected={selectedGovernorate}
          onSelect={setSelectedGovernorate}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bloodTypesScroll}
        >
          {bloodTypes.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setSelectedType(type)}
              style={[
                styles.bloodTypeButton,
                selectedType === type && styles.bloodTypeButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.bloodTypeButtonText,
                  selectedType === type && styles.bloodTypeButtonTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredDonors}
        renderItem={renderDonor}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            لا يوجد متبرعين متطابقين مع الفلتر
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("BecomeDonor")}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 8,
    padding: 14,
  },
  dropdownHeaderText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
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
    width: "80%",
    borderRadius: 8,
    elevation: 4,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  dropdownItemActive: {
    backgroundColor: "#FBE9E7",
  },
  dropdownItemText: {
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: "#666",
    textAlign: "right",
  },
  dropdownItemTextActive: {
    color: "#D84315",
    fontFamily: "Cairo-SemiBold",
  },
  bloodTypesScroll: {
    gap: 8,
  },
  bloodTypeButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bloodTypeButtonActive: {
    backgroundColor: "#D84315",
  },
  bloodTypeButtonText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    color: "#666",
  },
  bloodTypeButtonTextActive: {
    color: "#FFF",
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    color: "#333",
  },
  governorate: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  bloodType: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: "#D84315",
    marginTop: 8,
  },
  status: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    left: 30,
    backgroundColor: "#D84315",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  emptyText: {
    textAlign: "center",
    fontFamily: "Cairo-Regular",
    color: "#999",
    marginTop: 32,
  },
});

export default BloodTypesScreen;
