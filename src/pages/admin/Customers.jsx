import { useEffect, useState } from 'react';
import { Eye, Ban, Play } from 'lucide-react';
import { PageHeader } from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/States';
import adminApi from '../../services/adminApi';
import { formatINR, formatDate } from '../../utils/format';
import useToast from '../../hooks/useToast';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState(null);
  const toast = useToast();

  useEffect(() => { adminApi.customers().then((res) => setCustomers(res.items || res)); }, []);

  if (!customers) return <LoadingState label="Loading customers…" />;

  const toggleStatus = async (c) => {
    const status = c.status === 'active' ? 'suspended' : 'active';
    await adminApi.updateCustomerStatus(c.id, status);
    setCustomers((prev) => prev.map((x) => (x.id === c.id ? { ...x, status } : x)));
    toast.success(`${c.name} ${status === 'active' ? 'activated' : 'suspended'}`);
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'orders', label: 'Orders', sortable: true },
    { key: 'totalSpent', label: 'Total Spent', sortable: true, render: (r) => formatINR(r.totalSpent) },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'joinedAt', label: 'Joined', sortable: true, render: (r) => formatDate(r.joinedAt) },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="row-actions">
        <button className="icon-btn" aria-label="View"><Eye size={15} /></button>
        <button className="icon-btn" aria-label="Toggle status" onClick={() => toggleStatus(r)}>
          {r.status === 'active' ? <Ban size={15} color="var(--gb-red)" /> : <Play size={15} color="var(--gb-green-600)" />}
        </button>
      </div>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Customers" subtitle={`${customers.length} registered customers`} />
      <div className="card" style={{ padding: 18 }}>
        <DataTable columns={columns} rows={customers} searchKeys={['name', 'email']} emptyTitle="No customers found" />
      </div>
    </div>
  );
}
