/**
 * Format currency values
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined) return '-';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format currency without symbol
 */
export const formatAmount = (amount, locale = 'en-US') => {
  if (amount === null || amount === undefined) return '-';
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Parse currency string to number
 */
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0;
  
  // Remove currency symbols and spaces, keep numbers and decimal point
  const cleanString = currencyString.replace(/[^\d.-]/g, '');
  return parseFloat(cleanString) || 0;
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '-';
  
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  
  return ((current - previous) / previous) * 100;
};

/**
 * Format large numbers with abbreviations
 */
export const formatLargeNumber = (num, decimals = 1) => {
  if (num === null || num === undefined) return '-';
  
  const absNum = Math.abs(num);
  
  if (absNum >= 1e9) {
    return (num / 1e9).toFixed(decimals) + 'B';
  } else if (absNum >= 1e6) {
    return (num / 1e6).toFixed(decimals) + 'M';
  } else if (absNum >= 1e3) {
    return (num / 1e3).toFixed(decimals) + 'K';
  }
  
  return num.toString();
};

/**
 * Calculate monthly payment
 */
export const calculateMonthlyPayment = (principal, annualRate, years) => {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  
  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }
  
  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
  return monthlyPayment;
};