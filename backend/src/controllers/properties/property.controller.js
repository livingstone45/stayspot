const { Op } = require('sequelize');
const { Property, Unit, PropertyImage, PropertyDocument, Portfolio, Company, User, AuditLog, Tenant, Lease, MaintenanceRequest } = require('../../models');
const { uploadFile, deleteFile } = require('../../services/file/storage.service');
const { processPropertyImages } = require('../../services/property/ai-processing.service');
const { validateProperty, validatePropertyUpdate } = require('../../utils/validators/property.validator');
const { ROLES } = require('../../utils/constants/roles');

/**
 * Property Management Controller
 * Handles property CRUD operations and management
 */
class PropertyController {
  /**
   * Get All Properties (with filtering and pagination)
   */
  async getAllProperties(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        search, 
        type, 
        status, 
        portfolioId,
        companyId,
        minPrice,
        maxPrice,
        bedrooms,
        bathrooms,
        amenities,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        includeUnits = false,
        includeImages = false
      } = req.query;

      const offset = (page - 1) * limit;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Build where clause based on permissions
      let whereClause = {};
      let propertyWhereClause = {};

      // System admin can see all properties
      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        // No restrictions
      }
      // Company admin can see properties in their company
      else if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId, { include: [{ model: Company }] });
        if (user && user.companyId) {
          propertyWhereClause.companyId = user.companyId;
        } else {
          return res.status(403).json({ error: 'Not authorized to view properties' });
        }
      }
      // Portfolio manager can see properties in their portfolio
      else if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        const user = await User.findByPk(userId, { 
          include: [{ 
            model: Portfolio,
            as: 'ManagedPortfolios'
          }]
        });
        
        if (user.ManagedPortfolios && user.ManagedPortfolios.length > 0) {
          const portfolioIds = user.ManagedPortfolios.map(p => p.id);
          propertyWhereClause.portfolioId = { [Op.in]: portfolioIds };
        } else {
          return res.status(403).json({ error: 'Not authorized to view properties' });
        }
      }
      // Property manager can only see assigned properties
      else if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        const user = await User.findByPk(userId, { 
          include: [{ 
            model: Property,
            as: 'ManagedProperties'
          }]
        });
        
        if (user.ManagedProperties && user.ManagedProperties.length > 0) {
          const propertyIds = user.ManagedProperties.map(p => p.id);
          propertyWhereClause.id = { [Op.in]: propertyIds };
        } else {
          return res.status(403).json({ error: 'Not authorized to view properties' });
        }
      }
      // Landlord can only see their own properties
      else if (userRoles.includes(ROLES.LANDLORD)) {
        propertyWhereClause.ownerId = userId;
      }
      // Other roles can't view properties
      else {
        return res.status(403).json({ error: 'Not authorized to view properties' });
      }

      // Apply filters
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } },
          { city: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }

      if (type) {
        whereClause.type = type;
      }

      if (status) {
        whereClause.status = status;
      }

      if (portfolioId) {
        whereClause.portfolioId = portfolioId;
      }

      if (companyId) {
        whereClause.companyId = companyId;
      }

      if (minPrice) {
        whereClapse.monthlyRent = { [Op.gte]: parseFloat(minPrice) };
      }

      if (maxPrice) {
        whereClapse.monthlyRent = { ...whereClapse.monthlyRent, [Op.lte]: parseFloat(maxPrice) };
      }

      if (bedrooms) {
        whereClapse.bedrooms = parseInt(bedrooms);
      }

      if (bathrooms) {
        whereClapse.bathrooms = parseInt(bathrooms);
      }

      if (amenities) {
        const amenityArray = amenities.split(',');
        whereClapse.amenities = { [Op.overlap]: amenityArray };
      }

      // Merge permission filters with search filters
      const finalWhereClause = { ...propertyWhereClause, ...whereClause };

      // Build include array
      const include = [
        {
          model: Portfolio,
          attributes: ['id', 'name', 'description']
        },
        {
          model: Company,
          attributes: ['id', 'name', 'logo']
        },
        {
          model: User,
          as: 'ManagedBy',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
        }
      ];

      if (includeUnits === 'true') {
        include.push({
          model: Unit,
          attributes: ['id', 'unitNumber', 'type', 'status', 'monthlyRent', 'squareFeet']
        });
      }

      if (includeImages === 'true') {
        include.push({
          model: PropertyImage,
          attributes: ['id', 'url', 'type', 'caption', 'isPrimary'],
          limit: 1,
          where: { isPrimary: true }
        });
      }

      const { count, rows: properties } = await Property.findAndCountAll({
        where: finalWhereClause,
        include: include,
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
        zipCode: property.zipCode,
        country: property.country,
        type: property.type,
        status: property.status,
        monthlyRent: property.monthlyRent,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.squareFeet,
        yearBuilt: property.yearBuilt,
        amenities: property.amenities,
        description: property.description,
        latitude: property.latitude,
        longitude: property.longitude,
        portfolio: property.Portfolio ? {
          id: property.Portfolio.id,
          name: property.Portfolio.name
        } : null,
        company: property.Company ? {
          id: property.Company.id,
          name: property.Company.name,
          logo: property.Company.logo
        } : null,
        managedBy: property.ManagedBy ? {
          id: property.ManagedBy.id,
          name: `${property.ManagedBy.firstName} ${property.ManagedBy.lastName}`,
          email: property.ManagedBy.email,
          avatar: property.ManagedBy.avatar
        } : null,
        primaryImage: property.PropertyImages && property.PropertyImages.length > 0 
          ? property.PropertyImages[0].url 
          : null,
        units: includeUnits === 'true' ? property.Units : undefined,
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
      console.error('Get all properties error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Property by ID
   */
  async getPropertyById(req, res) {
    try {
      const { propertyId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view this property' });
      }

      const property = await Property.findByPk(propertyId, {
        include: [
          {
            model: Portfolio,
            attributes: ['id', 'name', 'description']
          },
          {
            model: Company,
            attributes: ['id', 'name', 'logo', 'phone', 'email']
          },
          {
            model: User,
            as: 'ManagedBy',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'avatar']
          },
          {
            model: User,
            as: 'Owner',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          },
          {
            model: PropertyImage,
            attributes: ['id', 'url', 'type', 'caption', 'isPrimary', 'metadata', 'createdAt'],
            order: [['isPrimary', 'DESC'], ['createdAt', 'DESC']]
          },
          {
            model: PropertyDocument,
            attributes: ['id', 'name', 'url', 'type', 'size', 'uploadedBy', 'createdAt']
          },
          {
            model: Unit,
            include: [{
              model: Tenant,
              include: [{
                model: Lease,
                where: { status: 'active' },
                required: false
              }]
            }]
          }
        ]
      });

      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      // Calculate property statistics
      const totalUnits = property.Units.length;
      const occupiedUnits = property.Units.filter(unit => 
        unit.Tenant && unit.Tenant.Leases && unit.Tenant.Leases.length > 0
      ).length;
      const vacancyRate = totalUnits > 0 ? ((totalUnits - occupiedUnits) / totalUnits * 100).toFixed(2) : 0;

      // Get maintenance stats
      const openMaintenance = await MaintenanceRequest.count({
        where: { 
          propertyId,
          status: { [Op.in]: ['open', 'in_progress'] }
        }
      });

      // Format response
      const propertyData = {
        id: property.id,
        name: property.name,
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        country: property.country,
        type: property.type,
        status: property.status,
        monthlyRent: property.monthlyRent,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.squareFeet,
        yearBuilt: property.yearBuilt,
        lotSize: property.lotSize,
        amenities: property.amenities,
        description: property.description,
        features: property.features,
        rules: property.rules,
        latitude: property.latitude,
        longitude: property.longitude,
        geofence: property.geofence,
        taxId: property.taxId,
        insuranceInfo: property.insuranceInfo,
        mortgageInfo: property.mortgageInfo,
        portfolio: property.Portfolio ? {
          id: property.Portfolio.id,
          name: property.Portfolio.name,
          description: property.Portfolio.description
        } : null,
        company: property.Company ? {
          id: property.Company.id,
          name: property.Company.name,
          logo: property.Company.logo,
          phone: property.Company.phone,
          email: property.Company.email
        } : null,
        managedBy: property.ManagedBy ? {
          id: property.ManagedBy.id,
          name: `${property.ManagedBy.firstName} ${property.ManagedBy.lastName}`,
          email: property.ManagedBy.email,
          phone: property.ManagedBy.phone,
          avatar: property.ManagedBy.avatar
        } : null,
        owner: property.Owner ? {
          id: property.Owner.id,
          name: `${property.Owner.firstName} ${property.Owner.lastName}`,
          email: property.Owner.email,
          phone: property.Owner.phone
        } : null,
        images: property.PropertyImages,
        documents: property.PropertyDocuments,
        units: property.Units.map(unit => ({
          id: unit.id,
          unitNumber: unit.unitNumber,
          type: unit.type,
          status: unit.status,
          monthlyRent: unit.monthlyRent,
          squareFeet: unit.squareFeet,
          bedrooms: unit.bedrooms,
          bathrooms: unit.bathrooms,
          amenities: unit.amenities,
          tenant: unit.Tenant ? {
            id: unit.Tenant.id,
            name: `${unit.Tenant.firstName} ${unit.Tenant.lastName}`,
            email: unit.Tenant.email,
            phone: unit.Tenant.phone,
            lease: unit.Tenant.Leases && unit.Tenant.Leases.length > 0 ? {
              id: unit.Tenant.Leases[0].id,
              startDate: unit.Tenant.Leases[0].startDate,
              endDate: unit.Tenant.Leases[0].endDate,
              monthlyRent: unit.Tenant.Leases[0].monthlyRent
            } : null
          } : null
        })),
        statistics: {
          totalUnits,
          occupiedUnits,
          vacantUnits: totalUnits - occupiedUnits,
          vacancyRate: `${vacancyRate}%`,
          openMaintenanceRequests: openMaintenance,
          totalValue: property.monthlyRent * 12 * 15, // Simplified valuation
          averageRent: property.monthlyRent
        },
        createdAt: property.createdAt,
        updatedAt: property.updatedAt
      };

      res.json({
        success: true,
        data: propertyData
      });
    } catch (error) {
      console.error('Get property by ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Create Property
   */
  async createProperty(req, res) {
    try {
      const { error } = validateProperty(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check permissions - only admins and managers can create properties
      const canCreate = userRoles.includes(ROLES.SYSTEM_ADMIN) || 
                       userRoles.includes(ROLES.COMPANY_ADMIN) ||
                       userRoles.includes(ROLES.PORTFOLIO_MANAGER) ||
                       userRoles.includes(ROLES.PROPERTY_MANAGER) ||
                       userRoles.includes(ROLES.LANDLORD);

      if (!canCreate) {
        return res.status(403).json({ error: 'Not authorized to create properties' });
      }

      const { 
        name, 
        address, 
        city, 
        state, 
        zipCode, 
        country, 
        type, 
        portfolioId, 
        companyId,
        monthlyRent,
        bedrooms,
        bathrooms,
        squareFeet,
        yearBuilt,
        amenities,
        description,
        latitude,
        longitude
      } = req.body;

      // Verify portfolio access
      if (portfolioId) {
        const hasPortfolioAccess = await this.checkPortfolioAccess(portfolioId, userId, userRoles);
        if (!hasPortfolioAccess) {
          return res.status(403).json({ error: 'Not authorized to add properties to this portfolio' });
        }
      }

      // Verify company access
      if (companyId) {
        const user = await User.findByPk(userId);
        if (user.companyId !== companyId && !userRoles.includes(ROLES.SYSTEM_ADMIN)) {
          return res.status(403).json({ error: 'Not authorized to add properties to this company' });
        }
      }

      // Create property
      const property = await Property.create({
        name,
        address,
        city,
        state,
        zipCode,
        country,
        type,
        portfolioId: portfolioId || null,
        companyId: companyId || null,
        ownerId: userRoles.includes(ROLES.LANDLORD) ? userId : null,
        managedById: userRoles.includes(ROLES.PROPERTY_MANAGER) ? userId : null,
        monthlyRent: monthlyRent || 0,
        bedrooms: bedrooms || 0,
        bathrooms: bathrooms || 0,
        squareFeet: squareFeet || 0,
        yearBuilt: yearBuilt || null,
        amenities: amenities || [],
        description: description || '',
        latitude: latitude || null,
        longitude: longitude || null,
        status: 'active',
        createdBy: userId
      });

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'PROPERTY_CREATED',
        details: `Property created: ${name}`,
        ipAddress: req.ip,
        metadata: { 
          propertyId: property.id, 
          address: `${address}, ${city}, ${state}` 
        }
      });

      res.status(201).json({
        success: true,
        message: 'Property created successfully',
        data: {
          id: property.id,
          name: property.name,
          address: property.address,
          city: property.city,
          state: property.state,
          type: property.type,
          status: property.status
        }
      });
    } catch (error) {
      console.error('Create property error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update Property
   */
  async updateProperty(req, res) {
    try {
      const { propertyId } = req.params;
      const { error } = validatePropertyUpdate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to update this property' });
      }

      const property = await Property.findByPk(propertyId);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      // Track changes for audit
      const changes = {};

      // Update fields
      const updatableFields = [
        'name', 'address', 'city', 'state', 'zipCode', 'country', 'type',
        'monthlyRent', 'bedrooms', 'bathrooms', 'squareFeet', 'yearBuilt',
        'amenities', 'description', 'features', 'rules', 'status',
        'latitude', 'longitude', 'geofence', 'taxId', 'insuranceInfo',
        'mortgageInfo', 'portfolioId', 'managedById'
      ];

      updatableFields.forEach(field => {
        if (req.body[field] !== undefined && req.body[field] !== property[field]) {
          changes[field] = { from: property[field], to: req.body[field] };
          property[field] = req.body[field];
        }
      });

      // Update last updated by
      property.updatedBy = userId;
      await property.save();

      // Create audit log if changes were made
      if (Object.keys(changes).length > 0) {
        await AuditLog.create({
          userId,
          action: 'PROPERTY_UPDATED',
          details: `Property updated: ${property.name}`,
          ipAddress: req.ip,
          metadata: { 
            propertyId: property.id, 
            changes 
          }
        });
      }

      res.json({
        success: true,
        message: 'Property updated successfully',
        data: {
          id: property.id,
          name: property.name,
          address: property.address,
          status: property.status,
          updatedFields: Object.keys(changes)
        }
      });
    } catch (error) {
      console.error('Update property error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Delete Property
   */
  async deleteProperty(req, res) {
    try {
      const { propertyId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access and permissions
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to delete this property' });
      }

      // Only system admin, company admin, and property owner can delete
      const canDelete = userRoles.includes(ROLES.SYSTEM_ADMIN) || 
                       userRoles.includes(ROLES.COMPANY_ADMIN);

      if (!canDelete) {
        // Check if user is the property owner
        const property = await Property.findByPk(propertyId);
        if (property.ownerId !== userId) {
          return res.status(403).json({ error: 'Not authorized to delete this property' });
        }
      }

      const property = await Property.findByPk(propertyId);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      // Check if property has active leases or tenants
      const activeLeases = await Lease.count({
        include: [{
          model: Unit,
          where: { propertyId }
        }],
        where: { status: 'active' }
      });

      if (activeLeases > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete property with active leases. Archive instead.' 
        });
      }

      // Check if property has units
      const unitCount = await Unit.count({ where: { propertyId } });
      if (unitCount > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete property with units. Delete units first.' 
        });
      }

      // Soft delete (update status)
      property.status = 'archived';
      property.deletedAt = new Date();
      property.deletedBy = userId;
      await property.save();

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'PROPERTY_DELETED',
        details: `Property archived: ${property.name}`,
        ipAddress: req.ip,
        metadata: { propertyId: property.id }
      });

      res.json({
        success: true,
        message: 'Property archived successfully'
      });
    } catch (error) {
      console.error('Delete property error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Property Statistics
   */
  async getPropertyStats(req, res) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Get user's accessible properties
      const accessibleProperties = await this.getAccessibleProperties(userId, userRoles);
      const propertyIds = accessibleProperties.map(p => p.id);

      if (propertyIds.length === 0) {
        return res.json({
          success: true,
          data: {
            total: 0,
            byType: {},
            byStatus: {},
            occupancy: {},
            financial: {}
          }
        });
      }

      // Get total properties
      const totalProperties = propertyIds.length;

      // Get properties by type
      const propertiesByType = await Property.findAll({
        where: { id: { [Op.in]: propertyIds } },
        attributes: ['type', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['type']
      });

      // Get properties by status
      const propertiesByStatus = await Property.findAll({
        where: { id: { [Op.in]: propertyIds } },
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['status']
      });

      // Get occupancy statistics
      const totalUnits = await Unit.count({
        where: { propertyId: { [Op.in]: propertyIds } }
      });

      const occupiedUnits = await Unit.count({
        where: { 
          propertyId: { [Op.in]: propertyIds },
          status: 'occupied'
        }
      });

      const vacancyRate = totalUnits > 0 ? ((totalUnits - occupiedUnits) / totalUnits * 100).toFixed(2) : 0;

      // Get financial statistics (simplified)
      const totalMonthlyRent = await Property.sum('monthlyRent', {
        where: { 
          id: { [Op.in]: propertyIds },
          status: 'active'
        }
      });

      // Get recent properties (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentProperties = await Property.count({
        where: {
          id: { [Op.in]: propertyIds },
          createdAt: { [Op.gte]: thirtyDaysAgo }
        }
      });

      res.json({
        success: true,
        data: {
          total: totalProperties,
          byType: propertiesByType.reduce((acc, curr) => {
            acc[curr.type] = curr.get('count');
            return acc;
          }, {}),
          byStatus: propertiesByStatus.reduce((acc, curr) => {
            acc[curr.status] = curr.get('count');
            return acc;
          }, {}),
          occupancy: {
            totalUnits,
            occupiedUnits,
            vacantUnits: totalUnits - occupiedUnits,
            vacancyRate: `${vacancyRate}%`
          },
          financial: {
            totalMonthlyRent: totalMonthlyRent || 0,
            projectedAnnualRent: (totalMonthlyRent || 0) * 12,
            averageRentPerProperty: totalProperties > 0 ? (totalMonthlyRent || 0) / totalProperties : 0
          },
          recent: recentProperties
        }
      });
    } catch (error) {
      console.error('Get property stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Property Activity
   */
  async getPropertyActivity(req, res) {
    try {
      const { propertyId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const offset = (page - 1) * limit;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view this property\'s activity' });
      }

      const { count, rows: activities } = await AuditLog.findAndCountAll({
        where: {
          [Op.or]: [
            { 
              action: { 
                [Op.like]: 'PROPERTY_%' 
              },
              metadata: { 
                [Op.like]: `%\"propertyId\":\"${propertyId}\"%` 
              }
            },
            {
              action: { 
                [Op.like]: 'UNIT_%' 
              },
              metadata: { 
                [Op.like]: `%\"propertyId\":\"${propertyId}\"%` 
              }
            },
            {
              action: { 
                [Op.like]: 'MAINTENANCE_%' 
              },
              metadata: { 
                [Op.like]: `%\"propertyId\":\"${propertyId}\"%` 
              }
            }
          ]
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
      console.error('Get property activity error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Bulk Update Properties
   */
  async bulkUpdateProperties(req, res) {
    try {
      const { propertyIds, updates } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (!Array.isArray(propertyIds) || propertyIds.length === 0) {
        return res.status(400).json({ error: 'Property IDs array is required' });
      }

      // Check permissions
      const canBulkUpdate = userRoles.includes(ROLES.SYSTEM_ADMIN) || 
                           userRoles.includes(ROLES.COMPANY_ADMIN) ||
                           userRoles.includes(ROLES.PORTFOLIO_MANAGER);

      if (!canBulkUpdate) {
        return res.status(403).json({ error: 'Not authorized for bulk updates' });
      }

      // Limit bulk operations
      if (propertyIds.length > 100) {
        return res.status(400).json({ error: 'Maximum 100 properties per bulk update' });
      }

      // Verify access to all properties
      for (const propertyId of propertyIds) {
        const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
        if (!hasAccess) {
          return res.status(403).json({ 
            error: `Not authorized to update property ${propertyId}` 
          });
        }
      }

      const results = {
        success: [],
        failed: []
      };

      // Process each property
      for (const propertyId of propertyIds) {
        try {
          const property = await Property.findByPk(propertyId);
          
          if (!property) {
            results.failed.push({ propertyId, error: 'Property not found' });
            continue;
          }

          // Apply updates
          const allowedUpdates = ['status', 'portfolioId', 'managedById', 'monthlyRent'];
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
        action: 'BULK_PROPERTY_UPDATE',
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
      console.error('Bulk update properties error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Search Properties (for map view)
   */
  async searchProperties(req, res) {
    try {
      const { 
        bounds, 
        types, 
        minPrice, 
        maxPrice, 
        bedrooms, 
        bathrooms,
        amenities 
      } = req.query;

      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Get user's accessible properties
      const accessibleProperties = await this.getAccessibleProperties(userId, userRoles);
      const propertyIds = accessibleProperties.map(p => p.id);

      if (propertyIds.length === 0) {
        return res.json({
          success: true,
          data: []
        });
      }

      let whereClause = {
        id: { [Op.in]: propertyIds },
        status: 'active'
      };

      // Apply geographic bounds if provided
      if (bounds) {
        const { north, south, east, west } = JSON.parse(bounds);
        whereClause.latitude = { [Op.between]: [south, north] };
        whereClause.longitude = { [Op.between]: [west, east] };
      }

      // Apply filters
      if (types) {
        const typeArray = types.split(',');
        whereClause.type = { [Op.in]: typeArray };
      }

      if (minPrice) {
        whereClapse.monthlyRent = { [Op.gte]: parseFloat(minPrice) };
      }

      if (maxPrice) {
        whereClapse.monthlyRent = { ...whereClapse.monthlyRent, [Op.lte]: parseFloat(maxPrice) };
      }

      if (bedrooms) {
        whereClapse.bedrooms = { [Op.gte]: parseInt(bedrooms) };
      }

      if (bathrooms) {
        whereClapse.bathrooms = { [Op.gte]: parseInt(bathrooms) };
      }

      if (amenities) {
        const amenityArray = amenities.split(',');
        whereClapse.amenities = { [Op.overlap]: amenityArray };
      }

      const properties = await Property.findAll({
        where: whereClause,
        include: [{
          model: PropertyImage,
          attributes: ['url'],
          where: { isPrimary: true },
          required: false,
          limit: 1
        }],
        attributes: ['id', 'name', 'address', 'city', 'state', 'type', 'monthlyRent', 
                    'bedrooms', 'bathrooms', 'latitude', 'longitude', 'status'],
        limit: 100
      });

      // Format for map response
      const mapProperties = properties.map(property => ({
        id: property.id,
        name: property.name,
        address: property.address,
        city: property.city,
        state: property.state,
        type: property.type,
        price: property.monthlyRent,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        coordinates: {
          lat: property.latitude,
          lng: property.longitude
        },
        status: property.status,
        image: property.PropertyImages && property.PropertyImages.length > 0 
          ? property.PropertyImages[0].url 
          : null
      }));

      res.json({
        success: true,
        data: mapProperties
      });
    } catch (error) {
      console.error('Search properties error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Helper: Check property access
   */
  async checkPropertyAccess(propertyId, userId, userRoles) {
    try {
      // System admin has access to all properties
      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return true;
      }

      const property = await Property.findByPk(propertyId);
      if (!property) return false;

      // Company admin has access to properties in their company
      if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        return user.companyId === property.companyId;
      }

      // Portfolio manager has access to properties in their portfolio
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

      // Property manager has access to assigned properties
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

      // Landlord has access to their own properties
      if (userRoles.includes(ROLES.LANDLORD)) {
        return property.ownerId === userId;
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
   * Helper: Get accessible properties for user
   */
  async getAccessibleProperties(userId, userRoles) {
    try {
      let whereClause = {};

      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        // All properties
      } else if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        if (user && user.companyId) {
          whereClause.companyId = user.companyId;
        }
      } else if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Portfolio,
            as: 'ManagedPortfolios'
          }]
        });
        
        if (user.ManagedPortfolios && user.ManagedPortfolios.length > 0) {
          const portfolioIds = user.ManagedPortfolios.map(p => p.id);
          whereClause.portfolioId = { [Op.in]: portfolioIds };
        }
      } else if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Property,
            as: 'ManagedProperties'
          }]
        });
        
        if (user.ManagedProperties && user.ManagedProperties.length > 0) {
          const propertyIds = user.ManagedProperties.map(p => p.id);
          whereClause.id = { [Op.in]: propertyIds };
        }
      } else if (userRoles.includes(ROLES.LANDLORD)) {
        whereClause.ownerId = userId;
      }

      return await Property.findAll({
        where: whereClause,
        attributes: ['id']
      });
    } catch (error) {
      console.error('Get accessible properties error:', error);
      return [];
    }
  }
}

module.exports = new PropertyController();
