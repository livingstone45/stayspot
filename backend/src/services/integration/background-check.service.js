// Stub background check service
module.exports = {
  checkBackground: async (tenantData) => {
    return { status: 'pending', message: 'Background check service not configured' };
  },
  
  getCheckStatus: async (checkId) => {
    return { status: 'pending' };
  }
};
