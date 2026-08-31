import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/States';
import deliveryApi from '../../services/deliveryApi';
import { formatINR, formatDate } from '../../utils/format';
import useAuth from '../../hooks/useAuth';

const FILTERS = [{ key: 'today', label: 'Today' }, { key: 'week', label: 'This Week' }, { key: 'month', label: 'This Month' }];

export default function DeliveryHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);
  const [filter, setFilter] = useState('week');
  const deliveryBoyId = user?.deliveryBoyId || 'd1';

  useEffect(() => { deliveryApi.history(deliveryBoyId).then((res) => setOrders(res.items || res)); }, [deliveryBoyId]);

  if (!orders) return <LoadingState label="Loading history…" />;

  const columns = [
    { key: 'id', label: 'Order', sortable: true },
    { key: 'customerName', label: 'Customer' },
    { key: 'placedAt', label: 'Date', sortable: true, render: (r) => formatDate(r.placedAt) },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'amount', label: 'Amount', sortable: true, render: (r) => formatINR(r.amount) },
    { key: 'earnings', label: 'Earnings', render: () => formatINR(30) },
  ];

  return (
    <div>
      <PageHeader title="Delivery History" subtitle="Your completed deliveries"
        actions={<div className="chip-row">{FILTERS.map((f) => <button key={f.key} className={`chip ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>{f.label}</button>)}</div>} />
      <div className="card" style={{ padding: 18 }}>
        <DataTable columns={columns} rows={orders} searchKeys={['id', 'customerName']} emptyTitle="No completed deliveries yet" />
      </div>
    </div>
  );
}
