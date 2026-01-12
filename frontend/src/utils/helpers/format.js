/**
 * Formatting utilities for various data types
 * Provides consistent formatting across the application
 */

/**
 * Currency formatting options
 */
const CURRENCY_OPTIONS = {
  USD: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
  EUR: { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 },
  GBP: { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 },
  CAD: { style: 'currency', currency: 'CAD', minimumFractionDigits: 2 },
  AUD: { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 }
};

/**
 * Number formatting options
 */
const NUMBER_OPTIONS = {
  decimal: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  integer: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
  percentage: { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 2 },
  compact: { notation: 'compact', compactDisplay: 'short' }
};

/**
 * Format currency values
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @param {string} locale - Locale for formatting (default: en-US)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return formatCurrency(0, currency, locale);
  }

  try {
    const options = CURRENCY_OPTIONS[currency] || CURRENCY_OPTIONS.USD;
    return new Intl.NumberFormat(locale, options).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `${currency} ${amount.toFixed(2)}`;
  }
};

/**
 * Format numbers with various options
 * @param {number} number - Number to format
 * @param {string} type - Format type (decimal, integer, percentage, compact)
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, type = 'decimal', locale = 'en-US') => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }

  try {
    const options = NUMBER_OPTIONS[type] || NUMBER_OPTIONS.decimal;
    return new Intl.NumberFormat(locale, options).format(number);
  } catch (error) {
    console.error('Number formatting error:', error);
    return number.toString();
  }
};

/**
 * Format percentage values
 * @param {number} value - Value to format as percentage (0-1 or 0-100)
 * @param {boolean} isDecimal - Whether input is decimal (0-1) or percentage (0-100)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, isDecimal = true, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }

  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Format file sizes
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size string
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes || isNaN(bytes)) return 'Unknown';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${size} ${sizes[i]}`;
};

/**
 * Format phone numbers
 * @param {string} phoneNumber - Phone number to format
 * @param {string} format - Format type (us, international, e164)
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber, format = 'us') => {
  if (!phoneNumber) return '';

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  switch (format) {
    case 'us':
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      } else if (cleaned.length === 11 && cleaned[0] === '1') {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
      }
      break;
    case 'international':
      if (cleaned.length >= 10) {
        return `+${cleaned.slice(0, -10)} ${cleaned.slice(-10, -7)} ${cleaned.slice(-7, -4)} ${cleaned.slice(-4)}`;
      }
      break;
    case 'e164':
      return `+${cleaned}`;
    default:
      return phoneNumber;
  }

  return phoneNumber;
};

/**
 * Format addresses
 * @param {Object} address - Address object
 * @param {string} format - Format type (single-line, multi-line, short)
 * @returns {string} Formatted address string
 */
export const formatAddress = (address, format = 'single-line') => {
  if (!address || typeof address !== 'object') return '';

  const {
    street1,
    street2,
    city,
    state,
    zipCode,
    country,
    unit,
    apartment
  } = address;

  const parts = [];

  // Build address parts
  if (street1) {
    let streetLine = street1;
    if (unit) streetLine += ` Unit ${unit}`;
    if (apartment) streetLine += ` Apt ${apartment}`;
    parts.push(streetLine);
  }

  if (street2) parts.push(street2);

  const cityStateZip = [city, state, zipCode].filter(Boolean).join(', ');
  if (cityStateZip) parts.push(cityStateZip);

  if (country && country !== 'US' && country !== 'USA') {
    parts.push(country);
  }

  switch (format) {
    case 'single-line':
      return parts.join(', ');
    case 'multi-line':
      return parts.join('\n');
    case 'short':
      return [city, state].filter(Boolean).join(', ');
    default:
      return parts.join(', ');
  }
};

/**
 * Format names
 * @param {Object} name - Name object or string
 * @param {string} format - Format type (full, first-last, last-first, initials)
 * @returns {string} Formatted name string
 */
