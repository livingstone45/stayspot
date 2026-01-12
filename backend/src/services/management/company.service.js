const { Company, User, Property, Portfolio } = require('../../models');
const { Op } = require('sequelize');

class CompanyService {
  async createCompany(companyData) {
    const { name, type, description, email, phone, website, address, ownerId } = companyData;

    const existingCompany = await Company.findOne({ where: { email } });
    if (existingCompany) {
      throw new Error('Company with this email already exists');
    }

    const company = await Company.create({
      name,
      type,
      description,
      email,
      phone,
      website,
      address: address.street,
      city: address.city,
      state: address.state,
      zip_code: address.zipCode,
      country: address.country || 'US',
      owner_id: ownerId,
      status: 'active'
    });

    return company;
  }

  async getCompany(companyId) {
    return await Company.findByPk(companyId, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Property, as: 'properties' },
        { model: Portfolio, as: 'portfolios' }
      ]
    });
  }

  async updateCompany(companyId, updateData) {
    const company = await Company.findByPk(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    return await company.update(updateData);
  }

  async deleteCompany(companyId) {
    const company = await Company.findByPk(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    // Check if company has properties
    const propertyCount = await Property.count({ where: { company_id: companyId } });
    if (propertyCount > 0) {
      throw new Error('Cannot delete company with existing properties');
    }

    await company.destroy();
    return { success: true };
  }

  async getCompanies(filters = {}) {
    const { type, status, limit = 50, offset = 0, search } = filters;
    
    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    return await Company.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        { model: User, as: 'owner', attributes: ['id', 'first_name', 'last_name'] }
      ]
    });
  }

  async getCompanyStats(companyId) {
    const [properties, users, portfolios] = await Promise.all([
      Property.count({ where: { company_id: companyId } }),
      User.count({ where: { company_id: companyId } }),
      Portfolio.count({ where: { company_id: companyId } })
    ]);

    const totalUnits = await Property.sum('total_units', { where: { company_id: companyId } }) || 0;
    const occupiedUnits = await Property.sum('occupied_units', { where: { company_id: companyId } }) || 0;

    return {
      totalProperties: properties,
      totalUsers: users,
      totalPortfolios: portfolios,
      totalUnits,
      occupiedUnits,
      occupancyRate: totalUnits > 0 ? (occupiedUnits / totalUnits * 100) : 0
    };
  }

  async getCompanyUsers(companyId, filters = {}) {
    const { role, status, limit = 50, offset = 0 } = filters;
    
    const where = { company_id: companyId };
    if (status) where.status = status;

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

  async addUserToCompany(companyId, userId, roleId) {
    const [company, user] = await Promise.all([
      Company.findByPk(companyId),
      User.findByPk(userId)
    ]);

    if (!company || !user) {
      throw new Error('Company or user not found');
    }

    await user.update({ company_id: companyId });

    if (roleId) {
      await UserRole.create({
        user_id: userId,
        role_id: roleId
      });
    }

    return { success: true };
  }

  async removeUserFromCompany(companyId, userId) {
    const user = await User.findOne({
      where: { id: userId, company_id: companyId }
    });

    if (!user) {
      throw new Error('User not found in company');
    }

    await user.update({ company_id: null });
    return { success: true };
  }

  async updateCompanySettings(companyId, settings) {
    const company = await Company.findByPk(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    const currentSettings = company.settings || {};
    const updatedSettings = { ...currentSettings, ...settings };

    return await company.update({ settings: updatedSettings });
  }

  async getCompanySettings(companyId) {
    const company = await Company.findByPk(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    return company.settings || {};
  }

  async activateCompany(companyId) {
    const company = await Company.findByPk(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    return await company.update({ status: 'active' });
  }

  async deactivateCompany(companyId) {
    const company = await Company.findByPk(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    return await company.update({ status: 'inactive' });
  }
}

module.exports = new CompanyService();