import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";


const formatTime12 = (time24: string): string => {
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr;
  const period = h < 12 ? "ص" : "م";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${period}`;
};

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  text: "#4E342E",
  accent: "#8B4B47",
  success: "#2E7D32",
  error: "#C62828",
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
    logo: any;
    rating: number;
    distance: string;
    time: string;
    isOpen: boolean;
    categories?: string[];
        schedule?: ScheduleItem[];

  };
  
}
const ARABIC_DAYS: Record<string, string> = {
  sunday: "الأحد",
  monday: "الاثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
  friday: "الجمعة",
  saturday: "السبت",
};
const BusinessInfoCard: React.FC<Props> = ({ business }) => {
    const [showSchedule, setShowSchedule] = useState(false);

  return (
    <View style={styles.card}>
      {/* الطبقة الخلفية المميزة */}
      <View style={styles.cardBackground} />

      {/* المحتوى الرئيسي */}
      <View style={styles.content}>
        {/* الصف العلوي: الاسم والشعار */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.englishName}>{business.name}</Text>
            <Text style={styles.arabicName}>{business.nameAr}</Text>
            <Text style={styles.categories}>
              {business.categories?.join(" • ") || "بدون تصنيف"}
            </Text>
          </View>

<Image source={{ uri: business.logo }} style={styles.logoImage} />
        </View>

        {/* معلومات التقييم والوقت */}
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={16} color="#FFD700" />
<Text style={styles.metaText}>
  {Number.isFinite(business.rating)
    ? business.rating.toFixed(1)
    : "—"}{/* مثلا علامة بدل */}
</Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color={COLORS.text} />
            <Text style={styles.metaText}>{business.time}</Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="navigate-outline" size={16} color={COLORS.text} />
            <Text style={styles.metaText}>{business.distance}</Text>
          </View>
        </View>

        {/* حالة العمل وأوقات الدوام */}
        <View style={styles.footer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: business.isOpen ? "#E8F5E9" : "#FFEBEE" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: business.isOpen ? COLORS.success : COLORS.error },
              ]}
            >
              {business.isOpen ? "مفتوح الآن" : "مغلق"}
            </Text>
          </View>

          <TouchableOpacity           onPress={() => setShowSchedule(true)}
 style={styles.scheduleButton}>
            <Text style={styles.scheduleText}>عرض أوقات الدوام</Text>
            <Ionicons name="time" size={16} color={COLORS.accent} />
          </TouchableOpacity>
        </View>
          {/* المودال */}
       {/* مودال أوقات الدوام */}
      <Modal
        visible={showSchedule}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSchedule(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>أوقات الدوام</Text>
            <ScrollView>
              {business.schedule?.map((s, i) => (
                <View key={i} style={styles.modalRow}>
                  <Text style={styles.modalDay}>
                    {ARABIC_DAYS[s.day.toLowerCase()] || s.day}
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
              style={styles.modalClose}
              onPress={() => setShowSchedule(false)}
            >
              <Text style={styles.modalCloseText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: -40,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    overflow: "hidden",
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primary,
    opacity: 0.05,
  },
    scheduleButton: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
 modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Cairo-Bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalDay: { fontFamily: "Cairo-SemiBold", fontSize: 14 },
  modalTime: { fontFamily: "Cairo-Regular", fontSize: 14 },
  modalEmpty: { textAlign: "center", marginTop: 20, color: "#888" },
  modalClose: {
    marginTop: 16,
    alignSelf: "center",
    padding: 10,
  },
  modalCloseText: {
    fontFamily: "Cairo-Bold",
    color: COLORS.primary,
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginEnd: 16,
  },
  englishName: {
    fontFamily: "Cairo-Bold",
    fontSize: 20,
    color: COLORS.text,
    lineHeight: 28,
    textAlign: "right",
  },
  arabicName: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    textAlign: "right",
    marginTop: 4,
  },
  categories: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#888",
    textAlign: "right",
    marginTop: 8,
  },
  logoImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#EEE",
  },
  metaContainer: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    gap: 24,
    marginVertical: 16,
  },
  metaItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    color: COLORS.text,
  },
  footer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  statusBadge: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  statusText: {
    fontFamily: "Cairo-Bold",
    fontSize: 14,
  },

  scheduleText: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: COLORS.accent,
    textDecorationLine: "underline",
  },
});

export default BusinessInfoCard;
