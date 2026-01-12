const { Lease, Tenant, Property, Unit, User, Payment, Document } = require('../../models');
const { Op } = require('sequelize');
const { sendEmail } = require('../../services/communication/email.service');
const { createNotification } = require('../../services/communication/notification.service');
const { generateLeaseDocument } = require('../../services/document.service');

const leaseController = {
  // Get all leases
  getAllLeases: async (req, res) => {
    try {
      const { 
        companyId, 
        portfolioId, 
        propertyId, 
        status, 
        type,
        startDateFrom,
        startDateTo,
        endDateFrom,
        endDateTo,
        search,
        page = 1, 
        limit = 20 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = {};
      if (companyId) where.companyId = companyId;
      if (portfolioId) where.portfolioId = portfolioId;
      if (propertyId) where.propertyId = propertyId;
      if (status) where.status = status;
      if (type) where.type = type;
      
      // Date filters
      if (startDateFrom || startDateTo) {
        where.startDate = {};
        if (startDateFrom) where.startDate[Op.gte] = new Date(startDateFrom);
        if (startDateTo) where.startDate[Op.lte] = new Date(startDateTo);
      }
      
      if (endDateFrom || endDateTo) {
        where.endDate = {};
        if (endDateFrom) where.endDate[Op.gte] = new Date(endDateFrom);
        if (endDateTo) where.endDate[Op.lte] = new Date(endDateTo);
      }
      
      if (search) {
        where[Op.or] = [
          { leaseNumber: { [Op.like]: `%${search}%` } },
          { '$Tenant.firstName$': { [Op.like]: `%${search}%` } },
          { '$Tenant.lastName$': { [Op.like]: `%${search}%` } },
          { '$Property.name$': { [Op.like]: `%${search}%` } }
        ];
      }
      
      const leases = await Lease.findAndCountAll({
        where,
        include: [
          {
            model: Tenant,
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          },
          {
            model: Property,
            attributes: ['id', 'name', 'address']
          },
          {
            model: Unit,
            attributes: ['id', 'unitNumber', 'type']
          },
          {
            model: User,
            as: 'CreatedBy',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });
      
      res.json({
        success: true,
        data: leases.rows,
        pagination: {
          total: leases.count,
          page: parseInt(page),
          pages: Math.ceil(leases.count / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get lease by ID
  getLeaseById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const lease = await Lease.findByPk(id, {
        include: [
          {
            model: Tenant,
            include: [{
              model: User,
              attributes: { exclude: ['password'] }
            }]
          },
          {
            model: Property,
            include: ['address', 'units', 'amenities']
          },
          {
            model: Unit,
            attributes: ['id', 'unitNumber', 'type', 'size', 'bedrooms', 'bathrooms']
          },
          {
            model: Payment,
            order: [['dueDate', 'ASC']]
          },
          {
            model: Document,
            where: { type: 'lease' },
            required: false
          },
          {
            model: User,
            as: 'CreatedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: User,
            as: 'ApprovedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });
      
      if (!lease) {
        return res.status(404).json({ success: false, message: 'Lease not found' });
      }
      
      res.json({ success: true, data: lease });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Create new lease
  createLease: async (req, res) => {
    try {
      const {
        tenantId,
        propertyId,
        unitId,
        type,
        startDate,
        endDate,
        rentAmount,
        securityDeposit,
        lateFee,
        gracePeriod,
        utilitiesIncluded,
        petsAllowed,
        parkingSpaces,
        additionalTerms,
        autoRenew,
        renewalPeriod,
        paymentDueDay,
        specialClauses
      } = req.body;
      
      // Validate tenant exists
      const tenant = await Tenant.findByPk(tenantId);
      if (!tenant) {
        return res.status(404).json({ success: false, message: 'Tenant not found' });
      }
      
      // Validate property exists
      const property = await Property.findByPk(propertyId);
      if (!property) {
        return res.status(404).json({ success: false, message: 'Property not found' });
      }
      
      // Validate unit exists and is available
      const unit = await Unit.findByPk(unitId);
      if (!unit) {
        return res.status(404).json({ success: false, message: 'Unit not found' });
      }
      
      if (unit.status !== 'available') {
        return res.status(400).json({
          success: false,
          message: `Unit is ${unit.status}. Cannot create lease for unavailable unit.`
        });
      }
      
      // Generate lease number
      const leaseCount = await Lease.count();
      const leaseNumber = `LEASE-${new Date().getFullYear()}-${String(leaseCount + 1).padStart(6, '0')}`;
      
      // Create lease
      const lease = await Lease.create({
        leaseNumber,
        tenantId,
        propertyId,
        unitId,
        type: type || 'standard', // standard, corporate, short_term, month_to_month
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        rentAmount: parseFloat(rentAmount),
        securityDeposit: parseFloat(securityDeposit) || 0,
        lateFee: parseFloat(lateFee) || 0,
        gracePeriod: parseInt(gracePeriod) || 5,
        utilitiesIncluded: utilitiesIncluded || [],
        petsAllowed: petsAllowed || false,
        parkingSpaces: parseInt(parkingSpaces) || 0,
        additionalTerms: additionalTerms || '',
        autoRenew: autoRenew || false,
        renewalPeriod: renewalPeriod || '12 months',
        paymentDueDay: parseInt(paymentDueDay) || 1,
        specialClauses: specialClauses || [],
        status: 'draft', // draft, pending_signature, active, expired, terminated
        createdById: req.user.id,
        companyId: property.companyId,
        portfolioId: property.portfolioId
      });
      
      // Update unit status
      await unit.update({ status: 'reserved' });
      
      // Update tenant move-in date
      await tenant.update({ 
        moveInDate: new Date(startDate),
        status: 'pending_move_in'
      });
      
      // Generate lease document
      const documentUrl = await generateLeaseDocument(lease);
      
      if (documentUrl) {
        await Document.create({
          type: 'lease',
          name: `Lease Agreement - ${leaseNumber}`,
          url: documentUrl,
          entityType: 'Lease',
          entityId: lease.id,
          uploadedById: req.user.id
        });
      }
      
      // Send notification
      await createNotification({
        userId: req.user.id,
        type: 'lease_created',
        title: 'New Lease Created',
        message: `Lease ${leaseNumber} created for ${tenant.firstName} ${tenant.lastName}`,
        data: { leaseId: lease.id, tenantId },
        recipients: ['tenant', 'property_managers', 'landlords']
      });
      
      res.status(201).json({
        success: true,
        message: 'Lease created successfully',
        data: lease
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update lease
  updateLease: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const lease = await Lease.findByPk(id);
      if (!lease) {
        return res.status(404).json({ success: false, message: 'Lease not found' });
      }
      
      // Check if lease can be modified
      if (lease.status === 'active' && updates.rentAmount) {
        // Create rent adjustment record instead of directly updating
        // This would go to a separate RentAdjustment model
        return res.status(400).json({
          success: false,
          message: 'Cannot change rent amount for active lease. Create a rent adjustment instead.'
        });
      }
      
      // Update lease
      await lease.update(updates);
      
      res.json({
        success: true,
        message: 'Lease updated successfully',
        data: lease
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Approve lease
  approveLease: async (req, res) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      
      const lease = await Lease.findByPk(id, {
        include: [
          { model: Tenant },
          { model: Property },
          { model: Unit }
        ]
      });
      
      if (!lease) {
        return res.status(404).json({ success: false, message: 'Lease not found' });
      }
      
      if (lease.status !== 'pending_signature') {
        return res.status(400).json({
          success: false,
          message: `Lease is ${lease.status}. Only pending signature leases can be approved.`
        });
      }
      
      // Update lease status
      await lease.update({
        status: 'active',
        approvedById: req.user.id,
        approvedAt: new Date(),
        approvalNotes: notes
      });
      
      // Update unit status
      await lease.Unit.update({ status: 'occupied' });
      
      // Update tenant status
      await lease.Tenant.update({ 
        status: 'active',
        moveInDate: lease.startDate
      });
      
      // Send approval email to tenant
      const tenantUser = await User.findByPk(lease.Tenant.userId);
      if (tenantUser) {
        await sendEmail({
          to: tenantUser.email,
          subject: 'Lease Approved - Welcome to Your New Home!',
          template: 'lease-approved',
          data: {
            firstName: lease.Tenant.firstName,
            lastName: lease.Tenant.lastName,
            propertyName: lease.Property.name,
            unitNumber: lease.Unit.unitNumber,
            startDate: lease.startDate,
            rentAmount: lease.rentAmount,
            paymentDueDay: lease.paymentDueDay
          }
        });
      }
      
      // Create notification
      await createNotification({
        userId: req.user.id,
        type: 'lease_approved',
        title: 'Lease Approved',
        message: `Lease ${lease.leaseNumber} has been approved and is now active`,
        data: { leaseId: lease.id },
        recipients: ['tenant', 'property_managers', 'landlords']
      });
      
      res.json({
        success: true,
        message: 'Lease approved successfully',
        data: lease
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Terminate lease
  terminateLease: async (req, res) => {
    try {
      const { id } = req.params;
      const { terminationDate, reason, notes, charges } = req.body;
      
      const lease = await Lease.findByPk(id, {
        include: [
          { model: Tenant },
          { model: Property },
          { model: Unit }
        ]
      });
      
      if (!lease) {
        return res.status(404).json({ success: false, message: 'Lease not found' });
      }
      
      if (!['active', 'pending_signature'].includes(lease.status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot terminate a lease with status: ${lease.status}`
        });
      }
      
      const termDate = new Date(terminationDate || new Date());
      
      // Update lease
      await lease.update({
        status: 'terminated',
        endDate: termDate,
        terminationDate: termDate,
        terminationReason: reason,
        terminationNotes: notes,
        terminationCharges: charges || [],
        terminatedById: req.user.id,
        terminatedAt: new Date()
      });
      
      // Update unit status
      await lease.Unit.update({ status: 'vacant_soon' });
      
      // Update tenant status
      await lease.Tenant.update({
        status: 'moving_out',
        moveOutDate: termDate
      });
      
      // Create move-out checklist
      // This would create tasks in the Task model
      
      // Send termination notice
      const tenantUser = await User.findByPk(lease.Tenant.userId);
      if (tenantUser) {
        await sendEmail({
          to: tenantUser.email,
          subject: 'Lease Termination Notice',
          template: 'lease-terminated',
          data: {
            firstName: lease.Tenant.firstName,
            propertyName: lease.Property.name,
            unitNumber: lease.Unit.unitNumber,
            terminationDate: termDate,
            reason: reason,
            notes: notes
          }
        });
      }
      
      res.json({
        success: true,
        message: 'Lease terminated successfully',
        data: lease
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Renew lease
  renewLease: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        newEndDate, 
        newRentAmount, 
        changes,
        autoRenew,
        renewalPeriod 
      } = req.body;
      
      const lease = await Lease.findByPk(id, {
        include: [
          { model: Tenant },
          { model: Property },
          { model: Unit }
        ]
      });
      
      if (!lease) {
        return res.status(404).json({ success: false, message: 'Lease not found' });
      }
      
      if (lease.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'Only active leases can be renewed'
        });
      }
      
      // Create new lease based on existing one
      const leaseCount = await Lease.count();
      const newLeaseNumber = `LEASE-${new Date().getFullYear()}-${String(leaseCount + 1).padStart(6, '0')}`;
      
      const newLease = await Lease.create({
        leaseNumber: newLeaseNumber,
        tenantId: lease.tenantId,
        propertyId: lease.propertyId,
        unitId: lease.unitId,
        type: lease.type,
        startDate: lease.endDate,
        endDate: new Date(newEndDate),
        rentAmount: parseFloat(newRentAmount) || lease.rentAmount,
        securityDeposit: lease.securityDeposit,
        lateFee: lease.lateFee,
        gracePeriod: lease.gracePeriod,
        utilitiesIncluded: lease.utilitiesIncluded,
        petsAllowed: lease.petsAllowed,
        parkingSpaces: lease.parkingSpaces,
        additionalTerms: changes ? `${lease.additionalTerms}\n\nRenewal Changes: ${changes}` : lease.additionalTerms,
        autoRenew: autoRenew || lease.autoRenew,
        renewalPeriod: renewalPeriod || lease.renewalPeriod,
        paymentDueDay: lease.paymentDueDay,
        specialClauses: lease.specialClauses,
        status: 'pending_signature',
        createdById: req.user.id,
        companyId: lease.companyId,
        portfolioId: lease.portfolioId,
        previousLeaseId: lease.id
      });
      
      // Mark old lease as expired
      await lease.update({ 
        status: 'expired',
        renewedToLeaseId: newLease.id
      });
      
      // Send renewal notice
      const tenantUser = await User.findByPk(lease.Tenant.userId);
      if (tenantUser) {
        await sendEmail({
          to: tenantUser.email,
          subject: 'Lease Renewal Offer',
          template: 'lease-renewal',
          data: {
            firstName: lease.Tenant.firstName,
            propertyName: lease.Property.name,
            unitNumber: lease.Unit.unitNumber,
            currentEndDate: lease.endDate,
            newEndDate: newLease.endDate,
            currentRent: lease.rentAmount,
            newRent: newLease.rentAmount,
            changes: changes
          }
        });
      }
      
      res.status(201).json({
        success: true,
        message: 'Lease renewal created successfully',
        data: newLease
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get lease statistics
  getLeaseStatistics: async (req, res) => {
    try {
      const { companyId, portfolioId, propertyId } = req.query;
      
      const where = {};
      if (companyId) where.companyId = companyId;
      if (portfolioId) where.portfolioId = portfolioId;
      if (propertyId) where.propertyId = propertyId;
      
      const totalLeases = await Lease.count({ where });
      
      const byStatus = await Lease.findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where,
        group: ['status']
      });
      
      const byType = await Lease.findAll({
        attributes: ['type', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where,
        group: ['type']
      });
      
      // Get leases expiring in next 30 days
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const expiringSoon = await Lease.count({
        where: {
          ...where,
          status: 'active',
          endDate: {
            [Op.between]: [new Date(), thirtyDaysFromNow]
          }
        }
      });
      
      // Get new leases this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const newThisMonth = await Lease.count({
        where: {
          ...where,
          createdAt: {
            [Op.gte]: startOfMonth
          }
        }
      });
      
      res.json({
        success: true,
        data: {
          totalLeases,
          byStatus: byStatus.reduce((acc, item) => {
            acc[item.status] = parseInt(item.dataValues.count);
            return acc;
          }, {}),
          byType: byType.reduce((acc, item) => {
            acc[item.type] = parseInt(item.dataValues.count);
            return acc;
          }, {}),
          expiringSoon,
          newThisMonth
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Generate lease agreement PDF
  generateLeaseAgreement: async (req, res) => {
    try {
      const { id } = req.params;
      
      const lease = await Lease.findByPk(id, {
        include: [
          { model: Tenant },
          { model: Property },
          { model: Unit }
        ]
      });
      
      if (!lease) {
        return res.status(404).json({ success: false, message: 'Lease not found' });
      }
      
      // Generate PDF
      const pdfBuffer = await generateLeaseDocument(lease);
      
      // Save as document record
      await Document.create({
        type: 'lease_agreement',
        name: `Lease Agreement - ${lease.leaseNumber} - ${new Date().toISOString().split('T')[0]}`,
        url: pdfBuffer, // This would be a URL if stored in cloud storage
        entityType: 'Lease',
        entityId: lease.id,
        uploadedById: req.user.id
      });
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="lease-${lease.leaseNumber}.pdf"`
      });
      
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = leaseController;