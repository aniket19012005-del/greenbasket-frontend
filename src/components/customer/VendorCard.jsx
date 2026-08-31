import { useNavigate } from 'react-router-dom';
import { Star, Truck, Package } from 'lucide-react';
import Badge from '../common/Badge';

export default function VendorCard({ vendor }) {
  const navigate = useNavigate();
  return (
    <div className="card card-hover" style={{ padding: 20, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10 }} onClick={() => navigate(`/vendor/${vendor.id}`)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--gb-green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{vendor.logo}</div>
        <div>
          <h4 style={{ fontSize: 15.5 }}>{vendor.name}</h4>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--gb-ink-600)' }}>
            <Star size={12} fill="var(--gb-gold)" color="var(--gb-gold)" /> {vendor.rating} rating
          </span>
        </div>
      </div>
      <p style={{ fontSize: 13, color: 'var(--gb-ink-600)', lineHeight: 1.5 }}>{vendor.about}</p>
      <div style={{ display: 'flex', gap: 14, fontSize: 12.5, color: 'var(--gb-ink-600)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Truck size={13} /> {vendor.deliveryInfo}</span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Badge tone="green"><Package size={11} /> {vendor.products} products</Badge>
      </div>
    </div>
  );
}
