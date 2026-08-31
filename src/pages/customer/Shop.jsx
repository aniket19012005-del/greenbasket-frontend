import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/customer/ProductCard';
import { ProductCardSkeleton, EmptyState } from '../../components/common/States';
import productApi, { categoryApi } from '../../services/productApi';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('popular');

  const activeCategory = params.get('category') || '';
  const search = params.get('search') || '';

  useEffect(() => { categoryApi.list().then(setCategories); }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    productApi.list({ categoryId: activeCategory || undefined, search: search || undefined })
      .then((res) => active && setProducts(res.items || res))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [activeCategory, search]);

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-low') return a.price - b.price;
    if (sort === 'price-high') return b.price - a.price;
    if (sort === 'rating') return b.rating - a.rating;
    return 0;
  });

  const setCategory = (id) => {
    const next = new URLSearchParams(params);
    if (id) next.set('category', id); else next.delete('category');
    setParams(next);
  };

  return (
    <div className="container section">
      <div className="page-header">
        <div>
          <h1>{search ? `Results for "${search}"` : 'Shop Fresh Vegetables'}</h1>
          <p className="sub">{loading ? 'Loading products…' : `${sorted.length} products available`}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SlidersHorizontal size={15} color="var(--gb-ink-400)" />
          <select className="select" style={{ width: 170 }} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="popular">Sort: Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="chip-row" style={{ marginBottom: 24 }}>
        <button className={`chip ${!activeCategory ? 'active' : ''}`} onClick={() => setCategory('')}>All</button>
        {categories.map((c) => (
          <button key={c.id} className={`chip ${activeCategory === c.id ? 'active' : ''}`} onClick={() => setCategory(c.id)}>{c.emoji} {c.name}</button>
        ))}
      </div>

      {loading ? (
        <div className="product-grid">{Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}</div>
      ) : sorted.length === 0 ? (
        <EmptyState title="No products found" message="Try a different category or search term." />
      ) : (
        <div className="product-grid">{sorted.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}
