import {
  LayoutDashboard, Carrot, PlusCircle, ClipboardList, Boxes, Wallet, Store, Star, Settings,
} from 'lucide-react';
import DashboardShell from '../components/common/DashboardShell';

const navItems = [
  { to: '/vendor/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/vendor/products', label: 'Products', icon: Carrot },
  { to: '/vendor/products/new', label: 'Add Product', icon: PlusCircle },
  { to: '/vendor/orders', label: 'Orders', icon: ClipboardList },
  { to: '/vendor/inventory', label: 'Inventory', icon: Boxes },
  { to: '/vendor/earnings', label: 'Earnings', icon: Wallet },
  { to: '/vendor/store', label: 'Store Profile', icon: Store },
  { to: '/vendor/reviews', label: 'Reviews', icon: Star },
  { to: '/vendor/settings', label: 'Settings', icon: Settings },
];

export default function VendorLayout() {
  return <DashboardShell brand="GreenBasket Vendor" navItems={navItems} homePath="/vendor/dashboard" />;
}
