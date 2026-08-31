import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { TextField, SelectField } from '../../components/common/FormField';
import { LoadingState } from '../../components/common/States';
import adminApi from '../../services/adminApi';
import useToast from '../../hooks/useToast';

const emptyCoupon = { code: '', discountType: 'percent', discountValue: '', minOrder: '', maxDiscount: '', expiry: '', usageLimit: '', active: true };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyCoupon);
  const toast = useToast();

  useEffect(() => { adminApi.coupons().then((res) => setCoupons(res.items || res)); }, []);

  if (!coupons) return <LoadingState label="Loading coupons…" />;

  const save = async (e) => {
    e.preventDefault();
    const saved = await adminApi.saveCoupon(form);
    setCoupons((prev) => [...prev, { ...saved, used: 0 }]);
    setForm(emptyCoupon);
    setModalOpen(false);
    toast.success('Coupon created successfully');
  };

  const remove = async (id) => {
    await adminApi.deleteCoupon(id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.show('Coupon deleted');
  };

  const columns = [
    { key: 'code', label: 'Code', sortable: true, render: (r) => <strong>{r.code}</strong> },
    { key: 'discountType', label: 'Type', render: (r) => r.discountType === 'percent' ? `${r.discountValue}%` : `₹${r.discountValue}` },
    { key: 'minOrder', label: 'Min Order', render: (r) => `₹${r.minOrder}` },
    { key: 'maxDiscount', label: 'Max Discount', render: (r) => `₹${r.maxDiscount}` },
    { key: 'expiry', label: 'Expiry' },
    { key: 'used', label: 'Usage', render: (r) => `${r.used}/${r.usageLimit}` },
    { key: 'active', label: 'Status', render: (r) => <Badge tone={r.active ? 'green' : 'gray'}>{r.active ? 'Active' : 'Inactive'}</Badge> },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="row-actions">
        <button className="icon-btn" aria-label="Edit"><Pencil size={15} /></button>
        <button className="icon-btn" onClick={() => remove(r.id)} aria-label="Delete"><Trash2 size={15} color="var(--gb-red)" /></button>
      </div>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Coupons" subtitle={`${coupons.length} coupons`} actions={<Button variant="accent" icon={Plus} onClick={() => setModalOpen(true)}>Create Coupon</Button>} />
      <div className="card" style={{ padding: 18 }}>
        <DataTable columns={columns} rows={coupons} searchKeys={['code']} emptyTitle="No coupons yet" />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Coupon" width={520}>
        <form onSubmit={save}>
          <div className="form-grid">
            <TextField label="Coupon Code" className="full" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} required />
            <SelectField label="Discount Type" value={form.discountType} onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value }))}
              options={[{ value: 'percent', label: 'Percentage' }, { value: 'flat', label: 'Flat Amount' }]} />
            <TextField label="Discount Value" type="number" value={form.discountValue} onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))} required />
            <TextField label="Minimum Order (₹)" type="number" value={form.minOrder} onChange={(e) => setForm((f) => ({ ...f, minOrder: e.target.value }))} />
            <TextField label="Maximum Discount (₹)" type="number" value={form.maxDiscount} onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value }))} />
            <TextField label="Expiry Date" type="date" value={form.expiry} onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))} />
            <TextField label="Usage Limit" type="number" value={form.usageLimit} onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, marginTop: 10 }}>
              <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} /> Active
            </label>
          </div>
          <div className="form-actions"><Button type="submit" variant="accent">Save Coupon</Button></div>
        </form>
      </Modal>
    </div>
  );
}
