import axios, { type AxiosError } from 'axios';

import { env } from '@/env';

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
});

if (env.VITE_ENABLE_API_DELAY) {
  api.interceptors.request.use(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return config;
  });
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    // Ignora erros que não sejam 401 ou que já foram retentados
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Evita loop infinito na própria rota de refresh
    if (originalRequest.url?.includes('/auth/session/refresh')) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Enfileira as requisições que chegaram enquanto o refresh está em andamento
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post('/auth/session/refresh');
      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      return Promise.reject(
        refreshError instanceof Error
          ? refreshError
          : new Error('Session refresh failed', { cause: refreshError }),
      );
    } finally {
      isRefreshing = false;
    }
  },
);
