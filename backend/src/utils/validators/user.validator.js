const Joi = require('joi');
const { UserStatus, UserRole } = require('../constants/roles');

const userSchema = Joi.object({
  firstName: Joi.string().required().min(2).max(50).pattern(/^[a-zA-Z\s\-']+$/)
    .messages({
      'string.pattern.base': 'First name can only contain letters, spaces, hyphens, and apostrophes'
    }),
  
  lastName: Joi.string().required().min(2).max(50).pattern(/^[a-zA-Z\s\-']+$/)
    .messages({
      'string.pattern.base': 'Last name can only contain letters, spaces, hyphens, and apostrophes'
    }),
  
  email: Joi.string().required().email().lowercase()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  
  password: Joi.string().required().min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
  
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    .messages({
      'any.only': 'Passwords do not match'
    }),
  
  roleId: Joi.number().integer().min(1),
  
  status: Joi.string().valid(...Object.values(UserStatus)).default(UserStatus.ACTIVE),
  
  companyId: Joi.number().integer().min(1),
  
  profile: Joi.object({
    avatar: Joi.string().uri(),
    bio: Joi.string().max(500),
    skills: Joi.array().items(Joi.string()),
    certifications: Joi.array().items(Joi.string()),
    emergencyContact: Joi.object({
      name: Joi.string(),
      phone: Joi.string(),
      relationship: Joi.string()
    })
  }),
  
  settings: Joi.object({
    notifications: Joi.object({
      email: Joi.boolean().default(true),
      sms: Joi.boolean().default(false),
      push: Joi.boolean().default(true)
    }),
    language: Joi.string().default('en'),
    timezone: Joi.string().default('UTC')
  }),
  
  metadata: Joi.object()
});

const userUpdateSchema = userSchema.fork(
  ['password', 'confirmPassword'],
  (schema) => schema.optional()
).fork(
  ['email', 'firstName', 'lastName'],
  (schema) => schema.optional()
);

const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required()
});

const invitationSchema = Joi.object({
  email: Joi.string().required().email(),
  roleId: Joi.number().integer().min(1).required(),
  companyId: Joi.number().integer().min(1),
  portfolioId: Joi.number().integer().min(1),
  permissions: Joi.array().items(Joi.string()),
  expiresIn: Joi.number().integer().min(1).max(30).default(7), // days
  customMessage: Joi.string().max(500)
});

const passwordResetSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required().min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
});

const validateUser = (data) => {
  return userSchema.validate(data, { abortEarly: false });
};

const validateUserUpdate = (data) => {
  return userUpdateSchema.validate(data, { abortEarly: false });
};

const validateLogin = (data) => {
  return loginSchema.validate(data, { abortEarly: false });
};

const validateInvitation = (data) => {
  return invitationSchema.validate(data, { abortEarly: false });
};

const validatePasswordReset = (data) => {
  return passwordResetSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateUser,
  validateUserUpdate,
  validateLogin,
  validateInvitation,
  validatePasswordReset,
  userSchema,
  loginSchema
};