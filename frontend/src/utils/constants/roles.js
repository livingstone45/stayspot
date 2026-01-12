/**
 * Role constants for the StaySpot application
 * Defines all user roles, their hierarchies, and relationships
 */

/**
 * System roles enumeration
 */
export const ROLES = {
  // Administrative roles (highest level)
  SYSTEM_ADMIN: 'system_admin',
  COMPANY_ADMIN: 'company_admin', 
  COMPANY_OWNER: 'company_owner',

  // Management roles (middle level)
  PORTFOLIO_MANAGER: 'portfolio_manager',
  PROPERTY_MANAGER: 'property_manager',
  LEASING_SPECIALIST: 'leasing_specialist',
  MAINTENANCE_SUPERVISOR: 'maintenance_supervisor',
  MARKETING_SPECIALIST: 'marketing_specialist',
  FINANCIAL_CONTROLLER: 'financial_controller',

  // User roles (lower level)
  LANDLORD: 'landlord',
  TENANT: 'tenant',
  VENDOR: 'vendor',
  INSPECTOR: 'inspector',
  ACCOUNTANT: 'accountant'
};

/**
 * Role categories for grouping and organization
 */
export const ROLE_CATEGORIES = {
  ADMINISTRATIVE: 'administrative',
  MANAGEMENT: 'management',
  OPERATIONAL: 'operational',
  EXTERNAL: 'external'
};

/**
 * Role hierarchy levels (higher number = more authority)
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
 * Role display names for UI
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
 * Role descriptions for tooltips and help text
 */
export const ROLE_DESCRIPTIONS = {
  [ROLES.SYSTEM_ADMIN]: 'Complete system access with full administrative privileges across all companies and properties',
  [ROLES.COMPANY_ADMIN]: 'Full administrative access within their company, can manage all properties, users, and operations',
  [ROLES.COMPANY_OWNER]: 'Company ownership role with strategic oversight and high-level decision making authority',
  [ROLES.PORTFOLIO_MANAGER]: 'Manages multiple properties within a portfolio, oversees property performance and strategy',
  [ROLES.PROPERTY_MANAGER]: 'Manages day-to-day operations of assigned properties including tenants, maintenance, and leasing',
  [ROLES.LEASING_SPECIALIST]: 'Focuses on tenant acquisition, lease negotiations, and occupancy optimization',
  [ROLES.MAINTENANCE_SUPERVISOR]: 'Oversees maintenance operations, work orders, vendor management, and facility upkeep',
  [ROLES.MARKETING_SPECIALIST]: 'Handles property marketing, advertising, tenant communications, and brand management',
  [ROLES.FINANCIAL_CONTROLLER]: 'Manages financial operations, budgets, reporting, and accounting functions',
  [ROLES.LANDLORD]: 'Individual property owner with management capabilities for their owned properties',
  [ROLES.TENANT]: 'Property resident with access to tenant services and communication tools',
  [ROLES.VENDOR]: 'External service provider with limited access to maintenance and work order systems',
  [ROLES.INSPECTOR]: 'Property inspection professional with access to inspection tools and reporting',
  [ROLES.ACCOUNTANT]: 'Financial professional with access to accounting and financial reporting functions'
};

/**
 * Role categories mapping
 */
export const ROLE_CATEGORY_MAPPING = {
  [ROLE_CATEGORIES.ADMINISTRATIVE]: [
    ROLES.SYSTEM_ADMIN,
    ROLES.COMPANY_ADMIN,
    ROLES.COMPANY_OWNER
  ],
  [ROLE_CATEGORIES.MANAGEMENT]: [
    ROLES.PORTFOLIO_MANAGER,
    ROLES.PROPERTY_MANAGER,
    ROLES.LEASING_SPECIALIST,
    ROLES.MAINTENANCE_SUPERVISOR,
    ROLES.MARKETING_SPECIALIST,
    ROLES.FINANCIAL_CONTROLLER
  ],
  [ROLE_CATEGORIES.OPERATIONAL]: [
    ROLES.LANDLORD,
    ROLES.TENANT,
    ROLES.ACCOUNTANT
  ],
  [ROLE_CATEGORIES.EXTERNAL]: [
    ROLES.VENDOR,
    ROLES.INSPECTOR
  ]
};

