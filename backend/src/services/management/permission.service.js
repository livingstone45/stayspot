const { Permission, Role, User, UserRole } = require('../../models');
const { Op } = require('sequelize');

class PermissionService {
  async getUserPermissions(userId) {
    const user = await User.findByPk(userId, {
      include: [{
        model: Role,
        as: 'roles',
        include: [{
          model: Permission,
          as: 'permissions'
        }]
      }]
    });

    if (!user) return [];

    const permissions = new Set();
    user.roles.forEach(role => {
      role.permissions.forEach(permission => {
        permissions.add(permission.name);
      });
    });

    return Array.from(permissions);
  }

  async hasPermission(userId, permissionName) {
    const permissions = await this.getUserPermissions(userId);
    
    // Check for wildcard permission
    if (permissions.includes('*')) return true;
    
    // Check exact permission
    if (permissions.includes(permissionName)) return true;
    
    // Check wildcard patterns
    return permissions.some(permission => {
      if (permission.endsWith('.*')) {
        const prefix = permission.slice(0, -2);
        return permissionName.startsWith(prefix + '.');
      }
      return false;
    });
  }

  async assignPermissionToRole(roleId, permissionId) {
    const role = await Role.findByPk(roleId);
    const permission = await Permission.findByPk(permissionId);

    if (!role || !permission) {
      throw new Error('Role or permission not found');
    }

    await role.addPermission(permission);
    return { success: true };
  }

  async removePermissionFromRole(roleId, permissionId) {
    const role = await Role.findByPk(roleId);
    const permission = await Permission.findByPk(permissionId);

    if (!role || !permission) {
      throw new Error('Role or permission not found');
    }

    await role.removePermission(permission);
    return { success: true };
  }

  async createPermission(permissionData) {
    const { name, description, category } = permissionData;
    
    const existingPermission = await Permission.findOne({ where: { name } });
    if (existingPermission) {
      throw new Error('Permission already exists');
    }

    return await Permission.create({
      name,
      description,
      category
    });
  }

  async updatePermission(permissionId, updateData) {
    const permission = await Permission.findByPk(permissionId);
    if (!permission) {
      throw new Error('Permission not found');
    }

    return await permission.update(updateData);
  }

  async deletePermission(permissionId) {
    const permission = await Permission.findByPk(permissionId);
    if (!permission) {
      throw new Error('Permission not found');
    }

    await permission.destroy();
    return { success: true };
  }

  async getRolePermissions(roleId) {
    const role = await Role.findByPk(roleId, {
      include: [{
        model: Permission,
        as: 'permissions'
      }]
    });

    return role ? role.permissions : [];
  }

  async bulkAssignPermissions(roleId, permissionIds) {
    const role = await Role.findByPk(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    const permissions = await Permission.findAll({
      where: { id: { [Op.in]: permissionIds } }
    });

    await role.setPermissions(permissions);
    return { success: true, assigned: permissions.length };
  }

  async getPermissionsByCategory(category) {
    return await Permission.findAll({
      where: category ? { category } : {},
      order: [['category', 'ASC'], ['name', 'ASC']]
    });
  }

  async checkMultiplePermissions(userId, permissionNames) {
    const userPermissions = await this.getUserPermissions(userId);
    const results = {};

    permissionNames.forEach(permission => {
      results[permission] = this.checkPermissionInList(userPermissions, permission);
    });

    return results;
  }

  checkPermissionInList(userPermissions, permissionName) {
    if (userPermissions.includes('*')) return true;
    if (userPermissions.includes(permissionName)) return true;
    
    return userPermissions.some(permission => {
      if (permission.endsWith('.*')) {
        const prefix = permission.slice(0, -2);
        return permissionName.startsWith(prefix + '.');
      }
      return false;
    });
  }
}

module.exports = new PermissionService();