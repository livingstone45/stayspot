const { Vendor, WorkOrder, User, Document } = require('../../models');
const { Op } = require('sequelize');
const { sendEmail } = require('../../services/communication/email.service');
const { createNotification } = require('../../services/communication/notification.service');

const vendorController = {
  // Get all vendors
  getAllVendors: async (req, res) => {
    try {
      const { 
        specialty, 
        status,
        ratingMin,
        ratingMax,
        search,
        page = 1, 
        limit = 20 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = { companyId: req.user.companyId };
      if (specialty) where.specialty = specialty;
      if (status) where.status = status;
      
      if (ratingMin || ratingMax) {
        where.rating = {};
        if (ratingMin) where.rating[Op.gte] = parseFloat(ratingMin);
        if (ratingMax) where.rating[Op.lte] = parseFloat(ratingMax);
      }
      
      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
          { contactPerson: { [Op.like]: `%${search}%` } },
          { specialty: { [Op.like]: `%${search}%` } }
        ];
      }
      
      const vendors = await Vendor.findAndCountAll({
        where,
        include: [
          {
            model: WorkOrder,
            attributes: ['id', 'status'],
            required: false,
            where: { status: 'completed' },
            limit: 5
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['name', 'ASC']]
      });
      
      // Calculate vendor statistics
      const vendorsWithStats = await Promise.all(
        vendors.rows.map(async (vendor) => {
          const stats = await getVendorStatistics(vendor.id);
          return {
            ...vendor.toJSON(),
            statistics: stats
          };
        })
      );
      
      res.json({
        success: true,
        data: vendorsWithStats,
        pagination: {
          total: vendors.count,
          page: parseInt(page),
          pages: Math.ceil(vendors.count / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get vendor by ID
  getVendorById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const vendor = await Vendor.findByPk(id, {
        include: [
          {
            model: WorkOrder,
            include: [
              {
                model: User,
                as: 'CompletedBy',
                attributes: ['id', 'firstName', 'lastName']
              }
            ],
            order: [['completedAt', 'DESC']],
            limit: 20
          },
          {
            model: Document,
            where: { entityType: 'Vendor', entityId: id },
            required: false
          },
          {
            model: User,
            as: 'CreatedBy',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });
      
      if (!vendor) {
        return res.status(404).json({ success: false, message: 'Vendor not found' });
      }
      
      // Check if vendor belongs to user's company
      if (vendor.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this vendor'
        });
      }
      
      // Get vendor statistics
      const statistics = await getVendorStatistics(id);
      
      res.json({
        success: true,
        data: {
          ...vendor.toJSON(),
          statistics
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Create new vendor
  createVendor: async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        contactPerson,
        specialty,
        services,
        address,
        taxId,
        insuranceExpiry,
        licenseNumber,
        paymentTerms,
        hourlyRate,
        notes,
        documents
      } = req.body;
      
      const files = req.files || [];
      
      // Check if vendor already exists with same email or name
      const existingVendor = await Vendor.findOne({
        where: {
          [Op.or]: [
            { email: email },
            { name: name }
          ],
          companyId: req.user.companyId
        }
      });
      
      if (existingVendor) {
        return res.status(400).json({
          success: false,
          message: 'Vendor with this email or name already exists'
        });
      }
      
      // Create vendor
      const vendor = await Vendor.create({
        name,
        email,
        phone,
        contactPerson,
        specialty: specialty || 'general',
        services: services || [],
        address: address || {},
        taxId,
        insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : null,
        licenseNumber,
        paymentTerms: paymentTerms || 'Net 30',
        hourlyRate: parseFloat(hourlyRate) || 0,
        notes: notes || '',
        status: 'active', // active, inactive, pending_verification, blacklisted
        rating: 0,
        ratingCount: 0,
        createdById: req.user.id,
        companyId: req.user.companyId
      });
      
      // Handle document uploads
      const uploadedDocuments = [];
      
      for (const file of files) {
        const document = await Document.create({
          type: 'vendor_document',
          name: file.originalname,
          url: file.path,
          mimeType: file.mimetype,
          size: file.size,
          entityType: 'Vendor',
          entityId: vendor.id,
          uploadedById: req.user.id,
          category: file.fieldname || 'other'
        });
        
        uploadedDocuments.push(document);
      }
      
      // Handle document metadata
      if (documents && Array.isArray(documents)) {
        for (const docData of documents) {
          const document = await Document.create({
            type: docData.type || 'vendor_document',
            name: docData.name,
            url: docData.url,
            mimeType: docData.mimeType,
            size: docData.size,
            entityType: 'Vendor',
            entityId: vendor.id,
            uploadedById: req.user.id,
            category: docData.category,
            metadata: docData.metadata
          });
          
          uploadedDocuments.push(document);
        }
      }
      
      // Send welcome email to vendor
      await sendEmail({
        to: email,
        subject: 'Welcome to StaySpot Vendor Network',
        template: 'vendor-welcome',
        data: {
          vendorName: name,
          contactPerson: contactPerson,
          companyName: req.user.company?.name || 'StaySpot',
          portalUrl: `${process.env.FRONTEND_URL}/vendor`,
          loginInstructions: 'You will receive separate login credentials shortly.'
        }
      });
      
      // Create notification
      await createNotification({
        userId: req.user.id,
        type: 'vendor_created',
        title: 'New Vendor Added',
        message: `Vendor ${name} has been added to the system`,
        data: { vendorId: vendor.id },
        recipients: ['property_managers', 'maintenance_supervisors']
      });
      
      res.status(201).json({
        success: true,
        message: 'Vendor created successfully',
        data: {
          vendor,
          documents: uploadedDocuments
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update vendor
  updateVendor: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const vendor = await Vendor.findByPk(id);
      
      if (!vendor) {
        return res.status(404).json({ success: false, message: 'Vendor not found' });
      }
      
      // Check if vendor belongs to user's company
      if (vendor.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this vendor'
        });
      }
      
      // Handle insurance expiry check
      if (updates.insuranceExpiry) {
        const insuranceDate = new Date(updates.insuranceExpiry);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((insuranceDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry < 30) {
          updates.insuranceStatus = daysUntilExpiry <= 0 ? 'expired' : 'expiring_soon';
          
          // Send insurance expiry notification
          if (daysUntilExpiry <= 30) {
            await createNotification({
              userId: req.user.id,
              type: 'vendor_insurance_expiring',
              title: 'Vendor Insurance Expiring Soon',
              message: `Insurance for ${vendor.name} expires in ${daysUntilExpiry} days`,
              data: { vendorId: vendor.id, expiryDate: insuranceDate },
              recipients: ['property_managers', 'compliance_officers']
            });
          }
        } else {
          updates.insuranceStatus = 'valid';
        }
      }
      
      // Update vendor
      await vendor.update(updates);
      
      res.json({
        success: true,
        message: 'Vendor updated successfully',
        data: vendor
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update vendor status
  updateVendorStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      
      const validStatuses = ['active', 'inactive', 'pending_verification', 'blacklisted'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
      
      const vendor = await Vendor.findByPk(id);
      
      if (!vendor) {
        return res.status(404).json({ success: false, message: 'Vendor not found' });
      }
      
      // Check if vendor belongs to user's company
      if (vendor.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this vendor'
        });
      }
      
      const oldStatus = vendor.status;
      
      // Update vendor status
      await vendor.update({
        status,
        statusChangedAt: new Date(),
        statusChangedBy: req.user.id,
        statusChangeReason: reason
      });
      
      // Send status change notification to vendor
      if (status === 'blacklisted') {
        await sendEmail({
          to: vendor.email,
          subject: 'Important Notice: Vendor Status Update',
          template: 'vendor-blacklisted',
          data: {
            vendorName: vendor.name,
            reason: reason || 'No reason provided',
            effectiveDate: new Date().toLocaleDateString()
          }
        });
      } else if (status === 'active' && oldStatus === 'pending_verification') {
        await sendEmail({
          to: vendor.email,
          subject: 'Your Vendor Account Has Been Activated',
          template: 'vendor-activated',
          data: {
            vendorName: vendor.name,
            activationDate: new Date().toLocaleDateString()
          }
        });
      }
      
      // Create notification
      await createNotification({
        userId: req.user.id,
        type: 'vendor_status_changed',
        title: 'Vendor Status Changed',
        message: `Vendor ${vendor.name} status changed from ${oldStatus} to ${status}`,
        data: { vendorId: vendor.id, oldStatus, newStatus: status },
        recipients: ['property_managers', 'maintenance_supervisors']
      });
      
      res.json({
        success: true,
        message: `Vendor status updated to ${status}`,
        data: vendor
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Delete vendor
  deleteVendor: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      const vendor = await Vendor.findByPk(id);
      
      if (!vendor) {
        return res.status(404).json({ success: false, message: 'Vendor not found' });
      }
      
      // Check if vendor belongs to user's company
      if (vendor.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this vendor'
        });
      }
      
      // Check if vendor has active work orders
      const activeWorkOrders = await WorkOrder.count({
        where: {
          vendorId: id,
          status: { [Op.in]: ['created', 'assigned', 'in_progress'] }
        }
      });
      
      if (activeWorkOrders > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete vendor with ${activeWorkOrders} active work orders. Complete or cancel them first.`
        });
      }
      
      // Soft delete (update status to inactive)
      await vendor.update({
        status: 'inactive',
        deletedAt: new Date(),
        deletedBy: req.user.id,
        deletionReason: reason
      });
      
      res.json({
        success: true,
        message: 'Vendor deactivated successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Search vendors by specialty and location
  searchVendors: async (req, res) => {
    try {
      const { specialty, services, location, ratingMin, availableNow } = req.query;
      
      const where = {
        companyId: req.user.companyId,
        status: 'active'
      };
      
      if (specialty) where.specialty = specialty;
      if (services) {
        where.services = { [Op.overlap]: services.split(',') };
      }
      if (ratingMin) where.rating = { [Op.gte]: parseFloat(ratingMin) };
      
      // Location-based filtering would require geospatial query
      // For now, we'll just filter by city if provided
      if (location) {
        where['address.city'] = { [Op.like]: `%${location}%` };
      }
      
      // Available now filter (vendors without active work orders)
      if (availableNow === 'true') {
        const vendorsWithActiveWork = await WorkOrder.findAll({
          where: {
            status: { [Op.in]: ['assigned', 'in_progress'] }
          },
          attributes: ['vendorId'],
          group: ['vendorId']
        });
        
        const busyVendorIds = vendorsWithActiveWork.map(wo => wo.vendorId);
        if (busyVendorIds.length > 0) {
          where.id = { [Op.notIn]: busyVendorIds };
        }
      }
      
      const vendors = await Vendor.findAll({
        where,
        include: [{
          model: WorkOrder,
          attributes: ['id'],
          required: false,
          where: { status: 'completed' },
          limit: 1
        }],
        order: [
          ['rating', 'DESC'],
          ['name', 'ASC']
        ],
        limit: 50
      });
      
      res.json({
        success: true,
        data: vendors
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get vendor specialties
  getVendorSpecialties: async (req, res) => {
    try {
      const specialties = await Vendor.findAll({
        where: {
          companyId: req.user.companyId,
          status: 'active'
        },
        attributes: [
          'specialty',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['specialty'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
      });
      
      res.json({
        success: true,
        data: specialties.map(s => ({
          specialty: s.specialty,
          count: parseInt(s.dataValues.count)
        }))
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Upload vendor documents
  uploadVendorDocuments: async (req, res) => {
    try {
      const { id } = req.params;
      const { documents } = req.body;
      const files = req.files || [];
      
      const vendor = await Vendor.findByPk(id);
      
      if (!vendor) {
        return res.status(404).json({ success: false, message: 'Vendor not found' });
      }
      
      // Check if vendor belongs to user's company
      if (vendor.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to upload documents for this vendor'
        });
      }
      
      const uploadedDocuments = [];
      
      // Handle file uploads
      for (const file of files) {
        const document = await Document.create({
          type: 'vendor_document',
          name: file.originalname,
          url: file.path,
          mimeType: file.mimetype,
          size: file.size,
          entityType: 'Vendor',
          entityId: vendor.id,
          uploadedById: req.user.id,
          category: file.fieldname || 'other'
        });
        
        uploadedDocuments.push(document);
      }
      
      // Handle document metadata
      if (documents && Array.isArray(documents)) {
        for (const docData of documents) {
          const document = await Document.create({
            type: docData.type || 'vendor_document',
            name: docData.name,
            url: docData.url,
            mimeType: docData.mimeType,
            size: docData.size,
            entityType: 'Vendor',
            entityId: vendor.id,
            uploadedById: req.user.id,
            category: docData.category,
            metadata: docData.metadata
          });
          
          uploadedDocuments.push(document);
        }
      }
      
      // Update vendor document status
      const requiredDocs = ['insurance', 'license', 'w9'];
      const uploadedDocTypes = uploadedDocuments.map(d => d.category);
      const missingDocs = requiredDocs.filter(doc => !uploadedDocTypes.includes(doc));
      
      if (missingDocs.length === 0 && vendor.status === 'pending_verification') {
        await vendor.update({
          status: 'active',
          verificationCompletedAt: new Date(),
          verificationCompletedBy: req.user.id
        });
      }
      
      res.json({
        success: true,
        message: 'Documents uploaded successfully',
        data: {
          uploadedDocuments,
          missingDocuments: missingDocs,
          vendorStatus: vendor.status
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get vendor performance metrics
  getVendorPerformanceMetrics: async (req, res) => {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;
      
      const vendor = await Vendor.findByPk(id);
      
      if (!vendor) {
        return res.status(404).json({ success: false, message: 'Vendor not found' });
      }
      
      // Check if vendor belongs to user's company
      if (vendor.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view metrics for this vendor'
        });
      }
      
      const where = {
        vendorId: id,
        status: 'completed'
      };
      
      if (startDate) where.completedAt = { [Op.gte]: new Date(startDate) };
      if (endDate) where.completedAt = { ...where.completedAt, [Op.lte]: new Date(endDate) };
      
      const workOrders = await WorkOrder.findAll({
        where,
        order: [['completedAt', 'ASC']]
      });
      
      if (workOrders.length === 0) {
        return res.json({
          success: true,
          message: 'No completed work orders found for this vendor',
          data: {
            vendorId: id,
            vendorName: vendor.name,
            metrics: {}
          }
        });
      }
      
      // Calculate metrics
      const totalWorkOrders = workOrders.length;
      const totalCost = workOrders.reduce((sum, wo) => sum + (wo.actualCost || 0), 0);
      const avgCost = totalCost / totalWorkOrders;
      const avgRating = workOrders.reduce((sum, wo) => sum + (wo.vendorRating || 0), 0) / totalWorkOrders;
      
      // Calculate completion time metrics
      const completionTimes = workOrders
        .filter(wo => wo.completedAt && wo.createdAt)
        .map(wo => new Date(wo.completedAt) - new Date(wo.createdAt));
      
      const avgCompletionTime = completionTimes.length > 0 
        ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length 
        : 0;
      
      // Calculate on-time completion rate (within estimated time)
      const onTimeCompletions = workOrders.filter(wo => {
        if (!wo.estimatedCompletion || !wo.completedAt) return false;
        return new Date(wo.completedAt) <= new Date(wo.estimatedCompletion);
      }).length;
      
      const onTimeRate = (onTimeCompletions / totalWorkOrders) * 100;
      
      // Calculate cost variance
      const workOrdersWithEstimates = workOrders.filter(wo => wo.estimatedCost && wo.actualCost);
      const avgCostVariance = workOrdersWithEstimates.length > 0
        ? workOrdersWithEstimates.reduce((sum, wo) => {
            const variance = ((wo.actualCost - wo.estimatedCost) / wo.estimatedCost) * 100;
            return sum + variance;
          }, 0) / workOrdersWithEstimates.length
        : 0;
      
      // Monthly trend
      const monthlyTrend = {};
      workOrders.forEach(wo => {
        if (wo.completedAt) {
          const month = wo.completedAt.toISOString().substring(0, 7); // YYYY-MM
          if (!monthlyTrend[month]) {
            monthlyTrend[month] = {
              count: 0,
              totalCost: 0,
              avgRating: 0,
              ratings: []
            };
          }
          monthlyTrend[month].count++;
          monthlyTrend[month].totalCost += wo.actualCost || 0;
          if (wo.vendorRating) {
            monthlyTrend[month].ratings.push(wo.vendorRating);
          }
        }
      });
      
      // Calculate monthly averages
      Object.keys(monthlyTrend).forEach(month => {
        const monthData = monthlyTrend[month];
        monthData.avgRating = monthData.ratings.length > 0
          ? monthData.ratings.reduce((sum, rating) => sum + rating, 0) / monthData.ratings.length
          : 0;
        delete monthData.ratings;
      });
      
      const metrics = {
        totalWorkOrders,
        totalCost,
        averageCost: parseFloat(avgCost.toFixed(2)),
        averageRating: parseFloat(avgRating.toFixed(2)),
        averageCompletionTime: parseFloat((avgCompletionTime / (1000 * 60 * 60 * 24)).toFixed(1)), // Days
        onTimeCompletionRate: parseFloat(onTimeRate.toFixed(2)),
        averageCostVariance: parseFloat(avgCostVariance.toFixed(2)),
        monthlyTrend: Object.entries(monthlyTrend).map(([month, data]) => ({
          month,
          ...data
        })).sort((a, b) => a.month.localeCompare(b.month))
      };
      
      res.json({
        success: true,
        data: {
          vendorId: id,
          vendorName: vendor.name,
          metrics
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Bulk import vendors
  bulkImportVendors: async (req, res) => {
    try {
      const { vendors: vendorsData } = req.body;
      const file = req.file;
      
      let vendorsToImport = [];
      
      if (file) {
        // Parse CSV/Excel file
        // This would use a library like csv-parser or xlsx
        // For now, we'll assume the file is processed elsewhere
        return res.status(400).json({
          success: false,
          message: 'File import requires additional setup'
        });
      } else if (vendorsData && Array.isArray(vendorsData)) {
        vendorsToImport = vendorsData;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Vendors data is required and must be an array'
        });
      }
      
      const results = {
        success: [],
        failed: []
      };
      
      for (const vendorData of vendorsToImport) {
        try {
          // Check if vendor already exists
          const existingVendor = await Vendor.findOne({
            where: {
              [Op.or]: [
                { email: vendorData.email },
                { name: vendorData.name }
              ],
              companyId: req.user.companyId
            }
          });
          
          if (existingVendor) {
            results.failed.push({
              name: vendorData.name,
              email: vendorData.email,
              error: 'Vendor already exists'
            });
            continue;
          }
          
          // Create vendor
          const vendor = await Vendor.create({
            name: vendorData.name,
            email: vendorData.email,
            phone: vendorData.phone,
            contactPerson: vendorData.contactPerson,
            specialty: vendorData.specialty || 'general',
            services: vendorData.services || [],
            address: vendorData.address || {},
            taxId: vendorData.taxId,
            insuranceExpiry: vendorData.insuranceExpiry ? new Date(vendorData.insuranceExpiry) : null,
            licenseNumber: vendorData.licenseNumber,
            paymentTerms: vendorData.paymentTerms || 'Net 30',
            hourlyRate: parseFloat(vendorData.hourlyRate) || 0,
            notes: vendorData.notes || '',
            status: 'pending_verification',
            rating: 0,
            ratingCount: 0,
            createdById: req.user.id,
            companyId: req.user.companyId
          });
          
          results.success.push({
            name: vendorData.name,
            email: vendorData.email,
            vendorId: vendor.id
          });
          
        } catch (error) {
          results.failed.push({
            name: vendorData.name,
            email: vendorData.email,
            error: error.message
          });
        }
      }
      
      // Send invitation emails to successful imports
      for (const success of results.success) {
        try {
          await sendEmail({
            to: success.email,
            subject: 'Welcome to StaySpot Vendor Network',
            template: 'vendor-invitation',
            data: {
              vendorName: success.name,
              companyName: req.user.company?.name || 'StaySpot'
            }
          });
        } catch (emailError) {
          console.error(`Failed to send email to ${success.email}:`, emailError.message);
        }
      }
      
      res.json({
        success: true,
        message: `Imported ${results.success.length} vendors successfully, ${results.failed.length} failed`,
        data: results
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Helper function to get vendor statistics
async function getVendorStatistics(vendorId) {
  const totalWorkOrders = await WorkOrder.count({
    where: { vendorId }
  });
  
  const completedWorkOrders = await WorkOrder.count({
    where: {
      vendorId,
      status: 'completed'
    }
  });
  
  const activeWorkOrders = await WorkOrder.count({
    where: {
      vendorId,
      status: { [Op.in]: ['assigned', 'in_progress'] }
    }
  });
  
  const costResult = await WorkOrder.findOne({
    where: {
      vendorId,
      status: 'completed'
    },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('actualCost')), 'totalCost']
    ]
  });
  
  const totalCost = parseFloat(costResult?.dataValues.totalCost || 0);
  
  const ratingResult = await WorkOrder.findOne({
    where: {
      vendorId,
      status: 'completed',
      vendorRating: { [Op.not]: null }
    },
    attributes: [
      [sequelize.fn('AVG', sequelize.col('vendorRating')), 'avgRating'],
      [sequelize.fn('COUNT', sequelize.col('vendorRating')), 'ratingCount']
    ]
  });
  
  return {
    totalWorkOrders,
    completedWorkOrders,
    activeWorkOrders,
    completionRate: totalWorkOrders > 0 ? (completedWorkOrders / totalWorkOrders) * 100 : 0,
    totalCost,
    averageRating: parseFloat(ratingResult?.dataValues.avgRating || 0),
    ratingCount: parseInt(ratingResult?.dataValues.ratingCount || 0)
  };
}

module.exports = vendorController;