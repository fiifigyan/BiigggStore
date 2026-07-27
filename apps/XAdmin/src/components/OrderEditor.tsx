import { useState } from 'react';
import { adminApi, type Order } from '../api/adminApi';

type Props = {
  order: Order;
  onDone: () => void;
};

export default function OrderEditor({ order, onDone }: Props) {
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [tracking, setTracking] = useState(order.tracking || '');
  const [notes, setNotes] = useState(order.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.updateOrder(order.id, { status, paymentStatus, tracking, notes });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {error ? <div style={{ color: '#dc2626' }}>{error}</div> : null}
      <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} style={inputStyle}>
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
        <option value="failed">Failed</option>
      </select>
      <input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="Tracking number" style={inputStyle} />
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" style={{ ...inputStyle, minHeight: 80 }} />
      <button onClick={save} disabled={loading} style={buttonStyle}>
        {loading ? 'Saving...' : 'Save order'}
      </button>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  border: '1px solid #cbd5e1',
  borderRadius: 10,
  padding: '10px 12px',
  fontSize: 14,
};

const buttonStyle: React.CSSProperties = {
  border: 'none',
  background: '#4f46e5',
  color: 'white',
  padding: '10px 14px',
  borderRadius: 10,
  cursor: 'pointer',
  fontWeight: 700,
};
