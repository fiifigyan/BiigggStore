// apps/mobile/src/utils/helpers.ts
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export const helpers = {
  // Generate unique ID
  generateId: (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  },

  // Truncate text
  truncate: (text: string, length: number = 50): string => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  },

  // Delay function (useful for animations)
  delay: (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  // Get platform
  isIOS: (): boolean => Platform.OS === 'ios',
  isAndroid: (): boolean => Platform.OS === 'android',

  // Haptic feedback
  haptic: {
    light: () => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    medium: () => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    },
    heavy: () => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    },
    success: () => {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    error: () => {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    },
  },

  // Deep link parser
  parseDeepLink: (url: string): { type: string; params: Record<string, string> } => {
    const urlParts = url.split('://');
    const scheme = urlParts[0];
    const path = urlParts[1] || '';
    const [pathname, queryString] = path.split('?');

    const params: Record<string, string> = {};
    if (queryString) {
      queryString.split('&').forEach((param) => {
        const [key, value] = param.split('=');
        if (key && value) {
          params[key] = decodeURIComponent(value);
        }
      });
    }

    return {
      type: pathname.split('/')[0] || '',
      params,
    };
  },
};