import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, Percent, Clock } from 'lucide-react';
import { PageHeader, StatCard } from '../../components/common/StatCard';
import { LoadingState } from '../../components/common/States';
import vendorPanelApi from '../../services/vendorPanelApi';
import { formatINR } from '../../utils/format';
import useAuth from '../../hooks/useAuth';

export default function VendorEarnings() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const vendorId = user?.vendorId || 'v1';

  useEffect(() => { vendorPanelApi.earnings(vendorId).then(setData); }, [vendorId]);

  if (!data) return <LoadingState label="Loading earnings…" />;

  const maxRevenue = Math.max(...data.salesTrend.map((d) => d.revenue));

  return (
    <div>
      <PageHeader title="Earnings" subtitle="Your sales, commission, and payout summary" />
      <div className="stat-grid">
        <StatCard icon={TrendingUp} label="Gross Sales" value={formatINR(data.grossSales)} />
        <StatCard icon={Percent} label="Commission Deducted" value={formatINR(data.commission)} />
        <StatCard icon={Wallet} label="Net Earnings" value={formatINR(data.netEarnings)} />
        <StatCard icon={Clock} label="Pending Payout" value={formatINR(data.pendingPayout)} />
      </div>
      <div className="card panel">
        <div className="panel-title">Weekly Sales Trend</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 200, padding: '10px 4px' }}>
          {data.salesTrend.map((d) => (
            <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: '100%', maxWidth: 40, height: `${(d.revenue / maxRevenue) * 150}px`, background: 'linear-gradient(180deg, var(--gb-green-500), var(--gb-forest-700))', borderRadius: '8px 8px 4px 4px' }} title={formatINR(d.revenue)} />
              <span style={{ fontSize: 11.5, color: 'var(--gb-ink-400)', fontWeight: 600 }}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
