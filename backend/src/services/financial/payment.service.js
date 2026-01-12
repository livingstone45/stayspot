const { Payment, Transaction, Tenant, Property } = require('../../models');
const { Op } = require('sequelize');

class PaymentService {
  async processPayment(paymentData) {
    const { paymentId, amount, paymentMethod, stripePaymentIntentId } = paymentData;

    const payment = await Payment.findByPk(paymentId, {
      include: [
        { model: Tenant, as: 'tenant' },
        { model: Property, as: 'property' }
      ]
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status === 'paid') {
      throw new Error('Payment already processed');
    }

    // Create transaction record
    const transaction = await Transaction.create({
      payment_id: paymentId,
      amount: amount,
      type: 'payment',
      method: paymentMethod,
      status: 'completed',
      external_id: stripePaymentIntentId,
      processed_at: new Date()
    });

    // Update payment status
    await payment.update({
      status: 'paid',
      paid_amount: amount,
      paid_at: new Date(),
      payment_method: paymentMethod
    });

    return {
      payment,
      transaction,
      success: true
    };
  }

  async createPayment(paymentData) {
    const { tenantId, propertyId, leaseId, amount, type, dueDate, description } = paymentData;

    return await Payment.create({
      tenant_id: tenantId,
      property_id: propertyId,
      lease_id: leaseId,
      amount,
      type,
      status: 'unpaid',
      due_date: dueDate,
      description
    });
  }

  async getPaymentsByTenant(tenantId, options = {}) {
    const { status, limit = 50, offset = 0 } = options;
    
    const where = { tenant_id: tenantId };
    if (status) where.status = status;

    return await Payment.findAndCountAll({
      where,
      limit,
      offset,
      order: [['due_date', 'DESC']],
      include: [{ model: Property, as: 'property' }]
    });
  }

  async getPaymentsByProperty(propertyId, options = {}) {
    const { status, limit = 50, offset = 0 } = options;
    
    const where = { property_id: propertyId };
    if (status) where.status = status;

    return await Payment.findAndCountAll({
      where,
      limit,
      offset,
      order: [['due_date', 'DESC']],
      include: [{ model: Tenant, as: 'tenant' }]
    });
  }

  async getOverduePayments(companyId) {
    return await Payment.findAll({
      where: {
        status: 'unpaid',
        due_date: { [Op.lt]: new Date() }
      },
      include: [
        { model: Tenant, as: 'tenant' },
        { 
          model: Property, 
          as: 'property',
          where: { company_id: companyId }
        }
      ],
      order: [['due_date', 'ASC']]
    });
  }

  async getUpcomingPayments(companyId, days = 7) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await Payment.findAll({
      where: {
        status: 'unpaid',
        due_date: {
          [Op.between]: [new Date(), futureDate]
        }
      },
      include: [
        { model: Tenant, as: 'tenant' },
        { 
          model: Property, 
          as: 'property',
          where: { company_id: companyId }
        }
      ],
      order: [['due_date', 'ASC']]
    });
  }

  async recordPartialPayment(paymentId, amount, paymentMethod) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    const currentPaid = parseFloat(payment.paid_amount || 0);
    const newPaidAmount = currentPaid + parseFloat(amount);
    const totalAmount = parseFloat(payment.amount);

    // Create transaction record
    const transaction = await Transaction.create({
      payment_id: paymentId,
      amount: amount,
      type: 'partial_payment',
      method: paymentMethod,
      status: 'completed',
      processed_at: new Date()
    });

    // Update payment
    const newStatus = newPaidAmount >= totalAmount ? 'paid' : 'partial';
    
    await payment.update({
      status: newStatus,
      paid_amount: newPaidAmount,
      payment_method: paymentMethod,
      ...(newStatus === 'paid' && { paid_at: new Date() })
    });

    return {
      payment,
      transaction,
      remainingBalance: Math.max(0, totalAmount - newPaidAmount)
    };
  }

  async refundPayment(paymentId, amount, reason) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'paid') {
      throw new Error('Can only refund paid payments');
    }

    // Create refund transaction
    const transaction = await Transaction.create({
      payment_id: paymentId,
      amount: -Math.abs(amount), // Negative amount for refund
      type: 'refund',
      status: 'completed',
      notes: reason,
      processed_at: new Date()
    });

    // Update payment if fully refunded
    const paidAmount = parseFloat(payment.paid_amount);
    if (Math.abs(amount) >= paidAmount) {
      await payment.update({
        status: 'refunded',
        refunded_amount: Math.abs(amount),
        refunded_at: new Date()
      });
    } else {
      await payment.update({
        status: 'partial_refund',
        refunded_amount: Math.abs(amount)
      });
    }

    return { payment, transaction };
  }

  async getPaymentStatistics(companyId, dateRange = {}) {
    const { startDate, endDate } = dateRange;
    
    const whereClause = {};
    if (startDate && endDate) {
      whereClause.created_at = { [Op.between]: [startDate, endDate] };
    }

    const payments = await Payment.findAll({
      where: whereClause,
      include: [{
        model: Property,
        as: 'property',
        where: { company_id: companyId }
      }]
    });

    const stats = {
      totalPayments: payments.length,
      totalAmount: 0,
      paidAmount: 0,
      unpaidAmount: 0,
      overdueAmount: 0,
      paidCount: 0,
      unpaidCount: 0,
      overdueCount: 0
    };

    const now = new Date();

    payments.forEach(payment => {
      const amount = parseFloat(payment.amount);
      stats.totalAmount += amount;

      if (payment.status === 'paid') {
        stats.paidAmount += amount;
        stats.paidCount++;
      } else {
        stats.unpaidAmount += amount;
        stats.unpaidCount++;
        
        if (new Date(payment.due_date) < now) {
          stats.overdueAmount += amount;
          stats.overdueCount++;
        }
      }
    });

    return stats;
  }

  async scheduleRecurringPayment(recurringData) {
    const { tenantId, propertyId, leaseId, amount, frequency, startDate, endDate } = recurringData;
    
    // This would integrate with a job scheduler to create recurring payments
    // For now, return the configuration
    return {
      tenantId,
      propertyId,
      leaseId,
      amount,
      frequency, // 'monthly', 'weekly', etc.
      startDate,
      endDate,
      nextPaymentDate: this.calculateNextPaymentDate(startDate, frequency)
    };
  }

  calculateNextPaymentDate(startDate, frequency) {
    const date = new Date(startDate);
    
    switch (frequency) {
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        date.setMonth(date.getMonth() + 1); // Default to monthly
    }
    
    return date;
  }
}

module.exports = new PaymentService();