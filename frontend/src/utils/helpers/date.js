/**
 * Date utilities for formatting, manipulation, and calculations
 * Provides comprehensive date handling functions
 */

/**
 * Date format patterns
 */
const DATE_FORMATS = {
  ISO: 'YYYY-MM-DD',
  US: 'MM/DD/YYYY',
  EU: 'DD/MM/YYYY',
  LONG: 'MMMM DD, YYYY',
  SHORT: 'MMM DD, YYYY',
  TIME_12: 'hh:mm A',
  TIME_24: 'HH:mm',
  DATETIME_12: 'MM/DD/YYYY hh:mm A',
  DATETIME_24: 'MM/DD/YYYY HH:mm',
  FULL: 'dddd, MMMM DD, YYYY',
  RELATIVE: 'relative'
};

/**
 * Month names
 */
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Day names
 */
const DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Format date according to specified format
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Format pattern
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = DATE_FORMATS.US, options = {}) => {
  if (!date) return '';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  const { locale = 'en-US', timezone } = options;

  // Handle relative formatting
  if (format === DATE_FORMATS.RELATIVE) {
    return formatRelativeDate(dateObj, options);
  }

  // Use Intl.DateTimeFormat for locale-aware formatting
  try {
    const formatOptions = getIntlFormatOptions(format, timezone);
    return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateObj.toLocaleDateString();
  }
};

/**
 * Format time according to specified format
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Time format (12 or 24 hour)
 * @param {Object} options - Formatting options
 * @returns {string} Formatted time string
 */
export const formatTime = (date, format = '12', options = {}) => {
  if (!date) return '';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  const { locale = 'en-US', timezone, showSeconds = false } = options;

  const formatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: format === '12',
    timeZone: timezone
  };

  if (showSeconds) {
    formatOptions.second = '2-digit';
  }

  try {
    return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
  } catch (error) {
    console.error('Time formatting error:', error);
    return dateObj.toLocaleTimeString();
  }
};

/**
 * Format datetime according to specified format
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (date, options = {}) => {
  if (!date) return '';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  const {
    locale = 'en-US',
    timezone,
    dateStyle = 'medium',
    timeStyle = 'short',
    hour12 = true
  } = options;

  const formatOptions = {
    dateStyle,
    timeStyle,
    hour12,
    timeZone: timezone
  };

  try {
    return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
  } catch (error) {
    console.error('DateTime formatting error:', error);
    return dateObj.toLocaleString();
  }
};

/**
 * Format relative date (e.g., "2 days ago", "in 3 hours")
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Relative date string
 */
