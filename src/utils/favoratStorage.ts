import axios from 'axios';
import { FavoriteItem } from '../types/types';
import { getUserProfile } from '../storage/userStorage';
import axiosInstance from './api/axiosInstance';
import Toast from 'react-native-toast-message';

const API_URL = '/users/favorites';

export const getAllUserFavorites = async (): Promise<FavoriteItem[]> => {
  const user = await getUserProfile();
  if (!user?.id) return [];
  const res = await axiosInstance.get(`${API_URL}?userId=${user.id}`);
  return res.data;
};

export const addFavorite = async (item: FavoriteItem): Promise<boolean> => {
  try {
    await axiosInstance.post(API_URL, item);
Toast.show({
  type: "success",
  text1: "تمت الإضافة",
  text2: "تمت إضافة المنتج إلى المفضلة بنجاح 🎉",
  position: "bottom",
  visibilityTime: 2000,
});
    return true;
  } catch (error) {
    console.error('Add favorite error', error);
    return false;
  }
};

export const removeFavorite = async (item: FavoriteItem): Promise<boolean> => {
  try {
    await axiosInstance.delete(API_URL, { data: item });
    Toast.show({
  type: "error",
  text1: "تمت الحذف ",
  text2: "تم حذف المنتج من المفضلة بنجاح ",
  position: "bottom",
  visibilityTime: 2000,
});
    return true;
  } catch (error) {
    console.error('Remove favorite error', error);
    return false;
  }
};

export const isFavorite = async (
  itemId: string,
  itemType: FavoriteItem['itemType']
): Promise<boolean> => {
  const user = await getUserProfile();
  if (!user?.id) return false;

  const all = await getAllUserFavorites();
  return all.some((f) => f.itemId === itemId && f.itemType === itemType);
};

export const getFavoritesByType = async (
  type: FavoriteItem['itemType']
): Promise<FavoriteItem[]> => {
  const all = await getAllUserFavorites();
  return all.filter((f) => f.itemType === type);
};
