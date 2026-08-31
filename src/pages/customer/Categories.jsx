import { useEffect, useState } from 'react';
import CategoryCard from '../../components/customer/CategoryCard';
import { categoryApi } from '../../services/productApi';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { categoryApi.list().then((c) => { setCategories(c); setLoading(false); }); }, []);

  return (
    <div className="container section">
      <div className="page-header">
        <div><h1>All Categories</h1><p className="sub">Browse fresh produce organized by category</p></div>
      </div>
      <div className="category-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 130, borderRadius: 14 }} />)
          : categories.map((c) => <CategoryCard key={c.id} category={c} />)}
      </div>
    </div>
  );
}
