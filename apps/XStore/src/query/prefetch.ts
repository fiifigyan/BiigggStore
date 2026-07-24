// src/query/prefetch.ts
import { queryClient } from './client';
import { productApi } from '../api/products';
import { cartApi } from '../api/cart';
import { orderApi } from '../api/orders';
import { userApi } from '../api/users';
import { queryKeys } from './keys';

export const prefetchQueries = {
  // Prefetch home page data
  home: async () => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.products.list({ limit: 10, isFeatured: true }),
        queryFn: () => productApi.getProducts({ limit: 10, isFeatured: true }),
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.products.categories(),
        queryFn: () => productApi.getCategories(),
      }),
    ]);
  },

  // Prefetch product detail
  product: async (productId: string) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.products.detail(productId),
      queryFn: () => productApi.getProduct(productId),
    });
  },

  // Prefetch search results
  search: async (query: string) => {
    if (query.length > 2) {
      await queryClient.prefetchQuery({
        queryKey: ['search', query],
        queryFn: () => productApi.searchProducts(query),
      });
    }
  },

  // Prefetch user profile (after login)
  profile: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.user.profile(),
      queryFn: () => userApi.getProfile(),
    });
  },

  // Prefetch cart
  cart: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.cart.all,
      queryFn: () => cartApi.getCart(),
    });
  },

  // Prefetch orders
  orders: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.orders.list(),
      queryFn: () => orderApi.getOrders(),
    });
  },
};