import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Tag, Wallet, CreditCard, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import orderApi, { paymentApi } from '../../services/orderApi';
import { couponApi } from '../../services/couponApi';
import { formatINR } from '../../utils/format';
import { currentUserSeed } from '../../data/seedData';

export default function Checkout() {
  const { groupedByVendor, totals, clearCart, items } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [addressId, setAddressId] = useState(currentUserSeed.addresses.find((a) => a.isDefault)?.id);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplying, setCouponApplying] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [placing, setPlacing] = useState(false);

  const grandTotal = Math.max(0, totals.subtotal + totals.deliveryFee - discount);

  if (groupedByVendor.length === 0) {
    navigate('/cart');
    return null;
  }

  const applyCoupon = async () => {
    if (!couponCode) return;
    setCouponApplying(true);
    try {
      const res = await couponApi.apply(couponCode, totals.subtotal);
      setDiscount(res.discount);
      setAppliedCode(res.code);
      toast.success(`Coupon ${res.code} applied — you saved ${formatINR(res.discount)}`);
    } catch (err) {
      toast.error(err.message);
      setDiscount(0);
    } finally {
      setCouponApplying(false);
    }
  };

  const placeOrder = async () => {
    const address = currentUserSeed.addresses.find((a) => a.id === addressId);
    setPlacing(true);
    try {
      if (paymentMethod === 'razorpay') {
        const rzpOrder = await paymentApi.createRazorpayOrder(grandTotal);
        paymentApi.openRazorpayCheckout({
          orderId: rzpOrder.orderId, amount: grandTotal, name: user?.name, email: user?.email,
          onSuccess: async () => {
            await orderApi.create({ items, address, paymentMethod: 'Razorpay', paymentStatus: 'paid', couponCode: appliedCode, amount: grandTotal });
            clearCart();
            toast.success('Order placed successfully');
            navigate('/orders');
          },
          onFailure: () => { toast.error('Payment was not completed'); setPlacing(false); },
        });
      } else {
        await orderApi.create({ items, address, paymentMethod: 'COD', paymentStatus: 'pending', couponCode: appliedCode, amount: grandTotal });
        clearCart();
        toast.success('Order placed successfully');
        navigate('/orders');
      }
    } catch (err) {
      toast.error(err?.message || 'Could not place order');
      setPlacing(false);
    }
  };

  return (
    <div className="container section">
      <div className="page-header"><div><h1>Checkout</h1></div></div>
      <div className="cart-layout">
        <div className="checkout-steps">
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}><MapPin size={17} /> Delivery Address</h3>
            {currentUserSeed.addresses.map((a) => (
              <div key={a.id} className={`address-option ${addressId === a.id ? 'selected' : ''}`} onClick={() => setAddressId(a.id)}>
                <input type="radio" checked={addressId === a.id} onChange={() => setAddressId(a.id)} style={{ marginTop: 3 }} />
                <div>
                  <strong style={{ fontSize: 13.5 }}>{a.label}</strong>
                  <p style={{ fontSize: 13, color: 'var(--gb-ink-600)', marginTop: 3 }}>{a.line}, {a.city} - {a.pincode}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Order Summary</h3>
            {groupedByVendor.map((g) => (
              <div key={g.vendorId} style={{ marginBottom: 12 }}>
                <strong style={{ fontSize: 12.5, color: 'var(--gb-ink-400)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{g.vendorName}</strong>
                {g.items.map((i) => (
                  <div key={i.productId} className="summary-row"><span>{i.name} × {i.qty}</span><span>{formatINR(i.price * i.qty)}</span></div>
                ))}
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}><Wallet size={17} style={{ verticalAlign: -3 }} /> Payment Method</h3>
            <div className={`payment-option ${paymentMethod === 'razorpay' ? 'selected' : ''}`} onClick={() => setPaymentMethod('razorpay')}>
              <input type="radio" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
              <CreditCard size={18} /> <span style={{ fontSize: 14, fontWeight: 600 }}>Pay Online (Razorpay)</span>
            </div>
            <div className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`} onClick={() => setPaymentMethod('cod')}>
              <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              <Wallet size={18} /> <span style={{ fontSize: 14, fontWeight: 600 }}>Cash on Delivery</span>
            </div>
          </div>
        </div>

        <div className="card summary-card">
          <h3 style={{ fontSize: 16, marginBottom: 14 }}><Tag size={16} style={{ verticalAlign: -3 }} /> Have a coupon?</h3>
          <div className="coupon-row">
            <input className="input" placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} />
            <Button variant="outline" size="sm" loading={couponApplying} onClick={applyCoupon}>Apply</Button>
          </div>
          {appliedCode && <p className="field-hint" style={{ color: 'var(--gb-green-600)', marginBottom: 10, display: 'flex', gap: 4, alignItems: 'center' }}><CheckCircle2 size={13} /> {appliedCode} applied</p>}

          <div className="summary-row"><span>Subtotal</span><span>{formatINR(totals.subtotal)}</span></div>
          <div className="summary-row"><span>Delivery Fee</span><span>{formatINR(totals.deliveryFee)}</span></div>
          {discount > 0 && <div className="summary-row" style={{ color: 'var(--gb-green-600)' }}><span>Discount</span><span>-{formatINR(discount)}</span></div>}
          <div className="summary-row total"><span>Total</span><span>{formatINR(grandTotal)}</span></div>

          <Button variant="accent" block loading={placing} onClick={placeOrder} style={{ marginTop: 16 }}>Place Order</Button>
        </div>
      </div>
    </div>
  );
}
