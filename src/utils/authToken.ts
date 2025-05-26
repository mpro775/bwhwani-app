// utils/authToken.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("firebase-token");
};
