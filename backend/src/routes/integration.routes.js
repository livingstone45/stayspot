const express = require('express')
const { body, param, query } = require('express-validator')

// Controllers
const integrationController = require('../controllers/integrations/integration.controller')
const marketDataController = require('../controllers/integrations/marketdata.controller')
const webhookController = require('../controllers/integrations/webhook.controller')

// Middleware
const { auth, requirePermission } = require('../middleware/auth')
const { validation } = require('../middleware/validation')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// Integration Management Routes

/**
 * @route   GET /api/integrations
 * @desc    Get integrations
 * @access  Private (Company Admin+)
 */
router.get('/',
  auth,
  requirePermission('integration:read'),
  [
    query('type').optional().isString(),
    query('status').optional().isIn(['active', 'inactive', 'error'])
  ],
  validation,
  asyncHandler(integrationController.getIntegrations)
)

/**
 * @route   POST /api/integrations
 * @desc    Create integration
 * @access  Private (Company Admin+)
 */
router.post('/',
  auth,
  requirePermission('integration:create'),
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Integration name required'),
    body('type').isString().withMessage('Integration type required'),
    body('config').isObject().withMessage('Configuration object required')
  ],
  validation,
  asyncHandler(integrationController.createIntegration)
)

/**
 * @route   PUT /api/integrations/:id
 * @desc    Update integration
 * @access  Private (Company Admin+)
 */
router.put('/:id',
  auth,
  requirePermission('integration:update'),
  param('id').isUUID().withMessage('Invalid integration ID'),
  validation,
  asyncHandler(integrationController.updateIntegration)
)

/**
 * @route   POST /api/integrations/:id/test
 * @desc    Test integration connection
 * @access  Private (Company Admin+)
 */
router.post('/:id/test',
  auth,
  requirePermission('integration:test'),
  param('id').isUUID().withMessage('Invalid integration ID'),
  validation,
  asyncHandler(integrationController.testConnection)
)

/**
 * @route   POST /api/integrations/:id/sync
 * @desc    Trigger integration sync
 * @access  Private (Company Admin+)
 */
router.post('/:id/sync',
  auth,
  requirePermission('integration:sync'),
  param('id').isUUID().withMessage('Invalid integration ID'),
  body('syncType').optional().isIn(['full', 'incremental']),
  validation,
  asyncHandler(integrationController.triggerSync)
)

// Market Data Routes

/**
 * @route   GET /api/integrations/market-data
 * @desc    Get market data
 * @access  Private (Property Manager+)
 */
router.get('/market-data',
  auth,
  requirePermission('marketdata:read'),
  [
    query('zipCode').isPostalCode('US').withMessage('Valid ZIP code required'),
    query('propertyType').isString().withMessage('Property type required')
  ],
  validation,
  asyncHandler(marketDataController.getMarketData)
)

/**
 * @route   GET /api/integrations/market-data/comparables
 * @desc    Get comparable properties
 * @access  Private (Property Manager+)
 */
router.get('/market-data/comparables',
  auth,
  requirePermission('marketdata:read'),
  [
    query('propertyId').isUUID().withMessage('Property ID required'),
    query('radius').optional().isFloat({ min: 0.1, max: 50 })
  ],
  validation,
  asyncHandler(marketDataController.getComparables)
)

/**
 * @route   POST /api/integrations/market-data/analyze
 * @desc    Analyze property pricing
 * @access  Private (Property Manager+)
 */
router.post('/market-data/analyze',
  auth,
  requirePermission('marketdata:analyze'),
  body('propertyId').isUUID().withMessage('Property ID required'),
  validation,
  asyncHandler(marketDataController.analyzePricing)
)

// Webhook Routes

/**
 * @route   GET /api/integrations/webhooks
 * @desc    Get webhooks
 * @access  Private (Company Admin+)
 */
router.get('/webhooks',
  auth,
  requirePermission('webhook:read'),
  asyncHandler(webhookController.getWebhooks)
)

/**
 * @route   POST /api/integrations/webhooks
 * @desc    Create webhook
 * @access  Private (Company Admin+)
 */
router.post('/webhooks',
  auth,
  requirePermission('webhook:create'),
  [
    body('url').isURL().withMessage('Valid URL required'),
    body('events').isArray().withMessage('Events array required'),
    body('secret').optional().isLength({ min: 8 }).withMessage('Secret must be at least 8 characters')
  ],
  validation,
  asyncHandler(webhookController.createWebhook)
)

/**
 * @route   PUT /api/integrations/webhooks/:id
 * @desc    Update webhook
 * @access  Private (Company Admin+)
 */
router.put('/webhooks/:id',
  auth,
  requirePermission('webhook:update'),
  param('id').isUUID().withMessage('Invalid webhook ID'),
  validation,
  asyncHandler(webhookController.updateWebhook)
)

/**
 * @route   DELETE /api/integrations/webhooks/:id
 * @desc    Delete webhook
 * @access  Private (Company Admin+)
 */
router.delete('/webhooks/:id',
  auth,
  requirePermission('webhook:delete'),
  param('id').isUUID().withMessage('Invalid webhook ID'),
  validation,
  asyncHandler(webhookController.deleteWebhook)
)

/**
 * @route   POST /api/integrations/webhooks/:id/test
 * @desc    Test webhook
 * @access  Private (Company Admin+)
 */
router.post('/webhooks/:id/test',
  auth,
  requirePermission('webhook:test'),
  param('id').isUUID().withMessage('Invalid webhook ID'),
  validation,
  asyncHandler(webhookController.testWebhook)
)

module.exports = router