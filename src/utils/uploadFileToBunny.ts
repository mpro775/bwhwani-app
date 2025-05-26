import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://192.168.1.105:3000";

export async function uploadFileToBunny(blob: Blob): Promise<string> {
  const token = await AsyncStorage.getItem("firebase-token");

  if (!token) throw new Error("🚫 لا يوجد توكن في AsyncStorage");

  const filename = `${Date.now()}_profile.jpg`;

  // ✅ أرسل التوكن في الهيدر
  const { data } = await axios.post(
    `${API_URL}/media/sign-upload`,
    { filename },
    {
      headers: {
        Authorization: `Bearer ${token}`, // ← هذا ضروري جداً
      },
    }
  );

  // باقي الكود...
  const response = await fetch(data.uploadUrl, {
    method: "PUT",
    headers: data.headers,
    body: blob,
  });

  if (!response.ok) {
    throw new Error(`فشل رفع الملف إلى Bunny: ${response.status}`);
  }

  return `https://bthwani.b-cdn.net/${filename}`;
}
