/**
 * Application route constants
 * Centralized route definitions for consistent navigation
 */

/**
 * Public routes (no authentication required)
 */
export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRICING: '/pricing',
  FEATURES: '/features',
  BLOG: '/blog',
  BLOG_POST: '/blog/:slug',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  HELP: '/help',
  FAQ: '/faq',
  SEARCH: '/search',
  PROPERTIES: '/properties',
  PROPERTY_DETAILS: '/properties/:id',
  PROPERTY_SEARCH: '/properties/search'
};

/**
 * Authentication routes
 */
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  VERIFY_EMAIL: '/verify-email/:token',
  RESEND_VERIFICATION: '/resend-verification',
  TWO_FACTOR: '/two-factor',
  LOGOUT: '/logout'
};

/**
 * System Admin routes
 */
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin',
  OVERVIEW: '/admin/overview',
  
  // System Management
  SYSTEM: '/admin/system',
  SYSTEM_SETTINGS: '/admin/system/settings',
  SYSTEM_CONFIG: '/admin/system/config',
  SYSTEM_MONITORING: '/admin/system/monitoring',
  SYSTEM_LOGS: '/admin/system/logs',
  SYSTEM_BACKUP: '/admin/system/backup',
  SYSTEM_HEALTH: '/admin/system/health',
  
  // User Management
  USERS: '/admin/users',
  USER_DETAILS: '/admin/users/:id',
  USER_CREATE: '/admin/users/create',
  USER_EDIT: '/admin/users/:id/edit',
  
  // Role Management
  ROLES: '/admin/roles',
  ROLE_DETAILS: '/admin/roles/:id',
  ROLE_CREATE: '/admin/roles/create',
  ROLE_EDIT: '/admin/roles/:id/edit',
  PERMISSIONS: '/admin/permissions',
  
  // Company Management
  COMPANIES: '/admin/companies',
  COMPANY_DETAILS: '/admin/companies/:id',
  COMPANY_CREATE: '/admin/companies/create',
  COMPANY_EDIT: '/admin/companies/:id/edit',
  
  // Analytics & Reports
  ANALYTICS: '/admin/analytics',
  REPORTS: '/admin/reports',
  AUDIT_LOGS: '/admin/audit-logs',
  
  // Integrations
  INTEGRATIONS: '/admin/integrations',
  WEBHOOKS: '/admin/webhooks',
  API_KEYS: '/admin/api-keys',
  
  // Notifications
  NOTIFICATIONS: '/admin/notifications',
  NOTIFICATION_TEMPLATES: '/admin/notifications/templates',
  
  // Support
  SUPPORT: '/admin/support',
  TICKETS: '/admin/support/tickets',
  TICKET_DETAILS: '/admin/support/tickets/:id'
};

/**
 * Company/Commercial routes
 */