export const formatRelativeDate = (date, options = {}) => {
  if (!date) return '';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  const { locale = 'en-US', now = new Date() } = options;
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  try {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    const intervals = [
      { unit: 'year', seconds: 31536000 },
      { unit: 'month', seconds: 2592000 },
      { unit: 'week', seconds: 604800 },
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
  } catch (error) {
    console.error('Relative date formatting error:', error);
    return dateObj.toLocaleDateString();
  }
};

/**
 * Parse date from various formats
 * @param {string} dateString - Date string to parse
 * @param {string} format - Expected format
 * @returns {Date|null} Parsed date or null if invalid
 */
export const parseDate = (dateString, format = 'auto') => {
  if (!dateString) return null;

  // Auto-detect format
  if (format === 'auto') {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  // Parse specific formats
  try {
    switch (format) {
      case 'ISO':
        return new Date(dateString);
      case 'US':
        return parseUSDate(dateString);
      case 'EU':
        return parseEUDate(dateString);
      default:
        return new Date(dateString);
    }
  } catch (error) {
    console.error('Date parsing error:', error);
    return null;
  }
};

/**
 * Add time to a date
 * @param {Date|string|number} date - Base date
 * @param {number} amount - Amount to add
 * @param {string} unit - Time unit (years, months, days, hours, minutes, seconds)
 * @returns {Date} New date with added time
 */
export const addTime = (date, amount, unit) => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return new Date();

  const newDate = new Date(dateObj);

  switch (unit) {
    case 'years':
      newDate.setFullYear(newDate.getFullYear() + amount);
      break;
    case 'months':
      newDate.setMonth(newDate.getMonth() + amount);
      break;
    case 'weeks':
      newDate.setDate(newDate.getDate() + (amount * 7));
      break;
    case 'days':
      newDate.setDate(newDate.getDate() + amount);
      break;
    case 'hours':
      newDate.setHours(newDate.getHours() + amount);
      break;
    case 'minutes':
      newDate.setMinutes(newDate.getMinutes() + amount);
      break;
    case 'seconds':
      newDate.setSeconds(newDate.getSeconds() + amount);
      break;
    default:
      console.warn(`Unknown time unit: ${unit}`);
  }

  return newDate;
};

/**
 * Subtract time from a date
 * @param {Date|string|number} date - Base date
 * @param {number} amount - Amount to subtract
 * @param {string} unit - Time unit
 * @returns {Date} New date with subtracted time
 */
export const subtractTime = (date, amount, unit) => {
  return addTime(date, -amount, unit);
};

/**
 * Calculate difference between two dates
 * @param {Date|string|number} date1 - First date
 * @param {Date|string|number} date2 - Second date
 * @param {string} unit - Unit for result (years, months, days, hours, minutes, seconds, milliseconds)
 * @returns {number} Difference in specified unit
 */
export const dateDifference = (date1, date2, unit = 'days') => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;

  const diffInMs = Math.abs(d2 - d1);

  switch (unit) {
    case 'years':
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25));
    case 'months':
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30.44));
    case 'weeks':
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    case 'days':
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    case 'hours':
      return Math.floor(diffInMs / (1000 * 60 * 60));
    case 'minutes':
      return Math.floor(diffInMs / (1000 * 60));
    case 'seconds':
      return Math.floor(diffInMs / 1000);
    case 'milliseconds':
      return diffInMs;
    default:
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  }
};

/**
 * Check if a date is between two other dates
 * @param {Date|string|number} date - Date to check
 * @param {Date|string|number} startDate - Start date
 * @param {Date|string|number} endDate - End date
 * @param {boolean} inclusive - Whether to include boundary dates
 * @returns {boolean} Whether date is between start and end dates
 */
export const isDateBetween = (date, startDate, endDate, inclusive = true) => {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(d.getTime()) || isNaN(start.getTime()) || isNaN(end.getTime())) {
    return false;
  }

  if (inclusive) {
    return d >= start && d <= end;
  } else {
    return d > start && d < end;
  }
};

/**
 * Check if a date is today
 * @param {Date|string|number} date - Date to check
 * @returns {boolean} Whether date is today
 */
export const isToday = (date) => {
  const d = new Date(date);
  const today = new Date();

  return d.toDateString() === today.toDateString();
};

/**
 * Check if a date is yesterday
 * @param {Date|string|number} date - Date to check
 * @returns {boolean} Whether date is yesterday
 */
export const isYesterday = (date) => {
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return d.toDateString() === yesterday.toDateString();
};

/**
 * Check if a date is tomorrow
 * @param {Date|string|number} date - Date to check
 * @returns {boolean} Whether date is tomorrow
 */
export const isTomorrow = (date) => {
  const d = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return d.toDateString() === tomorrow.toDateString();
};

/**
 * Check if a date is in the current week
 * @param {Date|string|number} date - Date to check
 * @param {number} startOfWeek - Day of week that starts the week (0 = Sunday, 1 = Monday)
 * @returns {boolean} Whether date is in current week
 */
export const isThisWeek = (date, startOfWeek = 0) => {
  const d = new Date(date);
  const today = new Date();

  const startOfCurrentWeek = getStartOfWeek(today, startOfWeek);
  const endOfCurrentWeek = new Date(startOfCurrentWeek);
  endOfCurrentWeek.setDate(endOfCurrentWeek.getDate() + 6);

  return isDateBetween(d, startOfCurrentWeek, endOfCurrentWeek);
};

