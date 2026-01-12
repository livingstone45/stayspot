/**
 * Role and permission utilities for user access control
 * Provides comprehensive role-based access control functions
 */

/**
 * System roles hierarchy
 */
export const ROLES = {
  // Administrative roles
  SYSTEM_ADMIN: 'system_admin',
  COMPANY_ADMIN: 'company_admin',
  COMPANY_OWNER: 'company_owner',

  // Management roles
  PORTFOLIO_MANAGER: 'portfolio_manager',
  PROPERTY_MANAGER: 'property_manager',
  LEASING_SPECIALIST: 'leasing_specialist',
  MAINTENANCE_SUPERVISOR: 'maintenance_supervisor',
  MARKETING_SPECIALIST: 'marketing_specialist',
  FINANCIAL_CONTROLLER: 'financial_controller',

  // User roles
  LANDLORD: 'landlord',
  TENANT: 'tenant',
  VENDOR: 'vendor',
  INSPECTOR: 'inspector',
  ACCOUNTANT: 'accountant'
};

/**
 * Role hierarchy levels (higher number = more permissions)
 */
export const ROLE_HIERARCHY = {
  [ROLES.SYSTEM_ADMIN]: 100,
  [ROLES.COMPANY_ADMIN]: 90,
  [ROLES.COMPANY_OWNER]: 85,
  [ROLES.PORTFOLIO_MANAGER]: 80,
  [ROLES.PROPERTY_MANAGER]: 70,
  [ROLES.FINANCIAL_CONTROLLER]: 65,
  [ROLES.MAINTENANCE_SUPERVISOR]: 60,
  [ROLES.LEASING_SPECIALIST]: 55,
  [ROLES.MARKETING_SPECIALIST]: 50,
  [ROLES.LANDLORD]: 40,
  [ROLES.ACCOUNTANT]: 35,
  [ROLES.INSPECTOR]: 30,
  [ROLES.VENDOR]: 20,
  [ROLES.TENANT]: 10
};

/**
 * Permission categories
 */
export const PERMISSION_CATEGORIES = {
  SYSTEM: 'system',
  COMPANY: 'company',
  PROPERTY: 'property',
  TENANT: 'tenant',
  FINANCIAL: 'financial',
  MAINTENANCE: 'maintenance',
  REPORTING: 'reporting',
  COMMUNICATION: 'communication'
};

/**
 * System permissions
 */
export const PERMISSIONS = {
  // System permissions
  SYSTEM_ADMIN: 'system:admin',
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_USERS: 'system:users',
  SYSTEM_ROLES: 'system:roles',
  SYSTEM_BACKUP: 'system:backup',
  SYSTEM_LOGS: 'system:logs',
  SYSTEM_MONITORING: 'system:monitoring',

  // Company permissions
  COMPANY_CREATE: 'company:create',
  COMPANY_READ: 'company:read',
  COMPANY_UPDATE: 'company:update',
  COMPANY_DELETE: 'company:delete',
  COMPANY_MANAGE_USERS: 'company:manage_users',
  COMPANY_SETTINGS: 'company:settings',

  // Property permissions
  PROPERTY_CREATE: 'property:create',
  PROPERTY_READ: 'property:read',
  PROPERTY_UPDATE: 'property:update',
  PROPERTY_DELETE: 'property:delete',
  PROPERTY_MANAGE: 'property:manage',
  PROPERTY_ASSIGN: 'property:assign',
  PROPERTY_ANALYTICS: 'property:analytics',

  // Unit permissions
  UNIT_CREATE: 'unit:create',
  UNIT_READ: 'unit:read',
  UNIT_UPDATE: 'unit:update',
  UNIT_DELETE: 'unit:delete',
  UNIT_ASSIGN: 'unit:assign',

  // Tenant permissions
  TENANT_CREATE: 'tenant:create',
  TENANT_READ: 'tenant:read',
  TENANT_UPDATE: 'tenant:update',
  TENANT_DELETE: 'tenant:delete',
  TENANT_COMMUNICATE: 'tenant:communicate',
  TENANT_DOCUMENTS: 'tenant:documents',

  // Lease permissions
  LEASE_CREATE: 'lease:create',
  LEASE_READ: 'lease:read',
  LEASE_UPDATE: 'lease:update',
  LEASE_DELETE: 'lease:delete',
  LEASE_SIGN: 'lease:sign',
  LEASE_TERMINATE: 'lease:terminate',

  // Financial permissions
  FINANCIAL_READ: 'financial:read',
  FINANCIAL_MANAGE: 'financial:manage',
  FINANCIAL_PAYMENTS: 'financial:payments',
  FINANCIAL_INVOICES: 'financial:invoices',
  FINANCIAL_REPORTS: 'financial:reports',
  FINANCIAL_BUDGETS: 'financial:budgets',

  // Maintenance permissions
  MAINTENANCE_CREATE: 'maintenance:create',
  MAINTENANCE_READ: 'maintenance:read',
  MAINTENANCE_UPDATE: 'maintenance:update',
  MAINTENANCE_DELETE: 'maintenance:delete',
  MAINTENANCE_ASSIGN: 'maintenance:assign',
  MAINTENANCE_COMPLETE: 'maintenance:complete',
  MAINTENANCE_VENDORS: 'maintenance:vendors',

  // Reporting permissions
  REPORTS_VIEW: 'reports:view',
  REPORTS_CREATE: 'reports:create',
  REPORTS_EXPORT: 'reports:export',
  REPORTS_SCHEDULE: 'reports:schedule',

  // Communication permissions
  COMMUNICATION_SEND: 'communication:send',
  COMMUNICATION_BROADCAST: 'communication:broadcast',
  COMMUNICATION_TEMPLATES: 'communication:templates',

  // Document permissions
  DOCUMENTS_READ: 'documents:read',
  DOCUMENTS_UPLOAD: 'documents:upload',
  DOCUMENTS_DELETE: 'documents:delete',
  DOCUMENTS_SHARE: 'documents:share'
};