/**
 * Role access levels for different system areas
 */
export const ROLE_ACCESS_LEVELS = {
  SYSTEM: {
    [ROLES.SYSTEM_ADMIN]: 'full',
    [ROLES.COMPANY_ADMIN]: 'none',
    [ROLES.COMPANY_OWNER]: 'none'
  },
  COMPANY: {
    [ROLES.SYSTEM_ADMIN]: 'full',
    [ROLES.COMPANY_ADMIN]: 'full',
    [ROLES.COMPANY_OWNER]: 'read',
    [ROLES.PORTFOLIO_MANAGER]: 'limited',
    [ROLES.PROPERTY_MANAGER]: 'limited'
  },
  PROPERTY: {
    [ROLES.SYSTEM_ADMIN]: 'full',
    [ROLES.COMPANY_ADMIN]: 'full',
    [ROLES.COMPANY_OWNER]: 'read',
    [ROLES.PORTFOLIO_MANAGER]: 'full',
    [ROLES.PROPERTY_MANAGER]: 'full',
    [ROLES.LEASING_SPECIALIST]: 'limited',
    [ROLES.MAINTENANCE_SUPERVISOR]: 'limited',
    [ROLES.MARKETING_SPECIALIST]: 'limited',
    [ROLES.FINANCIAL_CONTROLLER]: 'read',
    [ROLES.LANDLORD]: 'owner',
    [ROLES.TENANT]: 'resident',
    [ROLES.VENDOR]: 'service',
    [ROLES.INSPECTOR]: 'inspect',
    [ROLES.ACCOUNTANT]: 'read'
  },
  FINANCIAL: {
    [ROLES.SYSTEM_ADMIN]: 'full',
    [ROLES.COMPANY_ADMIN]: 'full',
    [ROLES.COMPANY_OWNER]: 'read',
    [ROLES.PORTFOLIO_MANAGER]: 'read',
    [ROLES.PROPERTY_MANAGER]: 'limited',
    [ROLES.FINANCIAL_CONTROLLER]: 'full',
    [ROLES.LANDLORD]: 'owner',
    [ROLES.TENANT]: 'personal',
    [ROLES.ACCOUNTANT]: 'full'
  },
  MAINTENANCE: {
    [ROLES.SYSTEM_ADMIN]: 'full',
    [ROLES.COMPANY_ADMIN]: 'full',
    [ROLES.PORTFOLIO_MANAGER]: 'read',
    [ROLES.PROPERTY_MANAGER]: 'full',
    [ROLES.MAINTENANCE_SUPERVISOR]: 'full',
    [ROLES.LANDLORD]: 'owner',
    [ROLES.TENANT]: 'request',
    [ROLES.VENDOR]: 'service',
    [ROLES.INSPECTOR]: 'inspect'
  }
};

/**
 * Role-based dashboard configurations
 */
