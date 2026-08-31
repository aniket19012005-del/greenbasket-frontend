import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Leaf, Menu, LogOut, Bell } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { initials } from '../../utils/format';

export default function DashboardShell({ brand, navItems, homePath }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dash-shell">
      {open && <div className="sidebar-scrim" onClick={() => setOpen(false)} />}
      <aside className={`dash-sidebar ${open ? 'open' : ''}`}>
        <Link to={homePath} className="brand"><Leaf size={20} /> {brand}</Link>
        <nav className="dash-nav" aria-label={`${brand} navigation`}>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}>
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="dash-sidebar-foot">GreenBasket © 2026</div>
      </aside>

      <div className="dash-main">
        <div className="dash-topbar">
          <button className="icon-btn hamburger" onClick={() => setOpen((o) => !o)} aria-label="Toggle sidebar"><Menu size={20} /></button>
          <span />
          <div className="dash-user">
            <button className="icon-btn" aria-label="Notifications"><Bell size={18} /></button>
            <div className="avatar">{initials(user?.name)}</div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }} className="hide-mobile">
              <strong style={{ fontSize: 13.5 }}>{user?.name}</strong>
              <span style={{ fontSize: 11.5, color: 'var(--gb-ink-400)', textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ')}</span>
            </div>
            <button className="icon-btn" onClick={handleLogout} aria-label="Log out"><LogOut size={18} /></button>
          </div>
        </div>
        <div className="dash-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
