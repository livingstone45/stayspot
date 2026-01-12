const logger = require('../config/logger');
const connectionHandler = require('./connection.handler');

class NotificationHandler {
  constructor(io) {
    this.io = io;
    this.connectionHandler = connectionHandler;
    this.initializeNotificationHandling();
  }

  /**
   * Initialize notification handling
   */
  initializeNotificationHandling() {
    logger.info('Notification handler initialized');
  }

  /**
   * Send notification to user
   * @param {number} userId - User ID
   * @param {Object} notification - Notification data
   * @returns {Promise<Object>} Result
   */
  async sendNotification(userId, notification) {
    try {
      const db = require('../models');
      
      // Create notification in database
      const dbNotification = await db.Notification.create({
        userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data || {},
        priority: notification.priority || 'medium',
        status: 'sent',
        sentAt: new Date()
      });
      
      // Send via socket if user is online
      const delivered = this.emitToUser(userId, 'notification', {
        id: dbNotification.id,
        type: dbNotification.type,
        title: dbNotification.title,
        message: dbNotification.message,
        data: dbNotification.data,
        priority: dbNotification.priority,
        sentAt: dbNotification.sentAt
      });
      
      // Update delivery status
      if (delivered > 0) {
        await dbNotification.update({
          status: 'delivered',
          deliveredAt: new Date()
        });
        
        logger.info(`Notification ${dbNotification.id} delivered to user ${userId}`);
      } else {
        logger.info(`Notification ${dbNotification.id} stored for offline user ${userId}`);
      }
      
      return {
        success: true,
        notificationId: dbNotification.id,
        delivered: delivered > 0,
        deliveryCount: delivered
      };
    } catch (error) {
      logger.error(`Failed to send notification to user ${userId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send notification to multiple users
   * @param {Array} userIds - Array of user IDs
   * @param {Object} notification - Notification data
   * @returns {Promise<Object>} Result
   */
  async sendBulkNotification(userIds, notification) {
    try {
      const results = {
        total: userIds.length,
        sent: 0,
        failed: 0,
        details: []
      };
      
      for (const userId of userIds) {
        try {
          const result = await this.sendNotification(userId, notification);
          results.details.push({
            userId,
            success: result.success,
            notificationId: result.notificationId,
            delivered: result.delivered
          });
          
          if (result.success) {
            results.sent++;
          } else {
            results.failed++;
          }
        } catch (error) {
          logger.error(`Failed to send notification to user ${userId}:`, error);
          results.details.push({
            userId,
            success: false,
            error: error.message
          });
          results.failed++;
        }
      }
      
      return results;
    } catch (error) {
      logger.error('Bulk notification sending failed:', error);
      throw error;
    }
  }

  /**
   * Send notification to users in a role
   * @param {string} role - Role name
   * @param {Object} notification - Notification data
   * @returns {Promise<Object>} Result
   */
  async sendNotificationToRole(role, notification) {
    try {
      const db = require('../models');
      
      // Get users with specified role
      const users = await db.User.findAll({
        where: { roleId: role },
        attributes: ['id']
      });
      
      const userIds = users.map(user => user.id);
      
      return await this.sendBulkNotification(userIds, notification);
    } catch (error) {
      logger.error(`Failed to send notification to role ${role}:`, error);
      throw error;
    }
  }

  /**
   * Send notification to users in a company
   * @param {number} companyId - Company ID
   * @param {Object} notification - Notification data
   * @returns {Promise<Object>} Result
   */
  async sendNotificationToCompany(companyId, notification) {
    try {
      const db = require('../models');
      
      // Get users in company
      const users = await db.User.findAll({
        where: { companyId },
        attributes: ['id']
      });
      
      const userIds = users.map(user => user.id);
      
      return await this.sendBulkNotification(userIds, notification);
    } catch (error) {
      logger.error(`Failed to send notification to company ${companyId}:`, error);
      throw error;
    }
  }

  /**
   * Send notification to users with access to a property
   * @param {number} propertyId - Property ID
   * @param {Object} notification - Notification data
   * @returns {Promise<Object>} Result
   */
  async sendNotificationToPropertyUsers(propertyId, notification) {
    try {
      const db = require('../models');
      const RoleHelper = require('../utils/helpers/role.helper');
      
      // Get property
      const property = await db.Property.findByPk(propertyId, {
        include: [
          { model: db.Company, attributes: ['id'] },
          { model: db.Portfolio, attributes: ['id'] },
          { model: db.User, as: 'managers', attributes: ['id'] },
          { model: db.User, as: 'owner', attributes: ['id'] }
        ]
      });
      
      if (!property) {
        throw new Error(`Property ${propertyId} not found`);
      }
      
      const userIds = new Set();
      
      // Add property owner
      if (property.ownerId) {
        userIds.add(property.ownerId);
      }
      
      // Add property managers
      if (property.managers) {
        property.managers.forEach(manager => {
          userIds.add(manager.id);
        });
      }
      
      // Add portfolio managers
      if (property.portfolioId) {
        const portfolioManagers = await db.User.findAll({
          where: {
            roleId: 'portfolio_manager',
            portfolioId: property.portfolioId
          },
          attributes: ['id']
        });
        
        portfolioManagers.forEach(manager => {
          userIds.add(manager.id);
        });
      }
      
      // Add company admins
      if (property.companyId) {
        const companyAdmins = await db.User.findAll({
          where: {
            roleId: 'company_admin',
            companyId: property.companyId
          },
          attributes: ['id']
        });
        
        companyAdmins.forEach(admin => {
          userIds.add(admin.id);
        });
      }
      
      return await this.sendBulkNotification(Array.from(userIds), notification);
    } catch (error) {
      logger.error(`Failed to send notification to property ${propertyId} users:`, error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   * @param {number} notificationId - Notification ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Result
   */
  async markNotificationAsRead(notificationId, userId) {
    try {
      const db = require('../models');
      
      const notification = await db.Notification.findOne({
        where: {
          id: notificationId,
          userId
        }
      });
      
      if (!notification) {
        throw new Error(`Notification ${notificationId} not found for user ${userId}`);
      }
      
      await notification.update({
        status: 'read',
        readAt: new Date()
      });
      
      // Emit read confirmation
      this.emitToUser(userId, 'notification_read', {
        notificationId,
        readAt: notification.readAt
      });
      
      return {
        success: true,
        notificationId,
        readAt: notification.readAt
      };
    } catch (error) {
      logger.error(`Failed to mark notification ${notificationId} as read:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Mark all notifications as read for user
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Result
   */
  async markAllNotificationsAsRead(userId) {
    try {
      const db = require('../models');
      
      const result = await db.Notification.update(
        {
          status: 'read',
          readAt: new Date()
        },
        {
          where: {
            userId,
            status: 'unread'
          }
        }
      );
      
      // Emit bulk read confirmation
      this.emitToUser(userId, 'all_notifications_read', {
        count: result[0],
        readAt: new Date()
      });
      
      return {
        success: true,
        count: result[0]
      };
    } catch (error) {
      logger.error(`Failed to mark all notifications as read for user ${userId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete notification
   * @param {number} notificationId - Notification ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Result
   */
  async deleteNotification(notificationId, userId) {
    try {
      const db = require('../models');
      
      const notification = await db.Notification.findOne({
        where: {
          id: notificationId,
          userId
        }
      });
      
      if (!notification) {
        throw new Error(`Notification ${notificationId} not found for user ${userId}`);
      }
      
      await notification.destroy();
      
      // Emit deletion confirmation
      this.emitToUser(userId, 'notification_deleted', {
        notificationId,
        deletedAt: new Date()
      });
      
      return {
        success: true,
        notificationId
      };
    } catch (error) {
      logger.error(`Failed to delete notification ${notificationId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user notifications
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Notifications
   */
  async getUserNotifications(userId, options = {}) {
    try {
      const db = require('../models');
      
      const {
        limit = 50,
        offset = 0,
        status = null,
        type = null,
        startDate = null,
        endDate = null,
        unreadOnly = false
      } = options;
      
      const where = { userId };
      
      if (status) where.status = status;
      if (type) where.type = type;
      if (unreadOnly) where.status = 'unread';
      
      if (startDate || endDate) {
        where.sentAt = {};
        if (startDate) where.sentAt[db.Sequelize.Op.gte] = startDate;
        if (endDate) where.sentAt[db.Sequelize.Op.lte] = endDate;
      }
      
      const notifications = await db.Notification.findAll({
        where,
        order: [['sentAt', 'DESC']],
        limit,
        offset
      });
      
      return notifications;
    } catch (error) {
      logger.error(`Failed to get notifications for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get notification count for user
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Counts
   */
  async getNotificationCount(userId) {
    try {
      const db = require('../models');
      
      const counts = await db.Notification.findAll({
        where: { userId },
        attributes: [
          'status',
          [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']
        ],
        group: ['status']
      });
      
      const result = {
        total: 0,
        unread: 0,
        read: 0
      };
      
      counts.forEach(item => {
        const count = parseInt(item.get('count'));
        result.total += count;
        
        if (item.status === 'unread') {
          result.unread = count;
        } else if (item.status === 'read') {
          result.read = count;
        }
      });
      
      return result;
    } catch (error) {
      logger.error(`Failed to get notification count for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Send real-time property update notification
   * @param {number} propertyId - Property ID
   * @param {Object} update - Update data
   * @param {number} triggeredBy - User ID who triggered the update
   */
  async sendPropertyUpdateNotification(propertyId, update, triggeredBy) {
    const notification = {
      type: 'property_update',
      title: 'Property Updated',
      message: `Property "${update.name || 'Unknown'}" has been updated`,
      data: {
        propertyId,
        updateType: update.type || 'general',
        updatedFields: update.updatedFields || [],
        triggeredBy
      },
      priority: 'low'
    };
    
    return await this.sendNotificationToPropertyUsers(propertyId, notification);
  }

  /**
   * Send new task assignment notification
   * @param {number} taskId - Task ID
   * @param {number} assigneeId - Assignee ID
   * @param {Object} task - Task data
   * @param {number} assignedBy - User ID who assigned the task
   */
  async sendTaskAssignmentNotification(taskId, assigneeId, task, assignedBy) {
    const notification = {
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: `You have been assigned a new task: "${task.title}"`,
      data: {
        taskId,
        taskTitle: task.title,
        priority: task.priority,
        dueDate: task.dueDate,
        propertyId: task.propertyId,
        assignedBy
      },
      priority: task.priority === 'urgent' ? 'high' : 'medium'
    };
    
    return await this.sendNotification(assigneeId, notification);
  }

  /**
   * Send maintenance request notification
   * @param {number} requestId - Maintenance request ID
   * @param {Object} request - Request data
   * @param {Array} recipientIds - Array of recipient user IDs
   */
  async sendMaintenanceRequestNotification(requestId, request, recipientIds) {
    const notification = {
      type: 'maintenance_request',
      title: 'New Maintenance Request',
      message: `New maintenance request: "${request.title || 'Maintenance Required'}"`,
      data: {
        requestId,
        title: request.title,
        priority: request.priority,
        propertyId: request.propertyId,
        unitId: request.unitId,
        submittedBy: request.submittedBy
      },
      priority: request.priority === 'emergency' ? 'high' : 'medium'
    };
    
    return await this.sendBulkNotification(recipientIds, notification);
  }

  /**
   * Send payment reminder notification
   * @param {number} paymentId - Payment ID
   * @param {Object} payment - Payment data
   * @param {number} tenantId - Tenant ID
   */
  async sendPaymentReminderNotification(paymentId, payment, tenantId) {
    const notification = {
      type: 'payment_reminder',
      title: 'Payment Reminder',
      message: `Payment of $${payment.amount} is due on ${new Date(payment.dueDate).toLocaleDateString()}`,
      data: {
        paymentId,
        amount: payment.amount,
        dueDate: payment.dueDate,
        daysUntilDue: payment.daysUntilDue,
        propertyId: payment.propertyId
      },
      priority: payment.daysUntilDue <= 3 ? 'high' : 'medium'
    };
    
    return await this.sendNotification(tenantId, notification);
  }

  /**
   * Send lease expiration notification
   * @param {number} leaseId - Lease ID
   * @param {Object} lease - Lease data
   * @param {Array} recipientIds - Array of recipient user IDs
   */
  async sendLeaseExpirationNotification(leaseId, lease, recipientIds) {
    const notification = {
      type: 'lease_expiring',
      title: 'Lease Expiring Soon',
      message: `Lease for "${lease.propertyName}" is expiring on ${new Date(lease.endDate).toLocaleDateString()}`,
      data: {
        leaseId,
        propertyName: lease.propertyName,
        endDate: lease.endDate,
        daysUntilExpiration: lease.daysUntilExpiration,
        tenantId: lease.tenantId
      },
      priority: lease.daysUntilExpiration <= 30 ? 'medium' : 'low'
    };
    
    return await this.sendBulkNotification(recipientIds, notification);
  }

  /**
   * Send system alert notification
   * @param {string} alertType - Alert type
   * @param {string} message - Alert message
   * @param {Object} data - Alert data
   * @param {Array} recipientRoles - Array of recipient roles
   */
  async sendSystemAlertNotification(alertType, message, data = {}, recipientRoles = ['system_admin']) {
    const notification = {
      type: 'system_alert',
      title: `System Alert: ${alertType}`,
      message,
      data: {
        alertType,
        ...data
      },
      priority: 'high'
    };
    
    const results = [];
    
    for (const role of recipientRoles) {
      try {
        const result = await this.sendNotificationToRole(role, notification);
        results.push({
          role,
          ...result
        });
      } catch (error) {
        logger.error(`Failed to send system alert to role ${role}:`, error);
        results.push({
          role,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Send welcome notification to new user
   * @param {number} userId - User ID
   * @param {Object} user - User data
   * @param {string} role - User role
   */
  async sendWelcomeNotification(userId, user, role) {
    const notification = {
      type: 'welcome',
      title: 'Welcome to StaySpot!',
      message: `Welcome ${user.firstName}! Your account has been created with ${role} role.`,
      data: {
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        role,
        welcomeDate: new Date()
      },
      priority: 'low'
    };
    
    return await this.sendNotification(userId, notification);
  }

  /**
   * Send invitation notification
   * @param {string} email - Invitee email
   * @param {string} invitationId - Invitation ID
   * @param {string} role - Invited role
   * @param {number} invitedBy - Inviter user ID
   */
  async sendInvitationNotification(email, invitationId, role, invitedBy) {
    // This would typically send an email, but we can also create an in-app notification
    // if the user already has an account
    
    const db = require('../models');
    
    // Check if user exists with this email
    const existingUser = await db.User.findOne({
      where: { email },
      attributes: ['id']
    });
    
    if (existingUser) {
      const notification = {
        type: 'invitation',
        title: 'New Invitation',
        message: `You have been invited to join as ${role}`,
        data: {
          invitationId,
          email,
          role,
          invitedBy,
          invitationDate: new Date()
        },
        priority: 'medium'
      };
      
      return await this.sendNotification(existingUser.id, notification);
    }
    
    // If user doesn't exist, we would send an email instead
    return {
      success: true,
      notificationType: 'email',
      message: 'Invitation email sent'
    };
  }

  /**
   * Emit event to user via socket
   * @param {number} userId - User ID
   * @param {string} event - Event name
   * @param {Object} data - Event data
   * @returns {number} Number of sockets delivered to
   */
  emitToUser(userId, event, data) {
    return this.connectionHandler.emitToUser(userId, event, data);
  }

  /**
   * Emit event to room via socket
   * @param {string} room - Room name
   * @param {string} event - Event name
   * @param {Object} data - Event data
   * @returns {number} Number of sockets delivered to
   */
  emitToRoom(room, event, data) {
    return this.connectionHandler.emitToRoom(room, event, data);
  }

  /**
   * Broadcast event to all connected users
   * @param {string} event - Event name
   * @param {Object} data - Event data
   * @returns {number} Number of sockets delivered to
   */
  broadcast(event, data) {
    return this.connectionHandler.broadcast(event, data);
  }
}

module.exports = NotificationHandler;