import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import Button from '../../components/common/Button';
import { TextField } from '../../components/common/FormField';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

const ROLE_HOME = { admin: '/admin/dashboard', customer: '/shop', vendor: '/vendor/dashboard', delivery_boy: '/delivery/dashboard' };
const ROLES = [
  { value: 'customer', label: 'Customer' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'delivery_boy', label: 'Delivery Boy' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'customer' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name) nextErrors.name = 'Full name is required';
    if (!form.email) nextErrors.email = 'Email is required';
    if (!form.phone) nextErrors.phone = 'Phone number is required';
    if (!form.password || form.password.length < 6) nextErrors.password = 'Minimum 6 characters';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const user = await register(form);
      toast.success('Account created successfully');
      navigate(ROLE_HOME[user.role] || '/', { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <div className="logo"><Leaf className="leaf" size={24} /> GreenBasket</div>
        <p className="auth-sub">Create your account to get started</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="role-pills">
            {ROLES.map((r) => (
              <button type="button" key={r.value} className={`role-pill ${form.role === r.value ? 'active' : ''}`} onClick={() => setForm((f) => ({ ...f, role: r.value }))}>
                {r.label}
              </button>
            ))}
          </div>
          <TextField label="Full name" placeholder="Priya Verma" value={form.name} error={errors.name} onChange={set('name')} />
          <TextField label="Email address" type="email" placeholder="you@example.com" value={form.email} error={errors.email} onChange={set('email')} />
          <TextField label="Phone number" type="tel" placeholder="+91 98765 43210" value={form.phone} error={errors.phone} onChange={set('phone')} />
          <TextField label="Password" type="password" placeholder="At least 6 characters" value={form.password} error={errors.password} onChange={set('password')} />
          <Button type="submit" variant="accent" block loading={loading}>Create Account</Button>
        </form>

        <p className="auth-divider">Already have an account? <Link to="/login" style={{ color: 'var(--gb-green-600)', fontWeight: 700 }}>Sign in</Link></p>
      </div>
    </div>
  );
}