export const COMPANY_ROUTES = {
  DASHBOARD: '/company',
  OVERVIEW: '/company/overview',
  
  // Portfolio Management
  PORTFOLIO: '/company/portfolio',
  PORTFOLIO_ANALYTICS: '/company/portfolio/analytics',
  PORTFOLIO_PERFORMANCE: '/company/portfolio/performance',
  
  // Property Management
  PROPERTIES: '/company/properties',
  PROPERTY_DETAILS: '/company/properties/:id',
  PROPERTY_CREATE: '/company/properties/create',
  PROPERTY_EDIT: '/company/properties/:id/edit',
  PROPERTY_ANALYTICS: '/company/properties/:id/analytics',
  
  // Team Management
  TEAM: '/company/team',
  TEAM_MEMBER: '/company/team/:id',
  TEAM_INVITE: '/company/team/invite',
  TEAM_ROLES: '/company/team/roles',
  
  // Financial Management
  FINANCIALS: '/company/financials',
  REVENUE: '/company/financials/revenue',
  EXPENSES: '/company/financials/expenses',
  BUDGETS: '/company/financials/budgets',
  REPORTS: '/company/financials/reports',
  INVOICES: '/company/financials/invoices',
  PAYMENTS: '/company/financials/payments',
  
  // Tenant Management
  TENANTS: '/company/tenants',
  TENANT_DETAILS: '/company/tenants/:id',
  TENANT_CREATE: '/company/tenants/create',
  TENANT_APPLICATIONS: '/company/tenants/applications',
  
  // Lease Management
  LEASES: '/company/leases',
  LEASE_DETAILS: '/company/leases/:id',
  LEASE_CREATE: '/company/leases/create',
  LEASE_TEMPLATES: '/company/leases/templates',
  
  // Maintenance
  MAINTENANCE: '/company/maintenance',
  MAINTENANCE_REQUESTS: '/company/maintenance/requests',
  MAINTENANCE_WORK_ORDERS: '/company/maintenance/work-orders',
  MAINTENANCE_VENDORS: '/company/maintenance/vendors',
  MAINTENANCE_SCHEDULE: '/company/maintenance/schedule',
  
  // Communications
  COMMUNICATIONS: '/company/communications',
  MESSAGES: '/company/communications/messages',
  ANNOUNCEMENTS: '/company/communications/announcements',
  TEMPLATES: '/company/communications/templates',
  
  // Reports & Analytics
  ANALYTICS: '/company/analytics',
  REPORTS_DASHBOARD: '/company/reports',
  CUSTOM_REPORTS: '/company/reports/custom',
  
  // Settings
  SETTINGS: '/company/settings',
  COMPANY_PROFILE: '/company/settings/profile',
  BILLING: '/company/settings/billing',
  INTEGRATIONS: '/company/settings/integrations',
  NOTIFICATIONS: '/company/settings/notifications'
};

/**
 * Management Properties routes
 */
export const MANAGEMENT_ROUTES = {
  DASHBOARD: '/management',
  OVERVIEW: '/management/overview',
  
  // Property Management
  PROPERTIES: '/management/properties',
  PROPERTY_DETAILS: '/management/properties/:id',
  PROPERTY_UNITS: '/management/properties/:id/units',
  PROPERTY_TENANTS: '/management/properties/:id/tenants',
  PROPERTY_MAINTENANCE: '/management/properties/:id/maintenance',
  PROPERTY_FINANCIALS: '/management/properties/:id/financials',
  
  // Unit Management
  UNITS: '/management/units',
  UNIT_DETAILS: '/management/units/:id',
  UNIT_AVAILABILITY: '/management/units/availability',
  
  // Tenant Management
  TENANTS: '/management/tenants',
  TENANT_DETAILS: '/management/tenants/:id',
  TENANT_SCREENING: '/management/tenants/screening',
  TENANT_COMMUNICATIONS: '/management/tenants/communications',
  
  // Lease Management
  LEASES: '/management/leases',
  LEASE_DETAILS: '/management/leases/:id',
  LEASE_RENEWALS: '/management/leases/renewals',
  LEASE_VIOLATIONS: '/management/leases/violations',
  
  // Maintenance Management
  MAINTENANCE: '/management/maintenance',
  WORK_ORDERS: '/management/maintenance/work-orders',
  WORK_ORDER_DETAILS: '/management/maintenance/work-orders/:id',
  PREVENTIVE_MAINTENANCE: '/management/maintenance/preventive',
  VENDOR_MANAGEMENT: '/management/maintenance/vendors',
  INVENTORY: '/management/maintenance/inventory',
  
  // Financial Management
  FINANCIALS: '/management/financials',
  RENT_ROLL: '/management/financials/rent-roll',
  COLLECTIONS: '/management/financials/collections',
  EXPENSES: '/management/financials/expenses',
  BUDGETS: '/management/financials/budgets',
  
  // Inspections
  INSPECTIONS: '/management/inspections',
  INSPECTION_DETAILS: '/management/inspections/:id',
  INSPECTION_SCHEDULE: '/management/inspections/schedule',
  INSPECTION_REPORTS: '/management/inspections/reports',
  
  // Reports
  REPORTS: '/management/reports',
  OCCUPANCY_REPORTS: '/management/reports/occupancy',
  FINANCIAL_REPORTS: '/management/reports/financial',
  MAINTENANCE_REPORTS: '/management/reports/maintenance',
  
  // Calendar & Tasks
  CALENDAR: '/management/calendar',
  TASKS: '/management/tasks',
  SCHEDULE: '/management/schedule'
};

/**
 * Landlord routes
 */
