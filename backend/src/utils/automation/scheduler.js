const cron = require('node-cron');
const { Op } = require('sequelize');
const logger = require('../../config/logger');
const db = require('../../models');
const workflowEngine = require('./workflow.engine');
const triggers = require('./triggers');
const {
  TaskStatus,
  PaymentStatus,
  MaintenanceStatus,
  InvoiceStatus
} = require('../constants/status');
const DateHelper = require('../helpers/date.helper');

class AutomationScheduler {
  constructor() {
    this.jobs = new Map();
    this.initializeScheduledJobs();
  }

  /**
   * Initialize all scheduled jobs
   */
  initializeScheduledJobs() {
    // Daily maintenance jobs (runs at 2 AM daily)
    this.scheduleJob('daily_maintenance', '0 2 * * *', async () => {
      await this.executeDailyMaintenance();
    });

    // Payment reminder jobs (runs at 9 AM daily)
    this.scheduleJob('payment_reminders', '0 9 * * *', async () => {
      await this.sendPaymentReminders();
    });

    // Overdue task check (runs every hour)
    this.scheduleJob('overdue_tasks', '0 * * * *', async () => {
      await this.checkOverdueTasks();
    });

    // Maintenance follow-up (runs every 6 hours)
    this.scheduleJob('maintenance_followup', '0 */6 * * *', async () => {
      await this.followUpMaintenanceRequests();
    });

    // Weekly reporting (runs every Monday at 6 AM)
    this.scheduleJob('weekly_reports', '0 6 * * 1', async () => {
      await this.generateWeeklyReports();
    });

    // Monthly billing (runs on 1st of every month at 12 AM)
    this.scheduleJob('monthly_billing', '0 0 1 * *', async () => {
      await this.processMonthlyBilling();
    });

    // Data cleanup (runs at 3 AM daily)
    this.scheduleJob('data_cleanup', '0 3 * * *', async () => {
      await this.cleanupOldData();
    });

    // Market data sync (runs every 4 hours)
    this.scheduleJob('market_data_sync', '0 */4 * * *', async () => {
      await this.syncMarketData();
    });

    // System health check (runs every 30 minutes)
    this.scheduleJob('health_check', '*/30 * * * *', async () => {
      await this.performSystemHealthCheck();
    });

    // Expired invitation cleanup (runs at 4 AM daily)
    this.scheduleJob('invitation_cleanup', '0 4 * * *', async () => {
      await this.cleanupExpiredInvitations();
    });

    logger.info('Scheduled jobs initialized');
  }

  /**
   * Schedule a job
   * @param {string} jobName - Job identifier
   * @param {string} cronExpression - Cron expression
   * @param {Function} task - Task function
   */
  scheduleJob(jobName, cronExpression, task) {
    const job = cron.schedule(cronExpression, async () => {
      try {
        logger.info(`Starting scheduled job: ${jobName}`);
        await task();
        logger.info(`Completed scheduled job: ${jobName}`);
      } catch (error) {
        logger.error(`Scheduled job failed: ${jobName}`, error);
      }
    });

    this.jobs.set(jobName, job);
    logger.info(`Job scheduled: ${jobName} (${cronExpression})`);
  }

  /**
   * Start all scheduled jobs
   */
  start() {
    for (const [jobName, job] of this.jobs) {
      job.start();
      logger.info(`Job started: ${jobName}`);
    }
  }

  /**
   * Stop all scheduled jobs
   */
  stop() {
    for (const [jobName, job] of this.jobs) {
      job.stop();
      logger.info(`Job stopped: ${jobName}`);
    }
  }

  /**
   * Execute daily maintenance tasks
   */
  async executeDailyMaintenance() {
    try {
      logger.info('Executing daily maintenance tasks');
      
      // 1. Update property statuses
      await this.updatePropertyStatuses();
      
      // 2. Check for expired leases
      await this.checkExpiredLeases();
      
      // 3. Update vacancy rates
      await this.updateVacancyRates();
      
      // 4. Generate daily activity report
      await this.generateDailyReport();
      
      // 5. Trigger daily system workflow
      await workflowEngine.handleTrigger('system.daily', {
        timestamp: new Date(),
        tasks: ['status_updates', 'lease_checks', 'report_generation']
      });
      
      logger.info('Daily maintenance tasks completed');
    } catch (error) {
      logger.error('Daily maintenance failed:', error);
      throw error;
    }
  }

