const { Op } = require('sequelize');
const { Role, Permission, User, AuditLog } = require('../../models');
const { ROLES, PERMISSIONS } = require('../../utils/constants/roles');
const { validateRole, validateRoleUpdate } = require('../../utils/validators/user.validator');

/**
 * Role Management Controller
 * Handles role CRUD operations and permission management
 */
class RoleController {
  /**
   * Get All Roles
   */
  async getAllRoles(req, res) {
    try {
      const { includePermissions = true, includeUsers = false } = req.query;
      const userRoles = req.user.roles;

      // Only system admin can see all roles
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to view roles' });
      }

      const include = [];

      if (includePermissions === 'true') {
        include.push({
          model: Permission,
          through: { attributes: [] },
          attributes: ['id', 'name', 'description', 'category']
        });
      }

      if (includeUsers === 'true') {
        include.push({
          model: User,
          through: { attributes: [] },
          attributes: ['id', 'email', 'firstName', 'lastName']
        });
      }

      const roles = await Role.findAll({
        include: include.length > 0 ? include : [],
        order: [['createdAt', 'ASC']]
      });

      res.json({
        success: true,
        data: roles
      });
    } catch (error) {
      console.error('Get all roles error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Role by ID
   */
  async getRoleById(req, res) {
    try {
      const { roleId } = req.params;
      const userRoles = req.user.roles;

      // Only system admin can view roles
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to view roles' });
      }

      const role = await Role.findByPk(roleId, {
        include: [
          {
            model: Permission,
            through: { attributes: [] },
            attributes: ['id', 'name', 'description', 'category']
          },
          {
            model: User,
            through: { attributes: [] },
            attributes: ['id', 'email', 'firstName', 'lastName', 'isActive']
          }
        ]
      });

      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }

      res.json({
        success: true,
        data: role
      });
    } catch (error) {
      console.error('Get role by ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Create Role
   */
  async createRole(req, res) {
    try {
      const { error } = validateRole(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const userRoles = req.user.roles;

      // Only system admin can create roles
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to create roles' });
      }

      const { name, description, permissions, isSystemRole = false } = req.body;

      // Check if role exists
      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole) {
        return res.status(409).json({ error: 'Role with this name already exists' });
      }

      // Create role
      const role = await Role.create({
        name,
        description,
        isSystemRole,
        isEditable: !isSystemRole // System roles are not editable
      });

      // Assign permissions if provided
      if (permissions && permissions.length > 0) {
        await role.setPermissions(permissions);
      }

      // Create audit log
      await AuditLog.create({
        userId: req.user.id,
        action: 'ROLE_CREATED',
        details: `Role created: ${name}`,
        ipAddress: req.ip,
        metadata: { 
          roleId: role.id, 
          permissions,
          isSystemRole 
        }
      });

      res.status(201).json({
        success: true,
        message: 'Role created successfully',
        data: {
          id: role.id,
          name: role.name,
          description: role.description,
          isSystemRole: role.isSystemRole,
          isEditable: role.isEditable
        }
      });
    } catch (error) {
      console.error('Create role error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update Role
   */
  async updateRole(req, res) {
    try {
      const { roleId } = req.params;
      const { error } = validateRoleUpdate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const userRoles = req.user.roles;

      // Only system admin can update roles
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to update roles' });
      }

      const role = await Role.findByPk(roleId);
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }

      // Check if role is editable
      if (!role.isEditable) {
        return res.status(400).json({ error: 'System roles cannot be modified' });
      }

      const { name, description, permissions } = req.body;

      // Check if name is being changed and if it conflicts
      if (name && name !== role.name) {
        const existingRole = await Role.findOne({ where: { name } });
        if (existingRole) {
          return res.status(409).json({ error: 'Role with this name already exists' });
        }
        role.name = name;
      }

      if (description !== undefined) role.description = description;

      await role.save();

      // Update permissions if provided
      if (permissions) {
        await role.setPermissions(permissions);
      }

      // Create audit log
      await AuditLog.create({
        userId: req.user.id,
        action: 'ROLE_UPDATED',
        details: `Role updated: ${role.name}`,
        ipAddress: req.ip,
        metadata: { 
          roleId: role.id, 
          changes: req.body 
        }
      });

      res.json({
        success: true,
        message: 'Role updated successfully',
        data: {
          id: role.id,
          name: role.name,
          description: role.description,
          isSystemRole: role.isSystemRole,
          isEditable: role.isEditable
        }
      });
    } catch (error) {
      console.error('Update role error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Delete Role
   */
  async deleteRole(req, res) {
    try {
      const { roleId } = req.params;
      const userRoles = req.user.roles;

      // Only system admin can delete roles
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to delete roles' });
      }

      const role = await Role.findByPk(roleId, {
        include: [{ model: User }]
      });

      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }

      // Check if role is system role
      if (role.isSystemRole) {
        return res.status(400).json({ error: 'System roles cannot be deleted' });
      }

      // Check if role has users assigned
      if (role.Users && role.Users.length > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete role with assigned users. Reassign users first.' 
        });
      }

      await role.destroy();

      // Create audit log
      await AuditLog.create({
        userId: req.user.id,
        action: 'ROLE_DELETED',
        details: `Role deleted: ${role.name}`,
        ipAddress: req.ip,
        metadata: { roleId: role.id }
      });

      res.json({
        success: true,
        message: 'Role deleted successfully'
      });
    } catch (error) {
      console.error('Delete role error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Role Permissions
   */
  async getRolePermissions(req, res) {
    try {
      const { roleId } = req.params;
      const userRoles = req.user.roles;

      // Only system admin can view role permissions
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to view role permissions' });
      }

      const role = await Role.findByPk(roleId, {
        include: [{
          model: Permission,
          through: { attributes: [] },
          attributes: ['id', 'name', 'description', 'category']
        }]
      });

      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }

      res.json({
        success: true,
        data: {
          role: {
            id: role.id,
            name: role.name,
            description: role.description
          },
          permissions: role.Permissions
        }
      });
    } catch (error) {
      console.error('Get role permissions error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update Role Permissions
   */
  async updateRolePermissions(req, res) {
    try {
      const { roleId } = req.params;
      const { permissions } = req.body;
      const userRoles = req.user.roles;

      if (!Array.isArray(permissions)) {
        return res.status(400).json({ error: 'Permissions array is required' });
      }

      // Only system admin can update role permissions
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to update role permissions' });
      }

      const role = await Role.findByPk(roleId);
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }

      // Check if role is editable
      if (!role.isEditable) {
        return res.status(400).json({ error: 'System roles cannot be modified' });
      }

      // Verify all permissions exist
      const existingPermissions = await Permission.findAll({
        where: { id: { [Op.in]: permissions } }
      });

      if (existingPermissions.length !== permissions.length) {
        return res.status(400).json({ error: 'One or more permissions not found' });
      }

      // Update permissions
      await role.setPermissions(permissions);

      // Create audit log
      await AuditLog.create({
        userId: req.user.id,
        action: 'ROLE_PERMISSIONS_UPDATED',
        details: `Permissions updated for role: ${role.name}`,
        ipAddress: req.ip,
        metadata: { 
          roleId: role.id, 
          permissions 
        }
      });

      res.json({
        success: true,
        message: 'Role permissions updated successfully',
        data: {
          roleId: role.id,
          roleName: role.name,
          permissionCount: permissions.length
        }
      });
    } catch (error) {
      console.error('Update role permissions error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get All Permissions
   */
  async getAllPermissions(req, res) {
    try {
      const userRoles = req.user.roles;

      // Only system admin can view all permissions
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to view permissions' });
      }

      const permissions = await Permission.findAll({
        order: [['category', 'ASC'], ['name', 'ASC']]
      });

      // Group by category
      const groupedPermissions = permissions.reduce((acc, permission) => {
        const category = permission.category || 'General';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(permission);
        return acc;
      }, {});

      res.json({
        success: true,
        data: {
          all: permissions,
          grouped: groupedPermissions,
          categories: Object.keys(groupedPermissions)
        }
      });
    } catch (error) {
      console.error('Get all permissions error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Create Permission
   */
  async createPermission(req, res) {
    try {
      const { name, description, category } = req.body;
      const userRoles = req.user.roles;

      if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
      }

      // Only system admin can create permissions
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to create permissions' });
      }

      // Check if permission exists
      const existingPermission = await Permission.findOne({ where: { name } });
      if (existingPermission) {
        return res.status(409).json({ error: 'Permission with this name already exists' });
      }

      const permission = await Permission.create({
        name,
        description,
        category: category || 'General'
      });

      // Create audit log
      await AuditLog.create({
        userId: req.user.id,
        action: 'PERMISSION_CREATED',
        details: `Permission created: ${name}`,
        ipAddress: req.ip,
        metadata: { 
          permissionId: permission.id, 
          name, 
          category 
        }
      });

      res.status(201).json({
        success: true,
        message: 'Permission created successfully',
        data: permission
      });
    } catch (error) {
      console.error('Create permission error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Role Statistics
   */
  async getRoleStats(req, res) {
    try {
      const userRoles = req.user.roles;

      // Only system admin can view role statistics
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to view role statistics' });
      }

      const totalRoles = await Role.count();
      const systemRoles = await Role.count({ where: { isSystemRole: true } });
      const customRoles = totalRoles - systemRoles;

      // Get users per role
      const rolesWithUsers = await Role.findAll({
        include: [{
          model: User,
          through: { attributes: [] },
          attributes: ['id']
        }],
        attributes: ['id', 'name', 'description']
      });

      const usersPerRole = rolesWithUsers.map(role => ({
        roleId: role.id,
        roleName: role.name,
        userCount: role.Users.length,
        isSystemRole: role.isSystemRole
      }));

      // Get most common permissions
      const permissions = await Permission.findAll({
        include: [{
          model: Role,
          through: { attributes: [] },
          attributes: ['id']
        }],
        attributes: ['id', 'name', 'category']
      });

      const permissionsUsage = permissions.map(permission => ({
        permissionId: permission.id,
        permissionName: permission.name,
        category: permission.category,
        roleCount: permission.Roles.length
      }));

      res.json({
        success: true,
        data: {
          totalRoles,
          systemRoles,
          customRoles,
          usersPerRole,
          permissionsUsage,
          mostUsedRoles: usersPerRole.sort((a, b) => b.userCount - a.userCount).slice(0, 10)
        }
      });
    } catch (error) {
      console.error('Get role stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Clone Role
   */
  async cloneRole(req, res) {
    try {
      const { roleId } = req.params;
      const { newName, newDescription } = req.body;
      const userRoles = req.user.roles;

      if (!newName) {
        return res.status(400).json({ error: 'New role name is required' });
      }

      // Only system admin can clone roles
      if (!userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return res.status(403).json({ error: 'Not authorized to clone roles' });
      }

      const originalRole = await Role.findByPk(roleId, {
        include: [{
          model: Permission,
          through: { attributes: [] },
          attributes: ['id']
        }]
      });

      if (!originalRole) {
        return res.status(404).json({ error: 'Role not found' });
      }

      // Check if new name exists
      const existingRole = await Role.findOne({ where: { name: newName } });
      if (existingRole) {
        return res.status(409).json({ error: 'Role with this name already exists' });
      }

      // Create new role
      const newRole = await Role.create({
        name: newName,
        description: newDescription || originalRole.description,
        isSystemRole: false,
        isEditable: true
      });

      // Copy permissions
      const permissionIds = originalRole.Permissions.map(p => p.id);
      if (permissionIds.length > 0) {
        await newRole.setPermissions(permissionIds);
      }

      // Create audit log
      await AuditLog.create({
        userId: req.user.id,
        action: 'ROLE_CLONED',
        details: `Role cloned from ${originalRole.name} to ${newName}`,
        ipAddress: req.ip,
        metadata: { 
          originalRoleId: originalRole.id,
          newRoleId: newRole.id,
          permissionCount: permissionIds.length
        }
      });

      res.status(201).json({
        success: true,
        message: 'Role cloned successfully',
        data: {
          id: newRole.id,
          name: newRole.name,
          description: newRole.description,
          permissionCount: permissionIds.length
        }
      });
    } catch (error) {
      console.error('Clone role error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new RoleController();