export const formatName = (name, format = 'full') => {
  if (!name) return '';

  if (typeof name === 'string') {
    return name.trim();
  }

  const { firstName, lastName, middleName, prefix, suffix } = name;

  switch (format) {
    case 'full':
      return [prefix, firstName, middleName, lastName, suffix]
        .filter(Boolean)
        .join(' ');
    case 'first-last':
      return [firstName, lastName].filter(Boolean).join(' ');
    case 'last-first':
      return [lastName, firstName].filter(Boolean).join(', ');
    case 'initials':
      const initials = [firstName, middleName, lastName]
        .filter(Boolean)
        .map(n => n.charAt(0).toUpperCase())
        .join('');
      return initials;
    default:
      return [firstName, lastName].filter(Boolean).join(' ');
  }
};

/**
 * Format text with various transformations
 * @param {string} text - Text to format
 * @param {string} format - Format type
 * @returns {string} Formatted text
 */
export const formatText = (text, format) => {
  if (!text || typeof text !== 'string') return '';

  switch (format) {
    case 'title':
      return text.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    case 'sentence':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'camel':
      return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      ).replace(/\s+/g, '');
    case 'pascal':
      return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) =>
        word.toUpperCase()
      ).replace(/\s+/g, '');
    case 'kebab':
      return text.toLowerCase().replace(/\s+/g, '-');
    case 'snake':
      return text.toLowerCase().replace(/\s+/g, '_');
    case 'truncate':
      return text.length > 50 ? `${text.substring(0, 47)}...` : text;
    default:
      return text;
  }
};

/**
 * Format duration in various units
 * @param {number} duration - Duration in milliseconds
 * @param {string} format - Format type (short, long, precise)
 * @returns {string} Formatted duration string
 */
export const formatDuration = (duration, format = 'short') => {
  if (!duration || duration < 0) return '0s';

  const units = [
    { label: 'year', labelShort: 'y', value: 365 * 24 * 60 * 60 * 1000 },
    { label: 'month', labelShort: 'mo', value: 30 * 24 * 60 * 60 * 1000 },
    { label: 'day', labelShort: 'd', value: 24 * 60 * 60 * 1000 },
    { label: 'hour', labelShort: 'h', value: 60 * 60 * 1000 },
    { label: 'minute', labelShort: 'm', value: 60 * 1000 },
    { label: 'second', labelShort: 's', value: 1000 }
  ];

  const parts = [];
  let remaining = duration;

  for (const unit of units) {
    const count = Math.floor(remaining / unit.value);
    if (count > 0) {
      const label = format === 'short' ? unit.labelShort : unit.label;
      const plural = format !== 'short' && count > 1 ? 's' : '';
      parts.push(`${count}${format === 'short' ? '' : ' '}${label}${plural}`);
      remaining -= count * unit.value;

      if (format !== 'precise' && parts.length >= 2) break;
    }
  }

  return parts.length > 0 ? parts.join(format === 'short' ? ' ' : ', ') : '0s';
};

/**
 * Format relative time (time ago)
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale for formatting
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date, locale = 'en-US') => {
  if (!date) return '';

  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now - targetDate) / 1000);

  if (isNaN(diffInSeconds)) return '';

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const intervals = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
    if (count >= 1) {
      return rtf.format(diffInSeconds < 0 ? count : -count, interval.unit);
    }
  }

  return rtf.format(0, 'second');
};

/**
 * Format lists with proper conjunctions
 * @param {Array} items - Array of items to format
 * @param {string} conjunction - Conjunction to use (and, or)
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted list string
 */
export const formatList = (items, conjunction = 'and', locale = 'en-US') => {
  if (!Array.isArray(items) || items.length === 0) return '';

  const filteredItems = items.filter(Boolean);

  if (filteredItems.length === 0) return '';
  if (filteredItems.length === 1) return filteredItems[0].toString();

  try {
    const listFormatter = new Intl.ListFormat(locale, {
      style: 'long',
      type: conjunction === 'or' ? 'disjunction' : 'conjunction'
    });
    return listFormatter.format(filteredItems.map(item => item.toString()));
  } catch (error) {
    // Fallback for unsupported browsers
    if (filteredItems.length === 2) {
      return `${filteredItems[0]} ${conjunction} ${filteredItems[1]}`;
    }
    const lastItem = filteredItems.pop();
    return `${filteredItems.join(', ')}, ${conjunction} ${lastItem}`;
  }
};

/**
 * Format property status with proper styling
 * @param {string} status - Property status
 * @returns {Object} Status with label and color
 */
