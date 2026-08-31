import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, IndianRupee, Package } from 'lucide-react';
import { PageHeader } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import { LoadingState, EmptyState } from '../../components/common/States';
import Button from '../../components/common/Button';
import deliveryApi from '../../services/deliveryApi';
import { formatINR, formatDateTime } from '../../utils/format';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

export default function DeliveryAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  const deliveryBoyId = user?.deliveryBoyId || 'd1';

  useEffect(() => { deliveryApi.assignments(deliveryBoyId).then((res) => setAssignments(res.items || res)); }, [deliveryBoyId]);

  if (!assignments) return <LoadingState label="Loading assignments…" />;

  const accept = async (o) => {
    await deliveryApi.acceptAssignment(o.id);
    toast.success(`Accepted delivery for ${o.id}`);
    navigate('/delivery/active');
  };

  if (assignments.length === 0) {
    return (
      <div>
        <PageHeader title="My Deliveries" />
        <EmptyState icon={Package} title="No delivery assigned" message="New assignments will appear here once orders are ready for pickup." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My Deliveries" subtitle={`${assignments.length} orders ready for pickup`} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {assignments.map((o) => (
          <div key={o.id} className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <strong style={{ fontSize: 15 }}>{o.id}</strong>
                  <StatusBadge status={o.status} />
                </div>
                <p style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>{o.customerName}</p>
                <p style={{ fontSize: 13, color: 'var(--gb-ink-600)', display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={13} /> {o.address}</p>
                <p style={{ fontSize: 13, color: 'var(--gb-ink-600)', display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}><Package size={13} /> {o.items.length} items • <IndianRupee size={12} /> {o.amount} • <StatusBadge status={o.paymentStatus} /></p>
                <p style={{ fontSize: 12, color: 'var(--gb-ink-400)', marginTop: 5 }}>Assigned {formatDateTime(o.placedAt)}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Button variant="accent" size="sm" onClick={() => accept(o)}>Accept</Button>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
