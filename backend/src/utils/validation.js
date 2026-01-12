const validator = require('validator');

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  return validator.isEmail(email);
};

/**
 * Validate phone number
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate password strength
 */
const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate URL format
 */
const isValidURL = (url) => {
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true
  });
};

/**
 * Validate UUID format
 */
const isValidUUID = (uuid) => {
  return validator.isUUID(uuid, 4);
};

/**
 * Validate date format
 */
const isValidDate = (date) => {
  return validator.isISO8601(date);
};

/**
 * Validate postal code
 */
const isValidPostalCode = (code, locale = 'US') => {
  return validator.isPostalCode(code, locale);
};

/**
 * Sanitize HTML input
 */
const sanitizeHTML = (html) => {
  return validator.escape(html);
};

/**
 * Validate file extension
 */
const isValidFileExtension = (filename, allowedExtensions) => {
  const ext = filename.split('.').pop().toLowerCase();
  return allowedExtensions.includes(ext);
};

/**
 * Validate file size
 */
const isValidFileSize = (size, maxSize) => {
  return size <= maxSize;
};

/**
 * Validate property address
 */
const validateAddress = (address) => {
  const errors = [];
  
  if (!address.street || address.street.length < 5) {
    errors.push('Street address must be at least 5 characters');
  }
  
  if (!address.city || address.city.length < 2) {
    errors.push('City is required');
  }
  
  if (!address.state || address.state.length !== 2) {
    errors.push('State must be 2 characters');
  }
  
  if (!address.zipCode || !isValidPostalCode(address.zipCode)) {
    errors.push('Valid zip code is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate user registration data
 */
const validateUserRegistration = (userData) => {
  const errors = [];
  
  if (!userData.firstName || userData.firstName.length < 2) {
    errors.push('First name must be at least 2 characters');
  }
  
  if (!userData.lastName || userData.lastName.length < 2) {
    errors.push('Last name must be at least 2 characters');
  }
  
  if (!isValidEmail(userData.email)) {
    errors.push('Valid email is required');
  }
  
  if (!isValidPassword(userData.password)) {
    errors.push('Password must be at least 8 characters with uppercase, lowercase, and number');
  }
  
  if (userData.phone && !isValidPhone(userData.phone)) {
    errors.push('Valid phone number is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate property data
 */
const validateProperty = (propertyData) => {
  const errors = [];
  
  if (!propertyData.name || propertyData.name.length < 3) {
    errors.push('Property name must be at least 3 characters');
  }
  
  if (!propertyData.type) {
    errors.push('Property type is required');
  }
  
  if (propertyData.monthlyRent && propertyData.monthlyRent < 0) {
    errors.push('Monthly rent must be positive');
  }
  
  if (propertyData.totalUnits && propertyData.totalUnits < 1) {
    errors.push('Total units must be at least 1');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidURL,
  isValidUUID,
  isValidDate,
  isValidPostalCode,
  sanitizeHTML,
  isValidFileExtension,
  isValidFileSize,
  validateAddress,
  validateUserRegistration,
  validateProperty
};