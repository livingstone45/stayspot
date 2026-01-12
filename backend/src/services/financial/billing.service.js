const { Payment, Lease, Tenant, Property } = require('../../models');
const { Op } = require('sequelize');

class BillingService {
  async generateMonthlyBills(companyId) {
    const activeLeases = await Lease.findAll({
      where: {
        status: 'active',
        start_date: { [Op.lte]: new Date() },
        end_date: { [Op.gte]: new Date() }
      },
      include: [
        { model: Tenant, as: 'tenant' },
        { model: Property, as: 'property', where: { company_id: companyId } }
      ]
    });

    const bills = [];
    const currentMonth = new Date();
    currentMonth.setDate(1); // First day of current month

    for (const lease of activeLeases) {
      // Check if bill already exists for this month
      const existingBill = await Payment.findOne({
        where: {
          lease_id: lease.id,
          type: 'rent',
          due_date: {
            [Op.gte]: currentMonth,
            [Op.lt]: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
          }
        }
      });

      if (!existingBill) {
        const dueDate = new Date(currentMonth);
        dueDate.setDate(lease.rent_due_day || 1);

        const bill = await Payment.create({
          lease_id: lease.id,
          tenant_id: lease.tenant_id,
          property_id: lease.property_id,
          amount: lease.monthly_rent,
          type: 'rent',
          status: 'unpaid',
          due_date: dueDate,
          description: `Monthly rent for ${lease.property.name}`
        });

        bills.push(bill);
      }
    }

    return bills;
  }

  async generateLateFees(companyId) {
    const overduePayments = await Payment.findAll({
      where: {
        status: 'unpaid',
        due_date: { [Op.lt]: new Date() }
      },
      include: [{
        model: Property,
        as: 'property',
        where: { company_id: companyId }
      }]
    });

    const lateFees = [];
    const gracePeriod = 5; // 5 days grace period

    for (const payment of overduePayments) {
      const daysPastDue = Math.floor((new Date() - new Date(payment.due_date)) / (1000 * 60 * 60 * 24));
      
      if (daysPastDue > gracePeriod) {
        // Check if late fee already exists
        const existingLateFee = await Payment.findOne({
          where: {
            lease_id: payment.lease_id,
            type: 'late_fee',
            related_payment_id: payment.id
          }
        });

        if (!existingLateFee) {
          const lateFeeAmount = Math.min(payment.amount * 0.05, 100); // 5% or $100 max

          const lateFee = await Payment.create({
            lease_id: payment.lease_id,
            tenant_id: payment.tenant_id,
            property_id: payment.property_id,
            amount: lateFeeAmount,
            type: 'late_fee',
            status: 'unpaid',
            due_date: new Date(),
            related_payment_id: payment.id,
            description: `Late fee for overdue rent payment`
          });

          lateFees.push(lateFee);
        }
      }
    }

    return lateFees;
  }

  async calculateTenantBalance(tenantId) {
    const payments = await Payment.findAll({
      where: { tenant_id: tenantId },
      order: [['due_date', 'ASC']]
    });

    let balance = 0;
    let unpaidAmount = 0;
    let paidAmount = 0;

    payments.forEach(payment => {
      if (payment.status === 'paid') {
        paidAmount += parseFloat(payment.amount);
      } else {
        unpaidAmount += parseFloat(payment.amount);
        balance += parseFloat(payment.amount);
      }
    });

    return {
      totalBalance: balance,
      unpaidAmount,
      paidAmount,
      paymentCount: payments.length,
      overduePayments: payments.filter(p => 
        p.status === 'unpaid' && new Date(p.due_date) < new Date()
      ).length
    };
  }

  async generateInvoice(paymentIds) {
    const payments = await Payment.findAll({
      where: { id: { [Op.in]: paymentIds } },
      include: [
        { model: Tenant, as: 'tenant' },
        { model: Property, as: 'property' },
        { model: Lease, as: 'lease' }
      ]
    });

    if (payments.length === 0) {
      throw new Error('No payments found');
    }

    const tenant = payments[0].tenant;
    const property = payments[0].property;
    
    const invoiceData = {
      invoiceNumber: this.generateInvoiceNumber(),
      date: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      tenant: {
        name: `${tenant.first_name} ${tenant.last_name}`,
        email: tenant.email,
        phone: tenant.phone
      },
      property: {
        name: property.name,
        address: property.address
      },
      items: payments.map(payment => ({
        description: payment.description,
        amount: parseFloat(payment.amount),
        dueDate: payment.due_date
      })),
      total: payments.reduce((sum, p) => sum + parseFloat(p.amount), 0)
    };

    return invoiceData;
  }

  async processRecurringCharges(companyId) {
    // Process monthly rent
    const monthlyBills = await this.generateMonthlyBills(companyId);
    
    // Process late fees
    const lateFees = await this.generateLateFees(companyId);
    
    // Process other recurring charges (utilities, fees, etc.)
    const otherCharges = await this.processOtherRecurringCharges(companyId);

    return {
      monthlyBills: monthlyBills.length,
      lateFees: lateFees.length,
      otherCharges: otherCharges.length,
      totalGenerated: monthlyBills.length + lateFees.length + otherCharges.length
    };
  }

  async processOtherRecurringCharges(companyId) {
    // This would handle utilities, parking fees, pet fees, etc.
    // Implementation depends on specific business requirements
    return [];
  }

  generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    return `INV-${year}${month}-${random}`;
  }

  async getPaymentHistory(tenantId, options = {}) {
    const { limit = 50, offset = 0, startDate, endDate } = options;
    
    const where = { tenant_id: tenantId };
    if (startDate && endDate) {
      where.created_at = { [Op.between]: [startDate, endDate] };
    }

    return await Payment.findAndCountAll({
      where,
      limit,
      offset,
      order: [['due_date', 'DESC']],
      include: [{ model: Property, as: 'property' }]
    });
  }
}

module.exports = new BillingService();