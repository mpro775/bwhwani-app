import axiosInstance from "./axiosInstance";

export const refreshIdToken = async () => {
  const res = await axiosInstance.get("/auth/refresh");
  return res.data.token;
};
