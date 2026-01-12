const { Payment, Tenant, Lease, Property, Unit, User, Transaction } = require('../../models');
const { Op } = require('sequelize');
const { sendEmail } = require('../../services/communication/email.service');
const { createNotification } = require('../../services/communication/notification.service');
const { processPayment } = require('../../services/financial/payment.service');

const getStripe = () => {
  const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
  if (!stripeKey || stripeKey.startsWith('sk_test')) {
    return null;
  }
  return require('stripe')(stripeKey);
};

const paymentController = {
  // Get all payments
  getAllPayments: async (req, res) => {
    try {
      const { 
        tenantId, 
        leaseId, 
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
      if (leaseId) where.leaseId = leaseId;
      if (propertyId) where.propertyId = propertyId;
      if (status) where.status = status;
      if (type) where.type = type;
      
      if (fromDate || toDate) {
        where.dueDate = {};
        if (fromDate) where.dueDate[Op.gte] = new Date(fromDate);
        if (toDate) where.dueDate[Op.lte] = new Date(toDate);
      }
      
      if (search) {
        where[Op.or] = [
          { paymentNumber: { [Op.like]: `%${search}%` } },
          { '$Tenant.firstName$': { [Op.like]: `%${search}%` } },
          { '$Tenant.lastName$': { [Op.like]: `%${search}%` } },
          { '$Property.name$': { [Op.like]: `%${search}%` } }
        ];
      }
      
      const payments = await Payment.findAndCountAll({
        where,
        include: [
          {
            model: Tenant,
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: Lease,
            attributes: ['id', 'leaseNumber']
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
        order: [['dueDate', 'DESC']]
      });
      
      res.json({
        success: true,
        data: payments.rows,
        pagination: {
          total: payments.count,
          page: parseInt(page),
          pages: Math.ceil(payments.count / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get payment by ID
  getPaymentById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const payment = await Payment.findByPk(id, {
        include: [
          {
            model: Tenant,
            include: [{
              model: User,
              attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
            }]
          },
          {
            model: Lease,
            include: [{ model: Property }, { model: Unit }]
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
            model: Transaction,
            attributes: ['id', 'transactionId', 'status', 'amount', 'processedAt']
          },
          {
            model: User,
            as: 'CollectedBy',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });
      
      if (!payment) {
        return res.status(404).json({ success: false, message: 'Payment not found' });
      }
      
      // Check if payment belongs to user's company
      if (payment.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this payment'
        });
      }
      
      res.json({ success: true, data: payment });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Create payment (manual entry)
  createPayment: async (req, res) => {
    try {
      const {
        tenantId,
        leaseId,
        propertyId,
        unitId,
        amount,
        dueDate,
        type,
        description,
        isRecurring,
        recurringInterval,
        paymentMethod,
        notes
      } = req.body;
      
      // Validate tenant
      const tenant = await Tenant.findByPk(tenantId);
      if (!tenant) {
        return res.status(404).json({ success: false, message: 'Tenant not found' });
      }
      
      // Validate lease
      const lease = await Lease.findByPk(leaseId);
      if (!lease) {
        return res.status(404).json({ success: false, message: 'Lease not found' });
      }
      
      // Generate payment number
      const paymentCount = await Payment.count();
      const paymentNumber = `PAY-${new Date().getFullYear()}-${String(paymentCount + 1).padStart(6, '0')}`;
      
      // Create payment
      const payment = await Payment.create({
        paymentNumber,
        tenantId,
        leaseId,
        propertyId: propertyId || lease.propertyId,
        unitId: unitId || lease.unitId,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        type: type || 'rent', // rent, late_fee, maintenance, deposit, other
        description: description || `${type || 'rent'} payment`,
        status: 'pending', // pending, paid, overdue, partially_paid, cancelled
        isRecurring: isRecurring || false,
        recurringInterval: recurringInterval || 'monthly',
        paymentMethod: paymentMethod || 'manual',
        notes: notes || '',
        createdById: req.user.id,
        companyId: req.user.companyId,
        portfolioId: lease.portfolioId
      });
      
      // If due date is today or in the past, mark as overdue
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const due = new Date(dueDate);
      due.setHours(0, 0, 0, 0);
      
      if (due < today) {
        await payment.update({ status: 'overdue' });
      }
      
      // Send payment notification to tenant
      const tenantUser = await User.findByPk(tenant.userId);
      if (tenantUser) {
        await sendEmail({
          to: tenantUser.email,
          subject: `New Payment Due: ${paymentNumber}`,
          template: 'payment-due',
          data: {
            firstName: tenant.firstName,
            paymentNumber,
            amount: payment.amount,
            dueDate: payment.dueDate.toLocaleDateString(),
            type: payment.type,
            description: payment.description
          }
        });
      }
      
      res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Process payment (tenant makes payment)
  processPayment: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        amount, 
        paymentMethod, 
        transactionId,
        paymentDate,
        notes 
      } = req.body;
      
      const payment = await Payment.findByPk(id, {
        include: [
          { model: Tenant },
          { model: Lease },
          { model: Property }
        ]
      });
      
      if (!payment) {
        return res.status(404).json({ success: false, message: 'Payment not found' });
      }
      
      if (payment.status === 'paid') {
        return res.status(400).json({
          success: false,
          message: 'Payment is already marked as paid'
        });
      }
      
      const paymentAmount = parseFloat(amount) || payment.amount;
      const remainingAmount = payment.amount - (payment.paidAmount || 0);
      
      if (paymentAmount > remainingAmount) {
        return res.status(400).json({
          success: false,
          message: `Payment amount exceeds remaining balance. Remaining: $${remainingAmount}`
        });
      }
      
      // Process payment through payment service
      const paymentResult = await processPayment({
        paymentId: payment.id,
        amount: paymentAmount,
        paymentMethod: paymentMethod || 'credit_card',
        transactionId,
        customerEmail: payment.Tenant.email,
        description: `Payment for ${payment.description}`
      });
      
      // Update payment status
      const paidAmount = (payment.paidAmount || 0) + paymentAmount;
      const newStatus = paidAmount >= payment.amount ? 'paid' : 'partially_paid';
      
      await payment.update({
        paidAmount,
        status: newStatus,
        paymentMethod: paymentMethod || payment.paymentMethod,
        paidDate: new Date(paymentDate || new Date()),
        collectedById: req.user.id,
        transactionId: paymentResult.transactionId,
        paymentNotes: notes
      });
      
      // Create transaction record
      await Transaction.create({
        transactionId: paymentResult.transactionId,
        paymentId: payment.id,
        tenantId: payment.tenantId,
        amount: paymentAmount,
        paymentMethod: paymentMethod || 'credit_card',
        status: paymentResult.status,
        processedAt: new Date(),
        gatewayResponse: paymentResult,
        companyId: payment.companyId
      });
      
      // Update tenant balance
      await Tenant.update(
        { balance: sequelize.literal(`balance - ${paymentAmount}`) },
        { where: { id: payment.tenantId } }
      );
      
      // Send payment confirmation
      const tenantUser = await User.findByPk(payment.Tenant.userId);
      if (tenantUser) {
        await sendEmail({
          to: tenantUser.email,
          subject: `Payment Confirmation: ${payment.paymentNumber}`,
          template: 'payment-confirmation',
          data: {
            firstName: payment.Tenant.firstName,
            paymentNumber: payment.paymentNumber,
            amount: paymentAmount,
            paidDate: new Date().toLocaleDateString(),
            transactionId: paymentResult.transactionId,
            remainingBalance: remainingAmount - paymentAmount
          }
        });
      }
      
      // Create notification for property manager
      await createNotification({
        userId: req.user.id,
        type: 'payment_received',
        title: 'Payment Received',
        message: `Payment ${payment.paymentNumber} received from ${payment.Tenant.firstName} ${payment.Tenant.lastName}`,
        data: { paymentId: payment.id, amount: paymentAmount },
        recipients: ['property_managers', 'financial_controllers']
      });
      
      res.json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          payment,
          transaction: paymentResult
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Record manual payment (cash/check)
  recordManualPayment: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        amount, 
        paymentMethod, 
        referenceNumber,
        paymentDate,
        receivedBy,
        notes 
      } = req.body;
      
      const payment = await Payment.findByPk(id, {
        include: [{ model: Tenant }]
      });
      
      if (!payment) {
        return res.status(404).json({ success: false, message: 'Payment not found' });
      }
      
      if (payment.status === 'paid') {
        return res.status(400).json({
          success: false,
          message: 'Payment is already marked as paid'
        });
      }
      
      const paymentAmount = parseFloat(amount) || payment.amount;
      const remainingAmount = payment.amount - (payment.paidAmount || 0);
      
      if (paymentAmount > remainingAmount) {
        return res.status(400).json({
          success: false,
          message: `Payment amount exceeds remaining balance. Remaining: $${remainingAmount}`
        });
      }
      
      // Update payment
      const paidAmount = (payment.paidAmount || 0) + paymentAmount;
      const newStatus = paidAmount >= payment.amount ? 'paid' : 'partially_paid';
      
      await payment.update({
        paidAmount,
        status: newStatus,
        paymentMethod: paymentMethod || 'cash',
        paidDate: new Date(paymentDate || new Date()),
        collectedById: req.user.id,
        referenceNumber,
        paymentNotes: notes
      });
      
      // Create transaction record
      await Transaction.create({
        transactionId: referenceNumber || `MANUAL-${Date.now()}`,
        paymentId: payment.id,
        tenantId: payment.tenantId,
        amount: paymentAmount,
        paymentMethod: paymentMethod || 'cash',
        status: 'completed',
        processedAt: new Date(),
        processedBy: receivedBy || req.user.id,
        companyId: payment.companyId
      });
      
      // Update tenant balance
      await Tenant.update(
        { balance: sequelize.literal(`balance - ${paymentAmount}`) },
        { where: { id: payment.tenantId } }
      );
      
      // Send receipt
      const tenantUser = await User.findByPk(payment.Tenant.userId);
      if (tenantUser) {
        await sendEmail({
          to: tenantUser.email,
          subject: `Payment Receipt: ${payment.paymentNumber}`,
          template: 'payment-receipt',
          data: {
            firstName: payment.Tenant.firstName,
            paymentNumber: payment.paymentNumber,
            amount: paymentAmount,
            paidDate: new Date().toLocaleDateString(),
            paymentMethod: paymentMethod || 'cash',
            referenceNumber: referenceNumber || 'N/A',
            collectedBy: receivedBy || req.user.firstName
          }
        });
      }
      
      res.json({
        success: true,
        message: 'Manual payment recorded successfully',
        data: payment
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Void/cancel payment
  voidPayment: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason, refundAmount } = req.body;
      
      const payment = await Payment.findByPk(id, {
        include: [{ model: Tenant }]
      });
      
      if (!payment) {
        return res.status(404).json({ success: false, message: 'Payment not found' });
      }
      
      if (payment.status === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Payment is already cancelled'
        });
      }
      
      // Handle refund if payment was already paid
      if (payment.paidAmount > 0) {
        const refundAmt = parseFloat(refundAmount) || payment.paidAmount;
        
        if (refundAmt > payment.paidAmount) {
          return res.status(400).json({
            success: false,
            message: `Refund amount cannot exceed paid amount: $${payment.paidAmount}`
          });
        }
        
        // Process refund through payment gateway
        if (payment.transactionId && payment.paymentMethod !== 'cash') {
          try {
            const refund = await stripe.refunds.create({
              payment_intent: payment.transactionId,
              amount: Math.round(refundAmt * 100) // Convert to cents
            });
            
            // Create refund transaction
            await Transaction.create({
              transactionId: refund.id,
              paymentId: payment.id,
              tenantId: payment.tenantId,
              amount: refundAmt,
              paymentMethod: 'refund',
              status: 'completed',
              processedAt: new Date(),
              gatewayResponse: refund,
              companyId: payment.companyId
            });
            
          } catch (stripeError) {
            console.error('Stripe refund error:', stripeError);
            return res.status(500).json({
              success: false,
              message: 'Failed to process refund through payment gateway'
            });
          }
        }
        
        // Update tenant balance
        await Tenant.update(
          { balance: sequelize.literal(`balance + ${refundAmt}`) },
          { where: { id: payment.tenantId } }
        );
        
        // Update payment
        const newPaidAmount = payment.paidAmount - refundAmt;
        const newStatus = newPaidAmount > 0 ? 'partially_paid' : 'cancelled';
        
        await payment.update({
          paidAmount: newPaidAmount,
          status: newStatus,
          cancelledAt: new Date(),
          cancelledById: req.user.id,
          cancellationReason: reason,
          refundAmount: refundAmt
        });
        
      } else {
        // Just cancel unpaid payment
        await payment.update({
          status: 'cancelled',
          cancelledAt: new Date(),
          cancelledById: req.user.id,
          cancellationReason: reason
        });
      }
      
      // Send cancellation notification
      const tenantUser = await User.findByPk(payment.Tenant.userId);
      if (tenantUser) {
        await sendEmail({
          to: tenantUser.email,
          subject: `Payment Cancelled: ${payment.paymentNumber}`,
          template: 'payment-cancelled',
          data: {
            firstName: payment.Tenant.firstName,
            paymentNumber: payment.paymentNumber,
            amount: payment.amount,
            reason: reason,
            refundAmount: refundAmount || 0
          }
        });
      }
      
      res.json({
        success: true,
        message: 'Payment cancelled successfully',
        data: payment
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Generate rent payments for all active leases
  generateRentPayments: async (req, res) => {
    try {
      const { month, year } = req.body;
      
      const targetMonth = month || new Date().getMonth() + 1;
      const targetYear = year || new Date().getFullYear();
      
      // Get all active leases
      const activeLeases = await Lease.findAll({
        where: {
          status: 'active',
          companyId: req.user.companyId
        },
        include: [
          { model: Tenant },
          { model: Property },
          { model: Unit }
        ]
      });
      
      const generatedPayments = [];
      const errors = [];
      
      for (const lease of activeLeases) {
        try {
          // Check if payment already exists for this month
          const existingPayment = await Payment.findOne({
            where: {
              leaseId: lease.id,
              type: 'rent',
              dueDate: {
                [Op.between]: [
                  new Date(targetYear, targetMonth - 1, 1),
                  new Date(targetYear, targetMonth, 0)
                ]
              }
            }
          });
          
          if (existingPayment) {
            errors.push({
              lease: lease.leaseNumber,
              tenant: `${lease.Tenant.firstName} ${lease.Tenant.lastName}`,
              error: 'Payment already exists for this month'
            });
            continue;
          }
          
          // Generate payment number
          const paymentCount = await Payment.count();
          const paymentNumber = `RENT-${targetYear}${String(targetMonth).padStart(2, '0')}-${String(paymentCount + 1).padStart(4, '0')}`;
          
          // Determine due date (usually 1st of the month)
          const dueDate = new Date(targetYear, targetMonth - 1, lease.paymentDueDay || 1);
          
          // Create rent payment
          const payment = await Payment.create({
            paymentNumber,
            tenantId: lease.tenantId,
            leaseId: lease.id,
            propertyId: lease.propertyId,
            unitId: lease.unitId,
            amount: lease.rentAmount,
            dueDate,
            type: 'rent',
            description: `Rent for ${new Date(targetYear, targetMonth - 1).toLocaleString('default', { month: 'long' })} ${targetYear}`,
            status: 'pending',
            isRecurring: true,
            recurringInterval: 'monthly',
            createdById: req.user.id,
            companyId: lease.companyId,
            portfolioId: lease.portfolioId
          });
          
          generatedPayments.push({
            paymentNumber: payment.paymentNumber,
            tenant: `${lease.Tenant.firstName} ${lease.Tenant.lastName}`,
            property: lease.Property.name,
            unit: lease.Unit.unitNumber,
            amount: lease.rentAmount,
            dueDate: dueDate.toLocaleDateString()
          });
          
          // Send notification to tenant
          const tenantUser = await User.findByPk(lease.Tenant.userId);
          if (tenantUser) {
            await sendEmail({
              to: tenantUser.email,
              subject: `Rent Due: ${paymentNumber}`,
              template: 'rent-payment-generated',
              data: {
                firstName: lease.Tenant.firstName,
                paymentNumber,
                amount: lease.rentAmount,
                dueDate: dueDate.toLocaleDateString(),
                propertyName: lease.Property.name,
                unitNumber: lease.Unit.unitNumber
              }
            });
          }
          
        } catch (error) {
          errors.push({
            lease: lease.leaseNumber,
            error: error.message
          });
        }
      }
      
      res.json({
        success: true,
        message: `Generated ${generatedPayments.length} rent payments for ${targetMonth}/${targetYear}`,
        data: {
          generated: generatedPayments,
          errors: errors
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Apply late fees to overdue payments
  applyLateFees: async (req, res) => {
    try {
      const { gracePeriodDays, lateFeeAmount, lateFeeType } = req.body;
      
      const graceDays = gracePeriodDays || 5;
      const feeAmount = parseFloat(lateFeeAmount) || 50;
      const feeType = lateFeeType || 'fixed'; // fixed or percentage
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Find overdue payments
      const overduePayments = await Payment.findAll({
        where: {
          status: 'overdue',
          companyId: req.user.companyId,
          type: 'rent'
        },
        include: [
          { model: Tenant },
          { model: Lease }
        ]
      });
      
      const appliedFees = [];
      const errors = [];
      
      for (const payment of overduePayments) {
        try {
          // Check if late fee already applied
          const existingLateFee = await Payment.findOne({
            where: {
              leaseId: payment.leaseId,
              type: 'late_fee',
              dueDate: {
                [Op.between]: [
                  new Date(payment.dueDate),
                  today
                ]
              }
            }
          });
          
          if (existingLateFee) {
            errors.push({
              payment: payment.paymentNumber,
              error: 'Late fee already applied'
            });
            continue;
          }
          
          // Calculate late fee amount
          let calculatedFee = feeAmount;
          if (feeType === 'percentage' && payment.Lease?.lateFee) {
            calculatedFee = (payment.amount * payment.Lease.lateFee) / 100;
          }
          
          // Generate late fee payment
          const lateFeePayment = await Payment.create({
            paymentNumber: `LATE-${payment.paymentNumber}`,
            tenantId: payment.tenantId,
            leaseId: payment.leaseId,
            propertyId: payment.propertyId,
            unitId: payment.unitId,
            amount: calculatedFee,
            dueDate: today,
            type: 'late_fee',
            description: `Late fee for ${payment.paymentNumber}`,
            status: 'pending',
            parentPaymentId: payment.id,
            createdById: req.user.id,
            companyId: payment.companyId,
            portfolioId: payment.portfolioId
          });
          
          appliedFees.push({
            originalPayment: payment.paymentNumber,
            lateFeePayment: lateFeePayment.paymentNumber,
            tenant: `${payment.Tenant.firstName} ${payment.Tenant.lastName}`,
            amount: calculatedFee,
            dueDate: today.toLocaleDateString()
          });
          
          // Send late fee notification
          const tenantUser = await User.findByPk(payment.Tenant.userId);
          if (tenantUser) {
            await sendEmail({
              to: tenantUser.email,
              subject: `Late Fee Applied: ${lateFeePayment.paymentNumber}`,
              template: 'late-fee-applied',
              data: {
                firstName: payment.Tenant.firstName,
                originalPayment: payment.paymentNumber,
                lateFeePayment: lateFeePayment.paymentNumber,
                amount: calculatedFee,
                dueDate: payment.dueDate.toLocaleDateString(),
                daysLate: Math.ceil((today - payment.dueDate) / (1000 * 60 * 60 * 24))
              }
            });
          }
          
        } catch (error) {
          errors.push({
            payment: payment.paymentNumber,
            error: error.message
          });
        }
      }
      
      res.json({
        success: true,
        message: `Applied ${appliedFees.length} late fees`,
        data: {
          applied: appliedFees,
          errors: errors
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get payment statistics
  getPaymentStatistics: async (req, res) => {
    try {
      const { startDate, endDate, propertyId } = req.query;
      
      const where = { 
        companyId: req.user.companyId,
        status: 'paid'
      };
      
      if (propertyId) where.propertyId = propertyId;
      if (startDate || endDate) {
        where.paidDate = {};
        if (startDate) where.paidDate[Op.gte] = new Date(startDate);
        if (endDate) where.paidDate[Op.lte] = new Date(endDate);
      }
      
      // Total collected
      const totalResult = await Payment.findOne({
        where,
        attributes: [
          [sequelize.fn('SUM', sequelize.col('paidAmount')), 'totalCollected'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalPayments']
        ]
      });
      
      // By payment type
      const byType = await Payment.findAll({
        where,
        attributes: [
          'type',
          [sequelize.fn('SUM', sequelize.col('paidAmount')), 'totalAmount'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['type'],
        order: [[sequelize.fn('SUM', sequelize.col('paidAmount')), 'DESC']]
      });
      
      // By property
      const byProperty = await Payment.findAll({
        where,
        attributes: [
          'propertyId',
          [sequelize.fn('SUM', sequelize.col('paidAmount')), 'totalAmount'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['propertyId'],
        include: [{
          model: Property,
          attributes: ['name']
        }],
        limit: 10,
        order: [[sequelize.fn('SUM', sequelize.col('paidAmount')), 'DESC']]
      });
      
      // Overdue payments
      const overdueResult = await Payment.findOne({
        where: {
          companyId: req.user.companyId,
          status: 'overdue'
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('amount')), 'totalOverdue'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ]
      });
      
      // Pending payments
      const pendingResult = await Payment.findOne({
        where: {
          companyId: req.user.companyId,
          status: 'pending',
          dueDate: { [Op.gte]: new Date() }
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('amount')), 'totalPending'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ]
      });
      
      // Monthly trend
      const monthlyTrend = await Payment.findAll({
        where,
        attributes: [
          [sequelize.fn('DATE_FORMAT', sequelize.col('paidDate'), '%Y-%m'), 'month'],
          [sequelize.fn('SUM', sequelize.col('paidAmount')), 'totalAmount'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: [sequelize.fn('DATE_FORMAT', sequelize.col('paidDate'), '%Y-%m')],
        order: [[sequelize.fn('DATE_FORMAT', sequelize.col('paidDate'), '%Y-%m'), 'ASC']],
        limit: 12
      });
      
      res.json({
        success: true,
        data: {
          totalCollected: parseFloat(totalResult?.dataValues.totalCollected || 0),
          totalPayments: parseInt(totalResult?.dataValues.totalPayments || 0),
          byType: byType.map(item => ({
            type: item.type,
            totalAmount: parseFloat(item.dataValues.totalAmount || 0),
            count: parseInt(item.dataValues.count || 0)
          })),
          byProperty: byProperty.map(item => ({
            propertyId: item.propertyId,
            propertyName: item.Property?.name || 'Unknown',
            totalAmount: parseFloat(item.dataValues.totalAmount || 0),
            count: parseInt(item.dataValues.count || 0)
          })),
          overdue: {
            totalAmount: parseFloat(overdueResult?.dataValues.totalOverdue || 0),
            count: parseInt(overdueResult?.dataValues.count || 0)
          },
          pending: {
            totalAmount: parseFloat(pendingResult?.dataValues.totalPending || 0),
            count: parseInt(pendingResult?.dataValues.count || 0)
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
  
  // Export payments
  exportPayments: async (req, res) => {
    try {
      const { startDate, endDate, format = 'csv' } = req.query;
      
      const where = { companyId: req.user.companyId };
      
      if (startDate || endDate) {
        where.paidDate = {};
        if (startDate) where.paidDate[Op.gte] = new Date(startDate);
        if (endDate) where.paidDate[Op.lte] = new Date(endDate);
      }
      
      const payments = await Payment.findAll({
        where,
        include: [
          {
            model: Tenant,
            attributes: ['firstName', 'lastName', 'email']
          },
          {
            model: Property,
            attributes: ['name']
          },
          {
            model: Unit,
            attributes: ['unitNumber']
          },
          {
            model: Lease,
            attributes: ['leaseNumber']
          }
        ],
        order: [['paidDate', 'DESC']]
      });
      
      // Format data for export
      const exportData = payments.map(payment => ({
        'Payment Number': payment.paymentNumber,
        'Date': payment.paidDate ? payment.paidDate.toLocaleDateString() : 'N/A',
        'Tenant': `${payment.Tenant?.firstName || ''} ${payment.Tenant?.lastName || ''}`,
        'Email': payment.Tenant?.email || 'N/A',
        'Property': payment.Property?.name || 'N/A',
        'Unit': payment.Unit?.unitNumber || 'N/A',
        'Lease': payment.Lease?.leaseNumber || 'N/A',
        'Type': payment.type,
        'Description': payment.description,
        'Amount': payment.amount,
        'Paid Amount': payment.paidAmount || 0,
        'Due Date': payment.dueDate.toLocaleDateString(),
        'Status': payment.status,
        'Payment Method': payment.paymentMethod,
        'Transaction ID': payment.transactionId || 'N/A',
        'Notes': payment.paymentNotes || ''
      }));
      
      if (format === 'csv') {
        // Convert to CSV
        const headers = Object.keys(exportData[0] || {});
        const csv = [
          headers.join(','),
          ...exportData.map(row => 
            headers.map(header => 
              `"${(row[header] || '').toString().replace(/"/g, '""')}"`
            ).join(',')
          )
        ].join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=payments-export.csv');
        return res.send(csv);
      } else {
        res.json({
          success: true,
          data: exportData
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get payment settings
  getPaymentSettings: async (req, res) => {
    try {
      const { Company } = require('../../models');
      
      const company = await Company.findByPk(req.user.companyId);
      
      if (!company) {
        return res.status(404).json({ success: false, message: 'Company not found' });
      }
      
      const settings = company.settings?.paymentSettings || {
        paymentMethods: ['bank_transfer', 'credit_card'],
        autoPaymentEnabled: false,
        paymentDueDay: 15,
        lateFeePercentage: 5,
        lateFeeType: 'percentage',
        gracePeriodDays: 3,
        notificationDays: 7,
        refundPolicy: 'full',
        refundProcessingDays: 5,
        bankDetails: {
          accountHolder: '',
          accountNumber: '',
          routingNumber: '',
          bankName: ''
        },
        paypalEmail: '',
        stripeConnected: false
      };
      
      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update payment settings
  updatePaymentSettings: async (req, res) => {
    try {
      const { Company } = require('../../models');
      const settingsData = req.body;
      
      const company = await Company.findByPk(req.user.companyId);
      
      if (!company) {
        return res.status(404).json({ success: false, message: 'Company not found' });
      }
      
      const updatedSettings = {
        ...company.settings,
        paymentSettings: settingsData
      };
      
      await company.update({
        settings: updatedSettings
      });
      
      res.json({
        success: true,
        message: 'Payment settings updated successfully',
        data: settingsData
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = paymentController;