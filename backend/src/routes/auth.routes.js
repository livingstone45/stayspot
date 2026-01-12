const express = require('express')
const rateLimit = require('express-rate-limit')
const { body, param, query } = require('express-validator')

// Controllers
const authController = require('../controllers/auth/auth.controller')
const invitationController = require('../controllers/auth/invitation.controller')

// Middleware
const { auth, optionalAuth } = require('../middleware/auth')
const { validation } = require('../middleware/validation')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// Rate limiting for sensitive endpoints
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 attempts per window
  message: {
    error: 'Too many attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const moderateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: {
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Validation schemas
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required'),
  body('rememberMe')
    .optional()
    .isBoolean()
    .withMessage('Remember me must be a boolean'),
]

const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must not exceed 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must not exceed 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone')
    .optional(),
  body('role')
    .optional()
    .isIn(['tenant', 'landlord', 'property_manager'])
    .withMessage('Invalid role specified'),
]

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
]

const resetPasswordValidation = [
  body('token')
    .isLength({ min: 1 })
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password')
      }
      return true
    }),
]

const changePasswordValidation = [
  body('currentPassword')
    .isLength({ min: 1 })
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 128 })
    .withMessage('New password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password')
      }
      return true
    }),
]

const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address must not exceed 255 characters'),
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters'),
  body('state')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('State must not exceed 100 characters'),
  body('zipCode')
    .optional()
    .trim()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Please provide a valid ZIP code'),
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),
]

const verifyEmailValidation = [
  body('token')
    .isLength({ min: 1 })
    .withMessage('Verification token is required'),
]

const twoFactorValidation = [
  body('code')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('Please provide a valid 6-digit code'),
]

// Authentication Routes

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', 
  moderateLimiter,
  asyncHandler(authController.register)
)

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login',
  strictLimiter,
  asyncHandler(authController.login)
)

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout',
  auth,
  asyncHandler(authController.logout)
)

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh',
  moderateLimiter,
  body('refreshToken').isLength({ min: 1 }).withMessage('Refresh token is required'),
  validation,
  asyncHandler(authController.refreshToken)
)

// Password Management Routes

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password',
  strictLimiter,
  forgotPasswordValidation,
  validation,
  asyncHandler(authController.forgotPassword)
)

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password',
  strictLimiter,
  resetPasswordValidation,
  validation,
  asyncHandler(authController.resetPassword)
)

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password (authenticated user)
 * @access  Private
 */
router.post('/change-password',
  auth,
  changePasswordValidation,
  validation,
  asyncHandler(authController.changePassword)
)

// Email Verification Routes

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.post('/verify-email',
  verifyEmailValidation,
  validation,
  asyncHandler(authController.verifyEmail)
)

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend email verification
 * @access  Private
 */
router.post('/resend-verification',
  auth,
  moderateLimiter,
  asyncHandler(authController.resendVerificationEmail)
)

// Profile Management Routes

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile',
  auth,
  asyncHandler(authController.getProfile)
)

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile',
  auth,
  updateProfileValidation,
  validation,
  asyncHandler(authController.updateProfile)
)

/**
 * @route   POST /api/auth/profile/avatar
 * @desc    Upload profile avatar
 * @access  Private
 */
router.post('/profile/avatar',
  auth,
  asyncHandler(authController.uploadAvatar)
)

/**
 * @route   DELETE /api/auth/profile/avatar
 * @desc    Delete profile avatar
 * @access  Private
 */
router.delete('/profile/avatar',
  auth,
  asyncHandler(authController.deleteAvatar)
)

// Two-Factor Authentication Routes

/**
 * @route   POST /api/auth/2fa/enable
 * @desc    Enable two-factor authentication
 * @access  Private
 */
router.post('/2fa/enable',
  auth,
  asyncHandler(authController.enableTwoFactor)
)

/**
 * @route   POST /api/auth/2fa/verify
 * @desc    Verify two-factor authentication code
 * @access  Private
 */
router.post('/2fa/verify',
  auth,
  twoFactorValidation,
  validation,
  asyncHandler(authController.verifyTwoFactor)
)

/**
 * @route   POST /api/auth/2fa/disable
 * @desc    Disable two-factor authentication
 * @access  Private
 */
router.post('/2fa/disable',
  auth,
  twoFactorValidation,
  validation,
  asyncHandler(authController.disableTwoFactor)
)

/**
 * @route   POST /api/auth/2fa/backup-codes
 * @desc    Generate backup codes for 2FA
 * @access  Private
 */
router.post('/2fa/backup-codes',
  auth,
  asyncHandler(authController.generateBackupCodes)
)

// Session Management Routes

/**
 * @route   GET /api/auth/sessions
 * @desc    Get user sessions
 * @access  Private
 */
router.get('/sessions',
  auth,
  asyncHandler(authController.getSessions)
)

/**
 * @route   DELETE /api/auth/sessions/:sessionId
 * @desc    Revoke specific session
 * @access  Private
 */
router.delete('/sessions/:sessionId',
  auth,
  param('sessionId').isUUID().withMessage('Invalid session ID'),
  validation,
  asyncHandler(authController.revokeSession)
)

/**
 * @route   DELETE /api/auth/sessions
 * @desc    Revoke all sessions except current
 * @access  Private
 */
router.delete('/sessions',
  auth,
  asyncHandler(authController.revokeAllSessions)
)

// Security Routes

/**
 * @route   GET /api/auth/security-log
 * @desc    Get user security log
 * @access  Private
 */
router.get('/security-log',
  auth,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validation,
  asyncHandler(authController.getSecurityLog)
)

