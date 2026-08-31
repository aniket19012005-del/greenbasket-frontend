import { useEffect, useState } from 'react';
import { Phone, MapPin, Navigation, Package } from 'lucide-react';
import { PageHeader } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import { LoadingState, EmptyState } from '../../components/common/States';
import Button from '../../components/common/Button';
import deliveryApi from '../../services/deliveryApi';
import { formatINR } from '../../utils/format';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

const FLOW = ['confirmed', 'accepted', 'picked_up', 'out_for_delivery', 'delivered'];
const NEXT_LABEL = { confirmed: 'Accept Delivery', accepted: 'Mark Picked Up', picked_up: 'Start Delivery', out_for_delivery: 'Mark Delivered' };
const NEXT_STATUS = { confirmed: 'accepted', accepted: 'picked_up', picked_up: 'out_for_delivery', out_for_delivery: 'delivered' };

export default function DeliveryActive() {
  const { user } = useAuth();
  const [order, setOrder] = useState(undefined);
  const toast = useToast();
  const deliveryBoyId = user?.deliveryBoyId || 'd1';

  useEffect(() => { deliveryApi.activeDelivery(deliveryBoyId).then(setOrder); }, [deliveryBoyId]);

  if (order === undefined) return <LoadingState label="Loading active delivery…" />;
  if (!order) return (
    <div>
      <PageHeader title="Active Delivery" />
      <EmptyState icon={Navigation} title="No active delivery" message="Accept an assignment to start a delivery." />
    </div>
  );

  const advance = async () => {
    const next = NEXT_STATUS[order.status] || 'delivered';
    await deliveryApi.updateDeliveryStatus(order.id, next);
    setOrder((o) => ({ ...o, status: next }));
    toast.success(next === 'delivered' ? 'Delivery completed!' : `Marked as ${next.replace('_', ' ')}`);
  };

  const currentIdx = FLOW.indexOf(order.status === 'confirmed' ? 'confirmed' : order.status);

  return (
    <div>
      <PageHeader title="Active Delivery" subtitle={order.id} actions={<StatusBadge status={order.status} />} />

      <div className="grid-2" style={{ alignItems: 'flex-start' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ height: 220, background: 'linear-gradient(135deg, var(--gb-green-100), var(--gb-mint-50))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, color: 'var(--gb-forest-700)' }}>
            <MapPin size={30} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Map integration ready — live tracking will render here</span>
          </div>
          <div style={{ padding: 20 }}>
            <p style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 6 }}>{order.customerName}</p>
            <p style={{ fontSize: 13.5, color: 'var(--gb-ink-600)', display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={14} /> {order.address}</p>
            <p style={{ fontSize: 13.5, color: 'var(--gb-ink-600)', display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}><Phone size={14} /> {order.deliveryBoy?.phone || '+91 98765 43210'}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14.5, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Package size={15} /> Order Items</h3>
            {order.items.map((i) => <div key={i.productId} className="summary-row"><span>{i.name} × {i.qty}</span><span>{formatINR(i.price * i.qty)}</span></div>)}
            <div className="summary-row total"><span>Total</span><span>{formatINR(order.amount)}</span></div>
            <div className="summary-row"><span>Payment</span><StatusBadge status={order.paymentStatus} /></div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14.5, marginBottom: 14 }}>Delivery Progress</h3>
            <div className="chip-row" style={{ marginBottom: 16 }}>
              {FLOW.map((s, i) => (
                <span key={s} className={`chip ${i <= currentIdx ? 'active' : ''}`} style={{ cursor: 'default' }}>{s.replace('_', ' ')}</span>
              ))}
            </div>
            {order.status !== 'delivered' && (
              <Button variant="accent" block onClick={advance}>{NEXT_LABEL[order.status] || 'Mark Delivered'}</Button>
            )}
            {order.status === 'delivered' && <p style={{ color: 'var(--gb-green-600)', fontWeight: 700, fontSize: 14 }}>✓ Delivery completed successfully</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
