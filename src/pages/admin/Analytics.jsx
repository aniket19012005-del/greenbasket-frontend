import { useEffect, useState } from 'react';
import { PageHeader, StatCard } from '../../components/common/StatCard';
import { LoadingState } from '../../components/common/States';
import { TrendingUp, ShoppingBag, Users, Percent, Bike } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { formatINR } from '../../utils/format';

const RANGES = [
  { key: 'today', label: 'Today' }, { key: '7d', label: '7 Days' }, { key: '30d', label: '30 Days' },
  { key: '3m', label: '3 Months' }, { key: '1y', label: '1 Year' },
];

export default function AdminAnalytics() {
  const [range, setRange] = useState('7d');
  const [data, setData] = useState(null);

  useEffect(() => { setData(null); adminApi.analytics(range).then(setData); }, [range]);

  const maxRevenue = data ? Math.max(...data.salesTrend.map((d) => d.revenue)) : 1;

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Platform performance over time"
        actions={<div className="chip-row">{RANGES.map((r) => <button key={r.key} className={`chip ${range === r.key ? 'active' : ''}`} onClick={() => setRange(r.key)}>{r.label}</button>)}</div>} />

      {!data ? <LoadingState label="Crunching numbers…" /> : (
        <>
          <div className="stat-grid">
            <StatCard icon={TrendingUp} label="Revenue" value={formatINR(data.salesTrend.reduce((s, d) => s + d.revenue, 0))} />
            <StatCard icon={ShoppingBag} label="Orders" value={data.salesTrend.reduce((s, d) => s + d.orders, 0)} />
            <StatCard icon={Percent} label="Commission Earned" value={formatINR(data.commissionEarned)} />
            <StatCard icon={Bike} label="On-Time Delivery" value={`${data.deliveryOnTimeRate}%`} />
          </div>

          <div className="card panel">
            <div className="panel-title">Revenue Trend</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 200, padding: '10px 4px' }}>
              {data.salesTrend.map((d) => (
                <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: '100%', maxWidth: 40, height: `${(d.revenue / maxRevenue) * 150}px`, background: 'linear-gradient(180deg, var(--gb-green-500), var(--gb-forest-700))', borderRadius: '8px 8px 4px 4px', transition: 'height 300ms ease' }} title={formatINR(d.revenue)} />
                  <span style={{ fontSize: 11.5, color: 'var(--gb-ink-400)', fontWeight: 600 }}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
