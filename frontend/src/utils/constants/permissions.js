/**
 * Permission constants for the StaySpot application
 * Defines all system permissions and their relationships
 */

/**
 * Permission categories for organization
 */
export const PERMISSION_CATEGORIES = {
  SYSTEM: 'system',
  COMPANY: 'company',
  PROPERTY: 'property',
  UNIT: 'unit',
  TENANT: 'tenant',
  LEASE: 'lease',
  FINANCIAL: 'financial',
  MAINTENANCE: 'maintenance',
  COMMUNICATION: 'communication',
  DOCUMENT: 'document',
  REPORT: 'report',
  ANALYTICS: 'analytics',
  INTEGRATION: 'integration',
  NOTIFICATION: 'notification'
};

/**
 * Permission actions
 */
export const PERMISSION_ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
  ASSIGN: 'assign',
  APPROVE: 'approve',
  EXPORT: 'export',
  IMPORT: 'import',
  CONFIGURE: 'configure',
  EXECUTE: 'execute',
  SCHEDULE: 'schedule'
};

/**
 * System permissions
 */
export const SYSTEM_PERMISSIONS = {
  // Core system administration
  SYSTEM_ADMIN: 'system:admin',
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_MONITOR: 'system:monitor',
  SYSTEM_BACKUP: 'system:backup',
  SYSTEM_RESTORE: 'system:restore',
  SYSTEM_LOGS: 'system:logs',
  SYSTEM_HEALTH: 'system:health',
  SYSTEM_MAINTENANCE: 'system:maintenance',
  
  // User management
  SYSTEM_USERS_CREATE: 'system:users:create',
  SYSTEM_USERS_READ: 'system:users:read',
  SYSTEM_USERS_UPDATE: 'system:users:update',
  SYSTEM_USERS_DELETE: 'system:users:delete',
  SYSTEM_USERS_MANAGE: 'system:users:manage',
  
  // Role management
  SYSTEM_ROLES_CREATE: 'system:roles:create',
  SYSTEM_ROLES_READ: 'system:roles:read',
  SYSTEM_ROLES_UPDATE: 'system:roles:update',
  SYSTEM_ROLES_DELETE: 'system:roles:delete',
  SYSTEM_ROLES_ASSIGN: 'system:roles:assign',
  
  // Permission management
  SYSTEM_PERMISSIONS_READ: 'system:permissions:read',
  SYSTEM_PERMISSIONS_MANAGE: 'system:permissions:manage',
  
  // Integration management
  SYSTEM_INTEGRATIONS_MANAGE: 'system:integrations:manage',
  SYSTEM_WEBHOOKS_MANAGE: 'system:webhooks:manage',
  SYSTEM_API_KEYS_MANAGE: 'system:api_keys:manage'
};

/**
 * Company permissions
 */
export const COMPANY_PERMISSIONS = {
  // Company management
  COMPANY_CREATE: 'company:create',
  COMPANY_READ: 'company:read',
  COMPANY_UPDATE: 'company:update',
  COMPANY_DELETE: 'company:delete',
  COMPANY_MANAGE: 'company:manage',
  
  // Company settings
  COMPANY_SETTINGS_READ: 'company:settings:read',
  COMPANY_SETTINGS_UPDATE: 'company:settings:update',
  COMPANY_BILLING_READ: 'company:billing:read',
  COMPANY_BILLING_MANAGE: 'company:billing:manage',
  
  // Company users
  COMPANY_USERS_CREATE: 'company:users:create',
  COMPANY_USERS_READ: 'company:users:read',
  COMPANY_USERS_UPDATE: 'company:users:update',
  COMPANY_USERS_DELETE: 'company:users:delete',
  COMPANY_USERS_INVITE: 'company:users:invite',
  
  // Company roles
  COMPANY_ROLES_ASSIGN: 'company:roles:assign',
  COMPANY_ROLES_MANAGE: 'company:roles:manage'
};

/**
 * Property permissions
 */
