import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Modal,
} from "react-native";
import { Button } from "react-native-paper";
import {
  fetchUserProfile,
  logoutUser,
  updateUserAvatar,
  updateUserProfileAPI,
} from "../../api/userApi";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { UserProfile } from "../../types/types";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker"; // تأكد من الاستيراد
import { uploadFileToBunny } from "utils/api/uploadFileToBunny";

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  accent: "#8B4B47",
  text: "#4E342E",
  lightText: "#9E9E9E",     // ✅ لون نص رمادي فاتح
  lightGray: "#F3F3F3",     // ✅ لون خلفية رمادية ناعمة
};

const UserProfileScreen = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const loadProfile = async () => {
    setRefreshing(true);
    try {
      const user = await fetchUserProfile();
      setProfile(user);
    } catch {
      console.log("خطأ", "فشل تحميل البيانات");
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("يجب منح صلاحية الوصول للصور");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0].uri) {
    setIsUploadingAvatar(true);
    try {
      console.log("📸 تم اختيار الصورة:", result.assets[0].uri);
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();

      const url = await uploadFileToBunny(blob); // ← هنا نمرر الـ Blob
      console.log("✅ رابط الصورة المرفوعة:", url);

      await updateUserAvatar(url);
      await loadProfile();
    } catch (err) {
      console.error("❌ فشل رفع الصورة:", err);
      Alert.alert("خطأ", "فشل رفع الصورة");
    } finally {
      setIsUploadingAvatar(false);
    }
  }
};

  if (!profile) {
    return (
      <LinearGradient
        colors={["#F8F9FA", "#FFFFFF"]}
        style={styles.emptyContainer}
      >
        <Image
          source={require("../../../assets/avatar.png")}
          style={styles.emptyImage}
        />
        <Text style={styles.emptyText}>أنت غير مسجل الدخول</Text>
        <Text style={styles.emptySubText}>
          قم بإنشاء حساب جديد للاستفادة من كل المميزات
        </Text>
        <Button
          mode="contained"
          icon="account-plus"
          onPress={() => navigation.navigate("Register")}
          style={styles.registerButton}
          labelStyle={styles.buttonLabel}
        >
          إنشاء حساب جديد
        </Button>
      </LinearGradient>
    );
  }

  return (
    <Animated.ScrollView
      style={styles.container}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadProfile} />
      }
    >
      <LinearGradient
        colors={["rgba(255,122,0,0.8)", "rgba(255,82,82,0.8)"]}
        style={styles.avatarContainer}
      >
        <TouchableOpacity
          onPress={() => {
            if (profile.profileImage) {
              setImageModalVisible(true); // عرض الصورة الحالية
            } else {
              pickImage(); // اختيار صورة جديدة
            }
          }}
        >
          <Image
            source={
              profile.profileImage
                ? { uri: profile.profileImage }
                : require("../../../assets/avatar.png")
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.name}>
          {profile.displayFullName
            ? profile.fullName
            : profile.aliasName?.trim().length
            ? profile.aliasName
            : profile.fullName}
        </Text>

        <Text style={styles.bio}>
          {profile.freelanceData?.bio?.trim().length
            ? profile.freelanceData?.bio
            : "لا يوجد وصف حالياً"}
        </Text>

        <Text style={styles.phone}>{profile.phoneNumber}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الرصيد في المحفظة</Text>
          <LinearGradient
            colors={["#FF7A00", "#FF5252"]}
            style={styles.walletCard}
          >
            <Text style={styles.walletAmount}>
              {profile.wallet?.balance ?? 0} ريال
            </Text>
            <Ionicons name="wallet" size={24} color="#FFF" />
          </LinearGradient>
        </View>

        <SectionButton
          icon="map"
          label="إدارة العناوين"
          onPress={() => navigation.navigate("DeliveryAddresses", {})}
        />
        <SectionButton
          icon="water"
          label="بنك الدم"
          onPress={() => navigation.navigate("DonorProfile")}
        />
        <SectionButton
          icon="briefcase"
          label="بيانات الفريلانسر"
          onPress={() => {
            if (profile?.id) {
              navigation.navigate("MyFreelancerProfile");
            } else {
              Alert.alert("خطأ", "لم يتم العثور على معرف المستخدم");
            }
          }}
        />
        <SectionButton
          icon="help-circle-outline"
          label="المفقودات "
          onPress={() => setModalVisible(true)}
        />

        <SectionButton
          icon="account-edit"
          label="تعديل الملف الشخصي"
          onPress={() => navigation.navigate("EditProfile")}
        />
        <SectionButton
          icon="settings"
          label="الإعدادات"
          onPress={() => navigation.navigate("Settings")}
        />
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await logoutUser();
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }}
        >
          <Ionicons name="log-out" size={24} color={COLORS.accent} />
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setImageModalVisible(false)}
          />
          <View style={styles.modalContentimage}>
            <Image
              source={{ uri: profile?.profileImage }}
              style={{ width: 200, height: 200, borderRadius: 100 }}
            />
            <TouchableOpacity
              onPress={() => {
                setImageModalVisible(false);
                pickImage(); // تغيير الصورة
              }}
              style={styles.modalCloseButton}
            >
              <Text style={{ color: "#FFF", fontFamily: "Cairo-Bold" }}>
                تغيير الصورة
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تفاصيل المساهمات</Text>
            <View style={styles.statsRow}>
              <StatBox
                value={profile.lostAndFoundPosts?.lostCount ?? 0}
                label="مفقودات"
                icon="alert-circle-outline"
              />
              <StatBox
                value={profile.lostAndFoundPosts?.foundCount ?? 0}
                label="موجودات"
                icon="checkmark-circle-outline"
              />
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={{ color: "#FFF", fontFamily: "Cairo-Bold" }}>
                إغلاق
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animated.ScrollView>
  );
};

