const { 
  Property, Tenant, Lease, Payment, MaintenanceRequest, 
  WorkOrder, Task, User, Company, Portfolio 
} = require('../../models');
const { Op } = require('sequelize');

const analyticsController = {
  // Get dashboard overview statistics
  getDashboardOverview: async (req, res) => {
    try {
      const { companyId, portfolioId, timeframe = '30d' } = req.query;
      
      const companyFilter = companyId || req.user.companyId;
      
      // Calculate date range
      const now = new Date();
      let startDate;
      
      switch (timeframe) {
        case '7d':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case '30d':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case '90d':
          startDate = new Date(now.setDate(now.getDate() - 90));
          break;
        case '1y':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = new Date(now.setDate(now.getDate() - 30));
      }
      
      const where = { companyId: companyFilter };
      if (portfolioId) where.portfolioId = portfolioId;
      
      const whereDate = {
        ...where,
        createdAt: { [Op.gte]: startDate }
      };
      
      // Parallel execution of all statistics
      const [
        totalProperties,
        occupiedUnits,
        totalTenants,
        totalRevenue,
        pendingPayments,
        maintenanceRequests,
        openWorkOrders,
        activeTasks
      ] = await Promise.all([
        // Total Properties
        Property.count({ where }),
        
        // Occupied Units (from active leases)
        Lease.count({
          where: {
            ...where,
            status: 'active',
            endDate: { [Op.gte]: new Date() }
          },
          distinct: true,
          col: 'unitId'
        }),
        
        // Total Tenants
        Tenant.count({ 
          where: { 
            ...where,
            status: 'active'
          } 
        }),
        
        // Total Revenue (last 30 days)
        Payment.sum('paidAmount', {
          where: {
            ...whereDate,
            status: 'paid'
          }
        }),
        
        // Pending Payments
        Payment.sum('amount', {
          where: {
            ...where,
            status: 'pending',
            dueDate: { [Op.lte]: new Date() }
          }
        }),
        
        // Maintenance Requests (last 30 days)
        MaintenanceRequest.count({
          where: whereDate
        }),
        
        // Open Work Orders
        WorkOrder.count({
          where: {
            ...where,
            status: { [Op.in]: ['assigned', 'in_progress'] }
          }
        }),
        
        // Active Tasks
        Task.count({
          where: {
            ...where,
            status: { [Op.in]: ['assigned', 'in_progress'] }
          }
        })
      ]);
      
      // Calculate occupancy rate
      const totalUnits = await Property.sum('totalUnits', { where });
      const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
      
      // Calculate collection rate
      const totalBilled = await Payment.sum('amount', {
        where: {
          ...whereDate,
          type: 'rent'
        }
      });
      const collectionRate = totalBilled > 0 ? (totalRevenue / totalBilled) * 100 : 0;
      
      // Recent activity
      const recentActivity = await getRecentActivity(companyFilter, portfolioId);
      
      // Performance metrics
      const performanceMetrics = await getPerformanceMetrics(companyFilter, portfolioId, timeframe);
      
      // Financial overview
      const financialOverview = await getFinancialOverview(companyFilter, portfolioId, timeframe);
      
      res.json({
        success: true,
        data: {
          overview: {
            totalProperties,
            totalUnits,
            occupiedUnits,
            occupancyRate: parseFloat(occupancyRate.toFixed(2)),
            totalTenants,
            totalRevenue: parseFloat(totalRevenue || 0),
            pendingPayments: parseFloat(pendingPayments || 0),
            maintenanceRequests,
            openWorkOrders,
            activeTasks,
            collectionRate: parseFloat(collectionRate.toFixed(2))
          },
          recentActivity,
          performanceMetrics,
          financialOverview
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get financial analytics
  getFinancialAnalytics: async (req, res) => {
    try {
      const { companyId, portfolioId, startDate, endDate, groupBy = 'month' } = req.query;
      
      const companyFilter = companyId || req.user.companyId;
      const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 12));
      const end = endDate ? new Date(endDate) : new Date();
      
      const where = {
        companyId: companyFilter,
        paidDate: { [Op.between]: [start, end] },
        status: 'paid'
      };
      
      if (portfolioId) where.portfolioId = portfolioId;
      
      // Revenue by type
      const revenueByType = await Payment.findAll({
        where,
        attributes: [
          'type',
          [sequelize.fn('SUM', sequelize.col('paidAmount')), 'total']
        ],
        group: ['type'],
        order: [[sequelize.fn('SUM', sequelize.col('paidAmount')), 'DESC']]
      });
      
      // Revenue trend
      let revenueTrend;
      if (groupBy === 'day') {
        revenueTrend = await Payment.findAll({
          where,
          attributes: [
            [sequelize.fn('DATE', sequelize.col('paidDate')), 'date'],
            [sequelize.fn('SUM', sequelize.col('paidAmount')), 'total']
          ],
          group: [sequelize.fn('DATE', sequelize.col('paidDate'))],
          order: [[sequelize.fn('DATE', sequelize.col('paidDate')), 'ASC']]
        });
      } else if (groupBy === 'week') {
        revenueTrend = await Payment.findAll({
          where,
          attributes: [
            [sequelize.fn('YEARWEEK', sequelize.col('paidDate')), 'week'],
            [sequelize.fn('SUM', sequelize.col('paidAmount')), 'total']
          ],
          group: [sequelize.fn('YEARWEEK', sequelize.col('paidDate'))],
          order: [[sequelize.fn('YEARWEEK', sequelize.col('paidDate')), 'ASC']]
        });
      } else {
        revenueTrend = await Payment.findAll({
          where,
          attributes: [
            [sequelize.fn('DATE_FORMAT', sequelize.col('paidDate'), '%Y-%m'), 'month'],
            [sequelize.fn('SUM', sequelize.col('paidAmount')), 'total']
          ],
          group: [sequelize.fn('DATE_FORMAT', sequelize.col('paidDate'), '%Y-%m')],
          order: [[sequelize.fn('DATE_FORMAT', sequelize.col('paidDate'), '%Y-%m'), 'ASC']]
        });
      }
      
      // Top properties by revenue
      const topProperties = await Payment.findAll({
        where,
        attributes: [
          'propertyId',
          [sequelize.fn('SUM', sequelize.col('paidAmount')), 'total'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'transactions']
        ],
        group: ['propertyId'],
        include: [{
          model: Property,
          attributes: ['name']
        }],
        order: [[sequelize.fn('SUM', sequelize.col('paidAmount')), 'DESC']],
        limit: 10
      });
      
      // Outstanding balances
      const outstandingBalances = await Tenant.findAll({
        where: {
          companyId: companyFilter,
          balance: { [Op.gt]: 0 }
        },
        attributes: ['id', 'firstName', 'lastName', 'balance', 'propertyId'],
        include: [{
          model: Property,
          attributes: ['name']
        }],
        order: [['balance', 'DESC']],
        limit: 10
      });
      
      // Expense analysis (from maintenance/work orders)
      const expenseAnalysis = await WorkOrder.findOne({
        where: {
          companyId: companyFilter,
          status: 'completed',
          completedAt: { [Op.between]: [start, end] }
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('actualCost')), 'totalExpenses'],
          [sequelize.fn('AVG', sequelize.col('actualCost')), 'averageCost']
        ]
      });
      
      res.json({
        success: true,
        data: {
          period: {
            start,
            end
          },
          revenueByType: revenueByType.map(item => ({
            type: item.type,
            total: parseFloat(item.dataValues.total || 0)
          })),
          revenueTrend: revenueTrend.map(item => ({
            period: item.dataValues[groupBy === 'day' ? 'date' : groupBy === 'week' ? 'week' : 'month'],
            total: parseFloat(item.dataValues.total || 0)
          })),
          topProperties: topProperties.map(item => ({
            propertyId: item.propertyId,
            propertyName: item.Property?.name || 'Unknown',
            total: parseFloat(item.dataValues.total || 0),
            transactions: parseInt(item.dataValues.transactions || 0)
          })),
          outstandingBalances: outstandingBalances.map(item => ({
            tenantId: item.id,
            tenantName: `${item.firstName} ${item.lastName}`,
            propertyName: item.Property?.name || 'Unknown',
            balance: parseFloat(item.balance || 0)
          })),
          expenseAnalysis: {
            totalExpenses: parseFloat(expenseAnalysis?.dataValues.totalExpenses || 0),
            averageCost: parseFloat(expenseAnalysis?.dataValues.averageCost || 0)
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get occupancy analytics
  getOccupancyAnalytics: async (req, res) => {
    try {
      const { companyId, portfolioId } = req.query;
      
      const companyFilter = companyId || req.user.companyId;
      const where = { companyId: companyFilter };
      if (portfolioId) where.portfolioId = portfolioId;
      
      // Overall occupancy
      const totalProperties = await Property.count({ where });
      const totalUnits = await Property.sum('totalUnits', { where });
      
      const occupiedUnits = await Lease.count({
        where: {
          ...where,
          status: 'active',
          endDate: { [Op.gte]: new Date() }
        },
        distinct: true,
        col: 'unitId'
      });
      
      const vacantUnits = totalUnits - occupiedUnits;
      const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
      
      // Occupancy by property type
      const occupancyByType = await Property.findAll({
        where,
        attributes: [
          'propertyType',
          [sequelize.fn('SUM', sequelize.col('totalUnits')), 'totalUnits'],
          [sequelize.literal(`(
            SELECT COUNT(DISTINCT unitId)
            FROM leases l
            JOIN units u ON l.unitId = u.id
            WHERE u.propertyId = Property.id
            AND l.status = 'active'
            AND l.endDate >= CURDATE()
          )`), 'occupiedUnits']
        ],
        group: ['propertyType']
      });
      
      // Vacancy duration analysis
      const vacancyAnalysis = await getVacancyAnalysis(companyFilter, portfolioId);
      
      // Lease expiration forecast
      const leaseExpirations = await Lease.findAll({
        where: {
          ...where,
          status: 'active',
          endDate: { 
            [Op.between]: [new Date(), new Date(new Date().setMonth(new Date().getMonth() + 3))]
          }
        },
        include: [
          {
            model: Tenant,
            attributes: ['firstName', 'lastName']
          },
          {
            model: Property,
            attributes: ['name']
          },
          {
            model: Unit,
            attributes: ['unitNumber']
          }
        ],
        order: [['endDate', 'ASC']],
        limit: 20
      });
      
      // Turnover rate
      const turnoverRate = await calculateTurnoverRate(companyFilter, portfolioId);
      
      // Occupancy trend
      const occupancyTrend = await getOccupancyTrend(companyFilter, portfolioId);
      
      res.json({
        success: true,
        data: {
          overview: {
            totalProperties,
            totalUnits,
            occupiedUnits,
            vacantUnits,
            occupancyRate: parseFloat(occupancyRate.toFixed(2))
          },
          occupancyByType: occupancyByType.map(item => ({
            propertyType: item.propertyType,
            totalUnits: parseInt(item.dataValues.totalUnits || 0),
            occupiedUnits: parseInt(item.dataValues.occupiedUnits || 0),
            vacancyRate: parseFloat(((item.dataValues.totalUnits - item.dataValues.occupiedUnits) / item.dataValues.totalUnits * 100).toFixed(2))
          })),
          vacancyAnalysis,
          leaseExpirations: leaseExpirations.map(lease => ({
            leaseId: lease.id,
            leaseNumber: lease.leaseNumber,
            tenantName: `${lease.Tenant?.firstName || ''} ${lease.Tenant?.lastName || ''}`,
            propertyName: lease.Property?.name || 'Unknown',
            unitNumber: lease.Unit?.unitNumber || 'N/A',
            endDate: lease.endDate,
            daysUntilExpiration: Math.ceil((new Date(lease.endDate) - new Date()) / (1000 * 60 * 60 * 24))
          })),
          turnoverRate: parseFloat(turnoverRate.toFixed(2)),
          occupancyTrend
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get maintenance analytics
  getMaintenanceAnalytics: async (req, res) => {
    try {
      const { companyId, portfolioId, startDate, endDate } = req.query;
      
      const companyFilter = companyId || req.user.companyId;
      const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 6));
      const end = endDate ? new Date(endDate) : new Date();
      
      const where = {
        companyId: companyFilter,
        createdAt: { [Op.between]: [start, end] }
      };
      
      if (portfolioId) where.portfolioId = portfolioId;
      
      // Maintenance requests overview
      const totalRequests = await MaintenanceRequest.count({ where });
      const completedRequests = await MaintenanceRequest.count({
        where: {
          ...where,
          status: 'completed'
        }
      });
      const emergencyRequests = await MaintenanceRequest.count({
        where: {
          ...where,
          priority: 'emergency'
        }
      });
      
      // Average response and completion times
      const responseTime = await calculateAverageResponseTime(companyFilter, portfolioId, start, end);
      const completionTime = await calculateAverageCompletionTime(companyFilter, portfolioId, start, end);
      
      // Maintenance by category
      const byCategory = await MaintenanceRequest.findAll({
        where,
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('AVG', sequelize.literal('TIMESTAMPDIFF(HOUR, createdAt, completedAt)')), 'avgHours']
        ],
        group: ['category'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 10
      });
      
      // Maintenance by priority
      const byPriority = await MaintenanceRequest.findAll({
        where,
        attributes: [
          'priority',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('AVG', sequelize.col('cost')), 'avgCost']
        ],
        group: ['priority']
      });
      
      // Cost analysis
      const costAnalysis = await MaintenanceRequest.findOne({
        where: {
          ...where,
          status: 'completed',
          cost: { [Op.gt]: 0 }
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('cost')), 'totalCost'],
          [sequelize.fn('AVG', sequelize.col('cost')), 'avgCost'],
          [sequelize.fn('MAX', sequelize.col('cost')), 'maxCost'],
          [sequelize.fn('MIN', sequelize.col('cost')), 'minCost']
        ]
      });
      
      // Top properties by maintenance requests
      const byProperty = await MaintenanceRequest.findAll({
        where,
        attributes: [
          'propertyId',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('cost')), 'totalCost']
        ],
        group: ['propertyId'],
        include: [{
          model: Property,
          attributes: ['name']
        }],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 10
      });
      
      // Recurring issues
      const recurringIssues = await findRecurringIssues(companyFilter, portfolioId, start, end);
      
      // Vendor performance
      const vendorPerformance = await getVendorPerformance(companyFilter, portfolioId, start, end);
      
      // Maintenance trend
      const maintenanceTrend = await getMaintenanceTrend(companyFilter, portfolioId, start, end);
      
      res.json({
        success: true,
        data: {
          period: { start, end },
          overview: {
            totalRequests,
            completedRequests,
            completionRate: totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0,
            emergencyRequests,
            emergencyRate: totalRequests > 0 ? (emergencyRequests / totalRequests) * 100 : 0
          },
          performance: {
            avgResponseTime: parseFloat(responseTime.toFixed(1)),
            avgCompletionTime: parseFloat(completionTime.toFixed(1))
          },
          byCategory: byCategory.map(item => ({
            category: item.category,
            count: parseInt(item.dataValues.count || 0),
            avgHours: parseFloat(item.dataValues.avgHours || 0)
          })),
          byPriority: byPriority.map(item => ({
            priority: item.priority,
            count: parseInt(item.dataValues.count || 0),
            avgCost: parseFloat(item.dataValues.avgCost || 0)
          })),
          costAnalysis: {
            totalCost: parseFloat(costAnalysis?.dataValues.totalCost || 0),
            averageCost: parseFloat(costAnalysis?.dataValues.avgCost || 0),
            maxCost: parseFloat(costAnalysis?.dataValues.maxCost || 0),
            minCost: parseFloat(costAnalysis?.dataValues.minCost || 0),
            costPerUnit: await calculateCostPerUnit(companyFilter, portfolioId, start, end)
          },
          byProperty: byProperty.map(item => ({
            propertyId: item.propertyId,
            propertyName: item.Property?.name || 'Unknown',
            requestCount: parseInt(item.dataValues.count || 0),
            totalCost: parseFloat(item.dataValues.totalCost || 0),
            avgCostPerRequest: parseInt(item.dataValues.count) > 0 ? 
              parseFloat(item.dataValues.totalCost) / parseInt(item.dataValues.count) : 0
          })),
          recurringIssues,
          vendorPerformance,
          maintenanceTrend
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get tenant analytics
  getTenantAnalytics: async (req, res) => {
    try {
      const { companyId, portfolioId } = req.query;
      
      const companyFilter = companyId || req.user.companyId;
      const where = { companyId: companyFilter };
      if (portfolioId) where.portfolioId = portfolioId;
      
      // Tenant demographics
      const totalTenants = await Tenant.count({ where });
      const activeTenants = await Tenant.count({
        where: { ...where, status: 'active' }
      });
      const newTenants = await Tenant.count({
        where: {
          ...where,
          createdAt: { [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 3)) }
        }
      });
      
      // Tenant status breakdown
      const byStatus = await Tenant.findAll({
        where,
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status']
      });
      
      // Average tenant duration
      const tenantDuration = await calculateAverageTenantDuration(companyFilter, portfolioId);
      
      // Tenant satisfaction (from maintenance requests)
      const satisfaction = await calculateTenantSatisfaction(companyFilter, portfolioId);
      
      // Payment behavior
      const paymentBehavior = await analyzePaymentBehavior(companyFilter, portfolioId);
      
      // Tenant turnover
      const turnover = await calculateTenantTurnover(companyFilter, portfolioId);
      
      // Tenant distribution by property
      const byProperty = await Tenant.findAll({
        where,
        attributes: [
          'propertyId',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['propertyId'],
        include: [{
          model: Property,
          attributes: ['name']
        }],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 10
      });
      
      // Lease renewal rate
      const renewalRate = await calculateLeaseRenewalRate(companyFilter, portfolioId);
      
      // Tenant acquisition cost
      const acquisitionCost = await calculateAcquisitionCost(companyFilter, portfolioId);
      
      res.json({
        success: true,
        data: {
          overview: {
            totalTenants,
            activeTenants,
            newTenantsLast3Months: newTenants,
            inactiveTenants: totalTenants - activeTenants
          },
          byStatus: byStatus.map(item => ({
            status: item.status,
            count: parseInt(item.dataValues.count || 0),
            percentage: parseFloat((item.dataValues.count / totalTenants * 100).toFixed(2))
          })),
          tenantDuration: {
            averageMonths: parseFloat(tenantDuration.toFixed(1)),
            distribution: await getTenantDurationDistribution(companyFilter, portfolioId)
          },
          satisfaction: {
            averageRating: parseFloat(satisfaction.averageRating.toFixed(2)),
            ratingCount: satisfaction.ratingCount,
            distribution: satisfaction.distribution
          },
          paymentBehavior: {
            onTimeRate: parseFloat(paymentBehavior.onTimeRate.toFixed(2)),
            averageDaysLate: parseFloat(paymentBehavior.averageDaysLate.toFixed(1)),
            collectionRate: parseFloat(paymentBehavior.collectionRate.toFixed(2))
          },
          turnover: {
            annualRate: parseFloat(turnover.annualRate.toFixed(2)),
            reasons: turnover.reasons,
            trend: turnover.trend
          },
          byProperty: byProperty.map(item => ({
            propertyId: item.propertyId,
            propertyName: item.Property?.name || 'Unknown',
            tenantCount: parseInt(item.dataValues.count || 0)
          })),
          renewalRate: parseFloat(renewalRate.toFixed(2)),
          acquisitionCost: parseFloat(acquisitionCost.toFixed(2))
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get performance metrics
  getPerformanceMetrics: async (req, res) => {
    try {
      const { companyId, portfolioId, timeframe = '30d' } = req.query;
      
      const companyFilter = companyId || req.user.companyId;
      
      // Calculate date range
      const now = new Date();
      let startDate;
      
      switch (timeframe) {
        case '7d':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case '30d':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case '90d':
          startDate = new Date(now.setDate(now.getDate() - 90));
          break;
        case '1y':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = new Date(now.setDate(now.getDate() - 30));
      }
      
      const where = { 
        companyId: companyFilter,
        createdAt: { [Op.gte]: startDate }
      };
      
      if (portfolioId) where.portfolioId = portfolioId;
      
      // Key Performance Indicators
      const kpis = await calculateKPIs(companyFilter, portfolioId, timeframe);
      
      // Team performance
      const teamPerformance = await getTeamPerformance(companyFilter, portfolioId, startDate);
      
      // Property performance
      const propertyPerformance = await getPropertyPerformance(companyFilter, portfolioId, timeframe);
      
      // Efficiency metrics
      const efficiencyMetrics = await getEfficiencyMetrics(companyFilter, portfolioId, timeframe);
      
      // Goal tracking
      const goalTracking = await getGoalTracking(companyFilter, portfolioId);
      
      // Benchmark comparisons
      const benchmarks = await getBenchmarks(companyFilter, portfolioId);
      
      res.json({
        success: true,
        data: {
          timeframe,
          kpis,
          teamPerformance,
          propertyPerformance,
          efficiencyMetrics,
          goalTracking,
          benchmarks
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get predictive analytics
  getPredictiveAnalytics: async (req, res) => {
    try {
      const { companyId, portfolioId, horizon = '3m' } = req.query;
      
      const companyFilter = companyId || req.user.companyId;
      
      // Revenue forecast
      const revenueForecast = await forecastRevenue(companyFilter, portfolioId, horizon);
      
      // Occupancy forecast
      const occupancyForecast = await forecastOccupancy(companyFilter, portfolioId, horizon);
      
      // Maintenance forecast
      const maintenanceForecast = await forecastMaintenance(companyFilter, portfolioId, horizon);
      
      // Risk assessment
      const riskAssessment = await assessRisk(companyFilter, portfolioId);
      
      // Growth opportunities
      const growthOpportunities = await identifyGrowthOpportunities(companyFilter, portfolioId);
      
      // Market trends impact
      const marketImpact = await analyzeMarketImpact(companyFilter, portfolioId);
      
      res.json({
        success: true,
        data: {
          horizon,
          revenueForecast,
          occupancyForecast,
          maintenanceForecast,
          riskAssessment,
          growthOpportunities,
          marketImpact
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Export analytics data
  exportAnalytics: async (req, res) => {
    try {
      const { type, format = 'csv', startDate, endDate } = req.query;
      
      const companyFilter = req.user.companyId;
      const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 12));
      const end = endDate ? new Date(endDate) : new Date();
      
      let data;
      let filename;
      
      switch (type) {
        case 'financial':
          data = await getFinancialExportData(companyFilter, start, end);
          filename = `financial-analytics-${new Date().toISOString().split('T')[0]}`;
          break;
        case 'occupancy':
          data = await getOccupancyExportData(companyFilter, start, end);
          filename = `occupancy-analytics-${new Date().toISOString().split('T')[0]}`;
          break;
        case 'maintenance':
          data = await getMaintenanceExportData(companyFilter, start, end);
          filename = `maintenance-analytics-${new Date().toISOString().split('T')[0]}`;
          break;
        case 'tenant':
          data = await getTenantExportData(companyFilter, start, end);
          filename = `tenant-analytics-${new Date().toISOString().split('T')[0]}`;
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid export type. Must be: financial, occupancy, maintenance, or tenant'
          });
      }
      
      if (format === 'csv') {
        // Convert to CSV
        const headers = Object.keys(data[0] || {});
        const csv = [
          headers.join(','),
          ...data.map(row => 
            headers.map(header => 
              `"${(row[header] || '').toString().replace(/"/g, '""')}"`
            ).join(',')
          )
        ].join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
        return res.send(csv);
      } else if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.json`);
        return res.json(data);
      } else {
        res.json({
          success: true,
          data
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get custom report
  getCustomReport: async (req, res) => {
    try {
      const { metrics, filters, groupBy, timeframe } = req.body;
      
      if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Metrics array is required'
        });
      }
      
      const companyFilter = req.user.companyId;
      
      // Apply filters
      const where = { companyId: companyFilter };
      
      if (filters) {
        if (filters.propertyId) where.propertyId = filters.propertyId;
        if (filters.portfolioId) where.portfolioId = filters.portfolioId;
        if (filters.startDate || filters.endDate) {
          where.createdAt = {};
          if (filters.startDate) where.createdAt[Op.gte] = new Date(filters.startDate);
          if (filters.endDate) where.createdAt[Op.lte] = new Date(filters.endDate);
        }
      }
      
      // Build query based on requested metrics
      const reportData = await buildCustomReport(metrics, where, groupBy, timeframe);
      
      res.json({
        success: true,
        data: {
          metrics,
          filters,
          groupBy,
          timeframe,
          reportData
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Helper functions
async function getRecentActivity(companyId, portfolioId) {
  const where = { companyId };
  if (portfolioId) where.portfolioId = portfolioId;
  
  const limit = 10;
  
  const recentActivities = [];
  
  // Recent payments
  const recentPayments = await Payment.findAll({
    where: {
      ...where,
      status: 'paid'
    },
    include: [
      {
        model: Tenant,
        attributes: ['firstName', 'lastName']
      },
      {
        model: Property,
        attributes: ['name']
      }
    ],
    order: [['paidDate', 'DESC']],
    limit
  });
  
  recentPayments.forEach(payment => {
    recentActivities.push({
      type: 'payment',
      id: payment.id,
      description: `Payment received from ${payment.Tenant?.firstName} ${payment.Tenant?.lastName}`,
      amount: payment.paidAmount,
      property: payment.Property?.name,
      timestamp: payment.paidDate,
      icon: '💰'
    });
  });
  
  // Recent maintenance requests
  const recentMaintenance = await MaintenanceRequest.findAll({
    where: {
      ...where,
      status: { [Op.in]: ['submitted', 'assigned', 'in_progress'] }
    },
    include: [
      {
        model: Property,
        attributes: ['name']
      },
      {
        model: Tenant,
        attributes: ['firstName', 'lastName']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit
  });
  
  recentMaintenance.forEach(request => {
    recentActivities.push({
      type: 'maintenance',
      id: request.id,
      description: `Maintenance request: ${request.title}`,
      priority: request.priority,
      property: request.Property?.name,
      tenant: request.Tenant ? `${request.Tenant.firstName} ${request.Tenant.lastName}` : null,
      timestamp: request.createdAt,
      icon: '🔧'
    });
  });
  
  // Recent tasks
  const recentTasks = await Task.findAll({
    where: {
      ...where,
      status: { [Op.in]: ['assigned', 'in_progress'] }
    },
    include: [
      {
        model: Property,
        attributes: ['name']
      },
      {
        model: User,
        as: 'AssignedTo',
        attributes: ['firstName', 'lastName']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit
  });
  
  recentTasks.forEach(task => {
    recentActivities.push({
      type: 'task',
      id: task.id,
      description: `Task assigned: ${task.title}`,
      assignedTo: task.AssignedTo ? `${task.AssignedTo.firstName} ${task.AssignedTo.lastName}` : null,
      property: task.Property?.name,
      timestamp: task.createdAt,
      icon: '✅'
    });
  });
  
  // Sort by timestamp and limit
  return recentActivities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);
}

async function getPerformanceMetrics(companyId, portfolioId, timeframe) {
  const where = { companyId };
  if (portfolioId) where.portfolioId = portfolioId;
  
  // Calculate date range
  const now = new Date();
  let startDate;
  
  switch (timeframe) {
    case '7d':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case '30d':
      startDate = new Date(now.setDate(now.getDate() - 30));
      break;
    case '90d':
      startDate = new Date(now.setDate(now.getDate() - 90));
      break;
    case '1y':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 30));
  }
  
  const whereDate = {
    ...where,
    createdAt: { [Op.gte]: startDate }
  };
  
  // Collection efficiency
  const totalBilled = await Payment.sum('amount', {
    where: {
      ...whereDate,
      type: 'rent'
    }
  });
  
  const totalCollected = await Payment.sum('paidAmount', {
    where: {
      ...whereDate,
      type: 'rent',
      status: 'paid'
    }
  });
  
  const collectionEfficiency = totalBilled > 0 ? (totalCollected / totalBilled) * 100 : 0;
  
  // Maintenance efficiency
  const totalMaintenance = await MaintenanceRequest.count({
    where: whereDate
  });
  
  const completedMaintenance = await MaintenanceRequest.count({
    where: {
      ...whereDate,
      status: 'completed'
    }
  });
  
  const maintenanceEfficiency = totalMaintenance > 0 ? (completedMaintenance / totalMaintenance) * 100 : 0;
  
  // Task completion rate
  const totalTasks = await Task.count({
    where: whereDate
  });
  
  const completedTasks = await Task.count({
    where: {
      ...whereDate,
      status: 'completed'
    }
  });
  
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Tenant retention rate
  const retentionRate = await calculateRetentionRate(companyId, portfolioId, timeframe);
  
  // Average response time
  const avgResponseTime = await calculateAverageResponseTime(companyId, portfolioId, startDate, new Date());
  
  return {
    collectionEfficiency: parseFloat(collectionEfficiency.toFixed(2)),
    maintenanceEfficiency: parseFloat(maintenanceEfficiency.toFixed(2)),
    taskCompletionRate: parseFloat(taskCompletionRate.toFixed(2)),
    retentionRate: parseFloat(retentionRate.toFixed(2)),
    avgResponseTime: parseFloat(avgResponseTime.toFixed(1))
  };
}

async function getFinancialOverview(companyId, portfolioId, timeframe) {
  const where = { companyId };
  if (portfolioId) where.portfolioId = portfolioId;
  
  // Calculate date range
  const now = new Date();
  let startDate;
  
  switch (timeframe) {
    case '7d':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case '30d':
      startDate = new Date(now.setDate(now.getDate() - 30));
      break;
    case '90d':
      startDate = new Date(now.setDate(now.getDate() - 90));
      break;
    case '1y':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 30));
  }
  
  const whereDate = {
    ...where,
    paidDate: { [Op.gte]: startDate },
    status: 'paid'
  };
  
  // Revenue by source
  const revenueByType = await Payment.findAll({
    where: whereDate,
    attributes: [
      'type',
      [sequelize.fn('SUM', sequelize.col('paidAmount')), 'total']
    ],
    group: ['type']
  });
  
  // Expenses
  const expenses = await WorkOrder.sum('actualCost', {
    where: {
      ...where,
      status: 'completed',
      completedAt: { [Op.gte]: startDate }
    }
  });
  
  // Net income
  const totalRevenue = revenueByType.reduce((sum, item) => sum + parseFloat(item.dataValues.total || 0), 0);
  const netIncome = totalRevenue - (expenses || 0);
  
  // Cash flow
  const cashFlow = await calculateCashFlow(companyId, portfolioId, startDate, new Date());
  
  return {
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    totalExpenses: parseFloat(expenses || 0),
    netIncome: parseFloat(netIncome.toFixed(2)),
    revenueByType: revenueByType.map(item => ({
      type: item.type,
      amount: parseFloat(item.dataValues.total || 0),
      percentage: parseFloat((item.dataValues.total / totalRevenue * 100).toFixed(2))
    })),
    cashFlow
  };
}

async function getVacancyAnalysis(companyId, portfolioId) {
  // Implement vacancy analysis logic
  return {
    averageVacancyDays: 45,
    longestVacancy: 120,
    shortestVacancy: 7,
    vacancyCost: 15000
  };
}

async function calculateTurnoverRate(companyId, portfolioId) {
  // Implement turnover rate calculation
  return 25.5; // percentage
}

async function getOccupancyTrend(companyId, portfolioId) {
  // Implement occupancy trend calculation
  return [];
}

async function calculateAverageResponseTime(companyId, portfolioId, startDate, endDate) {
  const where = {
    companyId,
    createdAt: { [Op.between]: [startDate, endDate] },
    assignedAt: { [Op.not]: null }
  };
  
  if (portfolioId) where.portfolioId = portfolioId;
  
  const result = await MaintenanceRequest.findOne({
    where,
    attributes: [
      [sequelize.fn('AVG', sequelize.literal('TIMESTAMPDIFF(HOUR, createdAt, assignedAt)')), 'avgHours']
    ]
  });
  
  return parseFloat(result?.dataValues.avgHours || 0);
}

async function calculateAverageCompletionTime(companyId, portfolioId, startDate, endDate) {
  const where = {
    companyId,
    createdAt: { [Op.between]: [startDate, endDate] },
    completedAt: { [Op.not]: null }
  };
  
  if (portfolioId) where.portfolioId = portfolioId;
  
  const result = await MaintenanceRequest.findOne({
    where,
    attributes: [
      [sequelize.fn('AVG', sequelize.literal('TIMESTAMPDIFF(HOUR, createdAt, completedAt)')), 'avgHours']
    ]
  });
  
  return parseFloat(result?.dataValues.avgHours || 0);
}

async function findRecurringIssues(companyId, portfolioId, startDate, endDate) {
  // Implement recurring issues detection
  return [];
}

async function getVendorPerformance(companyId, portfolioId, startDate, endDate) {
  // Implement vendor performance analysis
  return [];
}

async function getMaintenanceTrend(companyId, portfolioId, startDate, endDate) {
  // Implement maintenance trend analysis
  return [];
}

async function calculateCostPerUnit(companyId, portfolioId, startDate, endDate) {
  const where = {
    companyId,
    status: 'completed',
    completedAt: { [Op.between]: [startDate, endDate] }
  };
  
  if (portfolioId) where.portfolioId = portfolioId;
  
  const totalCost = await WorkOrder.sum('actualCost', { where });
  const totalUnits = await Property.sum('totalUnits', { 
    where: { companyId, ...(portfolioId && { portfolioId }) }
  });
  
  return totalUnits > 0 ? parseFloat((totalCost / totalUnits).toFixed(2)) : 0;
}

async function calculateAverageTenantDuration(companyId, portfolioId) {
  // Implement average tenant duration calculation
  return 24.5; // months
}

async function calculateTenantSatisfaction(companyId, portfolioId) {
  // Implement tenant satisfaction calculation
  return {
    averageRating: 4.2,
    ratingCount: 150,
    distribution: { 5: 60, 4: 70, 3: 15, 2: 3, 1: 2 }
  };
}

async function analyzePaymentBehavior(companyId, portfolioId) {
  // Implement payment behavior analysis
  return {
    onTimeRate: 85.5,
    averageDaysLate: 3.2,
    collectionRate: 97.8
  };
}

async function calculateTenantTurnover(companyId, portfolioId) {
  // Implement tenant turnover analysis
  return {
    annualRate: 35.2,
    reasons: { relocation: 40, purchase: 25, jobChange: 20, other: 15 },
    trend: 'decreasing'
  };
}

async function calculateLeaseRenewalRate(companyId, portfolioId) {
  // Implement lease renewal rate calculation
  return 65.8; // percentage
}

async function calculateAcquisitionCost(companyId, portfolioId) {
  // Implement acquisition cost calculation
  return 1250.50; // dollars
}

async function getTenantDurationDistribution(companyId, portfolioId) {
  // Implement tenant duration distribution
  return { '0-6': 15, '6-12': 25, '12-24': 35, '24-36': 15, '36+': 10 };
}

async function calculateKPIs(companyId, portfolioId, timeframe) {
  // Implement KPI calculations
  return {
    noi: 125000,
    capRate: 6.8,
    cashOnCash: 8.2,
    debtServiceCoverage: 1.5,
    grossRentMultiplier: 12.5
  };
}

async function getTeamPerformance(companyId, portfolioId, startDate) {
  // Implement team performance analysis
  return [];
}

async function getPropertyPerformance(companyId, portfolioId, timeframe) {
  // Implement property performance analysis
  return [];
}

async function getEfficiencyMetrics(companyId, portfolioId, timeframe) {
  // Implement efficiency metrics calculation
  return {
    operatingExpenseRatio: 35.2,
    maintenancePerUnit: 850,
    managementEfficiency: 88.5
  };
}

async function getGoalTracking(companyId, portfolioId) {
  // Implement goal tracking
  return {
    revenueTarget: 1000000,
    revenueActual: 850000,
    occupancyTarget: 95,
    occupancyActual: 92,
    maintenanceTarget: 50000,
    maintenanceActual: 45000
  };
}

async function getBenchmarks(companyId, portfolioId) {
  // Implement benchmark comparisons
  return {
    industryAverage: {
      occupancy: 94.2,
      collectionRate: 96.5,
      maintenancePerUnit: 920,
      tenantTurnover: 32.5
    },
    portfolioPerformance: {
      occupancy: 92.0,
      collectionRate: 97.8,
      maintenancePerUnit: 850,
      tenantTurnover: 35.2
    }
  };
}

async function forecastRevenue(companyId, portfolioId, horizon) {
  // Implement revenue forecasting
  return {
    forecast: 1250000,
    confidence: 85,
    factors: ['seasonality', 'market_trends', 'lease_expirations'],
    monthlyProjections: []
  };
}

async function forecastOccupancy(companyId, portfolioId, horizon) {
  // Implement occupancy forecasting
  return {
    forecast: 93.5,
    confidence: 90,
    factors: ['lease_expirations', 'market_demand', 'seasonality'],
    monthlyProjections: []
  };
}

async function forecastMaintenance(companyId, portfolioId, horizon) {
  // Implement maintenance forecasting
  return {
    forecast: 55000,
    confidence: 75,
    factors: ['property_age', 'historical_data', 'seasonal_trends'],
    monthlyProjections: []
  };
}

async function assessRisk(companyId, portfolioId) {
  // Implement risk assessment
  return {
    overallRisk: 'medium',
    financialRisk: 'low',
    operationalRisk: 'medium',
    marketRisk: 'high',
    recommendations: []
  };
}

async function identifyGrowthOpportunities(companyId, portfolioId) {
  // Implement growth opportunity identification
  return [];
}

async function analyzeMarketImpact(companyId, portfolioId) {
  // Implement market impact analysis
  return {
    rentGrowthPotential: 3.5,
    demandTrend: 'increasing',
    competitiveLandscape: 'moderate',
    recommendations: []
  };
}

async function getFinancialExportData(companyId, startDate, endDate) {
  // Implement financial data export
  return [];
}

async function getOccupancyExportData(companyId, startDate, endDate) {
  // Implement occupancy data export
  return [];
}

async function getMaintenanceExportData(companyId, startDate, endDate) {
  // Implement maintenance data export
  return [];
}

async function getTenantExportData(companyId, startDate, endDate) {
  // Implement tenant data export
  return [];
}

async function buildCustomReport(metrics, where, groupBy, timeframe) {
  // Implement custom report builder
  return {};
}

async function calculateRetentionRate(companyId, portfolioId, timeframe) {
  // Implement retention rate calculation
  return 75.5;
}

async function calculateCashFlow(companyId, portfolioId, startDate, endDate) {
  // Implement cash flow calculation
  return {
    operating: 85000,
    investing: -25000,
    financing: -15000,
    net: 45000
  };
}

module.exports = analyticsController;