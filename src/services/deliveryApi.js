import api, { withFallback, delay } from './api';
import { orders as mockOrders, deliveryBoys as mockDeliveryBoys } from '../data/seedData';

export const deliveryApi = {
  async dashboard(deliveryBoyId) {
    return withFallback(
      () => api.get('/delivery/dashboard'),
      async () => {
        await delay();
        const boy = mockDeliveryBoys.find((d) => d.id === deliveryBoyId) || mockDeliveryBoys[0];
        return {
          todayDeliveries: 6, pending: 2, completed: 4, todayEarnings: 340, totalEarnings: boy.earnings,
          activeDelivery: mockOrders.find((o) => o.status === 'out_for_delivery') || null,
          online: boy.online,
        };
      }
    );
  },

  async assignments(deliveryBoyId) {
    return withFallback(
      () => api.get('/delivery/assignments'),
      async () => { await delay(); const items = mockOrders.filter((o) => ['confirmed', 'preparing', 'packed'].includes(o.status)); return { items, total: items.length }; }
    );
  },

  async acceptAssignment(orderId) { return withFallback(() => api.post(`/delivery/assignments/${orderId}/accept`), async () => { await delay(300); return { orderId, status: 'accepted' }; }); },

  async activeDelivery(deliveryBoyId) {
    return withFallback(
      () => api.get('/delivery/active'),
      async () => { await delay(); return mockOrders.find((o) => o.status === 'out_for_delivery') || null; }
    );
  },

  async updateDeliveryStatus(orderId, status) { return withFallback(() => api.patch(`/delivery/orders/${orderId}/status`, { status }), async () => { await delay(350); return { orderId, status }; }); },

  async history(deliveryBoyId, params = {}) {
    return withFallback(
      () => api.get('/delivery/history', { params }),
      async () => { await delay(); const items = mockOrders.filter((o) => o.status === 'delivered'); return { items, total: items.length }; }
    );
  },

  async earnings(deliveryBoyId) {
    return withFallback(
      () => api.get('/delivery/earnings'),
      async () => { await delay(); return { today: 340, weekly: 2180, monthly: 8760, total: 48200 }; }
    );
  },

  async profile(deliveryBoyId) {
    return withFallback(
      () => api.get('/delivery/profile'),
      async () => { await delay(); return mockDeliveryBoys.find((d) => d.id === deliveryBoyId) || mockDeliveryBoys[0]; }
    );
  },
  async saveProfile(payload) { return withFallback(() => api.put('/delivery/profile', payload), async () => { await delay(400); return payload; }); },
  async toggleOnline(online) { return withFallback(() => api.patch('/delivery/profile/online', { online }), async () => { await delay(200); return { online }; }); },
};

export default deliveryApi;
