// utils/interactionStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // ✅ هذا مهم جداً
import { RootStackParamList } from "../types/navigation";     // ✅ حسب مكان ملفك

type ScreenName = keyof RootStackParamList;

export type Interaction = {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  target: {
    screen: keyof RootStackParamList;
    params?: RootStackParamList[keyof RootStackParamList];
  };
};

const STORAGE_KEY = "recent_interactions";

export const storeRecentInteraction = async (interaction: Interaction) => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    let parsed: Interaction[] = existing ? JSON.parse(existing) : [];

    // إزالة التكرار إن وُجد
    parsed = parsed.filter((item) => item.id !== interaction.id);

    parsed.unshift(interaction);
    const limited = parsed.slice(0, 10); // احتفظ فقط بآخر 10
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error("Error saving interaction:", error);
  }
};

export const getRecentInteractions = async (): Promise<Interaction[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading interactions:", error);
    return [];
  }
};
