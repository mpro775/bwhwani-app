import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// تعريف الألوان
const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  text: "#4E342E",
  accent: "#8B4B47",
};

interface Props {
  message?: string;
}

const DeliveryWorkingHours: React.FC<Props> = ({
  message = "نستقبل طلباتكم من الساعة 8 صباحًا إلى الساعة 10 مساءً",
}) => {
  const isOpen = true; // يمكن استبدالها بمنطق التحقق من الوقت

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isOpen ? "#FFF3E0" : "#FFEBEE",
          borderLeftColor: isOpen ? COLORS.primary : COLORS.secondary,
        },
      ]}
      activeOpacity={0.9} // تأثير عند الضغط
    >
      <MaterialIcons
        name={isOpen ? "check-circle" : "cancel"}
        size={24}
        color={isOpen ? COLORS.accent : COLORS.secondary}
        style={styles.icon}
      />
<Text style={[styles.text, { color: isOpen ? COLORS.accent : COLORS.secondary }]}>
  {isOpen ? "🟢 نشطين الآن - " : "🔴 مغلق الآن - "}
  {message}
</Text>

    </TouchableOpacity>
  );
};

export default DeliveryWorkingHours;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 8, // زيادة سمك الحد الجانبي
    elevation: 3, // ظل للأندرويد
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontFamily: "Cairo-SemiBold",
    textAlign: "right",
    lineHeight: 22,
    flex: 1,
  },
});
