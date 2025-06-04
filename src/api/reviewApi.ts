import axiosInstance from "utils/api/axiosInstance";

// إرسال مراجعة جديدة
export const submitReview = async (freelancerId: string, data: { rating: number; comment?: string }) => {
  const res = await axiosInstance.post(`/review/${freelancerId}`, data);
  return res.data;
};

// جلب المراجعات لمستقل معين
export const getFreelancerReviews = async (freelancerId: string) => {
  const res = await axiosInstance.get(`/reviews/${freelancerId}`);
  return res.data;
};

// الإبلاغ عن مراجعة كاذبة
export const flagReview = async (reviewId: string) => {
  const res = await axiosInstance.patch(`/review/${reviewId}/flag`);
  return res.data;
};
