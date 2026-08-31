import { Link, NavLink } from 'react-router-dom';
import { Leaf, Home, Grid3x3, ClipboardList, Heart, User } from 'lucide-react';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div>
          <div className="logo" style={{ color: '#fff', marginBottom: 10 }}><Leaf className="leaf" size={22} /> GreenBasket</div>
          <p>Fresh vegetables from trusted local vendors, delivered to your doorstep across India.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <Link to="/shop">All Vegetables</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/vendors">Vendors</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link to="/orders">My Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/profile">Profile</Link>
        </div>
        <div>
          <h4>Company</h4>
          <Link to="/vendor/dashboard">Sell on GreenBasket</Link>
          <Link to="/delivery/dashboard">Delivery Partner</Link>
          <Link to="/admin/dashboard">Admin Panel</Link>
        </div>
      </div>
      <div className="container footer-bottom">© 2026 GreenBasket. All rights reserved.</div>
    </footer>
  );
}

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Bottom navigation">
      <NavLink to="/" end><Home size={20} /> Home</NavLink>
      <NavLink to="/shop"><Grid3x3 size={20} /> Shop</NavLink>
      <NavLink to="/orders"><ClipboardList size={20} /> Orders</NavLink>
      <NavLink to="/wishlist"><Heart size={20} /> Wishlist</NavLink>
      <NavLink to="/profile"><User size={20} /> Account</NavLink>
    </nav>
  );
}
