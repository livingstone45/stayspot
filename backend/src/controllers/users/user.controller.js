const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { User, Role, Company, Portfolio, AuditLog, Invitation } = require('../../models');
const { sendEmail } = require('../../services/communication/email.service');
const { ROLES, PERMISSIONS } = require('../../utils/constants/roles');
const { validateUserUpdate, validateUserCreate } = require('../../utils/validators/user.validator');

/**
 * User Management Controller
 * Handles user CRUD operations and management
 */
class UserController {
  /**
   * Get All Users (with filtering and pagination)
   */
  async getAllUsers(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        search, 
        role, 
        status, 
        companyId,
        portfolioId,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Build where clause based on permissions
      let whereClause = {};
      let companyWhereClause = {};

      // System admin can see all users
      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        // No restrictions
      }
      // Company admin can see users in their company
      else if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId, { include: [{ model: Company }] });
        if (user && user.companyId) {
          whereClause.companyId = user.companyId;
          companyWhereClause.id = user.companyId;
        } else {
          return res.status(403).json({ error: 'Not authorized to view users' });
        }
      }
      // Portfolio manager can see users in their portfolio
      else if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        const user = await User.findByPk(userId, { 
          include: [{ 
            model: Portfolio,
            as: 'ManagedPortfolios'
          }]
        });
        
        if (user.ManagedPortfolios && user.ManagedPortfolios.length > 0) {
          const portfolioIds = user.ManagedPortfolios.map(p => p.id);
          whereClause.portfolioId = { [Op.in]: portfolioIds };
        } else {
          return res.status(403).json({ error: 'Not authorized to view users' });
        }
      }
      // Property manager can only see assigned users
      else if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        const user = await User.findByPk(userId, { 
          include: [{ 
            model: Property,
            as: 'ManagedProperties'
          }]
        });
        
        if (user.ManagedProperties && user.ManagedProperties.length > 0) {
          const propertyIds = user.ManagedProperties.map(p => p.id);
          whereClause.assignedPropertyId = { [Op.in]: propertyIds };
        } else {
          return res.status(403).json({ error: 'Not authorized to view users' });
        }
      }
      // Other roles can only see themselves
      else {
        whereClause.id = userId;
      }

      // Apply filters
      if (search) {
        whereClause[Op.or] = [
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }

      if (status) {
        whereClause.isActive = status === 'active';
      }

      if (companyId) {
        whereClause.companyId = companyId;
      }

      if (portfolioId) {
        whereClause.portfolioId = portfolioId;
      }

      // Build include for role filtering
      let include = [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ['id', 'name', 'description']
        },
        {
          model: Company,
          attributes: ['id', 'name', 'logo']
        }
      ];

      // Add role filter to include
      if (role) {
        include[0].where = { name: role };
      }

      const { count, rows: users } = await User.findAndCountAll({
        where: whereClause,
        include: include,
        attributes: { 
          exclude: ['password', 'refreshToken', 'passwordResetToken', 'passwordResetExpires'] 
        },
        distinct: true,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Format response
      const formattedUsers = users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        roles: user.Roles.map(role => ({
          id: role.id,
          name: role.name,
          description: role.description
        })),
        company: user.Company ? {
          id: user.Company.id,
          name: user.Company.name,
          logo: user.Company.logo
        } : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));

      res.json({
        success: true,
        data: {
          users: formattedUsers,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get User by ID
   */
  async getUserById(req, res) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.id;
      const userRoles = req.user.roles;

      // Check permissions
      if (userId !== currentUserId.toString() && 
          !userRoles.includes(ROLES.SYSTEM_ADMIN) && 
          !userRoles.includes(ROLES.COMPANY_ADMIN)) {
        
        // Check if current user manages this user
        const isManager = await this.checkUserManagement(currentUserId, userId);
        if (!isManager) {
          return res.status(403).json({ error: 'Not authorized to view this user' });
        }
      }

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
            include: [{ model: Portfolio }]
          },
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

      // Format response
      const userData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
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
          portfolios: user.Company.Portfolios
        } : null,
        assignedPortfolios: user.AssignedPortfolios,
        managedProperties: user.ManagedProperties,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.json({
        success: true,
        data: userData
      });
    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Create User (Admin only)
   */
  async createUser(req, res) {
    try {
      const { error } = validateUserCreate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const currentUserRoles = req.user.roles;
      
      // Only system admin and company admin can create users
      if (!currentUserRoles.includes(ROLES.SYSTEM_ADMIN) && 
          !currentUserRoles.includes(ROLES.COMPANY_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to create users' });
      }

      const { 
        email, 
        password, 
        firstName, 
        lastName, 
        phone, 
        roleIds, 
        companyId, 
        portfolioId,
        sendInvitation = true 
      } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists' });
      }

      // Verify company access for company admin
      if (currentUserRoles.includes(ROLES.COMPANY_ADMIN)) {
        const currentUser = await User.findByPk(req.user.id);
        if (companyId && companyId !== currentUser.companyId) {
          return res.status(403).json({ error: 'Not authorized to create users in this company' });
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        companyId: companyId || null,
        portfolioId: portfolioId || null,
        isActive: true,
        emailVerified: false
      });

      // Assign roles
      if (roleIds && roleIds.length > 0) {
        await user.setRoles(roleIds);
      }

      // Send welcome email if requested
      if (sendInvitation) {
        const tempPassword = password; // In real app, generate random password
        await sendEmail({
          to: email,
          subject: 'Welcome to StaySpot - Your Account Has Been Created',
          template: 'user-created',
          data: {
            name: `${firstName} ${lastName}`,
            email: email,
            password: tempPassword,
            loginLink: `${process.env.FRONTEND_URL}/login`,
            resetPasswordLink: `${process.env.FRONTEND_URL}/reset-password`
          }
        });
      }

      // Create audit log
      await AuditLog.create({
        userId: req.user.id,
        action: 'USER_CREATED',
        details: `User created: ${email}`,
        ipAddress: req.ip,
        metadata: { 
          createdUserId: user.id, 
          roles: roleIds,
          sendInvitation 
        }
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          userId: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update User
   */
  async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const { error } = validateUserUpdate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const currentUserId = req.user.id;
      const userRoles = req.user.roles;

      // Check permissions
      if (userId !== currentUserId.toString() && 
          !userRoles.includes(ROLES.SYSTEM_ADMIN) && 
          !userRoles.includes(ROLES.COMPANY_ADMIN)) {
        
        // Check if current user manages this user
        const isManager = await this.checkUserManagement(currentUserId, userId);
        if (!isManager) {
          return res.status(403).json({ error: 'Not authorized to update this user' });
        }
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { 
        firstName, 
        lastName, 
        phone, 
        avatar, 
        roleIds,
        companyId,
        portfolioId,
        isActive 
      } = req.body;

      // Update basic info
      if (firstName !== undefined) user.firstName = firstName;
      if (lastName !== undefined) user.lastName = lastName;
      if (phone !== undefined) user.phone = phone;
      if (avatar !== undefined) user.avatar = avatar;
      if (companyId !== undefined) user.companyId = companyId;
      if (portfolioId !== undefined) user.portfolioId = portfolioId;
      
      // Only admins can change active status
      if (isActive !== undefined && 
          (userRoles.includes(ROLES.SYSTEM_ADMIN) || userRoles.includes(ROLES.COMPANY_ADMIN))) {
        user.isActive = isActive;
      }

      await user.save();

      // Update roles if provided and user has permission
      if (roleIds && (userRoles.includes(ROLES.SYSTEM_ADMIN) || userRoles.includes(ROLES.COMPANY_ADMIN))) {
        await user.setRoles(roleIds);
      }

      // Create audit log
      await AuditLog.create({
        userId: currentUserId,
        action: 'USER_UPDATED',
        details: `User updated: ${user.email}`,
        ipAddress: req.ip,
        metadata: { 
          updatedUserId: user.id, 
          changes: req.body 
        }
      });

      res.json({
        success: true,
        message: 'User updated successfully',
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          avatar: user.avatar,
          isActive: user.isActive
        }
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Delete User
   */
  async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.id;
      const userRoles = req.user.roles;

      // Cannot delete self
      if (userId === currentUserId.toString()) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      // Check permissions
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN) && 
          !userRoles.includes(ROLES.COMPANY_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to delete users' });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // For company admin, can only delete users in same company
      if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const currentUser = await User.findByPk(currentUserId);
        if (user.companyId !== currentUser.companyId) {
          return res.status(403).json({ error: 'Not authorized to delete this user' });
        }
      }

      // Check if user has important data (optional - implement based on business rules)
      // const hasImportantData = await this.checkUserData(userId);
      // if (hasImportantData) {
      //   return res.status(400).json({ error: 'Cannot delete user with associated data. Consider deactivating instead.' });
      // }

      // Soft delete (set inactive) instead of hard delete
      user.isActive = false;
      user.deletedAt = new Date();
      user.deletedBy = currentUserId;
      await user.save();

      // Create audit log
      await AuditLog.create({
        userId: currentUserId,
        action: 'USER_DELETED',
        details: `User deactivated: ${user.email}`,
        ipAddress: req.ip,
        metadata: { deletedUserId: user.id }
      });

      res.json({
        success: true,
        message: 'User deactivated successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get User Statistics
   */
  async getUserStats(req, res) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles;
      const user = await User.findByPk(userId);

      let whereClause = {};

      // Build where clause based on permissions
      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        // All users
      } else if (userRoles.includes(ROLES.COMPANY_ADMIN) && user.companyId) {
        whereClause.companyId = user.companyId;
      } else if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        const portfolios = await user.getManagedPortfolios();
        const portfolioIds = portfolios.map(p => p.id);
        whereClause.portfolioId = { [Op.in]: portfolioIds };
      } else {
        // Only current user
        whereClause.id = userId;
      }

      const totalUsers = await User.count({ where: whereClause });
      const activeUsers = await User.count({ where: { ...whereClause, isActive: true } });
      const verifiedUsers = await User.count({ where: { ...whereClause, emailVerified: true } });
      
      // Get users by role
      const usersByRole = await User.findAll({
        where: whereClause,
        include: [{
          model: Role,
          through: { attributes: [] },
          attributes: ['name']
        }],
        attributes: ['id']
      });

      const roleStats = {};
      usersByRole.forEach(u => {
        u.Roles.forEach(role => {
          roleStats[role.name] = (roleStats[role.name] || 0) + 1;
        });
      });

      // Get recent users (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentUsers = await User.count({
        where: {
          ...whereClause,
          createdAt: { [Op.gte]: thirtyDaysAgo }
        }
      });

      res.json({
        success: true,
        data: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
          verified: verifiedUsers,
          unverified: totalUsers - verifiedUsers,
          recent: recentUsers,
          byRole: roleStats
        }
      });
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get User Activity
   */
  async getUserActivity(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const offset = (page - 1) * limit;
      const currentUserId = req.user.id;
      const userRoles = req.user.roles;

      // Check permissions
      if (userId !== currentUserId.toString() && 
          !userRoles.includes(ROLES.SYSTEM_ADMIN) && 
          !userRoles.includes(ROLES.COMPANY_ADMIN)) {
        
        const isManager = await this.checkUserManagement(currentUserId, userId);
        if (!isManager) {
          return res.status(403).json({ error: 'Not authorized to view this user\'s activity' });
        }
      }

      const { count, rows: activities } = await AuditLog.findAndCountAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: {
          activities,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get user activity error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Helper: Check if user manages another user
   */
  async checkUserManagement(managerId, targetUserId) {
    try {
      const manager = await User.findByPk(managerId, {
        include: [
          {
            model: Role,
            through: { attributes: [] }
          },
          {
            model: Portfolio,
            as: 'ManagedPortfolios'
          },
          {
            model: Property,
            as: 'ManagedProperties'
          }
        ]
      });

      const targetUser = await User.findByPk(targetUserId);

      if (!manager || !targetUser) return false;

      // Check if manager is system admin
      const managerRoles = manager.Roles.map(r => r.name);
      if (managerRoles.includes(ROLES.SYSTEM_ADMIN)) return true;

      // Check if both in same company and manager is company admin
      if (manager.companyId && targetUser.companyId && 
          manager.companyId === targetUser.companyId &&
          managerRoles.includes(ROLES.COMPANY_ADMIN)) {
        return true;
      }

      // Check portfolio management
      if (manager.ManagedPortfolios && manager.ManagedPortfolios.length > 0) {
        const managedPortfolioIds = manager.ManagedPortfolios.map(p => p.id);
        if (targetUser.portfolioId && managedPortfolioIds.includes(targetUser.portfolioId)) {
          return true;
        }
      }

      // Check property management (for property managers)
      if (manager.ManagedProperties && manager.ManagedProperties.length > 0) {
        // This would require additional logic based on your data model
        // For example, checking if target user is assigned to managed properties
      }

      return false;
    } catch (error) {
      console.error('Check user management error:', error);
      return false;
    }
  }

  /**
   * Reset User Password (Admin)
   */
  async resetUserPassword(req, res) {
    try {
      const { userId } = req.params;
      const { newPassword } = req.body;
      const currentUserId = req.user.id;
      const userRoles = req.user.roles;

      // Check permissions
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN) && 
          !userRoles.includes(ROLES.COMPANY_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to reset passwords' });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // For company admin, can only reset passwords for users in same company
      if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const currentUser = await User.findByPk(currentUserId);
        if (user.companyId !== currentUser.companyId) {
          return res.status(403).json({ error: 'Not authorized to reset this user\'s password' });
        }
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save();

      // Send notification email
      await sendEmail({
        to: user.email,
        subject: 'StaySpot - Your Password Has Been Reset',
        template: 'admin-password-reset',
        data: {
          name: `${user.firstName} ${user.lastName}`,
          adminName: `${req.user.firstName} ${req.user.lastName}`,
          loginLink: `${process.env.FRONTEND_URL}/login`
        }
      });

      // Create audit log
      await AuditLog.create({
        userId: currentUserId,
        action: 'ADMIN_PASSWORD_RESET',
        details: `Password reset for user: ${user.email}`,
        ipAddress: req.ip,
        metadata: { resetUserId: user.id }
      });

      res.json({
        success: true,
        message: 'Password reset successfully. User has been notified via email.'
      });
    } catch (error) {
      console.error('Reset user password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Bulk Update Users
   */
  async bulkUpdateUsers(req, res) {
    try {
      const { userIds, updates } = req.body;
      const currentUserId = req.user.id;
      const userRoles = req.user.roles;

      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: 'User IDs array is required' });
      }

      // Check permissions
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN) && 
          !userRoles.includes(ROLES.COMPANY_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized for bulk updates' });
      }

      // Limit bulk operations
      if (userIds.length > 100) {
        return res.status(400).json({ error: 'Maximum 100 users per bulk update' });
      }

      const results = {
        success: [],
        failed: []
      };

      // Process each user
      for (const userId of userIds) {
        try {
          const user = await User.findByPk(userId);
          
          if (!user) {
            results.failed.push({ userId, error: 'User not found' });
            continue;
          }

          // Check company access for company admin
          if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
            const currentUser = await User.findByPk(currentUserId);
            if (user.companyId !== currentUser.companyId) {
              results.failed.push({ userId, error: 'Not authorized to update this user' });
              continue;
            }
          }

          // Apply updates
          const allowedUpdates = ['isActive', 'portfolioId', 'companyId'];
          for (const key in updates) {
            if (allowedUpdates.includes(key)) {
              user[key] = updates[key];
            }
          }

          await user.save();
          results.success.push({ userId, updates: Object.keys(updates) });
        } catch (error) {
          console.error(`Failed to update user ${userId}:`, error);
          results.failed.push({ userId, error: error.message });
        }
      }

      // Create audit log
      await AuditLog.create({
        userId: currentUserId,
        action: 'BULK_USER_UPDATE',
        details: `Bulk update processed: ${results.success.length} success, ${results.failed.length} failed`,
        ipAddress: req.ip,
        metadata: { results, updates }
      });

      res.json({
        success: true,
        message: `Bulk update processed. ${results.success.length} updated successfully, ${results.failed.length} failed.`,
        data: results
      });
    } catch (error) {
      console.error('Bulk update users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new UserController();