import { useEffect, useMemo, useState } from 'react';
import { adminApi, type Order } from '../api/adminApi';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / 100);
}

export default function CustomersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await adminApi.listOrders();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const customers = useMemo(() => {
    const map = new Map<string, { id: string; name: string; email: string; orders: number; total: number }>();

    orders.forEach((order) => {
      const key = order.userId || order.id;
      const existing = map.get(key);
      const name = [order.user?.firstName, order.user?.lastName].filter(Boolean).join(' ').trim() || 'Guest';
      const email = order.user?.email || 'No email on file';

      if (existing) {
        existing.orders += 1;
        existing.total += order.total || 0;
      } else {
        map.set(key, { id: key, name, email, orders: 1, total: order.total || 0 });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [orders]);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ margin: '0 0 8px', fontSize: 28 }}>Customers</h1>
      <p style={{ margin: '0 0 20px', color: '#64748b' }}>Review customer activity and loyalty.</p>

      {error ? <div style={{ color: '#dc2626', marginBottom: 12 }}>{error}</div> : null}

      <div className="card">
        {loading ? <div>Loading customers...</div> : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Orders</th>
                <th>Total spent</th>
              </tr>
            </thead>
            <tbody>
              {customers.length ? customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.orders}</td>
                  <td>{formatCurrency(customer.total)}</td>
                </tr>
              )) : <tr><td colSpan={4}>No customer activity yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
