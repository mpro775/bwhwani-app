// screens/opportunities/FreelancerDetailsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  SafeAreaView,
  FlatList,
  Dimensions,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getFreelancerDetails } from "api/freelancerApi";
import axiosInstance from "utils/api/axiosInstance";
import BookingCalendar from "components/BookingCalendar";
import moment from "moment";
import FAQSection from "components/FAQSection";

type Freelancer = {
  id: string;
  name: string;
  service: string;
  governorate: string;
  phone: string;
  description: string;
  portfolio: string[];
  experience: string;
  rating: number;
  trusted: boolean;

};

type RouteParams = {
  FreelancerDetails: { freelancerId: string };
};
type AvailabilityItem = {
  day: string;
  start: string;
  end: string;
};
type BookingItem = {
  _id: string;
  date: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no-show";
};

const { width } = Dimensions.get("window");

const FreelancerDetailsScreen = () => {
  const route = useRoute<RouteProp<RouteParams, "FreelancerDetails">>();
  const { freelancerId } = route.params;
  const navigation = useNavigation();
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const [loading, setLoading] = useState(true);
const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
const [selectedDate, setSelectedDate] = useState<string | null>(null);
const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
const [dayAvailability, setDayAvailability] = useState<{ start: string; end: string } | null>(null);
const [userBookings, setUserBookings] = useState<BookingItem[]>([]);
useEffect(() => {
  const fetchBookings = async () => {
    const res = await axiosInstance.get(`/api/bookings/user/${freelancerId}`);
    setUserBookings(res.data); // يجب أن تحتوي على date, status, bookingId
  };
  fetchBookings();
}, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFreelancerDetails(freelancerId);
        setFreelancer({
          id: data._id,
          name: data.fullName,
          service: data.freelanceData.serviceCategory,
          governorate: data.freelanceData.city,
          phone: data.phoneNumber,
          description: data.freelanceData.bio,
          portfolio: data.freelanceData.portfolioImages || [],
          experience: "3 سنوات", // تحديث لاحقًا من الباك إن وجد
          rating: data.freelanceData.rating || 0,
          trusted: data.freelancerProfile?.badges?.includes("trusted")

        });
      } catch (err) {
        Alert.alert("خطأ", "فشل في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [freelancerId]);

  
  const fetchAvailability = async () => {
  try {
    const res = await axiosInstance.get(`/api/freelancer/${freelancerId}/availability`);
    setAvailability(res.data);
  } catch {
    Alert.alert("خطأ", "تعذر تحميل جدول التوفر");
  }
};
fetchAvailability();

const now = new Date();
const confirmedPastBooking = userBookings.find(
  (b) =>
    b.status === "confirmed" &&
    new Date(b.date) < now
);

  const handleContact = (type: "call" | "whatsapp") => {
    if (!freelancer) return;
    const phone = freelancer.phone;
    if (type === "call") {
      Linking.openURL(`tel:${phone}`);
    } else {
      Linking.openURL(`whatsapp://send?phone=${phone}`);
    }
  };

  const renderPortfolioItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.portfolioItem}>
      <Image source={{ uri: item }} style={styles.portfolioImage} />
    </TouchableOpacity>
  );

  if (loading || !freelancer) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>جارٍ تحميل البيانات...</Text>
      </View>
    );
  }

  const handleSelectDate = (date: string) => {
  setSelectedDate(date);
  const day = moment(date).locale("en").format("dddd"); // e.g., "Monday"
  const available = availability.find((a) => a.day === day);
  if (available) {
    setDayAvailability({ start: available.start, end: available.end });
    setSelectedSlot(null);
  }
};
const generateTimeSlots = (start: string, end: string): string[] => {
  const slots = [];
  const startHour = parseInt(start.split(":")[0]);
  const endHour = parseInt(end.split(":")[0]);

  for (let h = startHour; h < endHour; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
    slots.push(`${h.toString().padStart(2, "0")}:30`);
  }
  return slots;
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#D84315" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>تفاصيل المزود</Text>
          <View style={styles.headerRight} />
        </View>

        <LinearGradient colors={["#FFF", "#FFF8F6"]} style={styles.profileCard}>
<View style={styles.nameRow}>
  <Text style={styles.name}>{freelancer.name}</Text>
  {freelancer.trusted && (
    <Ionicons
      name="shield-checkmark"
      size={20}
      color="#2E7D32"
      style={{ marginRight: 8 }}
    />
  )}
</View>
{confirmedPastBooking && (
  <TouchableOpacity
    onPress={async () => {
      try {
        await axiosInstance.patch(`/api/booking/${confirmedPastBooking._id}/status`, {
          status: "no-show",
        });
        Alert.alert("تم التحديث", "تم الإبلاغ عن غياب المزود.");
      } catch {
        Alert.alert("خطأ", "حدث خطأ أثناء الإبلاغ");
      }
    }}
    style={{
      backgroundColor: "#F44336",
      padding: 14,
      margin: 16,
      borderRadius: 10,
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontFamily: "Cairo-Bold",
        textAlign: "center",
      }}
    >
      لم يحضر الموعد
    </Text>
  </TouchableOpacity>
)}

          <View style={styles.metaContainer}>
            <View style={styles.chip}>
              <Ionicons name="briefcase" size={14} color="#D84315" />
              <Text style={styles.chipText}>{freelancer.service}</Text>
            </View>
            <View style={styles.chip}>
              <Ionicons name="location" size={14} color="#D84315" />
              <Text style={styles.chipText}>{freelancer.governorate}</Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFC107" />
            <Text style={styles.ratingText}>{freelancer.rating}</Text>
            <Text style={styles.experienceText}>{freelancer.experience} خبرة</Text>
          </View>

          <Text style={styles.description}>{freelancer.description}</Text>
        </LinearGradient>

        {freelancer.portfolio?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معرض الأعمال</Text>
            <FlatList
              horizontal
              data={freelancer.portfolio}
              renderItem={renderPortfolioItem}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.portfolioList}
            />
          </View>
        )}

