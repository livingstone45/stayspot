const { Webhook, Integration, User } = require('../../models');
const { Op } = require('sequelize');
const crypto = require('crypto');

const webhookController = {
  // Get all webhooks
  getAllWebhooks: async (req, res) => {
    try {
      const { 
        integrationId, 
        eventType,
        status,
        search,
        page = 1, 
        limit = 20 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = { companyId: req.user.companyId };
      if (integrationId) where.integrationId = integrationId;
      if (eventType) where.eventType = eventType;
      if (status) where.status = status;
      
      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { url: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }
      
      const webhooks = await Webhook.findAndCountAll({
        where,
        include: [
          {
            model: Integration,
            attributes: ['id', 'name', 'provider', 'type']
          },
          {
            model: User,
            as: 'CreatedBy',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });
      
      res.json({
        success: true,
        data: webhooks.rows,
        pagination: {
          total: webhooks.count,
          page: parseInt(page),
          pages: Math.ceil(webhooks.count / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get webhook by ID
  getWebhookById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const webhook = await Webhook.findByPk(id, {
        include: [
          {
            model: Integration,
            attributes: ['id', 'name', 'provider', 'type']
          },
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
      
      if (!webhook) {
        return res.status(404).json({ success: false, message: 'Webhook not found' });
      }
      
      // Check if webhook belongs to user's company
      if (webhook.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this webhook'
        });
      }
      
      res.json({ success: true, data: webhook });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Create webhook
  createWebhook: async (req, res) => {
    try {
      const {
        integrationId,
        name,
        url,
        eventType,
        description,
        isActive,
        headers,
        retryConfig,
        filters
      } = req.body;
      
      // Validate integration
      const integration = await Integration.findByPk(integrationId);
      if (!integration) {
        return res.status(404).json({ success: false, message: 'Integration not found' });
      }
      
      // Check if integration belongs to user's company
      if (integration.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to create webhook for this integration'
        });
      }
      
      // Validate URL
      if (!isValidUrl(url)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid URL format'
        });
      }
      
      // Validate event type
      const validEventTypes = [
        'payment.created',
        'payment.completed',
        'payment.failed',
        'tenant.created',
        'tenant.updated',
        'tenant.deleted',
        'property.created',
        'property.updated',
        'maintenance.created',
        'maintenance.completed',
        'task.assigned',
        'task.completed',
        'invoice.created',
        'invoice.paid',
        'integration.sync_completed',
        'integration.error'
      ];
      
      if (!validEventTypes.includes(eventType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid event type. Must be one of: ${validEventTypes.join(', ')}`
        });
      }
      
      // Generate secret key for webhook signature
      const secretKey = crypto.randomBytes(32).toString('hex');
      
      // Create webhook
      const webhook = await Webhook.create({
        integrationId,
        name,
        url,
        eventType,
        description: description || '',
        secretKey,
        headers: headers || {},
        retryConfig: retryConfig || {
          maxAttempts: 3,
          retryDelay: 5000, // 5 seconds
          backoffFactor: 2
        },
        filters: filters || {},
        isActive: isActive || false,
        status: isActive ? 'active' : 'inactive',
        createdById: req.user.id,
        companyId: req.user.companyId
      });
      
      res.status(201).json({
        success: true,
        message: 'Webhook created successfully',
        data: {
          ...webhook.toJSON(),
          secretKey // Only returned on creation
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update webhook
  updateWebhook: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const webhook = await Webhook.findByPk(id);
      
      if (!webhook) {
        return res.status(404).json({ success: false, message: 'Webhook not found' });
      }
      
      // Check if webhook belongs to user's company
      if (webhook.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this webhook'
        });
      }
      
      // Validate URL if being updated
      if (updates.url && !isValidUrl(updates.url)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid URL format'
        });
      }
      
      // Update status based on isActive
      if (updates.isActive !== undefined) {
        updates.status = updates.isActive ? 'active' : 'inactive';
      }
      
      // Regenerate secret key if requested
      if (updates.regenerateSecret) {
        updates.secretKey = crypto.randomBytes(32).toString('hex');
      }
      
      // Update webhook
      await webhook.update({
        ...updates,
        updatedById: req.user.id,
        updatedAt: new Date()
      });
      
      const responseData = webhook.toJSON();
      if (!updates.regenerateSecret) {
        delete responseData.secretKey;
      }
      
      res.json({
        success: true,
        message: 'Webhook updated successfully',
        data: responseData
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Delete webhook
  deleteWebhook: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      const webhook = await Webhook.findByPk(id);
      
      if (!webhook) {
        return res.status(404).json({ success: false, message: 'Webhook not found' });
      }
      
      // Check if webhook belongs to user's company
      if (webhook.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this webhook'
        });
      }
      
      // Soft delete
      await webhook.update({
        status: 'deleted',
        isActive: false,
        deletedAt: new Date(),
        deletedBy: req.user.id,
        deletionReason: reason
      });
      
      res.json({
        success: true,
        message: 'Webhook deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Test webhook
  testWebhook: async (req, res) => {
    try {
      const { id } = req.params;
      const { payload } = req.body;
      
      const webhook = await Webhook.findByPk(id);
      
      if (!webhook) {
        return res.status(404).json({ success: false, message: 'Webhook not found' });
      }
      
      // Check if webhook belongs to user's company
      if (webhook.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to test this webhook'
        });
      }
      
      if (!webhook.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Webhook is not active'
        });
      }
      
      // Create test payload
      const testPayload = payload || {
        event: webhook.eventType,
        webhookId: webhook.id,
        test: true,
        timestamp: new Date().toISOString(),
        data: {
          message: 'Test webhook payload',
          companyId: webhook.companyId,
          triggeredBy: `${req.user.firstName} ${req.user.lastName}`
        }
      };
      
      // Send webhook
      const result = await sendWebhook(webhook, testPayload);
      
      // Log webhook attempt
      await webhook.update({
        lastTestedAt: new Date(),
        lastTestStatus: result.success ? 'success' : 'failed',
        lastTestResult: result
      });
      
      res.json({
        success: true,
        message: `Webhook test ${result.success ? 'successful' : 'failed'}`,
        data: result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get webhook deliveries
  getWebhookDeliveries: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, startDate, endDate, page = 1, limit = 20 } = req.query;
      
      const offset = (page - 1) * limit;
      
      const webhook = await Webhook.findByPk(id);
      
      if (!webhook) {
        return res.status(404).json({ success: false, message: 'Webhook not found' });
      }
      
      // Check if webhook belongs to user's company
      if (webhook.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view deliveries for this webhook'
        });
      }
      
      const where = { webhookId: id };
      if (status) where.status = status;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt[Op.gte] = new Date(startDate);
        if (endDate) where.createdAt[Op.lte] = new Date(endDate);
      }
      
      // This would query from WebhookDelivery model
      // For now, return empty array
      const deliveries = [];
      const totalDeliveries = 0;
      
      res.json({
        success: true,
        data: deliveries,
        pagination: {
          total: totalDeliveries,
          page: parseInt(page),
          pages: Math.ceil(totalDeliveries / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Retry failed webhook delivery
  retryWebhookDelivery: async (req, res) => {
    try {
      const { id, deliveryId } = req.params;
      
      const webhook = await Webhook.findByPk(id);
      
      if (!webhook) {
        return res.status(404).json({ success: false, message: 'Webhook not found' });
      }
      
      // Check if webhook belongs to user's company
      if (webhook.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to retry deliveries for this webhook'
        });
      }
      
      // This would retrieve the delivery from WebhookDelivery model
      // For now, simulate retrieval
      const delivery = null; // await WebhookDelivery.findByPk(deliveryId);
      
      if (!delivery) {
        return res.status(404).json({ success: false, message: 'Delivery not found' });
      }
      
      if (delivery.status !== 'failed') {
        return res.status(400).json({
          success: false,
          message: 'Can only retry failed deliveries'
        });
      }
      
      // Retry the webhook
      const result = await sendWebhook(webhook, delivery.payload);
      
      // Update delivery record
      // await delivery.update({
      //   status: result.success ? 'success' : 'failed',
      //   attempts: delivery.attempts + 1,
      //   lastAttemptAt: new Date(),
      //   response: result.response
      // });
      
      res.json({
        success: true,
        message: `Webhook delivery ${result.success ? 'retried successfully' : 'failed on retry'}`,
        data: result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get webhook statistics
  getWebhookStatistics: async (req, res) => {
    try {
      const { integrationId, eventType } = req.query;
      
      const where = { companyId: req.user.companyId };
      if (integrationId) where.integrationId = integrationId;
      if (eventType) where.eventType = eventType;
      
      // Total webhooks
      const totalWebhooks = await Webhook.count({ where });
      
      // By status
      const byStatus = await Webhook.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: ['status']
      });
      
      // By event type
      const byEventType = await Webhook.findAll({
        attributes: [
          'eventType',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: ['eventType'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 10
      });
      
      // Recent deliveries (last 24 hours)
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
      
      // This would query from WebhookDelivery model
      // For now, simulate
      const recentDeliveries = {
        total: 0,
        success: 0,
        failed: 0
      };
      
      // Webhook success rate
      const successRate = recentDeliveries.total > 0 ? 
        (recentDeliveries.success / recentDeliveries.total) * 100 : 0;
      
      // Most active webhooks
      const mostActive = await Webhook.findAll({
        where,
        attributes: [
          'id',
          'name',
          'eventType',
          'url',
          // This would include delivery count from WebhookDelivery model
        ],
        order: [['createdAt', 'DESC']],
        limit: 5
      });
      
      res.json({
        success: true,
        data: {
          totalWebhooks,
          byStatus: byStatus.reduce((acc, item) => {
            acc[item.status] = parseInt(item.dataValues.count);
            return acc;
          }, {}),
          byEventType: byEventType.map(item => ({
            eventType: item.eventType,
            count: parseInt(item.dataValues.count)
          })),
          recentDeliveries,
          successRate: parseFloat(successRate.toFixed(2)),
          mostActive
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Process incoming webhook (for external services to call)
  processIncomingWebhook: async (req, res) => {
    try {
      const { integrationId } = req.params;
      const signature = req.headers['x-webhook-signature'];
      const timestamp = req.headers['x-webhook-timestamp'];
      
      // Find integration
      const integration = await Integration.findByPk(integrationId);
      if (!integration) {
        return res.status(404).json({ success: false, message: 'Integration not found' });
      }
      
      if (!integration.isActive) {
        return res.status(400).json({ success: false, message: 'Integration is not active' });
      }
      
      // Find webhooks for this integration
      const webhooks = await Webhook.findAll({
        where: {
          integrationId,
          companyId: integration.companyId,
          isActive: true
        }
      });
      
      if (webhooks.length === 0) {
        return res.status(200).json({ 
          success: true, 
          message: 'No active webhooks for this integration' 
        });
      }
      
      // Validate signature if required
      if (integration.config?.webhookSecret) {
        if (!signature || !timestamp) {
          return res.status(401).json({ 
            success: false, 
            message: 'Missing signature or timestamp' 
          });
        }
        
        const isValid = validateWebhookSignature(
          req.body,
          signature,
          timestamp,
          integration.config.webhookSecret
        );
        
        if (!isValid) {
          return res.status(401).json({ 
            success: false, 
            message: 'Invalid signature' 
          });
        }
      }
      
      // Process webhook for each registered endpoint
      const results = [];
      for (const webhook of webhooks) {
        try {
          // Check if webhook matches the event type
          const eventType = determineEventType(req.body);
          if (webhook.eventType !== eventType) {
            continue;
          }
          
          // Apply filters if any
          if (webhook.filters && !passesFilters(req.body, webhook.filters)) {
            continue;
          }
          
          // Send webhook
          const result = await sendWebhook(webhook, req.body);
          results.push({
            webhookId: webhook.id,
            webhookName: webhook.name,
            success: result.success,
            statusCode: result.statusCode,
            message: result.message
          });
          
        } catch (error) {
          results.push({
            webhookId: webhook.id,
            webhookName: webhook.name,
            success: false,
            error: error.message
          });
        }
      }
      
      // Log the incoming webhook
      await logIncomingWebhook(integrationId, req.body, results);
      
      res.json({
        success: true,
        message: `Processed webhook for ${results.length} endpoints`,
        data: results
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Helper functions
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

async function sendWebhook(webhook, payload) {
  const axios = require('axios');
  
  try {
    // Create signature
    const timestamp = Date.now();
    const signature = createWebhookSignature(
      payload,
      timestamp,
      webhook.secretKey
    );
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'StaySpot-Webhook/1.0',
      'X-Webhook-Signature': signature,
      'X-Webhook-Timestamp': timestamp,
      'X-Webhook-Id': webhook.id,
      'X-Webhook-Event': webhook.eventType
    };
    
    // Add custom headers
    if (webhook.headers && typeof webhook.headers === 'object') {
      Object.assign(headers, webhook.headers);
    }
    
    // Send webhook
    const response = await axios.post(webhook.url, payload, {
      headers,
      timeout: 10000 // 10 seconds timeout
    });
    
    return {
      success: response.status >= 200 && response.status < 300,
      statusCode: response.status,
      message: `Webhook delivered successfully (${response.status})`,
      response: {
        status: response.status,
        headers: response.headers,
        data: response.data
      },
      timestamp: new Date()
    };
    
  } catch (error) {
    return {
      success: false,
      statusCode: error.response?.status || 0,
      message: error.message,
      error: error.response?.data || error.message,
      timestamp: new Date()
    };
  }
}

function createWebhookSignature(payload, timestamp, secretKey) {
  const payloadString = JSON.stringify(payload);
  const data = `${timestamp}.${payloadString}`;
  return crypto
    .createHmac('sha256', secretKey)
    .update(data)
    .digest('hex');
}

function validateWebhookSignature(payload, signature, timestamp, secretKey) {
  const expectedSignature = createWebhookSignature(payload, timestamp, secretKey);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

function determineEventType(payload) {
  // Determine event type from payload
  if (payload.event) {
    return payload.event;
  }
  
  // Default based on payload structure
  if (payload.payment) return 'payment.created';
  if (payload.tenant) return 'tenant.created';
  if (payload.property) return 'property.created';
  if (payload.maintenance) return 'maintenance.created';
  if (payload.task) return 'task.assigned';
  if (payload.invoice) return 'invoice.created';
  
  return 'integration.sync_completed';
}

function passesFilters(payload, filters) {
  // Apply filter logic
  if (!filters || Object.keys(filters).length === 0) {
    return true;
  }
  
  // Simple filter implementation
  for (const [key, value] of Object.entries(filters)) {
    const payloadValue = getNestedValue(payload, key);
    if (payloadValue !== value) {
      return false;
    }
  }
  
  return true;
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((o, p) => (o || {})[p], obj);
}

async function logIncomingWebhook(integrationId, payload, results) {
  // Log incoming webhook to database
  // This would create a record in IncomingWebhookLog model
  console.log('Incoming webhook logged:', {
    integrationId,
    payload,
    results,
    receivedAt: new Date()
  });
}

module.exports = webhookController;