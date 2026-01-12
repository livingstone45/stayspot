const { Payment, Transaction, Property } = require('../../models');
const { Op } = require('sequelize');

class ReconciliationService {
  async reconcilePayments(companyId, dateRange) {
    const { startDate, endDate } = dateRange;
    
    const payments = await Payment.findAll({
      where: {
        status: 'paid',
        paid_at: { [Op.between]: [startDate, endDate] }
      },
      include: [
        { model: Transaction, as: 'transactions' },
        { 
          model: Property, 
          as: 'property',
          where: { company_id: companyId }
        }
      ]
    });

    const reconciliation = {
      totalPayments: payments.length,
      totalAmount: 0,
      discrepancies: [],
      summary: {
        byMethod: {},
        byType: {},
        byProperty: {}
      }
    };

    payments.forEach(payment => {
      const amount = parseFloat(payment.amount);
      const paidAmount = parseFloat(payment.paid_amount || 0);
      
      reconciliation.totalAmount += paidAmount;

      // Check for discrepancies
      if (Math.abs(amount - paidAmount) > 0.01) {
        reconciliation.discrepancies.push({
          paymentId: payment.id,
          expectedAmount: amount,
          paidAmount: paidAmount,
          difference: paidAmount - amount,
          tenant: payment.tenant?.first_name + ' ' + payment.tenant?.last_name,
          property: payment.property?.name
        });
      }

      // Summarize by payment method
      const method = payment.payment_method || 'unknown';
      if (!reconciliation.summary.byMethod[method]) {
        reconciliation.summary.byMethod[method] = { count: 0, amount: 0 };
      }
      reconciliation.summary.byMethod[method].count++;
      reconciliation.summary.byMethod[method].amount += paidAmount;

      // Summarize by payment type
      const type = payment.type || 'unknown';
      if (!reconciliation.summary.byType[type]) {
        reconciliation.summary.byType[type] = { count: 0, amount: 0 };
      }
      reconciliation.summary.byType[type].count++;
      reconciliation.summary.byType[type].amount += paidAmount;

      // Summarize by property
      const propertyName = payment.property?.name || 'unknown';
      if (!reconciliation.summary.byProperty[propertyName]) {
        reconciliation.summary.byProperty[propertyName] = { count: 0, amount: 0 };
      }
      reconciliation.summary.byProperty[propertyName].count++;
      reconciliation.summary.byProperty[propertyName].amount += paidAmount;
    });

    return reconciliation;
  }

  async reconcileTransactions(companyId, dateRange) {
    const { startDate, endDate } = dateRange;
    
    const transactions = await Transaction.findAll({
      where: {
        processed_at: { [Op.between]: [startDate, endDate] },
        status: 'completed'
      },
      include: [{
        model: Payment,
        as: 'payment',
        include: [{
          model: Property,
          as: 'property',
          where: { company_id: companyId }
        }]
      }]
    });

    const reconciliation = {
      totalTransactions: transactions.length,
      totalAmount: 0,
      credits: 0,
      debits: 0,
      fees: 0,
      netAmount: 0
    };

    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      reconciliation.totalAmount += Math.abs(amount);

      if (amount > 0) {
        reconciliation.credits += amount;
      } else {
        reconciliation.debits += Math.abs(amount);
      }

      if (transaction.type === 'fee') {
        reconciliation.fees += Math.abs(amount);
      }
    });

    reconciliation.netAmount = reconciliation.credits - reconciliation.debits;

    return reconciliation;
  }

  async generateReconciliationReport(companyId, dateRange) {
    const [paymentReconciliation, transactionReconciliation] = await Promise.all([
      this.reconcilePayments(companyId, dateRange),
      this.reconcileTransactions(companyId, dateRange)
    ]);

    return {
      period: dateRange,
      generatedAt: new Date(),
      payments: paymentReconciliation,
      transactions: transactionReconciliation,
      summary: {
        totalRevenue: paymentReconciliation.totalAmount,
        totalTransactions: transactionReconciliation.totalTransactions,
        discrepancyCount: paymentReconciliation.discrepancies.length,
        netAmount: transactionReconciliation.netAmount
      }
    };
  }

  async identifyMissingPayments(companyId, dateRange) {
    const { startDate, endDate } = dateRange;
    
    // Find payments that should have been made but weren't
    const expectedPayments = await Payment.findAll({
      where: {
        due_date: { [Op.between]: [startDate, endDate] },
        status: { [Op.ne]: 'paid' }
      },
      include: [{
        model: Property,
        as: 'property',
        where: { company_id: companyId }
      }]
    });

    return expectedPayments.map(payment => ({
      paymentId: payment.id,
      tenant: payment.tenant?.first_name + ' ' + payment.tenant?.last_name,
      property: payment.property?.name,
      amount: parseFloat(payment.amount),
      dueDate: payment.due_date,
      daysPastDue: Math.floor((new Date() - new Date(payment.due_date)) / (1000 * 60 * 60 * 24))
    }));
  }

  async reconcileBankStatement(companyId, bankTransactions) {
    // This would match bank transactions with payment records
    const matchedTransactions = [];
    const unmatchedBankTransactions = [];
    const unmatchedPayments = [];

    // Get all payments for the period
    const payments = await Payment.findAll({
      where: { status: 'paid' },
      include: [{
        model: Property,
        as: 'property',
        where: { company_id: companyId }
      }]
    });

    // Simple matching algorithm (in production, this would be more sophisticated)
    bankTransactions.forEach(bankTx => {
      const matchedPayment = payments.find(payment => 
        Math.abs(parseFloat(payment.paid_amount) - parseFloat(bankTx.amount)) < 0.01 &&
        this.datesMatch(payment.paid_at, bankTx.date)
      );

      if (matchedPayment) {
        matchedTransactions.push({
          bankTransaction: bankTx,
          payment: matchedPayment
        });
      } else {
        unmatchedBankTransactions.push(bankTx);
      }
    });

    // Find unmatched payments
    const matchedPaymentIds = matchedTransactions.map(mt => mt.payment.id);
    unmatchedPayments.push(...payments.filter(p => !matchedPaymentIds.includes(p.id)));

    return {
      matched: matchedTransactions,
      unmatchedBank: unmatchedBankTransactions,
      unmatchedPayments: unmatchedPayments,
      reconciliationRate: (matchedTransactions.length / bankTransactions.length * 100).toFixed(2)
    };
  }

  datesMatch(date1, date2, toleranceDays = 2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= toleranceDays;
  }

  async generateVarianceReport(companyId, dateRange) {
    const { startDate, endDate } = dateRange;
    
    const payments = await Payment.findAll({
      where: {
        created_at: { [Op.between]: [startDate, endDate] }
      },
      include: [{
        model: Property,
        as: 'property',
        where: { company_id: companyId }
      }]
    });

    const variances = [];
    
    payments.forEach(payment => {
      const expectedAmount = parseFloat(payment.amount);
      const actualAmount = parseFloat(payment.paid_amount || 0);
      const variance = actualAmount - expectedAmount;
      
      if (Math.abs(variance) > 0.01) {
        variances.push({
          paymentId: payment.id,
          expectedAmount,
          actualAmount,
          variance,
          variancePercent: ((variance / expectedAmount) * 100).toFixed(2),
          tenant: payment.tenant?.first_name + ' ' + payment.tenant?.last_name,
          property: payment.property?.name
        });
      }
    });

    return {
      totalVariances: variances.length,
      totalVarianceAmount: variances.reduce((sum, v) => sum + v.variance, 0),
      variances: variances.sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))
    };
  }
}

module.exports = new ReconciliationService();