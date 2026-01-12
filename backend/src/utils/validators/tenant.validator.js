const Joi = require('joi');

// Stub validators for tenant module
module.exports = {
  validateTenantCreate: (data) => {
    const schema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string(),
      dateOfBirth: Joi.date(),
      idType: Joi.string(),
      idNumber: Joi.string(),
      unitId: Joi.string().uuid().required()
    });
    return schema.validate(data);
  },
  
  validateLeaseCreate: (data) => {
    const schema = Joi.object({
      tenantId: Joi.string().uuid().required(),
      unitId: Joi.string().uuid().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      rentAmount: Joi.number().required(),
      securityDeposit: Joi.number(),
      terms: Joi.string()
    });
    return schema.validate(data);
  }
};
