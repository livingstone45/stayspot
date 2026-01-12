const { Op } = require('sequelize');
const { Tenant, Lease, Unit, Property, Payment, MaintenanceRequest, AuditLog, User } = require('../../models');
const { validateTenant, validateTenantUpdate } = require('../../utils/validators/tenant.validator');
const { ROLES } = require('../../utils/constants/roles');
const { sendEmail } = require('../../services/communication/email.service');

/**
 * Tenant Management Controller
 * Handles tenant CRUD operations and management
 */
class TenantController {
  /**
   * Get All Tenants
   */
  async getAllTenants(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        search, 
        status, 
        propertyId,
        portfolioId,
        companyId,
        sortBy = 'lastName',
        sortOrder = 'ASC',
        includeLease = false
      } = req.query;

      const offset = (page - 1) * limit;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Build where clause based on permissions
      let whereClause = {};
      let includeWhereClause = {};

      // System admin can see all tenants
      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        // No restrictions
      }
      // Company admin can see tenants in their company
      else if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        if (user && user.companyId) {
          includeWhereClause.companyId = user.companyId;
        } else {
          return res.status(403).json({ error: 'Not authorized to view tenants' });
        }
      }
      // Portfolio manager can see tenants in their portfolio
      else if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Portfolio,
            as: 'ManagedPortfolios'
          }]
        });
        
        if (user.ManagedPortfolios && user.ManagedPortfolios.length > 0) {
          const portfolioIds = user.ManagedPortfolios.map(p => p.id);
          includeWhereClause.portfolioId = { [Op.in]: portfolioIds };
        } else {
          return res.status(403).json({ error: 'Not authorized to view tenants' });
        }
      }
      // Property manager can see tenants in their properties
      else if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Property,
            as: 'ManagedProperties'
          }]
        });
        
        if (user.ManagedProperties && user.ManagedProperties.length > 0) {
          const propertyIds = user.ManagedProperties.map(p => p.id);
          includeWhereClause.propertyId = { [Op.in]: propertyIds };
        } else {
          return res.status(403).json({ error: 'Not authorized to view tenants' });
        }
      }
      // Landlord can see tenants in their properties
      else if (userRoles.includes(ROLES.LANDLORD)) {
        includeWhereClause.ownerId = userId;
      }
      // Other roles can't view tenants
      else {
        return res.status(403).json({ error: 'Not authorized to view tenants' });
      }

      // Apply filters
      if (search) {
        whereClause[Op.or] = [
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } }
        ];
      }

      if (status) {
        whereClause.status = status;
      }

      // Build include array
      const include = [
        {
          model: Lease,
          where: { status: 'active' },
          required: false,
          limit: 1,
          order: [['startDate', 'DESC']],
          include: []
        }
      ];

      // Add property/unit information based on permissions and filters
      if (includeWhereClause.companyId || includeWhereClause.portfolioId || includeWhereClause.propertyId || 
          propertyId || portfolioId || companyId || includeLease === 'true') {
        
        include[0].include.push({
          model: Unit,
          include: [{
            model: Property,
            where: includeWhereClause,
            attributes: ['id', 'name', 'address', 'city', 'state']
          }]
        });

        // Apply additional filters
        if (propertyId) {
          include[0].include[0].include[0].where = { 
            ...include[0].include[0].include[0].where,
            id: propertyId 
          };
        }

        if (portfolioId) {
          include[0].include[0].include[0].where = { 
            ...include[0].include[0].include[0].where,
            portfolioId 
          };
        }

        if (companyId) {
          include[0].include[0].include[0].where = { 
            ...include[0].include[0].include[0].where,
            companyId 
          };
        }
      }

      const { count, rows: tenants } = await Tenant.findAndCountAll({
        where: whereClause,
        include: include,
        distinct: true,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Format response
      const formattedTenants = tenants.map(tenant => {
        const currentLease = tenant.Leases && tenant.Leases.length > 0 ? tenant.Leases[0] : null;
        const currentUnit = currentLease ? currentLease.Unit : null;
        const currentProperty = currentUnit ? currentUnit.Property : null;

        return {
          id: tenant.id,
          firstName: tenant.firstName,
          lastName: tenant.lastName,
          email: tenant.email,
          phone: tenant.phone,
          status: tenant.status,
          emergencyContact: tenant.emergencyContact,
          notes: tenant.notes,
          currentLease: currentLease ? {
            id: currentLease.id,
            startDate: currentLease.startDate,
            endDate: currentLease.endDate,
            monthlyRent: currentLease.monthlyRent,
            securityDeposit: currentLease.securityDeposit
          } : null,
          currentUnit: currentUnit ? {
            id: currentUnit.id,
            unitNumber: currentUnit.unitNumber
          } : null,
          currentProperty: currentProperty ? {
            id: currentProperty.id,
            name: currentProperty.name,
            address: currentProperty.address,
            city: currentProperty.city,
            state: currentProperty.state
          } : null,
          createdAt: tenant.createdAt,
          updatedAt: tenant.updatedAt
        };
      });

      res.json({
        success: true,
        data: {
          tenants: formattedTenants,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get all tenants error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Tenant by ID
   */
  async getTenantById(req, res) {
    try {
      const { tenantId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check tenant access
      const hasAccess = await this.checkTenantAccess(tenantId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view this tenant' });
      }

      const tenant = await Tenant.findByPk(tenantId, {
        include: [
          {
            model: Lease,
            include: [{
              model: Unit,
              include: [{
                model: Property,
                include: [{
                  model: Portfolio
                }]
              }]
            }],
            order: [['startDate', 'DESC']]
          },
          {
            model: Payment,
            order: [['dueDate', 'DESC']],
            limit: 12
          },
          {
            model: MaintenanceRequest,
            order: [['createdAt', 'DESC']],
            limit: 10
          }
        ]
      });

      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }

      // Get tenant statistics
      const tenantStats = await this.getTenantStatistics(tenantId);

      // Format response
      const tenantData = {
        id: tenant.id,
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        email: tenant.email,
        phone: tenant.phone,
        dateOfBirth: tenant.dateOfBirth,
        ssn: tenant.ssn ? '***-**-' + tenant.ssn.slice(-4) : null, // Mask SSN
        driverLicense: tenant.driverLicense,
        emergencyContact: tenant.emergencyContact,
        employer: tenant.employer,
        employerPhone: tenant.employerPhone,
        income: tenant.income,
        notes: tenant.notes,
        preferences: tenant.preferences || {},
        status: tenant.status,
        documents: tenant.documents || [],
        metadata: tenant.metadata || {},
        leases: tenant.Leases.map(lease => ({
          id: lease.id,
          startDate: lease.startDate,
          endDate: lease.endDate,
          monthlyRent: lease.monthlyRent,
          securityDeposit: lease.securityDeposit,
          status: lease.status,
          unit: {
            id: lease.Unit.id,
            unitNumber: lease.Unit.unitNumber,
            property: {
              id: lease.Unit.Property.id,
              name: lease.Unit.Property.name,
              address: lease.Unit.Property.address,
              city: lease.Unit.Property.city,
              state: lease.Unit.Property.state,
              portfolio: lease.Unit.Property.Portfolio ? {
                id: lease.Unit.Property.Portfolio.id,
                name: lease.Unit.Property.Portfolio.name
              } : null
            }
          }
        })),
        currentLease: tenant.Leases.find(lease => lease.status === 'active') || null,
        paymentHistory: tenant.Payments.map(payment => ({
          id: payment.id,
          amount: payment.amount,
          dueDate: payment.dueDate,
          paidDate: payment.paidDate,
          status: payment.status,
          method: payment.method,
          reference: payment.reference
        })),
        maintenanceHistory: tenant.MaintenanceRequests.map(request => ({
          id: request.id,
          title: request.title,
          description: request.description,
          status: request.status,
          priority: request.priority,
          createdAt: request.createdAt,
          completedAt: request.completedAt
        })),
        statistics: tenantStats,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt
      };

      res.json({
        success: true,
        data: tenantData
      });
    } catch (error) {
      console.error('Get tenant by ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Create Tenant
   */
  async createTenant(req, res) {
    try {
      const { error } = validateTenant(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const userId = req.user.id;
      const userRoles = req.user.roles;

      const { 
        firstName, 
        lastName, 
        email, 
        phone, 
        dateOfBirth, 
        ssn, 
        driverLicense,
        emergencyContact,
        employer,
        employerPhone,
        income,
        notes,
        preferences,
        unitId, // Optional: assign to unit immediately
        leaseDetails // Optional: create lease immediately
      } = req.body;

      // Check if tenant with email already exists
      const existingTenant = await Tenant.findOne({ where: { email } });
      if (existingTenant) {
        return res.status(409).json({ error: 'Tenant with this email already exists' });
      }

      // If unitId is provided, check permissions
      if (unitId) {
        const hasAccess = await this.checkUnitAccess(unitId, userId, userRoles);
        if (!hasAccess) {
          return res.status(403).json({ error: 'Not authorized to assign tenant to this unit' });
        }

        // Check if unit is available
        const unit = await Unit.findByPk(unitId);
        if (!unit) {
          return res.status(404).json({ error: 'Unit not found' });
        }

        if (unit.status === 'occupied') {
          return res.status(400).json({ error: 'Unit is already occupied' });
        }
      }

      // Create tenant
      const tenant = await Tenant.create({
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: dateOfBirth || null,
        ssn: ssn || null,
        driverLicense: driverLicense || null,
        emergencyContact: emergencyContact || null,
        employer: employer || null,
        employerPhone: employerPhone || null,
        income: income || null,
        notes: notes || '',
        preferences: preferences || {},
        status: 'active',
        documents: [],
        metadata: {
          createdBy: userId,
          createdAt: new Date()
        },
        createdBy: userId
      });

      // If unitId and leaseDetails provided, create lease
      if (unitId && leaseDetails) {
        const lease = await Lease.create({
          tenantId: tenant.id,
          unitId,
          startDate: leaseDetails.startDate || new Date(),
          endDate: leaseDetails.endDate || null,
          monthlyRent: leaseDetails.monthlyRent || 0,
          securityDeposit: leaseDetails.securityDeposit || 0,
          status: 'active',
          terms: leaseDetails.terms || '',
          notes: leaseDetails.notes || '',
          createdBy: userId
        });

        // Update unit status
        await Unit.update(
          { status: 'occupied', tenantId: tenant.id },
          { where: { id: unitId } }
        );

        // Update property statistics
        const unit = await Unit.findByPk(unitId);
        if (unit && unit.propertyId) {
          await this.updatePropertyStatistics(unit.propertyId);
        }
      }

      // Send welcome email to tenant
      if (email) {
        await sendEmail({
          to: email,
          subject: 'Welcome to StaySpot - Your Tenant Account',
          template: 'tenant-welcome',
          data: {
            name: `${firstName} ${lastName}`,
            portalLink: `${process.env.FRONTEND_URL}/tenant/login`,
            supportEmail: 'support@stayspot.com'
          }
        });
      }

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'TENANT_CREATED',
        details: `Tenant created: ${firstName} ${lastName}`,
        ipAddress: req.ip,
        metadata: { 
          tenantId: tenant.id,
          email,
          unitAssigned: !!unitId,
          leaseCreated: !!(unitId && leaseDetails)
        }
      });

      res.status(201).json({
        success: true,
        message: 'Tenant created successfully',
        data: {
          id: tenant.id,
          name: `${tenant.firstName} ${tenant.lastName}`,
          email: tenant.email,
          phone: tenant.phone,
          status: tenant.status
        }
      });
    } catch (error) {
      console.error('Create tenant error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update Tenant
   */
  async updateTenant(req, res) {
    try {
      const { tenantId } = req.params;
      const { error } = validateTenantUpdate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check tenant access
      const hasAccess = await this.checkTenantAccess(tenantId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to update this tenant' });
      }

      const tenant = await Tenant.findByPk(tenantId);
      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }

      const updates = req.body;
      const changes = {};

      // Update fields
      const updatableFields = [
        'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'ssn',
        'driverLicense', 'emergencyContact', 'employer', 'employerPhone',
        'income', 'notes', 'preferences', 'status', 'documents'
      ];

      updatableFields.forEach(field => {
        if (updates[field] !== undefined && updates[field] !== tenant[field]) {
          changes[field] = { from: tenant[field], to: updates[field] };
          tenant[field] = updates[field];
        }
      });

      // Check if email is being changed and if it conflicts
      if (updates.email && updates.email !== tenant.email) {
        const existingTenant = await Tenant.findOne({ 
          where: { 
            email: updates.email,
            id: { [Op.ne]: tenantId }
          } 
        });

        if (existingTenant) {
          return res.status(409).json({ error: 'Another tenant with this email already exists' });
        }
      }

      tenant.updatedBy = userId;
      await tenant.save();

      // Create audit log if changes were made
      if (Object.keys(changes).length > 0) {
        await AuditLog.create({
          userId,
          action: 'TENANT_UPDATED',
          details: `Tenant updated: ${tenant.firstName} ${tenant.lastName}`,
          ipAddress: req.ip,
          metadata: { 
            tenantId: tenant.id, 
            changes 
          }
        });
      }

      res.json({
        success: true,
        message: 'Tenant updated successfully',
        data: {
          id: tenant.id,
          name: `${tenant.firstName} ${tenant.lastName}`,
          email: tenant.email,
          phone: tenant.phone,
          status: tenant.status,
          updatedFields: Object.keys(changes)
        }
      });
    } catch (error) {
      console.error('Update tenant error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Delete Tenant
   */
  async deleteTenant(req, res) {
    try {
      const { tenantId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check tenant access
      const hasAccess = await this.checkTenantAccess(tenantId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to delete this tenant' });
      }

      const tenant = await Tenant.findByPk(tenantId, {
        include: [{
          model: Lease,
          where: { status: 'active' }
        }]
      });

      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }

      // Check if tenant has active leases
      if (tenant.Leases && tenant.Leases.length > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete tenant with active leases. End leases first.' 
        });
      }

      // Check if tenant has pending payments
      const pendingPayments = await Payment.count({
        where: { 
          tenantId,
          status: 'pending'
        }
      });

      if (pendingPayments > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete tenant with pending payments. Clear payments first.' 
        });
      }

      // Soft delete
      tenant.status = 'inactive';
      tenant.deletedAt = new Date();
      tenant.deletedBy = userId;
      await tenant.save();

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'TENANT_DELETED',
        details: `Tenant deactivated: ${tenant.firstName} ${tenant.lastName}`,
        ipAddress: req.ip,
        metadata: { tenantId: tenant.id }
      });

      res.json({
        success: true,
        message: 'Tenant deactivated successfully'
      });
    } catch (error) {
      console.error('Delete tenant error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Tenant Statistics
   */
  async getTenantStatistics(tenantId) {
    try {
      const [
        totalLeases,
        activeLeases,
        totalPayments,
        totalPaid,
        pendingPayments,
        maintenanceRequests,
        completedMaintenance
      ] = await Promise.all([
        Lease.count({ where: { tenantId } }),
        Lease.count({ where: { tenantId, status: 'active' } }),
        Payment.count({ where: { tenantId } }),
        Payment.sum('amount', { where: { tenantId, status: 'completed' } }) || 0,
        Payment.sum('amount', { where: { tenantId, status: 'pending' } }) || 0,
        MaintenanceRequest.count({ where: { tenantId } }),
        MaintenanceRequest.count({ where: { tenantId, status: 'completed' } })
      ]);

      // Calculate average payment time
      const payments = await Payment.findAll({
        where: { 
          tenantId,
          status: 'completed',
          dueDate: { [Op.ne]: null },
          paidDate: { [Op.ne]: null }
        },
        attributes: ['dueDate', 'paidDate']
      });

      let totalDaysLate = 0;
      let onTimePayments = 0;
      let latePayments = 0;

      payments.forEach(payment => {
        const dueDate = new Date(payment.dueDate);
        const paidDate = new Date(payment.paidDate);
        const daysDifference = Math.ceil((paidDate - dueDate) / (1000 * 60 * 60 * 24));
        
        if (daysDifference <= 0) {
          onTimePayments++;
        } else {
          latePayments++;
          totalDaysLate += daysDifference;
        }
      });

      const averageDaysLate = latePayments > 0 ? (totalDaysLate / latePayments).toFixed(2) : 0;
      const onTimeRate = payments.length > 0 ? ((onTimePayments / payments.length) * 100).toFixed(2) : 0;

      return {
        leases: {
          total: totalLeases,
          active: activeLeases,
          ended: totalLeases - activeLeases
        },
        payments: {
          total: totalPayments,
          totalAmount: parseFloat(totalPaid.toFixed(2)),
          pendingAmount: parseFloat(pendingPayments.toFixed(2)),
          onTimeRate: `${onTimeRate}%`,
          averageDaysLate: parseFloat(averageDaysLate),
          onTimeCount: onTimePayments,
          lateCount: latePayments
        },
        maintenance: {
          total: maintenanceRequests,
          completed: completedMaintenance,
          completionRate: maintenanceRequests > 0 ? 
            ((completedMaintenance / maintenanceRequests) * 100).toFixed(2) + '%' : '0%'
        }
      };
    } catch (error) {
      console.error('Get tenant statistics error:', error);
      return {
        leases: { total: 0, active: 0, ended: 0 },
        payments: { 
          total: 0, 
          totalAmount: 0, 
          pendingAmount: 0, 
          onTimeRate: '0%',
          averageDaysLate: 0,
          onTimeCount: 0,
          lateCount: 0
        },
        maintenance: { total: 0, completed: 0, completionRate: '0%' }
      };
    }
  }

  /**
   * Search Tenants
   */
  async searchTenants(req, res) {
    try {
      const { 
        query, 
        limit = 20,
        includeProperties = false
      } = req.query;

      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (!query || query.length < 2) {
        return res.status(400).json({ error: 'Search query must be at least 2 characters' });
      }

      // Get accessible tenant IDs based on permissions
      const accessibleTenantIds = await this.getAccessibleTenantIds(userId, userRoles);

      if (accessibleTenantIds.length === 0) {
        return res.json({
          success: true,
          data: []
        });
      }

      const whereClause = {
        id: { [Op.in]: accessibleTenantIds },
        [Op.or]: [
          { firstName: { [Op.like]: `%${query}%` } },
          { lastName: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
          { phone: { [Op.like]: `%${query}%` } }
        ]
      };

      const include = [];

      if (includeProperties === 'true') {
        include.push({
          model: Lease,
          where: { status: 'active' },
          required: false,
          limit: 1,
          include: [{
            model: Unit,
            include: [{
              model: Property,
              attributes: ['id', 'name', 'address']
            }]
          }]
        });
      }

      const tenants = await Tenant.findAll({
        where: whereClause,
        include: include,
        limit: parseInt(limit),
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });

      // Format response
      const formattedTenants = tenants.map(tenant => {
        const currentLease = tenant.Leases && tenant.Leases.length > 0 ? tenant.Leases[0] : null;
        const currentUnit = currentLease ? currentLease.Unit : null;
        const currentProperty = currentUnit ? currentUnit.Property : null;

        return {
          id: tenant.id,
          firstName: tenant.firstName,
          lastName: tenant.lastName,
          email: tenant.email,
          phone: tenant.phone,
          status: tenant.status,
          currentProperty: currentProperty ? {
            id: currentProperty.id,
            name: currentProperty.name,
            address: currentProperty.address
          } : null,
          matchScore: this.calculateMatchScore(tenant, query)
        };
      });

      // Sort by match score (highest first)
      formattedTenants.sort((a, b) => b.matchScore - a.matchScore);

      res.json({
        success: true,
        data: formattedTenants
      });
    } catch (error) {
      console.error('Search tenants error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Tenant Activity
   */
  async getTenantActivity(req, res) {
    try {
      const { tenantId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const offset = (page - 1) * limit;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check tenant access
      const hasAccess = await this.checkTenantAccess(tenantId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view activity for this tenant' });
      }

      // Get audit logs related to tenant
      const { count, rows: activities } = await AuditLog.findAndCountAll({
        where: {
          [Op.or]: [
            { 
              action: { 
                [Op.like]: 'TENANT_%' 
              },
              metadata: { 
                [Op.like]: `%\"tenantId\":\"${tenantId}\"%` 
              }
            },
            {
              action: { 
                [Op.like]: 'LEASE_%' 
              },
              metadata: { 
                [Op.like]: `%\"tenantId\":\"${tenantId}\"%` 
              }
            },
            {
              action: { 
                [Op.like]: 'PAYMENT_%' 
              },
              metadata: { 
                [Op.like]: `%\"tenantId\":\"${tenantId}\"%` 
              }
            },
            {
              action: { 
                [Op.like]: 'MAINTENANCE_%' 
              },
              metadata: { 
                [Op.like]: `%\"tenantId\":\"${tenantId}\"%` 
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
      console.error('Get tenant activity error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Upload Tenant Documents
   */
  async uploadDocuments(req, res) {
    try {
      const { tenantId } = req.params;
      const { documents } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (!Array.isArray(documents) || documents.length === 0) {
        return res.status(400).json({ error: 'Documents array is required' });
      }

      // Check tenant access
      const hasAccess = await this.checkTenantAccess(tenantId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to upload documents for this tenant' });
      }

      const tenant = await Tenant.findByPk(tenantId);
      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }

      // Validate documents
      const validDocuments = documents.filter(doc => 
        doc.name && doc.url && doc.type
      );

      if (validDocuments.length === 0) {
        return res.status(400).json({ error: 'No valid documents provided' });
      }

      // Get existing documents
      const existingDocuments = tenant.documents || [];
      
      // Add new documents
      const newDocuments = validDocuments.map(doc => ({
        ...doc,
        uploadedBy: userId,
        uploadedAt: new Date(),
        id: Date.now() + Math.random().toString(36).substr(2, 9) // Generate unique ID
      }));

      // Update tenant documents
      tenant.documents = [...existingDocuments, ...newDocuments];
      tenant.updatedBy = userId;
      await tenant.save();

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'TENANT_DOCUMENTS_UPLOADED',
        details: `${newDocuments.length} documents uploaded for tenant: ${tenant.firstName} ${tenant.lastName}`,
        ipAddress: req.ip,
        metadata: { 
          tenantId: tenant.id,
          documentCount: newDocuments.length,
          documentTypes: [...new Set(newDocuments.map(doc => doc.type))]
        }
      });

      res.json({
        success: true,
        message: `${newDocuments.length} documents uploaded successfully`,
        data: {
          tenantId: tenant.id,
          documentCount: tenant.documents.length,
          newDocuments: newDocuments.map(doc => ({
            id: doc.id,
            name: doc.name,
            type: doc.type,
            uploadedAt: doc.uploadedAt
          }))
        }
      });
    } catch (error) {
      console.error('Upload documents error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Remove Tenant Document
   */
  async removeDocument(req, res) {
    try {
      const { tenantId, documentId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check tenant access
      const hasAccess = await this.checkTenantAccess(tenantId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to remove documents for this tenant' });
      }

      const tenant = await Tenant.findByPk(tenantId);
      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }

      const documents = tenant.documents || [];
      const documentIndex = documents.findIndex(doc => doc.id === documentId);

      if (documentIndex === -1) {
        return res.status(404).json({ error: 'Document not found' });
      }

      const removedDocument = documents[documentIndex];

      // Remove document
      documents.splice(documentIndex, 1);
      tenant.documents = documents;
      tenant.updatedBy = userId;
      await tenant.save();

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'TENANT_DOCUMENT_REMOVED',
        details: `Document removed from tenant: ${tenant.firstName} ${tenant.lastName}`,
        ipAddress: req.ip,
        metadata: { 
          tenantId: tenant.id,
          documentId,
          documentName: removedDocument.name,
          documentType: removedDocument.type
        }
      });

      res.json({
        success: true,
        message: 'Document removed successfully',
        data: {
          tenantId: tenant.id,
          documentId,
          remainingDocuments: documents.length
        }
      });
    } catch (error) {
      console.error('Remove document error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Send Message to Tenant
   */
  async sendMessage(req, res) {
    try {
      const { tenantId } = req.params;
      const { subject, message, type = 'general' } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (!subject || !message) {
        return res.status(400).json({ error: 'Subject and message are required' });
      }

      // Check tenant access
      const hasAccess = await this.checkTenantAccess(tenantId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to send messages to this tenant' });
      }

      const tenant = await Tenant.findByPk(tenantId);
      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }

      // Get sender info
      const sender = await User.findByPk(userId);

      // Send email to tenant
      await sendEmail({
        to: tenant.email,
        subject: `StaySpot: ${subject}`,
        template: 'tenant-message',
        data: {
          tenantName: `${tenant.firstName} ${tenant.lastName}`,
          senderName: `${sender.firstName} ${sender.lastName}`,
          senderEmail: sender.email,
          subject,
          message,
          replyTo: sender.email,
          portalLink: `${process.env.FRONTEND_URL}/tenant/messages`
        }
      });

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'TENANT_MESSAGE_SENT',
        details: `Message sent to tenant: ${tenant.firstName} ${tenant.lastName}`,
        ipAddress: req.ip,
        metadata: { 
          tenantId: tenant.id,
          subject,
          messageType: type,
          sender: `${sender.firstName} ${sender.lastName}`
        }
      });

      res.json({
        success: true,
        message: 'Message sent successfully',
        data: {
          tenantId: tenant.id,
          tenantEmail: tenant.email,
          subject,
          sentAt: new Date()
        }
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Tenant Dashboard
   */
  async getTenantDashboard(req, res) {
    try {
      const { tenantId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check tenant access
      const hasAccess = await this.checkTenantAccess(tenantId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view dashboard for this tenant' });
      }

      const tenant = await Tenant.findByPk(tenantId, {
        include: [
          {
            model: Lease,
            where: { status: 'active' },
            required: false,
            limit: 1,
            include: [{
              model: Unit,
              include: [{
                model: Property,
                include: [{
                  model: Portfolio
                }]
              }]
            }]
          },
          {
            model: Payment,
            where: { 
              status: 'pending',
              dueDate: { [Op.gte]: new Date() }
            },
            order: [['dueDate', 'ASC']],
            limit: 5
          },
          {
            model: MaintenanceRequest,
            where: { status: { [Op.in]: ['open', 'in_progress'] } },
            order: [['createdAt', 'DESC']],
            limit: 5
          }
        ]
      });

      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }

      const currentLease = tenant.Leases && tenant.Leases.length > 0 ? tenant.Leases[0] : null;
      const currentUnit = currentLease ? currentLease.Unit : null;
      const currentProperty = currentUnit ? currentUnit.Property : null;

      // Get recent payments
      const recentPayments = await Payment.findAll({
        where: { tenantId },
        order: [['paidDate', 'DESC']],
        limit: 10
      });

      // Get maintenance statistics
      const maintenanceStats = await MaintenanceRequest.findAll({
        where: { tenantId },
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status']
      });

      // Calculate balance
      const totalBalance = await Payment.sum('amount', {
        where: { 
          tenantId,
          status: 'pending'
        }
      }) || 0;

      // Format response
      const dashboardData = {
        tenant: {
          id: tenant.id,
          name: `${tenant.firstName} ${tenant.lastName}`,
          email: tenant.email,
          phone: tenant.phone,
          status: tenant.status
        },
        currentLease: currentLease ? {
          id: currentLease.id,
          startDate: currentLease.startDate,
          endDate: currentLease.endDate,
          monthlyRent: currentLease.monthlyRent,
          securityDeposit: currentLease.securityDeposit,
          daysRemaining: currentLease.endDate ? 
            Math.ceil((new Date(currentLease.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : null
        } : null,
        currentUnit: currentUnit ? {
          id: currentUnit.id,
          unitNumber: currentUnit.unitNumber,
          type: currentUnit.type,
          squareFeet: currentUnit.squareFeet,
          bedrooms: currentUnit.bedrooms,
          bathrooms: currentUnit.bathrooms,
          amenities: currentUnit.amenities
        } : null,
        currentProperty: currentProperty ? {
          id: currentProperty.id,
          name: currentProperty.name,
          address: currentProperty.address,
          city: currentProperty.city,
          state: currentProperty.state,
          zipCode: currentProperty.zipCode,
          phone: currentProperty.phone,
          email: currentProperty.email,
          manager: currentProperty.managedById ? await User.findByPk(currentProperty.managedById, {
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          }) : null
        } : null,
        financial: {
          totalBalance: parseFloat(totalBalance.toFixed(2)),
          pendingPayments: tenant.Payments.map(payment => ({
            id: payment.id,
            amount: payment.amount,
            dueDate: payment.dueDate,
            description: payment.description
          })),
          recentPayments: recentPayments.map(payment => ({
            id: payment.id,
            amount: payment.amount,
            paidDate: payment.paidDate,
            method: payment.method,
            status: payment.status
          }))
        },
        maintenance: {
          openRequests: tenant.MaintenanceRequests,
          statistics: maintenanceStats.reduce((acc, stat) => {
            acc[stat.status] = stat.get('count');
            return acc;
          }, {})
        },
        documents: tenant.documents || [],
        quickActions: this.getTenantQuickActions(tenantId, currentLease)
      };

      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      console.error('Get tenant dashboard error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Helper: Check tenant access
   */
  async checkTenantAccess(tenantId, userId, userRoles) {
    try {
      // System admin has access to all tenants
      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return true;
      }

      const tenant = await Tenant.findByPk(tenantId, {
        include: [{
          model: Lease,
          include: [{
            model: Unit,
            include: [{
              model: Property
            }]
          }]
        }]
      });

      if (!tenant) return false;

      // Tenant themselves can access their own data
      if (tenant.userId === userId) {
        return true;
      }

      // Get all properties the tenant is associated with
      const propertyIds = tenant.Leases
        .map(lease => lease.Unit?.Property?.id)
        .filter(id => id);

      if (propertyIds.length === 0) {
        return false;
      }

      // Company admin has access if tenant is in their company
      if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        const properties = await Property.findAll({
          where: { 
            id: { [Op.in]: propertyIds },
            companyId: user.companyId
          }
        });
        return properties.length > 0;
      }

      // Portfolio manager has access if tenant is in their portfolio
      if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Portfolio,
            as: 'ManagedPortfolios'
          }]
        });
        
        if (user.ManagedPortfolios && user.ManagedPortfolios.length > 0) {
          const managedPortfolioIds = user.ManagedPortfolios.map(p => p.id);
          const properties = await Property.findAll({
            where: { 
              id: { [Op.in]: propertyIds },
              portfolioId: { [Op.in]: managedPortfolioIds }
            }
          });
          return properties.length > 0;
        }
        return false;
      }

      // Property manager has access if tenant is in their properties
      if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Property,
            as: 'ManagedProperties'
          }]
        });
        
        if (user.ManagedProperties && user.ManagedProperties.length > 0) {
          const managedPropertyIds = user.ManagedProperties.map(p => p.id);
          return propertyIds.some(id => managedPropertyIds.includes(id));
        }
        return false;
      }

      // Landlord has access if tenant is in their properties
      if (userRoles.includes(ROLES.LANDLORD)) {
        const properties = await Property.findAll({
          where: { 
            id: { [Op.in]: propertyIds },
            ownerId: userId
          }
        });
        return properties.length > 0;
      }

      return false;
    } catch (error) {
      console.error('Check tenant access error:', error);
      return false;
    }
  }

  /**
   * Helper: Check unit access
   */
  async checkUnitAccess(unitId, userId, userRoles) {
    try {
      const unit = await Unit.findByPk(unitId, {
        include: [{
          model: Property
        }]
      });

      if (!unit || !unit.Property) return false;

      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return true;
      }

      if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        return user.companyId === unit.Property.companyId;
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
          return managedPortfolioIds.includes(unit.Property.portfolioId);
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
          return managedPropertyIds.includes(unit.Property.id);
        }
        return false;
      }

      if (userRoles.includes(ROLES.LANDLORD)) {
        return unit.Property.ownerId === userId;
      }

      return false;
    } catch (error) {
      console.error('Check unit access error:', error);
      return false;
    }
  }

  /**
   * Helper: Get accessible tenant IDs
   */
  async getAccessibleTenantIds(userId, userRoles) {
    try {
      let whereClause = {};

      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        // All tenants
        const tenants = await Tenant.findAll({ attributes: ['id'] });
        return tenants.map(t => t.id);
      }

      if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        if (user && user.companyId) {
          // Get properties in company
          const properties = await Property.findAll({
            where: { companyId: user.companyId },
            attributes: ['id']
          });
          const propertyIds = properties.map(p => p.id);
          
          // Get units in those properties
          const units = await Unit.findAll({
            where: { propertyId: { [Op.in]: propertyIds } },
            attributes: ['id']
          });
          const unitIds = units.map(u => u.id);
          
          // Get leases for those units
          const leases = await Lease.findAll({
            where: { unitId: { [Op.in]: unitIds } },
            attributes: ['tenantId']
          });
          
          return [...new Set(leases.map(l => l.tenantId))];
        }
      }

      if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Portfolio,
            as: 'ManagedPortfolios'
          }]
        });
        
        if (user.ManagedPortfolios && user.ManagedPortfolios.length > 0) {
          const portfolioIds = user.ManagedPortfolios.map(p => p.id);
          
          // Get properties in portfolios
          const properties = await Property.findAll({
            where: { portfolioId: { [Op.in]: portfolioIds } },
            attributes: ['id']
          });
          const propertyIds = properties.map(p => p.id);
          
          // Get units in those properties
          const units = await Unit.findAll({
            where: { propertyId: { [Op.in]: propertyIds } },
            attributes: ['id']
          });
          const unitIds = units.map(u => u.id);
          
          // Get leases for those units
          const leases = await Lease.findAll({
            where: { unitId: { [Op.in]: unitIds } },
            attributes: ['tenantId']
          });
          
          return [...new Set(leases.map(l => l.tenantId))];
        }
      }

      if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Property,
            as: 'ManagedProperties'
          }]
        });
        
        if (user.ManagedProperties && user.ManagedProperties.length > 0) {
          const propertyIds = user.ManagedProperties.map(p => p.id);
          
          // Get units in those properties
          const units = await Unit.findAll({
            where: { propertyId: { [Op.in]: propertyIds } },
            attributes: ['id']
          });
          const unitIds = units.map(u => u.id);
          
          // Get leases for those units
          const leases = await Lease.findAll({
            where: { unitId: { [Op.in]: unitIds } },
            attributes: ['tenantId']
          });
          
          return [...new Set(leases.map(l => l.tenantId))];
        }
      }

      if (userRoles.includes(ROLES.LANDLORD)) {
        // Get properties owned by landlord
        const properties = await Property.findAll({
          where: { ownerId: userId },
          attributes: ['id']
        });
        const propertyIds = properties.map(p => p.id);
        
        // Get units in those properties
        const units = await Unit.findAll({
          where: { propertyId: { [Op.in]: propertyIds } },
          attributes: ['id']
        });
        const unitIds = units.map(u => u.id);
        
        // Get leases for those units
        const leases = await Lease.findAll({
          where: { unitId: { [Op.in]: unitIds } },
          attributes: ['tenantId']
        });
        
        return [...new Set(leases.map(l => l.tenantId))];
      }

      return [];
    } catch (error) {
      console.error('Get accessible tenant IDs error:', error);
      return [];
    }
  }

  /**
   * Helper: Calculate match score for search
   */
  calculateMatchScore(tenant, query) {
    const searchTerms = query.toLowerCase().split(' ');
    const tenantData = [
      tenant.firstName.toLowerCase(),
      tenant.lastName.toLowerCase(),
      tenant.email.toLowerCase(),
      tenant.phone ? tenant.phone.toLowerCase() : ''
    ].join(' ');

    let score = 0;
    
    searchTerms.forEach(term => {
      if (tenantData.includes(term)) {
        score += 10;
        
        // Bonus for exact matches
        if (tenant.firstName.toLowerCase() === term || 
            tenant.lastName.toLowerCase() === term ||
            tenant.email.toLowerCase() === term) {
          score += 20;
        }
        
        // Bonus for beginning of word
        if (tenant.firstName.toLowerCase().startsWith(term) || 
            tenant.lastName.toLowerCase().startsWith(term)) {
          score += 15;
        }
      }
    });

    return score;
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

  /**
   * Helper: Get tenant quick actions
   */
  getTenantQuickActions(tenantId, currentLease) {
    const actions = [];

    if (currentLease) {
      actions.push({
        id: 'make_payment',
        label: 'Make Payment',
        description: 'Pay your rent online',
        icon: 'credit-card',
        path: `/tenant/payments/new`,
        color: 'green'
      });

      actions.push({
        id: 'request_maintenance',
        label: 'Request Maintenance',
        description: 'Submit a maintenance request',
        icon: 'tool',
        path: `/tenant/maintenance/new`,
        color: 'blue'
      });

      actions.push({
        id: 'view_lease',
        label: 'View Lease',
        description: 'Review your lease agreement',
        icon: 'document',
        path: `/tenant/leases/${currentLease.id}`,
        color: 'purple'
      });
    }

    actions.push({
      id: 'update_profile',
      label: 'Update Profile',
      description: 'Update your contact information',
      icon: 'user',
      path: `/tenant/profile`,
      color: 'yellow'
    });

    actions.push({
      id: 'contact_manager',
      label: 'Contact Manager',
      description: 'Send message to property manager',
      icon: 'mail',
      path: `/tenant/messages/new`,
      color: 'indigo'
    });

    return actions;
  }
}

module.exports = new TenantController();