export const LANDLORD_ROUTES = {
  DASHBOARD: '/landlord',
  OVERVIEW: '/landlord/overview',
  
  // Property Management
  PROPERTIES: '/landlord/properties',
  PROPERTY_DETAILS: '/landlord/properties/:id',
  PROPERTY_ADD: '/landlord/properties/add',
  PROPERTY_EDIT: '/landlord/properties/:id/edit',
  
  // Unit Management
  UNITS: '/landlord/units',
  UNIT_DETAILS: '/landlord/units/:id',
  
  // Tenant Management
  TENANTS: '/landlord/tenants',
  TENANT_DETAILS: '/landlord/tenants/:id',
  TENANT_APPLICATIONS: '/landlord/tenants/applications',
  
  // Lease Management
  LEASES: '/landlord/leases',
  LEASE_DETAILS: '/landlord/leases/:id',
  LEASE_CREATE: '/landlord/leases/create',
  
  // Financial Management
  FINANCIALS: '/landlord/financials',
  INCOME: '/landlord/financials/income',
  EXPENSES: '/landlord/financials/expenses',
  STATEMENTS: '/landlord/financials/statements',
  TAX_REPORTS: '/landlord/financials/tax-reports',
  
  // Maintenance
  MAINTENANCE: '/landlord/maintenance',
  MAINTENANCE_REQUESTS: '/landlord/maintenance/requests',
  MAINTENANCE_HISTORY: '/landlord/maintenance/history',
  
  // Communications
  MESSAGES: '/landlord/messages',
  ANNOUNCEMENTS: '/landlord/announcements',
  
  // Documents
  DOCUMENTS: '/landlord/documents',
  CONTRACTS: '/landlord/documents/contracts',
  INSURANCE: '/landlord/documents/insurance',
  
  // Reports
  REPORTS: '/landlord/reports',
  ANALYTICS: '/landlord/analytics',
  
  // Settings
  SETTINGS: '/landlord/settings',
  PROFILE: '/landlord/settings/profile',
  PREFERENCES: '/landlord/settings/preferences',
  NOTIFICATIONS: '/landlord/settings/notifications'
};

/**
 * Tenant routes
 */
export const TENANT_ROUTES = {
  DASHBOARD: '/tenant',
  HOME: '/tenant/home',
  
  // Lease Information
  LEASE: '/tenant/lease',
  LEASE_DETAILS: '/tenant/lease/details',
  LEASE_DOCUMENTS: '/tenant/lease/documents',
  LEASE_RENEWAL: '/tenant/lease/renewal',
  
  // Payments
  PAYMENTS: '/tenant/payments',
  PAYMENT_HISTORY: '/tenant/payments/history',
  MAKE_PAYMENT: '/tenant/payments/make',
  AUTOPAY: '/tenant/payments/autopay',
  PAYMENT_METHODS: '/tenant/payments/methods',
  
  // Maintenance
  MAINTENANCE: '/tenant/maintenance',
  MAINTENANCE_REQUESTS: '/tenant/maintenance/requests',
  REQUEST_MAINTENANCE: '/tenant/maintenance/request',
  MAINTENANCE_HISTORY: '/tenant/maintenance/history',
  
  // Communications
  MESSAGES: '/tenant/messages',
  ANNOUNCEMENTS: '/tenant/announcements',
  CONTACT_MANAGEMENT: '/tenant/contact',
  
  // Property Information
  PROPERTY: '/tenant/property',
  PROPERTY_INFO: '/tenant/property/info',
  AMENITIES: '/tenant/property/amenities',
  AMENITY_BOOKING: '/tenant/property/amenities/book',
  COMMUNITY: '/tenant/property/community',
  
  // Documents
  DOCUMENTS: '/tenant/documents',
  LEASE_DOCUMENTS: '/tenant/documents/lease',
  NOTICES: '/tenant/documents/notices',
  
  // Services
  SERVICES: '/tenant/services',
  UTILITIES: '/tenant/services/utilities',
  PARKING: '/tenant/services/parking',
  GUEST_REGISTRATION: '/tenant/services/guests',
  
  // Move Out
  MOVE_OUT: '/tenant/move-out',
  MOVE_OUT_NOTICE: '/tenant/move-out/notice',
  MOVE_OUT_CHECKLIST: '/tenant/move-out/checklist',
  
  // Profile & Settings
  PROFILE: '/tenant/profile',
  SETTINGS: '/tenant/settings',
  PREFERENCES: '/tenant/settings/preferences',
  NOTIFICATIONS: '/tenant/settings/notifications',
  EMERGENCY_CONTACTS: '/tenant/settings/emergency-contacts'
};

