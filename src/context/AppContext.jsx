import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { currentUserSeed } from '../data/seedData';

export const AppContext = createContext(null);

const WISHLIST_KEY = 'gb_wishlist';

export function AppProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      return raw ? JSON.parse(raw) : currentUserSeed.wishlist;
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = useCallback((productId) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  }, []);

  const isWishlisted = useCallback((productId) => wishlist.includes(productId), [wishlist]);

  const value = useMemo(() => ({ wishlist, toggleWishlist, isWishlisted }), [wishlist, toggleWishlist, isWishlisted]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContext;
