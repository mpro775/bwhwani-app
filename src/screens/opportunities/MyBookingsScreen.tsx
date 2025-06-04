// screens/bookings/MyBookingsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import moment from "moment";
import "moment/locale/ar";
import axiosInstance from "utils/api/axiosInstance";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type BookingItem = {
  _id: string;
  freelancerId: {
    fullName: string;
    profileImage: string;
    _id: string;
  };
  date: string;
  status: string;
  hasReview: boolean;
};

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

const statuses = ["الكل", "confirmed", "completed", "cancelled", "no-show"];
const [filter, setFilter] = useState("الكل");
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.get("/api/bookings/user");
        setBookings(res.data);
      } catch {
        Alert.alert("خطأ", "تعذر تحميل الحجوزات");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const renderStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "بانتظار الموافقة";
      case "confirmed":
        return "مؤكد";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغي";
      case "no-show":
        return "لم يحضر";
      default:
        return status;
    }
  };
  type RouteParams = {
  ReviewScreen: {
    freelancerId: string;
  };
};

const filteredBookings =
  filter === "الكل"
    ? bookings
    : bookings.filter((b) => b.status === filter);

   if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;
const renderItem = ({ item }: { item: BookingItem }) => (
  <View style={styles.card}>
    <Text style={styles.name}>{item.freelancerId.fullName}</Text>
    <Text style={styles.meta}>
      التاريخ: {moment(item.date).format("dddd، D MMMM YYYY")}
    </Text>
    <Text style={styles.meta}>الحالة: {renderStatus(item.status)}</Text>

    {item.status === "completed" && !item.hasReview && (
  <TouchableOpacity
    onPress={() => {
      navigation.navigate("ReviewScreen", {
        freelancerId: item.freelancerId._id,
      });
    }}
    style={styles.reviewButton}
  >
    <Text style={styles.reviewText}>إضافة تقييم</Text>
  </TouchableOpacity>
)}

  </View>
);

  return (
    
    <FlatList
      data={bookings}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  name: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: "#2C3E50",
    marginBottom: 4,
    textAlign: "right",
  },
  meta: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#555",
    textAlign: "right",
  },
  filterRow: {
  flexDirection: "row-reverse",
  justifyContent: "flex-start",
  flexWrap: "wrap",
  marginBottom: 16,
},
filterButton: {
  paddingVertical: 6,
  paddingHorizontal: 12,
  backgroundColor: "#EEE",
  borderRadius: 20,
  marginLeft: 8,
},
filterText: {
  fontFamily: "Cairo-Regular",
  fontSize: 14,
  color: "#333",
},
reviewButton: {
  marginTop: 10,
  backgroundColor: "#FF9800",
  padding: 8,
  borderRadius: 8,
},
reviewText: {
  color: "#fff",
  fontFamily: "Cairo-Bold",
  textAlign: "center",
},

});

export default MyBookingsScreen;