/**
 * Error routes
 */
export const ERROR_ROUTES = {
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
  FORBIDDEN: '/403',
  SERVER_ERROR: '/500',
  MAINTENANCE: '/maintenance'
};

/**
 * API routes (for reference)
 */
export const API_ROUTES = {
  BASE: '/api',
  AUTH: '/api/auth',
  USERS: '/api/users',
  PROPERTIES: '/api/properties',
  TENANTS: '/api/tenants',
  LEASES: '/api/leases',
  MAINTENANCE: '/api/maintenance',
  FINANCIAL: '/api/financial',
  COMMUNICATIONS: '/api/communications',
  REPORTS: '/api/reports',
  UPLOADS: '/api/uploads'
};

/**
 * Route groups for easier management
 */
export const ROUTE_GROUPS = {
  PUBLIC: PUBLIC_ROUTES,
  AUTH: AUTH_ROUTES,
  ADMIN: ADMIN_ROUTES,
  COMPANY: COMPANY_ROUTES,
  MANAGEMENT: MANAGEMENT_ROUTES,
  LANDLORD: LANDLORD_ROUTES,
  TENANT: TENANT_ROUTES,
  ERROR: ERROR_ROUTES,
  API: API_ROUTES
};

/**
 * Route metadata for navigation and breadcrumbs
 */
export const ROUTE_META = {
  [PUBLIC_ROUTES.HOME]: { title: 'Home', breadcrumb: 'Home' },
  [PUBLIC_ROUTES.ABOUT]: { title: 'About', breadcrumb: 'About' },
  [PUBLIC_ROUTES.CONTACT]: { title: 'Contact', breadcrumb: 'Contact' },
  [PUBLIC_ROUTES.PRICING]: { title: 'Pricing', breadcrumb: 'Pricing' },
  [PUBLIC_ROUTES.FEATURES]: { title: 'Features', breadcrumb: 'Features' },
  
  [AUTH_ROUTES.LOGIN]: { title: 'Login', breadcrumb: 'Login' },
  [AUTH_ROUTES.REGISTER]: { title: 'Register', breadcrumb: 'Register' },
  [AUTH_ROUTES.FORGOT_PASSWORD]: { title: 'Forgot Password', breadcrumb: 'Forgot Password' },
  
  [ADMIN_ROUTES.DASHBOARD]: { title: 'Admin Dashboard', breadcrumb: 'Dashboard' },
  [ADMIN_ROUTES.USERS]: { title: 'User Management', breadcrumb: 'Users' },
  [ADMIN_ROUTES.COMPANIES]: { title: 'Company Management', breadcrumb: 'Companies' },
  [ADMIN_ROUTES.SYSTEM]: { title: 'System Management', breadcrumb: 'System' },
  
  [COMPANY_ROUTES.DASHBOARD]: { title: 'Company Dashboard', breadcrumb: 'Dashboard' },
  [COMPANY_ROUTES.PROPERTIES]: { title: 'Properties', breadcrumb: 'Properties' },
  [COMPANY_ROUTES.TENANTS]: { title: 'Tenants', breadcrumb: 'Tenants' },
  [COMPANY_ROUTES.FINANCIALS]: { title: 'Financials', breadcrumb: 'Financials' },
  
  [MANAGEMENT_ROUTES.DASHBOARD]: { title: 'Management Dashboard', breadcrumb: 'Dashboard' },
  [MANAGEMENT_ROUTES.PROPERTIES]: { title: 'Property Management', breadcrumb: 'Properties' },
  [MANAGEMENT_ROUTES.MAINTENANCE]: { title: 'Maintenance', breadcrumb: 'Maintenance' },
  
  [LANDLORD_ROUTES.DASHBOARD]: { title: 'Landlord Dashboard', breadcrumb: 'Dashboard' },
  [LANDLORD_ROUTES.PROPERTIES]: { title: 'My Properties', breadcrumb: 'Properties' },
  [LANDLORD_ROUTES.TENANTS]: { title: 'My Tenants', breadcrumb: 'Tenants' },
  
  [TENANT_ROUTES.DASHBOARD]: { title: 'Tenant Portal', breadcrumb: 'Home' },
  [TENANT_ROUTES.PAYMENTS]: { title: 'Payments', breadcrumb: 'Payments' },
  [TENANT_ROUTES.MAINTENANCE]: { title: 'Maintenance', breadcrumb: 'Maintenance' },
  [TENANT_ROUTES.LEASE]: { title: 'Lease Information', breadcrumb: 'Lease' }
};

