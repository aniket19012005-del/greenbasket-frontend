import api, { withFallback, delay } from './api';
import {
  orders as mockOrders, products as mockProducts, vendors as mockVendors,
  customers as mockCustomers, deliveryBoys as mockDeliveryBoys, coupons as mockCoupons,
  reviews as mockReviews, salesTrend as mockSalesTrend,
} from '../data/seedData';

export const adminApi = {
  async dashboard() {
    return withFallback(
      () => api.get('/admin/dashboard'),
      async () => {
        await delay();
        const totalRevenue = mockOrders.reduce((s, o) => s + o.amount, 0) * 38;
        return {
          totalRevenue, todayRevenue: 18240, totalOrders: mockOrders.length * 38,
          todayOrders: 24, customers: mockCustomers.length * 60, vendors: mockVendors.length * 4,
          deliveryBoys: mockDeliveryBoys.length * 6,
          recentOrders: mockOrders, salesTrend: mockSalesTrend,
          topProducts: mockProducts.slice(0, 5),
          topVendors: mockVendors,
          lowStock: mockProducts.filter((p) => p.stock > 0 && p.stock <= 10),
          pendingVendors: mockVendors.filter((v) => v.status === 'pending'),
          pendingAssignments: mockOrders.filter((o) => !o.deliveryBoy && o.status !== 'delivered'),
        };
      }
    );
  },

  async orders(params = {}) { return withFallback(() => api.get('/admin/orders', { params }), async () => { await delay(); return { items: mockOrders, total: mockOrders.length }; }); },
  async updateOrderStatus(id, status) { return withFallback(() => api.patch(`/admin/orders/${id}/status`, { status }), async () => { await delay(300); return { id, status }; }); },
  async assignDeliveryBoy(orderId, deliveryBoyId) { return withFallback(() => api.post(`/admin/orders/${orderId}/assign`, { deliveryBoyId }), async () => { await delay(300); return { orderId, deliveryBoyId }; }); },

  async customers(params = {}) { return withFallback(() => api.get('/admin/customers', { params }), async () => { await delay(); return { items: mockCustomers, total: mockCustomers.length }; }); },
  async updateCustomerStatus(id, status) { return withFallback(() => api.patch(`/admin/customers/${id}/status`, { status }), async () => { await delay(300); return { id, status }; }); },

  async deliveryBoys(params = {}) { return withFallback(() => api.get('/admin/delivery-boys', { params }), async () => { await delay(); return { items: mockDeliveryBoys, total: mockDeliveryBoys.length }; }); },
  async updateDeliveryBoyStatus(id, status) { return withFallback(() => api.patch(`/admin/delivery-boys/${id}/status`, { status }), async () => { await delay(300); return { id, status }; }); },

  async coupons(params = {}) { return withFallback(() => api.get('/admin/coupons', { params }), async () => { await delay(); return { items: mockCoupons, total: mockCoupons.length }; }); },
  async saveCoupon(payload) { return withFallback(() => api.post('/admin/coupons', payload), async () => { await delay(400); return { ...payload, id: payload.id || `cp-${Date.now()}` }; }); },
  async deleteCoupon(id) { return withFallback(() => api.delete(`/admin/coupons/${id}`), async () => { await delay(300); return { success: true }; }); },

  async payouts(params = {}) {
    return withFallback(
      () => api.get('/admin/payouts', { params }),
      async () => {
        await delay();
        const items = mockVendors.map((v) => ({
          vendorId: v.id, vendorName: v.name, grossSales: v.sales,
          commission: Math.round(v.sales * (v.commission / 100)),
          vendorEarnings: Math.round(v.sales * (1 - v.commission / 100)),
          pendingAmount: Math.round(v.sales * 0.08),
          status: v.id === 'v1' ? 'paid' : v.id === 'v2' ? 'processing' : 'pending',
        }));
        return { items, total: items.length };
      }
    );
  },

  async reviews(params = {}) { return withFallback(() => api.get('/admin/reviews', { params }), async () => { await delay(); return { items: mockReviews, total: mockReviews.length }; }); },

  async analytics(range = '7d') {
    return withFallback(
      () => api.get('/admin/analytics', { params: { range } }),
      async () => { await delay(); return { salesTrend: mockSalesTrend, commissionEarned: 68400, deliveryOnTimeRate: 94 }; }
    );
  },

  async settings() { return withFallback(() => api.get('/admin/settings'), async () => { await delay(200); return { platformName: 'GreenBasket', supportEmail: 'support@greenbasket.in', defaultCommission: 12, deliveryFee: 25 }; }); },
  async saveSettings(payload) { return withFallback(() => api.put('/admin/settings', payload), async () => { await delay(400); return payload; }); },
};

export default adminApi;
