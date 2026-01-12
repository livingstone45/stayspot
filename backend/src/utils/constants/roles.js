const UserRole = {
  // Core System Roles
  SYSTEM_ADMIN: 'system_admin',
  COMPANY_ADMIN: 'company_admin',
  PORTFOLIO_MANAGER: 'portfolio_manager',
  PROPERTY_MANAGER: 'property_manager',
  
  // Professional Roles
  LEASING_SPECIALIST: 'leasing_specialist',
  SHOWING_AGENT: 'showing_agent',
  APPLICATION_PROCESSOR: 'application_processor',
  
  MAINTENANCE_SUPERVISOR: 'maintenance_supervisor',
  MAINTENANCE_TECHNICIAN: 'maintenance_technician',
  VENDOR_COORDINATOR: 'vendor_coordinator',
  
  MARKETING_SPECIALIST: 'marketing_specialist',
  CONTENT_CREATOR: 'content_creator',
  DIGITAL_MARKETER: 'digital_marketer',
  
  FINANCIAL_CONTROLLER: 'financial_controller',
  ACCOUNTANT: 'accountant',
  BILLING_SPECIALIST: 'billing_specialist',
  
  COMPLIANCE_OFFICER: 'compliance_officer',
  DATA_ANALYST: 'data_analyst',
  IT_ADMINISTRATOR: 'it_administrator',
  
  // End User Roles
  LANDLORD: 'landlord',
  TENANT: 'tenant',
  VENDOR: 'vendor',
  GUEST: 'guest'
};

