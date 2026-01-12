const { User } = require('../../models');
const { Op } = require('sequelize');
const { Parser } = require('json2csv');

class LandlordVerificationController {
  async getLandlordVerifications(req, res) {
    try {
      const { search, status, page = 1, limit = 20 } = req.query;
      const where = { role: 'landlord' };
      
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

      const allLandlords = await User.findAll({
        where: { role: 'landlord' },
        attributes: ['verificationStatus'],
        raw: true
      });

      const stats = {
        total: allLandlords.length,
        pending: allLandlords.filter(l => l.verificationStatus === 'pending').length,
        verified: allLandlords.filter(l => l.verificationStatus === 'verified').length,
        rejected: allLandlords.filter(l => l.verificationStatus === 'rejected').length,
        underReview: allLandlords.filter(l => l.verificationStatus === 'under_review').length
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

  async getLandlordVerification(req, res) {
    try {
      const landlord = await User.findByPk(req.params.landlordId, { raw: true });
      if (!landlord || landlord.role !== 'landlord') {
        return res.status(404).json({ error: 'Landlord not found' });
      }
      res.json({ success: true, data: landlord });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateLandlordVerification(req, res) {
    try {
      const { status, notes, verifiedAt } = req.body;
      const landlord = await User.findByPk(req.params.landlordId);
      
      if (!landlord || landlord.role !== 'landlord') {
        return res.status(404).json({ error: 'Landlord not found' });
      }

      landlord.verificationStatus = status;
      if (notes) landlord.verificationNotes = notes;
      if (verifiedAt) landlord.verifiedAt = verifiedAt;
      landlord.verifiedBy = req.user.id;
      await landlord.save();

      res.json({ success: true, message: 'Updated successfully', data: landlord });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async bulkVerifyLandlords(req, res) {
    try {
      const { landlordIds, status, notes } = req.body;
      await User.update(
        { verificationStatus: status, verificationNotes: notes || null, verifiedBy: req.user.id, verifiedAt: new Date() },
        { where: { id: { [Op.in]: landlordIds }, role: 'landlord' } }
      );
      res.json({ success: true, message: 'Updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getLandlordStats(req, res) {
    try {
      const landlords = await User.findAll({ where: { role: 'landlord' }, attributes: ['verificationStatus'], raw: true });
      const stats = {
        total: landlords.length,
        pending: landlords.filter(l => l.verificationStatus === 'pending').length,
        verified: landlords.filter(l => l.verificationStatus === 'verified').length,
        rejected: landlords.filter(l => l.verificationStatus === 'rejected').length,
        underReview: landlords.filter(l => l.verificationStatus === 'under_review').length
      };
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async exportVerificationReport(req, res) {
    try {
      const { status, format = 'csv' } = req.query;
      const where = { role: 'landlord' };
      if (status) where.verificationStatus = status;

      const landlords = await User.findAll({
        where,
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'verificationStatus', 'verificationNotes', 'createdAt'],
        raw: true
      });

      if (format === 'csv') {
        const fields = ['id', 'firstName', 'lastName', 'email', 'phone', 'verificationStatus', 'verificationNotes', 'createdAt'];
        const parser = new Parser({ fields });
        const csv = parser.parse(landlords);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="landlords-${new Date().toISOString().split('T')[0]}.csv"`);
        res.send(csv);
      } else {
        res.json({ success: true, data: landlords });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new LandlordVerificationController();
