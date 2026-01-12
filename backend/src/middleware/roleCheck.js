const { Role, Permission } = require('../models');

/**
 * Check if user has required role
 */
const hasRole = (...requiredRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userRoles = req.user.Roles?.map(role => role.name) || [];
      
      // Check if user has any of the required roles
      const hasRequiredRole = requiredRoles.some(role => 
        userRoles.includes(role)
      );

      if (!hasRequiredRole) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role(s): ${requiredRoles.join(', ')}`
        });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during role validation'
      });
    }
  };
};

/**
 * Check if user has specific permission
 */
const hasPermission = (resource, action) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Check cached permissions from auth middleware
      if (req.permissions && req.permissions.has(`${resource}:${action}`)) {
        return next();
      }

      // Fallback: check database
      const userRoles = req.user.Roles || [];
      let hasPerm = false;

      // Check each role for the permission
      for (const role of userRoles) {
        const permissions = role.Permissions || [];
        const found = permissions.find(p => 
          p.resource === resource && p.action === action
        );
        
        if (found) {
          hasPerm = true;
          break;
        }
      }

      if (!hasPerm) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required permission: ${action} on ${resource}`
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during permission validation'
      });
    }
  };
};

/**
 * Check if user owns the resource (owner-based permission)
 */
const isOwner = (modelName, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const Model = require(`../models/${modelName}`);
      const resourceId = req.params[paramName];
      
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: 'Resource ID is required'
        });
      }

      // Find resource
      const resource = await Model.findByPk(resourceId);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      // Check ownership based on model
      let isOwner = false;
      
      switch (modelName) {
        case 'Property':
          isOwner = resource.landlordId === req.user.id || 
                   resource.ownerId === req.user.id;
          break;
          
        case 'Unit':
          // Check if user owns the property that contains this unit
          const property = await resource.getProperty();
          isOwner = property.landlordId === req.user.id;
          break;
          
        case 'Tenant':
          // Check if user is the tenant or owns the property
          const tenantUnit = await resource.getUnit();
          const tenantProperty = await tenantUnit.getProperty();
          isOwner = resource.userId === req.user.id || 
                   tenantProperty.landlordId === req.user.id;
          break;
          
        case 'Company':
          isOwner = resource.ownerId === req.user.id;
          break;
          
        case 'Portfolio':
          const company = await resource.getCompany();
          isOwner = company.ownerId === req.user.id;
          break;
          
        default:
          // Default check for userId field
          if (resource.userId) {
            isOwner = resource.userId === req.user.id;
          } else if (resource.createdBy) {
            isOwner = resource.createdBy === req.user.id;
          }
      }

      // If user is admin, bypass ownership check
      const userRoles = req.user.Roles?.map(role => role.name) || [];
      const isAdmin = userRoles.includes('system_admin') || 
                     userRoles.includes('company_admin');

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You do not own this resource.'
        });
      }

      // Attach resource to request for later use
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during ownership validation'
      });
    }
  };
};

/**
 * Check if user can manage specific property
 */
const canManageProperty = (paramName = 'propertyId') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const propertyId = req.params[paramName] || req.body.propertyId;
      
      if (!propertyId) {
        return res.status(400).json({
          success: false,
          message: 'Property ID is required'
        });
      }

      const { Property, Portfolio, Company } = require('../models');
      
      // Find property with relationships
      const property = await Property.findByPk(propertyId, {
        include: [
          {
            model: Portfolio,
            include: [Company]
          }
        ]
      });

      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Property not found'
        });
      }

      const userRoles = req.user.Roles?.map(role => role.name) || [];
      let canManage = false;

      // Check different access levels
      if (userRoles.includes('system_admin')) {
        canManage = true; // System admin can manage everything
      } 
      else if (userRoles.includes('company_admin')) {
        // Company admin can manage properties in their company
        if (property.Portfolio?.Company) {
          canManage = property.Portfolio.Company.ownerId === req.user.id;
        }
      }
      else if (userRoles.includes('portfolio_manager')) {
        // Portfolio manager can manage properties in their portfolio
        if (property.Portfolio) {
          // Check if user is assigned to this portfolio
          const userPortfolios = await req.user.getPortfolios();
          canManage = userPortfolios.some(p => p.id === property.Portfolio.id);
        }
      }
      else if (userRoles.includes('property_manager')) {
        // Property manager can manage assigned properties
        const managedProperties = await req.user.getManagedProperties();
        canManage = managedProperties.some(p => p.id === property.id);
      }
      else if (userRoles.includes('landlord')) {
        // Landlord can manage their own properties
        canManage = property.landlordId === req.user.id;
      }

      if (!canManage) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You cannot manage this property.'
        });
      }

      req.property = property;
      next();
    } catch (error) {
      console.error('Property management check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during property access validation'
      });
    }
  };
};

