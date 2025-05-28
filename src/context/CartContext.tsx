import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOrCreateCartId } from "../utils/cartId";
import axiosInstance from "utils/api/axiosInstance";

interface CartProviderProps {
  children: ReactNode;
}

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: any;
  originalPrice?: number;
  storeId: string;
  storeType: string;
};

type CartContextType = {
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
  addToCart: (item: CartItem, qty?: number) => Promise<boolean>;
  updateQuantity: (id: string, qty: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  mergeGuestCart: (userId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
console.log("[CartContext] module loaded");

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const loadCart = async (userId?: string) => {
    try {
      const cartId = await getOrCreateCartId();
      const url = userId
        ? `/delivery/cart/user/${userId}`
        : `/delivery/cart/${cartId}`;
      const res = await axiosInstance.get(url);
      setItems(res.data.items || []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  
const addToCart = async (item: CartItem, qty = 1): Promise<boolean> => {
  console.log("1️⃣ [CartContext] addToCart entry");

  // 2) احصل على cartId حقيقي
  const cartId = await getOrCreateCartId();
  console.log("2️⃣ [CartContext] got cartId:", cartId);

  // 3) userId نصيّ من AsyncStorage
  const userId = await AsyncStorage.getItem("userId");
  console.log("3️⃣ [CartContext] got userId:", userId);

  // 4) جهّز الجسم للطلب
  const body = {
    cartId,
    userId: userId || undefined,
    productId: item.id,
    name: item.name,
    price: item.price,
    quantity: qty,
    storeId: item.storeId,
    image: item.image.uri || item.image,
  };
  console.log("4️⃣ [CartContext] built body:", body);

  // 5) أرسل للـ backend
  try {
    const res = await axiosInstance.post("/delivery/cart/add", body);
    console.log("5️⃣ [CartContext] POST success:", res.status);
    console.log("6️⃣ [CartContext] response data:", res.data);
    setItems(res.data.cart.items || []);
    return true;
  } catch (err: any) {
    console.error("5️⃣ [CartContext] POST error message:", err.message);
    console.error("5️⃣ [CartContext] POST error response data:", err.response?.data);
    return false;
  }
};


  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
    } else {
      const item = items.find(i => i.id === id);
      if (item) {
        await addToCart({ ...item }, quantity - item.quantity);
      }
    }
  };

  const removeFromCart = async (id: string) => {
    const cartId = await getOrCreateCartId();
    const userId = await AsyncStorage.getItem("userId");
    const url = userId
      ? `/delivery/cart/user/${userId}/items/${id}`
      : `/delivery/cart/${cartId}/items/${id}`;
    await axiosInstance.delete(url);
    await loadCart(userId || undefined);
  };

  const clearCart = async () => {
    const cartId = await getOrCreateCartId();
    const userId = await AsyncStorage.getItem("userId");
    const url = userId
      ? `/delivery/cart/user/${userId}`
      : `/delivery/cart/${cartId}`;
    await axiosInstance.delete(url);
    setItems([]);
  };

  const mergeGuestCart = async (userId: string) => {
    const json = await AsyncStorage.getItem('guestCart');
    if (!json) return;
    const guestItems: CartItem[] = JSON.parse(json);
    const storeId = await AsyncStorage.getItem('guestStoreId');

    try {
      await axiosInstance.post('/delivery/cart/merge', { items: guestItems, storeId });
      await AsyncStorage.removeItem('guestCart');
      await AsyncStorage.removeItem('guestStoreId');
      await loadCart(userId);
    } catch (e) {
      console.error('Failed to merge guest cart', e);
    }
  };

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalPrice,
        totalQuantity,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        mergeGuestCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