/**
 * Role-based permission mappings
 */
export const ROLE_PERMISSIONS = {
  [ROLES.SYSTEM_ADMIN]: [
    // All system permissions
    PERMISSIONS.SYSTEM_ADMIN,
    PERMISSIONS.SYSTEM_CONFIG,
    PERMISSIONS.SYSTEM_USERS,
    PERMISSIONS.SYSTEM_ROLES,
    PERMISSIONS.SYSTEM_BACKUP,
    PERMISSIONS.SYSTEM_LOGS,
    PERMISSIONS.SYSTEM_MONITORING,
    // All other permissions
    ...Object.values(PERMISSIONS).filter(p => !p.startsWith('system:'))
  ],

  [ROLES.COMPANY_ADMIN]: [
    PERMISSIONS.COMPANY_CREATE,
    PERMISSIONS.COMPANY_READ,
    PERMISSIONS.COMPANY_UPDATE,
    PERMISSIONS.COMPANY_DELETE,
    PERMISSIONS.COMPANY_MANAGE_USERS,
    PERMISSIONS.COMPANY_SETTINGS,
    PERMISSIONS.PROPERTY_CREATE,
    PERMISSIONS.PROPERTY_READ,
    PERMISSIONS.PROPERTY_UPDATE,
    PERMISSIONS.PROPERTY_DELETE,
    PERMISSIONS.PROPERTY_MANAGE,
    PERMISSIONS.PROPERTY_ASSIGN,
    PERMISSIONS.PROPERTY_ANALYTICS,
    PERMISSIONS.UNIT_CREATE,
    PERMISSIONS.UNIT_READ,
    PERMISSIONS.UNIT_UPDATE,
    PERMISSIONS.UNIT_DELETE,
    PERMISSIONS.UNIT_ASSIGN,
    PERMISSIONS.TENANT_CREATE,
    PERMISSIONS.TENANT_READ,
    PERMISSIONS.TENANT_UPDATE,
    PERMISSIONS.TENANT_DELETE,
    PERMISSIONS.TENANT_COMMUNICATE,
    PERMISSIONS.TENANT_DOCUMENTS,
    PERMISSIONS.LEASE_CREATE,
    PERMISSIONS.LEASE_READ,
    PERMISSIONS.LEASE_UPDATE,
    PERMISSIONS.LEASE_DELETE,
    PERMISSIONS.LEASE_SIGN,
    PERMISSIONS.LEASE_TERMINATE,
    PERMISSIONS.FINANCIAL_READ,
    PERMISSIONS.FINANCIAL_MANAGE,
    PERMISSIONS.FINANCIAL_PAYMENTS,
    PERMISSIONS.FINANCIAL_INVOICES,
    PERMISSIONS.FINANCIAL_REPORTS,
    PERMISSIONS.FINANCIAL_BUDGETS,
    PERMISSIONS.MAINTENANCE_CREATE,
    PERMISSIONS.MAINTENANCE_READ,
    PERMISSIONS.MAINTENANCE_UPDATE,
    PERMISSIONS.MAINTENANCE_DELETE,
    PERMISSIONS.MAINTENANCE_ASSIGN,
    PERMISSIONS.MAINTENANCE_COMPLETE,
    PERMISSIONS.MAINTENANCE_VENDORS,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_CREATE,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.REPORTS_SCHEDULE,
    PERMISSIONS.COMMUNICATION_SEND,
    PERMISSIONS.COMMUNICATION_BROADCAST,
    PERMISSIONS.COMMUNICATION_TEMPLATES,
    PERMISSIONS.DOCUMENTS_READ,
    PERMISSIONS.DOCUMENTS_UPLOAD,
    PERMISSIONS.DOCUMENTS_DELETE,
    PERMISSIONS.DOCUMENTS_SHARE
  ],

  [ROLES.COMPANY_OWNER]: [
    PERMISSIONS.COMPANY_READ,
    PERMISSIONS.COMPANY_UPDATE,
    PERMISSIONS.COMPANY_SETTINGS,
    PERMISSIONS.PROPERTY_READ,
    PERMISSIONS.PROPERTY_ANALYTICS,
    PERMISSIONS.TENANT_READ,
    PERMISSIONS.LEASE_READ,
    PERMISSIONS.FINANCIAL_READ,
    PERMISSIONS.FINANCIAL_REPORTS,
    PERMISSIONS.FINANCIAL_BUDGETS,
    PERMISSIONS.MAINTENANCE_READ,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_CREATE,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.COMMUNICATION_SEND,
    PERMISSIONS.DOCUMENTS_READ
  ],

  [ROLES.PORTFOLIO_MANAGER]: [
    PERMISSIONS.PROPERTY_CREATE,
    PERMISSIONS.PROPERTY_READ,
    PERMISSIONS.PROPERTY_UPDATE,
    PERMISSIONS.PROPERTY_MANAGE,
    PERMISSIONS.PROPERTY_ASSIGN,
    PERMISSIONS.PROPERTY_ANALYTICS,
    PERMISSIONS.UNIT_CREATE,
    PERMISSIONS.UNIT_READ,
    PERMISSIONS.UNIT_UPDATE,
    PERMISSIONS.UNIT_ASSIGN,
    PERMISSIONS.TENANT_READ,
    PERMISSIONS.TENANT_COMMUNICATE,
    PERMISSIONS.LEASE_READ,
    PERMISSIONS.LEASE_CREATE,
    PERMISSIONS.LEASE_UPDATE,
    PERMISSIONS.FINANCIAL_READ,
    PERMISSIONS.FINANCIAL_REPORTS,
    PERMISSIONS.MAINTENANCE_READ,
    PERMISSIONS.MAINTENANCE_ASSIGN,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_CREATE,
    PERMISSIONS.COMMUNICATION_SEND,
    PERMISSIONS.DOCUMENTS_READ,
    PERMISSIONS.DOCUMENTS_UPLOAD
  ],

  [ROLES.PROPERTY_MANAGER]: [
    PERMISSIONS.PROPERTY_READ,
    PERMISSIONS.PROPERTY_UPDATE,
    PERMISSIONS.PROPERTY_MANAGE,
    PERMISSIONS.UNIT_READ,
    PERMISSIONS.UNIT_UPDATE,
    PERMISSIONS.TENANT_CREATE,
    PERMISSIONS.TENANT_READ,
    PERMISSIONS.TENANT_UPDATE,
    PERMISSIONS.TENANT_COMMUNICATE,
    PERMISSIONS.TENANT_DOCUMENTS,
    PERMISSIONS.LEASE_CREATE,
    PERMISSIONS.LEASE_READ,
    PERMISSIONS.LEASE_UPDATE,
    PERMISSIONS.LEASE_SIGN,
    PERMISSIONS.FINANCIAL_READ,
    PERMISSIONS.FINANCIAL_PAYMENTS,
    PERMISSIONS.MAINTENANCE_CREATE,
    PERMISSIONS.MAINTENANCE_READ,
    PERMISSIONS.MAINTENANCE_UPDATE,
    PERMISSIONS.MAINTENANCE_ASSIGN,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.COMMUNICATION_SEND,
    PERMISSIONS.DOCUMENTS_READ,
    PERMISSIONS.DOCUMENTS_UPLOAD,
    PERMISSIONS.DOCUMENTS_SHARE
  ],

  [ROLES.LEASING_SPECIALIST]: [
    PERMISSIONS.PROPERTY_READ,
    PERMISSIONS.UNIT_READ,
    PERMISSIONS.TENANT_CREATE,
    PERMISSIONS.TENANT_READ,
    PERMISSIONS.TENANT_UPDATE,
    PERMISSIONS.TENANT_COMMUNICATE,
    PERMISSIONS.LEASE_CREATE,
    PERMISSIONS.LEASE_READ,
    PERMISSIONS.LEASE_UPDATE,
    PERMISSIONS.LEASE_SIGN,
    PERMISSIONS.COMMUNICATION_SEND,
    PERMISSIONS.DOCUMENTS_READ,
    PERMISSIONS.DOCUMENTS_UPLOAD
  ],

  [ROLES.MAINTENANCE_SUPERVISOR]: [
    PERMISSIONS.PROPERTY_READ,
    PERMISSIONS.UNIT_READ,
    PERMISSIONS.TENANT_READ,
    PERMISSIONS.MAINTENANCE_CREATE,
    PERMISSIONS.MAINTENANCE_READ,
    PERMISSIONS.MAINTENANCE_UPDATE,
    PERMISSIONS.MAINTENANCE_DELETE,
    PERMISSIONS.MAINTENANCE_ASSIGN,
    PERMISSIONS.MAINTENANCE_COMPLETE,
    PERMISSIONS.MAINTENANCE_VENDORS,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.COMMUNICATION_SEND,
    PERMISSIONS.DOCUMENTS_READ,
    PERMISSIONS.DOCUMENTS_UPLOAD
  ],

  [ROLES.MARKETING_SPECIALIST]: [
    PERMISSIONS.PROPERTY_READ,
    PERMISSIONS.UNIT_READ,
    PERMISSIONS.TENANT_READ,
    PERMISSIONS.COMMUNICATION_SEND,
    PERMISSIONS.COMMUNICATION_BROADCAST,
    PERMISSIONS.COMMUNICATION_TEMPLATES,
    PERMISSIONS.DOCUMENTS_READ,
    PERMISSIONS.DOCUMENTS_UPLOAD
  ],

  [ROLES.FINANCIAL_CONTROLLER]: [
    PERMISSIONS.PROPERTY_READ,
    PERMISSIONS.TENANT_READ,
    PERMISSIONS.LEASE_READ,
    PERMISSIONS.FINANCIAL_READ,
    PERMISSIONS.FINANCIAL_MANAGE,
    PERMISSIONS.FINANCIAL_PAYMENTS,
    PERMISSIONS.FINANCIAL_INVOICES,
    PERMISSIONS.FINANCIAL_REPORTS,
    PERMISSIONS.FINANCIAL_BUDGETS,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_CREATE,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.DOCUMENTS_READ,
    PERMISSIONS.DOCUMENTS_UPLOAD
  ],

  [ROLES.LANDLORD]: [
    PERMISSIONS.PROPERTY_READ,
    PERMISSIONS.PROPERTY_UPDATE,
    PERMISSIONS.UNIT_READ,
    PERMISSIONS.UNIT_UPDATE,
    PERMISSIONS.TENANT_READ,
    PERMISSIONS.TENANT_COMMUNICATE,
    PERMISSIONS.LEASE_READ,
    PERMISSIONS.LEASE_CREATE,
    PERMISSIONS.LEASE_UPDATE,
    PERMISSIONS.FINANCIAL_READ,
    PERMISSIONS.FINANCIAL_REPORTS,
    PERMISSIONS.MAINTENANCE_READ,
    PERMISSIONS.MAINTENANCE_CREATE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.COMMUNICATION_SEND,
    PERMISSIONS.DOCUMENTS_READ,
    PERMISSIONS.DOCUMENTS_UPLOAD
  ],

  [ROLES.TENANT]: [
    PERMISSIONS.PROPERTY_READ,
    PERMISSIONS.UNIT_READ,
    PERMISSIONS.LEASE_READ,
    PERMISSIONS.LEASE_SIGN,
    PERMISSIONS.FINANCIAL_READ,
    PERMISSIONS.FINANCIAL_PAYMENTS,
    PERMISSIONS.MAINTENANCE_CREATE,
    PERMISSIONS.MAINTENANCE_READ,
    PERMISSIONS.COMMUNICATION_SEND,
    PERMISSIONS.DOCUMENTS_READ,
    PERMISSIONS.DOCUMENTS_UPLOAD
  ],

  [ROLES.VENDOR]: [
    PERMISSIONS.MAINTENANCE_READ,
    PERMISSIONS.MAINTENANCE_UPDATE,
    PERMISSIONS.MAINTENANCE_COMPLETE,
    PERMISSIONS.COMMUNICATION_SEND,
    PERMISSIONS.DOCUMENTS_READ,
    PERMISSIONS.DOCUMENTS_UPLOAD
  ],

  [ROLES.INSPECTOR]: [
    PERMISSIONS.PROPERTY_READ,
    PERMISSIONS.UNIT_READ,
    PERMISSIONS.MAINTENANCE_READ,
    PERMISSIONS.MAINTENANCE_CREATE,
    PERMISSIONS.DOCUMENTS_READ,
    PERMISSIONS.DOCUMENTS_UPLOAD
  ],

  [ROLES.ACCOUNTANT]: [
    PERMISSIONS.FINANCIAL_READ,
    PERMISSIONS.FINANCIAL_REPORTS,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_CREATE,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.DOCUMENTS_READ
  ]
};

