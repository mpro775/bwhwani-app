import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteItem } from '../types/types';
import { getUserProfile } from '../storage/userStorage';

const FAVORITES_KEY = 'user_favorites';

export const getFavorites = async (): Promise<FavoriteItem[]> => {
  const json = await AsyncStorage.getItem(FAVORITES_KEY);
  return json ? JSON.parse(json) : [];
};

export const addFavorite = async (item: FavoriteItem) => {
  const current = await getFavorites();
  const exists = current.find(
    (f) => f.id === item.id && f.type === item.type && f.userId === item.userId
  );
  if (!exists) {
    const updated = [...current, item];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  }
};

export const removeFavorite = async (item: FavoriteItem) => {
  const current = await getFavorites();
  const updated = current.filter(
    (f) =>
      !(
        f.id === item.id &&
        f.type === item.type &&
        f.userId === item.userId
      )
  );
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
};

export const isFavorite = async (
  id: string,
  type: FavoriteItem['type']
): Promise<boolean> => {
  const user = await getUserProfile();
  if (!user?.id) return false;

  const current = await getFavorites();
  return current.some(
    (f) => f.id === id && f.type === type && f.userId === user.id
  );
};

export const getFavoritesByType = async (type: FavoriteItem['type']) => {
  const user = await getUserProfile();
  const all = await getFavorites();
  return all.filter((f) => f.type === type && f.userId === user?.id);
};

export const getAllUserFavorites = async (): Promise<FavoriteItem[]> => {
  const user = await getUserProfile();
  const all = await getFavorites();
  return all.filter((f) => f.userId === user?.id);
};
