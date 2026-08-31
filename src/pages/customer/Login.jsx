import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import Button from '../../components/common/Button';
import { TextField } from '../../components/common/FormField';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

const ROLE_HOME = { admin: '/admin/dashboard', customer: '/shop', vendor: '/vendor/dashboard', delivery_boy: '/delivery/dashboard' };
const DEMO = [
  { role: 'customer', email: 'customer@greenbasket.in' },
  { role: 'vendor', email: 'vendor@greenbasket.in' },
  { role: 'admin', email: 'admin@greenbasket.in' },
  { role: 'delivery', email: 'delivery@greenbasket.in' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const fillDemo = (email) => setForm({ email, password: 'demo1234' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.email) nextErrors.email = 'Email is required';
    if (!form.password) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      const from = location.state?.from;
      navigate(from && from !== '/login' ? from : ROLE_HOME[user.role] || '/', { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <div className="logo"><Leaf className="leaf" size={24} /> GreenBasket</div>
        <p className="auth-sub">Sign in to continue to your account</p>

        <div className="role-pills">
          {DEMO.map((d) => (
            <button type="button" key={d.role} className="role-pill" onClick={() => fillDemo(d.email)}>{d.role}</button>
          ))}
        </div>
        <p className="field-hint" style={{ marginBottom: 16, textAlign: 'center' }}>Tap a role above to try a demo login (any password works in demo mode)</p>

        <form onSubmit={handleSubmit} noValidate>
          <TextField label="Email address" type="email" placeholder="you@example.com" value={form.email} error={errors.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <TextField label="Password" type="password" placeholder="••••••••" value={form.password} error={errors.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18, marginTop: -8 }}>
            <Link to="/forgot-password" style={{ fontSize: 13, fontWeight: 600, color: 'var(--gb-green-600)' }}>Forgot password?</Link>
          </div>
          <Button type="submit" variant="accent" block loading={loading}>Sign In</Button>
        </form>

        <p className="auth-divider">Don't have an account? <Link to="/register" style={{ color: 'var(--gb-green-600)', fontWeight: 700 }}>Create one</Link></p>
      </div>
    </div>
  );
}
