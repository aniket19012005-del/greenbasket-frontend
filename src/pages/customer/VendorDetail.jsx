import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, Truck, MapPin } from 'lucide-react';
import ProductCard from '../../components/customer/ProductCard';
import { LoadingState, ErrorState, EmptyState, ProductCardSkeleton } from '../../components/common/States';
import vendorApi from '../../services/vendorApi';
import productApi from '../../services/productApi';

export default function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    vendorApi.getById(id)
      .then((v) => { if (active) { setVendor(v); setStatus('ready'); } })
      .catch(() => active && setStatus('error'));
    productApi.list({ vendorId: id }).then((res) => active && (setProducts(res.items || res), setProductsLoading(false)));
    return () => { active = false; };
  }, [id]);

  if (status === 'loading') return <LoadingState label="Loading vendor…" />;
  if (status === 'error' || !vendor) return <ErrorState title="Vendor not found" onRetry={() => navigate('/vendors')} />;

  return (
    <div>
      <div style={{ background: 'var(--gb-green-100)', padding: '40px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 84, height: 84, borderRadius: 22, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, boxShadow: 'var(--shadow-md)' }}>{vendor.logo}</div>
          <div>
            <h1 style={{ fontSize: 26 }}>{vendor.name}</h1>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap', fontSize: 13.5, color: 'var(--gb-ink-600)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}><Star size={14} fill="var(--gb-gold)" color="var(--gb-gold)" /> {vendor.rating} rating</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Truck size={14} /> {vendor.deliveryInfo}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {vendor.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container section">
        <div className="card" style={{ padding: 20, marginBottom: 28 }}>
          <h3 style={{ fontSize: 15.5, marginBottom: 8 }}>About {vendor.name}</h3>
          <p style={{ fontSize: 14, color: 'var(--gb-ink-600)', lineHeight: 1.7 }}>{vendor.about}</p>
          <div className="chip-row" style={{ marginTop: 14 }}>
            {vendor.serviceAreas.map((a) => <span key={a} className="chip">{a}</span>)}
          </div>
        </div>

        <div className="section-head"><h2 style={{ fontSize: 20 }}>Products from {vendor.name}</h2></div>
        {productsLoading ? (
          <div className="product-grid">{Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}</div>
        ) : products.length === 0 ? (
          <EmptyState title="No products listed yet" />
        ) : (
          <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        )}
      </div>
    </div>
  );
}