const Permission = {
  // System Permissions
  ALL: 'all',
  SYSTEM_MANAGE: 'system_manage',
  
  // User Management
  USER_CREATE: 'user_create',
  USER_READ: 'user_read',
  USER_UPDATE: 'user_update',
  USER_DELETE: 'user_delete',
  USER_INVITE: 'user_invite',
  USER_ASSIGN_ROLE: 'user_assign_role',
  
  // Role Management
  ROLE_CREATE: 'role_create',
  ROLE_READ: 'role_read',
  ROLE_UPDATE: 'role_update',
  ROLE_DELETE: 'role_delete',
  
  // Property Management
  PROPERTY_CREATE: 'property_create',
  PROPERTY_READ: 'property_read',
  PROPERTY_UPDATE: 'property_update',
  PROPERTY_DELETE: 'property_delete',
  PROPERTY_UPLOAD_BULK: 'property_upload_bulk',
  PROPERTY_APPROVE: 'property_approve',
  PROPERTY_PUBLISH: 'property_publish',
  
  // Unit Management
  UNIT_CREATE: 'unit_create',
  UNIT_READ: 'unit_read',
  UNIT_UPDATE: 'unit_update',
  UNIT_DELETE: 'unit_delete',
  
  // Tenant Management
  TENANT_CREATE: 'tenant_create',
  TENANT_READ: 'tenant_read',
  TENANT_UPDATE: 'tenant_update',
  TENANT_DELETE: 'tenant_delete',
  TENANT_SCREEN: 'tenant_screen',
  
  // Lease Management
  LEASE_CREATE: 'lease_create',
  LEASE_READ: 'lease_read',
  LEASE_UPDATE: 'lease_update',
  LEASE_DELETE: 'lease_delete',
  LEASE_TERMINATE: 'lease_terminate',
  LEASE_RENEW: 'lease_renew',
  
  // Maintenance Management
  MAINTENANCE_CREATE: 'maintenance_create',
  MAINTENANCE_READ: 'maintenance_read',
  MAINTENANCE_UPDATE: 'maintenance_update',
  MAINTENANCE_DELETE: 'maintenance_delete',
  MAINTENANCE_ASSIGN: 'maintenance_assign',
  MAINTENANCE_APPROVE: 'maintenance_approve',
  
  // Work Order Management
  WORKORDER_CREATE: 'workorder_create',
  WORKORDER_READ: 'workorder_read',
  WORKORDER_UPDATE: 'workorder_update',
  WORKORDER_DELETE: 'workorder_delete',
  WORKORDER_ASSIGN: 'workorder_assign',
  WORKORDER_COMPLETE: 'workorder_complete',
  
  // Vendor Management
  VENDOR_CREATE: 'vendor_create',
  VENDOR_READ: 'vendor_read',
  VENDOR_UPDATE: 'vendor_update',
  VENDOR_DELETE: 'vendor_delete',
  VENDOR_APPROVE: 'vendor_approve',
  
  // Task Management
  TASK_CREATE: 'task_create',
  TASK_READ: 'task_read',
  TASK_UPDATE: 'task_update',
  TASK_DELETE: 'task_delete',
  TASK_ASSIGN: 'task_assign',
  TASK_COMPLETE: 'task_complete',
  
  // Assignment Management
  ASSIGNMENT_CREATE: 'assignment_create',
  ASSIGNMENT_READ: 'assignment_read',
  ASSIGNMENT_UPDATE: 'assignment_update',
  ASSIGNMENT_DELETE: 'assignment_delete',
  
  // Financial Management
  PAYMENT_CREATE: 'payment_create',
  PAYMENT_READ: 'payment_read',
  PAYMENT_UPDATE: 'payment_update',
  PAYMENT_DELETE: 'payment_delete',
  PAYMENT_PROCESS: 'payment_process',
  PAYMENT_REFUND: 'payment_refund',
  
  // Transaction Management
  TRANSACTION_CREATE: 'transaction_create',
  TRANSACTION_READ: 'transaction_read',
  TRANSACTION_UPDATE: 'transaction_update',
  TRANSACTION_DELETE: 'transaction_delete',
  
  // Invoice Management
  INVOICE_CREATE: 'invoice_create',
  INVOICE_READ: 'invoice_read',
  INVOICE_UPDATE: 'invoice_update',
  INVOICE_DELETE: 'invoice_delete',
  INVOICE_SEND: 'invoice_send',
  
  // Company Management
  COMPANY_CREATE: 'company_create',
  COMPANY_READ: 'company_read',
  COMPANY_UPDATE: 'company_update',
  COMPANY_DELETE: 'company_delete',
  
  // Portfolio Management
  PORTFOLIO_CREATE: 'portfolio_create',
  PORTFOLIO_READ: 'portfolio_read',
  PORTFOLIO_UPDATE: 'portfolio_update',
  PORTFOLIO_DELETE: 'portfolio_delete',
  
  // Reporting
  REPORT_CREATE: 'report_create',
  REPORT_READ: 'report_read',
  REPORT_UPDATE: 'report_update',
  REPORT_DELETE: 'report_delete',
  REPORT_EXPORT: 'report_export',
  
  // Analytics
  ANALYTICS_VIEW: 'analytics_view',
  ANALYTICS_EXPORT: 'analytics_export',
  
  // Communication
  MESSAGE_SEND: 'message_send',
  MESSAGE_READ: 'message_read',
  MESSAGE_DELETE: 'message_delete',
  NOTIFICATION_SEND: 'notification_send',
  NOTIFICATION_READ: 'notification_read',
  
  // Document Management
  DOCUMENT_UPLOAD: 'document_upload',
  DOCUMENT_READ: 'document_read',
  DOCUMENT_UPDATE: 'document_update',
  DOCUMENT_DELETE: 'document_delete',
  DOCUMENT_SHARE: 'document_share',
  
  // Integration Management
  INTEGRATION_CREATE: 'integration_create',
  INTEGRATION_READ: 'integration_read',
  INTEGRATION_UPDATE: 'integration_update',
  INTEGRATION_DELETE: 'integration_delete',
  INTEGRATION_SYNC: 'integration_sync',
  
  // Audit Management
  AUDIT_READ: 'audit_read',
  AUDIT_EXPORT: 'audit_export',
  
  // Settings Management
  SETTINGS_READ: 'settings_read',
  SETTINGS_UPDATE: 'settings_update'
};

