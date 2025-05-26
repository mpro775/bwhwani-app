import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Swipeable } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

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
  info: "#2196F3",
  warning: "#FF9800",
};

type Booking = {
  id: string;
  title: string;
  type: string;
  governorate: string;
  views: number;
  comments: number;
  media: string[];
  status: "active" | "pending" | "expired";
};

type Message = {
  id: string;
  bookingId: string;
  from: string;
  text: string;
  time: string;
  read: boolean;
};

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const loadData = () => {
    setRefreshing(true);
    
    const dummyBookings: Booking[] = [
      {
        id: "1",
        title: "قاعة أفراح النجوم",
        type: "صالة",
        governorate: "صنعاء",
        views: 125,
        comments: 5,
        media: ["https://source.unsplash.com/random/600x400/?wedding"],
        status: "active",
      },
      {
        id: "2",
        title: "فندق الراحة",
        type: "فندق",
        governorate: "عدن",
        views: 94,
        comments: 2,
        media: ["https://source.unsplash.com/random/600x400/?hotel"],
        status: "pending",
      },
      {
        id: "3",
        title: "منتجع الشاطئ الذهبي",
        type: "منتجع",
        governorate: "المكلا",
        views: 210,
        comments: 12,
        media: ["https://source.unsplash.com/random/600x400/?resort"],
        status: "expired",
      },
    ];

    const dummyMessages: Message[] = [
      {
        id: "m1",
        bookingId: "1",
        from: "محمد أحمد",
        text: "هل القاعة متاحة يوم الجمعة؟",
        time: "10:00 ص",
        read: false,
      },
      {
        id: "m2",
        bookingId: "2",
        from: "أحمد علي",
        text: "هل يوجد خصم للحجز لمدة يومين؟",
        time: "11:20 ص",
        read: true,
      },
      {
        id: "m3",
        bookingId: "1",
        from: "سارة محمد",
        text: "ما هي الخدمات الإضافية المتوفرة؟",
        time: "02:30 م",
        read: true,
      },
    ];

    setTimeout(() => {
      setBookings(dummyBookings);
      setMessages(dummyMessages);
      setRefreshing(false);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1000);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalViews = bookings.reduce((sum, b) => sum + b.views, 0);
  const totalComments = bookings.reduce((sum, b) => sum + b.comments, 0);
  const activeBookings = bookings.filter(b => b.status === "active").length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;

  const renderRightActions = (onDelete: () => void) => {
    return (
      <TouchableOpacity
        style={styles.deleteBox}
        onPress={onDelete}
      >
        <MaterialIcons name="delete" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(() => console.log("Delete", item.id))}
    >
      <Animated.View style={[styles.bookingCard, { opacity: fadeAnim }]}>
        <Image source={{ uri: item.media[0] }} style={styles.bookingImage} />
        
        <View style={styles.bookingContent}>
          <View style={styles.bookingHeader}>
            <Text style={styles.bookingTitle}>{item.title}</Text>
            <View style={[
              styles.statusBadge,
              item.status === "active" && styles.activeBadge,
              item.status === "pending" && styles.pendingBadge,
              item.status === "expired" && styles.expiredBadge,
            ]}>
              <Text style={styles.statusText}>
                {item.status === "active" ? "نشط" : 
                 item.status === "pending" ? "قيد المراجعة" : "منتهي"}
              </Text>
            </View>
          </View>
          
          <Text style={styles.bookingLocation}>
            <Ionicons name="location" size={14} color={COLORS.accent} /> {item.governorate}
          </Text>
          
          <View style={styles.bookingStats}>
            <View style={styles.statItem}>
              <Ionicons name="eye" size={14} color={COLORS.lightText} />
              <Text style={styles.statText}>{item.views}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="chatbubble" size={14} color={COLORS.lightText} />
              <Text style={styles.statText}>{item.comments}</Text>
            </View>
            <TouchableOpacity
  style={{ marginTop: 8 }}
  onPress={() => navigation.navigate("ManageBookingAvailability", { bookingId: item.id })}
>
  <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
    إدارة الفترات المحجوزة
  </Text>
</TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Swipeable>
  );

  const renderMessageItem = ({ item }: { item: Message }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(() => console.log("Delete", item.id))}
    >
      <Animated.View 
        style={[
          styles.messageCard, 
          { 
            opacity: fadeAnim,
            borderLeftColor: item.read ? COLORS.lightGray : COLORS.primary,
          }
        ]}
      >
        <View style={styles.messageHeader}>
          <Text style={styles.messageFrom}>{item.from}</Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
        
        <Text style={styles.messageText}>{item.text}</Text>
        
        {!item.read && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>جديد</Text>
          </View>
        )}
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
        <Text style={styles.headerTitle}>لوحة تحكم الحجوزات</Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={loadData}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* بطاقات الإحصائيات */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: COLORS.primary }]}>
              <Ionicons name="layers" size={24} color="white" />
              <Text style={styles.statNumber}>{bookings.length}</Text>
              <Text style={styles.statLabel}>إجمالي الحجوزات</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: COLORS.info }]}>
              <Ionicons name="chatbubbles" size={24} color="white" />
              <Text style={styles.statNumber}>{messages.length}</Text>
              <Text style={styles.statLabel}>الرسائل</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: COLORS.warning }]}>
              <Ionicons name="eye" size={24} color="white" />
              <Text style={styles.statNumber}>{totalViews}</Text>
              <Text style={styles.statLabel}>المشاهدات</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: COLORS.success }]}>
              <Ionicons name="text" size={24} color="white" />
              <Text style={styles.statNumber}>{totalComments}</Text>
              <Text style={styles.statLabel}>التعليقات</Text>
            </View>
          </View>
        </View>

        {/* الحجوزات النشطة */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>حجوزاتي</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={renderBookingItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bookingsList}
          />
        </View>

        {/* حالة الحجوزات */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>حالة الحجوزات</Text>
          
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, styles.activeIndicator]} />
              <Text style={styles.statusLabel}>نشطة</Text>
              <Text style={styles.statusCount}>{activeBookings}</Text>
            </View>
            
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, styles.pendingIndicator]} />
              <Text style={styles.statusLabel}>قيد المراجعة</Text>
              <Text style={styles.statusCount}>{pendingBookings}</Text>
            </View>
            
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, styles.expiredIndicator]} />
              <Text style={styles.statusLabel}>منتهية</Text>
              <Text style={styles.statusCount}>
                {bookings.length - activeBookings - pendingBookings}
              </Text>
            </View>
          </View>
        </View>

        {/* الرسائل الواردة */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>آخر الرسائل</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          
          {messages.length > 0 ? (
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessageItem}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="mail-open" size={40} color={COLORS.lightGray} />
              <Text style={styles.emptyText}>لا توجد رسائل جديدة</Text>
            </View>
          )}
        </View>

      </ScrollView>
              <TouchableOpacity
  style={styles.fab}
  onPress={() => navigation.navigate("AddBookingScreen")}