/**
 * Role display names
 */
export const ROLE_DISPLAY_NAMES = {
  [ROLES.SYSTEM_ADMIN]: 'System Administrator',
  [ROLES.COMPANY_ADMIN]: 'Company Administrator',
  [ROLES.COMPANY_OWNER]: 'Company Owner',
  [ROLES.PORTFOLIO_MANAGER]: 'Portfolio Manager',
  [ROLES.PROPERTY_MANAGER]: 'Property Manager',
  [ROLES.LEASING_SPECIALIST]: 'Leasing Specialist',
  [ROLES.MAINTENANCE_SUPERVISOR]: 'Maintenance Supervisor',
  [ROLES.MARKETING_SPECIALIST]: 'Marketing Specialist',
  [ROLES.FINANCIAL_CONTROLLER]: 'Financial Controller',
  [ROLES.LANDLORD]: 'Landlord',
  [ROLES.TENANT]: 'Tenant',
  [ROLES.VENDOR]: 'Vendor',
  [ROLES.INSPECTOR]: 'Inspector',
  [ROLES.ACCOUNTANT]: 'Accountant'
};

/**
 * Role descriptions
 */
export const ROLE_DESCRIPTIONS = {
  [ROLES.SYSTEM_ADMIN]: 'Full system access and administration capabilities',
  [ROLES.COMPANY_ADMIN]: 'Complete company management and oversight',
  [ROLES.COMPANY_OWNER]: 'Company ownership with strategic oversight',
  [ROLES.PORTFOLIO_MANAGER]: 'Manages multiple properties and portfolios',
  [ROLES.PROPERTY_MANAGER]: 'Manages individual properties and operations',
  [ROLES.LEASING_SPECIALIST]: 'Handles tenant acquisition and leasing',
  [ROLES.MAINTENANCE_SUPERVISOR]: 'Oversees maintenance operations and vendors',
  [ROLES.MARKETING_SPECIALIST]: 'Manages marketing and communications',
  [ROLES.FINANCIAL_CONTROLLER]: 'Handles financial operations and reporting',
  [ROLES.LANDLORD]: 'Property owner with management capabilities',
  [ROLES.TENANT]: 'Property resident with limited access',
  [ROLES.VENDOR]: 'Service provider with maintenance access',
  [ROLES.INSPECTOR]: 'Property inspector with assessment capabilities',
  [ROLES.ACCOUNTANT]: 'Financial professional with reporting access'
};

