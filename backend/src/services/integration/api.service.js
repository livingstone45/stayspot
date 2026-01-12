const { Integration } = require('../../models');
const axios = require('axios');

class APIIntegrationService {
  async createIntegration(data) {
    return await Integration.create({
      name: data.name,
      type: data.type,
      config: data.config,
      status: 'active',
      company_id: data.company_id
    });
  }

  async callExternalAPI(integrationId, endpoint, method = 'GET', data = null) {
    const integration = await Integration.findByPk(integrationId);
    if (!integration || integration.status !== 'active') {
      throw new Error('Integration not found or inactive');
    }

    const config = {
      method,
      url: `${integration.config.baseUrl}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${integration.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) config.data = data;

    try {
      const response = await axios(config);
      await this.logAPICall(integrationId, endpoint, method, 'success');
      return response.data;
    } catch (error) {
      await this.logAPICall(integrationId, endpoint, method, 'error', error.message);
      throw error;
    }
  }

  async logAPICall(integrationId, endpoint, method, status, error = null) {
    // Log API calls for monitoring and debugging
    console.log(`API Call: ${method} ${endpoint} - ${status}`, error || '');
  }

  async testConnection(integrationId) {
    try {
      await this.callExternalAPI(integrationId, '/health');
      return { status: 'connected', message: 'Connection successful' };
    } catch (error) {
      return { status: 'failed', message: error.message };
    }
  }
}

module.exports = new APIIntegrationService();
