import { useEffect, useState } from 'react';
import { Eye, Check, X, Ban, Play } from 'lucide-react';
import { PageHeader } from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/States';
import vendorApi from '../../services/vendorApi';
import { formatINR } from '../../utils/format';
import useToast from '../../hooks/useToast';

export default function AdminVendors() {
  const [vendors, setVendors] = useState(null);
  const toast = useToast();

  useEffect(() => { vendorApi.list().then((res) => setVendors(res.items || res)); }, []);

  if (!vendors) return <LoadingState label="Loading vendors…" />;

  const updateStatus = async (id, status) => {
    await vendorApi.updateStatus(id, status);
    setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
    toast.success(`Vendor ${status}`);
  };

  const columns = [
    { key: 'name', label: 'Vendor', sortable: true, render: (r) => <strong>{r.name}</strong> },
    { key: 'owner', label: 'Owner' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'products', label: 'Products', sortable: true },
    { key: 'orders', label: 'Orders', sortable: true },
    { key: 'sales', label: 'Sales', sortable: true, render: (r) => formatINR(r.sales) },
    { key: 'commission', label: 'Commission', render: (r) => `${r.commission}%` },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="row-actions">
        <button className="icon-btn" aria-label="View"><Eye size={15} /></button>
        {r.status === 'pending' && <>
          <button className="icon-btn" aria-label="Approve" onClick={() => updateStatus(r.id, 'approved')}><Check size={15} color="var(--gb-green-600)" /></button>
          <button className="icon-btn" aria-label="Reject" onClick={() => updateStatus(r.id, 'rejected')}><X size={15} color="var(--gb-red)" /></button>
        </>}
        {r.status === 'approved' && <button className="icon-btn" aria-label="Suspend" onClick={() => updateStatus(r.id, 'suspended')}><Ban size={15} color="var(--gb-red)" /></button>}
        {r.status === 'suspended' && <button className="icon-btn" aria-label="Activate" onClick={() => updateStatus(r.id, 'approved')}><Play size={15} color="var(--gb-green-600)" /></button>}
      </div>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Vendors" subtitle={`${vendors.length} vendors on the platform`} />
      <div className="card" style={{ padding: 18 }}>
        <DataTable columns={columns} rows={vendors} searchKeys={['name', 'owner', 'email']} emptyTitle="No vendors found" />
      </div>
    </div>
  );
}
