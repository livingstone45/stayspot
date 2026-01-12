import axios from './axios';
import { getLocalStorage, setLocalStorage, removeLocalStorage, STORAGE_KEYS } from '../helpers/storage';

// Request interceptor
axios.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = getLocalStorage(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (process.env.NODE_ENV === 'development') {
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;
      console.log(`API ${response.config.method?.toUpperCase()} ${response.config.url}: ${duration}ms`);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getLocalStorage(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (refreshToken) {
          const response = await axios.post('/auth/refresh', {
            refreshToken
          });

          const { token, refreshToken: newRefreshToken } = response.data.data;
          
          setLocalStorage(STORAGE_KEYS.AUTH_TOKEN, token);
          setLocalStorage(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        removeLocalStorage(STORAGE_KEYS.AUTH_TOKEN);
        removeLocalStorage(STORAGE_KEYS.REFRESH_TOKEN);
        removeLocalStorage(STORAGE_KEYS.USER_DATA);
        
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      error.message = 'Server error. Please try again later.';
    }

    return Promise.reject(error);
  }
);

export default axios;