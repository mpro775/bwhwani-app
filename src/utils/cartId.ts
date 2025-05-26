import * as Random from 'expo-random';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_ID_KEY = 'guestCartId';

export async function getOrCreateCartId(): Promise<string> {
  try {
    console.log('🔍 [cartId] entry');
    let cartId = await AsyncStorage.getItem(CART_ID_KEY);
    console.log('🔍 [cartId] from storage:', cartId);

    if (!cartId) {
      // استخدم expo-random لتوليد 16 بايت عشوائية ثم حوّلها لـ hex
      const randomBytes = await Random.getRandomBytesAsync(16);
      cartId = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
      console.log('🔍 [cartId] generated new cartId:', cartId);
      await AsyncStorage.setItem(CART_ID_KEY, cartId);
      console.log('🔍 [cartId] saved new cartId');
    }

    console.log('🔍 [cartId] exit with:', cartId);
    return cartId;
  } catch (e) {
    console.error('🔍 [cartId] ERROR:', e);
    // fallback: استخدم timestamp
    const fallback = Date.now().toString();
    console.log('🔍 [cartId] fallback id:', fallback);
    return fallback;
  }
}
