import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Video, ResizeMode } from "expo-av";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { uploadFileToBunny } from "utils/api/uploadFileToBunny";
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

type Media = { uri: string; type: "image" | "video" };

const governorates = [
  "صنعاء", "عدن", "تعز", "حضرموت", "الحديدة", "إب", "المكلا", "المهرة", "ذمار", "صعدة", "شبوة", "حجة", "مأرب", "الجوف", "البيضاء", "لحج", "أبين", "ضالع", "عمران", "ريمة", "المحويت"
];

const bookingTypes = [
  "صالة أفراح", "فندق", "منتجع", "شقة", "فيلا", "قاعة مؤتمرات", "مطعم", "كافيه", "أخرى"
];

function AddBookingScreen() {
  const [userPhone, setUserPhone] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    governorate: "",
    price: "",
    availableHours: [] as string[],
    contactNumber: "",
    useAccountPhone: true,
    media: [] as Media[],
    allowMultipleBookings: false,
  });

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem("user-profile");
      if (stored) {
        const user = JSON.parse(stored);
        setUserPhone(user.phone);
        setForm((prev) => ({
          ...prev,
          contactNumber: user.phone,
          useAccountPhone: true,
        }));
      }
    };
    loadUser();
  }, []);

  const handleToggleUsePhone = (use: boolean) => {
    setForm((prev) => ({
      ...prev,
      useAccountPhone: use,
      contactNumber: use ? userPhone : "",
    }));
  };
