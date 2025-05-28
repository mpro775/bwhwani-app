import axiosInstance from "./axiosInstance";

export async function uploadFileToBunny(blob: Blob): Promise<string> {
  const filename = `${Date.now()}_profile.jpg`;

  const { data } = await axiosInstance.post("/media/sign-upload", {
    filename,
  });

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