export const PROPERTY_PERMISSIONS = {
  // Property CRUD
  PROPERTY_CREATE: 'property:create',
  PROPERTY_READ: 'property:read',
  PROPERTY_UPDATE: 'property:update',
  PROPERTY_DELETE: 'property:delete',
  PROPERTY_MANAGE: 'property:manage',
  
  // Property assignment
  PROPERTY_ASSIGN: 'property:assign',
  PROPERTY_TRANSFER: 'property:transfer',
  
  // Property details
  PROPERTY_DETAILS_READ: 'property:details:read',
  PROPERTY_DETAILS_UPDATE: 'property:details:update',
  PROPERTY_AMENITIES_MANAGE: 'property:amenities:manage',
  PROPERTY_IMAGES_MANAGE: 'property:images:manage',
  
  // Property analytics
  PROPERTY_ANALYTICS_READ: 'property:analytics:read',
  PROPERTY_PERFORMANCE_READ: 'property:performance:read',
  
  // Property settings
  PROPERTY_SETTINGS_READ: 'property:settings:read',
  PROPERTY_SETTINGS_UPDATE: 'property:settings:update'
};

/**
 * Unit permissions
 */
export const UNIT_PERMISSIONS = {
  // Unit CRUD
  UNIT_CREATE: 'unit:create',
  UNIT_READ: 'unit:read',
  UNIT_UPDATE: 'unit:update',
  UNIT_DELETE: 'unit:delete',
  UNIT_MANAGE: 'unit:manage',
  
  // Unit assignment
  UNIT_ASSIGN: 'unit:assign',
  UNIT_AVAILABILITY_MANAGE: 'unit:availability:manage',
  
  // Unit details
  UNIT_DETAILS_READ: 'unit:details:read',
  UNIT_DETAILS_UPDATE: 'unit:details:update',
  UNIT_PRICING_READ: 'unit:pricing:read',
  UNIT_PRICING_UPDATE: 'unit:pricing:update'
};

/**
 * Tenant permissions
 */
export const TENANT_PERMISSIONS = {
  // Tenant CRUD
  TENANT_CREATE: 'tenant:create',
  TENANT_READ: 'tenant:read',
  TENANT_UPDATE: 'tenant:update',
  TENANT_DELETE: 'tenant:delete',
  TENANT_MANAGE: 'tenant:manage',
  
  // Tenant applications
  TENANT_APPLICATIONS_READ: 'tenant:applications:read',
  TENANT_APPLICATIONS_PROCESS: 'tenant:applications:process',
  TENANT_APPLICATIONS_APPROVE: 'tenant:applications:approve',
  
  // Tenant screening
  TENANT_SCREENING_READ: 'tenant:screening:read',
  TENANT_SCREENING_MANAGE: 'tenant:screening:manage',
  
  // Tenant communication
  TENANT_COMMUNICATE: 'tenant:communicate',
  TENANT_NOTIFICATIONS_SEND: 'tenant:notifications:send',
  
  // Tenant documents
  TENANT_DOCUMENTS_READ: 'tenant:documents:read',
  TENANT_DOCUMENTS_MANAGE: 'tenant:documents:manage'
};

/**
 * Lease permissions
 */
export const LEASE_PERMISSIONS = {
  // Lease CRUD
  LEASE_CREATE: 'lease:create',
  LEASE_READ: 'lease:read',
  LEASE_UPDATE: 'lease:update',
  LEASE_DELETE: 'lease:delete',
  LEASE_MANAGE: 'lease:manage',
  
  // Lease actions
  LEASE_SIGN: 'lease:sign',
  LEASE_EXECUTE: 'lease:execute',
  LEASE_TERMINATE: 'lease:terminate',
  LEASE_RENEW: 'lease:renew',
  
  // Lease templates
  LEASE_TEMPLATES_READ: 'lease:templates:read',
  LEASE_TEMPLATES_MANAGE: 'lease:templates:manage',
  
  // Lease violations
  LEASE_VIOLATIONS_READ: 'lease:violations:read',
  LEASE_VIOLATIONS_MANAGE: 'lease:violations:manage'
};