/**
 * Check if a date is in the current month
 * @param {Date|string|number} date - Date to check
 * @returns {boolean} Whether date is in current month
 */
export const isThisMonth = (date) => {
  const d = new Date(date);
  const today = new Date();

  return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
};

/**
 * Check if a date is in the current year
 * @param {Date|string|number} date - Date to check
 * @returns {boolean} Whether date is in current year
 */
export const isThisYear = (date) => {
  const d = new Date(date);
  const today = new Date();

  return d.getFullYear() === today.getFullYear();
};

/**
 * Get start of day
 * @param {Date|string|number} date - Date
 * @returns {Date} Start of day
 */
export const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day
 * @param {Date|string|number} date - Date
 * @returns {Date} End of day
 */
export const getEndOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get start of week
 * @param {Date|string|number} date - Date
 * @param {number} startOfWeek - Day of week that starts the week (0 = Sunday, 1 = Monday)
 * @returns {Date} Start of week
 */
export const getStartOfWeek = (date, startOfWeek = 0) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day < startOfWeek ? 7 : 0) + day - startOfWeek;
  
  d.setDate(d.getDate() - diff);
  return getStartOfDay(d);
};

/**
 * Get end of week
 * @param {Date|string|number} date - Date
 * @param {number} startOfWeek - Day of week that starts the week
 * @returns {Date} End of week
 */
export const getEndOfWeek = (date, startOfWeek = 0) => {
  const startOfWeekDate = getStartOfWeek(date, startOfWeek);
  const endOfWeekDate = new Date(startOfWeekDate);
  endOfWeekDate.setDate(endOfWeekDate.getDate() + 6);
  return getEndOfDay(endOfWeekDate);
};

/**
 * Get start of month
 * @param {Date|string|number} date - Date
 * @returns {Date} Start of month
 */
export const getStartOfMonth = (date) => {
  const d = new Date(date);
  d.setDate(1);
  return getStartOfDay(d);
};

/**
 * Get end of month
 * @param {Date|string|number} date - Date
 * @returns {Date} End of month
 */
export const getEndOfMonth = (date) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1, 0);
  return getEndOfDay(d);
};

/**
 * Get start of year
 * @param {Date|string|number} date - Date
 * @returns {Date} Start of year
 */
export const getStartOfYear = (date) => {
  const d = new Date(date);
  d.setMonth(0, 1);
  return getStartOfDay(d);
};

/**
 * Get end of year
 * @param {Date|string|number} date - Date
 * @returns {Date} End of year
 */
export const getEndOfYear = (date) => {
  const d = new Date(date);
  d.setMonth(11, 31);
  return getEndOfDay(d);
};

/**
 * Get age from birth date
 * @param {Date|string|number} birthDate - Birth date
 * @param {Date|string|number} referenceDate - Reference date (default: today)
 * @returns {number} Age in years
 */
export const getAge = (birthDate, referenceDate = new Date()) => {
  const birth = new Date(birthDate);
  const reference = new Date(referenceDate);

  if (isNaN(birth.getTime()) || isNaN(reference.getTime())) return 0;

  let age = reference.getFullYear() - birth.getFullYear();
  const monthDiff = reference.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && reference.getDate() < birth.getDate())) {
    age--;
  }

  return Math.max(0, age);
};

/**
 * Check if a year is a leap year
 * @param {number} year - Year to check
 * @returns {boolean} Whether year is a leap year
 */
export const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

/**
 * Get number of days in a month
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @returns {number} Number of days in month
 */
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Get business days between two dates
 * @param {Date|string|number} startDate - Start date
 * @param {Date|string|number} endDate - End date
 * @param {Array} holidays - Array of holiday dates
 * @returns {number} Number of business days
 */
