const { Tenant, User } = require('../../models');
const { Op } = require('sequelize');

class TenantVerificationController {
  async getTenantVerifications(req, res) {
    try {
      const { search, status, sortBy = 'createdAt', sortOrder = 'DESC', page = 1, limit = 20 } = req.query;

      const where = {};
      if (status) where.verificationStatus = status;
      if (search) {
        where[Op.or] = [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await Tenant.findAndCountAll({
        where,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset,
        raw: true
      });

      const allTenants = await Tenant.findAll({
        attributes: ['verificationStatus'],
        raw: true
      });

      const statsMap = {
        total: count,
        pending: 0,
        verified: 0,
        rejected: 0,
        underReview: 0
      };

      allTenants.forEach(tenant => {
        if (tenant.verificationStatus === 'pending') statsMap.pending++;
        else if (tenant.verificationStatus === 'verified') statsMap.verified++;
        else if (tenant.verificationStatus === 'rejected') statsMap.rejected++;
        else if (tenant.verificationStatus === 'under_review') statsMap.underReview++;
      });

      res.json({
        success: true,
        data: rows,
        stats: statsMap,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Get tenant verifications error:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  async getTenantVerification(req, res) {
    try {
      const { tenantId } = req.params;

      const tenant = await Tenant.findByPk(tenantId, { raw: true });

      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }

      res.json({
        success: true,
        data: tenant
      });
    } catch (error) {
      console.error('Get tenant verification error:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  async updateTenantVerification(req, res) {
    try {
      const { tenantId } = req.params;
      const { status, notes, verifiedAt } = req.body;
      const userId = req.user.id;

      const tenant = await Tenant.findByPk(tenantId);
      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }

      tenant.verificationStatus = status;
      if (notes) tenant.verificationNotes = notes;
      if (verifiedAt) tenant.verifiedAt = verifiedAt;
      tenant.verifiedBy = userId;

      await tenant.save();

      res.json({
        success: true,
        message: 'Tenant verification updated successfully',
        data: tenant
      });
    } catch (error) {
      console.error('Update tenant verification error:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  async bulkVerifyTenants(req, res) {
    try {
      const { tenantIds, status, notes } = req.body;
      const userId = req.user.id;

      if (!Array.isArray(tenantIds) || tenantIds.length === 0) {
        return res.status(400).json({ error: 'Tenant IDs array is required' });
      }

      const updated = await Tenant.update(
        {
          verificationStatus: status,
          verificationNotes: notes || null,
          verifiedBy: userId,
          verifiedAt: new Date()
        },
        {
          where: { id: tenantIds }
        }
      );

      res.json({
        success: true,
        message: `Updated ${updated[0]} tenants successfully`,
        data: { updated: updated[0] }
      });
    } catch (error) {
      console.error('Bulk verify tenants error:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  async getVerificationStats(req, res) {
    try {
      const tenants = await Tenant.findAll({
        attributes: ['verificationStatus'],
        raw: true
      });

      const byStatus = {
        pending: 0,
        verified: 0,
        rejected: 0,
        under_review: 0
      };

      tenants.forEach(tenant => {
        if (tenant.verificationStatus in byStatus) {
          byStatus[tenant.verificationStatus]++;
        }
      });

      res.json({
        success: true,
        data: {
          byStatus,
          total: tenants.length
        }
      });
    } catch (error) {
      console.error('Get verification stats error:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  async exportVerificationReport(req, res) {
    try {
      const { status, format = 'csv' } = req.query;

      const where = {};
      if (status) where.verificationStatus = status;

      const tenants = await Tenant.findAll({
        where,
        raw: true
      });

      if (format === 'csv') {
        const csv = [
          ['First Name', 'Last Name', 'Status', 'Type', 'Applied Date', 'Verified Date'],
          ...tenants.map(t => [
            t.firstName,
            t.lastName,
            t.verificationStatus,
            t.verificationType,
            new Date(t.createdAt).toLocaleDateString(),
            t.verifiedAt ? new Date(t.verifiedAt).toLocaleDateString() : ''
          ])
        ].map(row => row.join(',')).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="tenant-verification.csv"');
        res.send(csv);
      } else {
        res.json({
          success: true,
          data: tenants
        });
      }
    } catch (error) {
      console.error('Export verification report error:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}

module.exports = new TenantVerificationController();
