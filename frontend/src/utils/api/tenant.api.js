import api, { apiUtils } from './axios';

/**
 * Tenant API endpoints
 * Handles tenant-related operations, leases, payments, and tenant services
 */
class TenantAPI {
  constructor() {
    this.endpoints = {
      tenants: '/tenants',
      applications: '/tenants/applications',
      leases: '/tenants/leases',
      payments: '/tenants/payments',
      maintenance: '/tenants/maintenance',
      communications: '/tenants/communications',
      documents: '/tenants/documents',
      notices: '/tenants/notices',
      renewals: '/tenants/renewals',
      moveout: '/tenants/moveout',
      feedback: '/tenants/feedback',
      services: '/tenants/services',
      amenities: '/tenants/amenities',
      parking: '/tenants/parking',
      guests: '/tenants/guests',
      emergencies: '/tenants/emergencies',
      utilities: '/tenants/utilities',
      insurance: '/tenants/insurance',
      violations: '/tenants/violations',
      rewards: '/tenants/rewards'
    };
  }

  /**
   * Get all tenants with filtering and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Tenants list with pagination
   */
  async getTenants(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.tenants}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get tenants error:', error);
      throw error;
    }
  }

  /**
   * Get tenant by ID
   * @param {string} tenantId - Tenant ID
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Tenant details
   */
  async getTenant(tenantId, options = {}) {
    try {
      const queryString = apiUtils.buildQueryString(options);
      const response = await api.get(`${this.endpoints.tenants}/${tenantId}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get tenant error:', error);
      throw error;
    }
  }

  /**
   * Create new tenant
   * @param {Object} tenantData - Tenant data
   * @param {Array} documents - Tenant documents
   * @returns {Promise<Object>} Created tenant
   */
  async createTenant(tenantData, documents = []) {
    try {
      const formData = apiUtils.createFormData(tenantData, { documents });
      const response = await api.post(this.endpoints.tenants, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Create tenant error:', error);
      throw error;
    }
  }

  /**
   * Update tenant
   * @param {string} tenantId - Tenant ID
   * @param {Object} tenantData - Updated tenant data
   * @returns {Promise<Object>} Updated tenant
   */
  async updateTenant(tenantId, tenantData) {
    try {
      const response = await api.put(`${this.endpoints.tenants}/${tenantId}`, tenantData);
      return response.data.data;
    } catch (error) {
      console.error('Update tenant error:', error);
      throw error;
    }
  }

  /**
   * Delete tenant
   * @param {string} tenantId - Tenant ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteTenant(tenantId) {
    try {
      const response = await api.delete(`${this.endpoints.tenants}/${tenantId}`);
      return response.data.data;
    } catch (error) {
      console.error('Delete tenant error:', error);
      throw error;
    }
  }

  /**
   * Get tenant applications
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Applications list
   */
  async getApplications(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.applications}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get applications error:', error);
      throw error;
    }
  }

  /**
   * Submit tenant application
   * @param {Object} applicationData - Application data
   * @param {Array} documents - Application documents
   * @returns {Promise<Object>} Submitted application
   */
  async submitApplication(applicationData, documents = []) {
    try {
      const formData = apiUtils.createFormData(applicationData, { documents });
      const response = await api.post(this.endpoints.applications, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Submit application error:', error);
      throw error;
    }
  }

  /**
   * Update application status
   * @param {string} applicationId - Application ID
   * @param {Object} statusData - Status update data
   * @returns {Promise<Object>} Updated application
   */
  async updateApplicationStatus(applicationId, statusData) {
    try {
      const response = await api.put(`${this.endpoints.applications}/${applicationId}/status`, statusData);
      return response.data.data;
    } catch (error) {
      console.error('Update application status error:', error);
      throw error;
    }
  }

  /**
   * Get tenant leases
   * @param {string} tenantId - Tenant ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Tenant leases
   */
  async getLeases(tenantId = null, params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const url = tenantId ? `${this.endpoints.tenants}/${tenantId}/leases` : this.endpoints.leases;
      const response = await api.get(`${url}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get leases error:', error);
      throw error;
    }
  }

  /**
   * Get lease by ID
   * @param {string} leaseId - Lease ID
   * @returns {Promise<Object>} Lease details
   */
  async getLease(leaseId) {
    try {
      const response = await api.get(`${this.endpoints.leases}/${leaseId}`);
      return response.data.data;
    } catch (error) {
      console.error('Get lease error:', error);
      throw error;
    }
  }

  /**
   * Create new lease
   * @param {Object} leaseData - Lease data
   * @param {File} leaseDocument - Lease document file
   * @returns {Promise<Object>} Created lease
   */
  async createLease(leaseData, leaseDocument = null) {
    try {
      const formData = apiUtils.createFormData(leaseData, leaseDocument ? { document: leaseDocument } : {});
      const response = await api.post(this.endpoints.leases, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Create lease error:', error);
      throw error;
    }
  }

  /**
   * Update lease
   * @param {string} leaseId - Lease ID
   * @param {Object} leaseData - Updated lease data
   * @returns {Promise<Object>} Updated lease
   */
  async updateLease(leaseId, leaseData) {
    try {
      const response = await api.put(`${this.endpoints.leases}/${leaseId}`, leaseData);
      return response.data.data;
    } catch (error) {
      console.error('Update lease error:', error);
      throw error;
    }
  }

  /**
   * Terminate lease
   * @param {string} leaseId - Lease ID
   * @param {Object} terminationData - Termination data
   * @returns {Promise<Object>} Termination result
   */
  async terminateLease(leaseId, terminationData) {
    try {
      const response = await api.post(`${this.endpoints.leases}/${leaseId}/terminate`, terminationData);
      return response.data.data;
    } catch (error) {
      console.error('Terminate lease error:', error);
      throw error;
    }
  }

  /**
   * Get tenant payments
   * @param {string} tenantId - Tenant ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Tenant payments
   */
  async getPayments(tenantId = null, params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const url = tenantId ? `${this.endpoints.tenants}/${tenantId}/payments` : this.endpoints.payments;
      const response = await api.get(`${url}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get payments error:', error);
      throw error;
    }
  }

  /**
   * Process payment
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Payment result
   */
  async processPayment(paymentData) {
    try {
      const response = await api.post(this.endpoints.payments, paymentData);
      return response.data.data;
    } catch (error) {
      console.error('Process payment error:', error);
      throw error;
    }
  }

  /**
   * Setup autopay
   * @param {string} tenantId - Tenant ID
   * @param {Object} autopayData - Autopay configuration
   * @returns {Promise<Object>} Autopay setup result
   */
  async setupAutopay(tenantId, autopayData) {
    try {
      const response = await api.post(`${this.endpoints.tenants}/${tenantId}/autopay`, autopayData);
      return response.data.data;
    } catch (error) {
      console.error('Setup autopay error:', error);
      throw error;
    }
  }

  /**
   * Get payment methods
   * @param {string} tenantId - Tenant ID
   * @returns {Promise<Array>} Payment methods
   */
  async getPaymentMethods(tenantId) {
    try {
      const response = await api.get(`${this.endpoints.tenants}/${tenantId}/payment-methods`);
      return response.data.data;
    } catch (error) {
      console.error('Get payment methods error:', error);
      throw error;
    }
  }

  /**
   * Add payment method
   * @param {string} tenantId - Tenant ID
   * @param {Object} paymentMethodData - Payment method data
   * @returns {Promise<Object>} Added payment method
   */
  async addPaymentMethod(tenantId, paymentMethodData) {
    try {
      const response = await api.post(`${this.endpoints.tenants}/${tenantId}/payment-methods`, paymentMethodData);
      return response.data.data;
    } catch (error) {
      console.error('Add payment method error:', error);
      throw error;
    }
  }

  /**
   * Get maintenance requests
   * @param {string} tenantId - Tenant ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Maintenance requests
   */
  async getMaintenanceRequests(tenantId = null, params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const url = tenantId ? `${this.endpoints.tenants}/${tenantId}/maintenance` : this.endpoints.maintenance;
      const response = await api.get(`${url}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get maintenance requests error:', error);
      throw error;
    }
  }

  /**
   * Submit maintenance request
   * @param {Object} requestData - Maintenance request data
   * @param {Array} photos - Request photos
   * @returns {Promise<Object>} Submitted request
   */
  async submitMaintenanceRequest(requestData, photos = []) {
    try {
      const formData = apiUtils.createFormData(requestData, { photos });
      const response = await api.post(this.endpoints.maintenance, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Submit maintenance request error:', error);
      throw error;
    }
  }

  /**
   * Update maintenance request
   * @param {string} requestId - Request ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated request
   */
  async updateMaintenanceRequest(requestId, updateData) {
    try {
      const response = await api.put(`${this.endpoints.maintenance}/${requestId}`, updateData);
      return response.data.data;
    } catch (error) {
      console.error('Update maintenance request error:', error);
      throw error;
    }
  }

  /**
   * Get tenant communications
   * @param {string} tenantId - Tenant ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Communications
   */
  async getCommunications(tenantId, params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.tenants}/${tenantId}/communications?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get communications error:', error);
      throw error;
    }
  }

  /**
   * Send message
   * @param {Object} messageData - Message data
   * @param {Array} attachments - Message attachments
   * @returns {Promise<Object>} Sent message
   */
  async sendMessage(messageData, attachments = []) {
    try {
      const formData = apiUtils.createFormData(messageData, { attachments });
      const response = await api.post(this.endpoints.communications, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  /**
   * Get tenant documents
   * @param {string} tenantId - Tenant ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Tenant documents
   */
  async getDocuments(tenantId, params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.tenants}/${tenantId}/documents?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get documents error:', error);
      throw error;
    }
  }

  /**
   * Upload tenant document
   * @param {string} tenantId - Tenant ID
   * @param {File} document - Document file
   * @param {Object} metadata - Document metadata
   * @returns {Promise<Object>} Uploaded document
   */
  async uploadDocument(tenantId, document, metadata = {}) {
    try {
      const formData = apiUtils.createFormData(metadata, { document });
      const response = await api.post(`${this.endpoints.tenants}/${tenantId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Upload document error:', error);
      throw error;
    }
  }

  /**
   * Get tenant notices
   * @param {string} tenantId - Tenant ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Tenant notices
   */
  async getNotices(tenantId, params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.tenants}/${tenantId}/notices?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get notices error:', error);
      throw error;
    }
  }

  /**
   * Acknowledge notice
   * @param {string} noticeId - Notice ID
   * @returns {Promise<Object>} Acknowledgment result
   */
  async acknowledgeNotice(noticeId) {
    try {
      const response = await api.post(`${this.endpoints.notices}/${noticeId}/acknowledge`);
      return response.data.data;
    } catch (error) {
      console.error('Acknowledge notice error:', error);
      throw error;
    }
  }

  /**
   * Get lease renewal options
   * @param {string} leaseId - Lease ID
   * @returns {Promise<Object>} Renewal options
   */
  async getRenewalOptions(leaseId) {
    try {
      const response = await api.get(`${this.endpoints.leases}/${leaseId}/renewal-options`);
      return response.data.data;
    } catch (error) {
      console.error('Get renewal options error:', error);
      throw error;
    }
  }

  /**
   * Submit lease renewal request
   * @param {string} leaseId - Lease ID
   * @param {Object} renewalData - Renewal request data
   * @returns {Promise<Object>} Renewal request result
   */
  async submitRenewalRequest(leaseId, renewalData) {
    try {
      const response = await api.post(`${this.endpoints.leases}/${leaseId}/renewal`, renewalData);
      return response.data.data;
    } catch (error) {
      console.error('Submit renewal request error:', error);
      throw error;
    }
  }

  /**
   * Submit move-out notice
   * @param {string} leaseId - Lease ID
   * @param {Object} moveoutData - Move-out notice data
   * @returns {Promise<Object>} Move-out notice result
   */
  async submitMoveoutNotice(leaseId, moveoutData) {
    try {
      const response = await api.post(`${this.endpoints.leases}/${leaseId}/moveout`, moveoutData);
      return response.data.data;
    } catch (error) {
      console.error('Submit moveout notice error:', error);
      throw error;
    }
  }

  /**
   * Submit feedback
   * @param {Object} feedbackData - Feedback data
   * @returns {Promise<Object>} Feedback submission result
   */
  async submitFeedback(feedbackData) {
    try {
      const response = await api.post(this.endpoints.feedback, feedbackData);
      return response.data.data;
    } catch (error) {
      console.error('Submit feedback error:', error);
      throw error;
    }
  }

  /**
   * Get available services
   * @param {string} propertyId - Property ID
   * @returns {Promise<Array>} Available services
   */
  async getServices(propertyId) {
    try {
      const response = await api.get(`${this.endpoints.services}?propertyId=${propertyId}`);
      return response.data.data;
    } catch (error) {
      console.error('Get services error:', error);
      throw error;
    }
  }

  /**
   * Request service
   * @param {Object} serviceData - Service request data
   * @returns {Promise<Object>} Service request result
   */
  async requestService(serviceData) {
    try {
      const response = await api.post(this.endpoints.services, serviceData);
      return response.data.data;
    } catch (error) {
      console.error('Request service error:', error);
      throw error;
    }
  }

  /**
   * Get property amenities
   * @param {string} propertyId - Property ID
   * @returns {Promise<Array>} Property amenities
   */
  async getAmenities(propertyId) {
    try {
      const response = await api.get(`${this.endpoints.amenities}?propertyId=${propertyId}`);
      return response.data.data;
    } catch (error) {
      console.error('Get amenities error:', error);
      throw error;
    }
  }

  /**
   * Book amenity
   * @param {Object} bookingData - Amenity booking data
   * @returns {Promise<Object>} Booking result
   */
  async bookAmenity(bookingData) {
    try {
      const response = await api.post(`${this.endpoints.amenities}/book`, bookingData);
      return response.data.data;
    } catch (error) {
      console.error('Book amenity error:', error);
      throw error;
    }
  }

  /**
   * Get parking information
   * @param {string} tenantId - Tenant ID
   * @returns {Promise<Object>} Parking information
   */
  async getParkingInfo(tenantId) {
    try {
      const response = await api.get(`${this.endpoints.tenants}/${tenantId}/parking`);
      return response.data.data;
    } catch (error) {
      console.error('Get parking info error:', error);
      throw error;
    }
  }

  /**
   * Register guest
   * @param {Object} guestData - Guest registration data
   * @returns {Promise<Object>} Guest registration result
   */
  async registerGuest(guestData) {
    try {
      const response = await api.post(this.endpoints.guests, guestData);
      return response.data.data;
    } catch (error) {
      console.error('Register guest error:', error);
      throw error;
    }
  }

  /**
   * Report emergency
   * @param {Object} emergencyData - Emergency report data
   * @returns {Promise<Object>} Emergency report result
   */
  async reportEmergency(emergencyData) {
    try {
      const response = await api.post(this.endpoints.emergencies, emergencyData);
      return response.data.data;
    } catch (error) {
      console.error('Report emergency error:', error);
      throw error;
    }
  }

  /**
   * Get utility information
   * @param {string} tenantId - Tenant ID
   * @returns {Promise<Object>} Utility information
   */
  async getUtilities(tenantId) {
    try {
      const response = await api.get(`${this.endpoints.tenants}/${tenantId}/utilities`);
      return response.data.data;
    } catch (error) {
      console.error('Get utilities error:', error);
      throw error;
    }
  }

  /**
   * Get tenant rewards
   * @param {string} tenantId - Tenant ID
   * @returns {Promise<Object>} Tenant rewards
   */
  async getRewards(tenantId) {
    try {
      const response = await api.get(`${this.endpoints.tenants}/${tenantId}/rewards`);
      return response.data.data;
    } catch (error) {
      console.error('Get rewards error:', error);
      throw error;
    }
  }

  /**
   * Redeem reward
   * @param {string} rewardId - Reward ID
   * @param {Object} redemptionData - Redemption data
   * @returns {Promise<Object>} Redemption result
   */
  async redeemReward(rewardId, redemptionData) {
    try {
      const response = await api.post(`${this.endpoints.rewards}/${rewardId}/redeem`, redemptionData);
      return response.data.data;
    } catch (error) {
      console.error('Redeem reward error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const tenantAPI = new TenantAPI();
export default tenantAPI;