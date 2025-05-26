import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const COLORS = {
  primary: "#D84315",
  text: "#4E342E",
};

type Address = {
  id: string;
  label: string;
  city: string;
  street: string;
};

const DeliveryHeader = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation<any>();

  const fetchAddresses = async () => {
    try {
      const stored = await AsyncStorage.getItem("user_addresses");
      const parsed = stored ? JSON.parse(stored) : [];
      setAddresses(parsed);

      const selectedId = await AsyncStorage.getItem("selected_address_id");
      if (selectedId) {
        setSelectedAddressId(selectedId);
      } else if (parsed.length > 0) {
        setSelectedAddressId(parsed[0].id);
        await AsyncStorage.setItem("selected_address_id", parsed[0].id);
      }
    } catch (err) {
      console.log("خطأ في تحميل العناوين:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectAddress = async (id: string) => {
    setSelectedAddressId(id);
    await AsyncStorage.setItem("selected_address_id", id);
    setModalVisible(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <View style={styles.container}>
      {/* العنوان */}
      <View style={styles.locationContainer}>
        <Text style={styles.deliveryText}>التوصيل الآن</Text>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : addresses.length === 0 ? (
          <TouchableOpacity
            style={styles.addressContainer}
            onPress={() => navigation.navigate("DeliveryAddresses")}
          >
            <Ionicons name="location-outline" size={16} color={COLORS.primary} />
            <Text style={styles.addressText}>أضف عنوان التوصيل</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.addressContainer}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="location-outline" size={16} color={COLORS.primary} />
            <Text style={styles.addressText}>
              {selectedAddress
                ? `${selectedAddress.label} - ${selectedAddress.city}`
                : "اختر عنوان التوصيل"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* الرصيد */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>رصيدك: 0.00 ر.س</Text>
      </View>

      {/* قائمة العناوين */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={addresses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.addressItem}
                  onPress={() => selectAddress(item.id)}
                >
                  <Text style={styles.addressText}>
                    {item.label} - {item.city}
                  </Text>
                  <Text style={styles.streetText}>{item.street}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DeliveryHeader;

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    elevation: 2,
  },
  locationContainer: {
    flex: 1,
    marginRight: 8,
  },
  deliveryText: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 4,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressText: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  streetText: {
    fontFamily: "Cairo-Regular",
    fontSize: 12,
    color: "#AAA",
  },
  balanceContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  balanceText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    color: COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    maxHeight: 300,
  },
  addressItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
});
