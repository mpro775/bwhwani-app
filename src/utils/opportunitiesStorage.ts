import axios from "axios";
import axiosInstance from "./api/axiosInstance";
import { API_URL } from "./api/config";

export const fetchOpportunities = async () => {
  const res = await axiosInstance.get(`${API_URL}/opportunities`);
  return res.data;
};

export const fetchFreelancers = async () => {
  const res = await axios.get(`${API_URL}/freelancers`);
  return res.data;
};

export const createOpportunity = async (data: any) => {
  return axios.post(`${API_URL}/opportunities`, data);
};

// api/freelancerApi.ts
export const updateFreelancerProfile = async (userId: string, data: any) => {
  return axios.put(`${API_URL}/user/${userId}/freelancer-profile`, data);
};