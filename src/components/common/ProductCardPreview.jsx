import { Star, Heart, Plus } from 'lucide-react';
import { formatINR } from '../../utils/format';

export default function ProductCardPreview({ form, discount }) {
  return (
    <div className="card product-card" style={{ pointerEvents: 'none' }}>
      <div className="thumb">
        <img src={form.images?.[0]} alt="" />
        {discount > 0 && <span className="discount-tag badge badge-gold">{discount}% OFF</span>}
        <button className="icon-btn wish-btn"><Heart size={16} /></button>
      </div>
      <div className="body">
        <span className="vendor">Sold by {form.vendorName || 'Your Store'}</span>
        <h4 className="name">{form.name || 'Product name'}</h4>
        <span className="rating"><Star size={12} fill="var(--gb-gold)" color="var(--gb-gold)" /> 4.5</span>
        <div className="price-row">
          <span className="price">{formatINR(form.price || 0)}</span>
          <span className="price-unit">/{form.unit}</span>
          {discount > 0 && <span className="price-old">{formatINR(form.originalPrice)}</span>}
        </div>
        <div className="add-row">
          {Number(form.stock) > 0 || form.stock === '' ? (
            <button className="btn btn-accent btn-sm btn-block"><Plus size={14} /> Add</button>
          ) : <span className="out-of-stock">OUT OF STOCK</span>}
        </div>
      </div>
    </div>
  );
}