/**
 * Navigation menu structure
 */
export const NAVIGATION_MENUS = {
  PUBLIC: [
    { label: 'Home', path: PUBLIC_ROUTES.HOME },
    { label: 'Properties', path: PUBLIC_ROUTES.PROPERTIES },
    { label: 'Features', path: PUBLIC_ROUTES.FEATURES },
    { label: 'Pricing', path: PUBLIC_ROUTES.PRICING },
    { label: 'About', path: PUBLIC_ROUTES.ABOUT },
    { label: 'Contact', path: PUBLIC_ROUTES.CONTACT }
  ],
  
  ADMIN: [
    { label: 'Dashboard', path: ADMIN_ROUTES.DASHBOARD, icon: 'dashboard' },
    { label: 'Users', path: ADMIN_ROUTES.USERS, icon: 'users' },
    { label: 'Companies', path: ADMIN_ROUTES.COMPANIES, icon: 'building' },
    { label: 'System', path: ADMIN_ROUTES.SYSTEM, icon: 'settings' },
    { label: 'Analytics', path: ADMIN_ROUTES.ANALYTICS, icon: 'chart' },
    { label: 'Reports', path: ADMIN_ROUTES.REPORTS, icon: 'report' }
  ],
  
  COMPANY: [
    { label: 'Dashboard', path: COMPANY_ROUTES.DASHBOARD, icon: 'dashboard' },
    { label: 'Portfolio', path: COMPANY_ROUTES.PORTFOLIO, icon: 'portfolio' },
    { label: 'Properties', path: COMPANY_ROUTES.PROPERTIES, icon: 'building' },
    { label: 'Tenants', path: COMPANY_ROUTES.TENANTS, icon: 'users' },
    { label: 'Financials', path: COMPANY_ROUTES.FINANCIALS, icon: 'dollar' },
    { label: 'Maintenance', path: COMPANY_ROUTES.MAINTENANCE, icon: 'wrench' },
    { label: 'Team', path: COMPANY_ROUTES.TEAM, icon: 'team' },
    { label: 'Reports', path: COMPANY_ROUTES.REPORTS_DASHBOARD, icon: 'report' }
  ],
  
  MANAGEMENT: [
    { label: 'Dashboard', path: MANAGEMENT_ROUTES.DASHBOARD, icon: 'dashboard' },
    { label: 'Properties', path: MANAGEMENT_ROUTES.PROPERTIES, icon: 'building' },
    { label: 'Units', path: MANAGEMENT_ROUTES.UNITS, icon: 'home' },
    { label: 'Tenants', path: MANAGEMENT_ROUTES.TENANTS, icon: 'users' },
    { label: 'Leases', path: MANAGEMENT_ROUTES.LEASES, icon: 'document' },
    { label: 'Maintenance', path: MANAGEMENT_ROUTES.MAINTENANCE, icon: 'wrench' },
    { label: 'Financials', path: MANAGEMENT_ROUTES.FINANCIALS, icon: 'dollar' },
    { label: 'Inspections', path: MANAGEMENT_ROUTES.INSPECTIONS, icon: 'search' },
    { label: 'Calendar', path: MANAGEMENT_ROUTES.CALENDAR, icon: 'calendar' }
  ],
  
  LANDLORD: [
    { label: 'Dashboard', path: LANDLORD_ROUTES.DASHBOARD, icon: 'dashboard' },
    { label: 'Properties', path: LANDLORD_ROUTES.PROPERTIES, icon: 'building' },
    { label: 'Tenants', path: LANDLORD_ROUTES.TENANTS, icon: 'users' },
    { label: 'Leases', path: LANDLORD_ROUTES.LEASES, icon: 'document' },
    { label: 'Financials', path: LANDLORD_ROUTES.FINANCIALS, icon: 'dollar' },
    { label: 'Maintenance', path: LANDLORD_ROUTES.MAINTENANCE, icon: 'wrench' },
    { label: 'Messages', path: LANDLORD_ROUTES.MESSAGES, icon: 'message' },
    { label: 'Documents', path: LANDLORD_ROUTES.DOCUMENTS, icon: 'folder' },
    { label: 'Reports', path: LANDLORD_ROUTES.REPORTS, icon: 'report' }
  ],
  
  TENANT: [
    { label: 'Home', path: TENANT_ROUTES.DASHBOARD, icon: 'home' },
    { label: 'Lease', path: TENANT_ROUTES.LEASE, icon: 'document' },
    { label: 'Payments', path: TENANT_ROUTES.PAYMENTS, icon: 'dollar' },
    { label: 'Maintenance', path: TENANT_ROUTES.MAINTENANCE, icon: 'wrench' },
    { label: 'Messages', path: TENANT_ROUTES.MESSAGES, icon: 'message' },
    { label: 'Property', path: TENANT_ROUTES.PROPERTY, icon: 'building' },
    { label: 'Services', path: TENANT_ROUTES.SERVICES, icon: 'service' },
    { label: 'Documents', path: TENANT_ROUTES.DOCUMENTS, icon: 'folder' }
  ]
};

