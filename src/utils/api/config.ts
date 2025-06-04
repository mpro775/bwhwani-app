import Constants from "expo-constants";

// روابط API
const LOCAL_API = "http://192.168.1.109:3000/api/v1";
const PRODUCTION_API = "https://bthwani-backend.onrender.com/api/v1";

// قراءة hostUri بشكل آمن (يدعم جميع أنواع الـ manifests)
const hostUri =
  Constants.expoConfig?.hostUri ||
  Constants.manifest2?.extra?.expoClient?.hostUri ||
  "";

// نتحقق إذا كنا في بيئة محلية
const isLocal =
  __DEV__ &&
  (hostUri.startsWith("192.168.") ||
    hostUri.includes("localhost") ||
    hostUri.includes("127.0.0.1"));

// التصدير النهائي
export const API_URL = PRODUCTION_API;
