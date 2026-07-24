import { apiClient } from './client';
import { API_CONFIG } from '../config/api.config';

export const paymentApi = {
  // Initiate payment
  initiatePayment: async (data: {
    amount: number;
    email: string;
    currency?: string;
  }) => {
    const { data: response } = await apiClient.post(API_CONFIG.payment.initiate, data);
    return response;
  },

  // Verify payment
  verifyPayment: async (reference: string) => {
    const { data } = await apiClient.post(API_CONFIG.payment.verify, {
      reference,
    });
    return data;
  },

  // Complete order (after successful payment)
  completeOrder: async (orderId: string) => {
    const { data } = await apiClient.post(`/orders/${orderId}/complete`);
    return data;
  },

  // Get payment status
  getPaymentStatus: async (orderId: string) => {
    const { data } = await apiClient.get(`/orders/${orderId}/payment-status`);
    return data;
  },
};