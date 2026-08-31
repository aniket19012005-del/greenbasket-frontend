import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { User, MapPin, ClipboardList, Heart, CreditCard, Settings } from 'lucide-react';
import { TextField } from '../../components/common/FormField';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { initials } from '../../utils/format';

const TABS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'orders', label: 'Orders', icon: ClipboardList, to: '/orders' },
  { key: 'wishlist', label: 'Wishlist', icon: Heart, to: '/wishlist' },
  { key: 'addresses', label: 'Addresses', icon: MapPin, to: '/addresses' },
  { key: 'payments', label: 'Payments', icon: CreditCard },
  { key: 'settings', label: 'Account Settings', icon: Settings },
];

export default function Profile() {
  const { user } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '+91 98765 43210' });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => { setSaving(false); toast.success('Profile updated successfully'); }, 500);
  };

  return (
    <div className="container section">
      <div className="page-header"><div><h1>My Account</h1><p className="sub">Manage your profile and preferences</p></div></div>

      <div className="grid-2" style={{ gridTemplateColumns: '260px 1fr', alignItems: 'flex-start' }}>
        <div className="card" style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px 18px', borderBottom: '1px solid var(--gb-line)', marginBottom: 10 }}>
            <div className="avatar" style={{ width: 44, height: 44 }}>{initials(user?.name)}</div>
            <div><strong style={{ fontSize: 14 }}>{user?.name}</strong><br /><span style={{ fontSize: 12, color: 'var(--gb-ink-400)' }}>{user?.email}</span></div>
          </div>
          {TABS.map((t) => t.to ? (
            <NavLink key={t.key} to={t.to} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, fontSize: 13.8, fontWeight: 600, color: 'var(--gb-ink-600)' }}>
              <t.icon size={16} /> {t.label}
            </NavLink>
          ) : (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, fontSize: 13.8, fontWeight: 600, background: activeTab === t.key ? 'var(--gb-green-100)' : 'transparent', color: activeTab === t.key ? 'var(--gb-forest-700)' : 'var(--gb-ink-600)' }}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        <div className="card form-card">
          {activeTab === 'profile' && (
            <form onSubmit={save}>
              <div className="form-grid">
                <TextField label="Full Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                <TextField label="Email Address" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                <TextField label="Phone Number" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="form-actions"><Button variant="accent" loading={saving}>Save Changes</Button></div>
            </form>
          )}
          {activeTab === 'payments' && (
            <div style={{ color: 'var(--gb-ink-600)', fontSize: 14 }}>Your saved payment methods (via Razorpay) will appear here after your first order.</div>
          )}
          {activeTab === 'settings' && (
            <form onSubmit={(e) => { e.preventDefault(); toast.success('Password changed successfully'); }}>
              <div className="form-grid">
                <TextField label="Current Password" type="password" className="full" />
                <TextField label="New Password" type="password" />
                <TextField label="Confirm New Password" type="password" />
              </div>
              <div className="form-actions"><Button variant="accent">Change Password</Button></div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
