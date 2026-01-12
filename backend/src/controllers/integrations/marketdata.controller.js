const { MarketData, Property, User } = require('../../models');
const { Op } = require('sequelize');
const axios = require('axios');

const marketDataController = {
  // Get all market data
  getAllMarketData: async (req, res) => {
    try {
      const { 
        propertyId, 
        zipCode,
        city,
        state,
        type,
        source,
        fromDate,
        toDate,
        search,
        page = 1, 
        limit = 20 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = { companyId: req.user.companyId };
      if (propertyId) where.propertyId = propertyId;
      if (zipCode) where.zipCode = zipCode;
      if (city) where.city = city;
      if (state) where.state = state;
      if (type) where.type = type;
      if (source) where.source = source;
      
      if (fromDate || toDate) {
        where.collectedAt = {};
        if (fromDate) where.collectedAt[Op.gte] = new Date(fromDate);
        if (toDate) where.collectedAt[Op.lte] = new Date(toDate);
      }
      
      if (search) {
        where[Op.or] = [
          { zipCode: { [Op.like]: `%${search}%` } },
          { city: { [Op.like]: `%${search}%` } },
          { state: { [Op.like]: `%${search}%` } },
          { '$Property.name$': { [Op.like]: `%${search}%` } }
        ];
      }
      
      const marketData = await MarketData.findAndCountAll({
        where,
        include: [
          {
            model: Property,
            attributes: ['id', 'name', 'address']
          },
          {
            model: User,
            as: 'CollectedBy',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['collectedAt', 'DESC']]
      });
      
      res.json({
        success: true,
        data: marketData.rows,
        pagination: {
          total: marketData.count,
          page: parseInt(page),
          pages: Math.ceil(marketData.count / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get market data by ID
  getMarketDataById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const marketData = await MarketData.findByPk(id, {
        include: [
          {
            model: Property,
            attributes: ['id', 'name', 'address', 'propertyType', 'yearBuilt', 'squareFeet']
          },
          {
            model: User,
            as: 'CollectedBy',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });
      
      if (!marketData) {
        return res.status(404).json({ success: false, message: 'Market data not found' });
      }
      
      // Check if market data belongs to user's company
      if (marketData.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this market data'
        });
      }
      
      res.json({ success: true, data: marketData });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Collect market data for property
  collectMarketData: async (req, res) => {
    try {
      const { propertyId, zipCode, city, state, type, sources } = req.body;
      
      let property = null;
      if (propertyId) {
        property = await Property.findByPk(propertyId);
        if (!property) {
          return res.status(404).json({ success: false, message: 'Property not found' });
        }
      }
      
      // Determine location
      const targetZipCode = zipCode || property?.zipCode;
      const targetCity = city || property?.city;
      const targetState = state || property?.state;
      
      if (!targetZipCode && (!targetCity || !targetState)) {
        return res.status(400).json({
          success: false,
          message: 'Location information (zip code or city/state) is required'
        });
      }
      
      // Collect data from specified sources
      const collectedData = [];
      const errors = [];
      
      const sourcesToQuery = sources || ['zillow', 'rentometer', 'local_mls'];
      
      for (const source of sourcesToQuery) {
        try {
          let sourceData;
          switch (source) {
            case 'zillow':
              sourceData = await collectZillowData(targetZipCode, targetCity, targetState);
              break;
            case 'rentometer':
              sourceData = await collectRentometerData(targetZipCode, targetCity, targetState);
              break;
            case 'local_mls':
              sourceData = await collectMLSData(targetZipCode, targetCity, targetState);
              break;
            default:
              throw new Error(`Unknown data source: ${source}`);
          }
          
          if (sourceData) {
            collectedData.push({
              source,
              data: sourceData,
              collectedAt: new Date()
            });
          }
        } catch (error) {
          errors.push({
            source,
            error: error.message
          });
        }
      }
      
      if (collectedData.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Failed to collect data from any source',
          errors
        });
      }
      
      // Combine data from all sources
      const combinedData = combineMarketData(collectedData);
      
      // Create market data record
      const marketData = await MarketData.create({
        propertyId: propertyId || null,
        zipCode: targetZipCode,
        city: targetCity,
        state: targetState,
        type: type || 'rental_market',
        data: combinedData,
        sources: collectedData.map(d => d.source),
        collectedAt: new Date(),
        collectedById: req.user.id,
        companyId: req.user.companyId,
        portfolioId: property?.portfolioId || null
      });
      
      // Update property with market data insights if applicable
      if (property) {
        await updatePropertyWithMarketData(property, combinedData);
      }
      
      res.json({
        success: true,
        message: `Collected market data from ${collectedData.length} source(s)`,
        data: {
          marketData,
          sources: collectedData.length,
          errors: errors.length > 0 ? errors : undefined
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get market data for location
  getMarketDataForLocation: async (req, res) => {
    try {
      const { zipCode, city, state, radius, propertyType } = req.query;
      
      if (!zipCode && (!city || !state)) {
        return res.status(400).json({
          success: false,
          message: 'Location information (zip code or city/state) is required'
        });
      }
      
      // Build location query
      const locationQuery = {};
      if (zipCode) locationQuery.zipCode = zipCode;
      if (city) locationQuery.city = city;
      if (state) locationQuery.state = state;
      
      // Find existing market data
      const existingData = await MarketData.findAll({
        where: {
          ...locationQuery,
          companyId: req.user.companyId
        },
        order: [['collectedAt', 'DESC']],
        limit: 10
      });
      
      // If no recent data exists, collect new data
      let marketData;
      if (existingData.length === 0) {
        // Collect new data
        const collectionResult = await collectMarketDataForLocation(zipCode, city, state);
        marketData = collectionResult.data;
      } else {
        // Use most recent data
        marketData = existingData[0];
      }
      
      // Get comparable properties in the area
      const comparables = await getComparableProperties(
        zipCode, city, state, radius, propertyType
      );
      
      res.json({
        success: true,
        data: {
          marketData,
          comparables,
          dataAge: marketData ? 
            Math.ceil((new Date() - new Date(marketData.collectedAt)) / (1000 * 60 * 60 * 24)) : 
            null
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get rental market analysis
  getRentalMarketAnalysis: async (req, res) => {
    try {
      const { zipCode, city, state, bedrooms, propertyType } = req.query;
      
      // Collect or retrieve market data
      let marketData;
      const existingData = await MarketData.findOne({
        where: {
          zipCode: zipCode || null,
          city: city || null,
          state: state || null,
          companyId: req.user.companyId,
          type: 'rental_market'
        },
        order: [['collectedAt', 'DESC']]
      });
      
      if (!existingData || isDataStale(existingData.collectedAt)) {
        // Collect new data
        const collectionResult = await collectMarketDataForLocation(zipCode, city, state);
        marketData = collectionResult.data;
      } else {
        marketData = existingData;
      }
      
      // Analyze rental market
      const analysis = analyzeRentalMarket(marketData.data, bedrooms, propertyType);
      
      // Get trends
      const trends = await getMarketTrends(zipCode, city, state);
      
      // Get recommendations
      const recommendations = generateRentalRecommendations(analysis, trends);
      
      res.json({
        success: true,
        data: {
          location: {
            zipCode: zipCode || marketData.zipCode,
            city: city || marketData.city,
            state: state || marketData.state
          },
          analysis,
          trends,
          recommendations,
          dataSources: marketData.sources,
          collectedAt: marketData.collectedAt
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get property valuation
  getPropertyValuation: async (req, res) => {
    try {
      const { propertyId, zipCode, city, state, bedrooms, bathrooms, squareFeet, yearBuilt } = req.body;
      
      let property = null;
      if (propertyId) {
        property = await Property.findByPk(propertyId);
        if (!property) {
          return res.status(404).json({ success: false, message: 'Property not found' });
        }
      }
      
      // Use property data or provided parameters
      const targetZipCode = zipCode || property?.zipCode;
      const targetCity = city || property?.city;
      const targetState = state || property?.state;
      const targetBedrooms = bedrooms || property?.bedrooms;
      const targetBathrooms = bathrooms || property?.bathrooms;
      const targetSquareFeet = squareFeet || property?.squareFeet;
      const targetYearBuilt = yearBuilt || property?.yearBuilt;
      
      if (!targetZipCode && (!targetCity || !targetState)) {
        return res.status(400).json({
          success: false,
          message: 'Location information is required'
        });
      }
      
      if (!targetBedrooms || !targetBathrooms || !targetSquareFeet) {
        return res.status(400).json({
          success: false,
          message: 'Property details (bedrooms, bathrooms, square feet) are required for accurate valuation'
        });
      }
      
      // Get market data for location
      const marketData = await MarketData.findOne({
        where: {
          zipCode: targetZipCode || null,
          city: targetCity || null,
          state: targetState || null,
          companyId: req.user.companyId,
          type: 'rental_market'
        },
        order: [['collectedAt', 'DESC']]
      });
      
      if (!marketData) {
        return res.status(404).json({
          success: false,
          message: 'No market data available for this location'
        });
      }
      
      // Calculate valuation
      const valuation = calculatePropertyValuation(
        marketData.data,
        targetBedrooms,
        targetBathrooms,
        targetSquareFeet,
        targetYearBuilt
      );
      
      // Get comparable sales/rentals
      const comparables = await getComparableProperties(
        targetZipCode, targetCity, targetState, '1', 'similar'
      );
      
      res.json({
        success: true,
        data: {
          property: propertyId ? {
            id: property.id,
            name: property.name
          } : null,
          location: {
            zipCode: targetZipCode,
            city: targetCity,
            state: targetState
          },
          propertyDetails: {
            bedrooms: targetBedrooms,
            bathrooms: targetBathrooms,
            squareFeet: targetSquareFeet,
            yearBuilt: targetYearBuilt
          },
          valuation,
          comparables: comparables.slice(0, 5),
          confidence: calculateConfidenceScore(marketData, comparables.length),
          dataSources: marketData.sources,
          lastUpdated: marketData.collectedAt
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get market trends
  getMarketTrends: async (req, res) => {
    try {
      const { zipCode, city, state, timeframe } = req.query;
      
      const timeframes = {
        '3m': 3,
        '6m': 6,
        '1y': 12,
        '2y': 24,
        '5y': 60
      };
      
      const months = timeframes[timeframe] || 12;
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - months);
      
      const where = {
        companyId: req.user.companyId,
        collectedAt: { [Op.gte]: cutoffDate }
      };
      
      if (zipCode) where.zipCode = zipCode;
      if (city) where.city = city;
      if (state) where.state = state;
      
      const historicalData = await MarketData.findAll({
        where,
        order: [['collectedAt', 'ASC']]
      });
      
      if (historicalData.length === 0) {
        return res.json({
          success: true,
          message: 'No historical data available for the specified timeframe',
          data: []
        });
      }
      
      // Analyze trends
      const trends = analyzeMarketTrends(historicalData);
      
      // Get forecast
      const forecast = forecastMarketTrends(trends, 6); // 6 month forecast
      
      res.json({
        success: true,
        data: {
          location: {
            zipCode: zipCode || 'Multiple',
            city: city || 'Multiple',
            state: state || 'Multiple'
          },
          timeframe: `${months} months`,
          dataPoints: historicalData.length,
          trends,
          forecast,
          historicalData: historicalData.map(d => ({
            date: d.collectedAt,
            averageRent: d.data?.averageRent,
            vacancyRate: d.data?.vacancyRate,
            daysOnMarket: d.data?.daysOnMarket
          }))
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update property rents based on market data
  updatePropertyRents: async (req, res) => {
    try {
      const { propertyIds, adjustmentType, adjustmentValue, applyToAll } = req.body;
      
      let properties = [];
      
      if (applyToAll) {
        // Get all properties for the company
        properties = await Property.findAll({
          where: { companyId: req.user.companyId }
        });
      } else if (propertyIds && Array.isArray(propertyIds)) {
        properties = await Property.findAll({
          where: {
            id: { [Op.in]: propertyIds },
            companyId: req.user.companyId
          }
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Property IDs or applyToAll flag is required'
        });
      }
      
      if (properties.length === 0) {
        return res.json({
          success: true,
          message: 'No properties found to update'
        });
      }
      
      const results = {
        updated: [],
        failed: []
      };
      
      for (const property of properties) {
        try {
          // Get market data for property location
          const marketData = await MarketData.findOne({
            where: {
              zipCode: property.zipCode || null,
              city: property.city || null,
              state: property.state || null,
              companyId: req.user.companyId,
              type: 'rental_market'
            },
            order: [['collectedAt', 'DESC']]
          });
          
          if (!marketData) {
            results.failed.push({
              propertyId: property.id,
              propertyName: property.name,
              error: 'No market data available for location'
            });
            continue;
          }
          
          // Calculate new rent based on market data and adjustment
          let newRent;
          const marketRent = marketData.data?.averageRent || 0;
          
          if (adjustmentType === 'percentage') {
            const adjustment = parseFloat(adjustmentValue) || 0;
            newRent = marketRent * (1 + adjustment / 100);
          } else if (adjustmentType === 'fixed') {
            const adjustment = parseFloat(adjustmentValue) || 0;
            newRent = marketRent + adjustment;
          } else {
            // Use market rent directly
            newRent = marketRent;
          }
          
          // Round to nearest 25
          newRent = Math.round(newRent / 25) * 25;
          
          // Update property rent
          await property.update({
            marketRent: newRent,
            lastRentReview: new Date(),
            rentReviewNotes: `Updated based on market data: $${marketRent} average rent`
          });
          
          results.updated.push({
            propertyId: property.id,
            propertyName: property.name,
            oldRent: property.marketRent,
            newRent,
            marketAverage: marketRent,
            adjustment: adjustmentType === 'percentage' ? 
              `${adjustmentValue}%` : 
              adjustmentType === 'fixed' ? 
              `$${adjustmentValue}` : 
              'Market rate'
          });
          
        } catch (error) {
          results.failed.push({
            propertyId: property.id,
            propertyName: property.name,
            error: error.message
          });
        }
      }
      
      res.json({
        success: true,
        message: `Updated rents for ${results.updated.length} properties, ${results.failed.length} failed`,
        data: results
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get market data statistics
  getMarketDataStatistics: async (req, res) => {
    try {
      const where = { companyId: req.user.companyId };
      
      // Total market data records
      const totalRecords = await MarketData.count({ where });
      
      // By type
      const byType = await MarketData.findAll({
        attributes: [
          'type',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: ['type']
      });
      
      // By source
      const bySource = await MarketData.findAll({
        attributes: [
          [sequelize.literal('json_extract(sources, "$[0]")'), 'source'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: [sequelize.literal('json_extract(sources, "$[0]")')]
      });
      
      // Recent collections
      const recentCollections = await MarketData.findAll({
        where,
        attributes: ['id', 'zipCode', 'city', 'state', 'collectedAt', 'type'],
        order: [['collectedAt', 'DESC']],
        limit: 10
      });
      
      // Data coverage by location
      const byLocation = await MarketData.findAll({
        attributes: [
          'state',
          'city',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: ['state', 'city'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 10
      });
      
      // Average data age
      const oldestData = await MarketData.findOne({
        where,
        attributes: ['collectedAt'],
        order: [['collectedAt', 'ASC']]
      });
      
      const averageAge = oldestData ? 
        Math.ceil((new Date() - new Date(oldestData.collectedAt)) / (1000 * 60 * 60 * 24)) : 
        0;
      
      res.json({
        success: true,
        data: {
          totalRecords,
          byType: byType.map(item => ({
            type: item.type,
            count: parseInt(item.dataValues.count)
          })),
          bySource: bySource.map(item => ({
            source: item.dataValues.source,
            count: parseInt(item.dataValues.count)
          })),
          recentCollections,
          byLocation: byLocation.map(item => ({
            state: item.state,
            city: item.city,
            count: parseInt(item.dataValues.count)
          })),
          averageDataAgeDays: averageAge,
          dataFreshness: averageAge < 30 ? 'Good' : averageAge < 90 ? 'Fair' : 'Needs Update'
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Helper functions
async function collectMarketDataForLocation(zipCode, city, state) {
  // Implement data collection from APIs
  return { success: true, data: {} };
}

function combineMarketData(collectedData) {
  // Combine data from multiple sources
  return {};
}

function updatePropertyWithMarketData(property, marketData) {
  // Update property with market insights
  return property;
}

function getComparableProperties(zipCode, city, state, radius, propertyType) {
  // Get comparable properties from database
  return [];
}

function isDataStale(collectedAt) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return new Date(collectedAt) < thirtyDaysAgo;
}

function analyzeRentalMarket(marketData, bedrooms, propertyType) {
  // Analyze rental market data
  return {};
}

function getMarketTrends(zipCode, city, state) {
  // Get market trends
  return {};
}

function generateRentalRecommendations(analysis, trends) {
  // Generate rental recommendations
  return [];
}

function calculatePropertyValuation(marketData, bedrooms, bathrooms, squareFeet, yearBuilt) {
  // Calculate property valuation
  return {};
}

function calculateConfidenceScore(marketData, comparableCount) {
  // Calculate confidence score
  return 'medium';
}

function analyzeMarketTrends(historicalData) {
  // Analyze market trends
  return {};
}

function forecastMarketTrends(trends, months) {
  // Forecast market trends
  return {};
}

// API integration functions
async function collectZillowData(zipCode, city, state) {
  try {
    // This would call Zillow API
    return {
      averageRent: 2000,
      medianHomeValue: 350000,
      rentToPriceRatio: 0.0057,
      daysOnMarket: 45,
      rentalYield: 0.068
    };
  } catch (error) {
    throw new Error(`Zillow API error: ${error.message}`);
  }
}

async function collectRentometerData(zipCode, city, state) {
  try {
    // This would call Rentometer API
    return {
      averageRent: 1950,
      rentRange: {
        low: 1600,
        high: 2300
      },
      fairMarketRent: 2000,
      rentPerSquareFoot: 1.5
    };
  } catch (error) {
    throw new Error(`Rentometer API error: ${error.message}`);
  }
}

async function collectMLSData(zipCode, city, state) {
  try {
    // This would call local MLS API
    return {
      activeListings: 25,
      medianDaysOnMarket: 30,
      soldProperties: 15,
      averageSalePrice: 325000,
      listToSaleRatio: 0.97
    };
  } catch (error) {
    throw new Error(`MLS API error: ${error.message}`);
  }
}

module.exports = marketDataController;