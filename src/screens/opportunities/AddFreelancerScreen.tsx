import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { getUserProfile, updateUserProfile } from "../../storage/userStorage";

const services = ["برمجة", "تصميم", "كتابة", "تسويق"];
const governorates = ["أمانة العاصمة", "عدن", "تعز"];

const AddFreelancerScreen = ({ navigation }: any) => {
  const [savedAddresses, setSavedAddresses] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [label, city, street] = selectedAddress.split(" - ");

  const [form, setForm] = useState({
    name: "",
    service: "",
    governorate: "",
    phone: "",
    description: "",
    portfolio: [] as string[],
  });
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const loadData = async () => {
      const user = await getUserProfile();
      if (user) {
        const addresses =
          user.addresses?.map((a) => `${a.label} - ${a.city} - ${a.street}`) ||
          [];

        setForm((prev) => ({
          ...prev,
          name: user.fullName || "",
          phone: user.phoneNumber || "",
          service: user.freelanceData?.serviceCategory || "",
          governorate: user.freelanceData?.city || "",
          description: user.freelanceData?.bio || "",
          portfolio: user.freelanceData?.portfolioImages || [],
        }));

        setSavedAddresses(addresses);
        if (addresses.length > 0) {
          setSelectedAddress(addresses[0]);
        }
      }
    };
    loadData();
  }, []);
  

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("تنبيه", "يجب منح صلاحية الوصول إلى الصور");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      handleChange("portfolio", [...form.portfolio, ...uris]);
    }
  };

  const removeImage = (index: number) => {
    const updatedPortfolio = [...form.portfolio];
    updatedPortfolio.splice(index, 1);
    handleChange("portfolio", updatedPortfolio);
  };

  const handleSubmit = async () => {
    animatePress();

    if (!form.name || !form.service || !selectedAddress || !form.phone) {
      Alert.alert("تنبيه", "الرجاء تعبئة جميع الحقول المطلوبة");
      return;
    }

    try {
      const updatedFreelanceData = {
        bio: form.description,
        serviceCategory: form.service,
        city,
        skills: [form.service],
        portfolioImages: form.portfolio,
      };

      await updateUserProfile({
        fullName: form.name,
        phoneNumber: form.phone,
        freelanceData: updatedFreelanceData,
      });

      Alert.alert("تم بنجاح", "✅ تم حفظ بيانات الفريلانسر بنجاح", [
        { text: "حسناً", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء حفظ البيانات");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={["#FF5252", "#D84315"]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.headerTitle}>بيانات الفريلانسر</Text>
        </LinearGradient>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Personal Info Section */}
          <SectionTitle icon="person" title="المعلومات الشخصية" />

          <FormDropdown
            icon="work"
            label="نوع الخدمة"
            options={services}
            value={form.service}
            onChange={(v: string) => handleChange("service", v)}
          />

          <FormDropdown
            icon="place"
            label="اختر عنوانك"
            options={savedAddresses}
            value={selectedAddress}
            onChange={(v: string) => setSelectedAddress(v)}
          />

          {/* Bio Section */}
          <SectionTitle icon="info" title="نبذة عنك" />

          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="أخبرنا عن خبراتك ومهاراتك..."
              placeholderTextColor="#888"
              multiline
              numberOfLines={4}
              value={form.description}
              onChangeText={(text) => handleChange("description", text)}
            />
          </View>

          {/* Portfolio Section */}
          <SectionTitle icon="photo-library" title="معرض الأعمال" />

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={styles.addPhotosButton}
              onPress={handlePickImages}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#2196F3", "#1976D2"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              >
                <MaterialIcons
                  name="add-photo-alternate"
                  size={20}
                  color="#FFF"
                />
                <Text style={styles.buttonText}>إضافة صور من أعمالك</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {form.portfolio.length > 0 && (
            <View style={styles.portfolioContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.portfolioScroll}
              >
                {form.portfolio.map((uri, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image
                      source={{ uri }}
                      style={styles.portfolioImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.deleteImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons name="close" size={18} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Submit Button */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#D84315", "#FF5252"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              >
                <MaterialIcons name="save" size={20} color="#FFF" />
                <Text style={styles.buttonText}>حفظ البيانات</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    <MaterialIcons
      name={icon}
      size={20}
      color="#5D4037"
      style={styles.inputIcon}
    />
    <TextInput style={styles.input} placeholderTextColor="#888" {...props} />
  </View>
);

const FormDropdown = ({ icon, label, options, value, onChange }: any) => (
  <View style={styles.dropdownSection}>
    <View style={styles.dropdownLabel}>
      <MaterialIcons name={icon} size={20} color="#5D4037" />
      <Text style={styles.dropdownLabelText}>{label}</Text>
    </View>
    <View style={styles.optionsContainer}>
      {options.map((opt: string) => (
        <TouchableOpacity
          key={opt}
          style={[styles.option, value === opt && styles.selectedOption]}
          onPress={() => onChange(opt)}
        >
          <Text
            style={[
              styles.optionText,
              value === opt && styles.selectedOptionText,
            ]}
          >
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 8,
  },
  sectionTitleText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 18,
    color: "#D84315",
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
    height: 50,
  },
  inputIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontFamily: "Cairo-Regular",
    color: "#333",
    textAlign: "right",
    height: "100%",
  },
  dropdownSection: {
    marginBottom: 20,
  },
  dropdownLabel: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 10,
  },
  dropdownLabelText: {
    fontFamily: "Cairo-SemiBold",
    color: "#5D4037",
    marginRight: 8,
  },
  optionsContainer: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  option: {
    backgroundColor: "#EEE",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: "#D84315",
  },
  optionText: {
    fontFamily: "Cairo-Regular",
    color: "#555",
  },
  selectedOptionText: {
    color: "#FFF",
    fontFamily: "Cairo-Bold",
  },
  textAreaContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  textArea: {
    fontFamily: "Cairo-Regular",
    color: "#333",
    textAlign: "right",
    height: 100,
    textAlignVertical: "top",
  },
  addPhotosButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 3,
  },
  portfolioContainer: {
    marginBottom: 20,
  },
  portfolioScroll: {
    paddingVertical: 5,
  },
  imageContainer: {
    position: "relative",
    marginLeft: 10,
  },
  portfolioImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  deleteImageButton: {
    position: "absolute",
    top: 5,
    left: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
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
});

export default AddFreelancerScreen;
