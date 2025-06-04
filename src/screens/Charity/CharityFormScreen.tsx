// screens/CharityFormScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert,  ScrollView } from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

export default function CharityFormScreen() {
  const [type, setType] = useState("ملابس");
  const [content, setContent] = useState("");
  const [quantity, setQuantity] = useState("");
  const [area, setArea] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post("https://yourapi.com/charity/post", {
        type,
        content,
        quantity,
        area,
      }, {
        headers: { Authorization: "Bearer token" },
      });
      Alert.alert("تم النشر", "شكراً لمساهمتك");
      setContent("");
      setQuantity("");
      setArea("");
    } catch (err) {
      Alert.alert("فشل", "حدث خطأ أثناء النشر");
    }
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>نموذج عرض الخير</Text>

      <Text style={{ marginBottom: 4 }}>نوع التبرع</Text>
      <Picker
        selectedValue={type}
        style={{ height: 50, marginBottom: 12 }}
        onValueChange={(itemValue) => setType(itemValue)}
      >
        <Picker.Item label="ملابس" value="ملابس" />
        <Picker.Item label="طعام" value="طعام" />
        <Picker.Item label="مستلزمات منزلية" value="مستلزمات" />
        <Picker.Item label="مساهمة نقدية" value="نقدية" />
        <Picker.Item label="خدمة تطوعية" value="خدمة" />
      </Picker>

      <TextInput
        placeholder="تفاصيل المحتوى"
        value={content}
        onChangeText={setContent}
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 }}
      />

      <TextInput
        placeholder="الكمية أو الكمية التقديرية"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 }}
      />

      <TextInput
        placeholder="المنطقة أو الحي"
        value={area}
        onChangeText={setArea}
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 }}
      />

      <Button title="نشر الخير" onPress={handleSubmit} />
    </ScrollView>
  );
}
