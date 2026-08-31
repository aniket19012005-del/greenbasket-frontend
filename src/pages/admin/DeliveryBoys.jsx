import { useEffect, useState } from 'react';
import { Eye, Check, Ban, Play } from 'lucide-react';
import { PageHeader } from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Badge, { StatusBadge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/States';
import adminApi from '../../services/adminApi';
import { formatINR } from '../../utils/format';
import useToast from '../../hooks/useToast';

export default function AdminDeliveryBoys() {
  const [boys, setBoys] = useState(null);
  const toast = useToast();

  useEffect(() => { adminApi.deliveryBoys().then((res) => setBoys(res.items || res)); }, []);

  if (!boys) return <LoadingState label="Loading delivery boys…" />;

  const updateStatus = async (id, status) => {
    await adminApi.updateDeliveryBoyStatus(id, status);
    setBoys((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    toast.success('Status updated');
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'vehicle', label: 'Vehicle' },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'online', label: 'Online', render: (r) => <Badge tone={r.online ? 'green' : 'gray'}>{r.online ? 'Online' : 'Offline'}</Badge> },
    { key: 'deliveries', label: 'Deliveries', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true, render: (r) => r.rating || '—' },
    { key: 'earnings', label: 'Earnings', sortable: true, render: (r) => formatINR(r.earnings) },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="row-actions">
        <button className="icon-btn" aria-label="View"><Eye size={15} /></button>
        {r.status === 'pending' && <button className="icon-btn" aria-label="Approve" onClick={() => updateStatus(r.id, 'approved')}><Check size={15} color="var(--gb-green-600)" /></button>}
        {r.status === 'approved' && <button className="icon-btn" aria-label="Suspend" onClick={() => updateStatus(r.id, 'suspended')}><Ban size={15} color="var(--gb-red)" /></button>}
        {r.status === 'suspended' && <button className="icon-btn" aria-label="Activate" onClick={() => updateStatus(r.id, 'approved')}><Play size={15} color="var(--gb-green-600)" /></button>}
      </div>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Delivery Boys" subtitle={`${boys.length} delivery partners`} />
      <div className="card" style={{ padding: 18 }}>
        <DataTable columns={columns} rows={boys} searchKeys={['name', 'phone']} emptyTitle="No delivery boys found" />
      </div>
    </div>
  );
}
