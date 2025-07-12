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
import { LinearGradient } from "expo-linear-gradient";

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
    <LinearGradient
      colors={["#FF7A00", "#FF5252"]}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.headerRow}>
        {/* أيقونة المحفظة يمين */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("WalletStack")}
          activeOpacity={0.8}
        >
          <Ionicons name="wallet" size={22} color="#FFF" />
        </TouchableOpacity>
        {/* كلمة بثواني في الوسط */}
        <View style={styles.centerTitleWrap}>
          <Text style={styles.centerTitle}>بثواني</Text>
        </View>
        {/* أيقونة العناوين يسار */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            addresses.length === 0
              ? navigation.navigate("DeliveryAddresses")
              : setModalVisible(true)
          }
          activeOpacity={0.8}
        >
          <Ionicons name="location-outline" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>
      {/* حقل البحث أسفل الهيدر */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate("DeliverySearch")}
        activeOpacity={0.9}
      >
        <Ionicons
          name="search"
          size={18}
          color="#FF7A00"
          style={{ marginLeft: 6 }}
        />
        <Text style={styles.searchPlaceholder}>ابحث عن مطعم أو منتج...</Text>
      </TouchableOpacity>
      {/* الكيرف السفلي */}
      <View style={styles.curve} />
      {/* قائمة العناوين (المودال) */}
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
    </LinearGradient>
  );
};

export default DeliveryHeader;

const styles = StyleSheet.create({
  gradientContainer: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    paddingBottom: 12,
    paddingTop: 0,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 2,
  },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.13)",
    borderRadius: 16,
    padding: 7,
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
  },
  centerTitleWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerTitle: {
    color: "#FFF",
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  searchBar: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
    elevation: 1,
  },
  searchPlaceholder: {
    color: "#888",
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    flex: 1,
    textAlign: "right",
  },
  curve: {
    position: "absolute",
    bottom: -32,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    zIndex: 1,
  },
  locationContainer: {
    flex: 1,
    marginRight: 8,
  },
  deliveryText: {
    fontFamily: "Cairo-Bold",
    fontSize: 15, // تصغير الخط
    color: "#FFF",
    marginBottom: 2, // تقليل المسافة السفلية
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressText: {
    fontFamily: "Cairo-Regular",
    fontSize: 12, // تصغير الخط
    color: "#FFF",
    marginLeft: 4,
  },
  streetText: {
    fontFamily: "Cairo-Regular",
    fontSize: 12,
    color: "#FFE0B2",
  },
  walletSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 6,
  },
  walletButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginRight: 2,
  },
  walletText: {
    color: "#FFF",
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    marginLeft: 5,
  },
  searchButton: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 16,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
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
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
