import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { DrawerNavigationProp } from "@react-navigation/drawer";
import { inlineStyles } from "react-native-svg";

type ValidIconName = keyof typeof MaterialCommunityIcons.glyphMap;
type ValidScreenName = keyof DrawerParamList;
const quickActions: QuickAction[] = [
  { name: "التوصيل", icon: "car", screen: "DeliveryTab" },
  { name: "بنك الدم", icon: "water", screen: "BloodBankStack" },
  { name: "المفقودات", icon: "help-circle-outline", screen: "LostAndFound" },
  { name: "الحجوزات", icon: "calendar", screen: "BookingTabs" },
];
type QuickAction = {
  name: string;
  icon: ValidIconName;
  screen: ValidScreenName;
};
const getDynamicContent = () => {
  return {
    isReturningUser: true,
    userName: "عبدالسلام",
    hasUnfinishedBooking: true,
    recommended: [
      { id: "r1", title: "قاعة الفخامة", type: "booking" },
      { id: "r2", title: "طلب دم في تعز", type: "blood" },
    ],
    shortVideos: [
      { id: "v1", title: "عروض اليوم", thumbnail: "https://via.placeholder.com/100" },
      { id: "v2", title: "خصم في مطعم لذيذ", thumbnail: "https://via.placeholder.com/100" },
    ],
  };
};

const data = {
  services: [
    { id: 1, name: "تسوق وتوصيل", icon: "storefront", screen: "DeliveryTab" },
    { id: 2, name: "السوق المفتوح", icon: "shopping", screen: "MarketStack" },
    { id: 3, name: "مهنتي", icon: "briefcase", screen: "Opportunities" },
    { id: 4, name: " ساعدني بالدم", icon: "water", screen: "BloodBankStack" },
    { id: 5, name: " المفقودات", icon: "help-circle-outline", screen: "LostAndFound" },
    { id: 6, name: "وصلني", icon: "car", screen: "Transport" },
    { id: 7, name: "عروض وحجوزات", icon: "calendar", screen: "BookingTabs" },
  ],
};
type DrawerParamList = {
  HomeStack: undefined;
  BloodBankStack: undefined;
  Opportunities: undefined;
  LostAndFound: undefined;
  Settings: undefined;
    BookingTabs: undefined; // ✅ أضف هذه
  DeliveryTab: undefined; // ✅ وربما هذه أيضًا
  السوق: undefined;       // ✅ إن كنت تستخدمها
};

const { width } = Dimensions.get("window");
const isSmallScreen = width < 375;
type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

// نظام الألوان الموحد
const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  accent: "#8B4B47",
  text: "#4E342E",
  lightText: "#9E9E9E",     // ✅ لون نص رمادي فاتح
  lightGray: "#F3F3F3",     // ✅ لون خلفية رمادية ناعمة
};

type RootStackParamList = {
  Store: undefined;
  MarketStack: undefined;
  Jobs: undefined;
  Transport: undefined;
  BuyForMe: undefined;
  Escrow: undefined;
  Ads: undefined;
  Chat: undefined;
  Support: undefined;
  BookingTabs:undefined;

};
type ServiceItem = {
  id: number;
  name: string;
  icon: MaterialIconName;
  screen: keyof RootStackParamList;
};

const services: ServiceItem[] = data.services.map((item) => ({
  id: item.id,
  name: item.name,
  icon: item.icon as MaterialIconName,
  screen: item.screen as keyof RootStackParamList,
}));

const HomeScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  const [dynamicContent, setDynamicContent] = useState(getDynamicContent());



    return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >


        {/* قسم الترحيب */}
        <View style={styles.welcomeContainer}>
          <LinearGradient
            colors={["#FFF3E0", "#FFEBEE"]}
            style={styles.gradient}
          >
            <View style={styles.welcomeContent}>
              <View style={styles.textWrapper}>
                <Text style={styles.welcomeTitle}>
                  أهلًا بك في{"\n"}
                  <Text style={styles.brand}>بثواني</Text>
                </Text>
                <Text style={styles.welcomeSubtitle}>
