import React, { useState } from "react";
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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { CheckBox } from "react-native-elements";
import { RootStackParamList } from "../../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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

type BookingFormRouteProp = RouteProp<
  { 
    BookingFormScreen: { 
      bookingId: string; 
      title: string; 
      price: number; 
      availableHours: string[];
      image: string;
        unavailableHours: string[]; // ✅ أضف هذا

    } 
  },
  "BookingFormScreen"
>;

const BookingFormScreen = () => {
  const route = useRoute<BookingFormRouteProp>();
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
const { title, price, availableHours, image, unavailableHours } = route.params;

  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [useDefaultPhone, setUseDefaultPhone] = useState(true);
  const [phone, setPhone] = useState("777777777");
  const [notes, setNotes] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];


  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleConfirm = () => {
    if (!selectedHour) {
      Alert.alert("خطأ", "يرجى اختيار وقت الحجز");
      return;
    }

    if (!agreedToTerms) {
      Alert.alert("خطأ", "يجب الموافقة على الشروط والأحكام");
      return;
    }

    Alert.alert(
      "تم الحجز بنجاح ✅", 
      `تم تأكيد حجزك لـ ${title} في الساعة ${selectedHour}\n\nسيتم التواصل معك قريباً لتأكيد التفاصيل`,
      [
        { 
          text: "حسناً", 
          onPress: () => navigation.navigate("MyBookingsScreen") 
        }
      ]
    );
  };
  const isHourAvailable = (hour: string) => {
  return !unavailableHours.includes(hour);
};



  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تأكيد الحجز</Text>
      </LinearGradient>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* معلومات الحجز */}
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

          {/* اختيار الوقت */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>اختر وقت الحجز</Text>
            <View style={styles.hoursContainer}>
              {availableHours.map((hour) => (
              <TouchableOpacity
  key={hour}
  style={[
    styles.hourButton,
    selectedHour === hour && styles.hourSelected,
    !isHourAvailable(hour) && { backgroundColor: "#e0e0e0" },
  ]}
  onPress={() => {
    if (!isHourAvailable(hour)) {
      Alert.alert("غير متاح", "الوقت الذي اخترته محجوز مسبقاً، يرجى اختيار وقت آخر.");
      return;
    }
    setSelectedHour(hour);
  }}
>
  <Text
    style={[
      styles.hourText,
      selectedHour === hour && styles.hourTextSelected,
    ]}
  >
    {hour}
  </Text>
  {selectedHour === hour && (
    <Ionicons
      name="checkmark"
      size={16}
      color="white"
      style={styles.hourCheckIcon}
    />
  )}
</TouchableOpacity>

              ))}
            </View>
          </View>

          {/* معلومات التواصل */}
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

          {/* ملاحظات إضافية */}
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

          {/* الشروط والأحكام */}
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

        {/* زر التأكيد */}
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirm}
          disabled={!selectedHour || !agreedToTerms}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="checkmark-circle" size={24} color="white" />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingImage: {
    width: '100%',
    height: 180,
  },
  bookingInfo: {
    padding: 16,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 8,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  hoursContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hourButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginLeft: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hourSelected: {
    backgroundColor: COLORS.primary,
  },
  hourText: {
    fontSize: 14,
    color: COLORS.text,
  },
  hourTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  hourCheckIcon: {
    marginRight: 4,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  checkboxText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: 'normal',
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: COLORS.text,
    marginTop: 12,
    textAlign: 'right',
  },
  notesInput: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: COLORS.text,
    height: 100,
    textAlignVertical: 'top',
    textAlign: 'right',
  },
  termsLink: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  termsText: {
    fontSize: 14,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gradient: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default BookingFormScreen;