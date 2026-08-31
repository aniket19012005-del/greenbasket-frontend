import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/StatCard';
import { TextField, SelectField } from '../../components/common/FormField';
import Button from '../../components/common/Button';
import { LoadingState } from '../../components/common/States';
import deliveryApi from '../../services/deliveryApi';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { initials } from '../../utils/format';

export default function DeliveryProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const deliveryBoyId = user?.deliveryBoyId || 'd1';

  useEffect(() => { deliveryApi.profile(deliveryBoyId).then((d) => setForm({ ...d, online: d.online })); }, [deliveryBoyId]);

  if (!form) return <LoadingState label="Loading profile…" />;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleOnline = async () => {
    const online = !form.online;
    await deliveryApi.toggleOnline(online);
    setForm((f) => ({ ...f, online }));
    toast.success(online ? "You're now online" : "You're now offline");
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    await deliveryApi.saveProfile(form);
    setSaving(false);
    toast.success('Profile updated successfully');
  };

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your delivery partner details"
        actions={<Button variant={form.online ? 'accent' : 'outline'} onClick={toggleOnline}>{form.online ? '● Online' : '○ Offline'} — Tap to toggle</Button>} />

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 1.4fr', alignItems: 'flex-start' }}>
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <div className="avatar" style={{ width: 80, height: 80, fontSize: 26, margin: '0 auto 14px' }}>{initials(form.name)}</div>
          <h3 style={{ fontSize: 17 }}>{form.name}</h3>
          <p style={{ fontSize: 13, color: 'var(--gb-ink-400)', marginTop: 4 }}>{form.vehicle} • {form.vehicleNumber}</p>
        </div>

        <form className="card form-card" onSubmit={save}>
          <div className="form-grid">
            <TextField label="Full Name" value={form.name} onChange={set('name')} />
            <TextField label="Phone" value={form.phone} onChange={set('phone')} />
            <SelectField label="Vehicle Type" value={form.vehicle} onChange={set('vehicle')} options={['Bike', 'Cycle', 'Scooter', 'Van'].map((v) => ({ value: v, label: v }))} />
            <TextField label="Vehicle Number" value={form.vehicleNumber} onChange={set('vehicleNumber')} />
            <TextField className="full" label="Service Area" value="North Delhi, Sonipat" onChange={() => {}} />
          </div>
          <div className="form-actions"><Button variant="accent" loading={saving}>Save Changes</Button></div>
        </form>
      </div>
    </div>
  );
}
