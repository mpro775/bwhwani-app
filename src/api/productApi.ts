
import { API_BASE_URL } from "config/config";

import axiosAuth from "utils/axiosAuth";

const BASE_URL = `${API_BASE_URL}/market`;

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

  if (category && category !== "all") params.category = category;
  if (hasOffer) params.hasOffer = true;
  if (search) params.search = search;

  const res = await axiosAuth.get(`${BASE_URL}/products`, { params });
  return res.data;
};

export const fetchLatestProducts = async () => {
  const res = await axiosAuth.get(`${BASE_URL}/products`, {
    params: {
      limit: 10, // 👈 فقط حد أقصى
      page: 1,
    },
  });
  return res.data;
};


export const fetchSpecialOffers = async () => {
const res = await axiosAuth.get(`${BASE_URL}/products`, {
    params: { hasOffer: true, limit: 10 },
  });
  return res.data;
};

