const express = require('express');
const router = express.Router();
const systemController = require('../controllers/system/system.controller');
const auditController = require('../controllers/system/audit.controller');
const analyticsController = require('../controllers/system/analytics.controller');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);

// System configuration routes
router.get('/system/config', requireRole('system_admin'), systemController.getSystemConfig);
router.put('/system/config', requireRole('system_admin'), systemController.updateSystemConfig);
router.get('/system/status', requireRole(['system_admin', 'company_admin']), systemController.getSystemStatus);
router.get('/system/health', requireRole(['system_admin', 'company_admin']), systemController.getSystemHealth);
router.post('/system/backup', requireRole('system_admin'), systemController.createBackup);
router.get('/system/backups', requireRole(['system_admin']), systemController.getAllBackups);
router.post('/system/backups/:id/restore', requireRole(['system_admin']), systemController.restoreBackup);
router.delete('/system/backups/:id', requireRole(['system_admin']), systemController.deleteBackup);
router.post('/system/maintenance/enable', requireRole(['system_admin']), systemController.enableMaintenanceMode);
router.post('/system/maintenance/disable', requireRole(['system_admin']), systemController.disableMaintenanceMode);
router.get('/system/logs', requireRole(['system_admin']), systemController.getSystemLogs);
router.get('/system/logs/:type', requireRole(['system_admin']), systemController.getLogsByType);
router.post('/system/logs/clear', requireRole(['system_admin']), systemController.clearLogs);
router.get('/system/metrics', requireRole(['system_admin']), systemController.getSystemMetrics);
router.get('/system/performance', requireRole(['system_admin']), systemController.getPerformanceMetrics);
router.post('/system/cache/clear', requireRole(['system_admin']), systemController.clearCache);
router.post('/system/cache/warm', requireRole(['system_admin']), systemController.warmCache);
router.get('/system/queue/status', requireRole(['system_admin']), systemController.getQueueStatus);
router.post('/system/queue/process', requireRole(['system_admin']), systemController.processQueue);
router.get('/system/jobs', requireRole(['system_admin']), systemController.getAllJobs);
router.get('/system/jobs/:id', requireRole(['system_admin']), systemController.getJobById);
router.post('/system/jobs', requireRole(['system_admin']), systemController.createJob);
router.put('/system/jobs/:id', requireRole(['system_admin']), systemController.updateJob);
router.delete('/system/jobs/:id', requireRole(['system_admin']), systemController.deleteJob);
router.post('/system/jobs/:id/run', requireRole(['system_admin']), systemController.runJob);
router.post('/system/jobs/:id/pause', requireRole(['system_admin']), systemController.pauseJob);
router.post('/system/jobs/:id/resume', requireRole(['system_admin']), systemController.resumeJob);
router.get('/system/jobs/:id/logs', requireRole(['system_admin']), systemController.getJobLogs);

// Audit log routes
router.get('/audit/logs', requireRole(['system_admin']), auditController.getAllAuditLogs);
router.get('/audit/logs/:id', requireRole(['system_admin']), auditController.getAuditLogById);
router.get('/audit/logs/user/:userId', requireRole(['system_admin']), auditController.getAuditLogsByUser);
router.get('/audit/logs/action/:action', requireRole(['system_admin']), auditController.getAuditLogsByAction);
router.get('/audit/logs/entity/:entityType/:entityId', requireRole(['system_admin']), auditController.getAuditLogsByEntity);
router.get('/audit/logs/date-range', requireRole(['system_admin']), auditController.getAuditLogsByDateRange);
router.get('/audit/logs/search', requireRole(['system_admin']), auditController.searchAuditLogs);
router.post('/audit/logs/export', requireRole(['system_admin']), auditController.exportAuditLogs);
router.get('/audit/stats/overview', requireRole(['system_admin']), auditController.getAuditStats);
router.get('/audit/patterns', requireRole(['system_admin']), auditController.getAuditPatterns);
router.post('/audit/logs/cleanup', requireRole(['system_admin']), auditController.cleanupAuditLogs);

