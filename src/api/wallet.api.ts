import axiosInstance from "utils/api/axiosInstance";

export const getWallet = async () => {
  const res = await axiosInstance.get('/wallet');
  return res.data;
};

export const chargeViaKuraimi = async ({ amount, SCustID, PINPASS }: { amount: number; SCustID: string; PINPASS: string }) => {
  const res = await axiosInstance.post('/wallet/charge/kuraimi', { amount, SCustID, PINPASS });
  return res.data;
};
