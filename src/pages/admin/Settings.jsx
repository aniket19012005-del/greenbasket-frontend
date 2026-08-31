import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/StatCard';
import { TextField } from '../../components/common/FormField';
import Button from '../../components/common/Button';
import { LoadingState } from '../../components/common/States';
import adminApi from '../../services/adminApi';
import useToast from '../../hooks/useToast';

export default function AdminSettings() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => { adminApi.settings().then(setForm); }, []);

  if (!form) return <LoadingState label="Loading settings…" />;

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    await adminApi.saveSettings(form);
    setSaving(false);
    toast.success('Settings saved successfully');
  };

  return (
    <div>
      <PageHeader title="Platform Settings" subtitle="Global configuration for GreenBasket" />
      <form className="card form-card" onSubmit={save} style={{ maxWidth: 560 }}>
        <div className="form-grid">
          <TextField className="full" label="Platform Name" value={form.platformName} onChange={(e) => setForm((f) => ({ ...f, platformName: e.target.value }))} />
          <TextField className="full" label="Support Email" type="email" value={form.supportEmail} onChange={(e) => setForm((f) => ({ ...f, supportEmail: e.target.value }))} />
          <TextField label="Default Vendor Commission (%)" type="number" value={form.defaultCommission} onChange={(e) => setForm((f) => ({ ...f, defaultCommission: e.target.value }))} />
          <TextField label="Default Delivery Fee (₹)" type="number" value={form.deliveryFee} onChange={(e) => setForm((f) => ({ ...f, deliveryFee: e.target.value }))} />
        </div>
        <div className="form-actions"><Button variant="accent" loading={saving}>Save Settings</Button></div>
      </form>
    </div>
  );
}