{availability.length > 0 && (
<BookingCalendar availability={availability} onDateSelect={handleSelectDate} />

)}

{selectedDate && (
  <TouchableOpacity
    style={{
      backgroundColor: "#2E7D32",
      padding: 14,
      borderRadius: 10,
      margin: 16,
    }}
    onPress={async () => {
      try {
        await axiosInstance.post("/api/booking/request", {
        freelancerId,
      date: `${selectedDate}T${selectedSlot}:00Z`,
        });
        Alert.alert("تم الحجز", "تم إرسال طلب الحجز بنجاح");
        setSelectedDate(null);
            setSelectedSlot(null);

      } catch {
        Alert.alert("خطأ", "فشل في إرسال طلب الحجز");
      }
    }}
  >
    <FAQSection />

    <Text style={{ color: "#fff", fontFamily: "Cairo-Bold", textAlign: "center" }}>
      تأكيد الحجز ليوم {selectedDate}
    </Text>
  </TouchableOpacity>
)}

{dayAvailability && (
  <View style={{ marginHorizontal: 16, marginTop: 16 }}>
    <Text style={{ fontFamily: "Cairo-Bold", fontSize: 16, marginBottom: 8 }}>
      اختر الساعة المتاحة:
    </Text>
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
      {generateTimeSlots(dayAvailability.start, dayAvailability.end).map((slot) => (
        <TouchableOpacity
          key={slot}
          style={{
            padding: 10,
            borderRadius: 8,
            backgroundColor: selectedSlot === slot ? "#2E7D32" : "#eee",
          }}
          onPress={() => setSelectedSlot(slot)}
        >
          <Text style={{ color: selectedSlot === slot ? "#fff" : "#000" }}>{slot}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
)}

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.whatsappButton]} onPress={() => handleContact("whatsapp")}>
            <Ionicons name="logo-whatsapp" size={24} color="#FFF" />
            <Text style={styles.buttonText}>واتساب</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.callButton]} onPress={() => handleContact("call")}>
            <Ionicons name="call" size={24} color="#FFF" />
            <Text style={styles.buttonText}>اتصال مباشر</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  nameRow: {
  flexDirection: "row-reverse",
  alignItems: "center",
  justifyContent: "flex-start",
  marginBottom: 12,
},

  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 20,
    color: "#333",
  },
  headerRight: {
    width: 40,
  },
  profileCard: {
    padding: 24,
    margin: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  name: {
    fontFamily: "Cairo-Bold",
    fontSize: 24,
    color: "#2C3E50",
    textAlign: "right",
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: "row-reverse",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FBE9E7",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
  },
  chipText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    color: "#D84315",
  },
  ratingContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  ratingText: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    color: "#2C3E50",
  },
  experienceText: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  description: {
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    textAlign: "right",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 20,
    color: "#2C3E50",
    marginBottom: 16,
    textAlign: "right",
  },
  portfolioList: {
    paddingLeft: 16,
  },
  portfolioItem: {
    marginRight: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  portfolioImage: {
    width: width * 0.6,
    height: 200,
    borderRadius: 12,
  },
  buttonGroup: {
    flexDirection: "row-reverse",
    gap: 16,
    paddingHorizontal: 16,
    marginTop: 32,
  },
  button: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
  },
  whatsappButton: {
    backgroundColor: "#25D366",
  },
  callButton: {
    backgroundColor: "#D84315",
  },
  buttonText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: "#FFF",
  },
});

export default FreelancerDetailsScreen;
