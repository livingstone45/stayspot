import axios from 'axios';
import { toast } from 'react-hot-toast';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Token management utilities
const tokenManager = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  },
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  isTokenExpired: (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
};

// Flag to prevent multiple redirect attempts
let isRedirecting = false;

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token && !tokenManager.isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Add timestamp
    config.headers['X-Request-Time'] = new Date().toISOString();

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
        params: config.params
      });
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling responses and errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }

    // Return response as-is - backend already returns proper structure
    // Structure: { success: true, message: "...", data: {...} }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log errors in development
    if (import.meta.env.DEV) {
      console.error(`❌ ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }

    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject({
        message: 'Network error',
        type: 'NETWORK_ERROR',
        originalError: error
      });
    }

    const { status, data } = error.response;

    // Handle token refresh for 401 errors
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken && !tokenManager.isTokenExpired(refreshToken)) {
          const response = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            { refreshToken }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data.data || response.data;
          tokenManager.setTokens(accessToken, newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }

      // Clear tokens and redirect to login (prevent multiple redirects)
      if (!isRedirecting) {
        isRedirecting = true;
        tokenManager.clearTokens();
        localStorage.removeItem('user');
        localStorage.removeItem('permissions');
        localStorage.removeItem('roles');
        window.location.href = '/auth/login';
      }

      return Promise.reject({
        message: 'Session expired. Please login again.',
        type: 'AUTH_ERROR',
        status: 401
      });
    }

    // Handle different error status codes
    const errorHandlers = {
      400: () => ({
        message: data?.message || 'Bad request. Please check your input.',
        type: 'VALIDATION_ERROR',
        errors: data?.errors || {}
      }),
      403: () => ({
        message: data?.message || 'Access denied. You don\'t have permission.',
        type: 'PERMISSION_ERROR'
      }),
      404: () => ({
        message: data?.message || 'Resource not found.',
        type: 'NOT_FOUND_ERROR'
      }),
      409: () => ({
        message: data?.message || 'Conflict. Resource already exists.',
        type: 'CONFLICT_ERROR'
      }),
      422: () => ({
        message: data?.message || 'Validation failed.',
        type: 'VALIDATION_ERROR',
        errors: data?.errors || {}
      }),
      429: () => ({
        message: data?.message || 'Too many requests. Please try again later.',
        type: 'RATE_LIMIT_ERROR'
      }),
      500: () => ({
        message: data?.message || 'Internal server error. Please try again.',
        type: 'SERVER_ERROR'
      }),
      502: () => ({
        message: 'Bad gateway. Server is temporarily unavailable.',
        type: 'SERVER_ERROR'
      }),
      503: () => ({
        message: 'Service unavailable. Please try again later.',
        type: 'SERVER_ERROR'
      })
    };

    const errorHandler = errorHandlers[status];
    const errorInfo = errorHandler ? errorHandler() : {
      message: data?.message || 'An unexpected error occurred.',
      type: 'UNKNOWN_ERROR'
    };

    // Show toast notification for errors (except validation errors)
    if (!['VALIDATION_ERROR'].includes(errorInfo.type)) {
      toast.error(errorInfo.message);
    }

    return Promise.reject({
      ...errorInfo,
      status,
      originalError: error,
      response: error.response
    });
  }
);

// API utility functions
export const apiUtils = {
  // Create form data for file uploads
  createFormData: (data, files = {}) => {
    const formData = new FormData();
    
    // Add regular data
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    // Add files
    Object.keys(files).forEach(key => {
      const fileList = files[key];
      if (fileList) {
        if (Array.isArray(fileList)) {
          fileList.forEach(file => formData.append(key, file));
        } else {
          formData.append(key, fileList);
        }
      }
    });

    return formData;
  },

  // Build query string from object
  buildQueryString: (params) => {
    const searchParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, item));
        } else {
          searchParams.append(key, value);
        }
      }
    });

    return searchParams.toString();
  },

  // Cancel token utilities
  createCancelToken: () => axios.CancelToken.source(),
  
  // Check if error is cancel error
  isCancelError: (error) => axios.isCancel(error),

  // Retry failed requests
  retryRequest: async (requestConfig, maxRetries = 3, delay = 1000) => {
    let lastError;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await api(requestConfig);
      } catch (error) {
        lastError = error;
        
        if (i < maxRetries && error.response?.status >= 500) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        } else {
          break;
        }
      }
    }
    
    throw lastError;
  }
};

// Export configured axios instance
export default api;

// Export token manager for external use
export { tokenManager };
