import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageSearch, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../../components/common/Badge';
import { EmptyState, LoadingState } from '../../components/common/States';
import orderApi from '../../services/orderApi';
import { formatINR, formatDate } from '../../utils/format';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { orderApi.listMine().then((res) => { setOrders(res.items || res); setLoading(false); }); }, []);

  if (loading) return <LoadingState label="Loading your orders…" />;

  return (
    <div className="container section">
      <div className="page-header"><div><h1>My Orders</h1><p className="sub">Track and manage your orders</p></div></div>
      {orders.length === 0 ? (
        <EmptyState icon={PackageSearch} title="No orders yet" message="When you place an order, it'll show up here." actionLabel="Start Shopping" actionTo="/shop" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((o) => (
            <Link to={`/orders/${o.id}`} key={o.id} className="card card-hover" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <strong style={{ fontSize: 14.5 }}>{o.id}</strong>
                  <StatusBadge status={o.status} />
                </div>
                <span style={{ fontSize: 13, color: 'var(--gb-ink-600)' }}>{o.vendorName} • {o.items.length} item{o.items.length > 1 ? 's' : ''} • {formatDate(o.placedAt)}</span>
              </div>
              <strong style={{ fontSize: 15.5 }}>{formatINR(o.amount)}</strong>
              <ChevronRight size={18} color="var(--gb-ink-400)" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
