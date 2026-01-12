const { AuditLog, User } = require('../../models');
const { Op } = require('sequelize');

const auditController = {
  // Get all audit logs
  getAllAuditLogs: async (req, res) => {
    try {
      const { 
        userId, 
        action,
        entityType,
        entityId,
        startDate,
        endDate,
        search,
        page = 1, 
        limit = 50 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = { companyId: req.user.companyId };
      if (userId) where.userId = userId;
      if (action) where.action = action;
      if (entityType) where.entityType = entityType;
      if (entityId) where.entityId = entityId;
      
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt[Op.gte] = new Date(startDate);
        if (endDate) where.createdAt[Op.lte] = new Date(endDate);
      }
      
      if (search) {
        where[Op.or] = [
          { action: { [Op.like]: `%${search}%` } },
          { entityType: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { ipAddress: { [Op.like]: `%${search}%` } },
          { '$User.firstName$': { [Op.like]: `%${search}%` } },
          { '$User.lastName$': { [Op.like]: `%${search}%` } }
        ];
      }
      
      const auditLogs = await AuditLog.findAndCountAll({
        where,
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'role']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });
      
      res.json({
        success: true,
        data: auditLogs.rows,
        pagination: {
          total: auditLogs.count,
          page: parseInt(page),
          pages: Math.ceil(auditLogs.count / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get audit log by ID
  getAuditLogById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const auditLog = await AuditLog.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'role']
          }
        ]
      });
      
      if (!auditLog) {
        return res.status(404).json({ success: false, message: 'Audit log not found' });
      }
      
      // Check permissions
      if (auditLog.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this audit log'
        });
      }
      
      res.json({ success: true, data: auditLog });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get audit log statistics
  getAuditLogStatistics: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const where = { companyId: req.user.companyId };
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt[Op.gte] = new Date(startDate);
        if (endDate) where.createdAt[Op.lte] = new Date(endDate);
      }
      
      // Total audit logs
      const totalLogs = await AuditLog.count({ where });
      
      // By action type
      const byAction = await AuditLog.findAll({
        attributes: [
          'action',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: ['action'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 10
      });
      
      // By entity type
      const byEntityType = await AuditLog.findAll({
        attributes: [
          'entityType',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: ['entityType'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 10
      });
      
      // By user
      const byUser = await AuditLog.findAll({
        attributes: [
          'userId',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: ['userId'],
        include: [{
          model: User,
          attributes: ['firstName', 'lastName']
        }],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 10
      });
      
      // Recent activities (last 24 hours)
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
      
      const recentActivities = await AuditLog.count({
        where: {
          ...where,
          createdAt: { [Op.gte]: twentyFourHoursAgo }
        }
      });
      
      // Most active entities
      const activeEntities = await AuditLog.findAll({
        attributes: [
          'entityType',
          'entityId',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: ['entityType', 'entityId'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 10
      });
      
      res.json({
        success: true,
        data: {
          totalLogs,
          byAction: byAction.map(item => ({
            action: item.action,
            count: parseInt(item.dataValues.count)
          })),
          byEntityType: byEntityType.map(item => ({
            entityType: item.entityType,
            count: parseInt(item.dataValues.count)
          })),
          byUser: byUser.map(item => ({
            userId: item.userId,
            userName: item.User ? 
              `${item.User.firstName} ${item.User.lastName}` : 
              'Unknown',
            count: parseInt(item.dataValues.count)
          })),
          recent24Hours: recentActivities,
          activeEntities: activeEntities.map(item => ({
            entityType: item.entityType,
            entityId: item.entityId,
            count: parseInt(item.dataValues.count)
          }))
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Export audit logs
  exportAuditLogs: async (req, res) => {
    try {
      const { startDate, endDate, format = 'csv' } = req.query;
      
      const where = { companyId: req.user.companyId };
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt[Op.gte] = new Date(startDate);
        if (endDate) where.createdAt[Op.lte] = new Date(endDate);
      }
      
      const auditLogs = await AuditLog.findAll({
        where,
        include: [{
          model: User,
          attributes: ['firstName', 'lastName', 'email']
        }],
        order: [['createdAt', 'DESC']],
        limit: 10000 // Limit for export
      });
      
      // Format data for export
      const exportData = auditLogs.map(log => ({
        'Timestamp': log.createdAt.toISOString(),
        'User': log.User ? `${log.User.firstName} ${log.User.lastName}` : 'System',
        'Email': log.User?.email || 'N/A',
        'Action': log.action,
        'Entity Type': log.entityType,
        'Entity ID': log.entityId,
        'Description': log.description,
        'IP Address': log.ipAddress || 'N/A',
        'User Agent': log.userAgent || 'N/A',
        'Changes': JSON.stringify(log.changes || {}),
        'Metadata': JSON.stringify(log.metadata || {})
      }));
      
      if (format === 'csv') {
        // Convert to CSV
        const headers = Object.keys(exportData[0] || {});
        const csv = [
          headers.join(','),
          ...exportData.map(row => 
            headers.map(header => 
              `"${(row[header] || '').toString().replace(/"/g, '""')}"`
            ).join(',')
          )
        ].join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
        return res.send(csv);
      } else if (format === 'json') {
        res.json({
          success: true,
          data: exportData
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Invalid format. Use: csv, json'
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Search audit logs
  searchAuditLogs: async (req, res) => {
    try {
      const { 
        query, 
        entityType, 
        action, 
        startDate, 
        endDate, 
        limit = 100 
      } = req.query;
      
      const where = { companyId: req.user.companyId };
      if (entityType) where.entityType = entityType;
      if (action) where.action = action;
      
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt[Op.gte] = new Date(startDate);
        if (endDate) where.createdAt[Op.lte] = new Date(endDate);
      }
      
      if (query) {
        where[Op.or] = [
          { description: { [Op.like]: `%${query}%` } },
          { entityId: { [Op.like]: `%${query}%` } },
          { '$User.firstName$': { [Op.like]: `%${query}%` } },
          { '$User.lastName$': { [Op.like]: `%${query}%` } },
          { '$User.email$': { [Op.like]: `%${query}%` } }
        ];
      }
      
      const auditLogs = await AuditLog.findAll({
        where,
        include: [{
          model: User,
          attributes: ['firstName', 'lastName', 'email']
        }],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit)
      });
      
      res.json({
        success: true,
        data: auditLogs
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = auditController;