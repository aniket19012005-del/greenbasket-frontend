import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import ProductCard from '../../components/customer/ProductCard';
import { EmptyState, ProductCardSkeleton } from '../../components/common/States';
import productApi from '../../services/productApi';
import useApp from '../../hooks/useApp';

export default function Wishlist() {
  const { wishlist } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productApi.list().then((res) => {
      const all = res.items || res;
      setProducts(all.filter((p) => wishlist.includes(p.id)));
      setLoading(false);
    });
  }, [wishlist]);

  return (
    <div className="container section">
      <div className="page-header"><div><h1>Wishlist</h1><p className="sub">Products you've saved for later</p></div></div>
      {loading ? (
        <div className="product-grid">{Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}</div>
      ) : products.length === 0 ? (
        <EmptyState icon={Heart} title="Your wishlist is empty" message="Tap the heart icon on any product to save it here." actionLabel="Browse Products" actionTo="/shop" />
      ) : (
        <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}