  /**
   * Send payment reminders
   */
  async sendPaymentReminders() {
    try {
      logger.info('Sending payment reminders');
      
      const today = new Date();
      const threeDaysFromNow = DateHelper.addDays(today, 3);
      const oneWeekFromNow = DateHelper.addDays(today, 7);
      
      // Find upcoming due payments
      const upcomingPayments = await db.Payment.findAll({
        where: {
          status: PaymentStatus.PENDING,
          dueDate: {
            [Op.between]: [today, oneWeekFromNow]
          }
        },
        include: [
          { model: db.Tenant, include: [{ model: db.User }] },
          { model: db.Property }
        ]
      });
      
      let remindersSent = 0;
      
      for (const payment of upcomingPayments) {
        try {
          const daysUntilDue = DateHelper.daysBetween(today, payment.dueDate);
          
          // Determine reminder type based on days until due
          let reminderType = 'upcoming';
          if (daysUntilDue <= 3) {
            reminderType = 'urgent';
          } else if (daysUntilDue <= 7) {
            reminderType = 'warning';
          }
          
          // Send reminder
          await this.sendPaymentReminder(payment, reminderType);
          remindersSent++;
          
          // Update payment record
          await payment.update({
            lastReminderSent: today,
            reminderCount: (payment.reminderCount || 0) + 1
          });
          
          logger.info(`Payment reminder sent for payment ${payment.id}`);
        } catch (error) {
          logger.error(`Failed to send reminder for payment ${payment.id}:`, error);
        }
      }
      
      // Trigger payment reminder workflow
      await workflowEngine.handleTrigger('payment.due', {
        timestamp: today,
        paymentCount: upcomingPayments.length,
        remindersSent
      });
      
      logger.info(`Payment reminders sent: ${remindersSent}/${upcomingPayments.length}`);
    } catch (error) {
      logger.error('Payment reminder sending failed:', error);
      throw error;
    }
  }

  /**
   * Check for overdue tasks
   */
  async checkOverdueTasks() {
    try {
      logger.info('Checking for overdue tasks');
      
      const now = new Date();
      const overdueTasks = await db.Task.findAll({
        where: {
          status: {
            [Op.in]: [TaskStatus.PENDING, TaskStatus.ASSIGNED, TaskStatus.IN_PROGRESS]
          },
          dueDate: {
            [Op.lt]: now
          }
        },
        include: [
          { model: db.User, as: 'assignee' },
          { model: db.Property }
        ]
      });
      
      let overdueCount = 0;
      
      for (const task of overdueTasks) {
        try {
          // Mark task as overdue
          await task.update({
            status: TaskStatus.OVERDUE,
            overdueSince: now
          });
          
          // Notify assignee and manager
          await this.notifyOverdueTask(task);
          overdueCount++;
          
          // Trigger overdue task workflow
          await workflowEngine.handleTrigger('task.overdue', {
            taskId: task.id,
            assigneeId: task.assigneeId,
            propertyId: task.propertyId,
            overdueBy: now - task.dueDate
          });
          
          logger.info(`Task ${task.id} marked as overdue`);
        } catch (error) {
          logger.error(`Failed to process overdue task ${task.id}:`, error);
        }
      }
      
      logger.info(`Overdue tasks found: ${overdueCount}`);
    } catch (error) {
      logger.error('Overdue task check failed:', error);
      throw error;
    }
  }

