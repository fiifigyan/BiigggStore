import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { useAuthStore } from '../store/slices/auth.slice';
import { API_CONFIG } from '../config/api.config';

const configuredBaseUrl = (API_CONFIG.baseUrl || 'http://localhost:9000').trim().replace(/\/$/, '');

export const apiClient = axios.create({
  baseURL: `${configuredBaseUrl}/api`,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  transformRequest: [(data, headers) => {
    // Ensure proper JSON serialization
    if (data && typeof data === 'object') {
      return JSON.stringify(data);
    }
    return data;
  }],
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Log outgoing request
      const method = (config.method || 'GET').toString().toUpperCase();
      const body = config.data;
      
      // Verify Content-Type is set correctly
      if (method !== 'GET' && method !== 'HEAD' && body) {
        config.headers['Content-Type'] = 'application/json';
        // Ensure data is stringified if it's an object
        if (typeof body === 'object' && !(body instanceof FormData)) {
          console.log(`[apiClient] ${method} ${config.url}`, JSON.stringify(body));
        } else {
          console.log(`[apiClient] ${method} ${config.url}`, body);
        }
      } else {
        console.log(`[apiClient] ${method} ${config.url}`);
      }
      
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('[apiClient][response success]', {
      status: response.status,
      url: response.config?.url,
      method: response.config?.method?.toUpperCase(),
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Enhanced error logging
    const isNetworkError = !error.response && error.code === 'ERR_NETWORK';
    const isTimeoutError = error.code === 'ECONNABORTED';
    
    console.error('[apiClient][response error]', {
      method: originalRequest?.method?.toUpperCase(),
      url: originalRequest?.url,
      baseURL: originalRequest?.baseURL,
      status: error.response?.status,
      code: error.code,
      message: error.message,
      isNetworkError,
      isTimeoutError,
      hasResponse: !!error.response,
      hasRequest: !!error.request,
      requestURL: `${originalRequest?.baseURL}${originalRequest?.url}`,
    });

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        if (refreshToken) {
          const response = await apiClient.post('/auth/refresh', {
            refresh_token: refreshToken,
          });
          await SecureStore.setItemAsync('auth_token', response.data.access_token);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('refresh_token');
        // Clear auth state so app can react and navigate to login
        try {
          useAuthStore.getState().logout();
        } catch (e) {
          console.error('Failed to clear auth store after refresh failure', e);
        }
        // Notify user
        try {
          Alert.alert('Session expired', 'Please login again to continue.');
        } catch (e) {
          // Ignore UI errors in non-UI contexts
        }
      }
    }

    return Promise.reject(error);
  }
);