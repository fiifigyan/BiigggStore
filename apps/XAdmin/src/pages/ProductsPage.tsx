import { useEffect, useState } from 'react';
import { adminApi, type Product } from '../api/adminApi';
import ProductForm from '../components/ProductForm';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminApi.listProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await adminApi.deleteProduct(productId);
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div className="page-header">
        <div className="page-header-title">
          <h1>Products</h1>
          <p>Manage inventory, visibility, and pricing.</p>
        </div>
        <div className="page-header-actions">
          <button onClick={() => { setSelectedProduct(null); setShowForm(true); }} style={buttonStyle}>Add product</button>
        </div>
      </div>

      {error ? <div style={{ color: '#dc2626', marginBottom: 12 }}>{error}</div> : null}
      {success ? <div style={{ color: '#065f46', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '10px 12px', borderRadius: 10, marginBottom: 12 }}>{success}</div> : null}

      {showForm ? (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <strong>{selectedProduct ? 'Edit product' : 'Create product'}</strong>
            <button onClick={() => { setShowForm(false); setSelectedProduct(null); }} style={ghostButtonStyle}>Close</button>
          </div>
          <ProductForm
            product={selectedProduct}
            onDone={async (message, status) => {
              if (status === 'success') {
                setError('');
                await fetchProducts();
                setShowForm(false);
                setSelectedProduct(null);
                if (message) {
                  setSuccess(message);
                  window.setTimeout(() => setSuccess(''), 3000);
                }
                return;
              }
              if (status === 'error') {
                setError(message || 'Could not save product');
              }
            }}
          />
        </div>
      ) : null}

      <div className="card">
        {loading ? <div>Loading products...</div> : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td data-label="Title">{product.title}</td>
                  <td data-label="Stock">{product.stock}</td>
                  <td data-label="Price">${(product.price / 100).toFixed(2)}</td>
                  <td data-label="Status">{product.isPublished ? 'Published' : 'Draft'}</td>
                  <td data-label="Actions">
                    <button onClick={() => { setSelectedProduct(product); setShowForm(true); }} style={ghostButtonStyle}>Edit</button>
                    <button onClick={() => handleDelete(product.id)} style={dangerButtonStyle}>Delete</button>
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

const buttonStyle: React.CSSProperties = {
  border: 'none',
  background: '#4f46e5',
  color: 'white',
  padding: '10px 14px',
  borderRadius: 10,
  cursor: 'pointer',
  fontWeight: 700,
};

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
