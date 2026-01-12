const logger = require('../config/logger');
const connectionHandler = require('./connection.handler');
const notificationHandler = require('./notification.handler');
const chatHandler = require('./chat.handler');
const triggers = require('../utils/automation/triggers');

class RealtimeHandler {
  constructor(io) {
    this.io = io;
    this.connectionHandler = new connectionHandler(io);
    this.notificationHandler = new notificationHandler(io);
    this.chatHandler = new chatHandler(io);
    this.initializeRealtimeHandlers();
  }

  /**
   * Initialize all real-time handlers
   */
  initializeRealtimeHandlers() {
    this.setupSystemEventHandlers();
    this.setupPropertyEventHandlers();
    this.setupTaskEventHandlers();
    this.setupMaintenanceEventHandlers();
    this.setupPaymentEventHandlers();
    this.setupUserEventHandlers();
    this.setupIntegrationEventHandlers();
    
    logger.info('Realtime handler initialized');
  }

  /**
   * Setup system event handlers
   */
  setupSystemEventHandlers() {
    // System health updates
    triggers.on('system.health_update', (data) => {
      this.broadcastToAdmins('system_health_update', data);
    });

    // System maintenance notifications
    triggers.on('system.maintenance_started', (data) => {
      this.broadcastToAll('system_maintenance_started', data);
    });

    triggers.on('system.maintenance_completed', (data) => {
      this.broadcastToAll('system_maintenance_completed', data);
    });
  }

  /**
   * Setup property event handlers
   */
  setupPropertyEventHandlers() {
    // Property created
    triggers.on('property.created', async (data) => {
      const { propertyId, uploadedBy } = data.data;
      
      // Notify relevant users
      await this.notificationHandler.sendPropertyUpdateNotification(
        propertyId,
        { type: 'created', name: data.data.name },
        uploadedBy
      );
      
      // Broadcast to property room
      this.broadcastToProperty(propertyId, 'property_created', {
        propertyId,
        uploadedBy,
        timestamp: new Date()
      });
    });

    // Property updated
    triggers.on('property.updated', async (data) => {
      const { propertyId, updatedBy, updatedFields } = data.data;
      
      // Notify relevant users
      await this.notificationHandler.sendPropertyUpdateNotification(
        propertyId,
        { type: 'updated', updatedFields },
        updatedBy
      );
      
      // Broadcast to property room
      this.broadcastToProperty(propertyId, 'property_updated', {
        propertyId,
        updatedBy,
        updatedFields,
        timestamp: new Date()
      });
      
      // Update website in real-time
      this.updateWebsiteProperty(propertyId);
    });

    // Property status changed
    triggers.on('property.status_changed', (data) => {
      const { propertyId, oldStatus, newStatus, changedBy } = data.data;
      
      this.broadcastToProperty(propertyId, 'property_status_changed', {
        propertyId,
        oldStatus,
        newStatus,
        changedBy,
        timestamp: new Date()
      });
    });

    // Property published
    triggers.on('property.published', (data) => {
      const { propertyId, publishedBy } = data.data;
      
      this.broadcastToProperty(propertyId, 'property_published', {
        propertyId,
        publishedBy,
        timestamp: new Date()
      });
      
      // Update public website
      this.publishToWebsite(propertyId);
    });
  }

