import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { RootStackParamList } from "types/navigation";
import axiosInstance from "utils/api/axiosInstance";

const RateDriverScreen = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    try {
        const route = useRoute<RouteProp<RootStackParamList, "RateDriver">>();
const { id } = route.params;
      const token = await AsyncStorage.getItem("firebase-token");
      await axiosInstance.post(`/waslni/${id}/review`, {
        rating,
        comment,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("✅ تم تقييم السائق");
      navigation.goBack();
    } catch (error) {
      Alert.alert("❌", "فشل إرسال التقييم");
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تقييم السائق</Text>
      <Text style={styles.label}>التقييم:</Text>
      <Text>⭐⭐⭐⭐⭐</Text>
      <Button title="إرسال التقييم" onPress={handleSubmit} />
    </View>
  );
};

export default RateDriverScreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontFamily: "Cairo-Bold", marginBottom: 12 },
  label: { fontSize: 16, fontFamily: "Cairo-Regular", marginVertical: 10 },
});
