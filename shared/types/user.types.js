/**
 * User Types and Enums for StaySpot Platform
 * Shared between frontend and backend for consistency
 */

// User Role Definitions
export const USER_ROLES = {
  // Administrative Roles
  SYSTEM_ADMIN: 'system_admin',
  COMPANY_ADMIN: 'company_admin',
  COMPANY_OWNER: 'company_owner',
  
  // Management Roles
  PORTFOLIO_MANAGER: 'portfolio_manager',
  PROPERTY_MANAGER: 'property_manager',
  LEASING_SPECIALIST: 'leasing_specialist',
  MAINTENANCE_SUPERVISOR: 'maintenance_supervisor',
  MARKETING_SPECIALIST: 'marketing_specialist',
  FINANCIAL_CONTROLLER: 'financial_controller',
  
  // User Roles
  LANDLORD: 'landlord',
  TENANT: 'tenant',
  VENDOR: 'vendor',
  INSPECTOR: 'inspector',
  ACCOUNTANT: 'accountant'
};

// User Status Definitions
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
  DELETED: 'deleted'
};

// User Permission Categories
export const PERMISSIONS = {
  // Property Management
  PROPERTY_CREATE: 'property:create',
  PROPERTY_READ: 'property:read',
  PROPERTY_UPDATE: 'property:update',
  PROPERTY_DELETE: 'property:delete',
  
  // User Management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // Financial Management
  FINANCE_READ: 'finance:read',
  FINANCE_WRITE: 'finance:write',
  FINANCE_APPROVE: 'finance:approve',
  
  // Maintenance Management
  MAINTENANCE_CREATE: 'maintenance:create',
  MAINTENANCE_ASSIGN: 'maintenance:assign',
  MAINTENANCE_COMPLETE: 'maintenance:complete',
  
  // System Administration
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_LOGS: 'system:logs',
  SYSTEM_BACKUP: 'system:backup'
};

// Role-Permission Mapping
export const ROLE_PERMISSIONS = {
  [USER_ROLES.SYSTEM_ADMIN]: Object.values(PERMISSIONS),
  [USER_ROLES.COMPANY_ADMIN]: [
    PERMISSIONS.PROPERTY_CREATE, PERMISSIONS.PROPERTY_READ, PERMISSIONS.PROPERTY_UPDATE,
    PERMISSIONS.USER_CREATE, PERMISSIONS.USER_READ, PERMISSIONS.USER_UPDATE,
    PERMISSIONS.FINANCE_READ, PERMISSIONS.FINANCE_WRITE, PERMISSIONS.FINANCE_APPROVE,
    PERMISSIONS.MAINTENANCE_CREATE, PERMISSIONS.MAINTENANCE_ASSIGN, PERMISSIONS.MAINTENANCE_COMPLETE
  ],
  [USER_ROLES.PROPERTY_MANAGER]: [
    PERMISSIONS.PROPERTY_READ, PERMISSIONS.PROPERTY_UPDATE,
    PERMISSIONS.USER_READ, PERMISSIONS.USER_UPDATE,
    PERMISSIONS.MAINTENANCE_CREATE, PERMISSIONS.MAINTENANCE_ASSIGN,
    PERMISSIONS.FINANCE_READ
  ],
  [USER_ROLES.TENANT]: [
    PERMISSIONS.PROPERTY_READ,
    PERMISSIONS.MAINTENANCE_CREATE,
    PERMISSIONS.FINANCE_READ
  ],
  [USER_ROLES.LANDLORD]: [
    PERMISSIONS.PROPERTY_CREATE, PERMISSIONS.PROPERTY_READ, PERMISSIONS.PROPERTY_UPDATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.FINANCE_READ, PERMISSIONS.FINANCE_WRITE,
    PERMISSIONS.MAINTENANCE_CREATE, PERMISSIONS.MAINTENANCE_ASSIGN
  ]
};

// User Profile Structure
export const USER_PROFILE_FIELDS = {
  PERSONAL: ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'avatar'],
  ADDRESS: ['street', 'city', 'state', 'zipCode', 'country'],
  EMERGENCY: ['emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelation'],
  PREFERENCES: ['language', 'timezone', 'notifications', 'theme'],
  DOCUMENTS: ['idDocument', 'proofOfIncome', 'references', 'backgroundCheck']
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SYSTEM: 'system',
  PROPERTY: 'property',
  MAINTENANCE: 'maintenance',
  FINANCIAL: 'financial',
  COMMUNICATION: 'communication',
  REMINDER: 'reminder'
};