  /**
   * Setup task event handlers
   */
  setupTaskEventHandlers() {
    // Task created
    triggers.on('task.created', async (data) => {
      const { taskId, propertyId, createdBy } = data.data;
      
      // Create task chat room
      await this.chatHandler.createTaskChatRoom(taskId);
      
      // Broadcast to property room
      this.broadcastToProperty(propertyId, 'task_created', {
        taskId,
        propertyId,
        createdBy,
        timestamp: new Date()
      });
    });

    // Task assigned
    triggers.on('task.assigned', async (data) => {
      const { taskId, assigneeId, assignedBy } = data.data;
      
      // Send notification to assignee
      const task = await this.getTaskDetails(taskId);
      if (task) {
        await this.notificationHandler.sendTaskAssignmentNotification(
          taskId,
          assigneeId,
          task,
          assignedBy
        );
      }
      
      // Broadcast to task room
      this.broadcastToTask(taskId, 'task_assigned', {
        taskId,
        assigneeId,
        assignedBy,
        timestamp: new Date()
      });
    });

    // Task updated
    triggers.on('task.updated', (data) => {
      const { taskId, updatedFields, updatedBy } = data.data;
      
      this.broadcastToTask(taskId, 'task_updated', {
        taskId,
        updatedFields,
        updatedBy,
        timestamp: new Date()
      });
    });

    // Task completed
    triggers.on('task.completed', async (data) => {
      const { taskId, completedBy } = data.data;
      
      // Send completion notification
      const task = await this.getTaskDetails(taskId);
      if (task) {
        await this.notificationHandler.sendNotificationToPropertyUsers(
          task.propertyId,
          {
            type: 'task_completed',
            title: 'Task Completed',
            message: `Task "${task.title}" has been completed`,
            data: {
              taskId,
              taskTitle: task.title,
              completedBy,
              propertyId: task.propertyId
            },
            priority: 'low'
          }
        );
      }
      
      // Broadcast to task room
      this.broadcastToTask(taskId, 'task_completed', {
        taskId,
        completedBy,
        timestamp: new Date()
      });
    });

    // Task overdue
    triggers.on('task.overdue', async (data) => {
      const { taskId, assigneeId } = data.data;
      
      // Send overdue notification
      const task = await this.getTaskDetails(taskId);
      if (task) {
        await this.notificationHandler.sendNotification(
          assigneeId,
          {
            type: 'task_overdue',
            title: 'Task Overdue',
            message: `Task "${task.title}" is overdue`,
            data: {
              taskId,
              taskTitle: task.title,
              dueDate: task.dueDate,
              propertyId: task.propertyId
            },
            priority: 'high'
          }
        );
      }
      
      // Broadcast to task room
      this.broadcastToTask(taskId, 'task_overdue', {
        taskId,
        assigneeId,
        timestamp: new Date()
      });
    });
  }

  /**
   * Setup maintenance event handlers
   */
  setupMaintenanceEventHandlers() {
    // Maintenance request submitted
    triggers.on('maintenance.request_submitted', async (data) => {
      const { requestId, propertyId, tenantId, priority } = data.data;
      
      // Get property users to notify
      const recipientIds = await this.getPropertyUserIds(propertyId);
      
      // Send notification
      const request = await this.getMaintenanceRequestDetails(requestId);
      if (request) {
        await this.notificationHandler.sendMaintenanceRequestNotification(
          requestId,
          request,
          recipientIds
        );
      }
      
      // Create maintenance chat room
      await this.chatHandler.createChatRoom(
        [...recipientIds, tenantId],
        'maintenance',
        { requestId, propertyId }
      );
      
      // Broadcast to property room
      this.broadcastToProperty(propertyId, 'maintenance_request_submitted', {
        requestId,
        propertyId,
        tenantId,
        priority,
        timestamp: new Date()
      });
    });

    // Maintenance request assigned
    triggers.on('maintenance.request_assigned', (data) => {
      const { requestId, assignedTo, assignedBy } = data.data;
      
      this.broadcastToMaintenance(requestId, 'maintenance_request_assigned', {
        requestId,
        assignedTo,
        assignedBy,
        timestamp: new Date()
      });
    });

    // Maintenance request completed
    triggers.on('maintenance.request_completed', async (data) => {
      const { requestId, completedBy } = data.data;
      
      // Get request details
      const request = await this.getMaintenanceRequestDetails(requestId);
      if (request) {
        // Notify tenant
        await this.notificationHandler.sendNotification(
          request.tenantId,
          {
            type: 'maintenance_completed',
            title: 'Maintenance Completed',
            message: `Your maintenance request has been completed`,
            data: {
              requestId,
              title: request.title,
              completedBy,
              propertyId: request.propertyId
            },
            priority: 'medium'
          }
        );
      }
      
      // Broadcast to maintenance room
      this.broadcastToMaintenance(requestId, 'maintenance_request_completed', {
        requestId,
        completedBy,
        timestamp: new Date()
      });
    });

    // Maintenance emergency
    triggers.on('maintenance.emergency', async (data) => {
      const { requestId, propertyId, emergencyType } = data.data;
      
      // Get all system admins and property managers
      const recipientIds = await this.getEmergencyRecipientIds(propertyId);
      
      // Send emergency notification
      const request = await this.getMaintenanceRequestDetails(requestId);
      if (request) {
        await this.notificationHandler.sendBulkNotification(
          recipientIds,
          {
            type: 'maintenance_emergency',
            title: 'EMERGENCY MAINTENANCE',
            message: `Emergency maintenance required: ${request.title}`,
            data: {
              requestId,
              emergencyType,
              propertyId,
              tenantId: request.tenantId
            },
            priority: 'high'
          }
        );
      }
      
      // Broadcast emergency alert
      this.broadcastToProperty(propertyId, 'maintenance_emergency', {
        requestId,
        propertyId,
        emergencyType,
        timestamp: new Date()
      });
    });
  }

