import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/States';
import vendorPanelApi from '../../services/vendorPanelApi';
import { formatINR, formatDate } from '../../utils/format';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

const NEXT_STATUS = { confirmed: 'preparing', preparing: 'packed', packed: 'out_for_delivery' };

export default function VendorOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);
  const toast = useToast();
  const vendorId = user?.vendorId || 'v1';

  useEffect(() => { vendorPanelApi.orders(vendorId).then((res) => setOrders(res.items || res)); }, [vendorId]);

  if (!orders) return <LoadingState label="Loading your orders…" />;

  const advance = async (o) => {
    const next = NEXT_STATUS[o.status];
    if (!next) return;
    await vendorPanelApi.updateOrderStatus(o.id, next);
    setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status: next } : x)));
    toast.success(`Order ${o.id} marked as ${next.replace('_', ' ')}`);
  };

  const cancel = async (o) => {
    await vendorPanelApi.updateOrderStatus(o.id, 'cancelled');
    setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status: 'cancelled' } : x)));
    toast.show(`Order ${o.id} cancelled`);
  };

  const columns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'customerName', label: 'Customer' },
    { key: 'items', label: 'Items', render: (r) => r.items.length },
    { key: 'amount', label: 'Amount', sortable: true, render: (r) => formatINR(r.amount) },
    { key: 'paymentStatus', label: 'Payment', render: (r) => <StatusBadge status={r.paymentStatus} /> },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'placedAt', label: 'Date', sortable: true, render: (r) => formatDate(r.placedAt) },
    { key: 'actions', label: 'Actions', render: (r) => (
      !['delivered', 'cancelled', 'out_for_delivery'].includes(r.status) ? (
        <div className="row-actions">
          <button className="btn btn-accent btn-sm" onClick={() => advance(r)}>
            {r.status === 'confirmed' ? 'Accept' : r.status === 'preparing' ? 'Mark Packed' : 'Ship'}
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => cancel(r)}>Cancel</button>
        </div>
      ) : <span style={{ color: 'var(--gb-ink-400)', fontSize: 12.5 }}>No actions</span>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${orders.length} orders for your store`} />
      <div className="card" style={{ padding: 18 }}>
        <DataTable columns={columns} rows={orders} searchKeys={['id', 'customerName']} emptyTitle="No orders yet" emptyMessage="Orders from customers will appear here." />
      </div>
    </div>
  );
}
