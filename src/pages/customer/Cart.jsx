import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import { EmptyState } from '../../components/common/States';
import useCart from '../../hooks/useCart';
import { formatINR } from '../../utils/format';

export default function Cart() {
  const { groupedByVendor, totals, updateQty, removeItem } = useCart();
  const navigate = useNavigate();

  if (groupedByVendor.length === 0) {
    return (
      <div className="container section">
        <EmptyState icon={ShoppingBag} title="Your cart is empty" message="Looks like you haven't added anything yet. Start shopping for fresh vegetables!" actionLabel="Start Shopping" actionTo="/shop" />
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="page-header"><div><h1>Your Cart</h1><p className="sub">{totals.itemCount} items from {groupedByVendor.length} vendor{groupedByVendor.length > 1 ? 's' : ''}</p></div></div>

      <div className="cart-layout">
        <div>
          {groupedByVendor.map((group) => (
            <div key={group.vendorId} className="card vendor-group">
              <div className="vendor-group-head">{group.vendorName}</div>
              {group.items.map((item) => (
                <div key={item.productId} className="cart-line">
                  <img src={item.image} alt={item.name} />
                  <div className="info">
                    <h5>{item.name}</h5>
                    <span>{formatINR(item.price)} / {item.unit}</span>
                  </div>
                  <div className="qty-stepper" style={{ background: 'var(--gb-forest-700)' }}>
                    <button onClick={() => updateQty(item.productId, item.qty - 1)} aria-label="Decrease"><Minus size={13} /></button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.productId, item.qty + 1)} aria-label="Increase"><Plus size={13} /></button>
                  </div>
                  <strong style={{ minWidth: 62, textAlign: 'right', fontSize: 14 }}>{formatINR(item.price * item.qty)}</strong>
                  <button className="icon-btn" onClick={() => removeItem(item.productId)} aria-label={`Remove ${item.name}`}><Trash2 size={16} color="var(--gb-red)" /></button>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="card summary-card">
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>{formatINR(totals.subtotal)}</span></div>
          <div className="summary-row"><span>Delivery Fee</span><span>{formatINR(totals.deliveryFee)}</span></div>
          <div className="summary-row total"><span>Total</span><span>{formatINR(totals.subtotal + totals.deliveryFee)}</span></div>
          <Button variant="accent" block onClick={() => navigate('/checkout')} style={{ marginTop: 16 }}>
            Proceed to Checkout <ArrowRight size={16} />
          </Button>
          <Link to="/shop" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 13, fontWeight: 600, color: 'var(--gb-green-600)' }}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
