const { Application, Tenant, Property, Unit, User, Document } = require('../../models');
const { Op } = require('sequelize');
const { sendEmail } = require('../../services/communication/email.service');
const { createNotification } = require('../../services/communication/notification.service');
const { runBackgroundCheck } = require('../../services/integration/background-check.service');

const applicationController = {
  // Get all applications
  getAllApplications: async (req, res) => {
    try {
      const { 
        propertyId, 
        unitId, 
        status, 
        search,
        fromDate,
        toDate,
        page = 1, 
        limit = 20 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = {};
      if (propertyId) where.propertyId = propertyId;
      if (unitId) where.unitId = unitId;
      if (status) where.status = status;
      
      if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) where.createdAt[Op.gte] = new Date(fromDate);
        if (toDate) where.createdAt[Op.lte] = new Date(toDate);
      }
      
      if (search) {
        where[Op.or] = [
          { applicationNumber: { [Op.like]: `%${search}%` } },
          { '$Applicant.firstName$': { [Op.like]: `%${search}%` } },
          { '$Applicant.lastName$': { [Op.like]: `%${search}%` } },
          { '$Applicant.email$': { [Op.like]: `%${search}%` } }
        ];
      }
      
      const applications = await Application.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'Applicant',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          },
          {
            model: Property,
            attributes: ['id', 'name', 'address']
          },
          {
            model: Unit,
            attributes: ['id', 'unitNumber', 'type', 'rentAmount']
          },
          {
            model: User,
            as: 'ReviewedBy',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });
      
      res.json({
        success: true,
        data: applications.rows,
        pagination: {
          total: applications.count,
          page: parseInt(page),
          pages: Math.ceil(applications.count / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get application by ID
  getApplicationById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const application = await Application.findByPk(id, {
        include: [
          {
            model: User,
            as: 'Applicant',
            attributes: { exclude: ['password'] }
          },
          {
            model: Property,
            include: ['address', 'amenities']
          },
          {
            model: Unit,
            attributes: ['id', 'unitNumber', 'type', 'size', 'bedrooms', 'bathrooms', 'rentAmount']
          },
          {
            model: Document,
            where: { entityType: 'Application', entityId: id },
            required: false
          },
          {
            model: User,
            as: 'ReviewedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: User,
            as: 'ApprovedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });
      
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
      
      res.json({ success: true, data: application });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Submit new application
  submitApplication: async (req, res) => {
    try {
      const {
        applicantId,
        propertyId,
        unitId,
        moveInDate,
        leaseTerm,
        occupants,
        pets,
        vehicles,
        employment,
        income,
        references,
        emergencyContact,
        additionalInfo
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
      
      if (unit.status !== 'available') {
        return res.status(400).json({
          success: false,
          message: `Unit is ${unit.status}. Cannot submit application for unavailable unit.`
        });
      }
      
      // Get or create applicant user
      let applicant;
      if (applicantId) {
        applicant = await User.findByPk(applicantId);
        if (!applicant) {
          return res.status(404).json({ success: false, message: 'Applicant not found' });
        }
      } else {
        // This would typically come from the registration flow
        return res.status(400).json({
          success: false,
          message: 'Applicant ID is required'
        });
      }
      
      // Generate application number
      const appCount = await Application.count();
      const applicationNumber = `APP-${new Date().getFullYear()}-${String(appCount + 1).padStart(6, '0')}`;
      
      // Create application
      const application = await Application.create({
        applicationNumber,
        applicantId: applicant.id,
        propertyId,
        unitId,
        moveInDate: new Date(moveInDate),
        leaseTerm: leaseTerm || '12 months',
        occupants: occupants || [],
        pets: pets || [],
        vehicles: vehicles || [],
        employment: employment || {},
        income: parseFloat(income) || 0,
        references: references || [],
        emergencyContact: emergencyContact || {},
        additionalInfo: additionalInfo || '',
        status: 'submitted', // submitted, under_review, approved, rejected, withdrawn
        submittedAt: new Date(),
        applicationFee: property.applicationFee || 50, // Default application fee
        companyId: property.companyId,
        portfolioId: property.portfolioId
      });
      
      // Update unit status to show interest
      await unit.update({ status: 'application_pending' });
      
      // Send confirmation email
      await sendEmail({
        to: applicant.email,
        subject: 'Application Submitted Successfully',
        template: 'application-submitted',
        data: {
          firstName: applicant.firstName,
          lastName: applicant.lastName,
          applicationNumber,
          propertyName: property.name,
          unitNumber: unit.unitNumber,
          applicationFee: application.applicationFee
        }
      });
      
      // Notify property managers
      await createNotification({
        userId: applicant.id,
        type: 'new_application',
        title: 'New Rental Application',
        message: `New application ${applicationNumber} submitted for ${property.name}`,
        data: { applicationId: application.id, propertyId, unitId },
        recipients: ['property_managers']
      });
      
      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        data: application
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update application status
  updateApplicationStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes, nextSteps } = req.body;
      
      const application = await Application.findByPk(id, {
        include: [
          { model: User, as: 'Applicant' },
          { model: Property },
          { model: Unit }
        ]
      });
      
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
      
      const validStatuses = ['submitted', 'under_review', 'approved', 'rejected', 'withdrawn'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
      
      // Update application
      const updateData = {
        status,
        statusNotes: notes,
        nextSteps: nextSteps || ''
      };
      
      if (status === 'under_review') {
        updateData.reviewedById = req.user.id;
        updateData.reviewedAt = new Date();
      } else if (status === 'approved') {
        updateData.approvedById = req.user.id;
        updateData.approvedAt = new Date();
        updateData.nextSteps = 'Please proceed to lease signing';
      } else if (status === 'rejected') {
        updateData.rejectedById = req.user.id;
        updateData.rejectedAt = new Date();
      }
      
      await application.update(updateData);
      
      // Update unit status based on application status
      if (status === 'approved') {
        await application.Unit.update({ status: 'reserved' });
      } else if (status === 'rejected' || status === 'withdrawn') {
        await application.Unit.update({ status: 'available' });
      }
      
      // Send status update email
      let emailSubject, emailTemplate;
      
      switch (status) {
        case 'under_review':
          emailSubject = 'Application Under Review';
          emailTemplate = 'application-under-review';
          break;
        case 'approved':
          emailSubject = 'Application Approved!';
          emailTemplate = 'application-approved';
          break;
        case 'rejected':
          emailSubject = 'Application Update';
          emailTemplate = 'application-rejected';
          break;
        default:
          emailSubject = 'Application Status Update';
          emailTemplate = 'application-status-update';
      }
      
      await sendEmail({
        to: application.Applicant.email,
        subject: emailSubject,
        template: emailTemplate,
        data: {
          firstName: application.Applicant.firstName,
          applicationNumber: application.applicationNumber,
          propertyName: application.Property.name,
          unitNumber: application.Unit.unitNumber,
          status: status,
          notes: notes,
          nextSteps: nextSteps
        }
      });
      
      res.json({
        success: true,
        message: `Application ${status} successfully`,
        data: application
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Run background check on applicant
  runBackgroundCheck: async (req, res) => {
    try {
      const { id } = req.params;
      const { checkType, consent } = req.body;
      
      if (!consent) {
        return res.status(400).json({
          success: false,
          message: 'Applicant consent is required to run background check'
        });
      }
      
      const application = await Application.findByPk(id, {
        include: [{ model: User, as: 'Applicant' }]
      });
      
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
      
      if (application.status !== 'under_review') {
        return res.status(400).json({
          success: false,
          message: 'Background checks can only be run on applications under review'
        });
      }
      
      // Run background check through integration service
      const backgroundCheck = await runBackgroundCheck({
        applicantId: application.applicantId,
        firstName: application.Applicant.firstName,
        lastName: application.Applicant.lastName,
        email: application.Applicant.email,
        checkType: checkType || 'standard',
        applicationId: application.id
      });
      
      // Update application with background check results
      await application.update({
        backgroundCheck: {
          ...application.backgroundCheck,
          [checkType || 'standard']: {
            ...backgroundCheck,
            runAt: new Date(),
            runBy: req.user.id
          }
        }
      });
      
      res.json({
        success: true,
        message: 'Background check initiated successfully',
        data: {
          applicationId: application.id,
          backgroundCheckId: backgroundCheck.id,
          status: backgroundCheck.status,
          estimatedCompletion: backgroundCheck.estimatedCompletion
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Upload application documents
  uploadApplicationDocuments: async (req, res) => {
    try {
      const { id } = req.params;
      const { documents } = req.body;
      const files = req.files || [];
      
      const application = await Application.findByPk(id);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
      
      const uploadedDocuments = [];
      
      // Handle file uploads
      for (const file of files) {
        const document = await Document.create({
          type: 'application_document',
          name: file.originalname,
          url: file.path, // This would be cloud storage URL in production
          mimeType: file.mimetype,
          size: file.size,
          entityType: 'Application',
          entityId: application.id,
          uploadedById: req.user.id,
          category: file.fieldname || 'other'
        });
        
        uploadedDocuments.push(document);
      }
      
      // Handle document metadata
      if (documents && Array.isArray(documents)) {
        for (const docData of documents) {
          const document = await Document.create({
            type: docData.type || 'application_document',
            name: docData.name,
            url: docData.url,
            mimeType: docData.mimeType,
            size: docData.size,
            entityType: 'Application',
            entityId: application.id,
            uploadedById: req.user.id,
            category: docData.category,
            metadata: docData.metadata
          });
          
          uploadedDocuments.push(document);
        }
      }
      
      // Update application document status
      const requiredDocs = ['id_proof', 'income_proof', 'rental_history'];
      const uploadedDocTypes = uploadedDocuments.map(d => d.category);
      const missingDocs = requiredDocs.filter(doc => !uploadedDocTypes.includes(doc));
      
      if (missingDocs.length === 0) {
        await application.update({
          documentsComplete: true,
          documentsCompleteAt: new Date()
        });
      }
      
      res.json({
        success: true,
        message: 'Documents uploaded successfully',
        data: {
          uploadedDocuments,
          missingDocuments: missingDocs,
          documentsComplete: missingDocs.length === 0
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get application statistics
  getApplicationStatistics: async (req, res) => {
    try {
      const { companyId, portfolioId, propertyId, timeframe = '30d' } = req.query;
      
      const where = {};
      if (companyId) where.companyId = companyId;
      if (portfolioId) where.portfolioId = portfolioId;
      if (propertyId) where.propertyId = propertyId;
      
      // Calculate date range based on timeframe
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
      
      const totalApplications = await Application.count({ where });
      
      const byStatus = await Application.findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where,
        group: ['status']
      });
      
      // Calculate conversion rate (approved/total)
      const approvedCount = byStatus.find(s => s.status === 'approved')?.dataValues.count || 0;
      const conversionRate = totalApplications > 0 ? (approvedCount / totalApplications) * 100 : 0;
      
      // Get average processing time
      const processedApplications = await Application.findAll({
        where: {
          ...where,
          status: ['approved', 'rejected'],
          reviewedAt: { [Op.not]: null }
        },
        attributes: ['id', 'createdAt', 'reviewedAt']
      });
      
      let totalProcessingTime = 0;
      processedApplications.forEach(app => {
        if (app.reviewedAt) {
          const processingTime = new Date(app.reviewedAt) - new Date(app.createdAt);
          totalProcessingTime += processingTime;
        }
      });
      
      const avgProcessingTime = processedApplications.length > 0 
        ? totalProcessingTime / processedApplications.length 
        : 0;
      
      // Get applications by property
      const byProperty = await Application.findAll({
        attributes: [
          'propertyId',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.literal('CASE WHEN status = "approved" THEN 1 ELSE 0 END')), 'approved']
        ],
        where,
        group: ['propertyId'],
        include: [{
          model: Property,
          attributes: ['name']
        }],
        limit: 10
      });
      
      res.json({
        success: true,
        data: {
          totalApplications,
          byStatus: byStatus.reduce((acc, item) => {
            acc[item.status] = parseInt(item.dataValues.count);
            return acc;
          }, {}),
          conversionRate: parseFloat(conversionRate.toFixed(2)),
          avgProcessingTime: parseFloat((avgProcessingTime / (1000 * 60 * 60 * 24)).toFixed(1)), // Convert to days
          byProperty: byProperty.map(item => ({
            propertyId: item.propertyId,
            propertyName: item.Property?.name || 'Unknown',
            total: parseInt(item.dataValues.count),
            approved: parseInt(item.dataValues.approved || 0)
          }))
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Withdraw application (for applicants)
  withdrawApplication: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      const application = await Application.findByPk(id, {
        include: [
          { model: User, as: 'Applicant' },
          { model: Property },
          { model: Unit }
        ]
      });
      
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
      
      // Check if applicant is withdrawing their own application
      if (application.applicantId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You can only withdraw your own applications'
        });
      }
      
      if (application.status === 'withdrawn') {
        return res.status(400).json({
          success: false,
          message: 'Application is already withdrawn'
        });
      }
      
      if (['approved', 'rejected'].includes(application.status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot withdraw an application that is already ${application.status}`
        });
      }
      
      // Update application
      await application.update({
        status: 'withdrawn',
        withdrawnAt: new Date(),
        withdrawalReason: reason,
        withdrawnById: req.user.id
      });
      
      // Update unit status back to available
      await application.Unit.update({ status: 'available' });
      
      // Send notification to property managers
      await createNotification({
        userId: req.user.id,
        type: 'application_withdrawn',
        title: 'Application Withdrawn',
        message: `Application ${application.applicationNumber} has been withdrawn`,
        data: { applicationId: application.id },
        recipients: ['property_managers']
      });
      
      res.json({
        success: true,
        message: 'Application withdrawn successfully',
        data: application
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = applicationController;