
import axiosInstance from "utils/api/axiosInstance";

const BASE_URL = `/haraj`;

interface FetchOptions {
  category?: string;
  hasOffer?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export const fetchProducts = async ({
  category,
  hasOffer,
  search,
  page = 1,
  limit = 10,
}: FetchOptions) => {
  const params: any = {
    page,
    limit,
  };

  // ✅ التصحيح هنا
  if (category && category !== "all") params.mainCategory = category;
  if (hasOffer) params.hasOffer = true;
  if (search) params.search = search;

  const res = await axiosInstance.get(`${BASE_URL}/products`, { params });
  return res.data;
};


export const fetchLatestProducts = async () => {
  const res = await axiosInstance.get(`${BASE_URL}/products`, {
    params: {
      limit: 10, // 👈 فقط حد أقصى
      page: 1,
    },
  });
  return res.data;
};


export const fetchSpecialOffers = async () => {
const res = await axiosInstance.get(`${BASE_URL}/products`, {
    params: { hasOffer: true, limit: 10 },
  });
  return res.data;
};