/**
 * Check if user has specific permission
 * @param {Array|string} userRoles - User roles (array or single role)
 * @param {string} permission - Permission to check
 * @param {Array} userPermissions - Additional user permissions
 * @returns {boolean} Whether user has permission
 */
export const hasPermission = (userRoles, permission, userPermissions = []) => {
  if (!userRoles || !permission) return false;

  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];

  // Check direct permissions first
  if (userPermissions.includes(permission)) return true;

  // Check role-based permissions
  for (const role of roles) {
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    if (rolePermissions.includes(permission)) return true;
  }

  return false;
};

/**
 * Check if user has any of the specified permissions
 * @param {Array|string} userRoles - User roles
 * @param {Array} permissions - Permissions to check
 * @param {Array} userPermissions - Additional user permissions
 * @returns {boolean} Whether user has any permission
 */
export const hasAnyPermission = (userRoles, permissions, userPermissions = []) => {
  if (!permissions || permissions.length === 0) return true;
  
  return permissions.some(permission => 
    hasPermission(userRoles, permission, userPermissions)
  );
};

/**
 * Check if user has all specified permissions
 * @param {Array|string} userRoles - User roles
 * @param {Array} permissions - Permissions to check
 * @param {Array} userPermissions - Additional user permissions
 * @returns {boolean} Whether user has all permissions
 */
