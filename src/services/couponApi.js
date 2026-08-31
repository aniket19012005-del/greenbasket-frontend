import api, { withFallback, delay } from './api';
import { coupons as mockCoupons } from '../data/seedData';

export const couponApi = {
  async apply(code, orderTotal) {
    return withFallback(
      () => api.post('/coupons/apply', { code, orderTotal }),
      async () => {
        await delay(400);
        const coupon = mockCoupons.find((c) => c.code.toLowerCase() === String(code).toLowerCase() && c.active);
        if (!coupon) { const err = new Error('Invalid or expired coupon code'); throw err; }
        if (orderTotal < coupon.minOrder) { throw new Error(`Minimum order of ₹${coupon.minOrder} required for this coupon`); }
        const raw = coupon.discountType === 'percent' ? (orderTotal * coupon.discountValue) / 100 : coupon.discountValue;
        const discount = Math.min(raw, coupon.maxDiscount);
        return { code: coupon.code, discount: Math.round(discount) };
      }
    );
  },
};

export default couponApi;
