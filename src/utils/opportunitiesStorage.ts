// utils/opportunitiesStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeOpportunities = async (data: any[]) => {
  await AsyncStorage.setItem("opportunities", JSON.stringify(data));
};

export const getStoredOpportunities = async (): Promise<any[]> => {
  const data = await AsyncStorage.getItem("opportunities");
  return data ? JSON.parse(data) : [];
};

export const storeFreelancers = async (data: any[]) => {
  await AsyncStorage.setItem("freelancers", JSON.stringify(data));
};

export const getStoredFreelancers = async (): Promise<any[]> => {
  const data = await AsyncStorage.getItem("freelancers");
  return data ? JSON.parse(data) : [];
};
