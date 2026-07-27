import { useEffect, useState } from 'react';
import { adminApi, type Order } from '../api/adminApi';
import OrderEditor from '../components/OrderEditor';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminApi.listOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (orderId: string) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await adminApi.deleteOrder(orderId);
      await fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete order');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ margin: '0 0 8px', fontSize: 28 }}>Orders</h1>
      <p style={{ margin: '0 0 20px', color: '#64748b' }}>Review and update every order from the storefront.</p>

      {error ? <div style={{ color: '#dc2626', marginBottom: 12 }}>{error}</div> : null}

      {selectedOrder ? (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <strong>Edit order {selectedOrder.orderNumber}</strong>
            <button onClick={() => setSelectedOrder(null)} style={ghostButtonStyle}>Close</button>
          </div>
          <OrderEditor order={selectedOrder} onDone={() => { setSelectedOrder(null); fetchOrders(); }} />
        </div>
      ) : null}

      <div className="card">
        {loading ? <div>Loading orders...</div> : (
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNumber}</td>
                  <td>{order.status}</td>
                  <td>{order.paymentStatus}</td>
                  <td>${(order.total / 100).toFixed(2)}</td>
                  <td>
                    <button onClick={() => setSelectedOrder(order)} style={ghostButtonStyle}>Edit</button>
                    <button onClick={() => handleDelete(order.id)} style={dangerButtonStyle}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const ghostButtonStyle: React.CSSProperties = {
  border: '1px solid #cbd5e1',
  background: 'white',
  padding: '8px 10px',
  borderRadius: 8,
  cursor: 'pointer',
  marginRight: 8,
};

const dangerButtonStyle: React.CSSProperties = {
  border: '1px solid #fecaca',
  background: '#fef2f2',
  color: '#b91c1c',
  padding: '8px 10px',
  borderRadius: 8,
  cursor: 'pointer',
};
