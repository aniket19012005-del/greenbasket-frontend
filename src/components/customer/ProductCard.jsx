import { useNavigate } from 'react-router-dom';
import { Heart, Plus, Minus, Star } from 'lucide-react';
import Badge from '../common/Badge';
import { formatINR, discountPercent } from '../../utils/format';
import useCart from '../../hooks/useCart';
import useApp from '../../hooks/useApp';
import useToast from '../../hooks/useToast';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem, updateQty, getQty } = useCart();
  const { isWishlisted, toggleWishlist } = useApp();
  const toast = useToast();

  const qty = getQty(product.id);
  const discount = discountPercent(product.originalPrice, product.price);
  const outOfStock = product.stock <= 0;
  const wished = isWishlisted(product.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleWish = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.show(wished ? `Removed ${product.name} from wishlist` : `${product.name} added to wishlist`);
  };

  return (
    <div className="card card-hover product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="thumb">
        <img src={product.images?.[0]} alt={product.name} loading="lazy" />
        {discount > 0 && <span className="discount-tag badge badge-gold">{discount}% OFF</span>}
        <button className="icon-btn wish-btn" onClick={handleWish} aria-label="Toggle wishlist" aria-pressed={wished}>
          <Heart size={16} fill={wished ? 'var(--gb-terracotta)' : 'none'} color={wished ? 'var(--gb-terracotta)' : 'var(--gb-ink-600)'} />
        </button>
      </div>
      <div className="body">
        <span className="vendor">Sold by {product.vendorName}</span>
        <h4 className="name">{product.name}</h4>
        <span className="rating"><Star size={12} fill="var(--gb-gold)" color="var(--gb-gold)" /> {product.rating}</span>
        <div className="price-row">
          <span className="price">{formatINR(product.price)}</span>
          <span className="price-unit">/{product.unit}</span>
          {discount > 0 && <span className="price-old">{formatINR(product.originalPrice)}</span>}
        </div>
        <div className="add-row" onClick={(e) => e.stopPropagation()}>
          {outOfStock ? (
            <span className="out-of-stock">OUT OF STOCK</span>
          ) : qty > 0 ? (
            <div className="qty-stepper">
              <button onClick={() => updateQty(product.id, qty - 1)} aria-label="Decrease quantity"><Minus size={13} /></button>
              <span>{qty}</span>
              <button onClick={() => updateQty(product.id, qty + 1)} aria-label="Increase quantity"><Plus size={13} /></button>
            </div>
          ) : (
            <button className="btn btn-accent btn-sm btn-block" onClick={handleAdd}>
              <Plus size={14} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
