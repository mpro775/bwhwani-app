// screens/reviews/ReviewScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "types/navigation";



const ReviewScreen = () => {
const route = useRoute<RouteProp<RootStackParamList, "ReviewScreen">>();
  const navigation = useNavigation();
const { freelancerId } = route.params;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("تنبيه", "الرجاء اختيار تقييم أولاً");
      return;
    }
    try {
      await axios.post(`/api/reviews/${freelancerId}`, {
        rating,
        comment,
      });
      Alert.alert("تم الإرسال", "شكرًا لمساهمتك");
      navigation.goBack();
    } catch {
      Alert.alert("خطأ", "فشل في إرسال التقييم");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>كيف كانت تجربتك؟</Text>

      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((val) => (
          <TouchableOpacity key={val} onPress={() => setRating(val)}>
            <Ionicons
              name={val <= rating ? "star" : "star-outline"}
              size={32}
              color="#FFC107"
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="أضف تعليقًا اختياريًا..."
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>إرسال التقييم</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#FFF",
    flex: 1,
  },
  title: {
    fontFamily: "Cairo-Bold",
    fontSize: 22,
    marginBottom: 16,
    textAlign: "right",
  },
  starsRow: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 12,
    minHeight: 100,
    textAlign: "right",
    fontFamily: "Cairo-Regular",
  },
  button: {
    backgroundColor: "#2E7D32",
    padding: 14,
    borderRadius: 10,
    marginTop: 24,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Cairo-Bold",
    fontSize: 16,
  },
});

export default ReviewScreen;
