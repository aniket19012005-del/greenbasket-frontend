import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Truck, ShieldCheck, BadgeCheck, ArrowRight, Star } from 'lucide-react';
import Button from '../../components/common/Button';
import CategoryCard from '../../components/customer/CategoryCard';
import ProductCard from '../../components/customer/ProductCard';
import { ProductCardSkeleton } from '../../components/common/States';
import { categoryApi } from '../../services/productApi';
import productApi from '../../services/productApi';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([categoryApi.list(), productApi.list({ featured: true })])
      .then(([cats, prods]) => {
        if (!active) return;
        setCategories(cats.slice(0, 6));
        setFeatured((prods.items || prods).slice(0, 8));
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div>
            <h1>Fresh Vegetables.<br /><span className="accent">Delivered Fresh</span> to Your Door.</h1>
            <p className="lead">Shop fresh vegetables from trusted local vendors and get them delivered to your doorstep.</p>
            <div className="hero-actions">
              <Link to="/shop"><Button variant="accent">Shop Now <ArrowRight size={16} /></Button></Link>
              <Link to="/categories"><Button variant="outline">Explore Categories</Button></Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-blob" />
            <img src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=70" alt="Basket of fresh vegetables" style={{ borderRadius: 28, width: '100%', height: '100%', objectFit: 'cover', position: 'relative' }} />
            <div className="hero-card" style={{ bottom: -14, left: -14 }}>
              <Star size={18} fill="var(--gb-gold)" color="var(--gb-gold)" />
              <div><strong style={{ fontSize: 13 }}>4.8/5 rating</strong><br /><span style={{ fontSize: 11, color: 'var(--gb-ink-400)' }}>from 12,000+ orders</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container">
          <div className="trust-item"><Sprout size={19} /> Farm Fresh</div>
          <div className="trust-item"><Truck size={19} /> Fast Delivery</div>
          <div className="trust-item"><ShieldCheck size={19} /> Secure Payment</div>
          <div className="trust-item"><BadgeCheck size={19} /> Quality Guaranteed</div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div><span className="eyebrow">Browse</span><h2>Shop by Category</h2></div>
          <Link to="/categories"><Button variant="ghost" size="sm">View all <ArrowRight size={14} /></Button></Link>
        </div>
        <div className="category-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 130, borderRadius: 14 }} />)
            : categories.map((c) => <CategoryCard key={c.id} category={c} />)}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div><span className="eyebrow">Handpicked</span><h2>Featured Products</h2></div>
          <Link to="/shop"><Button variant="ghost" size="sm">View all <ArrowRight size={14} /></Button></Link>
        </div>
        <div className="product-grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </>
  );
}