  /**
   * Setup payment event handlers
   */
  setupPaymentEventHandlers() {
    // Payment created
    triggers.on('payment.created', (data) => {
      const { paymentId, tenantId, amount, dueDate } = data.data;
      
      // Broadcast to tenant
      this.broadcastToUser(tenantId, 'payment_created', {
        paymentId,
        amount,
        dueDate,
        timestamp: new Date()
      });
    });

    // Payment processing
    triggers.on('payment.processing', (data) => {
      const { paymentId, tenantId } = data.data;
      
      this.broadcastToUser(tenantId, 'payment_processing', {
        paymentId,
        timestamp: new Date()
      });
    });

    // Payment completed
    triggers.on('payment.completed', async (data) => {
      const { paymentId, tenantId, amount, paidDate } = data.data;
      
      // Send confirmation notification
      await this.notificationHandler.sendNotification(
        tenantId,
        {
          type: 'payment_confirmation',
          title: 'Payment Confirmed',
          message: `Payment of $${amount} has been confirmed`,
          data: {
            paymentId,
            amount,
            paidDate
          },
          priority: 'medium'
        }
      );
      
      // Broadcast to tenant
      this.broadcastToUser(tenantId, 'payment_completed', {
        paymentId,
        amount,
        paidDate,
        timestamp: new Date()
      });
    });

    // Payment failed
    triggers.on('payment.failed', async (data) => {
      const { paymentId, tenantId, failureReason } = data.data;
      
      // Send failure notification
      await this.notificationHandler.sendNotification(
        tenantId,
        {
          type: 'payment_failed',
          title: 'Payment Failed',
          message: `Payment failed: ${failureReason}`,
          data: {
            paymentId,
            failureReason
          },
          priority: 'high'
        }
      );
      
      // Broadcast to tenant
      this.broadcastToUser(tenantId, 'payment_failed', {
        paymentId,
        failureReason,
        timestamp: new Date()
      });
    });

    // Payment overdue
    triggers.on('payment.overdue', async (data) => {
      const { paymentId, tenantId, daysOverdue } = data.data;
      
      // Get payment details
      const payment = await this.getPaymentDetails(paymentId);
      if (payment) {
        await this.notificationHandler.sendPaymentReminderNotification(
          paymentId,
          payment,
          tenantId
        );
      }
      
      // Broadcast to tenant
      this.broadcastToUser(tenantId, 'payment_overdue', {
        paymentId,
        daysOverdue,
        timestamp: new Date()
      });
    });
  }

