// Backend URL Configuration
// Use this to set different URLs for different environments

module.exports = {
  // Production - stayspot.co.ke
  production: {
    backendUrl: 'https://stayspot.co.ke/api',
    frontendUrl: 'https://stayspot.co.ke',
    corsOrigin: 'https://stayspot.co.ke',
    socketUrl: 'https://stayspot.co.ke',
    port: 8080,
  },

  // Testing/Staging - testly.stayspot.co.ke
  staging: {
    backendUrl: 'https://testly.stayspot.co.ke/api',
    frontendUrl: 'https://testly.stayspot.co.ke',
    corsOrigin: 'https://testly.stayspot.co.ke',
    socketUrl: 'https://testly.stayspot.co.ke',
    port: 8081,
  },

  // Development - Local machine
  development: {
    backendUrl: 'http://localhost:8080',
    frontendUrl: 'http://localhost:3000',
    corsOrigin: 'http://localhost:3000',
    socketUrl: 'http://localhost:8080',
    port: 8080,
  },
};
