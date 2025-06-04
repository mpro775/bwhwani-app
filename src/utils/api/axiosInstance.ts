// axiosInstance.ts
import axios from "axios";
import { API_URL } from "./config";
import { refreshIdToken } from "api/authService";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const publicEndpoints = [
  "/market/sliders",
  "/market/categories",
  "/market/products?page", // الصفحة العامة فقط
  "/market/offers",

  // 🟢 أضف هذه المسارات العامة لقسم التوصيل:
  "/delivery/categories",
  "/delivery/banners",
  "/delivery/stores",
  "/delivery/products/daily-offers",
  "/delivery/products/nearby/new",
];


    const isPublic = publicEndpoints.some((path) =>
      config.url?.includes(path)
    );

    if (!isPublic) {
      const token = await refreshIdToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
