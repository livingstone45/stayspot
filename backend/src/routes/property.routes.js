const express = require('express')
const { body, param, query } = require('express-validator')

// Controllers
const propertyController = require('../controllers/properties/property.controller')
const uploadController = require('../controllers/properties/upload.controller')
const unitController = require('../controllers/properties/unit.controller')
const locationController = require('../controllers/properties/location.controller')

// Middleware
const { auth, optionalAuth, requireRole, requirePermission } = require('../middleware/auth')
const { validation } = require('../middleware/validation')
const { upload } = require('../middleware/upload')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// Validation schemas
const propertyValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Property name must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('type')
    .isIn(['apartment', 'house', 'condo', 'townhouse', 'commercial', 'land', 'other'])
    .withMessage('Invalid property type'),
  body('address')
    .trim()
    .isLength({ min: 5, max: 255 })
    .withMessage('Address must be between 5 and 255 characters'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),
  body('state')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('State must be between 2 and 100 characters'),
  body('zipCode')
    .trim()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Please provide a valid ZIP code'),
  body('country')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country must be between 2 and 100 characters'),
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('yearBuilt')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() + 1 })
    .withMessage('Year built must be a valid year'),
  body('totalUnits')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Total units must be between 1 and 10000'),
  body('totalArea')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total area must be a positive number'),
  body('lotSize')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Lot size must be a positive number'),
  body('parkingSpaces')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Parking spaces must be a non-negative integer'),
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  body('utilities')
    .optional()
    .isObject()
    .withMessage('Utilities must be an object'),
  body('petPolicy')
    .optional()
    .isObject()
    .withMessage('Pet policy must be an object'),
  body('smokingPolicy')
    .optional()
    .isIn(['allowed', 'not_allowed', 'designated_areas'])
    .withMessage('Invalid smoking policy'),
  body('accessibility')
    .optional()
    .isObject()
    .withMessage('Accessibility must be an object'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'maintenance', 'sold', 'rented'])
    .withMessage('Invalid property status'),
  body('portfolioId')
    .optional()
    .isUUID()
    .withMessage('Invalid portfolio ID'),
]

