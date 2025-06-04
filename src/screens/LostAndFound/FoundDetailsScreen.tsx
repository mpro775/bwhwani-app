import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import axiosInstance from "utils/api/axiosInstance";
import { Ionicons } from "@expo/vector-icons";

type LostItem = {
  _id: string;
  title: string;
  status: string;
  location: { city: string };
  // باقي الحقول حسب الحاجة
};

const handleDeliveryRequest = async (item: LostItem) => {
  try {
    const token = await AsyncStorage.getItem("firebase-token");
    await axiosInstance.post("delivery/request", {
      itemId: item._id,
      type: "found",
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    Alert.alert("تم الطلب", "سيتم التواصل معك قريبًا من قبل المندوب");
  } catch (err) {
    Alert.alert("خطأ", "فشل في إرسال الطلب");
  }
};

const FoundDetailsScreen = ({ route, navigation }: any) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
     {item.images?.[0] && (
  <Image source={{ uri: item.images[0] }} style={styles.image} />
)}
{item.status === "active" && (
  <TouchableOpacity
    style={styles.chatButton}
    onPress={() => handleDeliveryRequest(item)}
  >
    
    <LinearGradient colors={["#1E88E5", "#1565C0"]} style={styles.gradient}>
      <Ionicons name="bicycle" size={20} color="#FFF" />
      <Text style={styles.chatText}>أرسل لي هذا العنصر</Text>
    </LinearGradient>
  </TouchableOpacity>
)}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>
  📍 {item.location?.city || "غير محدد"} • 🕒 {new Date(item.dateLostOrFound).toLocaleDateString("ar-SA")}
</Text>
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate("FoundChat", { item })}
        >
          <Text style={styles.chatText}>💬 التواصل بشأن هذا الشيء</Text>
        </TouchableOpacity>
        <Text style={{ fontFamily: "Cairo-Regular", color: "#777", marginBottom: 8 }}>
  الحالة: {item.status === "resolved" ? "تم تسليمه" : "قيد الانتظار"}
</Text>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF"},
  image: { width: "100%", height: 250 },
  content: { padding: 20 },
  title: {
    fontSize: 22,
    fontFamily: "Cairo-Bold",
    color: "#3E2723",
    marginBottom: 6,
  },
    gradient: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 12,
  },
  meta: {
    fontSize: 14,
    fontFamily: "Cairo-Regular",
    color: "#999",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: "#444",
    marginBottom: 20,
  },
  chatButton: {
    backgroundColor: "#D84315",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  chatText: {
    color: "#FFF",
    fontFamily: "Cairo-Bold",
    fontSize: 16,
  },
});

export default FoundDetailsScreen;
