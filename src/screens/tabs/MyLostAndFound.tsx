import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  RefreshControl,
  SafeAreaView
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { LinearGradient } from "expo-linear-gradient";
import { Swipeable } from "react-native-gesture-handler";

// ألوان الهوية البصرية
const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  accent: "#8B4B47",
  background: "#FFF8F0",
  text: "#3E2723",
  success: "#4CAF50",
  info: "#2196F3",
};

type Post = {
  id: string;
  type: "مفقود" | "موجود";
  title: string;
  description: string;
  date: string;
  governorate: string;
  views: number;
  messages: number;
  image?: string;
};

type Message = {
  id: string;
  from: string;
  postId: string;
  text: string;
  date: string;
  read: boolean;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MyLostAndFound = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedType, setSelectedType] = useState<"مفقود" | "موجود">("مفقود");
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const navigation = useNavigation<NavigationProp>();

  const loadData = async () => {
    setRefreshing(true);
    try {
      const dummyPosts: Post[] = [
        {
          id: "1",
          type: "مفقود",
          title: "هاتف سامسونج",
          description: "هاتف سامسونج جلاكسي اس 22 لونه أسود مفقود في منطقة الروضة",
          date: "2025-05-10",
          governorate: "صنعاء",
          views: 40,
          messages: 3,
          image: "https://source.unsplash.com/random/300x200/?phone",
        },
        {
          id: "2",
          type: "موجود",
          title: "محفظة بنية",
          description: "محفظة جلدية بنية تحتوي على بطاقات شخصية",
          date: "2025-05-12",
          governorate: "عدن",
          views: 18,
          messages: 1,
          image: "https://source.unsplash.com/random/300x200/?wallet",
        },
      ];

      const dummyMessages: Message[] = [
        {
          id: "msg1",
          from: "أحمد محمد",
          postId: "1",
          text: "هل هذا الهاتف عليه غلاف أحمر؟",
          date: "2025-05-12",
          read: false,
        },
        {
          id: "msg2",
          from: "سارة علي",
          postId: "2",
          text: "هل المحفظة تحتوي على رخصة قيادة؟",
          date: "2025-05-13",
          read: true,
        },
      ];

      await AsyncStorage.setItem("lostAndFoundPosts", JSON.stringify(dummyPosts));
      await AsyncStorage.setItem("lostMessages", JSON.stringify(dummyMessages));
      setPosts(dummyPosts);
      setMessages(dummyMessages);

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

  const lostPosts = posts.filter((p) => p.type === "مفقود");
  const foundPosts = posts.filter((p) => p.type === "موجود");
  const filteredPosts = selectedType === "مفقود" ? lostPosts : foundPosts;

  const stats = {
    lost: {
      count: lostPosts.length,
      views: lostPosts.reduce((sum, p) => sum + p.views, 0),
      messages: lostPosts.reduce((sum, p) => sum + p.messages, 0),
    },
    found: {
      count: foundPosts.length,
      views: foundPosts.reduce((sum, p) => sum + p.views, 0),
      messages: foundPosts.reduce((sum, p) => sum + p.messages, 0),
    },
    total: {
      count: posts.length,
      views: posts.reduce((sum, p) => sum + p.views, 0),
      messages: posts.reduce((sum, p) => sum + p.messages, 0),
    },
  };

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

  const renderPostItem = ({ item }: { item: Post }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(() => console.log("Delete", item.id))}
    >
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("LostAndFoundDetails", { itemId: item.id })
          }
        >
          <View style={styles.postHeader}>
            <View style={[
              styles.typeBadge, 
              item.type === "مفقود" ? styles.lostBadge : styles.foundBadge
            ]}>
              <Text style={styles.typeText}>{item.type}</Text>
            </View>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
          
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.postImage} />
          )}
          
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.postFooter}>
            <View style={styles.footerItem}>
              <Ionicons name="location-outline" size={16} color={COLORS.accent} />
              <Text style={styles.footerText}>{item.governorate}</Text>
            </View>
            
            <View style={styles.footerItem}>
              <Ionicons name="eye-outline" size={16} color={COLORS.accent} />
              <Text style={styles.footerText}>{item.views}</Text>
            </View>
            
            <View style={styles.footerItem}>
              <Ionicons name="chatbubble-outline" size={16} color={COLORS.accent} />
              <Text style={styles.footerText}>{item.messages}</Text>
            </View>
          </View>
        </TouchableOpacity>
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
          { opacity: fadeAnim, borderLeftColor: item.read ? '#E0E0E0' : COLORS.primary }
        ]}
      >
        <View style={styles.messageHeader}>
          <Text style={styles.messageFrom}>{item.from}</Text>
          <Text style={styles.messageDate}>{item.date}</Text>
        </View>
        
        <Text style={styles.messageText} numberOfLines={2}>{item.text}</Text>
        
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() =>
            navigation.navigate("LostChatScreen", { itemId: item.postId })
          }
        >
          <Text style={styles.buttonText}>عرض المحادثة</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
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
        <Text style={styles.headerTitle}>المفقودات والموجودات</Text>
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
          <Text style={styles.sectionTitle}>📊 الإحصائيات</Text>
          
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: COLORS.primary }]}>
              <Text style={styles.statNumber}>{stats.total.count}</Text>
              <Text style={styles.statLabel}>إجمالي المنشورات</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: COLORS.accent }]}>
              <Text style={styles.statNumber}>{stats.total.views}</Text>
              <Text style={styles.statLabel}>المشاهدات</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: COLORS.secondary }]}>
              <Text style={styles.statNumber}>{stats.total.messages}</Text>
              <Text style={styles.statLabel}>الرسائل</Text>
            </View>
          </View>
        </View>

        {/* زر التبديل بين المفقود والموجود */}
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchButton,
              selectedType === "مفقود" && styles.activeSwitch,
            ]}
            onPress={() => setSelectedType("مفقود")}
          >
            <Ionicons 
              name="search" 
              size={20} 
              color={selectedType === "مفقود" ? "white" : COLORS.primary} 
            />
            <Text
              style={[
                styles.switchText,
                selectedType === "مفقود" && styles.activeSwitchText,
              ]}
            >
              المفقودات
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.switchButton,
              selectedType === "موجود" && styles.activeSwitch,
            ]}
            onPress={() => setSelectedType("موجود")}
          >
            <Ionicons 
              name="checkmark-done" 
              size={20} 
              color={selectedType === "موجود" ? "white" : COLORS.primary} 
            />
            <Text
              style={[
                styles.switchText,
                selectedType === "موجود" && styles.activeSwitchText,
              ]}
            >
              الموجودات
            </Text>
          </TouchableOpacity>
        </View>

        {/* قائمة المنشورات */}
        <Text style={styles.sectionTitle}>
          {selectedType === "مفقود" ? "🟠 المفقودات" : "🟢 الموجودات"}
        </Text>
        
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderPostItem}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle" size={50} color="#E0E0E0" />
              <Text style={styles.emptyText}>
                لا توجد {selectedType === "مفقود" ? "مفقودات" : "موجودات"} لعرضها
              </Text>
            </View>
          }
        />

        {/* الرسائل الواردة */}
        <Text style={styles.sectionTitle}>📩 الرسائل الواردة</Text>
        
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="mail-open" size={50} color="#E0E0E0" />
              <Text style={styles.emptyText}>لا توجد رسائل جديدة</Text>
            </View>
          }
        />
      </ScrollView>

      {/* زر عائم لإضافة منشور جديد */}
      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: COLORS.primary }]}
        onPress={() => navigation.navigate("AddLostItemScreen")}
      >
        <Ionicons name="add" size={30} color="white" />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginHorizontal: 6,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  switchText: {
    fontSize: 14,
    color: COLORS.primary,
    marginRight: 6,
  },
  activeSwitch: {
    backgroundColor: COLORS.primary,
  },
  activeSwitchText: {
    color: 'white',
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  typeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  lostBadge: {
    backgroundColor: '#FFF3E0',
  },
  foundBadge: {
    backgroundColor: '#E8F5E9',
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
    color: '#757575',
  },
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  postDescription: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 12,
    lineHeight: 20,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#757575',
  },
  messageCard: {
    backgroundColor: "white",
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
    color: COLORS.text,
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
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
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
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    marginHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 16,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default MyLostAndFound;