// Analytics routes
router.get('/analytics/overview', requireRole(['system_admin', 'company_admin', 'portfolio_manager']), analyticsController.getAnalyticsOverview);
router.get('/analytics/users', requireRole(['system_admin', 'company_admin']), analyticsController.getUserAnalytics);
router.get('/analytics/properties', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager']), analyticsController.getPropertyAnalytics);
router.get('/analytics/financial', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager', 'financial_controller']), analyticsController.getFinancialAnalytics);
router.get('/analytics/maintenance', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager', 'maintenance_supervisor']), analyticsController.getMaintenanceAnalytics);
router.get('/analytics/tenants', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager', 'leasing_specialist']), analyticsController.getTenantAnalytics);
router.get('/analytics/tasks', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager', 'leasing_specialist', 'maintenance_supervisor']), analyticsController.getTaskAnalytics);
router.get('/analytics/performance', requireRole(['system_admin', 'company_admin', 'portfolio_manager']), analyticsController.getPerformanceAnalytics);
router.get('/analytics/usage', requireRole(['system_admin', 'company_admin']), analyticsController.getUsageAnalytics);
router.get('/analytics/revenue', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager', 'financial_controller']), analyticsController.getRevenueAnalytics);
router.get('/analytics/occupancy', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager']), analyticsController.getOccupancyAnalytics);
router.get('/analytics/churn', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager']), analyticsController.getChurnAnalytics);
router.get('/analytics/predictive', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager']), analyticsController.getPredictiveAnalytics);
router.get('/analytics/custom', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager']), analyticsController.getCustomAnalytics);
router.post('/analytics/query', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager']), analyticsController.executeAnalyticsQuery);
router.get('/analytics/dashboards', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager']), analyticsController.getAllDashboards);
router.get('/analytics/dashboards/:id', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager']), analyticsController.getDashboardById);
router.post('/analytics/dashboards', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager']), analyticsController.createDashboard);
router.put('/analytics/dashboards/:id', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager']), analyticsController.updateDashboard);
router.delete('/analytics/dashboards/:id', requireRole(['system_admin', 'company_admin']), analyticsController.deleteDashboard);
router.post('/analytics/dashboards/:id/share', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager']), analyticsController.shareDashboard);
router.get('/analytics/widgets', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager']), analyticsController.getAllWidgets);
router.post('/analytics/widgets', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager']), analyticsController.createWidget);
router.put('/analytics/widgets/:id', requireRole(['system_admin', 'company_admin', 'portfolio_manager', 'property_manager']), analyticsController.updateWidget);
router.delete('/analytics/widgets/:id', requireRole(['system_admin', 'company_admin']), analyticsController.deleteWidget);

// System monitoring routes
router.get('/monitoring/real-time', requireRole(['system_admin']), systemController.getRealTimeMonitoring);
router.get('/monitoring/alerts', requireRole(['system_admin', 'company_admin']), systemController.getAllAlerts);
router.get('/monitoring/alerts/:id', requireRole(['system_admin', 'company_admin']), systemController.getAlertById);
router.post('/monitoring/alerts', requireRole(['system_admin']), systemController.createAlert);
router.put('/monitoring/alerts/:id', requireRole(['system_admin']), systemController.updateAlert);
router.delete('/monitoring/alerts/:id', requireRole(['system_admin']), systemController.deleteAlert);
router.put('/monitoring/alerts/:id/status', requireRole(['system_admin', 'company_admin']), systemController.updateAlertStatus);
router.get('/monitoring/alerts/unresolved', requireRole(['system_admin', 'company_admin']), systemController.getUnresolvedAlerts);
router.post('/monitoring/alerts/:id/resolve', requireRole(['system_admin', 'company_admin']), systemController.resolveAlert);
router.get('/monitoring/thresholds', requireRole(['system_admin']), systemController.getMonitoringThresholds);
router.put('/monitoring/thresholds', requireRole(['system_admin']), systemController.updateMonitoringThresholds);
router.get('/monitoring/events', requireRole(['system_admin']), systemController.getSystemEvents);
router.get('/monitoring/events/:id', requireRole(['system_admin']), systemController.getEventById);
router.post('/monitoring/events', requireRole(['system_admin']), systemController.createEvent);
router.delete('/monitoring/events/:id', requireRole(['system_admin']), systemController.deleteEvent);

// API management routes
router.get('/api/endpoints', requireRole(['system_admin']), systemController.getAllApiEndpoints);
router.get('/api/endpoints/:id', requireRole(['system_admin']), systemController.getApiEndpointById);
router.post('/api/endpoints', requireRole(['system_admin']), systemController.createApiEndpoint);
router.put('/api/endpoints/:id', requireRole(['system_admin']), systemController.updateApiEndpoint);
router.delete('/api/endpoints/:id', requireRole(['system_admin']), systemController.deleteApiEndpoint);
router.get('/api/usage', requireRole(['system_admin', 'company_admin']), systemController.getApiUsage);
router.get('/api/rate-limits', requireRole(['system_admin']), systemController.getRateLimits);
router.put('/api/rate-limits', requireRole(['system_admin']), systemController.updateRateLimits);
router.get('/api/keys', requireRole(['system_admin']), systemController.getAllApiKeys);
router.post('/api/keys', requireRole(['system_admin']), systemController.createApiKey);
router.put('/api/keys/:id', requireRole(['system_admin']), systemController.updateApiKey);
router.delete('/api/keys/:id', requireRole(['system_admin']), systemController.deleteApiKey);
router.post('/api/keys/:id/regenerate', requireRole(['system_admin']), systemController.regenerateApiKey);
router.get('/api/keys/:id/usage', requireRole(['system_admin']), systemController.getApiKeyUsage);

// Data management routes
router.get('/data/export', requireRole(['system_admin', 'company_admin']), systemController.exportData);
router.post('/data/import', requireRole(['system_admin', 'company_admin']), systemController.importData);
router.get('/data/quality', requireRole(['system_admin', 'company_admin']), systemController.checkDataQuality);
router.post('/data/clean', requireRole(['system_admin', 'company_admin']), systemController.cleanData);
router.get('/data/migration', requireRole(['system_admin']), systemController.getMigrationStatus);
router.post('/data/migration', requireRole(['system_admin']), systemController.runMigration);
router.get('/data/backup/schedule', requireRole(['system_admin']), systemController.getBackupSchedule);
router.put('/data/backup/schedule', requireRole(['system_admin']), systemController.updateBackupSchedule);
router.get('/data/storage', requireRole(['system_admin']), systemController.getStorageUsage);
router.post('/data/storage/cleanup', requireRole(['system_admin']), systemController.cleanupStorage);

// System update and deployment routes
router.get('/system/updates', requireRole(['system_admin']), systemController.getSystemUpdates);
router.post('/system/updates/check', requireRole(['system_admin']), systemController.checkForUpdates);
router.post('/system/updates/apply', requireRole(['system_admin']), systemController.applyUpdate);
router.get('/system/deployment', requireRole(['system_admin']), systemController.getDeploymentStatus);
router.post('/system/deployment/deploy', requireRole(['system_admin']), systemController.deploySystem);
router.post('/system/deployment/rollback', requireRole(['system_admin']), systemController.rollbackDeployment);
router.get('/system/version', systemController.getSystemVersion);
router.get('/system/changelog', systemController.getChangelog);

// System integration routes
router.get('/system/integrations/status', requireRole(['system_admin', 'company_admin']), systemController.getIntegrationStatus);
router.post('/system/integrations/test', requireRole(['system_admin', 'company_admin']), systemController.testIntegrations);
router.get('/system/webhooks/status', requireRole(['system_admin', 'company_admin']), systemController.getWebhookStatus);
router.post('/system/webhooks/test', requireRole(['system_admin', 'company_admin']), systemController.testWebhooks);

// System audit and compliance
router.get('/compliance/check', requireRole(['system_admin', 'company_admin']), systemController.complianceCheck);
router.get('/compliance/report', requireRole(['system_admin', 'company_admin']), systemController.generateComplianceReport);
router.get('/compliance/requirements', requireRole(['system_admin', 'company_admin']), systemController.getComplianceRequirements);
router.post('/compliance/requirements', requireRole(['system_admin', 'company_admin']), systemController.updateComplianceRequirements);
router.get('/security/audit', requireRole(['system_admin']), systemController.securityAudit);
router.post('/security/scan', requireRole(['system_admin']), systemController.securityScan);
router.get('/security/vulnerabilities', requireRole(['system_admin']), systemController.getSecurityVulnerabilities);
router.post('/security/vulnerabilities/:id/fix', requireRole(['system_admin']), systemController.fixSecurityVulnerability);

module.exports = router;