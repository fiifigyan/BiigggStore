import { useEffect, useState } from 'react';
import { adminApi, type Product } from '../api/adminApi';

const CATEGORIES = ['General', 'Clothes', 'Perfumes', 'Skin Care', 'Accessories'];

const emptyProduct = {
  title: '',
  description: '',
  price: 0,
  compareAt: 0,
  stock: 0,
  category: 'General',
  subcategory: '',
  isPublished: true,
  isFeatured: false,
  images: [] as string[],
};

type Props = {
  product?: Product | null;
  onDone: (message?: string, status?: 'success' | 'error') => void;
};

export default function ProductForm({ product, onDone }: Props) {
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!successMessage) return;
    const timeout = window.setTimeout(() => setSuccessMessage(''), 3000);
    return () => window.clearTimeout(timeout);
  }, [successMessage]);

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || '',
        description: product.description || '',
        price: product.price || 0,
        compareAt: product.compareAt || 0,
        stock: product.stock || 0,
        category: product.category || 'General',
        subcategory: product.subcategory || '',
        isPublished: product.isPublished ?? true,
        isFeatured: product.isFeatured ?? false,
        images: product.images || [],
      });
    }
  }, [product]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      (adminApi as any).__onUploadProgress = (ev: ProgressEvent) => {
        if (ev.lengthComputable) {
          setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
        }
      };

      const result = await adminApi.uploadImages(files as File[]);
      const dataUrls = result.images as string[];
      (adminApi as any).__onUploadProgress = undefined;

      setForm((current) => ({
        ...current,
        images: Array.from(new Set([...current.images, ...dataUrls.filter(Boolean)])),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read selected images');
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  const removeImage = async (url: string) => {
    if (url.startsWith('http')) {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      try {
        await adminApi.deleteImage(url);
        setSuccessMessage('Image removed successfully');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not delete image');
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    setForm((current) => ({ ...current, images: current.images.filter((image) => image !== url) }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        images: form.images.filter(Boolean),
      };

      if (product?.id) {
        const result = await adminApi.updateProduct(product.id, payload);
        console.debug('POST /products/:id response', result);
        onDone('Product updated successfully', 'success');
      } else {
        const result = await adminApi.createProduct(payload);
        console.debug('POST /products response', result);
        onDone('Product created successfully', 'success');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not save product';
      console.error('Product save failed', err);
      setError(message);
      onDone(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {successMessage ? (
        <div style={{ position: 'absolute', right: 0, top: -40, background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '10px 14px', borderRadius: 12, boxShadow: '0 10px 25px rgba(15, 23, 42, 0.12)', zIndex: 10 }}>
          {successMessage}
        </div>
      ) : null}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        {error ? <div style={{ color: '#dc2626' }}>{error}</div> : null}
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required style={inputStyle} />
        <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" style={{ ...inputStyle, minHeight: 90 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={labelStyle}>Price</span>
            <input
              type="number"
              value={form.price || ''}
              onChange={(e) => setForm({ ...form, price: e.target.value ? Number(e.target.value) : 0 })}
              placeholder="0"
              style={inputStyle}
            />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={labelStyle}>Compare at</span>
            <input
              type="number"
              value={form.compareAt || ''}
              onChange={(e) => setForm({ ...form, compareAt: e.target.value ? Number(e.target.value) : 0 })}
              placeholder="0"
              style={inputStyle}
            />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={labelStyle}>Stock</span>
            <input
              type="number"
              value={form.stock || ''}
              onChange={(e) => setForm({ ...form, stock: e.target.value ? Number(e.target.value) : 0 })}
              placeholder="0"
              style={inputStyle}
            />
          </label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={labelStyle}>Category</span>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{ ...inputStyle, appearance: 'none', background: 'white' }}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={labelStyle}>Subcategory</span>
            <input value={form.subcategory || ''} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} placeholder="Subcategory" style={inputStyle} />
          </label>
        </div>
        <div>
          <label style={{ display: 'grid', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>Product images</span>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ ...inputStyle, padding: 8 }} />
          </label>
          {form.images.length ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
              {form.images.map((image) => (
                <div key={image} style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', background: '#f8fafc' }}>
                  <img src={image} alt="Product preview" style={{ width: '100%', height: 92, objectFit: 'cover', display: 'block' }} />
                  <button type="button" onClick={() => removeImage(image)} style={{ width: '100%', border: 'none', background: '#fee2e2', color: '#b91c1c', padding: '6px 8px', cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#64748b', fontSize: 13 }}>No images yet — pick one or more photos from your device to enrich the product card.</div>
          )}
          {uploadProgress > 0 && uploadProgress < 100 ? (
            <div style={{ marginTop: 8 }}>
              <div style={{ height: 8, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${uploadProgress}%`, background: '#4f46e5' }} />
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>{uploadProgress}%</div>
            </div>
          ) : null}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={Boolean(form.isPublished)} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
          Published
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={Boolean(form.isFeatured)} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
          Featured
        </label>
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Saving...' : product?.id ? 'Update product' : 'Create product'}
        </button>
      </form>
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

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#475569',
  fontWeight: 700,
};

