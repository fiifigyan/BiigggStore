import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { API_CONFIG } from '../config/api.config';

// Resolve base URL for device testing: prefer the Expo dev-server host and
// fall back to a few common local network addresses so physical devices can
// reach the backend across different Wi-Fi setups.
const resolveCandidateBaseUrls = (): string[] => {
  const configuredBase = (API_CONFIG.baseUrl || 'http://localhost:9000').trim();
  const candidates = new Set<string>();

  const addCandidate = (value?: string | null) => {
    if (!value) return;
    const normalized = value.trim().replace(/\/$/, '');
    if (!normalized) return;
    candidates.add(normalized);
  };

  const resolveHostFromExpo = (): string | null => {
    try {
      const candidates = [
        (Constants as any)?.expoConfig?.hostUri,
        (Constants as any)?.manifest?.hostUri,
        (Constants as any)?.manifest?.debuggerHost,
        (Constants as any)?.manifest2?.extra?.expoGo?.debuggerHost,
        (Constants as any)?.expoConfig?.extra?.expoGo?.debuggerHost,
      ];

      for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate) {
          const host = candidate.split(':')[0];
          if (host && host !== 'localhost' && host !== '127.0.0.1') {
            return host;
          }
        }
      }
    } catch (e) {
      // ignore and keep original
    }

    return null;
  };

  const expoHost = resolveHostFromExpo();
  addCandidate(configuredBase);
  addCandidate('http://localhost:9000');

  if (expoHost) {
    addCandidate(`http://${expoHost}:9000`);
  }

  addCandidate('http://192.168.8.119:9000');
  addCandidate('http://192.168.8.1:9000');
  addCandidate('http://10.0.0.1:9000');

  return Array.from(candidates);
};

const baseUrlCandidates = resolveCandidateBaseUrls();
let currentBaseUrlIndex = 0;

const getCurrentBaseUrl = () => baseUrlCandidates[currentBaseUrlIndex] || baseUrlCandidates[0];

const setNextBaseUrl = () => {
  currentBaseUrlIndex = (currentBaseUrlIndex + 1) % baseUrlCandidates.length;
  return getCurrentBaseUrl();
};

export const apiClient = axios.create({
  baseURL: `${getCurrentBaseUrl()}/api`,
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
        if (typeof body === 'object' && !Buffer.isBuffer(body) && !(body instanceof FormData)) {
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

    if (isNetworkError && originalRequest && !originalRequest.__isRetry && baseUrlCandidates.length > 1) {
      originalRequest.__isRetry = true;
      const nextBaseUrl = setNextBaseUrl();
      originalRequest.baseURL = `${nextBaseUrl}/api`;
      console.log('[apiClient] Retrying request with', originalRequest.baseURL);
      return apiClient(originalRequest);
    }

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
        // Redirect to login
        // We'll handle this in the app state
      }
    }

    return Promise.reject(error);
  }
);