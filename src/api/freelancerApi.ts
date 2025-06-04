// services/freelancerApi.ts

import axiosInstance from "utils/api/axiosInstance";
import { API_URL } from "utils/api/config";

// 📌 تحديث ملف المستقل
export const updateFreelancerProfile = async (data: any) => {
  const res = await axiosInstance.patch("/freelancer-profile", data);
  return res.data;
};
export const getFreelancerDetails = async (freelancerId: string) => {
  const res = await axiosInstance.get(`${API_URL}/user/${freelancerId}/freelancer-profile`);
  return res.data;
};
// 📌 جلب المستقلين (إن توفر Endpoint لذلك)
export const fetchFreelancers = async () => {
  const res = await axiosInstance.get("/freelancers");
  return res.data;
};
