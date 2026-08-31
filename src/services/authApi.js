import api, { delay } from './api';

const MOCK_USERS = {
  'admin@greenbasket.in': { id: 'u-admin', name: 'Admin User', role: 'admin', email: 'admin@greenbasket.in' },
  'customer@greenbasket.in': { id: 'c1', name: 'Priya Verma', role: 'customer', email: 'customer@greenbasket.in' },
  'vendor@greenbasket.in': { id: 'v1', name: 'Ramesh Gupta', role: 'vendor', email: 'vendor@greenbasket.in', vendorId: 'v1' },
  'delivery@greenbasket.in': { id: 'd1', name: 'Suresh Kumar', role: 'delivery_boy', email: 'delivery@greenbasket.in', deliveryBoyId: 'd1' },
};

async function mockLogin(email, password) {
  await delay(500);
  const user = MOCK_USERS[email?.toLowerCase()?.trim()];
  if (!user || !password) {
    const err = new Error('Invalid email or password');
    err.isMock = true;
    throw err;
  }
  return { user, token: `mock-token-${user.role}-${Date.now()}` };
}

export const authApi = {
  async login(email, password) {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      return data;
    } catch (err) {
      if (err?.response) throw err; // real backend rejected credentials
      return mockLogin(email, password); // backend unreachable -> demo mode
    }
  },

  async register(payload) {
    try {
      const { data } = await api.post('/auth/register', payload);
      return data;
    } catch (err) {
      if (err?.response) throw err;
      await delay(500);
      const user = { id: `u-${Date.now()}`, name: payload.name, email: payload.email, role: payload.role || 'customer' };
      return { user, token: `mock-token-${user.role}-${Date.now()}` };
    }
  },

  async forgotPassword(email) {
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      return data;
    } catch {
      await delay(500);
      return { message: 'If an account exists for that email, a reset link has been sent.' };
    }
  },

  async resetPassword(token, password) {
    try {
      const { data } = await api.post('/auth/reset-password', { token, password });
      return data;
    } catch {
      await delay(500);
      return { message: 'Password reset successfully.' };
    }
  },

  async changePassword(currentPassword, newPassword) {
    try {
      const { data } = await api.post('/auth/change-password', { currentPassword, newPassword });
      return data;
    } catch {
      await delay(500);
      return { message: 'Password changed successfully.' };
    }
  },

  async me() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  demoAccounts: Object.keys(MOCK_USERS),
};

export default authApi;
