import axiosInstance from "utils/api/axiosInstance";

// إنشاء طلب حجز
export const requestBooking = async (data: any) => {
  const res = await axiosInstance.post("/booking/request", data);
  return res.data;
};

// تحديث حالة الحجز (مثلاً: confirmed, cancelled, completed)
export const updateBookingStatus = async (bookingId: string, status: string) => {
  const res = await axiosInstance.patch(`/booking/${bookingId}/status`, { status });
  return res.data;
};

// جلب الحجوزات الخاصة بالمستخدم أو المستقل
export const fetchBookings = async () => {
  const res = await axiosInstance.get("/booking");
  return res.data;
};