  /**
   * Follow up on maintenance requests
   */
  async followUpMaintenanceRequests() {
    try {
      logger.info('Following up on maintenance requests');
      
      const twoDaysAgo = DateHelper.addDays(new Date(), -2);
      
      const pendingRequests = await db.MaintenanceRequest.findAll({
        where: {
          status: {
            [Op.in]: [MaintenanceStatus.SUBMITTED, MaintenanceStatus.REVIEWED]
          },
          createdAt: {
            [Op.lt]: twoDaysAgo
          }
        },
        include: [
          { model: db.Property },
          { model: db.Tenant, include: [{ model: db.User }] }
        ]
      });
      
      let followupsSent = 0;
      
      for (const request of pendingRequests) {
        try {
          // Send follow-up notification
          await this.sendMaintenanceFollowUp(request);
          followupsSent++;
          
          // Update request
          await request.update({
            lastFollowUp: new Date(),
            followUpCount: (request.followUpCount || 0) + 1
          });
          
          logger.info(`Follow-up sent for maintenance request ${request.id}`);
        } catch (error) {
          logger.error(`Failed to send follow-up for request ${request.id}:`, error);
        }
      }
      
      logger.info(`Maintenance follow-ups sent: ${followupsSent}`);
    } catch (error) {
      logger.error('Maintenance follow-up failed:', error);
      throw error;
    }
  }

  /**
   * Generate weekly reports
   */
  async generateWeeklyReports() {
    try {
      logger.info('Generating weekly reports');
      
      const weekStart = DateHelper.addDays(new Date(), -7);
      const weekEnd = new Date();
      
      // Generate various reports
      const reports = {
        financial: await this.generateFinancialReport(weekStart, weekEnd),
        occupancy: await this.generateOccupancyReport(weekStart, weekEnd),
        maintenance: await this.generateMaintenanceReport(weekStart, weekEnd),
        performance: await this.generatePerformanceReport(weekStart, weekEnd)
      };
      
      // Send reports to appropriate users
      await this.distributeWeeklyReports(reports);
      
      // Trigger weekly reporting workflow
      await workflowEngine.handleTrigger('system.weekly', {
        timestamp: new Date(),
        reportPeriod: { weekStart, weekEnd },
        reportsGenerated: Object.keys(reports).length
      });
      
      logger.info('Weekly reports generated and distributed');
    } catch (error) {
      logger.error('Weekly report generation failed:', error);
      throw error;
    }
  }

  /**
   * Process monthly billing
   */
  async processMonthlyBilling() {
    try {
      logger.info('Processing monthly billing');
      
      const today = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      
      // 1. Generate rent invoices for all active leases
      const invoicesGenerated = await this.generateMonthlyRentInvoices();
      
      // 2. Process recurring payments
      const paymentsProcessed = await this.processRecurringPayments();
      
      // 3. Generate owner statements
      const statementsGenerated = await this.generateOwnerStatements();
      
      // 4. Send billing notifications
      await this.sendBillingNotifications();
      
      // Trigger monthly billing workflow
      await workflowEngine.handleTrigger('system.monthly', {
        timestamp: today,
        month,
        year,
        invoicesGenerated,
        paymentsProcessed,
        statementsGenerated
      });
      
      logger.info(`Monthly billing completed: ${invoicesGenerated} invoices, ${paymentsProcessed} payments`);
    } catch (error) {
      logger.error('Monthly billing failed:', error);
      throw error;
    }
  }

  /**
   * Cleanup old data
   */
  async cleanupOldData() {
    try {
      logger.info('Cleaning up old data');
      
      const thirtyDaysAgo = DateHelper.addDays(new Date(), -30);
      const ninetyDaysAgo = DateHelper.addDays(new Date(), -90);
      const oneYearAgo = DateHelper.addDays(new Date(), -365);
      
      // 1. Archive old audit logs (older than 1 year)
      const archivedAuditLogs = await this.archiveOldAuditLogs(oneYearAgo);
      
      // 2. Cleanup temporary files (older than 7 days)
      const cleanedFiles = await this.cleanupTemporaryFiles(DateHelper.addDays(new Date(), -7));
      
      // 3. Remove old notifications (older than 30 days)
      const removedNotifications = await this.removeOldNotifications(thirtyDaysAgo);
      
      // 4. Archive completed tasks (older than 90 days)
      const archivedTasks = await this.archiveCompletedTasks(ninetyDaysAgo);
      
      logger.info(`Data cleanup completed: ${archivedAuditLogs} audit logs, ${cleanedFiles} files, ${removedNotifications} notifications, ${archivedTasks} tasks`);
    } catch (error) {
      logger.error('Data cleanup failed:', error);
      throw error;
    }
  }

