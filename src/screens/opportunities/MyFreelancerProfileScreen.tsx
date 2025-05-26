import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getUserProfile, updateUserProfile } from "../../storage/userStorage";
import { RootStackParamList } from "../../types/navigation";

const MyFreelancerProfileScreen = () => {
  const [data, setData] = useState<any>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadData = async () => {
      const user = await getUserProfile();
      if (user?.freelanceData) {
        setData({
          name: user.fullName,
          phone: user.phoneNumber,
          ...user.freelanceData,
        });
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    };
    loadData();
  }, []);

  const handleDelete = async () => {
    Alert.alert("تأكيد الحذف", "هل أنت متأكد من حذف بيانات الفريلانسر؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: async () => {
          await updateUserProfile({ freelanceData: undefined });
          Alert.alert("تم الحذف", "✅ تم حذف بيانات الفريلانسر بنجاح");
          navigation.goBack();
        },
      },
    ]);
  };

  if (!data) {
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={require("../../../assets/freelancer_placeholder.png")}
          style={styles.emptyImage}
        />
        <Text style={styles.emptyTitle}>لم تقم بالتسجيل كمقدم خدمة بعد</Text>
        <Text style={styles.emptySubtitle}>
          سجل بياناتك لعرض مهاراتك وخدماتك للعملاء
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("AddFreelancer")}
        >
          <LinearGradient
            colors={["#FF5252", "#D84315"]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          >
            <MaterialIcons name="add-circle" size={22} color="#FFF" />
            <Text style={styles.buttonText}>التسجيل كمقدم خدمة</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={["#FF5252", "#D84315"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>ملفي المهني</Text>
      </LinearGradient>

      {/* Profile Info */}
      <View style={styles.profileCard}>
        <View style={styles.infoRow}>
          <MaterialIcons name="person" size={24} color="#D84315" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>الاسم الكامل</Text>
            <Text style={styles.infoValue}>{data.name}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="phone" size={24} color="#D84315" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>رقم الهاتف</Text>
            <Text style={styles.infoValue}>{data.phone}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="work" size={24} color="#D84315" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>نوع الخدمة</Text>
            <Text style={styles.infoValue}>{data.serviceCategory}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={24} color="#D84315" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>المدينة</Text>
            <Text style={styles.infoValue}>{data.city}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="info" size={24} color="#D84315" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>نبذة عنك</Text>
            <Text style={styles.infoValue}>{data.bio}</Text>
          </View>
        </View>
      </View>

      {/* Portfolio Gallery */}
      {data.portfolioImages?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معرض الأعمال</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryContainer}
          >
            {data.portfolioImages.map((uri: string, idx: number) => (
              <View key={idx} style={styles.imageContainer}>
                <Image
                  source={{ uri }}
                  style={styles.portfolioImage}
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("AddFreelancer")}
        >
          <LinearGradient
            colors={["#4CAF50", "#2E7D32"]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          >
            <MaterialIcons name="edit" size={20} color="#FFF" />
            <Text style={styles.buttonText}>تعديل البيانات</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <LinearGradient
            colors={["#B71C1C", "#D50000"]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          >
            <MaterialIcons name="delete" size={20} color="#FFF" />
            <Text style={styles.buttonText}>حذف الحساب</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 22,
    color: "#FFF",
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
    marginRight: 12,
  },
  infoLabel: {
    fontFamily: "Cairo-SemiBold",
    color: "#5D4037",
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: "Cairo-Regular",
    color: "#333",
    fontSize: 16,
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: "#D84315",
    marginBottom: 12,
  },
  galleryContainer: {
    paddingVertical: 8,
  },
  imageContainer: {
    marginLeft: 12,
  },
  portfolioImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
  },
  actionsContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 40,
  },
  editButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    elevation: 4,
  },
  deleteButton: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  buttonText: {
    fontFamily: "Cairo-SemiBold",
    color: "#FFF",
    fontSize: 16,
    marginRight: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFF",
  },
  emptyImage: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 20,
    color: "#D84315",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  primaryButton: {
    borderRadius: 25,
    overflow: "hidden",
    elevation: 4,
  },
});

export default MyFreelancerProfileScreen;