export const ROLE_DASHBOARDS = {
  [ROLES.SYSTEM_ADMIN]: {
    defaultRoute: '/admin',
    widgets: ['system-health', 'user-stats', 'company-overview', 'platform-metrics'],
    layout: 'admin'
  },
  [ROLES.COMPANY_ADMIN]: {
    defaultRoute: '/company',
    widgets: ['portfolio-overview', 'financial-summary', 'occupancy-rates', 'maintenance-alerts'],
    layout: 'company'
  },
  [ROLES.COMPANY_OWNER]: {
    defaultRoute: '/company/overview',
    widgets: ['revenue-summary', 'portfolio-performance', 'key-metrics', 'executive-reports'],
    layout: 'executive'
  },
  [ROLES.PORTFOLIO_MANAGER]: {
    defaultRoute: '/management',
    widgets: ['portfolio-metrics', 'property-performance', 'occupancy-overview', 'financial-highlights'],
    layout: 'management'
  },
  [ROLES.PROPERTY_MANAGER]: {
    defaultRoute: '/management/properties',
    widgets: ['property-overview', 'tenant-summary', 'maintenance-queue', 'lease-renewals'],
    layout: 'management'
  },
  [ROLES.LEASING_SPECIALIST]: {
    defaultRoute: '/management/tenants',
    widgets: ['vacancy-report', 'application-pipeline', 'lease-activity', 'marketing-metrics'],
    layout: 'specialist'
  },
  [ROLES.MAINTENANCE_SUPERVISOR]: {
    defaultRoute: '/management/maintenance',
    widgets: ['work-orders', 'vendor-performance', 'maintenance-costs', 'equipment-status'],
    layout: 'specialist'
  },
  [ROLES.MARKETING_SPECIALIST]: {
    defaultRoute: '/company/communications',
    widgets: ['campaign-performance', 'lead-generation', 'tenant-engagement', 'brand-metrics'],
    layout: 'specialist'
  },
  [ROLES.FINANCIAL_CONTROLLER]: {
    defaultRoute: '/company/financials',
    widgets: ['financial-overview', 'budget-variance', 'cash-flow', 'ar-aging'],
    layout: 'financial'
  },
  [ROLES.LANDLORD]: {
    defaultRoute: '/landlord',
    widgets: ['property-income', 'tenant-status', 'maintenance-requests', 'expense-tracking'],
    layout: 'landlord'
  },
  [ROLES.TENANT]: {
    defaultRoute: '/tenant',
    widgets: ['lease-info', 'payment-status', 'maintenance-requests', 'announcements'],
    layout: 'tenant'
  },
  [ROLES.VENDOR]: {
    defaultRoute: '/vendor/work-orders',
    widgets: ['assigned-work-orders', 'completion-stats', 'payment-status', 'ratings'],
    layout: 'vendor'
  },
  [ROLES.INSPECTOR]: {
    defaultRoute: '/inspector/inspections',
    widgets: ['scheduled-inspections', 'inspection-history', 'compliance-status', 'reports'],
    layout: 'inspector'
  },
  [ROLES.ACCOUNTANT]: {
    defaultRoute: '/accountant/reports',
    widgets: ['financial-reports', 'tax-documents', 'audit-trail', 'reconciliation'],
    layout: 'accountant'
  }
};

/**
 * Role-based menu configurations
 */
export const ROLE_MENUS = {
  [ROLES.SYSTEM_ADMIN]: [
    'dashboard', 'users', 'companies', 'system', 'analytics', 'reports', 'settings'
  ],
  [ROLES.COMPANY_ADMIN]: [
    'dashboard', 'portfolio', 'properties', 'tenants', 'financials', 'maintenance', 
    'team', 'communications', 'reports', 'settings'
  ],
  [ROLES.COMPANY_OWNER]: [
    'dashboard', 'portfolio', 'analytics', 'reports', 'settings'
  ],
  [ROLES.PORTFOLIO_MANAGER]: [
    'dashboard', 'properties', 'tenants', 'leases', 'financials', 'maintenance', 
    'reports', 'calendar'
  ],
  [ROLES.PROPERTY_MANAGER]: [
    'dashboard', 'properties', 'units', 'tenants', 'leases', 'maintenance', 
    'inspections', 'financials', 'calendar', 'tasks'
  ],
  [ROLES.LEASING_SPECIALIST]: [
    'dashboard', 'properties', 'units', 'tenants', 'applications', 'leases', 
    'marketing', 'calendar'
  ],
  [ROLES.MAINTENANCE_SUPERVISOR]: [
    'dashboard', 'work-orders', 'preventive-maintenance', 'vendors', 'inventory', 
    'inspections', 'reports', 'calendar'
  ],
  [ROLES.MARKETING_SPECIALIST]: [
    'dashboard', 'properties', 'marketing', 'communications', 'campaigns', 
    'analytics', 'content'
  ],
  [ROLES.FINANCIAL_CONTROLLER]: [
    'dashboard', 'financials', 'budgets', 'reports', 'accounting', 'reconciliation', 
    'analytics'
  ],
  [ROLES.LANDLORD]: [
    'dashboard', 'properties', 'tenants', 'leases', 'financials', 'maintenance', 
    'documents', 'reports'
  ],
  [ROLES.TENANT]: [
    'home', 'lease', 'payments', 'maintenance', 'messages', 'property', 
    'services', 'documents'
  ],
  [ROLES.VENDOR]: [
    'work-orders', 'schedule', 'invoices', 'documents', 'profile'
  ],
  [ROLES.INSPECTOR]: [
    'inspections', 'schedule', 'reports', 'documents', 'profile'
  ],
  [ROLES.ACCOUNTANT]: [
    'reports', 'financials', 'documents', 'reconciliation', 'profile'
  ]
};

