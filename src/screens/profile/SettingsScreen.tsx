import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  I18nManager,
  Alert,
} from "react-native";
import { fetchUserProfile, updateUserProfileAPI } from "../../api/userApi";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const SettingsScreen = () => {
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [darkMode, setDarkMode] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
  const load = async () => {
    try {
      const user = await fetchUserProfile();
      if (user?.settings) {
        setLanguage(user.settings.language || "ar");
        setDarkMode(user.settings.theme === "dark");
      }
    } catch {
      Alert.alert("خطأ", "فشل تحميل إعدادات المستخدم");
    }
  };
  load();
}, []);


  const handleToggleDarkMode = async () => {
  const newVal = !darkMode;
  setDarkMode(newVal);

  await updateUserProfileAPI({
    theme: newVal ? "dark" : "light",
  });
};


const handleLanguageChange = async () => {
  const newLang = language === "ar" ? "en" : "ar";
  Alert.alert("⚠️ ستتم إعادة تشغيل التطبيق لتطبيق التغيير");
  setLanguage(newLang);

  await updateUserProfileAPI({
    language: newLang,
  });

  I18nManager.forceRTL(newLang === "ar");
  // يمكنك إعادة تشغيل التطبيق إذا أردت باستخدام expo-updates أو react-native-restart
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>الإعدادات العامة</Text>

      <SettingRow
        label="الوضع الداكن"
        icon="moon"
        value={darkMode}
        onToggle={handleToggleDarkMode}
      />

      <SettingRow
        label={`اللغة: ${language === "ar" ? "العربية" : "English"}`}
        icon="language"
        isLink
        onPress={handleLanguageChange}
      />
    </View>
  );
};

const SettingRow = ({
  label,
  icon,
  value,
  onToggle,
  isLink,
  onPress,
}: {
  label: string;
  icon: string;
  value?: boolean;
  onToggle?: () => void;
  isLink?: boolean;
  onPress?: () => void;
}) => (
  <View style={styles.settingRow}>
    <Ionicons name={icon as any} size={20} color="#555" />
    <Text style={styles.label}>{label}</Text>
    {isLink ? (
      <TouchableOpacity onPress={onPress}>
        <Ionicons name="chevron-forward" size={20} color="#888" />
      </TouchableOpacity>
    ) : (
      <Switch value={value} onValueChange={onToggle} />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 20,
    fontFamily: "Cairo-Bold",
    marginBottom: 20,
    color: "#333",
  },
  settingRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: "#444",
    flex: 1,
    marginHorizontal: 12,
    textAlign: "right",
  },
});

export default SettingsScreen;
