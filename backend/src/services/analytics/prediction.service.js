const { Property, Payment, MaintenanceRequest } = require('../../models');
const { Op } = require('sequelize');

class PredictionService {
  async predictRevenue(companyId, months = 3) {
    const historicalData = await this.getHistoricalRevenue(companyId, 12);
    
    if (historicalData.length < 3) {
      return { prediction: 0, confidence: 0 };
    }

    const trend = this.calculateTrend(historicalData);
    const seasonality = this.calculateSeasonality(historicalData);
    
    const predictions = [];
    const lastValue = historicalData[historicalData.length - 1].value;
    
    for (let i = 1; i <= months; i++) {
      const trendValue = lastValue + (trend * i);
      const seasonalAdjustment = seasonality[i % 12] || 1;
      predictions.push(trendValue * seasonalAdjustment);
    }

    return {
      predictions,
      confidence: this.calculateConfidence(historicalData),
      trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable'
    };
  }

  async predictOccupancy(companyId, months = 3) {
    const properties = await Property.findAll({
      where: { company_id: companyId }
    });

    const currentOccupancy = properties.reduce((sum, p) => sum + p.occupied_units, 0) /
                            properties.reduce((sum, p) => sum + p.total_units, 0);

    // Simple prediction based on historical trends
    const predictions = Array(months).fill(currentOccupancy * 100);
    
    return {
      predictions,
      currentOccupancy: currentOccupancy * 100,
      confidence: 0.7
    };
  }

  async predictMaintenance(companyId, months = 3) {
    const historicalData = await MaintenanceRequest.findAll({
      where: {
        created_at: {
          [Op.gte]: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        }
      },
      include: [{
        model: Property,
        as: 'property',
        where: { company_id: companyId }
      }]
    });

    const monthlyAverage = historicalData.length / 12;
    const predictions = Array(months).fill(Math.round(monthlyAverage));

    return {
      predictions,
      averagePerMonth: monthlyAverage,
      confidence: 0.6
    };
  }

  async getHistoricalRevenue(companyId, months) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const payments = await Payment.findAll({
      where: {
        created_at: { [Op.gte]: startDate },
        status: 'paid'
      },
      include: [{
        model: Property,
        as: 'property',
        where: { company_id: companyId }
      }]
    });

    const monthlyData = {};
    payments.forEach(payment => {
      const month = new Date(payment.created_at).toISOString().slice(0, 7);
      monthlyData[month] = (monthlyData[month] || 0) + parseFloat(payment.amount);
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, value]) => ({ month, value }));
  }

  calculateTrend(data) {
    if (data.length < 2) return 0;
    
    const n = data.length;
    const sumX = data.reduce((sum, _, i) => sum + i, 0);
    const sumY = data.reduce((sum, item) => sum + item.value, 0);
    const sumXY = data.reduce((sum, item, i) => sum + (i * item.value), 0);
    const sumXX = data.reduce((sum, _, i) => sum + (i * i), 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  calculateSeasonality(data) {
    const seasonality = {};
    
    data.forEach((item, index) => {
      const month = index % 12;
      if (!seasonality[month]) seasonality[month] = [];
      seasonality[month].push(item.value);
    });

    const avgTotal = data.reduce((sum, item) => sum + item.value, 0) / data.length;
    
    Object.keys(seasonality).forEach(month => {
      const monthAvg = seasonality[month].reduce((sum, val) => sum + val, 0) / seasonality[month].length;
      seasonality[month] = monthAvg / avgTotal;
    });

    return seasonality;
  }

  calculateConfidence(data) {
    if (data.length < 3) return 0.3;
    
    const values = data.map(d => d.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const coefficient = Math.sqrt(variance) / mean;
    
    return Math.max(0.1, Math.min(0.9, 1 - coefficient));
  }
}

module.exports = new PredictionService();