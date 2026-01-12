const { Op } = require('sequelize');
const { User, Role, Company, Portfolio, Property, Task, Assignment, AuditLog } = require('../../models');
const { validateTeamAssignment, validateTaskAssignment } = require('../../utils/validators/management.validator');
const { ROLES } = require('../../utils/constants/roles');

/**
 * Team Management Controller
 * Handles team assignments, task management, and professional workflows
 */
class TeamController {
  /**
   * Get Team Members
   */
  async getTeamMembers(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        search, 
        role, 
        status, 
        portfolioId,
        propertyId,
        sortBy = 'lastName',
        sortOrder = 'ASC'
      } = req.query;

      const offset = (page - 1) * limit;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Build where clause based on permissions
      let whereClause = {};
      let includeWhereClause = {};

      // System admin can see all users
      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        // No restrictions
      }
      // Company admin can see users in their company
      else if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        if (user && user.companyId) {
          whereClause.companyId = user.companyId;
        } else {
          return res.status(403).json({ error: 'Not authorized to view team members' });
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
          includeWhereClause.PortfolioId = { [Op.in]: portfolioIds };
        } else {
          return res.status(403).json({ error: 'Not authorized to view team members' });
        }
      }
      // Property manager can see users assigned to their properties
      else if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Property,
            as: 'ManagedProperties'
          }]
        });
        
        if (user.ManagedProperties && user.ManagedProperties.length > 0) {
          const propertyIds = user.ManagedProperties.map(p => p.id);
          includeWhereClause.PropertyId = { [Op.in]: propertyIds };
        } else {
          return res.status(403).json({ error: 'Not authorized to view team members' });
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

      if (portfolioId) {
        includeWhereClause.PortfolioId = portfolioId;
      }

      if (propertyId) {
        includeWhereClause.PropertyId = propertyId;
      }

      // Build include array for role filtering and assignments
      const include = [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ['id', 'name', 'description']
        }
      ];

      // Add role filter to include
      if (role) {
        include[0].where = { name: role };
      }

      // Add portfolio/property assignments if needed
      if (portfolioId || propertyId || userRoles.includes(ROLES.PORTFOLIO_MANAGER) || userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        include.push({
          model: Portfolio,
          as: 'AssignedPortfolios',
          through: { attributes: [] },
          where: includeWhereClause.PortfolioId ? { id: includeWhereClause.PortfolioId } : undefined,
          required: !!includeWhereClause.PortfolioId
        });

        include.push({
          model: Property,
          as: 'AssignedProperties',
          through: { attributes: [] },
          where: includeWhereClause.PropertyId ? { id: includeWhereClause.PropertyId } : undefined,
          required: !!includeWhereClause.PropertyId
        });
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

      // Get additional statistics for each user
      const teamMembers = await Promise.all(
        users.map(async (user) => {
          const [activeTasks, completedTasks, openAssignments] = await Promise.all([
            Task.count({ where: { assignedTo: user.id, status: { [Op.in]: ['pending', 'in_progress'] } } }),
            Task.count({ where: { assignedTo: user.id, status: 'completed' } }),
            Assignment.count({ where: { assignedTo: user.id, status: 'active' } })
          ]);

          return {
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
            assignedPortfolios: user.AssignedPortfolios ? user.AssignedPortfolios.map(p => ({
              id: p.id,
              name: p.name
            })) : [],
            assignedProperties: user.AssignedProperties ? user.AssignedProperties.map(p => ({
              id: p.id,
              name: p.name
            })) : [],
            statistics: {
              activeTasks,
              completedTasks,
              openAssignments,
              taskCompletionRate: (activeTasks + completedTasks) > 0 ? 
                ((completedTasks / (activeTasks + completedTasks)) * 100).toFixed(2) + '%' : '0%'
            },
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          };
        })
      );

      res.json({
        success: true,
        data: {
          teamMembers,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get team members error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Team Member Details
   */
  async getTeamMemberDetails(req, res) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.id;
      const userRoles = req.user.roles;

      // Check permissions
      if (userId !== currentUserId.toString() && 
          !userRoles.includes(ROLES.SYSTEM_ADMIN) && 
          !userRoles.includes(ROLES.COMPANY_ADMIN)) {
        
        // Check if current user manages this team member
        const isManager = await this.checkTeamManagement(currentUserId, userId);
        if (!isManager) {
          return res.status(403).json({ error: 'Not authorized to view this team member' });
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
            attributes: ['id', 'name', 'logo']
          },
          {
            model: Portfolio,
            as: 'AssignedPortfolios',
            through: { attributes: [] },
            include: [{
              model: Property,
              attributes: ['id', 'name', 'address']
            }]
          },
          {
            model: Property,
            as: 'AssignedProperties',
            through: { attributes: [] },
            include: [{
              model: Portfolio,
              attributes: ['id', 'name']
            }]
          },
          {
            model: Portfolio,
            as: 'ManagedPortfolios',
            through: { attributes: [] }
          },
          {
            model: Property,
            as: 'ManagedProperties',
            through: { attributes: [] }
          }
        ]
      });

      if (!user) {
        return res.status(404).json({ error: 'Team member not found' });
      }

      // Get user statistics
      const [
        activeTasks,
        completedTasks,
        overdueTasks,
        openAssignments,
        completedAssignments,
        recentActivity
      ] = await Promise.all([
        Task.count({ where: { assignedTo: userId, status: { [Op.in]: ['pending', 'in_progress'] } } }),
        Task.count({ where: { assignedTo: userId, status: 'completed' } }),
        Task.count({ 
          where: { 
            assignedTo: userId, 
            status: { [Op.in]: ['pending', 'in_progress'] },
            dueDate: { [Op.lt]: new Date() }
          } 
        }),
        Assignment.count({ where: { assignedTo: userId, status: 'active' } }),
        Assignment.count({ where: { assignedTo: userId, status: 'completed' } }),
        AuditLog.findAll({
          where: { userId },
          order: [['createdAt', 'DESC']],
          limit: 10
        })
      ]);

      // Get upcoming tasks
      const upcomingTasks = await Task.findAll({
        where: { 
          assignedTo: userId,
          status: { [Op.in]: ['pending', 'in_progress'] },
          dueDate: { [Op.gte]: new Date() }
        },
        order: [['dueDate', 'ASC']],
        limit: 10,
        include: [{
          model: Property,
          attributes: ['id', 'name']
        }]
      });

      // Format response
      const teamMemberData = {
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
          logo: user.Company.logo
        } : null,
        assignments: {
          portfolios: user.AssignedPortfolios.map(portfolio => ({
            id: portfolio.id,
            name: portfolio.name,
            propertyCount: portfolio.Properties.length,
            properties: portfolio.Properties.map(property => ({
              id: property.id,
              name: property.name,
              address: property.address
            }))
          })),
          properties: user.AssignedProperties.map(property => ({
            id: property.id,
            name: property.name,
            address: property.address,
            portfolio: property.Portfolio ? {
              id: property.Portfolio.id,
              name: property.Portfolio.name
            } : null
          }))
        },
        management: {
          portfolios: user.ManagedPortfolios.map(portfolio => ({
            id: portfolio.id,
            name: portfolio.name
          })),
          properties: user.ManagedProperties.map(property => ({
            id: property.id,
            name: property.name
          }))
        },
        statistics: {
          tasks: {
            active: activeTasks,
            completed: completedTasks,
            overdue: overdueTasks,
            total: activeTasks + completedTasks,
            completionRate: (activeTasks + completedTasks) > 0 ? 
              ((completedTasks / (activeTasks + completedTasks)) * 100).toFixed(2) + '%' : '0%',
            overdueRate: activeTasks > 0 ? 
              ((overdueTasks / activeTasks) * 100).toFixed(2) + '%' : '0%'
          },
          assignments: {
            active: openAssignments,
            completed: completedAssignments,
            total: openAssignments + completedAssignments,
            completionRate: (openAssignments + completedAssignments) > 0 ? 
              ((completedAssignments / (openAssignments + completedAssignments)) * 100).toFixed(2) + '%' : '0%'
          }
        },
        upcomingTasks: upcomingTasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          property: task.Property ? task.Property.name : null,
          daysRemaining: Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
        })),
        recentActivity,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.json({
        success: true,
        data: teamMemberData
      });
    } catch (error) {
      console.error('Get team member details error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Assign Team Member to Portfolio
   */
  async assignToPortfolio(req, res) {
    try {
      const { error } = validateTeamAssignment(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const { userId, portfolioId } = req.body;
      const currentUserId = req.user.id;
      const userRoles = req.user.roles;

      // Check permissions
      const canAssign = userRoles.includes(ROLES.SYSTEM_ADMIN) || 
                       userRoles.includes(ROLES.COMPANY_ADMIN) ||
                       (userRoles.includes(ROLES.PORTFOLIO_MANAGER) && 
                        await this.checkPortfolioManagement(currentUserId, portfolioId));

      if (!canAssign) {
        return res.status(403).json({ error: 'Not authorized to assign team members' });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const portfolio = await Portfolio.findByPk(portfolioId);
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      // Check if user belongs to same company as portfolio
      if (user.companyId !== portfolio.companyId) {
        return res.status(400).json({ 
          error: 'User does not belong to the same company as the portfolio' 
        });
      }

      // Check if already assigned
      const currentAssignments = await user.getAssignedPortfolios();
      const isAlreadyAssigned = currentAssignments.some(p => p.id === parseInt(portfolioId));

      if (isAlreadyAssigned) {
        return res.status(409).json({ error: 'User is already assigned to this portfolio' });
      }

      // Assign user to portfolio
      await user.addAssignedPortfolio(portfolioId);

      // Create assignment record
      const assignment = await Assignment.create({
        assignedTo: userId,
        assignedBy: currentUserId,
        portfolioId,
        status: 'active',
        startDate: new Date(),
        notes: `Assigned to portfolio: ${portfolio.name}`,
        metadata: {
          assignmentType: 'portfolio',
          portfolioName: portfolio.name,
          assignedByName: `${req.user.firstName} ${req.user.lastName}`
        }
      });

      // Create audit log
      await AuditLog.create({
        userId: currentUserId,
        action: 'TEAM_ASSIGNED_TO_PORTFOLIO',
        details: `User ${user.firstName} ${user.lastName} assigned to portfolio: ${portfolio.name}`,
        ipAddress: req.ip,
        metadata: { 
          userId,
          portfolioId,
          assignmentId: assignment.id,
          userName: `${user.firstName} ${user.lastName}`,
          portfolioName: portfolio.name
        }
      });

      res.json({
        success: true,
        message: 'Team member assigned to portfolio successfully',
        data: {
          assignmentId: assignment.id,
          user: {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email
          },
          portfolio: {
            id: portfolio.id,
            name: portfolio.name
          },
          assignment: {
            id: assignment.id,
            status: assignment.status,
            startDate: assignment.startDate
          }
        }
      });
    } catch (error) {
      console.error('Assign to portfolio error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Assign Team Member to Property
   */
  async assignToProperty(req, res) {
    try {
      const { error } = validateTeamAssignment(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const { userId, propertyId } = req.body;
      const currentUserId = req.user.id;
      const userRoles = req.user.roles;

      // Check permissions
      const canAssign = userRoles.includes(ROLES.SYSTEM_ADMIN) || 
                       userRoles.includes(ROLES.COMPANY_ADMIN) ||
                       (userRoles.includes(ROLES.PORTFOLIO_MANAGER) && 
                        await this.checkPropertyManagement(currentUserId, propertyId, 'portfolio')) ||
                       (userRoles.includes(ROLES.PROPERTY_MANAGER) && 
                        await this.checkPropertyManagement(currentUserId, propertyId, 'property'));

      if (!canAssign) {
        return res.status(403).json({ error: 'Not authorized to assign team members' });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const property = await Property.findByPk(propertyId, {
        include: [{ model: Portfolio }]
      });

      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      // Check if user belongs to same company as property
      if (user.companyId !== property.companyId) {
        return res.status(400).json({ 
          error: 'User does not belong to the same company as the property' 
        });
      }

      // Check if already assigned
      const currentAssignments = await user.getAssignedProperties();
      const isAlreadyAssigned = currentAssignments.some(p => p.id === parseInt(propertyId));

      if (isAlreadyAssigned) {
        return res.status(409).json({ error: 'User is already assigned to this property' });
      }

      // Assign user to property
      await user.addAssignedProperty(propertyId);

      // Create assignment record
      const assignment = await Assignment.create({
        assignedTo: userId,
        assignedBy: currentUserId,
        propertyId,
        portfolioId: property.portfolioId,
        status: 'active',
        startDate: new Date(),
        notes: `Assigned to property: ${property.name}`,
        metadata: {
          assignmentType: 'property',
          propertyName: property.name,
          portfolioName: property.Portfolio ? property.Portfolio.name : null,
          assignedByName: `${req.user.firstName} ${req.user.lastName}`
        }
      });

      // Create audit log
      await AuditLog.create({
        userId: currentUserId,
        action: 'TEAM_ASSIGNED_TO_PROPERTY',
        details: `User ${user.firstName} ${user.lastName} assigned to property: ${property.name}`,
        ipAddress: req.ip,
        metadata: { 
          userId,
          propertyId,
          portfolioId: property.portfolioId,
          assignmentId: assignment.id,
          userName: `${user.firstName} ${user.lastName}`,
          propertyName: property.name
        }
      });

      res.json({
        success: true,
        message: 'Team member assigned to property successfully',
        data: {
          assignmentId: assignment.id,
          user: {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email
          },
          property: {
            id: property.id,
            name: property.name,
            address: property.address
          },
          portfolio: property.Portfolio ? {
            id: property.Portfolio.id,
            name: property.Portfolio.name
          } : null,
          assignment: {
            id: assignment.id,
            status: assignment.status,
            startDate: assignment.startDate
          }
        }
      });
    } catch (error) {
      console.error('Assign to property error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Remove Team Member from Portfolio
   */
  async removeFromPortfolio(req, res) {
    try {
      const { userId, portfolioId } = req.params;
      const currentUserId = req.user.id;
      const userRoles = req.user.roles;

      // Check permissions
      const canRemove = userRoles.includes(ROLES.SYSTEM_ADMIN) || 
                       userRoles.includes(ROLES.COMPANY_ADMIN) ||
                       (userRoles.includes(ROLES.PORTFOLIO_MANAGER) && 
                        await this.checkPortfolioManagement(currentUserId, portfolioId));

      if (!canRemove) {
        return res.status(403).json({ error: 'Not authorized to remove team members' });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if user is assigned to portfolio
      const currentAssignments = await user.getAssignedPortfolios();
      const isAssigned = currentAssignments.some(p => p.id === parseInt(portfolioId));

      if (!isAssigned) {
        return res.status(400).json({ error: 'User is not assigned to this portfolio' });
      }

      // Remove assignment
      await user.removeAssignedPortfolio(portfolioId);

      // Update assignment record
      const assignment = await Assignment.findOne({
        where: {
          assignedTo: userId,
          portfolioId,
          status: 'active'
        }
      });

      if (assignment) {
        assignment.status = 'removed';
        assignment.endDate = new Date();
        assignment.notes = `Removed from portfolio by ${req.user.firstName} ${req.user.lastName}`;
        await assignment.save();
      }

      // Create audit log
      await AuditLog.create({
        userId: currentUserId,
        action: 'TEAM_REMOVED_FROM_PORTFOLIO',
        details: `User ${user.firstName} ${user.lastName} removed from portfolio: ${portfolioId}`,
        ipAddress: req.ip,
        metadata: { 
          userId,
          portfolioId,
          userName: `${user.firstName} ${user.lastName}`
        }
      });

      res.json({
        success: true,
        message: 'Team member removed from portfolio successfully',
        data: {
          userId: user.id,
          portfolioId: parseInt(portfolioId)
        }
      });
    } catch (error) {
      console.error('Remove from portfolio error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Remove Team Member from Property
   */
  async removeFromProperty(req, res) {
    try {
      const { userId, propertyId } = req.params;
      const currentUserId = req.user.id;
      const userRoles = req.user.roles;

      // Check permissions
      const canRemove = userRoles.includes(ROLES.SYSTEM_ADMIN) || 
                       userRoles.includes(ROLES.COMPANY_ADMIN) ||
                       (userRoles.includes(ROLES.PORTFOLIO_MANAGER) && 
                        await this.checkPropertyManagement(currentUserId, propertyId, 'portfolio')) ||
                       (userRoles.includes(ROLES.PROPERTY_MANAGER) && 
                        await this.checkPropertyManagement(currentUserId, propertyId, 'property'));

      if (!canRemove) {
        return res.status(403).json({ error: 'Not authorized to remove team members' });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if user is assigned to property
      const currentAssignments = await user.getAssignedProperties();
      const isAssigned = currentAssignments.some(p => p.id === parseInt(propertyId));

      if (!isAssigned) {
        return res.status(400).json({ error: 'User is not assigned to this property' });
      }

      // Remove assignment
      await user.removeAssignedProperty(propertyId);

      // Update assignment record
      const assignment = await Assignment.findOne({
        where: {
          assignedTo: userId,
          propertyId,
          status: 'active'
        }
      });

      if (assignment) {
        assignment.status = 'removed';
        assignment.endDate = new Date();
        assignment.notes = `Removed from property by ${req.user.firstName} ${req.user.lastName}`;
        await assignment.save();
      }

      // Create audit log
      await AuditLog.create({
        userId: currentUserId,
        action: 'TEAM_REMOVED_FROM_PROPERTY',
        details: `User ${user.firstName} ${user.lastName} removed from property: ${propertyId}`,
        ipAddress: req.ip,
        metadata: { 
          userId,
          propertyId,
          userName: `${user.firstName} ${user.lastName}`
        }
      });

      res.json({
        success: true,
        message: 'Team member removed from property successfully',
        data: {
          userId: user.id,
          propertyId: parseInt(propertyId)
        }
      });
    } catch (error) {
      console.error('Remove from property error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Team Assignments
   */
  async getTeamAssignments(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        userId, 
        portfolioId, 
        propertyId, 
        status,
        assignmentType,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      const currentUserId = req.user.id;
      const userRoles = req.user.roles;

      // Build where clause based on permissions
      let whereClause = {};

      // System admin can see all assignments
      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        // No restrictions
      }
      // Company admin can see assignments in their company
      else if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(currentUserId);
        if (user && user.companyId) {
          // Get users in company
          const companyUsers = await User.findAll({
            where: { companyId: user.companyId },
            attributes: ['id']
          });
          const userIds = companyUsers.map(u => u.id);
          whereClause.assignedTo = { [Op.in]: userIds };
        } else {
          return res.status(403).json({ error: 'Not authorized to view assignments' });
        }
      }
      // Portfolio manager can see assignments in their portfolio
      else if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        const user = await User.findByPk(currentUserId, {
          include: [{ 
            model: Portfolio,
            as: 'ManagedPortfolios'
          }]
        });
        
        if (user.ManagedPortfolios && user.ManagedPortfolios.length > 0) {
          const portfolioIds = user.ManagedPortfolios.map(p => p.id);
          whereClause.portfolioId = { [Op.in]: portfolioIds };
        } else {
          return res.status(403).json({ error: 'Not authorized to view assignments' });
        }
      }
      // Property manager can see assignments for their properties
      else if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        const user = await User.findByPk(currentUserId, {
          include: [{ 
            model: Property,
            as: 'ManagedProperties'
          }]
        });
        
        if (user.ManagedProperties && user.ManagedProperties.length > 0) {
          const propertyIds = user.ManagedProperties.map(p => p.id);
          whereClause.propertyId = { [Op.in]: propertyIds };
        } else {
          return res.status(403).json({ error: 'Not authorized to view assignments' });
        }
      }
      // Regular users can only see their own assignments
      else {
        whereClause.assignedTo = currentUserId;
      }

      // Apply filters
      if (userId) {
        whereClause.assignedTo = userId;
      }

      if (portfolioId) {
        whereClause.portfolioId = portfolioId;
      }

      if (propertyId) {
        whereClause.propertyId = propertyId;
      }

      if (status) {
        whereClause.status = status;
      }

      if (assignmentType) {
        if (assignmentType === 'portfolio') {
          whereClause.portfolioId = { [Op.ne]: null };
          whereClause.propertyId = null;
        } else if (assignmentType === 'property') {
          whereClause.propertyId = { [Op.ne]: null };
        }
      }

      const include = [
        {
          model: User,
          as: 'Assignee',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
        },
        {
          model: User,
          as: 'Assigner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ];

      if (!portfolioId) {
        include.push({
          model: Portfolio,
          attributes: ['id', 'name']
        });
      }

      if (!propertyId) {
        include.push({
          model: Property,
          attributes: ['id', 'name', 'address']
        });
      }

      const { count, rows: assignments } = await Assignment.findAndCountAll({
        where: whereClause,
        include: include,
        distinct: true,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Format response
      const formattedAssignments = assignments.map(assignment => ({
        id: assignment.id,
        assignedTo: {
          id: assignment.Assignee.id,
          name: `${assignment.Assignee.firstName} ${assignment.Assignee.lastName}`,
          email: assignment.Assignee.email,
          avatar: assignment.Assignee.avatar
        },
        assignedBy: assignment.Assigner ? {
          id: assignment.Assigner.id,
          name: `${assignment.Assigner.firstName} ${assignment.Assigner.lastName}`,
          email: assignment.Assigner.email
        } : null,
        portfolio: assignment.Portfolio ? {
          id: assignment.Portfolio.id,
          name: assignment.Portfolio.name
        } : null,
        property: assignment.Property ? {
          id: assignment.Property.id,
          name: assignment.Property.name,
          address: assignment.Property.address
        } : null,
        assignmentType: assignment.propertyId ? 'property' : 'portfolio',
        status: assignment.status,
        startDate: assignment.startDate,
        endDate: assignment.endDate,
        notes: assignment.notes,
        metadata: assignment.metadata,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt
      }));

      res.json({
        success: true,
        data: {
          assignments: formattedAssignments,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get team assignments error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Create Task for Team Member
   */
  async createTask(req, res) {
    try {
      const { error } = validateTaskAssignment(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const { 
        assignedTo, 
        title, 
        description, 
        priority, 
        dueDate, 
        propertyId,
        portfolioId,
        relatedTo,
        relatedType
      } = req.body;

      const currentUserId = req.user.id;
      const userRoles = req.user.roles;

      // Check permissions
      const canAssignTask = userRoles.includes(ROLES.SYSTEM_ADMIN) || 
                           userRoles.includes(ROLES.COMPANY_ADMIN) ||
                           userRoles.includes(ROLES.PORTFOLIO_MANAGER) ||
                           userRoles.includes(ROLES.PROPERTY_MANAGER);

      if (!canAssignTask) {
        return res.status(403).json({ error: 'Not authorized to create tasks' });
      }

      const assignee = await User.findByPk(assignedTo);
      if (!assignee) {
        return res.status(404).json({ error: 'Assignee not found' });
      }

      // Verify property/portfolio access if specified
      if (propertyId) {
        const hasAccess = await this.checkPropertyAccess(propertyId, currentUserId, userRoles);
        if (!hasAccess) {
          return res.status(403).json({ error: 'Not authorized to assign tasks for this property' });
        }
      }

      if (portfolioId) {
        const hasAccess = await this.checkPortfolioAccess(portfolioId, currentUserId, userRoles);
        if (!hasAccess) {
          return res.status(403).json({ error: 'Not authorized to assign tasks for this portfolio' });
        }
      }

      // Create task
      const task = await Task.create({
        title,
        description: description || '',
        assignedTo,
        assignedBy: currentUserId,
        priority: priority || 'medium',
        status: 'pending',
        dueDate: dueDate ? new Date(dueDate) : null,
        propertyId: propertyId || null,
        portfolioId: portfolioId || null,
        relatedTo: relatedTo || null,
        relatedType: relatedType || null,
        metadata: {
          createdByName: `${req.user.firstName} ${req.user.lastName}`,
          assigneeName: `${assignee.firstName} ${assignee.lastName}`
        }
      });

      // Create notification for assignee
      await Notification.create({
        userId: assignedTo,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You have been assigned a new task: ${title}`,
        data: {
          taskId: task.id,
          assignedBy: currentUserId,
          priority: task.priority,
          dueDate: task.dueDate
        },
        read: false
      });

      // Create audit log
      await AuditLog.create({
        userId: currentUserId,
        action: 'TASK_CREATED',
        details: `Task created: ${title}`,
        ipAddress: req.ip,
        metadata: { 
          taskId: task.id,
          assignedTo,
          assigneeName: `${assignee.firstName} ${assignee.lastName}`,
          priority: task.priority,
          dueDate: task.dueDate
        }
      });

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: {
          id: task.id,
          title: task.title,
          description: task.description,
          assignedTo: {
            id: assignee.id,
            name: `${assignee.firstName} ${assignee.lastName}`,
            email: assignee.email
          },
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate,
          createdAt: task.createdAt
        }
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Team Member Tasks
   */
  async getTeamMemberTasks(req, res) {
    try {
      const { userId } = req.params;
      const { 
        page = 1, 
        limit = 20, 
        status, 
        priority, 
        overdue,
        sortBy = 'dueDate',
        sortOrder = 'ASC'
      } = req.query;

      const offset = (page - 1) * limit;
      const currentUserId = req.user.id;
      const userRoles = req.user.roles;

      // Check permissions
      if (userId !== currentUserId.toString() && 
          !userRoles.includes(ROLES.SYSTEM_ADMIN) && 
          !userRoles.includes(ROLES.COMPANY_ADMIN)) {
        
        // Check if current user manages this team member
        const isManager = await this.checkTeamManagement(currentUserId, userId);
        if (!isManager) {
          return res.status(403).json({ error: 'Not authorized to view tasks for this team member' });
        }
      }

      let whereClause = { assignedTo: userId };

      // Apply filters
      if (status) {
        whereClause.status = status;
      }

      if (priority) {
        whereClause.priority = priority;
      }

      if (overdue === 'true') {
        whereClause.status = { [Op.in]: ['pending', 'in_progress'] };
        whereClause.dueDate = { [Op.lt]: new Date() };
      }

      const include = [
        {
          model: User,
          as: 'Assignee',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: User,
          as: 'Assigner',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Property,
          attributes: ['id', 'name', 'address']
        },
        {
          model: Portfolio,
          attributes: ['id', 'name']
        }
      ];

      const { count, rows: tasks } = await Task.findAndCountAll({
        where: whereClause,
        include: include,
        distinct: true,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Format response
      const formattedTasks = tasks.map(task => {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const now = new Date();
        const isOverdue = dueDate && dueDate < now && task.status !== 'completed';

        return {
          id: task.id,
          title: task.title,
          description: task.description,
          assignedTo: {
            id: task.Assignee.id,
            name: `${task.Assignee.firstName} ${task.Assignee.lastName}`,
            avatar: task.Assignee.avatar
          },
          assignedBy: task.Assigner ? {
            id: task.Assigner.id,
            name: `${task.Assigner.firstName} ${task.Assigner.lastName}`
          } : null,
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate,
          completedAt: task.completedAt,
          property: task.Property ? {
            id: task.Property.id,
            name: task.Property.name,
            address: task.Property.address
          } : null,
          portfolio: task.Portfolio ? {
            id: task.Portfolio.id,
            name: task.Portfolio.name
          } : null,
          metadata: task.metadata,
          isOverdue,
          daysOverdue: isOverdue ? Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24)) : 0,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt
        };
      });

      res.json({
        success: true,
        data: {
          tasks: formattedTasks,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get team member tasks error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update Task Status
   */
  async updateTaskStatus(req, res) {
    try {
      const { taskId } = req.params;
      const { status, notes } = req.body;
      const userId = req.user.id;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const task = await Task.findByPk(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Check if user is assigned to the task or is a manager
      if (task.assignedTo !== userId) {
        const userRoles = req.user.roles;
        const isManager = await this.checkTeamManagement(userId, task.assignedTo);
        if (!isManager && !userRoles.includes(ROLES.SYSTEM_ADMIN) && !userRoles.includes(ROLES.COMPANY_ADMIN)) {
          return res.status(403).json({ error: 'Not authorized to update this task' });
        }
      }

      const previousStatus = task.status;
      task.status = status;

      if (status === 'completed') {
        task.completedAt = new Date();
        task.completedBy = userId;
      }

      if (notes) {
        task.notes = notes;
      }

      await task.save();

      // Create notification for assigner if status changed
      if (previousStatus !== status && task.assignedBy !== userId) {
        await Notification.create({
          userId: task.assignedBy,
          type: 'task_updated',
          title: 'Task Status Updated',
          message: `Task "${task.title}" status changed from ${previousStatus} to ${status}`,
          data: {
            taskId: task.id,
            previousStatus,
            newStatus: status,
            updatedBy: userId
          },
          read: false
        });
      }

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'TASK_STATUS_UPDATED',
        details: `Task status updated: ${task.title} (${previousStatus} → ${status})`,
        ipAddress: req.ip,
        metadata: { 
          taskId: task.id,
          previousStatus,
          newStatus: status,
          notes
        }
      });

      res.json({
        success: true,
        message: 'Task status updated successfully',
        data: {
          id: task.id,
          title: task.title,
          status: task.status,
          previousStatus,
          completedAt: task.completedAt,
          updatedAt: task.updatedAt
        }
      });
    } catch (error) {
      console.error('Update task status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Team Performance Metrics
   */
  async getTeamPerformance(req, res) {
    try {
      const { portfolioId, propertyId, startDate, endDate } = req.query;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Build where clause based on permissions
      let whereClause = {};

      // System admin can see all
      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        // No restrictions
      }
      // Company admin can see their company
      else if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        if (user && user.companyId) {
          const companyUsers = await User.findAll({
            where: { companyId: user.companyId },
            attributes: ['id']
          });
          const userIds = companyUsers.map(u => u.id);
          whereClause.assignedTo = { [Op.in]: userIds };
        } else {
          return res.status(403).json({ error: 'Not authorized to view performance metrics' });
        }
      }
      // Portfolio manager can see their portfolio
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
          return res.status(403).json({ error: 'Not authorized to view performance metrics' });
        }
      }
      // Property manager can see their properties
      else if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Property,
            as: 'ManagedProperties'
          }]
        });
        
        if (user.ManagedProperties && user.ManagedProperties.length > 0) {
          const propertyIds = user.ManagedProperties.map(p => p.id);
          whereClause.propertyId = { [Op.in]: propertyIds };
        } else {
          return res.status(403).json({ error: 'Not authorized to view performance metrics' });
        }
      }
      // Regular users can only see their own
      else {
        whereClause.assignedTo = userId;
      }

      // Apply filters
      if (portfolioId) {
        whereClause.portfolioId = portfolioId;
      }

      if (propertyId) {
        whereClause.propertyId = propertyId;
      }

      // Date range
      const dateFilter = {};
      if (startDate) {
        dateFilter[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        dateFilter[Op.lte] = new Date(endDate);
      }
      if (startDate || endDate) {
        whereClause.createdAt = dateFilter;
      }

      // Get tasks for performance analysis
      const tasks = await Task.findAll({
        where: whereClause,
        include: [{
          model: User,
          as: 'Assignee',
          attributes: ['id', 'firstName', 'lastName']
        }]
      });

      // Group tasks by user
      const userPerformance = {};
      tasks.forEach(task => {
        const userId = task.assignedTo;
        if (!userPerformance[userId]) {
          userPerformance[userId] = {
            user: {
              id: task.Assignee.id,
              name: `${task.Assignee.firstName} ${task.Assignee.lastName}`
            },
            totalTasks: 0,
            completedTasks: 0,
            pendingTasks: 0,
            overdueTasks: 0,
            totalAssignments: 0,
            activeAssignments: 0,
            averageCompletionTime: 0,
            completionRates: {}
          };
        }

        const userStats = userPerformance[userId];
        userStats.totalTasks++;

        if (task.status === 'completed') {
          userStats.completedTasks++;
          
          // Calculate completion time
          if (task.completedAt && task.createdAt) {
            const completionTime = (task.completedAt - task.createdAt) / (1000 * 60 * 60 * 24); // in days
            userStats.averageCompletionTime = 
              (userStats.averageCompletionTime * (userStats.completedTasks - 1) + completionTime) / userStats.completedTasks;
          }
        } else if (task.status === 'pending' || task.status === 'in_progress') {
          userStats.pendingTasks++;
          
          // Check if overdue
          if (task.dueDate && new Date(task.dueDate) < new Date()) {
            userStats.overdueTasks++;
          }
        }

        // Track completion rate by priority
        if (!userStats.completionRates[task.priority]) {
          userStats.completionRates[task.priority] = { total: 0, completed: 0 };
        }
        userStats.completionRates[task.priority].total++;
        if (task.status === 'completed') {
          userStats.completionRates[task.priority].completed++;
        }
      });

      // Get assignments for each user
      const assignments = await Assignment.findAll({
        where: whereClause,
        attributes: ['assignedTo', 'status']
      });

      assignments.forEach(assignment => {
        const userId = assignment.assignedTo;
        if (userPerformance[userId]) {
          userPerformance[userId].totalAssignments++;
          if (assignment.status === 'active') {
            userPerformance[userId].activeAssignments++;
          }
        }
      });

      // Calculate completion rates
      const performanceData = Object.values(userPerformance).map(stats => {
        const completionRate = stats.totalTasks > 0 ? 
          (stats.completedTasks / stats.totalTasks) * 100 : 0;
        
        const overdueRate = stats.pendingTasks > 0 ? 
          (stats.overdueTasks / stats.pendingTasks) * 100 : 0;

        // Calculate completion rates by priority
        const priorityRates = {};
        Object.entries(stats.completionRates).forEach(([priority, data]) => {
          priorityRates[priority] = data.total > 0 ? 
            (data.completed / data.total) * 100 : 0;
        });

        return {
          user: stats.user,
          metrics: {
            tasks: {
              total: stats.totalTasks,
              completed: stats.completedTasks,
              pending: stats.pendingTasks,
              overdue: stats.overdueTasks,
              completionRate: parseFloat(completionRate.toFixed(2)),
              overdueRate: parseFloat(overdueRate.toFixed(2)),
              averageCompletionTime: parseFloat(stats.averageCompletionTime.toFixed(2))
            },
            assignments: {
              total: stats.totalAssignments,
              active: stats.activeAssignments,
              completionRate: stats.totalAssignments > 0 ? 
                parseFloat(((stats.totalAssignments - stats.activeAssignments) / stats.totalAssignments * 100).toFixed(2)) : 0
            },
            completionByPriority: priorityRates
          },
          rating: this.calculatePerformanceRating(completionRate, overdueRate, stats.averageCompletionTime)
        };
      });

      // Sort by performance rating (descending)
      performanceData.sort((a, b) => b.rating - a.rating);

      res.json({
        success: true,
        data: {
          performance: performanceData,
          summary: {
            totalTeamMembers: performanceData.length,
            averageCompletionRate: performanceData.length > 0 ? 
              parseFloat((performanceData.reduce((sum, p) => sum + p.metrics.tasks.completionRate, 0) / performanceData.length).toFixed(2)) : 0,
            averageOverdueRate: performanceData.length > 0 ? 
              parseFloat((performanceData.reduce((sum, p) => sum + p.metrics.tasks.overdueRate, 0) / performanceData.length).toFixed(2)) : 0,
            topPerformers: performanceData.slice(0, 3),
            needsImprovement: performanceData.slice(-3).reverse()
          }
        }
      });
    } catch (error) {
      console.error('Get team performance error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Helper: Check team management
   */
  async checkTeamManagement(managerId, teamMemberId) {
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

      const teamMember = await User.findByPk(teamMemberId);

      if (!manager || !teamMember) return false;

      // Check if manager is system admin or company admin
      const managerRoles = manager.Roles.map(r => r.name);
      if (managerRoles.includes(ROLES.SYSTEM_ADMIN) || managerRoles.includes(ROLES.COMPANY_ADMIN)) {
        return manager.companyId === teamMember.companyId;
      }

      // Check portfolio management
      if (manager.ManagedPortfolios && manager.ManagedPortfolios.length > 0) {
        const managedPortfolioIds = manager.ManagedPortfolios.map(p => p.id);
        
        // Check if team member is assigned to managed portfolios
        const teamMemberAssignments = await teamMember.getAssignedPortfolios();
        const teamMemberPortfolioIds = teamMemberAssignments.map(p => p.id);
        
        const hasCommonPortfolio = teamMemberPortfolioIds.some(id => 
          managedPortfolioIds.includes(id)
        );
        
        if (hasCommonPortfolio) return true;
      }

      // Check property management
      if (manager.ManagedProperties && manager.ManagedProperties.length > 0) {
        const managedPropertyIds = manager.ManagedProperties.map(p => p.id);
        
        // Check if team member is assigned to managed properties
        const teamMemberAssignments = await teamMember.getAssignedProperties();
        const teamMemberPropertyIds = teamMemberAssignments.map(p => p.id);
        
        const hasCommonProperty = teamMemberPropertyIds.some(id => 
          managedPropertyIds.includes(id)
        );
        
        if (hasCommonProperty) return true;
      }

      return false;
    } catch (error) {
      console.error('Check team management error:', error);
      return false;
    }
  }

  /**
   * Helper: Check portfolio management
   */
  async checkPortfolioManagement(userId, portfolioId) {
    try {
      const user = await User.findByPk(userId, {
        include: [{
          model: Portfolio,
          as: 'ManagedPortfolios',
          where: { id: portfolioId }
        }]
      });
      return user && user.ManagedPortfolios.length > 0;
    } catch (error) {
      console.error('Check portfolio management error:', error);
      return false;
    }
  }

  /**
   * Helper: Check property management
   */
  async checkPropertyManagement(userId, propertyId, type = 'property') {
    try {
      if (type === 'property') {
        const user = await User.findByPk(userId, {
          include: [{
            model: Property,
            as: 'ManagedProperties',
            where: { id: propertyId }
          }]
        });
        return user && user.ManagedProperties.length > 0;
      } else if (type === 'portfolio') {
        // Check if user manages the portfolio that contains the property
        const property = await Property.findByPk(propertyId, {
          include: [{
            model: Portfolio
          }]
        });

        if (!property || !property.Portfolio) return false;

        const user = await User.findByPk(userId, {
          include: [{
            model: Portfolio,
            as: 'ManagedPortfolios',
            where: { id: property.Portfolio.id }
          }]
        });
        return user && user.ManagedPortfolios.length > 0;
      }
      return false;
    } catch (error) {
      console.error('Check property management error:', error);
      return false;
    }
  }

  /**
   * Helper: Check property access
   */
  async checkPropertyAccess(propertyId, userId, userRoles) {
    try {
      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return true;
      }

      const property = await Property.findByPk(propertyId);
      if (!property) return false;

      if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        return user.companyId === property.companyId;
      }

      if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Portfolio,
            as: 'ManagedPortfolios'
          }]
        });
        
        if (user.ManagedPortfolios && user.ManagedPortfolios.length > 0) {
          const managedPortfolioIds = user.ManagedPortfolios.map(p => p.id);
          return managedPortfolioIds.includes(property.portfolioId);
        }
        return false;
      }

      if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Property,
            as: 'ManagedProperties'
          }]
        });
        
        if (user.ManagedProperties && user.ManagedProperties.length > 0) {
          const managedPropertyIds = user.ManagedProperties.map(p => p.id);
          return managedPropertyIds.includes(property.id);
        }
        return false;
      }

      return false;
    } catch (error) {
      console.error('Check property access error:', error);
      return false;
    }
  }

  /**
   * Helper: Check portfolio access
   */
  async checkPortfolioAccess(portfolioId, userId, userRoles) {
    try {
      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return true;
      }

      const portfolio = await Portfolio.findByPk(portfolioId);
      if (!portfolio) return false;

      if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        return user.companyId === portfolio.companyId;
      }

      if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Portfolio,
            as: 'ManagedPortfolios'
          }]
        });
        
        if (user.ManagedPortfolios && user.ManagedPortfolios.length > 0) {
          const managedPortfolioIds = user.ManagedPortfolios.map(p => p.id);
          return managedPortfolioIds.includes(portfolio.id);
        }
        return false;
      }

      return false;
    } catch (error) {
      console.error('Check portfolio access error:', error);
      return false;
    }
  }

  /**
   * Helper: Calculate performance rating
   */
  calculatePerformanceRating(completionRate, overdueRate, averageCompletionTime) {
    // Weighted rating calculation
    const completionScore = completionRate * 0.5; // 50% weight
    const overduePenalty = overdueRate * 0.3; // 30% penalty for overdue tasks
    const timeScore = Math.max(0, 100 - (averageCompletionTime * 10)) * 0.2; // 20% weight for completion time
    
    let rating = completionScore - overduePenalty + timeScore;
    
    // Normalize to 0-100 scale
    rating = Math.max(0, Math.min(100, rating));
    
    return parseFloat(rating.toFixed(2));
  }
}

module.exports = new TeamController();