import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Phone, MapPin, Bike } from 'lucide-react';
import { StatusBadge } from '../../components/common/Badge';
import { LoadingState, ErrorState } from '../../components/common/States';
import OrderTimeline from '../../components/customer/OrderTimeline';
import orderApi from '../../services/orderApi';
import { formatINR, formatDateTime } from '../../utils/format';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    orderApi.getById(id).then((o) => active && (setOrder(o), setStatus('ready'))).catch(() => active && setStatus('error'));
    return () => { active = false; };
  }, [id]);

  if (status === 'loading') return <LoadingState label="Loading order…" />;
  if (status === 'error' || !order) return <ErrorState title="Order not found" onRetry={() => navigate('/orders')} />;

  return (
    <div className="container section">
      <div className="page-header">
        <div>
          <h1>{order.id}</h1>
          <p className="sub">Placed on {formatDateTime(order.placedAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid-2" style={{ alignItems: 'flex-start' }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, marginBottom: 20 }}>Order Status</h3>
          <OrderTimeline status={order.status} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14.5, marginBottom: 12 }}>Items from {order.vendorName}</h3>
            {order.items.map((i) => (
              <div key={i.productId} className="summary-row"><span>{i.name} × {i.qty}</span><span>{formatINR(i.price * i.qty)}</span></div>
            ))}
            <div className="summary-row total"><span>Total</span><span>{formatINR(order.amount)}</span></div>
            <div className="summary-row"><span>Payment</span><StatusBadge status={order.paymentStatus} /></div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14.5, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={15} /> Delivery Address</h3>
            <p style={{ fontSize: 13.5, color: 'var(--gb-ink-600)' }}>{order.address}</p>
          </div>

          {order.deliveryBoy && (
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 14.5, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><Bike size={15} /> Delivery Partner</h3>
              <p style={{ fontSize: 13.5, fontWeight: 700 }}>{order.deliveryBoy.name}</p>
              <p style={{ fontSize: 13, color: 'var(--gb-ink-600)', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}><Phone size={13} /> {order.deliveryBoy.phone}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