// --- Components ---
const StatBox = ({ value, label, icon }: any) => (
  <View style={styles.statBox}>
    <Ionicons name={icon} size={28} color={COLORS.primary} />
    <Text style={styles.statNumber}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const AddressCard = ({ label, city, onPress }: any) => (
  <TouchableOpacity style={styles.addressCard} onPress={onPress}>
    <Ionicons name="location" size={20} color={COLORS.primary} />
    <View style={styles.addressTextContainer}>
      <Text style={styles.addressLabel}>{label}</Text>
      <Text style={styles.addressCity}>{city}</Text>
    </View>
  </TouchableOpacity>
);

const EmptyState = ({ message }: any) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyStateText}>{message}</Text>
  </View>
);

const SectionButton = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.sectionButton} onPress={onPress}>
    <Ionicons name={icon} size={24} color={COLORS.text} />
    <Text style={styles.sectionButtonText}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color={COLORS.lightGray} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: COLORS.background,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContentimage: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    alignSelf: "center",
    marginTop: "50%",
  },

  modalTitle: {
    fontSize: 18,
    fontFamily: "Cairo-Bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  modalCloseButton: {
    marginTop: 24,
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },

  header: {
    height: 50,

    position: "absolute",

    top: 0,

    left: 0,

    right: 0,

    zIndex: 1,
  },

  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignSelf: "center",
    marginTop: 20, // تقليل المسافة العلوية
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    borderWidth: 2,
    borderColor: "#FFF",
  },

  bio: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 6,
  },

  // عدّل marginTop داخل content
  content: {
    padding: 7,
  },

  name: {
    fontFamily: "Cairo-Bold",

    fontSize: 24, // بدلاً من 28

    color: COLORS.text,

    textAlign: "center",

    marginBottom: 8,
  },

  phone: {
    fontFamily: "Cairo-Regular",

    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",

    textAlign: "center",

    marginBottom: 12,
  },

  section: {
    backgroundColor: COLORS.background,

    borderRadius: 16,

    padding: 20,
    textAlign: "right",
    marginBottom: 16,

    elevation: 4,

    shadowColor: "#000",

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.05,

    shadowRadius: 8,
  },

  sectionTitle: {
    fontFamily: "Cairo-Bold",

    fontSize: 18,
    textAlign: "right",

    color: COLORS.text,

    marginBottom: 16,
  },

  walletCard: {
    flexDirection: "row-reverse",

    justifyContent: "space-between",

    alignItems: "center",

    padding: 20,

    borderRadius: 12,

    marginBottom: 12,
  },

  walletAmount: {
    fontFamily: "Cairo-Bold",

    fontSize: 24,

    color: "#FFF",
  },

  statsRow: {
    flexDirection: "row-reverse",

    justifyContent: "space-between",

    gap: 16,
  },

  statBox: {
    flex: 1,

    backgroundColor: COLORS.background,

    borderRadius: 12,

    padding: 16,

    alignItems: "center",

    elevation: 2,
  },

  statNumber: {
    fontFamily: "Cairo-Bold",

    fontSize: 24,

    color: COLORS.primary,

    marginVertical: 8,
  },

  statLabel: {
    fontFamily: "Cairo-SemiBold",

    fontSize: 14,

    color: COLORS.lightGray,
  },

  addressCard: {
    flexDirection: "row-reverse",

    alignItems: "center",

    backgroundColor: COLORS.background,
    textAlign: "right",

    borderRadius: 12,

    padding: 16,

    marginBottom: 8,

    elevation: 2,
  },

  addressTextContainer: {
    flex: 1,
    textAlign: "right",

    marginRight: 12,
  },

  addressLabel: {
    fontFamily: "Cairo-SemiBold",

    fontSize: 16,

    color: COLORS.text,
  },

  addressCity: {
    fontFamily: "Cairo-Regular",

    fontSize: 14,

    color: COLORS.lightGray,
  },

  emptyState: {
    padding: 16,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: COLORS.background,

    borderRadius: 12,
  },

  emptyStateText: {
    fontFamily: "Cairo-Regular",

    fontSize: 14,

    color: COLORS.lightGray,
  },

  sectionButton: {
    flexDirection: "row-reverse", // هذا جيد
    justifyContent: "space-between", // ✅ يوزع العناصر أفضل
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
  },

  sectionButtonText: {
    flex: 1,
    textAlign: "right",

    fontFamily: "Cairo-SemiBold",

    fontSize: 16,

    color: COLORS.text,

    marginHorizontal: 12,
  },

  logoutButton: {
    flexDirection: "row-reverse",

    alignItems: "center",

    justifyContent: "center",

    marginTop: 24,

    padding: 16,
  },

  logoutText: {
    fontFamily: "Cairo-SemiBold",

    fontSize: 16,

    color: COLORS.accent,

    marginRight: 8,
  },

  emptyContainer: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",

    padding: 32,
  },

  emptyImage: {
    width: 150,

    height: 150,

    marginBottom: 20,
  },

  emptyText: {
    fontFamily: "Cairo-Bold",
    fontSize: 20,
    color: COLORS.text,
    marginBottom: 8,
  },

  emptySubText: {
    fontFamily: "Cairo-Regular",

    fontSize: 14,

    color: COLORS.secondary,

    textAlign: "center",

    marginBottom: 24,
  },

  registerButton: {
    borderRadius: 12,
backgroundColor:COLORS.primary,
    paddingVertical: 8,
  },

  buttonLabel: {
    fontFamily: "Cairo-SemiBold",

    fontSize: 16,
  },
});

export default UserProfileScreen;
