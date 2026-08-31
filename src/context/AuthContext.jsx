import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import authApi from '../services/authApi';

export const AuthContext = createContext(null);

const ROLE_HOME = {
  admin: '/admin/dashboard',
  customer: '/shop',
  vendor: '/vendor/dashboard',
  delivery_boy: '/delivery/dashboard',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('gb_token');
    const storedUser = localStorage.getItem('gb_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('gb_token');
        localStorage.removeItem('gb_user');
      }
    }
    setLoading(false);
  }, []);

  const persist = useCallback((nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem('gb_token', nextToken);
    localStorage.setItem('gb_user', JSON.stringify(nextUser));
  }, []);

  const login = useCallback(async (email, password) => {
    const { user: loggedInUser, token: authToken } = await authApi.login(email, password);
    persist(loggedInUser, authToken);
    return loggedInUser;
  }, [persist]);

  const register = useCallback(async (payload) => {
    const { user: newUser, token: authToken } = await authApi.register(payload);
    persist(newUser, authToken);
    return newUser;
  }, [persist]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('gb_token');
    localStorage.removeItem('gb_user');
  }, []);

  const value = useMemo(() => ({
    user, token, loading, isAuthenticated: !!user,
    role: user?.role || null,
    homeRoute: user ? ROLE_HOME[user.role] || '/' : '/',
    login, register, logout,
  }), [user, token, loading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
