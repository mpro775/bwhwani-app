import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

const { width } = Dimensions.get('window');

type BloodRequest = {
  id: string;
  bloodType: string;
  governorate: string;
  date: string;
  responses: number;
  urgent?: boolean;
  
};

type Message = {
  id: string;
  from: string;
  requestId: string;
  text: string;
  date: string;
  read: boolean;
};

type DonorProfile = {
  name: string;
  bloodType: string;
  governorate: string;
  lastDonation: string;

  donationCount: number;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MyBloodDashboard = () => {
  const navigation = useNavigation<NavigationProp>();
  const [donor, setDonor] = useState<DonorProfile | null>(null);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const dummyDonor: DonorProfile = {
        name: "عبدالله أحمد",
        bloodType: "O+",
        governorate: "صنعاء",
        lastDonation: "10 مايو 2025",
        donationCount: 7,
        
      };

      const dummyRequests: BloodRequest[] = [
        {
          id: "req1",
          bloodType: "A+",
          governorate: "عدن",
          date: "منذ يومين",
          responses: 3,
          urgent: true,
        },
        {
          id: "req2",
          bloodType: "B-",
          governorate: "تعز",
          date: "منذ أسبوع",
          responses: 1,
        },
      ];

      const dummyMessages: Message[] = [
        {
          id: "msg1",
          from: "فهد علي",
          requestId: "req1",
          text: "أنا متبرع متاح حاليًا، يمكنني المساعدة",
          date: "منذ ساعتين",
          read: false,
        },
        {
          id: "msg2",
          from: "نظام التبرع",
          requestId: "req2",
          text: "تمت مطابقة طلبك مع متبرع محتمل",
          date: "منذ 3 أيام",
          read: true,
        },
      ];

      setDonor(dummyDonor);
      setRequests(dummyRequests);
      setMessages(dummyMessages);
    };

    loadData();
  }, []);

  const renderRequestItem = ({ item }: { item: BloodRequest }) => (
    <TouchableOpacity
      style={[
        styles.requestCard,
        item.urgent && styles.urgentCard,
      ]}
      onPress={() => navigation.navigate("BloodChatScreen", { donorId: item.id })}
    >
      <View style={styles.requestHeader}>
        <View style={styles.bloodTypeBadge}>
          <Text style={styles.bloodTypeText}>{item.bloodType}</Text>
        </View>
        <View>
          <Text style={styles.requestTitle}>طلب تبرع بدم</Text>
          <Text style={styles.requestLocation}>
            <Ionicons name="location" size={14} color="#D84315" /> {item.governorate}
          </Text>
        </View>
      </View>
      
      <View style={styles.requestFooter}>
        <Text style={styles.requestDate}>
          <Ionicons name="time" size={14} color="#666" /> {item.date}
        </Text>
        <Text style={styles.requestResponses}>
          <Ionicons name="people" size={14} color="#666" /> {item.responses} متبرع
        </Text>
      </View>
      
      {item.urgent && (
        <View style={styles.urgentTag}>
          <Text style={styles.urgentText}>عاجل</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={[
        styles.messageCard,
        !item.read && styles.unreadMessage,
      ]}
      onPress={() => navigation.navigate("BloodChatScreen", { donorId: item.requestId })}
    >
      <View style={styles.messageHeader}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={20} color="#FFF" />
        </View>
        <View>
          <Text style={styles.messageSender}>{item.from}</Text>
          <Text style={styles.messagePreview} numberOfLines={1}>
            {item.text}
          </Text>
        </View>
      </View>
      
      <View style={styles.messageFooter}>
        <Text style={styles.messageDate}>{item.date}</Text>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#FFF5F5', '#FFFFFF']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>لوحة المتبرع</Text>
          <TouchableOpacity onPress={() => navigation.navigate("DonorProfile")}>
            <Ionicons name="settings" size={24} color="#D84315" />
          </TouchableOpacity>
        </View>

        {/* Donor Profile Card */}
        {donor && (
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color="#FFF" />
              </View>
              <View>
                <Text style={styles.profileName}>{donor.name}</Text>
                <Text style={styles.profileBloodType}>
                  <Ionicons name="water" size={16} color="#D84315" /> فصيلة {donor.bloodType}
                </Text>
              </View>
            </View>
            
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{donor.donationCount}</Text>
                <Text style={styles.statLabel}>مرة تبرع</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  <Ionicons name="location" size={16} color="#D84315" />
                </Text>
                <Text style={styles.statLabel}>{donor.governorate}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  <Ionicons name="calendar" size={16} color="#D84315" />
                </Text>
                <Text style={styles.statLabel}>{donor.lastDonation}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#FBE9E7' }]}>
            <Ionicons name="document-text" size={24} color="#D84315" />
            <Text style={styles.statCardNumber}>{requests.length}</Text>
            <Text style={styles.statCardText}>طلبات نشطة</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="chatbubbles" size={24} color="#4CAF50" />
            <Text style={styles.statCardNumber}>{messages.length}</Text>
            <Text style={styles.statCardText}>رسائل جديدة</Text>
          </View>
        </View>

        {/* Requests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>طلبات التبرع الخاصة بي</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
data={requests.filter(
    (r) =>
      donor &&
      r.bloodType === donor.bloodType &&
      r.governorate === donor.governorate

  )}            renderItem={renderRequestItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.requestsList}
          />
        </View>

        {/* Messages Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>آخر الرسائل</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("BecomeDonor")}
      >
        <LinearGradient
          colors={['#D84315', '#BF360C']}
          style={styles.floatingButtonContent}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontFamily: 'Cairo-Bold',
    fontSize: 24,
    color: '#3E2723',
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D84315',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  profileName: {
    fontFamily: 'Cairo-Bold',
    fontSize: 20,
    color: '#3E2723',
  },
  profileBloodType: {
    fontFamily: 'Cairo-SemiBold',
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  profileStats: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Cairo-Bold',
    fontSize: 18,
    color: '#3E2723',
  },
  statLabel: {
    fontFamily: 'Cairo-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    width: width * 0.45,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardNumber: {
    fontFamily: 'Cairo-Bold',
    fontSize: 28,
    color: '#3E2723',
    marginVertical: 8,
  },
  statCardText: {
    fontFamily: 'Cairo-SemiBold',
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Cairo-Bold',
    fontSize: 18,
    color: '#3E2723',
  },
  seeAll: {
    fontFamily: 'Cairo-SemiBold',
    fontSize: 14,
    color: '#D84315',
  },
  requestsList: {
    paddingHorizontal: 16,
  },
  requestCard: {
    width: width * 0.7,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#D84315',
  },
  requestHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },
  bloodTypeBadge: {
    backgroundColor: '#FBE9E7',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  bloodTypeText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
    color: '#D84315',
  },
  requestTitle: {
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
    color: '#3E2723',
  },
  requestLocation: {
    fontFamily: 'Cairo-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  requestFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  requestDate: {
    fontFamily: 'Cairo-Regular',
    fontSize: 12,
    color: '#666',
  },
  requestResponses: {
    fontFamily: 'Cairo-Regular',
    fontSize: 12,
    color: '#666',
  },
  urgentTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#D84315',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  urgentText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 12,
    color: '#FFF',
  },
  messageCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  unreadMessage: {
    backgroundColor: '#FFF8F0',
    borderLeftWidth: 4,
    borderLeftColor: '#D84315',
  },
  messageHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D84315',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  messageSender: {
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
    color: '#3E2723',
  },
  messagePreview: {
    fontFamily: 'Cairo-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    width: width * 0.7,
  },
  messageFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageDate: {
    fontFamily: 'Cairo-Regular',
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D84315',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    zIndex: 1000,
  },
  floatingButtonContent: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});

export default MyBloodDashboard;