// Stub document service
module.exports = {
  uploadDocument: async (file, type) => {
    return { url: file.path, name: file.originalname };
  },
  
  deleteDocument: async (documentId) => {
    return { success: true };
  },
  
  getDocument: async (documentId) => {
    return null;
  }
};
