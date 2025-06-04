// screens/opportunities/AddOpportunityScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { createOpportunity } from "api/opportunityApi";

const categories = ["برمجة", "تصميم", "تسويق", "كتابة"];
const types = ["توظيف", "خدمة"];
const governorates = ["أمانة العاصمة", "عدن", "تعز", "حضرموت"];

const AddOpportunityScreen = () => {
  const navigation = useNavigation();

 const [form, setForm] = useState({
  title: "",
  description: "",
  category: "",
  type: "",
  governorate: "",
});
// ثم في useEffect نحدثها عند توفر user

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

const validateForm = () => {
  return form.title && form.description && form.category && form.type && form.governorate;
};

  const handleSubmit = async () => {
    if (!validateForm()) {
      Toast.show({
        type: "error",
        text1: "الحقول المطلوبة",
        text2: "يرجى تعبئة جميع الحقول",
      });
      return;
    }

    try {
    await createOpportunity(form);
 
      Toast.show({
        type: "success",
        text1: "تم النشر بنجاح",
        text2: "ستظهر فرصتك في القائمة قريبًا",
      });

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "خطأ في الحفظ",
        text2: "حاول مرة أخرى لاحقًا",
      });
    }
  };

  const SelectionGroup = ({
    label,
    options,
    icon,
    selected,
    onSelect,
  }: any) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={20} color="#D84315" />
        <Text style={styles.sectionTitle}>{label}</Text>
      </View>
      <View style={styles.optionsGrid}>
        {options.map((option: string) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionCard,
              selected === option && styles.selectedCard,
            ]}
            onPress={() => onSelect(option)}
          >
            <Text
              style={[
                styles.optionText,
                selected === option && styles.selectedText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <LinearGradient colors={["#FFF", "#FFF5F3"]} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#D84315" />
            </TouchableOpacity>
            <Text style={styles.mainTitle}>إضافة فرصة جديدة</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.inputCard}>
            <Ionicons
              name="pricetag"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="عنوان الفرصة..."
              placeholderTextColor="#999"
              style={styles.input}
              value={form.title}
              onChangeText={(t) => handleChange("title", t)}
            />
          </View>

          <View style={[styles.inputCard, styles.multilineCard]}>
            <Ionicons
              name="document-text"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="وصف الفرصة..."
              placeholderTextColor="#999"
              style={[styles.input, styles.multilineInput]}
              multiline
              numberOfLines={5}
              value={form.description}
              onChangeText={(t) => handleChange("description", t)}
            />
          </View>

          <SelectionGroup
            label="التصنيف"
            icon="grid"
            options={categories}
            selected={form.category}
            onSelect={(val: string) => handleChange("category", val)}
          />

          <SelectionGroup
            label="نوع الفرصة"
            icon="briefcase"
            options={types}
            selected={form.type}
            onSelect={(val: string) => handleChange("type", val)}
          />

          <SelectionGroup
            label="الموقع الجغرافي"
            icon="location"
            options={governorates}
            selected={form.governorate}
            onSelect={(val: string) => handleChange("governorate", val)}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <LinearGradient
              colors={["#D84315", "#BF360C"]}
              style={styles.buttonGradient}
            >
              <Ionicons name="add-circle" size={24} color="#FFF" />
              <Text style={styles.buttonText}>نشر الفرصة</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  mainTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 24,
    color: "#2C3E50",
  },
  inputCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row-reverse",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: "#333",
    textAlign: "right",
  },
  multilineCard: {
    height: 150,
    alignItems: "flex-start",
  },
  multilineInput: {
    height: "100%",
    textAlignVertical: "top",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 18,
    color: "#2C3E50",
  },
  optionsGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 12,
  },
  optionCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCard: {
    backgroundColor: "#D84315",
    shadowColor: "#D84315",
  },
  optionText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    color: "#666",
  },
  selectedText: {
    color: "#FFF",
  },
  submitButton: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 32,
  },
  buttonGradient: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    gap: 12,
  },
  buttonText: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: "#FFF",
  },
});

export default AddOpportunityScreen;
