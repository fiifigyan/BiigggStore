// src/config/env.ts
import Constants from 'expo-constants';

export const ENV = {
  // API Base
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:9000',
  API_VERSION: process.env.EXPO_PUBLIC_API_VERSION || 'v1',

  // Auth Endpoints
  AUTH_LOGIN: process.env.EXPO_PUBLIC_AUTH_LOGIN || '/auth/login',
  AUTH_REGISTER: process.env.EXPO_PUBLIC_AUTH_REGISTER || '/auth/register',
  AUTH_ME: process.env.EXPO_PUBLIC_AUTH_ME || '/auth/me',
  AUTH_LOGOUT: process.env.EXPO_PUBLIC_AUTH_LOGOUT || '/auth/logout',
  AUTH_REFRESH: process.env.EXPO_PUBLIC_AUTH_REFRESH || '/auth/refresh',

  // Product Endpoints
  PRODUCTS: process.env.EXPO_PUBLIC_PRODUCTS || '/products',
  PRODUCTS_FEATURED: process.env.EXPO_PUBLIC_PRODUCTS_FEATURED || '/products/featured',
  PRODUCTS_SEARCH: process.env.EXPO_PUBLIC_PRODUCTS_SEARCH || '/products/search',
  PRODUCTS_CATEGORIES: process.env.EXPO_PUBLIC_PRODUCTS_CATEGORIES || '/products/categories',

  // Cart Endpoints
  CART: process.env.EXPO_PUBLIC_CART || '/cart',
  CART_ITEMS: process.env.EXPO_PUBLIC_CART_ITEMS || '/cart/items',
  CART_CLEAR: process.env.EXPO_PUBLIC_CART_CLEAR || '/cart/clear',

  // Order Endpoints
  ORDERS: process.env.EXPO_PUBLIC_ORDERS || '/orders',
  ORDERS_STATUS: process.env.EXPO_PUBLIC_ORDERS_STATUS || '/orders/:id/status',
  ORDERS_CANCEL: process.env.EXPO_PUBLIC_ORDERS_CANCEL || '/orders/:id/cancel',

  // User Endpoints
  USER_PROFILE: process.env.EXPO_PUBLIC_USER_PROFILE || '/users/profile',
  USER_ADDRESSES: process.env.EXPO_PUBLIC_USER_ADDRESSES || '/users/addresses',

  // Notification Endpoints
  NOTIFICATIONS: process.env.EXPO_PUBLIC_NOTIFICATIONS || '/notifications',
  NOTIFICATIONS_SETTINGS: process.env.EXPO_PUBLIC_NOTIFICATIONS_SETTINGS || '/notifications/settings',
  NOTIFICATIONS_READ_ALL: process.env.EXPO_PUBLIC_NOTIFICATIONS_READ_ALL || '/notifications/read-all',

  // Payment Endpoints
  PAYMENT_INITIATE: process.env.EXPO_PUBLIC_PAYMENT_INITIATE || '/payments/initiate',
  PAYMENT_VERIFY: process.env.EXPO_PUBLIC_PAYMENT_VERIFY || '/payments/verify',

  // Payment
  PAYSTACK_PUBLIC_KEY: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  CURRENCY: process.env.EXPO_PUBLIC_CURRENCY || 'GHS',

  // App
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'XStore',
  APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
} as const;