// Authentication Types
export const AUTH_TYPES = {
  EMAIL_PASSWORD: 'email_password',
  GOOGLE_SSO: 'google_sso',
  MICROSOFT_SSO: 'microsoft_sso',
  TWO_FACTOR: 'two_factor'
};

// User Activity Types
export const ACTIVITY_TYPES = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  PROFILE_UPDATE: 'profile_update',
  PASSWORD_CHANGE: 'password_change',
  PROPERTY_ACCESS: 'property_access',
  DOCUMENT_UPLOAD: 'document_upload',
  PAYMENT_MADE: 'payment_made',
  MAINTENANCE_REQUEST: 'maintenance_request'
};

// Export utility functions
export const getUserRoleDisplayName = (role) => {
  const roleNames = {
    [USER_ROLES.SYSTEM_ADMIN]: 'System Administrator',
    [USER_ROLES.COMPANY_ADMIN]: 'Company Administrator',
    [USER_ROLES.COMPANY_OWNER]: 'Company Owner',
    [USER_ROLES.PORTFOLIO_MANAGER]: 'Portfolio Manager',
    [USER_ROLES.PROPERTY_MANAGER]: 'Property Manager',
    [USER_ROLES.LEASING_SPECIALIST]: 'Leasing Specialist',
    [USER_ROLES.MAINTENANCE_SUPERVISOR]: 'Maintenance Supervisor',
    [USER_ROLES.MARKETING_SPECIALIST]: 'Marketing Specialist',
    [USER_ROLES.FINANCIAL_CONTROLLER]: 'Financial Controller',
    [USER_ROLES.LANDLORD]: 'Landlord',
    [USER_ROLES.TENANT]: 'Tenant',
    [USER_ROLES.VENDOR]: 'Vendor',
    [USER_ROLES.INSPECTOR]: 'Inspector',
    [USER_ROLES.ACCOUNTANT]: 'Accountant'
  };
  return roleNames[role] || role;
};

export const hasPermission = (userRole, permission) => {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
};

export const isAdminRole = (role) => {
  return [USER_ROLES.SYSTEM_ADMIN, USER_ROLES.COMPANY_ADMIN, USER_ROLES.COMPANY_OWNER].includes(role);
};

export const isManagementRole = (role) => {
  return [
    USER_ROLES.PORTFOLIO_MANAGER,
    USER_ROLES.PROPERTY_MANAGER,
    USER_ROLES.LEASING_SPECIALIST,
    USER_ROLES.MAINTENANCE_SUPERVISOR,
    USER_ROLES.MARKETING_SPECIALIST,
    USER_ROLES.FINANCIAL_CONTROLLER
  ].includes(role);
};

/**
 * @typedef {Object} UserProfile
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} email - User's email address (unique)
 * @property {string} phone - User's phone number
 * @property {string} avatar - URL to user's profile picture
 * @property {string} bio - User's biography
 * @property {string} address - User's physical address
 * @property {string} city - City of residence
 * @property {string} state - State/Province of residence
 * @property {string} zipCode - Postal/Zip code
 * @property {string} country - Country of residence
 * @property {string} timezone - User's timezone
 * @property {boolean} emailVerified - Has user verified their email
 * @property {boolean} phoneVerified - Has user verified their phone
 * @property {Date} lastLogin - Last login timestamp
 * @property {Object} preferences - User preferences object
 * @property {boolean} preferences.emailNotifications - Receive email notifications
 * @property {boolean} preferences.smsNotifications - Receive SMS notifications
 * @property {boolean} preferences.twoFactorEnabled - Two-factor authentication enabled
 */

/**
 * @typedef {Object} UserStatus
 * @property {string} status - User account status (active, inactive, suspended, banned)
 * @property {string} statusReason - Reason for current status
 * @property {Date} statusChangedAt - When status was last changed
 * @property {string} changedBy - User ID who changed the status
 */

