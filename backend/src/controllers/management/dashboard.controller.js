const { Op } = require('sequelize');
const sequelize = require('sequelize');
const { 
  Property, 
  Unit, 
  Tenant, 
  Lease, 
  MaintenanceRequest, 
  Payment, 
  Task, 
  User, 
  Company, 
  Portfolio,
  Notification,
  AuditLog
} = require('../../models');
const { ROLES } = require('../../utils/constants/roles');

/**
 * Dashboard Controller
 * Handles dashboard data and analytics for different user roles
 */
class DashboardController {
  /**
   * Get System Admin Dashboard
   */
  async getSystemAdminDashboard(req, res) {
    try {
      const userRoles = req.user.roles;

      // Only system admin can access this dashboard
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to access system admin dashboard' });
      }

      // Get overall statistics
      const [
        totalCompanies,
        activeCompanies,
        totalUsers,
        activeUsers,
        totalProperties,
        occupiedProperties,
        totalPortfolios,
        totalPayments,
        recentActivities
      ] = await Promise.all([
        Company.count(),
        Company.count({ where: { status: 'active' } }),
        User.count(),
        User.count({ where: { isActive: true } }),
        Property.count(),
        Property.count({ where: { status: 'occupied' } }),
        Portfolio.count(),
        Payment.count({ where: { status: 'completed' } }),
        AuditLog.findAll({
          order: [['createdAt', 'DESC']],
          limit: 10,
          include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'avatar']
          }]
        })
      ]);

      // Get recent companies
      const recentCompanies = await Company.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        attributes: ['id', 'name', 'email', 'status', 'createdAt']
      });

      // Get revenue statistics (last 6 months)
      const revenueStats = await this.getRevenueStats(6);

      // Get user growth (last 12 months)
      const userGrowth = await this.getUserGrowthStats(12);

      // Get system health metrics
      const systemHealth = await this.getSystemHealthMetrics();

      // Get upcoming renewals (next 30 days)
      const upcomingRenewals = await this.getUpcomingRenewals(30);

      // Get platform usage statistics
      const platformUsage = await this.getPlatformUsageStats();

      res.json({
        success: true,
        data: {
          overview: {
            companies: {
              total: totalCompanies,
              active: activeCompanies,
              inactive: totalCompanies - activeCompanies
            },
            users: {
              total: totalUsers,
              active: activeUsers,
              inactive: totalUsers - activeUsers
            },
            properties: {
              total: totalProperties,
              occupied: occupiedProperties,
              vacant: totalProperties - occupiedProperties,
              occupancyRate: totalProperties > 0 ? ((occupiedProperties / totalProperties) * 100).toFixed(2) + '%' : '0%'
            },
            portfolios: {
              total: totalPortfolios
            },
            financial: {
              totalTransactions: totalPayments,
              totalRevenue: await Payment.sum('amount', { where: { status: 'completed' } }) || 0
            }
          },
          revenue: revenueStats,
          userGrowth,
          systemHealth,
          recent: {
            companies: recentCompanies,
            activities: recentActivities
          },
          upcoming: {
            renewals: upcomingRenewals
          },
          platform: platformUsage
        }
      });
    } catch (error) {
      console.error('Get system admin dashboard error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Company Admin Dashboard
   */
  async getCompanyAdminDashboard(req, res) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check if user is company admin
      if (!userRoles.includes(ROLES.COMPANY_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to access company admin dashboard' });
      }

      const user = await User.findByPk(userId);
      if (!user || !user.companyId) {
        return res.status(403).json({ error: 'User not associated with a company' });
      }

      const companyId = user.companyId;

      // Get company statistics
      const [
        company,
        totalUsers,
        activeUsers,
        totalPortfolios,
        activePortfolios,
        totalProperties,
        occupiedProperties,
        totalUnits,
        occupiedUnits,
        recentPayments,
        openMaintenance,
        recentActivities
      ] = await Promise.all([
        Company.findByPk(companyId, {
          attributes: ['id', 'name', 'logo', 'status', 'subscription']
        }),
        User.count({ where: { companyId } }),
        User.count({ where: { companyId, isActive: true } }),
        Portfolio.count({ where: { companyId } }),
        Portfolio.count({ where: { companyId, status: 'active' } }),
        Property.count({ where: { companyId } }),
        Property.count({ where: { companyId, status: 'occupied' } }),
        Unit.count({
          include: [{
            model: Property,
            where: { companyId }
          }]
        }),
        Unit.count({
          where: { status: 'occupied' },
          include: [{
            model: Property,
            where: { companyId }
          }]
        }),
        Payment.findAll({
          where: { status: 'completed' },
          include: [{
            model: Property,
            where: { companyId },
            attributes: ['id', 'name']
          }],
          order: [['createdAt', 'DESC']],
          limit: 10
        }),
        MaintenanceRequest.count({
          where: { status: { [Op.in]: ['open', 'in_progress'] } },
          include: [{
            model: Property,
            where: { companyId }
          }]
        }),
        AuditLog.findAll({
          where: { userId: { [Op.in]: await this.getCompanyUserIds(companyId) } },
          order: [['createdAt', 'DESC']],
          limit: 10,
          include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'avatar']
          }]
        })
      ]);

      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      // Get financial statistics
      const financialStats = await this.getCompanyFinancialStats(companyId);

      // Get portfolio performance
      const portfolioPerformance = await this.getPortfolioPerformance(companyId);

      // Get recent properties
      const recentProperties = await Property.findAll({
        where: { companyId },
        order: [['createdAt', 'DESC']],
        limit: 5,
        attributes: ['id', 'name', 'address', 'city', 'status', 'monthlyRent']
      });

      // Get upcoming tasks
      const upcomingTasks = await this.getUpcomingTasks(companyId);

      // Get notifications
      const notifications = await Notification.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: 10
      });

      res.json({
        success: true,
        data: {
          company: {
            id: company.id,
            name: company.name,
            logo: company.logo,
            status: company.status,
            subscription: company.subscription
          },
          overview: {
            users: {
              total: totalUsers,
              active: activeUsers,
              inactive: totalUsers - activeUsers
            },
            portfolios: {
              total: totalPortfolios,
              active: activePortfolios,
              archived: totalPortfolios - activePortfolios
            },
            properties: {
              total: totalProperties,
              occupied: occupiedProperties,
              vacant: totalProperties - occupiedProperties,
              occupancyRate: totalProperties > 0 ? ((occupiedProperties / totalProperties) * 100).toFixed(2) + '%' : '0%'
            },
            units: {
              total: totalUnits,
              occupied: occupiedUnits,
              vacant: totalUnits - occupiedUnits,
              occupancyRate: totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(2) + '%' : '0%'
            },
            maintenance: {
              openRequests: openMaintenance
            }
          },
          financial: financialStats,
          portfolios: portfolioPerformance,
          recent: {
            payments: recentPayments,
            properties: recentProperties,
            activities: recentActivities
          },
          upcoming: {
            tasks: upcomingTasks
          },
          notifications
        }
      });
    } catch (error) {
      console.error('Get company admin dashboard error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Portfolio Manager Dashboard
   */
  async getPortfolioManagerDashboard(req, res) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check if user is portfolio manager
      if (!userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        return res.status(403).json({ error: 'Not authorized to access portfolio manager dashboard' });
      }

      // Get user's managed portfolios
      const user = await User.findByPk(userId, {
        include: [{
          model: Portfolio,
          as: 'ManagedPortfolios',
          include: [{
            model: Property
          }]
        }]
      });

      if (!user || !user.ManagedPortfolios || user.ManagedPortfolios.length === 0) {
        return res.json({
          success: true,
          data: {
            message: 'No portfolios assigned',
            overview: {},
            portfolios: [],
            recent: {},
            upcoming: {},
            notifications: []
          }
        });
      }

      const portfolioIds = user.ManagedPortfolios.map(p => p.id);
      const propertyIds = user.ManagedPortfolios.flatMap(p => 
        p.Properties.map(prop => prop.id)
      );

      // Get portfolio statistics
      const [
        totalPortfolios,
        totalProperties,
        occupiedProperties,
        totalUnits,
        occupiedUnits,
        recentPayments,
        openMaintenance,
        recentActivities
      ] = await Promise.all([
        user.ManagedPortfolios.length,
        propertyIds.length,
        Property.count({ where: { id: { [Op.in]: propertyIds }, status: 'occupied' } }),
        Unit.count({
          include: [{
            model: Property,
            where: { id: { [Op.in]: propertyIds } }
          }]
        }),
        Unit.count({
          where: { status: 'occupied' },
          include: [{
            model: Property,
            where: { id: { [Op.in]: propertyIds } }
          }]
        }),
        Payment.findAll({
          where: { status: 'completed' },
          include: [{
            model: Property,
            where: { id: { [Op.in]: propertyIds } },
            attributes: ['id', 'name']
          }],
          order: [['createdAt', 'DESC']],
          limit: 10
        }),
        MaintenanceRequest.count({
          where: { 
            status: { [Op.in]: ['open', 'in_progress'] },
            propertyId: { [Op.in]: propertyIds }
          }
        }),
        AuditLog.findAll({
          where: { userId },
          order: [['createdAt', 'DESC']],
          limit: 10,
          include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'avatar']
          }]
        })
      ]);

      // Get financial statistics
      const financialStats = await this.getPortfolioFinancialStats(portfolioIds);

      // Get portfolio details with performance
      const portfoliosWithStats = await Promise.all(
        user.ManagedPortfolios.map(async (portfolio) => {
          const portfolioProperties = await Property.findAll({
            where: { portfolioId: portfolio.id },
            attributes: ['id', 'status', 'monthlyRent']
          });

          const propertyIds = portfolioProperties.map(p => p.id);
          const totalProperties = portfolioProperties.length;
          const occupiedProperties = portfolioProperties.filter(p => p.status === 'occupied').length;
          const totalRevenue = portfolioProperties.reduce((sum, p) => sum + (p.monthlyRent || 0), 0);

          const units = await Unit.findAll({
            where: { propertyId: { [Op.in]: propertyIds } },
            attributes: ['status']
          });

          const totalUnits = units.length;
          const occupiedUnits = units.filter(u => u.status === 'occupied').length;

          return {
            id: portfolio.id,
            name: portfolio.name,
            description: portfolio.description,
            status: portfolio.status,
            statistics: {
              properties: {
                total: totalProperties,
                occupied: occupiedProperties,
                vacant: totalProperties - occupiedProperties,
                occupancyRate: totalProperties > 0 ? ((occupiedProperties / totalProperties) * 100).toFixed(2) + '%' : '0%'
              },
              units: {
                total: totalUnits,
                occupied: occupiedUnits,
                vacant: totalUnits - occupiedUnits,
                occupancyRate: totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(2) + '%' : '0%'
              },
              financial: {
                totalMonthlyRevenue: totalRevenue.toFixed(2),
                averageRentPerProperty: totalProperties > 0 ? (totalRevenue / totalProperties).toFixed(2) : '0'
              }
            }
          };
        })
      );

      // Get upcoming tasks
      const upcomingTasks = await Task.findAll({
        where: { 
          assignedTo: userId,
          status: { [Op.in]: ['pending', 'in_progress'] },
          dueDate: { [Op.gte]: new Date() }
        },
        order: [['dueDate', 'ASC']],
        limit: 10
      });

      // Get notifications
      const notifications = await Notification.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: 10
      });

      res.json({
        success: true,
        data: {
          overview: {
            portfolios: {
              total: totalPortfolios,
              active: user.ManagedPortfolios.filter(p => p.status === 'active').length,
              archived: user.ManagedPortfolios.filter(p => p.status === 'archived').length
            },
            properties: {
              total: totalProperties,
              occupied: occupiedProperties,
              vacant: totalProperties - occupiedProperties,
              occupancyRate: totalProperties > 0 ? ((occupiedProperties / totalProperties) * 100).toFixed(2) + '%' : '0%'
            },
            units: {
              total: totalUnits,
              occupied: occupiedUnits,
              vacant: totalUnits - occupiedUnits,
              occupancyRate: totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(2) + '%' : '0%'
            },
            maintenance: {
              openRequests: openMaintenance
            }
          },
          financial: financialStats,
          portfolios: portfoliosWithStats,
          recent: {
            payments: recentPayments,
            activities: recentActivities
          },
          upcoming: {
            tasks: upcomingTasks
          },
          notifications
        }
      });
    } catch (error) {
      console.error('Get portfolio manager dashboard error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Property Manager Dashboard
   */
  async getPropertyManagerDashboard(req, res) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check if user is property manager
      if (!userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        return res.status(403).json({ error: 'Not authorized to access property manager dashboard' });
      }

      // Get user's managed properties
      const user = await User.findByPk(userId, {
        include: [{
          model: Property,
          as: 'ManagedProperties',
          include: [{
            model: Unit,
            include: [{
              model: Tenant
            }]
          }]
        }]
      });

      if (!user || !user.ManagedProperties || user.ManagedProperties.length === 0) {
        return res.json({
          success: true,
          data: {
            message: 'No properties assigned',
            overview: {},
            properties: [],
            recent: {},
            upcoming: {},
            notifications: []
          }
        });
      }

      const propertyIds = user.ManagedProperties.map(p => p.id);
      const unitIds = user.ManagedProperties.flatMap(p => 
        p.Units.map(unit => unit.id)
      );

      // Get property statistics
      const [
        totalProperties,
        occupiedProperties,
        totalUnits,
        occupiedUnits,
        totalTenants,
        recentPayments,
        openMaintenance,
        recentActivities
      ] = await Promise.all([
        propertyIds.length,
        Property.count({ where: { id: { [Op.in]: propertyIds }, status: 'occupied' } }),
        unitIds.length,
        Unit.count({ where: { id: { [Op.in]: unitIds }, status: 'occupied' } }),
        Tenant.count({
          include: [{
            model: Lease,
            where: { status: 'active' },
            include: [{
              model: Unit,
              where: { propertyId: { [Op.in]: propertyIds } }
            }]
          }]
        }),
        Payment.findAll({
          where: { status: 'completed' },
          include: [{
            model: Property,
            where: { id: { [Op.in]: propertyIds } },
            attributes: ['id', 'name']
          }],
          order: [['createdAt', 'DESC']],
          limit: 10
        }),
        MaintenanceRequest.count({
          where: { 
            status: { [Op.in]: ['open', 'in_progress'] },
            propertyId: { [Op.in]: propertyIds }
          }
        }),
        AuditLog.findAll({
          where: { userId },
          order: [['createdAt', 'DESC']],
          limit: 10,
          include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'avatar']
          }]
        })
      ]);

      // Get financial statistics
      const financialStats = await this.getPropertyFinancialStats(propertyIds);

      // Get property details with performance
      const propertiesWithStats = await Promise.all(
        user.ManagedProperties.map(async (property) => {
          const units = await Unit.findAll({
            where: { propertyId: property.id },
            attributes: ['status', 'monthlyRent']
          });

          const totalUnits = units.length;
          const occupiedUnits = units.filter(u => u.status === 'occupied').length;
          const totalRevenue = units.reduce((sum, u) => sum + (u.monthlyRent || 0), 0);

          const maintenanceCount = await MaintenanceRequest.count({
            where: { 
              propertyId: property.id,
              status: { [Op.in]: ['open', 'in_progress'] }
            }
          });

          return {
            id: property.id,
            name: property.name,
            address: property.address,
            city: property.city,
            state: property.state,
            status: property.status,
            statistics: {
              units: {
                total: totalUnits,
                occupied: occupiedUnits,
                vacant: totalUnits - occupiedUnits,
                occupancyRate: totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(2) + '%' : '0%'
              },
              financial: {
                totalMonthlyRevenue: totalRevenue.toFixed(2),
                averageRentPerUnit: totalUnits > 0 ? (totalRevenue / totalUnits).toFixed(2) : '0'
              },
              maintenance: {
                openRequests: maintenanceCount
              }
            }
          };
        })
      );

      // Get upcoming tasks
      const upcomingTasks = await Task.findAll({
        where: { 
          assignedTo: userId,
          status: { [Op.in]: ['pending', 'in_progress'] },
          dueDate: { [Op.gte]: new Date() }
        },
        order: [['dueDate', 'ASC']],
        limit: 10
      });

      // Get upcoming lease renewals
      const upcomingRenewals = await Lease.findAll({
        where: { 
          status: 'active',
          endDate: { 
            [Op.between]: [new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)] // Next 30 days
          }
        },
        include: [{
          model: Unit,
          where: { propertyId: { [Op.in]: propertyIds } },
          include: [{
            model: Property,
            attributes: ['name']
          }]
        }, {
          model: Tenant,
          attributes: ['firstName', 'lastName']
        }],
        order: [['endDate', 'ASC']],
        limit: 10
      });

      // Get notifications
      const notifications = await Notification.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: 10
      });

      res.json({
        success: true,
        data: {
          overview: {
            properties: {
              total: totalProperties,
              occupied: occupiedProperties,
              vacant: totalProperties - occupiedProperties,
              occupancyRate: totalProperties > 0 ? ((occupiedProperties / totalProperties) * 100).toFixed(2) + '%' : '0%'
            },
            units: {
              total: totalUnits,
              occupied: occupiedUnits,
              vacant: totalUnits - occupiedUnits,
              occupancyRate: totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(2) + '%' : '0%'
            },
            tenants: {
              total: totalTenants
            },
            maintenance: {
              openRequests: openMaintenance
            }
          },
          financial: financialStats,
          properties: propertiesWithStats,
          recent: {
            payments: recentPayments,
            activities: recentActivities
          },
          upcoming: {
            tasks: upcomingTasks,
            renewals: upcomingRenewals.map(lease => ({
              id: lease.id,
              tenantName: `${lease.Tenant.firstName} ${lease.Tenant.lastName}`,
              propertyName: lease.Unit.Property.name,
              endDate: lease.endDate,
              daysRemaining: Math.ceil((new Date(lease.endDate) - new Date()) / (1000 * 60 * 60 * 24))
            }))
          },
          notifications
        }
      });
    } catch (error) {
      console.error('Get property manager dashboard error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Landlord Dashboard
   */
  async getLandlordDashboard(req, res) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check if user is landlord
      if (!userRoles.includes(ROLES.LANDLORD)) {
        return res.status(403).json({ error: 'Not authorized to access landlord dashboard' });
      }

      // Get landlord's properties
      const properties = await Property.findAll({
        where: { ownerId: userId },
        include: [{
          model: Unit,
          include: [{
            model: Tenant,
            include: [{
              model: Lease,
              where: { status: 'active' },
              required: false
            }]
          }]
        }]
      });

      if (properties.length === 0) {
        return res.json({
          success: true,
          data: {
            message: 'No properties found',
            overview: {},
            properties: [],
            recent: {},
            upcoming: {},
            notifications: []
          }
        });
      }

      const propertyIds = properties.map(p => p.id);
      const unitIds = properties.flatMap(p => p.Units.map(u => u.id));

      // Get statistics
      const [
        totalProperties,
        occupiedProperties,
        totalUnits,
        occupiedUnits,
        totalTenants,
        recentPayments,
        openMaintenance,
        recentActivities
      ] = await Promise.all([
        properties.length,
        properties.filter(p => p.status === 'occupied').length,
        unitIds.length,
        Unit.count({ where: { id: { [Op.in]: unitIds }, status: 'occupied' } }),
        Tenant.count({
          include: [{
            model: Lease,
            where: { status: 'active' },
            include: [{
              model: Unit,
              where: { propertyId: { [Op.in]: propertyIds } }
            }]
          }]
        }),
        Payment.findAll({
          where: { status: 'completed' },
          include: [{
            model: Property,
            where: { id: { [Op.in]: propertyIds } },
            attributes: ['id', 'name']
          }],
          order: [['createdAt', 'DESC']],
          limit: 10
        }),
        MaintenanceRequest.count({
          where: { 
            status: { [Op.in]: ['open', 'in_progress'] },
            propertyId: { [Op.in]: propertyIds }
          }
        }),
        AuditLog.findAll({
          where: { userId },
          order: [['createdAt', 'DESC']],
          limit: 10,
          include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'avatar']
          }]
        })
      ]);

      // Calculate financial statistics
      let totalMonthlyRevenue = 0;
      let totalExpenses = 0;
      let netIncome = 0;

      properties.forEach(property => {
        property.Units.forEach(unit => {
          if (unit.status === 'occupied') {
            totalMonthlyRevenue += unit.monthlyRent || 0;
          }
        });
      });

      // Get recent expenses (this would come from an expenses model)
      // For now, we'll use a placeholder
      totalExpenses = totalMonthlyRevenue * 0.3; // Assuming 30% expenses
      netIncome = totalMonthlyRevenue - totalExpenses;

      // Get property details with statistics
      const propertiesWithStats = properties.map(property => {
        const units = property.Units || [];
        const totalUnits = units.length;
        const occupiedUnits = units.filter(u => u.status === 'occupied').length;
        const propertyRevenue = units.reduce((sum, u) => sum + (u.monthlyRent || 0), 0);

        return {
          id: property.id,
          name: property.name,
          address: property.address,
          city: property.city,
          state: property.state,
          status: property.status,
          statistics: {
            units: {
              total: totalUnits,
              occupied: occupiedUnits,
              vacant: totalUnits - occupiedUnits,
              occupancyRate: totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(2) + '%' : '0%'
            },
            financial: {
              monthlyRevenue: propertyRevenue.toFixed(2),
              averageRent: totalUnits > 0 ? (propertyRevenue / totalUnits).toFixed(2) : '0'
            }
          }
        };
      });

      // Get upcoming lease renewals
      const upcomingRenewals = await Lease.findAll({
        where: { 
          status: 'active',
          endDate: { 
            [Op.between]: [new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)] // Next 30 days
          }
        },
        include: [{
          model: Unit,
          where: { propertyId: { [Op.in]: propertyIds } },
          include: [{
            model: Property,
            attributes: ['name']
          }]
        }, {
          model: Tenant,
          attributes: ['firstName', 'lastName']
        }],
        order: [['endDate', 'ASC']],
        limit: 10
      });

      // Get notifications
      const notifications = await Notification.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: 10
      });

      res.json({
        success: true,
        data: {
          overview: {
            properties: {
              total: totalProperties,
              occupied: occupiedProperties,
              vacant: totalProperties - occupiedProperties,
              occupancyRate: totalProperties > 0 ? ((occupiedProperties / totalProperties) * 100).toFixed(2) + '%' : '0%'
            },
            units: {
              total: totalUnits,
              occupied: occupiedUnits,
              vacant: totalUnits - occupiedUnits,
              occupancyRate: totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(2) + '%' : '0%'
            },
            tenants: {
              total: totalTenants
            },
            maintenance: {
              openRequests: openMaintenance
            }
          },
          financial: {
            monthlyRevenue: totalMonthlyRevenue.toFixed(2),
            monthlyExpenses: totalExpenses.toFixed(2),
            netIncome: netIncome.toFixed(2),
            projectedAnnualRevenue: (totalMonthlyRevenue * 12).toFixed(2),
            projectedAnnualNet: (netIncome * 12).toFixed(2)
          },
          properties: propertiesWithStats,
          recent: {
            payments: recentPayments,
            activities: recentActivities
          },
          upcoming: {
            renewals: upcomingRenewals.map(lease => ({
              id: lease.id,
              tenantName: `${lease.Tenant.firstName} ${lease.Tenant.lastName}`,
              propertyName: lease.Unit.Property.name,
              endDate: lease.endDate,
              daysRemaining: Math.ceil((new Date(lease.endDate) - new Date()) / (1000 * 60 * 60 * 24))
            }))
          },
          notifications
        }
      });
    } catch (error) {
      console.error('Get landlord dashboard error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Dashboard Overview (Quick Stats)
   */
  async getDashboardOverview(req, res) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles;

      let overview = {};

      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        overview = await this.getSystemAdminOverview();
      } else if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        if (user && user.companyId) {
          overview = await this.getCompanyAdminOverview(user.companyId);
        }
      } else if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        overview = await this.getPortfolioManagerOverview(userId);
      } else if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        overview = await this.getPropertyManagerOverview(userId);
      } else if (userRoles.includes(ROLES.LANDLORD)) {
        overview = await this.getLandlordOverview(userId);
      } else {
        // For other roles, return basic user info
        const user = await User.findByPk(userId, {
          attributes: { exclude: ['password'] }
        });
        overview = { user };
      }

      // Get recent notifications
      const notifications = await Notification.findAll({
        where: { userId, read: false },
        order: [['createdAt', 'DESC']],
        limit: 5
      });

      // Get upcoming events/tasks
      const upcomingTasks = await Task.findAll({
        where: { 
          assignedTo: userId,
          status: { [Op.in]: ['pending', 'in_progress'] },
          dueDate: { [Op.gte]: new Date() }
        },
        order: [['dueDate', 'ASC']],
        limit: 5
      });

      res.json({
        success: true,
        data: {
          overview,
          notifications: {
            unread: notifications.length,
            recent: notifications
          },
          upcoming: {
            tasks: upcomingTasks
          }
        }
      });
    } catch (error) {
      console.error('Get dashboard overview error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Helper: Get revenue statistics
   */
  async getRevenueStats(months = 6) {
    try {
      const stats = [];
      const now = new Date();

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

        const revenue = await Payment.sum('amount', {
          where: {
            status: 'completed',
            createdAt: {
              [Op.between]: [date, endDate]
            }
          }
        }) || 0;

        stats.push({
          month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
          revenue: parseFloat(revenue.toFixed(2)),
          transactions: await Payment.count({
            where: {
              status: 'completed',
              createdAt: {
                [Op.between]: [date, endDate]
              }
            }
          })
        });
      }

      return stats;
    } catch (error) {
      console.error('Get revenue stats error:', error);
      return [];
    }
  }

  /**
   * Helper: Get user growth statistics
   */
  async getUserGrowthStats(months = 12) {
    try {
      const stats = [];
      const now = new Date();

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

        const newUsers = await User.count({
          where: {
            createdAt: {
              [Op.between]: [date, endDate]
            }
          }
        });

        const activeUsers = await User.count({
          where: {
            isActive: true,
            lastLogin: {
              [Op.between]: [date, endDate]
            }
          }
        });

        stats.push({
          month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
          newUsers,
          activeUsers
        });
      }

      return stats;
    } catch (error) {
      console.error('Get user growth stats error:', error);
      return [];
    }
  }

  /**
   * Helper: Get system health metrics
   */
  async getSystemHealthMetrics() {
    try {
      // Get database connection status
      const dbStatus = 'healthy'; // This would actually test the database connection

      // Get server uptime (simplified)
      const uptime = process.uptime();

      // Get recent errors from logs
      const errorCount = await AuditLog.count({
        where: {
          action: { [Op.like]: '%ERROR%' },
          createdAt: {
            [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      });

      // Get active users in last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const activeUsers = await User.count({
        where: {
          lastLogin: {
            [Op.gte]: oneHourAgo
          }
        }
      });

      return {
        database: dbStatus,
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
        errorsLast24h: errorCount,
        activeUsersLastHour: activeUsers,
        memoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        cpuUsage: 'normal' // This would require system monitoring
      };
    } catch (error) {
      console.error('Get system health metrics error:', error);
      return {
        database: 'unknown',
        uptime: 'unknown',
        errorsLast24h: 0,
        activeUsersLastHour: 0,
        memoryUsage: 'unknown',
        cpuUsage: 'unknown'
      };
    }
  }

  /**
   * Helper: Get upcoming renewals
   */
  async getUpcomingRenewals(days = 30) {
    try {
      const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

      const renewals = await Lease.findAll({
        where: {
          status: 'active',
          endDate: {
            [Op.between]: [new Date(), endDate]
          }
        },
        include: [{
          model: Tenant,
          attributes: ['firstName', 'lastName', 'email']
        }, {
          model: Unit,
          include: [{
            model: Property,
            attributes: ['name', 'address']
          }]
        }],
        order: [['endDate', 'ASC']],
        limit: 20
      });

      return renewals.map(lease => ({
        id: lease.id,
        tenantName: `${lease.Tenant.firstName} ${lease.Tenant.lastName}`,
        tenantEmail: lease.Tenant.email,
        propertyName: lease.Unit.Property.name,
        propertyAddress: lease.Unit.Property.address,
        endDate: lease.endDate,
        daysRemaining: Math.ceil((new Date(lease.endDate) - new Date()) / (1000 * 60 * 60 * 24))
      }));
    } catch (error) {
      console.error('Get upcoming renewals error:', error);
      return [];
    }
  }

  /**
   * Helper: Get platform usage statistics
   */
  async getPlatformUsageStats() {
    try {
      // Get total active companies
      const activeCompanies = await Company.count({ where: { status: 'active' } });

      // Get companies by plan
      const companies = await Company.findAll({
        attributes: ['subscription']
      });

      const plans = {
        free: 0,
        basic: 0,
        professional: 0,
        enterprise: 0
      };

      companies.forEach(company => {
        const plan = company.subscription?.plan || 'free';
        plans[plan] = (plans[plan] || 0) + 1;
      });

      // Get geographic distribution
      const geographic = await Company.findAll({
        attributes: ['state', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['state'],
        having: sequelize.where(sequelize.col('count'), '>', 0),
        order: [[sequelize.literal('count'), 'DESC']],
        limit: 10
      });

      // Get user activity (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const activeUsers = await User.count({
        where: {
          lastLogin: {
            [Op.gte]: sevenDaysAgo
          }
        }
      });

      const totalUsers = await User.count();
      const activationRate = totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(2) + '%' : '0%';

      return {
        companies: {
          total: activeCompanies,
          byPlan: plans,
          geographic: geographic.map(g => ({
            state: g.state || 'Unknown',
            count: g.get('count')
          }))
        },
        users: {
          total: totalUsers,
          activeLast7Days: activeUsers,
          activationRate
        }
      };
    } catch (error) {
      console.error('Get platform usage stats error:', error);
      return {
        companies: { total: 0, byPlan: {}, geographic: [] },
        users: { total: 0, activeLast7Days: 0, activationRate: '0%' }
      };
    }
  }

  /**
   * Helper: Get company financial statistics
   */
  async getCompanyFinancialStats(companyId) {
    try {
      // Get total revenue (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const recentRevenue = await Payment.sum('amount', {
        where: {
          status: 'completed',
          createdAt: { [Op.gte]: thirtyDaysAgo }
        },
        include: [{
          model: Property,
          where: { companyId }
        }]
      }) || 0;

      // Get revenue by portfolio (last 30 days)
      const portfolios = await Portfolio.findAll({
        where: { companyId },
        include: [{
          model: Property,
          include: [{
            model: Payment,
            where: {
              status: 'completed',
              createdAt: { [Op.gte]: thirtyDaysAgo }
            },
            required: false
          }]
        }]
      });

      const revenueByPortfolio = portfolios.map(portfolio => {
        const revenue = portfolio.Properties.reduce((sum, property) => {
          return sum + (property.Payments?.reduce((pSum, payment) => pSum + payment.amount, 0) || 0);
        }, 0);

        return {
          portfolioId: portfolio.id,
          portfolioName: portfolio.name,
          revenue: parseFloat(revenue.toFixed(2)),
          propertyCount: portfolio.Properties.length
        };
      });

      // Get pending payments
      const pendingPayments = await Payment.sum('amount', {
        where: {
          status: 'pending'
        },
        include: [{
          model: Property,
          where: { companyId }
        }]
      }) || 0;

      return {
        recentRevenue: parseFloat(recentRevenue.toFixed(2)),
        pendingPayments: parseFloat(pendingPayments.toFixed(2)),
        byPortfolio: revenueByPortfolio
      };
    } catch (error) {
      console.error('Get company financial stats error:', error);
      return {
        recentRevenue: 0,
        pendingPayments: 0,
        byPortfolio: []
      };
    }
  }

  /**
   * Helper: Get portfolio performance
   */
  async getPortfolioPerformance(companyId) {
    try {
      const portfolios = await Portfolio.findAll({
        where: { companyId },
        include: [{
          model: Property,
          include: [{
            model: Unit
          }]
        }]
      });

      return portfolios.map(portfolio => {
        const properties = portfolio.Properties || [];
        const totalProperties = properties.length;
        const occupiedProperties = properties.filter(p => p.status === 'occupied').length;

        let totalUnits = 0;
        let occupiedUnits = 0;
        let totalRevenue = 0;

        properties.forEach(property => {
          const units = property.Units || [];
          totalUnits += units.length;
          occupiedUnits += units.filter(u => u.status === 'occupied').length;
          totalRevenue += units.reduce((sum, u) => sum + (u.monthlyRent || 0), 0);
        });

        return {
          id: portfolio.id,
          name: portfolio.name,
          status: portfolio.status,
          performance: {
            properties: {
              total: totalProperties,
              occupied: occupiedProperties,
              occupancyRate: totalProperties > 0 ? ((occupiedProperties / totalProperties) * 100).toFixed(2) + '%' : '0%'
            },
            units: {
              total: totalUnits,
              occupied: occupiedUnits,
              occupancyRate: totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(2) + '%' : '0%'
            },
            financial: {
              monthlyRevenue: parseFloat(totalRevenue.toFixed(2)),
              averageRentPerUnit: totalUnits > 0 ? parseFloat((totalRevenue / totalUnits).toFixed(2)) : 0
            }
          }
        };
      });
    } catch (error) {
      console.error('Get portfolio performance error:', error);
      return [];
    }
  }

  /**
   * Helper: Get company user IDs
   */
  async getCompanyUserIds(companyId) {
    try {
      const users = await User.findAll({
        where: { companyId },
        attributes: ['id']
      });
      return users.map(u => u.id);
    } catch (error) {
      console.error('Get company user IDs error:', error);
      return [];
    }
  }

  /**
   * Helper: Get portfolio financial statistics
   */
  async getPortfolioFinancialStats(portfolioIds) {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const recentRevenue = await Payment.sum('amount', {
        where: {
          status: 'completed',
          createdAt: { [Op.gte]: thirtyDaysAgo }
        },
        include: [{
          model: Property,
          where: { portfolioId: { [Op.in]: portfolioIds } }
        }]
      }) || 0;

      const pendingPayments = await Payment.sum('amount', {
        where: {
          status: 'pending'
        },
        include: [{
          model: Property,
          where: { portfolioId: { [Op.in]: portfolioIds } }
        }]
      }) || 0;

      return {
        recentRevenue: parseFloat(recentRevenue.toFixed(2)),
        pendingPayments: parseFloat(pendingPayments.toFixed(2))
      };
    } catch (error) {
      console.error('Get portfolio financial stats error:', error);
      return {
        recentRevenue: 0,
        pendingPayments: 0
      };
    }
  }

  /**
   * Helper: Get property financial statistics
   */
  async getPropertyFinancialStats(propertyIds) {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const recentRevenue = await Payment.sum('amount', {
        where: {
          status: 'completed',
          createdAt: { [Op.gte]: thirtyDaysAgo },
          propertyId: { [Op.in]: propertyIds }
        }
      }) || 0;

      const pendingPayments = await Payment.sum('amount', {
        where: {
          status: 'pending',
          propertyId: { [Op.in]: propertyIds }
        }
      }) || 0;

      // Calculate expected monthly revenue
      const properties = await Property.findAll({
        where: { id: { [Op.in]: propertyIds } },
        include: [{
          model: Unit,
          where: { status: 'occupied' }
        }]
      });

      const expectedMonthlyRevenue = properties.reduce((sum, property) => {
        return sum + property.Units.reduce((uSum, unit) => uSum + (unit.monthlyRent || 0), 0);
      }, 0);

      return {
        recentRevenue: parseFloat(recentRevenue.toFixed(2)),
        pendingPayments: parseFloat(pendingPayments.toFixed(2)),
        expectedMonthlyRevenue: parseFloat(expectedMonthlyRevenue.toFixed(2)),
        collectionRate: expectedMonthlyRevenue > 0 ? 
          parseFloat(((recentRevenue / expectedMonthlyRevenue) * 100).toFixed(2)) + '%' : '0%'
      };
    } catch (error) {
      console.error('Get property financial stats error:', error);
      return {
        recentRevenue: 0,
        pendingPayments: 0,
        expectedMonthlyRevenue: 0,
        collectionRate: '0%'
      };
    }
  }

  /**
   * Helper: Get upcoming tasks
   */
  async getUpcomingTasks(companyId) {
    try {
      // Get company user IDs
      const userIds = await this.getCompanyUserIds(companyId);

      if (userIds.length === 0) {
        return [];
      }

      const tasks = await Task.findAll({
        where: {
          assignedTo: { [Op.in]: userIds },
          status: { [Op.in]: ['pending', 'in_progress'] },
          dueDate: { [Op.gte]: new Date() }
        },
        include: [{
          model: User,
          as: 'Assignee',
          attributes: ['firstName', 'lastName']
        }, {
          model: Property,
          attributes: ['name']
        }],
        order: [['dueDate', 'ASC']],
        limit: 10
      });

      return tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignee: task.Assignee ? `${task.Assignee.firstName} ${task.Assignee.lastName}` : 'Unassigned',
        property: task.Property ? task.Property.name : null,
        daysRemaining: Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
      }));
    } catch (error) {
      console.error('Get upcoming tasks error:', error);
      return [];
    }
  }

  /**
   * Helper: Get system admin overview
   */
  async getSystemAdminOverview() {
    try {
      const [
        totalCompanies,
        activeCompanies,
        totalUsers,
        activeUsers,
        totalProperties,
        recentRevenue
      ] = await Promise.all([
        Company.count(),
        Company.count({ where: { status: 'active' } }),
        User.count(),
        User.count({ where: { isActive: true } }),
        Property.count(),
        Payment.sum('amount', {
          where: {
            status: 'completed',
            createdAt: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          }
        }) || 0
      ]);

      return {
        companies: totalCompanies,
        activeCompanies,
        users: totalUsers,
        activeUsers,
        properties: totalProperties,
        recentRevenue: parseFloat(recentRevenue.toFixed(2))
      };
    } catch (error) {
      console.error('Get system admin overview error:', error);
      return {
        companies: 0,
        activeCompanies: 0,
        users: 0,
        activeUsers: 0,
        properties: 0,
        recentRevenue: 0
      };
    }
  }

  /**
   * Helper: Get company admin overview
   */
  async getCompanyAdminOverview(companyId) {
    try {
      const [
        totalUsers,
        activeUsers,
        totalProperties,
        occupiedProperties,
        recentRevenue
      ] = await Promise.all([
        User.count({ where: { companyId } }),
        User.count({ where: { companyId, isActive: true } }),
        Property.count({ where: { companyId } }),
        Property.count({ where: { companyId, status: 'occupied' } }),
        Payment.sum('amount', {
          where: {
            status: 'completed',
            createdAt: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          },
          include: [{
            model: Property,
            where: { companyId }
          }]
        }) || 0
      ]);

      return {
        users: totalUsers,
        activeUsers,
        properties: totalProperties,
        occupiedProperties,
        occupancyRate: totalProperties > 0 ? ((occupiedProperties / totalProperties) * 100).toFixed(2) + '%' : '0%',
        recentRevenue: parseFloat(recentRevenue.toFixed(2))
      };
    } catch (error) {
      console.error('Get company admin overview error:', error);
      return {
        users: 0,
        activeUsers: 0,
        properties: 0,
        occupiedProperties: 0,
        occupancyRate: '0%',
        recentRevenue: 0
      };
    }
  }

  /**
   * Helper: Get portfolio manager overview
   */
  async getPortfolioManagerOverview(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: [{
          model: Portfolio,
          as: 'ManagedPortfolios',
          include: [{
            model: Property
          }]
        }]
      });

      if (!user || !user.ManagedPortfolios || user.ManagedPortfolios.length === 0) {
        return {
          portfolios: 0,
          properties: 0,
          recentRevenue: 0
        };
      }

      const propertyIds = user.ManagedPortfolios.flatMap(p => 
        p.Properties.map(prop => prop.id)
      );

      const recentRevenue = await Payment.sum('amount', {
        where: {
          status: 'completed',
          createdAt: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          propertyId: { [Op.in]: propertyIds }
        }
      }) || 0;

      return {
        portfolios: user.ManagedPortfolios.length,
        properties: propertyIds.length,
        recentRevenue: parseFloat(recentRevenue.toFixed(2))
      };
    } catch (error) {
      console.error('Get portfolio manager overview error:', error);
      return {
        portfolios: 0,
        properties: 0,
        recentRevenue: 0
      };
    }
  }

  /**
   * Helper: Get property manager overview
   */
  async getPropertyManagerOverview(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: [{
          model: Property,
          as: 'ManagedProperties'
        }]
      });

      if (!user || !user.ManagedProperties || user.ManagedProperties.length === 0) {
        return {
          properties: 0,
          units: 0,
          recentRevenue: 0
        };
      }

      const propertyIds = user.ManagedProperties.map(p => p.id);

      const [recentRevenue, totalUnits] = await Promise.all([
        Payment.sum('amount', {
          where: {
            status: 'completed',
            createdAt: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            propertyId: { [Op.in]: propertyIds }
          }
        }) || 0,
        Unit.count({
          include: [{
            model: Property,
            where: { id: { [Op.in]: propertyIds } }
          }]
        })
      ]);

      return {
        properties: user.ManagedProperties.length,
        units: totalUnits,
        recentRevenue: parseFloat(recentRevenue.toFixed(2))
      };
    } catch (error) {
      console.error('Get property manager overview error:', error);
      return {
        properties: 0,
        units: 0,
        recentRevenue: 0
      };
    }
  }

  /**
   * Helper: Get landlord overview
   */
  async getLandlordOverview(userId) {
    try {
      const [properties, recentRevenue] = await Promise.all([
        Property.count({ where: { ownerId: userId } }),
        Payment.sum('amount', {
          where: {
            status: 'completed',
            createdAt: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          },
          include: [{
            model: Property,
            where: { ownerId: userId }
          }]
        }) || 0
      ]);

      return {
        properties,
        recentRevenue: parseFloat(recentRevenue.toFixed(2))
      };
    } catch (error) {
      console.error('Get landlord overview error:', error);
      return {
        properties: 0,
        recentRevenue: 0
      };
    }
  }

  /**
   * Get Dashboard Data (Main endpoint)
   */
  async getDashboardData(req, res) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return this.getSystemAdminDashboard(req, res);
      } else if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        return this.getCompanyAdminDashboard(req, res);
      } else if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        return this.getPortfolioManagerDashboard(req, res);
      } else if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        return this.getPropertyManagerDashboard(req, res);
      } else if (userRoles.includes(ROLES.LANDLORD)) {
        return this.getLandlordDashboard(req, res);
      } else {
        return res.status(403).json({ error: 'Not authorized to access dashboard' });
      }
    } catch (error) {
      console.error('Get dashboard data error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Key Metrics
   */
  async getKeyMetrics(req, res) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles;

      let metrics = {};

      if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        if (user && user.companyId) {
          metrics = await this.getCompanyAdminOverview(user.companyId);
        }
      } else if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        metrics = await this.getPropertyManagerOverview(userId);
      } else if (userRoles.includes(ROLES.LANDLORD)) {
        metrics = await this.getLandlordOverview(userId);
      }

      res.json({ success: true, data: metrics });
    } catch (error) {
      console.error('Get key metrics error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Recent Activity
   */
  async getRecentActivity(req, res) {
    try {
      const userId = req.user.id;
      const limit = Math.min(parseInt(req.query.limit) || 20, 50);

      const activities = await AuditLog.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit,
        include: [{
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }]
      });

      res.json({ success: true, data: activities });
    } catch (error) {
      console.error('Get recent activity error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Alerts
   */
  async getAlerts(req, res) {
    try {
      const userId = req.user.id;
      const { priority, type } = req.query;

      const where = { userId };
      if (priority) where.priority = priority;
      if (type) where.type = type;

      const alerts = await Notification.findAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: 20
      });

      res.json({ success: true, data: alerts });
    } catch (error) {
      console.error('Get alerts error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new DashboardController();
