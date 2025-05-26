// src/utils/axiosAuth.ts
import axios from "axios";
import { Platform } from "react-native";
import { refreshIdToken } from "../api/authService";

// ضع هنا الـ IP الخاص بجهازك على شبكة الواي-فاي:
const DEV_IP = "192.168.1.105";
const PORT   = "3000";

const baseURL = `http://${DEV_IP}:${PORT}`;

const axiosAuth = axios.create({ baseURL });

axiosAuth.interceptors.request.use(
  async config => {
    const token = await refreshIdToken();
    if (config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

export default axiosAuth;
