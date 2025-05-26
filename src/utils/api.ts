// utils/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.1.105:3000", // ✅ استبدل بـ IP جهازك
  timeout: 10000,
});
