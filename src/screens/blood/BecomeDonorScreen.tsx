import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Platform,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchUserProfile, updateBloodSettings } from "../../api/userApi";
import { BloodData } from "../../types/types";
import { updateUserProfile } from "storage/userStorage";

const governorates = ["أمانة العاصمة", "عدن", "تعز", "حضرموت", "إب", "الحديدة"];
const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genders = ["ذكر", "أنثى"];
const statuses = ["متاح", "غير متاح"];

const BecomeDonorScreen = ({ navigation }: any) => {
  const [form, setForm] = useState({
    age: "",
    gender: "",
    bloodType: "",
    governorate: "",
    address: "",
    availableTime: "",
    lastDonation: "",
    showPhone: true,
    status: "متاح",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
   const loadData = async () => {
  const user = await fetchUserProfile();
  if (user?.bloodData) {
    setForm({
      ...user.bloodData,
      lastDonation: user.bloodData.lastDonation || "",
    });
  }
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 500,
    useNativeDriver: true,
  }).start();
};

    loadData();
  }, []);

  const handleChange = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      handleChange("lastDonation", selectedDate.toLocaleDateString('ar-EG'));
    }
  };

const handleSubmit = async () => {
  try {
    const user = await fetchUserProfile();
    if (!user) {
      Alert.alert("خطأ", "يجب تسجيل الدخول أولًا");
      return;
    }

    const bloodData: BloodData = {
      name: user.fullName,
      phone: user.phoneNumber,
      ...form,
      bloodType: form.bloodType as BloodData["bloodType"],
      status: form.status as BloodData["status"],
      lastDonation: form.lastDonation || undefined,
        isAvailableToDonate: true,
    };

    await updateBloodSettings(bloodData);

    // ✅ تحديث الملف الشخصي المحلي لتفادي ظهور شاشة فارغة
    await updateUserProfile({ bloodData });

    Alert.alert("تم الحفظ", "✅ تم تحديث بيانات المتبرع بنجاح");
    navigation.goBack();
  } catch (error) {
    Alert.alert("خطأ", "حدثت مشكلة أثناء حفظ البيانات");
  }
};




  return (
    <Animated.ScrollView 
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.content}
    >
      <LinearGradient
        colors={['#FF5252', '#D84315']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <MaterialIcons name="bloodtype" size={32} color="#FFF" />
        <Text style={styles.headerTitle}>تسجيل متبرع بالدم</Text>
      </LinearGradient>

      <View style={styles.formContainer}>
        {/* Personal Info Section */}
        <SectionTitle icon="person" title="المعلومات الشخصية" />
        
        <FormInput
          icon="calendar-today"
          placeholder="العمر"
          value={form.age}
          onChangeText={(text:string) => handleChange("age", text)}
          keyboardType="numeric"
        />

        <FormDropdown
          icon="wc"
          label="الجنس"
          options={genders}
          value={form.gender}
          onChange={(v:string) => handleChange("gender", v)}
        />

        {/* Medical Info Section */}
        <SectionTitle icon="medical-services" title="المعلومات الطبية" />
        
        <FormDropdown
          icon="bloodtype"
          label="فصيلة الدم"
          options={bloodTypes}
          value={form.bloodType}
          onChange={(v:string) => handleChange("bloodType", v)}
        />

        {/* Location Info Section */}
        <SectionTitle icon="location-on" title="المعلومات الجغرافية" />
        
        <FormDropdown
          icon="map"
          label="المحافظة"
          options={governorates}
          value={form.governorate}
          onChange={(v:string) => handleChange("governorate", v)}
        />

        <FormInput
          icon="home"
          placeholder="العنوان التفصيلي"
          value={form.address}
          onChangeText={(text:string) => handleChange("address", text)}
        />

        {/* Availability Section */}
        <SectionTitle icon="access-time" title="معلومات التوفر" />
        
        <FormInput
          icon="schedule"
          placeholder="أوقات التوفر (مثال: 9 صباحاً - 5 مساءً)"
          value={form.availableTime}
          onChangeText={(text:string) => handleChange("availableTime", text)}
        />

        <TouchableOpacity 
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <MaterialIcons name="event" size={20} color="#5D4037" />
          <Text style={styles.dateText}>
            {form.lastDonation || "تاريخ آخر تبرع (اختياري)"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Privacy Section */}
        <SectionTitle icon="privacy-tip" title="إعدادات الخصوصية" />
        
        <View style={styles.switchContainer}>
          <View style={styles.switchLabel}>
            <MaterialIcons name="visibility" size={20} color="#5D4037" />
            <Text style={styles.switchText}>إظهار رقم الهاتف للمحتاجين</Text>
          </View>
          <Switch
            value={form.showPhone}
            onValueChange={(val) => handleChange("showPhone", val)}
            thumbColor={form.showPhone ? "#FFF" : "#f4f3f4"}
            trackColor={{ false: "#EEE", true: "#4CAF50" }}
          />
        </View>

        <FormDropdown
          icon="circle-notifications"
          label="حالة التبرع"
          options={statuses}
          value={form.status}
          onChange={(v:string) => handleChange("status", v)}
        />

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#D84315', '#FF5252']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          >
            <MaterialIcons name="save" size={24} color="#FFF" />
            <Text style={styles.buttonText}>حفظ البيانات</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.ScrollView>
  );
};

