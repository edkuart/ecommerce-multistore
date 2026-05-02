"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem } from "@/types/cart";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "frontend_ecommerce_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Browser storage is best-effort for this lightweight cart.
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const addItem: CartContextValue["addItem"] = (item, quantity = 1) => {
      if (quantity <= 0) return;

      setItems((current) => {
        const existing = current.find((cartItem) => cartItem.id === item.id);
        if (!existing) return [...current, { ...item, quantity }];

        return current.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem,
        );
      });
    };

    const setQuantity: CartContextValue["setQuantity"] = (id, quantity) => {
      setItems((current) =>
        current
          .map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
          )
          .filter((item) => item.quantity > 0),
      );
    };

    const removeItem = (id: string) => {
      setItems((current) => current.filter((item) => item.id !== id));
    };

    const clear = () => setItems([]);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );

    return { items, count, subtotal, addItem, setQuantity, removeItem, clear };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