/**
 * Check if user can invite others with specific roles
 */
const canInviteRole = (...allowedRolesToInvite) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { roleId } = req.body;
      
      if (!roleId) {
        return next(); // No role specified, let validation handle it
      }

      // Get the role being invited
      const role = await Role.findByPk(roleId);
      
      if (!role) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role specified'
        });
      }

      const userRoles = req.user.Roles?.map(r => r.name) || [];
      const invitingRoleName = role.name;

      // Check hierarchy
      const roleHierarchy = {
        'system_admin': ['system_admin', 'company_admin', 'portfolio_manager', 'property_manager', 'landlord', 'tenant', 'maintenance', 'leasing_agent'],
        'company_admin': ['company_admin', 'portfolio_manager', 'property_manager', 'landlord', 'tenant', 'maintenance', 'leasing_agent'],
        'portfolio_manager': ['portfolio_manager', 'property_manager', 'maintenance', 'leasing_agent'],
        'property_manager': ['property_manager', 'maintenance', 'leasing_agent'],
        'landlord': ['tenant', 'maintenance'],
        'tenant': [] // Tenants cannot invite anyone
      };

      // Find the highest role of the inviting user
      let canInvite = false;
      
      for (const userRole of userRoles) {
        if (roleHierarchy[userRole] && 
            roleHierarchy[userRole].includes(invitingRoleName)) {
          canInvite = true;
          break;
        }
      }

      // Also check specific allowed roles if provided
      if (allowedRolesToInvite.length > 0) {
        canInvite = canInvite && allowedRolesToInvite.includes(invitingRoleName);
      }

      if (!canInvite) {
        return res.status(403).json({
          success: false,
          message: `You are not authorized to invite users with role: ${invitingRoleName}`
        });
      }

      next();
    } catch (error) {
      console.error('Role invitation check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during invitation validation'
      });
    }
  };
};

/**
 * Check if user can assign tasks to specific users
 */
const canAssignTo = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { assignedTo } = req.body;
    
    if (!assignedTo) {
      return next(); // No assignment, skip check
    }

    const { User } = require('../models');
    const assignee = await User.findByPk(assignedTo, {
      include: [Role]
    });

    if (!assignee) {
      return res.status(400).json({
        success: false,
        message: 'Assignee not found'
      });
    }

    const userRoles = req.user.Roles?.map(r => r.name) || [];
    const assigneeRoles = assignee.Roles?.map(r => r.name) || [];

    // Only higher or equal roles can assign to lower roles
    const rolePriority = {
      'system_admin': 100,
      'company_admin': 90,
      'portfolio_manager': 80,
      'property_manager': 70,
      'landlord': 60,
      'leasing_agent': 50,
      'maintenance': 40,
      'tenant': 10
    };

    const userMaxPriority = Math.max(...userRoles.map(r => rolePriority[r] || 0));
    const assigneeMaxPriority = Math.max(...assigneeRoles.map(r => rolePriority[r] || 0));

    if (userMaxPriority < assigneeMaxPriority) {
      return res.status(403).json({
        success: false,
        message: 'You cannot assign tasks to users with higher authority'
      });
    }

    next();
  } catch (error) {
    console.error('Assignment check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during assignment validation'
    });
  }
};

/**
 * Check if user can view sensitive data
 */
const canViewSensitiveData = (dataType) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userRoles = req.user.Roles?.map(role => role.name) || [];
      
      // Define who can view what
      const viewPermissions = {
        'financial': ['system_admin', 'company_admin', 'portfolio_manager', 'property_manager', 'landlord'],
        'personal': ['system_admin', 'company_admin', 'portfolio_manager', 'property_manager'],
        'sensitive': ['system_admin', 'company_admin'],
        'audit': ['system_admin'],
        'system': ['system_admin']
      };

      const allowedRoles = viewPermissions[dataType] || [];
      const canView = userRoles.some(role => allowedRoles.includes(role));

      if (!canView) {
        return res.status(403).json({
          success: false,
          message: `Access denied. You cannot view ${dataType} data.`
        });
      }

      next();
    } catch (error) {
      console.error('Sensitive data check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during data access validation'
      });
    }
  };
};

/**
 * Combine multiple checks
 */
const combineChecks = (...checks) => {
  return async (req, res, next) => {
    try {
      for (const check of checks) {
        await new Promise((resolve, reject) => {
          check(req, res, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
      next();
    } catch (error) {
      // Error already handled by individual checks
      return;
    }
  };
};

module.exports = {
  hasRole,
  hasPermission,
  isOwner,
  canManageProperty,
  canInviteRole,
  canAssignTo,
  canViewSensitiveData,
  combineChecks
};