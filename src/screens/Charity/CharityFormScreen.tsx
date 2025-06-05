// screens/CharityFormScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "utils/api/axiosInstance";
import COLORS from "constants/colors";

export default function CharityFormScreen() {
  const [type, setType] = useState("ملابس");
  const [content, setContent] = useState("");
  const [quantity, setQuantity] = useState("");
  const [area, setArea] = useState("");

  const handleSubmit = async () => {
    if (!content.trim() || !quantity.trim() || !area.trim()) {
      Alert.alert("تنبيه", "يرجى ملء جميع الحقول");
      return;
    }

    try {
      await axiosInstance.post(
        "/charity/post",
        { type, content, quantity, area },
      );
      Alert.alert("تم النشر", "شكراً لمساهمتك");
      setContent("");
      setQuantity("");
      setArea("");
    } catch (err) {
      Alert.alert("فشل", "حدث خطأ أثناء النشر");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.header}>نموذج عرض الخير</Text>

        {/* نوع التبرع */}
        <Text style={styles.label}>نوع التبرع</Text>
        <View style={styles.pickerContainer}>
          <Ionicons
            name="help-circle-outline"
            size={20}
            color={COLORS.primary}
            style={styles.icon}
          />
          <Picker
            selectedValue={type}
            style={styles.picker}
            onValueChange={(itemValue) => setType(itemValue)}
            dropdownIconColor={COLORS.primary}
          >
            <Picker.Item label="ملابس" value="ملابس" />
            <Picker.Item label="طعام" value="طعام" />
            <Picker.Item label="مستلزمات منزلية" value="مستلزمات" />
            <Picker.Item label="مساهمة نقدية" value="نقدية" />
            <Picker.Item label="خدمة تطوعية" value="خدمة" />
          </Picker>
        </View>

        {/* تفاصيل المحتوى */}
        <Text style={styles.label}>تفاصيل المحتوى</Text>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="document-text-outline"
            size={20}
            color={COLORS.primary}
            style={styles.icon}
          />
          <TextInput
            placeholder="اكتب تفاصيل التبرع..."
            value={content}
            onChangeText={setContent}
            style={[styles.input, styles.textArea]}
            placeholderTextColor={COLORS.lightText}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* الكمية */}
        <Text style={styles.label}>الكمية أو الكمية التقديرية</Text>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="calculator-outline"
            size={20}
            color={COLORS.primary}
            style={styles.icon}
          />
          <TextInput
            placeholder="مثال: 10 حقائب"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor={COLORS.lightText}
          />
        </View>

        {/* المنطقة */}
        <Text style={styles.label}>المنطقة أو الحي</Text>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="location-outline"
            size={20}
            color={COLORS.primary}
            style={styles.icon}
          />
          <TextInput
            placeholder="مثال: حي الروضة"
            value={area}
            onChangeText={setArea}
            style={styles.input}
            placeholderTextColor={COLORS.lightText}
          />
        </View>

        {/* زر الإرسال */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>نشر الخير</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 20,
  },
  header: {
    fontFamily: "Cairo-Bold",
    fontSize: 24,
    color: COLORS.primary,
    marginBottom: 24,
    textAlign: "right",
  },
  label: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "right",
  },
  pickerContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  icon: {
    marginHorizontal: 12,
  },
  picker: {
    flex: 1,
    height: 50,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
  },
  inputWrapper: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: COLORS.text,
  },
  textArea: {
    height: 100,
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    // ظل أندرويد
    elevation: 3,
    // ظل iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  submitButtonText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 18,
    color: "#FFF",
  },
});