const handlePickUnavailableDates = () => {
  Alert.alert("قيد التطوير", "ميزة تحديد التواريخ المحجوزة ستتوفر لاحقًا");
};
  const handlePickMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert("يجب منح الإذن للوصول إلى الوسائط");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets.length > 0) {
    const selected: Media[] = result.assets.map((asset) => ({
  uri: asset.uri,
  type: asset.type === "video" ? "video" : "image",
}));
      setForm((prev) => ({ ...prev, media: [...prev.media, ...selected] }));
    }
  };

  const removeMedia = (index: number) => {
    setForm((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  const toggleHour = (hour: string) => {
    setForm((prev) => ({
      ...prev,
      availableHours: prev.availableHours.includes(hour)
        ? prev.availableHours.filter((h) => h !== hour)
        : [...prev.availableHours, hour],
    }));
  };

const handleSubmit = async () => {
  if (!form.title || !form.price || form.media.length === 0) {
    Alert.alert("خطأ", "الرجاء إدخال الاسم والسعر وإضافة وسائط على الأقل");
    return;
  }

  try {
    const uploadedMedia: string[] = [];

    for (const file of form.media) {
      const response = await fetch(file.uri);
      const blob = await response.blob();
      const url = await uploadFileToBunny(blob);
      uploadedMedia.push(url);
    }

    const availability = form.availableHours.map((hour) => ({
      day: "All", // يمكن تغييره لاحقًا لربط أيام مختلفة
      slots: [{ start: hour, end: hour }],
    }));

    const payload = {
      title: form.title,
      description: form.description,
      type: form.type || "hall",
      categories: [form.type],
      price: parseFloat(form.price),
      media: uploadedMedia,
      location: {
        city: form.governorate,
        region: "",
        coordinates: { lat: 0, lng: 0 }, // يمكن تحديثها لاحقًا بالـ GPS
      },
      contactNumber: form.contactNumber,
      initialDeposit: 0,
      availability,
      allowMultipleBookings: form.allowMultipleBookings,
    };

    const res = await axiosInstance.post("/booking-services", payload);
    Alert.alert("نجاح", "تم نشر الحجز بنجاح!");
  } catch (err) {
    console.error("❌ خطأ:", err);
    Alert.alert("خطأ", "فشل حفظ الحجز. حاول مرة أخرى");
  }
};


  const hoursOptions = [
    "10:00 ص", "12:00 م", "2:00 م", "4:00 م", "6:00 م", "8:00 م", "10:00 م",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>إضافة حجز جديد</Text>
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* معلومات أساسية */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المعلومات الأساسية</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>اسم المكان *</Text>
            <TextInput
              placeholder="مثال: قاعة أفراح الهناء"
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>الوصف</Text>
            <TextInput
              placeholder="وصف تفصيلي للمكان والخدمات المقدمة"
              multiline
              numberOfLines={4}
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
              style={[styles.input, styles.textArea]}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>نوع المكان *</Text>
              <View style={[styles.input, styles.pickerContainer]}>
                <Picker
                  selectedValue={form.type}
                  onValueChange={(itemValue) =>
                    setForm({ ...form, type: itemValue })
                  }
                  style={styles.picker}
                  dropdownIconColor={COLORS.primary}
                >
                  <Picker.Item label="اختر نوع المكان" value="" />
                  {bookingTypes.map((type) => (
                    <Picker.Item key={type} label={type} value={type} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>المحافظة *</Text>
              <View style={[styles.input, styles.pickerContainer]}>
                <Picker
                  selectedValue={form.governorate}
                  onValueChange={(itemValue) =>
                    setForm({ ...form, governorate: itemValue })
                  }
                  style={styles.picker}
                  dropdownIconColor={COLORS.primary}
                >
                  <Picker.Item label="اختر المحافظة" value="" />
                  {governorates.map((gov) => (
                    <Picker.Item key={gov} label={gov} value={gov} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>السعر (ريال يمني) *</Text>
            <TextInput
              placeholder="مثال: 50000"
              value={form.price}
              onChangeText={(text) => setForm({ ...form, price: text })}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>
<View style={styles.checkboxRow}>
  <Text style={styles.checkboxLabel}>السماح بحجوزات متعددة</Text>
 <TouchableOpacity
  onPress={() =>
    setForm((prev) => ({
      ...prev,
      allowMultipleBookings: !prev.allowMultipleBookings,
    }))
  }
  style={[
    styles.checkbox,
    form.allowMultipleBookings && styles.checkboxChecked,
  ]}
>
  {form.allowMultipleBookings && (
    <Ionicons name="checkmark" size={16} color="white" />
  )}
</TouchableOpacity>

</View>


        {/* الأوقات المتاحة */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الأوقات المتاحة</Text>
          <Text style={styles.sectionSubtitle}>اختر الأوقات المتاحة للحجز</Text>
          
          <View style={styles.hoursContainer}>
            {hoursOptions.map((hour) => (
              <TouchableOpacity
                key={hour}
                style={[
                  styles.hourBadge,
                  form.availableHours.includes(hour) && styles.hourSelected,
                ]}
                onPress={() => toggleHour(hour)}
              >
                <Text
                  style={[
                    styles.hourText,
                    form.availableHours.includes(hour) && styles.hourSelectedText,
                  ]}
                >
                  {hour}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* معلومات التواصل */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معلومات التواصل</Text>
          
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => handleToggleUsePhone(!form.useAccountPhone)}
            >
              <Text style={styles.checkboxLabel}>
                استخدام رقم الحساب ({userPhone})
              </Text>
              <View style={[
                styles.checkbox,
                form.useAccountPhone && styles.checkboxChecked
              ]}>
                {form.useAccountPhone && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
            </TouchableOpacity>
          </View>

          {!form.useAccountPhone && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>رقم خاص للحجوزات *</Text>
              <TextInput
                placeholder="أدخل رقم هاتف للتواصل"
                value={form.contactNumber}
                keyboardType="phone-pad"
                onChangeText={(text) =>
                  setForm((prev) => ({ ...prev, contactNumber: text }))
                }
                style={styles.input}
              />
            </View>
          )}
        </View>

        {/* الوسائط */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الوسائط *</Text>
          <Text style={styles.sectionSubtitle}>
            أضف صور أو فيديو للمكان (3 كحد أدنى)
          </Text>
          
          <TouchableOpacity 
            onPress={handlePickMedia} 
            style={styles.mediaButton}
          >
            <Ionicons name="camera" size={24} color={COLORS.primary} />
            <Text style={styles.mediaButtonText}>
              {form.media.length ? "إضافة المزيد" : "اختر وسائط"}
            </Text>
          </TouchableOpacity>

          {form.media.length > 0 && (
            <View style={styles.mediaPreviewContainer}>
              {form.media.map((item, i) => (
                <View key={i} style={styles.mediaItem}>
                  {item.type === "image" ? (
                    <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
                  ) : (
                    <Video
                      source={{ uri: item.uri }}
                      useNativeControls
                      resizeMode={ResizeMode.COVER}
                      isLooping
                      style={styles.mediaPreview}
                    />
                  )}
                  <TouchableOpacity 
                    style={styles.removeMediaButton}
                    onPress={() => removeMedia(i)}
                  >
                    <Ionicons name="close" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity 
          onPress={handleSubmit} 
          style={styles.submitButton}
          disabled={!form.title || !form.price || form.media.length === 0}
        >
          <Text style={styles.submitButtonText}>نشر الحجز</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    color: COLORS.white,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  section: {
    backgroundColor: COLORS.white,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    padding: 14,
    borderRadius: 10,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    padding: 0,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    color: COLORS.text,
  },
  hoursContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  hourBadge: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  hourSelected: {
    backgroundColor: COLORS.primary,
  },
  hourText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  hourSelectedText: {
    color: COLORS.white,
  },
  checkboxContainer: {
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkboxLabel: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  linkText: {
  color: COLORS.primary,
  fontSize: 14,
  fontWeight: "bold",
  marginTop: 8,
  textDecorationLine: "underline",
},
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  mediaButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  mediaPreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  mediaItem: {
    width: (width - 64) / 3,
    height: (width - 64) / 3,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
  },
  removeMediaButton: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    margin: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddBookingScreen;