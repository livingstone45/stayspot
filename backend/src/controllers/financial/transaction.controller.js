const { Transaction, Payment, Tenant, User } = require('../../models');
const { Op } = require('sequelize');

const transactionController = {
  // Get all transactions
  getAllTransactions: async (req, res) => {
    try {
      const { 
        tenantId, 
        paymentId,
        status, 
        paymentMethod,
        fromDate,
        toDate,
        search,
        page = 1, 
        limit = 20 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = { companyId: req.user.companyId };
      if (tenantId) where.tenantId = tenantId;
      if (paymentId) where.paymentId = paymentId;
      if (status) where.status = status;
      if (paymentMethod) where.paymentMethod = paymentMethod;
      
      if (fromDate || toDate) {
        where.processedAt = {};
        if (fromDate) where.processedAt[Op.gte] = new Date(fromDate);
        if (toDate) where.processedAt[Op.lte] = new Date(toDate);
      }
      
      if (search) {
        where[Op.or] = [
          { transactionId: { [Op.like]: `%${search}%` } },
          { '$Tenant.firstName$': { [Op.like]: `%${search}%` } },
          { '$Tenant.lastName$': { [Op.like]: `%${search}%` } },
          { '$Payment.paymentNumber$': { [Op.like]: `%${search}%` } }
        ];
      }
      
      const transactions = await Transaction.findAndCountAll({
        where,
        include: [
          {
            model: Tenant,
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: Payment,
            attributes: ['id', 'paymentNumber', 'type', 'description']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['processedAt', 'DESC']]
      });
      
      res.json({
        success: true,
        data: transactions.rows,
        pagination: {
          total: transactions.count,
          page: parseInt(page),
          pages: Math.ceil(transactions.count / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get transaction by ID
  getTransactionById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const transaction = await Transaction.findByPk(id, {
        include: [
          {
            model: Tenant,
            include: [{
              model: User,
              attributes: ['id', 'firstName', 'lastName', 'email']
            }]
          },
          {
            model: Payment,
            include: [
              { model: Property },
              { model: Unit }
            ]
          }
        ]
      });
      
      if (!transaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }
      
      // Check if transaction belongs to user's company
      if (transaction.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this transaction'
        });
      }
      
      res.json({ success: true, data: transaction });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get transaction by transaction ID
  getTransactionByTransactionId: async (req, res) => {
    try {
      const { transactionId } = req.params;
      
      const transaction = await Transaction.findOne({
        where: { transactionId },
        include: [
          {
            model: Tenant,
            include: [{
              model: User,
              attributes: ['id', 'firstName', 'lastName', 'email']
            }]
          },
          {
            model: Payment,
            include: [
              { model: Property },
              { model: Unit }
            ]
          }
        ]
      });
      
      if (!transaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }
      
      // Check if transaction belongs to user's company
      if (transaction.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this transaction'
        });
      }
      
      res.json({ success: true, data: transaction });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update transaction status
  updateTransactionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      
      const validStatuses = ['pending', 'completed', 'failed', 'refunded', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
      
      const transaction = await Transaction.findByPk(id, {
        include: [{ model: Payment }]
      });
      
      if (!transaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }
      
      // Check if transaction belongs to user's company
      if (transaction.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this transaction'
        });
      }
      
      const oldStatus = transaction.status;
      
      // Update transaction
      await transaction.update({
        status,
        statusUpdatedAt: new Date(),
        statusUpdatedBy: req.user.id,
        statusNotes: notes
      });
      
      // If transaction failed and payment was marked as paid, update payment
      if (status === 'failed' && transaction.paymentId) {
        const payment = await Payment.findByPk(transaction.paymentId);
        if (payment && payment.status === 'paid') {
          const newPaidAmount = payment.paidAmount - transaction.amount;
          const newStatus = newPaidAmount > 0 ? 'partially_paid' : 'pending';
          
          await payment.update({
            paidAmount: newPaidAmount,
            status: newStatus
          });
          
          // Update tenant balance
          await Tenant.update(
            { balance: sequelize.literal(`balance + ${transaction.amount}`) },
            { where: { id: payment.tenantId } }
          );
        }
      }
      
      res.json({
        success: true,
        message: `Transaction status updated from ${oldStatus} to ${status}`,
        data: transaction
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get transaction statistics
  getTransactionStatistics: async (req, res) => {
    try {
      const { startDate, endDate, paymentMethod } = req.query;
      
      const where = { companyId: req.user.companyId };
      if (paymentMethod) where.paymentMethod = paymentMethod;
      if (startDate || endDate) {
        where.processedAt = {};
        if (startDate) where.processedAt[Op.gte] = new Date(startDate);
        if (endDate) where.processedAt[Op.lte] = new Date(endDate);
      }
      
      // Total transactions
      const totalResult = await Transaction.findOne({
        where,
        attributes: [
          [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalCount']
        ]
      });
      
      // By status
      const byStatus = await Transaction.findAll({
        where,
        attributes: [
          'status',
          [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status']
      });
      
      // By payment method
      const byPaymentMethod = await Transaction.findAll({
        where,
        attributes: [
          'paymentMethod',
          [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['paymentMethod'],
        order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']]
      });
      
      // Daily trend
      const dailyTrend = await Transaction.findAll({
        where: {
          ...where,
          processedAt: {
            [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        },
        attributes: [
          [sequelize.fn('DATE', sequelize.col('processedAt')), 'date'],
          [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: [sequelize.fn('DATE', sequelize.col('processedAt'))],
        order: [[sequelize.fn('DATE', sequelize.col('processedAt')), 'DESC']],
        limit: 30
      });
      
      // Success rate
      const successCount = await Transaction.count({
        where: {
          ...where,
          status: 'completed'
        }
      });
      
      const totalCount = await Transaction.count({ where });
      const successRate = totalCount > 0 ? (successCount / totalCount) * 100 : 0;
      
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
          byPaymentMethod: byPaymentMethod.map(item => ({
            paymentMethod: item.paymentMethod,
            totalAmount: parseFloat(item.dataValues.totalAmount || 0),
            count: parseInt(item.dataValues.count || 0)
          })),
          dailyTrend: dailyTrend.map(item => ({
            date: item.dataValues.date,
            totalAmount: parseFloat(item.dataValues.totalAmount || 0),
            count: parseInt(item.dataValues.count || 0)
          })),
          successRate: parseFloat(successRate.toFixed(2))
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Search transactions
  searchTransactions: async (req, res) => {
    try {
      const { query, startDate, endDate } = req.query;
      
      const where = { companyId: req.user.companyId };
      
      if (startDate || endDate) {
        where.processedAt = {};
        if (startDate) where.processedAt[Op.gte] = new Date(startDate);
        if (endDate) where.processedAt[Op.lte] = new Date(endDate);
      }
      
      if (query) {
        where[Op.or] = [
          { transactionId: { [Op.like]: `%${query}%` } },
          { '$Tenant.firstName$': { [Op.like]: `%${query}%` } },
          { '$Tenant.lastName$': { [Op.like]: `%${query}%` } },
          { '$Payment.paymentNumber$': { [Op.like]: `%${query}%` } }
        ];
      }
      
      const transactions = await Transaction.findAll({
        where,
        include: [
          {
            model: Tenant,
            attributes: ['firstName', 'lastName']
          },
          {
            model: Payment,
            attributes: ['paymentNumber', 'type']
          }
        ],
        order: [['processedAt', 'DESC']],
        limit: 50
      });
      
      res.json({
        success: true,
        data: transactions
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Reconcile transactions
  reconcileTransactions: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const where = {
        companyId: req.user.companyId,
        status: 'completed'
      };
      
      if (startDate || endDate) {
        where.processedAt = {};
        if (startDate) where.processedAt[Op.gte] = new Date(startDate);
        if (endDate) where.processedAt[Op.lte] = new Date(endDate);
      }
      
      // Get all completed transactions
      const transactions = await Transaction.findAll({
        where,
        include: [
          {
            model: Payment,
            attributes: ['id', 'paymentNumber', 'amount', 'paidAmount']
          }
        ],
        order: [['processedAt', 'ASC']]
      });
      
      // Group by payment method
      const reconciliation = {};
      let totalAmount = 0;
      let discrepancyCount = 0;
      
      transactions.forEach(transaction => {
        const method = transaction.paymentMethod;
        if (!reconciliation[method]) {
          reconciliation[method] = {
            count: 0,
            totalAmount: 0,
            transactions: []
          };
        }
        
        reconciliation[method].count++;
        reconciliation[method].totalAmount += transaction.amount;
        reconciliation[method].transactions.push({
          id: transaction.id,
          transactionId: transaction.transactionId,
          amount: transaction.amount,
          date: transaction.processedAt,
          paymentNumber: transaction.Payment?.paymentNumber
        });
        
        totalAmount += transaction.amount;
        
        // Check for discrepancies
        if (transaction.Payment) {
          const payment = transaction.Payment;
          if (Math.abs(transaction.amount - payment.amount) > 0.01) {
            discrepancyCount++;
          }
        }
      });
      
      // Convert to array
      const reconciliationArray = Object.entries(reconciliation).map(([method, data]) => ({
        paymentMethod: method,
        count: data.count,
        totalAmount: data.totalAmount,
        transactions: data.transactions
      }));
      
      res.json({
        success: true,
        data: {
          period: {
            start: startDate || 'Beginning',
            end: endDate || 'Now'
          },
          summary: {
            totalTransactions: transactions.length,
            totalAmount,
            discrepancyCount,
            reconciliation: reconciliationArray
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = transactionController;