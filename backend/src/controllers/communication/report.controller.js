const { Report, User, Property } = require('../../models');
const { Op } = require('sequelize');
const { sendEmail } = require('../../services/communication/email.service');
const { generateReportPDF } = require('../../services/document.service');

const reportController = {
  // Get all reports
  getAllReports: async (req, res) => {
    try {
      const { 
        type, 
        status,
        createdById,
        propertyId,
        fromDate,
        toDate,
        search,
        page = 1, 
        limit = 20 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = { companyId: req.user.companyId };
      if (type) where.type = type;
      if (status) where.status = status;
      if (createdById) where.createdById = createdById;
      if (propertyId) where.propertyId = propertyId;
      
      if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) where.createdAt[Op.gte] = new Date(fromDate);
        if (toDate) where.createdAt[Op.lte] = new Date(toDate);
      }
      
      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { '$User.firstName$': { [Op.like]: `%${search}%` } },
          { '$User.lastName$': { [Op.like]: `%${search}%` } }
        ];
      }
      
      const reports = await Report.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'CreatedBy',
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: Property,
            attributes: ['id', 'name']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });
      
      res.json({
        success: true,
        data: reports.rows,
        pagination: {
          total: reports.count,
          page: parseInt(page),
          pages: Math.ceil(reports.count / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get report by ID
  getReportById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const report = await Report.findByPk(id, {
        include: [
          {
            model: User,
            as: 'CreatedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: Property,
            attributes: ['id', 'name', 'address']
          }
        ]
      });
      
      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }
      
      // Check if report belongs to user's company
      if (report.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this report'
        });
      }
      
      res.json({ success: true, data: report });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Generate report
  generateReport: async (req, res) => {
    try {
      const {
        type,
        title,
        description,
        propertyId,
        startDate,
        endDate,
        filters,
        format,
        schedule,
        recipients
      } = req.body;
      
      // Validate report type
      const validTypes = [
        'financial_summary',
        'rent_roll',
        'occupancy',
        'maintenance',
        'tenant',
        'property_performance',
        'expense',
        'custom'
      ];
      
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Invalid report type. Must be one of: ${validTypes.join(', ')}`
        });
      }
      
      // Validate property if provided
      let property = null;
      if (propertyId) {
        property = await Property.findByPk(propertyId);
        if (!property) {
          return res.status(404).json({ success: false, message: 'Property not found' });
        }
      }
      
      // Generate report data
      const reportData = await generateReportData(type, {
        companyId: req.user.companyId,
        propertyId,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        filters: filters || {}
      });
      
      // Generate report number
      const reportCount = await Report.count();
      const reportNumber = `RPT-${new Date().getFullYear()}-${String(reportCount + 1).padStart(6, '0')}`;
      
      // Create report record
      const report = await Report.create({
        reportNumber,
        type,
        title: title || `${type.replace('_', ' ')} Report`,
        description: description || '',
        propertyId,
        data: reportData,
        filters: filters || {},
        format: format || 'pdf',
        status: 'generated',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        generatedAt: new Date(),
        createdById: req.user.id,
        companyId: req.user.companyId,
        portfolioId: property?.portfolioId || null,
        schedule: schedule || null,
        recipients: recipients || []
      });
      
      // Generate PDF if requested
      let pdfUrl = null;
      if (format === 'pdf') {
        const pdfBuffer = await generateReportPDF(report, reportData);
        // Upload PDF to storage and get URL
        // pdfUrl = await uploadToStorage(pdfBuffer, `reports/${reportNumber}.pdf`);
        
        await report.update({
          fileUrl: pdfUrl,
          fileGeneratedAt: new Date()
        });
      }
      
      // Send to recipients if specified
      if (recipients && recipients.length > 0) {
        await sendReportToRecipients(report, reportData, recipients);
      }
      
      res.status(201).json({
        success: true,
        message: 'Report generated successfully',
        data: {
          report,
          data: reportData,
          fileUrl: pdfUrl
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get report data
  getReportData: async (req, res) => {
    try {
      const { id } = req.params;
      const { refresh } = req.query;
      
      const report = await Report.findByPk(id);
      
      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }
      
      // Check if report belongs to user's company
      if (report.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this report'
        });
      }
      
      // Regenerate data if requested
      let reportData = report.data;
      if (refresh === 'true') {
        reportData = await generateReportData(report.type, {
          companyId: report.companyId,
          propertyId: report.propertyId,
          startDate: report.startDate,
          endDate: report.endDate,
          filters: report.filters
        });
        
        await report.update({
          data: reportData,
          generatedAt: new Date()
        });
      }
      
      res.json({
        success: true,
        data: {
          report,
          data: reportData
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Download report
  downloadReport: async (req, res) => {
    try {
      const { id } = req.params;
      const { format } = req.query;
      
      const report = await Report.findByPk(id);
      
      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }
      
      // Check if report belongs to user's company
      if (report.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to download this report'
        });
      }
      
      const downloadFormat = format || report.format || 'pdf';
      
      if (downloadFormat === 'pdf') {
        // Generate PDF
        const pdfBuffer = await generateReportPDF(report, report.data);
        
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${report.reportNumber}.pdf"`
        });
        
        return res.send(pdfBuffer);
        
      } else if (downloadFormat === 'excel') {
        // Generate Excel
        // const excelBuffer = await generateReportExcel(report, report.data);
        
        res.set({
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${report.reportNumber}.xlsx"`
        });
        
        // return res.send(excelBuffer);
        return res.json({
          success: true,
          message: 'Excel export requires additional setup',
          data: report.data
        });
        
      } else if (downloadFormat === 'json') {
        // Return JSON
        res.json({
          success: true,
          data: {
            report,
            data: report.data
          }
        });
      } else if (downloadFormat === 'csv') {
        // Generate CSV
        const csvData = convertToCSV(report.data);
        
        res.set({
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${report.reportNumber}.csv"`
        });
        
        return res.send(csvData);
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Schedule report
  scheduleReport: async (req, res) => {
    try {
      const { id } = req.params;
      const { schedule, recipients } = req.body;
      
      const report = await Report.findByPk(id);
      
      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }
      
      // Check if report belongs to user's company
      if (report.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to schedule this report'
        });
      }
      
      // Validate schedule
      const validSchedules = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];
      if (!validSchedules.includes(schedule.frequency)) {
        return res.status(400).json({
          success: false,
          message: `Invalid schedule frequency. Must be one of: ${validSchedules.join(', ')}`
        });
      }
      
      // Update report with schedule
      await report.update({
        schedule: {
          ...schedule,
          nextRun: calculateNextRun(schedule),
          isActive: true
        },
        recipients: recipients || report.recipients,
        updatedAt: new Date()
      });
      
      // Create scheduled job
      await createScheduledReportJob(report);
      
      res.json({
        success: true,
        message: `Report scheduled for ${schedule.frequency} delivery`,
        data: report
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Unschedule report
  unscheduleReport: async (req, res) => {
    try {
      const { id } = req.params;
      
      const report = await Report.findByPk(id);
      
      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }
      
      // Check if report belongs to user's company
      if (report.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to unschedule this report'
        });
      }
      
      if (!report.schedule || !report.schedule.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Report is not scheduled'
        });
      }
      
      // Update report
      await report.update({
        schedule: {
          ...report.schedule,
          isActive: false
        },
        updatedAt: new Date()
      });
      
      // Remove scheduled job
      await removeScheduledReportJob(report.id);
      
      res.json({
        success: true,
        message: 'Report unscheduled successfully',
        data: report
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Send report to recipients
  sendReport: async (req, res) => {
    try {
      const { id } = req.params;
      const { recipients, message } = req.body;
      
      const report = await Report.findByPk(id, {
        include: [{ model: User, as: 'CreatedBy' }]
      });
      
      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }
      
      // Check if report belongs to user's company
      if (report.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to send this report'
        });
      }
      
      const targetRecipients = recipients || report.recipients || [];
      
      if (targetRecipients.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No recipients specified'
        });
      }
      
      // Send to recipients
      const results = await sendReportToRecipients(report, report.data, targetRecipients, message);
      
      // Update report
      await report.update({
        lastSentAt: new Date(),
        lastSentTo: targetRecipients,
        sendCount: (report.sendCount || 0) + 1
      });
      
      res.json({
        success: true,
        message: `Report sent to ${results.sent.length} recipients successfully, ${results.failed.length} failed`,
        data: results
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get report templates
  getReportTemplates: async (req, res) => {
    try {
      const { type } = req.query;
      
      // This would query from ReportTemplate model
      // For now, return predefined templates
      const templates = [
        {
          id: 'monthly_financial',
          name: 'Monthly Financial Summary',
          type: 'financial_summary',
          description: 'Monthly income, expenses, and net profit',
          defaultFilters: {
            period: 'month',
            includeDetails: true
          },
          defaultSchedule: {
            frequency: 'monthly',
            dayOfMonth: 5,
            time: '09:00'
          }
        },
        {
          id: 'rent_roll',
          name: 'Rent Roll Report',
          type: 'rent_roll',
          description: 'Current rent status by property and unit',
          defaultFilters: {
            includeVacancies: true,
            includeDelinquencies: true
          }
        },
        {
          id: 'maintenance_summary',
          name: 'Maintenance Summary',
          type: 'maintenance',
          description: 'Maintenance requests and costs by property',
          defaultFilters: {
            period: 'month',
            includeOpenRequests: true
          },
          defaultSchedule: {
            frequency: 'weekly',
            dayOfWeek: 'monday',
            time: '08:00'
          }
        },
        {
          id: 'property_performance',
          name: 'Property Performance',
          type: 'property_performance',
          description: 'Key metrics for property evaluation',
          defaultFilters: {
            compareToPrevious: true,
            includeForecast: true
          }
        }
      ];
      
      const filteredTemplates = type ? 
        templates.filter(t => t.type === type) : 
        templates;
      
      res.json({
        success: true,
        data: filteredTemplates
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get report statistics
  getReportStatistics: async (req, res) => {
    try {
      const { startDate, endDate, type } = req.query;
      
      const where = { companyId: req.user.companyId };
      if (type) where.type = type;
      
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt[Op.gte] = new Date(startDate);
        if (endDate) where.createdAt[Op.lte] = new Date(endDate);
      }
      
      // Total reports
      const totalReports = await Report.count({ where });
      
      // By type
      const byType = await Report.findAll({
        attributes: [
          'type',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: ['type']
      });
      
      // By status
      const byStatus = await Report.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: ['status']
      });
      
      // Scheduled reports
      const scheduledReports = await Report.count({
        where: {
          ...where,
          schedule: { [Op.not]: null }
        }
      });
      
      // Most generated reports
      const mostGenerated = await Report.findAll({
        attributes: [
          'type',
          'title',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: ['type', 'title'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 5
      });
      
      // Recent reports
      const recentReports = await Report.findAll({
        where,
        attributes: ['id', 'reportNumber', 'type', 'title', 'generatedAt'],
        order: [['generatedAt', 'DESC']],
        limit: 10
      });
      
      res.json({
        success: true,
        data: {
          totalReports,
          byType: byType.map(item => ({
            type: item.type,
            count: parseInt(item.dataValues.count)
          })),
          byStatus: byStatus.reduce((acc, item) => {
            acc[item.status] = parseInt(item.dataValues.count);
            return acc;
          }, {}),
          scheduledReports,
          mostGenerated: mostGenerated.map(item => ({
            type: item.type,
            title: item.title,
            count: parseInt(item.dataValues.count)
          })),
          recentReports
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Helper functions
async function generateReportData(type, options) {
  const { companyId, propertyId, startDate, endDate, filters } = options;
  
  let reportData = {};
  
  switch (type) {
    case 'financial_summary':
      reportData = await generateFinancialSummary(companyId, propertyId, startDate, endDate);
      break;
    case 'rent_roll':
      reportData = await generateRentRoll(companyId, propertyId);
      break;
    case 'occupancy':
      reportData = await generateOccupancyReport(companyId, propertyId);
      break;
    case 'maintenance':
      reportData = await generateMaintenanceReport(companyId, propertyId, startDate, endDate);
      break;
    case 'tenant':
      reportData = await generateTenantReport(companyId, propertyId);
      break;
    case 'property_performance':
      reportData = await generatePropertyPerformance(companyId, propertyId, startDate, endDate);
      break;
    case 'expense':
      reportData = await generateExpenseReport(companyId, propertyId, startDate, endDate);
      break;
    default:
      reportData = { message: 'Report type not implemented' };
  }
  
  return {
    ...reportData,
    metadata: {
      generatedAt: new Date(),
      type,
      filters,
      dateRange: { startDate, endDate }
    }
  };
}

async function generateFinancialSummary(companyId, propertyId, startDate, endDate) {
  // Implement financial summary generation
  return {
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    byCategory: [],
    trends: []
  };
}

async function generateRentRoll(companyId, propertyId) {
  // Implement rent roll generation
  return {
    properties: [],
    summary: {
      totalUnits: 0,
      occupiedUnits: 0,
      vacancyRate: 0,
      totalRent: 0,
      collectedRent: 0
    }
  };
}

async function generateOccupancyReport(companyId, propertyId) {
  // Implement occupancy report generation
  return {
    occupancyRate: 0,
    vacancyRate: 0,
    turnoverRate: 0,
    byProperty: []
  };
}

async function generateMaintenanceReport(companyId, propertyId, startDate, endDate) {
  // Implement maintenance report generation
  return {
    totalRequests: 0,
    completedRequests: 0,
    averageResponseTime: 0,
    totalCost: 0,
    byCategory: []
  };
}

async function generateTenantReport(companyId, propertyId) {
  // Implement tenant report generation
  return {
    totalTenants: 0,
    newTenants: 0,
    departingTenants: 0,
    satisfactionScore: 0,
    byProperty: []
  };
}

async function generatePropertyPerformance(companyId, propertyId, startDate, endDate) {
  // Implement property performance report generation
  return {
    roi: 0,
    capRate: 0,
    noi: 0,
    appreciation: 0,
    metrics: []
  };
}

async function generateExpenseReport(companyId, propertyId, startDate, endDate) {
  // Implement expense report generation
  return {
    totalExpenses: 0,
    byCategory: [],
    byProperty: [],
    trends: []
  };
}

async function sendReportToRecipients(report, reportData, recipients, message) {
  const results = {
    sent: [],
    failed: []
  };
  
  for (const recipient of recipients) {
    try {
      // Generate PDF
      const pdfBuffer = await generateReportPDF(report, reportData);
      
      // Send email
      await sendEmail({
        to: recipient.email,
        subject: `Report: ${report.title}`,
        template: 'report-delivery',
        data: {
          recipientName: recipient.name || 'Recipient',
          reportTitle: report.title,
          reportDescription: report.description,
          generatedDate: report.generatedAt.toLocaleDateString(),
          message: message || '',
          companyName: report.company?.name || 'StaySpot'
        },
        attachments: [{
          filename: `${report.reportNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }]
      });
      
      results.sent.push({
        recipient: recipient.email,
        sentAt: new Date()
      });
      
    } catch (error) {
      results.failed.push({
        recipient: recipient.email,
        error: error.message
      });
    }
  }
  
  return results;
}

function calculateNextRun(schedule) {
  const now = new Date();
  const nextRun = new Date(now);
  
  switch (schedule.frequency) {
    case 'daily':
      nextRun.setDate(nextRun.getDate() + 1);
      break;
    case 'weekly':
      nextRun.setDate(nextRun.getDate() + 7);
      break;
    case 'monthly':
      nextRun.setMonth(nextRun.getMonth() + 1);
      break;
    case 'quarterly':
      nextRun.setMonth(nextRun.getMonth() + 3);
      break;
    case 'yearly':
      nextRun.setFullYear(nextRun.getFullYear() + 1);
      break;
  }
  
  // Set specific time if provided
  if (schedule.time) {
    const [hours, minutes] = schedule.time.split(':').map(Number);
    nextRun.setHours(hours, minutes, 0, 0);
  }
  
  return nextRun;
}

async function createScheduledReportJob(report) {
  // Create a scheduled job using node-cron or similar
  console.log('Scheduled report job created:', report.id);
}

async function removeScheduledReportJob(reportId) {
  // Remove scheduled job
  console.log('Scheduled report job removed:', reportId);
}

function convertToCSV(data) {
  // Simple CSV conversion
  if (!data || typeof data !== 'object') {
    return '';
  }
  
  if (Array.isArray(data)) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const rows = data.map(row => 
      headers.map(header => 
        `"${(row[header] || '').toString().replace(/"/g, '""')}"`
      ).join(',')
    );
    
    return [headers.join(','), ...rows].join('\n');
  }
  
  // For object data, convert to array of key-value pairs
  const rows = Object.entries(data).map(([key, value]) => 
    `"${key}","${value}"`
  );
  
  return ['Key,Value', ...rows].join('\n');
}

module.exports = reportController;