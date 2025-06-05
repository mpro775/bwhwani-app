import axiosInstance from "../utils/api/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("firebase-idToken");
  return { Authorization: `Bearer ${token}` };
};

export const fetchAllDonors = async (filters?: {
  governorate?: string;
  bloodType?: string;
}) => {
  const params = new URLSearchParams();

  if (filters?.governorate && filters.governorate !== "الكل") {
    params.append("governorate", filters.governorate);
  }
  if (filters?.bloodType && filters.bloodType !== "الكل") {
    params.append("bloodType", filters.bloodType);
  }

  // لم يعد هنا حاجة لإضافة هيدر Authorization
  const res = await axiosInstance.get(
    `/blood/donors?${params.toString()}`
  );
  return res.data;
};
export const fetchBloodMessages = async (requestId: string) => {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.get(`/blood/messages/${requestId}`, {
    headers,
  });
  return res.data;
};

export const sendBloodMessage = async (requestId: string, text: string) => {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.post(
    "/blood/messages",
    { requestId, text },
    { headers }
  );
  return res.data;
};
export const deleteBloodData = async () => {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.patch(
    "/users/blood-settings",
    {
      bloodType: null,
      isAvailableToDonate: false,
      // أو أي حقل آخر متعلق بالمتبرع
    },
    { headers }
  );
  return res.data;
};
