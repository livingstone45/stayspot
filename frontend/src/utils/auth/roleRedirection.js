/**
 * Role-based redirection utility
 * Determines the correct dashboard path based on user role
 */

export const getRoleDashboardPath = (user) => {
  if (!user) return '/auth/login';

  // Check user roles
  const roles = user.roles || [];
  const roleName = user.role || (Array.isArray(roles) && roles.length > 0 ? roles[0].name || roles[0] : null);

  // Map roles to their respective dashboards
  const roleMap = {
    'tenant': '/tenant',
    'landlord': '/landlord',
    'property_manager': '/management',
    'company_admin': '/company',
    'company_owner': '/company',
    'portfolio_manager': '/company',
    'system_admin': '/admin',
    'admin': '/admin',
    'leasing_specialist': '/management',
    'maintenance_supervisor': '/management',
    'financial_controller': '/company'
  };

  // Get the dashboard path, default to tenant
  return roleMap[roleName] || '/tenant';
};

export const getDashboardTitle = (user) => {
  if (!user) return 'Dashboard';

  const roles = user.roles || [];
  const roleName = user.role || (Array.isArray(roles) && roles.length > 0 ? roles[0].name || roles[0] : null);

  const titleMap = {
    'tenant': 'Tenant Dashboard',
    'landlord': 'Landlord Dashboard',
    'property_manager': 'Property Management Dashboard',
    'company_admin': 'Company Dashboard',
    'company_owner': 'Company Dashboard',
    'portfolio_manager': 'Portfolio Dashboard',
    'system_admin': 'Admin Dashboard',
    'admin': 'Admin Dashboard',
    'leasing_specialist': 'Leasing Dashboard',
    'maintenance_supervisor': 'Maintenance Dashboard',
    'financial_controller': 'Financial Dashboard'
  };

  return titleMap[roleName] || 'Dashboard';
};