/**
 * @typedef {Object} UserAuthentication
 * @property {string} id - Unique user identifier (primary key)
 * @property {string} email - Email address (unique)
 * @property {string} username - Username (unique)
 * @property {string} passwordHash - Hashed password (bcrypt)
 * @property {string} passwordSalt - Password salt for hashing
 * @property {Date} passwordChangedAt - When password was last changed
 * @property {Date} passwordExpiresAt - When password expires (null if no expiry)
 * @property {number} loginAttempts - Failed login attempt counter
 * @property {Date} lockoutUntil - Account locked until this timestamp
 * @property {boolean} emailVerified - Email verification status
 * @property {string} emailVerificationToken - Token for email verification
 * @property {Date} emailVerificationTokenExpiry - When verification token expires
 * @property {string} passwordResetToken - Token for password reset
 * @property {Date} passwordResetTokenExpiry - When reset token expires
 */

/**
 * @typedef {Object} UserCompanyAssociation
 * @property {string} userId - User ID
 * @property {string} companyId - Company ID
 * @property {string} role - Role within the company
 * @property {string} department - Department assignment
 * @property {Date} joinedAt - When user joined company
 * @property {Date} leftAt - When user left company (null if still active)
 * @property {boolean} isPrimary - Is this the user's primary company
 * @property {Object} permissions - Company-specific permissions
 */

/**
 * @typedef {Object} UserAudit
 * @property {string} userId - User ID being audited
 * @property {string} action - Action performed (login, logout, update_profile, etc.)
 * @property {string} actionType - Type: CREATE, READ, UPDATE, DELETE
 * @property {Object} changes - Object showing what changed
 * @property {Object} oldValues - Previous values
 * @property {Object} newValues - New values
 * @property {string} ipAddress - IP address of the request
 * @property {string} userAgent - User agent string
 * @property {Date} timestamp - When action occurred
 * @property {string} status - Success or failure status
 * @property {string} errorMessage - Error message if failed
 */

/**
 * @typedef {Object} User
 * @property {string} id - Unique user identifier
 * @property {string} email - User email
 * @property {string} username - Username
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} avatar - Avatar URL
 * @property {string} role - Primary role
 * @property {string[]} roles - Array of all user roles
 * @property {UserStatus} status - Current account status
 * @property {UserProfile} profile - User profile information
 * @property {UserAuthentication} authentication - Authentication details
 * @property {UserCompanyAssociation[]} companies - Associated companies
 * @property {Date} createdAt - Account creation date
 * @property {Date} updatedAt - Last update date
 * @property {Date} deletedAt - Deletion date (soft delete)
 * @property {boolean} isActive - Is user account active
 * @property {boolean} isDeleted - Is user account deleted (soft delete)
 * @property {string} createdBy - User ID who created this account
 * @property {string} updatedBy - User ID who last updated this account
 */

/**
 * @typedef {Object} UserCreateRequest
 * @property {string} email - User email (required)
 * @property {string} username - Username (required)
 * @property {string} password - Password (required)
 * @property {string} firstName - First name (required)
 * @property {string} lastName - Last name (required)
 * @property {string} phone - Phone number (optional)
 * @property {string} roleId - Initial role ID (required)
 * @property {Object} profile - Additional profile data (optional)
 */

/**
 * @typedef {Object} UserUpdateRequest
 * @property {string} firstName - First name (optional)
 * @property {string} lastName - Last name (optional)
 * @property {string} email - Email (optional)
 * @property {string} phone - Phone (optional)
 * @property {string} avatar - Avatar URL (optional)
 * @property {Object} preferences - Preferences (optional)
 * @property {Object} profile - Profile updates (optional)
 */

/**
 * @typedef {Object} UserFilterOptions
 * @property {string} role - Filter by role
 * @property {string} status - Filter by status
 * @property {string} company - Filter by company
 * @property {string} search - Search by email, name, or username
 * @property {string} sortBy - Sort field
 * @property {string} sortOrder - Sort order (asc/desc)
 * @property {number} page - Page number
 * @property {number} limit - Items per page
 * @property {Date} createdFromDate - Filter by created date start
 * @property {Date} createdToDate - Filter by created date end
 * @property {boolean} emailVerified - Filter by email verification status
 */

/**
 * @typedef {Object} UserListResponse
 * @property {number} total - Total number of users
 * @property {number} page - Current page number
 * @property {number} pages - Total number of pages
 * @property {number} limit - Items per page
 * @property {User[]} data - Array of users
 */

