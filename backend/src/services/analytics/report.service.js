const { Property, Unit, Tenant, Payment, MaintenanceRequest, Company } = require('../../models');
const { Op } = require('sequelize');

class ReportService {
  async generatePropertyReport(companyId, dateRange = {}) {
    const { startDate, endDate } = dateRange;
    
    const properties = await Property.findAll({
      where: { 
        company_id: companyId,
        ...(startDate && endDate && {
          created_at: { [Op.between]: [startDate, endDate] }
        })
      },
      include: [{ model: Unit, as: 'units' }]
    });

    const totalProperties = properties.length;
    const totalUnits = properties.reduce((sum, p) => sum + p.units.length, 0);
    const occupiedUnits = properties.reduce((sum, p) => 
      sum + p.units.filter(u => u.status === 'occupied').length, 0);
    
    return {
      totalProperties,
      totalUnits,
      occupiedUnits,
      occupancyRate: totalUnits > 0 ? (occupiedUnits / totalUnits * 100).toFixed(2) : 0,
      properties: properties.map(p => ({
        id: p.id,
        name: p.name,
        address: p.address,
        totalUnits: p.units.length,
        occupiedUnits: p.units.filter(u => u.status === 'occupied').length
      }))
    };
  }

  async generateFinancialReport(companyId, dateRange = {}) {
    const { startDate, endDate } = dateRange;
    
    const payments = await Payment.findAll({
      where: {
        ...(startDate && endDate && {
          created_at: { [Op.between]: [startDate, endDate] }
        })
      },
      include: [{
        model: Property,
        as: 'property',
        where: { company_id: companyId }
      }]
    });

    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const paidPayments = payments.filter(p => p.status === 'paid');
    const unpaidPayments = payments.filter(p => p.status === 'unpaid');

    return {
      totalRevenue,
      totalPaid: paidPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0),
      totalUnpaid: unpaidPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0),
      paymentCount: payments.length,
      paidCount: paidPayments.length,
      unpaidCount: unpaidPayments.length
    };
  }

  async generateMaintenanceReport(companyId, dateRange = {}) {
    const { startDate, endDate } = dateRange;
    
    const requests = await MaintenanceRequest.findAll({
      where: {
        ...(startDate && endDate && {
          created_at: { [Op.between]: [startDate, endDate] }
        })
      },
      include: [{
        model: Property,
        as: 'property',
        where: { company_id: companyId }
      }]
    });

    const statusCounts = requests.reduce((acc, req) => {
      acc[req.status] = (acc[req.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalRequests: requests.length,
      statusBreakdown: statusCounts,
      avgResolutionTime: this.calculateAvgResolutionTime(requests)
    };
  }

  calculateAvgResolutionTime(requests) {
    const completed = requests.filter(r => r.status === 'completed' && r.completed_at);
    if (completed.length === 0) return 0;
    
    const totalTime = completed.reduce((sum, req) => {
      const created = new Date(req.created_at);
      const completed = new Date(req.completed_at);
      return sum + (completed - created);
    }, 0);
    
    return Math.round(totalTime / completed.length / (1000 * 60 * 60 * 24)); // days
  }
}

module.exports = new ReportService();