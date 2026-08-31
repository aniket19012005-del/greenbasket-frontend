import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, MailCheck } from 'lucide-react';
import Button from '../../components/common/Button';
import { TextField } from '../../components/common/FormField';
import authApi from '../../services/authApi';
import useToast from '../../hooks/useToast';

export default function ForgotPassword() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <div className="logo"><Leaf className="leaf" size={24} /> GreenBasket</div>
        {sent ? (
          <div className="state-block" style={{ padding: '24px 0' }}>
            <div className="state-icon"><MailCheck size={26} /></div>
            <h3>Check your inbox</h3>
            <p>If an account exists for {email}, we've sent a password reset link.</p>
            <Link to="/login"><Button variant="outline" size="sm">Back to login</Button></Link>
          </div>
        ) : (
          <>
            <p className="auth-sub">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} noValidate>
              <TextField label="Email address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button type="submit" variant="accent" block loading={loading}>Send Reset Link</Button>
            </form>
            <p className="auth-divider"><Link to="/login" style={{ color: 'var(--gb-green-600)', fontWeight: 700 }}>Back to login</Link></p>
          </>
        )}
      </div>
    </div>
  );
}