  /**
   * Sync market data
   */
  async syncMarketData() {
    try {
      logger.info('Syncing market data');
      
      // Fetch latest market data from external APIs
      const marketData = await this.fetchMarketData();
      
      // Update property valuations
      const valuationsUpdated = await this.updatePropertyValuations(marketData);
      
      // Update rental rates
      const ratesUpdated = await this.updateRentalRates(marketData);
      
      // Store market data for analytics
      await this.storeMarketData(marketData);
      
      logger.info(`Market data synced: ${valuationsUpdated} valuations, ${ratesUpdated} rates updated`);
    } catch (error) {
      logger.error('Market data sync failed:', error);
      // Don't throw error - market data sync failure shouldn't stop other jobs
    }
  }

  /**
   * Perform system health check
   */
  async performSystemHealthCheck() {
    try {
      logger.info('Performing system health check');
      
      const health = {
        timestamp: new Date(),
        database: await this.checkDatabaseHealth(),
        redis: await this.checkRedisHealth(),
        externalApis: await this.checkExternalApis(),
        diskSpace: await this.checkDiskSpace(),
        memoryUsage: await this.checkMemoryUsage()
      };
      
      // Log health status
      await this.logHealthStatus(health);
      
      // Alert if any issues
      if (!health.database.healthy || !health.redis.healthy) {
        await this.sendHealthAlert(health);
      }
      
      logger.info('System health check completed');
    } catch (error) {
      logger.error('Health check failed:', error);
    }
  }

  /**
   * Cleanup expired invitations
   */
  async cleanupExpiredInvitations() {
    try {
      logger.info('Cleaning up expired invitations');
      
      const expiredInvitations = await db.Invitation.update(
        { status: 'expired' },
        {
          where: {
            status: 'pending',
            expiresAt: {
              [Op.lt]: new Date()
            }
          }
        }
      );
      
      logger.info(`Expired invitations cleaned up: ${expiredInvitations[0]}`);
    } catch (error) {
      logger.error('Invitation cleanup failed:', error);
    }
  }

  /**
   * Helper methods for specific tasks
   */
  async updatePropertyStatuses() {
    // Update properties based on various conditions
    const updated = await db.Property.update(
      { status: 'inactive' },
      {
        where: {
          status: 'active',
          lastUpdated: {
            [Op.lt]: DateHelper.addDays(new Date(), -90)
          }
        }
      }
    );
    
    return updated[0];
  }

  async checkExpiredLeases() {
    const expiredLeases = await db.Lease.update(
      { status: 'expired' },
      {
        where: {
          status: 'active',
          endDate: {
            [Op.lt]: new Date()
          }
        }
      }
    );
    
    return expiredLeases[0];
  }

  async updateVacancyRates() {
    // Calculate and update vacancy rates for all properties
    const properties = await db.Property.findAll();
    
    for (const property of properties) {
      const occupiedUnits = await db.Unit.count({
        where: {
          propertyId: property.id,
          status: 'occupied'
        }
      });
      
      const totalUnits = await db.Unit.count({
        where: { propertyId: property.id }
      });
      
      const vacancyRate = totalUnits > 0 ? (1 - (occupiedUnits / totalUnits)) * 100 : 0;
      
      await property.update({
        vacancyRate,
        lastVacancyUpdate: new Date()
      });
    }
    
    return properties.length;
  }

  async generateDailyReport() {
    const today = new Date();
    const yesterday = DateHelper.addDays(today, -1);
    
    const report = {
      date: today,
      newProperties: await db.Property.count({
        where: {
          createdAt: {
            [Op.between]: [yesterday, today]
          }
        }
      }),
      newTenants: await db.Tenant.count({
        where: {
          createdAt: {
            [Op.between]: [yesterday, today]
          }
        }
      }),
      maintenanceRequests: await db.MaintenanceRequest.count({
        where: {
          createdAt: {
            [Op.between]: [yesterday, today]
          }
        }
      }),
      paymentsReceived: await db.Payment.count({
        where: {
          status: 'completed',
          paidDate: {
            [Op.between]: [yesterday, today]
          }
        }
      })
    };
    
    // Store report in database
    await db.DailyReport.create(report);
    
    return report;
  }

