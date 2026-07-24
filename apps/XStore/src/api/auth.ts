import { apiClient } from './client';
import { API_CONFIG } from '../config/api.config';

export const authApi = {
  // Login user
  login: async (email: string, password: string) => {
    // Log endpoint and payload (mask password)
    console.log('[authApi] POST', API_CONFIG.auth.login, { email, password: '****' });
    const { data } = await apiClient.post(API_CONFIG.auth.login, {
      email,
      password,
    });
    return data;
  },

  // Register new user
  register: async (userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
  }) => {
    const normalizedPayload = {
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName ?? userData.first_name,
      lastName: userData.lastName ?? userData.last_name,
      phone: userData.phone,
    };

    // Log endpoint and payload (mask password)
    const safe = { ...normalizedPayload, password: '****' } as any;
    console.log('[authApi] POST', API_CONFIG.auth.register, safe);
    const { data } = await apiClient.post(API_CONFIG.auth.register, normalizedPayload);
    return data;
  },

  // Get current user
  getMe: async () => {
    const { data } = await apiClient.get(API_CONFIG.auth.me);
    return data;
  },

  // Update user profile
  updateProfile: async (updateData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
  }) => {
    const { data } = await apiClient.put(API_CONFIG.auth.me, updateData);
    return data;
  },

  // Change password
  changePassword: async (oldPassword: string, newPassword: string) => {
    const { data } = await apiClient.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return data;
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const { data } = await apiClient.post('/auth/forgot-password', {
      email,
    });
    return data;
  },

  // Reset password
  resetPassword: async (token: string, password: string) => {
    const { data } = await apiClient.post('/auth/reset-password', {
      token,
      password,
    });
    return data;
  },

  // Logout
  logout: async () => {
    const { data } = await apiClient.post(API_CONFIG.auth.logout);
    return data;
  },

  // Refresh token
  refreshToken: async () => {
    const { data } = await apiClient.post(API_CONFIG.auth.refresh);
    return data;
  },
};