export const hasAllPermissions = (userRoles, permissions, userPermissions = []) => {
  if (!permissions || permissions.length === 0) return true;
  
  return permissions.every(permission => 
    hasPermission(userRoles, permission, userPermissions)
  );
};

/**
 * Check if user has specific role
 * @param {Array|string} userRoles - User roles
 * @param {string} role - Role to check
 * @returns {boolean} Whether user has role
 */
export const hasRole = (userRoles, role) => {
  if (!userRoles || !role) return false;
  
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  return roles.includes(role);
};

/**
 * Check if user has any of the specified roles
 * @param {Array|string} userRoles - User roles
 * @param {Array} roles - Roles to check
 * @returns {boolean} Whether user has any role
 */
export const hasAnyRole = (userRoles, roles) => {
  if (!roles || roles.length === 0) return true;
  
  return roles.some(role => hasRole(userRoles, role));
};

/**
 * Check if user role has higher hierarchy than target role
 * @param {string} userRole - User role
 * @param {string} targetRole - Target role to compare
 * @returns {boolean} Whether user role is higher
 */
export const isRoleHigher = (userRole, targetRole) => {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const targetLevel = ROLE_HIERARCHY[targetRole] || 0;
  
  return userLevel > targetLevel;
};

/**
 * Check if user can manage target user based on role hierarchy
 * @param {Array|string} userRoles - Manager user roles
 * @param {Array|string} targetRoles - Target user roles
 * @returns {boolean} Whether user can manage target
 */