  async sendPaymentReminder(payment, reminderType) {
    // Implementation for sending payment reminder
    // This would integrate with email/SMS service
    const emailService = require('../services/communication/email.service');
    
    await emailService.sendPaymentReminder({
      to: payment.Tenant.User.email,
      tenantName: `${payment.Tenant.User.firstName} ${payment.Tenant.User.lastName}`,
      amount: payment.amount,
      dueDate: payment.dueDate,
      propertyAddress: payment.Property.address,
      reminderType
    });
  }

  async notifyOverdueTask(task) {
    // Send notification about overdue task
    const notificationService = require('../services/communication/notification.service');
    
    await notificationService.send({
      userId: task.assigneeId,
      type: 'task_overdue',
      title: 'Task Overdue',
      message: `Task "${task.title}" is overdue`,
      data: {
        taskId: task.id,
        propertyId: task.propertyId,
        dueDate: task.dueDate
      }
    });
  }

  async sendMaintenanceFollowUp(request) {
    // Send follow-up for maintenance request
    const emailService = require('../services/communication/email.service');
    
    await emailService.sendMaintenanceFollowUp({
      to: request.Tenant.User.email,
      tenantName: `${request.Tenant.User.firstName} ${request.Tenant.User.lastName}`,
      requestId: request.id,
      description: request.description,
      submittedDate: request.createdAt
    });
  }

