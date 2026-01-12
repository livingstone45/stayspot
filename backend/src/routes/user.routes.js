const express = require('express')
const { body, param, query } = require('express-validator')

// Controllers
const userController = require('../controllers/users/user.controller')
const profileController = require('../controllers/users/profile.controller')
const roleController = require('../controllers/users/role.controller')

// Middleware
const { auth, requireRole, requirePermission } = require('../middleware/auth')
const { validation } = require('../middleware/validation')
const { upload } = require('../middleware/upload')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// User Management Routes

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Admin+)
 */
router.get('/',
  auth,
  requirePermission('user:read'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search too long'),
  query('role').optional().isString().withMessage('Invalid role'),
  query('status').optional().isIn(['active', 'inactive', 'pending']).withMessage('Invalid status'),
  validation,
  asyncHandler(userController.getUsers)
)

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id',
  auth,
  param('id').isUUID().withMessage('Invalid user ID'),
  validation,
  asyncHandler(userController.getUserById)
)

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Private (Admin+)
 */
router.post('/',
  auth,
  requirePermission('user:create'),
  [
    body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name required'),
    body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('role').isString().withMessage('Role required'),
    body('phone').optional().isMobilePhone().withMessage('Valid phone required')
  ],
  validation,
  asyncHandler(userController.createUser)
)

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (Admin+)
 */
router.put('/:id',
  auth,
  requirePermission('user:update'),
  param('id').isUUID().withMessage('Invalid user ID'),
  [
    body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
    body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().isMobilePhone()
  ],
  validation,
  asyncHandler(userController.updateUser)
)

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private (Admin+)
 */
router.delete('/:id',
  auth,
  requirePermission('user:delete'),
  param('id').isUUID().withMessage('Invalid user ID'),
  validation,
  asyncHandler(userController.deleteUser)
)

/**
 * @route   POST /api/users/:id/activate
 * @desc    Activate user
 * @access  Private (Admin+)
 */
router.post('/:id/activate',
  auth,
  requirePermission('user:update'),
  param('id').isUUID().withMessage('Invalid user ID'),
  validation,
  asyncHandler(userController.activateUser)
)

/**
 * @route   POST /api/users/:id/deactivate
 * @desc    Deactivate user
 * @access  Private (Admin+)
 */
router.post('/:id/deactivate',
  auth,
  requirePermission('user:update'),
  param('id').isUUID().withMessage('Invalid user ID'),
  validation,
  asyncHandler(userController.deactivateUser)
)

// Profile Routes

/**
 * @route   GET /api/users/profile/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile/me',
  auth,
  asyncHandler(profileController.getCurrentProfile)
)

/**
 * @route   PUT /api/users/profile/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile/me',
  auth,
  [
    body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
    body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
    body('phone').optional().isMobilePhone(),
    body('dateOfBirth').optional().isISO8601(),
    body('address').optional().trim().isLength({ max: 255 }),
    body('city').optional().trim().isLength({ max: 100 }),
    body('state').optional().trim().isLength({ max: 100 }),
    body('zipCode').optional().matches(/^\d{5}(-\d{4})?$/)
  ],
  validation,
  asyncHandler(profileController.updateProfile)
)

/**
 * @route   POST /api/users/profile/avatar
 * @desc    Upload profile avatar
 * @access  Private
 */
router.post('/profile/avatar',
  auth,
  upload.single('avatar'),
  asyncHandler(profileController.uploadAvatar)
)

/**
 * @route   DELETE /api/users/profile/avatar
 * @desc    Delete profile avatar
 * @access  Private
 */
router.delete('/profile/avatar',
  auth,
  asyncHandler(profileController.deleteAvatar)
)

// Role Management Routes

/**
 * @route   GET /api/users/roles
 * @desc    Get all roles
 * @access  Private (Admin+)
 */
router.get('/roles',
  auth,
  requirePermission('role:read'),
  asyncHandler(roleController.getRoles)
)

/**
 * @route   POST /api/users/roles
 * @desc    Create new role
 * @access  Private (System Admin)
 */
router.post('/roles',
  auth,
  requireRole(['system_admin']),
  [
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Role name required'),
    body('description').optional().trim().isLength({ max: 255 }),
    body('permissions').isArray().withMessage('Permissions array required')
  ],
  validation,
  asyncHandler(roleController.createRole)
)

/**
 * @route   PUT /api/users/roles/:id
 * @desc    Update role
 * @access  Private (System Admin)
 */
router.put('/roles/:id',
  auth,
  requireRole(['system_admin']),
  param('id').isUUID().withMessage('Invalid role ID'),
  validation,
  asyncHandler(roleController.updateRole)
)

/**
 * @route   DELETE /api/users/roles/:id
 * @desc    Delete role
 * @access  Private (System Admin)
 */
router.delete('/roles/:id',
  auth,
  requireRole(['system_admin']),
  param('id').isUUID().withMessage('Invalid role ID'),
  validation,
  asyncHandler(roleController.deleteRole)
)

/**
 * @route   POST /api/users/:id/roles
 * @desc    Assign role to user
 * @access  Private (Admin+)
 */
router.post('/:id/roles',
  auth,
  requirePermission('user:update'),
  param('id').isUUID().withMessage('Invalid user ID'),
  body('roleId').isUUID().withMessage('Valid role ID required'),
  validation,
  asyncHandler(userController.assignRole)
)

/**
 * @route   DELETE /api/users/:id/roles/:roleId
 * @desc    Remove role from user
 * @access  Private (Admin+)
 */
router.delete('/:id/roles/:roleId',
  auth,
  requirePermission('user:update'),
  param('id').isUUID().withMessage('Invalid user ID'),
  param('roleId').isUUID().withMessage('Invalid role ID'),
  validation,
  asyncHandler(userController.removeRole)
)

module.exports = router