export const canManageUser = (userRoles, targetRoles) => {
  const managerRoles = Array.isArray(userRoles) ? userRoles : [userRoles];
  const targetUserRoles = Array.isArray(targetRoles) ? targetRoles : [targetRoles];

  const maxManagerLevel = Math.max(...managerRoles.map(role => ROLE_HIERARCHY[role] || 0));
  const maxTargetLevel = Math.max(...targetUserRoles.map(role => ROLE_HIERARCHY[role] || 0));

  return maxManagerLevel > maxTargetLevel;
};

/**
 * Get all permissions for user roles
 * @param {Array|string} userRoles - User roles
 * @param {Array} additionalPermissions - Additional permissions
 * @returns {Array} All user permissions
 */
export const getUserPermissions = (userRoles, additionalPermissions = []) => {
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  const permissions = new Set(additionalPermissions);

  roles.forEach(role => {
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    rolePermissions.forEach(permission => permissions.add(permission));
  });

  return Array.from(permissions);
};

/**
 * Get role display name
 * @param {string} role - Role key
 * @returns {string} Display name
 */
export const getRoleDisplayName = (role) => {
  return ROLE_DISPLAY_NAMES[role] || role;
};

/**
 * Get role description
 * @param {string} role - Role key
 * @returns {string} Role description
 */
export const getRoleDescription = (role) => {
  return ROLE_DESCRIPTIONS[role] || '';
};

/**
 * Get roles by category/level
 * @param {string} category - Role category (admin, management, user)
 * @returns {Array} Roles in category
 */
