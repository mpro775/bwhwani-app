import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const COLORS = {
  primary: "#D84315", // أحمر ترابي
  secondary: "#5D4037", // بني داكن
  accent: "#8B4B47", // أحمر داكن
  background: "#FFF5F2", // خلفية فاتحة
  text: "#4E342E", // بني غامق للنصوص
};
interface Props {
  categories: string[];
  selected: string;
  onSelect: (tab: string) => void;
}

const BusinessTabs: React.FC<Props> = ({ categories, selected, onSelect }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      {categories.map((cat) => {
        const isActive = cat === selected;
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelect(cat)}
            activeOpacity={0.8}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            {isActive ? (
              <LinearGradient
                colors={["#FBE9E7", "#FFCCBC"]}
                style={styles.gradient}
                start={{ x: 1, y: 0 }} // بداية التدرج من اليمين
                end={{ x: 0, y: 0 }} // نهاية التدرج إلى اليسار
              >
                <Text style={styles.textActive}>{cat}</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.text}>{cat}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  scrollContent: {
    paddingRight: 16, // تعديل الحشو للاتجاه العربي
    gap: 8,
    flexDirection: "row-reverse", // عكس اتجاه الصف
  },
  tab: {
    borderRadius: 30,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabActive: {
    shadowColor: COLORS.accent,
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "flex-end", // محاذاة النص إلى اليمين
  },
  text: {
    fontSize: 15,
    fontFamily: "Cairo-SemiBold",
    color: "#666",
    paddingVertical: 12,
    paddingHorizontal: 24,
    textAlign: "right", // محاذاة النص إلى اليمين
  },
  textActive: {
    fontSize: 15,
    fontFamily: "Cairo-Bold",
    color: COLORS.accent,
    letterSpacing: 0.5,
    textAlign: "right", // محاذاة النص إلى اليمين
  },
});

export default BusinessTabs;
