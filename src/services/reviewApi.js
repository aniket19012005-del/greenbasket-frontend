import api, { withFallback, delay } from './api';
import { reviews as mockReviews } from '../data/seedData';

export const reviewApi = {
  async listForProduct(productId) {
    return withFallback(
      () => api.get(`/reviews`, { params: { productId } }),
      async () => { await delay(); return mockReviews.filter((r) => r.productId === productId); }
    );
  },
  async create(payload) {
    return withFallback(
      () => api.post('/reviews', payload),
      async () => { await delay(400); return { ...payload, id: `r-${Date.now()}`, date: new Date().toISOString() }; }
    );
  },
};

export default reviewApi;
