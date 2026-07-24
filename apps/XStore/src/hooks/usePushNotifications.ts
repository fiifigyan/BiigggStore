import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import React from 'react';
import { pushApi } from '../api/push';

export const usePushNotifications = () => {
  const tokenRef = React.useRef<string | null>(null);

  const registerForPushNotificationsAsync = async () => {
    if (!Device.isDevice) {
      console.warn('Must use physical device for Push Notifications');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    console.log('Push notification token:', token);
    tokenRef.current = token;
    return token;
  };

  const registerTokenWithServer = async (userId?: string) => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (!token) return null;
      const platform = Constants.platform?.ios ? 'ios' : 'android';
      await pushApi.register(token, platform);
      return token;
    } catch (err) {
      console.error('Register token error', err);
      return null;
    }
  };

  const unregisterTokenWithServer = async () => {
    try {
      if (!tokenRef.current) return;
      await pushApi.unregister(tokenRef.current);
      tokenRef.current = null;
    } catch (err) {
      console.error('Unregister token error', err);
    }
  };

  return {
    registerTokenWithServer,
    unregisterTokenWithServer,
  };
};
