import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Landlord Dashboard APIs
export const getLandlordDashboard = async () => {
  try {
    const response = await apiClient.get('/management/dashboard/landlord');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    throw error;
  }
};

// Communications APIs
export const getMessages = async (params = {}) => {
  try {
    const response = await apiClient.get('/communication/messages', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (data) => {
  try {
    const response = await apiClient.post('/communication/messages', data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getAnnouncements = async (params = {}) => {
  try {
    const response = await apiClient.get('/communication/announcements', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

export const createAnnouncement = async (data) => {
  try {
    const response = await apiClient.post('/communication/announcements', data);
    return response.data;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

export const sendBulkEmail = async (data) => {
  try {
    const response = await apiClient.post('/communication/bulk-email', data);
    return response.data;
  } catch (error) {
    console.error('Error sending bulk email:', error);
    throw error;
  }
};

// Analytics APIs
export const getAnalytics = async (params = {}) => {
  try {
    const response = await apiClient.get('/financial/analytics', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

export const getRevenueData = async (params = {}) => {
  try {
    const response = await apiClient.get('/financial/revenue', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    throw error;
  }
};

export const getOccupancyData = async (params = {}) => {
  try {
    const response = await apiClient.get('/financial/occupancy', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching occupancy data:', error);
    throw error;
  }
};

// Calendar/Events APIs
export const getEvents = async (params = {}) => {
  try {
    const response = await apiClient.get('/management/events', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const createEvent = async (data) => {
  try {
    const response = await apiClient.post('/management/events', data);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Alerts/Notifications APIs
export const getNotifications = async (params = {}) => {
  try {
    const response = await apiClient.get('/communication/notifications', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const dismissNotification = async (notificationId) => {
  try {
    const response = await apiClient.put(`/communication/notifications/${notificationId}/dismiss`);
    return response.data;
  } catch (error) {
    console.error('Error dismissing notification:', error);
    throw error;
  }
};

// Properties APIs
export const getProperties = async (params = {}) => {
  try {
    const response = await apiClient.get('/property', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const getProperty = async (propertyId) => {
  try {
    const response = await apiClient.get(`/property/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
};

// Tenant APIs
export const getTenants = async (params = {}) => {
  try {
    const response = await apiClient.get('/tenant', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching tenants:', error);
    throw error;
  }
};

// Financial APIs
export const getPayments = async (params = {}) => {
  try {
    const response = await apiClient.get('/financial/payments', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

export const getInvoices = async (params = {}) => {
  try {
    const response = await apiClient.get('/financial/invoices', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

// Maintenance APIs
export const getMaintenanceRequests = async (params = {}) => {
  try {
    const response = await apiClient.get('/maintenance', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    throw error;
  }
};

export const updateMaintenanceRequest = async (requestId, data) => {
  try {
    const response = await apiClient.put(`/maintenance/${requestId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating maintenance request:', error);
    throw error;
  }
};

// Integration APIs
export const getIntegrations = async () => {
  try {
    const response = await apiClient.get('/integration');
    return response.data;
  } catch (error) {
    console.error('Error fetching integrations:', error);
    throw error;
  }
};

export const connectIntegration = async (integrationId) => {
  try {
    const response = await apiClient.post(`/integration/${integrationId}/connect`);
    return response.data;
  } catch (error) {
    console.error('Error connecting integration:', error);
    throw error;
  }
};

export const disconnectIntegration = async (integrationId) => {
  try {
    const response = await apiClient.post(`/integration/${integrationId}/disconnect`);
    return response.data;
  } catch (error) {
    console.error('Error disconnecting integration:', error);
    throw error;
  }
};

// User Settings APIs
export const getUserSettings = async () => {
  try {
    const response = await apiClient.get('/user/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    throw error;
  }
};

export const updateUserSettings = async (data) => {
  try {
    const response = await apiClient.put('/user/settings', data);
    return response.data;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

export const updateUserProfile = async (data) => {
  try {
    const response = await apiClient.put('/user/profile', data);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const changePassword = async (data) => {
  try {
    const response = await apiClient.post('/user/change-password', data);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

export default apiClient;
