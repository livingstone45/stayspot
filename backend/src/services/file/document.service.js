const { PropertyDocument } = require('../../models');
const storageService = require('./storage.service');
const path = require('path');
const fs = require('fs').promises;

class DocumentService {
  async uploadDocument(documentData) {
    const { propertyId, file, type, title, description, uploadedBy } = documentData;

    // Upload file to storage
    const uploadResult = await storageService.uploadFile(file, {
      folder: `properties/${propertyId}/documents`,
      allowedTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png']
    });

    // Save document record
    const document = await PropertyDocument.create({
      property_id: propertyId,
      title: title || file.originalname,
      description,
      file_name: uploadResult.filename,
      file_path: uploadResult.path,
      file_url: uploadResult.url,
      file_size: file.size,
      mime_type: file.mimetype,
      type,
      uploaded_by: uploadedBy
    });

    return document;
  }

  async getDocuments(propertyId, filters = {}) {
    const { type, limit = 50, offset = 0 } = filters;
    
    const where = { property_id: propertyId };
    if (type) where.type = type;

    return await PropertyDocument.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
  }

  async getDocument(documentId) {
    return await PropertyDocument.findByPk(documentId);
  }

  async updateDocument(documentId, updateData) {
    const document = await PropertyDocument.findByPk(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    return await document.update(updateData);
  }

  async deleteDocument(documentId) {
    const document = await PropertyDocument.findByPk(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    // Delete file from storage
    await storageService.deleteFile(document.file_path);

    // Delete database record
    await document.destroy();

    return { success: true };
  }

  async downloadDocument(documentId) {
    const document = await PropertyDocument.findByPk(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    return {
      filePath: document.file_path,
      fileName: document.file_name,
      mimeType: document.mime_type
    };
  }

  async generateDocumentUrl(documentId, expiresIn = 3600) {
    const document = await PropertyDocument.findByPk(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    return await storageService.generateSignedUrl(document.file_path, expiresIn);
  }

  async bulkUpload(propertyId, files, uploadedBy) {
    const results = [];

    for (const file of files) {
      try {
        const document = await this.uploadDocument({
          propertyId,
          file,
          type: this.detectDocumentType(file),
          uploadedBy
        });
        results.push({ success: true, document });
      } catch (error) {
        results.push({ success: false, filename: file.originalname, error: error.message });
      }
    }

    return results;
  }

  detectDocumentType(file) {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = file.originalname.toLowerCase();

    if (filename.includes('lease')) return 'lease';
    if (filename.includes('insurance')) return 'insurance';
    if (filename.includes('inspection')) return 'inspection';
    if (filename.includes('certificate')) return 'certificate';
    if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) return 'photo';
    if (['.pdf', '.doc', '.docx'].includes(ext)) return 'document';
    
    return 'other';
  }

  async getDocumentsByType(propertyId, type) {
    return await PropertyDocument.findAll({
      where: { property_id: propertyId, type },
      order: [['created_at', 'DESC']]
    });
  }

  async searchDocuments(propertyId, searchTerm) {
    const { Op } = require('sequelize');
    
    return await PropertyDocument.findAll({
      where: {
        property_id: propertyId,
        [Op.or]: [
          { title: { [Op.iLike]: `%${searchTerm}%` } },
          { description: { [Op.iLike]: `%${searchTerm}%` } },
          { file_name: { [Op.iLike]: `%${searchTerm}%` } }
        ]
      },
      order: [['created_at', 'DESC']]
    });
  }
}

module.exports = new DocumentService();