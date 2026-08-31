import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Leaf, Search, Heart, User, ShoppingCart, Menu, X } from 'lucide-react';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';

export default function Header() {
  const { totals } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : '/shop');
  };

  return (
    <header className="site-header">
      <div className="bar container">
        <Link to="/" className="logo"><Leaf className="leaf" size={24} /> GreenBasket</Link>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/vendors">Vendors</NavLink>
          <NavLink to="/shop?offers=1">Offers</NavLink>
        </nav>

        <form className="search-bar" onSubmit={submitSearch}>
          <Search size={16} />
          <input
            placeholder="Search fresh vegetables..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
        </form>

        <div className="header-actions">
          <Link to="/wishlist" className="icon-btn" aria-label="Wishlist"><Heart size={19} /></Link>
          <Link to={isAuthenticated ? '/profile' : '/login'} className="icon-btn" aria-label="Account"><User size={19} /></Link>
          <Link to="/cart" className="icon-btn" aria-label="Cart">
            <ShoppingCart size={19} />
            {totals.itemCount > 0 && <span className="count-pill">{totals.itemCount}</span>}
          </Link>
          <button className="icon-btn mobile-toggle" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="container" style={{ paddingBottom: 14 }}>
          <form className="search-bar" onSubmit={submitSearch} style={{ maxWidth: 'none', marginBottom: 12 }}>
            <Search size={16} />
            <input placeholder="Search fresh vegetables..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </form>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              ['/', 'Home'], ['/shop', 'Shop'], ['/categories', 'Categories'], ['/vendors', 'Vendors'], ['/shop?offers=1', 'Offers'],
            ].map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setMobileOpen(false)} style={{ padding: '10px 6px', fontWeight: 600, borderBottom: '1px solid var(--gb-line)' }}>{label}</Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
