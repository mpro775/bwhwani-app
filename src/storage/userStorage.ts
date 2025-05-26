import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile } from "../types/types";

const USER_KEY = "userProfile"; // ✅ توحيد المفتاح هنا

export const saveUserProfile = async (profile: UserProfile) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("❌ خطأ في حفظ الملف الشخصي:", error);
  }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const json = await AsyncStorage.getItem(USER_KEY);
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error("❌ Error loading profile:", error);
    return null;
  }
};

export const updateUserProfile = async (updates: Partial<UserProfile>) => {
  const current = await getUserProfile();
  if (current) {
    const updated = { ...current, ...updates };
    await saveUserProfile(updated);
    return updated;
  }
  return null;
};

export const clearUserProfile = async () => {
  await AsyncStorage.removeItem(USER_KEY);
};