/**
 * Financial permissions
 */
export const FINANCIAL_PERMISSIONS = {
  // Financial overview
  FINANCIAL_READ: 'financial:read',
  FINANCIAL_MANAGE: 'financial:manage',
  FINANCIAL_EXPORT: 'financial:export',
  
  // Payments
  FINANCIAL_PAYMENTS_READ: 'financial:payments:read',
  FINANCIAL_PAYMENTS_PROCESS: 'financial:payments:process',
  FINANCIAL_PAYMENTS_REFUND: 'financial:payments:refund',
  
  // Invoices
  FINANCIAL_INVOICES_CREATE: 'financial:invoices:create',
  FINANCIAL_INVOICES_READ: 'financial:invoices:read',
  FINANCIAL_INVOICES_UPDATE: 'financial:invoices:update',
  FINANCIAL_INVOICES_SEND: 'financial:invoices:send',
  
  // Budgets
  FINANCIAL_BUDGETS_CREATE: 'financial:budgets:create',
  FINANCIAL_BUDGETS_READ: 'financial:budgets:read',
  FINANCIAL_BUDGETS_UPDATE: 'financial:budgets:update',
  FINANCIAL_BUDGETS_APPROVE: 'financial:budgets:approve',
  
  // Expenses
  FINANCIAL_EXPENSES_CREATE: 'financial:expenses:create',
  FINANCIAL_EXPENSES_READ: 'financial:expenses:read',
  FINANCIAL_EXPENSES_UPDATE: 'financial:expenses:update',
  FINANCIAL_EXPENSES_APPROVE: 'financial:expenses:approve',
  
  // Revenue
  FINANCIAL_REVENUE_READ: 'financial:revenue:read',
  FINANCIAL_REVENUE_MANAGE: 'financial:revenue:manage',
  
  // Accounting
  FINANCIAL_ACCOUNTING_READ: 'financial:accounting:read',
  FINANCIAL_ACCOUNTING_MANAGE: 'financial:accounting:manage',
  FINANCIAL_RECONCILIATION: 'financial:reconciliation',
  
  // Tax management
  FINANCIAL_TAX_READ: 'financial:tax:read',
  FINANCIAL_TAX_MANAGE: 'financial:tax:manage'
};

/**
 * Maintenance permissions
 */
export const MAINTENANCE_PERMISSIONS = {
  // Maintenance requests
  MAINTENANCE_REQUESTS_CREATE: 'maintenance:requests:create',
  MAINTENANCE_REQUESTS_READ: 'maintenance:requests:read',
  MAINTENANCE_REQUESTS_UPDATE: 'maintenance:requests:update',
  MAINTENANCE_REQUESTS_DELETE: 'maintenance:requests:delete',
  MAINTENANCE_REQUESTS_ASSIGN: 'maintenance:requests:assign',
  
  // Work orders
  MAINTENANCE_WORK_ORDERS_CREATE: 'maintenance:work_orders:create',
  MAINTENANCE_WORK_ORDERS_READ: 'maintenance:work_orders:read',
  MAINTENANCE_WORK_ORDERS_UPDATE: 'maintenance:work_orders:update',
  MAINTENANCE_WORK_ORDERS_COMPLETE: 'maintenance:work_orders:complete',
  MAINTENANCE_WORK_ORDERS_APPROVE: 'maintenance:work_orders:approve',
  
  // Vendors
  MAINTENANCE_VENDORS_CREATE: 'maintenance:vendors:create',
  MAINTENANCE_VENDORS_READ: 'maintenance:vendors:read',
  MAINTENANCE_VENDORS_UPDATE: 'maintenance:vendors:update',
  MAINTENANCE_VENDORS_MANAGE: 'maintenance:vendors:manage',
  
  // Preventive maintenance
  MAINTENANCE_PREVENTIVE_CREATE: 'maintenance:preventive:create',
  MAINTENANCE_PREVENTIVE_READ: 'maintenance:preventive:read',
  MAINTENANCE_PREVENTIVE_SCHEDULE: 'maintenance:preventive:schedule',
  
  // Inventory
  MAINTENANCE_INVENTORY_READ: 'maintenance:inventory:read',
  MAINTENANCE_INVENTORY_MANAGE: 'maintenance:inventory:manage',
  
  // Inspections
  MAINTENANCE_INSPECTIONS_CREATE: 'maintenance:inspections:create',
  MAINTENANCE_INSPECTIONS_READ: 'maintenance:inspections:read',
  MAINTENANCE_INSPECTIONS_CONDUCT: 'maintenance:inspections:conduct',
  MAINTENANCE_INSPECTIONS_SCHEDULE: 'maintenance:inspections:schedule'
};

