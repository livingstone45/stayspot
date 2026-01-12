const express = require('express');
const { query, param, body } = require('express-validator');
const paymentController = require('../../controllers/financial/payment.controller');
const { auth, requirePermission } = require('../../middleware/auth');
const { validation } = require('../../middleware/validation');
const { asyncHandler } = require('../../middleware/errorHandler');

const router = express.Router();

// Specific routes first (before :id routes)

/**
 * @route   GET /api/payments/settings
 * @desc    Get payment settings
 * @access  Private
 */
router.get('/settings',
  auth,
  asyncHandler(paymentController.getPaymentSettings)
);

/**
 * @route   PUT /api/payments/settings
 * @desc    Update payment settings
 * @access  Private
 */
router.put('/settings',
  auth,
  [
    body('paymentMethods').optional().isArray(),
    body('autoPaymentEnabled').optional().isBoolean(),
    body('paymentDueDay').optional().isInt({ min: 1, max: 31 }),
    body('lateFeePercentage').optional().isFloat({ min: 0 }),
    body('lateFeeType').optional().isIn(['percentage', 'fixed']),
    body('gracePeriodDays').optional().isInt({ min: 0 }),
    body('notificationDays').optional().isInt({ min: 1 }),
    body('refundPolicy').optional().isIn(['full', 'partial', 'store_credit']),
    body('refundProcessingDays').optional().isInt({ min: 1 })
  ],
  validation,
  asyncHandler(paymentController.updatePaymentSettings)
);

/**
 * @route   GET /api/payments/statistics
 * @desc    Get payment statistics
 * @access  Private
 */
router.get('/statistics',
  auth,
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('propertyId').optional().isUUID()
  ],
  validation,
  asyncHandler(paymentController.getPaymentStatistics)
);

/**
 * @route   GET /api/payments/export
 * @desc    Export payments
 * @access  Private
 */
router.get('/export',
  auth,
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('format').optional().isIn(['csv', 'json'])
  ],
  validation,
  asyncHandler(paymentController.exportPayments)
);

/**
 * @route   POST /api/payments/generate-rent
 * @desc    Generate rent payments
 * @access  Private
 */
router.post('/generate-rent',
  auth,
  [
    body('month').optional().isInt({ min: 1, max: 12 }),
    body('year').optional().isInt({ min: 2000 })
  ],
  validation,
  asyncHandler(paymentController.generateRentPayments)
);

/**
 * @route   POST /api/payments/apply-late-fees
 * @desc    Apply late fees
 * @access  Private
 */
router.post('/apply-late-fees',
  auth,
  [
    body('gracePeriodDays').optional().isInt({ min: 0 }),
    body('lateFeeAmount').optional().isFloat({ min: 0 }),
    body('lateFeeType').optional().isIn(['fixed', 'percentage'])
  ],
  validation,
  asyncHandler(paymentController.applyLateFees)
);

// Generic routes

/**
 * @route   GET /api/payments
 * @desc    Get all payments
 * @access  Private
 */
router.get('/',
  auth,
  [
    query('status').optional().isIn(['pending', 'completed', 'failed', 'overdue', 'partially_paid', 'cancelled']),
    query('type').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(paymentController.getAllPayments)
);

/**
 * @route   POST /api/payments
 * @desc    Create payment
 * @access  Private
 */
router.post('/',
  auth,
  [
    body('tenantId').isUUID().withMessage('Tenant ID required'),
    body('leaseId').isUUID().withMessage('Lease ID required'),
    body('amount').isFloat({ min: 0 }).withMessage('Valid amount required'),
    body('dueDate').isISO8601().withMessage('Valid due date required'),
    body('type').optional().isString(),
    body('description').optional().isString()
  ],
  validation,
  asyncHandler(paymentController.createPayment)
);

/**
 * @route   GET /api/payments/:id
 * @desc    Get payment by ID
 * @access  Private
 */
router.get('/:id',
  auth,
  param('id').isUUID().withMessage('Invalid payment ID'),
  validation,
  asyncHandler(paymentController.getPaymentById)
);

/**
 * @route   POST /api/payments/:id/process
 * @desc    Process payment
 * @access  Private
 */
router.post('/:id/process',
  auth,
  param('id').isUUID().withMessage('Invalid payment ID'),
  [
    body('amount').isFloat({ min: 0 }).withMessage('Valid amount required'),
    body('paymentMethod').optional().isString(),
    body('transactionId').optional().isString()
  ],
  validation,
  asyncHandler(paymentController.processPayment)
);

/**
 * @route   POST /api/payments/:id/record-manual
 * @desc    Record manual payment
 * @access  Private
 */
router.post('/:id/record-manual',
  auth,
  param('id').isUUID().withMessage('Invalid payment ID'),
  [
    body('amount').isFloat({ min: 0 }).withMessage('Valid amount required'),
    body('paymentMethod').optional().isString(),
    body('referenceNumber').optional().isString()
  ],
  validation,
  asyncHandler(paymentController.recordManualPayment)
);

/**
 * @route   POST /api/payments/:id/void
 * @desc    Void/cancel payment
 * @access  Private
 */
router.post('/:id/void',
  auth,
  param('id').isUUID().withMessage('Invalid payment ID'),
  [
    body('reason').optional().isString(),
    body('refundAmount').optional().isFloat({ min: 0 })
  ],
  validation,
  asyncHandler(paymentController.voidPayment)
);

module.exports = router;