/**
 * Route utilities
 */
export const ROUTE_UTILS = {
  /**
   * Build route with parameters
   * @param {string} route - Route template
   * @param {Object} params - Route parameters
   * @returns {string} Built route
   */
  buildRoute: (route, params = {}) => {
    let builtRoute = route;
    Object.keys(params).forEach(key => {
      builtRoute = builtRoute.replace(`:${key}`, params[key]);
    });
    return builtRoute;
  },

  /**
   * Check if route matches pattern
   * @param {string} route - Current route
   * @param {string} pattern - Route pattern
   * @returns {boolean} Whether route matches
   */
  matchesRoute: (route, pattern) => {
    const regex = new RegExp('^' + pattern.replace(/:[^\s/]+/g, '([\\w-]+)') + '$');
    return regex.test(route);
  },

  /**
   * Extract parameters from route
   * @param {string} route - Current route
   * @param {string} pattern - Route pattern
   * @returns {Object} Extracted parameters
   */
  extractParams: (route, pattern) => {
    const regex = new RegExp('^' + pattern.replace(/:[^\s/]+/g, '([\\w-]+)') + '$');
    const matches = route.match(regex);
    
    if (!matches) return {};
    
    const paramNames = pattern.match(/:[^\s/]+/g) || [];
    const params = {};
    
    paramNames.forEach((param, index) => {
      const paramName = param.slice(1); // Remove ':'
      params[paramName] = matches[index + 1];
    });
    
    return params;
  },

  /**
   * Get route breadcrumbs
   * @param {string} route - Current route
   * @returns {Array} Breadcrumb array
   */
  getBreadcrumbs: (route) => {
    const segments = route.split('/').filter(Boolean);
    const breadcrumbs = [];
    let currentPath = '';

    segments.forEach(segment => {
      currentPath += `/${segment}`;
      const meta = ROUTE_META[currentPath];
      
      if (meta) {
        breadcrumbs.push({
          label: meta.breadcrumb,
          path: currentPath
        });
      }
    });

    return breadcrumbs;
  }
};

// Export all route constants and utilities
export default {
  PUBLIC_ROUTES,
  AUTH_ROUTES,
  ADMIN_ROUTES,
  COMPANY_ROUTES,
  MANAGEMENT_ROUTES,
  LANDLORD_ROUTES,
  TENANT_ROUTES,
  ERROR_ROUTES,
  API_ROUTES,
  ROUTE_GROUPS,
  ROUTE_META,
  NAVIGATION_MENUS,
  ROUTE_UTILS
};