/**
 * Communication permissions
 */
export const COMMUNICATION_PERMISSIONS = {
  // Messages
  COMMUNICATION_MESSAGES_SEND: 'communication:messages:send',
  COMMUNICATION_MESSAGES_READ: 'communication:messages:read',
  COMMUNICATION_MESSAGES_MANAGE: 'communication:messages:manage',
  
  // Announcements
  COMMUNICATION_ANNOUNCEMENTS_CREATE: 'communication:announcements:create',
  COMMUNICATION_ANNOUNCEMENTS_READ: 'communication:announcements:read',
  COMMUNICATION_ANNOUNCEMENTS_SEND: 'communication:announcements:send',
  
  // Broadcasts
  COMMUNICATION_BROADCAST: 'communication:broadcast',
  COMMUNICATION_BULK_SEND: 'communication:bulk_send',
  
  // Templates
  COMMUNICATION_TEMPLATES_CREATE: 'communication:templates:create',
  COMMUNICATION_TEMPLATES_READ: 'communication:templates:read',
  COMMUNICATION_TEMPLATES_UPDATE: 'communication:templates:update',
  COMMUNICATION_TEMPLATES_MANAGE: 'communication:templates:manage'
};

/**
 * Document permissions
 */
export const DOCUMENT_PERMISSIONS = {
  // Document CRUD
  DOCUMENT_CREATE: 'document:create',
  DOCUMENT_READ: 'document:read',
  DOCUMENT_UPDATE: 'document:update',
  DOCUMENT_DELETE: 'document:delete',
  
  // Document actions
  DOCUMENT_UPLOAD: 'document:upload',
  DOCUMENT_DOWNLOAD: 'document:download',
  DOCUMENT_SHARE: 'document:share',
  DOCUMENT_SIGN: 'document:sign',
  
  // Document categories
  DOCUMENT_LEASE_MANAGE: 'document:lease:manage',
  DOCUMENT_FINANCIAL_MANAGE: 'document:financial:manage',
  DOCUMENT_MAINTENANCE_MANAGE: 'document:maintenance:manage',
  DOCUMENT_LEGAL_MANAGE: 'document:legal:manage'
};

/**
 * Report permissions
 */
export const REPORT_PERMISSIONS = {
  // Report access
  REPORTS_READ: 'reports:read',
  REPORTS_CREATE: 'reports:create',
  REPORTS_EXPORT: 'reports:export',
  REPORTS_SCHEDULE: 'reports:schedule',
  
  // Report types
  REPORTS_FINANCIAL: 'reports:financial',
  REPORTS_OCCUPANCY: 'reports:occupancy',
  REPORTS_MAINTENANCE: 'reports:maintenance',
  REPORTS_LEASING: 'reports:leasing',
  REPORTS_CUSTOM: 'reports:custom',
  
  // Report management
  REPORTS_MANAGE: 'reports:manage',
  REPORTS_SHARE: 'reports:share'
};

/**
 * Analytics permissions
 */
export const ANALYTICS_PERMISSIONS = {
  // Analytics access
  ANALYTICS_READ: 'analytics:read',
  ANALYTICS_DASHBOARD: 'analytics:dashboard',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // Analytics types
  ANALYTICS_PROPERTY: 'analytics:property',
  ANALYTICS_FINANCIAL: 'analytics:financial',
  ANALYTICS_TENANT: 'analytics:tenant',
  ANALYTICS_MAINTENANCE: 'analytics:maintenance',
  ANALYTICS_MARKETING: 'analytics:marketing',
  
  // Advanced analytics
  ANALYTICS_ADVANCED: 'analytics:advanced',
  ANALYTICS_PREDICTIVE: 'analytics:predictive'
};

/**
 * Integration permissions
 */
export const INTEGRATION_PERMISSIONS = {
  // Integration management
  INTEGRATIONS_READ: 'integrations:read',
  INTEGRATIONS_CONFIGURE: 'integrations:configure',
  INTEGRATIONS_MANAGE: 'integrations:manage',
  
  // Webhook management
  WEBHOOKS_CREATE: 'webhooks:create',
  WEBHOOKS_READ: 'webhooks:read',
  WEBHOOKS_UPDATE: 'webhooks:update',
  WEBHOOKS_DELETE: 'webhooks:delete',
  WEBHOOKS_TEST: 'webhooks:test',
  
  // API management
  API_KEYS_CREATE: 'api_keys:create',
  API_KEYS_READ: 'api_keys:read',
  API_KEYS_REVOKE: 'api_keys:revoke',
  API_KEYS_MANAGE: 'api_keys:manage'
};

/**
 * Notification permissions
 */
export const NOTIFICATION_PERMISSIONS = {
  // Notification management
  NOTIFICATIONS_READ: 'notifications:read',
  NOTIFICATIONS_SEND: 'notifications:send',
  NOTIFICATIONS_MANAGE: 'notifications:manage',
  
  // Notification templates
  NOTIFICATION_TEMPLATES_CREATE: 'notification_templates:create',
  NOTIFICATION_TEMPLATES_READ: 'notification_templates:read',
  NOTIFICATION_TEMPLATES_UPDATE: 'notification_templates:update',
  NOTIFICATION_TEMPLATES_DELETE: 'notification_templates:delete',
  
  // Notification settings
  NOTIFICATION_SETTINGS_READ: 'notification_settings:read',
  NOTIFICATION_SETTINGS_UPDATE: 'notification_settings:update'
};

/**
 * All permissions grouped by category
 */
export const PERMISSIONS_BY_CATEGORY = {
  [PERMISSION_CATEGORIES.SYSTEM]: SYSTEM_PERMISSIONS,
  [PERMISSION_CATEGORIES.COMPANY]: COMPANY_PERMISSIONS,
  [PERMISSION_CATEGORIES.PROPERTY]: PROPERTY_PERMISSIONS,
  [PERMISSION_CATEGORIES.UNIT]: UNIT_PERMISSIONS,
  [PERMISSION_CATEGORIES.TENANT]: TENANT_PERMISSIONS,
  [PERMISSION_CATEGORIES.LEASE]: LEASE_PERMISSIONS,
  [PERMISSION_CATEGORIES.FINANCIAL]: FINANCIAL_PERMISSIONS,
  [PERMISSION_CATEGORIES.MAINTENANCE]: MAINTENANCE_PERMISSIONS,
  [PERMISSION_CATEGORIES.COMMUNICATION]: COMMUNICATION_PERMISSIONS,
  [PERMISSION_CATEGORIES.DOCUMENT]: DOCUMENT_PERMISSIONS,
  [PERMISSION_CATEGORIES.REPORT]: REPORT_PERMISSIONS,
  [PERMISSION_CATEGORIES.ANALYTICS]: ANALYTICS_PERMISSIONS,
  [PERMISSION_CATEGORIES.INTEGRATION]: INTEGRATION_PERMISSIONS,
  [PERMISSION_CATEGORIES.NOTIFICATION]: NOTIFICATION_PERMISSIONS
};

