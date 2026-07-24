// apps/mobile/src/hooks/useAuth.ts
import { useAuthStore } from '../store/slices/auth.slice';
import { authApi } from '../api/auth';
import { usePushNotifications } from './usePushNotifications';
import * as SecureStore from 'expo-secure-store';
import { useMutation } from '@tanstack/react-query';

export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout: logoutStore } = useAuthStore();
  const { registerTokenWithServer: registerPushToken, unregisterTokenWithServer: unregisterPushToken } = usePushNotifications();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: async (data) => {
      await SecureStore.setItemAsync('auth_token', data.access_token);
      await SecureStore.setItemAsync('refresh_token', data.refresh_token);
      setUser(data.customer);
      // register push token after login
      try {
        await registerPushToken();
      } catch (err) {
        console.warn('Push register after login failed', err);
      }
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: any) => authApi.register(userData),
    onSuccess: async (data) => {
      await SecureStore.setItemAsync('auth_token', data.access_token);
      setUser(data.customer);
    },
  });

  // Logout
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('refresh_token');
      try {
        await unregisterPushToken();
      } catch (err) {
        console.warn('Push unregister failed', err);
      }
      logoutStore();
    }
  };

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        const data = await authApi.getMe();
        setUser(data.customer);
        return true;
      }
      return false;
    } catch (error) {
      await SecureStore.deleteItemAsync('auth_token');
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    // expose async variants so callers can await and catch errors
    login: loginMutation.mutateAsync,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    registerLoading: registerMutation.isPending,
    registerError: registerMutation.error,
    logout,
    checkAuth,
  };
};