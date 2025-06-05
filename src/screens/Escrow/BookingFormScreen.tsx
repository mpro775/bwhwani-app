// screens/BookingFormScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Animated,
  SafeAreaView,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { CheckBox } from "react-native-elements";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "utils/api/axiosInstance";

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFF8F0",
  text: "#3E2723",
  lightText: "#757575",
  lightGray: "#F5F5F5",
  white: "#FFFFFF",
};

type BookingFormRouteProp = RouteProp<
  {
    BookingFormScreen: {
      bookingId: string;
      title: string;
      price: number;
      availableHours: string[];
      image: string;
      unavailableHours: string[];
    };
  },
  "BookingFormScreen"
>;

const BookingFormScreen = () => {
  const route = useRoute<BookingFormRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { bookingId, title, price, availableHours, image, unavailableHours } = route.params;

  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [useDefaultPhone, setUseDefaultPhone] = useState(true);
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    (async () => {
      const storedPhone = await AsyncStorage.getItem("userPhone"); 
      if (storedPhone) setPhone(storedPhone);
    })();
  }, []);

  const isHourAvailable = (hour: string) => !unavailableHours.includes(hour);

  const handleConfirm = async () => {
    if (!selectedHour) {
      Alert.alert("خطأ", "يرجى اختيار وقت الحجز");
      return;
    }
    if (!agreedToTerms) {
      Alert.alert("خطأ", "يجب الموافقة على الشروط والأحكام");
      return;
    }
    if (!useDefaultPhone && !phone.trim()) {
      Alert.alert("خطأ", "يرجى إدخال رقم هاتف صالح");
      return;
    }

    try {
      const payload = {
        bookingId,
        hour: selectedHour,
        phone,
        notes,
      };
      const response = await axiosInstance.post("/bookings", payload);
      if (response.status === 201 || response.status === 200) {
        Alert.alert(
          "تم الحجز بنجاح ✅",
          `تم تأكيد حجزك لـ ${title} في الساعة ${selectedHour}`,
          [
            {
              text: "حسناً",
              onPress: () => navigation.navigate("MyBookingsScreen"),
            },
          ]
        );
      } else {
        Alert.alert("خطأ", response.data.message || "حدث خطأ أثناء الحجز.");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("خطأ", "حدث خطأ أثناء الاتصال بالخادم.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تأكيد الحجز</Text>
      </LinearGradient>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* بطاقة المعلومات */}
          <View style={styles.bookingCard}>
            <Image source={{ uri: image }} style={styles.bookingImage} />
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingTitle}>{title}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>السعر:</Text>
                <Text style={styles.price}>{price.toLocaleString()} ر.ي</Text>
              </View>
            </View>
          </View>

          {/* قسم اختيار الوقت */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>اختر وقت الحجز</Text>
            <View style={styles.hoursContainer}>
              {availableHours.map((hour) => {
                const disabled = !isHourAvailable(hour);
                const selected = selectedHour === hour;
                return (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.hourButton,
                      selected && styles.hourSelected,
                      disabled && styles.hourDisabled,
                    ]}
                    onPress={() => {
                      if (disabled) {
                        Alert.alert("غير متاح", "الوقت محجوز مسبقاً، يرجى اختيار غيره.");
                        return;
                      }
                      setSelectedHour(hour);
                    }}
                    disabled={disabled}
                  >
                    <Text style={[styles.hourText, selected && styles.hourTextSelected]}>
                      {hour}
                    </Text>
                    {selected && <Ionicons name="checkmark" size={16} color={COLORS.white} style={styles.hourCheckIcon} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* قسم معلومات التواصل */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات التواصل</Text>
            <CheckBox
              title="استخدام رقم الهاتف المسجل"
              checked={useDefaultPhone}
              onPress={() => setUseDefaultPhone(!useDefaultPhone)}
              containerStyle={styles.checkboxContainer}
              textStyle={styles.checkboxText}
              checkedColor={COLORS.primary}
            />
            {!useDefaultPhone && (
              <TextInput
                placeholder="أدخل رقم التواصل"
                placeholderTextColor={COLORS.lightText}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.input}
              />
            )}
          </View>

          {/* قسم الملاحظات */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ملاحظات إضافية</Text>
            <TextInput
              placeholder="مثلاً: تجهيز القاعة مسبقاً، متطلبات خاصة..."
              placeholderTextColor={COLORS.lightText}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              style={styles.notesInput}
            />
          </View>

          {/* قسم الشروط والأحكام */}
          <View style={styles.section}>
            <CheckBox
              title="أوافق على الشروط والأحكام وسياسة الإلغاء"
              checked={agreedToTerms}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              containerStyle={styles.checkboxContainer}
              textStyle={styles.checkboxText}
              checkedColor={COLORS.primary}
            />
            <TouchableOpacity style={styles.termsLink}>
              <Text style={styles.termsText}>عرض الشروط والأحكام</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* زر تأكيد الحجز */}
        <TouchableOpacity
          style={[styles.confirmButton, (!selectedHour || !agreedToTerms) && styles.confirmDisabled]}
          onPress={handleConfirm}
          disabled={!selectedHour || !agreedToTerms}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="checkmark-circle" size={24} color={COLORS.white} />
            <Text style={styles.confirmText}>تأكيد الحجز</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  backButton: {
    position: "absolute",
    left: 16,
    padding: 8,
  },
  headerTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 20,
    color: COLORS.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  bookingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    margin: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingImage: {
    width: "100%",
    height: 180,
  },
  bookingInfo: {
    padding: 16,
  },
  bookingTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  priceLabel: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: COLORS.text,
  },
  price: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: COLORS.primary,
    marginLeft: 8,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
  },
  hoursContainer: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
  },
  hourButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginLeft: 8,
    marginBottom: 8,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  hourSelected: {
    backgroundColor: COLORS.primary,
  },
  hourDisabled: {
    backgroundColor: "#E0E0E0",
  },
  hourText: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: COLORS.text,
  },
  hourTextSelected: {
    color: COLORS.white,
    fontFamily: "Cairo-Bold",
  },
  hourCheckIcon: {
    marginRight: 4,
  },
  checkboxContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  checkboxText: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 14,
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: COLORS.text,
    marginTop: 12,
    textAlign: "right",
  },
  notesInput: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 14,
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: COLORS.text,
    height: 100,
    textAlignVertical: "top",
    textAlign: "right",
    marginTop: 8,
  },
  termsLink: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  termsText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
  confirmButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmDisabled: {
    opacity: 0.5,
  },
  gradient: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmText: {
    fontFamily: "Cairo-Bold",
    color: COLORS.white,
    fontSize: 18,
    marginRight: 8,
  },
});

export default BookingFormScreen;
