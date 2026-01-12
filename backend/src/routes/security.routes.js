const express = require('express');
const { query, param, body } = require('express-validator');
const permissionsController = require('../controllers/security/permissions.controller');
const auditController = require('../controllers/security/audit.controller');
const dataController = require('../controllers/security/data.controller');
const complianceController = require('../controllers/security/compliance.controller');
const { auth, requirePermission } = require('../middleware/auth');
const { validation } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Roles
router.get('/roles',
  auth,
  requirePermission('role:view'),
  [
    query('search').optional().trim().isLength({ max: 100 }),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(permissionsController.getRoles)
);

router.get('/roles/:roleId',
  auth,
  requirePermission('role:view'),
  param('roleId').isUUID(),
  validation,
  asyncHandler(permissionsController.getRole)
);

router.post('/roles',
  auth,
  requirePermission('role:create'),
  [
    body('name').trim().isLength({ min: 1, max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
    body('permissions').optional().isArray()
  ],
  validation,
  asyncHandler(permissionsController.createRole)
);

router.put('/roles/:roleId',
  auth,
  requirePermission('role:edit'),
  param('roleId').isUUID(),
  [
    body('name').optional().trim().isLength({ min: 1, max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
    body('permissions').optional().isArray()
  ],
  validation,
  asyncHandler(permissionsController.updateRole)
);

router.delete('/roles/:roleId',
  auth,
  requirePermission('role:delete'),
  param('roleId').isUUID(),
  validation,
  asyncHandler(permissionsController.deleteRole)
);

// Permissions
router.get('/permissions',
  auth,
  requirePermission('permission:view'),
  [
    query('category').optional().trim()
  ],
  validation,
  asyncHandler(permissionsController.getPermissions)
);

router.get('/permissions/categories',
  auth,
  requirePermission('permission:view'),
  asyncHandler(permissionsController.getPermissionCategories)
);

// User Roles
router.get('/user-roles',
  auth,
  requirePermission('user:view'),
  [
    query('search').optional().trim().isLength({ max: 100 }),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(permissionsController.getUserRoles)
);

router.post('/user-roles/assign',
  auth,
  requirePermission('user:edit'),
  [
    body('userId').isUUID(),
    body('roleId').isUUID()
  ],
  validation,
  asyncHandler(permissionsController.assignRoleToUser)
);

router.post('/user-roles/remove',
  auth,
  requirePermission('user:edit'),
  [
    body('userId').isUUID(),
    body('roleId').isUUID()
  ],
  validation,
  asyncHandler(permissionsController.removeRoleFromUser)
);

// Permission Stats
router.get('/stats',
  auth,
  requirePermission('permission:view'),
  asyncHandler(permissionsController.getPermissionStats)
);

// Audit Logs
router.get('/audit',
  auth,
  requirePermission('audit:view'),
  [
    query('action').optional().trim(),
    query('user_id').optional().isUUID(),
    query('resource_type').optional().trim(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(auditController.getAuditLogs)
);

router.get('/audit/:logId',
  auth,
  requirePermission('audit:view'),
  param('logId').isUUID(),
  validation,
  asyncHandler(auditController.getAuditLog)
);

router.post('/audit',
  auth,
  requirePermission('audit:create'),
  [
    body('action').trim().isLength({ min: 1, max: 50 }),
    body('resource_type').trim().isLength({ min: 1, max: 50 }),
    body('resource_id').optional().trim(),
    body('changes').optional().isObject(),
    body('ip_address').optional().trim(),
    body('user_agent').optional().trim()
  ],
  validation,
  asyncHandler(auditController.createAuditLog)
);

router.get('/audit/stats/summary',
  auth,
  requirePermission('audit:view'),
  asyncHandler(auditController.getAuditStats)
);

router.get('/audit/stats/by-action',
  auth,
  requirePermission('audit:view'),
  asyncHandler(auditController.getAuditLogsByAction)
);

router.get('/audit/stats/by-user',
  auth,
  requirePermission('audit:view'),
  asyncHandler(auditController.getAuditLogsByUser)
);

router.get('/audit/stats/by-resource',
  auth,
  requirePermission('audit:view'),
  asyncHandler(auditController.getAuditLogsByResource)
);

router.get('/audit/timeline',
  auth,
  requirePermission('audit:view'),
  [
    query('days').optional().isInt({ min: 1, max: 365 })
  ],
  validation,
  asyncHandler(auditController.getAuditTimeline)
);

router.get('/audit/export',
  auth,
  requirePermission('audit:view'),
  [
    query('action').optional().trim(),
    query('user_id').optional().isUUID(),
    query('resource_type').optional().trim(),
    query('format').optional().isIn(['csv', 'json'])
  ],
  validation,
  asyncHandler(auditController.exportAuditLogs)
);

// Data Management
router.get('/data/overview',
  auth,
  requirePermission('data:view'),
  asyncHandler(dataController.getDataOverview)
);

router.get('/data/backups',
  auth,
  requirePermission('data:view'),
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(dataController.getBackups)
);

router.post('/data/backups',
  auth,
  requirePermission('data:create'),
  [
    body('backup_type').trim().isIn(['full', 'incremental']),
    body('description').optional().trim()
  ],
  validation,
  asyncHandler(dataController.createBackup)
);

router.post('/data/backups/:backupId/restore',
  auth,
  requirePermission('data:edit'),
  param('backupId').isUUID(),
  validation,
  asyncHandler(dataController.restoreBackup)
);

router.delete('/data/backups/:backupId',
  auth,
  requirePermission('data:delete'),
  param('backupId').isUUID(),
  validation,
  asyncHandler(dataController.deleteBackup)
);

router.get('/data/retention',
  auth,
  requirePermission('data:view'),
  asyncHandler(dataController.getRetentionPolicies)
);

router.put('/data/retention/:policyId',
  auth,
  requirePermission('data:edit'),
  param('policyId').isUUID(),
  [
    body('retention_days').isInt({ min: 1, max: 2555 }),
    body('auto_delete').isBoolean()
  ],
  validation,
  asyncHandler(dataController.updateRetentionPolicy)
);

router.get('/data/exports',
  auth,
  requirePermission('data:view'),
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(dataController.getExportRequests)
);

router.post('/data/exports',
  auth,
  requirePermission('data:create'),
  [
    body('data_type').trim().isIn(['users', 'properties', 'tenants', 'all']),
    body('format').trim().isIn(['csv', 'json', 'xml'])
  ],
  validation,
  asyncHandler(dataController.createExportRequest)
);

router.get('/data/privacy',
  auth,
  requirePermission('data:view'),
  asyncHandler(dataController.getPrivacySettings)
);

router.put('/data/privacy',
  auth,
  requirePermission('data:edit'),
  [
    body('data_encryption').isBoolean(),
    body('anonymization').isBoolean(),
    body('gdpr_compliant').isBoolean()
  ],
  validation,
  asyncHandler(dataController.updatePrivacySettings)
);

router.get('/data/deletions',
  auth,
  requirePermission('data:view'),
  [
    query('status').optional().isIn(['pending', 'approved', 'completed']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(dataController.getDeletionRequests)
);

router.post('/data/deletions',
  auth,
  requirePermission('data:create'),
  [
    body('user_id').isUUID(),
    body('reason').optional().trim()
  ],
  validation,
  asyncHandler(dataController.createDeletionRequest)
);

router.post('/data/deletions/:requestId/approve',
  auth,
  requirePermission('data:edit'),
  param('requestId').isUUID(),
  validation,
  asyncHandler(dataController.approveDeletionRequest)
);

router.get('/data/stats',
  auth,
  requirePermission('data:view'),
  asyncHandler(dataController.getDataStats)
);

// Compliance
router.get('/compliance/overview',
  auth,
  requirePermission('compliance:view'),
  asyncHandler(complianceController.getComplianceOverview)
);

router.get('/compliance/standards',
  auth,
  requirePermission('compliance:view'),
  [
    query('search').optional().trim().isLength({ max: 100 }),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(complianceController.getComplianceStandards)
);

router.post('/compliance/standards',
  auth,
  requirePermission('compliance:create'),
  [
    body('name').trim().isLength({ min: 1, max: 100 }),
    body('description').optional().trim(),
    body('category').trim().isLength({ min: 1, max: 50 }),
    body('requirements').optional().isArray()
  ],
  validation,
  asyncHandler(complianceController.createComplianceStandard)
);

router.get('/compliance/certifications',
  auth,
  requirePermission('compliance:view'),
  [
    query('status').optional().isIn(['active', 'expired', 'pending']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(complianceController.getCertifications)
);

router.post('/compliance/certifications',
  auth,
  requirePermission('compliance:create'),
  [
    body('name').trim().isLength({ min: 1, max: 100 }),
    body('issuer').trim().isLength({ min: 1, max: 100 }),
    body('issue_date').isISO8601(),
    body('expiry_date').isISO8601(),
    body('certificate_number').trim().isLength({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(complianceController.createCertification)
);

router.get('/compliance/audits',
  auth,
  requirePermission('compliance:view'),
  [
    query('status').optional().isIn(['pending', 'in_progress', 'completed']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(complianceController.getAudits)
);

router.post('/compliance/audits',
  auth,
  requirePermission('compliance:create'),
  [
    body('audit_type').trim().isLength({ min: 1, max: 50 }),
    body('audit_date').isISO8601(),
    body('auditor').trim().isLength({ min: 1, max: 100 }),
    body('findings').optional().isArray(),
    body('status').isIn(['pending', 'in_progress', 'completed'])
  ],
  validation,
  asyncHandler(complianceController.createAudit)
);

router.get('/compliance/violations',
  auth,
  requirePermission('compliance:view'),
  [
    query('status').optional().isIn(['open', 'in_progress', 'resolved']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(complianceController.getViolations)
);

router.post('/compliance/violations',
  auth,
  requirePermission('compliance:create'),
  [
    body('standard_id').isUUID(),
    body('description').trim().isLength({ min: 1, max: 500 }),
    body('severity').isIn(['low', 'medium', 'high', 'critical']),
    body('remediation_plan').optional().trim()
  ],
  validation,
  asyncHandler(complianceController.createViolation)
);

router.put('/compliance/violations/:violationId',
  auth,
  requirePermission('compliance:edit'),
  param('violationId').isUUID(),
  [
    body('status').isIn(['open', 'in_progress', 'resolved'])
  ],
  validation,
  asyncHandler(complianceController.updateViolationStatus)
);

router.get('/compliance/reports',
  auth,
  requirePermission('compliance:view'),
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(complianceController.getComplianceReports)
);

router.post('/compliance/reports',
  auth,
  requirePermission('compliance:create'),
  [
    body('report_type').trim().isIn(['quarterly', 'annual', 'audit']),
    body('period').trim().isLength({ min: 1, max: 50 })
  ],
  validation,
  asyncHandler(complianceController.generateComplianceReport)
);

router.get('/compliance/stats',
  auth,
  requirePermission('compliance:view'),
  asyncHandler(complianceController.getComplianceStats)
);

module.exports = router;
