const Permission = require('./roles').Permission;

const PermissionCategories = {
  SYSTEM: 'system',
  USER_MANAGEMENT: 'user_management',
  PROPERTY_MANAGEMENT: 'property_management',
  TENANT_MANAGEMENT: 'tenant_management',
  FINANCIAL_MANAGEMENT: 'financial_management',
  MAINTENANCE_MANAGEMENT: 'maintenance_management',
  COMMUNICATION: 'communication',
  REPORTING: 'reporting',
  SETTINGS: 'settings'
};

const PermissionDescriptions = {
  [Permission.ALL]: 'Full system access',
  
  // System Permissions
  [Permission.SYSTEM_MANAGE]: 'Manage system settings and configurations',
  
  // User Management
  [Permission.USER_CREATE]: 'Create new users',
  [Permission.USER_READ]: 'View user information',
  [Permission.USER_UPDATE]: 'Update user information',
  [Permission.USER_DELETE]: 'Delete users',
  [Permission.USER_INVITE]: 'Invite new users',
  [Permission.USER_ASSIGN_ROLE]: 'Assign roles to users',
  
  // Role Management
  [Permission.ROLE_CREATE]: 'Create new roles',
  [Permission.ROLE_READ]: 'View roles',
  [Permission.ROLE_UPDATE]: 'Update roles',
  [Permission.ROLE_DELETE]: 'Delete roles',
  
  // Property Management
  [Permission.PROPERTY_CREATE]: 'Create new properties',
  [Permission.PROPERTY_READ]: 'View properties',
  [Permission.PROPERTY_UPDATE]: 'Update properties',
  [Permission.PROPERTY_DELETE]: 'Delete properties',
  [Permission.PROPERTY_UPLOAD_BULK]: 'Upload properties in bulk',
  [Permission.PROPERTY_APPROVE]: 'Approve properties for listing',
  [Permission.PROPERTY_PUBLISH]: 'Publish properties to public website',
  
  // Unit Management
  [Permission.UNIT_CREATE]: 'Create new units',
  [Permission.UNIT_READ]: 'View units',
  [Permission.UNIT_UPDATE]: 'Update units',
  [Permission.UNIT_DELETE]: 'Delete units',
  
  // Tenant Management
  [Permission.TENANT_CREATE]: 'Create new tenant records',
  [Permission.TENANT_READ]: 'View tenant information',
  [Permission.TENANT_UPDATE]: 'Update tenant information',
  [Permission.TENANT_DELETE]: 'Delete tenant records',
  [Permission.TENANT_SCREEN]: 'Screen tenant applications',
  
  // Lease Management
  [Permission.LEASE_CREATE]: 'Create new leases',
  [Permission.LEASE_READ]: 'View lease agreements',
  [Permission.LEASE_UPDATE]: 'Update lease agreements',
  [Permission.LEASE_DELETE]: 'Delete lease agreements',
  [Permission.LEASE_TERMINATE]: 'Terminate leases',
  [Permission.LEASE_RENEW]: 'Renew leases',
  
  // Maintenance Management
  [Permission.MAINTENANCE_CREATE]: 'Create maintenance requests',
  [Permission.MAINTENANCE_READ]: 'View maintenance requests',
  [Permission.MAINTENANCE_UPDATE]: 'Update maintenance requests',
  [Permission.MAINTENANCE_DELETE]: 'Delete maintenance requests',
  [Permission.MAINTENANCE_ASSIGN]: 'Assign maintenance tasks',
  [Permission.MAINTENANCE_APPROVE]: 'Approve maintenance work',
  
  // Work Order Management
  [Permission.WORKORDER_CREATE]: 'Create work orders',
  [Permission.WORKORDER_READ]: 'View work orders',
  [Permission.WORKORDER_UPDATE]: 'Update work orders',
  [Permission.WORKORDER_DELETE]: 'Delete work orders',
  [Permission.WORKORDER_ASSIGN]: 'Assign work orders',
  [Permission.WORKORDER_COMPLETE]: 'Mark work orders as complete',
  
  // Vendor Management
  [Permission.VENDOR_CREATE]: 'Add new vendors',
  [Permission.VENDOR_READ]: 'View vendor information',
  [Permission.VENDOR_UPDATE]: 'Update vendor information',
  [Permission.VENDOR_DELETE]: 'Remove vendors',
  [Permission.VENDOR_APPROVE]: 'Approve vendor registrations',
  
  // Task Management
  [Permission.TASK_CREATE]: 'Create tasks',
  [Permission.TASK_READ]: 'View tasks',
  [Permission.TASK_UPDATE]: 'Update tasks',
  [Permission.TASK_DELETE]: 'Delete tasks',
  [Permission.TASK_ASSIGN]: 'Assign tasks to users',
  [Permission.TASK_COMPLETE]: 'Mark tasks as complete',
  
  // Assignment Management
  [Permission.ASSIGNMENT_CREATE]: 'Create assignments',
  [Permission.ASSIGNMENT_READ]: 'View assignments',
  [Permission.ASSIGNMENT_UPDATE]: 'Update assignments',
  [Permission.ASSIGNMENT_DELETE]: 'Delete assignments',
  
  // Financial Management
  [Permission.PAYMENT_CREATE]: 'Create payment records',
  [Permission.PAYMENT_READ]: 'View payment records',
  [Permission.PAYMENT_UPDATE]: 'Update payment records',
  [Permission.PAYMENT_DELETE]: 'Delete payment records',
  [Permission.PAYMENT_PROCESS]: 'Process payments',
  [Permission.PAYMENT_REFUND]: 'Process refunds',
  
  // Transaction Management
  [Permission.TRANSACTION_CREATE]: 'Create transactions',
  [Permission.TRANSACTION_READ]: 'View transactions',
  [Permission.TRANSACTION_UPDATE]: 'Update transactions',
  [Permission.TRANSACTION_DELETE]: 'Delete transactions',
  
  // Invoice Management
  [Permission.INVOICE_CREATE]: 'Create invoices',
  [Permission.INVOICE_READ]: 'View invoices',
  [Permission.INVOICE_UPDATE]: 'Update invoices',
  [Permission.INVOICE_DELETE]: 'Delete invoices',
  [Permission.INVOICE_SEND]: 'Send invoices to tenants',
  
  // Company Management
  [Permission.COMPANY_CREATE]: 'Create companies',
  [Permission.COMPANY_READ]: 'View company information',
  [Permission.COMPANY_UPDATE]: 'Update company information',
  [Permission.COMPANY_DELETE]: 'Delete companies',
  
  // Portfolio Management
  [Permission.PORTFOLIO_CREATE]: 'Create portfolios',
  [Permission.PORTFOLIO_READ]: 'View portfolios',
  [Permission.PORTFOLIO_UPDATE]: 'Update portfolios',
  [Permission.PORTFOLIO_DELETE]: 'Delete portfolios',
  
  // Reporting
  [Permission.REPORT_CREATE]: 'Create reports',
  [Permission.REPORT_READ]: 'View reports',
  [Permission.REPORT_UPDATE]: 'Update reports',
  [Permission.REPORT_DELETE]: 'Delete reports',
  [Permission.REPORT_EXPORT]: 'Export reports',
  
  // Analytics
  [Permission.ANALYTICS_VIEW]: 'View analytics dashboard',
  [Permission.ANALYTICS_EXPORT]: 'Export analytics data',
  
  // Communication
  [Permission.MESSAGE_SEND]: 'Send messages',
  [Permission.MESSAGE_READ]: 'Read messages',
  [Permission.MESSAGE_DELETE]: 'Delete messages',
  [Permission.NOTIFICATION_SEND]: 'Send notifications',
  [Permission.NOTIFICATION_READ]: 'Read notifications',
  
  // Document Management
  [Permission.DOCUMENT_UPLOAD]: 'Upload documents',
  [Permission.DOCUMENT_READ]: 'View documents',
  [Permission.DOCUMENT_UPDATE]: 'Update documents',
  [Permission.DOCUMENT_DELETE]: 'Delete documents',
  [Permission.DOCUMENT_SHARE]: 'Share documents',
  
  // Integration Management
  [Permission.INTEGRATION_CREATE]: 'Create integrations',
  [Permission.INTEGRATION_READ]: 'View integrations',
  [Permission.INTEGRATION_UPDATE]: 'Update integrations',
  [Permission.INTEGRATION_DELETE]: 'Delete integrations',
  [Permission.INTEGRATION_SYNC]: 'Sync integration data',
  
  // Audit Management
  [Permission.AUDIT_READ]: 'View audit logs',
  [Permission.AUDIT_EXPORT]: 'Export audit logs',
  
  // Settings Management
  [Permission.SETTINGS_READ]: 'View system settings',
  [Permission.SETTINGS_UPDATE]: 'Update system settings'
};

