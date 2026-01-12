import api, { apiUtils } from './axios';

/**
 * Maintenance API endpoints
 * Handles maintenance requests, work orders, vendor management, and maintenance operations
 */
class MaintenanceAPI {
  constructor() {
    this.endpoints = {
      requests: '/maintenance/requests',
      workOrders: '/maintenance/work-orders',
      vendors: '/maintenance/vendors',
      categories: '/maintenance/categories',
      priorities: '/maintenance/priorities',
      schedules: '/maintenance/schedules',
      inspections: '/maintenance/inspections',
      inventory: '/maintenance/inventory',
      equipment: '/maintenance/equipment',
      preventive: '/maintenance/preventive',
      emergency: '/maintenance/emergency',
      costs: '/maintenance/costs',
      reports: '/maintenance/reports',
      analytics: '/maintenance/analytics',
      templates: '/maintenance/templates',
      checklists: '/maintenance/checklists',
      warranties: '/maintenance/warranties',
      compliance: '/maintenance/compliance',
      safety: '/maintenance/safety',
      notifications: '/maintenance/notifications'
    };
  }

  /**
   * Get maintenance requests
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Maintenance requests with pagination
   */
  async getRequests(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.requests}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get maintenance requests error:', error);
      throw error;
    }
  }

  /**
   * Get maintenance request by ID
   * @param {string} requestId - Request ID
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Request details
   */
  async getRequest(requestId, options = {}) {
    try {
      const queryString = apiUtils.buildQueryString(options);
      const response = await api.get(`${this.endpoints.requests}/${requestId}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get maintenance request error:', error);
      throw error;
    }
  }

  /**
   * Create maintenance request
   * @param {Object} requestData - Request data
   * @param {Array} photos - Request photos
   * @returns {Promise<Object>} Created request
   */
  async createRequest(requestData, photos = []) {
    try {
      const formData = apiUtils.createFormData(requestData, { photos });
      const response = await api.post(this.endpoints.requests, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Create maintenance request error:', error);
      throw error;
    }
  }

  /**
   * Update maintenance request
   * @param {string} requestId - Request ID
   * @param {Object} requestData - Updated request data
   * @param {Array} newPhotos - New photos to add
   * @returns {Promise<Object>} Updated request
   */
  async updateRequest(requestId, requestData, newPhotos = []) {
    try {
      const formData = apiUtils.createFormData(requestData, { photos: newPhotos });
      const response = await api.put(`${this.endpoints.requests}/${requestId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Update maintenance request error:', error);
      throw error;
    }
  }

  /**
   * Delete maintenance request
   * @param {string} requestId - Request ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteRequest(requestId) {
    try {
      const response = await api.delete(`${this.endpoints.requests}/${requestId}`);
      return response.data.data;
    } catch (error) {
      console.error('Delete maintenance request error:', error);
      throw error;
    }
  }

  /**
   * Assign maintenance request
   * @param {string} requestId - Request ID
   * @param {Object} assignmentData - Assignment data
   * @returns {Promise<Object>} Assignment result
   */
  async assignRequest(requestId, assignmentData) {
    try {
      const response = await api.post(`${this.endpoints.requests}/${requestId}/assign`, assignmentData);
      return response.data.data;
    } catch (error) {
      console.error('Assign maintenance request error:', error);
      throw error;
    }
  }

  /**
   * Get work orders
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Work orders with pagination
   */
  async getWorkOrders(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.workOrders}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get work orders error:', error);
      throw error;
    }
  }

  /**
   * Get work order by ID
   * @param {string} workOrderId - Work order ID
   * @returns {Promise<Object>} Work order details
   */
  async getWorkOrder(workOrderId) {
    try {
      const response = await api.get(`${this.endpoints.workOrders}/${workOrderId}`);
      return response.data.data;
    } catch (error) {
      console.error('Get work order error:', error);
      throw error;
    }
  }

  /**
   * Create work order
   * @param {Object} workOrderData - Work order data
   * @param {Array} attachments - Work order attachments
   * @returns {Promise<Object>} Created work order
   */
  async createWorkOrder(workOrderData, attachments = []) {
    try {
      const formData = apiUtils.createFormData(workOrderData, { attachments });
      const response = await api.post(this.endpoints.workOrders, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Create work order error:', error);
      throw error;
    }
  }

  /**
   * Update work order
   * @param {string} workOrderId - Work order ID
   * @param {Object} workOrderData - Updated work order data
   * @returns {Promise<Object>} Updated work order
   */
  async updateWorkOrder(workOrderId, workOrderData) {
    try {
      const response = await api.put(`${this.endpoints.workOrders}/${workOrderId}`, workOrderData);
      return response.data.data;
    } catch (error) {
      console.error('Update work order error:', error);
      throw error;
    }
  }

  /**
   * Complete work order
   * @param {string} workOrderId - Work order ID
   * @param {Object} completionData - Completion data
   * @param {Array} completionPhotos - Completion photos
   * @returns {Promise<Object>} Completed work order
   */
  async completeWorkOrder(workOrderId, completionData, completionPhotos = []) {
    try {
      const formData = apiUtils.createFormData(completionData, { photos: completionPhotos });
      const response = await api.post(`${this.endpoints.workOrders}/${workOrderId}/complete`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Complete work order error:', error);
      throw error;
    }
  }

  /**
   * Cancel work order
   * @param {string} workOrderId - Work order ID
   * @param {Object} cancellationData - Cancellation data
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelWorkOrder(workOrderId, cancellationData) {
    try {
      const response = await api.post(`${this.endpoints.workOrders}/${workOrderId}/cancel`, cancellationData);
      return response.data.data;
    } catch (error) {
      console.error('Cancel work order error:', error);
      throw error;
    }
  }

  /**
   * Get vendors
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Vendors with pagination
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
   * Get vendor by ID
   * @param {string} vendorId - Vendor ID
   * @returns {Promise<Object>} Vendor details
   */
  async getVendor(vendorId) {
    try {
      const response = await api.get(`${this.endpoints.vendors}/${vendorId}`);
      return response.data.data;
    } catch (error) {
      console.error('Get vendor error:', error);
      throw error;
    }
  }

  /**
   * Create vendor
   * @param {Object} vendorData - Vendor data
   * @param {Array} documents - Vendor documents
   * @returns {Promise<Object>} Created vendor
   */
  async createVendor(vendorData, documents = []) {
    try {
      const formData = apiUtils.createFormData(vendorData, { documents });
      const response = await api.post(this.endpoints.vendors, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
   * Rate vendor
   * @param {string} vendorId - Vendor ID
   * @param {Object} ratingData - Rating data
   * @returns {Promise<Object>} Rating result
   */
  async rateVendor(vendorId, ratingData) {
    try {
      const response = await api.post(`${this.endpoints.vendors}/${vendorId}/rate`, ratingData);
      return response.data.data;
    } catch (error) {
      console.error('Rate vendor error:', error);
      throw error;
    }
  }

  /**
   * Get maintenance categories
   * @returns {Promise<Array>} Maintenance categories
   */
  async getCategories() {
    try {
      const response = await api.get(this.endpoints.categories);
      return response.data.data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }

  /**
   * Create maintenance category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Created category
   */
  async createCategory(categoryData) {
    try {
      const response = await api.post(this.endpoints.categories, categoryData);
      return response.data.data;
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  }

  /**
   * Get maintenance priorities
   * @returns {Promise<Array>} Maintenance priorities
   */
  async getPriorities() {
    try {
      const response = await api.get(this.endpoints.priorities);
      return response.data.data;
    } catch (error) {
      console.error('Get priorities error:', error);
      throw error;
    }
  }

  /**
   * Get maintenance schedules
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Maintenance schedules
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
   * Create maintenance schedule
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
   * Update maintenance schedule
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
   * Get inventory items
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Inventory items
   */
  async getInventory(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.inventory}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get inventory error:', error);
      throw error;
    }
  }

  /**
   * Add inventory item
   * @param {Object} itemData - Item data
   * @returns {Promise<Object>} Added item
   */
  async addInventoryItem(itemData) {
    try {
      const response = await api.post(this.endpoints.inventory, itemData);
      return response.data.data;
    } catch (error) {
      console.error('Add inventory item error:', error);
      throw error;
    }
  }

  /**
   * Update inventory item
   * @param {string} itemId - Item ID
   * @param {Object} itemData - Updated item data
   * @returns {Promise<Object>} Updated item
   */
  async updateInventoryItem(itemId, itemData) {
    try {
      const response = await api.put(`${this.endpoints.inventory}/${itemId}`, itemData);
      return response.data.data;
    } catch (error) {
      console.error('Update inventory item error:', error);
      throw error;
    }
  }

  /**
   * Get equipment
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Equipment
   */
  async getEquipment(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.equipment}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get equipment error:', error);
      throw error;
    }
  }

  /**
   * Add equipment
   * @param {Object} equipmentData - Equipment data
   * @param {Array} documents - Equipment documents
   * @returns {Promise<Object>} Added equipment
   */
  async addEquipment(equipmentData, documents = []) {
    try {
      const formData = apiUtils.createFormData(equipmentData, { documents });
      const response = await api.post(this.endpoints.equipment, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Add equipment error:', error);
      throw error;
    }
  }

  /**
   * Get preventive maintenance tasks
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Preventive maintenance tasks
   */
  async getPreventiveTasks(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.preventive}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get preventive tasks error:', error);
      throw error;
    }
  }

  /**
   * Create preventive maintenance task
   * @param {Object} taskData - Task data
   * @returns {Promise<Object>} Created task
   */
  async createPreventiveTask(taskData) {
    try {
      const response = await api.post(this.endpoints.preventive, taskData);
      return response.data.data;
    } catch (error) {
      console.error('Create preventive task error:', error);
      throw error;
    }
  }

  /**
   * Report emergency
   * @param {Object} emergencyData - Emergency data
   * @param {Array} photos - Emergency photos
   * @returns {Promise<Object>} Emergency report
   */
  async reportEmergency(emergencyData, photos = []) {
    try {
      const formData = apiUtils.createFormData(emergencyData, { photos });
      const response = await api.post(this.endpoints.emergency, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Report emergency error:', error);
      throw error;
    }
  }

  /**
   * Get maintenance costs
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Maintenance costs
   */
  async getCosts(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.costs}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get costs error:', error);
      throw error;
    }
  }

  /**
   * Record maintenance cost
   * @param {Object} costData - Cost data
   * @param {Array} receipts - Receipt files
   * @returns {Promise<Object>} Recorded cost
   */
  async recordCost(costData, receipts = []) {
    try {
      const formData = apiUtils.createFormData(costData, { receipts });
      const response = await api.post(this.endpoints.costs, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Record cost error:', error);
      throw error;
    }
  }

  /**
   * Get maintenance reports
   * @param {Object} params - Report parameters
   * @returns {Promise<Object>} Maintenance reports
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
   * Generate maintenance report
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
   * Get maintenance analytics
   * @param {Object} params - Analytics parameters
   * @returns {Promise<Object>} Maintenance analytics
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
   * Get maintenance templates
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Maintenance templates
   */
  async getTemplates(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.templates}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get templates error:', error);
      throw error;
    }
  }

  /**
   * Create maintenance template
   * @param {Object} templateData - Template data
   * @returns {Promise<Object>} Created template
   */
  async createTemplate(templateData) {
    try {
      const response = await api.post(this.endpoints.templates, templateData);
      return response.data.data;
    } catch (error) {
      console.error('Create template error:', error);
      throw error;
    }
  }

  /**
   * Get maintenance checklists
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Maintenance checklists
   */
  async getChecklists(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.checklists}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get checklists error:', error);
      throw error;
    }
  }

  /**
   * Create maintenance checklist
   * @param {Object} checklistData - Checklist data
   * @returns {Promise<Object>} Created checklist
   */
  async createChecklist(checklistData) {
    try {
      const response = await api.post(this.endpoints.checklists, checklistData);
      return response.data.data;
    } catch (error) {
      console.error('Create checklist error:', error);
      throw error;
    }
  }

  /**
   * Get warranties
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Warranties
   */
  async getWarranties(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.warranties}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get warranties error:', error);
      throw error;
    }
  }

  /**
   * Add warranty
   * @param {Object} warrantyData - Warranty data
   * @param {File} warrantyDocument - Warranty document
   * @returns {Promise<Object>} Added warranty
   */
  async addWarranty(warrantyData, warrantyDocument = null) {
    try {
      const formData = apiUtils.createFormData(warrantyData, warrantyDocument ? { document: warrantyDocument } : {});
      const response = await api.post(this.endpoints.warranties, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Add warranty error:', error);
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
   * Get safety records
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Safety records
   */
  async getSafetyRecords(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.safety}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get safety records error:', error);
      throw error;
    }
  }

  /**
   * Record safety incident
   * @param {Object} incidentData - Incident data
   * @param {Array} photos - Incident photos
   * @returns {Promise<Object>} Recorded incident
   */
  async recordSafetyIncident(incidentData, photos = []) {
    try {
      const formData = apiUtils.createFormData(incidentData, { photos });
      const response = await api.post(this.endpoints.safety, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Record safety incident error:', error);
      throw error;
    }
  }

  /**
   * Get maintenance notifications
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Maintenance notifications
   */
  async getNotifications(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.notifications}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  }

  /**
   * Send maintenance notification
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Object>} Sent notification
   */
  async sendNotification(notificationData) {
    try {
      const response = await api.post(this.endpoints.notifications, notificationData);
      return response.data.data;
    } catch (error) {
      console.error('Send notification error:', error);
      throw error;
    }
  }

  /**
   * Export maintenance data
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
      console.error('Export maintenance data error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const maintenanceAPI = new MaintenanceAPI();
export default maintenanceAPI;