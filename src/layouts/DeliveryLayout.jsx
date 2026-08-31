import { LayoutDashboard, ListChecks, Navigation, History, Wallet, UserCircle } from 'lucide-react';
import DashboardShell from '../components/common/DashboardShell';

const navItems = [
  { to: '/delivery/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/delivery/assignments', label: 'My Deliveries', icon: ListChecks },
  { to: '/delivery/active', label: 'Active Delivery', icon: Navigation },
  { to: '/delivery/history', label: 'History', icon: History },
  { to: '/delivery/earnings', label: 'Earnings', icon: Wallet },
  { to: '/delivery/profile', label: 'Profile', icon: UserCircle },
];

export default function DeliveryLayout() {
  return <DashboardShell brand="GreenBasket Delivery" navItems={navItems} homePath="/delivery/dashboard" />;
}
