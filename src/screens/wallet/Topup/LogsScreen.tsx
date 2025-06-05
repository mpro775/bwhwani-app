// screens/LogsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import axiosInstance from "utils/api/axiosInstance";
import COLORS from "constants/colors";

export default function LogsScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

  // دالة مشاركة سجل معين عبر إنشاء ملف نصي ومشاركته
  const handleShare = async (item: any) => {
    const content = `
العملية: ${item.product}
الرقم: ${item.recipient}
التاريخ: ${new Date(item.createdAt).toLocaleString()}
الحالة: ${item.status}
`;
    try {
      const path = FileSystem.documentDirectory + "receipt.txt";
      await FileSystem.writeAsStringAsync(path, content);
      await Sharing.shareAsync(path);
    } catch (err) {
      console.log("Error sharing:", err);
    }
  };

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const query = filterType === "all" ? "" : `?type=${filterType}`;
        const res = await axiosInstance.get(`topup/logs${query}`);
        setLogs(res.data);
      } catch (err) {
        console.log("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [filterType]);

  const renderItem = ({ item }: { item: any }) => {
    const response = item.response || {};
    return (
      <View style={styles.item}>
        <View style={styles.itemHeader}>
          <Text style={styles.title}>🔧 الخدمة: {item.product}</Text>
          <TouchableOpacity
            onPress={() => handleShare(item)}
            style={styles.shareButton}
          >
            <Text style={styles.shareText}>مشاركة</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.text}>📞 الرقم / الحساب: {item.recipient}</Text>
        <Text style={styles.text}>🎯 النوع: {item.type}</Text>
        <Text style={styles.text}>📦 الحالة: {item.status}</Text>
        <Text style={styles.text}>
          💵 القيمة: {response.amount || "غير متوفر"} {response.currency || ""}
        </Text>
        <Text style={styles.text}>
          🔄 المعاملة: {response.transaction_id || "غير متوفر"}
        </Text>
        <Text style={styles.text}>
          🧾 الرسالة: {response.message || "بدون"}
        </Text>
        <Text style={styles.text}>🕒 التاريخ: {new Date(item.createdAt).toLocaleString()}</Text>
        <Text style={styles.textMuted}>ID داخلي: {item.externalId}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* فلترة حسب النوع */}
      <Text style={styles.label}>فلترة حسب النوع</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={filterType}
          onValueChange={(v) => setFilterType(v)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="الكل" value="all" />
          <Picker.Item label="شحن الرصيد" value="topup" />
          <Picker.Item label="تسديد الفواتير" value="bill" />
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 40 }}
          size="large"
          color={COLORS.primary}
        />
      ) : (
        <FlatList
          data={logs}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>لا توجد سجلات حتى الآن</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width - 40; // عرض البطاقة مع الحواف

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background, // استخدم لون الخلفية الرئيسي
  },
  label: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    fontWeight: "bold",
    marginBottom: 5,
    color: COLORS.text,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: COLORS.lightText,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 40,
    color: COLORS.text,
  },
  pickerItem: {
    fontFamily: "Cairo-Regular",
    fontSize: 16,
  },
  item: {
    width: ITEM_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: "Cairo-Regular",
    fontWeight: "bold",
    color: COLORS.primary,
  },
  shareButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  shareText: {
    fontSize: 14,
    fontFamily: "Cairo-Regular",
    color: "#fff",
  },
  text: {
    fontSize: 15,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
    marginBottom: 4,
  },
  textMuted: {
    fontSize: 13,
    fontFamily: "Cairo-Regular",
    color: COLORS.lightText,
    marginTop: 6,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.lightText,
    textAlign: "center",
    marginTop: 50,
  },
});