const unitValidation = [
  body('unitNumber')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Unit number must be between 1 and 50 characters'),
  body('type')
    .isIn(['studio', '1br', '2br', '3br', '4br', '5br', 'penthouse', 'loft', 'other'])
    .withMessage('Invalid unit type'),
  body('bedrooms')
    .isInt({ min: 0, max: 20 })
    .withMessage('Bedrooms must be between 0 and 20'),
  body('bathrooms')
    .isFloat({ min: 0, max: 20 })
    .withMessage('Bathrooms must be between 0 and 20'),
  body('area')
    .isFloat({ min: 1 })
    .withMessage('Area must be a positive number'),
  body('rent')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Rent must be a positive number'),
  body('deposit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Deposit must be a positive number'),
  body('floor')
    .optional()
    .isInt({ min: -10, max: 200 })
    .withMessage('Floor must be between -10 and 200'),
  body('balcony')
    .optional()
    .isBoolean()
    .withMessage('Balcony must be a boolean'),
  body('parking')
    .optional()
    .isBoolean()
    .withMessage('Parking must be a boolean'),
  body('storage')
    .optional()
    .isBoolean()
    .withMessage('Storage must be a boolean'),
  body('furnished')
    .optional()
    .isIn(['unfurnished', 'semi_furnished', 'fully_furnished'])
    .withMessage('Invalid furnished status'),
  body('appliances')
    .optional()
    .isArray()
    .withMessage('Appliances must be an array'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  body('status')
    .optional()
    .isIn(['available', 'occupied', 'maintenance', 'reserved'])
    .withMessage('Invalid unit status'),
]

const searchValidation = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  query('type')
    .optional()
    .isIn(['apartment', 'house', 'condo', 'townhouse', 'commercial', 'land', 'other'])
    .withMessage('Invalid property type'),
  query('city')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('City must be between 1 and 100 characters'),
  query('state')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('State must be between 1 and 100 characters'),
  query('zipCode')
    .optional()
    .trim()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Please provide a valid ZIP code'),
  query('minRent')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum rent must be a positive number'),
  query('maxRent')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum rent must be a positive number'),
  query('bedrooms')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Bedrooms must be between 0 and 20'),
  query('bathrooms')
    .optional()
    .isFloat({ min: 0, max: 20 })
    .withMessage('Bathrooms must be between 0 and 20'),
  query('minArea')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum area must be a positive number'),
  query('maxArea')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum area must be a positive number'),
  query('amenities')
    .optional()
    .isString()
    .withMessage('Amenities must be a comma-separated string'),
  query('petFriendly')
    .optional()
    .isBoolean()
    .withMessage('Pet friendly must be a boolean'),
  query('furnished')
    .optional()
    .isIn(['unfurnished', 'semi_furnished', 'fully_furnished'])
    .withMessage('Invalid furnished status'),
  query('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  query('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  query('radius')
    .optional()
    .isFloat({ min: 0.1, max: 100 })
    .withMessage('Radius must be between 0.1 and 100 km'),
  query('sortBy')
    .optional()
    .isIn(['rent', 'area', 'bedrooms', 'bathrooms', 'created_at', 'updated_at', 'distance'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
]

// Public Property Routes (no authentication required)

/**
 * @route   GET /api/properties
 * @desc    Get all properties (public listing)
 * @access  Public
 */
router.get('/',
  optionalAuth,
  searchValidation,
  validation,
  asyncHandler(propertyController.getProperties)
)

/**
 * @route   GET /api/properties/search
 * @desc    Advanced property search
 * @access  Public
 */
router.get('/search',
  optionalAuth,
  searchValidation,
  validation,
  asyncHandler(propertyController.searchProperties)
)

/**
 * @route   GET /api/properties/featured
 * @desc    Get featured properties
 * @access  Public
 */
router.get('/featured',
  optionalAuth,
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  validation,
  asyncHandler(propertyController.getFeaturedProperties)
)

/**
 * @route   GET /api/properties/nearby
 * @desc    Get properties near a location
 * @access  Public
 */
router.get('/nearby',
  optionalAuth,
  query('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  query('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
  query('radius').optional().isFloat({ min: 0.1, max: 100 }).withMessage('Radius must be between 0.1 and 100 km'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  validation,
  asyncHandler(propertyController.getNearbyProperties)
)

/**
 * @route   GET /api/properties/:id
 * @desc    Get property by ID
 * @access  Public
 */
router.get('/:id',
  optionalAuth,
  param('id').isUUID().withMessage('Invalid property ID'),
  validation,
  asyncHandler(propertyController.getPropertyById)
)

/**
 * @route   GET /api/properties/:id/units
 * @desc    Get property units
 * @access  Public
 */
router.get('/:id/units',
  optionalAuth,
  param('id').isUUID().withMessage('Invalid property ID'),
  query('status').optional().isIn(['available', 'occupied', 'maintenance', 'reserved']).withMessage('Invalid unit status'),
  query('type').optional().isIn(['studio', '1br', '2br', '3br', '4br', '5br', 'penthouse', 'loft', 'other']).withMessage('Invalid unit type'),
  validation,
  asyncHandler(unitController.getPropertyUnits)
)

/**
 * @route   GET /api/properties/:id/units/:unitId
 * @desc    Get specific unit details
 * @access  Public
 */
router.get('/:id/units/:unitId',
  optionalAuth,
  param('id').isUUID().withMessage('Invalid property ID'),
  param('unitId').isUUID().withMessage('Invalid unit ID'),
  validation,
  asyncHandler(unitController.getUnitById)
)

/**
 * @route   GET /api/properties/:id/gallery
 * @desc    Get property gallery
 * @access  Public
 */
router.get('/:id/gallery',
  optionalAuth,
  param('id').isUUID().withMessage('Invalid property ID'),
  validation,
  asyncHandler(propertyController.getPropertyGallery)
)

// Protected Property Routes (authentication required)

/**
 * @route   POST /api/properties
 * @desc    Create new property
 * @access  Private (Property Manager+)
 */
router.post('/',
  auth,
  requirePermission('property:create'),
  propertyValidation,
  validation,
  asyncHandler(propertyController.createProperty)
)

/**
 * @route   PUT /api/properties/:id
 * @desc    Update property
 * @access  Private (Property Manager+)
 */
router.put('/:id',
  auth,
  requirePermission('property:update'),
  param('id').isUUID().withMessage('Invalid property ID'),
  propertyValidation,
  validation,
  asyncHandler(propertyController.updateProperty)
)

/**
 * @route   DELETE /api/properties/:id
 * @desc    Delete property
 * @access  Private (Company Admin+)
 */
router.delete('/:id',
  auth,
  requirePermission('property:delete'),
  param('id').isUUID().withMessage('Invalid property ID'),
  validation,
  asyncHandler(propertyController.deleteProperty)
)

/**
 * @route   POST /api/properties/:id/publish
 * @desc    Publish property
 * @access  Private (Property Manager+)
 */
router.post('/:id/publish',
  auth,
  requirePermission('property:publish'),
  param('id').isUUID().withMessage('Invalid property ID'),
  validation,
  asyncHandler(propertyController.publishProperty)
)

/**
 * @route   POST /api/properties/:id/unpublish
 * @desc    Unpublish property
 * @access  Private (Property Manager+)
 */
router.post('/:id/unpublish',
  auth,
  requirePermission('property:publish'),
  param('id').isUUID().withMessage('Invalid property ID'),
  validation,
  asyncHandler(propertyController.unpublishProperty)
)

/**
 * @route   POST /api/properties/:id/archive
 * @desc    Archive property
 * @access  Private (Property Manager+)
 */
router.post('/:id/archive',
  auth,
  requirePermission('property:archive'),
  param('id').isUUID().withMessage('Invalid property ID'),
  validation,
  asyncHandler(propertyController.archiveProperty)
)

// Property Upload Routes

/**
 * @route   POST /api/properties/upload
 * @desc    Bulk upload properties
 * @access  Private (Property Manager+)
 */
router.post('/upload',
  auth,
  requirePermission('property:upload'),
  upload.single('file'),
  asyncHandler(uploadController.bulkUploadProperties)
)

/**
 * @route   POST /api/properties/:id/images
 * @desc    Upload property images
 * @access  Private (Property Manager+)
 */
router.post('/:id/images',
  auth,
  requirePermission('property:upload'),
  param('id').isUUID().withMessage('Invalid property ID'),
  upload.array('images', 20),
  asyncHandler(uploadController.uploadPropertyImages)
)

/**
 * @route   DELETE /api/properties/:id/images/:imageId
 * @desc    Delete property image
 * @access  Private (Property Manager+)
 */
router.delete('/:id/images/:imageId',
  auth,
  requirePermission('property:update'),
  param('id').isUUID().withMessage('Invalid property ID'),
  param('imageId').isUUID().withMessage('Invalid image ID'),
  validation,
  asyncHandler(uploadController.deletePropertyImage)
)

/**
 * @route   POST /api/properties/:id/documents
 * @desc    Upload property documents
 * @access  Private (Property Manager+)
 */
router.post('/:id/documents',
  auth,
  requirePermission('property:upload'),
  param('id').isUUID().withMessage('Invalid property ID'),
  upload.array('documents', 10),
  asyncHandler(uploadController.uploadPropertyDocuments)
)

/**
 * @route   DELETE /api/properties/:id/documents/:documentId
 * @desc    Delete property document
 * @access  Private (Property Manager+)
 */
router.delete('/:id/documents/:documentId',
  auth,
  requirePermission('property:update'),
  param('id').isUUID().withMessage('Invalid property ID'),
  param('documentId').isUUID().withMessage('Invalid document ID'),
  validation,
  asyncHandler(uploadController.deletePropertyDocument)
)

// Unit Management Routes

/**
 * @route   POST /api/properties/:id/units
 * @desc    Create new unit
 * @access  Private (Property Manager+)
 */
router.post('/:id/units',
  auth,
  requirePermission('unit:create'),
  param('id').isUUID().withMessage('Invalid property ID'),
  unitValidation,
  validation,
  asyncHandler(unitController.createUnit)
)

/**
 * @route   PUT /api/properties/:id/units/:unitId
 * @desc    Update unit
 * @access  Private (Property Manager+)
 */
router.put('/:id/units/:unitId',
  auth,
  requirePermission('unit:update'),
  param('id').isUUID().withMessage('Invalid property ID'),
  param('unitId').isUUID().withMessage('Invalid unit ID'),
  unitValidation,
  validation,
  asyncHandler(unitController.updateUnit)
)

/**
 * @route   DELETE /api/properties/:id/units/:unitId
 * @desc    Delete unit
 * @access  Private (Property Manager+)
 */
router.delete('/:id/units/:unitId',
  auth,
  requirePermission('unit:delete'),
  param('id').isUUID().withMessage('Invalid property ID'),
  param('unitId').isUUID().withMessage('Invalid unit ID'),
  validation,
  asyncHandler(unitController.deleteUnit)
)

/**
 * @route   POST /api/properties/:id/units/:unitId/assign
 * @desc    Assign unit to tenant
 * @access  Private (Property Manager+)
 */
router.post('/:id/units/:unitId/assign',
  auth,
  requirePermission('unit:assign'),
  param('id').isUUID().withMessage('Invalid property ID'),
  param('unitId').isUUID().withMessage('Invalid unit ID'),
  body('tenantId').isUUID().withMessage('Valid tenant ID is required'),
  body('leaseStartDate').isISO8601().withMessage('Valid lease start date is required'),
  body('leaseEndDate').isISO8601().withMessage('Valid lease end date is required'),
  body('rent').isFloat({ min: 0 }).withMessage('Rent must be a positive number'),
  validation,
  asyncHandler(unitController.assignUnit)
)

/**
 * @route   POST /api/properties/:id/units/:unitId/vacate
 * @desc    Vacate unit
 * @access  Private (Property Manager+)
 */
router.post('/:id/units/:unitId/vacate',
  auth,
  requirePermission('unit:assign'),
  param('id').isUUID().withMessage('Invalid property ID'),
  param('unitId').isUUID().withMessage('Invalid unit ID'),
  body('vacateDate').isISO8601().withMessage('Valid vacate date is required'),
  body('reason').optional().trim().isLength({ max: 500 }).withMessage('Reason must not exceed 500 characters'),
  validation,
  asyncHandler(unitController.vacateUnit)
)

// Location and Geocoding Routes

/**
 * @route   POST /api/properties/:id/geocode
 * @desc    Geocode property address
 * @access  Private (Property Manager+)
 */
router.post('/:id/geocode',
  auth,
  requirePermission('property:update'),
  param('id').isUUID().withMessage('Invalid property ID'),
  validation,
  asyncHandler(locationController.geocodeProperty)
)

/**
 * @route   GET /api/properties/geocode/address
 * @desc    Geocode address
 * @access  Private
 */
router.get('/geocode/address',
  auth,
  query('address').trim().isLength({ min: 5 }).withMessage('Address is required'),
  validation,
  asyncHandler(locationController.geocodeAddress)
)

/**
 * @route   GET /api/properties/reverse-geocode
 * @desc    Reverse geocode coordinates
 * @access  Private
 */
router.get('/reverse-geocode',
  auth,
  query('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  query('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
  validation,
  asyncHandler(locationController.reverseGeocode)
)

// Analytics and Reporting Routes

/**
 * @route   GET /api/properties/:id/analytics
 * @desc    Get property analytics
 * @access  Private (Property Manager+)
 */
router.get('/:id/analytics',
  auth,
  requirePermission('property:read'),
  param('id').isUUID().withMessage('Invalid property ID'),
  query('period').optional().isIn(['week', 'month', 'quarter', 'year']).withMessage('Invalid period'),
  validation,
  asyncHandler(propertyController.getPropertyAnalytics)
)

/**
 * @route   GET /api/properties/:id/occupancy
 * @desc    Get property occupancy data
 * @access  Private (Property Manager+)
 */
router.get('/:id/occupancy',
  auth,
  requirePermission('property:read'),
  param('id').isUUID().withMessage('Invalid property ID'),
  query('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  query('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  validation,
  asyncHandler(propertyController.getOccupancyData)
)

/**
 * @route   GET /api/properties/:id/financial-summary
 * @desc    Get property financial summary
 * @access  Private (Property Manager+)
 */
router.get('/:id/financial-summary',
  auth,
  requirePermission('financial:read'),
  param('id').isUUID().withMessage('Invalid property ID'),
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Valid year is required'),
  validation,
  asyncHandler(propertyController.getFinancialSummary)
)

// Property Verification Routes

/**
 * @route   PUT /api/properties/:id/verify
 * @desc    Verify property
 * @access  Private (Company Admin+)
 */
router.put('/:id/verify',
  auth,
  requirePermission('property:verify'),
  param('id').isUUID().withMessage('Invalid property ID'),
  body('verificationStatus').isIn(['verified', 'pending', 'rejected']).withMessage('Invalid verification status'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must not exceed 500 characters'),
  validation,
  asyncHandler(propertyController.verifyProperty)
)

/**
 * @route   GET /api/properties/verification/pending
 * @desc    Get pending verification properties
 * @access  Private (Company Admin+)
 */
router.get('/verification/pending',
  auth,
  requirePermission('property:verify'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validation,
  asyncHandler(propertyController.getPendingVerification)
)

/**
 * @route   GET /api/properties/:id/verification-status
 * @desc    Get property verification status
 * @access  Private (Company Admin+)
 */
router.get('/:id/verification-status',
  auth,
  requirePermission('property:read'),
  param('id').isUUID().withMessage('Invalid property ID'),
  validation,
  asyncHandler(propertyController.getVerificationStatus)
)

module.exports = router