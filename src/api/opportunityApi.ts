import axiosInstance from "utils/api/axiosInstance";

// services/opportunityApi.ts
;

// 📌 جلب جميع الفرص
export const fetchOpportunities = async () => {
  const res = await axiosInstance.get("/opportunities");
  return res.data;
};

// 📌 إنشاء فرصة جديدة
export const createOpportunity = async (data: any) => {
  const res = await axiosInstance.post("/opportunities", data);
  return res.data;
};

// 📌 تعديل فرصة
export const updateOpportunity = async (id: string, data: any) => {
  const res = await axiosInstance.patch(`/opportunities/${id}`, data);
  return res.data;
};

// 📌 حذف فرصة
export const deleteOpportunity = async (id: string) => {
  const res = await axiosInstance.delete(`/opportunities/${id}`);
  return res.data;
};

// 📌 تفاصيل فرصة معينة
export const getOpportunityById = async (id: string) => {
  const res = await axiosInstance.get(`/opportunities/${id}`);
  return res.data;
};
