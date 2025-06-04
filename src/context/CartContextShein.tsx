// context/CartContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// نوع بيانات عنصر السلة
export interface CartItem {
  id: string;        // يمكن أن يكون رابط المنتج أو رقم فريد
  name: string;
  price: number;
  image: string;
  quantity: number;
  sheinUrl?: string; // إن وُجد رابط المنتج في SHEIN
}

// تعريف شكل الـ Context
interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
}

// تهيئة القيمة الافتراضية (فارغة) للـ Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// موفّر CartContext
export const CartProviderShein = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // إضافة عنصر جديد أو زيادة الكمية إن وجد مسبقًا
  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        // إذا كان العنصر موجودًا، نزيد الكمية
        return prev.map((i) =>
          i.id === newItem.id
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      } else {
        // غير موجود، نضيفه
        return [...prev, newItem];
      }
    });
  };

  // إزالة عنصر كاملًا من السلة حسب المعرف
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // مسح السلة بالكامل
  const clearCart = () => {
    setItems([]);
  };

  // تحديث كمية عنصر موجود
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      // إن كانت الكمية صفر أو سلبية، نحذف العنصر
      removeItem(id);
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, quantity }
            : i
        )
      );
    }
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

// هوك للوصول إلى CartContext بسهولة
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
