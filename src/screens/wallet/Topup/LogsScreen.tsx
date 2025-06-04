// screens/LogsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function LogsScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
const handleShare = async (item: any) => {
  const content = `
  العملية: ${item.product}
  الرقم: ${item.recipient}
  التاريخ: ${new Date(item.createdAt).toLocaleString()}
  الحالة: ${item.status}
  `;
  const path = FileSystem.documentDirectory + "receipt.txt";
  await FileSystem.writeAsStringAsync(path, content);
  await Sharing.shareAsync(path);
};
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const query = filterType === "all" ? "" : `?type=${filterType}`;
        const res = await axios.get(`http://<your-ip>:3000/api/logs${query}`);
        setLogs(res.data);
      } catch (err) {
        console.log("Error:", err);
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
        <Text style={styles.title}>🔧 الخدمة: {item.product}</Text>
        <Text style={styles.text}>📞 الرقم / الحساب: {item.recipient}</Text>
        <Text style={styles.text}>🎯 النوع: {item.type}</Text>
        <Text style={styles.text}>📦 الحالة: {item.status}</Text>
        <Text style={styles.text}>💵 القيمة: {response.amount || "غير متوفر"} {response.currency || ""}</Text>
        <Text style={styles.text}>🔄 المعاملة: {response.transaction_id || "غير متوفر"}</Text>
        <Text style={styles.text}>🧾 الرسالة: {response.message || "بدون"}</Text>
        <Text style={styles.text}>🕒 التاريخ: {new Date(item.createdAt).toLocaleString()}</Text>
        <Text style={styles.textMuted}>ID داخلي: {item.externalId}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>فلترة حسب النوع</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={filterType} onValueChange={(v) => setFilterType(v)}>
          <Picker.Item label="الكل" value="all" />
          <Picker.Item label="شحن الرصيد" value="topup" />
          <Picker.Item label="تسديد الفواتير" value="bill" />
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={logs}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFF8F0",
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#3E2723",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  item: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#D84315",
  },
  text: {
    fontSize: 14,
    color: "#4E342E",
    marginBottom: 3,
  },
  textMuted: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
});