export const formatPropertyStatus = (status) => {
  const statusMap = {
    available: { label: 'Available', color: 'green' },
    occupied: { label: 'Occupied', color: 'blue' },
    maintenance: { label: 'Under Maintenance', color: 'yellow' },
    unavailable: { label: 'Unavailable', color: 'red' },
    pending: { label: 'Pending', color: 'orange' },
    draft: { label: 'Draft', color: 'gray' }
  };

  return statusMap[status?.toLowerCase()] || { label: status || 'Unknown', color: 'gray' };
};

/**
 * Format lease status with proper styling
 * @param {string} status - Lease status
 * @returns {Object} Status with label and color
 */
export const formatLeaseStatus = (status) => {
  const statusMap = {
    active: { label: 'Active', color: 'green' },
    pending: { label: 'Pending', color: 'yellow' },
    expired: { label: 'Expired', color: 'red' },
    terminated: { label: 'Terminated', color: 'gray' },
    renewed: { label: 'Renewed', color: 'blue' },
    draft: { label: 'Draft', color: 'orange' }
  };

  return statusMap[status?.toLowerCase()] || { label: status || 'Unknown', color: 'gray' };
};

/**
 * Format payment status with proper styling
 * @param {string} status - Payment status
 * @returns {Object} Status with label and color
 */
export const formatPaymentStatus = (status) => {
  const statusMap = {
    paid: { label: 'Paid', color: 'green' },
    pending: { label: 'Pending', color: 'yellow' },
    overdue: { label: 'Overdue', color: 'red' },
    partial: { label: 'Partial', color: 'orange' },
    failed: { label: 'Failed', color: 'red' },
    refunded: { label: 'Refunded', color: 'gray' }
  };

  return statusMap[status?.toLowerCase()] || { label: status || 'Unknown', color: 'gray' };
};

/**
 * Format maintenance priority with proper styling
 * @param {string} priority - Maintenance priority
 * @returns {Object} Priority with label and color
 */
export const formatMaintenancePriority = (priority) => {
  const priorityMap = {
    low: { label: 'Low', color: 'green' },
    medium: { label: 'Medium', color: 'yellow' },
    high: { label: 'High', color: 'orange' },
    urgent: { label: 'Urgent', color: 'red' },
    emergency: { label: 'Emergency', color: 'red' }
  };

  return priorityMap[priority?.toLowerCase()] || { label: priority || 'Unknown', color: 'gray' };
};

/**
 * Format user role with proper display name
 * @param {string} role - User role
 * @returns {string} Formatted role name
 */
export const formatUserRole = (role) => {
  const roleMap = {
    system_admin: 'System Administrator',
    company_admin: 'Company Administrator',
    company_owner: 'Company Owner',
    portfolio_manager: 'Portfolio Manager',
    property_manager: 'Property Manager',
    leasing_specialist: 'Leasing Specialist',
    maintenance_supervisor: 'Maintenance Supervisor',
    marketing_specialist: 'Marketing Specialist',
    financial_controller: 'Financial Controller',
    landlord: 'Landlord',
    tenant: 'Tenant',
    vendor: 'Vendor',
    inspector: 'Inspector',
    accountant: 'Accountant'
  };

  return roleMap[role?.toLowerCase()] || formatText(role || 'Unknown', 'title');
};

/**
 * Sanitize and format HTML content
 * @param {string} html - HTML content to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized HTML
 */
export const formatSafeHTML = (html, options = {}) => {
  if (!html || typeof html !== 'string') return '';

  const {
    allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li'],
    stripTags = false
  } = options;

  if (stripTags) {
    return html.replace(/<[^>]*>/g, '');
  }

  // Basic HTML sanitization (for production, use a proper library like DOMPurify)
  const tagRegex = /<(\/?)([\w-]+)([^>]*)>/gi;
  
  return html.replace(tagRegex, (match, closing, tagName, attributes) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      return match;
    }
    return '';
  });
};

// Export all formatting functions
export default {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatFileSize,
  formatPhoneNumber,
  formatAddress,
  formatName,
  formatText,
  formatDuration,
  formatRelativeTime,
  formatList,
  formatPropertyStatus,
  formatLeaseStatus,
  formatPaymentStatus,
  formatMaintenancePriority,
  formatUserRole,
  formatSafeHTML
};