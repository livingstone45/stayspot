const { Invoice, Payment, Tenant, Property, Unit, User } = require('../../models');
const { Op } = require('sequelize');
const { sendEmail } = require('../../services/communication/email.service');
const { generateInvoicePDF } = require('../../services/document.service');

const invoiceController = {
  // Get all invoices
  getAllInvoices: async (req, res) => {
    try {
      const { 
        tenantId, 
        propertyId,
        status, 
        type,
        fromDate,
        toDate,
        search,
        page = 1, 
        limit = 20 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = { companyId: req.user.companyId };
      if (tenantId) where.tenantId = tenantId;
      if (propertyId) where.propertyId = propertyId;
      if (status) where.status = status;
      if (type) where.type = type;
      
      if (fromDate || toDate) {
        where.invoiceDate = {};
        if (fromDate) where.invoiceDate[Op.gte] = new Date(fromDate);
        if (toDate) where.invoiceDate[Op.lte] = new Date(toDate);
      }
      
      if (search) {
        where[Op.or] = [
          { invoiceNumber: { [Op.like]: `%${search}%` } },
          { '$Tenant.firstName$': { [Op.like]: `%${search}%` } },
          { '$Tenant.lastName$': { [Op.like]: `%${search}%` } },
          { '$Property.name$': { [Op.like]: `%${search}%` } }
        ];
      }
      
      const invoices = await Invoice.findAndCountAll({
        where,
        include: [
          {
            model: Tenant,
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: Property,
            attributes: ['id', 'name']
          },
          {
            model: Unit,
            attributes: ['id', 'unitNumber']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['invoiceDate', 'DESC']]
      });
      
      res.json({
        success: true,
        data: invoices.rows,
        pagination: {
          total: invoices.count,
          page: parseInt(page),
          pages: Math.ceil(invoices.count / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get invoice by ID
  getInvoiceById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const invoice = await Invoice.findByPk(id, {
        include: [
          {
            model: Tenant,
            include: [{
              model: User,
              attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
            }]
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
            model: Payment,
            attributes: ['id', 'paymentNumber', 'amount', 'paidAmount', 'status']
          },
          {
            model: User,
            as: 'CreatedBy',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });
      
      if (!invoice) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }
      
      // Check if invoice belongs to user's company
      if (invoice.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this invoice'
        });
      }
      
      res.json({ success: true, data: invoice });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Create invoice
  createInvoice: async (req, res) => {
    try {
      const {
        tenantId,
        propertyId,
        unitId,
        invoiceDate,
        dueDate,
        items,
        notes,
        terms,
        sendEmail: shouldSendEmail
      } = req.body;
      
      // Validate tenant
      const tenant = await Tenant.findByPk(tenantId);
      if (!tenant) {
        return res.status(404).json({ success: false, message: 'Tenant not found' });
      }
      
      // Validate property
      const property = await Property.findByPk(propertyId);
      if (!property) {
        return res.status(404).json({ success: false, message: 'Property not found' });
      }
      
      // Calculate totals
      let subtotal = 0;
      let tax = 0;
      const validatedItems = [];
      
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invoice items are required'
        });
      }
      
      for (const item of items) {
        const itemAmount = parseFloat(item.amount) || 0;
        const itemQuantity = parseFloat(item.quantity) || 1;
        const itemTotal = itemAmount * itemQuantity;
        
        validatedItems.push({
          description: item.description,
          quantity: itemQuantity,
          amount: itemAmount,
          total: itemTotal,
          taxRate: parseFloat(item.taxRate) || 0
        });
        
        subtotal += itemTotal;
        tax += itemTotal * (parseFloat(item.taxRate) || 0) / 100;
      }
      
      const total = subtotal + tax;
      
      // Generate invoice number
      const invoiceCount = await Invoice.count();
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(6, '0')}`;
      
      // Create invoice
      const invoice = await Invoice.create({
        invoiceNumber,
        tenantId,
        propertyId,
        unitId,
        invoiceDate: new Date(invoiceDate || new Date()),
        dueDate: new Date(dueDate || new Date()),
        items: validatedItems,
        subtotal,
        tax,
        total,
        notes: notes || '',
        terms: terms || 'Due upon receipt',
        status: 'pending', // pending, sent, viewed, paid, overdue, cancelled
        createdById: req.user.id,
        companyId: req.user.companyId,
        portfolioId: property.portfolioId
      });
      
      // Create payment record for the invoice
      const payment = await Payment.create({
        paymentNumber: `INV-${invoiceNumber}`,
        tenantId,
        propertyId,
        unitId,
        amount: total,
        dueDate: new Date(dueDate || new Date()),
        type: 'invoice',
        description: `Invoice ${invoiceNumber}`,
        status: 'pending',
        invoiceId: invoice.id,
        createdById: req.user.id,
        companyId: req.user.companyId,
        portfolioId: property.portfolioId
      });
      
      // Send invoice email if requested
      if (shouldSendEmail) {
        const tenantUser = await User.findByPk(tenant.userId);
        if (tenantUser) {
          // Generate invoice PDF
          const pdfBuffer = await generateInvoicePDF(invoice);
          
          await sendEmail({
            to: tenantUser.email,
            subject: `Invoice ${invoiceNumber} from ${property.name}`,
            template: 'invoice-sent',
            data: {
              firstName: tenant.firstName,
              invoiceNumber,
              invoiceDate: invoice.invoiceDate.toLocaleDateString(),
              dueDate: invoice.dueDate.toLocaleDateString(),
              total: invoice.total,
              propertyName: property.name,
              unitNumber: unitId ? (await Unit.findByPk(unitId))?.unitNumber : 'N/A'
            },
            attachments: [{
              filename: `invoice-${invoiceNumber}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf'
            }]
          });
          
          await invoice.update({
            status: 'sent',
            sentAt: new Date(),
            sentById: req.user.id
          });
        }
      }
      
      res.status(201).json({
        success: true,
        message: 'Invoice created successfully',
        data: {
          invoice,
          payment
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update invoice
  updateInvoice: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const invoice = await Invoice.findByPk(id, {
        include: [{ model: Payment }]
      });
      
      if (!invoice) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }
      
      // Check if invoice belongs to user's company
      if (invoice.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this invoice'
        });
      }
      
      if (invoice.status === 'paid' || invoice.status === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: `Cannot update a ${invoice.status} invoice`
        });
      }
      
      // Recalculate totals if items are updated
      if (updates.items) {
        let subtotal = 0;
        let tax = 0;
        
        for (const item of updates.items) {
          const itemAmount = parseFloat(item.amount) || 0;
          const itemQuantity = parseFloat(item.quantity) || 1;
          const itemTotal = itemAmount * itemQuantity;
          
          subtotal += itemTotal;
          tax += itemTotal * (parseFloat(item.taxRate) || 0) / 100;
        }
        
        updates.subtotal = subtotal;
        updates.tax = tax;
        updates.total = subtotal + tax;
        
        // Update associated payment amount
        if (invoice.Payment) {
          await invoice.Payment.update({
            amount: updates.total
          });
        }
      }
      
      // Update invoice
      await invoice.update(updates);
      
      res.json({
        success: true,
        message: 'Invoice updated successfully',
        data: invoice
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Send invoice
  sendInvoice: async (req, res) => {
    try {
      const { id } = req.params;
      const { sendCopy, additionalMessage } = req.body;
      
      const invoice = await Invoice.findByPk(id, {
        include: [
          { model: Tenant },
          { model: Property },
          { model: Unit }
        ]
      });
      
      if (!invoice) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }
      
      // Check if invoice belongs to user's company
      if (invoice.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to send this invoice'
        });
      }
      
      if (invoice.status === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Cannot send a cancelled invoice'
        });
      }
      
      const tenantUser = await User.findByPk(invoice.Tenant.userId);
      if (!tenantUser) {
        return res.status(400).json({
          success: false,
          message: 'Tenant user not found'
        });
      }
      
      // Generate invoice PDF
      const pdfBuffer = await generateInvoicePDF(invoice);
      
      // Send email
      await sendEmail({
        to: tenantUser.email,
        cc: sendCopy ? req.user.email : undefined,
        subject: `Invoice ${invoice.invoiceNumber} from ${invoice.Property.name}`,
        template: 'invoice-sent',
        data: {
          firstName: invoice.Tenant.firstName,
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate: invoice.invoiceDate.toLocaleDateString(),
          dueDate: invoice.dueDate.toLocaleDateString(),
          total: invoice.total,
          propertyName: invoice.Property.name,
          unitNumber: invoice.Unit?.unitNumber || 'N/A',
          additionalMessage: additionalMessage || ''
        },
        attachments: [{
          filename: `invoice-${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }]
      });
      
      // Update invoice status
      await invoice.update({
        status: 'sent',
        sentAt: new Date(),
        sentById: req.user.id
      });
      
      res.json({
        success: true,
        message: 'Invoice sent successfully',
        data: invoice
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Mark invoice as paid
  markInvoiceAsPaid: async (req, res) => {
    try {
      const { id } = req.params;
      const { paymentDate, paymentMethod, transactionId } = req.body;
      
      const invoice = await Invoice.findByPk(id, {
        include: [
          { model: Tenant },
          { model: Payment }
        ]
      });
      
      if (!invoice) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }
      
      // Check if invoice belongs to user's company
      if (invoice.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this invoice'
        });
      }
      
      if (invoice.status === 'paid') {
        return res.status(400).json({
          success: false,
          message: 'Invoice is already marked as paid'
        });
      }
      
      if (invoice.status === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Cannot mark a cancelled invoice as paid'
        });
      }
      
      // Update invoice
      await invoice.update({
        status: 'paid',
        paidDate: new Date(paymentDate || new Date()),
        paymentMethod: paymentMethod || 'manual',
        transactionId
      });
      
      // Update associated payment
      if (invoice.Payment) {
        await invoice.Payment.update({
          status: 'paid',
          paidAmount: invoice.total,
          paidDate: new Date(paymentDate || new Date()),
          paymentMethod: paymentMethod || 'manual',
          transactionId
        });
      }
      
      // Send payment confirmation
      const tenantUser = await User.findByPk(invoice.Tenant.userId);
      if (tenantUser) {
        await sendEmail({
          to: tenantUser.email,
          subject: `Invoice ${invoice.invoiceNumber} Paid`,
          template: 'invoice-paid',
          data: {
            firstName: invoice.Tenant.firstName,
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.total,
            paidDate: new Date(paymentDate || new Date()).toLocaleDateString(),
            paymentMethod: paymentMethod || 'manual'
          }
        });
      }
      
      res.json({
        success: true,
        message: 'Invoice marked as paid',
        data: invoice
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Cancel invoice
  cancelInvoice: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      const invoice = await Invoice.findByPk(id, {
        include: [
          { model: Tenant },
          { model: Payment }
        ]
      });
      
      if (!invoice) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }
      
      // Check if invoice belongs to user's company
      if (invoice.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to cancel this invoice'
        });
      }
      
      if (invoice.status === 'paid') {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel a paid invoice. Issue a refund instead.'
        });
      }
      
      if (invoice.status === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Invoice is already cancelled'
        });
      }
      
      // Update invoice
      await invoice.update({
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledById: req.user.id,
        cancellationReason: reason
      });
      
      // Update associated payment
      if (invoice.Payment) {
        await invoice.Payment.update({
          status: 'cancelled',
          cancelledAt: new Date(),
          cancelledById: req.user.id,
          cancellationReason: reason
        });
      }
      
      // Send cancellation notification
      const tenantUser = await User.findByPk(invoice.Tenant.userId);
      if (tenantUser) {
        await sendEmail({
          to: tenantUser.email,
          subject: `Invoice ${invoice.invoiceNumber} Cancelled`,
          template: 'invoice-cancelled',
          data: {
            firstName: invoice.Tenant.firstName,
            invoiceNumber: invoice.invoiceNumber,
            reason: reason,
            cancelledDate: new Date().toLocaleDateString()
          }
        });
      }
      
      res.json({
        success: true,
        message: 'Invoice cancelled successfully',
        data: invoice
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Generate invoice PDF
  generateInvoicePDF: async (req, res) => {
    try {
      const { id } = req.params;
      
      const invoice = await Invoice.findByPk(id, {
        include: [
          { model: Tenant },
          { model: Property },
          { model: Unit }
        ]
      });
      
      if (!invoice) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }
      
      // Check if invoice belongs to user's company
      if (invoice.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this invoice'
        });
      }
      
      // Generate PDF
      const pdfBuffer = await generateInvoicePDF(invoice);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`
      });
      
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get invoice statistics
  getInvoiceStatistics: async (req, res) => {
    try {
      const { startDate, endDate, propertyId } = req.query;
      
      const where = { companyId: req.user.companyId };
      if (propertyId) where.propertyId = propertyId;
      if (startDate || endDate) {
        where.invoiceDate = {};
        if (startDate) where.invoiceDate[Op.gte] = new Date(startDate);
        if (endDate) where.invoiceDate[Op.lte] = new Date(endDate);
      }
      
      // Total invoices
      const totalResult = await Invoice.findOne({
        where,
        attributes: [
          [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalCount']
        ]
      });
      
      // By status
      const byStatus = await Invoice.findAll({
        where,
        attributes: [
          'status',
          [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status']
      });
      
      // By type (if we had type field)
      const byType = await Invoice.findAll({
        where,
        attributes: [
          [sequelize.literal('CASE WHEN items::text LIKE \'%"type":"rent"%\' THEN \'rent\' ELSE \'other\' END'), 'type'],
          [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: [sequelize.literal('CASE WHEN items::text LIKE \'%"type":"rent"%\' THEN \'rent\' ELSE \'other\' END')]
      });
      
      // Overdue invoices
      const overdueResult = await Invoice.findOne({
        where: {
          ...where,
          status: { [Op.in]: ['pending', 'sent', 'viewed'] },
          dueDate: { [Op.lt]: new Date() }
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('total')), 'totalOverdue'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ]
      });
      
      // Monthly trend
      const monthlyTrend = await Invoice.findAll({
        where,
        attributes: [
          [sequelize.fn('DATE_FORMAT', sequelize.col('invoiceDate'), '%Y-%m'), 'month'],
          [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: [sequelize.fn('DATE_FORMAT', sequelize.col('invoiceDate'), '%Y-%m')],
        order: [[sequelize.fn('DATE_FORMAT', sequelize.col('invoiceDate'), '%Y-%m'), 'ASC']],
        limit: 12
      });
      
      res.json({
        success: true,
        data: {
          totalAmount: parseFloat(totalResult?.dataValues.totalAmount || 0),
          totalCount: parseInt(totalResult?.dataValues.totalCount || 0),
          byStatus: byStatus.map(item => ({
            status: item.status,
            totalAmount: parseFloat(item.dataValues.totalAmount || 0),
            count: parseInt(item.dataValues.count || 0)
          })),
          byType: byType.map(item => ({
            type: item.dataValues.type,
            totalAmount: parseFloat(item.dataValues.totalAmount || 0),
            count: parseInt(item.dataValues.count || 0)
          })),
          overdue: {
            totalAmount: parseFloat(overdueResult?.dataValues.totalOverdue || 0),
            count: parseInt(overdueResult?.dataValues.count || 0)
          },
          monthlyTrend: monthlyTrend.map(item => ({
            month: item.dataValues.month,
            totalAmount: parseFloat(item.dataValues.totalAmount || 0),
            count: parseInt(item.dataValues.count || 0)
          }))
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Bulk send invoices
  bulkSendInvoices: async (req, res) => {
    try {
      const { invoiceIds, additionalMessage } = req.body;
      
      if (!Array.isArray(invoiceIds) || invoiceIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invoice IDs are required'
        });
      }
      
      const results = {
        sent: [],
        failed: []
      };
      
      for (const invoiceId of invoiceIds) {
        try {
          const invoice = await Invoice.findByPk(invoiceId, {
            include: [
              { model: Tenant },
              { model: Property },
              { model: Unit }
            ]
          });
          
          if (!invoice) {
            results.failed.push({
              invoiceId,
              error: 'Invoice not found'
            });
            continue;
          }
          
          if (invoice.status === 'cancelled') {
            results.failed.push({
              invoiceId,
              invoiceNumber: invoice.invoiceNumber,
              error: 'Invoice is cancelled'
            });
            continue;
          }
          
          if (invoice.status === 'paid') {
            results.failed.push({
              invoiceId,
              invoiceNumber: invoice.invoiceNumber,
              error: 'Invoice is already paid'
            });
            continue;
          }
          
          const tenantUser = await User.findByPk(invoice.Tenant.userId);
          if (!tenantUser) {
            results.failed.push({
              invoiceId,
              invoiceNumber: invoice.invoiceNumber,
              error: 'Tenant user not found'
            });
            continue;
          }
          
          // Generate invoice PDF
          const pdfBuffer = await generateInvoicePDF(invoice);
          
          // Send email
          await sendEmail({
            to: tenantUser.email,
            subject: `Invoice ${invoice.invoiceNumber} from ${invoice.Property.name}`,
            template: 'invoice-sent',
            data: {
              firstName: invoice.Tenant.firstName,
              invoiceNumber: invoice.invoiceNumber,
              invoiceDate: invoice.invoiceDate.toLocaleDateString(),
              dueDate: invoice.dueDate.toLocaleDateString(),
              total: invoice.total,
              propertyName: invoice.Property.name,
              unitNumber: invoice.Unit?.unitNumber || 'N/A',
              additionalMessage: additionalMessage || ''
            },
            attachments: [{
              filename: `invoice-${invoice.invoiceNumber}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf'
            }]
          });
          
          // Update invoice status
          await invoice.update({
            status: 'sent',
            sentAt: new Date(),
            sentById: req.user.id
          });
          
          results.sent.push({
            invoiceId,
            invoiceNumber: invoice.invoiceNumber,
            tenant: `${invoice.Tenant.firstName} ${invoice.Tenant.lastName}`,
            amount: invoice.total
          });
          
        } catch (error) {
          results.failed.push({
            invoiceId,
            error: error.message
          });
        }
      }
      
      res.json({
        success: true,
        message: `Sent ${results.sent.length} invoices successfully, ${results.failed.length} failed`,
        data: results
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = invoiceController;