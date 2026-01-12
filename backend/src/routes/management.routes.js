const express = require('express')
const { body, param, query } = require('express-validator')

// Controllers
const companyController = require('../controllers/management/company.controller')
const portfolioController = require('../controllers/management/portfolio.controller')
const teamController = require('../controllers/management/team.controller')
const dashboardController = require('../controllers/management/dashboard.controller')
const propertyDocumentsController = require('../controllers/management/property-documents.controller')
const tenantVerificationController = require('../controllers/management/tenant-verification.controller')
const landlordVerificationController = require('../controllers/management/landlord-verification.controller')
const managerVerificationController = require('../controllers/management/manager-verification.controller')

// Middleware
const { auth, requireRole, requirePermission } = require('../middleware/auth')
const { validation } = require('../middleware/validation')
const { upload } = require('../middleware/upload')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// Manager Verification Routes

router.get('/managers/verification',
  auth,
  requirePermission('manager:verify'),
  [
    query('search').optional().trim().isLength({ max: 100 }),
    query('status').optional().isIn(['pending', 'verified', 'rejected', 'under_review']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(managerVerificationController.getManagerVerifications)
)

router.get('/managers/:managerId/verification',
  auth,
  requirePermission('manager:verify'),
  param('managerId').isUUID().withMessage('Invalid manager ID'),
  validation,
  asyncHandler(managerVerificationController.getManagerVerification)
)

router.put('/managers/:managerId/verify',
  auth,
  requirePermission('manager:verify'),
  param('managerId').isUUID().withMessage('Invalid manager ID'),
  [
    body('status').isIn(['pending', 'verified', 'rejected', 'under_review']).withMessage('Invalid status'),
    body('notes').optional().trim().isLength({ max: 1000 }),
    body('verifiedAt').optional().isISO8601()
  ],
  validation,
  asyncHandler(managerVerificationController.updateManagerVerification)
)

router.get('/managers/verification/export',
  auth,
  requirePermission('manager:verify'),
  [
    query('status').optional().isIn(['pending', 'verified', 'rejected', 'under_review']),
    query('format').optional().isIn(['csv', 'json'])
  ],
  validation,
  asyncHandler(managerVerificationController.exportVerificationReport)
)

router.get('/managers/verification/stats',
  auth,
  requirePermission('manager:verify'),
  asyncHandler(managerVerificationController.getManagerStats)
)

// Landlord Verification Routes

router.get('/landlords/verification',
  auth,
  requirePermission('landlord:verify'),
  [
    query('search').optional().trim().isLength({ max: 100 }),
    query('status').optional().isIn(['pending', 'verified', 'rejected', 'under_review']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(landlordVerificationController.getLandlordVerifications)
)

router.get('/landlords/:landlordId/verification',
  auth,
  requirePermission('landlord:verify'),
  param('landlordId').isUUID().withMessage('Invalid landlord ID'),
  validation,
  asyncHandler(landlordVerificationController.getLandlordVerification)
)

router.put('/landlords/:landlordId/verify',
  auth,
  requirePermission('landlord:verify'),
  param('landlordId').isUUID().withMessage('Invalid landlord ID'),
  [
    body('status').isIn(['pending', 'verified', 'rejected', 'under_review']).withMessage('Invalid status'),
    body('notes').optional().trim().isLength({ max: 1000 }),
    body('verifiedAt').optional().isISO8601()
  ],
  validation,
  asyncHandler(landlordVerificationController.updateLandlordVerification)
)

router.get('/landlords/verification/export',
  auth,
  requirePermission('landlord:verify'),
  [
    query('status').optional().isIn(['pending', 'verified', 'rejected', 'under_review']),
    query('format').optional().isIn(['csv', 'json'])
  ],
  validation,
  asyncHandler(landlordVerificationController.exportVerificationReport)
)

router.get('/landlords/verification/stats',
  auth,
  requirePermission('landlord:verify'),
  asyncHandler(landlordVerificationController.getLandlordStats)
)

// Tenant Verification Routes

router.get('/tenants/verification',
  auth,
  requirePermission('tenant:verify'),
  [
    query('search').optional().trim().isLength({ max: 100 }),
    query('status').optional().isIn(['pending', 'verified', 'rejected', 'under_review']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(tenantVerificationController.getTenantVerifications)
)

router.get('/tenants/:tenantId/verification',
  auth,
  requirePermission('tenant:verify'),
  param('tenantId').isUUID().withMessage('Invalid tenant ID'),
  validation,
  asyncHandler(tenantVerificationController.getTenantVerification)
)

router.put('/tenants/:tenantId/verify',
  auth,
  requirePermission('tenant:verify'),
  param('tenantId').isUUID().withMessage('Invalid tenant ID'),
  [
    body('status').isIn(['pending', 'verified', 'rejected', 'under_review']).withMessage('Invalid status'),
    body('notes').optional().trim().isLength({ max: 1000 }),
    body('verifiedAt').optional().isISO8601()
  ],
  validation,
  asyncHandler(tenantVerificationController.updateTenantVerification)
)

router.get('/tenants/verification/export',
  auth,
  requirePermission('tenant:verify'),
  [
    query('status').optional().isIn(['pending', 'verified', 'rejected', 'under_review']),
    query('format').optional().isIn(['csv', 'json'])
  ],
  validation,
  asyncHandler(tenantVerificationController.exportVerificationReport)
)

router.get('/tenants/verification/stats',
  auth,
  requirePermission('tenant:verify'),
  asyncHandler(tenantVerificationController.getVerificationStats)
)

module.exports = router
