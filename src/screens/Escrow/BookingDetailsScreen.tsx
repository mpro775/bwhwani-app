import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  SafeAreaView,
  Animated,
  Platform,
  Button,
  TextInput,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import { RootStackParamList } from "../../types/navigation";
import { LinearGradient } from "expo-linear-gradient";
import { SharedElement } from "react-navigation-shared-element";
import { Rating } from "react-native-ratings";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axiosInstance from "utils/api/axiosInstance";

const { width } = Dimensions.get("window");

// ألوان التصميم
const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  accent: "#8B4B47",
  background: "#FFF8F0",
  text: "#3E2723",
  lightText: "#757575",
  white: "#FFFFFF",
  lightGray: "#F5F5F5",
  success: "#4CAF50",
};

type Booking = {
  id: string;
  title: string;
  type: string;
  governorate: string;
  price: number;
  description: string;
  status:string;
  availableHours: string[];
  contactNumber: string;
  media: { uri: string; type: "image" | "video" }[];
  rating: number;
  reviews: number;
    unavailableDates: { from: string; to: string }[];
cancelReason:string;
  amenities: string[];
  owner: {
    name: string;
    avatar: string;
    joined: string;
  };
};

type RouteParams = RouteProp<RootStackParamList, "BookingDetailsScreen">;



