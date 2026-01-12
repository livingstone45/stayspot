const Joi = require('joi');

// Stub validators for management module
module.exports = {
  validateCompanyCreate: (data) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email(),
      phone: Joi.string(),
      address: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string(),
      country: Joi.string()
    });
    return schema.validate(data);
  },
  
  validateCompanyUpdate: (data) => {
    const schema = Joi.object({
      name: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string(),
      address: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string(),
      country: Joi.string()
    });
    return schema.validate(data);
  },
  
  validatePortfolioCreate: (data) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      companyId: Joi.string().uuid().required()
    });
    return schema.validate(data);
  }
};
