import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    Accept: 'application/json',
  },
});

let onUnauthorized = null;

function getApiRootUrl() {
  const apiBase = apiClient.defaults.baseURL || 'http://localhost:8000/api/v1';
  const url = new URL(apiBase, window.location.origin);
  return `${url.protocol}//${url.host}`;
}

/** Prime Sanctum CSRF cookie before state-changing auth requests. */
export async function getCsrfCookie() {
  const root = getApiRootUrl();
  return axios.get(`${root}/sanctum/csrf-cookie`, {
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    headers: {
      Accept: 'application/json',
    },
  });
}

/** Register a handler invoked on 401 (except login/register). */
export function setUnauthorizedHandler(handler) {
  onUnauthorized = typeof handler === 'function' ? handler : null;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = String(error.config?.url || '');
    const isCredentialAttempt =
      url.includes('/auth/login') || url.includes('/auth/register');

    if (status === 401 && !isCredentialAttempt) {
      onUnauthorized?.();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
