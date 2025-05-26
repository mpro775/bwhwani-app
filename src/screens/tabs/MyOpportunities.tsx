import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  RefreshControl,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { LinearGradient } from "expo-linear-gradient";
import { Swipeable } from "react-native-gesture-handler";

// أنواع البيانات
type Opportunity = {
  id: string;
  title: string;
  governorate: string;
  date: string;
  applicants: number;
  image?: string;
};

type Message = {
  id: string;
  from: string;
  opportunityId: string;
  text: string;
  date: string;
  read: boolean;
};

type UserProfile = {
  name: string;
  avatar?: string;
  role: "مقدم خدمة" | "صاحب فرصة";
  serviceOrField: string;
  governorate: string;
  rating?: number;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MyOpportunitiesDashboard = () => {
  const navigation = useNavigation<NavigationProp>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // تحميل البيانات
  const loadData = async () => {
    setRefreshing(true);
    
    try {
      const dummyProfile: UserProfile = {
        name: "ياسر إبراهيم",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        role: "مقدم خدمة",
        serviceOrField: "تصميم جرافيك",
        governorate: "صنعاء",
        rating: 4.8,
      };

      const dummyOpportunities: Opportunity[] = [
        {
          id: "opp1",
          title: "تصميم شعار لمتجر إلكتروني",
          governorate: "عدن",
          date: "2025-05-10",
          applicants: 5,
          image: "https://source.unsplash.com/random/300x200/?logo",
        },
        {
          id: "opp2",
          title: "مطلوب مطور تطبيقات Flutter",
          governorate: "تعز",
          date: "2025-05-12",
          applicants: 3,
          image: "https://source.unsplash.com/random/300x200/?app",
        },
      ];

      const dummyMessages: Message[] = [
        {
          id: "msg1",
          from: "ريم عبدالسلام",
          opportunityId: "opp1",
          text: "أنا مهتمة بالمشروع، هذه أعمالي...",
          date: "2025-05-12",
          read: false,
        },
        {
          id: "msg2",
          from: "أحمد علي",
          opportunityId: "opp2",
          text: "هل المشروع ما زال متاحاً؟",
          date: "2025-05-13",
          read: true,
        },
      ];

      setProfile(dummyProfile);
      setOpportunities(dummyOpportunities);
      setMessages(dummyMessages);

      await AsyncStorage.setItem("opportunities", JSON.stringify(dummyOpportunities));
      await AsyncStorage.setItem("opportunity-messages", JSON.stringify(dummyMessages));
      await AsyncStorage.setItem("opportunity-profile", JSON.stringify(dummyProfile));

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // حذف الفرصة
  const deleteOpportunity = (id: string) => {
    setOpportunities(prev => prev.filter(opp => opp.id !== id));
  };

  // حذف الرسالة
  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  // عرض تفاصيل الفرصة
  const showOpportunityDetails = (id: string) => {
    navigation.navigate("OpportunityDetailsScreen", { opportunityId: id });
  };

  // عرض المحادثة
  const showChat = (opportunityId: string) => {
    navigation.navigate("OpportunityChatScreen", { opportunityId });
  };

  // زر السحب للحذف
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

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
      >
        {/* رأس الصفحة */}
        <LinearGradient
          colors={['#6A1B9A', '#9C27B0']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.headerTitle}>لوحة تحكم الفرص</Text>
        </LinearGradient>

        {/* الملف الشخصي */}
        {profile && (
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <View style={styles.profileHeader}>
              {profile.avatar && (
                <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              )}
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileRole}>{profile.role}</Text>
                {profile.rating && (
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{profile.rating}</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.profileDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="briefcase" size={18} color="#6A1B9A" />
                <Text style={styles.detailText}>{profile.serviceOrField}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="location" size={18} color="#6A1B9A" />
                <Text style={styles.detailText}>{profile.governorate}</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* بطاقات الإحصائيات */}
        <View style={styles.statsContainer}>
          <Animated.View style={[styles.statCard, { backgroundColor: '#4CAF50', opacity: fadeAnim }]}>
            <Text style={styles.statNumber}>{opportunities.length}</Text>
            <Text style={styles.statLabel}>الفرص المنشورة</Text>
          </Animated.View>

          <Animated.View style={[styles.statCard, { backgroundColor: '#2196F3', opacity: fadeAnim }]}>
            <Text style={styles.statNumber}>
              {opportunities.reduce((sum, opp) => sum + opp.applicants, 0)}
            </Text>
            <Text style={styles.statLabel}>المتقدمين</Text>
          </Animated.View>

          <Animated.View style={[styles.statCard, { backgroundColor: '#FF9800', opacity: fadeAnim }]}>
            <Text style={styles.statNumber}>{messages.length}</Text>
            <Text style={styles.statLabel}>الرسائل</Text>
          </Animated.View>
        </View>

        {/* الفرص المضافة */}
        <Text style={styles.sectionTitle}>📌 الفرص المضافة</Text>
        {opportunities.map((opp) => (
          <Swipeable
            key={opp.id}
            renderRightActions={() => renderRightActions(() => deleteOpportunity(opp.id))}
          >
            <Animated.View style={[styles.opportunityCard, { opacity: fadeAnim }]}>
              {opp.image && (
                <Image source={{ uri: opp.image }} style={styles.opportunityImage} />
              )}
              <View style={styles.opportunityContent}>
                <Text style={styles.opportunityTitle}>{opp.title}</Text>
                <View style={styles.opportunityMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="location" size={14} color="#757575" />
                    <Text style={styles.metaText}>{opp.governorate}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar" size={14} color="#757575" />
                    <Text style={styles.metaText}>{opp.date}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="people" size={14} color="#757575" />
                    <Text style={styles.metaText}>{opp.applicants} مهتم</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => showOpportunityDetails(opp.id)}
                >
                  <Text style={styles.buttonText}>عرض التفاصيل</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Swipeable>
        ))}

        {/* الرسائل الواردة */}
        <Text style={styles.sectionTitle}>📩 الرسائل الواردة</Text>
        {messages.map((msg) => (
          <Swipeable
            key={msg.id}
            renderRightActions={() => renderRightActions(() => deleteMessage(msg.id))}
          >
            <Animated.View 
              style={[
                styles.messageCard, 
                { opacity: fadeAnim, borderLeftColor: msg.read ? '#E0E0E0' : '#6A1B9A' }
              ]}
            >
              <View style={styles.messageHeader}>
                <Text style={styles.messageFrom}>{msg.from}</Text>
                <Text style={styles.messageDate}>{msg.date}</Text>
              </View>
              <Text style={styles.messageText} numberOfLines={2}>{msg.text}</Text>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => showChat(msg.opportunityId)}
              >
                <Text style={styles.buttonText}>فتح المحادثة</Text>
                <Ionicons name="chevron-forward" size={16} color="#6A1B9A" />
              </TouchableOpacity>
            </Animated.View>
          </Swipeable>
        ))}
      </ScrollView>

      {/* زر عائم لإضافة فرصة */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("AddOpportunityScreen")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

// الأنماط
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileRole: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  profileDetails: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  detailText: {
    marginLeft: 8,
    color: '#424242',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 10,
    padding: 12,
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
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  opportunityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  opportunityImage: {
    width: '100%',
    height: 120,
  },
  opportunityContent: {
    padding: 12,
  },
  opportunityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  opportunityMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#757575',
  },
  detailsButton: {
    backgroundColor: '#6A1B9A',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  messageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  messageFrom: {
    fontWeight: 'bold',
    color: '#212121',
  },
  messageDate: {
    color: '#757575',
    fontSize: 12,
  },
  messageText: {
    color: '#616161',
    marginBottom: 12,
    lineHeight: 20,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#6A1B9A',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6A1B9A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  deleteBox: {
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '80%',
    borderRadius: 10,
    marginTop: 8,
  },
});

export default MyOpportunitiesDashboard;