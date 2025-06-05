// screens/AbsherProviderScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axiosInstance from "utils/api/axiosInstance";
import COLORS from "constants/colors";
import { MaterialIcons } from "@expo/vector-icons";

export default function AbsherProviderScreen() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [responseText, setResponseText] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchAssignedRequests = async () => {
    try {
      const res = await axiosInstance.get("/absher/provider/assigned");
      setRequests(res.data.requests);
    } catch (err) {
      console.log("❌ فشل في تحميل الطلبات المعينة");
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async () => {
    if (!selectedId || !responseText.trim()) return;

    try {
      await axiosInstance.patch("/absher/provider/respond", {
        requestId: selectedId,
        response: responseText.trim(),
        fee: 100, // يمكنك تحويلها إلى مدخل لاحقًا
      });

      Alert.alert("✅ تم الرد بنجاح");
      setResponseText("");
      setSelectedId(null);
      fetchAssignedRequests();
    } catch (err) {
      Alert.alert("❌ خطأ", "فشل في إرسال الرد");
    }
  };

  useEffect(() => {
    fetchAssignedRequests();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.primary} />;

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <MaterialIcons name="assignment" size={20} color={COLORS.primary} />
        <Text style={styles.category}>{item.category}</Text>
      </View>
      <Text style={styles.detail}>📍 الموقع: {item.location}</Text>
      <Text style={styles.detail}>💬 التفاصيل: {item.details}</Text>
      <Text style={styles.status}>🕒 الحالة: {item.status}</Text>

      {selectedId === item._id ? (
        <View style={{ marginTop: 12 }}>
          <TextInput
            placeholder="اكتب ردك أو عرضك هنا"
            value={responseText}
            onChangeText={setResponseText}
            style={styles.input}
            multiline
            numberOfLines={3}
            placeholderTextColor={COLORS.lightText}
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.sendButton} onPress={submitResponse}>
            <Text style={styles.sendButtonText}>إرسال الرد</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.replyButton} onPress={() => setSelectedId(item._id)}>
          <Text style={styles.replyButtonText}>الرد على الطلب</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <FlatList
      style={{ padding: 16 }}
      data={requests}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      ListEmptyComponent={
        <Text style={styles.empty}>لا توجد طلبات معينة لك حالياً</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    fontFamily: "Cairo-Bold",
    color: COLORS.primary,
    marginLeft: 8,
  },
  detail: {
    fontSize: 14,
    fontFamily: "Cairo-Regular",
    marginTop: 4,
    color: COLORS.text,
  },
  status: {
    fontSize: 14,
    fontFamily: "Cairo-SemiBold",
    marginTop: 6,
    color: COLORS.accent,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontFamily: "Cairo-Regular",
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.lightText,
  },
  sendButton: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
  },
  replyButton: {
    marginTop: 12,
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  replyButtonText: {
    color: COLORS.primary,
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
  },
  empty: {
    textAlign: "center",
    fontFamily: "Cairo-Regular",
    color: COLORS.lightText,
    fontSize: 15,
    marginTop: 40,
  },
});