  /**
   * Setup user event handlers
   */
  setupUserEventHandlers() {
    // User invited
    triggers.on('user.invited', async (data) => {
      const { invitationId, email, role, invitedBy } = data.data;
      
      await this.notificationHandler.sendInvitationNotification(
        email,
        invitationId,
        role,
        invitedBy
      );
    });

    // User invitation accepted
    triggers.on('user.invitation_accepted', async (data) => {
      const { invitationId, userId } = data.data;
      
      // Send welcome notification
      const user = await this.getUserDetails(userId);
      if (user) {
        await this.notificationHandler.sendWelcomeNotification(
          userId,
          user,
          user.role
        );
      }
      
      // Notify inviter
      const invitation = await this.getInvitationDetails(invitationId);
      if (invitation) {
        await this.notificationHandler.sendNotification(
          invitation.invitedBy,
          {
            type: 'invitation_accepted',
            title: 'Invitation Accepted',
            message: `${user.firstName} ${user.lastName} has accepted your invitation`,
            data: {
              invitationId,
              userId,
              userEmail: user.email,
              role: user.role
            },
            priority: 'low'
          }
        );
      }
    });

    // User role changed
    triggers.on('user.role_changed', async (data) => {
      const { userId, oldRole, newRole, changedBy } = data.data;
      
      // Notify user
      await this.notificationHandler.sendNotification(
        userId,
        {
          type: 'role_changed',
          title: 'Role Updated',
          message: `Your role has been changed from ${oldRole} to ${newRole}`,
          data: {
            oldRole,
            newRole,
            changedBy
          },
          priority: 'medium'
        }
      );
      
      // Broadcast to user
      this.broadcastToUser(userId, 'role_changed', {
        oldRole,
        newRole,
        changedBy,
        timestamp: new Date()
      });
    });
  }

  /**
   * Setup integration event handlers
   */
  setupIntegrationEventHandlers() {
    // Integration sync completed
    triggers.on('integration.sync_completed', (data) => {
      const { integrationId, syncType, recordsProcessed, duration } = data.data;
      
      this.broadcastToAdmins('integration_sync_completed', {
        integrationId,
        syncType,
        recordsProcessed,
        duration,
        timestamp: new Date()
      });
    });

    // Market data updated
    triggers.on('marketdata.updated', (data) => {
      const { marketDataId, dataType, source } = data.data;
      
      this.broadcastToAdmins('market_data_updated', {
        marketDataId,
        dataType,
        source,
        timestamp: new Date()
      });
    });

    // Webhook received
    triggers.on('webhook.received', (data) => {
      const { webhookId, source, eventType } = data.data;
      
      this.broadcastToAdmins('webhook_received', {
        webhookId,
        source,
        eventType,
        timestamp: new Date()
      });
    });
  }

  /**
   * Helper methods for data retrieval
   */
  
  async getTaskDetails(taskId) {
    try {
      const db = require('../models');
      return await db.Task.findByPk(taskId, {
        attributes: ['id', 'title', 'description', 'priority', 'dueDate', 'propertyId', 'assigneeId']
      });
    } catch (error) {
      logger.error(`Failed to get task details for ${taskId}:`, error);
      return null;
    }
  }

  async getMaintenanceRequestDetails(requestId) {
    try {
      const db = require('../models');
      return await db.MaintenanceRequest.findByPk(requestId, {
        attributes: ['id', 'title', 'description', 'priority', 'propertyId', 'tenantId']
      });
    } catch (error) {
      logger.error(`Failed to get maintenance request details for ${requestId}:`, error);
      return null;
    }
  }

  async getPaymentDetails(paymentId) {
    try {
      const db = require('../models');
      return await db.Payment.findByPk(paymentId, {
        attributes: ['id', 'amount', 'dueDate', 'propertyId', 'tenantId']
      });
    } catch (error) {
      logger.error(`Failed to get payment details for ${paymentId}:`, error);
      return null;
    }
  }

  async getUserDetails(userId) {
    try {
      const db = require('../models');
      return await db.User.findByPk(userId, {
        attributes: ['id', 'firstName', 'lastName', 'email', 'roleId'],
        include: [{
          model: db.Role,
          attributes: ['name']
        }]
      });
    } catch (error) {
      logger.error(`Failed to get user details for ${userId}:`, error);
      return null;
    }
  }

  async getInvitationDetails(invitationId) {
    try {
      const db = require('../models');
      return await db.Invitation.findByPk(invitationId, {
        attributes: ['id', 'invitedBy', 'email', 'roleId']
      });
    } catch (error) {
      logger.error(`Failed to get invitation details for ${invitationId}:`, error);
      return null;
    }
  }

