const { Op } = require('sequelize');
const { Company, Portfolio, Property, User, AuditLog, Invitation } = require('../../models');
const { validateCompany, validateCompanyUpdate } = require('../../utils/validators/management.validator');
const { ROLES } = require('../../utils/constants/roles');

/**
 * Company Management Controller
 * Handles company CRUD operations and management
 */
class CompanyController {
  /**
   * Get All Companies (System Admin only)
   */
  async getAllCompanies(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        search, 
        status, 
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        includeStats = false
      } = req.query;

      const offset = (page - 1) * limit;
      const userRoles = req.user.roles;

      // Only system admin can view all companies
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to view companies' });
      }

      let whereClause = {};

      // Apply filters
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } }
        ];
      }

      if (status) {
        whereClause.status = status;
      }

      // Build include array
      const include = [];

      if (includeStats === 'true') {
        include.push({
          model: User,
          attributes: ['id'],
          required: false
        });
        include.push({
          model: Portfolio,
          attributes: ['id'],
          required: false
        });
        include.push({
          model: Property,
          attributes: ['id'],
          required: false
        });
      }

      const { count, rows: companies } = await Company.findAndCountAll({
        where: whereClause,
        include: include.length > 0 ? include : [],
        distinct: true,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Format response with statistics if requested
      const formattedCompanies = companies.map(company => {
        const baseData = {
          id: company.id,
          name: company.name,
          email: company.email,
          phone: company.phone,
          address: company.address,
          city: company.city,
          state: company.state,
          zipCode: company.zipCode,
          country: company.country,
          website: company.website,
          logo: company.logo,
          description: company.description,
          status: company.status,
          settings: company.settings,
          subscription: company.subscription,
          createdAt: company.createdAt,
          updatedAt: company.updatedAt
        };

        if (includeStats === 'true') {
          return {
            ...baseData,
            statistics: {
              users: company.Users ? company.Users.length : 0,
              portfolios: company.Portfolios ? company.Portfolios.length : 0,
              properties: company.Properties ? company.Properties.length : 0
            }
          };
        }

        return baseData;
      });

      res.json({
        success: true,
        data: {
          companies: formattedCompanies,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get all companies error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Company by ID
   */
  async getCompanyById(req, res) {
    try {
      const { companyId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check company access
      const hasAccess = await this.checkCompanyAccess(companyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view this company' });
      }

      const company = await Company.findByPk(companyId, {
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'isActive'],
            include: [{
              model: Role,
              through: { attributes: [] },
              attributes: ['name']
            }]
          },
          {
            model: Portfolio,
            attributes: ['id', 'name', 'description', 'status'],
            include: [{
              model: Property,
              attributes: ['id', 'name', 'address', 'city', 'state', 'status'],
              limit: 5
            }]
          },
          {
            model: Property,
            attributes: ['id', 'name', 'address', 'city', 'state', 'type', 'status', 'monthlyRent'],
            limit: 10,
            order: [['createdAt', 'DESC']]
          }
        ]
      });

      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      // Calculate company statistics
      const totalUsers = company.Users.length;
      const activeUsers = company.Users.filter(user => user.isActive).length;
      const totalPortfolios = company.Portfolios.length;
      const totalProperties = company.Properties.length;
      
      // Calculate total monthly revenue
      const totalMonthlyRevenue = company.Properties.reduce((sum, property) => {
        return sum + (property.monthlyRent || 0);
      }, 0);

      // Get company admins
      const companyAdmins = company.Users.filter(user => 
        user.Roles.some(role => role.name === ROLES.COMPANY_ADMIN)
      );

      // Format response
      const companyData = {
        id: company.id,
        name: company.name,
        email: company.email,
        phone: company.phone,
        address: company.address,
        city: company.city,
        state: company.state,
        zipCode: company.zipCode,
        country: company.country,
        website: company.website,
        logo: company.logo,
        description: company.description,
        status: company.status,
        settings: company.settings || {},
        subscription: company.subscription || {},
        billing: company.billing || {},
        metadata: company.metadata || {},
        statistics: {
          users: {
            total: totalUsers,
            active: activeUsers,
            inactive: totalUsers - activeUsers,
            admins: companyAdmins.length
          },
          portfolios: {
            total: totalPortfolios,
            active: company.Portfolios.filter(p => p.status === 'active').length,
            archived: company.Portfolios.filter(p => p.status === 'archived').length
          },
          properties: {
            total: totalProperties,
            occupied: company.Properties.filter(p => p.status === 'occupied').length,
            vacant: company.Properties.filter(p => p.status === 'vacant').length,
            underMaintenance: company.Properties.filter(p => p.status === 'maintenance').length
          },
          financial: {
            totalMonthlyRevenue,
            projectedAnnualRevenue: totalMonthlyRevenue * 12,
            averageRentPerProperty: totalProperties > 0 ? totalMonthlyRevenue / totalProperties : 0
          }
        },
        users: company.Users.map(user => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          avatar: user.avatar,
          isActive: user.isActive,
          roles: user.Roles.map(role => role.name)
        })),
        portfolios: company.Portfolios.map(portfolio => ({
          id: portfolio.id,
          name: portfolio.name,
          description: portfolio.description,
          status: portfolio.status,
          propertyCount: portfolio.Properties.length,
          properties: portfolio.Properties.map(property => ({
            id: property.id,
            name: property.name,
            address: property.address,
            city: property.city,
            state: property.state,
            status: property.status
          }))
        })),
        recentProperties: company.Properties.map(property => ({
          id: property.id,
          name: property.name,
          address: property.address,
          city: property.city,
          state: property.state,
          type: property.type,
          status: property.status,
          monthlyRent: property.monthlyRent
        })),
        createdAt: company.createdAt,
        updatedAt: company.updatedAt
      };

      res.json({
        success: true,
        data: companyData
      });
    } catch (error) {
      console.error('Get company by ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Create Company (System Admin only)
   */
  async createCompany(req, res) {
    try {
      const { error } = validateCompany(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const userRoles = req.user.roles;

      // Only system admin can create companies
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to create companies' });
      }

      const { 
        name, 
        email, 
        phone, 
        address, 
        city, 
        state, 
        zipCode, 
        country, 
        website, 
        logo, 
        description,
        adminEmail,
        adminFirstName,
        adminLastName,
        adminPassword
      } = req.body;

      // Check if company already exists
      const existingCompany = await Company.findOne({
        where: { 
          [Op.or]: [
            { name },
            { email }
          ]
        }
      });

      if (existingCompany) {
        return res.status(409).json({ 
          error: 'Company with this name or email already exists' 
        });
      }

      // Create company
      const company = await Company.create({
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
        country: country || null,
        website: website || null,
        logo: logo || null,
        description: description || '',
        status: 'active',
        settings: {},
        subscription: {
          plan: 'free',
          status: 'active',
          startDate: new Date(),
          usersLimit: 5,
          propertiesLimit: 10
        },
        billing: {},
        metadata: {},
        createdBy: req.user.id
      });

      // Create admin user if provided
      let adminUser = null;
      if (adminEmail && adminFirstName && adminLastName && adminPassword) {
        // Check if user exists
        const existingUser = await User.findOne({ where: { email: adminEmail } });
        if (existingUser) {
          // Update existing user to be company admin
          existingUser.companyId = company.id;
          await existingUser.save();
          
          // Assign company admin role
          const companyAdminRole = await Role.findOne({ where: { name: ROLES.COMPANY_ADMIN } });
          if (companyAdminRole) {
            await existingUser.addRole(companyAdminRole.id);
          }
          
          adminUser = existingUser;
        } else {
          // Create new admin user
          const hashedPassword = await bcrypt.hash(adminPassword, 10);
          adminUser = await User.create({
            email: adminEmail,
            password: hashedPassword,
            firstName: adminFirstName,
            lastName: adminLastName,
            companyId: company.id,
            isActive: true,
            emailVerified: true
          });

          // Assign company admin role
          const companyAdminRole = await Role.findOne({ where: { name: ROLES.COMPANY_ADMIN } });
          if (companyAdminRole) {
            await adminUser.addRole(companyAdminRole.id);
          }
        }
      }

      // Create audit log
      await AuditLog.create({
        userId: req.user.id,
        action: 'COMPANY_CREATED',
        details: `Company created: ${name}`,
        ipAddress: req.ip,
        metadata: { 
          companyId: company.id,
          adminCreated: !!adminUser,
          adminEmail: adminUser ? adminUser.email : null
        }
      });

      res.status(201).json({
        success: true,
        message: 'Company created successfully',
        data: {
          id: company.id,
          name: company.name,
          email: company.email,
          status: company.status,
          adminCreated: !!adminUser,
          adminEmail: adminUser ? adminUser.email : null
        }
      });
    } catch (error) {
      console.error('Create company error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update Company
   */
  async updateCompany(req, res) {
    try {
      const { companyId } = req.params;
      const { error } = validateCompanyUpdate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check company access
      const hasAccess = await this.checkCompanyAccess(companyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to update this company' });
      }

      const company = await Company.findByPk(companyId);
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      // Track changes for audit
      const changes = {};

      // Update fields
      const updatableFields = [
        'name', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 
        'country', 'website', 'logo', 'description', 'status', 'settings',
        'subscription', 'billing', 'metadata'
      ];

      updatableFields.forEach(field => {
        if (req.body[field] !== undefined && JSON.stringify(req.body[field]) !== JSON.stringify(company[field])) {
          changes[field] = { from: company[field], to: req.body[field] };
          company[field] = req.body[field];
        }
      });

      // Update last updated by
      company.updatedBy = userId;
      await company.save();

      // Create audit log if changes were made
      if (Object.keys(changes).length > 0) {
        await AuditLog.create({
          userId,
          action: 'COMPANY_UPDATED',
          details: `Company updated: ${company.name}`,
          ipAddress: req.ip,
          metadata: { 
            companyId: company.id, 
            changes 
          }
        });
      }

      res.json({
        success: true,
        message: 'Company updated successfully',
        data: {
          id: company.id,
          name: company.name,
          email: company.email,
          status: company.status,
          updatedFields: Object.keys(changes)
        }
      });
    } catch (error) {
      console.error('Update company error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Delete Company (System Admin only)
   */
  async deleteCompany(req, res) {
    try {
      const { companyId } = req.params;
      const userRoles = req.user.roles;

      // Only system admin can delete companies
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to delete companies' });
      }

      const company = await Company.findByPk(companyId, {
        include: [
          { model: User },
          { model: Portfolio },
          { model: Property }
        ]
      });

      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      // Check if company has active users
      if (company.Users && company.Users.length > 0) {
        const activeUsers = company.Users.filter(user => user.isActive);
        if (activeUsers.length > 0) {
          return res.status(400).json({ 
            error: 'Cannot delete company with active users. Deactivate users first.' 
          });
        }
      }

      // Check if company has portfolios
      if (company.Portfolios && company.Portfolios.length > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete company with portfolios. Delete portfolios first.' 
        });
      }

      // Check if company has properties
      if (company.Properties && company.Properties.length > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete company with properties. Delete properties first.' 
        });
      }

      // Soft delete
      company.status = 'archived';
      company.deletedAt = new Date();
      company.deletedBy = req.user.id;
      await company.save();

      // Create audit log
      await AuditLog.create({
        userId: req.user.id,
        action: 'COMPANY_DELETED',
        details: `Company archived: ${company.name}`,
        ipAddress: req.ip,
        metadata: { companyId: company.id }
      });

      res.json({
        success: true,
        message: 'Company archived successfully'
      });
    } catch (error) {
      console.error('Delete company error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Company Statistics
   */
  async getCompanyStats(req, res) {
    try {
      const { companyId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check company access
      const hasAccess = await this.checkCompanyAccess(companyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view statistics for this company' });
      }

      const company = await Company.findByPk(companyId, {
        include: [
          {
            model: User,
            attributes: ['id', 'isActive', 'createdAt']
          },
          {
            model: Portfolio,
            attributes: ['id', 'status']
          },
          {
            model: Property,
            attributes: ['id', 'status', 'monthlyRent', 'createdAt']
          }
        ]
      });

      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      // Calculate statistics
      const totalUsers = company.Users.length;
      const activeUsers = company.Users.filter(user => user.isActive).length;
      
      const totalPortfolios = company.Portfolios.length;
      const activePortfolios = company.Portfolios.filter(p => p.status === 'active').length;
      
      const totalProperties = company.Properties.length;
      const occupiedProperties = company.Properties.filter(p => p.status === 'occupied').length;
      const vacantProperties = company.Properties.filter(p => p.status === 'vacant').length;
      
      const totalMonthlyRevenue = company.Properties.reduce((sum, property) => {
        return sum + (property.monthlyRent || 0);
      }, 0);

      // Calculate growth (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newUsers = company.Users.filter(user => 
        new Date(user.createdAt) >= thirtyDaysAgo
      ).length;
      
      const newProperties = company.Properties.filter(property => 
        new Date(property.createdAt) >= thirtyDaysAgo
      ).length;

      // Calculate user activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      // This would require tracking user login activity
      // For now, we'll use a simplified approach
      const activeUsersThisWeek = Math.floor(activeUsers * 0.7); // Estimate

      res.json({
        success: true,
        data: {
          overview: {
            totalUsers,
            totalPortfolios,
            totalProperties,
            totalMonthlyRevenue: totalMonthlyRevenue.toFixed(2),
            projectedAnnualRevenue: (totalMonthlyRevenue * 12).toFixed(2)
          },
          users: {
            total: totalUsers,
            active: activeUsers,
            inactive: totalUsers - activeUsers,
            activeThisWeek: activeUsersThisWeek,
            newThisMonth: newUsers,
            growthRate: totalUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(2) + '%' : '0%'
          },
          portfolios: {
            total: totalPortfolios,
            active: activePortfolios,
            archived: totalPortfolios - activePortfolios
          },
          properties: {
            total: totalProperties,
            occupied: occupiedProperties,
            vacant: vacantProperties,
            other: totalProperties - occupiedProperties - vacantProperties,
            occupancyRate: totalProperties > 0 ? ((occupiedProperties / totalProperties) * 100).toFixed(2) + '%' : '0%',
            newThisMonth: newProperties
          },
          financial: {
            totalMonthlyRevenue: totalMonthlyRevenue.toFixed(2),
            averageRentPerProperty: totalProperties > 0 ? (totalMonthlyRevenue / totalProperties).toFixed(2) : '0',
            revenuePerPortfolio: totalPortfolios > 0 ? (totalMonthlyRevenue / totalPortfolios).toFixed(2) : '0'
          }
        }
      });
    } catch (error) {
      console.error('Get company stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Company Activity
   */
  async getCompanyActivity(req, res) {
    try {
      const { companyId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const offset = (page - 1) * limit;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check company access
      const hasAccess = await this.checkCompanyAccess(companyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view activity for this company' });
      }

      // Get company user IDs
      const companyUsers = await User.findAll({
        where: { companyId },
        attributes: ['id']
      });

      const userIds = companyUsers.map(user => user.id);

      if (userIds.length === 0) {
        return res.json({
          success: true,
          data: {
            activities: [],
            pagination: {
              total: 0,
              page: parseInt(page),
              limit: parseInt(limit),
              pages: 0
            }
          }
        });
      }

      const { count, rows: activities } = await AuditLog.findAndCountAll({
        where: { 
          userId: { [Op.in]: userIds }
        },
        include: [{
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }],
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
      console.error('Get company activity error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update Company Settings
   */
  async updateCompanySettings(req, res) {
    try {
      const { companyId } = req.params;
      const { settings } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (!settings || typeof settings !== 'object') {
        return res.status(400).json({ error: 'Settings object is required' });
      }

      // Check company access
      const hasAccess = await this.checkCompanyAccess(companyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to update settings for this company' });
      }

      const company = await Company.findByPk(companyId);
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      // Merge with existing settings
      const currentSettings = company.settings || {};
      company.settings = { ...currentSettings, ...settings };
      company.updatedBy = userId;
      await company.save();

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'COMPANY_SETTINGS_UPDATED',
        details: `Company settings updated: ${company.name}`,
        ipAddress: req.ip,
        metadata: { 
          companyId: company.id, 
          updatedSettings: Object.keys(settings) 
        }
      });

      res.json({
        success: true,
        message: 'Company settings updated successfully',
        data: {
          settings: company.settings
        }
      });
    } catch (error) {
      console.error('Update company settings error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update Company Subscription
   */
  async updateCompanySubscription(req, res) {
    try {
      const { companyId } = req.params;
      const { subscription } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (!subscription || typeof subscription !== 'object') {
        return res.status(400).json({ error: 'Subscription object is required' });
      }

      // Only system admin can update subscriptions
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to update subscriptions' });
      }

      const company = await Company.findByPk(companyId);
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      // Merge with existing subscription
      const currentSubscription = company.subscription || {};
      company.subscription = { ...currentSubscription, ...subscription };
      company.updatedBy = userId;
      await company.save();

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'COMPANY_SUBSCRIPTION_UPDATED',
        details: `Company subscription updated: ${company.name}`,
        ipAddress: req.ip,
        metadata: { 
          companyId: company.id, 
          updatedSubscription: Object.keys(subscription) 
        }
      });

      res.json({
        success: true,
        message: 'Company subscription updated successfully',
        data: {
          subscription: company.subscription
        }
      });
    } catch (error) {
      console.error('Update company subscription error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Company Users
   */
  async getCompanyUsers(req, res) {
    try {
      const { companyId } = req.params;
      const { 
        page = 1, 
        limit = 20, 
        search, 
        role, 
        status,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check company access
      const hasAccess = await this.checkCompanyAccess(companyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view users for this company' });
      }

      let whereClause = { companyId };

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

      // Build include for role filtering
      let include = [{
        model: Role,
        through: { attributes: [] },
        attributes: ['id', 'name', 'description']
      }];

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
      console.error('Get company users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Company Portfolios
   */
  async getCompanyPortfolios(req, res) {
    try {
      const { companyId } = req.params;
      const { 
        page = 1, 
        limit = 20, 
        search, 
        status,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        includeStats = false
      } = req.query;

      const offset = (page - 1) * limit;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check company access
      const hasAccess = await this.checkCompanyAccess(companyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view portfolios for this company' });
      }

      let whereClause = { companyId };

      // Apply filters
      if (search) {
        whereClause.name = { [Op.like]: `%${search}%` };
      }

      if (status) {
        whereClause.status = status;
      }

      // Build include array
      const include = [];

      if (includeStats === 'true') {
        include.push({
          model: Property,
          attributes: ['id'],
          required: false
        });
      }

      const { count, rows: portfolios } = await Portfolio.findAndCountAll({
        where: whereClause,
        include: include.length > 0 ? include : [],
        distinct: true,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Format response with statistics if requested
      const formattedPortfolios = portfolios.map(portfolio => {
        const baseData = {
          id: portfolio.id,
          name: portfolio.name,
          description: portfolio.description,
          status: portfolio.status,
          settings: portfolio.settings,
          companyId: portfolio.companyId,
          createdAt: portfolio.createdAt,
          updatedAt: portfolio.updatedAt
        };

        if (includeStats === 'true') {
          return {
            ...baseData,
            statistics: {
              properties: portfolio.Properties ? portfolio.Properties.length : 0
            }
          };
        }

        return baseData;
      });

      res.json({
        success: true,
        data: {
          portfolios: formattedPortfolios,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get company portfolios error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Helper: Check company access
   */
  async checkCompanyAccess(companyId, userId, userRoles) {
    try {
      // System admin has access to all companies
      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return true;
      }

      // Company admin has access to their company
      if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        return user.companyId === parseInt(companyId);
      }

      // Portfolio manager has access if they manage a portfolio in the company
      if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{
            model: Portfolio,
            as: 'ManagedPortfolios',
            where: { companyId }
          }]
        });
        return user && user.ManagedPortfolios.length > 0;
      }

      // Property manager has access if they manage a property in the company
      if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{
            model: Property,
            as: 'ManagedProperties',
            where: { companyId }
          }]
        });
        return user && user.ManagedProperties.length > 0;
      }

      return false;
    } catch (error) {
      console.error('Check company access error:', error);
      return false;
    }
  }

  /**
   * Transfer Company Ownership
   */
  async transferOwnership(req, res) {
    try {
      const { companyId } = req.params;
      const { newOwnerId } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (!newOwnerId) {
        return res.status(400).json({ error: 'New owner ID is required' });
      }

      // Only system admin can transfer company ownership
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to transfer company ownership' });
      }

      const company = await Company.findByPk(companyId);
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      const newOwner = await User.findOne({
        where: { 
          id: newOwnerId,
          companyId: companyId
        },
        include: [{
          model: Role,
          through: { attributes: [] },
          where: { name: ROLES.COMPANY_ADMIN }
        }]
      });

      if (!newOwner) {
        return res.status(404).json({ 
          error: 'New owner not found or not a company admin in this company' 
        });
      }

      // Get current company admins
      const currentAdmins = await User.findAll({
        where: { companyId },
        include: [{
          model: Role,
          through: { attributes: [] },
          where: { name: ROLES.COMPANY_ADMIN }
        }]
      });

      // Update metadata with ownership transfer history
      const metadata = company.metadata || {};
      metadata.ownershipHistory = metadata.ownershipHistory || [];
      metadata.ownershipHistory.push({
        from: 'System Admin',
        to: `${newOwner.firstName} ${newOwner.lastName}`,
        transferredBy: `${req.user.firstName} ${req.user.lastName}`,
        transferredAt: new Date()
      });

      company.metadata = metadata;
      company.updatedBy = userId;
      await company.save();

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'COMPANY_OWNERSHIP_TRANSFERRED',
        details: `Company ownership transferred to ${newOwner.firstName} ${newOwner.lastName}`,
        ipAddress: req.ip,
        metadata: { 
          companyId: company.id,
          previousOwner: 'System Admin',
          newOwner: newOwnerId,
          newOwnerName: `${newOwner.firstName} ${newOwner.lastName}`
        }
      });

      res.json({
        success: true,
        message: 'Company ownership transferred successfully',
        data: {
          companyId: company.id,
          companyName: company.name,
          newOwner: {
            id: newOwner.id,
            name: `${newOwner.firstName} ${newOwner.lastName}`,
            email: newOwner.email
          }
        }
      });
    } catch (error) {
      console.error('Transfer ownership error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new CompanyController();