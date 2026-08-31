import {
  LayoutDashboard, ClipboardList, Carrot, Tags, Store, Users, Bike,
  Ticket, CreditCard, Wallet, Star, BarChart3, Settings,
} from 'lucide-react';
import DashboardShell from '../components/common/DashboardShell';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/products', label: 'Products', icon: Carrot },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/vendors', label: 'Vendors', icon: Store },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/delivery-boys', label: 'Delivery Boys', icon: Bike },
  { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/payouts', label: 'Payouts', icon: Wallet },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  return <DashboardShell brand="GreenBasket Admin" navItems={navItems} homePath="/admin/dashboard" />;
}
