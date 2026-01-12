const express = require('express')
const { body, param, query } = require('express-validator')

// Controllers
const tenantController = require('../controllers/tenants/tenant.controller')
const applicationController = require('../controllers/tenants/application.controller')
const leaseController = require('../controllers/tenants/lease.controller')

// Middleware
const { auth, requirePermission } = require('../middleware/auth')
const { validation } = require('../middleware/validation')
const { upload } = require('../middleware/upload')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// Tenant Management Routes

/**
 * @route   GET /api/tenants
 * @desc    Get all tenants
 * @access  Private (Property Manager+)
 */
router.get('/',
  auth,
  requirePermission('tenant:read'),
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().trim().isLength({ max: 100 }),
    query('status').optional().isIn(['active', 'inactive', 'pending']),
    query('propertyId').optional().isUUID()
  ],
  validation,
  asyncHandler(tenantController.getTenants)
)

/**
 * @route   GET /api/tenants/:id
 * @desc    Get tenant by ID
 * @access  Private
 */
router.get('/:id',
  auth,
  param('id').isUUID().withMessage('Invalid tenant ID'),
  validation,
  asyncHandler(tenantController.getTenantById)
)

/**
 * @route   POST /api/tenants
 * @desc    Create new tenant
 * @access  Private (Property Manager+)
 */
router.post('/',
  auth,
  requirePermission('tenant:create'),
  [
    body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name required'),
    body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('phone').isMobilePhone().withMessage('Valid phone required'),
    body('dateOfBirth').optional().isISO8601(),
    body('emergencyContact').optional().isObject()
  ],
  validation,
  asyncHandler(tenantController.createTenant)
)

/**
 * @route   PUT /api/tenants/:id
 * @desc    Update tenant
 * @access  Private (Property Manager+)
 */
router.put('/:id',
  auth,
  requirePermission('tenant:update'),
  param('id').isUUID().withMessage('Invalid tenant ID'),
  validation,
  asyncHandler(tenantController.updateTenant)
)

/**
 * @route   DELETE /api/tenants/:id
 * @desc    Delete tenant
 * @access  Private (Property Manager+)
 */
router.delete('/:id',
  auth,
  requirePermission('tenant:delete'),
  param('id').isUUID().withMessage('Invalid tenant ID'),
  validation,
  asyncHandler(tenantController.deleteTenant)
)

// Application Routes

/**
 * @route   GET /api/tenants/applications
 * @desc    Get rental applications
 * @access  Private (Property Manager+)
 */
router.get('/applications',
  auth,
  requirePermission('application:read'),
  [
    query('status').optional().isIn(['pending', 'approved', 'rejected', 'withdrawn']),
    query('propertyId').optional().isUUID()
  ],
  validation,
  asyncHandler(applicationController.getApplications)
)

/**
 * @route   POST /api/tenants/applications
 * @desc    Submit rental application
 * @access  Public
 */
router.post('/applications',
  [
    body('propertyId').isUUID().withMessage('Property ID required'),
    body('unitId').optional().isUUID(),
    body('firstName').trim().isLength({ min: 2, max: 50 }),
    body('lastName').trim().isLength({ min: 2, max: 50 }),
    body('email').isEmail().normalizeEmail(),
    body('phone').isMobilePhone(),
    body('income').isFloat({ min: 0 }),
    body('employment').isObject()
  ],
  validation,
  asyncHandler(applicationController.submitApplication)
)

/**
 * @route   PUT /api/tenants/applications/:id/status
 * @desc    Update application status
 * @access  Private (Property Manager+)
 */
router.put('/applications/:id/status',
  auth,
  requirePermission('application:update'),
  param('id').isUUID().withMessage('Invalid application ID'),
  body('status').isIn(['pending', 'approved', 'rejected']),
  body('notes').optional().trim().isLength({ max: 1000 }),
  validation,
  asyncHandler(applicationController.updateApplicationStatus)
)

// Lease Management Routes

/**
 * @route   GET /api/tenants/:id/leases
 * @desc    Get tenant leases
 * @access  Private
 */
router.get('/:id/leases',
  auth,
  param('id').isUUID().withMessage('Invalid tenant ID'),
  validation,
  asyncHandler(leaseController.getTenantLeases)
)

/**
 * @route   POST /api/tenants/:id/leases
 * @desc    Create new lease
 * @access  Private (Property Manager+)
 */
router.post('/:id/leases',
  auth,
  requirePermission('lease:create'),
  param('id').isUUID().withMessage('Invalid tenant ID'),
  [
    body('propertyId').isUUID().withMessage('Property ID required'),
    body('unitId').isUUID().withMessage('Unit ID required'),
    body('startDate').isISO8601().withMessage('Valid start date required'),
    body('endDate').isISO8601().withMessage('Valid end date required'),
    body('monthlyRent').isFloat({ min: 0 }).withMessage('Valid rent amount required'),
    body('securityDeposit').isFloat({ min: 0 }).withMessage('Valid deposit required')
  ],
  validation,
  asyncHandler(leaseController.createLease)
)

/**
 * @route   PUT /api/tenants/leases/:leaseId
 * @desc    Update lease
 * @access  Private (Property Manager+)
 */
router.put('/leases/:leaseId',
  auth,
  requirePermission('lease:update'),
  param('leaseId').isUUID().withMessage('Invalid lease ID'),
  validation,
  asyncHandler(leaseController.updateLease)
)

/**
 * @route   POST /api/tenants/leases/:leaseId/terminate
 * @desc    Terminate lease
 * @access  Private (Property Manager+)
 */
router.post('/leases/:leaseId/terminate',
  auth,
  requirePermission('lease:update'),
  param('leaseId').isUUID().withMessage('Invalid lease ID'),
  body('terminationDate').isISO8601().withMessage('Valid termination date required'),
  body('reason').optional().trim().isLength({ max: 500 }),
  validation,
  asyncHandler(leaseController.terminateLease)
)

/**
 * @route   POST /api/tenants/leases/:leaseId/renew
 * @desc    Renew lease
 * @access  Private (Property Manager+)
 */
router.post('/leases/:leaseId/renew',
  auth,
  requirePermission('lease:create'),
  param('leaseId').isUUID().withMessage('Invalid lease ID'),
  body('newEndDate').isISO8601().withMessage('Valid end date required'),
  body('newRent').optional().isFloat({ min: 0 }),
  validation,
  asyncHandler(leaseController.renewLease)
)

// Document Management

/**
 * @route   POST /api/tenants/:id/documents
 * @desc    Upload tenant documents
 * @access  Private (Property Manager+)
 */
router.post('/:id/documents',
  auth,
  requirePermission('tenant:update'),
  param('id').isUUID().withMessage('Invalid tenant ID'),
  upload.array('documents', 10),
  asyncHandler(tenantController.uploadDocuments)
)

/**
 * @route   GET /api/tenants/:id/documents
 * @desc    Get tenant documents
 * @access  Private
 */
router.get('/:id/documents',
  auth,
  param('id').isUUID().withMessage('Invalid tenant ID'),
  validation,
  asyncHandler(tenantController.getDocuments)
)

module.exports = router
