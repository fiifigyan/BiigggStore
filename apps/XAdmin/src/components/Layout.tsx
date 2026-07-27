import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LayoutDashboard, ShoppingBag, Package, Users, Bell, Menu, X } from 'lucide-react';
import { adminApi, setAdminSecret } from '../api/adminApi';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [ordersCount, setOrdersCount] = useState<number | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const loadCounts = async () => {
      try {
        const orders = await adminApi.listOrders();
        if (!mounted) return;
        setOrdersCount(orders.length);
        setPendingCount(orders.filter((o) => o.status === 'pending').length);
      } catch (err) {
        // ignore - counts are optional
      }
    };

    loadCounts();
    const id = setInterval(loadCounts, 30_000); // refresh every 30s
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/orders', label: 'Orders', icon: ShoppingBag, badge: ordersCount },
    { to: '/products', label: 'Products', icon: Package },
    { to: '/customers', label: 'Customers', icon: Users },
  ];

  const handleLogout = () => {
    setAdminSecret('');
    window.location.reload();
  };

  return (
    <div className="admin-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ fontSize: 24, fontWeight: 700 }}>XAdmin</div>
          <button className="sidebar-close-button" type="button" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon, badge }) => {
            const active = location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={active ? 'sidebar-link active' : 'sidebar-link'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={18} />
                  <span>{label}</span>
                </div>
                {badge !== undefined && badge !== null ? (
                  <div className="sidebar-badge">{badge}</div>
                ) : null}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-logout-button">Sign out</button>
        </div>
      </aside>

      <div className={sidebarOpen ? 'sidebar-backdrop open' : 'sidebar-backdrop'} onClick={() => setSidebarOpen(false)} />

      <main className="content">
        <div className="topbar">
          <button className="mobile-menu-button" type="button" onClick={() => setSidebarOpen(true)}>
            <Menu size={18} />
          </button>
          <div className="topbar-right">
            <div className="topbar-icon" onClick={() => window.dispatchEvent(new CustomEvent('toggle-notification-tray'))}>
              <Bell size={18} />
              {pendingCount ? <div className="topbar-badge">{pendingCount}</div> : null}
            </div>
            <div className="topbar-status">Admin</div>
            <div id="notification-root" />
          </div>
        </div>

        {children}
        <Outlet />
        {/* mount notification tray into a portal-like placeholder */}
        <div className="notification-mount">
          <div>
            {/* NotificationTray will render itself into this area via DOM mount */}
          </div>
        </div>
      </main>
    </div>
  );
}
