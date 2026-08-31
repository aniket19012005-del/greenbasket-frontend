import { Check, Circle, XCircle } from 'lucide-react';
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS } from '../../utils/format';

export default function OrderTimeline({ status }) {
  if (status === 'cancelled') {
    return (
      <div className="order-vine">
        <div className="vine-step done">
          <span className="vine-leaf" style={{ borderColor: 'var(--gb-red)', background: 'var(--gb-red)' }}><XCircle size={14} /></span>
          <h5>Order Cancelled</h5>
          <span>This order was cancelled.</span>
        </div>
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(status);

  return (
    <div className="order-vine">
      {ORDER_STATUS_FLOW.map((step, idx) => {
        const isDone = idx < currentIndex || (idx === currentIndex && status === 'delivered');
        const isCurrent = idx === currentIndex && status !== 'delivered';
        return (
          <div key={step} className={`vine-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
            <span className="vine-leaf">
              {isDone ? <Check size={14} /> : <Circle size={9} fill="currentColor" />}
            </span>
            <h5>{ORDER_STATUS_LABELS[step]}</h5>
            {isCurrent && <span>In progress</span>}
          </div>
        );
      })}
    </div>
  );
}
