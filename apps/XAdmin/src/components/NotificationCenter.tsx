import { useMemo } from 'react';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  tone: 'info' | 'success' | 'warning';
};

type Props = {
  orders: Array<{ id: string; status: string; orderNumber: string; total: number }>;
  products: Array<{ id: string; stock: number; title: string }>;
};

const toneStyles = {
  info: { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' },
  success: { background: '#ecfdf3', color: '#047857', border: '1px solid #a7f3d0' },
  warning: { background: '#fff7ed', color: '#c2410c', border: '1px solid #fdba74' },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format((value || 0) / 100);
}

export default function NotificationCenter({ orders, products }: Props) {
  const notifications = useMemo<NotificationItem[]>(() => {
    const items: NotificationItem[] = [];

    if (orders.length) {
      const pending = orders.filter((order) => order.status === 'pending').length;
      if (pending) {
        items.push({
          id: 'pending-orders',
          title: 'Pending orders',
          message: `${pending} order${pending === 1 ? '' : 's'} still need attention.`,
          tone: 'warning',
        });
      }

      const latest = orders[0];
      items.push({
        id: 'latest-order',
        title: 'Latest order',
        message: `${latest.orderNumber} • ${formatCurrency(latest.total || 0)} • ${latest.status}`,
        tone: 'info',
      });
    }

    const lowStock = products.filter((product) => Number(product.stock || 0) < 10);
    if (lowStock.length) {
      items.push({
        id: 'low-stock',
        title: 'Low stock alert',
        message: `${lowStock.length} product${lowStock.length === 1 ? '' : 's'} are running low.`,
        tone: 'warning',
      });
    }

    if (!items.length) {
      items.push({
        id: 'empty-state',
        title: 'Everything is quiet',
        message: 'No urgent activity right now. New orders and stock updates will appear here.',
        tone: 'success',
      });
    }

    return items;
  }, [orders, products]);

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Notifications</h3>
        <span style={{ color: '#64748b', fontSize: 13 }}>Live admin alerts</span>
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {notifications.map((item) => (
          <div key={item.id} style={{ borderRadius: 12, padding: '10px 12px', ...toneStyles[item.tone] }}>
            <div style={{ fontWeight: 700 }}>{item.title}</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>{item.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
