// apps/mobile/src/config/constants.ts
export const Constants = {
  // App
  APP_NAME: 'XStore',
  APP_VERSION: '1.0.0',

  // API
  API_TIMEOUT: 30000,
  STALE_TIME: 5 * 60 * 1000, // 5 minutes

  // Pagination
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Currency
  CURRENCY: 'GHS', // Ghana Cedis
  CURRENCY_SYMBOL: '₵',
  CURRENCY_LOCALE: 'en-GH',
  CURRENCY_MINOR_UNIT: 100, // 1 GHS = 100 pesewas

  // Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    CART: 'cart_storage',
    WISHLIST: 'wishlist_storage',
    SEARCH_HISTORY: 'search_history',
    USER_PREFS: 'user_preferences',
  },

  // Deep Links
  DEEP_LINK_SCHEME: 'xstore',

  // Payment
  PAYSTACK_CHANNELS: ['card', 'bank', 'ussd', 'mobile_money'],

  // Categories
  CATEGORIES: [
    { id: 'clothes', name: 'Clothes', icon: 'shirt-outline' },
    { id: 'perfumes', name: 'Perfumes', icon: 'flask-outline' },
    { id: 'skin-care', name: 'Skin Care', icon: 'sparkles-outline' },
    { id: 'accessories', name: 'Accessories', icon: 'diamond-outline' },
  ],

  // Order Status Colors
  ORDER_STATUS: {
    pending: '#FF9500',
    completed: '#34C759',
    cancelled: '#FF3B30',
    refunded: '#8E8E93',
    processing: '#007AFF',
    shipped: '#5856D6',
  },
} as const;