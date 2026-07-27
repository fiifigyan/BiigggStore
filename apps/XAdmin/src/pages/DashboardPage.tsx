import { useEffect, useMemo, useState } from 'react';
import { adminApi, type Order, type Product } from '../api/adminApi';
import NotificationCenter from '../components/NotificationCenter';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / 100);
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productData, orderData] = await Promise.all([
          adminApi.listProducts(),
          adminApi.listOrders(),
        ]);
        setProducts(productData);
        setOrders(orderData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const customers = new Set(orders.filter((order) => order.userId).map((order) => order.userId)).size;
    const lowStock = products.filter((product) => Number(product.stock || 0) < 10).length;

    return [
      { title: 'Revenue', value: formatCurrency(revenue), detail: `${orders.length} completed orders` },
      { title: 'Orders', value: orders.length.toString(), detail: 'Live order count from the backend' },
      { title: 'Customers', value: customers.toString(), detail: 'Unique buyers from recent orders' },
      { title: 'Products', value: products.length.toString(), detail: `${lowStock} low stock items` },
    ];
  }, [orders, products]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);
  const orderBreakdown = useMemo(() => {
    const counts = orders.reduce<Record<string, number>>((acc, order) => {
      const status = order.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, [orders]);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ margin: '0 0 8px', fontSize: 28 }}>Dashboard</h1>
      <p style={{ margin: '0 0 20px', color: '#64748b' }}>A quick overview of your store performance.</p>

      {error ? <div style={{ color: '#dc2626', marginBottom: 12 }}>{error}</div> : null}

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.title} className="stat-card">
            <div style={{ color: '#64748b', fontSize: 13 }}>{stat.title}</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6 }}>{loading ? '—' : stat.value}</div>
            <div style={{ color: '#475569', fontSize: 13, marginTop: 8 }}>{stat.detail}</div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ marginTop: 20 }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Recent activity</h3>
          {loading ? <p style={{ color: '#64748b', marginBottom: 0 }}>Loading recent orders...</p> : (
            <div style={{ display: 'grid', gap: 10 }}>
              {recentOrders.length ? recentOrders.map((order) => (
                <div key={order.id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{order.orderNumber}</div>
                    <div style={{ color: '#64748b', fontSize: 13 }}>{order.user?.email || order.userId}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700 }}>{formatCurrency(order.total || 0)}</div>
                    <div style={{ color: '#64748b', fontSize: 13 }}>{order.status}</div>
                  </div>
                </div>
              )) : <p style={{ color: '#64748b', marginBottom: 0 }}>No orders yet.</p>}
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Order breakdown</h3>
          {loading ? <p style={{ color: '#64748b', marginBottom: 0 }}>Loading breakdown...</p> : (
            <div style={{ display: 'grid', gap: 10 }}>
              {orderBreakdown.length ? orderBreakdown.map((item) => (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{item.label}</span>
                    <span style={{ color: '#64748b' }}>{item.value}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.max((item.value / Math.max(...orderBreakdown.map((entry) => entry.value), 1)) * 100, 8)}%`, background: '#4f46e5', borderRadius: 999 }} />
                  </div>
                </div>
              )) : <p style={{ color: '#64748b', marginBottom: 0 }}>No status data yet.</p>}
            </div>
          )}
        </div>
      </div>

      <NotificationCenter orders={orders} products={products} />
    </div>
  );
}
