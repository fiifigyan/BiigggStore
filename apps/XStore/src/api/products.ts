import { apiClient } from './client';
import { API_CONFIG } from '../config/api.config';

export const productApi = {
  // Get products with filters
  getProducts: async (params?: {
    limit?: number;
    offset?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
    order?: string;
    isFeatured?: boolean;
    is_featured?: boolean;
    q?: string;
  }) => {
    const { data } = await apiClient.get(API_CONFIG.products.base, { params });
    return data;
  },

  // Get single product
  getProduct: async (id: string) => {
    const { data } = await apiClient.get(API_CONFIG.products.detail(id));
    return data;
  },

  // Get featured products
  getFeatured: async (limit: number = 10) => {
    const { data } = await apiClient.get(API_CONFIG.products.featured, {
      params: { limit },
    });
    return data;
  },

  // Search products
  searchProducts: async (query: string) => {
    const { data } = await apiClient.get(API_CONFIG.products.search, {
      params: { q: query },
    });
    return data;
  },

  // Get product categories
  getCategories: async () => {
    const { data } = await apiClient.get(API_CONFIG.products.categories);
    return data;
  },

  // Get product reviews
  getProductReviews: async (productId: string) => {
    const { data } = await apiClient.get(`/products/${productId}/reviews`);
    return data;
  },

  // Add product review
  addProductReview: async (productId: string, rating: number, comment: string) => {
    const { data } = await apiClient.post(`/products/${productId}/reviews`, {
      rating,
      comment,
    });
    return data;
  },
};