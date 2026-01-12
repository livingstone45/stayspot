import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Management Dashboard API
export const managementAPI = {
  // Dashboard Overview
  getDashboardStats: async (timeRange = 'month') => {
    try {
      const response = await api.get('/management/dashboard', { params: { timeRange } });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  },

  getKeyMetrics: async () => {
    try {
      const response = await api.get('/management/dashboard/metrics');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch key metrics:', error);
      throw error;
    }
  },

  getDashboardCharts: async (timeRange = 'month') => {
    try {
      const response = await api.get('/management/dashboard/charts', { params: { timeRange } });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard charts:', error);
      throw error;
    }
  },

  getRecentActivities: async (limit = 10) => {
    try {
      const response = await api.get('/management/dashboard/recent-activity', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch recent activities:', error);
      throw error;
    }
  },

  // Companies
  getCompanies: async (filters = {}) => {
    try {
      const response = await api.get('/management/companies', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch companies:', error);
      throw error;
    }
  },

  getCompanyById: async (id) => {
    try {
      const response = await api.get(`/management/companies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch company:', error);
      throw error;
    }
  },

  createCompany: async (data) => {
    try {
      const response = await api.post('/management/companies', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create company:', error);
      throw error;
    }
  },

  updateCompany: async (id, data) => {
    try {
      const response = await api.put(`/management/companies/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update company:', error);
      throw error;
    }
  },

  deleteCompany: async (id) => {
    try {
      const response = await api.delete(`/management/companies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete company:', error);
      throw error;
    }
  },

  // Properties
  getProperties: async (filters = {}) => {
    try {
      const response = await api.get('/management/properties', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      throw error;
    }
  },

  getPropertyById: async (id) => {
    try {
      const response = await api.get(`/management/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch property:', error);
      throw error;
    }
  },

  createProperty: async (data) => {
    try {
      const response = await api.post('/management/properties', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create property:', error);
      throw error;
    }
  },

  updateProperty: async (id, data) => {
    try {
      const response = await api.put(`/management/properties/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update property:', error);
      throw error;
    }
  },

  deleteProperty: async (id) => {
    try {
      const response = await api.delete(`/management/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete property:', error);
      throw error;
    }
  },

  // Tasks
  getTasks: async (filters = {}) => {
    try {
      const response = await api.get('/management/tasks', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  },

  getTaskById: async (id) => {
    try {
      const response = await api.get(`/management/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch task:', error);
      throw error;
    }
  },

  createTask: async (data) => {
    try {
      const response = await api.post('/management/tasks', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  },

  updateTask: async (id, data) => {
    try {
      const response = await api.put(`/management/tasks/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/management/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  },

  // Maintenance
  getMaintenance: async (filters = {}) => {
    try {
      const response = await api.get('/management/maintenance', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch maintenance requests:', error);
      throw error;
    }
  },

  getMaintenanceById: async (id) => {
    try {
      const response = await api.get(`/management/maintenance/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch maintenance request:', error);
      throw error;
    }
  },

  createMaintenance: async (data) => {
    try {
      const response = await api.post('/management/maintenance', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create maintenance request:', error);
      throw error;
    }
  },

  updateMaintenance: async (id, data) => {
    try {
      const response = await api.put(`/management/maintenance/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update maintenance request:', error);
      throw error;
    }
  },

  deleteMaintenance: async (id) => {
    try {
      const response = await api.delete(`/management/maintenance/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete maintenance request:', error);
      throw error;
    }
  },

  // Financial
  getFinancialSummary: async (timeRange = 'month') => {
    try {
      const response = await api.get('/management/financial/summary', { params: { timeRange } });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch financial summary:', error);
      throw error;
    }
  },

  getFinancialReports: async (filters = {}) => {
    try {
      const response = await api.get('/management/financial/reports', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch financial reports:', error);
      throw error;
    }
  },

  // Analytics
  getAnalytics: async (timeRange = 'month') => {
    try {
      const response = await api.get('/management/analytics', { params: { timeRange } });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      throw error;
    }
  },

  // Export
  exportData: async (type, format = 'csv') => {
    try {
      const response = await api.get(`/management/export/${type}`, {
        params: { format },
        responseType: format === 'pdf' ? 'blob' : 'json',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  },

  // Bulk operations
  bulkUpdateProperties: async (ids, data) => {
    try {
      const response = await api.post('/management/properties/bulk-update', { ids, data });
      return response.data;
    } catch (error) {
      console.error('Failed to bulk update properties:', error);
      throw error;
    }
  },

  bulkUpdateTasks: async (ids, data) => {
    try {
      const response = await api.post('/management/tasks/bulk-update', { ids, data });
      return response.data;
    } catch (error) {
      console.error('Failed to bulk update tasks:', error);
      throw error;
    }
  },

  bulkUpdateMaintenance: async (ids, data) => {
    try {
      const response = await api.post('/management/maintenance/bulk-update', { ids, data });
      return response.data;
    } catch (error) {
      console.error('Failed to bulk update maintenance:', error);
      throw error;
    }
  },
};

export default api;