// Reusable Components
const SectionTitle = ({ icon, title }: any) => (
  <View style={styles.sectionTitle}>
    <MaterialIcons name={icon} size={20} color="#D84315" />
    <Text style={styles.sectionTitleText}>{title}</Text>
  </View>
);

const FormInput = ({ icon, ...props }: any) => (
  <View style={styles.inputContainer}>
    <MaterialIcons name={icon} size={20} color="#5D4037" style={styles.inputIcon} />
    <TextInput
      style={styles.input}
      placeholderTextColor="#888"
      {...props}
    />
  </View>
);

const FormDropdown = ({ icon, label, options, value, onChange }: any) => (
  <View style={styles.dropdownSection}>
    <View style={styles.dropdownLabel}>
      <MaterialIcons name={icon} size={20} color="#5D4037" />
      <Text style={styles.dropdownLabelText}>{label}</Text>
    </View>
    <View style={styles.optionsContainer}>
      {options.map((option: string) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.option,
            value === option && styles.selectedOption,
          ]}
          onPress={() => onChange(option)}
        >
          <Text style={[
            styles.optionText,
            value === option && styles.selectedOptionText
          ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Cairo-Bold',
    fontSize: 22,
    color: '#FFF',
    marginRight: 10,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 8,
  },
  sectionTitleText: {
    fontFamily: 'Cairo-SemiBold',
    fontSize: 18,
    color: '#D84315',
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  inputIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: 'Cairo-Regular',
    color: '#333',
    textAlign: 'right',
  },
  dropdownSection: {
    marginBottom: 20,
  },
  dropdownLabel: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdownLabelText: {
    fontFamily: 'Cairo-SemiBold',
    color: '#5D4037',
    marginRight: 8,
  },
  optionsContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  option: {
    backgroundColor: '#EEE',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#D84315',
  },
  optionText: {
    fontFamily: 'Cairo-Regular',
    color: '#555',
  },
  selectedOptionText: {
    color: '#FFF',
    fontFamily: 'Cairo-Bold',
  },
  dateInput: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
    elevation: 2,
  },
  dateText: {
    flex: 1,
    fontFamily: 'Cairo-Regular',
    color: '#333',
    textAlign: 'right',
  },
  switchContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  switchLabel: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  switchText: {
    fontFamily: 'Cairo-Regular',
    color: '#5D4037',
    marginRight: 8,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 30,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  buttonText: {
    fontFamily: 'Cairo-Bold',
    color: '#FFF',
    fontSize: 18,
    marginRight: 10,
  },
});

export default BecomeDonorScreen;