/**
 * All permissions as a flat array
 */
export const ALL_PERMISSIONS = Object.values(PERMISSIONS_BY_CATEGORY).reduce(
  (acc, categoryPermissions) => [...acc, ...Object.values(categoryPermissions)],
  []
);

/**
 * Permission display names
 */
export const PERMISSION_DISPLAY_NAMES = {
  // System permissions
  [SYSTEM_PERMISSIONS.SYSTEM_ADMIN]: 'System Administration',
  [SYSTEM_PERMISSIONS.SYSTEM_CONFIG]: 'System Configuration',
  [SYSTEM_PERMISSIONS.SYSTEM_MONITOR]: 'System Monitoring',
  [SYSTEM_PERMISSIONS.SYSTEM_USERS_MANAGE]: 'Manage System Users',
  [SYSTEM_PERMISSIONS.SYSTEM_ROLES_MANAGE]: 'Manage System Roles',
  
  // Company permissions
  [COMPANY_PERMISSIONS.COMPANY_MANAGE]: 'Manage Company',
  [COMPANY_PERMISSIONS.COMPANY_USERS_MANAGE]: 'Manage Company Users',
  [COMPANY_PERMISSIONS.COMPANY_SETTINGS_UPDATE]: 'Update Company Settings',
  
  // Property permissions
  [PROPERTY_PERMISSIONS.PROPERTY_CREATE]: 'Create Properties',
  [PROPERTY_PERMISSIONS.PROPERTY_READ]: 'View Properties',
  [PROPERTY_PERMISSIONS.PROPERTY_UPDATE]: 'Update Properties',
  [PROPERTY_PERMISSIONS.PROPERTY_DELETE]: 'Delete Properties',
  [PROPERTY_PERMISSIONS.PROPERTY_MANAGE]: 'Manage Properties',
  
  // Financial permissions
  [FINANCIAL_PERMISSIONS.FINANCIAL_READ]: 'View Financial Data',
  [FINANCIAL_PERMISSIONS.FINANCIAL_MANAGE]: 'Manage Finances',
  [FINANCIAL_PERMISSIONS.FINANCIAL_PAYMENTS_PROCESS]: 'Process Payments',
  [FINANCIAL_PERMISSIONS.FINANCIAL_BUDGETS_MANAGE]: 'Manage Budgets',
  
  // Maintenance permissions
  [MAINTENANCE_PERMISSIONS.MAINTENANCE_REQUESTS_CREATE]: 'Create Maintenance Requests',
  [MAINTENANCE_PERMISSIONS.MAINTENANCE_WORK_ORDERS_MANAGE]: 'Manage Work Orders',
  [MAINTENANCE_PERMISSIONS.MAINTENANCE_VENDORS_MANAGE]: 'Manage Vendors',
  
  // Communication permissions
  [COMMUNICATION_PERMISSIONS.COMMUNICATION_MESSAGES_SEND]: 'Send Messages',
  [COMMUNICATION_PERMISSIONS.COMMUNICATION_BROADCAST]: 'Send Broadcasts',
  [COMMUNICATION_PERMISSIONS.COMMUNICATION_TEMPLATES_MANAGE]: 'Manage Templates'
};

/**
 * Permission descriptions
 */
export const PERMISSION_DESCRIPTIONS = {
  [SYSTEM_PERMISSIONS.SYSTEM_ADMIN]: 'Full system administration access including user management, system configuration, and monitoring',
  [COMPANY_PERMISSIONS.COMPANY_MANAGE]: 'Complete company management including settings, users, and operations',
  [PROPERTY_PERMISSIONS.PROPERTY_MANAGE]: 'Full property management including creation, updates, and assignment',
  [FINANCIAL_PERMISSIONS.FINANCIAL_MANAGE]: 'Complete financial management including payments, budgets, and reporting',
  [MAINTENANCE_PERMISSIONS.MAINTENANCE_REQUESTS_CREATE]: 'Ability to create and submit maintenance requests',
  [COMMUNICATION_PERMISSIONS.COMMUNICATION_MESSAGES_SEND]: 'Send messages to other users in the system'
};

