import { useEffect, useState } from 'react';
import { Eye, Truck } from 'lucide-react';
import { PageHeader } from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { SelectField } from '../../components/common/FormField';
import { LoadingState } from '../../components/common/States';
import adminApi from '../../services/adminApi';
import { formatINR, formatDate, ORDER_STATUS_FLOW, ORDER_STATUS_LABELS } from '../../utils/format';
import useToast from '../../hooks/useToast';

export default function AdminOrders() {
  const [orders, setOrders] = useState(null);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [modalOrder, setModalOrder] = useState(null);
  const [assignId, setAssignId] = useState('');
  const toast = useToast();

  const load = () => adminApi.orders().then((res) => setOrders(res.items || res));

  useEffect(() => {
    load();
    adminApi.deliveryBoys({ status: 'approved' }).then((res) => setDeliveryBoys(res.items || res));
  }, []);

  if (!orders) return <LoadingState label="Loading orders…" />;

  const updateStatus = async (id, status) => {
    await adminApi.updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success('Order status updated');
  };

  const assign = async () => {
    if (!assignId) return;
    const boy = deliveryBoys.find((d) => d.id === assignId);
    await adminApi.assignDeliveryBoy(modalOrder.id, assignId);
    setOrders((prev) => prev.map((o) => (o.id === modalOrder.id ? { ...o, deliveryBoy: { id: boy.id, name: boy.name, phone: boy.phone } } : o)));
    toast.success(`${boy.name} assigned to ${modalOrder.id}`);
    setModalOrder(null);
  };

  const columns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'vendorName', label: 'Vendor' },
    { key: 'amount', label: 'Amount', sortable: true, render: (r) => formatINR(r.amount) },
    { key: 'paymentStatus', label: 'Payment', render: (r) => <StatusBadge status={r.paymentStatus} /> },
    { key: 'status', label: 'Status', render: (r) => (
      <select className="select" style={{ width: 150, padding: '6px 10px', fontSize: 12.5 }} value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)}>
        {[...ORDER_STATUS_FLOW, 'cancelled'].map((s) => <option key={s} value={s}>{ORDER_STATUS_LABELS[s] || s}</option>)}
      </select>
    ) },
    { key: 'deliveryBoy', label: 'Delivery Boy', render: (r) => r.deliveryBoy?.name || <span style={{ color: 'var(--gb-ink-400)' }}>Unassigned</span> },
    { key: 'placedAt', label: 'Date', sortable: true, render: (r) => formatDate(r.placedAt) },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="row-actions">
        <button className="icon-btn" aria-label="View order"><Eye size={15} /></button>
        <button className="icon-btn" aria-label="Assign delivery boy" onClick={() => { setModalOrder(r); setAssignId(r.deliveryBoy?.id || ''); }}><Truck size={15} /></button>
      </div>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${orders.length} total orders`} />
      <div className="card" style={{ padding: 18 }}>
        <DataTable columns={columns} rows={orders} searchKeys={['id', 'customerName', 'vendorName']} emptyTitle="No orders yet" />
      </div>

      <Modal open={!!modalOrder} onClose={() => setModalOrder(null)} title={`Assign Delivery Boy — ${modalOrder?.id}`}
        footer={<><Button variant="outline" onClick={() => setModalOrder(null)}>Cancel</Button><Button variant="accent" onClick={assign}>Assign</Button></>}>
        <SelectField label="Select available delivery boy" value={assignId} onChange={(e) => setAssignId(e.target.value)}
          options={[{ value: '', label: 'Choose a delivery partner' }, ...deliveryBoys.map((d) => ({ value: d.id, label: `${d.name} (${d.vehicle})` }))]} />
      </Modal>
    </div>
  );
}
