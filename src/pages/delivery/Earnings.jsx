import { useEffect, useState } from 'react';
import { Wallet, CalendarDays, CalendarRange, TrendingUp } from 'lucide-react';
import { PageHeader, StatCard } from '../../components/common/StatCard';
import { LoadingState } from '../../components/common/States';
import deliveryApi from '../../services/deliveryApi';
import { formatINR } from '../../utils/format';
import useAuth from '../../hooks/useAuth';

export default function DeliveryEarnings() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const deliveryBoyId = user?.deliveryBoyId || 'd1';

  useEffect(() => { deliveryApi.earnings(deliveryBoyId).then(setData); }, [deliveryBoyId]);

  if (!data) return <LoadingState label="Loading earnings…" />;

  const bars = [
    { label: 'Mon', v: 280 }, { label: 'Tue', v: 340 }, { label: 'Wed', v: 210 }, { label: 'Thu', v: 390 },
    { label: 'Fri', v: 460 }, { label: 'Sat', v: 520 }, { label: 'Sun', v: data.today },
  ];
  const max = Math.max(...bars.map((b) => b.v));

  return (
    <div>
      <PageHeader title="Earnings" subtitle="Your delivery income summary" />
      <div className="stat-grid">
        <StatCard icon={Wallet} label="Today's Earnings" value={formatINR(data.today)} />
        <StatCard icon={CalendarDays} label="Weekly Earnings" value={formatINR(data.weekly)} />
        <StatCard icon={CalendarRange} label="Monthly Earnings" value={formatINR(data.monthly)} />
        <StatCard icon={TrendingUp} label="Total Earnings" value={formatINR(data.total)} />
      </div>
      <div className="card panel">
        <div className="panel-title">This Week</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 180, padding: '10px 4px' }}>
          {bars.map((b) => (
            <div key={b.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: '100%', maxWidth: 34, height: `${(b.v / max) * 130}px`, background: 'linear-gradient(180deg, var(--gb-green-500), var(--gb-forest-700))', borderRadius: '8px 8px 4px 4px' }} title={formatINR(b.v)} />
              <span style={{ fontSize: 11.5, color: 'var(--gb-ink-400)', fontWeight: 600 }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
