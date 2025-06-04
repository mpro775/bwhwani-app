import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import axiosInstance from "utils/api/axiosInstance";

// ألوان متطورة مع تدرجات
const COLORS = {
  primary: "#FF5722",
  primaryLight: "#FFCCBC",
  primaryDark: "#E64A19",
  text: "#3E2723",
  textLight: "#5D4037",
  lightGray: "#F5F5F5",
  white: "#FFFFFF",
  error: "#D32F2F",
  success: "#388E3C",
  background: "#FAFAFA",
};

// ظلال متدرجة لتحسين العمق البصري
const SHADOWS = {
  light: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
};

type ReservedPeriod = {
  id: string;
  start: Date;
  end: Date;
};

export default function ManageBookingAvailabilityScreen() {
  const route = useRoute();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { bookingId } = route.params as { bookingId: string };
  const [reserved, setReserved] = useState<ReservedPeriod[]>([]);
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

const handleAddPeriod = async () => {
  if (!start || !end) {
    Alert.alert("خطأ", "يرجى تحديد وقت البدء والانتهاء");
    return;
  }

  try {
    const res = await axiosInstance.post(`/booking-services/${bookingId}/unavailable`, {
      start,
      end,
    });
    fetchUnavailablePeriods(); // لإعادة التحميل
    setStart(null);
    setEnd(null);
  } catch (err) {
    Alert.alert("خطأ", "تعذر إضافة الفترة. حاول مرة أخرى");
    console.error(err);
  }
};


  useEffect(() => {
  fetchUnavailablePeriods();
}, []);

const fetchUnavailablePeriods = async () => {
  try {
    const res = await axiosInstance.get(`/booking-services/${bookingId}/unavailable`);
    setReserved(res.data);
  } catch (err) {
    console.error("خطأ في تحميل الفترات:", err);
  }
};

const handleDelete = async (id: string) => {
  try {
    await axiosInstance.delete(`/booking-services/${bookingId}/unavailable/${id}`);
    fetchUnavailablePeriods();
  } catch (err) {
    Alert.alert("خطأ", "تعذر الحذف. حاول لاحقاً");
    console.error(err);
  }
};

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ar-SA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>إدارة الفترات المحجوزة</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* بطاقة إضافة فترة جديدة */}
        <View style={[styles.card, SHADOWS.medium]}>
          <Text style={styles.sectionTitle}>إضافة فترة جديدة</Text>

          <View style={styles.row}>
            {/* وقت البدء */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>وقت البدء</Text>
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                style={styles.pickerBtn}
              >
                <Ionicons
                  name="calendar"
                  size={20}
                  color={COLORS.primaryDark}
                />
                <Text style={styles.pickerText}>
                  {start
                    ? `${formatDate(start)} - ${formatTime(start)}`
                    : "اختر وقت البدء"}
                </Text>
              </TouchableOpacity>
              {showStartPicker && (
  <DateTimePicker
    value={start || new Date()}
    mode="datetime"
    display="default"
    onChange={(event, selectedDate) => {
      setShowStartPicker(false); // ← لاحظ false بدلاً من Platform.OS === 'ios'
      if (selectedDate) setStart(selectedDate);
    }}
  />
)}
            </View>

            {/* وقت الانتهاء */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>وقت الانتهاء</Text>
              <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                style={styles.pickerBtn}
              >
                <Ionicons
                  name="calendar"
                  size={20}
                  color={COLORS.primaryDark}
                />
                <Text style={styles.pickerText}>
                  {end
                    ? `${formatDate(end)} - ${formatTime(end)}`
                    : "اختر وقت الانتهاء"}
                </Text>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={end || new Date()}
                  mode="datetime"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowEndPicker(Platform.OS === "ios");
                    if (selectedDate) {
                      setEnd(selectedDate);
                    }
                  }}
                />
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.addBtn, SHADOWS.light]}
            onPress={handleAddPeriod}
          >
            <Ionicons name="add-circle" size={22} color={COLORS.white} />
            <Text style={styles.addBtnText}>إضافة الفترة</Text>
          </TouchableOpacity>
        </View>

        {/* قائمة الفترات المحجوزة */}
        <View style={[styles.card, SHADOWS.medium, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>الفترات المحجوزة الحالية</Text>
          
          {reserved.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={48} color={COLORS.primaryLight} />
              <Text style={styles.emptyText}>لا توجد فترات محجوزة</Text>
            </View>
          ) : (
            <View style={styles.list}>
              {reserved.map((item) => (
                <View key={item.id} style={styles.periodItem}>
                  <View style={styles.periodInfo}>
                    <View style={styles.timeRow}>
                      <Ionicons
                        name="time"
                        size={16}
                        color={COLORS.primary}
                        style={styles.timeIcon}
                      />
                      <Text style={styles.periodText}>
                        {formatTime(item.start)} - {formatTime(item.end)}
                      </Text>
                    </View>
                    <Text style={styles.periodDate}>{formatDate(item.start)}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={styles.deleteBtn}
                  >
                    <Ionicons name="trash-bin" size={20} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    ...SHADOWS.medium,
  },
  backButton: {
    marginLeft: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
    flex: 1,
    textAlign: "center",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 6,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
    textAlign: "right",
  },
  pickerBtn: {
    backgroundColor: COLORS.lightGray,
    padding: 14,
    borderRadius: 8,
    flexDirection: "row-reverse",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  pickerText: {
    marginRight: 8,
    color: COLORS.text,
    fontSize: 14,
    flex: 1,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  addBtnText: {
    color: COLORS.white,
    marginRight: 8,
    fontWeight: "bold",
    fontSize: 16,
  },
  list: {
    marginTop: 8,
  },
  periodItem: {
    backgroundColor: COLORS.lightGray,
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  periodInfo: {
    flex: 1,
  },
  timeRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 4,
  },
  timeIcon: {
    marginLeft: 8,
  },
  periodText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "500",
  },
  periodDate: {
    color: COLORS.textLight,
    fontSize: 13,
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 16,
    marginTop: 16,
  },
});