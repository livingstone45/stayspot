const { User } = require('../../models');
const { Op } = require('sequelize');
const { Parser } = require('json2csv');

class ManagerVerificationController {
  async getManagerVerifications(req, res) {
    try {
      const { search, status, page = 1, limit = 20 } = req.query;
      const where = { role: 'property_manager' };
      
      if (status) where.verificationStatus = status;
      if (search) {
        where[Op.or] = [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const offset = (page - 1) * limit;
      const { count, rows } = await User.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset,
        raw: true
      });

      const allManagers = await User.findAll({
        where: { role: 'property_manager' },
        attributes: ['verificationStatus'],
        raw: true
      });

      const stats = {
        total: allManagers.length,
        pending: allManagers.filter(m => m.verificationStatus === 'pending').length,
        verified: allManagers.filter(m => m.verificationStatus === 'verified').length,
        rejected: allManagers.filter(m => m.verificationStatus === 'rejected').length,
        underReview: allManagers.filter(m => m.verificationStatus === 'under_review').length
      };

      res.json({
        success: true,
        data: rows,
        stats,
        pagination: { total: count, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(count / limit) }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getManagerVerification(req, res) {
    try {
      const manager = await User.findByPk(req.params.managerId, { raw: true });
      if (!manager || manager.role !== 'property_manager') {
        return res.status(404).json({ error: 'Manager not found' });
      }
      res.json({ success: true, data: manager });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateManagerVerification(req, res) {
    try {
      const { status, notes, verifiedAt } = req.body;
      const manager = await User.findByPk(req.params.managerId);
      
      if (!manager || manager.role !== 'property_manager') {
        return res.status(404).json({ error: 'Manager not found' });
      }

      manager.verificationStatus = status;
      if (notes) manager.verificationNotes = notes;
      if (verifiedAt) manager.verifiedAt = verifiedAt;
      manager.verifiedBy = req.user.id;
      await manager.save();

      res.json({ success: true, message: 'Updated successfully', data: manager });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async exportVerificationReport(req, res) {
    try {
      const { status, format = 'csv' } = req.query;
      const where = { role: 'property_manager' };
      if (status) where.verificationStatus = status;

      const managers = await User.findAll({
        where,
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'verificationStatus', 'verificationNotes', 'createdAt'],
        raw: true
      });

      if (format === 'csv') {
        const fields = ['id', 'firstName', 'lastName', 'email', 'phone', 'verificationStatus', 'verificationNotes', 'createdAt'];
        const parser = new Parser({ fields });
        const csv = parser.parse(managers);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="managers-${new Date().toISOString().split('T')[0]}.csv"`);
        res.send(csv);
      } else {
        res.json({ success: true, data: managers });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getManagerStats(req, res) {
    try {
      const managers = await User.findAll({ where: { role: 'property_manager' }, attributes: ['verificationStatus'], raw: true });
      const stats = {
        total: managers.length,
        pending: managers.filter(m => m.verificationStatus === 'pending').length,
        verified: managers.filter(m => m.verificationStatus === 'verified').length,
        rejected: managers.filter(m => m.verificationStatus === 'rejected').length,
        underReview: managers.filter(m => m.verificationStatus === 'under_review').length
      };
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ManagerVerificationController();
