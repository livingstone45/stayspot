const { Op } = require('sequelize');
const { Unit, Property, Tenant, Lease, MaintenanceRequest, AuditLog } = require('../../models');
const { validateUnit, validateUnitUpdate } = require('../../utils/validators/property.validator');
const { ROLES } = require('../../utils/constants/roles');

/**
 * Unit Management Controller
 * Handles property unit CRUD operations and management
 */
class UnitController {
  /**
   * Get All Units for a Property
   */
  async getPropertyUnits(req, res) {
    try {
      const { propertyId } = req.params;
      const { 
        page = 1, 
        limit = 50, 
        status, 
        type,
        minRent,
        maxRent,
        bedrooms,
        sortBy = 'unitNumber',
        sortOrder = 'ASC',
        includeTenant = false,
        includeLease = false
      } = req.query;

      const offset = (page - 1) * limit;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view units for this property' });
      }

      const whereClause = { propertyId };

      // Apply filters
      if (status) {
        whereClause.status = status;
      }

      if (type) {
        whereClause.type = type;
      }

      if (minRent) {
        whereClause.monthlyRent = { [Op.gte]: parseFloat(minRent) };
      }

      if (maxRent) {
        whereClause.monthlyRent = { ...whereClause.monthlyRent, [Op.lte]: parseFloat(maxRent) };
      }

      if (bedrooms) {
        whereClause.bedrooms = parseInt(bedrooms);
      }

      // Build include array
      const include = [];

      if (includeTenant === 'true' || includeLease === 'true') {
        include.push({
          model: Tenant,
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
          include: []
        });

        if (includeLease === 'true') {
          include[0].include.push({
            model: Lease,
            where: { status: 'active' },
            required: false,
            limit: 1,
            order: [['startDate', 'DESC']]
          });
        }
      }

      const { count, rows: units } = await Unit.findAndCountAll({
        where: whereClause,
        include: include.length > 0 ? include : [],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Format response
      const formattedUnits = units.map(unit => ({
        id: unit.id,
        unitNumber: unit.unitNumber,
        type: unit.type,
        status: unit.status,
        monthlyRent: unit.monthlyRent,
        squareFeet: unit.squareFeet,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        amenities: unit.amenities,
        description: unit.description,
        features: unit.features,
        propertyId: unit.propertyId,
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
        } : null,
        createdAt: unit.createdAt,
        updatedAt: unit.updatedAt
      }));

      res.json({
        success: true,
        data: {
          units: formattedUnits,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get property units error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Unit by ID
   */
  async getUnitById(req, res) {
    try {
      const { propertyId, unitId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view this unit' });
      }

      const unit = await Unit.findOne({
        where: { 
          id: unitId,
          propertyId 
        },
        include: [
          {
            model: Property,
            attributes: ['id', 'name', 'address', 'city', 'state']
          },
          {
            model: Tenant,
            include: [{
              model: Lease,
              where: { status: 'active' },
              required: false,
              order: [['startDate', 'DESC']],
              limit: 1
            }]
          },
          {
            model: MaintenanceRequest,
            where: { status: { [Op.in]: ['open', 'in_progress'] } },
            required: false,
            limit: 5,
            order: [['createdAt', 'DESC']]
          }
        ]
      });

      if (!unit) {
        return res.status(404).json({ error: 'Unit not found' });
      }

      // Get unit history
      const leases = await Lease.findAll({
        where: { unitId },
        order: [['startDate', 'DESC']],
        limit: 10
      });

      const maintenanceHistory = await MaintenanceRequest.findAll({
        where: { unitId },
        order: [['createdAt', 'DESC']],
        limit: 10
      });

      // Format response
      const unitData = {
        id: unit.id,
        unitNumber: unit.unitNumber,
        type: unit.type,
        status: unit.status,
        monthlyRent: unit.monthlyRent,
        squareFeet: unit.squareFeet,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        amenities: unit.amenities,
        description: unit.description,
        features: unit.features,
        floor: unit.floor,
        floorplanUrl: unit.floorplanUrl,
        notes: unit.notes,
        property: {
          id: unit.Property.id,
          name: unit.Property.name,
          address: unit.Property.address,
          city: unit.Property.city,
          state: unit.Property.state
        },
        currentTenant: unit.Tenant ? {
          id: unit.Tenant.id,
          name: `${unit.Tenant.firstName} ${unit.Tenant.lastName}`,
          email: unit.Tenant.email,
          phone: unit.Tenant.phone,
          moveInDate: unit.Tenant.Leases && unit.Tenant.Leases.length > 0 ? unit.Tenant.Leases[0].startDate : null,
          lease: unit.Tenant.Leases && unit.Tenant.Leases.length > 0 ? {
            id: unit.Tenant.Leases[0].id,
            startDate: unit.Tenant.Leases[0].startDate,
            endDate: unit.Tenant.Leases[0].endDate,
            monthlyRent: unit.Tenant.Leases[0].monthlyRent,
            securityDeposit: unit.Tenant.Leases[0].securityDeposit
          } : null
        } : null,
        openMaintenanceRequests: unit.MaintenanceRequests,
        history: {
          leases,
          maintenance: maintenanceHistory
        },
        createdAt: unit.createdAt,
        updatedAt: unit.updatedAt
      };

      res.json({
        success: true,
        data: unitData
      });
    } catch (error) {
      console.error('Get unit by ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Create Unit
   */
  async createUnit(req, res) {
    try {
      const { propertyId } = req.params;
      const { error } = validateUnit(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to create units for this property' });
      }

      const property = await Property.findByPk(propertyId);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      const { 
        unitNumber, 
        type, 
        monthlyRent, 
        squareFeet, 
        bedrooms, 
        bathrooms,
        amenities,
        description,
        features,
        floor,
        floorplanUrl,
        notes
      } = req.body;

      // Check if unit number already exists in property
      const existingUnit = await Unit.findOne({
        where: { 
          propertyId,
          unitNumber 
        }
      });

      if (existingUnit) {
        return res.status(409).json({ error: 'Unit number already exists in this property' });
      }

      // Create unit
      const unit = await Unit.create({
        propertyId,
        unitNumber,
        type: type || 'apartment',
        status: 'vacant',
        monthlyRent: monthlyRent || 0,
        squareFeet: squareFeet || 0,
        bedrooms: bedrooms || 0,
        bathrooms: bathrooms || 0,
        amenities: amenities || [],
        description: description || '',
        features: features || [],
        floor: floor || null,
        floorplanUrl: floorplanUrl || null,
        notes: notes || '',
        createdBy: userId
      });

      // Update property statistics
      await this.updatePropertyStatistics(propertyId);

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'UNIT_CREATED',
        details: `Unit ${unitNumber} created for property: ${property.name}`,
        ipAddress: req.ip,
        metadata: { 
          propertyId, 
          unitId: unit.id,
          unitNumber 
        }
      });

      res.status(201).json({
        success: true,
        message: 'Unit created successfully',
        data: {
          id: unit.id,
          unitNumber: unit.unitNumber,
          type: unit.type,
          status: unit.status,
          monthlyRent: unit.monthlyRent,
          propertyId: unit.propertyId
        }
      });
    } catch (error) {
      console.error('Create unit error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update Unit
   */
  async updateUnit(req, res) {
    try {
      const { propertyId, unitId } = req.params;
      const { error } = validateUnitUpdate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to update this unit' });
      }

      const unit = await Unit.findOne({
        where: { 
          id: unitId,
          propertyId 
        }
      });

      if (!unit) {
        return res.status(404).json({ error: 'Unit not found' });
      }

      // Track changes for audit
      const changes = {};

      // Update fields
      const updatableFields = [
        'unitNumber', 'type', 'status', 'monthlyRent', 'squareFeet',
        'bedrooms', 'bathrooms', 'amenities', 'description', 'features',
        'floor', 'floorplanUrl', 'notes'
      ];

      updatableFields.forEach(field => {
        if (req.body[field] !== undefined && req.body[field] !== unit[field]) {
          changes[field] = { from: unit[field], to: req.body[field] };
          unit[field] = req.body[field];
        }
      });

      // Check if unit number is being changed and if it conflicts
      if (req.body.unitNumber && req.body.unitNumber !== unit.unitNumber) {
        const existingUnit = await Unit.findOne({
          where: { 
            propertyId,
            unitNumber: req.body.unitNumber,
            id: { [Op.ne]: unitId }
          }
        });

        if (existingUnit) {
          return res.status(409).json({ error: 'Unit number already exists in this property' });
        }
      }

      unit.updatedBy = userId;
      await unit.save();

      // Update property statistics if rent changed
      if (changes.monthlyRent || changes.status) {
        await this.updatePropertyStatistics(propertyId);
      }

      // Create audit log if changes were made
      if (Object.keys(changes).length > 0) {
        await AuditLog.create({
          userId,
          action: 'UNIT_UPDATED',
          details: `Unit ${unit.unitNumber} updated`,
          ipAddress: req.ip,
          metadata: { 
            propertyId, 
            unitId: unit.id,
            changes 
          }
        });
      }

      res.json({
        success: true,
        message: 'Unit updated successfully',
        data: {
          id: unit.id,
          unitNumber: unit.unitNumber,
          status: unit.status,
          monthlyRent: unit.monthlyRent,
          updatedFields: Object.keys(changes)
        }
      });
    } catch (error) {
      console.error('Update unit error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Delete Unit
   */
  async deleteUnit(req, res) {
    try {
      const { propertyId, unitId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to delete this unit' });
      }

      const unit = await Unit.findOne({
        where: { 
          id: unitId,
          propertyId 
        },
        include: [{
          model: Tenant,
          include: [{
            model: Lease,
            where: { status: 'active' },
            required: false
          }]
        }]
      });

      if (!unit) {
        return res.status(404).json({ error: 'Unit not found' });
      }

      // Check if unit has active tenant
      if (unit.Tenant && unit.Tenant.Leases && unit.Tenant.Leases.length > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete unit with active tenant. Vacate unit first.' 
        });
      }

      // Check if unit has open maintenance requests
      const openRequests = await MaintenanceRequest.count({
        where: { 
          unitId,
          status: { [Op.in]: ['open', 'in_progress'] }
        }
      });

      if (openRequests > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete unit with open maintenance requests. Resolve requests first.' 
        });
      }

      // Delete unit
      await unit.destroy();

      // Update property statistics
      await this.updatePropertyStatistics(propertyId);

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'UNIT_DELETED',
        details: `Unit ${unit.unitNumber} deleted from property: ${propertyId}`,
        ipAddress: req.ip,
        metadata: { 
          propertyId, 
          unitId: unit.id,
          unitNumber: unit.unitNumber 
        }
      });

      res.json({
        success: true,
        message: 'Unit deleted successfully'
      });
    } catch (error) {
      console.error('Delete unit error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Bulk Create Units
   */
  async bulkCreateUnits(req, res) {
    try {
      const { propertyId } = req.params;
      const { units } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (!Array.isArray(units) || units.length === 0) {
        return res.status(400).json({ error: 'Units array is required' });
      }

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to create units for this property' });
      }

      const property = await Property.findByPk(propertyId);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      // Limit bulk operations
      if (units.length > 50) {
        return res.status(400).json({ error: 'Maximum 50 units per bulk create' });
      }

      const results = {
        success: [],
        failed: []
      };

      // Get existing unit numbers
      const existingUnits = await Unit.findAll({
        where: { propertyId },
        attributes: ['unitNumber']
      });

      const existingUnitNumbers = existingUnits.map(u => u.unitNumber);

      // Process each unit
      for (const unitData of units) {
        try {
          const { unitNumber } = unitData;

          if (!unitNumber) {
            results.failed.push({ unitData, error: 'Unit number is required' });
            continue;
          }

          // Check if unit number already exists
          if (existingUnitNumbers.includes(unitNumber)) {
            results.failed.push({ unitData, error: `Unit number ${unitNumber} already exists` });
            continue;
          }

          // Create unit
          const unit = await Unit.create({
            propertyId,
            unitNumber,
            type: unitData.type || 'apartment',
            status: 'vacant',
            monthlyRent: unitData.monthlyRent || 0,
            squareFeet: unitData.squareFeet || 0,
            bedrooms: unitData.bedrooms || 0,
            bathrooms: unitData.bathrooms || 0,
            amenities: unitData.amenities || [],
            description: unitData.description || '',
            features: unitData.features || [],
            floor: unitData.floor || null,
            floorplanUrl: unitData.floorplanUrl || null,
            notes: unitData.notes || '',
            createdBy: userId
          });

          existingUnitNumbers.push(unitNumber);
          results.success.push({ unitId: unit.id, unitNumber });
        } catch (error) {
          console.error(`Failed to create unit:`, error);
          results.failed.push({ unitData, error: error.message });
        }
      }

      // Update property statistics
      await this.updatePropertyStatistics(propertyId);

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'BULK_UNITS_CREATED',
        details: `Bulk units created for property: ${property.name}. Success: ${results.success.length}, Failed: ${results.failed.length}`,
        ipAddress: req.ip,
        metadata: { 
          propertyId, 
          results 
        }
      });

      res.status(201).json({
        success: true,
        message: `Bulk units created. ${results.success.length} created successfully, ${results.failed.length} failed.`,
        data: results
      });
    } catch (error) {
      console.error('Bulk create units error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Bulk Update Units
   */
  async bulkUpdateUnits(req, res) {
    try {
      const { propertyId } = req.params;
      const { unitUpdates } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (!Array.isArray(unitUpdates) || unitUpdates.length === 0) {
        return res.status(400).json({ error: 'Unit updates array is required' });
      }

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to update units for this property' });
      }

      // Limit bulk operations
      if (unitUpdates.length > 100) {
        return res.status(400).json({ error: 'Maximum 100 units per bulk update' });
      }

      const results = {
        success: [],
        failed: []
      };

      let rentChanged = false;
      let statusChanged = false;

      // Process each unit update
      for (const update of unitUpdates) {
        try {
          const { unitId, updates } = update;

          if (!unitId || !updates) {
            results.failed.push({ update, error: 'Unit ID and updates are required' });
            continue;
          }

          const unit = await Unit.findOne({
            where: { 
              id: unitId,
              propertyId 
            }
          });

          if (!unit) {
            results.failed.push({ update, error: 'Unit not found' });
            continue;
          }

          // Track changes
          const changes = {};

          // Apply updates
          const allowedUpdates = ['monthlyRent', 'status', 'amenities', 'features', 'notes'];
          for (const key in updates) {
            if (allowedUpdates.includes(key) && updates[key] !== unit[key]) {
              changes[key] = { from: unit[key], to: updates[key] };
              unit[key] = updates[key];
            }
          }

          if (Object.keys(changes).length > 0) {
            unit.updatedBy = userId;
            await unit.save();

            if (changes.monthlyRent) rentChanged = true;
            if (changes.status) statusChanged = true;

            results.success.push({ unitId, unitNumber: unit.unitNumber, changes });
          } else {
            results.success.push({ unitId, unitNumber: unit.unitNumber, changes: {} });
          }
        } catch (error) {
          console.error(`Failed to update unit:`, error);
          results.failed.push({ update, error: error.message });
        }
      }

      // Update property statistics if needed
      if (rentChanged || statusChanged) {
        await this.updatePropertyStatistics(propertyId);
      }

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'BULK_UNITS_UPDATED',
        details: `Bulk units updated for property: ${propertyId}. Success: ${results.success.length}, Failed: ${results.failed.length}`,
        ipAddress: req.ip,
        metadata: { 
          propertyId, 
          results 
        }
      });

      res.json({
        success: true,
        message: `Bulk units updated. ${results.success.length} updated successfully, ${results.failed.length} failed.`,
        data: results
      });
    } catch (error) {
      console.error('Bulk update units error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Unit Statistics
   */
  async getUnitStats(req, res) {
    try {
      const { propertyId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view unit statistics for this property' });
      }

      // Get unit counts by status
      const unitsByStatus = await Unit.findAll({
        where: { propertyId },
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['status']
      });

      // Get unit counts by type
      const unitsByType = await Unit.findAll({
        where: { propertyId },
        attributes: ['type', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['type']
      });

      // Get total units
      const totalUnits = await Unit.count({ where: { propertyId } });

      // Get occupied units
      const occupiedUnits = await Unit.count({ 
        where: { 
          propertyId,
          status: 'occupied' 
        } 
      });

      // Get average rent
      const averageRent = await Unit.findOne({
        where: { propertyId },
        attributes: [[sequelize.fn('AVG', sequelize.col('monthlyRent')), 'avgRent']]
      });

      // Get rent range
      const rentRange = await Unit.findOne({
        where: { propertyId },
        attributes: [
          [sequelize.fn('MIN', sequelize.col('monthlyRent')), 'minRent'],
          [sequelize.fn('MAX', sequelize.col('monthlyRent')), 'maxRent']
        ]
      });

      // Get maintenance statistics
      const openMaintenance = await MaintenanceRequest.count({
        where: { 
          propertyId,
          status: { [Op.in]: ['open', 'in_progress'] }
        }
      });

      res.json({
        success: true,
        data: {
          total: totalUnits,
          occupied: occupiedUnits,
          vacant: totalUnits - occupiedUnits,
          occupancyRate: totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(2) + '%' : '0%',
          byStatus: unitsByStatus.reduce((acc, curr) => {
            acc[curr.status] = curr.get('count');
            return acc;
          }, {}),
          byType: unitsByType.reduce((acc, curr) => {
            acc[curr.type] = curr.get('count');
            return acc;
          }, {}),
          financial: {
            averageRent: parseFloat(averageRent?.get('avgRent') || 0).toFixed(2),
            minRent: parseFloat(rentRange?.get('minRent') || 0).toFixed(2),
            maxRent: parseFloat(rentRange?.get('maxRent') || 0).toFixed(2),
            totalMonthlyRent: await Unit.sum('monthlyRent', { where: { propertyId } }) || 0
          },
          maintenance: {
            openRequests: openMaintenance
          }
        }
      });
    } catch (error) {
      console.error('Get unit stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Assign Tenant to Unit
   */
  async assignTenant(req, res) {
    try {
      const { propertyId, unitId } = req.params;
      const { tenantId } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to assign tenants for this property' });
      }

      const unit = await Unit.findOne({
        where: { 
          id: unitId,
          propertyId 
        }
      });

      if (!unit) {
        return res.status(404).json({ error: 'Unit not found' });
      }

      // Check if unit is already occupied
      if (unit.status === 'occupied') {
        return res.status(400).json({ error: 'Unit is already occupied' });
      }

      const tenant = await Tenant.findByPk(tenantId);
      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }

      // Update unit status
      unit.status = 'occupied';
      unit.tenantId = tenantId;
      unit.updatedBy = userId;
      await unit.save();

      // Update property statistics
      await this.updatePropertyStatistics(propertyId);

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'TENANT_ASSIGNED',
        details: `Tenant ${tenant.firstName} ${tenant.lastName} assigned to unit ${unit.unitNumber}`,
        ipAddress: req.ip,
        metadata: { 
          propertyId, 
          unitId: unit.id,
          tenantId,
          unitNumber: unit.unitNumber
        }
      });

      res.json({
        success: true,
        message: 'Tenant assigned to unit successfully',
        data: {
          unitId: unit.id,
          unitNumber: unit.unitNumber,
          tenantId: tenant.id,
          tenantName: `${tenant.firstName} ${tenant.lastName}`,
          status: unit.status
        }
      });
    } catch (error) {
      console.error('Assign tenant error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Vacate Unit
   */
  async vacateUnit(req, res) {
    try {
      const { propertyId, unitId } = req.params;
      const { moveOutDate, notes } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to vacate this unit' });
      }

      const unit = await Unit.findOne({
        where: { 
          id: unitId,
          propertyId 
        },
        include: [{
          model: Tenant
        }]
      });

      if (!unit) {
        return res.status(404).json({ error: 'Unit not found' });
      }

      // Check if unit is already vacant
      if (unit.status === 'vacant') {
        return res.status(400).json({ error: 'Unit is already vacant' });
      }

      if (!unit.Tenant) {
        return res.status(400).json({ error: 'No tenant assigned to this unit' });
      }

      // Get active lease
      const activeLease = await Lease.findOne({
        where: { 
          tenantId: unit.tenantId,
          unitId,
          status: 'active'
        }
      });

      // End active lease if exists
      if (activeLease) {
        activeLease.status = 'ended';
        activeLease.endDate = moveOutDate || new Date();
        activeLease.notes = notes || '';
        await activeLease.save();
      }

      // Update unit status
      const previousTenantId = unit.tenantId;
      unit.status = 'vacant';
      unit.tenantId = null;
      unit.updatedBy = userId;
      await unit.save();

      // Update property statistics
      await this.updatePropertyStatistics(propertyId);

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'UNIT_VACATED',
        details: `Unit ${unit.unitNumber} vacated. Previous tenant: ${unit.Tenant.firstName} ${unit.Tenant.lastName}`,
        ipAddress: req.ip,
        metadata: { 
          propertyId, 
          unitId: unit.id,
          previousTenantId,
          moveOutDate,
          notes
        }
      });

      res.json({
        success: true,
        message: 'Unit vacated successfully',
        data: {
          unitId: unit.id,
          unitNumber: unit.unitNumber,
          status: unit.status,
          previousTenant: {
            id: unit.Tenant.id,
            name: `${unit.Tenant.firstName} ${unit.Tenant.lastName}`
          },
          moveOutDate: moveOutDate || new Date()
        }
      });
    } catch (error) {
      console.error('Vacate unit error:', error);
      res.status(500).json({ error: 'Internal server error' });
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
   * Helper: Update property statistics
   */
  async updatePropertyStatistics(propertyId) {
    try {
      const totalUnits = await Unit.count({ where: { propertyId } });
      const occupiedUnits = await Unit.count({ 
        where: { 
          propertyId,
          status: 'occupied' 
        } 
      });
      
      const totalRent = await Unit.sum('monthlyRent', { 
        where: { 
          propertyId,
          status: 'occupied' 
        } 
      }) || 0;

      const property = await Property.findByPk(propertyId);
      if (property) {
        property.totalUnits = totalUnits;
        property.occupiedUnits = occupiedUnits;
        property.vacantUnits = totalUnits - occupiedUnits;
        property.totalMonthlyRent = totalRent;
        property.averageRent = totalRent / (occupiedUnits || 1);
        await property.save();
      }
    } catch (error) {
      console.error('Update property statistics error:', error);
    }
  }
}

module.exports = new UnitController();