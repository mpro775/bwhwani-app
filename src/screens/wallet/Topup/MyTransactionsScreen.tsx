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
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import axiosInstance from "utils/api/axiosInstance";
import COLORS from "constants/colors";

export default function MyTransactionsScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("topup/my-logs");
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
        <body style="font-family: Cairo, sans-serif; padding: 20px; background-color: #fff;">
          <h2 style="color: ${COLORS.primary};">إيصال العملية</h2>
          <p><strong>الخدمة:</strong> ${item.product}</p>
          <p><strong>المرسل إليه:</strong> ${item.recipient}</p>
          <p><strong>الحالة:</strong> ${item.status}</p>
          <p><strong>التاريخ:</strong> ${new Date(item.createdAt).toLocaleString()}</p>
          <p><strong>المعرف:</strong> ${item.externalId}</p>
        </body>
      </html>
    `;
    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("خطأ", "تعذر إنشاء أو مشاركة ملف PDF");
    }
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
      Alert.alert("خطأ في المشاركة", "تعذر إرسال بيانات العملية");
    }
  };

  const handleCopy = async (item: any) => {
    await Clipboard.setStringAsync(formatLog(item));
    Alert.alert("✔️ تم النسخ", "تم نسخ بيانات العملية إلى الحافظة");
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Text style={styles.title}>🔧 {item.product}</Text>
      <Text style={styles.fieldText}>📞 إلى: {item.recipient}</Text>
      <Text style={styles.fieldText}>📦 الحالة: {item.status}</Text>
      <Text style={styles.fieldText}>
        📅 {new Date(item.createdAt).toLocaleString()}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => handleShare(item)}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>🔗 مشاركة</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleCopy(item)}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>📋 نسخ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleGeneratePDF(item)}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>🖨️ PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📑 العمليات الخاصة بي</Text>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={logs}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={
            logs.length === 0 && styles.emptyContainer
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>لا توجد عمليات حتى الآن</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: 22,
    fontFamily: "Cairo-Regular",
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 15,
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 18,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontFamily: "Cairo-Regular",
    fontWeight: "bold",
    color: COLORS.accent,
    marginBottom: 8,
  },
  fieldText: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
    marginBottom: 4,
  },
  actions: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "flex-end",
  },
  actionButton: {
    backgroundColor: COLORS.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  actionText: {
    fontSize: 14,
    fontFamily: "Cairo-Regular",
    color: COLORS.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.lightText,
  },
});
