import api, { withFallback, delay } from './api';
import { vendors as mockVendors } from '../data/seedData';

// Used both by the customer panel (browsing vendors) and the admin panel
// (managing vendors). Vendor's own dashboard actions live in vendorPanelApi.js.
export const vendorApi = {
  async list(params = {}) {
    return withFallback(
      () => api.get('/vendors', { params }),
      async () => {
        await delay();
        let result = [...mockVendors];
        if (params.status) result = result.filter((v) => v.status === params.status);
        return { items: result, total: result.length };
      }
    );
  },

  async getById(id) {
    return withFallback(
      () => api.get(`/vendors/${id}`),
      async () => {
        await delay();
        const vendor = mockVendors.find((v) => v.id === id);
        if (!vendor) throw new Error('Vendor not found');
        return vendor;
      }
    );
  },

  async updateStatus(id, status) {
    return withFallback(
      () => api.patch(`/admin/vendors/${id}/status`, { status }),
      async () => { await delay(300); return { id, status }; }
    );
  },

  async updateCommission(id, commission) {
    return withFallback(
      () => api.patch(`/admin/vendors/${id}/commission`, { commission }),
      async () => { await delay(300); return { id, commission }; }
    );
  },
};

export default vendorApi;
