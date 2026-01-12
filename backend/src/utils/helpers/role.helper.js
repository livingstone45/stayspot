const { UserRole, Permission, RoleHierarchy } = require('../constants/roles');

class RoleHelper {
  /**
   * Check if user has required role
   * @param {Object} user - User object
   * @param {string} requiredRole - Required role
   * @returns {boolean} True if user has required role
   */
  static hasRole(user, requiredRole) {
    if (!user || !user.role) return false;
    
    // System admin has all roles
    if (user.role.name === UserRole.SYSTEM_ADMIN) {
      return true;
    }
    
    // Check if user's role matches or is higher in hierarchy
    const userRoleLevel = RoleHierarchy[user.role.name];
    const requiredRoleLevel = RoleHierarchy[requiredRole];
    
    if (userRoleLevel === undefined || requiredRoleLevel === undefined) {
      return false;
    }
    
    // Higher number = higher privilege in our hierarchy
    return userRoleLevel >= requiredRoleLevel;
  }

  /**
   * Check if user has any of the required roles
   * @param {Object} user - User object
   * @param {Array} requiredRoles - Array of required roles
   * @returns {boolean} True if user has any of the required roles
   */
  static hasAnyRole(user, requiredRoles) {
    if (!user || !user.role) return false;
    
    // System admin has all roles
    if (user.role.name === UserRole.SYSTEM_ADMIN) {
      return true;
    }
    
    return requiredRoles.some(role => this.hasRole(user, role));
  }

  /**
   * Check if user has permission
   * @param {Object} user - User object
   * @param {string} permission - Required permission
   * @returns {boolean} True if user has permission
   */
  static hasPermission(user, permission) {
    if (!user || !user.role || !user.role.permissions) return false;
    
    // System admin has all permissions
    if (user.role.name === UserRole.SYSTEM_ADMIN) {
      return true;
    }
    
    return user.role.permissions.some(perm => 
      perm.name === permission || perm.name === Permission.ALL
    );
  }

  /**
   * Check if user has any of the required permissions
   * @param {Object} user - User object
   * @param {Array} permissions - Array of required permissions
   * @returns {boolean} True if user has any of the permissions
   */
  static hasAnyPermission(user, permissions) {
    if (!user || !user.role || !user.role.permissions) return false;
    
    // System admin has all permissions
    if (user.role.name === UserRole.SYSTEM_ADMIN) {
      return true;
    }
    
    return permissions.some(permission => 
      this.hasPermission(user, permission)
    );
  }

  /**
   * Check if user has all required permissions
   * @param {Object} user - User object
   * @param {Array} permissions - Array of required permissions
   * @returns {boolean} True if user has all permissions
   */
  static hasAllPermissions(user, permissions) {
    if (!user || !user.role || !user.role.permissions) return false;
    
    // System admin has all permissions
    if (user.role.name === UserRole.SYSTEM_ADMIN) {
      return true;
    }
    
    return permissions.every(permission => 
      this.hasPermission(user, permission)
    );
  }

  /**
   * Get user's accessible property IDs based on role
   * @param {Object} user - User object
   * @param {Array} userProperties - User's assigned properties
   * @returns {Array|string} Array of property IDs or 'all' for full access
   */
  static getAccessiblePropertyIds(user, userProperties = []) {
    if (!user || !user.role) return [];
    
    switch (user.role.name) {
      case UserRole.SYSTEM_ADMIN:
        return 'all'; // Can access all properties
      
      case UserRole.COMPANY_ADMIN:
        // Company admin can access all properties in their company
        if (user.companyId) {
          return { companyId: user.companyId };
        }
        return [];
      
      case UserRole.PORTFOLIO_MANAGER:
        // Portfolio manager can access properties in their portfolio
        if (user.portfolioId) {
          return { portfolioId: user.portfolioId };
        }
        return userProperties;
      
      case UserRole.PROPERTY_MANAGER:
        // Property manager can access their assigned properties
        return userProperties;
      
      case UserRole.LANDLORD:
        // Landlord can access their own properties
        return { ownerId: user.id };
      
      default:
        return userProperties;
    }
  }

