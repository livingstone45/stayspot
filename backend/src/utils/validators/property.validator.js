const Joi = require('joi');
const { PropertyType, PropertyStatus, RentalType } = require('../constants/status');

const propertySchema = Joi.object({
  name: Joi.string().required().min(3).max(200).messages({
    'string.empty': 'Property name is required',
    'string.min': 'Property name must be at least 3 characters',
    'string.max': 'Property name cannot exceed 200 characters'
  }),
  
  description: Joi.string().required().min(10).max(5000).messages({
    'string.empty': 'Property description is required',
    'string.min': 'Description must be at least 10 characters',
    'string.max': 'Description cannot exceed 5000 characters'
  }),
  
  type: Joi.string().valid(...Object.values(PropertyType)).required()
    .messages({
      'any.only': `Property type must be one of: ${Object.values(PropertyType).join(', ')}`
    }),
  
  rentalType: Joi.string().valid(...Object.values(RentalType)).required()
    .messages({
      'any.only': `Rental type must be one of: ${Object.values(RentalType).join(', ')}`
    }),
  
  status: Joi.string().valid(...Object.values(PropertyStatus)).default(PropertyStatus.ACTIVE)
    .messages({
      'any.only': `Status must be one of: ${Object.values(PropertyStatus).join(', ')}`
    }),
  
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    postalCode: Joi.string().required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required()
  }).required(),
  
  price: Joi.object({
    amount: Joi.number().min(0).required(),
    currency: Joi.string().default('USD'),
    period: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').default('monthly')
  }).required(),
  
  size: Joi.object({
    area: Joi.number().min(0).required(),
    unit: Joi.string().valid('sqft', 'sqm').default('sqft'),
    bedrooms: Joi.number().integer().min(0).required(),
    bathrooms: Joi.number().min(0).required(),
    yearBuilt: Joi.number().integer().min(1800).max(new Date().getFullYear())
  }),
  
  amenities: Joi.array().items(Joi.string()),
  
  rules: Joi.array().items(Joi.string()),
  
  companyId: Joi.number().integer().min(1),
  portfolioId: Joi.number().integer().min(1),
  ownerId: Joi.number().integer().min(1),
  
  features: Joi.object({
    hasParking: Joi.boolean().default(false),
    hasPool: Joi.boolean().default(false),
    hasGym: Joi.boolean().default(false),
    hasSecurity: Joi.boolean().default(false),
    isFurnished: Joi.boolean().default(false),
    allowsPets: Joi.boolean().default(false),
    allowsSmoking: Joi.boolean().default(false),
    hasElevator: Joi.boolean().default(false),
    hasWifi: Joi.boolean().default(false),
    hasAirConditioning: Joi.boolean().default(false)
  }),
  
  metadata: Joi.object()
});

const propertyUpdateSchema = propertySchema.fork(
  ['name', 'description', 'type', 'rentalType', 'address', 'price'],
  (schema) => schema.optional()
);

const propertyBulkUploadSchema = Joi.array().items(
  propertySchema.keys({
    units: Joi.array().items(Joi.object({
      unitNumber: Joi.string().required(),
      size: Joi.object({
        area: Joi.number().min(0).required(),
        bedrooms: Joi.number().integer().min(0),
        bathrooms: Joi.number().min(0)
      }),
      price: Joi.object({
        amount: Joi.number().min(0).required(),
        currency: Joi.string().default('USD')
      })
    }))
  })
).min(1).max(100);

const validateProperty = (data) => {
  return propertySchema.validate(data, { abortEarly: false });
};

const validatePropertyUpdate = (data) => {
  return propertyUpdateSchema.validate(data, { abortEarly: false });
};

const validatePropertyBulkUpload = (data) => {
  return propertyBulkUploadSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateProperty,
  validatePropertyUpdate,
  validatePropertyBulkUpload,
  propertySchema
};