/**
 * @route   POST /api/auth/report-suspicious
 * @desc    Report suspicious activity
 * @access  Private
 */
router.post('/report-suspicious',
  auth,
  body('description').isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('type').isIn(['login', 'password_change', 'profile_change', 'other']).withMessage('Invalid activity type'),
  validation,
  asyncHandler(authController.reportSuspiciousActivity)
)

// Social Authentication Routes

/**
 * @route   POST /api/auth/social/:provider
 * @desc    Social login (Google, Facebook, etc.)
 * @access  Public
 */
router.post('/social/:provider',
  param('provider').isIn(['google', 'facebook', 'apple']).withMessage('Invalid social provider'),
  body('code').isLength({ min: 1 }).withMessage('Authorization code is required'),
  validation,
  asyncHandler(authController.socialLogin)
)

/**
 * @route   POST /api/auth/social/:provider/link
 * @desc    Link social account to existing account
 * @access  Private
 */
router.post('/social/:provider/link',
  auth,
  param('provider').isIn(['google', 'facebook', 'apple']).withMessage('Invalid social provider'),
  body('code').isLength({ min: 1 }).withMessage('Authorization code is required'),
  validation,
  asyncHandler(authController.linkSocialAccount)
)

/**
 * @route   DELETE /api/auth/social/:provider/unlink
 * @desc    Unlink social account
 * @access  Private
 */
router.delete('/social/:provider/unlink',
  auth,
  param('provider').isIn(['google', 'facebook', 'apple']).withMessage('Invalid social provider'),
  validation,
  asyncHandler(authController.unlinkSocialAccount)
)

// Account Management Routes

/**
 * @route   DELETE /api/auth/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account',
  auth,
  body('password').isLength({ min: 1 }).withMessage('Password is required for account deletion'),
  validation,
  asyncHandler(authController.deleteAccount)
)

/**
 * @route   GET /api/auth/export-data
 * @desc    Export user data (GDPR compliance)
 * @access  Private
 */
router.get('/export-data',
  auth,
  asyncHandler(authController.exportData)
)

// Invitation Routes

/**
 * @route   POST /api/auth/accept-invitation
 * @desc    Accept invitation and create account
 * @access  Public
 */
router.post('/accept-invitation',
  body('token').isLength({ min: 1 }).withMessage('Invitation token is required'),
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  validation,
  asyncHandler(invitationController.acceptInvitation)
)

/**
 * @route   POST /api/auth/decline-invitation
 * @desc    Decline invitation
 * @access  Public
 */
router.post('/decline-invitation',
  body('token').isLength({ min: 1 }).withMessage('Invitation token is required'),
  validation,
  asyncHandler(invitationController.declineInvitation)
)

/**
 * @route   GET /api/auth/invitation/:token
 * @desc    Get invitation details
 * @access  Public
 */
router.get('/invitation/:token',
  param('token').isLength({ min: 1 }).withMessage('Invalid invitation token'),
  validation,
  asyncHandler(invitationController.getInvitationDetails)
)

// Device Management Routes

/**
 * @route   GET /api/auth/devices
 * @desc    Get user devices
 * @access  Private
 */
router.get('/devices',
  auth,
  asyncHandler(authController.getDevices)
)

/**
 * @route   DELETE /api/auth/devices/:deviceId
 * @desc    Revoke device access
 * @access  Private
 */
router.delete('/devices/:deviceId',
  auth,
  param('deviceId').isUUID().withMessage('Invalid device ID'),
  validation,
  asyncHandler(authController.revokeDevice)
)

/**
 * @route   PUT /api/auth/devices/:deviceId
 * @desc    Update device name
 * @access  Private
 */
router.put('/devices/:deviceId',
  auth,
  param('deviceId').isUUID().withMessage('Invalid device ID'),
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Device name must be between 1 and 100 characters'),
  validation,
  asyncHandler(authController.updateDeviceName)
)

// Preferences Routes

/**
 * @route   GET /api/auth/preferences
 * @desc    Get user preferences
 * @access  Private
 */
router.get('/preferences',
  auth,
  asyncHandler(authController.getPreferences)
)

/**
 * @route   PUT /api/auth/preferences
 * @desc    Update user preferences
 * @access  Private
 */
router.put('/preferences',
  auth,
  body('theme').optional().isIn(['light', 'dark', 'auto']).withMessage('Invalid theme'),
  body('language').optional().isIn(['en', 'es', 'fr', 'de']).withMessage('Invalid language'),
  body('timezone').optional().isLength({ min: 1 }).withMessage('Invalid timezone'),
  body('notifications').optional().isObject().withMessage('Notifications must be an object'),
  validation,
  asyncHandler(authController.updatePreferences)
)

// API Keys Routes (for developers)

/**
 * @route   GET /api/auth/api-keys
 * @desc    Get user API keys
 * @access  Private
 */
router.get('/api-keys',
  auth,
  asyncHandler(authController.getApiKeys)
)

/**
 * @route   POST /api/auth/api-keys
 * @desc    Create new API key
 * @access  Private
 */
router.post('/api-keys',
  auth,
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('API key name is required'),
  body('permissions').optional().isArray().withMessage('Permissions must be an array'),
  validation,
  asyncHandler(authController.createApiKey)
)

/**
 * @route   DELETE /api/auth/api-keys/:keyId
 * @desc    Revoke API key
 * @access  Private
 */
router.delete('/api-keys/:keyId',
  auth,
  param('keyId').isUUID().withMessage('Invalid API key ID'),
  validation,
  asyncHandler(authController.revokeApiKey)
)

module.exports = router