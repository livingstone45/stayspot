const { User, Company, Portfolio, Property, AuditLog } = require('../../models');
const { uploadFile, deleteFile } = require('../../services/file/storage.service');
const { validateProfileUpdate } = require('../../utils/validators/user.validator');

/**
 * Profile Controller
 * Handles user profile operations
 */
class ProfileController {
  /**
   * Get Current User Profile
   */
  async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId, {
        attributes: { 
          exclude: ['password', 'refreshToken', 'passwordResetToken', 'passwordResetExpires'] 
        },
        include: [
          {
            model: Role,
            through: { attributes: [] },
            include: [{ model: Permission }]
          },
          { 
            model: Company,
            include: [{ 
              model: Portfolio,
              include: [{ model: Property }]
            }]
          },
          {
            model: Portfolio,
            as: 'AssignedPortfolios'
          },
          {
            model: Property,
            as: 'ManagedProperties',
            include: [{ model: Unit }]
          }
        ]
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Format response
      const userData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        roles: user.Roles.map(role => ({
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: role.Permissions.map(p => p.name)
        })),
        company: user.Company ? {
          id: user.Company.id,
          name: user.Company.name,
          logo: user.Company.logo,
          address: user.Company.address,
          phone: user.Company.phone,
          email: user.Company.email,
          website: user.Company.website,
          portfolios: user.Company.Portfolios
        } : null,
        assignedPortfolios: user.AssignedPortfolios,
        managedProperties: user.ManagedProperties,
        preferences: user.preferences || {},
        notifications: user.notifications || {},
        settings: user.settings || {},
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.json({
        success: true,
        data: userData
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update Profile
   */
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { error } = validateProfileUpdate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const { firstName, lastName, phone, preferences, notifications, settings } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Track changes for audit
      const changes = {};

      // Update basic info
      if (firstName !== undefined && firstName !== user.firstName) {
        changes.firstName = { from: user.firstName, to: firstName };
        user.firstName = firstName;
      }

      if (lastName !== undefined && lastName !== user.lastName) {
        changes.lastName = { from: user.lastName, to: lastName };
        user.lastName = lastName;
      }

      if (phone !== undefined && phone !== user.phone) {
        changes.phone = { from: user.phone, to: phone };
        user.phone = phone;
      }

      // Update preferences
      if (preferences !== undefined) {
        const currentPreferences = user.preferences || {};
        user.preferences = { ...currentPreferences, ...preferences };
        changes.preferences = { updated: Object.keys(preferences) };
      }

      // Update notifications
      if (notifications !== undefined) {
        const currentNotifications = user.notifications || {};
        user.notifications = { ...currentNotifications, ...notifications };
        changes.notifications = { updated: Object.keys(notifications) };
      }

      // Update settings
      if (settings !== undefined) {
        const currentSettings = user.settings || {};
        user.settings = { ...currentSettings, ...settings };
        changes.settings = { updated: Object.keys(settings) };
      }

      await user.save();

      // Create audit log if changes were made
      if (Object.keys(changes).length > 0) {
        await AuditLog.create({
          userId,
          action: 'PROFILE_UPDATED',
          details: 'User profile updated',
          ipAddress: req.ip,
          metadata: { changes }
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          preferences: user.preferences,
          notifications: user.notifications,
          settings: user.settings
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Upload Avatar
   */
  async uploadAvatar(req, res) {
    try {
      const userId = req.user.id;

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Delete old avatar if exists
      if (user.avatar) {
        try {
          await deleteFile(user.avatar);
        } catch (error) {
          console.warn('Failed to delete old avatar:', error);
        }
      }

      // Upload new avatar
      const uploadResult = await uploadFile(req.file, {
        folder: 'avatars',
        transformation: {
          width: 300,
          height: 300,
          crop: 'fill',
          gravity: 'face'
        }
      });

      user.avatar = uploadResult.url;
      await user.save();

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'AVATAR_UPLOADED',
        details: 'User avatar uploaded',
        ipAddress: req.ip,
        metadata: { avatarUrl: uploadResult.url }
      });

      res.json({
        success: true,
        message: 'Avatar uploaded successfully',
        data: {
          avatar: uploadResult.url
        }
      });
    } catch (error) {
      console.error('Upload avatar error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Remove Avatar
   */
  async removeAvatar(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.avatar) {
        return res.status(400).json({ error: 'No avatar to remove' });
      }

      // Delete file from storage
      try {
        await deleteFile(user.avatar);
      } catch (error) {
        console.warn('Failed to delete avatar file:', error);
      }

      user.avatar = null;
      await user.save();

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'AVATAR_REMOVED',
        details: 'User avatar removed',
        ipAddress: req.ip
      });

      res.json({
        success: true,
        message: 'Avatar removed successfully'
      });
    } catch (error) {
      console.error('Remove avatar error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get User Dashboard Stats
   */
  async getDashboardStats(req, res) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles;

      const user = await User.findByPk(userId, {
        include: [
          {
            model: Portfolio,
            as: 'AssignedPortfolios'
          },
          {
            model: Property,
            as: 'ManagedProperties'
          }
        ]
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const stats = {
        general: {
          properties: 0,
          units: 0,
          tenants: 0,
          activeLeases: 0
        },
        financial: {
          totalRevenue: 0,
          pendingPayments: 0,
          overduePayments: 0
        },
        maintenance: {
          openRequests: 0,
          assignedWorkOrders: 0,
          completedThisMonth: 0
        },
        tasks: {
          assigned: 0,
          overdue: 0,
          completedToday: 0
        }
      };

      // Get portfolio and property IDs for queries
      const portfolioIds = user.AssignedPortfolios.map(p => p.id);
      const propertyIds = user.ManagedProperties.map(p => p.id);

      // Get property count
      if (propertyIds.length > 0) {
        stats.general.properties = propertyIds.length;
        
        // Get unit count
        const units = await Unit.count({ 
          where: { propertyId: { [Op.in]: propertyIds } }
        });
        stats.general.units = units;

        // Get tenant count
        const tenants = await Tenant.count({
          include: [{
            model: Lease,
            where: { 
              status: 'active',
              propertyId: { [Op.in]: propertyIds }
            }
          }]
        });
        stats.general.tenants = tenants;

        // Get active leases count
        const activeLeases = await Lease.count({
          where: { 
            status: 'active',
            propertyId: { [Op.in]: propertyIds }
          }
        });
        stats.general.activeLeases = activeLeases;

        // Get financial stats (simplified - implement based on your Payment model)
        // stats.financial.totalRevenue = await Payment.sum('amount', {
        //   where: { 
        //     status: 'completed',
        //     propertyId: { [Op.in]: propertyIds }
        //   }
        // });

        // Get maintenance stats
        stats.maintenance.openRequests = await MaintenanceRequest.count({
          where: { 
            status: { [Op.in]: ['open', 'in_progress'] },
            propertyId: { [Op.in]: propertyIds }
          }
        });

        // Get task stats
        stats.tasks.assigned = await Task.count({
          where: { 
            assignedTo: userId,
            status: { [Op.in]: ['pending', 'in_progress'] }
          }
        });
      }

      // Get user-specific notifications
      const unreadNotifications = await Notification.count({
        where: { 
          userId,
          read: false
        }
      });

      // Get upcoming events/meetings
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const upcomingEvents = await Event.count({
        where: {
          [Op.or]: [
            { organizerId: userId },
            { participantIds: { [Op.contains]: [userId.toString()] } }
          ],
          startDate: { [Op.between]: [today, nextWeek] }
        }
      });

      res.json({
        success: true,
        data: {
          stats,
          notifications: {
            unread: unreadNotifications,
            upcomingEvents
          },
          recentActivity: await this.getRecentActivity(userId)
        }
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Recent Activity
   */
  async getRecentActivity(userId) {
    try {
      const activities = await AuditLog.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: 10,
        attributes: ['id', 'action', 'details', 'createdAt']
      });

      return activities;
    } catch (error) {
      console.error('Get recent activity error:', error);
      return [];
    }
  }

  /**
   * Update Notification Preferences
   */
  async updateNotificationPreferences(req, res) {
    try {
      const userId = req.user.id;
      const { preferences } = req.body;

      if (!preferences || typeof preferences !== 'object') {
        return res.status(400).json({ error: 'Notification preferences object is required' });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Merge with existing preferences
      const currentPreferences = user.notifications || {};
      user.notifications = { ...currentPreferences, ...preferences };
      await user.save();

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'NOTIFICATION_PREFERENCES_UPDATED',
        details: 'Notification preferences updated',
        ipAddress: req.ip,
        metadata: { updatedPreferences: Object.keys(preferences) }
      });

      res.json({
        success: true,
        message: 'Notification preferences updated successfully',
        data: {
          notifications: user.notifications
        }
      });
    } catch (error) {
      console.error('Update notification preferences error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update User Settings
   */
  async updateSettings(req, res) {
    try {
      const userId = req.user.id;
      const { settings } = req.body;

      if (!settings || typeof settings !== 'object') {
        return res.status(400).json({ error: 'Settings object is required' });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Merge with existing settings
      const currentSettings = user.settings || {};
      user.settings = { ...currentSettings, ...settings };
      await user.save();

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'USER_SETTINGS_UPDATED',
        details: 'User settings updated',
        ipAddress: req.ip,
        metadata: { updatedSettings: Object.keys(settings) }
      });

      res.json({
        success: true,
        message: 'Settings updated successfully',
        data: {
          settings: user.settings
        }
      });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get User Sessions
   */
  async getUserSessions(req, res) {
    try {
      const userId = req.user.id;

      // Get recent audit logs with login actions
      const sessions = await AuditLog.findAll({
        where: { 
          userId,
          action: { [Op.in]: ['LOGIN_SUCCESS', 'LOGOUT'] }
        },
        order: [['createdAt', 'DESC']],
        limit: 20,
        attributes: ['id', 'action', 'ipAddress', 'userAgent', 'createdAt']
      });

      // Format sessions
      const formattedSessions = [];
      let currentSession = null;

      for (const log of sessions) {
        if (log.action === 'LOGIN_SUCCESS') {
          currentSession = {
            loginTime: log.createdAt,
            ipAddress: log.ipAddress,
            userAgent: log.userAgent,
            duration: null,
            active: true
          };
          formattedSessions.push(currentSession);
        } else if (log.action === 'LOGOUT' && currentSession) {
          currentSession.duration = (log.createdAt - currentSession.loginTime) / 1000; // in seconds
          currentSession.active = false;
          currentSession = null;
        }
      }

      res.json({
        success: true,
        data: {
          sessions: formattedSessions,
          activeSessions: formattedSessions.filter(s => s.active).length
        }
      });
    } catch (error) {
      console.error('Get user sessions error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Terminate Session
   */
  async terminateSession(req, res) {
    try {
      const userId = req.user.id;
      const { sessionId } = req.params;

      // This would typically involve invalidating a specific session token
      // For now, we'll just clear the refresh token (simplified)
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.refreshToken = null;
      await user.save();

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'SESSION_TERMINATED',
        details: 'User session terminated by user',
        ipAddress: req.ip
      });

      res.json({
        success: true,
        message: 'Session terminated successfully'
      });
    } catch (error) {
      console.error('Terminate session error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Export User Data
   */
  async exportData(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId, {
        attributes: { 
          exclude: ['password', 'refreshToken', 'passwordResetToken', 'passwordResetExpires'] 
        },
        include: [
          {
            model: Role,
            through: { attributes: [] },
            attributes: ['name', 'description']
          },
          { 
            model: Company,
            attributes: ['name', 'email', 'phone', 'address']
          }
        ]
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get user activity
      const activities = await AuditLog.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: 100,
        attributes: ['action', 'details', 'ipAddress', 'createdAt']
      });

      // Format data for export
      const exportData = {
        profile: {
          personalInfo: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone,
            joined: user.createdAt
          },
          roles: user.Roles.map(role => role.name),
          company: user.Company ? {
            name: user.Company.name,
            contact: user.Company.email
          } : null,
          preferences: user.preferences || {},
          settings: user.settings || {}
        },
        activity: activities.map(activity => ({
          action: activity.action,
          details: activity.details,
          ipAddress: activity.ipAddress,
          timestamp: activity.createdAt
        })),
        exportInfo: {
          exportedAt: new Date(),
          dataTypes: ['profile', 'activity'],
          format: 'json'
        }
      };

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'DATA_EXPORT_REQUESTED',
        details: 'User data export requested',
        ipAddress: req.ip
      });

      res.json({
        success: true,
        data: exportData
      });
    } catch (error) {
      console.error('Export data error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new ProfileController();