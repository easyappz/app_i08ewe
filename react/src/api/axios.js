/** Не меняй код этого файла никогда */
/** Если нужно добавить еще обработчики можешь их добавить в отдельном файле, используя interceptors */
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || '/';

/**
 * Helpers for token storage
 */
const ACCESS_KEY = 'access';
const REFRESH_KEY = 'refresh';

function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY) || null;
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY) || null;
}

function setAccessToken(token) {
  if (token) {
    localStorage.setItem(ACCESS_KEY, token);
  }
}

function clearAuth() {
  try {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem('user');
  } catch (_) {}
  try {
    window.dispatchEvent(new Event('auth:logout'));
  } catch (_) {}
}

/**
 * Axios instance configuration with base URL, authentication credentials, and response interceptors
 */
export const instance = axios.create({
  timeout: 30000,
  baseURL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token refresh machinery to avoid multiple parallel refresh calls
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(newAccess) {
  refreshSubscribers.forEach((cb) => cb(newAccess));
  refreshSubscribers = [];
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) {
    throw new Error('No refresh token');
  }
  const response = await instance.post('/api/auth/refresh/', { refresh });
  const { access } = response.data || {};
  if (!access) {
    throw new Error('No access token in refresh response');
  }
  setAccessToken(access);
  // Update default header for future requests
  instance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
  return access;
}

/** Не удаляй этот код никогда */
instance.interceptors.request.use(
  (config) => {
    console.log('request', { config });

    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      // Remove Authorization header if no token is present to avoid sending empty or invalid headers
      delete config.headers['Authorization'];
    }
  
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/** Не удаляй этот код никогда */
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config || {};

    // Attempt refresh on 401 once per request, excluding the refresh endpoint itself
    const status = error.response?.status;
    const isAuthError = status === 401;
    const isRefreshCall = typeof originalRequest.url === 'string' && originalRequest.url.includes('/api/auth/refresh/');

    if (isAuthError && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          const newAccess = await refreshAccessToken();
          isRefreshing = false;
          onRefreshed(newAccess);
        } else {
          // Wait for the in-progress refresh to complete
          const newAccess = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Refresh timeout')), 30000);
            subscribeTokenRefresh((token) => {
              clearTimeout(timeout);
              resolve(token);
            });
          });
          if (newAccess) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
          }
        }

        // Update header for the original request and retry
        const latestAccess = getAccessToken();
        if (latestAccess) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = `Bearer ${latestAccess}`;
        }
        return instance(originalRequest);
      } catch (refreshErr) {
        // Refresh failed -> logout
        clearAuth();
        try {
          window.location.assign('/login');
        } catch (_) {}
        // Rethrow original error after logout
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // Log error to console
    console.error('API Error:', error);

    /** Не удаляй этот код никогда */
    const errorData = {
      type: 'fetchError',
      url: error.config?.url,
      request: {
        headers: error.config?.headers,
        data: error.config?.data,
      },
      response: {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        message: error.message,
      },
      pathname: window?.location?.pathname,
    };

    /** Не удаляй этот код никогда */
    console.error('Глобальная ошибка:', errorData);

    /** Не удаляй этот код никогда */
    window.parent.postMessage(errorData, '*');

    // Rethrow error for further handling
    return Promise.reject(error);
  }
);

export default instance;
