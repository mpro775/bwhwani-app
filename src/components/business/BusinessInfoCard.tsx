import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MAIN = "#D84315";
const SECONDARY = "#8B4B47";
const LIGHT = "#FFF7F4";
const GRAY = "#616161";
const DARK_GRAY = "#3A3A3A";

const formatTime12 = (time24: string) => {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const period = h < 12 ? "ص" : "م";
  h = h % 12 || 12;
  return `${h}:${mStr} ${period}`;
};

const ARABIC_DAYS: Record<string, string> = {
  sunday: "الأحد",
  monday: "الاثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
  friday: "الجمعة",
  saturday: "السبت",
};

interface ScheduleItem {
  day: string;
  open: boolean;
  from: string;
  to: string;
}

interface Props {
  business: {
    name: string;
    nameAr: string;
    logo: string;
    rating: number;
    distance: string;
    time: string;
    isOpen: boolean;
    categories?: string[];
    schedule?: ScheduleItem[];
  };
}

export default function BusinessInfoCard({ business }: Props) {
  const [showSchedule, setShowSchedule] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Image source={{ uri: business.logo }} style={styles.logo} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{business.name}</Text>
          <Text style={styles.nameAr}>{business.nameAr}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: business.isOpen ? "#E0F2F1" : "#FFEBEE" },
          ]}
        >
          <Ionicons
            name={business.isOpen ? "checkmark-circle" : "close-circle"}
            size={16}
            color={business.isOpen ? MAIN : "#C62828"}
            style={{ marginLeft: 3 }}
          />
          <Text
            style={[
              styles.statusText,
              { color: business.isOpen ? MAIN : "#C62828" },
            ]}
          >
            {business.isOpen ? "مفتوح" : "مغلق"}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="star" size={15} color="#FFD600" />
          <Text style={styles.metaText}>
            {typeof business.rating === "number"
              ? business.rating.toFixed(1)
              : "—"}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={15} color={GRAY} />
          <Text style={styles.metaText}>{business.time}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="navigate-outline" size={15} color={GRAY} />
          <Text style={styles.metaText}>{business.distance}</Text>
        </View>
      </View>

      {business.categories?.length ? (
        <View style={styles.categoriesWrap}>
          {business.categories.map((c) => (
            <View key={c} style={styles.categoryPill}>
              <Text style={styles.categoryText}>{c}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.showScheduleButton}
        onPress={() => setShowSchedule(true)}
      >
        <Ionicons name="calendar" size={17} color={SECONDARY} />
        <Text style={styles.showScheduleText}>أوقات الدوام</Text>
      </TouchableOpacity>

      {/* مودال الجدول */}
      <Modal
        visible={showSchedule}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSchedule(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>أوقات الدوام</Text>
            <ScrollView style={{ maxHeight: 260 }}>
              {business.schedule?.map((s, i) => (
                <View key={i} style={styles.modalRow}>
                  <Text style={styles.modalDay}>
                    {ARABIC_DAYS[s.day.toLowerCase()]}
                  </Text>
                  <Text style={styles.modalTime}>
                    {s.open
                      ? `${formatTime12(s.from)} - ${formatTime12(s.to)}`
                      : "مغلق"}
                  </Text>
                </View>
              ))}
              {!business.schedule?.length && (
                <Text style={styles.modalEmpty}>لا توجد بيانات</Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowSchedule(false)}
            >
              <Text style={styles.modalCloseText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginTop: 0,
    borderRadius: 18,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F5F5F5",
  },
  topRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: "#F5F5F5",
    marginLeft: 10,
  },
  headerText: {
    flex: 1,
    marginHorizontal: 10,
  },
  name: {
    fontSize: 18,
    fontFamily: "Cairo-SemiBold",
    color: DARK_GRAY,
    textAlign: "right",
    letterSpacing: 0.2,
  },
  nameAr: {
    fontSize: 15,
    fontFamily: "Cairo-Regular",
    color: "#A1887F",
    textAlign: "right",
    marginTop: 3,
  },
  statusBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 9,
    alignSelf: "flex-start",
    marginLeft: 4,
  },
  statusText: {
    fontSize: 13,
    fontFamily: "Cairo-SemiBold",
    marginLeft: 3,
  },
  metaRow: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 12,
    gap: 20,
  },
  metaItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginRight: 15,
  },
  metaText: {
    marginRight: 5,
    fontSize: 13.5,
    fontFamily: "Cairo-Medium",
    color: DARK_GRAY,
  },
  categoriesWrap: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    marginBottom: 15,
    gap: 8,
  },
  categoryPill: {
    backgroundColor: LIGHT,
    borderColor: "#FFEDE7",
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  categoryText: {
    fontSize: 11.5,
    fontFamily: "Cairo-SemiBold",
    color: MAIN,
  },
  showScheduleButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#E6D0CB",
    backgroundColor: "#FFF",
    marginTop: 4,
  },
  showScheduleText: {
    fontSize: 14,
    fontFamily: "Cairo-SemiBold",
    color: SECONDARY,
    marginRight: 8,
  },
  // مودال
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  modalBox: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 20,
    width: 330,
    maxWidth: "96%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: "Cairo-Bold",
    textAlign: "center",
    marginBottom: 12,
    color: MAIN,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalDay: {
    fontSize: 14,
    fontFamily: "Cairo-SemiBold",
    color: DARK_GRAY,
  },
  modalTime: {
    fontSize: 14,
    fontFamily: "Cairo-Medium",
    color: MAIN,
  },
  modalEmpty: {
    textAlign: "center",
    color: "#888",
    marginTop: 16,
    fontFamily: "Cairo-Regular",
    fontSize: 14,
  },
  modalCloseBtn: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 8,
    backgroundColor: MAIN,
    marginTop: 10,
  },
  modalCloseText: {
    color: "#FFF",
    fontSize: 15,
    fontFamily: "Cairo-SemiBold",
    textAlign: "center",
  },
});