const moment = require('moment-timezone');
const { format, parseISO, differenceInDays, addDays, isBefore, isAfter } = require('date-fns');

class DateHelper {
  /**
   * Format date to consistent format
   * @param {Date|string} date - Date to format
   * @param {string} formatStr - Format string
   * @param {string} timezone - Timezone
   * @returns {string} Formatted date string
   */
  static formatDate(date, formatStr = 'yyyy-MM-dd', timezone = 'UTC') {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  }

  /**
   * Format date with time
   * @param {Date|string} date - Date to format
   * @param {string} timezone - Timezone
   * @returns {string} Formatted datetime string
   */
  static formatDateTime(date, timezone = 'UTC') {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return moment(dateObj).tz(timezone).format('YYYY-MM-DD HH:mm:ss');
  }

  /**
   * Convert date to UTC
   * @param {Date|string} date - Date to convert
   * @returns {Date} UTC date
   */
  static toUTC(date) {
    if (!date) return null;
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return moment(dateObj).utc().toDate();
  }

  /**
   * Convert UTC to local timezone
   * @param {Date} utcDate - UTC date
   * @param {string} timezone - Target timezone
   * @returns {Date} Local date
   */
  static fromUTC(utcDate, timezone = 'UTC') {
    if (!utcDate) return null;
    return moment.utc(utcDate).tz(timezone).toDate();
  }

  /**
   * Calculate days between two dates
   * @param {Date|string} startDate - Start date
   * @param {Date|string} endDate - End date
   * @returns {number} Number of days
   */
  static daysBetween(startDate, endDate) {
    if (!startDate || !endDate) return 0;
    
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    return differenceInDays(end, start);
  }

  /**
   * Add days to a date
   * @param {Date|string} date - Base date
   * @param {number} days - Days to add
   * @returns {Date} New date
   */
  static addDays(date, days) {
    if (!date) return null;
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return addDays(dateObj, days);
  }

  /**
   * Check if date is in the future
   * @param {Date|string} date - Date to check
   * @returns {boolean} True if future date
   */
  static isFuture(date) {
    if (!date) return false;
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isAfter(dateObj, new Date());
  }

  /**
   * Check if date is in the past
   * @param {Date|string} date - Date to check
   * @returns {boolean} True if past date
   */
  static isPast(date) {
    if (!date) return false;
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isBefore(dateObj, new Date());
  }

  /**
   * Get start of day
   * @param {Date|string} date - Date
   * @param {string} timezone - Timezone
   * @returns {Date} Start of day
   */
  static startOfDay(date, timezone = 'UTC') {
    if (!date) return null;
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return moment(dateObj).tz(timezone).startOf('day').toDate();
  }

  /**
   * Get end of day
   * @param {Date|string} date - Date
   * @param {string} timezone - Timezone
   * @returns {Date} End of day
   */
  static endOfDay(date, timezone = 'UTC') {
    if (!date) return null;
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return moment(dateObj).tz(timezone).endOf('day').toDate();
  }

  /**
   * Calculate age from birth date
   * @param {Date|string} birthDate - Birth date
   * @returns {number} Age in years
   */
  static calculateAge(birthDate) {
    if (!birthDate) return null;
    
    const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Generate date range
   * @param {Date|string} startDate - Start date
   * @param {Date|string} endDate - End date
   * @returns {Array} Array of dates
   */
  static generateDateRange(startDate, endDate) {
    if (!startDate || !endDate) return [];
    
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    const dates = [];
    let currentDate = start;
    
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    return dates;
  }

  /**
   * Format relative time (e.g., "2 days ago")
   * @param {Date|string} date - Date
   * @returns {string} Relative time string
   */
  static relativeTime(date) {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  }

  /**
   * Parse date string with multiple formats
   * @param {string} dateString - Date string
   * @param {Array} formats - Array of format strings
   * @returns {Date} Parsed date
   */
  static parseDateString(dateString, formats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'dd/MM/yyyy']) {
    if (!dateString) return null;
    
    for (const formatStr of formats) {
      try {
        const parsed = moment(dateString, formatStr, true);
        if (parsed.isValid()) {
          return parsed.toDate();
        }
      } catch (error) {
        continue;
      }
    }
    
    return null;
  }

  /**
   * Get business days between two dates
   * @param {Date|string} startDate - Start date
   * @param {Date|string} endDate - End date
   * @param {Array} holidays - Array of holiday dates
   * @returns {number} Number of business days
   */
  static businessDaysBetween(startDate, endDate, holidays = []) {
    if (!startDate || !endDate) return 0;
    
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    let count = 0;
    let current = new Date(start);
    
    while (current <= end) {
      const dayOfWeek = current.getDay();
      
      // Check if it's a weekday (Monday = 1 to Friday = 5)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Check if it's a holiday
        const isHoliday = holidays.some(holiday => {
          const holidayDate = typeof holiday === 'string' ? parseISO(holiday) : holiday;
          return holidayDate.toDateString() === current.toDateString();
        });
        
        if (!isHoliday) {
          count++;
        }
      }
      
      current.setDate(current.getDate() + 1);
    }
    
    return count;
  }

  /**
   * Get timezone offset in hours
   * @param {string} timezone - Timezone
   * @returns {number} Offset in hours
   */
  static getTimezoneOffset(timezone = 'UTC') {
    return moment.tz(timezone).utcOffset() / 60;
  }

  /**
   * Validate date string
   * @param {string} dateString - Date string
   * @param {string} format - Expected format
   * @returns {boolean} True if valid
   */
  static isValidDate(dateString, format = 'YYYY-MM-DD') {
    if (!dateString) return false;
    return moment(dateString, format, true).isValid();
  }
}

module.exports = DateHelper;