const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
  INVITED: 'invited'
};

const RoleHierarchy = {
  [UserRole.SYSTEM_ADMIN]: 1,
  [UserRole.COMPANY_ADMIN]: 2,
  [UserRole.PORTFOLIO_MANAGER]: 3,
  [UserRole.PROPERTY_MANAGER]: 4,
  [UserRole.FINANCIAL_CONTROLLER]: 5,
  [UserRole.COMPLIANCE_OFFICER]: 5,
  [UserRole.DATA_ANALYST]: 5,
  [UserRole.IT_ADMINISTRATOR]: 5,
  [UserRole.MAINTENANCE_SUPERVISOR]: 6,
  [UserRole.MARKETING_SPECIALIST]: 6,
  [UserRole.LEASING_SPECIALIST]: 7,
  [UserRole.MAINTENANCE_TECHNICIAN]: 8,
  [UserRole.VENDOR_COORDINATOR]: 8,
  [UserRole.ACCOUNTANT]: 8,
  [UserRole.BILLING_SPECIALIST]: 8,
  [UserRole.CONTENT_CREATOR]: 8,
  [UserRole.DIGITAL_MARKETER]: 8,
  [UserRole.SHOWING_AGENT]: 9,
  [UserRole.APPLICATION_PROCESSOR]: 9,
  [UserRole.LANDLORD]: 10,
  [UserRole.TENANT]: 11,
  [UserRole.VENDOR]: 12,
  [UserRole.GUEST]: 13
};

