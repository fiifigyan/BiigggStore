import { apiClient } from './client';
import { API_CONFIG } from '../config/api.config';

export const orderApi = {
  // Create order
  createOrder: async (data: {
    address: any;
    paymentId?: string;
  }) => {
    const { data: response } = await apiClient.post(API_CONFIG.orders.base, data);
    return response;
  },

  // Get user's orders
  getOrders: async (params?: {
    limit?: number;
    offset?: number;
  }) => {
    const { data } = await apiClient.get(API_CONFIG.orders.base, { params });
    return data.orders ?? [];
  },

  // Get single order
  getOrder: async (orderId: string) => {
    const { data } = await apiClient.get(API_CONFIG.orders.detail(orderId));
    return data;
  },

  // Get order status
  getOrderStatus: async (orderId: string) => {
    const { data } = await apiClient.get(API_CONFIG.orders.status(orderId));
    return data;
  },

  // Cancel order
  cancelOrder: async (orderId: string) => {
    const { data } = await apiClient.post(API_CONFIG.orders.cancel(orderId));
    return data;
  },
};