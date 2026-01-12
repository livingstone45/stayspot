import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const companyAPI = {
  // Dashboard
  getDashboardStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company/dashboard/stats`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  getRevenueData: async (timeRange = 'month') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company/dashboard/revenue`, {
        params: { timeRange }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      throw error;
    }
  },

  getTopCompanies: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company/dashboard/top-companies`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching top companies:', error);
      throw error;
    }
  },

  getSystemMetrics: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company/dashboard/system-metrics`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      throw error;
    }
  },

  getAlerts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company/dashboard/alerts`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },

  // Payments
  getPayments: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company/payments`, { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  // Properties
  getProperties: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company/properties`, { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  // Users
  getUsers: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company/users`, { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Support Tickets
  getTickets: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company/support/tickets`, { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  // Transportation
  getDrivers: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company/transportation/drivers`, { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw error;
    }
  },

  getBookings: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company/transportation/bookings`, { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Sharing
  getSharedItems: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company/sharing/items`, { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching shared items:', error);
      throw error;
    }
  },

  getTeamMembers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company/sharing/team-members`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  }
};

export default companyAPI;
