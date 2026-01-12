const { Op } = require('sequelize');
const { Portfolio, Property, Company, User, AuditLog } = require('../../models');
const { validatePortfolio, validatePortfolioUpdate } = require('../../utils/validators/management.validator');
const { ROLES } = require('../../utils/constants/roles');

/**
 * Portfolio Management Controller
 * Handles portfolio CRUD operations and management
 */
class PortfolioController {
  /**
   * Get All Portfolios
   */
  async getAllPortfolios(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        search, 
        status, 
        companyId,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        includeStats = false
      } = req.query;

      const offset = (page - 1) * limit;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Build where clause based on permissions
      let whereClause = {};

      // System admin can see all portfolios
      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        // No restrictions
      }
      // Company admin can see portfolios in their company
      else if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        if (user && user.companyId) {
          whereClause.companyId = user.companyId;
        } else {
          return res.status(403).json({ error: 'Not authorized to view portfolios' });
        }
      }
      // Portfolio manager can see portfolios they manage
      else if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Portfolio,
            as: 'ManagedPortfolios'
          }]
        });
        
        if (user.ManagedPortfolios && user.ManagedPortfolios.length > 0) {
          const portfolioIds = user.ManagedPortfolios.map(p => p.id);
          whereClause.id = { [Op.in]: portfolioIds };
        } else {
          return res.status(403).json({ error: 'Not authorized to view portfolios' });
        }
      }
      // Property manager can see portfolios containing properties they manage
      else if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Property,
            as: 'ManagedProperties'
          }]
        });
        
        if (user.ManagedProperties && user.ManagedProperties.length > 0) {
          const propertyIds = user.ManagedProperties.map(p => p.id);
          const properties = await Property.findAll({
            where: { id: { [Op.in]: propertyIds } },
            attributes: ['portfolioId']
          });
          const portfolioIds = [...new Set(properties.map(p => p.portfolioId).filter(id => id))];
          whereClause.id = { [Op.in]: portfolioIds };
        } else {
          return res.status(403).json({ error: 'Not authorized to view portfolios' });
        }
      }
      // Other roles can't view portfolios
      else {
        return res.status(403).json({ error: 'Not authorized to view portfolios' });
      }

      // Apply filters
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }

      if (status) {
        whereClause.status = status;
      }

      if (companyId) {
        whereClause.companyId = companyId;
      }

      // Build include array
      const include = [
        {
          model: Company,
          attributes: ['id', 'name', 'logo']
        }
      ];

      if (includeStats === 'true') {
        include.push({
          model: Property,
          attributes: ['id'],
          required: false
        });
        include.push({
          model: User,
          as: 'Managers',
          attributes: ['id'],
          through: { attributes: [] },
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
          company: portfolio.Company ? {
            id: portfolio.Company.id,
            name: portfolio.Company.name,
            logo: portfolio.Company.logo
          } : null,
          createdAt: portfolio.createdAt,
          updatedAt: portfolio.updatedAt
        };

        if (includeStats === 'true') {
          return {
            ...baseData,
            statistics: {
              properties: portfolio.Properties ? portfolio.Properties.length : 0,
              managers: portfolio.Managers ? portfolio.Managers.length : 0
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
      console.error('Get all portfolios error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Portfolio by ID
   */
  async getPortfolioById(req, res) {
    try {
      const { portfolioId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check portfolio access
      const hasAccess = await this.checkPortfolioAccess(portfolioId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view this portfolio' });
      }

      const portfolio = await Portfolio.findByPk(portfolioId, {
        include: [
          {
            model: Company,
            attributes: ['id', 'name', 'logo', 'email', 'phone']
          },
          {
            model: User,
            as: 'Managers',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'phone'],
            through: { attributes: [] }
          },
          {
            model: Property,
            attributes: ['id', 'name', 'address', 'city', 'state', 'type', 'status', 'monthlyRent', 'bedrooms', 'bathrooms'],
            include: [{
              model: Unit,
              attributes: ['id', 'unitNumber', 'status', 'monthlyRent']
            }]
          }
        ]
      });

      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      // Calculate portfolio statistics
      const totalProperties = portfolio.Properties.length;
      const occupiedProperties = portfolio.Properties.filter(p => p.status === 'occupied').length;
      const vacantProperties = portfolio.Properties.filter(p => p.status === 'vacant').length;
      
      // Calculate total units and occupied units
      let totalUnits = 0;
      let occupiedUnits = 0;
      let totalMonthlyRevenue = 0;

      portfolio.Properties.forEach(property => {
        totalMonthlyRevenue += property.monthlyRent || 0;
        if (property.Units) {
          totalUnits += property.Units.length;
          occupiedUnits += property.Units.filter(unit => unit.status === 'occupied').length;
        }
      });

      // Get portfolio performance (last 6 months)
      const performance = await this.getPortfolioPerformance(portfolioId);

      // Format response
      const portfolioData = {
        id: portfolio.id,
        name: portfolio.name,
        description: portfolio.description,
        status: portfolio.status,
        settings: portfolio.settings || {},
        metadata: portfolio.metadata || {},
        company: portfolio.Company ? {
          id: portfolio.Company.id,
          name: portfolio.Company.name,
          logo: portfolio.Company.logo,
          email: portfolio.Company.email,
          phone: portfolio.Company.phone
        } : null,
        managers: portfolio.Managers.map(manager => ({
          id: manager.id,
          name: `${manager.firstName} ${manager.lastName}`,
          email: manager.email,
          avatar: manager.avatar,
          phone: manager.phone
        })),
        statistics: {
          properties: {
            total: totalProperties,
            occupied: occupiedProperties,
            vacant: vacantProperties,
            underMaintenance: totalProperties - occupiedProperties - vacantProperties,
            occupancyRate: totalProperties > 0 ? ((occupiedProperties / totalProperties) * 100).toFixed(2) + '%' : '0%'
          },
          units: {
            total: totalUnits,
            occupied: occupiedUnits,
            vacant: totalUnits - occupiedUnits,
            occupancyRate: totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(2) + '%' : '0%'
          },
          financial: {
            totalMonthlyRevenue: totalMonthlyRevenue.toFixed(2),
            projectedAnnualRevenue: (totalMonthlyRevenue * 12).toFixed(2),
            averageRentPerProperty: totalProperties > 0 ? (totalMonthlyRevenue / totalProperties).toFixed(2) : '0',
            averageRentPerUnit: totalUnits > 0 ? (totalMonthlyRevenue / totalUnits).toFixed(2) : '0'
          },
          performance
        },
        properties: portfolio.Properties.map(property => ({
          id: property.id,
          name: property.name,
          address: property.address,
          city: property.city,
          state: property.state,
          type: property.type,
          status: property.status,
          monthlyRent: property.monthlyRent,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          units: property.Units ? {
            total: property.Units.length,
            occupied: property.Units.filter(unit => unit.status === 'occupied').length
          } : { total: 0, occupied: 0 }
        })),
        createdAt: portfolio.createdAt,
        updatedAt: portfolio.updatedAt
      };

      res.json({
        success: true,
        data: portfolioData
      });
    } catch (error) {
      console.error('Get portfolio by ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Create Portfolio
   */
  async createPortfolio(req, res) {
    try {
      const { error } = validatePortfolio(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const userId = req.user.id;
      const userRoles = req.user.roles;

      const { 
        name, 
        description, 
        companyId, 
        managerIds,
        settings
      } = req.body;

      // Check permissions
      let targetCompanyId = companyId;

      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        // System admin can create portfolio for any company
        if (!companyId) {
          return res.status(400).json({ error: 'Company ID is required' });
        }
        const company = await Company.findByPk(companyId);
        if (!company) {
          return res.status(404).json({ error: 'Company not found' });
        }
      } else if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        // Company admin can only create portfolio for their company
        const user = await User.findByPk(userId);
        if (!user || !user.companyId) {
          return res.status(403).json({ error: 'Not authorized to create portfolios' });
        }
        targetCompanyId = user.companyId;
      } else if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        // Portfolio manager cannot create portfolios
        return res.status(403).json({ error: 'Not authorized to create portfolios' });
      } else {
        return res.status(403).json({ error: 'Not authorized to create portfolios' });
      }

      // Check if portfolio name already exists in company
      const existingPortfolio = await Portfolio.findOne({
        where: { 
          companyId: targetCompanyId,
          name 
        }
      });

      if (existingPortfolio) {
        return res.status(409).json({ error: 'Portfolio with this name already exists in this company' });
      }

      // Create portfolio
      const portfolio = await Portfolio.create({
        name,
        description: description || '',
        companyId: targetCompanyId,
        status: 'active',
        settings: settings || {},
        metadata: {
          createdBy: userId,
          createdAt: new Date()
        },
        createdBy: userId
      });

      // Assign managers if provided
      if (managerIds && managerIds.length > 0) {
        // Verify managers belong to the same company
        const managers = await User.findAll({
          where: { 
            id: { [Op.in]: managerIds },
            companyId: targetCompanyId
          }
        });

        if (managers.length > 0) {
          await portfolio.setManagers(managers.map(m => m.id));
        }
      }

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'PORTFOLIO_CREATED',
        details: `Portfolio created: ${name}`,
        ipAddress: req.ip,
        metadata: { 
          portfolioId: portfolio.id,
          companyId: targetCompanyId,
          managerCount: managerIds ? managerIds.length : 0
        }
      });

      res.status(201).json({
        success: true,
        message: 'Portfolio created successfully',
        data: {
          id: portfolio.id,
          name: portfolio.name,
          companyId: portfolio.companyId,
          status: portfolio.status
        }
      });
    } catch (error) {
      console.error('Create portfolio error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update Portfolio
   */
  async updatePortfolio(req, res) {
    try {
      const { portfolioId } = req.params;
      const { error } = validatePortfolioUpdate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check portfolio access
      const hasAccess = await this.checkPortfolioAccess(portfolioId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to update this portfolio' });
      }

      const portfolio = await Portfolio.findByPk(portfolioId);
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      const { 
        name, 
        description, 
        status, 
        managerIds,
        settings
      } = req.body;

      // Track changes for audit
      const changes = {};

      // Update basic info
      if (name !== undefined && name !== portfolio.name) {
        // Check if new name already exists in company
        const existingPortfolio = await Portfolio.findOne({
          where: { 
            companyId: portfolio.companyId,
            name,
            id: { [Op.ne]: portfolioId }
          }
        });

        if (existingPortfolio) {
          return res.status(409).json({ 
            error: 'Portfolio with this name already exists in this company' 
          });
        }

        changes.name = { from: portfolio.name, to: name };
        portfolio.name = name;
      }

      if (description !== undefined && description !== portfolio.description) {
        changes.description = { from: portfolio.description, to: description };
        portfolio.description = description;
      }

      if (status !== undefined && status !== portfolio.status) {
        changes.status = { from: portfolio.status, to: status };
        portfolio.status = status;
      }

      if (settings !== undefined) {
        const currentSettings = portfolio.settings || {};
        portfolio.settings = { ...currentSettings, ...settings };
        changes.settings = { updated: Object.keys(settings) };
      }

      // Update last updated by
      portfolio.updatedBy = userId;
      await portfolio.save();

      // Update managers if provided
      if (managerIds !== undefined) {
        const currentManagers = await portfolio.getManagers();
        const currentManagerIds = currentManagers.map(m => m.id);
        
        if (JSON.stringify(managerIds.sort()) !== JSON.stringify(currentManagerIds.sort())) {
          await portfolio.setManagers(managerIds);
          changes.managers = { 
            from: currentManagerIds, 
            to: managerIds 
          };
        }
      }

      // Create audit log if changes were made
      if (Object.keys(changes).length > 0) {
        await AuditLog.create({
          userId,
          action: 'PORTFOLIO_UPDATED',
          details: `Portfolio updated: ${portfolio.name}`,
          ipAddress: req.ip,
          metadata: { 
            portfolioId: portfolio.id, 
            changes 
          }
        });
      }

      res.json({
        success: true,
        message: 'Portfolio updated successfully',
        data: {
          id: portfolio.id,
          name: portfolio.name,
          status: portfolio.status,
          updatedFields: Object.keys(changes)
        }
      });
    } catch (error) {
      console.error('Update portfolio error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Delete Portfolio
   */
  async deletePortfolio(req, res) {
    try {
      const { portfolioId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check portfolio access
      const hasAccess = await this.checkPortfolioAccess(portfolioId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to delete this portfolio' });
      }

      const portfolio = await Portfolio.findByPk(portfolioId, {
        include: [{
          model: Property
        }]
      });

      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      // Check if portfolio has properties
      if (portfolio.Properties && portfolio.Properties.length > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete portfolio with properties. Remove properties first or archive portfolio.' 
        });
      }

      // Soft delete (archive)
      portfolio.status = 'archived';
      portfolio.deletedAt = new Date();
      portfolio.deletedBy = userId;
      await portfolio.save();

      // Remove managers
      await portfolio.setManagers([]);

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'PORTFOLIO_DELETED',
        details: `Portfolio archived: ${portfolio.name}`,
        ipAddress: req.ip,
        metadata: { portfolioId: portfolio.id }
      });

      res.json({
        success: true,
        message: 'Portfolio archived successfully'
      });
    } catch (error) {
      console.error('Delete portfolio error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Portfolio Properties
   */
  async getPortfolioProperties(req, res) {
    try {
      const { portfolioId } = req.params;
      const { 
        page = 1, 
        limit = 20, 
        search, 
        status, 
        type,
        minRent,
        maxRent,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check portfolio access
      const hasAccess = await this.checkPortfolioAccess(portfolioId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view properties for this portfolio' });
      }

      let whereClause = { portfolioId };

      // Apply filters
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } },
          { city: { [Op.like]: `%${search}%` } }
        ];
      }

      if (status) {
        whereClause.status = status;
      }

      if (type) {
        whereClause.type = type;
      }

      if (minRent) {
        whereClapse.monthlyRent = { [Op.gte]: parseFloat(minRent) };
      }

      if (maxRent) {
        whereClapse.monthlyRent = { ...whereClapse.monthlyRent, [Op.lte]: parseFloat(maxRent) };
      }

      const { count, rows: properties } = await Property.findAndCountAll({
        where: whereClause,
        include: [{
          model: Unit,
          attributes: ['id'],
          required: false
        }],
        distinct: true,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Format response
      const formattedProperties = properties.map(property => ({
        id: property.id,
        name: property.name,
        address: property.address,
        city: property.city,
        state: property.state,
        type: property.type,
        status: property.status,
        monthlyRent: property.monthlyRent,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.squareFeet,
        unitCount: property.Units ? property.Units.length : 0,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt
      }));

      res.json({
        success: true,
        data: {
          properties: formattedProperties,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get portfolio properties error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Portfolio Managers
   */
  async getPortfolioManagers(req, res) {
    try {
      const { portfolioId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check portfolio access
      const hasAccess = await this.checkPortfolioAccess(portfolioId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view managers for this portfolio' });
      }

      const portfolio = await Portfolio.findByPk(portfolioId, {
        include: [{
          model: User,
          as: 'Managers',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'phone', 'isActive'],
          through: { attributes: [] }
        }]
      });

      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      res.json({
        success: true,
        data: {
          managers: portfolio.Managers.map(manager => ({
            id: manager.id,
            name: `${manager.firstName} ${manager.lastName}`,
            email: manager.email,
            avatar: manager.avatar,
            phone: manager.phone,
            isActive: manager.isActive
          }))
        }
      });
    } catch (error) {
      console.error('Get portfolio managers error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Add Portfolio Manager
   */
  async addPortfolioManager(req, res) {
    try {
      const { portfolioId } = req.params;
      const { userId: managerId } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (!managerId) {
        return res.status(400).json({ error: 'Manager user ID is required' });
      }

      // Check portfolio access
      const hasAccess = await this.checkPortfolioAccess(portfolioId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to modify managers for this portfolio' });
      }

      const portfolio = await Portfolio.findByPk(portfolioId);
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      const manager = await User.findByPk(managerId);
      if (!manager) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if manager belongs to the same company
      if (manager.companyId !== portfolio.companyId) {
        return res.status(400).json({ 
          error: 'User does not belong to the same company as the portfolio' 
        });
      }

      // Check if already a manager
      const currentManagers = await portfolio.getManagers();
      const isAlreadyManager = currentManagers.some(m => m.id === managerId);

      if (isAlreadyManager) {
        return res.status(409).json({ error: 'User is already a manager of this portfolio' });
      }

      // Add manager
      await portfolio.addManager(managerId);

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'PORTFOLIO_MANAGER_ADDED',
        details: `Manager added to portfolio: ${portfolio.name}`,
        ipAddress: req.ip,
        metadata: { 
          portfolioId: portfolio.id,
          managerId,
          managerName: `${manager.firstName} ${manager.lastName}`
        }
      });

      res.json({
        success: true,
        message: 'Manager added to portfolio successfully',
        data: {
          portfolioId: portfolio.id,
          manager: {
            id: manager.id,
            name: `${manager.firstName} ${manager.lastName}`,
            email: manager.email
          }
        }
      });
    } catch (error) {
      console.error('Add portfolio manager error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Remove Portfolio Manager
   */
  async removePortfolioManager(req, res) {
    try {
      const { portfolioId, managerId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check portfolio access
      const hasAccess = await this.checkPortfolioAccess(portfolioId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to modify managers for this portfolio' });
      }

      const portfolio = await Portfolio.findByPk(portfolioId);
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      const manager = await User.findByPk(managerId);
      if (!manager) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if is a manager
      const currentManagers = await portfolio.getManagers();
      const isManager = currentManagers.some(m => m.id === parseInt(managerId));

      if (!isManager) {
        return res.status(400).json({ error: 'User is not a manager of this portfolio' });
      }

      // Remove manager
      await portfolio.removeManager(managerId);

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'PORTFOLIO_MANAGER_REMOVED',
        details: `Manager removed from portfolio: ${portfolio.name}`,
        ipAddress: req.ip,
        metadata: { 
          portfolioId: portfolio.id,
          managerId,
          managerName: `${manager.firstName} ${manager.lastName}`
        }
      });

      res.json({
        success: true,
        message: 'Manager removed from portfolio successfully',
        data: {
          portfolioId: portfolio.id,
          managerId: manager.id
        }
      });
    } catch (error) {
      console.error('Remove portfolio manager error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Portfolio Statistics
   */
  async getPortfolioStats(req, res) {
    try {
      const { portfolioId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check portfolio access
      const hasAccess = await this.checkPortfolioAccess(portfolioId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view statistics for this portfolio' });
      }

      const portfolio = await Portfolio.findByPk(portfolioId, {
        include: [
          {
            model: Property,
            include: [{
              model: Unit
            }]
          },
          {
            model: User,
            as: 'Managers',
            attributes: ['id']
          }
        ]
      });

      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      // Calculate statistics
      const totalProperties = portfolio.Properties.length;
      const occupiedProperties = portfolio.Properties.filter(p => p.status === 'occupied').length;
      const vacantProperties = portfolio.Properties.filter(p => p.status === 'vacant').length;
      
      let totalUnits = 0;
      let occupiedUnits = 0;
      let totalMonthlyRevenue = 0;

      portfolio.Properties.forEach(property => {
        totalMonthlyRevenue += property.monthlyRent || 0;
        if (property.Units) {
          totalUnits += property.Units.length;
          occupiedUnits += property.Units.filter(unit => unit.status === 'occupied').length;
        }
      });

      // Calculate growth (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newProperties = portfolio.Properties.filter(property => 
        new Date(property.createdAt) >= thirtyDaysAgo
      ).length;

      // Get maintenance requests (last 30 days)
      const propertyIds = portfolio.Properties.map(p => p.id);
      let maintenanceCount = 0;
      let completedMaintenance = 0;

      if (propertyIds.length > 0) {
        maintenanceCount = await MaintenanceRequest.count({
          where: { 
            propertyId: { [Op.in]: propertyIds },
            createdAt: { [Op.gte]: thirtyDaysAgo }
          }
        });

        completedMaintenance = await MaintenanceRequest.count({
          where: { 
            propertyId: { [Op.in]: propertyIds },
            status: 'completed',
            createdAt: { [Op.gte]: thirtyDaysAgo }
          }
        });
      }

      res.json({
        success: true,
        data: {
          overview: {
            totalProperties,
            totalUnits,
            totalMonthlyRevenue: totalMonthlyRevenue.toFixed(2),
            managers: portfolio.Managers.length
          },
          occupancy: {
            properties: {
              occupied: occupiedProperties,
              vacant: vacantProperties,
              other: totalProperties - occupiedProperties - vacantProperties,
              rate: totalProperties > 0 ? ((occupiedProperties / totalProperties) * 100).toFixed(2) + '%' : '0%'
            },
            units: {
              occupied: occupiedUnits,
              vacant: totalUnits - occupiedUnits,
              rate: totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(2) + '%' : '0%'
            }
          },
          financial: {
            totalMonthlyRevenue: totalMonthlyRevenue.toFixed(2),
            projectedAnnualRevenue: (totalMonthlyRevenue * 12).toFixed(2),
            averageRentPerProperty: totalProperties > 0 ? (totalMonthlyRevenue / totalProperties).toFixed(2) : '0',
            averageRentPerUnit: totalUnits > 0 ? (totalMonthlyRevenue / totalUnits).toFixed(2) : '0'
          },
          growth: {
            newProperties,
            newPropertiesRate: totalProperties > 0 ? ((newProperties / totalProperties) * 100).toFixed(2) + '%' : '0%'
          },
          maintenance: {
            totalRequests: maintenanceCount,
            completed: completedMaintenance,
            completionRate: maintenanceCount > 0 ? ((completedMaintenance / maintenanceCount) * 100).toFixed(2) + '%' : '0%'
          }
        }
      });
    } catch (error) {
      console.error('Get portfolio stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Portfolio Performance
   */
  async getPortfolioPerformance(portfolioId) {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      // Get properties in portfolio
      const properties = await Property.findAll({
        where: { portfolioId },
        attributes: ['id']
      });

      const propertyIds = properties.map(p => p.id);

      if (propertyIds.length === 0) {
        return [];
      }

      // This would typically query payment data
      // For now, return mock performance data
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push({
          month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
          revenue: Math.floor(Math.random() * 100000) + 50000,
          occupancy: Math.floor(Math.random() * 30) + 70,
          expenses: Math.floor(Math.random() * 30000) + 20000
        });
      }

      return months;
    } catch (error) {
      console.error('Get portfolio performance error:', error);
      return [];
    }
  }

  /**
   * Bulk Update Portfolio Properties
   */
  async bulkUpdateProperties(req, res) {
    try {
      const { portfolioId } = req.params;
      const { propertyIds, updates } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (!Array.isArray(propertyIds) || propertyIds.length === 0) {
        return res.status(400).json({ error: 'Property IDs array is required' });
      }

      if (!updates || typeof updates !== 'object') {
        return res.status(400).json({ error: 'Updates object is required' });
      }

      // Check portfolio access
      const hasAccess = await this.checkPortfolioAccess(portfolioId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to update properties in this portfolio' });
      }

      // Limit bulk operations
      if (propertyIds.length > 100) {
        return res.status(400).json({ error: 'Maximum 100 properties per bulk update' });
      }

      const results = {
        success: [],
        failed: []
      };

      // Process each property
      for (const propertyId of propertyIds) {
        try {
          const property = await Property.findOne({
            where: { 
              id: propertyId,
              portfolioId 
            }
          });

          if (!property) {
            results.failed.push({ propertyId, error: 'Property not found in portfolio' });
            continue;
          }

          // Apply updates
          const allowedUpdates = ['status', 'monthlyRent', 'managedById'];
          let updatedFields = [];

          for (const key in updates) {
            if (allowedUpdates.includes(key) && updates[key] !== property[key]) {
              property[key] = updates[key];
              updatedFields.push(key);
            }
          }

          if (updatedFields.length > 0) {
            property.updatedBy = userId;
            await property.save();
            results.success.push({ propertyId, updatedFields });
          } else {
            results.success.push({ propertyId, updatedFields: [] });
          }
        } catch (error) {
          console.error(`Failed to update property ${propertyId}:`, error);
          results.failed.push({ propertyId, error: error.message });
        }
      }

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'BULK_PORTFOLIO_PROPERTIES_UPDATE',
        details: `Bulk properties update for portfolio: ${portfolioId}. Success: ${results.success.length}, Failed: ${results.failed.length}`,
        ipAddress: req.ip,
        metadata: { 
          portfolioId, 
          results,
          updates 
        }
      });

      res.json({
        success: true,
        message: `Bulk update processed. ${results.success.length} updated successfully, ${results.failed.length} failed.`,
        data: results
      });
    } catch (error) {
      console.error('Bulk update portfolio properties error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Move Properties Between Portfolios
   */
  async moveProperties(req, res) {
    try {
      const { portfolioId } = req.params;
      const { propertyIds, targetPortfolioId } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (!Array.isArray(propertyIds) || propertyIds.length === 0) {
        return res.status(400).json({ error: 'Property IDs array is required' });
      }

      if (!targetPortfolioId) {
        return res.status(400).json({ error: 'Target portfolio ID is required' });
      }

      // Check source portfolio access
      const hasSourceAccess = await this.checkPortfolioAccess(portfolioId, userId, userRoles);
      if (!hasSourceAccess) {
        return res.status(403).json({ error: 'Not authorized to move properties from this portfolio' });
      }

      // Check target portfolio access
      const hasTargetAccess = await this.checkPortfolioAccess(targetPortfolioId, userId, userRoles);
      if (!hasTargetAccess) {
        return res.status(403).json({ error: 'Not authorized to move properties to this portfolio' });
      }

      // Verify portfolios belong to same company
      const sourcePortfolio = await Portfolio.findByPk(portfolioId);
      const targetPortfolio = await Portfolio.findByPk(targetPortfolioId);

      if (!sourcePortfolio || !targetPortfolio) {
        return res.status(404).json({ error: 'One or both portfolios not found' });
      }

      if (sourcePortfolio.companyId !== targetPortfolio.companyId) {
        return res.status(400).json({ 
          error: 'Cannot move properties between portfolios in different companies' 
        });
      }

      const results = {
        success: [],
        failed: []
      };

      // Process each property
      for (const propertyId of propertyIds) {
        try {
          const property = await Property.findOne({
            where: { 
              id: propertyId,
              portfolioId 
            }
          });

          if (!property) {
            results.failed.push({ propertyId, error: 'Property not found in source portfolio' });
            continue;
          }

          // Update property portfolio
          property.portfolioId = targetPortfolioId;
          property.updatedBy = userId;
          await property.save();

          results.success.push({ propertyId });
        } catch (error) {
          console.error(`Failed to move property ${propertyId}:`, error);
          results.failed.push({ propertyId, error: error.message });
        }
      }

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'PROPERTIES_MOVED_BETWEEN_PORTFOLIOS',
        details: `Properties moved from portfolio ${sourcePortfolio.name} to ${targetPortfolio.name}`,
        ipAddress: req.ip,
        metadata: { 
          sourcePortfolioId: portfolioId,
          targetPortfolioId,
          results 
        }
      });

      res.json({
        success: true,
        message: `Properties moved. ${results.success.length} moved successfully, ${results.failed.length} failed.`,
        data: results
      });
    } catch (error) {
      console.error('Move properties error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Helper: Check portfolio access
   */
  async checkPortfolioAccess(portfolioId, userId, userRoles) {
    try {
      // System admin has access to all portfolios
      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return true;
      }

      const portfolio = await Portfolio.findByPk(portfolioId);
      if (!portfolio) return false;

      // Company admin has access to portfolios in their company
      if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        return user.companyId === portfolio.companyId;
      }

      // Portfolio manager has access if they manage the portfolio
      if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{
            model: Portfolio,
            as: 'ManagedPortfolios',
            where: { id: portfolioId }
          }]
        });
        return user && user.ManagedPortfolios.length > 0;
      }

      // Property manager has access if they manage a property in the portfolio
      if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{
            model: Property,
            as: 'ManagedProperties',
            where: { portfolioId }
          }]
        });
        return user && user.ManagedProperties.length > 0;
      }

      return false;
    } catch (error) {
      console.error('Check portfolio access error:', error);
      return false;
    }
  }
}

module.exports = new PortfolioController();