const { PropertyDocument, Property, AuditLog } = require('../../models');
const { uploadFile, deleteFile } = require('../../services/file/storage.service');
const path = require('path');

class PropertyDocumentsController {
  /**
   * Get all documents for a property
   */
  async getPropertyDocuments(req, res) {
    try {
      const { propertyId } = req.params;
      const { type, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

      const where = { propertyId };
      if (type) where.type = type;

      const documents = await PropertyDocument.findAll({
        where,
        order: [[sortBy, sortOrder]],
        include: [
          {
            model: require('../../models').User,
            as: 'uploader',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      res.json({
        success: true,
        data: documents
      });
    } catch (error) {
      console.error('Get property documents error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get document by ID
   */
  async getDocumentById(req, res) {
    try {
      const { propertyId, documentId } = req.params;

      const document = await PropertyDocument.findOne({
        where: { id: documentId, propertyId },
        include: [
          {
            model: require('../../models').User,
            as: 'uploader',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      res.json({
        success: true,
        data: document
      });
    } catch (error) {
      console.error('Get document by ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Create/Upload document
   */
  async createDocument(req, res) {
    try {
      const { propertyId } = req.params;
      const { name, description, type, expiryDate, isPublic } = req.body;
      const userId = req.user.id;

      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      // Verify property exists
      const property = await Property.findByPk(propertyId);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      // Upload file
      const uploadResult = await uploadFile(req.file, {
        folder: `properties/${propertyId}/documents`,
        resourceType: 'raw'
      });

      // Create document record
      const document = await PropertyDocument.create({
        propertyId,
        name: name || path.parse(req.file.originalname).name,
        description: description || null,
        type: type || 'other',
        url: uploadResult.url,
        filename: uploadResult.public_id,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        isPublic: isPublic === 'true' || isPublic === true || false,
        expiryDate: expiryDate || null,
        uploadedBy: userId
      });

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'PROPERTY_DOCUMENT_CREATED',
        details: `Document "${document.name}" uploaded for property: ${property.name}`,
        ipAddress: req.ip,
        metadata: { propertyId, documentId: document.id }
      });

      res.status(201).json({
        success: true,
        message: 'Document uploaded successfully',
        data: document
      });
    } catch (error) {
      console.error('Create document error:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  /**
   * Update document metadata
   */
  async updateDocument(req, res) {
    try {
      const { propertyId, documentId } = req.params;
      const { name, description, type, expiryDate, isPublic } = req.body;
      const userId = req.user.id;

      const document = await PropertyDocument.findOne({
        where: { id: documentId, propertyId }
      });

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Update fields
      if (name) document.name = name;
      if (description !== undefined) document.description = description;
      if (type) document.type = type;
      if (expiryDate !== undefined) document.expiryDate = expiryDate;
      if (isPublic !== undefined) document.isPublic = isPublic;

      await document.save();

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'PROPERTY_DOCUMENT_UPDATED',
        details: `Document "${document.name}" updated for property: ${propertyId}`,
        ipAddress: req.ip,
        metadata: { propertyId, documentId }
      });

      res.json({
        success: true,
        message: 'Document updated successfully',
        data: document
      });
    } catch (error) {
      console.error('Update document error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Delete document
   */
  async deleteDocument(req, res) {
    try {
      const { propertyId, documentId } = req.params;
      const userId = req.user.id;

      const document = await PropertyDocument.findOne({
        where: { id: documentId, propertyId }
      });

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Delete from storage
      try {
        await deleteFile(document.url);
      } catch (error) {
        console.warn('Failed to delete document from storage:', error);
      }

      // Delete from database
      await document.destroy();

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'PROPERTY_DOCUMENT_DELETED',
        details: `Document "${document.name}" deleted from property: ${propertyId}`,
        ipAddress: req.ip,
        metadata: { propertyId, documentId }
      });

      res.json({
        success: true,
        message: 'Document deleted successfully'
      });
    } catch (error) {
      console.error('Delete document error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get documents by type
   */
  async getDocumentsByType(req, res) {
    try {
      const { propertyId, type } = req.params;

      const documents = await PropertyDocument.findAll({
        where: { propertyId, type },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: require('../../models').User,
            as: 'uploader',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      res.json({
        success: true,
        data: documents
      });
    } catch (error) {
      console.error('Get documents by type error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get document statistics
   */
  async getDocumentStats(req, res) {
    try {
      const { propertyId } = req.params;

      const stats = await PropertyDocument.findAll({
        where: { propertyId },
        attributes: [
          'type',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
          [require('sequelize').fn('SUM', require('sequelize').col('size')), 'totalSize']
        ],
        group: ['type'],
        raw: true
      });

      const totalCount = await PropertyDocument.count({ where: { propertyId } });
      const totalSize = await PropertyDocument.sum('size', { where: { propertyId } });

      res.json({
        success: true,
        data: {
          byType: stats,
          total: {
            count: totalCount,
            size: totalSize || 0
          }
        }
      });
    } catch (error) {
      console.error('Get document stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Bulk upload documents
   */
  async bulkUploadDocuments(req, res) {
    try {
      const { propertyId } = req.params;
      const { type = 'other' } = req.body;
      const userId = req.user.id;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files provided' });
      }

      // Verify property exists
      const property = await Property.findByPk(propertyId);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      const uploadedDocuments = [];
      const errors = [];

      for (const file of req.files) {
        try {
          const uploadResult = await uploadFile(file, {
            folder: `properties/${propertyId}/documents`,
            resourceType: 'raw'
          });

          const document = await PropertyDocument.create({
            propertyId,
            name: path.parse(file.originalname).name,
            type,
            url: uploadResult.url,
            filename: uploadResult.public_id,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            uploadedBy: userId
          });

          uploadedDocuments.push(document);
        } catch (error) {
          console.error(`Failed to upload ${file.originalname}:`, error);
          errors.push({
            fileName: file.originalname,
            error: error.message
          });
        }
      }

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'PROPERTY_DOCUMENTS_BULK_UPLOADED',
        details: `${uploadedDocuments.length} documents uploaded for property: ${property.name}`,
        ipAddress: req.ip,
        metadata: { propertyId, uploadedCount: uploadedDocuments.length }
      });

      res.status(201).json({
        success: true,
        message: `Uploaded ${uploadedDocuments.length} documents${errors.length > 0 ? `, ${errors.length} failed` : ''}`,
        data: {
          uploaded: uploadedDocuments,
          errors: errors.length > 0 ? errors : undefined
        }
      });
    } catch (error) {
      console.error('Bulk upload documents error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Check document expiry
   */
  async checkExpiringDocuments(req, res) {
    try {
      const { propertyId } = req.params;
      const { daysThreshold = 30 } = req.query;

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(daysThreshold));

      const expiringDocuments = await PropertyDocument.findAll({
        where: {
          propertyId,
          expiryDate: {
            [require('sequelize').Op.between]: [new Date(), expiryDate]
          }
        },
        order: [['expiryDate', 'ASC']]
      });

      res.json({
        success: true,
        data: expiringDocuments
      });
    } catch (error) {
      console.error('Check expiring documents error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new PropertyDocumentsController();
