import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { findProduct, maxCartLines, maxQuantity, shippingFor } from '../data/products';
import type { Product } from '../data/products';

export interface CartLine {
  productId: string;
  size: string;
  color: string;
  qty: number;
}
export interface CartEntry extends CartLine {
  product: Product;
  key: string;
}
const STORAGE_KEY = 'zaarilux.cart.v1';
export const lineKey = (line: CartLine) => `${line.productId}|${line.size}|${line.color}`;

function readCart(): CartLine[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    const valid = new Map<string, CartLine>();
    for (const line of raw.slice(0, maxCartLines)) {
      if (!line || typeof line !== 'object') continue;
      const p = findProduct(line.productId);
      if (
        !p ||
        !p.sizes.includes(line.size) ||
        !p.colors.some((c) => c.name === line.color) ||
        !Number.isInteger(line.qty) ||
        line.qty <= 0
      )
        continue;
      const key = lineKey(line);
      valid.set(key, {
        productId: p.id,
        size: line.size,
        color: line.color,
        qty: Math.min(maxQuantity, line.qty + (valid.get(key)?.qty || 0)),
      });
    }
    return [...valid.values()];
  } catch {
    return [];
  }
}

interface CartState {
  entries: CartEntry[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (product: Product, size: string, color: string, qty: number) => boolean;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}
const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readCart);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* The cart still works when browser storage is unavailable. */
    }
  }, [lines]);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) setLines(readCart());
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const entries = useMemo(
    () => lines.map((l) => ({ ...l, product: findProduct(l.productId)!, key: lineKey(l) })),
    [lines],
  );
  const subtotal = entries.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const shipping = shippingFor(subtotal);
  const add = (product: Product, size: string, color: string, qty: number) => {
    const line = { productId: product.id, size, color, qty };
    const key = lineKey(line);
    const existing = lines.find((l) => lineKey(l) === key);
    if ((!existing && lines.length >= maxCartLines) || (existing?.qty || 0) + qty > maxQuantity)
      return false;
    setLines((current) => {
      const match = current.find((l) => lineKey(l) === key);
      return match
        ? current.map((l) =>
            lineKey(l) === key ? { ...l, qty: Math.min(maxQuantity, l.qty + qty) } : l,
          )
        : [...current, line];
    });
    setOpen(true);
    return true;
  };
  const setQty = (key: string, qty: number) => {
    if (!Number.isInteger(qty) || qty < 1 || qty > maxQuantity) return;
    setLines((current) => current.map((l) => (lineKey(l) === key ? { ...l, qty } : l)));
  };
  return (
    <CartContext.Provider
      value={{
        entries,
        count: lines.reduce((s, l) => s + l.qty, 0),
        subtotal,
        shipping,
        total: subtotal + shipping,
        open,
        setOpen,
        add,
        setQty,
        remove: (key) => setLines((current) => current.filter((l) => lineKey(l) !== key)),
        clear: () => setLines([]),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error('CartProvider is required');
  return cart;
}
