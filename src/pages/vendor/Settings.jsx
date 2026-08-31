import { useState } from 'react';
import { PageHeader } from '../../components/common/StatCard';
import { TextField } from '../../components/common/FormField';
import Button from '../../components/common/Button';
import useToast from '../../hooks/useToast';

export default function VendorSettings() {
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const save = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => { setSaving(false); toast.success('Password changed successfully'); }, 500);
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account security" />
      <form className="card form-card" onSubmit={save} style={{ maxWidth: 480 }}>
        <TextField label="Current Password" type="password" required />
        <TextField label="New Password" type="password" required />
        <TextField label="Confirm New Password" type="password" required />
        <div className="form-actions"><Button variant="accent" loading={saving}>Change Password</Button></div>
      </form>
    </div>
  );
}
