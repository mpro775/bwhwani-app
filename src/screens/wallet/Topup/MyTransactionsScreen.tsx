// screens/MyTransactionsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import axiosInstance from "utils/api/axiosInstance";

export default function MyTransactionsScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem("firebase-token");
      try {
        const res = await axiosInstance.get("/my-logs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const handleGeneratePDF = async (item: any) => {
  const htmlContent = `
    <html dir="rtl" lang="ar">
      <body style="font-family: sans-serif; padding: 20px;">
        <h2>إيصال العملية</h2>
        <p><strong>الخدمة:</strong> ${item.product}</p>
        <p><strong>المرسل إليه:</strong> ${item.recipient}</p>
        <p><strong>الحالة:</strong> ${item.status}</p>
        <p><strong>التاريخ:</strong> ${new Date(item.createdAt).toLocaleString()}</p>
        <p><strong>المعرف:</strong> ${item.externalId}</p>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html: htmlContent });
  await Sharing.shareAsync(uri);
};


  const formatLog = (item: any) => `
🧾 إيصال العملية:
------------------------
📌 الخدمة: ${item.product}
👤 الحساب/الرقم: ${item.recipient}
💵 الحالة: ${item.status}
🕒 التاريخ: ${new Date(item.createdAt).toLocaleString()}
🔐 معرف داخلي: ${item.externalId}
`;

  const handleShare = async (item: any) => {
    try {
      await Share.share({ message: formatLog(item) });
    } catch (err) {
      Alert.alert("خطأ في المشاركة", "تعذر إرسال العملية");
    }
  };

  const handleCopy = async (item: any) => {
    await Clipboard.setStringAsync(formatLog(item));
    Alert.alert("✔️ تم النسخ", "تم نسخ بيانات العملية إلى الحافظة");
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Text style={styles.title}>🔧 {item.product}</Text>
      <Text>📞 إلى: {item.recipient}</Text>
      <Text>📦 الحالة: {item.status}</Text>
      <Text>📅 {new Date(item.createdAt).toLocaleString()}</Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleShare(item)} style={styles.actionButton}>
          <Text style={styles.actionText}>🔗 مشاركة</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleCopy(item)} style={styles.actionButton}>
          <Text style={styles.actionText}>📋 نسخ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📑 العمليات الخاصة بي</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={logs}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#FFF8F0" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: "#3E2723" },
  item: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#D84315" },
  actions: { flexDirection: "row", marginTop: 10 },
  actionButton: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  actionText: { fontSize: 14 },
});
