import { apiClient } from './client';
import { API_CONFIG } from '../config/api.config';

export const userApi = {
  // Get user profile
  getProfile: async () => {
    const { data } = await apiClient.get(API_CONFIG.users.profile);
    return data;
  },

  // Update profile
  updateProfile: async (updateData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
  }) => {
    const { data } = await apiClient.put(API_CONFIG.users.profile, updateData);
    return data;
  },

  // Get addresses
  getAddresses: async () => {
    const { data } = await apiClient.get(API_CONFIG.users.addresses);
    return data;
  },

  // Add address
  addAddress: async (address: {
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
    isDefault?: boolean;
  }) => {
    const { data } = await apiClient.post(API_CONFIG.users.addresses, address);
    return data;
  },

  // Update address
  updateAddress: async (addressId: string, address: any) => {
    const { data } = await apiClient.put(API_CONFIG.users.address(addressId), address);
    return data;
  },

  // Delete address
  deleteAddress: async (addressId: string) => {
    const { data } = await apiClient.delete(API_CONFIG.users.address(addressId));
    return data;
  },
};