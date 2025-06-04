import axiosInstance from "utils/api/axiosInstance";

export const fetchCategories = async () => {
  const res = await axiosInstance.get("/haraj/categories");
  return res.data;
};