  async generateFinancialReport(startDate, endDate) {
    const transactions = await db.Transaction.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        }
      }
    });
    
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    return {
      period: { startDate, endDate },
      income,
      expenses,
      netProfit: income - expenses,
      transactionCount: transactions.length
    };
  }

  async generateOccupancyReport(startDate, endDate) {
    const properties = await db.Property.findAll({
      include: [{
        model: db.Unit,
        include: [{
          model: db.Lease,
          where: {
            [Op.or]: [
              {
                startDate: { [Op.lte]: endDate },
                endDate: { [Op.gte]: startDate }
              },
              {
                startDate: { [Op.between]: [startDate, endDate] }
              },
              {
                endDate: { [Op.between]: [startDate, endDate] }
              }
            ]
          },
          required: false
        }]
      }]
    });
    
    let totalUnits = 0;
    let occupiedUnits = 0;
    
    properties.forEach(property => {
      property.Units.forEach(unit => {
        totalUnits++;
        if (unit.Leases && unit.Leases.length > 0) {
          occupiedUnits++;
        }
      });
    });
    
    const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
    
    return {
      totalProperties: properties.length,
      totalUnits,
      occupiedUnits,
      vacantUnits: totalUnits - occupiedUnits,
      occupancyRate
    };
  }

  async generateMaintenanceReport(startDate, endDate) {
    const requests = await db.MaintenanceRequest.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      }
    });
    
    const byStatus = requests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {});
    
    const byPriority = requests.reduce((acc, request) => {
      acc[request.priority] = (acc[request.priority] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalRequests: requests.length,
      byStatus,
      byPriority,
      averageResolutionTime: this.calculateAverageResolutionTime(requests)
    };
  }

  async generatePerformanceReport(startDate, endDate) {
    // Generate performance metrics report
    return {
      period: { startDate, endDate },
      metrics: {
        responseTime: await this.calculateAverageResponseTime(startDate, endDate),
        taskCompletionRate: await this.calculateTaskCompletionRate(startDate, endDate),
        tenantSatisfaction: await this.calculateTenantSatisfaction(startDate, endDate),
        revenueGrowth: await this.calculateRevenueGrowth(startDate, endDate)
      }
    };
  }

  async distributeWeeklyReports(reports) {
    // Send reports to company admins and portfolio managers
    const recipients = await db.User.findAll({
      where: {
        roleId: {
          [Op.in]: ['company_admin', 'portfolio_manager']
        }
      }
    });
    
    for (const recipient of recipients) {
      await this.sendReportToUser(recipient, reports);
    }
  }

  async generateMonthlyRentInvoices() {
    const activeLeases = await db.Lease.findAll({
      where: { status: 'active' },
      include: [
        { model: db.Tenant, include: [{ model: db.User }] },
        { model: db.Unit, include: [{ model: db.Property }] }
      ]
    });
    
    let invoicesGenerated = 0;
    
    for (const lease of activeLeases) {
      try {
        await this.createRentInvoice(lease);
        invoicesGenerated++;
      } catch (error) {
        logger.error(`Failed to create invoice for lease ${lease.id}:`, error);
      }
    }
    
    return invoicesGenerated;
  }

  async processRecurringPayments() {
    // Process automatic recurring payments
    const recurringPayments = await db.RecurringPayment.findAll({
      where: {
        isActive: true,
        nextPaymentDate: {
          [Op.lte]: new Date()
        }
      },
      include: [{ model: db.Tenant, include: [{ model: db.User }] }]
    });
    
    let processed = 0;
    
    for (const payment of recurringPayments) {
      try {
        await this.processAutomaticPayment(payment);
        
        // Update next payment date
        const nextDate = this.calculateNextPaymentDate(payment);
        await payment.update({ nextPaymentDate: nextDate });
        
        processed++;
      } catch (error) {
        logger.error(`Failed to process recurring payment ${payment.id}:`, error);
      }
    }
    
    return processed;
  }

  async generateOwnerStatements() {
    const owners = await db.User.findAll({
      where: { roleId: 'landlord' },
      include: [{ model: db.Property }]
    });
    
    let statementsGenerated = 0;
    
    for (const owner of owners) {
      if (owner.Properties && owner.Properties.length > 0) {
        await this.createOwnerStatement(owner);
        statementsGenerated++;
      }
    }
    
    return statementsGenerated;
  }

  async sendBillingNotifications() {
    // Send billing notifications to all relevant parties
    // Implementation would integrate with notification system
  }

  async archiveOldAuditLogs(cutoffDate) {
    const result = await db.AuditLog.update(
      { isArchived: true },
      {
        where: {
          createdAt: { [Op.lt]: cutoffDate },
          isArchived: false
        }
      }
    );
    
    return result[0];
  }

  async cleanupTemporaryFiles(cutoffDate) {
    const fileHelper = require('../helpers/file.helper');
    const tempDir = path.join(__dirname, '../../../uploads/temp');
    
    return await fileHelper.cleanupOldFiles(tempDir, 7); // Cleanup files older than 7 days
  }

  async removeOldNotifications(cutoffDate) {
    const result = await db.Notification.destroy({
      where: {
        createdAt: { [Op.lt]: cutoffDate },
        status: 'read'
      }
    });
    
    return result;
  }

  async archiveCompletedTasks(cutoffDate) {
    const result = await db.Task.update(
      { isArchived: true },
      {
        where: {
          status: 'completed',
          completedAt: { [Op.lt]: cutoffDate },
          isArchived: false
        }
      }
    );
    
    return result[0];
  }

  async fetchMarketData() {
    // Fetch market data from external APIs
    // This is a placeholder - actual implementation would call real APIs
    return {
      timestamp: new Date(),
      averageRent: 2500,
      occupancyRate: 0.95,
      marketTrend: 'stable'
    };
  }

  async updatePropertyValuations(marketData) {
    // Update property valuations based on market data
    const properties = await db.Property.findAll();
    
    for (const property of properties) {
      const newValuation = this.calculatePropertyValuation(property, marketData);
      await property.update({ marketValue: newValuation });
    }
    
    return properties.length;
  }

  async updateRentalRates(marketData) {
    // Update suggested rental rates based on market data
    const properties = await db.Property.findAll();
    
    for (const property of properties) {
      const suggestedRate = this.calculateSuggestedRent(property, marketData);
      await property.update({ suggestedRent: suggestedRate });
    }
    
    return properties.length;
  }

  async storeMarketData(marketData) {
    await db.MarketData.create(marketData);
  }

  async checkDatabaseHealth() {
    try {
      await db.sequelize.authenticate();
      return { healthy: true, message: 'Database connection OK' };
    } catch (error) {
      return { healthy: false, message: `Database connection failed: ${error.message}` };
    }
  }

  async checkRedisHealth() {
    try {
      const redis = require('../../config/redis');
      await redis.ping();
      return { healthy: true, message: 'Redis connection OK' };
    } catch (error) {
      return { healthy: false, message: `Redis connection failed: ${error.message}` };
    }
  }

  async checkExternalApis() {
    // Check health of external APIs (payment gateway, email service, etc.)
    const apis = [
      { name: 'Payment Gateway', url: process.env.PAYMENT_GATEWAY_URL },
      { name: 'Email Service', url: process.env.EMAIL_SERVICE_URL },
      { name: 'SMS Service', url: process.env.SMS_SERVICE_URL }
    ];
    
    const results = [];
    
    for (const api of apis) {
      if (api.url) {
        try {
          const response = await fetch(api.url, { method: 'HEAD', timeout: 5000 });
          results.push({ name: api.name, healthy: response.ok });
        } catch (error) {
          results.push({ name: api.name, healthy: false, error: error.message });
        }
      }
    }
    
    return results;
  }

  async checkDiskSpace() {
    const fs = require('fs');
    const os = require('os');
    
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const usagePercentage = (used / total) * 100;
    
    return {
      total: this.formatBytes(total),
      used: this.formatBytes(used),
      free: this.formatBytes(free),
      usagePercentage: usagePercentage.toFixed(2),
      healthy: usagePercentage < 90
    };
  }

  async checkMemoryUsage() {
    const used = process.memoryUsage();
    
    return {
      rss: this.formatBytes(used.rss),
      heapTotal: this.formatBytes(used.heapTotal),
      heapUsed: this.formatBytes(used.heapUsed),
      external: this.formatBytes(used.external),
      healthy: used.heapUsed / used.heapTotal < 0.8
    };
  }

  async logHealthStatus(health) {
    await db.SystemHealth.create(health);
  }

  async sendHealthAlert(health) {
    // Send alert to system administrators
    const emailService = require('../services/communication/email.service');
    
    await emailService.sendHealthAlert({
      to: process.env.SYSTEM_ADMIN_EMAIL,
      subject: 'System Health Alert',
      healthStatus: health
    });
  }

  // Utility methods
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  calculateAverageResolutionTime(requests) {
    const completedRequests = requests.filter(r => r.status === 'completed' && r.completedAt);
    
    if (completedRequests.length === 0) return 0;
    
    const totalTime = completedRequests.reduce((sum, request) => {
      return sum + (new Date(request.completedAt) - new Date(request.createdAt));
    }, 0);
    
    return totalTime / completedRequests.length / (1000 * 60 * 60); // Convert to hours
  }

  calculatePropertyValuation(property, marketData) {
    // Simple valuation logic
    const baseValue = property.size?.area * marketData.averageRent * 0.01;
    return Math.round(baseValue);
  }

  calculateSuggestedRent(property, marketData) {
    // Simple rent calculation
    const baseRent = property.size?.area * 2; // $2 per sqft
    return Math.round(baseRent * (marketData.averageRent / 2500)); // Adjust based on market average
  }

  calculateNextPaymentDate(payment) {
    const date = new Date();
    
    switch (payment.frequency) {
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'biweekly':
        date.setDate(date.getDate() + 14);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }
    
    return date;
  }

  async sendReportToUser(user, reports) {
    // Send report to user via email
    const emailService = require('../services/communication/email.service');
    
    await emailService.sendWeeklyReport({
      to: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      reports
    });
  }

  async createRentInvoice(lease) {
    // Create rent invoice in database
    const invoiceNumber = `INV-${Date.now()}-${lease.id}`;
    
    await db.Invoice.create({
      invoiceNumber,
      leaseId: lease.id,
      tenantId: lease.tenantId,
      propertyId: lease.Unit.propertyId,
      amount: lease.monthlyRent,
      dueDate: this.calculateRentDueDate(),
      items: [{
        description: `Rent for ${lease.Unit.Property.name} - ${lease.Unit.unitNumber}`,
        quantity: 1,
        unitPrice: lease.monthlyRent,
        total: lease.monthlyRent
      }]
    });
  }

  calculateRentDueDate() {
    const date = new Date();
    date.setDate(1); // First of next month
    date.setMonth(date.getMonth() + 1);
    return date;
  }

  async processAutomaticPayment(payment) {
    // Process automatic payment through payment gateway
    const paymentService = require('../services/financial/payment.service');
    
    await paymentService.processRecurringPayment({
      paymentId: payment.id,
      amount: payment.amount,
      tenantId: payment.tenantId,
      paymentMethodId: payment.paymentMethodId
    });
  }

  async createOwnerStatement(owner) {
    // Generate owner statement
    const statementNumber = `STMT-${Date.now()}-${owner.id}`;
    
    await db.OwnerStatement.create({
      statementNumber,
      ownerId: owner.id,
      periodStart: DateHelper.addDays(new Date(), -30),
      periodEnd: new Date(),
      properties: owner.Properties.map(p => p.id),
      totalIncome: await this.calculateOwnerIncome(owner.id),
      totalExpenses: await this.calculateOwnerExpenses(owner.id),
      netAmount: await this.calculateOwnerNetAmount(owner.id)
    });
  }

  async calculateOwnerIncome(ownerId) {
    const payments = await db.Payment.findAll({
      include: [{
        model: db.Property,
        where: { ownerId }
      }],
      where: {
        status: 'completed',
        paidDate: {
          [Op.between]: [DateHelper.addDays(new Date(), -30), new Date()]
        }
      }
    });
    
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  }

  async calculateOwnerExpenses(ownerId) {
    const expenses = await db.Transaction.findAll({
      include: [{
        model: db.Property,
        where: { ownerId }
      }],
      where: {
        type: 'expense',
        date: {
          [Op.between]: [DateHelper.addDays(new Date(), -30), new Date()]
        }
      }
    });
    
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  async calculateOwnerNetAmount(ownerId) {
    const income = await this.calculateOwnerIncome(ownerId);
    const expenses = await this.calculateOwnerExpenses(ownerId);
    return income - expenses;
  }

  async calculateAverageResponseTime(startDate, endDate) {
    const requests = await db.MaintenanceRequest.findAll({
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },
        firstResponseAt: { [Op.not]: null }
      }
    });
    
    if (requests.length === 0) return 0;
    
    const totalResponseTime = requests.reduce((sum, request) => {
      return sum + (new Date(request.firstResponseAt) - new Date(request.createdAt));
    }, 0);
    
    return totalResponseTime / requests.length / (1000 * 60); // Convert to minutes
  }

  async calculateTaskCompletionRate(startDate, endDate) {
    const totalTasks = await db.Task.count({
      where: {
        createdAt: { [Op.between]: [startDate, endDate] }
      }
    });
    
    const completedTasks = await db.Task.count({
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },
        status: 'completed'
      }
    });
    
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  }

  async calculateTenantSatisfaction(startDate, endDate) {
    const surveys = await db.SurveyResponse.findAll({
      where: {
        submittedAt: { [Op.between]: [startDate, endDate] }
      }
    });
    
    if (surveys.length === 0) return 0;
    
    const totalScore = surveys.reduce((sum, survey) => sum + survey.satisfactionScore, 0);
    return totalScore / surveys.length;
  }

  async calculateRevenueGrowth(startDate, endDate) {
    const previousPeriodStart = DateHelper.addDays(startDate, -30);
    const previousPeriodEnd = DateHelper.addDays(endDate, -30);
    
    const currentRevenue = await this.calculateTotalRevenue(startDate, endDate);
    const previousRevenue = await this.calculateTotalRevenue(previousPeriodStart, previousPeriodEnd);
    
    if (previousRevenue === 0) return currentRevenue > 0 ? 100 : 0;
    
    return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  }

  async calculateTotalRevenue(startDate, endDate) {
    const payments = await db.Payment.findAll({
      where: {
        status: 'completed',
        paidDate: { [Op.between]: [startDate, endDate] }
      }
    });
    
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  }
}

// Create singleton instance
const scheduler = new AutomationScheduler();

module.exports = scheduler;