const DefaultRolePermissions = {
  [UserRole.SYSTEM_ADMIN]: [
    Permission.ALL
  ],
  
  [UserRole.COMPANY_ADMIN]: [
    Permission.USER_CREATE,
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.USER_INVITE,
    Permission.USER_ASSIGN_ROLE,
    Permission.PROPERTY_CREATE,
    Permission.PROPERTY_READ,
    Permission.PROPERTY_UPDATE,
    Permission.PROPERTY_DELETE,
    Permission.PROPERTY_UPLOAD_BULK,
    Permission.PROPERTY_APPROVE,
    Permission.PROPERTY_PUBLISH,
    Permission.COMPANY_READ,
    Permission.COMPANY_UPDATE,
    Permission.PORTFOLIO_CREATE,
    Permission.PORTFOLIO_READ,
    Permission.PORTFOLIO_UPDATE,
    Permission.PORTFOLIO_DELETE,
    Permission.REPORT_READ,
    Permission.REPORT_EXPORT,
    Permission.ANALYTICS_VIEW,
    Permission.ANALYTICS_EXPORT,
    Permission.SETTINGS_READ,
    Permission.SETTINGS_UPDATE
  ],
  
  [UserRole.PORTFOLIO_MANAGER]: [
    Permission.PROPERTY_CREATE,
    Permission.PROPERTY_READ,
    Permission.PROPERTY_UPDATE,
    Permission.PROPERTY_UPLOAD_BULK,
    Permission.PROPERTY_APPROVE,
    Permission.PROPERTY_PUBLISH,
    Permission.USER_INVITE,
    Permission.USER_ASSIGN_ROLE,
    Permission.TASK_CREATE,
    Permission.TASK_READ,
    Permission.TASK_UPDATE,
    Permission.TASK_DELETE,
    Permission.TASK_ASSIGN,
    Permission.ASSIGNMENT_CREATE,
    Permission.ASSIGNMENT_READ,
    Permission.ASSIGNMENT_UPDATE,
    Permission.REPORT_READ,
    Permission.REPORT_EXPORT,
    Permission.ANALYTICS_VIEW
  ],
  
  [UserRole.PROPERTY_MANAGER]: [
    Permission.PROPERTY_READ,
    Permission.PROPERTY_UPDATE,
    Permission.PROPERTY_UPLOAD_BULK,
    Permission.UNIT_CREATE,
    Permission.UNIT_READ,
    Permission.UNIT_UPDATE,
    Permission.UNIT_DELETE,
    Permission.TENANT_CREATE,
    Permission.TENANT_READ,
    Permission.TENANT_UPDATE,
    Permission.TENANT_DELETE,
    Permission.LEASE_CREATE,
    Permission.LEASE_READ,
    Permission.LEASE_UPDATE,
    Permission.LEASE_DELETE,
    Permission.MAINTENANCE_CREATE,
    Permission.MAINTENANCE_READ,
    Permission.MAINTENANCE_UPDATE,
    Permission.MAINTENANCE_ASSIGN,
    Permission.TASK_CREATE,
    Permission.TASK_READ,
    Permission.TASK_UPDATE,
    Permission.TASK_ASSIGN,
    Permission.TASK_COMPLETE,
    Permission.REPORT_READ
  ],
  
  [UserRole.LEASING_SPECIALIST]: [
    Permission.PROPERTY_READ,
    Permission.UNIT_READ,
    Permission.TENANT_CREATE,
    Permission.TENANT_READ,
    Permission.TENANT_SCREEN,
    Permission.LEASE_CREATE,
    Permission.LEASE_READ,
    Permission.TASK_READ,
    Permission.TASK_COMPLETE
  ],
  
  [UserRole.MAINTENANCE_SUPERVISOR]: [
    Permission.MAINTENANCE_CREATE,
    Permission.MAINTENANCE_READ,
    Permission.MAINTENANCE_UPDATE,
    Permission.MAINTENANCE_ASSIGN,
    Permission.WORKORDER_CREATE,
    Permission.WORKORDER_READ,
    Permission.WORKORDER_UPDATE,
    Permission.WORKORDER_ASSIGN,
    Permission.WORKORDER_COMPLETE,
    Permission.VENDOR_READ,
    Permission.TASK_READ,
    Permission.TASK_ASSIGN,
    Permission.TASK_COMPLETE
  ],
  
  [UserRole.MARKETING_SPECIALIST]: [
    Permission.PROPERTY_READ,
    Permission.PROPERTY_UPDATE,
    Permission.PROPERTY_PUBLISH,
    Permission.REPORT_READ
  ],
  
  [UserRole.FINANCIAL_CONTROLLER]: [
    Permission.PAYMENT_CREATE,
    Permission.PAYMENT_READ,
    Permission.PAYMENT_UPDATE,
    Permission.PAYMENT_PROCESS,
    Permission.PAYMENT_REFUND,
    Permission.TRANSACTION_CREATE,
    Permission.TRANSACTION_READ,
    Permission.TRANSACTION_UPDATE,
    Permission.INVOICE_CREATE,
    Permission.INVOICE_READ,
    Permission.INVOICE_UPDATE,
    Permission.INVOICE_SEND,
    Permission.REPORT_READ,
    Permission.REPORT_EXPORT,
    Permission.ANALYTICS_VIEW
  ],
  
  [UserRole.LANDLORD]: [
    Permission.PROPERTY_READ,
    Permission.UNIT_READ,
    Permission.TENANT_READ,
    Permission.LEASE_READ,
    Permission.PAYMENT_READ,
    Permission.TRANSACTION_READ,
    Permission.REPORT_READ,
    Permission.MESSAGE_SEND,
    Permission.MESSAGE_READ,
    Permission.NOTIFICATION_READ,
    Permission.DOCUMENT_READ
  ],
  
  [UserRole.TENANT]: [
    Permission.PROPERTY_READ,
    Permission.UNIT_READ,
    Permission.LEASE_READ,
    Permission.PAYMENT_CREATE,
    Permission.PAYMENT_READ,
    Permission.MAINTENANCE_CREATE,
    Permission.MAINTENANCE_READ,
    Permission.MESSAGE_SEND,
    Permission.MESSAGE_READ,
    Permission.NOTIFICATION_READ,
    Permission.DOCUMENT_READ
  ]
};

module.exports = {
  UserRole,
  Permission,
  UserStatus,
  RoleHierarchy,
  DefaultRolePermissions
};