import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { PageHeader } from '../../components/common/StatCard';
import { LoadingState, EmptyState } from '../../components/common/States';
import adminApi from '../../services/adminApi';
import { formatDate } from '../../utils/format';
import useAuth from '../../hooks/useAuth';

export default function VendorReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(null);
  const vendorId = user?.vendorId || 'v1';

  useEffect(() => { adminApi.reviews().then((res) => setReviews((res.items || res).filter((r) => r.vendorId === vendorId))); }, [vendorId]);

  if (!reviews) return <LoadingState label="Loading reviews…" />;

  return (
    <div>
      <PageHeader title="Reviews" subtitle="What customers are saying about your store" />
      {reviews.length === 0 ? <EmptyState title="No reviews yet" message="Reviews from your customers will show up here." /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reviews.map((r) => (
            <div key={r.id} className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <strong style={{ fontSize: 14 }}>{r.customerName}</strong>
                <span style={{ fontSize: 12, color: 'var(--gb-ink-400)' }}>on {r.productName} • {formatDate(r.date)}</span>
              </div>
              <span style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill={i < r.rating ? 'var(--gb-gold)' : 'none'} color="var(--gb-gold)" />)}
              </span>
              <p style={{ fontSize: 13.5, color: 'var(--gb-ink-600)' }}>{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
