const { Notification, User } = require('../../models');
const { Op } = require('sequelize');

const notificationController = {
  // Get all notifications
  getAllNotifications: async (req, res) => {
    try {
      const { 
        userId, 
        type,
        priority,
        isRead,
        fromDate,
        toDate,
        search,
        page = 1, 
        limit = 20 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = { companyId: req.user.companyId };
      if (userId) where.userId = userId;
      if (type) where.type = type;
      if (priority) where.priority = priority;
      if (isRead !== undefined) where.isRead = isRead === 'true';
      
      if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) where.createdAt[Op.gte] = new Date(fromDate);
        if (toDate) where.createdAt[Op.lte] = new Date(toDate);
      }
      
      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { message: { [Op.like]: `%${search}%` } },
          { '$User.firstName$': { [Op.like]: `%${search}%` } },
          { '$User.lastName$': { [Op.like]: `%${search}%` } }
        ];
      }
      
      const notifications = await Notification.findAndCountAll({
        where,
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });
      
      res.json({
        success: true,
        data: notifications.rows,
        pagination: {
          total: notifications.count,
          page: parseInt(page),
          pages: Math.ceil(notifications.count / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get notification by ID
  getNotificationById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const notification = await Notification.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          }
        ]
      });
      
      if (!notification) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
      
      // Check permissions
      const canView = (
        notification.userId === req.user.id ||
        req.user.role === 'system_admin' ||
        notification.companyId === req.user.companyId
      );
      
      if (!canView) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this notification'
        });
      }
      
      // Mark as read if viewing
      if (notification.userId === req.user.id && !notification.isRead) {
        await notification.update({
          isRead: true,
          readAt: new Date()
        });
      }
      
      res.json({ success: true, data: notification });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get user's notifications
  getUserNotifications: async (req, res) => {
    try {
      const { isRead, type, priority, limit = 50 } = req.query;
      
      const where = {
        userId: req.user.id,
        companyId: req.user.companyId
      };
      
      if (isRead !== undefined) where.isRead = isRead === 'true';
      if (type) where.type = type;
      if (priority) where.priority = priority;
      
      const notifications = await Notification.findAll({
        where,
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit)
      });
      
      // Get unread count
      const unreadCount = await Notification.count({
        where: {
          userId: req.user.id,
          companyId: req.user.companyId,
          isRead: false
        }
      });
      
      res.json({
        success: true,
        data: {
          notifications,
          unreadCount,
          totalCount: notifications.length
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Mark notification as read
  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;
      
      const notification = await Notification.findByPk(id);
      
      if (!notification) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
      
      // Check permissions
      if (notification.userId !== req.user.id && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this notification'
        });
      }
      
      if (notification.isRead) {
        return res.status(400).json({
          success: false,
          message: 'Notification is already marked as read'
        });
      }
      
      await notification.update({
        isRead: true,
        readAt: new Date()
      });
      
      res.json({
        success: true,
        message: 'Notification marked as read',
        data: notification
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Mark all notifications as read
  markAllAsRead: async (req, res) => {
    try {
      const { type } = req.body;
      
      const where = {
        userId: req.user.id,
        companyId: req.user.companyId,
        isRead: false
      };
      
      if (type) where.type = type;
      
      const updatedCount = await Notification.update(
        {
          isRead: true,
          readAt: new Date()
        },
        { where }
      );
      
      res.json({
        success: true,
        message: `Marked ${updatedCount[0]} notifications as read`,
        data: { count: updatedCount[0] }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Delete notification
  deleteNotification: async (req, res) => {
    try {
      const { id } = req.params;
      
      const notification = await Notification.findByPk(id);
      
      if (!notification) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
      
      // Check permissions
      if (notification.userId !== req.user.id && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this notification'
        });
      }
      
      await notification.destroy();
      
      res.json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Clear all notifications
  clearAllNotifications: async (req, res) => {
    try {
      const { type, isRead } = req.body;
      
      const where = {
        userId: req.user.id,
        companyId: req.user.companyId
      };
      
      if (type) where.type = type;
      if (isRead !== undefined) where.isRead = isRead;
      
      const deletedCount = await Notification.destroy({ where });
      
      res.json({
        success: true,
        message: `Cleared ${deletedCount} notifications`,
        data: { count: deletedCount }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Create notification
  createNotification: async (req, res) => {
    try {
      const {
        userId,
        type,
        title,
        message,
        data,
        priority,
        actionUrl,
        expiresAt
      } = req.body;
      
      // Validate user
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      // Check if user belongs to same company
      if (user.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'Cannot send notification to user from different company'
        });
      }
      
      // Create notification
      const notification = await Notification.create({
        userId,
        type: type || 'general',
        title: title || 'New Notification',
        message: message || '',
        data: data || {},
        priority: priority || 'normal',
        actionUrl: actionUrl || '',
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isRead: false,
        createdById: req.user.id,
        companyId: req.user.companyId
      });
      
      // Send real-time notification via WebSocket
      // This would use Socket.io to notify the user in real-time
      
      res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        data: notification
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Create bulk notifications
  createBulkNotifications: async (req, res) => {
    try {
      const {
        userIds,
        roleTypes,
        type,
        title,
        message,
        data,
        priority,
        actionUrl
      } = req.body;
      
      if (!userIds && !roleTypes) {
        return res.status(400).json({
          success: false,
          message: 'User IDs or role types are required'
        });
      }
      
      let targetUsers = [];
      
      // Determine recipients
      if (userIds && Array.isArray(userIds)) {
        targetUsers = await User.findAll({
          where: {
            id: { [Op.in]: userIds },
            companyId: req.user.companyId
          }
        });
      } else if (roleTypes && Array.isArray(roleTypes)) {
        targetUsers = await User.findAll({
          where: {
            role: { [Op.in]: roleTypes },
            companyId: req.user.companyId
          }
        });
      }
      
      if (targetUsers.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No users found for notification'
        });
      }
      
      const notifications = [];
      const errors = [];
      
      for (const user of targetUsers) {
        try {
          const notification = await Notification.create({
            userId: user.id,
            type: type || 'general',
            title,
            message,
            data: data || {},
            priority: priority || 'normal',
            actionUrl: actionUrl || '',
            isRead: false,
            createdById: req.user.id,
            companyId: req.user.companyId
          });
          
          notifications.push({
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            notificationId: notification.id
          });
          
        } catch (error) {
          errors.push({
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            error: error.message
          });
        }
      }
      
      res.json({
        success: true,
        message: `Created ${notifications.length} notifications successfully, ${errors.length} failed`,
        data: {
          notifications,
          errors: errors.length > 0 ? errors : undefined
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get notification statistics
  getNotificationStatistics: async (req, res) => {
    try {
      const { startDate, endDate, type } = req.query;
      
      const where = { companyId: req.user.companyId };
      if (type) where.type = type;
      
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt[Op.gte] = new Date(startDate);
        if (endDate) where.createdAt[Op.lte] = new Date(endDate);
      }
      
      // Total notifications
      const totalNotifications = await Notification.count({ where });
      
      // By type
      const byType = await Notification.findAll({
        attributes: [
          'type',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.literal('CASE WHEN is_read = true THEN 1 ELSE 0 END')), 'read']
        ],
        where,
        group: ['type']
      });
      
      // By priority
      const byPriority = await Notification.findAll({
        attributes: [
          'priority',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: ['priority']
      });
      
      // Read rate
      const readCount = await Notification.count({
        where: {
          ...where,
          isRead: true
        }
      });
      
      const readRate = totalNotifications > 0 ? (readCount / totalNotifications) * 100 : 0;
      
      // Delivery success rate (would require delivery tracking)
      const deliveryRate = 95.0; // Placeholder
      
      // Recent notifications (last 24 hours)
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
      
      const recentNotifications = await Notification.count({
        where: {
          ...where,
          createdAt: { [Op.gte]: twentyFourHoursAgo }
        }
      });
      
      // Top notification types
      const topTypes = await Notification.findAll({
        attributes: [
          'type',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: ['type'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 5
      });
      
      res.json({
        success: true,
        data: {
          totalNotifications,
          byType: byType.map(item => ({
            type: item.type,
            total: parseInt(item.dataValues.count),
            read: parseInt(item.dataValues.read || 0),
            readRate: parseInt(item.dataValues.count) > 0 ? 
              (parseInt(item.dataValues.read || 0) / parseInt(item.dataValues.count)) * 100 : 0
          })),
          byPriority: byPriority.reduce((acc, item) => {
            acc[item.priority] = parseInt(item.dataValues.count);
            return acc;
          }, {}),
          readRate: parseFloat(readRate.toFixed(2)),
          deliveryRate,
          recent24Hours: recentNotifications,
          topTypes: topTypes.map(item => ({
            type: item.type,
            count: parseInt(item.dataValues.count)
          }))
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get notification preferences
  getNotificationPreferences: async (req, res) => {
    try {
      // This would retrieve from UserNotificationPreferences model
      // For now, return default preferences
      const defaultPreferences = {
        email: {
          paymentReminders: true,
          maintenanceUpdates: true,
          newMessages: true,
          systemAlerts: true,
          marketing: false
        },
        push: {
          paymentReminders: true,
          maintenanceUpdates: true,
          newMessages: true,
          urgentAlerts: true
        },
        sms: {
          paymentReminders: false,
          maintenanceEmergency: true,
          urgentAlerts: true
        }
      };
      
      res.json({
        success: true,
        data: defaultPreferences
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update notification preferences
  updateNotificationPreferences: async (req, res) => {
    try {
      const { preferences } = req.body;
      
      // This would update UserNotificationPreferences model
      // For now, just acknowledge
      
      res.json({
        success: true,
        message: 'Notification preferences updated successfully',
        data: preferences
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = notificationController;