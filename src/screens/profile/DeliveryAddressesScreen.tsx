import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { fetchUserProfile, addUserAddress, deleteUserAddress, setDefaultUserAddress } from "../../api/userApi";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Keyboard } from "react-native";
import { Modal } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type Address = {
  _id: string;
  label: string;
  city: string;
  street: string;
  location?: {
    lat: number;
    lng: number;
  };
};
const YEMEN_CITIES = [
  "صنعاء",
  "عدن",
  "تعز",
  "الحديدة",
  "إب",
  "المكلا",
  "ذمار",
  "البيضاء",
  "عمران",
  "صعدة",
  "مارب",
  "حجة",
  "لحج",
  "الضالع",
  "المحويت",
  "ريمة",
  "شبوة",
  "الجوف",
  "حضرموت",
  "سقطرى",
];

type DeliveryRouteProp = RouteProp<RootStackParamList, "DeliveryAddresses">;

const DeliveryAddressesScreen = () => {
  const isFocused = useIsFocused();
  const [cityPickerVisible, setCityPickerVisible] = useState(false);

const bottomSheetRef = useRef<BottomSheet>(null);
const openCitySheet = () => {
  Keyboard.dismiss();
  bottomSheetRef.current?.expand();
};

const closeCitySheet = () => {
  bottomSheetRef.current?.close();
};
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [formVisible, setFormVisible] = useState(false);
  const [cityDropdownVisible, setCityDropdownVisible] = useState(false);

  const [label, setLabel] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
 const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const scaleAnim = useState(new Animated.Value(1))[0];
  const flatListRef = React.useRef<FlatList>(null);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<DeliveryRouteProp>();

  useEffect(() => {
  const loadData = async () => {
    try {
      const user = await fetchUserProfile();
      if (user?.addresses) setAddresses(user.addresses);
if (user?.defaultAddressId) {
  setSelectedAddressId(user.defaultAddressId);
}
  } catch (err) {
      Alert.alert("خطأ", "فشل تحميل العناوين من السيرفر");
    }

    const savedLabel = await AsyncStorage.getItem("temp_label");
    const savedCity = await AsyncStorage.getItem("temp_city");
    const savedStreet = await AsyncStorage.getItem("temp_street");
    const savedLocation = await AsyncStorage.getItem("temp_location");

    if (savedLabel) setLabel(savedLabel);
    if (savedCity) setCity(savedCity);
    if (savedStreet) setStreet(savedStreet);
    if (savedLocation) setLocation(JSON.parse(savedLocation));

    await AsyncStorage.multiRemove([
      "temp_label",
      "temp_city",
      "temp_street",
      "temp_location",
    ]);
  };

  if (isFocused) loadData();
}, [isFocused]);


const handleAddAddress = async () => {
  animatePress();

  if (!label || !city || !street) {
    Alert.alert("تنبيه", "الرجاء تعبئة جميع الحقول المطلوبة");
    return;
  }

  try {
   const newAddr = {
  label,
  city,
  street,
  location: location ? {
    lat: location.lat,
    lng: location.lng,
  } : undefined,
};


    await addUserAddress(newAddr);
  console.log("📍 العنوان أُرسل:", newAddr);

    // تحديث القائمة
    const user = await fetchUserProfile();
    setAddresses(user.addresses);
  console.log("📥 تم جلب المستخدم:", user);

    setLabel("");
    setCity("");
    setStreet("");
    setLocation(null);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

        Alert.alert("تم", "تمت إضافة العنوان بنجاح");
    Keyboard.dismiss();
  } catch (err) {
    Alert.alert("خطأ", "فشل حفظ العنوان");
      console.error("❌ فشل حفظ العنوان:", err);

  }
};



  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };
const setAsDefault = async (id: string) => {
  const addr = addresses.find(a => a._id === id);
  if (!addr) return;

  try {
await setDefaultUserAddress({ _id: addr._id });
    setSelectedAddressId(id); // فقط تغيير الـ ID الحالي

    Alert.alert("تم", "تم تعيين العنوان كافتراضي");
  } catch (err) {
    console.error("❌ فشل التعيين:", err);
    Alert.alert("خطأ", "فشل تعيين العنوان كافتراضي");
  }
};



 const handleDelete = async (index: number) => {
  const id = addresses[index]._id; // تأكد أن العنوان يحتوي على _id من الباك إند
  Alert.alert("تأكيد الحذف", "هل أنت متأكد؟", [
    { text: "إلغاء", style: "cancel" },
    {
      text: "حذف",
      style: "destructive",
      onPress: async () => {
        await deleteUserAddress(id);
        const user = await fetchUserProfile();
        setAddresses(user.addresses);
      },
    },
  ]);
};


  return (
      <GestureHandlerRootView style={{ flex: 1 }}>

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#FF5252', '#D84315']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.headerTitle}>العناوين المحفوظة</Text>
        </LinearGradient>

        {/* Address List */}
        <FlatList
          ref={flatListRef}
          data={addresses}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: addresses.length > 0 ? 250 : 20 }
          ]}
          renderItem={({ item, index }) => (
            <View style={styles.addressCard}>
              <View style={styles.addressInfo}>
                <View style={styles.addressHeader}>
                  <MaterialIcons name="location-on" size={20} color="#D84315" />
                  <Text style={styles.addressLabel}>{item.label}</Text>
                </View>
                <Text style={styles.addressText}>{item.city}</Text>
                <Text style={styles.addressText}>{item.street}</Text>
                {item.location && (
                  <Text style={styles.locationText}>
                    الإحداثيات: {item.location.lat.toFixed(4)},{" "}
                    {item.location.lng.toFixed(4)}
                  </Text>
                )}
                <TouchableOpacity
                  style={{
                    marginTop: 8,
                    alignSelf: "flex-start",
backgroundColor: selectedAddressId === item._id ? "#4CAF50" : "#E0E0E0",

                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                  }}
                  onPress={() => setAsDefault(item._id)}
                >
             <Text style={{ color: selectedAddressId === item._id ? "#FFF" : "#000" }}>
  {selectedAddressId === item._id ? "العنوان الافتراضي" : "تعيين كافتراضي"}
</Text>
                </TouchableOpacity>


              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(index)}
              >
                <Ionicons name="trash" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="location-off" size={50} color="#E0E0E0" />
              <Text style={styles.emptyText}>لا توجد عناوين مسجلة</Text>
            </View>
          }
        />

        {/* Add New Address Form - Fixed at bottom */}
        {formVisible && (
          <Modal
            visible={formVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setFormVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.sectionTitle}>إضافة عنوان جديد</Text>

                {/* الحقول */}
                <View style={styles.inputContainer}>
                  <MaterialIcons name="label" size={20} color="#5D4037" style={styles.inputIcon} />
                  <TextInput
                    placeholder="اسم العنوان"
                    placeholderTextColor="#888"
                    value={label}
                    onChangeText={setLabel}
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <MaterialIcons name="location-city" size={20} color="#5D4037" style={styles.inputIcon} />
           <TouchableOpacity
  style={styles.dropdownInput}
  onPress={() => {
    Keyboard.dismiss();
    setCityPickerVisible(true);
  }}
>
  <Text style={{ color: city ? '#333' : '#999' }}>
    {city || 'اختر محافظة...'}
  </Text>
</TouchableOpacity>

                </View>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="map" size={20} color="#5D4037" style={styles.inputIcon} />
                  <TextInput
                    placeholder="وصف الشارع"
                    placeholderTextColor="#888"
                    value={street}
                    onChangeText={setStreet}
                    style={styles.input}
                  />
                </View>

                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={async () => {
                    await AsyncStorage.setItem("temp_label", label);
                    await AsyncStorage.setItem("temp_city", city);
                    await AsyncStorage.setItem("temp_street", street);
                    navigation.navigate("SelectLocation");
                  }}
                >
                  <LinearGradient
                    colors={location ? ["#4CAF50", "#2E7D32"] : ["#2196F3", "#1976D2"]}
                    style={styles.buttonGradient}
                  >
                    <MaterialIcons
                      name={location ? "check-circle" : "map"}
                      size={20}
                      color="#FFF"
                    />
                    <Text style={styles.buttonText}>
                      {location ? "تم تحديد الموقع" : "تحديد الموقع من الخريطة"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddAddress}
                >
                  <LinearGradient colors={["#D84315", "#FF5252"]} style={styles.buttonGradient}>
                    <MaterialIcons name="add-location" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>إضافة العنوان</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setFormVisible(false)} style={{ marginTop: 10 }}>
                  <Text style={{ textAlign: "center", color: "#888" }}>إغلاق</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setFormVisible(true)}
        >
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>

<Modal
  visible={cityPickerVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setCityPickerVisible(false)}
>
  <TouchableOpacity
    style={styles.modalOverlay}
    activeOpacity={1}
    onPressOut={() => setCityPickerVisible(false)}
  >
    <View style={styles.cityModalContainer}>
      <Text style={styles.sectionTitle}>اختر المحافظة</Text>

      <FlatList
        data={YEMEN_CITIES}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setCity(item);
              setCityPickerVisible(false);
            }}
            style={styles.cityItem}
          >
            <Text style={styles.cityText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity onPress={() => setCityPickerVisible(false)}>
        <Text style={{ textAlign: "center", color: "#888", marginTop: 10 }}>إغلاق</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
</Modal>



      </View>
    </KeyboardAvoidingView>
      </GestureHandlerRootView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  cityModalContainer: {
  backgroundColor: "#FFF",
  padding: 20,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  maxHeight: "60%",
},
cityItem: {
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderColor: "#eee",
},
cityText: {
  fontSize: 16,
  fontFamily: "Cairo-Regular",
  textAlign: "center",
},
dropdownInput: {
  flex: 1,
  padding: 12,
  backgroundColor: "#FFF",
  borderWidth: 1,
  borderColor: "#DDD",
  borderRadius: 10,
  justifyContent: "center",
},

  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    width: "90%",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#D84315",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  }
  ,
  header: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 22,
    color: "#FFF",
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  addressCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  addressInfo: {
    flex: 1,
    marginRight: 10,
  },
  addressHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 8,
  },
  addressLabel: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    color: "#333",
    textAlign: "right",

    marginRight: 8,
  },
  addressText: {
    fontFamily: "Cairo-Regular",
    color: "#555",
    textAlign: "right",

    marginBottom: 4,
  },
  locationText: {
    fontFamily: "Cairo-Regular",
    fontSize: 12,
    color: "#888",
    marginTop: 4,
    textAlign: "right",

  },
  deleteButton: {
    backgroundColor: "#D32F2F",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: "Cairo-Regular",
    color: "#888",
    marginTop: 10,
    fontSize: 16,
  },
  formContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 18,
    color: "#D84315",
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  inputIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontFamily: "Cairo-Regular",
    color: "#333",
    textAlign: "right",
    height: "100%",
  },
  locationButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 3,
  },
  addButton: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },
  buttonGradient: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
  },
  buttonText: {
    fontFamily: "Cairo-SemiBold",
    color: "#FFF",
    fontSize: 16,
    marginRight: 10,
  },
});

export default DeliveryAddressesScreen;