/**
 * Permission dependencies (permissions that require other permissions)
 */
export const PERMISSION_DEPENDENCIES = {
  [SYSTEM_PERMISSIONS.SYSTEM_USERS_DELETE]: [SYSTEM_PERMISSIONS.SYSTEM_USERS_READ],
  [COMPANY_PERMISSIONS.COMPANY_USERS_DELETE]: [COMPANY_PERMISSIONS.COMPANY_USERS_READ],
  [PROPERTY_PERMISSIONS.PROPERTY_UPDATE]: [PROPERTY_PERMISSIONS.PROPERTY_READ],
  [PROPERTY_PERMISSIONS.PROPERTY_DELETE]: [PROPERTY_PERMISSIONS.PROPERTY_READ],
  [FINANCIAL_PERMISSIONS.FINANCIAL_PAYMENTS_REFUND]: [FINANCIAL_PERMISSIONS.FINANCIAL_PAYMENTS_READ],
  [MAINTENANCE_PERMISSIONS.MAINTENANCE_WORK_ORDERS_COMPLETE]: [MAINTENANCE_PERMISSIONS.MAINTENANCE_WORK_ORDERS_READ]
};

/**
 * Conflicting permissions (permissions that cannot be held together)
 */
export const PERMISSION_CONFLICTS = {
  // Example: A user cannot both create and approve the same type of request
  [FINANCIAL_PERMISSIONS.FINANCIAL_EXPENSES_CREATE]: [FINANCIAL_PERMISSIONS.FINANCIAL_EXPENSES_APPROVE],
  [MAINTENANCE_PERMISSIONS.MAINTENANCE_REQUESTS_CREATE]: [MAINTENANCE_PERMISSIONS.MAINTENANCE_REQUESTS_APPROVE]
};

/**
 * Permission scopes (what level the permission applies to)
 */
export const PERMISSION_SCOPES = {
  GLOBAL: 'global',
  COMPANY: 'company',
  PROPERTY: 'property',
  UNIT: 'unit',
  PERSONAL: 'personal'
};

/**
 * Permission scope mappings
 */
export const PERMISSION_SCOPE_MAPPING = {
  // Global scope permissions
  [PERMISSION_SCOPES.GLOBAL]: Object.values(SYSTEM_PERMISSIONS),
  
  // Company scope permissions
  [PERMISSION_SCOPES.COMPANY]: [
    ...Object.values(COMPANY_PERMISSIONS),
    ...Object.values(REPORT_PERMISSIONS),
    ...Object.values(ANALYTICS_PERMISSIONS)
  ],
  
  // Property scope permissions
  [PERMISSION_SCOPES.PROPERTY]: [
    ...Object.values(PROPERTY_PERMISSIONS),
    ...Object.values(UNIT_PERMISSIONS),
    ...Object.values(TENANT_PERMISSIONS),
    ...Object.values(LEASE_PERMISSIONS),
    ...Object.values(MAINTENANCE_PERMISSIONS)
  ],
  
  // Personal scope permissions
  [PERMISSION_SCOPES.PERSONAL]: [
    TENANT_PERMISSIONS.TENANT_READ,
    LEASE_PERMISSIONS.LEASE_READ,
    FINANCIAL_PERMISSIONS.FINANCIAL_PAYMENTS_READ,
    MAINTENANCE_PERMISSIONS.MAINTENANCE_REQUESTS_CREATE,
    COMMUNICATION_PERMISSIONS.COMMUNICATION_MESSAGES_SEND,
    DOCUMENT_PERMISSIONS.DOCUMENT_READ
  ]
};

/**
 * Utility functions for permission management
 */
