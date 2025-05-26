import axiosAuth from "utils/axiosAuth";
const BASE_URL = "http://192.168.1.105:3000/market";

export const fetchCategories = async () => {
  const res = await axiosAuth.get(`${BASE_URL}/categories`);
  return res.data;
};