/**
 * @typedef {Object} UserResponse
 * @property {boolean} success - Operation success status
 * @property {string} message - Response message
 * @property {User} data - User data object
 * @property {Object} errors - Any validation errors
 * @property {Date} timestamp - Response timestamp
 */

/**
 * @typedef {Object} UserSession
 * @property {string} sessionId - Unique session identifier
 * @property {string} userId - User ID
 * @property {string} accessToken - JWT access token
 * @property {string} refreshToken - JWT refresh token
 * @property {Date} expiresAt - When session expires
 * @property {string} ipAddress - Session IP address
 * @property {string} userAgent - Session user agent
 * @property {boolean} isActive - Is session active
 * @property {Date} createdAt - When session was created
 * @property {Date} lastActivityAt - Last activity timestamp
 */

/**
 * @typedef {Object} UserNotificationPreference
 * @property {string} userId - User ID
 * @property {boolean} emailNotifications - Receive emails
 * @property {boolean} pushNotifications - Receive push notifications
 * @property {boolean} smsNotifications - Receive SMS
 * @property {string[]} notificationCategories - Categories to receive (maintenance, communication, financial, etc.)
 * @property {string} frequencyPreference - Email frequency (immediate, daily, weekly)
 * @property {boolean} marketingEmails - Receive marketing emails
 */

/**
 * @typedef {Object} UserSettings
 * @property {string} userId - User ID
 * @property {string} theme - UI theme preference (light, dark, auto)
 * @property {string} language - Preferred language
 * @property {string} timezone - Timezone preference
 * @property {boolean} compactView - Use compact UI
 * @property {Object} dashboardLayout - Dashboard widget layout preferences
 * @property {Object} columnVisibility - Visible table columns
 */

/**
 * @typedef {Object} UserRoleAssignment
 * @property {string} userId - User ID
 * @property {string} roleId - Role ID
 * @property {Date} assignedAt - When role was assigned
 * @property {string} assignedBy - User ID who assigned the role
 * @property {Date} expiresAt - When role assignment expires (optional)
 * @property {string} reason - Reason for assignment
 */

/**
 * @typedef {Object} UserPasswordPolicy
 * @property {number} minLength - Minimum password length
 * @property {boolean} requireUppercase - Require uppercase letters
 * @property {boolean} requireLowercase - Require lowercase letters
 * @property {boolean} requireNumbers - Require numbers
 * @property {boolean} requireSpecialChars - Require special characters
 * @property {number} expiryDays - Days before password expires
 * @property {number} historyCount - Number of previous passwords to check
 * @property {number} lockoutAttempts - Failed attempts before lockout
 * @property {number} lockoutDurationMinutes - Lockout duration in minutes
 */

/**
 * @typedef {Object} UserSocialAccount
 * @property {string} userId - User ID
 * @property {string} provider - OAuth provider (google, facebook, github)
 * @property {string} providerId - Provider-specific user ID
 * @property {Object} profileData - Profile data from provider
 * @property {Date} connectedAt - When account was connected
 * @property {boolean} isPrimary - Is primary authentication method
 */

// Password validation regex
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Username validation regex (alphanumeric and underscore, 3-20 chars)
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

// Phone number validation regex (basic international format)
export const PHONE_REGEX = /^\+?[\d\s\-()]{10,}$/;

// Utility function to validate password strength
export const validatePasswordStrength = (password) => {
  return {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChars: /[@$!%*?&]/.test(password),
    isStrong: PASSWORD_REGEX.test(password)
  };
};

// Utility function to format user full name
export const formatUserFullName = (user) => {
  return `${user.firstName} ${user.lastName}`.trim();
};

// Export all types as a namespace
export default {
  USER_ROLES,
  USER_STATUS,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  USER_PROFILE_FIELDS,
  NOTIFICATION_TYPES,
  AUTH_TYPES,
  ACTIVITY_TYPES,
  PASSWORD_REGEX,
  EMAIL_REGEX,
  USERNAME_REGEX,
  PHONE_REGEX,
  getUserRoleDisplayName,
  hasPermission,
  isAdminRole,
  isManagementRole,
  validatePasswordStrength,
  formatUserFullName
};