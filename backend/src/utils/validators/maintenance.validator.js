const Joi = require('joi');

// Stub validators for maintenance module
module.exports = {
  validateMaintenanceCreate: (data) => {
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
      propertyId: Joi.string().uuid(),
      unitId: Joi.string().uuid(),
      category: Joi.string()
    });
    return schema.validate(data);
  },
  
  validateWorkOrderCreate: (data) => {
    const schema = Joi.object({
      maintenanceRequestId: Joi.string().uuid().required(),
      vendorId: Joi.string().uuid().required(),
      estimatedCost: Joi.number(),
      scheduledDate: Joi.date()
    });
    return schema.validate(data);
  }
};
