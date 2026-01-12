const express = require('express')
const { body, param, query } = require('express-validator')

// Controllers
const paymentController = require('../controllers/financial/payment.controller')
const invoiceController = require('../controllers/financial/invoice.controller')
const transactionController = require('../controllers/financial/transaction.controller')

// Middleware
const { auth, requirePermission } = require('../middleware/auth')
const { validation } = require('../middleware/validation')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// Payment Routes

/**
 * @route   GET /api/financial/payments
 * @desc    Get payments
 * @access  Private (Property Manager+)
 */
router.get('/payments',
  auth,
  requirePermission('payment:read'),
  [
    query('status').optional().isIn(['pending', 'completed', 'failed', 'refunded']),
    query('tenantId').optional().isUUID(),
    query('propertyId').optional().isUUID(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(paymentController.getPayments)
)

/**
 * @route   GET /api/financial/payments/:id
 * @desc    Get payment by ID
 * @access  Private
 */
router.get('/payments/:id',
  auth,
  param('id').isUUID().withMessage('Invalid payment ID'),
  validation,
  asyncHandler(paymentController.getPaymentById)
)

/**
 * @route   POST /api/financial/payments
 * @desc    Process payment
 * @access  Private
 */
router.post('/payments',
  auth,
  [
    body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount required'),
    body('tenantId').isUUID().withMessage('Tenant ID required'),
    body('propertyId').isUUID().withMessage('Property ID required'),
    body('paymentMethod').isIn(['card', 'bank', 'cash', 'check']).withMessage('Valid payment method required'),
    body('description').optional().trim().isLength({ max: 255 })
  ],
  validation,
  asyncHandler(paymentController.processPayment)
)

/**
 * @route   POST /api/financial/payments/:id/refund
 * @desc    Refund payment
 * @access  Private (Property Manager+)
 */
router.post('/payments/:id/refund',
  auth,
  requirePermission('payment:refund'),
  param('id').isUUID().withMessage('Invalid payment ID'),
  body('amount').optional().isFloat({ min: 0.01 }),
  body('reason').trim().isLength({ min: 5, max: 500 }).withMessage('Refund reason required'),
  validation,
  asyncHandler(paymentController.refundPayment)
)

// Invoice Routes

/**
 * @route   GET /api/financial/invoices
 * @desc    Get invoices
 * @access  Private (Property Manager+)
 */
router.get('/invoices',
  auth,
  requirePermission('invoice:read'),
  [
    query('status').optional().isIn(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
    query('tenantId').optional().isUUID(),
    query('propertyId').optional().isUUID(),
    query('dueDate').optional().isISO8601()
  ],
  validation,
  asyncHandler(invoiceController.getInvoices)
)

/**
 * @route   POST /api/financial/invoices
 * @desc    Create invoice
 * @access  Private (Property Manager+)
 */
router.post('/invoices',
  auth,
  requirePermission('invoice:create'),
  [
    body('tenantId').isUUID().withMessage('Tenant ID required'),
    body('propertyId').isUUID().withMessage('Property ID required'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount required'),
    body('dueDate').isISO8601().withMessage('Valid due date required'),
    body('description').trim().isLength({ min: 5, max: 500 }).withMessage('Description required'),
    body('items').isArray().withMessage('Invoice items required')
  ],
  validation,
  asyncHandler(invoiceController.createInvoice)
)

/**
 * @route   PUT /api/financial/invoices/:id
 * @desc    Update invoice
 * @access  Private (Property Manager+)
 */
router.put('/invoices/:id',
  auth,
  requirePermission('invoice:update'),
  param('id').isUUID().withMessage('Invalid invoice ID'),
  validation,
  asyncHandler(invoiceController.updateInvoice)
)

/**
 * @route   POST /api/financial/invoices/:id/send
 * @desc    Send invoice
 * @access  Private (Property Manager+)
 */
router.post('/invoices/:id/send',
  auth,
  requirePermission('invoice:send'),
  param('id').isUUID().withMessage('Invalid invoice ID'),
  validation,
  asyncHandler(invoiceController.sendInvoice)
)

/**
 * @route   POST /api/financial/invoices/:id/pay
 * @desc    Mark invoice as paid
 * @access  Private (Property Manager+)
 */
router.post('/invoices/:id/pay',
  auth,
  requirePermission('invoice:update'),
  param('id').isUUID().withMessage('Invalid invoice ID'),
  body('paymentId').optional().isUUID(),
  body('paidDate').optional().isISO8601(),
  validation,
  asyncHandler(invoiceController.markAsPaid)
)

// Transaction Routes

/**
 * @route   GET /api/financial/transactions
 * @desc    Get transactions
 * @access  Private (Property Manager+)
 */
router.get('/transactions',
  auth,
  requirePermission('transaction:read'),
  [
    query('type').optional().isIn(['income', 'expense']),
    query('category').optional().isString(),
    query('propertyId').optional().isUUID(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601()
  ],
  validation,
  asyncHandler(transactionController.getTransactions)
)

/**
 * @route   POST /api/financial/transactions
 * @desc    Create transaction
 * @access  Private (Property Manager+)
 */
router.post('/transactions',
  auth,
  requirePermission('transaction:create'),
  [
    body('type').isIn(['income', 'expense']).withMessage('Valid transaction type required'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount required'),
    body('category').isString().withMessage('Category required'),
    body('description').trim().isLength({ min: 3, max: 255 }).withMessage('Description required'),
    body('propertyId').optional().isUUID(),
    body('date').isISO8601().withMessage('Valid date required')
  ],
  validation,
  asyncHandler(transactionController.createTransaction)
)

// Financial Reports

/**
 * @route   GET /api/financial/reports/income
 * @desc    Get income report
 * @access  Private (Property Manager+)
 */
router.get('/reports/income',
  auth,
  requirePermission('report:read'),
  [
    query('period').isIn(['month', 'quarter', 'year']).withMessage('Valid period required'),
    query('year').isInt({ min: 2000, max: 2100 }).withMessage('Valid year required'),
    query('propertyId').optional().isUUID()
  ],
  validation,
  asyncHandler(transactionController.getIncomeReport)
)

/**
 * @route   GET /api/financial/reports/expenses
 * @desc    Get expense report
 * @access  Private (Property Manager+)
 */
router.get('/reports/expenses',
  auth,
  requirePermission('report:read'),
  [
    query('period').isIn(['month', 'quarter', 'year']).withMessage('Valid period required'),
    query('year').isInt({ min: 2000, max: 2100 }).withMessage('Valid year required'),
    query('propertyId').optional().isUUID()
  ],
  validation,
  asyncHandler(transactionController.getExpenseReport)
)

/**
 * @route   GET /api/financial/reports/profit-loss
 * @desc    Get profit & loss report
 * @access  Private (Property Manager+)
 */
router.get('/reports/profit-loss',
  auth,
  requirePermission('report:read'),
  [
    query('startDate').isISO8601().withMessage('Valid start date required'),
    query('endDate').isISO8601().withMessage('Valid end date required'),
    query('propertyId').optional().isUUID()
  ],
  validation,
  asyncHandler(transactionController.getProfitLossReport)
)

module.exports = router
