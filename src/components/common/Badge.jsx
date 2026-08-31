export default function Badge({ tone = 'green', children, className = '' }) {
  return <span className={`badge badge-${tone} ${className}`}>{children}</span>;
}

const STATUS_TONES = {
  placed: 'gray', confirmed: 'green', preparing: 'gold', packed: 'gold',
  out_for_delivery: 'gold', delivered: 'green', cancelled: 'red',
  pending: 'gold', approved: 'green', rejected: 'red', suspended: 'red', active: 'green',
  paid: 'green', processing: 'gold', in_stock: 'green', low_stock: 'gold', out_of_stock: 'red',
};

export function StatusBadge({ status, label }) {
  const tone = STATUS_TONES[status] || 'gray';
  const text = label || String(status || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return <Badge tone={tone}>{text}</Badge>;
}
