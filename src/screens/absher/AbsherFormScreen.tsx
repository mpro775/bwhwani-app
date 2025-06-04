// screens/AbsherFormScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function AbsherFormScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { category }: any = route.params;

  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post("https://yourapi.com/absher/request", {
        category,
        location,
        details,
      }, {
        headers: { Authorization: "Bearer token" }
      });
      Alert.alert("تم الإرسال", "تم إرسال طلبك بنجاح");
      navigation.goBack();
    } catch (err) {
      Alert.alert("خطأ", "فشل في إرسال الطلب");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>طلب خدمة - {category}</Text>
      <TextInput
        placeholder="الموقع"
        value={location}
        onChangeText={setLocation}
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 12 }}
      />
      <TextInput
        placeholder="التفاصيل"
        value={details}
        onChangeText={setDetails}
        multiline
        numberOfLines={4}
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 12, textAlignVertical: 'top' }}
      />
      <Button title="إرسال الطلب" onPress={handleSubmit} />
    </View>
  );
}
