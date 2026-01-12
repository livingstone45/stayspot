const { MaintenanceRequest, Property, Unit, Tenant, User, Vendor, WorkOrder, Document } = require('../../models');
const { Op } = require('sequelize');
const { sendEmail } = require('../../services/communication/email.service');
const { createNotification } = require('../../services/communication/notification.service');
const { assignWorkOrder } = require('../../services/workflow/assignment.service');

const maintenanceController = {
  // Get all maintenance requests
  getAllMaintenanceRequests: async (req, res) => {
    try {
      const { 
        propertyId, 
        unitId, 
        tenantId,
        status, 
        priority,
        category,
        fromDate,
        toDate,
        search,
        page = 1, 
        limit = 20 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = {};
      if (propertyId) where.propertyId = propertyId;
      if (unitId) where.unitId = unitId;
      if (tenantId) where.tenantId = tenantId;
      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (category) where.category = category;
      
      if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) where.createdAt[Op.gte] = new Date(fromDate);
        if (toDate) where.createdAt[Op.lte] = new Date(toDate);
      }
      
      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { '$Property.name$': { [Op.like]: `%${search}%` } },
          { '$Tenant.firstName$': { [Op.like]: `%${search}%` } },
          { '$Tenant.lastName$': { [Op.like]: `%${search}%` } }
        ];
      }
      
      const requests = await MaintenanceRequest.findAndCountAll({
        where,
        include: [
          {
            model: Property,
            attributes: ['id', 'name', 'address']
          },
          {
            model: Unit,
            attributes: ['id', 'unitNumber']
          },
          {
            model: Tenant,
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          },
          {
            model: User,
            as: 'CreatedBy',
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: User,
            as: 'AssignedTo',
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: WorkOrder,
            attributes: ['id', 'workOrderNumber', 'status']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [
          ['priority', 'DESC'],
          ['createdAt', 'DESC']
        ]
      });
      
      res.json({
        success: true,
        data: requests.rows,
        pagination: {
          total: requests.count,
          page: parseInt(page),
          pages: Math.ceil(requests.count / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get maintenance request by ID
  getMaintenanceRequestById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const request = await MaintenanceRequest.findByPk(id, {
        include: [
          {
            model: Property,
            include: ['address', 'maintenanceContacts']
          },
          {
            model: Unit,
            attributes: ['id', 'unitNumber', 'type', 'size']
          },
          {
            model: Tenant,
            include: [{
              model: User,
              attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
            }]
          },
          {
            model: User,
            as: 'CreatedBy',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          },
          {
            model: User,
            as: 'AssignedTo',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          },
          {
            model: WorkOrder,
            include: [
              {
                model: Vendor,
                attributes: ['id', 'name', 'email', 'phone', 'specialty']
              },
              {
                model: User,
                as: 'AssignedTo',
                attributes: ['id', 'firstName', 'lastName']
              }
            ]
          },
          {
            model: Document,
            where: { entityType: 'MaintenanceRequest', entityId: id },
            required: false
          }
        ]
      });
      
      if (!request) {
        return res.status(404).json({ success: false, message: 'Maintenance request not found' });
      }
      
      res.json({ success: true, data: request });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Create maintenance request
  createMaintenanceRequest: async (req, res) => {
    try {
      const {
        propertyId,
        unitId,
        tenantId,
        title,
        description,
        category,
        priority,
        accessInstructions,
        preferredTime,
        images,
        isEmergency
      } = req.body;
      
      // Validate property and unit
      const property = await Property.findByPk(propertyId);
      if (!property) {
        return res.status(404).json({ success: false, message: 'Property not found' });
      }
      
      const unit = await Unit.findByPk(unitId);
      if (!unit) {
        return res.status(404).json({ success: false, message: 'Unit not found' });
      }
      
      // Validate tenant if provided
      let tenant = null;
      if (tenantId) {
        tenant = await Tenant.findByPk(tenantId);
        if (!tenant) {
          return res.status(404).json({ success: false, message: 'Tenant not found' });
        }
      }
      
      // Determine priority
      let determinedPriority = priority || 'medium';
      if (isEmergency) {
        determinedPriority = 'emergency';
      } else if (!priority) {
        // Auto-detect priority based on category
        const emergencyCategories = ['plumbing', 'electrical', 'heating', 'security', 'lockout'];
        if (emergencyCategories.includes(category)) {
          determinedPriority = 'high';
        }
      }
      
      // Generate request number
      const requestCount = await MaintenanceRequest.count();
      const requestNumber = `MR-${new Date().getFullYear()}-${String(requestCount + 1).padStart(6, '0')}`;
      
      // Create maintenance request
      const maintenanceRequest = await MaintenanceRequest.create({
        requestNumber,
        propertyId,
        unitId,
        tenantId: tenant ? tenant.id : null,
        title,
        description,
        category: category || 'general',
        priority: determinedPriority,
        accessInstructions: accessInstructions || '',
        preferredTime: preferredTime ? new Date(preferredTime) : null,
        images: images || [],
        status: 'submitted', // submitted, assigned, in_progress, completed, cancelled
        isEmergency: isEmergency || false,
        createdById: req.user.id,
        companyId: property.companyId,
        portfolioId: property.portfolioId
      });
      
      // Auto-assign based on rules
      const assignment = await assignWorkOrder(maintenanceRequest);
      
      if (assignment.assignedTo) {
        await maintenanceRequest.update({
          assignedToId: assignment.assignedTo,
          status: 'assigned',
          assignedAt: new Date()
        });
      }
      
      // Send notifications
      if (tenant) {
        // Notify tenant
        const tenantUser = await User.findByPk(tenant.userId);
        if (tenantUser) {
          await sendEmail({
            to: tenantUser.email,
            subject: `Maintenance Request #${requestNumber} Submitted`,
            template: 'maintenance-request-submitted',
            data: {
              firstName: tenant.firstName,
              requestNumber,
              title,
              description,
              priority: determinedPriority,
              estimatedResponse: determinedPriority === 'emergency' ? 'Within 2 hours' : 'Within 24 hours'
            }
          });
        }
      }
      
      // Notify maintenance team
      await createNotification({
        userId: req.user.id,
        type: 'new_maintenance_request',
        title: 'New Maintenance Request',
        message: `${requestNumber}: ${title} - ${determinedPriority.toUpperCase()} priority`,
        data: { 
          requestId: maintenanceRequest.id, 
          propertyId, 
          unitId,
          priority: determinedPriority 
        },
        recipients: ['maintenance_staff', 'property_managers']
      });
      
      // If emergency, send immediate alerts
      if (determinedPriority === 'emergency') {
        await createNotification({
          userId: req.user.id,
          type: 'emergency_maintenance',
          title: 'EMERGENCY Maintenance Request',
          message: `EMERGENCY: ${requestNumber} - ${title}`,
          data: { requestId: maintenanceRequest.id },
          recipients: ['maintenance_supervisors', 'property_managers', 'company_admins'],
          priority: 'high'
        });
      }
      
      res.status(201).json({
        success: true,
        message: 'Maintenance request created successfully',
        data: maintenanceRequest,
        assignment: assignment
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update maintenance request
  updateMaintenanceRequest: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const maintenanceRequest = await MaintenanceRequest.findByPk(id, {
        include: [
          { model: Tenant },
          { model: Property },
          { model: Unit }
        ]
      });
      
      if (!maintenanceRequest) {
        return res.status(404).json({ success: false, message: 'Maintenance request not found' });
      }
      
      // Check if status is being changed
      if (updates.status && updates.status !== maintenanceRequest.status) {
        const validTransitions = {
          submitted: ['assigned', 'cancelled'],
          assigned: ['in_progress', 'cancelled'],
          in_progress: ['completed', 'cancelled'],
          completed: [], // No transitions from completed
          cancelled: [] // No transitions from cancelled
        };
        
        const allowedTransitions = validTransitions[maintenanceRequest.status] || [];
        if (!allowedTransitions.includes(updates.status)) {
          return res.status(400).json({
            success: false,
            message: `Cannot transition from ${maintenanceRequest.status} to ${updates.status}`
          });
        }
        
        // Handle status-specific logic
        if (updates.status === 'assigned' && updates.assignedToId) {
          updates.assignedAt = new Date();
        } else if (updates.status === 'in_progress') {
          updates.startedAt = new Date();
        } else if (updates.status === 'completed') {
          updates.completedAt = new Date();
          updates.completedById = req.user.id;
        } else if (updates.status === 'cancelled') {
          updates.cancelledAt = new Date();
          updates.cancelledById = req.user.id;
          updates.cancellationReason = updates.cancellationReason || 'No reason provided';
        }
      }
      
      // Update maintenance request
      await maintenanceRequest.update(updates);
      
      // Send status update notifications
      if (updates.status && updates.status !== maintenanceRequest._previousDataValues.status) {
        await sendStatusUpdateNotification(maintenanceRequest, req.user.id);
      }
      
      res.json({
        success: true,
        message: 'Maintenance request updated successfully',
        data: maintenanceRequest
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Assign maintenance request
  assignMaintenanceRequest: async (req, res) => {
    try {
      const { id } = req.params;
      const { assignedToId, vendorId, notes, estimatedCompletion } = req.body;
      
      const maintenanceRequest = await MaintenanceRequest.findByPk(id, {
        include: [
          { model: Tenant },
          { model: Property },
          { model: Unit }
        ]
      });
      
      if (!maintenanceRequest) {
        return res.status(404).json({ success: false, message: 'Maintenance request not found' });
      }
      
      if (maintenanceRequest.status !== 'submitted' && maintenanceRequest.status !== 'assigned') {
        return res.status(400).json({
          success: false,
          message: `Cannot assign a request that is ${maintenanceRequest.status}`
        });
      }
      
      // Validate assignee
      if (assignedToId) {
        const assignee = await User.findByPk(assignedToId);
        if (!assignee) {
          return res.status(404).json({ success: false, message: 'Assignee not found' });
        }
      }
      
      // Validate vendor
      if (vendorId) {
        const vendor = await Vendor.findByPk(vendorId);
        if (!vendor) {
          return res.status(404).json({ success: false, message: 'Vendor not found' });
        }
      }
      
      // Create work order if vendor is assigned
      let workOrder = null;
      if (vendorId) {
        workOrder = await WorkOrder.create({
          workOrderNumber: `WO-${new Date().getFullYear()}-${String(await WorkOrder.count() + 1).padStart(6, '0')}`,
          maintenanceRequestId: maintenanceRequest.id,
          vendorId,
          assignedToId: assignedToId || null,
          description: maintenanceRequest.description,
          priority: maintenanceRequest.priority,
          estimatedCompletion: estimatedCompletion ? new Date(estimatedCompletion) : null,
          notes: notes || '',
          status: 'assigned',
          createdById: req.user.id,
          companyId: maintenanceRequest.companyId
        });
      }
      
      // Update maintenance request
      await maintenanceRequest.update({
        assignedToId,
        vendorId,
        status: 'assigned',
        assignedAt: new Date(),
        assignedById: req.user.id,
        assignmentNotes: notes
      });
      
      // Send assignment notifications
      if (assignedToId) {
        const assignee = await User.findByPk(assignedToId);
        if (assignee) {
          await sendEmail({
            to: assignee.email,
            subject: `New Maintenance Assignment: ${maintenanceRequest.requestNumber}`,
            template: 'maintenance-assigned',
            data: {
              firstName: assignee.firstName,
              requestNumber: maintenanceRequest.requestNumber,
              title: maintenanceRequest.title,
              propertyName: maintenanceRequest.Property?.name || 'Unknown Property',
              unitNumber: maintenanceRequest.Unit?.unitNumber || 'N/A',
              priority: maintenanceRequest.priority,
              notes: notes
            }
          });
        }
      }
      
      if (vendorId && workOrder) {
        const vendor = await Vendor.findByPk(vendorId);
        if (vendor) {
          await sendEmail({
            to: vendor.email,
            subject: `New Work Order: ${workOrder.workOrderNumber}`,
            template: 'vendor-work-order',
            data: {
              vendorName: vendor.name,
              workOrderNumber: workOrder.workOrderNumber,
              requestNumber: maintenanceRequest.requestNumber,
              description: maintenanceRequest.description,
              propertyName: maintenanceRequest.Property?.name || 'Unknown Property',
              address: maintenanceRequest.Property?.address || 'N/A',
              contactPerson: maintenanceRequest.Tenant ? 
                `${maintenanceRequest.Tenant.firstName} ${maintenanceRequest.Tenant.lastName}` : 
                'Property Manager',
              contactPhone: maintenanceRequest.Tenant?.phone || maintenanceRequest.Property?.maintenanceContact?.phone || 'N/A'
            }
          });
        }
      }
      
      // Notify tenant
      if (maintenanceRequest.tenantId) {
        const tenantUser = await User.findByPk(maintenanceRequest.Tenant.userId);
        if (tenantUser) {
          await sendEmail({
            to: tenantUser.email,
            subject: `Maintenance Request Update: ${maintenanceRequest.requestNumber}`,
            template: 'maintenance-assigned-tenant',
            data: {
              firstName: maintenanceRequest.Tenant.firstName,
              requestNumber: maintenanceRequest.requestNumber,
              title: maintenanceRequest.title,
              assignedTo: assignedToId ? 
                (await User.findByPk(assignedToId))?.firstName + ' (Staff)' : 
                vendorId ? 
                (await Vendor.findByPk(vendorId))?.name + ' (Vendor)' : 
                'Maintenance Team',
              estimatedCompletion: estimatedCompletion || 'Will be scheduled soon'
            }
          });
        }
      }
      
      res.json({
        success: true,
        message: 'Maintenance request assigned successfully',
        data: {
          maintenanceRequest,
          workOrder
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Add update to maintenance request
  addUpdate: async (req, res) => {
    try {
      const { id } = req.params;
      const { update, images, isInternal } = req.body;
      const files = req.files || [];
      
      const maintenanceRequest = await MaintenanceRequest.findByPk(id, {
        include: [{ model: Tenant }]
      });
      
      if (!maintenanceRequest) {
        return res.status(404).json({ success: false, message: 'Maintenance request not found' });
      }
      
      // Create update entry
      const updates = maintenanceRequest.updates || [];
      const newUpdate = {
        id: Date.now(),
        text: update,
        addedBy: req.user.id,
        addedByName: `${req.user.firstName} ${req.user.lastName}`,
        addedAt: new Date(),
        images: images || [],
        isInternal: isInternal || false
      };
      
      // Handle file uploads
      if (files.length > 0) {
        newUpdate.images = files.map(file => ({
          name: file.originalname,
          url: file.path,
          uploadedAt: new Date()
        }));
      }
      
      updates.push(newUpdate);
      
      // Update maintenance request
      await maintenanceRequest.update({
        updates,
        lastUpdatedAt: new Date(),
        lastUpdatedById: req.user.id
      });
      
      // Send update notification to tenant if not internal
      if (!isInternal && maintenanceRequest.tenantId) {
        const tenantUser = await User.findByPk(maintenanceRequest.Tenant.userId);
        if (tenantUser) {
          await sendEmail({
            to: tenantUser.email,
            subject: `Update on Maintenance Request #${maintenanceRequest.requestNumber}`,
            template: 'maintenance-update',
            data: {
              firstName: maintenanceRequest.Tenant.firstName,
              requestNumber: maintenanceRequest.requestNumber,
              title: maintenanceRequest.title,
              update: update,
              status: maintenanceRequest.status
            }
          });
        }
      }
      
      res.json({
        success: true,
        message: 'Update added successfully',
        data: newUpdate
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Complete maintenance request
  completeMaintenanceRequest: async (req, res) => {
    try {
      const { id } = req.params;
      const { completionNotes, cost, beforeImages, afterImages, tenantSatisfaction } = req.body;
      const files = req.files || [];
      
      const maintenanceRequest = await MaintenanceRequest.findByPk(id, {
        include: [
          { model: Tenant },
          { model: Property },
          { model: Unit }
        ]
      });
      
      if (!maintenanceRequest) {
        return res.status(404).json({ success: false, message: 'Maintenance request not found' });
      }
      
      if (maintenanceRequest.status === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Maintenance request is already completed'
        });
      }
      
      if (maintenanceRequest.status === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Cannot complete a cancelled maintenance request'
        });
      }
      
      // Handle file uploads
      const uploadedImages = files.map(file => ({
        name: file.originalname,
        url: file.path,
        type: file.fieldname || 'completion',
        uploadedAt: new Date()
      }));
      
      // Update maintenance request
      await maintenanceRequest.update({
        status: 'completed',
        completedAt: new Date(),
        completedById: req.user.id,
        completionNotes: completionNotes || '',
        cost: parseFloat(cost) || 0,
        beforeImages: beforeImages || [],
        afterImages: [...(afterImages || []), ...uploadedImages.filter(img => img.type === 'after')],
        tenantSatisfaction: tenantSatisfaction || null,
        completionImages: uploadedImages
      });
      
      // Update associated work order if exists
      const workOrder = await WorkOrder.findOne({
        where: { maintenanceRequestId: id }
      });
      
      if (workOrder) {
        await workOrder.update({
          status: 'completed',
          completedAt: new Date(),
          completionNotes: completionNotes,
          actualCost: parseFloat(cost) || 0
        });
      }
      
      // Send completion notification to tenant
      if (maintenanceRequest.tenantId) {
        const tenantUser = await User.findByPk(maintenanceRequest.Tenant.userId);
        if (tenantUser) {
          await sendEmail({
            to: tenantUser.email,
            subject: `Maintenance Request #${maintenanceRequest.requestNumber} Completed`,
            template: 'maintenance-completed',
            data: {
              firstName: maintenanceRequest.Tenant.firstName,
              requestNumber: maintenanceRequest.requestNumber,
              title: maintenanceRequest.title,
              completionNotes: completionNotes,
              completedBy: `${req.user.firstName} ${req.user.lastName}`,
              satisfactionSurvey: tenantSatisfaction === null // Only send survey if not already rated
            }
          });
        }
      }
      
      // Notify property manager
      await createNotification({
        userId: req.user.id,
        type: 'maintenance_completed',
        title: 'Maintenance Request Completed',
        message: `${maintenanceRequest.requestNumber}: ${maintenanceRequest.title} has been completed`,
        data: { 
          requestId: maintenanceRequest.id,
          cost: parseFloat(cost) || 0
        },
        recipients: ['property_managers']
      });
      
      res.json({
        success: true,
        message: 'Maintenance request completed successfully',
        data: maintenanceRequest
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Cancel maintenance request
  cancelMaintenanceRequest: async (req, res) => {
    try {
      const { id } = req.params;
      const { cancellationReason, notes } = req.body;
      
      const maintenanceRequest = await MaintenanceRequest.findByPk(id, {
        include: [{ model: Tenant }]
      });
      
      if (!maintenanceRequest) {
        return res.status(404).json({ success: false, message: 'Maintenance request not found' });
      }
      
      if (['completed', 'cancelled'].includes(maintenanceRequest.status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot cancel a ${maintenanceRequest.status} maintenance request`
        });
      }
      
      // Update maintenance request
      await maintenanceRequest.update({
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledById: req.user.id,
        cancellationReason: cancellationReason || 'No reason provided',
        cancellationNotes: notes || ''
      });
      
      // Cancel associated work order if exists
      const workOrder = await WorkOrder.findOne({
        where: { maintenanceRequestId: id }
      });
      
      if (workOrder) {
        await workOrder.update({
          status: 'cancelled',
          cancelledAt: new Date(),
          cancellationReason: cancellationReason
        });
      }
      
      // Send cancellation notification to tenant
      if (maintenanceRequest.tenantId) {
        const tenantUser = await User.findByPk(maintenanceRequest.Tenant.userId);
        if (tenantUser) {
          await sendEmail({
            to: tenantUser.email,
            subject: `Maintenance Request #${maintenanceRequest.requestNumber} Cancelled`,
            template: 'maintenance-cancelled',
            data: {
              firstName: maintenanceRequest.Tenant.firstName,
              requestNumber: maintenanceRequest.requestNumber,
              title: maintenanceRequest.title,
              cancellationReason: cancellationReason,
              notes: notes
            }
          });
        }
      }
      
      res.json({
        success: true,
        message: 'Maintenance request cancelled successfully',
        data: maintenanceRequest
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get maintenance statistics
  getMaintenanceStatistics: async (req, res) => {
    try {
      const { companyId, portfolioId, propertyId, timeframe = '30d' } = req.query;
      
      const where = {};
      if (companyId) where.companyId = companyId;
      if (portfolioId) where.portfolioId = portfolioId;
      if (propertyId) where.propertyId = propertyId;
      
      // Calculate date range
      const now = new Date();
      let startDate;
      
      switch (timeframe) {
        case '7d':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case '30d':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case '90d':
          startDate = new Date(now.setDate(now.getDate() - 90));
          break;
        case '1y':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = new Date(now.setDate(now.getDate() - 30));
      }
      
      where.createdAt = { [Op.gte]: startDate };
      
      const totalRequests = await MaintenanceRequest.count({ where });
      
      const byStatus = await MaintenanceRequest.findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where,
        group: ['status']
      });
      
      const byPriority = await MaintenanceRequest.findAll({
        attributes: ['priority', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where,
        group: ['priority']
      });
      
      const byCategory = await MaintenanceRequest.findAll({
        attributes: ['category', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where,
        group: ['category'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 10
      });
      
      // Calculate average completion time
      const completedRequests = await MaintenanceRequest.findAll({
        where: {
          ...where,
          status: 'completed',
          completedAt: { [Op.not]: null },
          createdAt: { [Op.not]: null }
        },
        attributes: ['id', 'createdAt', 'completedAt']
      });
      
      let totalCompletionTime = 0;
      completedRequests.forEach(request => {
        if (request.completedAt && request.createdAt) {
          const completionTime = new Date(request.completedAt) - new Date(request.createdAt);
          totalCompletionTime += completionTime;
        }
      });
      
      const avgCompletionTime = completedRequests.length > 0 
        ? totalCompletionTime / completedRequests.length 
        : 0;
      
      // Calculate total cost
      const costResult = await MaintenanceRequest.findOne({
        where: {
          ...where,
          status: 'completed',
          cost: { [Op.gt]: 0 }
        },
        attributes: [[sequelize.fn('SUM', sequelize.col('cost')), 'totalCost']]
      });
      
      const totalCost = parseFloat(costResult?.dataValues.totalCost || 0);
      
      // Get top properties with most requests
      const byProperty = await MaintenanceRequest.findAll({
        attributes: [
          'propertyId',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.literal('CASE WHEN status = "completed" THEN cost ELSE 0 END')), 'totalCost']
        ],
        where,
        group: ['propertyId'],
        include: [{
          model: Property,
          attributes: ['name']
        }],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 5
      });
      
      res.json({
        success: true,
        data: {
          totalRequests,
          byStatus: byStatus.reduce((acc, item) => {
            acc[item.status] = parseInt(item.dataValues.count);
            return acc;
          }, {}),
          byPriority: byPriority.reduce((acc, item) => {
            acc[item.priority] = parseInt(item.dataValues.count);
            return acc;
          }, {}),
          byCategory: byCategory.map(item => ({
            category: item.category,
            count: parseInt(item.dataValues.count)
          })),
          avgCompletionTime: parseFloat((avgCompletionTime / (1000 * 60 * 60)).toFixed(1)), // Convert to hours
          totalCost,
          byProperty: byProperty.map(item => ({
            propertyId: item.propertyId,
            propertyName: item.Property?.name || 'Unknown',
            requestCount: parseInt(item.dataValues.count),
            totalCost: parseFloat(item.dataValues.totalCost || 0)
          }))
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get pending maintenance requests
  getPendingRequests: async (req, res) => {
    try {
      const { assignedToId, priority } = req.query;
      
      const where = {
        status: { [Op.in]: ['submitted', 'assigned', 'in_progress'] }
      };
      
      if (assignedToId) {
        where.assignedToId = assignedToId;
      }
      
      if (priority) {
        where.priority = priority;
      }
      
      const requests = await MaintenanceRequest.findAll({
        where,
        include: [
          {
            model: Property,
            attributes: ['id', 'name', 'address']
          },
          {
            model: Unit,
            attributes: ['id', 'unitNumber']
          },
          {
            model: Tenant,
            attributes: ['id', 'firstName', 'lastName', 'phone']
          }
        ],
        order: [
          ['priority', 'DESC'],
          ['createdAt', 'ASC']
        ],
        limit: 50
      });
      
      res.json({
        success: true,
        data: requests
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Helper function to send status update notifications
async function sendStatusUpdateNotification(maintenanceRequest, userId) {
  const { requestNumber, title, status, tenantId } = maintenanceRequest;
  
  if (tenantId) {
    const tenant = await Tenant.findByPk(tenantId);
    if (tenant) {
      const tenantUser = await User.findByPk(tenant.userId);
      if (tenantUser) {
        await sendEmail({
          to: tenantUser.email,
          subject: `Maintenance Request #${requestNumber} Status Update`,
          template: 'maintenance-status-update',
          data: {
            firstName: tenant.firstName,
            requestNumber,
            title,
            status
          }
        });
      }
    }
  }
  
  // Create notification for staff
  await createNotification({
    userId,
    type: 'maintenance_status_update',
    title: `Maintenance Request ${status}`,
    message: `${requestNumber}: ${title} is now ${status}`,
    data: { requestId: maintenanceRequest.id, status },
    recipients: ['property_managers', 'maintenance_staff']
  });
}

module.exports = maintenanceController;