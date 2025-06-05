// screens/BookingsListScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  RefreshControl,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Swipeable } from "react-native-gesture-handler";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import COLORS from "constants/colors";
import axiosInstance from "utils/api/axiosInstance";

const { width } = Dimensions.get("window");

type Booking = {
  id: string;
  title: string;
  type: string;
  governorate: string;
  price: number;
  rating: number;
  availableHours: string[];
  media: string[];
  amenities: string[];
};

const BookingsListScreen = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("الكل");
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const fadeAnim = useState(new Animated.Value(0))[0];
  const filters = ["الكل", "صالة", "فندق", "منتجع"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const response = await axiosInstance.get("/bookings");
      setBookings(response.data);
    } catch (error) {
      console.error("حدث خطأ أثناء جلب البيانات:", error);
    } finally {
      setRefreshing(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const filteredBookings =
    activeFilter === "الكل"
      ? bookings
      : bookings.filter((item) => item.type === activeFilter);

  const renderRightActions = () => (
    <TouchableOpacity style={styles.favoriteButton}>
      <MaterialIcons name="favorite" size={24} color="#D32F2F" />
    </TouchableOpacity>
  );

  const renderAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "واي فاي":
        return <Ionicons name="wifi" size={16} color={COLORS.primary} />;
      case "موقف سيارات":
        return <Ionicons name="car" size={16} color={COLORS.primary} />;
      case "قاعة طعام":
        return <MaterialIcons name="restaurant" size={16} color={COLORS.primary} />;
      case "تكييف":
        return <MaterialIcons name="ac-unit" size={16} color={COLORS.primary} />;
      case "مسبح":
        return <MaterialIcons name="pool" size={16} color={COLORS.primary} />;
      case "جيم":
        return <Ionicons name="barbell" size={16} color={COLORS.primary} />;
      case "شاطئ خاص":
        return <MaterialIcons name="beach-access" size={16} color={COLORS.primary} />;
      case "سبا":
        return <MaterialIcons name="spa" size={16} color={COLORS.primary} />;
      case "نادي أطفال":
        return <Ionicons name="people" size={16} color={COLORS.primary} />;
      default:
        return <Ionicons name="checkmark" size={16} color={COLORS.primary} />;
    }
  };

  const renderItem = ({ item }: { item: Booking }) => (
    <Swipeable renderRightActions={renderRightActions}>
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("BookingDetailsScreen", { bookingId: item.id })
          }
          activeOpacity={0.8}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.media[0] }} style={styles.image} />
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>
                {item.price.toLocaleString()} ر.ي
              </Text>
            </View>

            <View style={styles.locationRow}>
              <Ionicons
                name="location-sharp"
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.subtitle}>{item.governorate}</Text>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{item.type}</Text>
              </View>
            </View>

            <View style={styles.amenitiesRow}>
              {item.amenities.slice(0, 3).map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  {renderAmenityIcon(amenity)}
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
              {item.amenities.length > 3 && (
                <Text style={styles.moreAmenities}>
                  +{item.amenities.length - 3} أكثر
                </Text>
              )}
            </View>

            <View style={styles.hoursContainer}>
              <Text style={styles.hoursTitle}>الأوقات المتاحة:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hoursScroll}
              >
                {item.availableHours.map((hour, idx) => (
                  <View key={idx} style={styles.hourBadge}>
                    <Text style={styles.hourText}>{hour}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>الحجوزات المتاحة</Text>
      </LinearGradient>

      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.activeFilter,
            ]}
            onPress={() => setActiveFilter(filter)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadData}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="calendar-times-o" size={50} color="#E0E0E0" />
            <Text style={styles.emptyText}>
              لا توجد حجوزات متاحة حالياً
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddBookingScreen")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={COLORS.background} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  headerTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 22,
    color: COLORS.background,
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: COLORS.lightGray,
  },
  activeFilter: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    color: COLORS.text,
  },
  activeFilterText: {
    color: COLORS.background,
  },
  listContent: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
  },
  ratingBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontFamily: "Cairo-Bold",
    color: COLORS.background,
    fontSize: 12,
    marginLeft: 4,
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: COLORS.text,
  },
  price: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: 8,
  },
  locationRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: COLORS.lightText,
    marginLeft: 4,
  },
  typeBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  typeText: {
    fontFamily: "Cairo-Bold",
    fontSize: 12,
    color: "#2E7D32",
  },
  amenitiesRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  amenityItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 6,
    marginBottom: 6,
  },
  amenityText: {
    fontFamily: "Cairo-Regular",
    fontSize: 12,
    color: COLORS.text,
    marginRight: 4,
  },
  moreAmenities: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 12,
    color: COLORS.primary,
    alignSelf: "center",
    marginLeft: 6,
  },
  hoursContainer: {
    marginTop: 8,
  },
  hoursTitle: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 6,
  },
  hoursScroll: {
    paddingRight: 16,
  },
  hourBadge: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  hourText: {
    fontFamily: "Cairo-Bold",
    fontSize: 12,
    color: COLORS.primary,
  },
  favoriteButton: {
    backgroundColor: "#FFCDD2",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "80%",
    borderRadius: 16,
    marginTop: 8,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: "#9E9E9E",
    marginTop: 16,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
});

export default BookingsListScreen;
