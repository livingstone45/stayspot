const Queue = require('bull');
const logger = require('../config/logger');
const db = require('../models');

class NotificationWorker {
  constructor() {
    this.queue = new Queue('notification-processing', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000
        },
        removeOnComplete: true,
        removeOnFail: false
      }
    });
    
    this.initializeWorkers();
    logger.info('Notification worker initialized');
  }

  /**
   * Initialize queue workers
   */
  initializeWorkers() {
    // Process email notifications
    this.queue.process('send-email', 10, async (job) => {
      return await this.sendEmailNotification(job.data);
    });

    // Process SMS notifications
    this.queue.process('send-sms', 5, async (job) => {
      return await this.sendSMSNotification(job.data);
    });

    // Process push notifications
    this.queue.process('send-push', 20, async (job) => {
      return await this.sendPushNotification(job.data);
    });

    // Process in-app notifications
    this.queue.process('send-inapp', 50, async (job) => {
      return await this.sendInAppNotification(job.data);
    });

    // Process bulk notifications
    this.queue.process('send-bulk', 1, async (job) => {
      return await this.sendBulkNotification(job.data);
    });

    // Process notification digests
    this.queue.process('send-digest', 2, async (job) => {
      return await this.sendNotificationDigest(job.data);
    });

    // Process notification cleanup
    this.queue.process('cleanup-notifications', 1, async (job) => {
      return await this.cleanupOldNotifications(job.data);
    });

    // Error handling
    this.queue.on('failed', (job, error) => {
      logger.error(`Notification job ${job.id} failed:`, error);
      this.handleJobFailure(job, error);
    });

    this.queue.on('completed', (job, result) => {
      logger.info(`Notification job ${job.id} completed successfully`);
      this.handleJobSuccess(job, result);
    });

    this.queue.on('stalled', (job) => {
      logger.warn(`Notification job ${job.id} stalled`);
    });
  }

  /**
   * Add email notification job
   * @param {Object} data - Email data
   * @returns {Promise<Job>} Bull job
   */
  async addEmailJob(data) {
    return await this.queue.add('send-email', data, {
      jobId: `email_${data.notificationId || Date.now()}`,
      priority: data.priority === 'high' ? 1 : 2
    });
  }

  /**
   * Add SMS notification job
   * @param {Object} data - SMS data
   * @returns {Promise<Job>} Bull job
   */
  async addSMSJob(data) {
    return await this.queue.add('send-sms', data, {
      jobId: `sms_${data.notificationId || Date.now()}`,
      priority: data.priority === 'high' ? 1 : 3
    });
  }

  /**
   * Add push notification job
   * @param {Object} data - Push data
   * @returns {Promise<Job>} Bull job
   */
  async addPushJob(data) {
    return await this.queue.add('send-push', data, {
      jobId: `push_${data.notificationId || Date.now()}`,
      priority: data.priority === 'high' ? 1 : 4
    });
  }

  /**
   * Add in-app notification job
   * @param {Object} data - In-app data
   * @returns {Promise<Job>} Bull job
   */
  async addInAppJob(data) {
    return await this.queue.add('send-inapp', data, {
      jobId: `inapp_${data.notificationId || Date.now()}`,
      priority: 5
    });
  }

  /**
   * Add bulk notification job
   * @param {Object} data - Bulk data
   * @returns {Promise<Job>} Bull job
   */
  async addBulkJob(data) {
    return await this.queue.add('send-bulk', data, {
      jobId: `bulk_${Date.now()}`,
      priority: 6
    });
  }

  /**
   * Add digest notification job
   * @param {Object} data - Digest data
   * @returns {Promise<Job>} Bull job
   */
  async addDigestJob(data) {
    return await this.queue.add('send-digest', data, {
      jobId: `digest_${data.userId}_${Date.now()}`,
      priority: 7
    });
  }

  /**
   * Send email notification
   * @param {Object} data - Email data
   * @returns {Promise<Object>} Result
   */
  async sendEmailNotification(data) {
    const {
      to,
      subject,
      template,
      templateData,
      notificationId,
      userId,
      priority = 'medium'
    } = data;
    
    logger.info(`Sending email notification to ${to}`);
    
    try {
      // Get email service
      const emailService = require('../services/communication/email.service');
      
      // Prepare email options
      const emailOptions = {
        to,
        subject,
        template,
        data: templateData,
        priority: priority === 'high' ? 'high' : 'normal'
      };
      
      // Send email
      const result = await emailService.sendEmail(emailOptions);
      
      // Update notification status in database
      if (notificationId) {
        await db.Notification.update(
          {
            emailSent: true,
            emailSentAt: new Date(),
            emailStatus: 'sent',
            emailResult: result
          },
          { where: { id: notificationId } }
        );
      }
      
      // Log email delivery
      await this.logNotificationDelivery({
        type: 'email',
        userId,
        recipient: to,
        notificationId,
        status: 'sent',
        result,
        sentAt: new Date()
      });
      
      return {
        success: true,
        type: 'email',
        recipient: to,
        result,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
      
      // Update notification status
      if (notificationId) {
        await db.Notification.update(
          {
            emailStatus: 'failed',
            emailError: error.message
          },
          { where: { id: notificationId } }
        );
      }
      
      // Log failure
      await this.logNotificationDelivery({
        type: 'email',
        userId,
        recipient: to,
        notificationId,
        status: 'failed',
        error: error.message,
        sentAt: new Date()
      });
      
      throw error;
    }
  }

  /**
   * Send SMS notification
   * @param {Object} data - SMS data
   * @returns {Promise<Object>} Result
   */
  async sendSMSNotification(data) {
    const {
      to,
      message,
      notificationId,
      userId,
      priority = 'medium'
    } = data;
    
    logger.info(`Sending SMS notification to ${to}`);
    
    try {
      // Get SMS service
      const smsService = require('../services/communication/sms.service');
      
      // Send SMS
      const result = await smsService.sendSMS({
        to,
        message,
        priority: priority === 'high' ? 'high' : 'normal'
      });
      
      // Update notification status
      if (notificationId) {
        await db.Notification.update(
          {
            smsSent: true,
            smsSentAt: new Date(),
            smsStatus: 'sent',
            smsResult: result
          },
          { where: { id: notificationId } }
        );
      }
      
      // Log SMS delivery
      await this.logNotificationDelivery({
        type: 'sms',
        userId,
        recipient: to,
        notificationId,
        status: 'sent',
        result,
        sentAt: new Date()
      });
      
      return {
        success: true,
        type: 'sms',
        recipient: to,
        result,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error(`Failed to send SMS to ${to}:`, error);
      
      // Update notification status
      if (notificationId) {
        await db.Notification.update(
          {
            smsStatus: 'failed',
            smsError: error.message
          },
          { where: { id: notificationId } }
        );
      }
      
      // Log failure
      await this.logNotificationDelivery({
        type: 'sms',
        userId,
        recipient: to,
        notificationId,
        status: 'failed',
        error: error.message,
        sentAt: new Date()
      });
      
      throw error;
    }
  }

  /**
   * Send push notification
   * @param {Object} data - Push data
   * @returns {Promise<Object>} Result
   */
  async sendPushNotification(data) {
    const {
      userId,
      title,
      body,
      data: pushData,
      notificationId,
      priority = 'medium'
    } = data;
    
    logger.info(`Sending push notification to user ${userId}`);
    
    try {
      // Get push service
      const pushService = require('../services/communication/push.service');
      
      // Get user's push tokens
      const pushTokens = await this.getUserPushTokens(userId);
      
      if (pushTokens.length === 0) {
        return {
          success: false,
          type: 'push',
          userId,
          reason: 'No push tokens found',
          timestamp: new Date()
        };
      }
      
      // Send push to each token
      const results = [];
      
      for (const token of pushTokens) {
        try {
          const result = await pushService.sendPush({
            token,
            title,
            body,
            data: pushData,
            priority: priority === 'high' ? 'high' : 'normal'
          });
          
          results.push({
            token,
            success: true,
            result
          });
          
          // Log successful delivery
          await this.logPushDelivery({
            userId,
            token,
            notificationId,
            status: 'sent',
            result,
            sentAt: new Date()
          });
        } catch (error) {
          logger.error(`Failed to send push to token ${token}:`, error);
          
          results.push({
            token,
            success: false,
            error: error.message
          });
          
          // Log failed delivery
          await this.logPushDelivery({
            userId,
            token,
            notificationId,
            status: 'failed',
            error: error.message,
            sentAt: new Date()
          });
          
          // If token is invalid, remove it
          if (error.message.includes('invalid') || error.message.includes('not registered')) {
            await this.removeInvalidPushToken(userId, token);
          }
        }
      }
      
      // Calculate success rate
      const successful = results.filter(r => r.success).length;
      const successRate = results.length > 0 ? (successful / results.length) * 100 : 0;
      
      // Update notification status
      if (notificationId) {
        await db.Notification.update(
          {
            pushSent: successful > 0,
            pushSentAt: new Date(),
            pushStatus: successRate > 0 ? 'partial' : 'failed',
            pushResult: results,
            pushSuccessRate: successRate
          },
          { where: { id: notificationId } }
        );
      }
      
      return {
        success: successRate > 0,
        type: 'push',
        userId,
        results,
        successRate,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error(`Failed to send push notification to user ${userId}:`, error);
      
      // Update notification status
      if (notificationId) {
        await db.Notification.update(
          {
            pushStatus: 'failed',
            pushError: error.message
          },
          { where: { id: notificationId } }
        );
      }
      
      throw error;
    }
  }

  /**
   * Send in-app notification
   * @param {Object} data - In-app data
   * @returns {Promise<Object>} Result
   */
  async sendInAppNotification(data) {
    const {
      userId,
      type,
      title,
      message,
      data: notificationData,
      notificationId,
      priority = 'medium'
    } = data;
    
    logger.info(`Sending in-app notification to user ${userId}`);
    
    try {
      // Get realtime handler
      const realtimeHandler = require('../socket/realtime.handler').getNotificationHandler();
      
      // Send in-app notification
      const result = await realtimeHandler.sendNotification(userId, {
        type,
        title,
        message,
        data: notificationData,
        priority
      });
      
      // Update notification status
      if (notificationId) {
        await db.Notification.update(
          {
            inAppSent: true,
            inAppSentAt: new Date(),
            inAppStatus: result.delivered ? 'delivered' : 'pending',
            inAppResult: result
          },
          { where: { id: notificationId } }
        );
      }
      
      return {
        success: true,
        type: 'in-app',
        userId,
        result,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error(`Failed to send in-app notification to user ${userId}:`, error);
      
      // Update notification status
      if (notificationId) {
        await db.Notification.update(
          {
            inAppStatus: 'failed',
            inAppError: error.message
          },
          { where: { id: notificationId } }
        );
      }
      
      throw error;
    }
  }

  /**
   * Send bulk notification
   * @param {Object} data - Bulk data
   * @returns {Promise<Object>} Result
   */
  async sendBulkNotification(data) {
    const {
      userIds,
      type,
      title,
      message,
      data: notificationData,
      channel = 'all',
      priority = 'medium',
      batchSize = 100
    } = data;
    
    logger.info(`Sending bulk notification to ${userIds.length} users`);
    
    try {
      const results = {
        total: userIds.length,
        processed: 0,
        successful: 0,
        failed: 0,
        details: []
      };
      
      // Process in batches
      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        
        for (const userId of batch) {
          try {
            let result;
            
            // Send based on channel
            switch (channel) {
              case 'email':
                result = await this.sendEmailNotification({
                  to: await this.getUserEmail(userId),
                  subject: title,
                  template: type,
                  templateData: notificationData,
                  userId,
                  priority
                });
                break;
                
              case 'sms':
                result = await this.sendSMSNotification({
                  to: await this.getUserPhone(userId),
                  message: `${title}: ${message}`,
                  userId,
                  priority
                });
                break;
                
              case 'push':
                result = await this.sendPushNotification({
                  userId,
                  title,
                  body: message,
                  data: notificationData,
                  priority
                });
                break;
                
              case 'inapp':
                result = await this.sendInAppNotification({
                  userId,
                  type,
                  title,
                  message,
                  data: notificationData,
                  priority
                });
                break;
                
              case 'all':
                // Send via all channels
                const channelResults = [];
                
                // Email
                try {
                  const emailResult = await this.sendEmailNotification({
                    to: await this.getUserEmail(userId),
                    subject: title,
                    template: type,
                    templateData: notificationData,
                    userId,
                    priority
                  });
                  channelResults.push({ channel: 'email', ...emailResult });
                } catch (emailError) {
                  channelResults.push({ channel: 'email', success: false, error: emailError.message });
                }
                
                // SMS
                try {
                  const smsResult = await this.sendSMSNotification({
                    to: await this.getUserPhone(userId),
                    message: `${title}: ${message}`,
                    userId,
                    priority
                  });
                  channelResults.push({ channel: 'sms', ...smsResult });
                } catch (smsError) {
                  channelResults.push({ channel: 'sms', success: false, error: smsError.message });
                }
                
                // Push
                try {
                  const pushResult = await this.sendPushNotification({
                    userId,
                    title,
                    body: message,
                    data: notificationData,
                    priority
                  });
                  channelResults.push({ channel: 'push', ...pushResult });
                } catch (pushError) {
                  channelResults.push({ channel: 'push', success: false, error: pushError.message });
                }
                
                // In-app
                try {
                  const inAppResult = await this.sendInAppNotification({
                    userId,
                    type,
                    title,
                    message,
                    data: notificationData,
                    priority
                  });
                  channelResults.push({ channel: 'inapp', ...inAppResult });
                } catch (inAppError) {
                  channelResults.push({ channel: 'inapp', success: false, error: inAppError.message });
                }
                
                result = {
                  success: channelResults.some(r => r.success),
                  channelResults
                };
                break;
                
              default:
                throw new Error(`Unsupported channel: ${channel}`);
            }
            
            results.processed++;
            results.successful++;
            results.details.push({
              userId,
              success: true,
              result
            });
            
          } catch (error) {
            logger.error(`Failed to send notification to user ${userId}:`, error);
            results.processed++;
            results.failed++;
            results.details.push({
              userId,
              success: false,
              error: error.message
            });
          }
        }
        
        // Log progress
        logger.info(`Bulk notification progress: ${results.processed}/${results.total}`);
      }
      
      // Log bulk notification completion
      await this.logBulkNotification({
        type,
        title,
        channel,
        priority,
        results,
        timestamp: new Date()
      });
      
      return {
        success: results.failed === 0,
        type: 'bulk',
        channel,
        results,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Bulk notification failed:', error);
      throw error;
    }
  }

  /**
   * Send notification digest
   * @param {Object} data - Digest data
   * @returns {Promise<Object>} Result
   */
  async sendNotificationDigest(data) {
    const { userId, frequency = 'daily' } = data;
    
    logger.info(`Sending ${frequency} notification digest to user ${userId}`);
    
    try {
      // Get user's notification preferences
      const preferences = await this.getUserNotificationPreferences(userId);
      
      if (!preferences.digestEnabled) {
        return {
          success: true,
          skipped: true,
          reason: 'Digest disabled by user',
          timestamp: new Date()
        };
      }
      
      // Get unread notifications for the period
      const period = this.getDigestPeriod(frequency);
      const notifications = await this.getUnreadNotifications(userId, period);
      
      if (notifications.length === 0) {
        return {
          success: true,
          skipped: true,
          reason: 'No unread notifications',
          timestamp: new Date()
        };
      }
      
      // Group notifications by type
      const groupedNotifications = this.groupNotificationsByType(notifications);
      
      // Prepare digest content
      const digestContent = {
        frequency,
        period,
        totalNotifications: notifications.length,
        groupedNotifications,
        summary: this.generateDigestSummary(notifications)
      };
      
      // Send digest via preferred channel
      let result;
      
      switch (preferences.digestChannel) {
        case 'email':
          result = await this.sendEmailNotification({
            to: await this.getUserEmail(userId),
            subject: `Your ${frequency} StaySpot Digest`,
            template: 'notification_digest',
            templateData: digestContent,
            userId,
            priority: 'low'
          });
          break;
          
        case 'inapp':
          result = await this.sendInAppNotification({
            userId,
            type: 'digest',
            title: `Your ${frequency} Digest`,
            message: `You have ${notifications.length} unread notifications`,
            data: digestContent,
            priority: 'low'
          });
          break;
          
        default:
          throw new Error(`Unsupported digest channel: ${preferences.digestChannel}`);
      }
      
      // Mark notifications as included in digest
      await this.markNotificationsAsDigested(notifications.map(n => n.id));
      
      return {
        success: true,
        type: 'digest',
        frequency,
        notifications: notifications.length,
        result,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error(`Failed to send ${frequency} digest to user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Cleanup old notifications
   * @param {Object} data - Cleanup data
   * @returns {Promise<Object>} Result
   */
  async cleanupOldNotifications(data) {
    const { daysOld = 90, limit = 1000 } = data;
    
    logger.info(`Cleaning up notifications older than ${daysOld} days`);
    
    try {
      const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
      
      // Archive old notifications
      const archived = await db.Notification.update(
        {
          status: 'archived',
          archivedAt: new Date()
        },
        {
          where: {
            status: 'read',
            readAt: { [db.Sequelize.Op.lt]: cutoffDate },
            archivedAt: null
          },
          limit
        }
      );
      
      // Delete very old archived notifications
      const deleteCutoff = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 1 year
      const deleted = await db.Notification.destroy({
        where: {
          status: 'archived',
          archivedAt: { [db.Sequelize.Op.lt]: deleteCutoff }
        },
        limit: Math.floor(limit / 2)
      });
      
      // Cleanup notification delivery logs
      const logsDeleted = await db.NotificationDelivery.destroy({
        where: {
          sentAt: { [db.Sequelize.Op.lt]: cutoffDate }
        },
        limit
      });
      
      return {
        success: true,
        archived: archived[0],
        deleted,
        logsDeleted,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Failed to cleanup old notifications:', error);
      throw error;
    }
  }

  /**
   * Helper methods
   */
  
  async getUserPushTokens(userId) {
    const tokens = await db.PushToken.findAll({
      where: { userId, isActive: true },
      attributes: ['token']
    });
    
    return tokens.map(t => t.token);
  }

  async removeInvalidPushToken(userId, token) {
    await db.PushToken.update(
      { isActive: false, deactivatedAt: new Date() },
      { where: { userId, token } }
    );
    
    logger.info(`Removed invalid push token for user ${userId}`);
  }

  async getUserEmail(userId) {
    const user = await db.User.findByPk(userId, {
      attributes: ['email']
    });
    
    return user?.email;
  }

  async getUserPhone(userId) {
    const user = await db.User.findByPk(userId, {
      attributes: ['phone']
    });
    
    return user?.phone;
  }

  async getUserNotificationPreferences(userId) {
    const preferences = await db.UserPreference.findOne({
      where: { userId },
      attributes: ['notificationPreferences']
    });
    
    const defaultPreferences = {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      inAppEnabled: true,
      digestEnabled: true,
      digestChannel: 'email',
      digestFrequency: 'daily'
    };
    
    return preferences?.notificationPreferences || defaultPreferences;
  }

  getDigestPeriod(frequency) {
    const now = new Date();
    const start = new Date();
    
    switch (frequency) {
      case 'daily':
        start.setDate(now.getDate() - 1);
        break;
      case 'weekly':
        start.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        start.setMonth(now.getMonth() - 1);
        break;
      default:
        start.setDate(now.getDate() - 1);
    }
    
    return { start, end: now };
  }

  async getUnreadNotifications(userId, period) {
    return await db.Notification.findAll({
      where: {
        userId,
        status: 'unread',
        sentAt: {
          [db.Sequelize.Op.between]: [period.start, period.end]
        }
      },
      order: [['sentAt', 'DESC']],
      limit: 50
    });
  }

  groupNotificationsByType(notifications) {
    const groups = {};
    
    notifications.forEach(notification => {
      const type = notification.type;
      
      if (!groups[type]) {
        groups[type] = {
          count: 0,
          notifications: []
        };
      }
      
      groups[type].count++;
      groups[type].notifications.push({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        sentAt: notification.sentAt
      });
    });
    
    return groups;
  }

  generateDigestSummary(notifications) {
    const summary = {
      total: notifications.length,
      byPriority: {
        high: 0,
        medium: 0,
        low: 0
      },
      importantCount: 0
    };
    
    notifications.forEach(notification => {
      summary.byPriority[notification.priority] = 
        (summary.byPriority[notification.priority] || 0) + 1;
      
      if (notification.priority === 'high') {
        summary.importantCount++;
      }
    });
    
    return summary;
  }

  async markNotificationsAsDigested(notificationIds) {
    await db.Notification.update(
      {
        includedInDigest: true,
        digestIncludedAt: new Date()
      },
      {
        where: {
          id: { [db.Sequelize.Op.in]: notificationIds }
        }
      }
    );
  }

  async logNotificationDelivery(data) {
    try {
      await db.NotificationDelivery.create(data);
    } catch (error) {
      logger.error('Failed to log notification delivery:', error);
    }
  }

  async logPushDelivery(data) {
    try {
      await db.PushDelivery.create(data);
    } catch (error) {
      logger.error('Failed to log push delivery:', error);
    }
  }

  async logBulkNotification(data) {
    try {
      await db.BulkNotification.create(data);
    } catch (error) {
      logger.error('Failed to log bulk notification:', error);
    }
  }

  handleJobFailure(job, error) {
    logger.error(`Notification job ${job.id} failed:`, error);
    
    // Send alert for critical failures
    if (job.data.priority === 'high') {
      const triggers = require('../utils/automation/triggers');
      triggers.trigger('system.error', {
        errorCode: 'NOTIFICATION_FAILED',
        errorMessage: `High priority notification failed: ${error.message}`,
        component: 'notification-worker',
        severity: 'high'
      });
    }
  }

  handleJobSuccess(job, result) {
    logger.info(`Notification job ${job.id} completed successfully`);
    
    // Update metrics
    this.updateNotificationMetrics(result);
  }

  updateNotificationMetrics(result) {
    // Update notification metrics in Redis or database
    // This would track delivery rates, response times, etc.
  }

  /**
   * Get queue statistics
   * @returns {Promise<Object>} Queue stats
   */
  async getStats() {
    const counts = await this.queue.getJobCounts();
    const workers = await this.queue.getWorkers();
    
    return {
      queue: 'notification-processing',
      counts,
      workers: workers.length,
      isPaused: await this.queue.isPaused(),
      timestamp: new Date()
    };
  }

  /**
   * Pause queue processing
   */
  async pause() {
    await this.queue.pause();
    logger.info('Notification worker queue paused');
  }

  /**
   * Resume queue processing
   */
  async resume() {
    await this.queue.resume();
    logger.info('Notification worker queue resumed');
  }

  /**
   * Cleanup old jobs
   * @param {number} daysOld - Remove jobs older than this many days
   */
  async cleanupOldJobs(daysOld = 7) {
    const cutoff = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    
    // Cleanup completed jobs
    await this.queue.clean(cutoff, 'completed');
    
    // Cleanup failed jobs (keep for 30 days)
    const failedCutoff = Date.now() - (30 * 24 * 60 * 60 * 1000);
    await this.queue.clean(failedCutoff, 'failed');
    
    logger.info(`Cleaned up notification jobs older than ${daysOld} days`);
  }

  /**
   * Get notification delivery statistics
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Delivery stats
   */
  async getDeliveryStats(filters = {}) {
    const {
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      endDate = new Date(),
      type = null,
      channel = null
    } = filters;
    
    const where = {
      sentAt: {
        [db.Sequelize.Op.between]: [startDate, endDate]
      }
    };
    
    if (type) where.type = type;
    if (channel) where.channel = channel;
    
    const stats = await db.NotificationDelivery.findAll({
      where,
      attributes: [
        'status',
        'channel',
        [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count'],
        [db.Sequelize.fn('AVG', db.Sequelize.literal('TIMESTAMPDIFF(SECOND, createdAt, sentAt)')), 'avgDeliveryTime']
      ],
      group: ['status', 'channel']
    });
    
    return {
      period: { startDate, endDate },
      filters: { type, channel },
      stats,
      timestamp: new Date()
    };
  }
}

// Create singleton instance
const notificationWorker = new NotificationWorker();

module.exports = notificationWorker;