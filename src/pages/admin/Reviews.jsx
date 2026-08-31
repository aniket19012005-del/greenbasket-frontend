import { useEffect, useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/common/StatCard';
import { LoadingState, EmptyState } from '../../components/common/States';
import adminApi from '../../services/adminApi';
import { formatDate } from '../../utils/format';
import useToast from '../../hooks/useToast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState(null);
  const toast = useToast();

  useEffect(() => { adminApi.reviews().then((res) => setReviews(res.items || res)); }, []);

  if (!reviews) return <LoadingState label="Loading reviews…" />;

  const remove = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast.show('Review removed');
  };

  return (
    <div>
      <PageHeader title="Reviews" subtitle={`${reviews.length} customer reviews`} />
      {reviews.length === 0 ? <EmptyState title="No reviews yet" /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reviews.map((r) => (
            <div key={r.id} className="card" style={{ padding: 18, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <strong style={{ fontSize: 14 }}>{r.customerName}</strong>
                  <span style={{ fontSize: 12, color: 'var(--gb-ink-400)' }}>on {r.productName} • {formatDate(r.date)}</span>
                </div>
                <span style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill={i < r.rating ? 'var(--gb-gold)' : 'none'} color="var(--gb-gold)" />)}
                </span>
                <p style={{ fontSize: 13.5, color: 'var(--gb-ink-600)' }}>{r.comment}</p>
              </div>
              <button className="icon-btn" onClick={() => remove(r.id)} aria-label="Remove review"><Trash2 size={16} color="var(--gb-red)" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
