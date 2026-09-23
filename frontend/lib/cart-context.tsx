'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Dish } from './api';

export type CartLine = { dishId: string; name: string; price: number; quantity: number };

type CartContextType = {
  lines: CartLine[];
  add: (dish: Dish) => void;
  changeQty: (dishId: string, delta: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  function add(dish: Dish) {
    setLines((prev) => {
      const existing = prev.find((l) => l.dishId === dish.id);
      if (existing) {
        return prev.map((l) => (l.dishId === dish.id ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [...prev, { dishId: dish.id, name: dish.name, price: dish.price, quantity: 1 }];
    });
  }

  function changeQty(dishId: string, delta: number) {
    setLines((prev) =>
      prev
        .map((l) => (l.dishId === dishId ? { ...l, quantity: l.quantity + delta } : l))
        .filter((l) => l.quantity > 0),
    );
  }

  function clear() {
    setLines([]);
  }

  const total = useMemo(() => lines.reduce((sum, l) => sum + l.price * l.quantity, 0), [lines]);
  const count = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  return <CartContext.Provider value={{ lines, add, changeQty, clear, total, count }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans CartProvider');
  return ctx;
}
