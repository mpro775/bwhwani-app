import axiosInstance from "utils/api/axiosInstance";

export const fetchCategories = async () => {
  const res = await axiosInstance.get("/market/categories");
  return res.data;
};