export const getBusinessDays = (startDate, endDate, holidays = []) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

  let businessDays = 0;
  const current = new Date(start);

  const holidayStrings = holidays.map(h => new Date(h).toDateString());

  while (current <= end) {
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = holidayStrings.includes(current.toDateString());

    if (!isWeekend && !isHoliday) {
      businessDays++;
    }

    current.setDate(current.getDate() + 1);
  }

  return businessDays;
};

/**
 * Convert date to different timezone
 * @param {Date|string|number} date - Date to convert
 * @param {string} timezone - Target timezone
 * @returns {Date} Date in target timezone
 */
export const convertTimezone = (date, timezone) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return new Date();

  try {
    return new Date(d.toLocaleString('en-US', { timeZone: timezone }));
  } catch (error) {
    console.error('Timezone conversion error:', error);
    return d;
  }
};

/**
 * Get timezone offset in hours
 * @param {string} timezone - Timezone name
 * @param {Date} date - Reference date
 * @returns {number} Offset in hours
 */
export const getTimezoneOffset = (timezone, date = new Date()) => {
  try {
    const utc = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const target = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return (target - utc) / (1000 * 60 * 60);
  } catch (error) {
    console.error('Timezone offset error:', error);
    return 0;
  }
};

/**
 * Helper function to get Intl format options
 * @param {string} format - Format pattern
 * @param {string} timezone - Timezone
 * @returns {Object} Intl format options
 */
function getIntlFormatOptions(format, timezone) {
  const options = { timeZone: timezone };

  switch (format) {
    case DATE_FORMATS.ISO:
    case DATE_FORMATS.US:
      options.year = 'numeric';
      options.month = '2-digit';
      options.day = '2-digit';
      break;
    case DATE_FORMATS.EU:
      options.year = 'numeric';
      options.month = '2-digit';
      options.day = '2-digit';
      break;
    case DATE_FORMATS.LONG:
      options.year = 'numeric';
      options.month = 'long';
      options.day = 'numeric';
      break;
    case DATE_FORMATS.SHORT:
      options.year = 'numeric';
      options.month = 'short';
      options.day = 'numeric';
      break;
    case DATE_FORMATS.FULL:
      options.weekday = 'long';
      options.year = 'numeric';
      options.month = 'long';
      options.day = 'numeric';
      break;
    default:
      options.year = 'numeric';
      options.month = '2-digit';
      options.day = '2-digit';
  }

  return options;
}

/**
 * Parse US date format (MM/DD/YYYY)
 * @param {string} dateString - Date string
 * @returns {Date} Parsed date
 */
function parseUSDate(dateString) {
  const parts = dateString.split('/');
  if (parts.length !== 3) throw new Error('Invalid US date format');
  
  const month = parseInt(parts[0], 10) - 1;
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  return new Date(year, month, day);
}

/**
 * Parse EU date format (DD/MM/YYYY)
 * @param {string} dateString - Date string
 * @returns {Date} Parsed date
 */
function parseEUDate(dateString) {
  const parts = dateString.split('/');
  if (parts.length !== 3) throw new Error('Invalid EU date format');
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  
  return new Date(year, month, day);
}

// Export all date functions and constants
export {
  DATE_FORMATS,
  MONTHS,
  MONTHS_SHORT,
  DAYS,
  DAYS_SHORT
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeDate,
  parseDate,
  addTime,
  subtractTime,
  dateDifference,
  isDateBetween,
  isToday,
  isYesterday,
  isTomorrow,
  isThisWeek,
  isThisMonth,
  isThisYear,
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfYear,
  getEndOfYear,
  getAge,
  isLeapYear,
  getDaysInMonth,
  getBusinessDays,
  convertTimezone,
  getTimezoneOffset,
  DATE_FORMATS,
  MONTHS,
  MONTHS_SHORT,
  DAYS,
  DAYS_SHORT
};