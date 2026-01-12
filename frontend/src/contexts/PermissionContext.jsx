import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';

const PermissionContext = createContext();

const ROLE_PERMISSIONS = {
  'system_admin': [
    'system.manage', 'users.manage', 'companies.manage', 'properties.manage',
    'financials.manage', 'reports.view', 'settings.manage', 'audit.view',
    'security.manage', 'integrations.manage', 'analytics.view'
  ],
  'company_admin': [
    'company.manage', 'users.manage', 'properties.manage', 'financials.manage',
    'reports.view', 'settings.manage', 'tenants.manage', 'maintenance.manage',
    'tasks.manage', 'communications.manage', 'documents.manage'
  ],
  'company_owner': [
    'company.view', 'properties.view', 'financials.view', 'reports.view',
    'users.view', 'tenants.view', 'maintenance.view', 'analytics.view',
    'settings.view', 'communications.view'
  ],
  'portfolio_manager': [
    'properties.manage', 'tenants.manage', 'maintenance.manage', 'financials.view',
    'reports.view', 'tasks.manage', 'communications.manage', 'analytics.view',
    'inspections.manage', 'leasing.manage'
  ],
  'property_manager': [
    'property.manage', 'tenants.manage', 'maintenance.manage', 'tasks.manage',
    'communications.manage', 'reports.view', 'financials.view', 'leasing.manage',
    'inspections.manage', 'documents.manage'
  ],
  'leasing_specialist': [
    'tenants.manage', 'applications.manage', 'showings.manage', 'marketing.manage',
    'communications.manage', 'reports.view', 'leasing.manage', 'documents.view'
  ],
  'maintenance_supervisor': [
    'maintenance.manage', 'vendors.manage', 'work_orders.manage', 'inspections.manage',
    'inventory.manage', 'reports.view', 'tasks.manage', 'communications.manage'
  ],
  'marketing_specialist': [
    'marketing.manage', 'listings.manage', 'communications.manage', 'analytics.view',
    'reports.view', 'media.manage', 'social_media.manage', 'campaigns.manage'
  ],
  'financial_controller': [
    'financials.manage', 'payments.manage', 'invoices.manage', 'reports.manage',
    'budgets.manage', 'accounting.manage', 'analytics.view', 'audits.view'
  ],
  'landlord': [
    'property.view', 'tenants.view', 'maintenance.view', 'financials.view',
    'reports.view', 'communications.view', 'tasks.view', 'documents.view'
  ],
  'tenant': [
    'profile.manage', 'payments.view', 'maintenance.create', 'communications.view',
    'documents.view', 'lease.view', 'requests.create', 'notifications.view'
  ],
  'vendor': [
    'profile.manage', 'work_orders.view', 'invoices.manage', 'communications.view',
    'schedule.manage', 'reports.view', 'documents.view', 'payments.view'
  ],
  'inspector': [
    'inspections.manage', 'reports.create', 'properties.view', 'maintenance.view',
    'communications.view', 'documents.manage', 'tasks.view', 'schedule.manage'
  ],
  'accountant': [
    'financials.view', 'reports.view', 'invoices.view', 'payments.view',
    'budgets.view', 'accounting.manage', 'analytics.view', 'audits.view'
  ]
};

const PERMISSION_HIERARCHY = {
  'manage': ['create', 'read', 'update', 'delete', 'view'],
  'create': ['read', 'view'],
  'update': ['read', 'view'],
  'delete': ['read', 'view'],
  'read': ['view'],
  'view': []
};

const RESOURCE_PERMISSIONS = {
  system: ['manage', 'view'],
  company: ['manage', 'view', 'create', 'update', 'delete'],
  users: ['manage', 'view', 'create', 'update', 'delete', 'invite'],
  properties: ['manage', 'view', 'create', 'update', 'delete'],
  tenants: ['manage', 'view', 'create', 'update', 'delete'],
  maintenance: ['manage', 'view', 'create', 'update', 'delete'],
  financials: ['manage', 'view', 'create', 'update', 'delete'],
  reports: ['manage', 'view', 'create', 'export'],
  tasks: ['manage', 'view', 'create', 'update', 'delete', 'assign'],
  communications: ['manage', 'view', 'create', 'send'],
  documents: ['manage', 'view', 'create', 'update', 'delete', 'download'],
  settings: ['manage', 'view', 'update'],
  analytics: ['view', 'export'],
  audit: ['view', 'export']
};