/**
 * Role capabilities matrix
 */
export const ROLE_CAPABILITIES = {
  [ROLES.SYSTEM_ADMIN]: {
    canManageSystem: true,
    canManageCompanies: true,
    canManageUsers: true,
    canViewAllData: true,
    canExportData: true,
    canConfigureSystem: true,
    canAccessLogs: true,
    canManageIntegrations: true
  },
  [ROLES.COMPANY_ADMIN]: {
    canManageCompany: true,
    canManageProperties: true,
    canManageUsers: true,
    canViewCompanyData: true,
    canExportCompanyData: true,
    canManageFinancials: true,
    canManageTeam: true,
    canConfigureCompany: true
  },
  [ROLES.COMPANY_OWNER]: {
    canViewCompanyData: true,
    canViewReports: true,
    canViewFinancials: true,
    canViewAnalytics: true,
    canExportReports: true,
    canConfigureCompany: true
  },
  [ROLES.PORTFOLIO_MANAGER]: {
    canManagePortfolio: true,
    canManageProperties: true,
    canViewTenants: true,
    canViewFinancials: true,
    canAssignProperties: true,
    canViewReports: true,
    canManageLeases: true
  },
  [ROLES.PROPERTY_MANAGER]: {
    canManageAssignedProperties: true,
    canManageTenants: true,
    canManageLeases: true,
    canManageMaintenance: true,
    canViewFinancials: true,
    canCommunicateWithTenants: true,
    canScheduleInspections: true,
    canManageUnits: true
  },
  [ROLES.LEASING_SPECIALIST]: {
    canManageApplications: true,
    canCreateLeases: true,
    canCommunicateWithProspects: true,
    canViewUnits: true,
    canScheduleShowings: true,
    canProcessApplications: true,
    canManageMarketing: true
  },
  [ROLES.MAINTENANCE_SUPERVISOR]: {
    canManageMaintenance: true,
    canAssignWorkOrders: true,
    canManageVendors: true,
    canScheduleInspections: true,
    canManageInventory: true,
    canViewMaintenanceReports: true,
    canApproveMaintenance: true
  },
  [ROLES.MARKETING_SPECIALIST]: {
    canManageMarketing: true,
    canCreateCampaigns: true,
    canManageCommunications: true,
    canViewAnalytics: true,
    canManageContent: true,
    canSendNotifications: true
  },
  [ROLES.FINANCIAL_CONTROLLER]: {
    canManageFinancials: true,
    canViewAllFinancials: true,
    canCreateBudgets: true,
    canGenerateReports: true,
    canManageAccounting: true,
    canReconcileAccounts: true,
    canExportFinancialData: true
  },
  [ROLES.LANDLORD]: {
    canManageOwnProperties: true,
    canViewOwnTenants: true,
    canViewOwnFinancials: true,
    canCreateMaintenanceRequests: true,
    canCommunicateWithTenants: true,
    canViewOwnReports: true,
    canManageOwnLeases: true
  },
  [ROLES.TENANT]: {
    canViewOwnLease: true,
    canMakePayments: true,
    canCreateMaintenanceRequests: true,
    canCommunicateWithManagement: true,
    canViewOwnDocuments: true,
    canViewPropertyInfo: true,
    canBookAmenities: true,
    canSubmitMoveOutNotice: true
  },
  [ROLES.VENDOR]: {
    canViewAssignedWorkOrders: true,
    canUpdateWorkOrderStatus: true,
    canUploadDocuments: true,
    canCommunicateWithManagement: true,
    canViewOwnInvoices: true,
    canSubmitBids: true
  },
  [ROLES.INSPECTOR]: {
    canConductInspections: true,
    canCreateInspectionReports: true,
    canScheduleInspections: true,
    canViewPropertyDetails: true,
    canUploadInspectionPhotos: true,
    canViewInspectionHistory: true
  },
  [ROLES.ACCOUNTANT]: {
    canViewFinancialReports: true,
    canExportFinancialData: true,
    canViewTaxDocuments: true,
    canAccessAuditTrail: true,
    canReconcileAccounts: true,
    canGenerateStatements: true
  }
};

