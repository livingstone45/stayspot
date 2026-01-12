const { User, Company, SystemLog, Backup } = require('../../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../../services/communication/email.service');
const { createNotification } = require('../../services/communication/notification.service');

const systemController = {
  // Get system config
  getSystemConfig: async (req, res) => {
    try {
      res.json({ config: 'System configuration', status: 'ok' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update system config
  updateSystemConfig: async (req, res) => {
    try {
      res.json({ message: 'Config updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get system status
  getSystemStatus: async (req, res) => {
    try {
      res.json({ status: 'operational', uptime: process.uptime() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get system health
  getSystemHealth: async (req, res) => {
    try {
      res.json({ health: 'healthy', timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create backup
  createBackup: async (req, res) => {
    try {
      res.json({ message: 'Backup initiated' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get system overview
  getSystemOverview: async (req, res) => {
    try {
      // Get total counts
      const totalUsers = await User.count({ 
        where: { companyId: req.user.companyId } 
      });
      
      const totalCompanies = await Company.count();
      
      // Get active users (last 24 hours)
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
      
      const activeUsers = await User.count({
        where: {
          companyId: req.user.companyId,
          lastLoginAt: { [Op.gte]: twentyFourHoursAgo }
        }
      });
      
      // Get system logs (errors in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const errorLogs = await SystemLog.count({
        where: {
          companyId: req.user.companyId,
          level: 'error',
          createdAt: { [Op.gte]: sevenDaysAgo }
        }
      });
      
      // Get recent backups
      const recentBackups = await Backup.findAll({
        where: { companyId: req.user.companyId },
        order: [['createdAt', 'DESC']],
        limit: 5
      });
      
      // Get system performance metrics
      const performanceMetrics = await getSystemPerformance();
      
      // Get disk usage (simulated)
      const diskUsage = {
        total: 100, // GB
        used: 45, // GB
        free: 55 // GB
      };
      
      // Get memory usage (simulated)
      const memoryUsage = {
        total: 16, // GB
        used: 8.5, // GB
        free: 7.5 // GB
      };
      
      res.json({
        success: true,
        data: {
          overview: {
            totalUsers,
            totalCompanies,
            activeUsers,
            activeSessions: 0, // Would come from session store
            errorLogs
          },
          performance: performanceMetrics,
          resources: {
            disk: diskUsage,
            memory: memoryUsage,
            databaseSize: '2.5 GB' // Simulated
          },
          recentBackups,
          systemHealth: calculateSystemHealth(
            errorLogs,
            performanceMetrics,
            diskUsage,
            memoryUsage
          )
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get system settings
  getSystemSettings: async (req, res) => {
    try {
      // This would come from SystemSettings model
      const settings = {
        general: {
          siteName: 'StaySpot',
          siteUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
          timezone: 'America/New_York',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          language: 'en',
          maintenanceMode: false
        },
        security: {
          require2FA: false,
          sessionTimeout: 24, // hours
          maxLoginAttempts: 5,
          passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true
          }
        },
        email: {
          smtpHost: process.env.SMTP_HOST || '',
          smtpPort: process.env.SMTP_PORT || '',
          fromEmail: process.env.FROM_EMAIL || '',
          fromName: 'StaySpot System'
        },
        notifications: {
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          notifyOnError: true,
          notifyOnMaintenance: true
        },
        backup: {
          autoBackup: true,
          backupFrequency: 'daily',
          backupTime: '02:00',
          keepBackups: 30, // days
          backupLocation: 'local' // local, s3, google_drive
        },
        api: {
          enableApi: true,
          apiRateLimit: 100, // requests per minute
          apiKeyExpiration: 90, // days
          webhookTimeout: 10 // seconds
        }
      };
      
      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update system settings
  updateSystemSettings: async (req, res) => {
    try {
      const { category, settings } = req.body;
      
      if (!category || !settings) {
        return res.status(400).json({
          success: false,
          message: 'Category and settings are required'
        });
      }
      
      // Validate permissions (only system admin)
      if (req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'Only system administrators can update system settings'
        });
      }
      
      const validCategories = [
        'general', 'security', 'email', 
        'notifications', 'backup', 'api'
      ];
      
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
        });
      }
      
      // This would update SystemSettings model
      // For now, just acknowledge
      
      // Log setting change
      await SystemLog.create({
        level: 'info',
        category: 'system_settings',
        message: `System settings updated: ${category}`,
        data: {
          updatedBy: req.user.id,
          category,
          changes: settings
        },
        companyId: req.user.companyId,
        createdById: req.user.id
      });
      
      res.json({
        success: true,
        message: 'System settings updated successfully',
        data: { category, settings }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get system logs
  getSystemLogs: async (req, res) => {
    try {
      const { 
        level, 
        category,
        userId,
        startDate,
        endDate,
        search,
        page = 1, 
        limit = 50 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = { companyId: req.user.companyId };
      if (level) where.level = level;
      if (category) where.category = category;
      if (userId) where.userId = userId;
      
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt[Op.gte] = new Date(startDate);
        if (endDate) where.createdAt[Op.lte] = new Date(endDate);
      }
      
      if (search) {
        where[Op.or] = [
          { message: { [Op.like]: `%${search}%` } },
          { ipAddress: { [Op.like]: `%${search}%` } },
          { userAgent: { [Op.like]: `%${search}%` } }
        ];
      }
      
      const logs = await SystemLog.findAndCountAll({
        where,
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });
      
      // Get log statistics
      const logStats = await getLogStatistics(where);
      
      res.json({
        success: true,
        data: {
          logs: logs.rows,
          statistics: logStats,
          pagination: {
            total: logs.count,
            page: parseInt(page),
            pages: Math.ceil(logs.count / limit),
            limit: parseInt(limit)
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Clear system logs
  clearSystemLogs: async (req, res) => {
    try {
      const { level, category, olderThan } = req.body;
      
      // Validate permissions (only system admin)
      if (req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'Only system administrators can clear system logs'
        });
      }
      
      const where = { companyId: req.user.companyId };
      if (level) where.level = level;
      if (category) where.category = category;
      
      if (olderThan) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(olderThan));
        where.createdAt = { [Op.lt]: cutoffDate };
      }
      
      const deletedCount = await SystemLog.destroy({ where });
      
      // Log the clearance
      await SystemLog.create({
        level: 'info',
        category: 'system_logs',
        message: `Cleared ${deletedCount} system logs`,
        data: {
          clearedBy: req.user.id,
          filters: { level, category, olderThan }
        },
        companyId: req.user.companyId,
        createdById: req.user.id
      });
      
      res.json({
        success: true,
        message: `Cleared ${deletedCount} system logs`,
        data: { count: deletedCount }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Create backup
  createBackup: async (req, res) => {
    try {
      const { type, description } = req.body;
      
      // Validate permissions
      if (req.user.role !== 'system_admin' && req.user.role !== 'company_admin') {
        return res.status(403).json({
          success: false,
          message: 'Only administrators can create backups'
        });
      }
      
      const validTypes = ['full', 'database', 'files', 'config'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Invalid backup type. Must be one of: ${validTypes.join(', ')}`
        });
      }
      
      // Generate backup filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `backup-${type}-${timestamp}`;
      
      // Create backup record
      const backup = await Backup.create({
        name: backupName,
        type,
        description: description || '',
        status: 'in_progress',
        size: 0,
        location: 'local',
        createdById: req.user.id,
        companyId: req.user.companyId
      });
      
      // Start backup process (asynchronous)
      processBackup(backup, type);
      
      res.status(201).json({
        success: true,
        message: 'Backup started successfully',
        data: {
          backupId: backup.id,
          backupName,
          status: 'in_progress'
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get backup by ID
  getBackupById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const backup = await Backup.findByPk(id, {
        include: [
          {
            model: User,
            as: 'CreatedBy',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });
      
      if (!backup) {
        return res.status(404).json({ success: false, message: 'Backup not found' });
      }
      
      // Check permissions
      if (backup.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this backup'
        });
      }
      
      res.json({ success: true, data: backup });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Download backup
  downloadBackup: async (req, res) => {
    try {
      const { id } = req.params;
      
      const backup = await Backup.findByPk(id);
      
      if (!backup) {
        return res.status(404).json({ success: false, message: 'Backup not found' });
      }
      
      // Check permissions
      if (backup.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to download this backup'
        });
      }
      
      if (backup.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: `Backup is ${backup.status}. Cannot download.`
        });
      }
      
      if (!backup.filePath) {
        return res.status(400).json({
          success: false,
          message: 'Backup file not found'
        });
      }
      
      // This would stream the backup file
      // For now, return file info
      
      res.json({
        success: true,
        data: {
          backup,
          downloadUrl: `/api/system/backups/${id}/file`, // This would be a separate endpoint
          expiresAt: new Date(Date.now() + 3600000) // 1 hour
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Restore from backup
  restoreBackup: async (req, res) => {
    try {
      const { id } = req.params;
      const { confirmation } = req.body;
      
      if (confirmation !== 'I understand this will overwrite current data') {
        return res.status(400).json({
          success: false,
          message: 'Confirmation phrase is required and must match exactly'
        });
      }
      
      // Validate permissions (only system admin)
      if (req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'Only system administrators can restore from backups'
        });
      }
      
      const backup = await Backup.findByPk(id);
      
      if (!backup) {
        return res.status(404).json({ success: false, message: 'Backup not found' });
      }
      
      if (backup.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: `Backup is ${backup.status}. Cannot restore.`
        });
      }
      
      // Update backup status
      await backup.update({
        status: 'restoring',
        restoredAt: new Date(),
        restoredById: req.user.id
      });
      
      // Start restore process (asynchronous)
      processRestore(backup);
      
      // Log the restoration
      await SystemLog.create({
        level: 'warning',
        category: 'backup',
        message: 'System restore initiated from backup',
        data: {
          backupId: backup.id,
          backupName: backup.name,
          restoredBy: req.user.id
        },
        companyId: req.user.companyId,
        createdById: req.user.id
      });
      
      res.json({
        success: true,
        message: 'Restore process started. System may be unavailable during restoration.',
        data: {
          backupId: backup.id,
          status: 'restoring',
          estimatedTime: '10-30 minutes'
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Delete backup
  deleteBackup: async (req, res) => {
    try {
      const { id } = req.params;
      const { permanent } = req.query;
      
      const backup = await Backup.findByPk(id);
      
      if (!backup) {
        return res.status(404).json({ success: false, message: 'Backup not found' });
      }
      
      // Check permissions
      if (backup.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this backup'
        });
      }
      
      if (permanent === 'true') {
        // Delete file from storage
        // await deleteBackupFile(backup.filePath);
        
        // Delete record
        await backup.destroy();
      } else {
        // Mark as deleted
        await backup.update({
          status: 'deleted',
          deletedAt: new Date(),
          deletedBy: req.user.id
        });
      }
      
      res.json({
        success: true,
        message: `Backup ${permanent === 'true' ? 'permanently deleted' : 'marked as deleted'} successfully`
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get backup statistics
  getBackupStatistics: async (req, res) => {
    try {
      const where = { companyId: req.user.companyId };
      
      // Total backups
      const totalBackups = await Backup.count({ where });
      
      // By status
      const byStatus = await Backup.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('size')), 'totalSize']
        ],
        where,
        group: ['status']
      });
      
      // By type
      const byType = await Backup.findAll({
        attributes: [
          'type',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: ['type']
      });
      
      // Recent backups
      const recentBackups = await Backup.findAll({
        where,
        attributes: ['id', 'name', 'type', 'status', 'size', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 10
      });
      
      // Storage usage
      const storageResult = await Backup.findOne({
        where: {
          ...where,
          status: 'completed'
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('size')), 'totalStorageUsed']
        ]
      });
      
      const totalStorageUsed = parseFloat(storageResult?.dataValues.totalStorageUsed || 0);
      
      // Backup success rate (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentBackupStats = await Backup.findAll({
        where: {
          ...where,
          createdAt: { [Op.gte]: thirtyDaysAgo }
        },
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
          [sequelize.fn('SUM', sequelize.literal('CASE WHEN status = "completed" THEN 1 ELSE 0 END')), 'successful']
        ]
      });
      
      const recentTotal = parseInt(recentBackupStats[0]?.dataValues.total || 0);
      const recentSuccessful = parseInt(recentBackupStats[0]?.dataValues.successful || 0);
      const successRate = recentTotal > 0 ? (recentSuccessful / recentTotal) * 100 : 0;
      
      res.json({
        success: true,
        data: {
          totalBackups,
          byStatus: byStatus.map(item => ({
            status: item.status,
            count: parseInt(item.dataValues.count),
            totalSize: parseFloat(item.dataValues.totalSize || 0)
          })),
          byType: byType.map(item => ({
            type: item.type,
            count: parseInt(item.dataValues.count)
          })),
          recentBackups,
          storage: {
            totalUsed: totalStorageUsed,
            estimatedCost: calculateStorageCost(totalStorageUsed)
          },
          successRate: parseFloat(successRate.toFixed(2)),
          lastSuccessfulBackup: recentBackups.find(b => b.status === 'completed')?.createdAt || null
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get API keys
  getApiKeys: async (req, res) => {
    try {
      const { userId, status, page = 1, limit = 20 } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = { companyId: req.user.companyId };
      if (userId) where.userId = userId;
      if (status) where.status = status;
      
      // This would query from ApiKey model
      // For now, return empty array
      const apiKeys = [];
      const totalKeys = 0;
      
      res.json({
        success: true,
        data: apiKeys,
        pagination: {
          total: totalKeys,
          page: parseInt(page),
          pages: Math.ceil(totalKeys / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Create API key
  createApiKey: async (req, res) => {
    try {
      const { name, permissions, expiresAt } = req.body;
      
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'API key name is required'
        });
      }
      
      // Generate API key
      const apiKey = generateApiKey();
      const apiSecret = generateApiSecret();
      
      // Hash the secret for storage
      const hashedSecret = await bcrypt.hash(apiSecret, 10);
      
      // This would create in ApiKey model
      // For now, return the generated key
      
      res.status(201).json({
        success: true,
        message: 'API key created successfully',
        data: {
          apiKey,
          apiSecret, // Only shown once
          name,
          permissions: permissions || ['read'],
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          createdAt: new Date()
        },
        warning: 'Save the API secret now. It will not be shown again.'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Revoke API key
  revokeApiKey: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      // This would update ApiKey model
      // For now, just acknowledge
      
      res.json({
        success: true,
        message: 'API key revoked successfully',
        data: { id, revokedAt: new Date(), reason }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Run system diagnostics
  runDiagnostics: async (req, res) => {
    try {
      // Validate permissions (only system admin)
      if (req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'Only system administrators can run diagnostics'
        });
      }
      
      const diagnostics = {
        timestamp: new Date(),
        checks: []
      };
      
      // Check database connection
      try {
        await sequelize.authenticate();
        diagnostics.checks.push({
          name: 'Database Connection',
          status: 'healthy',
          message: 'Database connection successful',
          duration: 0 // Would measure actual time
        });
      } catch (error) {
        diagnostics.checks.push({
          name: 'Database Connection',
          status: 'failed',
          message: error.message,
          error: error.toString()
        });
      }
      
      // Check Redis connection (if used)
      // Check external services
      // Check disk space
      // Check memory usage
      // Check cron jobs
      // Check email service
      // Check file storage
      
      // Overall status
      const failedChecks = diagnostics.checks.filter(c => c.status === 'failed');
      diagnostics.status = failedChecks.length === 0 ? 'healthy' : 'issues';
      diagnostics.failedChecks = failedChecks.length;
      diagnostics.totalChecks = diagnostics.checks.length;
      
      // Log diagnostics run
      await SystemLog.create({
        level: diagnostics.status === 'healthy' ? 'info' : 'warning',
        category: 'system_diagnostics',
        message: `System diagnostics: ${diagnostics.status}`,
        data: diagnostics,
        companyId: req.user.companyId,
        createdById: req.user.id
      });
      
      res.json({
        success: true,
        message: `Diagnostics completed: ${diagnostics.status}`,
        data: diagnostics
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Clear cache
  clearCache: async (req, res) => {
    try {
      const { cacheType } = req.body;
      
      // Validate permissions
      if (req.user.role !== 'system_admin' && req.user.role !== 'company_admin') {
        return res.status(403).json({
          success: false,
          message: 'Only administrators can clear cache'
        });
      }
      
      const validCacheTypes = ['all', 'database', 'redis', 'memory', 'file'];
      if (cacheType && !validCacheTypes.includes(cacheType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid cache type. Must be one of: ${validCacheTypes.join(', ')}`
        });
      }
      
      // Clear cache based on type
      let clearedItems = 0;
      let message = '';
      
      switch (cacheType) {
        case 'database':
          // Clear query cache
          clearedItems = 100; // Example
          message = 'Database query cache cleared';
          break;
        case 'redis':
          // Clear Redis cache
          clearedItems = 500; // Example
          message = 'Redis cache cleared';
          break;
        case 'all':
          // Clear all caches
          clearedItems = 1000; // Example
          message = 'All caches cleared';
          break;
        default:
          clearedItems = 200; // Example
          message = 'Cache cleared';
      }
      
      // Log cache clearance
      await SystemLog.create({
        level: 'info',
        category: 'system_cache',
        message,
        data: {
          cacheType: cacheType || 'default',
          clearedItems,
          clearedBy: req.user.id
        },
        companyId: req.user.companyId,
        createdById: req.user.id
      });
      
      res.json({
        success: true,
        message,
        data: {
          cacheType: cacheType || 'default',
          clearedItems,
          timestamp: new Date()
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Helper functions
async function getSystemPerformance() {
  // Get system performance metrics
  return {
    responseTime: 125, // ms average
    uptime: 99.8, // percentage
    requestsPerMinute: 150,
    errorRate: 0.2, // percentage
    databaseQueries: 45 // per second
  };
}

function calculateSystemHealth(errorLogs, performance, diskUsage, memoryUsage) {
  let score = 100;
  
  // Deduct for errors
  if (errorLogs > 10) score -= 10;
  else if (errorLogs > 5) score -= 5;
  else if (errorLogs > 0) score -= 2;
  
  // Deduct for performance issues
  if (performance.responseTime > 500) score -= 15;
  else if (performance.responseTime > 200) score -= 10;
  else if (performance.responseTime > 100) score -= 5;
  
  if (performance.uptime < 99.5) score -= 20;
  else if (performance.uptime < 99.9) score -= 10;
  
  // Deduct for resource issues
  const diskUsagePercent = (diskUsage.used / diskUsage.total) * 100;
  if (diskUsagePercent > 90) score -= 15;
  else if (diskUsagePercent > 80) score -= 10;
  else if (diskUsagePercent > 70) score -= 5;
  
  const memoryUsagePercent = (memoryUsage.used / memoryUsage.total) * 100;
  if (memoryUsagePercent > 90) score -= 15;
  else if (memoryUsagePercent > 80) score -= 10;
  else if (memoryUsagePercent > 70) score -= 5;
  
  // Determine status
  let status = 'healthy';
  if (score < 70) status = 'critical';
  else if (score < 80) status = 'warning';
  else if (score < 90) status = 'degraded';
  
  return {
    score: Math.max(0, Math.min(100, score)),
    status,
    lastUpdated: new Date()
  };
}

async function getLogStatistics(where) {
  // Get log statistics
  const levels = await SystemLog.findAll({
    attributes: [
      'level',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    where,
    group: ['level']
  });
  
  const categories = await SystemLog.findAll({
    attributes: [
      'category',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    where,
    group: ['category'],
    order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
    limit: 10
  });
  
  // Recent errors (last 24 hours)
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
  
  const recentErrors = await SystemLog.count({
    where: {
      ...where,
      level: 'error',
      createdAt: { [Op.gte]: twentyFourHoursAgo }
    }
  });
  
  return {
    byLevel: levels.reduce((acc, item) => {
      acc[item.level] = parseInt(item.dataValues.count);
      return acc;
    }, {}),
    byCategory: categories.map(item => ({
      category: item.category,
      count: parseInt(item.dataValues.count)
    })),
    recentErrors
  };
}

async function processBackup(backup, type) {
  // Simulate backup process
  setTimeout(async () => {
    try {
      // Simulate backup creation
      const backupSize = Math.floor(Math.random() * 1000) + 100; // MB
      
      await backup.update({
        status: 'completed',
        size: backupSize,
        filePath: `/backups/${backup.name}.zip`,
        completedAt: new Date()
      });
      
      // Log backup completion
      await SystemLog.create({
        level: 'info',
        category: 'backup',
        message: `Backup completed: ${backup.name}`,
        data: {
          backupId: backup.id,
          type,
          size: backupSize
        },
        companyId: backup.companyId,
        createdById: backup.createdById
      });
      
    } catch (error) {
      await backup.update({
        status: 'failed',
        error: error.message
      });
    }
  }, 5000); // Simulate 5 second delay
}

async function processRestore(backup) {
  // Simulate restore process
  setTimeout(async () => {
    try {
      await backup.update({
        status: 'restored',
        restoredAt: new Date()
      });
      
      // Log restoration completion
      await SystemLog.create({
        level: 'info',
        category: 'backup',
        message: `System restored from backup: ${backup.name}`,
        data: {
          backupId: backup.id,
          restoredBy: backup.restoredById
        },
        companyId: backup.companyId,
        createdById: backup.restoredById
      });
      
    } catch (error) {
      await backup.update({
        status: 'restore_failed',
        error: error.message
      });
    }
  }, 30000); // Simulate 30 second delay
}

function calculateStorageCost(sizeInMB) {
  const sizeInGB = sizeInMB / 1024;
  const costPerGB = 0.023; // AWS S3 standard storage cost per GB
  return parseFloat((sizeInGB * costPerGB).toFixed(2));
}

function generateApiKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'sk_';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

function generateApiSecret() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = systemController;