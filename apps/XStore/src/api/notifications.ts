import { apiClient } from './client';
import { API_CONFIG } from '../config/api.config';

export const notificationApi = {
  getNotifications: async () => {
    const { data } = await apiClient.get(API_CONFIG.notifications.base);
    return data.notifications;
  },

  markAsRead: async (notificationId: string) => {
    const { data } = await apiClient.patch(API_CONFIG.notifications.markRead(notificationId));
    return data.notification;
  },

  markAllAsRead: async () => {
    const { data } = await apiClient.patch(API_CONFIG.notifications.readAll);
    return data;
  },

  getSettings: async () => {
    const { data } = await apiClient.get(API_CONFIG.notifications.settings);
    return data.settings;
  },

  updateSettings: async (notificationsEnabled: boolean) => {
    const { data } = await apiClient.put(API_CONFIG.notifications.settings, {
      notificationsEnabled,
    });
    return data.settings;
  },
};
