const { Property, Unit, Tenant, Payment, MaintenanceRequest } = require('../../models');
const { Op } = require('sequelize');
const cache = require('../../utils/cache');

class AnalyticsService {
  async getDashboardMetrics(companyId) {
    const cacheKey = cache.generateKey('dashboard_metrics', companyId);
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const [properties, payments, maintenanceRequests] = await Promise.all([
      this.getPropertyMetrics(companyId),
      this.getFinancialMetrics(companyId),
      this.getMaintenanceMetrics(companyId)
    ]);

    const metrics = {
      properties,
      financial: payments,
      maintenance: maintenanceRequests,
      timestamp: new Date()
    };

    await cache.set(cacheKey, metrics, 300); // 5 minutes
    return metrics;
  }

  async getPropertyMetrics(companyId) {
    const properties = await Property.findAll({
      where: { company_id: companyId },
      include: [{ model: Unit, as: 'units' }]
    });

    const totalProperties = properties.length;
    const totalUnits = properties.reduce((sum, p) => sum + p.total_units, 0);
    const occupiedUnits = properties.reduce((sum, p) => sum + p.occupied_units, 0);
    
    return {
      totalProperties,
      totalUnits,
      occupiedUnits,
      vacantUnits: totalUnits - occupiedUnits,
      occupancyRate: totalUnits > 0 ? (occupiedUnits / totalUnits * 100) : 0
    };
  }

  async getFinancialMetrics(companyId) {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const payments = await Payment.findAll({
      where: {
        created_at: { [Op.gte]: thisMonth }
      },
      include: [{
        model: Property,
        as: 'property',
        where: { company_id: companyId }
      }]
    });

    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const paidAmount = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    return {
      monthlyRevenue: totalRevenue,
      collectedRevenue: paidAmount,
      outstandingRevenue: totalRevenue - paidAmount,
      paymentCount: payments.length
    };
  }

  async getMaintenanceMetrics(companyId) {
    const requests = await MaintenanceRequest.findAll({
      include: [{
        model: Property,
        as: 'property',
        where: { company_id: companyId }
      }]
    });

    const openRequests = requests.filter(r => ['pending', 'in_progress'].includes(r.status));
    const urgentRequests = requests.filter(r => r.priority === 'urgent');

    return {
      totalRequests: requests.length,
      openRequests: openRequests.length,
      urgentRequests: urgentRequests.length,
      completedRequests: requests.filter(r => r.status === 'completed').length
    };
  }

  async getTrendData(companyId, metric, period = '30d') {
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    switch (metric) {
      case 'revenue':
        return this.getRevenueTrend(companyId, startDate);
      case 'occupancy':
        return this.getOccupancyTrend(companyId, startDate);
      case 'maintenance':
        return this.getMaintenanceTrend(companyId, startDate);
      default:
        throw new Error('Invalid metric type');
    }
  }

  async getRevenueTrend(companyId, startDate) {
    const payments = await Payment.findAll({
      where: {
        created_at: { [Op.gte]: startDate },
        status: 'paid'
      },
      include: [{
        model: Property,
        as: 'property',
        where: { company_id: companyId }
      }],
      order: [['created_at', 'ASC']]
    });

    return this.groupByDate(payments, 'amount');
  }

  groupByDate(data, valueField) {
    const grouped = {};
    
    data.forEach(item => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = 0;
      }
      grouped[date] += parseFloat(item[valueField] || 0);
    });

    return Object.entries(grouped).map(([date, value]) => ({
      date,
      value
    }));
  }
}

module.exports = new AnalyticsService();