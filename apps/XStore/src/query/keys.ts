// src/query/keys.ts
export const queryKeys = {
  // Auth
  auth: {
    me: ['auth', 'me'],
    session: ['auth', 'session'],
  },

  // Products
  products: {
    all: ['products'],
    lists: () => [...queryKeys.products.all, 'list'],
    list: (filters?: any) => [...queryKeys.products.lists(), { filters }],
    details: () => [...queryKeys.products.all, 'detail'],
    detail: (id: string) => [...queryKeys.products.details(), id],
    categories: () => [...queryKeys.products.all, 'categories'],
  },

  // Cart
  cart: {
    all: ['cart'],
    detail: (id: string) => [...queryKeys.cart.all, 'detail', id],
    items: (id: string) => [...queryKeys.cart.detail(id), 'items'],
    summary: (id: string) => [...queryKeys.cart.detail(id), 'summary'],
  },

  // Orders
  orders: {
    all: ['orders'],
    lists: () => [...queryKeys.orders.all, 'list'],
    list: (params?: any) => [...queryKeys.orders.lists(), { params }],
    details: () => [...queryKeys.orders.all, 'detail'],
    detail: (id: string) => [...queryKeys.orders.details(), id],
  },

  // Wishlist
  wishlist: {
    all: ['wishlist'],
    items: () => [...queryKeys.wishlist.all, 'items'],
  },

  // Notification
  notifications: {
    all: ['notifications'],
    list: () => [...queryKeys.notifications.all, 'list'],
    settings: () => [...queryKeys.notifications.all, 'settings'],
  },

  // User
  user: {
    all: ['user'],
    profile: () => [...queryKeys.user.all, 'profile'],
    addresses: () => [...queryKeys.user.all, 'addresses'],
  },
};