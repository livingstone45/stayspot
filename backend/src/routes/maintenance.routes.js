const express = require('express')
const { body, param, query } = require('express-validator')

// Controllers
const maintenanceController = require('../controllers/maintenance/maintenance.controller')
const workOrderController = require('../controllers/maintenance/workorder.controller')
const vendorController = require('../controllers/maintenance/vendor.controller')

// Middleware
const { auth, requirePermission } = require('../middleware/auth')
const { validation } = require('../middleware/validation')
const { upload } = require('../middleware/upload')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// Maintenance Request Routes

/**
 * @route   GET /api/maintenance
 * @desc    Get maintenance requests
 * @access  Private
 */
router.get('/',
  auth,
  [
    query('status').optional().isIn(['open', 'assigned', 'in_progress', 'completed', 'cancelled']),
    query('priority').optional().isIn(['low', 'medium', 'high', 'emergency']),
    query('category').optional().isString(),
    query('propertyId').optional().isUUID(),
    query('tenantId').optional().isUUID(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(maintenanceController.getMaintenanceRequests)
)

/**
 * @route   GET /api/maintenance/:id
 * @desc    Get maintenance request by ID
 * @access  Private
 */
router.get('/:id',
  auth,
  param('id').isUUID().withMessage('Invalid maintenance request ID'),
  validation,
  asyncHandler(maintenanceController.getMaintenanceRequestById)
)

/**
 * @route   POST /api/maintenance
 * @desc    Create maintenance request
 * @access  Private
 */
router.post('/',
  auth,
  [
    body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title required'),
    body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description required'),
    body('category').isString().withMessage('Category required'),
    body('priority').isIn(['low', 'medium', 'high', 'emergency']).withMessage('Valid priority required'),
    body('propertyId').isUUID().withMessage('Property ID required'),
    body('unitId').optional().isUUID(),
    body('preferredDate').optional().isISO8601()
  ],
  validation,
  asyncHandler(maintenanceController.createMaintenanceRequest)
)

/**
 * @route   PUT /api/maintenance/:id
 * @desc    Update maintenance request
 * @access  Private
 */
router.put('/:id',
  auth,
  param('id').isUUID().withMessage('Invalid maintenance request ID'),
  validation,
  asyncHandler(maintenanceController.updateMaintenanceRequest)
)

/**
 * @route   POST /api/maintenance/:id/status
 * @desc    Update maintenance request status
 * @access  Private (Property Manager+)
 */
router.post('/:id/status',
  auth,
  requirePermission('maintenance:update'),
  param('id').isUUID().withMessage('Invalid maintenance request ID'),
  body('status').isIn(['open', 'assigned', 'in_progress', 'completed', 'cancelled']),
  body('notes').optional().trim().isLength({ max: 1000 }),
  validation,
  asyncHandler(maintenanceController.updateStatus)
)

/**
 * @route   POST /api/maintenance/:id/assign
 * @desc    Assign maintenance request
 * @access  Private (Property Manager+)
 */
router.post('/:id/assign',
  auth,
  requirePermission('maintenance:assign'),
  param('id').isUUID().withMessage('Invalid maintenance request ID'),
  body('assigneeId').isUUID().withMessage('Valid assignee ID required'),
  body('scheduledDate').optional().isISO8601(),
  validation,
  asyncHandler(maintenanceController.assignRequest)
)

/**
 * @route   POST /api/maintenance/:id/images
 * @desc    Upload maintenance request images
 * @access  Private
 */
router.post('/:id/images',
  auth,
  param('id').isUUID().withMessage('Invalid maintenance request ID'),
  upload.array('images', 10),
  asyncHandler(maintenanceController.uploadImages)
)

// Work Order Routes

/**
 * @route   GET /api/maintenance/work-orders
 * @desc    Get work orders
 * @access  Private (Property Manager+)
 */
router.get('/work-orders',
  auth,
  requirePermission('workorder:read'),
  [
    query('status').optional().isIn(['pending', 'scheduled', 'in_progress', 'completed', 'cancelled']),
    query('vendorId').optional().isUUID(),
    query('propertyId').optional().isUUID()
  ],
  validation,
  asyncHandler(workOrderController.getWorkOrders)
)

/**
 * @route   POST /api/maintenance/:id/work-orders
 * @desc    Create work order from maintenance request
 * @access  Private (Property Manager+)
 */
router.post('/:id/work-orders',
  auth,
  requirePermission('workorder:create'),
  param('id').isUUID().withMessage('Invalid maintenance request ID'),
  [
    body('vendorId').isUUID().withMessage('Vendor ID required'),
    body('scheduledDate').isISO8601().withMessage('Scheduled date required'),
    body('estimatedCost').optional().isFloat({ min: 0 }),
    body('instructions').optional().trim().isLength({ max: 1000 })
  ],
  validation,
  asyncHandler(workOrderController.createWorkOrder)
)

/**
 * @route   PUT /api/maintenance/work-orders/:id
 * @desc    Update work order
 * @access  Private (Property Manager+)
 */
router.put('/work-orders/:id',
  auth,
  requirePermission('workorder:update'),
  param('id').isUUID().withMessage('Invalid work order ID'),
  validation,
  asyncHandler(workOrderController.updateWorkOrder)
)

/**
 * @route   POST /api/maintenance/work-orders/:id/complete
 * @desc    Complete work order
 * @access  Private
 */
router.post('/work-orders/:id/complete',
  auth,
  param('id').isUUID().withMessage('Invalid work order ID'),
  body('actualCost').optional().isFloat({ min: 0 }),
  body('completionNotes').optional().trim().isLength({ max: 1000 }),
  validation,
  asyncHandler(workOrderController.completeWorkOrder)
)

// Vendor Management Routes

/**
 * @route   GET /api/maintenance/vendors
 * @desc    Get vendors
 * @access  Private (Property Manager+)
 */
router.get('/vendors',
  auth,
  requirePermission('vendor:read'),
  [
    query('category').optional().isString(),
    query('status').optional().isIn(['active', 'inactive']),
    query('search').optional().trim().isLength({ max: 100 })
  ],
  validation,
  asyncHandler(vendorController.getVendors)
)

/**
 * @route   POST /api/maintenance/vendors
 * @desc    Create vendor
 * @access  Private (Property Manager+)
 */
router.post('/vendors',
  auth,
  requirePermission('vendor:create'),
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Vendor name required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('phone').isMobilePhone().withMessage('Valid phone required'),
    body('category').isString().withMessage('Category required'),
    body('address').optional().trim().isLength({ max: 255 }),
    body('services').isArray().withMessage('Services array required')
  ],
  validation,
  asyncHandler(vendorController.createVendor)
)

/**
 * @route   PUT /api/maintenance/vendors/:id
 * @desc    Update vendor
 * @access  Private (Property Manager+)
 */
router.put('/vendors/:id',
  auth,
  requirePermission('vendor:update'),
  param('id').isUUID().withMessage('Invalid vendor ID'),
  validation,
  asyncHandler(vendorController.updateVendor)
)

/**
 * @route   DELETE /api/maintenance/vendors/:id
 * @desc    Delete vendor
 * @access  Private (Property Manager+)
 */
router.delete('/vendors/:id',
  auth,
  requirePermission('vendor:delete'),
  param('id').isUUID().withMessage('Invalid vendor ID'),
  validation,
  asyncHandler(vendorController.deleteVendor)
)

// Analytics Routes

/**
 * @route   GET /api/maintenance/analytics
 * @desc    Get maintenance analytics
 * @access  Private (Property Manager+)
 */
router.get('/analytics',
  auth,
  requirePermission('maintenance:read'),
  [
    query('period').optional().isIn(['week', 'month', 'quarter', 'year']),
    query('propertyId').optional().isUUID()
  ],
  validation,
  asyncHandler(maintenanceController.getAnalytics)
)

module.exports = router
