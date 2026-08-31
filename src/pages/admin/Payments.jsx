import { useEffect, useState } from 'react';
import { PageHeader, StatCard } from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/States';
import { CreditCard, CheckCircle2, Clock } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { formatINR, formatDate } from '../../utils/format';

export default function AdminPayments() {
  const [orders, setOrders] = useState(null);

  useEffect(() => { adminApi.orders().then((res) => setOrders(res.items || res)); }, []);

  if (!orders) return <LoadingState label="Loading payments…" />;

  const paid = orders.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.amount, 0);
  const pending = orders.filter((o) => o.paymentStatus === 'pending').reduce((s, o) => s + o.amount, 0);

  const columns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'customerName', label: 'Customer' },
    { key: 'amount', label: 'Amount', sortable: true, render: (r) => formatINR(r.amount) },
    { key: 'paymentMethod', label: 'Method' },
    { key: 'paymentStatus', label: 'Status', render: (r) => <StatusBadge status={r.paymentStatus} /> },
    { key: 'placedAt', label: 'Date', sortable: true, render: (r) => formatDate(r.placedAt) },
  ];

  return (
    <div>
      <PageHeader title="Payments" subtitle="All transactions processed via Razorpay and COD" />
      <div className="stat-grid">
        <StatCard icon={CreditCard} label="Total Collected" value={formatINR(paid)} />
        <StatCard icon={CheckCircle2} label="Paid Orders" value={orders.filter((o) => o.paymentStatus === 'paid').length} />
        <StatCard icon={Clock} label="Pending Collection" value={formatINR(pending)} />
      </div>
      <div className="card" style={{ padding: 18 }}>
        <DataTable columns={columns} rows={orders} searchKeys={['id', 'customerName']} emptyTitle="No transactions yet" />
      </div>
    </div>
  );
}
