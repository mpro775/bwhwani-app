import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

// الترجمات المحلية
import ar from "./ar.json";
import en from "./en.json";

// المفتاح المستخدم للتخزين المحلي
const LANGUAGE_KEY = "user-language";

// تهيئة i18next
i18n
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: Localization.locale.startsWith("ar") ? "ar" : "en",
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    interpolation: {
      escapeValue: false,
    },
  });


// دالة لتغيير اللغة وحفظها
export const setAppLanguage = async (lang: "en" | "ar") => {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  await i18n.changeLanguage(lang);
};

// تحميل اللغة من AsyncStorage
export const loadStoredLanguage = async () => {
  const storedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
  if (storedLang) {
    await i18n.changeLanguage(storedLang);
  }
};

export default i18n;
