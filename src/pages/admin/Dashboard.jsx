import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingBag, Users, Store, Bike, AlertTriangle, UserCheck } from 'lucide-react';
import { PageHeader, StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/States';
import Button from '../../components/common/Button';
import adminApi from '../../services/adminApi';
import { formatINR, formatDate } from '../../utils/format';

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => { adminApi.dashboard().then(setData); }, []);

  if (!data) return <LoadingState label="Loading dashboard…" />;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Platform overview and performance" />

      <div className="stat-grid">
        <StatCard icon={IndianRupee} label="Total Revenue" value={formatINR(data.totalRevenue)} delta="12.4%" />
        <StatCard icon={IndianRupee} label="Today's Revenue" value={formatINR(data.todayRevenue)} delta="4.1%" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={data.totalOrders} delta="8.2%" />
        <StatCard icon={ShoppingBag} label="Today's Orders" value={data.todayOrders} delta="2.3%" deltaDirection="down" />
        <StatCard icon={Users} label="Customers" value={data.customers} delta="6.7%" />
        <StatCard icon={Store} label="Vendors" value={data.vendors} delta="3.5%" />
        <StatCard icon={Bike} label="Delivery Boys" value={data.deliveryBoys} delta="1.2%" />
      </div>

      <div className="widget-grid">
        <div className="card panel">
          <div className="panel-title">Recent Orders</div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Order ID</th><th>Customer</th><th>Vendor</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {data.recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td data-label="Order ID">{o.id}</td>
                    <td data-label="Customer">{o.customerName}</td>
                    <td data-label="Vendor">{o.vendorName}</td>
                    <td data-label="Amount">{formatINR(o.amount)}</td>
                    <td data-label="Status"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card panel">
            <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><UserCheck size={15} /> Pending Vendor Approvals</div>
            {data.pendingVendors.length === 0 ? <p style={{ fontSize: 13, color: 'var(--gb-ink-400)' }}>No pending approvals</p> : data.pendingVendors.map((v) => (
              <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--gb-line)' }}>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{v.name}</span>
                <Link to="/admin/vendors"><Button size="sm" variant="outline">Review</Button></Link>
              </div>
            ))}
          </div>

          <div className="card panel">
            <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={15} color="var(--gb-terracotta)" /> Low Stock Products</div>
            {data.lowStock.map((p) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--gb-line)', fontSize: 13.5 }}>
                <span>{p.name}</span><span style={{ color: 'var(--gb-terracotta)', fontWeight: 700 }}>{p.stock} left</span>
              </div>
            ))}
          </div>

          <div className="card panel">
            <div className="panel-title">Pending Delivery Assignments</div>
            {data.pendingAssignments.length === 0 ? <p style={{ fontSize: 13, color: 'var(--gb-ink-400)' }}>All orders are assigned</p> : data.pendingAssignments.map((o) => (
              <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--gb-line)' }}>
                <span style={{ fontSize: 13.5 }}>{o.id}</span>
                <Link to="/admin/orders"><Button size="sm" variant="outline">Assign</Button></Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="widget-grid" style={{ marginTop: 18 }}>
        <div className="card panel">
          <div className="panel-title">Top Products</div>
          {data.topProducts.map((p) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gb-line)', fontSize: 13.5 }}>
              <span>{p.name}</span><span style={{ fontWeight: 700 }}>{formatINR(p.price)}</span>
            </div>
          ))}
        </div>
        <div className="card panel">
          <div className="panel-title">Top Vendors</div>
          {data.topVendors.map((v) => (
            <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gb-line)', fontSize: 13.5 }}>
              <span>{v.name}</span><span style={{ fontWeight: 700 }}>{formatINR(v.sales)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
