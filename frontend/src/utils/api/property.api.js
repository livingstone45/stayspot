import api, { apiUtils } from './axios';

/**
 * Property API endpoints
 * Handles property management, units, amenities, and related operations
 */
class PropertyAPI {
  constructor() {
    this.endpoints = {
      properties: '/properties',
      units: '/properties/:propertyId/units',
      amenities: '/properties/:propertyId/amenities',
      images: '/properties/:propertyId/images',
      documents: '/properties/:propertyId/documents',
      analytics: '/properties/:propertyId/analytics',
      availability: '/properties/:propertyId/availability',
      pricing: '/properties/:propertyId/pricing',
      reviews: '/properties/:propertyId/reviews',
      nearby: '/properties/:propertyId/nearby',
      virtual_tour: '/properties/:propertyId/virtual-tour',
      floor_plans: '/properties/:propertyId/floor-plans',
      lease_templates: '/properties/:propertyId/lease-templates',
      utilities: '/properties/:propertyId/utilities',
      insurance: '/properties/:propertyId/insurance',
      taxes: '/properties/:propertyId/taxes',
      inspections: '/properties/:propertyId/inspections'
    };
  }

  /**
   * Get all properties with filtering and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Properties list with pagination
   */
  async getProperties(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.properties}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get properties error:', error);
      throw error;
    }
  }

  /**
   * Get property by ID
   * @param {string} propertyId - Property ID
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Property details
   */
  async getProperty(propertyId, options = {}) {
    try {
      const queryString = apiUtils.buildQueryString(options);
      const response = await api.get(`${this.endpoints.properties}/${propertyId}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get property error:', error);
      throw error;
    }
  }

  /**
   * Create new property
   * @param {Object} propertyData - Property data
   * @param {Array} images - Property images
   * @returns {Promise<Object>} Created property
   */
  async createProperty(propertyData, images = []) {
    try {
      const formData = apiUtils.createFormData(propertyData, { images });
      const response = await api.post(this.endpoints.properties, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Create property error:', error);
      throw error;
    }
  }

  /**
   * Update property
   * @param {string} propertyId - Property ID
   * @param {Object} propertyData - Updated property data
   * @param {Array} newImages - New images to add
   * @returns {Promise<Object>} Updated property
   */
  async updateProperty(propertyId, propertyData, newImages = []) {
    try {
      const formData = apiUtils.createFormData(propertyData, { images: newImages });
      const response = await api.put(`${this.endpoints.properties}/${propertyId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Update property error:', error);
      throw error;
    }
  }

  /**
   * Delete property
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteProperty(propertyId) {
    try {
      const response = await api.delete(`${this.endpoints.properties}/${propertyId}`);
      return response.data.data;
    } catch (error) {
      console.error('Delete property error:', error);
      throw error;
    }
  }

  /**
   * Get property units
   * @param {string} propertyId - Property ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Property units
   */
  async getUnits(propertyId, params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const url = this.endpoints.units.replace(':propertyId', propertyId);
      const response = await api.get(`${url}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get units error:', error);
      throw error;
    }
  }

  /**
   * Get unit by ID
   * @param {string} propertyId - Property ID
   * @param {string} unitId - Unit ID
   * @returns {Promise<Object>} Unit details
   */
  async getUnit(propertyId, unitId) {
    try {
      const url = this.endpoints.units.replace(':propertyId', propertyId);
      const response = await api.get(`${url}/${unitId}`);
      return response.data.data;
    } catch (error) {
      console.error('Get unit error:', error);
      throw error;
    }
  }

  /**
   * Create new unit
   * @param {string} propertyId - Property ID
   * @param {Object} unitData - Unit data
   * @param {Array} images - Unit images
   * @returns {Promise<Object>} Created unit
   */
  async createUnit(propertyId, unitData, images = []) {
    try {
      const formData = apiUtils.createFormData(unitData, { images });
      const url = this.endpoints.units.replace(':propertyId', propertyId);
      const response = await api.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Create unit error:', error);
      throw error;
    }
  }

  /**
   * Update unit
   * @param {string} propertyId - Property ID
   * @param {string} unitId - Unit ID
   * @param {Object} unitData - Updated unit data
   * @param {Array} newImages - New images to add
   * @returns {Promise<Object>} Updated unit
   */
  async updateUnit(propertyId, unitId, unitData, newImages = []) {
    try {
      const formData = apiUtils.createFormData(unitData, { images: newImages });
      const url = this.endpoints.units.replace(':propertyId', propertyId);
      const response = await api.put(`${url}/${unitId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Update unit error:', error);
      throw error;
    }
  }

  /**
   * Delete unit
   * @param {string} propertyId - Property ID
   * @param {string} unitId - Unit ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteUnit(propertyId, unitId) {
    try {
      const url = this.endpoints.units.replace(':propertyId', propertyId);
      const response = await api.delete(`${url}/${unitId}`);
      return response.data.data;
    } catch (error) {
      console.error('Delete unit error:', error);
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
      const url = this.endpoints.amenities.replace(':propertyId', propertyId);
      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      console.error('Get amenities error:', error);
      throw error;
    }
  }

  /**
   * Update property amenities
   * @param {string} propertyId - Property ID
   * @param {Array} amenities - Amenities list
   * @returns {Promise<Array>} Updated amenities
   */
  async updateAmenities(propertyId, amenities) {
    try {
      const url = this.endpoints.amenities.replace(':propertyId', propertyId);
      const response = await api.put(url, { amenities });
      return response.data.data;
    } catch (error) {
      console.error('Update amenities error:', error);
      throw error;
    }
  }

  /**
   * Get property images
   * @param {string} propertyId - Property ID
   * @returns {Promise<Array>} Property images
   */
  async getImages(propertyId) {
    try {
      const url = this.endpoints.images.replace(':propertyId', propertyId);
      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      console.error('Get images error:', error);
      throw error;
    }
  }

  /**
   * Upload property images
   * @param {string} propertyId - Property ID
   * @param {Array} images - Images to upload
   * @param {Object} metadata - Image metadata
   * @returns {Promise<Array>} Uploaded images
   */
  async uploadImages(propertyId, images, metadata = {}) {
    try {
      const formData = apiUtils.createFormData(metadata, { images });
      const url = this.endpoints.images.replace(':propertyId', propertyId);
      const response = await api.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Upload images error:', error);
      throw error;
    }
  }

  /**
   * Delete property image
   * @param {string} propertyId - Property ID
   * @param {string} imageId - Image ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteImage(propertyId, imageId) {
    try {
      const url = this.endpoints.images.replace(':propertyId', propertyId);
      const response = await api.delete(`${url}/${imageId}`);
      return response.data.data;
    } catch (error) {
      console.error('Delete image error:', error);
      throw error;
    }
  }

  /**
   * Get property documents
   * @param {string} propertyId - Property ID
   * @returns {Promise<Array>} Property documents
   */
  async getDocuments(propertyId) {
    try {
      const url = this.endpoints.documents.replace(':propertyId', propertyId);
      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      console.error('Get documents error:', error);
      throw error;
    }
  }

  /**
   * Upload property document
   * @param {string} propertyId - Property ID
   * @param {File} document - Document file
   * @param {Object} metadata - Document metadata
   * @returns {Promise<Object>} Uploaded document
   */
  async uploadDocument(propertyId, document, metadata = {}) {
    try {
      const formData = apiUtils.createFormData(metadata, { document });
      const url = this.endpoints.documents.replace(':propertyId', propertyId);
      const response = await api.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Upload document error:', error);
      throw error;
    }
  }

  /**
   * Delete property document
   * @param {string} propertyId - Property ID
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteDocument(propertyId, documentId) {
    try {
      const url = this.endpoints.documents.replace(':propertyId', propertyId);
      const response = await api.delete(`${url}/${documentId}`);
      return response.data.data;
    } catch (error) {
      console.error('Delete document error:', error);
      throw error;
    }
  }

  /**
   * Get property analytics
   * @param {string} propertyId - Property ID
   * @param {Object} params - Analytics parameters
   * @returns {Promise<Object>} Property analytics
   */
  async getAnalytics(propertyId, params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const url = this.endpoints.analytics.replace(':propertyId', propertyId);
      const response = await api.get(`${url}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  }

  /**
   * Get property availability
   * @param {string} propertyId - Property ID
   * @param {Object} params - Availability parameters
   * @returns {Promise<Object>} Property availability
   */
  async getAvailability(propertyId, params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const url = this.endpoints.availability.replace(':propertyId', propertyId);
      const response = await api.get(`${url}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get availability error:', error);
      throw error;
    }
  }

  /**
   * Update property availability
   * @param {string} propertyId - Property ID
   * @param {Object} availabilityData - Availability data
   * @returns {Promise<Object>} Updated availability
   */
  async updateAvailability(propertyId, availabilityData) {
    try {
      const url = this.endpoints.availability.replace(':propertyId', propertyId);
      const response = await api.put(url, availabilityData);
      return response.data.data;
    } catch (error) {
      console.error('Update availability error:', error);
      throw error;
    }
  }

  /**
   * Get property pricing
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} Property pricing
   */
  async getPricing(propertyId) {
    try {
      const url = this.endpoints.pricing.replace(':propertyId', propertyId);
      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      console.error('Get pricing error:', error);
      throw error;
    }
  }

  /**
   * Update property pricing
   * @param {string} propertyId - Property ID
   * @param {Object} pricingData - Pricing data
   * @returns {Promise<Object>} Updated pricing
   */
  async updatePricing(propertyId, pricingData) {
    try {
      const url = this.endpoints.pricing.replace(':propertyId', propertyId);
      const response = await api.put(url, pricingData);
      return response.data.data;
    } catch (error) {
      console.error('Update pricing error:', error);
      throw error;
    }
  }

  /**
   * Get property reviews
   * @param {string} propertyId - Property ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Property reviews
   */
  async getReviews(propertyId, params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const url = this.endpoints.reviews.replace(':propertyId', propertyId);
      const response = await api.get(`${url}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get reviews error:', error);
      throw error;
    }
  }

  /**
   * Get nearby properties
   * @param {string} propertyId - Property ID
   * @param {Object} params - Search parameters
   * @returns {Promise<Array>} Nearby properties
   */
  async getNearbyProperties(propertyId, params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const url = this.endpoints.nearby.replace(':propertyId', propertyId);
      const response = await api.get(`${url}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get nearby properties error:', error);
      throw error;
    }
  }

  /**
   * Search properties
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Object>} Search results
   */
  async searchProperties(searchParams) {
    try {
      const queryString = apiUtils.buildQueryString(searchParams);
      const response = await api.get(`${this.endpoints.properties}/search?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Search properties error:', error);
      throw error;
    }
  }

  /**
   * Get property statistics
   * @param {Object} params - Statistics parameters
   * @returns {Promise<Object>} Property statistics
   */
  async getStatistics(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.properties}/statistics?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get statistics error:', error);
      throw error;
    }
  }

  /**
   * Bulk update properties
   * @param {Array} propertyIds - Property IDs
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Bulk update result
   */
  async bulkUpdateProperties(propertyIds, updateData) {
    try {
      const response = await api.put(`${this.endpoints.properties}/bulk`, {
        propertyIds,
        updateData
      });
      return response.data.data;
    } catch (error) {
      console.error('Bulk update properties error:', error);
      throw error;
    }
  }

  /**
   * Export properties data
   * @param {Object} params - Export parameters
   * @returns {Promise<Blob>} Export file
   */
  async exportProperties(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.properties}/export?${queryString}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Export properties error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const propertyAPI = new PropertyAPI();
export default propertyAPI;