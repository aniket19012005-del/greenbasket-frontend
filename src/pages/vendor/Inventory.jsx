import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/States';
import vendorPanelApi from '../../services/vendorPanelApi';
import { stockStatus } from '../../utils/format';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

export default function VendorInventory() {
  const { user } = useAuth();
  const [products, setProducts] = useState(null);
  const toast = useToast();
  const vendorId = user?.vendorId || 'v1';

  useEffect(() => { vendorPanelApi.products(vendorId).then((res) => setProducts(res.items || res)); }, [vendorId]);

  if (!products) return <LoadingState label="Loading inventory…" />;

  const updateStock = async (id, value) => {
    const stock = Math.max(0, Number(value) || 0);
    await vendorPanelApi.updateStock(id, stock);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock } : p)));
  };

  const columns = [
    { key: 'name', label: 'Product', sortable: true },
    { key: 'stock', label: 'Current Stock', sortable: true, render: (r) => (
      <input type="number" min="0" className="input" style={{ width: 90, padding: '6px 10px' }} defaultValue={r.stock}
        onBlur={(e) => updateStock(r.id, e.target.value) || toast.success(`Stock updated for ${r.name}`)} />
    ) },
    { key: 'reserved', label: 'Reserved', render: () => Math.floor(Math.random() * 5) },
    { key: 'available', label: 'Available', render: (r) => r.stock },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={stockStatus(r.stock).label.toLowerCase().replace(' ', '_')} label={stockStatus(r.stock).label} /> },
  ];

  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10);

  return (
    <div>
      <PageHeader title="Inventory" subtitle="Manage stock levels for your products" />
      {lowStock.length > 0 && (
        <div className="card" style={{ padding: 14, marginBottom: 18, borderColor: 'var(--gb-gold)', background: '#FBF1DC' }}>
          <strong style={{ fontSize: 13.5, color: '#8A6A1E' }}>⚠ {lowStock.length} product{lowStock.length > 1 ? 's are' : ' is'} running low on stock</strong>
        </div>
      )}
      <div className="card" style={{ padding: 18 }}>
        <DataTable columns={columns} rows={products} searchKeys={['name']} emptyTitle="No products to manage" />
      </div>
    </div>
  );
}