const PermissionGroups = {
  [PermissionCategories.SYSTEM]: [
    Permission.SYSTEM_MANAGE
  ],
  
  [PermissionCategories.USER_MANAGEMENT]: [
    Permission.USER_CREATE,
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.USER_INVITE,
    Permission.USER_ASSIGN_ROLE,
    Permission.ROLE_CREATE,
    Permission.ROLE_READ,
    Permission.ROLE_UPDATE,
    Permission.ROLE_DELETE
  ],
  
  [PermissionCategories.PROPERTY_MANAGEMENT]: [
    Permission.PROPERTY_CREATE,
    Permission.PROPERTY_READ,
    Permission.PROPERTY_UPDATE,
    Permission.PROPERTY_DELETE,
    Permission.PROPERTY_UPLOAD_BULK,
    Permission.PROPERTY_APPROVE,
    Permission.PROPERTY_PUBLISH,
    Permission.UNIT_CREATE,
    Permission.UNIT_READ,
    Permission.UNIT_UPDATE,
    Permission.UNIT_DELETE,
    Permission.COMPANY_CREATE,
    Permission.COMPANY_READ,
    Permission.COMPANY_UPDATE,
    Permission.COMPANY_DELETE,
    Permission.PORTFOLIO_CREATE,
    Permission.PORTFOLIO_READ,
    Permission.PORTFOLIO_UPDATE,
    Permission.PORTFOLIO_DELETE
  ],
  
  [PermissionCategories.TENANT_MANAGEMENT]: [
    Permission.TENANT_CREATE,
    Permission.TENANT_READ,
    Permission.TENANT_UPDATE,
    Permission.TENANT_DELETE,
    Permission.TENANT_SCREEN,
    Permission.LEASE_CREATE,
    Permission.LEASE_READ,
    Permission.LEASE_UPDATE,
    Permission.LEASE_DELETE,
    Permission.LEASE_TERMINATE,
    Permission.LEASE_RENEW
  ],
  
  [PermissionCategories.MAINTENANCE_MANAGEMENT]: [
    Permission.MAINTENANCE_CREATE,
    Permission.MAINTENANCE_READ,
    Permission.MAINTENANCE_UPDATE,
    Permission.MAINTENANCE_DELETE,
    Permission.MAINTENANCE_ASSIGN,
    Permission.MAINTENANCE_APPROVE,
    Permission.WORKORDER_CREATE,
    Permission.WORKORDER_READ,
    Permission.WORKORDER_UPDATE,
    Permission.WORKORDER_DELETE,
    Permission.WORKORDER_ASSIGN,
    Permission.WORKORDER_COMPLETE,
    Permission.VENDOR_CREATE,
    Permission.VENDOR_READ,
    Permission.VENDOR_UPDATE,
    Permission.VENDOR_DELETE,
    Permission.VENDOR_APPROVE,
    Permission.TASK_CREATE,
    Permission.TASK_READ,
    Permission.TASK_UPDATE,
    Permission.TASK_DELETE,
    Permission.TASK_ASSIGN,
    Permission.TASK_COMPLETE,
    Permission.ASSIGNMENT_CREATE,
    Permission.ASSIGNMENT_READ,
    Permission.ASSIGNMENT_UPDATE,
    Permission.ASSIGNMENT_DELETE
  ],
  
  [PermissionCategories.FINANCIAL_MANAGEMENT]: [
    Permission.PAYMENT_CREATE,
    Permission.PAYMENT_READ,
    Permission.PAYMENT_UPDATE,
    Permission.PAYMENT_DELETE,
    Permission.PAYMENT_PROCESS,
    Permission.PAYMENT_REFUND,
    Permission.TRANSACTION_CREATE,
    Permission.TRANSACTION_READ,
    Permission.TRANSACTION_UPDATE,
    Permission.TRANSACTION_DELETE,
    Permission.INVOICE_CREATE,
    Permission.INVOICE_READ,
    Permission.INVOICE_UPDATE,
    Permission.INVOICE_DELETE,
    Permission.INVOICE_SEND
  ],
  
  [PermissionCategories.COMMUNICATION]: [
    Permission.MESSAGE_SEND,
    Permission.MESSAGE_READ,
    Permission.MESSAGE_DELETE,
    Permission.NOTIFICATION_SEND,
    Permission.NOTIFICATION_READ,
    Permission.DOCUMENT_UPLOAD,
    Permission.DOCUMENT_READ,
    Permission.DOCUMENT_UPDATE,
    Permission.DOCUMENT_DELETE,
    Permission.DOCUMENT_SHARE
  ],
  
  [PermissionCategories.REPORTING]: [
    Permission.REPORT_CREATE,
    Permission.REPORT_READ,
    Permission.REPORT_UPDATE,
    Permission.REPORT_DELETE,
    Permission.REPORT_EXPORT,
    Permission.ANALYTICS_VIEW,
    Permission.ANALYTICS_EXPORT,
    Permission.AUDIT_READ,
    Permission.AUDIT_EXPORT
  ],
  
  [PermissionCategories.SETTINGS]: [
    Permission.SETTINGS_READ,
    Permission.SETTINGS_UPDATE,
    Permission.INTEGRATION_CREATE,
    Permission.INTEGRATION_READ,
    Permission.INTEGRATION_UPDATE,
    Permission.INTEGRATION_DELETE,
    Permission.INTEGRATION_SYNC
  ]
};

const PermissionScopes = {
  GLOBAL: 'global',
  COMPANY: 'company',
  PORTFOLIO: 'portfolio',
  PROPERTY: 'property',
  PERSONAL: 'personal'
};

const getPermissionDescription = (permission) => {
  return PermissionDescriptions[permission] || 'No description available';
};

const getPermissionCategory = (permission) => {
  for (const [category, permissions] of Object.entries(PermissionGroups)) {
    if (permissions.includes(permission)) {
      return category;
    }
  }
  return PermissionCategories.SYSTEM;
};

const getAllPermissions = () => {
  return Object.values(Permission).filter(p => p !== Permission.ALL);
};

const getPermissionsByCategory = (category) => {
  return PermissionGroups[category] || [];
};

module.exports = {
  PermissionCategories,
  PermissionDescriptions,
  PermissionGroups,
  PermissionScopes,
  getPermissionDescription,
  getPermissionCategory,
  getAllPermissions,
  getPermissionsByCategory
};