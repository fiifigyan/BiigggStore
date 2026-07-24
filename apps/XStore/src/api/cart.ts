import { apiClient } from './client';
import { API_CONFIG } from '../config/api.config';

export const cartApi = {
  // Get cart
  getCart: async () => {
    const { data } = await apiClient.get(API_CONFIG.cart.base);
    return data;
  },

  // Add item to cart
  addItem: async (productId: string, quantity: number) => {
    const { data } = await apiClient.post(API_CONFIG.cart.items, {
      productId,
      quantity,
    });
    return data;
  },

  // Update cart item quantity
  updateItemQuantity: async (itemId: string, quantity: number) => {
    const { data } = await apiClient.put(API_CONFIG.cart.item(itemId), {
      quantity,
    });
    return data;
  },

  // Remove item from cart
  removeItem: async (itemId: string) => {
    const { data } = await apiClient.delete(API_CONFIG.cart.item(itemId));
    return data;
  },

  // Clear cart
  clearCart: async () => {
    const { data } = await apiClient.delete(API_CONFIG.cart.clear);
    return data;
  },

  // Apply coupon
  applyCoupon: async (couponCode: string) => {
    const { data } = await apiClient.post('/cart/coupon', {
      code: couponCode,
    });
    return data;
  },

  // Remove coupon
  removeCoupon: async () => {
    const { data } = await apiClient.delete('/cart/coupon');
    return data;
  },
};