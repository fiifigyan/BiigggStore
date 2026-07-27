import { useState, type FormEvent } from 'react';
import { adminApi, setAdminSecret, getStoredAdminSecret } from '../api/adminApi';

type Props = {
  onLogin: () => void;
};

export default function LoginPage({ onLogin }: Props) {
  const [secret, setSecret] = useState(getStoredAdminSecret());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      setAdminSecret(secret);
      await adminApi.listProducts();
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in to the admin area');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 420, background: 'white', borderRadius: 24, boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)', padding: 28 }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.24em', color: '#4f46e5' }}>XAdmin</div>
          <h1 style={{ margin: '8px 0 6px', fontSize: 26 }}>Admin sign in</h1>
          <p style={{ margin: 0, color: '#64748b', lineHeight: 1.5 }}>Enter the shared admin secret to access the dashboard and manage products.</p>
        </div>

        {error ? <div style={{ marginBottom: 12, color: '#dc2626', fontSize: 14 }}>{error}</div> : null}

        <label style={{ display: 'grid', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>Admin secret</span>
          <input
            type="password"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            placeholder="Enter your admin secret"
            style={{ border: '1px solid #cbd5e1', borderRadius: 12, padding: '10px 12px', fontSize: 14 }}
            autoFocus
          />
        </label>

        <button type="submit" disabled={loading} style={{ width: '100%', border: 'none', background: '#4f46e5', color: 'white', padding: '12px 14px', borderRadius: 12, cursor: 'pointer', fontWeight: 700 }}>
          {loading ? 'Signing in...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
