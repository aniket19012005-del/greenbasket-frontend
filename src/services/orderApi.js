import api, { withFallback, delay } from './api';
import { orders as mockOrders } from '../data/seedData';

export const orderApi = {
  async listMine(params = {}) {
    return withFallback(
      () => api.get('/orders', { params }),
      async () => { await delay(); return { items: mockOrders, total: mockOrders.length }; }
    );
  },

  async getById(id) {
    return withFallback(
      () => api.get(`/orders/${id}`),
      async () => {
        await delay();
        const order = mockOrders.find((o) => o.id === id);
        if (!order) throw new Error('Order not found');
        return order;
      }
    );
  },

  async create(payload) {
    return withFallback(
      () => api.post('/orders', payload),
      async () => {
        await delay(600);
        return { id: `ORD-${Math.floor(10000 + Math.random() * 89999)}`, status: 'placed', ...payload };
      }
    );
  },

  async cancel(id) {
    return withFallback(
      () => api.post(`/orders/${id}/cancel`),
      async () => { await delay(300); return { id, status: 'cancelled' }; }
    );
  },
};

export const cartApi = {
  async sync(cartItems) {
    return withFallback(
      () => api.post('/cart/sync', { items: cartItems }),
      async () => { await delay(200); return { items: cartItems }; }
    );
  },
};

export const paymentApi = {
  // Frontend integration stub for Razorpay. The Razorpay secret key must
  // NEVER be present in frontend code — order creation + signature
  // verification happen on the backend. This only creates a checkout
  // "order" reference and opens the Razorpay widget with the public key.
  async createRazorpayOrder(amount) {
    return withFallback(
      () => api.post('/payments/razorpay/order', { amount }),
      async () => { await delay(400); return { orderId: `rzp_mock_${Date.now()}`, amount, currency: 'INR' }; }
    );
  },

  openRazorpayCheckout({ orderId, amount, name, email, contact, onSuccess, onFailure }) {
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID; // public key only
    if (!key || typeof window.Razorpay === 'undefined') {
      // Demo mode: simulate a successful payment.
      setTimeout(() => onSuccess?.({ razorpay_payment_id: `pay_mock_${Date.now()}`, razorpay_order_id: orderId }), 700);
      return;
    }
    const rzp = new window.Razorpay({
      key, amount: amount * 100, currency: 'INR', name: 'GreenBasket', order_id: orderId,
      prefill: { name, email, contact },
      theme: { color: '#1B5E42' },
      handler: (response) => onSuccess?.(response),
      modal: { ondismiss: () => onFailure?.(new Error('Payment cancelled')) },
    });
    rzp.open();
  },
};

export default orderApi;