كل شئ يوصلك بثواني                </Text>
              </View>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={isSmallScreen ? 32 : 40}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.statsRow}>
              <StatItem value="50+" label="خدمة مكتملة" />
              <View style={styles.divider} />
              <StatItem value="4.9" label="تقييم عام" />
            </View>
          </LinearGradient>
        </View>





        {/* قسم الخدمات */}
        <View style={styles.servicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>الخدمات الأساسية</Text>
            <View style={styles.titleUnderline} />
          </View>

          <View style={styles.grid}>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={() =>
                  navigation.navigate(service.screen as keyof DrawerParamList)
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ServiceCard = ({ service, onPress }: any) => (
  <TouchableOpacity
    style={[styles.card, { width: width / 2 - 24 }]}
    onPress={onPress}
    activeOpacity={0.9}
  >
    <View style={styles.iconWrapper}>
      <MaterialCommunityIcons
        name={service.icon}
        size={28}
        color={COLORS.primary}
      />
    </View>
    <Text style={styles.cardText}>{service.name}</Text>
  </TouchableOpacity>
);

const StatItem = ({ value, label }: any) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  welcomeContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 4,
  },
  quickActionsSection: {
  marginTop: 16,
  paddingHorizontal: 16,
},
quickTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: COLORS.text,
  marginBottom: 8,
},
quickScroll: {
  flexDirection: "row-reverse",
  gap: 12,
},
quickButton: {
  backgroundColor: "#FFF",
  borderRadius: 12,
  padding: 12,
  alignItems: "center",
  justifyContent: "center",
  width: 80,
  elevation: 2,
},
quickLabel: {
  marginTop: 6,
  fontSize: 12,
  textAlign: "center",
  color: COLORS.text,
},

  gradient: {
    padding: isSmallScreen ? 16 : 24,
  },
  searchContainer: {
  flexDirection: "row-reverse",
  alignItems: "center",
  backgroundColor: "#F3F3F3",
  borderRadius: 12,
  marginHorizontal: 16,
  marginTop: 16,
  paddingHorizontal: 12,
  paddingVertical: 10,
  gap: 10,
},
searchInput: {
  flex: 1,
  fontFamily: "Cairo-Regular",
  fontSize: 14,
  color: COLORS.text,
  textAlign: "right",
},

  welcomeContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: isSmallScreen ? 12 : 16,
  },
  textWrapper: {
    flex: 1,
    marginRight: 16,
  },
  welcomeTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: isSmallScreen ? 22 : 26,
    color: COLORS.text,
    lineHeight: isSmallScreen ? 28 : 34,
        marginBottom: 2,

  },
  brand: {
    color: COLORS.primary,
  },
  welcomeSubtitle: {
    fontFamily: "Cairo-Regular",
    fontSize: isSmallScreen ? 14 : 16,
    color: COLORS.secondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    elevation: 2,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontFamily: "Cairo-Bold",
    fontSize: isSmallScreen ? 20 : 24,
    color: COLORS.primary,
  },
  statLabel: {
    fontFamily: "Cairo-SemiBold",
    fontSize: isSmallScreen ? 12 : 14,
    color: COLORS.text,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: "#EEE",
  },
  servicesSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    marginBottom: isSmallScreen ? 12 : 16,
    alignItems: "flex-start",
  },
  sectionTitle: {
    fontFamily: "Cairo-Bold",
    textAlign:"center",
    fontSize: isSmallScreen ? 18 : 20,
    color: COLORS.text,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: COLORS.primary,
    marginTop: 8,
  },
  grid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: isSmallScreen ? 12 : 16,
    marginBottom: isSmallScreen ? 8 : 12,
    elevation: 2,
    alignItems: "center",

    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cardText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: isSmallScreen ? 10 : 14,
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default HomeScreen;