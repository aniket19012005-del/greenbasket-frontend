import axios from 'axios';

// Base URL comes from the environment so the same build can point at
// localhost during development and a real domain in production.
// Set VITE_API_URL in a .env file, e.g. VITE_API_URL=http://localhost:5000/api
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Centralised 401 handling: expired/invalid token -> force logout.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('gb_token');
      localStorage.removeItem('gb_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Wrap a real API call with a mock-data fallback so the frontend keeps
 * working (with clearly-separated seed data) while the backend is not
 * running yet. Once the backend is live, calls simply resolve for real
 * and mockFn is never invoked.
 */
export async function withFallback(requestFn, mockFn) {
  try {
    const res = await requestFn();
    return res.data;
  } catch (err) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn('[GreenBasket] API unavailable, using mock data:', err?.message);
    }
    return mockFn();
  }
}

export function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default api;