  async getPropertyUserIds(propertyId) {
    try {
      const db = require('../models');
      const property = await db.Property.findByPk(propertyId, {
        include: [
          { model: db.User, as: 'managers', attributes: ['id'] },
          { model: db.User, as: 'owner', attributes: ['id'] }
        ]
      });
      
      const userIds = new Set();
      
      if (property.ownerId) {
        userIds.add(property.ownerId);
      }
      
      if (property.managers) {
        property.managers.forEach(manager => {
          userIds.add(manager.id);
        });
      }
      
      return Array.from(userIds);
    } catch (error) {
      logger.error(`Failed to get property user IDs for ${propertyId}:`, error);
      return [];
    }
  }

  async getEmergencyRecipientIds(propertyId) {
    try {
      const db = require('../models');
      
      // Get system admins
      const systemAdmins = await db.User.findAll({
        where: { roleId: 'system_admin' },
        attributes: ['id']
      });
      
      // Get property users
      const propertyUserIds = await this.getPropertyUserIds(propertyId);
      
      // Combine and deduplicate
      const allUserIds = new Set();
      
      systemAdmins.forEach(admin => {
        allUserIds.add(admin.id);
      });
      
      propertyUserIds.forEach(userId => {
        allUserIds.add(userId);
      });
      
      return Array.from(allUserIds);
    } catch (error) {
      logger.error(`Failed to get emergency recipient IDs for property ${propertyId}:`, error);
      return [];
    }
  }

  /**
   * Broadcast methods
   */
  
  broadcastToUser(userId, event, data) {
    return this.connectionHandler.emitToUser(userId, event, data);
  }

  broadcastToRoom(room, event, data) {
    return this.connectionHandler.emitToRoom(room, event, data);
  }

  broadcastToProperty(propertyId, event, data) {
    return this.broadcastToRoom(`property:${propertyId}`, event, data);
  }

  broadcastToTask(taskId, event, data) {
    return this.broadcastToRoom(`task:${taskId}`, event, data);
  }

  broadcastToMaintenance(maintenanceId, event, data) {
    return this.broadcastToRoom(`maintenance:${maintenanceId}`, event, data);
  }

  broadcastToAdmins(event, data) {
    // Broadcast to all admin roles
    const adminRoles = ['system_admin', 'company_admin', 'portfolio_manager'];
    let totalDelivered = 0;
    
    adminRoles.forEach(role => {
      totalDelivered += this.broadcastToRoom(`role:${role}`, event, data);
    });
    
    return totalDelivered;
  }

  broadcastToAll(event, data) {
    return this.connectionHandler.broadcast(event, data);
  }

  /**
   * Website update methods
   */
  
  updateWebsiteProperty(propertyId) {
    // This would integrate with your website update system
    // For example, invalidate cache, update search index, etc.
    logger.info(`Updating website for property ${propertyId}`);
    
    // Emit website update event
    this.broadcastToRoom('website_updates', 'property_updated', {
      propertyId,
      timestamp: new Date()
    });
  }

  publishToWebsite(propertyId) {
    // Publish property to public website
    logger.info(`Publishing property ${propertyId} to website`);
    
    this.broadcastToRoom('website_updates', 'property_published', {
      propertyId,
      timestamp: new Date()
    });
  }

  /**
   * Get real-time statistics
   * @returns {Object} Real-time statistics
   */
  getStats() {
    return {
      connections: this.io.engine.clientsCount,
      users: this.connectionHandler.getConnectedUsers().length,
      rooms: this.io.sockets.adapter.rooms.size,
      timestamp: new Date()
    };
  }

  /**
   * Get connection handler
   * @returns {ConnectionHandler} Connection handler instance
   */
  getConnectionHandler() {
    return this.connectionHandler;
  }

  /**
   * Get notification handler
   * @returns {NotificationHandler} Notification handler instance
   */
  getNotificationHandler() {
    return this.notificationHandler;
  }

  /**
   * Get chat handler
   * @returns {ChatHandler} Chat handler instance
   */
  getChatHandler() {
    return this.chatHandler;
  }
}

module.exports = RealtimeHandler;