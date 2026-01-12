import api, { apiUtils } from './axios';

/**
 * Management API endpoints
 * Handles property management operations, portfolios, and management-related tasks
 */
class ManagementAPI {
  constructor() {
    this.endpoints = {
      portfolios: '/management/portfolios',
      assignments: '/management/assignments',
      performance: '/management/performance',
      reports: '/management/reports',
      tasks: '/management/tasks',
      schedules: '/management/schedules',
      inspections: '/management/inspections',
      compliance: '/management/compliance',
      vendors: '/management/vendors',
      contracts: '/management/contracts',
      budgets: '/management/budgets',
      expenses: '/management/expenses',
      revenue: '/management/revenue',
      occupancy: '/management/occupancy',
      leasing: '/management/leasing',
      renewals: '/management/renewals',
      notices: '/management/notices',
      communications: '/management/communications',
      documents: '/management/documents',
      analytics: '/management/analytics'
    };
  }

  /**
   * Get all portfolios
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Portfolios list with pagination
   */
  async getPortfolios(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.portfolios}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get portfolios error:', error);
      throw error;
    }
  }

  /**
   * Get portfolio by ID
   * @param {string} portfolioId - Portfolio ID
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Portfolio details
   */
  async getPortfolio(portfolioId, options = {}) {
    try {
      const queryString = apiUtils.buildQueryString(options);
      const response = await api.get(`${this.endpoints.portfolios}/${portfolioId}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get portfolio error:', error);
      throw error;
    }
  }

  /**
   * Create new portfolio
   * @param {Object} portfolioData - Portfolio data
   * @returns {Promise<Object>} Created portfolio
   */
  async createPortfolio(portfolioData) {
    try {
      const response = await api.post(this.endpoints.portfolios, portfolioData);
      return response.data.data;
    } catch (error) {
      console.error('Create portfolio error:', error);
      throw error;
    }
  }

  /**
   * Update portfolio
   * @param {string} portfolioId - Portfolio ID
   * @param {Object} portfolioData - Updated portfolio data
   * @returns {Promise<Object>} Updated portfolio
   */
  async updatePortfolio(portfolioId, portfolioData) {
    try {
      const response = await api.put(`${this.endpoints.portfolios}/${portfolioId}`, portfolioData);
      return response.data.data;
    } catch (error) {
      console.error('Update portfolio error:', error);
      throw error;
    }
  }

  /**
   * Delete portfolio
   * @param {string} portfolioId - Portfolio ID
   * @returns {Promise<Object>} Deletion result
   */
  async deletePortfolio(portfolioId) {
    try {
      const response = await api.delete(`${this.endpoints.portfolios}/${portfolioId}`);
      return response.data.data;
    } catch (error) {
      console.error('Delete portfolio error:', error);
      throw error;
    }
  }

  /**
   * Get property assignments
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Property assignments
   */
  async getAssignments(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.assignments}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get assignments error:', error);
      throw error;
    }
  }

  /**
   * Create property assignment
   * @param {Object} assignmentData - Assignment data
   * @returns {Promise<Object>} Created assignment
   */
  async createAssignment(assignmentData) {
    try {
      const response = await api.post(this.endpoints.assignments, assignmentData);
      return response.data.data;
    } catch (error) {
      console.error('Create assignment error:', error);
      throw error;
    }
  }

  /**
   * Update property assignment
   * @param {string} assignmentId - Assignment ID
   * @param {Object} assignmentData - Updated assignment data
   * @returns {Promise<Object>} Updated assignment
   */
  async updateAssignment(assignmentId, assignmentData) {
    try {
      const response = await api.put(`${this.endpoints.assignments}/${assignmentId}`, assignmentData);
      return response.data.data;
    } catch (error) {
      console.error('Update assignment error:', error);
      throw error;
    }
  }

  /**
   * Delete property assignment
   * @param {string} assignmentId - Assignment ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteAssignment(assignmentId) {
    try {
      const response = await api.delete(`${this.endpoints.assignments}/${assignmentId}`);
      return response.data.data;
    } catch (error) {
      console.error('Delete assignment error:', error);
      throw error;
    }
  }

  /**
   * Get performance metrics
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Performance metrics
   */
  async getPerformance(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.performance}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get performance error:', error);
      throw error;
    }
  }

  /**
   * Get management reports
   * @param {Object} params - Report parameters
   * @returns {Promise<Object>} Management reports
   */
  async getReports(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.reports}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get reports error:', error);
      throw error;
    }
  }

  /**
   * Generate custom report
   * @param {Object} reportConfig - Report configuration
   * @returns {Promise<Object>} Generated report
   */
  async generateReport(reportConfig) {
    try {
      const response = await api.post(`${this.endpoints.reports}/generate`, reportConfig);
      return response.data.data;
    } catch (error) {
      console.error('Generate report error:', error);
      throw error;
    }
  }

  /**
   * Get management tasks
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Management tasks
   */
  async getTasks(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.tasks}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  }

  /**
   * Create management task
   * @param {Object} taskData - Task data
   * @returns {Promise<Object>} Created task
   */
  async createTask(taskData) {
    try {
      const response = await api.post(this.endpoints.tasks, taskData);
      return response.data.data;
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  }

  /**
   * Update management task
   * @param {string} taskId - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise<Object>} Updated task
   */
  async updateTask(taskId, taskData) {
    try {
      const response = await api.put(`${this.endpoints.tasks}/${taskId}`, taskData);
      return response.data.data;
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  }

  /**
   * Delete management task
   * @param {string} taskId - Task ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteTask(taskId) {
    try {
      const response = await api.delete(`${this.endpoints.tasks}/${taskId}`);
      return response.data.data;
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  }

  /**
   * Get schedules
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Schedules
   */
  async getSchedules(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.schedules}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get schedules error:', error);
      throw error;
    }
  }

  /**
   * Create schedule
   * @param {Object} scheduleData - Schedule data
   * @returns {Promise<Object>} Created schedule
   */
  async createSchedule(scheduleData) {
    try {
      const response = await api.post(this.endpoints.schedules, scheduleData);
      return response.data.data;
    } catch (error) {
      console.error('Create schedule error:', error);
      throw error;
    }
  }

  /**
   * Update schedule
   * @param {string} scheduleId - Schedule ID
   * @param {Object} scheduleData - Updated schedule data
   * @returns {Promise<Object>} Updated schedule
   */
  async updateSchedule(scheduleId, scheduleData) {
    try {
      const response = await api.put(`${this.endpoints.schedules}/${scheduleId}`, scheduleData);
      return response.data.data;
    } catch (error) {
      console.error('Update schedule error:', error);
      throw error;
    }
  }

  /**
   * Get inspections
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Inspections
   */
  async getInspections(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.inspections}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get inspections error:', error);
      throw error;
    }
  }

  /**
   * Schedule inspection
   * @param {Object} inspectionData - Inspection data
   * @returns {Promise<Object>} Scheduled inspection
   */
  async scheduleInspection(inspectionData) {
    try {
      const response = await api.post(this.endpoints.inspections, inspectionData);
      return response.data.data;
    } catch (error) {
      console.error('Schedule inspection error:', error);
      throw error;
    }
  }

  /**
   * Complete inspection
   * @param {string} inspectionId - Inspection ID
   * @param {Object} inspectionResults - Inspection results
   * @param {Array} photos - Inspection photos
   * @returns {Promise<Object>} Completed inspection
   */
  async completeInspection(inspectionId, inspectionResults, photos = []) {
    try {
      const formData = apiUtils.createFormData(inspectionResults, { photos });
      const response = await api.put(`${this.endpoints.inspections}/${inspectionId}/complete`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Complete inspection error:', error);
      throw error;
    }
  }

  /**
   * Get compliance status
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Compliance status
   */
  async getCompliance(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.compliance}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get compliance error:', error);
      throw error;
    }
  }

  /**
   * Update compliance status
   * @param {string} complianceId - Compliance ID
   * @param {Object} complianceData - Compliance data
   * @returns {Promise<Object>} Updated compliance
   */
  async updateCompliance(complianceId, complianceData) {
    try {
      const response = await api.put(`${this.endpoints.compliance}/${complianceId}`, complianceData);
      return response.data.data;
    } catch (error) {
      console.error('Update compliance error:', error);
      throw error;
    }
  }

  /**
   * Get vendors
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Vendors
   */
  async getVendors(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.vendors}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get vendors error:', error);
      throw error;
    }
  }

  /**
   * Create vendor
   * @param {Object} vendorData - Vendor data
   * @returns {Promise<Object>} Created vendor
   */
  async createVendor(vendorData) {
    try {
      const response = await api.post(this.endpoints.vendors, vendorData);
      return response.data.data;
    } catch (error) {
      console.error('Create vendor error:', error);
      throw error;
    }
  }

  /**
   * Update vendor
   * @param {string} vendorId - Vendor ID
   * @param {Object} vendorData - Updated vendor data
   * @returns {Promise<Object>} Updated vendor
   */
  async updateVendor(vendorId, vendorData) {
    try {
      const response = await api.put(`${this.endpoints.vendors}/${vendorId}`, vendorData);
      return response.data.data;
    } catch (error) {
      console.error('Update vendor error:', error);
      throw error;
    }
  }

  /**
   * Get contracts
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Contracts
   */
  async getContracts(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.contracts}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get contracts error:', error);
      throw error;
    }
  }

  /**
   * Create contract
   * @param {Object} contractData - Contract data
   * @param {File} contractFile - Contract file
   * @returns {Promise<Object>} Created contract
   */
  async createContract(contractData, contractFile = null) {
    try {
      const formData = apiUtils.createFormData(contractData, contractFile ? { contract: contractFile } : {});
      const response = await api.post(this.endpoints.contracts, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Create contract error:', error);
      throw error;
    }
  }

  /**
   * Get budgets
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Budgets
   */
  async getBudgets(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.budgets}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get budgets error:', error);
      throw error;
    }
  }

  /**
   * Create budget
   * @param {Object} budgetData - Budget data
   * @returns {Promise<Object>} Created budget
   */
  async createBudget(budgetData) {
    try {
      const response = await api.post(this.endpoints.budgets, budgetData);
      return response.data.data;
    } catch (error) {
      console.error('Create budget error:', error);
      throw error;
    }
  }

  /**
   * Update budget
   * @param {string} budgetId - Budget ID
   * @param {Object} budgetData - Updated budget data
   * @returns {Promise<Object>} Updated budget
   */
  async updateBudget(budgetId, budgetData) {
    try {
      const response = await api.put(`${this.endpoints.budgets}/${budgetId}`, budgetData);
      return response.data.data;
    } catch (error) {
      console.error('Update budget error:', error);
      throw error;
    }
  }

  /**
   * Get expenses
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Expenses
   */
  async getExpenses(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.expenses}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get expenses error:', error);
      throw error;
    }
  }

  /**
   * Record expense
   * @param {Object} expenseData - Expense data
   * @param {Array} receipts - Receipt files
   * @returns {Promise<Object>} Recorded expense
   */
  async recordExpense(expenseData, receipts = []) {
    try {
      const formData = apiUtils.createFormData(expenseData, { receipts });
      const response = await api.post(this.endpoints.expenses, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Record expense error:', error);
      throw error;
    }
  }

  /**
   * Get revenue data
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Revenue data
   */
  async getRevenue(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.revenue}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get revenue error:', error);
      throw error;
    }
  }

  /**
   * Get occupancy data
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Occupancy data
   */
  async getOccupancy(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.occupancy}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get occupancy error:', error);
      throw error;
    }
  }

  /**
   * Get leasing data
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Leasing data
   */
  async getLeasing(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.leasing}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get leasing error:', error);
      throw error;
    }
  }

  /**
   * Get lease renewals
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Lease renewals
   */
  async getRenewals(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.renewals}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get renewals error:', error);
      throw error;
    }
  }

  /**
   * Process lease renewal
   * @param {string} leaseId - Lease ID
   * @param {Object} renewalData - Renewal data
   * @returns {Promise<Object>} Processed renewal
   */
  async processRenewal(leaseId, renewalData) {
    try {
      const response = await api.post(`${this.endpoints.renewals}/${leaseId}`, renewalData);
      return response.data.data;
    } catch (error) {
      console.error('Process renewal error:', error);
      throw error;
    }
  }

  /**
   * Get notices
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Notices
   */
  async getNotices(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.notices}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get notices error:', error);
      throw error;
    }
  }

  /**
   * Send notice
   * @param {Object} noticeData - Notice data
   * @returns {Promise<Object>} Sent notice
   */
  async sendNotice(noticeData) {
    try {
      const response = await api.post(this.endpoints.notices, noticeData);
      return response.data.data;
    } catch (error) {
      console.error('Send notice error:', error);
      throw error;
    }
  }

  /**
   * Get management analytics
   * @param {Object} params - Analytics parameters
   * @returns {Promise<Object>} Management analytics
   */
  async getAnalytics(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.analytics}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  }

  /**
   * Export management data
   * @param {Object} params - Export parameters
   * @returns {Promise<Blob>} Export file
   */
  async exportData(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.reports}/export?${queryString}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Export data error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const managementAPI = new ManagementAPI();
export default managementAPI;