  /**
   * Check if user can access a specific property
   * @param {Object} user - User object
   * @param {number} propertyId - Property ID to check
   * @param {Object} property - Property object (optional)
   * @returns {boolean} True if user can access the property
   */
  static canAccessProperty(user, propertyId, property = null) {
    if (!user || !user.role) return false;
    
    // System admin can access all properties
    if (user.role.name === UserRole.SYSTEM_ADMIN) {
      return true;
    }
    
    // If property object is provided, check ownership/assignment directly
    if (property) {
      switch (user.role.name) {
        case UserRole.COMPANY_ADMIN:
          return property.companyId === user.companyId;
        
        case UserRole.PORTFOLIO_MANAGER:
          return property.portfolioId === user.portfolioId;
        
        case UserRole.PROPERTY_MANAGER:
          return property.managerId === user.id || 
                 (user.managedProperties && user.managedProperties.includes(propertyId));
        
        case UserRole.LANDLORD:
          return property.ownerId === user.id;
        
        default:
          return false;
      }
    }
    
    // Fallback to basic check
    return this.hasRole(user, UserRole.PROPERTY_MANAGER) || 
           this.hasRole(user, UserRole.PORTFOLIO_MANAGER) ||
           this.hasRole(user, UserRole.COMPANY_ADMIN);
  }

  /**
   * Check if user can perform action on another user
   * @param {Object} currentUser - Current user object
   * @param {Object} targetUser - Target user object
   * @param {string} action - Action to perform
   * @returns {boolean} True if allowed
   */
  static canManageUser(currentUser, targetUser, action = 'view') {
    if (!currentUser || !currentUser.role) return false;
    
    // Users can always view/manage themselves
    if (currentUser.id === targetUser.id) {
      return action === 'view' || action === 'edit';
    }
    
    // System admin can manage all users
    if (currentUser.role.name === UserRole.SYSTEM_ADMIN) {
      return true;
    }
    
    // Check hierarchy
    const currentRoleLevel = RoleHierarchy[currentUser.role.name];
    const targetRoleLevel = RoleHierarchy[targetUser.role.name];
    
    if (currentRoleLevel === undefined || targetRoleLevel === undefined) {
      return false;
    }
    
    // Users can only manage users with lower role level
    if (currentRoleLevel <= targetRoleLevel) {
      return false;
    }
    
    // Company admin can only manage users in their company
    if (currentUser.role.name === UserRole.COMPANY_ADMIN) {
      return currentUser.companyId === targetUser.companyId;
    }
    
    // Portfolio manager can only manage users in their portfolio
    if (currentUser.role.name === UserRole.PORTFOLIO_MANAGER) {
      return currentUser.portfolioId === targetUser.portfolioId;
    }
    
    return false;
  }

  /**
   * Get user's dashboard route based on role
   * @param {Object} user - User object
   * @returns {string} Dashboard route
   */
  static getDashboardRoute(user) {
    if (!user || !user.role) return '/login';
    
    switch (user.role.name) {
      case UserRole.SYSTEM_ADMIN:
        return '/system-admin/dashboard';
      
      case UserRole.COMPANY_ADMIN:
        return '/company/dashboard';
      
      case UserRole.PORTFOLIO_MANAGER:
      case UserRole.PROPERTY_MANAGER:
        return '/management/dashboard';
      
      case UserRole.LANDLORD:
        return '/landlord/dashboard';
      
      case UserRole.TENANT:
        return '/tenant/dashboard';
      
      default:
        return '/dashboard';
    }
  }

  /**
   * Get allowed roles for user to assign
   * @param {Object} user - User object
   * @returns {Array} Array of allowed role names
   */
  static getAllowedRolesToAssign(user) {
    if (!user || !user.role) return [];
    
    const allRoles = Object.values(UserRole);
    const userRoleLevel = RoleHierarchy[user.role.name];
    
    if (userRoleLevel === undefined) return [];
    
    // Filter roles that are lower in hierarchy
    return allRoles.filter(role => {
      const roleLevel = RoleHierarchy[role];
      return roleLevel !== undefined && roleLevel > userRoleLevel;
    });
  }

  /**
   * Check if user can invite other users
   * @param {Object} user - User object
   * @returns {boolean} True if user can invite
   */
  static canInviteUsers(user) {
    if (!user || !user.role) return false;
    
    const allowedRoles = [
      UserRole.SYSTEM_ADMIN,
      UserRole.COMPANY_ADMIN,
      UserRole.PORTFOLIO_MANAGER
    ];
    
    return allowedRoles.includes(user.role.name);
  }

  /**
   * Check if user can upload properties
   * @param {Object} user - User object
   * @returns {boolean} True if user can upload
   */
  static canUploadProperties(user) {
    if (!user || !user.role) return false;
    
    const allowedRoles = [
      UserRole.SYSTEM_ADMIN,
      UserRole.COMPANY_ADMIN,
      UserRole.PORTFOLIO_MANAGER,
      UserRole.PROPERTY_MANAGER
    ];
    
    return allowedRoles.includes(user.role.name);
  }

