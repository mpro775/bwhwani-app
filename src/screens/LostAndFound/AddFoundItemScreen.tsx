import React, { useState } from "react";
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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserProfile, updateUserProfile } from "../../storage/userStorage";

const AddFoundItemScreen = ({ navigation }: any) => {
  const [item, setItem] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    image: "",
  });

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

  const handleSave = async () => {
    if (!item.title || !item.description || !item.location) {
      Alert.alert("الحقول المطلوبة", "يرجى تعبئة اسم العنصر، الوصف، والموقع");
      return;
    }

    try {
      const user = await getUserProfile();
      if (!user) throw new Error("User not found");

      const newItem = {
        ...item,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        contactPhone: user.phoneNumber,
        postedBy: user.fullName,
        status: "موجود",
      };

      const existing = await AsyncStorage.getItem("found-items");
      const updatedItems = existing
        ? [newItem, ...JSON.parse(existing)]
        : [newItem];
      await AsyncStorage.setItem("found-items", JSON.stringify(updatedItems));

      await updateUserProfile({
        lostAndFoundPosts: {
          ...user.lostAndFoundPosts,
          foundCount: (user.lostAndFoundPosts?.foundCount || 0) + 1,
          lostCount: user.lostAndFoundPosts?.lostCount || 0, // لتجنب خطأ undefined
        },
      });

      Alert.alert("تم الحفظ", "تم إضافة البلاغ بنجاح");
      navigation.goBack();
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء الحفظ، يرجى المحاولة لاحقًا");
    }
  };

  return (
    <LinearGradient colors={["#f8f9fa", "#fff"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#D84315" />
            </TouchableOpacity>
            <Text style={styles.title}>إضافة موجود</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.formCard}>
            {/* Title */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="pricetag"
                size={20}
                color="#D84315"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="اسم العنصر الموجود"
                placeholderTextColor="#999"
                value={item.title}
                onChangeText={(text) => handleChange("title", text)}
              />
            </View>

            {/* Description */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="document-text"
                size={20}
                color="#D84315"
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="وصف تفصيلي للموجود"
                placeholderTextColor="#999"
                multiline
                value={item.description}
                onChangeText={(text) => handleChange("description", text)}
              />
            </View>

            {/* Location */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="location"
                size={20}
                color="#D84315"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="الموقع التقريبي للعثور"
                placeholderTextColor="#999"
                value={item.location}
                onChangeText={(text) => handleChange("location", text)}
              />
            </View>

            {/* Date */}
            <TouchableOpacity style={styles.inputContainer}>
              <Ionicons
                name="calendar"
                size={20}
                color="#D84315"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="تاريخ العثور (مثال: 2025-05-13)"
                placeholderTextColor="#999"
                value={item.date}
                onChangeText={(text) => handleChange("date", text)}
              />
            </TouchableOpacity>

            {/* Image */}
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

          {/* Submit */}
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
  container: { flex: 1 },
  content: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
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
  input: {
    flex: 1,
    height: 48,
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: "#333",
    textAlign: "right",
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

export default AddFoundItemScreen;
