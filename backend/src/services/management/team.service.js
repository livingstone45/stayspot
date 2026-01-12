const { User, Role, UserRole, Company, Invitation } = require('../../models');
const { Op } = require('sequelize');
const invitationService = require('../auth/invitation.service');

class TeamService {
  async getTeamMembers(companyId, filters = {}) {
    const { role, status, limit = 50, offset = 0, search } = filters;
    
    const where = { company_id: companyId };
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const include = [{
      model: Role,
      as: 'roles',
      ...(role && { where: { name: role } })
    }];

    return await User.findAndCountAll({
      where,
      include,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password'] }
    });
  }

  async inviteTeamMember(invitationData) {
    const { email, roleId, companyId, invitedBy, message } = invitationData;

    // Check if user already exists in company
    const existingUser = await User.findOne({
      where: { email, company_id: companyId }
    });

    if (existingUser) {
      throw new Error('User already exists in this company');
    }

    return await invitationService.createInvitation({
      email,
      roleId,
      companyId,
      invitedBy,
      message
    });
  }

  async updateTeamMemberRole(userId, roleId, updatedBy) {
    const user = await User.findByPk(userId, {
      include: [{ model: Role, as: 'roles' }]
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Remove existing roles
    await UserRole.destroy({ where: { user_id: userId } });

    // Add new role
    await UserRole.create({
      user_id: userId,
      role_id: roleId,
      assigned_by: updatedBy
    });

    return await User.findByPk(userId, {
      include: [{ model: Role, as: 'roles' }],
      attributes: { exclude: ['password'] }
    });
  }

  async removeTeamMember(userId, companyId) {
    const user = await User.findOne({
      where: { id: userId, company_id: companyId }
    });

    if (!user) {
      throw new Error('User not found in company');
    }

    // Remove user from company
    await user.update({ company_id: null });

    // Remove all role assignments
    await UserRole.destroy({ where: { user_id: userId } });

    return { success: true };
  }

  async getTeamMemberDetails(userId, companyId) {
    const user = await User.findOne({
      where: { id: userId, company_id: companyId },
      include: [
        { model: Role, as: 'roles' },
        { model: Company, as: 'company' }
      ],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateTeamMember(userId, updateData, companyId) {
    const user = await User.findOne({
      where: { id: userId, company_id: companyId }
    });

    if (!user) {
      throw new Error('User not found in company');
    }

    const { roleId, ...userData } = updateData;

    // Update user data
    await user.update(userData);

    // Update role if provided
    if (roleId) {
      await UserRole.destroy({ where: { user_id: userId } });
      await UserRole.create({
        user_id: userId,
        role_id: roleId
      });
    }

    return await User.findByPk(userId, {
      include: [{ model: Role, as: 'roles' }],
      attributes: { exclude: ['password'] }
    });
  }

  async getTeamStatistics(companyId) {
    const totalMembers = await User.count({ where: { company_id: companyId } });
    const activeMembers = await User.count({ 
      where: { company_id: companyId, status: 'active' } 
    });

    // Get role distribution
    const roleStats = await UserRole.findAll({
      include: [
        {
          model: User,
          as: 'user',
          where: { company_id: companyId },
          attributes: []
        },
        {
          model: Role,
          as: 'role',
          attributes: ['name', 'display_name']
        }
      ],
      attributes: ['role_id'],
      group: ['role_id', 'role.id', 'role.name', 'role.display_name'],
      raw: false
    });

    const roleDistribution = {};
    roleStats.forEach(stat => {
      const roleName = stat.role.display_name;
      roleDistribution[roleName] = (roleDistribution[roleName] || 0) + 1;
    });

    return {
      totalMembers,
      activeMembers,
      inactiveMembers: totalMembers - activeMembers,
      roleDistribution
    };
  }

  async getPendingInvitations(companyId) {
    return await invitationService.getInvitations(companyId, { status: 'pending' });
  }

  async resendInvitation(invitationId, userId) {
    return await invitationService.resendInvitation(invitationId, userId);
  }

  async cancelInvitation(invitationId, userId) {
    return await invitationService.cancelInvitation(invitationId, userId);
  }

  async bulkInviteTeamMembers(invitations, companyId, invitedBy) {
    const results = [];

    for (const invitation of invitations) {
      try {
        const result = await this.inviteTeamMember({
          ...invitation,
          companyId,
          invitedBy
        });
        results.push({ success: true, email: invitation.email, invitation: result });
      } catch (error) {
        results.push({ success: false, email: invitation.email, error: error.message });
      }
    }

    return results;
  }

  async getTeamHierarchy(companyId) {
    const users = await User.findAll({
      where: { company_id: companyId },
      include: [{ model: Role, as: 'roles' }],
      attributes: { exclude: ['password'] }
    });

    // Group by role hierarchy
    const hierarchy = {};
    
    users.forEach(user => {
      user.roles.forEach(role => {
        if (!hierarchy[role.name]) {
          hierarchy[role.name] = {
            role: role,
            members: []
          };
        }
        hierarchy[role.name].members.push(user);
      });
    });

    return hierarchy;
  }

  async searchTeamMembers(companyId, searchTerm) {
    return await User.findAll({
      where: {
        company_id: companyId,
        [Op.or]: [
          { first_name: { [Op.iLike]: `%${searchTerm}%` } },
          { last_name: { [Op.iLike]: `%${searchTerm}%` } },
          { email: { [Op.iLike]: `%${searchTerm}%` } }
        ]
      },
      include: [{ model: Role, as: 'roles' }],
      attributes: { exclude: ['password'] },
      limit: 20
    });
  }
}

module.exports = new TeamService();