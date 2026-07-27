const API_BASE = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_API_URL || 'http://localhost:9000/api/admin';
const STORAGE_KEY = 'xadmin-secret';

export const getStoredAdminSecret = () => window.localStorage.getItem(STORAGE_KEY) || '';

export const setAdminSecret = (secret: string) => {
  if (secret) {
    window.localStorage.setItem(STORAGE_KEY, secret);
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
};

const getAdminSecret = () => getStoredAdminSecret() || (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_ADMIN_SECRET || 'dev-admin-secret';

const headers = () => ({
  'Content-Type': 'application/json',
  'x-admin-secret': getAdminSecret(),
});

async function request(path: string, init: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...headers(),
      ...(init.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export type Product = {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  compareAt?: number | null;
  stock: number;
  category?: string | null;
  subcategory?: string | null;
  isPublished?: boolean;
  isFeatured?: boolean;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  paymentStatus: string;
  tracking?: string | null;
  notes?: string | null;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  };
  items?: Array<{ id: string; quantity: number; price: number; product?: { title?: string } }>;
};

export const adminApi = {
  listProducts: async (): Promise<Product[]> => {
    const response = await request('/products');
    return response.products || [];
  },
  createProduct: async (payload: Partial<Product>) => request('/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  uploadImages: async (files: File[]) => {
    // Direct upload to Cloudinary with server-signed params, track aggregated progress
    // 1) request signature
    const signResp = await request('/upload/sign', { method: 'POST' });
    const cloudName = signResp.cloud_name || signResp.cloudName || (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = signResp.api_key;
    const signature = signResp.signature;
    const timestamp = signResp.timestamp;
    const folder = signResp.folder || 'xstore';

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const totalBytes = files.reduce((s, f) => s + (f.size || 0), 0);
    let uploadedBytes = 0;
    const uploadedUrls: string[] = [];

    for (const file of files) {
      await new Promise<void>((resolve, reject) => {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('api_key', apiKey);
        fd.append('timestamp', String(timestamp));
        fd.append('signature', signature);
        fd.append('folder', folder);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadUrl);
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              if (data.secure_url) uploadedUrls.push(data.secure_url);
              else if (data.url) uploadedUrls.push(data.url);
              uploadedBytes += file.size || 0;
              resolve();
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error('Upload failed'));
          }
        };
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.upload.onprogress = (ev) => {
          if ((adminApi as any).__onUploadProgress) {
            const cumulative = uploadedBytes + (ev.loaded || 0);
            const percent = totalBytes > 0 ? Math.round((cumulative / totalBytes) * 100) : 0;
            (adminApi as any).__onUploadProgress({ loaded: cumulative, total: totalBytes, percent } as any);
          }
        };
        xhr.send(fd);
      });
    }

    return { success: true, images: uploadedUrls };
  },
  updateProduct: async (id: string, payload: Partial<Product>) => request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  deleteImage: async (imageUrl: string) => request('/upload/delete', {
    method: 'POST',
    body: JSON.stringify({ imageUrl }),
  }),
  deleteProduct: async (id: string) => request(`/products/${id}`, {
    method: 'DELETE',
  }),
  listOrders: async (): Promise<Order[]> => {
    const response = await request('/orders');
    return response.orders || [];
  },
  updateOrder: async (id: string, payload: Partial<Order>) => request(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  deleteOrder: async (id: string) => request(`/orders/${id}`, {
    method: 'DELETE',
  }),
};
