import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function StatCard({ icon: Icon, label, value, delta, deltaDirection = 'up' }) {
  return (
    <div className="card stat-card">
      <div className="stat-top">
        {Icon && <div className="stat-icon"><Icon size={19} /></div>}
        {delta != null && (
          <span className={`stat-delta ${deltaDirection}`}>
            {deltaDirection === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {delta}
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="sub">{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 10 }}>{actions}</div>}
    </div>
  );
}

export default StatCard;
