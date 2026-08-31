import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/StatCard';
import { TextField, TextAreaField } from '../../components/common/FormField';
import Button from '../../components/common/Button';
import { LoadingState } from '../../components/common/States';
import vendorPanelApi from '../../services/vendorPanelApi';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

export default function VendorStore() {
  const { user } = useAuth();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const vendorId = user?.vendorId || 'v1';

  useEffect(() => { vendorPanelApi.storeProfile(vendorId).then(setForm); }, [vendorId]);

  if (!form) return <LoadingState label="Loading store profile…" />;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    await vendorPanelApi.saveStoreProfile(form);
    setSaving(false);
    toast.success('Store profile updated successfully');
  };

  return (
    <div>
      <PageHeader title="Store Profile" subtitle="How customers see your store on GreenBasket" />
      <div className="grid-2" style={{ gridTemplateColumns: '1.4fr 1fr', alignItems: 'flex-start' }}>
        <form className="card form-card" onSubmit={save}>
          <div className="form-grid">
            <TextField className="full" label="Business Name" value={form.name} onChange={set('name')} />
            <TextAreaField className="full" label="Description" value={form.about} onChange={set('about')} />
            <TextField label="Phone" value={form.phone} onChange={set('phone')} />
            <TextField label="Email" type="email" value={form.email} onChange={set('email')} />
            <TextField className="full" label="Address" value={form.address} onChange={set('address')} />
          </div>
          <div className="form-actions"><Button variant="accent" loading={saving}>Save Changes</Button></div>
        </form>

        <div className="card" style={{ padding: 20 }}>
          <div className="live-preview-note">Store preview</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--gb-green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{form.logo}</div>
            <div><strong>{form.name}</strong><br /><span style={{ fontSize: 12, color: 'var(--gb-ink-400)' }}>{form.deliveryInfo}</span></div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--gb-ink-600)', lineHeight: 1.6 }}>{form.about}</p>
        </div>
      </div>
    </div>
  );
}
