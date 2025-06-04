import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axiosInstance from "utils/api/axiosInstance";

type LocationType = {
  lat: number;
  lng: number;
  address: string;
};

const TransportBookingScreen = () => {
  const { params } = useRoute();
  const route = useRoute<RouteProp<RootStackParamList, "TransportBooking">>();

const category = route.params?.category || "waslni";

const [fromLocation, setFromLocation] = useState<LocationType | null>(null);
const [toLocation, setToLocation] = useState<LocationType | null>(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isFemaleOnly, setIsFemaleOnly] = useState(false);
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadLocations = async () => {
      const from = await AsyncStorage.getItem("waslni_from_location");
      const to = await AsyncStorage.getItem("waslni_to_location");
      if (from) setFromLocation(JSON.parse(from));
      if (to) setToLocation(JSON.parse(to));
    };
    loadLocations();
  }, []);

const openMap = async (mode: "from" | "to") => {
  await AsyncStorage.setItem("map_mode", mode);
  navigation.navigate("SelectLocation");
};

  const handleSubmit = async () => {
    if (!fromLocation || !toLocation) {
      Alert.alert("يرجى اختيار موقع الانطلاق والوصول");
      return;
    }
if (new Date(date) < new Date()) {
  Alert.alert("خطأ", "لا يمكن تحديد وقت في الماضي");
  return;
}

    try {
      const token = await AsyncStorage.getItem("firebase-token");

      await axiosInstance.post(
        "/waslni/request",
        {
          category,
          fromLocation,
          toLocation,
          dateTime: date,
          isFemaleDriver: isFemaleOnly,
          city: fromLocation?.address?.split(",").pop()?.trim() || "غير معروف",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("✅ تم إرسال الطلب");
      navigation.goBack();
    } catch (error) {
      console.error("❌ فشل:", error);
      Alert.alert("خطأ", "فشل إرسال الطلب");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>تفاصيل الحجز</Text>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => openMap("from")}
      >
        <Ionicons name="location" size={20} color="#FFF" />
        <Text style={styles.buttonText}>
          {fromLocation ? `من: ${fromLocation.address}` : "اختر موقع الانطلاق"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => openMap("to")}
      >
        <Ionicons name="flag" size={20} color="#FFF" />
        <Text style={styles.buttonText}>
          {toLocation ? `إلى: ${toLocation.address}` : "اختر موقع الوصول"}
        </Text>
      </TouchableOpacity>


      <View style={{ marginVertical: 10 }}>
        <Button title="اختر الوقت" onPress={() => setShowPicker(true)} />
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={(_, selected) => {
              setShowPicker(false);
              if (selected) setDate(selected);
            }}
          />
        )}
      </View>
<TouchableOpacity
  onPress={() => navigation.navigate("TransportBooking", { category: category === 'waslni' ? 'heavy' : 'waslni' })}
  style={{ alignSelf: "center", marginBottom: 10 }}
>
  <Text style={{ color: "#2196F3" }}>
    التبديل إلى {category === 'waslni' ? 'نقل ثقيل' : 'نقل خاص'}
  </Text>
</TouchableOpacity>

      {category === "waslni" && (
        <View style={styles.switchRow}>
          <Text style={styles.label}>سائقة فقط؟</Text>
          <Button
            title={isFemaleOnly ? "نعم" : "لا"}
            onPress={() => setIsFemaleOnly((prev) => !prev)}
            color={isFemaleOnly ? "#4CAF50" : "#9E9E9E"}
          />
        </View>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="إرسال الطلب" onPress={handleSubmit} color="#2196F3" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontFamily: "Cairo-Bold",
    marginBottom: 16,
    textAlign: "center",
  },
  locationButton: {
    backgroundColor: "#FF5722",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    color: "#FFF",
    fontFamily: "Cairo-SemiBold",
  },
  switchRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
  },
});

export default TransportBookingScreen;
