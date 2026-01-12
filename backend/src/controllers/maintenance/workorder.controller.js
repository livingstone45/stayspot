const { WorkOrder, MaintenanceRequest, Vendor, User, Property, Unit, Document } = require('../../models');
const { Op } = require('sequelize');
const { sendEmail } = require('../../services/communication/email.service');
const { createNotification } = require('../../services/communication/notification.service');

const workOrderController = {
  // Get all work orders
  getAllWorkOrders: async (req, res) => {
    try {
      const { 
        vendorId, 
        assignedToId,
        status, 
        priority,
        fromDate,
        toDate,
        search,
        page = 1, 
        limit = 20 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = {};
      if (vendorId) where.vendorId = vendorId;
      if (assignedToId) where.assignedToId = assignedToId;
      if (status) where.status = status;
      if (priority) where.priority = priority;
      
      if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) where.createdAt[Op.gte] = new Date(fromDate);
        if (toDate) where.createdAt[Op.lte] = new Date(toDate);
      }
      
      if (search) {
        where[Op.or] = [
          { workOrderNumber: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { '$Vendor.name$': { [Op.like]: `%${search}%` } },
          { '$MaintenanceRequest.requestNumber$': { [Op.like]: `%${search}%` } }
        ];
      }
      
      const workOrders = await WorkOrder.findAndCountAll({
        where,
        include: [
          {
            model: Vendor,
            attributes: ['id', 'name', 'email', 'phone', 'specialty']
          },
          {
            model: MaintenanceRequest,
            attributes: ['id', 'requestNumber', 'title', 'description'],
            include: [
              {
                model: Property,
                attributes: ['id', 'name', 'address']
              },
              {
                model: Unit,
                attributes: ['id', 'unitNumber']
              }
            ]
          },
          {
            model: User,
            as: 'AssignedTo',
            attributes: ['id', 'firstName', 'lastName']
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
        data: workOrders.rows,
        pagination: {
          total: workOrders.count,
          page: parseInt(page),
          pages: Math.ceil(workOrders.count / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get work order by ID
  getWorkOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const workOrder = await WorkOrder.findByPk(id, {
        include: [
          {
            model: Vendor,
            attributes: ['id', 'name', 'email', 'phone', 'specialty', 'rating', 'insuranceExpiry']
          },
          {
            model: MaintenanceRequest,
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
              }
            ]
          },
          {
            model: User,
            as: 'AssignedTo',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          },
          {
            model: User,
            as: 'CreatedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: User,
            as: 'CompletedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: Document,
            where: { entityType: 'WorkOrder', entityId: id },
            required: false
          }
        ]
      });
      
      if (!workOrder) {
        return res.status(404).json({ success: false, message: 'Work order not found' });
      }
      
      res.json({ success: true, data: workOrder });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Create work order
  createWorkOrder: async (req, res) => {
    try {
      const {
        maintenanceRequestId,
        vendorId,
        assignedToId,
        description,
        priority,
        estimatedCompletion,
        estimatedCost,
        notes,
        requiredMaterials
      } = req.body;
      
      // Validate maintenance request
      const maintenanceRequest = await MaintenanceRequest.findByPk(maintenanceRequestId, {
        include: [{ model: Property }]
      });
      
      if (!maintenanceRequest) {
        return res.status(404).json({ success: false, message: 'Maintenance request not found' });
      }
      
      // Validate vendor
      const vendor = await Vendor.findByPk(vendorId);
      if (!vendor) {
        return res.status(404).json({ success: false, message: 'Vendor not found' });
      }
      
      // Validate assigned staff if provided
      if (assignedToId) {
        const assignedTo = await User.findByPk(assignedToId);
        if (!assignedTo) {
          return res.status(404).json({ success: false, message: 'Assigned staff not found' });
        }
      }
      
      // Generate work order number
      const workOrderCount = await WorkOrder.count();
      const workOrderNumber = `WO-${new Date().getFullYear()}-${String(workOrderCount + 1).padStart(6, '0')}`;
      
      // Create work order
      const workOrder = await WorkOrder.create({
        workOrderNumber,
        maintenanceRequestId,
        vendorId,
        assignedToId,
        description: description || maintenanceRequest.description,
        priority: priority || maintenanceRequest.priority,
        estimatedCompletion: estimatedCompletion ? new Date(estimatedCompletion) : null,
        estimatedCost: parseFloat(estimatedCost) || 0,
        notes: notes || '',
        requiredMaterials: requiredMaterials || [],
        status: 'created', // created, assigned, in_progress, completed, cancelled
        createdById: req.user.id,
        companyId: maintenanceRequest.companyId,
        portfolioId: maintenanceRequest.portfolioId
      });
      
      // Update maintenance request status
      await maintenanceRequest.update({
        status: 'assigned',
        vendorId,
        assignedToId,
        assignedAt: new Date(),
        assignedById: req.user.id
      });
      
      // Send work order to vendor
      await sendEmail({
        to: vendor.email,
        subject: `New Work Order: ${workOrderNumber}`,
        template: 'vendor-work-order-assigned',
        data: {
          vendorName: vendor.name,
          workOrderNumber,
          description: workOrder.description,
          priority: workOrder.priority,
          estimatedCompletion: workOrder.estimatedCompletion ? 
            workOrder.estimatedCompletion.toLocaleDateString() : 'To be determined',
          estimatedCost: workOrder.estimatedCost,
          propertyName: maintenanceRequest.Property?.name || 'Unknown Property',
          propertyAddress: maintenanceRequest.Property?.address || 'N/A',
          contactPerson: maintenanceRequest.Tenant ? 
            `${maintenanceRequest.Tenant.firstName} ${maintenanceRequest.Tenant.lastName}` : 
            'Property Manager',
          contactPhone: maintenanceRequest.Tenant?.phone || maintenanceRequest.Property?.maintenanceContact?.phone || 'N/A',
          notes: workOrder.notes
        }
      });
      
      // Notify assigned staff
      if (assignedToId) {
        const assignedTo = await User.findByPk(assignedToId);
        if (assignedTo) {
          await sendEmail({
            to: assignedTo.email,
            subject: `New Work Order Assignment: ${workOrderNumber}`,
            template: 'staff-work-order-assigned',
            data: {
              firstName: assignedTo.firstName,
              workOrderNumber,
              description: workOrder.description,
              priority: workOrder.priority,
              vendorName: vendor.name,
              vendorContact: vendor.phone,
              estimatedCompletion: workOrder.estimatedCompletion ? 
                workOrder.estimatedCompletion.toLocaleDateString() : 'To be determined'
            }
          });
        }
      }
      
      // Create notification
      await createNotification({
        userId: req.user.id,
        type: 'work_order_created',
        title: 'New Work Order Created',
        message: `Work order ${workOrderNumber} assigned to ${vendor.name}`,
        data: { workOrderId: workOrder.id, vendorId },
        recipients: ['property_managers', 'maintenance_supervisors']
      });
      
      res.status(201).json({
        success: true,
        message: 'Work order created successfully',
        data: workOrder
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update work order
  updateWorkOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const workOrder = await WorkOrder.findByPk(id, {
        include: [
          { model: Vendor },
          { model: MaintenanceRequest }
        ]
      });
      
      if (!workOrder) {
        return res.status(404).json({ success: false, message: 'Work order not found' });
      }
      
      // Handle status transitions
      if (updates.status && updates.status !== workOrder.status) {
        const validTransitions = {
          created: ['assigned', 'cancelled'],
          assigned: ['in_progress', 'cancelled'],
          in_progress: ['completed', 'cancelled'],
          completed: [], // No transitions from completed
          cancelled: [] // No transitions from cancelled
        };
        
        const allowedTransitions = validTransitions[workOrder.status] || [];
        if (!allowedTransitions.includes(updates.status)) {
          return res.status(400).json({
            success: false,
            message: `Cannot transition from ${workOrder.status} to ${updates.status}`
          });
        }
        
        // Set timestamps for status changes
        if (updates.status === 'assigned') {
          updates.assignedAt = new Date();
        } else if (updates.status === 'in_progress') {
          updates.startedAt = new Date();
        } else if (updates.status === 'completed') {
          updates.completedAt = new Date();
          updates.completedById = req.user.id;
          
          // Update vendor rating if provided
          if (updates.vendorRating) {
            const vendor = await Vendor.findByPk(workOrder.vendorId);
            if (vendor) {
              const currentRating = vendor.rating || 0;
              const ratingCount = vendor.ratingCount || 0;
              const newRating = ((currentRating * ratingCount) + updates.vendorRating) / (ratingCount + 1);
              
              await vendor.update({
                rating: newRating,
                ratingCount: ratingCount + 1
              });
            }
          }
        } else if (updates.status === 'cancelled') {
          updates.cancelledAt = new Date();
          updates.cancelledById = req.user.id;
        }
      }
      
      // Update work order
      await workOrder.update(updates);
      
      // Update maintenance request status if work order is completed
      if (updates.status === 'completed' && workOrder.maintenanceRequestId) {
        const maintenanceRequest = await MaintenanceRequest.findByPk(workOrder.maintenanceRequestId);
        if (maintenanceRequest) {
          await maintenanceRequest.update({
            status: 'completed',
            completedAt: new Date(),
            completedById: req.user.id,
            cost: updates.actualCost || workOrder.estimatedCost || 0
          });
        }
      }
      
      res.json({
        success: true,
        message: 'Work order updated successfully',
        data: workOrder
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Add work order update
  addWorkOrderUpdate: async (req, res) => {
    try {
      const { id } = req.params;
      const { update, isInternal, images } = req.body;
      const files = req.files || [];
      
      const workOrder = await WorkOrder.findByPk(id, {
        include: [
          { 
            model: MaintenanceRequest,
            include: [{ model: Tenant }]
          }
        ]
      });
      
      if (!workOrder) {
        return res.status(404).json({ success: false, message: 'Work order not found' });
      }
      
      // Create update entry
      const updates = workOrder.updates || [];
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
      
      // Update work order
      await workOrder.update({
        updates,
        lastUpdatedAt: new Date(),
        lastUpdatedById: req.user.id
      });
      
      // Send update to vendor if not internal
      if (!isInternal && workOrder.vendorId) {
        const vendor = await Vendor.findByPk(workOrder.vendorId);
        if (vendor) {
          await sendEmail({
            to: vendor.email,
            subject: `Update on Work Order #${workOrder.workOrderNumber}`,
            template: 'work-order-update-vendor',
            data: {
              vendorName: vendor.name,
              workOrderNumber: workOrder.workOrderNumber,
              update: update,
              updatedBy: `${req.user.firstName} ${req.user.lastName}`
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
  
  // Complete work order
  completeWorkOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        completionNotes, 
        actualCost, 
        materialsUsed,
        beforeImages, 
        afterImages,
        vendorRating,
        invoiceNumber
      } = req.body;
      const files = req.files || [];
      
      const workOrder = await WorkOrder.findByPk(id, {
        include: [
          { model: Vendor },
          { 
            model: MaintenanceRequest,
            include: [{ model: Tenant }, { model: Property }]
          }
        ]
      });
      
      if (!workOrder) {
        return res.status(404).json({ success: false, message: 'Work order not found' });
      }
      
      if (workOrder.status === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Work order is already completed'
        });
      }
      
      if (workOrder.status === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Cannot complete a cancelled work order'
        });
      }
      
      // Handle file uploads
      const uploadedImages = files.map(file => ({
        name: file.originalname,
        url: file.path,
        type: file.fieldname || 'completion',
        uploadedAt: new Date()
      }));
      
      // Update vendor rating
      if (vendorRating && workOrder.vendorId) {
        const vendor = await Vendor.findByPk(workOrder.vendorId);
        if (vendor) {
          const currentRating = vendor.rating || 0;
          const ratingCount = vendor.ratingCount || 0;
          const newRating = ((currentRating * ratingCount) + vendorRating) / (ratingCount + 1);
          
          await vendor.update({
            rating: parseFloat(newRating.toFixed(2)),
            ratingCount: ratingCount + 1,
            lastWorkCompleted: new Date()
          });
        }
      }
      
      // Update work order
      await workOrder.update({
        status: 'completed',
        completedAt: new Date(),
        completedById: req.user.id,
        completionNotes: completionNotes || '',
        actualCost: parseFloat(actualCost) || workOrder.estimatedCost || 0,
        materialsUsed: materialsUsed || [],
        beforeImages: beforeImages || [],
        afterImages: [...(afterImages || []), ...uploadedImages.filter(img => img.type === 'after')],
        vendorRating: vendorRating || null,
        invoiceNumber: invoiceNumber || '',
        completionImages: uploadedImages
      });
      
      // Update maintenance request
      if (workOrder.maintenanceRequestId) {
        const maintenanceRequest = await MaintenanceRequest.findByPk(workOrder.maintenanceRequestId);
        if (maintenanceRequest) {
          await maintenanceRequest.update({
            status: 'completed',
            completedAt: new Date(),
            completedById: req.user.id,
            cost: parseFloat(actualCost) || workOrder.estimatedCost || 0,
            afterImages: [...(maintenanceRequest.afterImages || []), ...uploadedImages]
          });
          
          // Notify tenant
          if (maintenanceRequest.tenantId) {
            const tenant = await Tenant.findByPk(maintenanceRequest.tenantId);
            if (tenant) {
              const tenantUser = await User.findByPk(tenant.userId);
              if (tenantUser) {
                await sendEmail({
                  to: tenantUser.email,
                  subject: `Work Completed: ${workOrder.workOrderNumber}`,
                  template: 'work-order-completed-tenant',
                  data: {
                    firstName: tenant.firstName,
                    workOrderNumber: workOrder.workOrderNumber,
                    description: workOrder.description,
                    completedBy: workOrder.Vendor?.name || 'Vendor',
                    completionNotes: completionNotes
                  }
                });
              }
            }
          }
        }
      }
      
      // Send completion notification to vendor
      if (workOrder.vendorId) {
        const vendor = await Vendor.findByPk(workOrder.vendorId);
        if (vendor) {
          await sendEmail({
            to: vendor.email,
            subject: `Work Order #${workOrder.workOrderNumber} Completed`,
            template: 'work-order-completed-vendor',
            data: {
              vendorName: vendor.name,
              workOrderNumber: workOrder.workOrderNumber,
              completedAt: new Date().toLocaleDateString(),
              actualCost: parseFloat(actualCost) || workOrder.estimatedCost || 0,
              invoiceNumber: invoiceNumber || 'Not provided',
              paymentInstructions: 'Please submit your invoice for payment processing.'
            }
          });
        }
      }
      
      // Create notification
      await createNotification({
        userId: req.user.id,
        type: 'work_order_completed',
        title: 'Work Order Completed',
        message: `Work order ${workOrder.workOrderNumber} completed by ${workOrder.Vendor?.name || 'vendor'}`,
        data: { 
          workOrderId: workOrder.id, 
          vendorId: workOrder.vendorId,
          cost: parseFloat(actualCost) || workOrder.estimatedCost || 0
        },
        recipients: ['property_managers', 'financial_controllers']
      });
      
      res.json({
        success: true,
        message: 'Work order completed successfully',
        data: workOrder
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Cancel work order
  cancelWorkOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const { cancellationReason, notes } = req.body;
      
      const workOrder = await WorkOrder.findByPk(id, {
        include: [
          { model: Vendor },
          { model: MaintenanceRequest }
        ]
      });
      
      if (!workOrder) {
        return res.status(404).json({ success: false, message: 'Work order not found' });
      }
      
      if (['completed', 'cancelled'].includes(workOrder.status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot cancel a ${workOrder.status} work order`
        });
      }
      
      // Update work order
      await workOrder.update({
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledById: req.user.id,
        cancellationReason: cancellationReason || 'No reason provided',
        cancellationNotes: notes || ''
      });
      
      // Update maintenance request
      if (workOrder.maintenanceRequestId) {
        const maintenanceRequest = await MaintenanceRequest.findByPk(workOrder.maintenanceRequestId);
        if (maintenanceRequest) {
          await maintenanceRequest.update({
            status: 'cancelled',
            cancelledAt: new Date(),
            cancelledById: req.user.id,
            cancellationReason: cancellationReason
          });
        }
      }
      
      // Notify vendor
      if (workOrder.vendorId) {
        const vendor = await Vendor.findByPk(workOrder.vendorId);
        if (vendor) {
          await sendEmail({
            to: vendor.email,
            subject: `Work Order #${workOrder.workOrderNumber} Cancelled`,
            template: 'work-order-cancelled-vendor',
            data: {
              vendorName: vendor.name,
              workOrderNumber: workOrder.workOrderNumber,
              cancellationReason: cancellationReason,
              notes: notes
            }
          });
        }
      }
      
      res.json({
        success: true,
        message: 'Work order cancelled successfully',
        data: workOrder
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get work order statistics
  getWorkOrderStatistics: async (req, res) => {
    try {
      const { companyId, vendorId, timeframe = '30d' } = req.query;
      
      const where = {};
      if (companyId) where.companyId = companyId;
      if (vendorId) where.vendorId = vendorId;
      
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
      
      const totalWorkOrders = await WorkOrder.count({ where });
      
      const byStatus = await WorkOrder.findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where,
        group: ['status']
      });
      
      // Calculate total cost
      const costResult = await WorkOrder.findOne({
        where: {
          ...where,
          status: 'completed',
          actualCost: { [Op.gt]: 0 }
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('estimatedCost')), 'totalEstimated'],
          [sequelize.fn('SUM', sequelize.col('actualCost')), 'totalActual']
        ]
      });
      
      const totalEstimated = parseFloat(costResult?.dataValues.totalEstimated || 0);
      const totalActual = parseFloat(costResult?.dataValues.totalActual || 0);
      const costVariance = totalEstimated > 0 ? ((totalActual - totalEstimated) / totalEstimated) * 100 : 0;
      
      // Get top vendors
      const byVendor = await WorkOrder.findAll({
        attributes: [
          'vendorId',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('actualCost')), 'totalCost'],
          [sequelize.fn('AVG', sequelize.col('vendorRating')), 'avgRating']
        ],
        where: {
          ...where,
          status: 'completed'
        },
        group: ['vendorId'],
        include: [{
          model: Vendor,
          attributes: ['name']
        }],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 5
      });
      
      // Calculate average completion time
      const completedWorkOrders = await WorkOrder.findAll({
        where: {
          ...where,
          status: 'completed',
          completedAt: { [Op.not]: null },
          createdAt: { [Op.not]: null }
        },
        attributes: ['id', 'createdAt', 'completedAt']
      });
      
      let totalCompletionTime = 0;
      completedWorkOrders.forEach(wo => {
        if (wo.completedAt && wo.createdAt) {
          const completionTime = new Date(wo.completedAt) - new Date(wo.createdAt);
          totalCompletionTime += completionTime;
        }
      });
      
      const avgCompletionTime = completedWorkOrders.length > 0 
        ? totalCompletionTime / completedWorkOrders.length 
        : 0;
      
      res.json({
        success: true,
        data: {
          totalWorkOrders,
          byStatus: byStatus.reduce((acc, item) => {
            acc[item.status] = parseInt(item.dataValues.count);
            return acc;
          }, {}),
          costSummary: {
            totalEstimated,
            totalActual,
            costVariance: parseFloat(costVariance.toFixed(2))
          },
          byVendor: byVendor.map(item => ({
            vendorId: item.vendorId,
            vendorName: item.Vendor?.name || 'Unknown',
            workOrderCount: parseInt(item.dataValues.count),
            totalCost: parseFloat(item.dataValues.totalCost || 0),
            averageRating: parseFloat(item.dataValues.avgRating || 0)
          })),
          avgCompletionTime: parseFloat((avgCompletionTime / (1000 * 60 * 60 * 24)).toFixed(1)) // Convert to days
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get vendor performance report
  getVendorPerformanceReport: async (req, res) => {
    try {
      const { vendorId, startDate, endDate } = req.query;
      
      const where = {
        vendorId,
        status: 'completed'
      };
      
      if (startDate) where.completedAt = { [Op.gte]: new Date(startDate) };
      if (endDate) where.completedAt = { ...where.completedAt, [Op.lte]: new Date(endDate) };
      
      const workOrders = await WorkOrder.findAll({
        where,
        include: [
          {
            model: MaintenanceRequest,
            include: [{ model: Property }]
          }
        ],
        order: [['completedAt', 'DESC']]
      });
      
      if (workOrders.length === 0) {
        return res.json({
          success: true,
          message: 'No completed work orders found for this vendor',
          data: []
        });
      }
      
      // Calculate statistics
      const totalCost = workOrders.reduce((sum, wo) => sum + (wo.actualCost || 0), 0);
      const avgRating = workOrders.reduce((sum, wo) => sum + (wo.vendorRating || 0), 0) / workOrders.length;
      const avgCompletionTime = workOrders.reduce((sum, wo) => {
        if (wo.completedAt && wo.createdAt) {
          return sum + (new Date(wo.completedAt) - new Date(wo.createdAt));
        }
        return sum;
      }, 0) / workOrders.length;
      
      const report = {
        vendorId,
        totalWorkOrders: workOrders.length,
        totalCost,
        averageRating: parseFloat(avgRating.toFixed(2)),
        averageCompletionTime: parseFloat((avgCompletionTime / (1000 * 60 * 60 * 24)).toFixed(1)), // Days
        workOrders: workOrders.map(wo => ({
          workOrderNumber: wo.workOrderNumber,
          completedAt: wo.completedAt,
          actualCost: wo.actualCost,
          vendorRating: wo.vendorRating,
          property: wo.MaintenanceRequest?.Property?.name,
          description: wo.description
        })),
        byProperty: {}
      };
      
      // Group by property
      workOrders.forEach(wo => {
        const propertyName = wo.MaintenanceRequest?.Property?.name || 'Unknown';
        if (!report.byProperty[propertyName]) {
          report.byProperty[propertyName] = {
            count: 0,
            totalCost: 0
          };
        }
        report.byProperty[propertyName].count++;
        report.byProperty[propertyName].totalCost += wo.actualCost || 0;
      });
      
      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = workOrderController;