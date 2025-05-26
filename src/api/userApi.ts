import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosAuth from "utils/axiosAuth";

const API_URL = "http://192.168.1.105:3000";

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("firebase-token");
  return { Authorization: `Bearer ${token}` };
};

// ✅ 1. الحصول على بيانات المستخدم
export const fetchUserProfile = async () => {
  const headers = await getAuthHeaders();
  const response = await axiosAuth.get(`${API_URL}/users/me`, { headers });
  return response.data;
};

// ✅ 2. تحديث بيانات المستخدم (الاسم، الصورة، الهاتف...)
// الصورة يتم رفعها من الفرونت إلى Bunny، ثم يرسل الرابط هنا
type UpdateUserProfilePayload = {
  fullName?: string;
  phone?: string;
  profileImage?: string; // ← رابط مباشر فقط
};

export const updateUserProfileAPI = async (data: UpdateUserProfilePayload) => {
  const headers = await getAuthHeaders();
  const response = await axiosAuth.patch(`${API_URL}/users/profile`, data, { headers });
  return response.data;
};

// ✅ 3. إضافة عنوان للمستخدم
export const addUserAddress = async (address: any) => {
  const headers = await getAuthHeaders();
  const res = await axiosAuth.post(`${API_URL}/users/address`, address, { headers });
  return res.data;
};

// ✅ 4. حذف عنوان
export const deleteUserAddress = async (addressId: string) => {
  const headers = await getAuthHeaders();
  const res = await axiosAuth.delete(`${API_URL}/users/address/${addressId}`, { headers });
  return res.data;
};

// ✅ 5. تحديد عنوان افتراضي
export const setDefaultUserAddress = async (address: any) => {
  const headers = await getAuthHeaders();
  const res = await axiosAuth.patch(`${API_URL}/users/default-address`, address, { headers });
  return res.data;
};

// ✅ 6. تسجيل الخروج
export const logoutUser = async () => {
  await AsyncStorage.removeItem("firebase-token");
  await AsyncStorage.removeItem("firebase-user");
};

export const updateUserAvatar = async (imageUrl: string) => {
  const headers = await getAuthHeaders();
  const res = await axiosAuth.patch(
    `${API_URL}/users/avatar`,
    { image: imageUrl }, // ✅ تطابق مع req.body.image
    { headers }
  );
  return res.data;
};


// ✅ 8. تحديث بيانات بنك الدم
export const updateBloodSettings = async (bloodData: any) => {
  const headers = await getAuthHeaders();
  const res = await axiosAuth.patch(`${API_URL}/users/blood-settings`, bloodData, { headers });
  return res.data;
};