export default function BookingDetailsScreen() {
  const route = useRoute<RouteParams>();
  const [cancelReason, setCancelReason] = useState("");

const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { bookingId } = route.params;
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const [booking, setBooking] = useState<Booking | null>(null);
useEffect(() => {
  const fetchBooking = async () => {
    try {
      const response = await axiosInstance.get(`/api/bookings/${bookingId}`);
      setBooking(response.data);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      Alert.alert('خطأ', 'لم يتم العثور على الحجز');
    }
  };

  fetchBooking();
}, [bookingId]);
  if (!booking) return null;

const handleBookNow = () => {
  if (!booking) return;
  
 navigation.navigate("BookingFormScreen", {
  bookingId: booking.id,
  title: booking.title,
  price: booking.price,
  availableHours: booking.availableHours,
  image: booking.media[0]?.uri || "",
  unavailableHours: ["4:00 م"], // ← مؤقتًا بيانات وهمية أو حقيقية
});
};


  const handleContactOwner = () => {
    navigation.navigate("BookingChatScreen", { bookingId: booking.id });
  };

  const renderAmenityIcon = (amenity: string) => {
    switch(amenity) {
      case "واي فاي": return <Ionicons name="wifi" size={20} color={COLORS.primary} />;
      case "موقف سيارات": return <Ionicons name="car" size={20} color={COLORS.primary} />;
      case "قاعة طعام": return <MaterialIcons name="restaurant" size={20} color={COLORS.primary} />;
      case "تكييف": return <MaterialIcons name="ac-unit" size={20} color={COLORS.primary} />;
      case "إضاءة متطورة": return <Ionicons name="bulb" size={20} color={COLORS.primary} />;
      case "خدمات إضافية": return <MaterialIcons name="more" size={20} color={COLORS.primary} />;
      default: return <Ionicons name="checkmark" size={20} color={COLORS.primary} />;
    }
  };
{booking.status === "cancelled" && (
  <View style={{ backgroundColor: "#fee2e2", padding: 12, borderRadius: 8 }}>
    <Text style={{ color: "#b91c1c", fontWeight: "bold" }}>تم إلغاء الحجز</Text>
    <Text>السبب: {booking.cancelReason || "غير محدد"}</Text>
  </View>
)}
{booking.status === "pending" && (
  <>
    <TextInput
      placeholder="سبب الإلغاء"
      value={cancelReason}
      onChangeText={setCancelReason}
      style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 8 }}
    />
    <Button
      title="إلغاء الحجز"
      onPress={async () => {
        await axiosInstance.put(`/api/bookings/${booking.id}/status`, {
          status: "cancelled",
          reason: cancelReason
        });
        Alert.alert("تم الإلغاء");
        navigation.goBack();
      }}
    />
  </>
)}
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* معرض الوسائط */}
        <View style={styles.mediaContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / width
              );
              setActiveMediaIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {booking.media.map((item, index) => (
              <View key={index} style={styles.mediaItem}>
                {item.type === "image" ? (
                  <SharedElement id={`item.${booking.id}.photo`}>
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.media}
                    />
                  </SharedElement>
                ) : (
                  <Video
                    source={{ uri: item.uri }}
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    style={styles.media}
                  />
                )}
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.mediaPagination}>
            {booking.media.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeMediaIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>
          
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* تفاصيل الحجز */}
        <ScrollView
          contentContainerStyle={styles.detailsContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{booking.title}</Text>
            
            <View style={styles.ratingContainer}>
              <Rating
                type="star"
                ratingCount={5}
                imageSize={20}
                readonly
                startingValue={booking.rating}
                tintColor={COLORS.background}
              />
              <Text style={styles.ratingText}>
                {booking.rating} ({booking.reviews} تقييم)
              </Text>
            </View>
            
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Ionicons name="pricetags" size={16} color={COLORS.primary} />
                <Text style={styles.metaText}>{booking.type}</Text>
              </View>
              
              <View style={styles.metaItem}>
                <Ionicons name="location" size={16} color={COLORS.primary} />
                <Text style={styles.metaText}>{booking.governorate}</Text>
              </View>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>السعر:</Text>
              <Text style={styles.price}>{booking.price.toLocaleString()} ر.ي</Text>
            </View>
          </View>

          {/* معلومات المالك */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات المالك</Text>
            <View style={styles.ownerContainer}>
              <Image
                source={{ uri: booking.owner.avatar }}
                style={styles.ownerAvatar}
              />
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerName}>{booking.owner.name}</Text>
                <Text style={styles.ownerJoined}>{booking.owner.joined}</Text>
              </View>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={handleContactOwner}
              >
                <Ionicons name="chatbox" size={18} color="white" />
                <Text style={styles.contactButtonText}>تواصل</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* الأوقات المتاحة */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الأوقات المتاحة</Text>
            <View style={styles.hoursList}>
              {booking.availableHours.map((hour, index) => (
                <View key={index} style={styles.hourBadge}>
                  <Text style={styles.hourText}>{hour}</Text>
                </View>
              ))}
            </View>
          </View>
<View style={styles.section}>
  <Text style={styles.sectionTitle}>تواريخ محجوزة</Text>
  {booking.unavailableDates.map(({ from, to }, i) => (
    <Text key={i} style={styles.dateRangeText}>
      من {from} إلى {to}
    </Text>
  ))}
</View>
          {/* المرافق */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>المرافق والخدمات</Text>
            <View style={styles.amenitiesContainer}>
              {booking.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  {renderAmenityIcon(amenity)}
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* الوصف */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الوصف</Text>
            <Text style={styles.description}>{booking.description}</Text>
          </View>

          {/* رقم التواصل */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>رقم التواصل</Text>
            <View style={styles.phoneContainer}>
              <Ionicons name="call" size={20} color={COLORS.primary} />
              <Text style={styles.phone}>{booking.contactNumber}</Text>
            </View>
          </View>
        </ScrollView>

        {/* أزرار الحجز */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBookNow}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="calendar" size={20} color="white" />
              <Text style={styles.bookButtonText}>احجز الآن</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  mediaContainer: {
    height: 300,
    position: 'relative',
  },
  mediaItem: {
    width: width,
    height: 300,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  mediaPagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 16,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    paddingBottom: 100,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.lightText,
    marginLeft: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  dateRangeText: {
  fontSize: 14,
  color: COLORS.text,
  marginBottom: 6,
},

  metaText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  ownerJoined: {
    fontSize: 12,
    color: COLORS.lightText,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  contactButtonText: {
    color: COLORS.white,
    fontSize: 14,
    marginLeft: 6,
  },
  hoursList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hourBadge: {
    backgroundColor: '#FBE9E7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  hourText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 6,
  },
  description: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  phone: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 8,
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  bookButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

// إضافة هذا للانتقالات المشتركة
BookingDetailsScreen.sharedElements = (route: any) => {
  const { bookingId } = route.params;
  return [`item.${bookingId}.photo`];
};