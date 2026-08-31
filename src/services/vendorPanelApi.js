import api, { withFallback, delay } from './api';
import { products as mockProducts, orders as mockOrders, vendors as mockVendors, salesTrend as mockSalesTrend } from '../data/seedData';

// Scoped to the logged-in vendor's own store (vendorId comes from auth context / token on the real backend).
export const vendorPanelApi = {
  async dashboard(vendorId) {
    return withFallback(
      () => api.get('/vendor/dashboard'),
      async () => {
        await delay();
        const myProducts = mockProducts.filter((p) => p.vendorId === vendorId);
        const myOrders = mockOrders.filter((o) => o.vendorId === vendorId);
        return {
          totalSales: 68400, todaySales: 3120, totalOrders: myOrders.length * 22,
          pendingOrders: myOrders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length,
          products: myProducts.length, lowStock: myProducts.filter((p) => p.stock > 0 && p.stock <= 10).length,
          outOfStock: myProducts.filter((p) => p.stock === 0).length, pendingEarnings: 5230,
          recentOrders: myOrders, topProducts: myProducts.slice(0, 4), salesTrend: mockSalesTrend,
        };
      }
    );
  },

  async products(vendorId, params = {}) {
    return withFallback(
      () => api.get('/vendor/products', { params }),
      async () => { await delay(); const items = mockProducts.filter((p) => p.vendorId === vendorId); return { items, total: items.length }; }
    );
  },

  async saveProduct(payload) { return withFallback(() => api.post('/vendor/products', payload), async () => { await delay(400); return { ...payload, id: payload.id || `p-${Date.now()}` }; }); },
  async deleteProduct(id) { return withFallback(() => api.delete(`/vendor/products/${id}`), async () => { await delay(300); return { success: true }; }); },
  async updateStock(id, stock) { return withFallback(() => api.patch(`/vendor/products/${id}/stock`, { stock }), async () => { await delay(250); return { id, stock }; }); },

  async orders(vendorId, params = {}) {
    return withFallback(
      () => api.get('/vendor/orders', { params }),
      async () => { await delay(); const items = mockOrders.filter((o) => o.vendorId === vendorId); return { items, total: items.length }; }
    );
  },
  async updateOrderStatus(id, status) { return withFallback(() => api.patch(`/vendor/orders/${id}/status`, { status }), async () => { await delay(300); return { id, status }; }); },

  async earnings(vendorId) {
    return withFallback(
      () => api.get('/vendor/earnings'),
      async () => { await delay(); return { grossSales: 68400, commission: 8208, netEarnings: 60192, pendingPayout: 5230, paidPayout: 54962, salesTrend: mockSalesTrend }; }
    );
  },

  async storeProfile(vendorId) {
    return withFallback(
      () => api.get('/vendor/store'),
      async () => { await delay(); return mockVendors.find((v) => v.id === vendorId) || mockVendors[0]; }
    );
  },
  async saveStoreProfile(payload) { return withFallback(() => api.put('/vendor/store', payload), async () => { await delay(400); return payload; }); },
};

export default vendorPanelApi;
