import api, { apiUtils } from './axios';

/**
 * System API endpoints
 * Handles system administration, configuration, monitoring, and system-level operations
 */
class SystemAPI {
  constructor() {
    this.endpoints = {
      users: '/system/users',
      roles: '/system/roles',
      permissions: '/system/permissions',
      settings: '/system/settings',
      configurations: '/system/configurations',
      logs: '/system/logs',
      audit: '/system/audit',
      monitoring: '/system/monitoring',
      health: '/system/health',
      backup: '/system/backup',
      restore: '/system/restore',
      notifications: '/system/notifications',
      templates: '/system/templates',
      integrations: '/system/integrations',
      webhooks: '/system/webhooks',
      api_keys: '/system/api-keys',
      security: '/system/security',
      performance: '/system/performance',
      analytics: '/system/analytics',
      reports: '/system/reports'
    };
  }

  /**
   * Get system users
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Users with pagination
   */
  async getUsers(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.users}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User details
   */
  async getUser(userId) {
    try {
      const response = await api.get(`${this.endpoints.users}/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  /**
   * Create system user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    try {
      const response = await api.post(this.endpoints.users, userData);
      return response.data.data;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  /**
   * Update system user
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`${this.endpoints.users}/${userId}`, userData);
      return response.data.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  /**
   * Delete system user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteUser(userId) {
    try {
      const response = await api.delete(`${this.endpoints.users}/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  /**
   * Activate/Deactivate user
   * @param {string} userId - User ID
   * @param {boolean} active - Active status
   * @returns {Promise<Object>} Status update result
   */
  async toggleUserStatus(userId, active) {
    try {
      const response = await api.put(`${this.endpoints.users}/${userId}/status`, { active });
      return response.data.data;
    } catch (error) {
      console.error('Toggle user status error:', error);
      throw error;
    }
  }

  /**
   * Reset user password
   * @param {string} userId - User ID
   * @param {Object} resetData - Password reset data
   * @returns {Promise<Object>} Reset result
   */
  async resetUserPassword(userId, resetData) {
    try {
      const response = await api.post(`${this.endpoints.users}/${userId}/reset-password`, resetData);
      return response.data.data;
    } catch (error) {
      console.error('Reset user password error:', error);
      throw error;
    }
  }

  /**
   * Get system roles
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Roles with pagination
   */
  async getRoles(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.roles}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get roles error:', error);
      throw error;
    }
  }

  /**
   * Create system role
   * @param {Object} roleData - Role data
   * @returns {Promise<Object>} Created role
   */
  async createRole(roleData) {
    try {
      const response = await api.post(this.endpoints.roles, roleData);
      return response.data.data;
    } catch (error) {
      console.error('Create role error:', error);
      throw error;
    }
  }

  /**
   * Update system role
   * @param {string} roleId - Role ID
   * @param {Object} roleData - Updated role data
   * @returns {Promise<Object>} Updated role
   */
  async updateRole(roleId, roleData) {
    try {
      const response = await api.put(`${this.endpoints.roles}/${roleId}`, roleData);
      return response.data.data;
    } catch (error) {
      console.error('Update role error:', error);
      throw error;
    }
  }

  /**
   * Delete system role
   * @param {string} roleId - Role ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteRole(roleId) {
    try {
      const response = await api.delete(`${this.endpoints.roles}/${roleId}`);
      return response.data.data;
    } catch (error) {
      console.error('Delete role error:', error);
      throw error;
    }
  }

  /**
   * Assign role to user
   * @param {string} userId - User ID
   * @param {string} roleId - Role ID
   * @returns {Promise<Object>} Assignment result
   */
  async assignRole(userId, roleId) {
    try {
      const response = await api.post(`${this.endpoints.users}/${userId}/roles`, { roleId });
      return response.data.data;
    } catch (error) {
      console.error('Assign role error:', error);
      throw error;
    }
  }

  /**
   * Remove role from user
   * @param {string} userId - User ID
   * @param {string} roleId - Role ID
   * @returns {Promise<Object>} Removal result
   */
  async removeRole(userId, roleId) {
    try {
      const response = await api.delete(`${this.endpoints.users}/${userId}/roles/${roleId}`);
      return response.data.data;
    } catch (error) {
      console.error('Remove role error:', error);
      throw error;
    }
  }

  /**
   * Get system permissions
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} System permissions
   */
  async getPermissions(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.permissions}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get permissions error:', error);
      throw error;
    }
  }

  /**
   * Update role permissions
   * @param {string} roleId - Role ID
   * @param {Array} permissions - Permissions array
   * @returns {Promise<Object>} Update result
   */
  async updateRolePermissions(roleId, permissions) {
    try {
      const response = await api.put(`${this.endpoints.roles}/${roleId}/permissions`, { permissions });
      return response.data.data;
    } catch (error) {
      console.error('Update role permissions error:', error);
      throw error;
    }
  }

  /**
   * Get system settings
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} System settings
   */
  async getSettings(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.settings}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get settings error:', error);
      throw error;
    }
  }

  /**
   * Update system settings
   * @param {Object} settings - Settings data
   * @returns {Promise<Object>} Updated settings
   */
  async updateSettings(settings) {
    try {
      const response = await api.put(this.endpoints.settings, settings);
      return response.data.data;
    } catch (error) {
      console.error('Update settings error:', error);
      throw error;
    }
  }

  /**
   * Get system configurations
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} System configurations
   */
  async getConfigurations(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.configurations}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get configurations error:', error);
      throw error;
    }
  }

  /**
   * Update system configuration
   * @param {string} configKey - Configuration key
   * @param {Object} configData - Configuration data
   * @returns {Promise<Object>} Updated configuration
   */
  async updateConfiguration(configKey, configData) {
    try {
      const response = await api.put(`${this.endpoints.configurations}/${configKey}`, configData);
      return response.data.data;
    } catch (error) {
      console.error('Update configuration error:', error);
      throw error;
    }
  }

  /**
   * Get system logs
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} System logs
   */
  async getLogs(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.logs}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get logs error:', error);
      throw error;
    }
  }

  /**
   * Clear system logs
   * @param {Object} clearOptions - Clear options
   * @returns {Promise<Object>} Clear result
   */
  async clearLogs(clearOptions = {}) {
    try {
      const response = await api.delete(this.endpoints.logs, { data: clearOptions });
      return response.data.data;
    } catch (error) {
      console.error('Clear logs error:', error);
      throw error;
    }
  }

  /**
   * Get audit trail
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Audit trail
   */
  async getAuditTrail(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.audit}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get audit trail error:', error);
      throw error;
    }
  }

  /**
   * Get system monitoring data
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Monitoring data
   */
  async getMonitoring(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.monitoring}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get monitoring error:', error);
      throw error;
    }
  }

  /**
   * Get system health status
   * @returns {Promise<Object>} System health
   */
  async getHealth() {
    try {
      const response = await api.get(this.endpoints.health);
      return response.data.data;
    } catch (error) {
      console.error('Get health error:', error);
      throw error;
    }
  }

  /**
   * Perform health check
   * @param {Object} checkOptions - Health check options
   * @returns {Promise<Object>} Health check result
   */
  async performHealthCheck(checkOptions = {}) {
    try {
      const response = await api.post(`${this.endpoints.health}/check`, checkOptions);
      return response.data.data;
    } catch (error) {
      console.error('Perform health check error:', error);
      throw error;
    }
  }

  /**
   * Create system backup
   * @param {Object} backupOptions - Backup options
   * @returns {Promise<Object>} Backup result
   */
  async createBackup(backupOptions = {}) {
    try {
      const response = await api.post(this.endpoints.backup, backupOptions);
      return response.data.data;
    } catch (error) {
      console.error('Create backup error:', error);
      throw error;
    }
  }

  /**
   * Get backup list
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Backup list
   */
  async getBackups(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.backup}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get backups error:', error);
      throw error;
    }
  }

  /**
   * Delete backup
   * @param {string} backupId - Backup ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteBackup(backupId) {
    try {
      const response = await api.delete(`${this.endpoints.backup}/${backupId}`);
      return response.data.data;
    } catch (error) {
      console.error('Delete backup error:', error);
      throw error;
    }
  }

  /**
   * Restore from backup
   * @param {string} backupId - Backup ID
   * @param {Object} restoreOptions - Restore options
   * @returns {Promise<Object>} Restore result
   */
  async restoreBackup(backupId, restoreOptions = {}) {
    try {
      const response = await api.post(`${this.endpoints.restore}/${backupId}`, restoreOptions);
      return response.data.data;
    } catch (error) {
      console.error('Restore backup error:', error);
      throw error;
    }
  }

  /**
   * Get system notifications
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} System notifications
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
   * Send system notification
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Object>} Send result
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
   * Get notification templates
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Notification templates
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
   * Create notification template
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
   * Update notification template
   * @param {string} templateId - Template ID
   * @param {Object} templateData - Updated template data
   * @returns {Promise<Object>} Updated template
   */
  async updateTemplate(templateId, templateData) {
    try {
      const response = await api.put(`${this.endpoints.templates}/${templateId}`, templateData);
      return response.data.data;
    } catch (error) {
      console.error('Update template error:', error);
      throw error;
    }
  }

  /**
   * Get system integrations
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} System integrations
   */
  async getIntegrations(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.integrations}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get integrations error:', error);
      throw error;
    }
  }

  /**
   * Configure integration
   * @param {string} integrationId - Integration ID
   * @param {Object} configData - Configuration data
   * @returns {Promise<Object>} Configuration result
   */
  async configureIntegration(integrationId, configData) {
    try {
      const response = await api.put(`${this.endpoints.integrations}/${integrationId}`, configData);
      return response.data.data;
    } catch (error) {
      console.error('Configure integration error:', error);
      throw error;
    }
  }

  /**
   * Test integration
   * @param {string} integrationId - Integration ID
   * @param {Object} testData - Test data
   * @returns {Promise<Object>} Test result
   */
  async testIntegration(integrationId, testData = {}) {
    try {
      const response = await api.post(`${this.endpoints.integrations}/${integrationId}/test`, testData);
      return response.data.data;
    } catch (error) {
      console.error('Test integration error:', error);
      throw error;
    }
  }

  /**
   * Get webhooks
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Webhooks
   */
  async getWebhooks(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.webhooks}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get webhooks error:', error);
      throw error;
    }
  }

  /**
   * Create webhook
   * @param {Object} webhookData - Webhook data
   * @returns {Promise<Object>} Created webhook
   */
  async createWebhook(webhookData) {
    try {
      const response = await api.post(this.endpoints.webhooks, webhookData);
      return response.data.data;
    } catch (error) {
      console.error('Create webhook error:', error);
      throw error;
    }
  }

  /**
   * Update webhook
   * @param {string} webhookId - Webhook ID
   * @param {Object} webhookData - Updated webhook data
   * @returns {Promise<Object>} Updated webhook
   */
  async updateWebhook(webhookId, webhookData) {
    try {
      const response = await api.put(`${this.endpoints.webhooks}/${webhookId}`, webhookData);
      return response.data.data;
    } catch (error) {
      console.error('Update webhook error:', error);
      throw error;
    }
  }

  /**
   * Test webhook
   * @param {string} webhookId - Webhook ID
   * @param {Object} testPayload - Test payload
   * @returns {Promise<Object>} Test result
   */
  async testWebhook(webhookId, testPayload = {}) {
    try {
      const response = await api.post(`${this.endpoints.webhooks}/${webhookId}/test`, testPayload);
      return response.data.data;
    } catch (error) {
      console.error('Test webhook error:', error);
      throw error;
    }
  }

  /**
   * Get API keys
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API keys
   */
  async getApiKeys(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.api_keys}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get API keys error:', error);
      throw error;
    }
  }

  /**
   * Create API key
   * @param {Object} keyData - API key data
   * @returns {Promise<Object>} Created API key
   */
  async createApiKey(keyData) {
    try {
      const response = await api.post(this.endpoints.api_keys, keyData);
      return response.data.data;
    } catch (error) {
      console.error('Create API key error:', error);
      throw error;
    }
  }

  /**
   * Revoke API key
   * @param {string} keyId - API key ID
   * @returns {Promise<Object>} Revocation result
   */
  async revokeApiKey(keyId) {
    try {
      const response = await api.delete(`${this.endpoints.api_keys}/${keyId}`);
      return response.data.data;
    } catch (error) {
      console.error('Revoke API key error:', error);
      throw error;
    }
  }

  /**
   * Get security settings
   * @returns {Promise<Object>} Security settings
   */
  async getSecuritySettings() {
    try {
      const response = await api.get(this.endpoints.security);
      return response.data.data;
    } catch (error) {
      console.error('Get security settings error:', error);
      throw error;
    }
  }

  /**
   * Update security settings
   * @param {Object} securityData - Security settings data
   * @returns {Promise<Object>} Updated security settings
   */
  async updateSecuritySettings(securityData) {
    try {
      const response = await api.put(this.endpoints.security, securityData);
      return response.data.data;
    } catch (error) {
      console.error('Update security settings error:', error);
      throw error;
    }
  }

  /**
   * Get performance metrics
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Performance metrics
   */
  async getPerformanceMetrics(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.performance}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get performance metrics error:', error);
      throw error;
    }
  }

  /**
   * Get system analytics
   * @param {Object} params - Analytics parameters
   * @returns {Promise<Object>} System analytics
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
   * Get system reports
   * @param {Object} params - Report parameters
   * @returns {Promise<Object>} System reports
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
   * Generate system report
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
   * Export system data
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
      console.error('Export system data error:', error);
      throw error;
    }
  }

  /**
   * Restart system service
   * @param {string} serviceName - Service name
   * @returns {Promise<Object>} Restart result
   */
  async restartService(serviceName) {
    try {
      const response = await api.post(`${this.endpoints.monitoring}/restart/${serviceName}`);
      return response.data.data;
    } catch (error) {
      console.error('Restart service error:', error);
      throw error;
    }
  }

  /**
   * Clear system cache
   * @param {Object} cacheOptions - Cache clear options
   * @returns {Promise<Object>} Clear result
   */
  async clearCache(cacheOptions = {}) {
    try {
      const response = await api.post(`${this.endpoints.monitoring}/clear-cache`, cacheOptions);
      return response.data.data;
    } catch (error) {
      console.error('Clear cache error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const systemAPI = new SystemAPI();
export default systemAPI;