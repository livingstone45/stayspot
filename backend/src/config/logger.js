// Simple logger
module.exports = {
  info: (msg, data = {}) => console.log('INFO:', msg, data),
  error: (msg, data = {}) => console.error('ERROR:', msg, data),
  warn: (msg, data = {}) => console.warn('WARN:', msg, data),
  debug: (msg, data = {}) => process.env.DEBUG && console.log('DEBUG:', msg, data)
};
