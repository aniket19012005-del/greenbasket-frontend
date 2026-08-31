import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Star, Heart, Minus, Plus, ShoppingCart, Store } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ProductCard from '../../components/customer/ProductCard';
import { LoadingState, ErrorState } from '../../components/common/States';
import productApi from '../../services/productApi';
import { reviewApi } from '../../services/reviewApi';
import { formatINR, discountPercent, formatDate } from '../../utils/format';
import useCart from '../../hooks/useCart';
import useApp from '../../hooks/useApp';
import useToast from '../../hooks/useToast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { addItem, getQty, updateQty } = useCart();
  const { isWishlisted, toggleWishlist } = useApp();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setActiveImg(0);
    productApi.getById(id)
      .then((p) => {
        if (!active) return;
        setProduct(p);
        setStatus('ready');
        productApi.list({ vendorId: p.vendorId }).then((res) => active && setRelated((res.items || res).filter((x) => x.id !== p.id).slice(0, 4)));
        reviewApi.listForProduct(p.id).then((r) => active && setReviews(r));
      })
      .catch(() => active && setStatus('error'));
    return () => { active = false; };
  }, [id]);

  if (status === 'loading') return <LoadingState label="Loading product…" />;
  if (status === 'error' || !product) return <ErrorState title="Product not found" message="This product may have been removed." onRetry={() => navigate('/shop')} />;

  const discount = discountPercent(product.originalPrice, product.price);
  const outOfStock = product.stock <= 0;
  const inCart = getQty(product.id);
  const wished = isWishlisted(product.id);

  return (
    <div className="container section">
      <div className="grid-2" style={{ alignItems: 'flex-start' }}>
        <div className="detail-gallery">
          <div className="thumbs">
            {product.images.map((img, i) => (
              <img key={i} src={img} alt="" className={i === activeImg ? 'active' : ''} onClick={() => setActiveImg(i)} />
            ))}
          </div>
          <img className="main-img" src={product.images[activeImg]} alt={product.name} />
        </div>

        <div>
          <Link to={`/vendor/${product.vendorId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--gb-green-600)', marginBottom: 8 }}>
            <Store size={14} /> Sold by {product.vendorName}
          </Link>
          <h1 style={{ fontSize: 27 }}>{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13.5, fontWeight: 700 }}>
              <Star size={14} fill="var(--gb-gold)" color="var(--gb-gold)" /> {product.rating}
            </span>
            <span style={{ fontSize: 13, color: 'var(--gb-ink-400)' }}>({reviews.length} reviews)</span>
            {product.organic && <Badge tone="green">Organic</Badge>}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '14px 0' }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--gb-forest-900)' }}>{formatINR(product.price)}</span>
            <span style={{ fontSize: 14, color: 'var(--gb-ink-400)' }}>/{product.unit}</span>
            {discount > 0 && <span style={{ fontSize: 15, color: 'var(--gb-ink-400)', textDecoration: 'line-through' }}>{formatINR(product.originalPrice)}</span>}
            {discount > 0 && <Badge tone="gold">{discount}% OFF</Badge>}
          </div>

          <p style={{ fontSize: 14.5, color: 'var(--gb-ink-600)', lineHeight: 1.7 }}>{product.description}</p>

          <div style={{ margin: '18px 0' }}>
            {outOfStock ? <Badge tone="red">Out of Stock</Badge> : <Badge tone="green">In Stock — {product.stock} {product.unit} available</Badge>}
          </div>

          {!outOfStock && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
              <div className="qty-stepper" style={{ background: 'var(--gb-forest-700)' }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease"><Minus size={13} /></button>
                <span style={{ minWidth: 24, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase"><Plus size={13} /></button>
              </div>
              <Button variant="accent" icon={ShoppingCart} onClick={() => { addItem(product, qty); toast.success(`${product.name} added to cart`); }}>
                Add to Cart
              </Button>
              <Button variant="outline" iconOnly icon={Heart} aria-label="Toggle wishlist" onClick={() => { toggleWishlist(product.id); toast.show(wished ? 'Removed from wishlist' : 'Added to wishlist'); }}
                style={wished ? { borderColor: 'var(--gb-terracotta)', color: 'var(--gb-terracotta)' } : {}} />
            </div>
          )}
          {inCart > 0 && <p className="field-hint">{inCart} already in your cart — <Link to="/cart" style={{ color: 'var(--gb-green-600)', fontWeight: 700 }}>view cart</Link></p>}
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="section">
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Customer Reviews</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reviews.map((r) => (
              <div key={r.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <strong style={{ fontSize: 14 }}>{r.customerName}</strong>
                  <span style={{ fontSize: 12, color: 'var(--gb-ink-400)' }}>{formatDate(r.date)}</span>
                </div>
                <span style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill={i < r.rating ? 'var(--gb-gold)' : 'none'} color="var(--gb-gold)" />)}
                </span>
                <p style={{ fontSize: 13.5, color: 'var(--gb-ink-600)' }}>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="section">
          <div className="section-head"><h2 style={{ fontSize: 20 }}>More from {product.vendorName}</h2></div>
          <div className="product-grid">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </div>
      )}
    </div>
  );
}
