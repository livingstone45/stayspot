import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';

const ROLE_PERMISSIONS = {
  'system_admin': ['system.manage', 'users.manage', 'companies.manage', 'properties.manage', 'financials.manage', 'reports.view', 'settings.manage', 'audit.view'],
  'company_admin': ['company.manage', 'users.manage', 'properties.manage', 'financials.manage', 'reports.view', 'settings.manage', 'tenants.manage', 'maintenance.manage'],
  'company_owner': ['company.view', 'properties.view', 'financials.view', 'reports.view', 'users.view', 'tenants.view', 'maintenance.view'],
  'portfolio_manager': ['properties.manage', 'tenants.manage', 'maintenance.manage', 'financials.view', 'reports.view', 'tasks.manage', 'communications.manage'],
  'property_manager': ['property.manage', 'tenants.manage', 'maintenance.manage', 'tasks.manage', 'communications.manage', 'reports.view', 'financials.view'],
  'leasing_specialist': ['tenants.manage', 'applications.manage', 'showings.manage', 'marketing.manage', 'communications.manage', 'reports.view'],
  'maintenance_supervisor': ['maintenance.manage', 'vendors.manage', 'work_orders.manage', 'inspections.manage', 'inventory.manage', 'reports.view'],
  'marketing_specialist': ['marketing.manage', 'listings.manage', 'communications.manage', 'analytics.view', 'reports.view', 'media.manage'],
  'financial_controller': ['financials.manage', 'payments.manage', 'invoices.manage', 'reports.manage', 'budgets.manage', 'accounting.manage'],
  'landlord': ['property.view', 'tenants.view', 'maintenance.view', 'financials.view', 'reports.view', 'communications.view', 'tasks.view'],
  'tenant': ['profile.manage', 'payments.view', 'maintenance.create', 'communications.view', 'documents.view', 'lease.view'],
  'vendor': ['profile.manage', 'work_orders.view', 'invoices.manage', 'communications.view', 'schedule.manage', 'reports.view'],
  'inspector': ['inspections.manage', 'reports.create', 'properties.view', 'maintenance.view', 'communications.view', 'documents.manage'],
  'accountant': ['financials.view', 'reports.view', 'invoices.view', 'payments.view', 'budgets.view', 'accounting.manage']
};

export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();
  const [customPermissions, setCustomPermissions] = useState([]);

  const rolePermissions = useMemo(() => {
    if (!user?.role) return [];
    return ROLE_PERMISSIONS[user.role] || [];
  }, [user?.role]);

  const allPermissions = useMemo(() => {
    return [...rolePermissions, ...customPermissions, ...(user?.permissions || [])];
  }, [rolePermissions, customPermissions, user?.permissions]);

  const hasPermission = useCallback((permission) => {
    if (!isAuthenticated || !user) return false;
    if (user.role === 'system_admin') return true;
    return allPermissions.includes(permission);
  }, [isAuthenticated, user, allPermissions]);

  const hasAnyPermission = useCallback((permissions) => {
    if (!Array.isArray(permissions)) return false;
    return permissions.some(permission => hasPermission(permission));
  }, [hasPermission]);

  const hasAllPermissions = useCallback((permissions) => {
    if (!Array.isArray(permissions)) return false;
    return permissions.every(permission => hasPermission(permission));
  }, [hasPermission]);

  const hasRole = useCallback((role) => {
    if (!isAuthenticated || !user) return false;
    return user.role === role;
  }, [isAuthenticated, user]);

  const hasAnyRole = useCallback((roles) => {
    if (!Array.isArray(roles)) return false;
    return roles.some(role => hasRole(role));
  }, [hasRole]);

  const canManage = useCallback((resource) => {
    return hasPermission(`${resource}.manage`);
  }, [hasPermission]);

  const canView = useCallback((resource) => {
    return hasPermission(`${resource}.view`) || hasPermission(`${resource}.manage`);
  }, [hasPermission]);

  const canCreate = useCallback((resource) => {
    return hasPermission(`${resource}.create`) || hasPermission(`${resource}.manage`);
  }, [hasPermission]);

  const canEdit = useCallback((resource) => {
    return hasPermission(`${resource}.edit`) || hasPermission(`${resource}.manage`);
  }, [hasPermission]);

  const canDelete = useCallback((resource) => {
    return hasPermission(`${resource}.delete`) || hasPermission(`${resource}.manage`);
  }, [hasPermission]);

  const getMenuPermissions = useCallback(() => {
    return {
      dashboard: canView('dashboard'),
      properties: canView('properties'),
      tenants: canView('tenants'),
      maintenance: canView('maintenance'),
      financials: canView('financials'),
      reports: canView('reports'),
      users: canView('users'),
      settings: canView('settings'),
      communications: canView('communications'),
      tasks: canView('tasks')
    };
  }, [canView]);

  return {
    permissions: allPermissions,
    rolePermissions,
    customPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    canManage,
    canView,
    canCreate,
    canEdit,
    canDelete,
    getMenuPermissions,
    setCustomPermissions,
  };
};

export default usePermissions;
