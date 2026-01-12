/**
 * User Validation Schemas
 * Joi-based schemas for user validation across the application
 */

const Joi = require('joi');

/**
 * User Registration Schema
 * Validates user registration request data
 */
const userRegistrationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username must contain only alphanumeric characters',
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username must not exceed 30 characters',
      'any.required': 'Username is required'
    }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain uppercase, lowercase, numbers, and special characters',
      'any.required': 'Password is required'
    }),
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name must not exceed 50 characters',
      'any.required': 'First name is required'
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name must not exceed 50 characters',
      'any.required': 'Last name is required'
    }),
  phone: Joi.string()
    .pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  roleId: Joi.string()
    .required()
    .messages({
      'any.required': 'Role is required'
    }),
  acceptTerms: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      'any.only': 'You must accept the terms and conditions',
      'any.required': 'Terms acceptance is required'
    })
});

/**
 * User Login Schema
 * Validates user login credentials
 */
const userLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    }),
  rememberMe: Joi.boolean().optional(),
  twoFactorCode: Joi.string()
    .length(6)
    .pattern(/^\d+$/)
    .optional()
    .messages({
      'string.length': 'Two-factor code must be 6 digits',
      'string.pattern.base': 'Two-factor code must contain only numbers'
    })
});

/**
 * User Profile Update Schema
 * Validates user profile update data
 */
const userProfileUpdateSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .optional(),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .optional(),
  email: Joi.string()
    .email()
    .optional(),
  phone: Joi.string()
    .pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .optional(),
  avatar: Joi.string()
    .uri()
    .optional(),
  bio: Joi.string()
    .max(500)
    .optional(),
  address: Joi.string()
    .max(255)
    .optional(),
  city: Joi.string()
    .max(100)
    .optional(),
  state: Joi.string()
    .max(100)
    .optional(),
  zipCode: Joi.string()
    .pattern(/^[0-9]{5}(-[0-9]{4})?$/)
    .optional(),
  country: Joi.string()
    .max(100)
    .optional(),
  timezone: Joi.string()
    .optional(),
  dateOfBirth: Joi.date()
    .max('now')
    .optional(),
  preferences: Joi.object({
    emailNotifications: Joi.boolean().optional(),
    smsNotifications: Joi.boolean().optional(),
    pushNotifications: Joi.boolean().optional(),
    theme: Joi.string().valid('light', 'dark', 'auto').optional(),
    language: Joi.string().optional()
  }).optional()
}).min(1);

/**
 * Change Password Schema
 * Validates password change request
 */
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required'
    }),
  newPassword: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required()
    .messages({
      'string.min': 'New password must be at least 8 characters',
      'string.pattern.base': 'New password must contain uppercase, lowercase, numbers, and special characters',
      'any.required': 'New password is required'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required'
    })
});

/**
 * Password Reset Request Schema
 * Validates password reset request
 */
const passwordResetRequestSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    })
});

/**
 * Password Reset Confirmation Schema
 * Validates password reset confirmation
 */
const passwordResetConfirmSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Reset token is required'
    }),
  newPassword: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain uppercase, lowercase, numbers, and special characters',
      'any.required': 'Password is required'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required'
    })
});

/**
 * User Query Filter Schema
 * Validates user query filters
 */
const userQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .optional(),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .optional(),
  search: Joi.string()
    .max(255)
    .optional(),
  role: Joi.string()
    .optional(),
  status: Joi.string()
    .valid('active', 'inactive', 'suspended', 'banned', 'pending')
    .optional(),
  sortBy: Joi.string()
    .default('createdAt')
    .optional(),
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .optional(),
  emailVerified: Joi.boolean().optional(),
  fromDate: Joi.date().optional(),
  toDate: Joi.date().optional()
});

/**
 * User Role Assignment Schema
 * Validates role assignment request
 */
const userRoleAssignmentSchema = Joi.object({
  userId: Joi.string()
    .required()
    .messages({
      'any.required': 'User ID is required'
    }),
  roleId: Joi.string()
    .required()
    .messages({
      'any.required': 'Role ID is required'
    }),
  expiresAt: Joi.date()
    .min('now')
    .optional(),
  reason: Joi.string()
    .max(500)
    .optional()
});

/**
 * Email Verification Schema
 * Validates email verification request
 */
const emailVerificationSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Verification token is required'
    })
});

/**
 * Two-Factor Setup Schema
 * Validates two-factor authentication setup
 */
const twoFactorSetupSchema = Joi.object({
  code: Joi.string()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.length': 'Code must be 6 digits',
      'string.pattern.base': 'Code must contain only numbers',
      'any.required': 'Code is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required for verification'
    })
});

/**
 * Notification Preferences Schema
 * Validates notification preference updates
 */
const notificationPreferencesSchema = Joi.object({
  emailNotifications: Joi.boolean().optional(),
  smsNotifications: Joi.boolean().optional(),
  pushNotifications: Joi.boolean().optional(),
  notificationCategories: Joi.array()
    .items(Joi.string())
    .optional(),
  frequencyPreference: Joi.string()
    .valid('immediate', 'daily', 'weekly')
    .optional(),
  marketingEmails: Joi.boolean().optional()
}).min(1);

/**
 * User Settings Schema
 * Validates user settings updates
 */
const userSettingsSchema = Joi.object({
  theme: Joi.string()
    .valid('light', 'dark', 'auto')
    .optional(),
  language: Joi.string()
    .optional(),
  timezone: Joi.string()
    .optional(),
  compactView: Joi.boolean().optional(),
  dashboardLayout: Joi.object().optional(),
  columnVisibility: Joi.object().optional()
}).min(1);

/**
 * User Status Update Schema
 * Validates user status update request
 */
const userStatusUpdateSchema = Joi.object({
  status: Joi.string()
    .valid('active', 'inactive', 'suspended', 'banned')
    .required()
    .messages({
      'any.required': 'Status is required'
    }),
  reason: Joi.string()
    .max(500)
    .optional()
});

module.exports = {
  userRegistrationSchema,
  userLoginSchema,
  userProfileUpdateSchema,
  changePasswordSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
  userQuerySchema,
  userRoleAssignmentSchema,
  emailVerificationSchema,
  twoFactorSetupSchema,
  notificationPreferencesSchema,
  userSettingsSchema,
  userStatusUpdateSchema
};
