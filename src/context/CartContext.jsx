import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { cartApi } from '../services/orderApi';
import AuthContext from './AuthContext';

export const CartContext = createContext(null);

const STORAGE_KEY = 'gb_cart';
const DELIVERY_FEE = 25;

export function CartProvider({ children }) {
  const auth = useContext(AuthContext);
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    if (auth?.isAuthenticated) {
      cartApi.sync(items).catch(() => {});
    }
  }, [items, auth?.isAuthenticated]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) => (i.productId === product.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, {
        productId: product.id, name: product.name, unit: product.unit, price: product.price,
        image: product.images?.[0], vendorId: product.vendorId, vendorName: product.vendorName, qty,
      }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQty = useCallback((productId, qty) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.productId !== productId);
      return prev.map((i) => (i.productId === productId ? { ...i, qty } : i));
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const groupedByVendor = useMemo(() => {
    const map = new Map();
    items.forEach((item) => {
      if (!map.has(item.vendorId)) map.set(item.vendorId, { vendorId: item.vendorId, vendorName: item.vendorName, items: [] });
      map.get(item.vendorId).items.push(item);
    });
    return Array.from(map.values());
  }, [items]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const deliveryFee = items.length ? DELIVERY_FEE * groupedByVendor.length : 0;
    return { subtotal, deliveryFee, itemCount: items.reduce((s, i) => s + i.qty, 0) };
  }, [items, groupedByVendor]);

  const getQty = useCallback((productId) => items.find((i) => i.productId === productId)?.qty || 0, [items]);

  const value = useMemo(() => ({
    items, groupedByVendor, totals, addItem, removeItem, updateQty, clearCart, getQty,
  }), [items, groupedByVendor, totals, addItem, removeItem, updateQty, clearCart, getQty]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartContext;
