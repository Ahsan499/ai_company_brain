import axios from 'axios';
import { clearAuthSession, getToken } from './authSession';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    Accept: 'application/json',
  },
});

let onUnauthorized = null;

/** Register a handler invoked on 401 (except login/register). */
export function setUnauthorizedHandler(handler) {
  onUnauthorized = typeof handler === 'function' ? handler : null;
}

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = String(error.config?.url || '');
    const isCredentialAttempt =
      url.includes('/auth/login') || url.includes('/auth/register');

    if (status === 401 && !isCredentialAttempt) {
      clearAuthSession();
      onUnauthorized?.();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
