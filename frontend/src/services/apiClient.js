/**
 * API Client for StaySpot Backend
 * Handles all HTTP requests to the backend API
 */

// Use environment variable or default to production backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://stayspot-backend.vercel.app/api';

const apiClient = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken') || localStorage.getItem('mockAuthToken');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  // Authentication endpoints
  auth: {
    login: (email, password) =>
      apiClient.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    
    register: (userData) =>
      apiClient.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    logout: () =>
      apiClient.request('/auth/logout', { method: 'POST' }),

    getCurrentUser: () =>
      apiClient.request('/auth/me', { method: 'GET' }),
  },

  // Properties endpoints
  properties: {
    getAll: (filters = {}) => {
      const query = new URLSearchParams(filters).toString();
      return apiClient.request(`/properties?${query}`, { method: 'GET' });
    },

    getById: (id) =>
      apiClient.request(`/properties/${id}`, { method: 'GET' }),

    create: (data) =>
      apiClient.request('/properties', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id, data) =>
      apiClient.request(`/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id) =>
      apiClient.request(`/properties/${id}`, { method: 'DELETE' }),
  },

  // Tenants endpoints
  tenants: {
    getAll: () =>
      apiClient.request('/tenants', { method: 'GET' }),

    getById: (id) =>
      apiClient.request(`/tenants/${id}`, { method: 'GET' }),

    create: (data) =>
      apiClient.request('/tenants', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id, data) =>
      apiClient.request(`/tenants/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id) =>
      apiClient.request(`/tenants/${id}`, { method: 'DELETE' }),
  },

  // Users endpoints
  users: {
    getProfile: () =>
      apiClient.request('/users/profile', { method: 'GET' }),

    updateProfile: (data) =>
      apiClient.request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    changePassword: (oldPassword, newPassword) =>
      apiClient.request('/users/password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword }),
      }),
  },
};

export default apiClient;
