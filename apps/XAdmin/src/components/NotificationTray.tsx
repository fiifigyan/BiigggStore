import { useEffect, useState } from 'react';
import { getStoredAdminSecret } from '../api/adminApi';

type Notification = { id: string; type: string; message: string; data?: any };

export default function NotificationTray() {
  const [items, setItems] = useState<Notification[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onToggle = () => setVisible((v) => !v);
    window.addEventListener('toggle-notification-tray', onToggle as any);
    return () => window.removeEventListener('toggle-notification-tray', onToggle as any);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const secret = getStoredAdminSecret();
    const url = secret ? `/api/admin/stream?secret=${encodeURIComponent(secret)}` : '/api/admin/stream';
    const es = new EventSource(url, { withCredentials: true } as any);

    es.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data);
        setItems((s) => [payload, ...s].slice(0, 6));
      } catch (err) {
        // ignore
      }
    };

    es.onerror = () => {
      es.close();
    };

    return () => es.close();
  }, [visible]);

  if (!visible) return null;

  return (
    <div style={{ position: 'fixed', right: 24, top: 72, width: 360, zIndex: 9999 }}>
      {items.map((n) => (
        <div key={n.id || n.message} style={{ background: 'white', padding: 12, borderRadius: 10, boxShadow: '0 6px 20px rgba(2,6,23,0.08)', marginBottom: 10 }}>
          <div style={{ fontWeight: 700 }}>{n.type}</div>
          <div style={{ fontSize: 13, color: '#475569' }}>{n.message}</div>
        </div>
      ))}
    </div>
  );
}
