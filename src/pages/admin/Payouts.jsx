import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { LoadingState } from '../../components/common/States';
import adminApi from '../../services/adminApi';
import { formatINR } from '../../utils/format';
import useToast from '../../hooks/useToast';

export default function AdminPayouts() {
  const [payouts, setPayouts] = useState(null);
  const toast = useToast();

  useEffect(() => { adminApi.payouts().then((res) => setPayouts(res.items || res)); }, []);

  if (!payouts) return <LoadingState label="Loading payouts…" />;

  const markPaid = (vendorId) => {
    setPayouts((prev) => prev.map((p) => (p.vendorId === vendorId ? { ...p, status: 'paid' } : p)));
    toast.success('Payout marked as paid');
  };

  const columns = [
    { key: 'vendorName', label: 'Vendor', sortable: true },
    { key: 'grossSales', label: 'Gross Sales', sortable: true, render: (r) => formatINR(r.grossSales) },
    { key: 'commission', label: 'Commission', render: (r) => formatINR(r.commission) },
    { key: 'vendorEarnings', label: 'Vendor Earnings', sortable: true, render: (r) => formatINR(r.vendorEarnings) },
    { key: 'pendingAmount', label: 'Pending Amount', render: (r) => formatINR(r.pendingAmount) },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: 'Actions', render: (r) => r.status !== 'paid' && (
      <Button size="sm" variant="outline" onClick={() => markPaid(r.vendorId)}>Mark Paid</Button>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Payouts" subtitle="Vendor commission and settlement tracking" />
      <div className="card" style={{ padding: 18 }}>
        <DataTable columns={columns} rows={payouts} searchKeys={['vendorName']} emptyTitle="No payouts to show" />
      </div>
    </div>
  );
}
