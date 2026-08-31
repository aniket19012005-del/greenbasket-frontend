import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import Button from '../../components/common/Button';
import { TextField } from '../../components/common/FormField';
import authApi from '../../services/authApi';
import useToast from '../../hooks/useToast';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return setError('Minimum 6 characters');
    if (password !== confirm) return setError('Passwords do not match');
    setError('');
    setLoading(true);
    try {
      await authApi.resetPassword(params.get('token'), password);
      toast.success('Password reset successfully. Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err?.message || 'Reset link is invalid or expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <div className="logo"><Leaf className="leaf" size={24} /> GreenBasket</div>
        <p className="auth-sub">Choose a new password for your account</p>
        <form onSubmit={handleSubmit} noValidate>
          <TextField label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={error && !confirm ? error : ''} />
          <TextField label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={error} />
          <Button type="submit" variant="accent" block loading={loading}>Reset Password</Button>
        </form>
        <p className="auth-divider"><Link to="/login" style={{ color: 'var(--gb-green-600)', fontWeight: 700 }}>Back to login</Link></p>
      </div>
    </div>
  );
}
