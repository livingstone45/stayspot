import { ROLES, ROLE_HIERARCHY } from '../constants/roles';
import { ALL_PERMISSIONS } from '../constants/permissions';

/**
 * Permission checking utilities
 */

export const hasPermission = (userPermissions, requiredPermission) => {
  if (!userPermissions || !requiredPermission) return false;
  
  // Check for wildcard permission
  if (userPermissions.includes('*')) return true;
  
  // Check exact permission
  if (userPermissions.includes(requiredPermission)) return true;
  
  // Check wildcard patterns (e.g., 'property.*' matches 'property.create')
  return userPermissions.some(permission => {
    if (permission.endsWith('.*')) {
      const prefix = permission.slice(0, -2);
      return requiredPermission.startsWith(prefix + '.');
    }
    return false;
  });
};

export const hasRole = (userRoles, requiredRole) => {
  if (!userRoles || !requiredRole) return false;
  
  const roleNames = Array.isArray(userRoles) 
    ? userRoles.map(role => typeof role === 'string' ? role : role.name)
    : [typeof userRoles === 'string' ? userRoles : userRoles.name];
    
  return roleNames.includes(requiredRole);
};

export const hasAnyRole = (userRoles, requiredRoles) => {
  if (!userRoles || !requiredRoles || requiredRoles.length === 0) return false;
  
  return requiredRoles.some(role => hasRole(userRoles, role));
};

export const hasHigherRole = (userRoles, targetRole) => {
  if (!userRoles || !targetRole) return false;
  
  const roleNames = Array.isArray(userRoles) 
    ? userRoles.map(role => typeof role === 'string' ? role : role.name)
    : [typeof userRoles === 'string' ? userRoles : userRoles.name];
    
  const userLevel = Math.min(...roleNames.map(role => ROLE_HIERARCHY[role] || 999));
  const targetLevel = ROLE_HIERARCHY[targetRole] || 999;
  
  return userLevel < targetLevel;
};

export const canManageUser = (currentUser, targetUser) => {
  if (!currentUser || !targetUser) return false;
  
  // System admin can manage anyone
  if (hasRole(currentUser.roles, ROLES.SYSTEM_ADMIN.name)) return true;
  
  // Company admin can manage users in their company
  if (hasRole(currentUser.roles, ROLES.COMPANY_ADMIN.name)) {
    return currentUser.companyId === targetUser.companyId;
  }
  
  // Users can only manage themselves
  return currentUser.id === targetUser.id;
};

export const canAccessProperty = (user, property) => {
  if (!user || !property) return false;
  
  // System admin can access all properties
  if (hasRole(user.roles, ROLES.SYSTEM_ADMIN.name)) return true;
  
  // Property owner can access their property
  if (property.ownerId === user.id) return true;
  
  // Property manager can access assigned properties
  if (property.managerId === user.id) return true;
  
  // Company members can access company properties
  if (user.companyId && property.companyId === user.companyId) return true;
  
  // Tenant can access their leased property
  if (hasRole(user.roles, ROLES.TENANT.name)) {
    return property.tenants?.some(tenant => tenant.userId === user.id);
  }
  
  return false;
};

export const canModifyProperty = (user, property) => {
  if (!user || !property) return false;
  
  // System admin can modify all properties
  if (hasRole(user.roles, ROLES.SYSTEM_ADMIN.name)) return true;
  
  // Property owner can modify their property
  if (property.ownerId === user.id) return true;
  
  // Property manager can modify assigned properties
  if (property.managerId === user.id) return true;
  
  // Company admin can modify company properties
  if (hasRole(user.roles, ROLES.COMPANY_ADMIN.name) && 
      user.companyId === property.companyId) return true;
  
  return false;
};

export const getAccessibleProperties = (user, properties) => {
  if (!user || !properties) return [];
  
  return properties.filter(property => canAccessProperty(user, property));
};

export const filterByPermission = (items, user, permissionCheck) => {
  if (!user || !items) return [];
  
  return items.filter(item => permissionCheck(user, item));
};

export const getUserPermissions = (user) => {
  if (!user || !user.roles) return [];
  
  const permissions = new Set();
  
  user.roles.forEach(role => {
    const roleData = Object.values(ROLES).find(r => r.name === role.name);
    if (roleData && roleData.permissions) {
      roleData.permissions.forEach(permission => permissions.add(permission));
    }
  });
  
  return Array.from(permissions);
};

export const getHighestRole = (userRoles) => {
  if (!userRoles || userRoles.length === 0) return null;
  
  const roleNames = userRoles.map(role => typeof role === 'string' ? role : role.name);
  
  return roleNames.reduce((highest, current) => {
    const currentLevel = ROLE_HIERARCHY[current] || 999;
    const highestLevel = ROLE_HIERARCHY[highest] || 999;
    return currentLevel < highestLevel ? current : highest;
  });
};