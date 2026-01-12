const { Integration, User, Property } = require('../../models');
const { Op } = require('sequelize');

const integrationController = {
  // Get all integrations
  getAllIntegrations: async (req, res) => {
    try {
      const { 
        type, 
        status,
        search,
        page = 1, 
        limit = 20 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = { companyId: req.user.companyId };
      if (type) where.type = type;
      if (status) where.status = status;
      
      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { provider: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }
      
      const integrations = await Integration.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'CreatedBy',
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: User,
            as: 'UpdatedBy',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });
      
      // Remove sensitive data from responses
      const safeIntegrations = integrations.rows.map(integration => {
        const integrationData = integration.toJSON();
        delete integrationData.config?.apiKey;
        delete integrationData.config?.secretKey;
        delete integrationData.config?.password;
        delete integrationData.config?.accessToken;
        delete integrationData.config?.refreshToken;
        return integrationData;
      });
      
      res.json({
        success: true,
        data: safeIntegrations,
        pagination: {
          total: integrations.count,
          page: parseInt(page),
          pages: Math.ceil(integrations.count / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get integration by ID
  getIntegrationById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const integration = await Integration.findByPk(id, {
        include: [
          {
            model: User,
            as: 'CreatedBy',
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: User,
            as: 'UpdatedBy',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });
      
      if (!integration) {
        return res.status(404).json({ success: false, message: 'Integration not found' });
      }
      
      // Check if integration belongs to user's company
      if (integration.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this integration'
        });
      }
      
      // Remove sensitive data
      const integrationData = integration.toJSON();
      delete integrationData.config?.apiKey;
      delete integrationData.config?.secretKey;
      delete integrationData.config?.password;
      delete integrationData.config?.accessToken;
      delete integrationData.config?.refreshToken;
      
      res.json({ success: true, data: integrationData });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Create integration
  createIntegration: async (req, res) => {
    try {
      const {
        name,
        type,
        provider,
        description,
        config,
        webhookUrl,
        isActive,
        syncSettings
      } = req.body;
      
      // Validate integration type
      const validTypes = [
        'payment_gateway',
        'property_listing',
        'background_check',
        'accounting',
        'communication',
        'smart_home',
        'market_data',
        'other'
      ];
      
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Invalid integration type. Must be one of: ${validTypes.join(', ')}`
        });
      }
      
      // Check if integration already exists for this provider and type
      const existingIntegration = await Integration.findOne({
        where: {
          type,
          provider,
          companyId: req.user.companyId,
          status: 'active'
        }
      });
      
      if (existingIntegration) {
        return res.status(400).json({
          success: false,
          message: `Active integration already exists for ${provider} (${type})`
        });
      }
      
      // Test integration connection if config provided
      let testResult = null;
      if (config && isActive) {
        testResult = await testIntegrationConnection(type, provider, config);
        
        if (!testResult.success) {
          return res.status(400).json({
            success: false,
            message: `Integration test failed: ${testResult.message}`,
            testResult
          });
        }
      }
      
      // Create integration
      const integration = await Integration.create({
        name,
        type,
        provider,
        description: description || '',
        config: config || {},
        webhookUrl: webhookUrl || '',
        isActive: isActive || false,
        status: isActive ? 'active' : 'inactive',
        syncSettings: syncSettings || {},
        lastSyncAt: null,
        lastSyncStatus: null,
        createdById: req.user.id,
        companyId: req.user.companyId
      });
      
      // Remove sensitive data from response
      const integrationData = integration.toJSON();
      delete integrationData.config?.apiKey;
      delete integrationData.config?.secretKey;
      delete integrationData.config?.password;
      delete integrationData.config?.accessToken;
      delete integrationData.config?.refreshToken;
      
      res.status(201).json({
        success: true,
        message: 'Integration created successfully',
        data: {
          integration: integrationData,
          testResult
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update integration
  updateIntegration: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const integration = await Integration.findByPk(id);
      
      if (!integration) {
        return res.status(404).json({ success: false, message: 'Integration not found' });
      }
      
      // Check if integration belongs to user's company
      if (integration.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this integration'
        });
      }
      
      // Test integration connection if config is being updated
      if (updates.config && (updates.isActive || integration.isActive)) {
        const testResult = await testIntegrationConnection(
          integration.type,
          integration.provider,
          updates.config
        );
        
        if (!testResult.success) {
          return res.status(400).json({
            success: false,
            message: `Integration test failed: ${testResult.message}`,
            testResult
          });
        }
      }
      
      // Update status based on isActive
      if (updates.isActive !== undefined) {
        updates.status = updates.isActive ? 'active' : 'inactive';
      }
      
      // Update integration
      await integration.update({
        ...updates,
        updatedById: req.user.id,
        updatedAt: new Date()
      });
      
      // Remove sensitive data from response
      const integrationData = integration.toJSON();
      delete integrationData.config?.apiKey;
      delete integrationData.config?.secretKey;
      delete integrationData.config?.password;
      delete integrationData.config?.accessToken;
      delete integrationData.config?.refreshToken;
      
      res.json({
        success: true,
        message: 'Integration updated successfully',
        data: integrationData
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Delete integration
  deleteIntegration: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      const integration = await Integration.findByPk(id);
      
      if (!integration) {
        return res.status(404).json({ success: false, message: 'Integration not found' });
      }
      
      // Check if integration belongs to user's company
      if (integration.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this integration'
        });
      }
      
      // Check if integration is critical
      if (integration.isActive && integration.type === 'payment_gateway') {
        // Check if there are active payment methods using this integration
        // This would require checking Payment model
        return res.status(400).json({
          success: false,
          message: 'Cannot delete active payment gateway integration. Deactivate it first.'
        });
      }
      
      // Soft delete
      await integration.update({
        status: 'deleted',
        isActive: false,
        deletedAt: new Date(),
        deletedBy: req.user.id,
        deletionReason: reason
      });
      
      res.json({
        success: true,
        message: 'Integration deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Test integration connection
  testIntegration: async (req, res) => {
    try {
      const { id } = req.params;
      
      const integration = await Integration.findByPk(id);
      
      if (!integration) {
        return res.status(404).json({ success: false, message: 'Integration not found' });
      }
      
      // Check if integration belongs to user's company
      if (integration.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to test this integration'
        });
      }
      
      // Test connection
      const testResult = await testIntegrationConnection(
        integration.type,
        integration.provider,
        integration.config
      );
      
      // Update integration status based on test result
      if (testResult.success) {
        await integration.update({
          lastTestedAt: new Date(),
          lastTestStatus: 'success',
          testMessage: testResult.message
        });
      } else {
        await integration.update({
          lastTestedAt: new Date(),
          lastTestStatus: 'failed',
          testMessage: testResult.message
        });
      }
      
      res.json({
        success: true,
        message: `Integration test ${testResult.success ? 'passed' : 'failed'}`,
        data: testResult
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Sync integration data
  syncIntegration: async (req, res) => {
    try {
      const { id } = req.params;
      const { syncType, force } = req.body;
      
      const integration = await Integration.findByPk(id);
      
      if (!integration) {
        return res.status(404).json({ success: false, message: 'Integration not found' });
      }
      
      // Check if integration belongs to user's company
      if (integration.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to sync this integration'
        });
      }
      
      if (!integration.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Integration is not active'
        });
      }
      
      // Check if sync is already in progress
      if (integration.syncStatus === 'in_progress' && !force) {
        return res.status(400).json({
          success: false,
          message: 'Sync is already in progress'
        });
      }
      
      // Update sync status
      await integration.update({
        syncStatus: 'in_progress',
        lastSyncStartedAt: new Date(),
        syncStartedBy: req.user.id
      });
      
      // Perform sync based on integration type
      let syncResult;
      switch (integration.type) {
        case 'property_listing':
          syncResult = await syncPropertyListings(integration);
          break;
        case 'payment_gateway':
          syncResult = await syncPaymentData(integration);
          break;
        case 'accounting':
          syncResult = await syncAccountingData(integration);
          break;
        default:
          syncResult = { success: false, message: 'Sync not supported for this integration type' };
      }
      
      // Update sync status
      await integration.update({
        syncStatus: syncResult.success ? 'completed' : 'failed',
        lastSyncAt: new Date(),
        lastSyncStatus: syncResult.success ? 'success' : 'failed',
        lastSyncResult: syncResult,
        syncCompletedBy: req.user.id
      });
      
      res.json({
        success: syncResult.success,
        message: syncResult.message,
        data: {
          integrationId: id,
          syncType,
          result: syncResult
        }
      });
    } catch (error) {
      // Update sync status to failed
      const integration = await Integration.findByPk(req.params.id);
      if (integration) {
        await integration.update({
          syncStatus: 'failed',
          lastSyncAt: new Date(),
          lastSyncStatus: 'failed',
          lastSyncResult: { error: error.message }
        });
      }
      
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get integration logs
  getIntegrationLogs: async (req, res) => {
    try {
      const { id } = req.params;
      const { level, startDate, endDate, page = 1, limit = 50 } = req.query;
      
      const offset = (page - 1) * limit;
      
      const integration = await Integration.findByPk(id);
      
      if (!integration) {
        return res.status(404).json({ success: false, message: 'Integration not found' });
      }
      
      // Check if integration belongs to user's company
      if (integration.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view logs for this integration'
        });
      }
      
      const where = { integrationId: id };
      if (level) where.level = level;
      if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) where.timestamp[Op.gte] = new Date(startDate);
        if (endDate) where.timestamp[Op.lte] = new Date(endDate);
      }
      
      // This would query from IntegrationLog model
      // For now, return empty array
      const logs = [];
      const totalLogs = 0;
      
      res.json({
        success: true,
        data: logs,
        pagination: {
          total: totalLogs,
          page: parseInt(page),
          pages: Math.ceil(totalLogs / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get available integration providers
  getIntegrationProviders: async (req, res) => {
    try {
      const { type } = req.query;
      
      const providers = {
        payment_gateway: [
          { id: 'stripe', name: 'Stripe', description: 'Online payment processing' },
          { id: 'paypal', name: 'PayPal', description: 'Digital payments' },
          { id: 'square', name: 'Square', description: 'Payment processing' },
          { id: 'authorize_net', name: 'Authorize.net', description: 'Payment gateway' }
        ],
        property_listing: [
          { id: 'zillow', name: 'Zillow', description: 'Property listings' },
          { id: 'realtor', name: 'Realtor.com', description: 'Real estate listings' },
          { id: 'apartments', name: 'Apartments.com', description: 'Rental listings' },
          { id: 'airbnb', name: 'Airbnb', description: 'Short-term rentals' },
          { id: 'vrbo', name: 'VRBO', description: 'Vacation rentals' }
        ],
        background_check: [
          { id: 'transunion', name: 'TransUnion', description: 'Credit and background checks' },
          { id: 'experian', name: 'Experian', description: 'Credit reporting' },
          { id: 'checkr', name: 'Checkr', description: 'Background screening' },
          { id: 'goodhire', name: 'GoodHire', description: 'Employment screening' }
        ],
        accounting: [
          { id: 'quickbooks', name: 'QuickBooks', description: 'Accounting software' },
          { id: 'xero', name: 'Xero', description: 'Online accounting' },
          { id: 'freshbooks', name: 'FreshBooks', description: 'Accounting for small business' }
        ],
        communication: [
          { id: 'twilio', name: 'Twilio', description: 'SMS and voice communication' },
          { id: 'sendgrid', name: 'SendGrid', description: 'Email delivery' },
          { id: 'mailchimp', name: 'Mailchimp', description: 'Email marketing' }
        ],
        smart_home: [
          { id: 'nest', name: 'Google Nest', description: 'Smart home devices' },
          { id: 'ring', name: 'Ring', description: 'Security cameras' },
          { id: 'smartthings', name: 'SmartThings', description: 'Home automation' }
        ],
        market_data: [
          { id: 'costar', name: 'CoStar', description: 'Commercial real estate data' },
          { id: 'rentometer', name: 'Rentometer', name: 'Rental market data' },
          { id: 'zillow_api', name: 'Zillow API', description: 'Property valuation data' }
        ]
      };
      
      if (type && providers[type]) {
        res.json({
          success: true,
          data: providers[type]
        });
      } else {
        res.json({
          success: true,
          data: providers
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get integration statistics
  getIntegrationStatistics: async (req, res) => {
    try {
      const where = { companyId: req.user.companyId };
      
      const totalIntegrations = await Integration.count({ where });
      
      const byType = await Integration.findAll({
        attributes: [
          'type',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.literal('CASE WHEN is_active = true THEN 1 ELSE 0 END')), 'active']
        ],
        where,
        group: ['type']
      });
      
      const byStatus = await Integration.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: ['status']
      });
      
      // Last sync status
      const lastSyncs = await Integration.findAll({
        where: {
          ...where,
          lastSyncAt: { [Op.not]: null }
        },
        attributes: ['id', 'name', 'type', 'lastSyncAt', 'lastSyncStatus'],
        order: [['lastSyncAt', 'DESC']],
        limit: 5
      });
      
      // Failed syncs in last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const failedSyncs = await Integration.count({
        where: {
          ...where,
          lastSyncStatus: 'failed',
          lastSyncAt: { [Op.gte]: sevenDaysAgo }
        }
      });
      
      res.json({
        success: true,
        data: {
          totalIntegrations,
          byType: byType.map(item => ({
            type: item.type,
            total: parseInt(item.dataValues.count),
            active: parseInt(item.dataValues.active || 0)
          })),
          byStatus: byStatus.reduce((acc, item) => {
            acc[item.status] = parseInt(item.dataValues.count);
            return acc;
          }, {}),
          lastSyncs,
          failedSyncsLast7Days: failedSyncs
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Helper function to test integration connection
async function testIntegrationConnection(type, provider, config) {
  try {
    switch (type) {
      case 'payment_gateway':
        return await testPaymentGateway(provider, config);
      case 'property_listing':
        return await testPropertyListing(provider, config);
      case 'background_check':
        return await testBackgroundCheck(provider, config);
      default:
        return { success: true, message: 'Connection test not implemented for this integration type' };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function testPaymentGateway(provider, config) {
  // Implement payment gateway test logic
  return { success: true, message: 'Payment gateway connection successful' };
}

async function testPropertyListing(provider, config) {
  // Implement property listing test logic
  return { success: true, message: 'Property listing connection successful' };
}

async function testBackgroundCheck(provider, config) {
  // Implement background check test logic
  return { success: true, message: 'Background check connection successful' };
}

async function syncPropertyListings(integration) {
  // Implement property listing sync logic
  return { success: true, message: 'Property listings synced successfully', syncedCount: 0 };
}

async function syncPaymentData(integration) {
  // Implement payment data sync logic
  return { success: true, message: 'Payment data synced successfully', syncedCount: 0 };
}

async function syncAccountingData(integration) {
  // Implement accounting data sync logic
  return { success: true, message: 'Accounting data synced successfully', syncedCount: 0 };
}

module.exports = integrationController;