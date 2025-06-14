import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "utils/api/axiosInstance";
import { refreshIdToken } from "./authService";

export const getAuthHeaders = async () => {
  try {
    const token = await refreshIdToken(); // ← يجدد التوكن تلقائيًا إن انتهت
    return { Authorization: `Bearer ${token}` };
  } catch (error) {
    console.warn("⚠️ فشل في جلب التوكن:", error);
    return {};
  }
};

// ✅ 1. الحصول على بيانات المستخدم
export const fetchUserProfile = async () => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/users/me`, { headers });

  const user = response.data;
  console.log("User Profile:", response.data);

  return {
    ...user,
    id: user.id || user._id,
  };
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
  const response = await axiosInstance.patch(`/users/profile`, data, {
    headers,
  });
  return response.data;
};

// ✅ 3. إضافة عنوان للمستخدم
export const addUserAddress = async (address: any) => {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.post(`/users/address`, address, { headers });
  return res.data;
};

// ✅ 4. حذف عنوان
export const deleteUserAddress = async (addressId: string) => {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.delete(`/users/address/${addressId}`, {
    headers,
  });
  return res.data;
};

// ✅ 5. تحديد عنوان افتراضي
export const setDefaultUserAddress = async (address: any) => {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.patch(`/users/default-address`, address, {
    headers,
  });
  return res.data;
};

// ✅ 6. تسجيل الخروج
export const logoutUser = async () => {
  await AsyncStorage.removeItem("firebase-idToken");
  await AsyncStorage.removeItem("firebase-user");
};

export const updateUserAvatar = async (imageUrl: string) => {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.patch(
    `/users/avatar`,
    { image: imageUrl }, // ✅ تطابق مع req.body.image
    { headers }
  );
  return res.data;
};

// ✅ 8. تحديث بيانات بنك الدم
export const updateBloodSettings = async (bloodData: any) => {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.patch(`/users/blood-settings`, bloodData, {
    headers,
  });
  return res.data;
};

export const fetchServerUserProfile = async () => {
  // idToken موجود مسبقًا في AsyncStorage (تمّت حفظه أثناء loginWithEmail)
  const idToken = await AsyncStorage.getItem("firebase-idToken");
  if (!idToken) throw new Error("Missing token");
  const res = await axiosInstance.get("/users/me", { // مثال: /api/v1/users/me
    headers: { Authorization: `Bearer ${idToken}` },
  });
  return res.data.user; // لنفترض الاستجابة { user: { _id, fullName, ... } }
};