import { Link } from 'react-router-dom';
import { PackageOpen, AlertTriangle, SearchX, ShieldAlert, Loader2 } from 'lucide-react';
import Button from './Button';

export function Skeleton({ width = '100%', height = 16, radius = 8, className = '', style = {} }) {
  return <div className={`skeleton ${className}`} style={{ width, height, borderRadius: radius, ...style }} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <Skeleton height={0} radius={0} className="skeleton" style={{ aspectRatio: '1/0.85' }} />
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton width="50%" height={11} />
        <Skeleton width="80%" height={15} />
        <Skeleton width="60%" height={18} />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: 'flex', gap: 16 }}>
          {Array.from({ length: cols }).map((__, c) => <Skeleton key={c} height={14} />)}
        </div>
      ))}
    </div>
  );
}

export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="state-block" role="status">
      <Loader2 className="spinner spinner-dark" size={30} style={{ width: 30, height: 30 }} />
      <p>{label}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon = PackageOpen, title = 'Nothing here yet', message, actionLabel, onAction, actionTo }) {
  return (
    <div className="state-block">
      <div className="state-icon"><Icon size={30} /></div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {actionLabel && actionTo && <Link to={actionTo}><Button variant="accent" size="sm">{actionLabel}</Button></Link>}
      {actionLabel && onAction && !actionTo && <Button variant="accent" size="sm" onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', message = 'Please try again in a moment.', onRetry }) {
  return (
    <div className="state-block error">
      <div className="state-icon"><AlertTriangle size={28} /></div>
      <h3>{title}</h3>
      <p>{message}</p>
      {onRetry && <Button variant="outline" size="sm" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

export function NotFound() {
  return (
    <div className="state-block" style={{ minHeight: '60vh' }}>
      <div className="state-icon"><SearchX size={30} /></div>
      <h3>Page not found</h3>
      <p>The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/"><Button variant="accent" size="sm">Go to homepage</Button></Link>
    </div>
  );
}

export function AccessDenied() {
  return (
    <div className="state-block" style={{ minHeight: '60vh' }}>
      <div className="state-icon" style={{ background: '#FBEAE6', color: 'var(--gb-red)' }}><ShieldAlert size={30} /></div>
      <h3>Access denied</h3>
      <p>You don't have permission to view this page. Sign in with the right account to continue.</p>
      <Link to="/login"><Button variant="accent" size="sm">Back to login</Button></Link>
    </div>
  );
}