/**
 * Role transition rules (which roles can be assigned by whom)
 */
export const ROLE_ASSIGNMENT_RULES = {
  [ROLES.SYSTEM_ADMIN]: Object.values(ROLES),
  [ROLES.COMPANY_ADMIN]: [
    ROLES.PORTFOLIO_MANAGER,
    ROLES.PROPERTY_MANAGER,
    ROLES.LEASING_SPECIALIST,
    ROLES.MAINTENANCE_SUPERVISOR,
    ROLES.MARKETING_SPECIALIST,
    ROLES.FINANCIAL_CONTROLLER,
    ROLES.LANDLORD,
    ROLES.TENANT,
    ROLES.VENDOR,
    ROLES.INSPECTOR,
    ROLES.ACCOUNTANT
  ],
  [ROLES.COMPANY_OWNER]: [],
  [ROLES.PORTFOLIO_MANAGER]: [
    ROLES.PROPERTY_MANAGER,
    ROLES.LEASING_SPECIALIST,
    ROLES.MAINTENANCE_SUPERVISOR,
    ROLES.TENANT,
    ROLES.VENDOR,
    ROLES.INSPECTOR
  ],
  [ROLES.PROPERTY_MANAGER]: [
    ROLES.TENANT,
    ROLES.VENDOR,
    ROLES.INSPECTOR
  ]
};

/**
 * Default role assignments for new users
 */
export const DEFAULT_ROLES = {
  COMPANY_SIGNUP: ROLES.COMPANY_ADMIN,
  LANDLORD_SIGNUP: ROLES.LANDLORD,
  TENANT_SIGNUP: ROLES.TENANT,
  VENDOR_SIGNUP: ROLES.VENDOR,
  INSPECTOR_SIGNUP: ROLES.INSPECTOR
};

/**
 * Role-based color schemes for UI
 */
export const ROLE_COLORS = {
  [ROLES.SYSTEM_ADMIN]: { primary: '#dc2626', secondary: '#fef2f2' },
  [ROLES.COMPANY_ADMIN]: { primary: '#7c3aed', secondary: '#f3f4f6' },
  [ROLES.COMPANY_OWNER]: { primary: '#059669', secondary: '#ecfdf5' },
  [ROLES.PORTFOLIO_MANAGER]: { primary: '#0891b2', secondary: '#f0f9ff' },
  [ROLES.PROPERTY_MANAGER]: { primary: '#ea580c', secondary: '#fff7ed' },
  [ROLES.LEASING_SPECIALIST]: { primary: '#9333ea', secondary: '#faf5ff' },
  [ROLES.MAINTENANCE_SUPERVISOR]: { primary: '#ca8a04', secondary: '#fefce8' },
  [ROLES.MARKETING_SPECIALIST]: { primary: '#e11d48', secondary: '#fdf2f8' },
  [ROLES.FINANCIAL_CONTROLLER]: { primary: '#16a34a', secondary: '#f0fdf4' },
  [ROLES.LANDLORD]: { primary: '#2563eb', secondary: '#eff6ff' },
  [ROLES.TENANT]: { primary: '#0d9488', secondary: '#f0fdfa' },
  [ROLES.VENDOR]: { primary: '#c2410c', secondary: '#fff7ed' },
  [ROLES.INSPECTOR]: { primary: '#7c2d12', secondary: '#fef7f0' },
  [ROLES.ACCOUNTANT]: { primary: '#166534', secondary: '#f0fdf4' }
};

// Export all role constants
export default {
  ROLES,
  ROLE_CATEGORIES,
  ROLE_HIERARCHY,
  ROLE_DISPLAY_NAMES,
  ROLE_DESCRIPTIONS,
  ROLE_CATEGORY_MAPPING,
  ROLE_ACCESS_LEVELS,
  ROLE_DASHBOARDS,
  ROLE_MENUS,
  ROLE_CAPABILITIES,
  ROLE_ASSIGNMENT_RULES,
  DEFAULT_ROLES,
  ROLE_COLORS
};