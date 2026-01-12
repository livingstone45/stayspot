// Backend URL Helper
// Provides easy access to environment-specific URLs

const urls = require('../config/urls');

const getEnvironment = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'production' ? 'production' : 
         env === 'staging' ? 'staging' : 
         'development';
};

const getUrls = () => {
  const environment = getEnvironment();
  return urls[environment];
};

const getBackendUrl = () => {
  return getUrls().backendUrl;
};

const getFrontendUrl = () => {
  return getUrls().frontendUrl;
};

const getCorsOrigin = () => {
  return getUrls().corsOrigin;
};

const getSocketUrl = () => {
  return getUrls().socketUrl;
};

const getPort = () => {
  return process.env.PORT || getUrls().port;
};

module.exports = {
  getEnvironment,
  getUrls,
  getBackendUrl,
  getFrontendUrl,
  getCorsOrigin,
  getSocketUrl,
  getPort,
};
