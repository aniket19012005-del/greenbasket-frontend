export function formatINR(amount) {
  const n = Number(amount) || 0;
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function discountPercent(original, selling) {
  const o = Number(original) || 0;
  const s = Number(selling) || 0;
  if (!o || o <= s) return 0;
  return Math.round(((o - s) / o) * 100);
}

export function formatDate(iso, opts) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-IN', opts || { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

export function formatDateTime(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export function stockStatus(stock) {
  const s = Number(stock) || 0;
  if (s <= 0) return { label: 'Out of Stock', tone: 'red' };
  if (s <= 10) return { label: 'Low Stock', tone: 'gold' };
  return { label: 'In Stock', tone: 'green' };
}

export const ORDER_STATUS_LABELS = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  packed: 'Packed',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_FLOW = ['placed', 'confirmed', 'preparing', 'packed', 'out_for_delivery', 'delivered'];

export function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?';
}
