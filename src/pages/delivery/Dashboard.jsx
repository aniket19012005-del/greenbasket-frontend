import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ListChecks, CheckCircle2, Wallet, TrendingUp, MapPin, Phone } from 'lucide-react';
import { PageHeader, StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/States';
import Button from '../../components/common/Button';
import deliveryApi from '../../services/deliveryApi';
import { formatINR } from '../../utils/format';
import useAuth from '../../hooks/useAuth';

export default function DeliveryDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const deliveryBoyId = user?.deliveryBoyId || 'd1';

  useEffect(() => { deliveryApi.dashboard(deliveryBoyId).then(setData); }, [deliveryBoyId]);

  if (!data) return <LoadingState label="Loading your dashboard…" />;

  return (
    <div>
      <PageHeader title={`Hi, ${user?.name?.split(' ')[0] || 'Partner'}`} subtitle={data.online ? "You're online and ready for deliveries" : "You're currently offline"} />

      <div className="stat-grid">
        <StatCard icon={ListChecks} label="Today's Deliveries" value={data.todayDeliveries} />
        <StatCard icon={ListChecks} label="Pending" value={data.pending} />
        <StatCard icon={CheckCircle2} label="Completed" value={data.completed} />
        <StatCard icon={Wallet} label="Today's Earnings" value={formatINR(data.todayEarnings)} />
        <StatCard icon={TrendingUp} label="Total Earnings" value={formatINR(data.totalEarnings)} />
      </div>

      {data.activeDelivery ? (
        <div className="card panel">
          <div className="panel-title">Active Delivery</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <strong style={{ fontSize: 15 }}>{data.activeDelivery.id}</strong>
                <StatusBadge status={data.activeDelivery.status} />
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--gb-ink-600)', display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={14} /> {data.activeDelivery.address}</p>
              <p style={{ fontSize: 13.5, color: 'var(--gb-ink-600)', display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}><Phone size={14} /> {data.activeDelivery.customerName}</p>
            </div>
            <Link to="/delivery/active"><Button variant="accent">Continue Delivery</Button></Link>
          </div>
        </div>
      ) : (
        <div className="card panel" style={{ textAlign: 'center', padding: 30 }}>
          <p style={{ color: 'var(--gb-ink-600)', marginBottom: 12 }}>No active delivery right now.</p>
          <Link to="/delivery/assignments"><Button variant="outline">View Assignments</Button></Link>
        </div>
      )}
    </div>
  );
}
