// screens/LostAndFound/AddLostItemScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserProfile, updateUserProfile } from "../../storage/userStorage";
import axiosInstance from "utils/api/axiosInstance";
import * as Location from "expo-location";

type LostAndFoundStats = {
  lostCount: number;
  foundCount: number; // هنا النوع غير قابل أن يكون undefined
};

const AddLostItemScreen = ({ navigation }: any) => {
  const [item, setItem] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    image: "",
    reward:"",
  });
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
const [rewardOffered, setRewardOffered] = useState(false);
const [rewardAmount, setRewardAmount] = useState("");
const [rewardMethod, setRewardMethod] = useState<"cash" | "wallet">("cash");

  const requestLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("تنبيه", "تم رفض إذن الموقع");
    return;
  }

  const location = await Location.getCurrentPositionAsync({});
  setCoordinates({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });
};
useEffect(() => {
  requestLocation();
}, []);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (key: string, value: string) => {
    setItem((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setItem((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange("date", selectedDate.toLocaleDateString("ar-EG"));
    }
  };

const handleSave = async () => {
  if (!item.title || !item.description || !item.location) {
    Alert.alert("الحقول المطلوبة", "يرجى تعبئة اسم العنصر، الوصف، والموقع");
    return;
  }

  try {
    const token = await AsyncStorage.getItem("firebase-token"); // تأكد من وجود JWT هنا
const payload = {
  type: "lost",
  title: item.title,
  description: item.description,
  location: { city: item.location },
  dateLostOrFound: item.date,
  images: [item.image],
    rewardOffered,
  rewardAmount: rewardOffered ? Number(rewardAmount) : undefined,
  rewardMethod: rewardOffered ? rewardMethod : undefined,

  reward: Number(item.reward || 0),

  ...(coordinates && {
    locationCoords: {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
    },
  }),
};


    const res = await axiosInstance.post("/api/lostfound", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    Alert.alert("تم", "تم رفع البلاغ بنجاح");
    navigation.goBack();
  } catch (err) {
    console.error(err);
    Alert.alert("خطأ", "فشل إرسال البلاغ");
  }
};

  return (
    <LinearGradient colors={["#f8f9fa", "#fff"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header Section */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#D84315" />
            </TouchableOpacity>
            <Text style={styles.title}>إضافة بلاغ مفقود</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Title Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="pricetag"
                size={20}
                color="#D84315"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="اسم العنصر المفقود"
                placeholderTextColor="#999"
                value={item.title}
                onChangeText={(text) => handleChange("title", text)}
              />
            </View>

            {/* Description Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="document-text"
                size={20}
                color="#D84315"
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="وصف تفصيلي للمفقود"
                placeholderTextColor="#999"
                multiline
                value={item.description}
                onChangeText={(text) => handleChange("description", text)}
              />
            </View>
<View style={styles.inputContainer}>
  <Ionicons name="cash" size={20} color="#D84315" style={styles.inputIcon} />
  <TextInput
    style={styles.input}
    keyboardType="numeric"
    placeholder="مكافأة لمن يجدها (اختياري)"
    placeholderTextColor="#999"
    value={item.reward}
    onChangeText={(text) => handleChange("reward", text)}
  />
</View>

            {/* Location Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="location"
                size={20}
                color="#D84315"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="الموقع التقريبي للفقدان"
                placeholderTextColor="#999"
                value={item.location}
                onChangeText={(text) => handleChange("location", text)}
              />
            </View>

            {/* Date Picker */}
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons
                name="calendar"
                size={20}
                color="#D84315"
                style={styles.inputIcon}
              />
              <Text style={[styles.input, !item.date && { color: "#999" }]}>
                {item.date || "تاريخ الفقدان (اختياري)"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
            )}

            {/* Image Upload */}
            <TouchableOpacity
              style={styles.imageButton}
              onPress={pickImage}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#D84315", "#BF360C"]}
                style={styles.imageButtonContent}
              >
                <Ionicons
                  name={item.image ? "camera" : "camera-outline"}
                  size={24}
                  color="#FFF"
                />
                <Text style={styles.imageButtonText}>
                  {item.image ? "تغيير الصورة" : "إضافة صورة توضيحية"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            )}
          </View>

<View style={styles.rewardSection}>
  <View style={styles.row}>
    <Text style={styles.label}>هل ترغب بدفع مكافأة؟</Text>
    <Switch
      value={rewardOffered}
      onValueChange={setRewardOffered}
      trackColor={{ false: "#ccc", true: "#D84315" }}
      thumbColor={rewardOffered ? "#fff" : "#f4f3f4"}
    />
  </View>

  {rewardOffered && (
    <>
      <Text style={styles.label}>مبلغ المكافأة (اختياري)</Text>
      <TextInput
        keyboardType="numeric"
        value={rewardAmount}
        onChangeText={setRewardAmount}
        style={styles.input}
        placeholder="مثال: 5000"
      />

      <Text style={styles.label}>طريقة الدفع</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.option,
            rewardMethod === "cash" && styles.activeOption,
          ]}
          onPress={() => setRewardMethod("cash")}
        >
          <Text style={styles.optionText}>نقدًا</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.option,
            rewardMethod === "wallet" && styles.activeOption,
          ]}
          onPress={() => setRewardMethod("wallet")}
        >
          <Text style={styles.optionText}>من المحفظة</Text>
        </TouchableOpacity>
      </View>
    </>
  )}
</View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSave}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#D84315", "#BF360C"]}
              style={styles.submitButtonContent}
            >
              <Ionicons name="checkmark-circle" size={24} color="#FFF" />
              <Text style={styles.submitButtonText}>تأكيد الإبلاغ</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  rewardSection: {
  backgroundColor: "#FFF",
  padding: 16,
  margin: 16,
  borderRadius: 12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
},
row: {
  flexDirection: "row-reverse",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
},
label: {
  fontFamily: "Cairo-SemiBold",
  fontSize: 16,
  color: "#3E2723",
  marginBottom: 8,
  textAlign: "right",
},
input: {
  backgroundColor: "#F5F5F5",
  borderRadius: 8,
  padding: 12,
  fontFamily: "Cairo-Regular",
  fontSize: 14,
  marginBottom: 12,
  textAlign: "right",
},
option: {
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: "#CCC",
  marginHorizontal: 6,
},
activeOption: {
  backgroundColor: "#D84315",
  borderColor: "#D84315",
},
optionText: {
  fontFamily: "Cairo-Bold",
  fontSize: 14,
  color: "#FFF",
},

  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  title: {
    fontFamily: "Cairo-Bold",
    fontSize: 22,
    color: "#3E2723",
  },
  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  inputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginLeft: 12,
  },
 
  imageButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 16,
  },
  imageButtonContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 12,
  },
  imageButtonText: {
    color: "#FFF",
    fontFamily: "Cairo-Bold",
    fontSize: 16,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 16,
  },
  submitButton: {
    borderRadius: 14,
    overflow: "hidden",
    marginHorizontal: 16,
  },
  submitButtonContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    gap: 12,
  },
  submitButtonText: {
    color: "#FFF",
    fontFamily: "Cairo-Bold",
    fontSize: 18,
  },
});

export default AddLostItemScreen;
