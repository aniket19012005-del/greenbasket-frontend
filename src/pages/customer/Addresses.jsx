import { useState } from 'react';
import { MapPin, Plus, Pencil, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { TextField } from '../../components/common/FormField';
import { EmptyState } from '../../components/common/States';
import useToast from '../../hooks/useToast';
import { currentUserSeed } from '../../data/seedData';

export default function Addresses() {
  const toast = useToast();
  const [addresses, setAddresses] = useState(currentUserSeed.addresses);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ label: '', line: '', city: '', pincode: '' });

  const removeAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.show('Address removed');
  };

  const saveAddress = (e) => {
    e.preventDefault();
    setAddresses((prev) => [...prev, { ...form, id: `a-${Date.now()}`, isDefault: prev.length === 0 }]);
    setForm({ label: '', line: '', city: '', pincode: '' });
    setModalOpen(false);
    toast.success('Address added successfully');
  };

  return (
    <div className="container section">
      <div className="page-header">
        <div><h1>Saved Addresses</h1><p className="sub">Manage your delivery addresses</p></div>
        <Button variant="accent" icon={Plus} onClick={() => setModalOpen(true)}>Add Address</Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState icon={MapPin} title="No addresses saved" message="Add an address to make checkout faster." actionLabel="Add Address" onAction={() => setModalOpen(true)} />
      ) : (
        <div className="grid-2">
          {addresses.map((a) => (
            <div key={a.id} className="card" style={{ padding: 18, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong style={{ fontSize: 14.5 }}>{a.label}</strong>
                  {a.isDefault && <span className="badge badge-green">Default</span>}
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--gb-ink-600)', marginTop: 6 }}>{a.line}, {a.city} - {a.pincode}</p>
              </div>
              <div className="row-actions">
                <button className="icon-btn" aria-label="Edit address"><Pencil size={15} /></button>
                <button className="icon-btn" onClick={() => removeAddress(a.id)} aria-label="Delete address"><Trash2 size={15} color="var(--gb-red)" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Address">
        <form onSubmit={saveAddress}>
          <TextField label="Label" placeholder="Home, Office..." required value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} />
          <TextField label="Address Line" required value={form.line} onChange={(e) => setForm((f) => ({ ...f, line: e.target.value }))} />
          <div className="form-grid">
            <TextField label="City" required value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
            <TextField label="Pincode" required value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))} />
          </div>
          <div className="form-actions"><Button type="submit" variant="accent">Save Address</Button></div>
        </form>
      </Modal>
    </div>
  );
}