  /**
   * Check if user can approve properties
   * @param {Object} user - User object
   * @returns {boolean} True if user can approve
   */
  static canApproveProperties(user) {
    if (!user || !user.role) return false;
    
    const allowedRoles = [
      UserRole.SYSTEM_ADMIN,
      UserRole.COMPANY_ADMIN,
      UserRole.PORTFOLIO_MANAGER
    ];
    
    return allowedRoles.includes(user.role.name);
  }

  /**
   * Get user's role display name
   * @param {string} roleName - Role name
   * @returns {string} Display name
   */
  static getRoleDisplayName(roleName) {
    const displayNames = {
      [UserRole.SYSTEM_ADMIN]: 'System Administrator',
      [UserRole.COMPANY_ADMIN]: 'Company Administrator',
      [UserRole.PORTFOLIO_MANAGER]: 'Portfolio Manager',
      [UserRole.PROPERTY_MANAGER]: 'Property Manager',
      [UserRole.LEASING_SPECIALIST]: 'Leasing Specialist',
      [UserRole.MAINTENANCE_SUPERVISOR]: 'Maintenance Supervisor',
      [UserRole.MAINTENANCE_TECHNICIAN]: 'Maintenance Technician',
      [UserRole.VENDOR_COORDINATOR]: 'Vendor Coordinator',
      [UserRole.MARKETING_SPECIALIST]: 'Marketing Specialist',
      [UserRole.FINANCIAL_CONTROLLER]: 'Financial Controller',
      [UserRole.ACCOUNTANT]: 'Accountant',
      [UserRole.COMPLIANCE_OFFICER]: 'Compliance Officer',
      [UserRole.DATA_ANALYST]: 'Data Analyst',
      [UserRole.LANDLORD]: 'Property Owner',
      [UserRole.TENANT]: 'Tenant'
    };
    
    return displayNames[roleName] || roleName;
  }

  /**
   * Get role icon based on role name
   * @param {string} roleName - Role name
   * @returns {string} Icon name/class
   */
  static getRoleIcon(roleName) {
    const icons = {
      [UserRole.SYSTEM_ADMIN]: 'fa-user-shield',
      [UserRole.COMPANY_ADMIN]: 'fa-building',
      [UserRole.PORTFOLIO_MANAGER]: 'fa-briefcase',
      [UserRole.PROPERTY_MANAGER]: 'fa-home',
      [UserRole.LEASING_SPECIALIST]: 'fa-file-contract',
      [UserRole.MAINTENANCE_SUPERVISOR]: 'fa-tools',
      [UserRole.MAINTENANCE_TECHNICIAN]: 'fa-wrench',
      [UserRole.VENDOR_COORDINATOR]: 'fa-handshake',
      [UserRole.MARKETING_SPECIALIST]: 'fa-bullhorn',
      [UserRole.FINANCIAL_CONTROLLER]: 'fa-chart-line',
      [UserRole.ACCOUNTANT]: 'fa-calculator',
      [UserRole.COMPLIANCE_OFFICER]: 'fa-gavel',
      [UserRole.DATA_ANALYST]: 'fa-chart-bar',
      [UserRole.LANDLORD]: 'fa-user-tie',
      [UserRole.TENANT]: 'fa-user'
    };
    
    return icons[roleName] || 'fa-user';
  }

  /**
   * Validate role transition (prevent demoting higher roles)
   * @param {Object} currentUser - Current user making the change
   * @param {string} targetCurrentRole - Target user's current role
   * @param {string} targetNewRole - Target user's new role
   * @returns {boolean} True if transition is valid
   */
  static isValidRoleTransition(currentUser, targetCurrentRole, targetNewRole) {
    if (!currentUser || !currentUser.role) return false;
    
    // System admin can do anything
    if (currentUser.role.name === UserRole.SYSTEM_ADMIN) {
      return true;
    }
    
    const currentRoleLevel = RoleHierarchy[currentUser.role.name];
    const targetCurrentLevel = RoleHierarchy[targetCurrentRole];
    const targetNewLevel = RoleHierarchy[targetNewRole];
    
    if (currentRoleLevel === undefined || 
        targetCurrentLevel === undefined || 
        targetNewLevel === undefined) {
      return false;
    }
    
    // Cannot change roles of users with same or higher level
    if (targetCurrentLevel <= currentRoleLevel) {
      return false;
    }
    
    // Cannot assign role higher than or equal to current user's role
    if (targetNewLevel <= currentRoleLevel) {
      return false;
    }
    
    return true;
  }
}

module.exports = RoleHelper;