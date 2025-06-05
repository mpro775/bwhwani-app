import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchAllDonors } from "../../api/bloodApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLORS from "constants/colors";

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
  const [donors, setDonors] = useState<any[]>([]);
  const [currentMongoId, setCurrentMongoId] = useState<string | null>(null);

  const bloodTypes = ["الكل", "A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];

  // عند تحميل الشاشة لأول مرة، استرجع معرف MongoDB من AsyncStorage
  useEffect(() => {
    const loadMongoId = async () => {
      const mongoId = await AsyncStorage.getItem("mongoUserId");
      console.log(mongoId)
      setCurrentMongoId(mongoId);
    };
    loadMongoId();
  }, []);

  // استرجاع قائمة المتبرّعين عند تغيّر الفلاتر
  useEffect(() => {
    fetchDonors();
  }, [selectedGovernorate, selectedType]);

  const fetchDonors = async () => {
    try {
      const allDonors = await fetchAllDonors({
        governorate: selectedGovernorate,
        bloodType: selectedType,
      });
      setDonors(allDonors);
    } catch (err) {
      console.error("Failed to fetch donors", err);
    }
  };

  const filteredDonors = donors.filter(
    (d: any) =>
      (selectedGovernorate === "الكل" || d.governorate === selectedGovernorate) &&
      (selectedType === "الكل" || d.bloodType === selectedType)
  );

  const renderDonor = ({ item }: any) => {
    const isSelf = currentMongoId === item._id; // الآن نقارن معرف MongoDB وليس معرف Firebase

    return (
      <TouchableOpacity
        style={[styles.card, isSelf && styles.cardDisabled]}
        onPress={() => {
          if (isSelf) {
            Alert.alert(
              "لا يمكن الدردشة مع نفسك",
              "يرجى اختيار متبرع آخر لإجراء المحادثة."
            );
            return;
          }
          navigation.navigate("BloodChat", { donor: item });
        }}
        activeOpacity={isSelf ? 1 : 0.7}
      >
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.name}>{item.fullName}</Text>
            <Text style={styles.governorate}>📍 {item.governorate}</Text>
            <Text style={styles.bloodType}>🩸 {item.bloodType}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {item.isAvailableToDonate ? "✅ متاح" : "🚫 غير متاح"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
        keyExtractor={(item: any) => item._id || item.id}
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
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  statusText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 13,
    color: COLORS.text,
    textAlign: "center",
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
  cardDisabled: {
    opacity: 0.6,
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
