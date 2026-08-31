import api, { withFallback, delay } from './api';
import { products as mockProducts, categories as mockCategories } from '../data/seedData';

export const productApi = {
  async list(params = {}) {
    return withFallback(
      () => api.get('/products', { params }),
      async () => {
        await delay();
        let result = [...mockProducts];
        if (params.categoryId) result = result.filter((p) => p.categoryId === params.categoryId);
        if (params.vendorId) result = result.filter((p) => p.vendorId === params.vendorId);
        if (params.search) {
          const q = params.search.toLowerCase();
          result = result.filter((p) => p.name.toLowerCase().includes(q));
        }
        if (params.featured) result = result.filter((p) => p.featured);
        return { items: result, total: result.length };
      }
    );
  },

  async getById(id) {
    return withFallback(
      () => api.get(`/products/${id}`),
      async () => {
        await delay();
        const product = mockProducts.find((p) => p.id === id);
        if (!product) throw new Error('Product not found');
        return product;
      }
    );
  },

  async create(payload) {
    return withFallback(
      () => api.post('/products', payload),
      async () => { await delay(); return { ...payload, id: `p-${Date.now()}` }; }
    );
  },

  async update(id, payload) {
    return withFallback(
      () => api.put(`/products/${id}`, payload),
      async () => { await delay(); return { ...payload, id }; }
    );
  },

  async remove(id) {
    return withFallback(
      () => api.delete(`/products/${id}`),
      async () => { await delay(); return { success: true }; }
    );
  },

  async updateStock(id, stock) {
    return withFallback(
      () => api.patch(`/products/${id}/stock`, { stock }),
      async () => { await delay(300); return { id, stock }; }
    );
  },
};

export const categoryApi = {
  async list() {
    return withFallback(
      () => api.get('/categories'),
      async () => { await delay(250); return mockCategories; }
    );
  },
};

export default productApi;