const initialState = {
  permissions: [],
  rolePermissions: [],
  customPermissions: [],
  resourceAccess: {},
  loading: false,
  error: null,
  permissionCache: {},
  lastUpdated: null,
  contextualPermissions: {},
  temporaryPermissions: {},
  permissionRequests: []
};

const permissionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_PERMISSIONS':
      return {
        ...state,
        permissions: action.payload.permissions,
        rolePermissions: action.payload.rolePermissions,
        customPermissions: action.payload.customPermissions,
        resourceAccess: action.payload.resourceAccess,
        lastUpdated: Date.now(),
        loading: false,
        error: null
      };
    
    case 'UPDATE_CUSTOM_PERMISSIONS':
      return {
        ...state,
        customPermissions: action.payload,
        permissions: [...state.rolePermissions, ...action.payload],
        lastUpdated: Date.now()
      };
    
    case 'SET_CONTEXTUAL_PERMISSIONS':
      return {
        ...state,
        contextualPermissions: {
          ...state.contextualPermissions,
          [action.payload.context]: action.payload.permissions
        }
      };
    
    case 'SET_TEMPORARY_PERMISSIONS':
      return {
        ...state,
        temporaryPermissions: {
          ...state.temporaryPermissions,
          [action.payload.key]: {
            permissions: action.payload.permissions,
            expiresAt: action.payload.expiresAt
          }
        }
      };
    
    case 'CLEAR_TEMPORARY_PERMISSIONS':
      const newTempPermissions = { ...state.temporaryPermissions };
      delete newTempPermissions[action.payload];
      return {
        ...state,
        temporaryPermissions: newTempPermissions
      };
    
    case 'CACHE_PERMISSION_CHECK':
      return {
        ...state,
        permissionCache: {
          ...state.permissionCache,
          [action.payload.key]: {
            result: action.payload.result,
            timestamp: Date.now()
          }
        }
      };
    
    case 'CLEAR_PERMISSION_CACHE':
      return {
        ...state,
        permissionCache: {}
      };
    
    case 'ADD_PERMISSION_REQUEST':
      return {
        ...state,
        permissionRequests: [...state.permissionRequests, action.payload]
      };
    
    case 'REMOVE_PERMISSION_REQUEST':
      return {
        ...state,
        permissionRequests: state.permissionRequests.filter(req => req.id !== action.payload)
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
};

