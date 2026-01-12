const { MarketData, Property } = require('../../models');
const { Op } = require('sequelize');

class MarketDataService {
  async fetchMarketData(zipCode, propertyType) {
    const existing = await MarketData.findOne({
      where: {
        zip_code: zipCode,
        property_type: propertyType,
        created_at: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    });

    if (existing) return existing;

    // Mock market data - in production, integrate with real estate APIs
    const marketData = {
      zip_code: zipCode,
      property_type: propertyType,
      average_rent: Math.floor(Math.random() * 1000) + 1500,
      median_rent: Math.floor(Math.random() * 1000) + 1400,
      vacancy_rate: (Math.random() * 10).toFixed(2),
      price_trend: Math.random() > 0.5 ? 'up' : 'down',
      market_score: Math.floor(Math.random() * 40) + 60
    };

    return await MarketData.create(marketData);
  }

  async getComparableProperties(propertyId, radius = 5) {
    const property = await Property.findByPk(propertyId);
    if (!property) throw new Error('Property not found');

    return await Property.findAll({
      where: {
        city: property.city,
        state: property.state,
        type: property.type,
        id: { [Op.ne]: propertyId },
        status: 'active'
      },
      limit: 10,
      order: [['monthly_rent', 'ASC']]
    });
  }

  async analyzePricing(propertyId) {
    const property = await Property.findByPk(propertyId);
    const comparables = await this.getComparableProperties(propertyId);
    const marketData = await this.fetchMarketData(property.zip_code, property.type);

    if (comparables.length === 0) {
      return {
        recommendation: 'insufficient_data',
        message: 'Not enough comparable properties found'
      };
    }

    const avgRent = comparables.reduce((sum, p) => sum + parseFloat(p.monthly_rent), 0) / comparables.length;
    const currentRent = parseFloat(property.monthly_rent);
    const variance = ((currentRent - avgRent) / avgRent * 100).toFixed(1);

    let recommendation = 'optimal';
    if (variance > 10) recommendation = 'overpriced';
    else if (variance < -10) recommendation = 'underpriced';

    return {
      currentRent,
      marketAverage: Math.round(avgRent),
      variance: `${variance}%`,
      recommendation,
      marketData: marketData.dataValues
    };
  }
}

module.exports = new MarketDataService();