>
  <Ionicons name="add" size={28} color="white" />
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
  },
  fab: {
  position: 'absolute',
  bottom: 30,
  right: 20,
  backgroundColor: COLORS.primary,
  borderRadius: 30,
  width: 60,
  height: 60,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
  zIndex: 100,
},

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  statsContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: 'white',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  bookingsList: {
    paddingVertical: 8,
  },
  bookingCard: {
    width: width * 0.7,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingImage: {
    width: '100%',
    height: 140,
  },
  bookingContent: {
    padding: 12,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  activeBadge: {
    backgroundColor: '#E8F5E9',
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
  },
  expiredBadge: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingLocation: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 8,
  },
  bookingStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: COLORS.lightText,
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 6,
  },
  activeIndicator: {
    backgroundColor: COLORS.success,
  },
  pendingIndicator: {
    backgroundColor: COLORS.warning,
  },
  expiredIndicator: {
    backgroundColor: COLORS.primary,
  },
  statusLabel: {
    fontSize: 12,
    color: COLORS.lightText,
    marginBottom: 4,
  },
  statusCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  messageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  messageFrom: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  messageTime: {
    fontSize: 12,
    color: COLORS.lightText,
  },
  messageText: {
    color: COLORS.text,
    lineHeight: 20,
  },
  unreadBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 8,
  },
  unreadText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.lightText,
    marginTop: 12,
  },
  deleteBox: {
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '80%',
    borderRadius: 12,
    marginTop: 8,
  },
});

export default MyBookingsScreen;