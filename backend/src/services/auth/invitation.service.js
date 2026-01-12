const crypto = require('crypto');
const { User, Role, Company, Invitation, Portfolio } = require('../../models');
const mailService = require('../../config/mail');
const authService = require('./auth.service');

class InvitationService {
  constructor() {}

  /**
   * Create invitation for new user
   */
  async createInvitation(inviterId, invitationData) {
    try {
      const { email, role_id, company_id, portfolio_id, permissions } = invitationData;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('User with this email already exists in the system');
      }

      // Check if pending invitation already exists
      const existingInvitation = await Invitation.findOne({
        where: { 
          email, 
          status: 'pending',
          expires_at: { [Op.gt]: new Date() }
        }
      });

      if (existingInvitation) {
        throw new Error('Pending invitation already exists for this email');
      }

      // Get inviter details
      const inviter = await User.findByPk(inviterId, {
        include: [
          {
            model: Company,
            attributes: ['id', 'name']
          }
        ]
      });

      if (!inviter) {
        throw new Error('Inviter not found');
      }

      // Validate role assignment hierarchy
      const inviterMaxLevel = Math.max(...inviter.roles.map(role => role.level));
      const targetRole = await Role.findByPk(role_id);
      
      if (!targetRole) {
        throw new Error('Specified role not found');
      }

      if (targetRole.level >= inviterMaxLevel) {
        throw new Error('Cannot assign role at same or higher level than yourself');
      }

      // Validate company assignment if applicable
      if (company_id) {
        const company = await Company.findByPk(company_id);
        if (!company) {
          throw new Error('Specified company not found');
        }

        // Check if inviter belongs to this company
        if (inviter.company_id !== company_id) {
          throw new Error('You can only invite users to your own company');
        }
      }

      // Validate portfolio assignment if applicable
      if (portfolio_id) {
        const portfolio = await Portfolio.findByPk(portfolio_id);
        if (!portfolio) {
          throw new Error('Specified portfolio not found');
        }

        // Check if portfolio belongs to inviter's company
        if (portfolio.company_id !== (company_id || inviter.company_id)) {
          throw new Error('Portfolio does not belong to the specified company');
        }
      }

      // Generate unique invitation token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Create invitation
      const invitation = await Invitation.create({
        email,
        token,
        inviter_id: inviterId,
        role_id,
        company_id: company_id || inviter.company_id,
        portfolio_id,
        permissions: permissions || {},
        status: 'pending',
        expires_at: expiresAt,
        created_at: new Date()
      });

      // Send invitation email
      await mailService.sendInvitationEmail(
        email,
        `${inviter.first_name} ${inviter.last_name}`,
        targetRole.name,
        token
      );

      return {
        success: true,
        invitation: {
          id: invitation.id,
          email: invitation.email,
          role: targetRole.name,
          company: inviter.company?.name,
          expires_at: invitation.expires_at,
          status: invitation.status
        },
        message: 'Invitation sent successfully'
      };
    } catch (error) {
      console.error('Create invitation error:', error);
      throw new Error(`Failed to create invitation: ${error.message}`);
    }
  }

  /**
   * Bulk create invitations
   */
  async createBulkInvitations(inviterId, invitationsData) {
    try {
      const results = [];
      const errors = [];

      for (const invitationData of invitationsData) {
        try {
          const result = await this.createInvitation(inviterId, invitationData);
          results.push(result);
        } catch (error) {
          errors.push({
            email: invitationData.email,
            error: error.message
          });
        }
      }

      return {
        success: true,
        results,
        errors,
        message: `Processed ${results.length} invitations successfully, ${errors.length} failed`
      };
    } catch (error) {
      console.error('Bulk invitation error:', error);
      throw new Error(`Bulk invitation failed: ${error.message}`);
    }
  }

  /**
   * Accept invitation and create user
   */
  async acceptInvitation(token, userData) {
    try {
      // Validate invitation
      const validation = await authService.validateInvitation(token);
      if (!validation.success) {
        throw new Error(validation.message);
      }

      const invitation = validation.invitation;

      // Check if invitation is still pending
      if (invitation.status !== 'pending') {
        throw new Error('Invitation has already been used or expired');
      }

      // Check expiration
      if (new Date() > invitation.expires_at) {
        throw new Error('Invitation has expired');
      }

      // Check if user already exists (edge case)
      const existingUser = await User.findOne({ where: { email: invitation.email } });
      if (existingUser) {
        // Update invitation status
        await invitation.update({ status: 'accepted', accepted_at: new Date() });
        throw new Error('User already exists with this email');
      }

      // Hash password
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user
      const user = await User.create({
        email: invitation.email,
        password: hashedPassword,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        company_id: invitation.company_id,
        is_active: true,
        email_verified: true, // Verified via invitation
        created_at: new Date()
      });

      // Assign role from invitation
      const role = await Role.findByPk(invitation.role_id);
      if (role) {
        await user.addRole(role);
      }

      // Assign to portfolio if specified
      if (invitation.portfolio_id) {
        const portfolio = await Portfolio.findByPk(invitation.portfolio_id);
        if (portfolio) {
          await user.addPortfolio(portfolio);
        }
      }

      // Apply custom permissions if any
      if (invitation.permissions && Object.keys(invitation.permissions).length > 0) {
        // Store custom permissions in user metadata
        await user.update({
          metadata: {
            ...user.metadata,
            custom_permissions: invitation.permissions
          }
        });
      }

      // Update invitation status
      await invitation.update({
        status: 'accepted',
        accepted_at: new Date(),
        user_id: user.id
      });

      // Send welcome email
      await mailService.sendWelcomeEmail(
        user.email,
        `${user.first_name} ${user.last_name}`,
        role?.name || 'User'
      );

      // Generate tokens for immediate login
      const tokens = await authService.generateTokens(user);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          roles: [role?.name],
          company_id: user.company_id
        },
        tokens,
        message: 'Invitation accepted and account created successfully'
      };
    } catch (error) {
      console.error('Accept invitation error:', error);
      throw new Error(`Failed to accept invitation: ${error.message}`);
    }
  }

  /**
   * Resend invitation
   */
  async resendInvitation(invitationId, inviterId) {
    try {
      const invitation = await Invitation.findByPk(invitationId, {
        include: [
          {
            model: User,
            as: 'inviter',
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: Role,
            attributes: ['id', 'name']
          },
          {
            model: Company,
            attributes: ['id', 'name']
          }
        ]
      });

      if (!invitation) {
        throw new Error('Invitation not found');
      }

      // Verify inviter has permission
      if (invitation.inviter_id !== inviterId) {
        throw new Error('You can only resend your own invitations');
      }

      if (invitation.status !== 'pending') {
        throw new Error('Cannot resend used or expired invitation');
      }

      // Check if expired, renew if so
      let token = invitation.token;
      let expiresAt = invitation.expires_at;

      if (new Date() > expiresAt) {
        // Generate new token
        const crypto = require('crypto');
        token = crypto.randomBytes(32).toString('hex');
        expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await invitation.update({
          token,
          expires_at: expiresAt
        });
      }

      // Resend email
      await mailService.sendInvitationEmail(
        invitation.email,
        `${invitation.inviter.first_name} ${invitation.inviter.last_name}`,
        invitation.role.name,
        token
      );

      return {
        success: true,
        message: 'Invitation resent successfully',
        invitation: {
          id: invitation.id,
          email: invitation.email,
          expires_at: expiresAt,
          status: invitation.status
        }
      };
    } catch (error) {
      console.error('Resend invitation error:', error);
      throw new Error(`Failed to resend invitation: ${error.message}`);
    }
  }

  /**
   * Cancel invitation
   */
  async cancelInvitation(invitationId, inviterId) {
    try {
      const invitation = await Invitation.findByPk(invitationId);

      if (!invitation) {
        throw new Error('Invitation not found');
      }

      // Verify inviter has permission
      if (invitation.inviter_id !== inviterId) {
        throw new Error('You can only cancel your own invitations');
      }

      if (invitation.status !== 'pending') {
        throw new Error('Cannot cancel used or expired invitation');
      }

      // Update status
      await invitation.update({
        status: 'cancelled',
        cancelled_at: new Date()
      });

      return {
        success: true,
        message: 'Invitation cancelled successfully'
      };
    } catch (error) {
      console.error('Cancel invitation error:', error);
      throw new Error(`Failed to cancel invitation: ${error.message}`);
    }
  }

  /**
   * Get invitations by inviter
   */
  async getInvitationsByInviter(inviterId, filters = {}) {
    try {
      const { status, company_id, limit = 50, offset = 0 } = filters;

      const where = { inviter_id: inviterId };
      
      if (status) {
        where.status = status;
      }
      
      if (company_id) {
        where.company_id = company_id;
      }

      const { count, rows } = await Invitation.findAndCountAll({
        where,
        include: [
          {
            model: Role,
            attributes: ['id', 'name', 'level']
          },
          {
            model: Company,
            attributes: ['id', 'name']
          },
          {
            model: User,
            as: 'inviter',
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'email'],
            required: false
          }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        success: true,
        invitations: rows,
        total: count,
        message: 'Invitations retrieved successfully'
      };
    } catch (error) {
      console.error('Get invitations error:', error);
      throw new Error(`Failed to get invitations: ${error.message}`);
    }
  }

  /**
   * Get invitation by token
   */
  async getInvitationByToken(token) {
    try {
      const invitation = await Invitation.findOne({
        where: { token },
        include: [
          {
            model: Role,
            attributes: ['id', 'name', 'level', 'description']
          },
          {
            model: Company,
            attributes: ['id', 'name', 'logo_url']
          },
          {
            model: User,
            as: 'inviter',
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ]
      });

      if (!invitation) {
        throw new Error('Invitation not found');
      }

      // Check if expired
      if (new Date() > invitation.expires_at) {
        throw new Error('Invitation has expired');
      }

      // Check if already used
      if (invitation.status !== 'pending') {
        throw new Error(`Invitation has been ${invitation.status}`);
      }

      return {
        success: true,
        invitation,
        message: 'Invitation retrieved successfully'
      };
    } catch (error) {
      console.error('Get invitation by token error:', error);
      throw new Error(`Failed to get invitation: ${error.message}`);
    }
  }

  /**
   * Update invitation
   */
  async updateInvitation(invitationId, updates, inviterId) {
    try {
      const invitation = await Invitation.findByPk(invitationId);

      if (!invitation) {
        throw new Error('Invitation not found');
      }

      // Verify inviter has permission
      if (invitation.inviter_id !== inviterId) {
        throw new Error('You can only update your own invitations');
      }

      if (invitation.status !== 'pending') {
        throw new Error('Cannot update used or expired invitation');
      }

      // Validate role update if provided
      if (updates.role_id) {
        const inviter = await User.findByPk(inviterId, {
          include: [{ model: Role, through: { attributes: [] } }]
        });

        const inviterMaxLevel = Math.max(...inviter.roles.map(role => role.level));
        const targetRole = await Role.findByPk(updates.role_id);
        
        if (!targetRole) {
          throw new Error('Specified role not found');
        }

        if (targetRole.level >= inviterMaxLevel) {
          throw new Error('Cannot assign role at same or higher level than yourself');
        }
      }

      // Update invitation
      await invitation.update(updates);

      return {
        success: true,
        invitation,
        message: 'Invitation updated successfully'
      };
    } catch (error) {
      console.error('Update invitation error:', error);
      throw new Error(`Failed to update invitation: ${error.message}`);
    }
  }

  /**
   * Get invitation statistics
   */
  async getInvitationStats(inviterId, companyId) {
    try {
      const where = {};
      
      if (inviterId) {
        where.inviter_id = inviterId;
      }
      
      if (companyId) {
        where.company_id = companyId;
      }

      const invitations = await Invitation.findAll({ where });

      const stats = {
        total: invitations.length,
        pending: invitations.filter(i => i.status === 'pending').length,
        accepted: invitations.filter(i => i.status === 'accepted').length,
        expired: invitations.filter(i => 
          i.status === 'pending' && new Date() > i.expires_at
        ).length,
        cancelled: invitations.filter(i => i.status === 'cancelled').length,
        by_role: {},
        by_month: {}
      };

      // Group by role
      for (const invitation of invitations) {
        if (invitation.role_id) {
          const role = await Role.findByPk(invitation.role_id);
          if (role) {
            stats.by_role[role.name] = (stats.by_role[role.name] || 0) + 1;
          }
        }
      }

      // Group by month
      invitations.forEach(invitation => {
        const month = invitation.created_at.toISOString().slice(0, 7); // YYYY-MM
        stats.by_month[month] = (stats.by_month[month] || 0) + 1;
      });

      return {
        success: true,
        stats,
        message: 'Invitation statistics retrieved successfully'
      };
    } catch (error) {
      console.error('Get invitation stats error:', error);
      throw new Error(`Failed to get invitation statistics: ${error.message}`);
    }
  }
}

module.exports = new InvitationService();