export const PERMISSION_UTILS = {
  /**
   * Get permissions by category
   * @param {string} category - Permission category
   * @returns {Array} Permissions in category
   */
  getPermissionsByCategory: (category) => {
    return Object.values(PERMISSIONS_BY_CATEGORY[category] || {});
  },

  /**
   * Get permission display name
   * @param {string} permission - Permission key
   * @returns {string} Display name
   */
  getPermissionDisplayName: (permission) => {
    return PERMISSION_DISPLAY_NAMES[permission] || permission;
  },

  /**
   * Get permission description
   * @param {string} permission - Permission key
   * @returns {string} Description
   */
  getPermissionDescription: (permission) => {
    return PERMISSION_DESCRIPTIONS[permission] || '';
  },

  /**
   * Check if permission has dependencies
   * @param {string} permission - Permission to check
   * @returns {Array} Required permissions
   */
  getPermissionDependencies: (permission) => {
    return PERMISSION_DEPENDENCIES[permission] || [];
  },

  /**
   * Check if permissions conflict
   * @param {string} permission1 - First permission
   * @param {string} permission2 - Second permission
   * @returns {boolean} Whether permissions conflict
   */
  doPermissionsConflict: (permission1, permission2) => {
    const conflicts1 = PERMISSION_CONFLICTS[permission1] || [];
    const conflicts2 = PERMISSION_CONFLICTS[permission2] || [];
    
    return conflicts1.includes(permission2) || conflicts2.includes(permission1);
  },

  /**
   * Get permission scope
   * @param {string} permission - Permission to check
   * @returns {string} Permission scope
   */
  getPermissionScope: (permission) => {
    for (const [scope, permissions] of Object.entries(PERMISSION_SCOPE_MAPPING)) {
      if (permissions.includes(permission)) {
        return scope;
      }
    }
    return PERMISSION_SCOPES.PERSONAL;
  },

  /**
   * Validate permission set
   * @param {Array} permissions - Permissions to validate
   * @returns {Object} Validation result
   */
  validatePermissionSet: (permissions) => {
    const errors = [];
    const warnings = [];

    // Check dependencies
    permissions.forEach(permission => {
      const dependencies = PERMISSION_UTILS.getPermissionDependencies(permission);
      const missingDependencies = dependencies.filter(dep => !permissions.includes(dep));
      
      if (missingDependencies.length > 0) {
        errors.push({
          permission,
          type: 'missing_dependencies',
          missing: missingDependencies
        });
      }
    });

    // Check conflicts
    for (let i = 0; i < permissions.length; i++) {
      for (let j = i + 1; j < permissions.length; j++) {
        if (PERMISSION_UTILS.doPermissionsConflict(permissions[i], permissions[j])) {
          warnings.push({
            type: 'conflicting_permissions',
            permissions: [permissions[i], permissions[j]]
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
};

// Export all permission constants and utilities
export default {
  PERMISSION_CATEGORIES,
  PERMISSION_ACTIONS,
  SYSTEM_PERMISSIONS,
  COMPANY_PERMISSIONS,
  PROPERTY_PERMISSIONS,
  UNIT_PERMISSIONS,
  TENANT_PERMISSIONS,
  LEASE_PERMISSIONS,
  FINANCIAL_PERMISSIONS,
  MAINTENANCE_PERMISSIONS,
  COMMUNICATION_PERMISSIONS,
  DOCUMENT_PERMISSIONS,
  REPORT_PERMISSIONS,
  ANALYTICS_PERMISSIONS,
  INTEGRATION_PERMISSIONS,
  NOTIFICATION_PERMISSIONS,
  PERMISSIONS_BY_CATEGORY,
  ALL_PERMISSIONS,
  PERMISSION_DISPLAY_NAMES,
  PERMISSION_DESCRIPTIONS,
  PERMISSION_DEPENDENCIES,
  PERMISSION_CONFLICTS,
  PERMISSION_SCOPES,
  PERMISSION_SCOPE_MAPPING,
  PERMISSION_UTILS
};