export const getRolesByCategory = (category) => {
  switch (category) {
    case 'admin':
      return [ROLES.SYSTEM_ADMIN, ROLES.COMPANY_ADMIN, ROLES.COMPANY_OWNER];
    case 'management':
      return [
        ROLES.PORTFOLIO_MANAGER,
        ROLES.PROPERTY_MANAGER,
        ROLES.LEASING_SPECIALIST,
        ROLES.MAINTENANCE_SUPERVISOR,
        ROLES.MARKETING_SPECIALIST,
        ROLES.FINANCIAL_CONTROLLER
      ];
    case 'user':
      return [ROLES.LANDLORD, ROLES.TENANT, ROLES.VENDOR, ROLES.INSPECTOR, ROLES.ACCOUNTANT];
    default:
      return Object.values(ROLES);
  }
};

/**
 * Check if role is administrative
 * @param {string} role - Role to check
 * @returns {boolean} Whether role is administrative
 */
export const isAdminRole = (role) => {
  return getRolesByCategory('admin').includes(role);
};

/**
 * Check if role is management level
 * @param {string} role - Role to check
 * @returns {boolean} Whether role is management level
 */
export const isManagementRole = (role) => {
  return getRolesByCategory('management').includes(role);
};

/**
 * Check if role is user level
 * @param {string} role - Role to check
 * @returns {boolean} Whether role is user level
 */
export const isUserRole = (role) => {
  return getRolesByCategory('user').includes(role);
};

/**
 * Get assignable roles for a user based on their role
 * @param {Array|string} userRoles - User roles
 * @returns {Array} Assignable roles
 */
export const getAssignableRoles = (userRoles) => {
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  const maxUserLevel = Math.max(...roles.map(role => ROLE_HIERARCHY[role] || 0));

  return Object.keys(ROLE_HIERARCHY).filter(role => {
    const roleLevel = ROLE_HIERARCHY[role];
    return roleLevel < maxUserLevel;
  });
};

/**
 * Validate role assignment
 * @param {Array|string} assignerRoles - Assigner roles
 * @param {string} targetRole - Role to assign
 * @returns {Object} Validation result
 */
export const validateRoleAssignment = (assignerRoles, targetRole) => {
  const assignableRoles = getAssignableRoles(assignerRoles);
  
  if (!assignableRoles.includes(targetRole)) {
    return {
      isValid: false,
      message: 'You do not have permission to assign this role'
    };
  }

  return { isValid: true };
};

/**
 * Filter data based on user permissions
 * @param {Array} data - Data to filter
 * @param {Array|string} userRoles - User roles
 * @param {string} permission - Required permission
 * @param {Function} permissionCheck - Custom permission check function
 * @returns {Array} Filtered data
 */
export const filterByPermission = (data, userRoles, permission, permissionCheck = null) => {
  if (!data || !Array.isArray(data)) return [];

  if (permissionCheck && typeof permissionCheck === 'function') {
    return data.filter(item => permissionCheck(item, userRoles));
  }

  if (hasPermission(userRoles, permission)) {
    return data;
  }

  return [];
};

/**
 * Create permission-based route guard
 * @param {Array|string} requiredRoles - Required roles
 * @param {Array} requiredPermissions - Required permissions
 * @param {boolean} requireAll - Whether all permissions are required
 * @returns {Function} Route guard function
 */
export const createRouteGuard = (requiredRoles = [], requiredPermissions = [], requireAll = false) => {
  return (userRoles, userPermissions = []) => {
    // Check roles
    if (requiredRoles.length > 0 && !hasAnyRole(userRoles, requiredRoles)) {
      return { allowed: false, reason: 'Insufficient role permissions' };
    }

    // Check permissions
    if (requiredPermissions.length > 0) {
      const hasRequiredPermissions = requireAll
        ? hasAllPermissions(userRoles, requiredPermissions, userPermissions)
        : hasAnyPermission(userRoles, requiredPermissions, userPermissions);

      if (!hasRequiredPermissions) {
        return { allowed: false, reason: 'Insufficient permissions' };
      }
    }

    return { allowed: true };
  };
};

// Export all role utilities
export default {
  ROLES,
  ROLE_HIERARCHY,
  PERMISSION_CATEGORIES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  ROLE_DISPLAY_NAMES,
  ROLE_DESCRIPTIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  isRoleHigher,
  canManageUser,
  getUserPermissions,
  getRoleDisplayName,
  getRoleDescription,
  getRolesByCategory,
  isAdminRole,
  isManagementRole,
  isUserRole,
  getAssignableRoles,
  validateRoleAssignment,
  filterByPermission,
  createRouteGuard
};