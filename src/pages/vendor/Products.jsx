import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Ban } from 'lucide-react';
import { PageHeader } from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { LoadingState } from '../../components/common/States';
import vendorPanelApi from '../../services/vendorPanelApi';
import { formatINR, stockStatus } from '../../utils/format';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

export default function VendorProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  const vendorId = user?.vendorId || 'v1';

  const load = () => vendorPanelApi.products(vendorId).then((res) => setProducts(res.items || res));
  useEffect(() => { load(); }, [vendorId]);

  if (!products) return <LoadingState label="Loading your products…" />;

  const confirmDelete = async () => {
    await vendorPanelApi.deleteProduct(deleteTarget.id);
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    toast.success(`${deleteTarget.name} deleted`);
    setDeleteTarget(null);
  };

  const toggleDisable = async (p) => {
    const nextStock = p.stock > 0 ? 0 : 10;
    await vendorPanelApi.updateStock(p.id, nextStock);
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, stock: nextStock } : x)));
    toast.success(`${p.name} ${nextStock > 0 ? 'enabled' : 'disabled'}`);
  };

  const columns = [
    { key: 'name', label: 'Product', sortable: true, render: (r) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={r.images?.[0]} alt="" style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover' }} />
        <span style={{ fontWeight: 600 }}>{r.name}</span>
      </div>
    ) },
    { key: 'price', label: 'Price', sortable: true, render: (r) => formatINR(r.price) },
    { key: 'stock', label: 'Stock', sortable: true },
    { key: 'sales', label: 'Sales', render: () => Math.floor(Math.random() * 40) + 5 },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={stockStatus(r.stock).label.toLowerCase().replace(' ', '_')} label={stockStatus(r.stock).label} /> },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="row-actions">
        <button className="icon-btn" aria-label="Edit" onClick={() => navigate(`/vendor/products/${r.id}/edit`)}><Pencil size={15} /></button>
        <button className="icon-btn" aria-label="Disable" onClick={() => toggleDisable(r)}><Ban size={15} /></button>
        <button className="icon-btn" aria-label="Delete" onClick={() => setDeleteTarget(r)}><Trash2 size={15} color="var(--gb-red)" /></button>
      </div>
    ) },
  ];

  return (
    <div>
      <PageHeader title="My Products" subtitle={`${products.length} products in your store`}
        actions={<Button variant="accent" icon={Plus} onClick={() => navigate('/vendor/products/new')}>Add Product</Button>} />
      <div className="card" style={{ padding: 18 }}>
        <DataTable columns={columns} rows={products} searchKeys={['name']} emptyTitle="No products yet" emptyMessage="Add your first product to start selling." />
      </div>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Product"
        footer={<><Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button variant="danger" onClick={confirmDelete}>Delete</Button></>}>
        <p style={{ fontSize: 14, color: 'var(--gb-ink-600)' }}>Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?</p>
      </Modal>
    </div>
  );
}
