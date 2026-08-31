import { useEffect, useState } from 'react';
import { IndianRupee, ShoppingBag, Clock, Carrot, AlertTriangle, XCircle, Wallet } from 'lucide-react';
import { PageHeader, StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/States';
import vendorPanelApi from '../../services/vendorPanelApi';
import { formatINR, formatDate } from '../../utils/format';
import useAuth from '../../hooks/useAuth';

export default function VendorDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => { vendorPanelApi.dashboard(user?.vendorId || 'v1').then(setData); }, [user]);

  if (!data) return <LoadingState label="Loading your dashboard…" />;

  return (
    <div>
      <PageHeader title={`Welcome back, ${user?.name?.split(' ')[0] || 'Vendor'}`} subtitle="Here's how your store is performing" />

      <div className="stat-grid">
        <StatCard icon={IndianRupee} label="Total Sales" value={formatINR(data.totalSales)} delta="9.1%" />
        <StatCard icon={IndianRupee} label="Today's Sales" value={formatINR(data.todaySales)} delta="3.4%" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={data.totalOrders} />
        <StatCard icon={Clock} label="Pending Orders" value={data.pendingOrders} />
        <StatCard icon={Carrot} label="Products" value={data.products} />
        <StatCard icon={AlertTriangle} label="Low Stock" value={data.lowStock} deltaDirection="down" />
        <StatCard icon={XCircle} label="Out of Stock" value={data.outOfStock} deltaDirection="down" />
        <StatCard icon={Wallet} label="Pending Earnings" value={formatINR(data.pendingEarnings)} />
      </div>

      <div className="widget-grid">
        <div className="card panel">
          <div className="panel-title">Recent Orders</div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {data.recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td data-label="Order ID">{o.id}</td>
                    <td data-label="Customer">{o.customerName}</td>
                    <td data-label="Amount">{formatINR(o.amount)}</td>
                    <td data-label="Status"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card panel">
          <div className="panel-title">Top Products</div>
          {data.topProducts.map((p) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gb-line)', fontSize: 13.5 }}>
              <span>{p.name}</span><span style={{ fontWeight: 700 }}>{formatINR(p.price)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
