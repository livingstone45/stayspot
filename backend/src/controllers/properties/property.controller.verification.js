const { Property, User, AuditLog } = require('../../models');
const { ROLES } = require('../../constants');

class PropertyVerificationController {
  /**
   * Verify Property
   */
  async verifyProperty(req, res) {
    try {
      const { id: propertyId } = req.params;
      const { verificationStatus, notes } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      const canVerify = userRoles.includes(ROLES.SYSTEM_ADMIN) || userRoles.includes(ROLES.COMPANY_ADMIN);
      if (!canVerify) {
        return res.status(403).json({ error: 'Not authorized to verify properties' });
      }

      const property = await Property.findByPk(propertyId);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      property.verificationStatus = verificationStatus;
      property.verificationNotes = notes || null;
      property.verifiedBy = userId;
      property.verifiedAt = new Date();
      await property.save();

      await AuditLog.create({
        userId,
        action: 'PROPERTY_VERIFIED',
        details: `Property ${verificationStatus}: ${property.name}`,
        ipAddress: req.ip,
        metadata: { propertyId, verificationStatus, notes }
      });

      res.json({
        success: true,
        message: `Property ${verificationStatus} successfully`,
        data: {
          id: property.id,
          name: property.name,
          verificationStatus: property.verificationStatus,
          verifiedAt: property.verifiedAt
        }
      });
    } catch (error) {
      console.error('Verify property error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Pending Verification Properties
   */
  async getPendingVerification(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      const canVerify = userRoles.includes(ROLES.SYSTEM_ADMIN) || userRoles.includes(ROLES.COMPANY_ADMIN);
      if (!canVerify) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      let whereClause = { verificationStatus: 'pending' };
      if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        whereClause.companyId = user.companyId;
      }

      const { count, rows: properties } = await Property.findAndCountAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: properties,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Get pending verification error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Verification Status
   */
  async getVerificationStatus(req, res) {
    try {
      const { id: propertyId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const property = await Property.findByPk(propertyId, {
        attributes: ['id', 'name', 'verificationStatus', 'verificationNotes', 'verifiedAt', 'verifiedBy'],
        include: [{
          model: User,
          as: 'VerifiedBy',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          required: false
        }]
      });

      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      res.json({
        success: true,
        data: {
          id: property.id,
          name: property.name,
          verificationStatus: property.verificationStatus || 'pending',
          verificationNotes: property.verificationNotes,
          verifiedAt: property.verifiedAt,
          verifiedBy: property.VerifiedBy ? {
            id: property.VerifiedBy.id,
            name: `${property.VerifiedBy.firstName} ${property.VerifiedBy.lastName}`,
            email: property.VerifiedBy.email
          } : null
        }
      });
    } catch (error) {
      console.error('Get verification status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Check property access helper
   */
  async checkPropertyAccess(propertyId, userId, userRoles) {
    try {
      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return true;
      }

      if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        const property = await Property.findByPk(propertyId);
        return user.companyId === property.companyId;
      }

      if (userRoles.includes(ROLES.LANDLORD)) {
        const property = await Property.findByPk(propertyId);
        return property.ownerId === userId;
      }

      return false;
    } catch (error) {
      console.error('Check access error:', error);
      return false;
    }
  }
}

module.exports = new PropertyVerificationController();
