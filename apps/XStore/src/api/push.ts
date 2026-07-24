import { apiClient } from './client';
import { API_CONFIG } from '../config/api.config';

export const pushApi = {
  register: async (token: string, platform?: string) => {
    const { data } = await apiClient.post(`${API_CONFIG.notifications.base}/device/register`, {
      token,
      platform,
    });
    return data;
  },

  unregister: async (tokenOrId: string) => {
    const { data } = await apiClient.post(`${API_CONFIG.notifications.base}/device/unregister`, {
      token: tokenOrId,
    });
    return data;
  },
};