export const PermissionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(permissionReducer, initialState);
  const { user, isAuthenticated, apiCall } = useAuth();

  const loadPermissions = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
      const customPermissions = user.customPermissions || [];
      const allPermissions = [...rolePermissions, ...customPermissions];

      // Build resource access map
      const resourceAccess = {};
      Object.keys(RESOURCE_PERMISSIONS).forEach(resource => {
        resourceAccess[resource] = {};
        RESOURCE_PERMISSIONS[resource].forEach(action => {
          const permission = `${resource}.${action}`;
          resourceAccess[resource][action] = allPermissions.includes(permission);
        });
      });

      dispatch({
        type: 'SET_PERMISSIONS',
        payload: {
          permissions: allPermissions,
          rolePermissions,
          customPermissions,
          resourceAccess
        }
      });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, [isAuthenticated, user]);

  const hasPermission = useCallback((permission, context = null) => {
    if (!isAuthenticated || !user) return false;
    
    // System admin has all permissions
    if (user.role === 'system_admin') return true;

    // Check cache first
    const cacheKey = `${permission}_${context || 'global'}`;
    const cached = state.permissionCache[cacheKey];
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes cache
      return cached.result;
    }

    let hasAccess = false;

    // Check base permissions
    if (state.permissions.includes(permission)) {
      hasAccess = true;
    }

    // Check hierarchical permissions
    if (!hasAccess) {
      const [resource, action] = permission.split('.');
      if (resource && action && PERMISSION_HIERARCHY[action]) {
        const higherPermissions = PERMISSION_HIERARCHY[action];
        hasAccess = higherPermissions.some(higherAction => 
          state.permissions.includes(`${resource}.${higherAction}`)
        );
      }
    }

    // Check contextual permissions
    if (!hasAccess && context && state.contextualPermissions[context]) {
      hasAccess = state.contextualPermissions[context].includes(permission);
    }

    // Check temporary permissions
    if (!hasAccess) {
      Object.values(state.temporaryPermissions).forEach(temp => {
        if (temp.expiresAt > Date.now() && temp.permissions.includes(permission)) {
          hasAccess = true;
        }
      });
    }

    // Cache result
    dispatch({
      type: 'CACHE_PERMISSION_CHECK',
      payload: { key: cacheKey, result: hasAccess }
    });

    return hasAccess;
  }, [isAuthenticated, user, state.permissions, state.contextualPermissions, state.temporaryPermissions, state.permissionCache]);

  const hasAnyPermission = useCallback((permissions, context = null) => {
    return permissions.some(permission => hasPermission(permission, context));
  }, [hasPermission]);

  const hasAllPermissions = useCallback((permissions, context = null) => {
    return permissions.every(permission => hasPermission(permission, context));
  }, [hasPermission]);

  const hasRole = useCallback((role) => {
    return isAuthenticated && user?.role === role;
  }, [isAuthenticated, user]);

  const hasAnyRole = useCallback((roles) => {
    return isAuthenticated && roles.includes(user?.role);
  }, [isAuthenticated, user]);

  const canAccess = useCallback((resource, action = 'view', context = null) => {
    const permission = `${resource}.${action}`;
    return hasPermission(permission, context);
  }, [hasPermission]);

  const canManage = useCallback((resource, context = null) => {
    return canAccess(resource, 'manage', context);
  }, [canAccess]);

  const canView = useCallback((resource, context = null) => {
    return canAccess(resource, 'view', context) || canAccess(resource, 'manage', context);
  }, [canAccess]);

  const canCreate = useCallback((resource, context = null) => {
    return canAccess(resource, 'create', context) || canAccess(resource, 'manage', context);
  }, [canAccess]);

  const canUpdate = useCallback((resource, context = null) => {
    return canAccess(resource, 'update', context) || canAccess(resource, 'manage', context);
  }, [canAccess]);

  const canDelete = useCallback((resource, context = null) => {
    return canAccess(resource, 'delete', context) || canAccess(resource, 'manage', context);
  }, [canAccess]);

  const getResourcePermissions = useCallback((resource) => {
    return state.resourceAccess[resource] || {};
  }, [state.resourceAccess]);

  const getPermissionLevel = useCallback((resource, context = null) => {
    if (canManage(resource, context)) return 'manage';
    if (canUpdate(resource, context)) return 'update';
    if (canCreate(resource, context)) return 'create';
    if (canView(resource, context)) return 'view';
    return 'none';
  }, [canManage, canUpdate, canCreate, canView]);

  const requestPermission = useCallback(async (permission, reason, duration = null) => {
    const request = {
      id: Date.now().toString(),
      permission,
      reason,
      duration,
      requestedBy: user?.id,
      requestedAt: Date.now(),
      status: 'pending'
    };

    dispatch({ type: 'ADD_PERMISSION_REQUEST', payload: request });

    try {
      await apiCall('/permissions/request', {
        method: 'POST',
        body: JSON.stringify(request)
      });
      return { success: true, requestId: request.id };
    } catch (err) {
      dispatch({ type: 'REMOVE_PERMISSION_REQUEST', payload: request.id });
      return { success: false, error: err.message };
    }
  }, [user, apiCall]);

  const grantTemporaryPermission = useCallback((permissions, duration = 3600000) => { // 1 hour default
    const key = Date.now().toString();
    const expiresAt = Date.now() + duration;

    dispatch({
      type: 'SET_TEMPORARY_PERMISSIONS',
      payload: { key, permissions, expiresAt }
    });

    // Auto-cleanup
    setTimeout(() => {
      dispatch({ type: 'CLEAR_TEMPORARY_PERMISSIONS', payload: key });
    }, duration);

    return key;
  }, []);

  const setContextualPermissions = useCallback((context, permissions) => {
    dispatch({
      type: 'SET_CONTEXTUAL_PERMISSIONS',
      payload: { context, permissions }
    });
  }, []);

  const clearContextualPermissions = useCallback((context) => {
    dispatch({
      type: 'SET_CONTEXTUAL_PERMISSIONS',
      payload: { context, permissions: [] }
    });
  }, []);

  const validateResourceAccess = useCallback((resourceId, resourceType, action = 'view') => {
    // Check if user owns the resource
    if (user?.ownedResources?.[resourceType]?.includes(resourceId)) {
      return true;
    }

    // Check if user is assigned to the resource
    if (user?.assignedResources?.[resourceType]?.includes(resourceId)) {
      return canAccess(resourceType, action);
    }

    // Check company-level access
    if (user?.companyId && canAccess(resourceType, action)) {
      return true;
    }

    return false;
  }, [user, canAccess]);

  const getAccessibleResources = useCallback((resourceType) => {
    if (canManage(resourceType)) return 'all';
    
    const owned = user?.ownedResources?.[resourceType] || [];
    const assigned = user?.assignedResources?.[resourceType] || [];
    
    return [...owned, ...assigned];
  }, [user, canManage]);

  const getRoleHierarchy = useCallback(() => {
    const hierarchy = {
      system_admin: 100,
      company_admin: 90,
      company_owner: 85,
      portfolio_manager: 80,
      property_manager: 70,
      leasing_specialist: 60,
      maintenance_supervisor: 60,
      marketing_specialist: 60,
      financial_controller: 65,
      landlord: 50,
      tenant: 20,
      vendor: 30,
      inspector: 40,
      accountant: 55
    };
    
    return hierarchy[user?.role] || 0;
  }, [user]);

  const canManageUser = useCallback((targetUser) => {
    if (!hasPermission('users.manage')) return false;
    
    const currentUserLevel = getRoleHierarchy();
    const targetUserLevel = getRoleHierarchy(targetUser?.role);
    
    return currentUserLevel > targetUserLevel;
  }, [hasPermission, getRoleHierarchy]);

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
      tasks: canView('tasks'),
      analytics: canView('analytics'),
      audit: canView('audit')
    };
  }, [canView]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const clearCache = useCallback(() => {
    dispatch({ type: 'CLEAR_PERMISSION_CACHE' });
  }, []);

  // Cleanup expired temporary permissions
  useEffect(() => {
    const cleanup = setInterval(() => {
      Object.entries(state.temporaryPermissions).forEach(([key, temp]) => {
        if (temp.expiresAt <= Date.now()) {
          dispatch({ type: 'CLEAR_TEMPORARY_PERMISSIONS', payload: key });
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(cleanup);
  }, [state.temporaryPermissions]);

  // Load permissions when user changes
  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  // Clear cache when permissions change
  useEffect(() => {
    clearCache();
  }, [state.permissions, clearCache]);

  const value = useMemo(() => ({
    ...state,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    canAccess,
    canManage,
    canView,
    canCreate,
    canUpdate,
    canDelete,
    getResourcePermissions,
    getPermissionLevel,
    requestPermission,
    grantTemporaryPermission,
    setContextualPermissions,
    clearContextualPermissions,
    validateResourceAccess,
    getAccessibleResources,
    getRoleHierarchy,
    canManageUser,
    getMenuPermissions,
    clearError,
    clearCache,
    loadPermissions
  }), [
    state,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    canAccess,
    canManage,
    canView,
    canCreate,
    canUpdate,
    canDelete,
    getResourcePermissions,
    getPermissionLevel,
    requestPermission,
    grantTemporaryPermission,
    setContextualPermissions,
    clearContextualPermissions,
    validateResourceAccess,
    getAccessibleResources,
    getRoleHierarchy,
    canManageUser,
    getMenuPermissions,
    clearError,
    clearCache,
    loadPermissions
  ]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

export default PermissionContext;