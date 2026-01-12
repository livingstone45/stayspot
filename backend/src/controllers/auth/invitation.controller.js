const { Op } = require('sequelize');
const crypto = require('crypto');
const { Invitation, User, Role, Company, AuditLog } = require('../../models');
const { sendEmail } = require('../../services/communication/email.service');
const { ROLES } = require('../../utils/constants/roles');
const { validateInvitation } = require('../../utils/validators/user.validator');

/**
 * Invitation Controller
 * Handles team invitation and management
 */
class InvitationController {
  /**
   * Create Invitation
   */
  async createInvitation(req, res) {
    try {
      const { error } = validateInvitation(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const { email, roleId, companyId, portfolioId, expiresInDays = 7, permissions } = req.body;
      const invitedBy = req.user.id;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ 
          error: 'User with this email already exists. Please use a different email or ask them to join directly.' 
        });
      }

      // Check for existing pending invitation
      const existingInvitation = await Invitation.findOne({
        where: {
          email,
          status: 'pending',
          expiresAt: { [Op.gt]: new Date() }
        }
      });

      if (existingInvitation) {
        return res.status(409).json({ 
          error: 'An active invitation already exists for this email.' 
        });
      }

      // Verify role exists
      const role = await Role.findByPk(roleId);
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }

      // Verify company exists if provided
      let company = null;
      if (companyId) {
        company = await Company.findByPk(companyId);
        if (!company) {
          return res.status(404).json({ error: 'Company not found' });
        }
      }

      // Generate unique invitation code
      const invitationCode = crypto.randomBytes(32).toString('hex');

      // Calculate expiry date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      // Create invitation
      const invitation = await Invitation.create({
        email,
        roleId,
        companyId: company ? company.id : null,
        portfolioId: portfolioId || null,
        invitedBy,
        code: invitationCode,
        status: 'pending',
        expiresAt,
        permissions: permissions || [],
        metadata: {
          invitedByName: `${req.user.firstName} ${req.user.lastName}`,
          roleName: role.name,
          companyName: company ? company.name : 'Individual'
        }
      });

      // Send invitation email
      await sendEmail({
        to: email,
        subject: `You're Invited to Join StaySpot`,
        template: 'team-invitation',
        data: {
          recipientEmail: email,
          invitedByName: `${req.user.firstName} ${req.user.lastName}`,
          roleName: role.name,
          companyName: company ? company.name : 'StaySpot',
          invitationLink: `${process.env.FRONTEND_URL}/accept-invitation?code=${invitationCode}`,
          expiresIn: `${expiresInDays} days`
        }
      });

      // Create audit log
      await AuditLog.create({
        userId: invitedBy,
        action: 'INVITATION_CREATED',
        details: `Invitation sent to ${email} for role: ${role.name}`,
        ipAddress: req.ip,
        metadata: { invitationId: invitation.id, roleId, companyId }
      });

      res.status(201).json({
        success: true,
        message: 'Invitation sent successfully',
        data: {
          invitationId: invitation.id,
          email,
          role: role.name,
          expiresAt,
          invitationCode
        }
      });
    } catch (error) {
      console.error('Create invitation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Invitation by Code
   */
  async getInvitation(req, res) {
    try {
      const { code } = req.params;

      const invitation = await Invitation.findOne({
        where: { 
          code,
          status: 'pending',
          expiresAt: { [Op.gt]: new Date() }
        },
        include: [
          { model: Role },
          { model: Company },
          { 
            model: User, 
            as: 'Inviter',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      if (!invitation) {
        return res.status(404).json({ 
          error: 'Invitation not found, expired, or already used' 
        });
      }

      // Remove sensitive data
      const invitationData = {
        id: invitation.id,
        email: invitation.email,
        role: {
          id: invitation.Role.id,
          name: invitation.Role.name,
          description: invitation.Role.description
        },
        company: invitation.Company ? {
          id: invitation.Company.id,
          name: invitation.Company.name,
          logo: invitation.Company.logo
        } : null,
        invitedBy: {
          id: invitation.Inviter.id,
          name: `${invitation.Inviter.firstName} ${invitation.Inviter.lastName}`,
          email: invitation.Inviter.email
        },
        expiresAt: invitation.expiresAt,
        createdAt: invitation.createdAt
      };

      res.json({
        success: true,
        data: invitationData
      });
    } catch (error) {
      console.error('Get invitation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get All Invitations for Company/User
   */
  async getInvitations(req, res) {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const userId = req.user.id;
      const offset = (page - 1) * limit;

      // Check user's company
      const user = await User.findByPk(userId, {
        include: [{ model: Company }]
      });

      let whereClause = {};

      // Filter by status
      if (status) {
        whereClause.status = status;
      }

      // System admin can see all invitations
      if (req.user.roles.includes(ROLES.SYSTEM_ADMIN)) {
        // No company filter for system admin
      } 
      // Company admin can see company invitations
      else if (user.companyId) {
        whereClause.companyId = user.companyId;
      } 
      // Individual users can only see invitations they sent
      else {
        whereClause.invitedBy = userId;
      }

      const { count, rows: invitations } = await Invitation.findAndCountAll({
        where: whereClause,
        include: [
          { model: Role, attributes: ['id', 'name', 'description'] },
          { model: Company, attributes: ['id', 'name'] },
          { 
            model: User, 
            as: 'Inviter',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: {
          invitations,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get invitations error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Resend Invitation
   */
  async resendInvitation(req, res) {
    try {
      const { invitationId } = req.params;
      const userId = req.user.id;

      const invitation = await Invitation.findByPk(invitationId, {
        include: [
          { model: Role },
          { model: Company },
          { 
            model: User, 
            as: 'Inviter',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      if (!invitation) {
        return res.status(404).json({ error: 'Invitation not found' });
      }

      // Check permissions
      const user = await User.findByPk(userId);
      if (invitation.invitedBy !== userId && 
          !req.user.roles.includes(ROLES.SYSTEM_ADMIN) &&
          (user.companyId !== invitation.companyId || !req.user.roles.includes(ROLES.COMPANY_ADMIN))) {
        return res.status(403).json({ error: 'Not authorized to resend this invitation' });
      }

      // Check if invitation is expired
      if (invitation.expiresAt < new Date()) {
        // Extend expiry by 7 days
        invitation.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await invitation.save();
      }

      // Resend email
      await sendEmail({
        to: invitation.email,
        subject: `Reminder: You're Invited to Join StaySpot`,
        template: 'team-invitation',
        data: {
          recipientEmail: invitation.email,
          invitedByName: `${invitation.Inviter.firstName} ${invitation.Inviter.lastName}`,
          roleName: invitation.Role.name,
          companyName: invitation.Company ? invitation.Company.name : 'StaySpot',
          invitationLink: `${process.env.FRONTEND_URL}/accept-invitation?code=${invitation.code}`,
          expiresIn: '7 days'
        }
      });

      // Update invitation
      invitation.status = 'pending';
      invitation.resentAt = new Date();
      invitation.resentBy = userId;
      await invitation.save();

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'INVITATION_RESENT',
        details: `Invitation resent to ${invitation.email}`,
        ipAddress: req.ip,
        metadata: { invitationId: invitation.id }
      });

      res.json({
        success: true,
        message: 'Invitation resent successfully'
      });
    } catch (error) {
      console.error('Resend invitation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Cancel Invitation
   */
  async cancelInvitation(req, res) {
    try {
      const { invitationId } = req.params;
      const userId = req.user.id;

      const invitation = await Invitation.findByPk(invitationId);

      if (!invitation) {
        return res.status(404).json({ error: 'Invitation not found' });
      }

      // Check permissions
      const user = await User.findByPk(userId);
      if (invitation.invitedBy !== userId && 
          !req.user.roles.includes(ROLES.SYSTEM_ADMIN) &&
          (user.companyId !== invitation.companyId || !req.user.roles.includes(ROLES.COMPANY_ADMIN))) {
        return res.status(403).json({ error: 'Not authorized to cancel this invitation' });
      }

      // Check if already accepted
      if (invitation.status === 'accepted') {
        return res.status(400).json({ error: 'Cannot cancel an accepted invitation' });
      }

      // Cancel invitation
      invitation.status = 'cancelled';
      invitation.cancelledAt = new Date();
      invitation.cancelledBy = userId;
      await invitation.save();

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'INVITATION_CANCELLED',
        details: `Invitation cancelled for ${invitation.email}`,
        ipAddress: req.ip,
        metadata: { invitationId: invitation.id }
      });

      res.json({
        success: true,
        message: 'Invitation cancelled successfully'
      });
    } catch (error) {
      console.error('Cancel invitation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Accept Invitation (used during registration)
   */
  async acceptInvitation(req, res) {
    try {
      const { code } = req.params;

      const invitation = await Invitation.findOne({
        where: { 
          code,
          status: 'pending',
          expiresAt: { [Op.gt]: new Date() }
        }
      });

      if (!invitation) {
        return res.status(404).json({ 
          error: 'Invitation not found, expired, or already used' 
        });
      }

      // Return invitation details for registration form
      res.json({
        success: true,
        data: {
          invitationId: invitation.id,
          email: invitation.email,
          roleId: invitation.roleId,
          companyId: invitation.companyId,
          portfolioId: invitation.portfolioId,
          permissions: invitation.permissions
        }
      });
    } catch (error) {
      console.error('Accept invitation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Bulk Invite Team Members
   */
  async bulkInvite(req, res) {
    try {
      const { invitations } = req.body;
      const invitedBy = req.user.id;

      if (!Array.isArray(invitations) || invitations.length === 0) {
        return res.status(400).json({ error: 'Invitations array is required' });
      }

      // Limit bulk invitations
      if (invitations.length > 50) {
        return res.status(400).json({ error: 'Maximum 50 invitations per bulk request' });
      }

      const results = {
        success: [],
        failed: []
      };

      // Process each invitation
      for (const invite of invitations) {
        try {
          const { email, roleId, permissions } = invite;

          // Validate email
          if (!email || !roleId) {
            results.failed.push({ email, error: 'Email and roleId are required' });
            continue;
          }

          // Check if user already exists
          const existingUser = await User.findOne({ where: { email } });
          if (existingUser) {
            results.failed.push({ email, error: 'User already exists' });
            continue;
          }

          // Check for existing pending invitation
          const existingInvitation = await Invitation.findOne({
            where: {
              email,
              status: 'pending',
              expiresAt: { [Op.gt]: new Date() }
            }
          });

          if (existingInvitation) {
            results.failed.push({ email, error: 'Active invitation already exists' });
            continue;
          }

          // Verify role
          const role = await Role.findByPk(roleId);
          if (!role) {
            results.failed.push({ email, error: 'Invalid role' });
            continue;
          }

          // Generate invitation code
          const invitationCode = crypto.randomBytes(32).toString('hex');
          const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

          // Create invitation
          const invitation = await Invitation.create({
            email,
            roleId,
            companyId: req.user.companyId,
            invitedBy,
            code: invitationCode,
            status: 'pending',
            expiresAt,
            permissions: permissions || []
          });

          // Send invitation email
          await sendEmail({
            to: email,
            subject: `You're Invited to Join StaySpot`,
            template: 'team-invitation',
            data: {
              recipientEmail: email,
              invitedByName: `${req.user.firstName} ${req.user.lastName}`,
              roleName: role.name,
              companyName: req.user.companyName || 'StaySpot',
              invitationLink: `${process.env.FRONTEND_URL}/accept-invitation?code=${invitationCode}`,
              expiresIn: '7 days'
            }
          });

          results.success.push({ email, invitationId: invitation.id });
        } catch (error) {
          console.error(`Failed to invite ${invite.email}:`, error);
          results.failed.push({ email: invite.email, error: error.message });
        }
      }

      // Create audit log
      await AuditLog.create({
        userId: invitedBy,
        action: 'BULK_INVITATION',
        details: `Bulk invitations sent: ${results.success.length} success, ${results.failed.length} failed`,
        ipAddress: req.ip,
        metadata: { results }
      });

      res.json({
        success: true,
        message: `Bulk invitations processed. ${results.success.length} sent successfully, ${results.failed.length} failed.`,
        data: results
      });
    } catch (error) {
      console.error('Bulk invite error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Invitation Statistics
   */
  async getInvitationStats(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);

      let whereClause = {};

      if (req.user.roles.includes(ROLES.SYSTEM_ADMIN)) {
        // System admin sees all
      } else if (user.companyId) {
        whereClause.companyId = user.companyId;
      } else {
        whereClause.invitedBy = userId;
      }

      const stats = await Invitation.findAll({
        where: whereClause,
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status']
      });

      const total = await Invitation.count({ where: whereClause });
      const pending = await Invitation.count({ 
        where: { 
          ...whereClause, 
          status: 'pending',
          expiresAt: { [Op.gt]: new Date() }
        } 
      });
      const expired = await Invitation.count({ 
        where: { 
          ...whereClause, 
          status: 'pending',
          expiresAt: { [Op.lt]: new Date() }
        } 
      });

      res.json({
        success: true,
        data: {
          total,
          pending,
          expired,
          accepted: await Invitation.count({ where: { ...whereClause, status: 'accepted' } }),
          cancelled: await Invitation.count({ where: { ...whereClause, status: 'cancelled' } }),
          breakdown: stats
        }
      });
    } catch (error) {
      console.error('Get invitation stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new InvitationController();