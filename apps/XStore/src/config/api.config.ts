// src/config/api.config.ts
import { ENV } from './env';

/**
 * API Configuration
 * All endpoints are loaded from environment variables
 * Never hardcode endpoints in components
 */
export const API_CONFIG = {
  // Base URL
  baseUrl: ENV.API_URL,
  version: ENV.API_VERSION || 'v1',

  // Auth Endpoints
  auth: {
    login: ENV.AUTH_LOGIN || '/auth/login',
    register: ENV.AUTH_REGISTER || '/auth/register',
    me: ENV.AUTH_ME || '/auth/me',
    logout: ENV.AUTH_LOGOUT || '/auth/logout',
    refresh: ENV.AUTH_REFRESH || '/auth/refresh',
  },

  // Product Endpoints
  products: {
    base: ENV.PRODUCTS || '/products',
    featured: ENV.PRODUCTS_FEATURED || '/products/featured',
    search: ENV.PRODUCTS_SEARCH || '/products/search',
    categories: ENV.PRODUCTS_CATEGORIES || '/products/categories',
    detail: (id: string) => `/products/${id}`,
  },

  // Cart Endpoints
  cart: {
    base: ENV.CART || '/cart',
    items: ENV.CART_ITEMS || '/cart/items',
    item: (itemId: string) => `/cart/items/${itemId}`,
    clear: ENV.CART_CLEAR || '/cart/clear',
  },

  // Order Endpoints
  orders: {
    base: ENV.ORDERS || '/orders',
    detail: (id: string) => `/orders/${id}`,
    status: (id: string) => `/orders/${id}/status`,
    cancel: (id: string) => `/orders/${id}/cancel`,
  },

  // User Endpoints
  users: {
    profile: ENV.USER_PROFILE || '/users/profile',
    addresses: ENV.USER_ADDRESSES || '/users/addresses',
    address: (id: string) => `/users/addresses/${id}`,
  },

  // Notification Endpoints
  notifications: {
    base: ENV.NOTIFICATIONS || '/notifications',
    settings: ENV.NOTIFICATIONS_SETTINGS || '/notifications/settings',
    readAll: ENV.NOTIFICATIONS_READ_ALL || '/notifications/read-all',
    markRead: (id: string) => `/notifications/${id}/read`,
  },

  // Payment Endpoints
  payment: {
    initiate: ENV.PAYMENT_INITIATE || '/payments/initiate',
    verify: ENV.PAYMENT_VERIFY || '/payments/verify',
  },
} as const;

// Type-safe API endpoint helper
export type ApiEndpoint = keyof typeof API_CONFIG;

// Helper to build full URL
export const buildUrl = (path: string): string => {
  return `${API_CONFIG.baseUrl}${API_CONFIG.version ? `/${API_CONFIG.version}` : ''}${path}`;
};

// Helper to replace URL parameters
export const replaceParams = (path: string, params: Record<string, string | number>): string => {
  let result = path;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });
  return result;
};