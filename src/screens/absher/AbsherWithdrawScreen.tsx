// screens/AbsherWithdrawScreen.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axiosInstance from "utils/api/axiosInstance";
import COLORS from "constants/colors";

export default function AbsherWithdrawScreen() {
  const [requestId, setRequestId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!requestId.trim()) {
      Alert.alert("تنبيه", "يرجى إدخال معرف الطلب");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/absher/provider/withdraw", {
        requestId: requestId.trim(),
      });
      Alert.alert("✅ تم السحب", res.data.message);
      setRequestId("");
    } catch (error) {
      Alert.alert("❌ فشل في السحب", "تأكد من صحة المعرف وبياناتك");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💸 سحب الأرباح من الطلب</Text>

      <Text style={styles.label}>معرف الطلب</Text>
      <TextInput
        placeholder="مثال: 64fc...c1a"
        value={requestId}
        onChangeText={setRequestId}
        style={styles.input}
        placeholderTextColor={COLORS.lightText}
      />

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: COLORS.lightText }]}
        onPress={handleWithdraw}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>سحب المبلغ</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: "Cairo-Bold",
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "right",
  },
  label: {
    fontSize: 16,
    fontFamily: "Cairo-SemiBold",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "right",
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.lightText,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#FFF",
    fontFamily: "Cairo-Bold",
    fontSize: 18,
  },
});
