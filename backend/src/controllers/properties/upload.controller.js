const multer = require('multer');
const path = require('path');
const { Property, PropertyImage, PropertyDocument, AuditLog } = require('../../models');
const { uploadFile, deleteFile } = require('../../services/file/storage.service');
const { processPropertyImages } = require('../../services/property/ai-processing.service');
const { ROLES } = require('../../utils/constants/roles');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 20 // Maximum 20 files per upload
  },
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedDocumentTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx|txt/;
    
    const isImage = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
    const isDocument = allowedDocumentTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (isImage || isDocument) {
      cb(null, true);
    } else {
      cb(new Error('Only image and document files are allowed'));
    }
  }
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'documents', maxCount: 10 }
]);

/**
 * Property Upload Controller
 * Handles property file uploads and processing
 */
class UploadController {
  /**
   * Upload Property Images
   */
  async uploadImages(req, res) {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        const { propertyId } = req.params;
        const userId = req.user.id;
        const userRoles = req.user.roles;

        // Check property access
        const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
        if (!hasAccess) {
          return res.status(403).json({ error: 'Not authorized to upload images for this property' });
        }

        const property = await Property.findByPk(propertyId);
        if (!property) {
          return res.status(404).json({ error: 'Property not found' });
        }

        if (!req.files || !req.files.images || req.files.images.length === 0) {
          return res.status(400).json({ error: 'No images provided' });
        }

        const uploadedImages = [];
        const errors = [];

        // Process each image
        for (const file of req.files.images) {
          try {
            // Upload to cloud storage
            const uploadResult = await uploadFile(file, {
              folder: `properties/${propertyId}/images`,
              transformation: {
                width: 1200,
                height: 800,
                crop: 'limit',
                quality: 'auto'
              }
            });

            // Process with AI for tagging and analysis
            const aiAnalysis = await processPropertyImages(uploadResult.url);

            // Create image record
            const image = await PropertyImage.create({
              propertyId,
              url: uploadResult.url,
              type: this.getImageType(file.originalname),
              caption: file.originalname,
              metadata: {
                originalName: file.originalname,
                size: file.size,
                mimeType: file.mimetype,
                uploaderId: userId,
                aiAnalysis
              },
              isPrimary: false,
              uploadedBy: userId
            });

            uploadedImages.push({
              id: image.id,
              url: image.url,
              type: image.type,
              caption: image.caption,
              aiTags: aiAnalysis.tags || []
            });
          } catch (error) {
            console.error(`Failed to upload image ${file.originalname}:`, error);
            errors.push({
              fileName: file.originalname,
              error: error.message
            });
          }
        }

        // Check if this is the first image and set as primary
        const existingImages = await PropertyImage.count({ where: { propertyId } });
        if (existingImages === 0 && uploadedImages.length > 0) {
          await PropertyImage.update(
            { isPrimary: true },
            { where: { id: uploadedImages[0].id } }
          );
          uploadedImages[0].isPrimary = true;
        }

        // Create audit log
        await AuditLog.create({
          userId,
          action: 'PROPERTY_IMAGES_UPLOADED',
          details: `${uploadedImages.length} images uploaded for property: ${property.name}`,
          ipAddress: req.ip,
          metadata: { 
            propertyId: property.id, 
            uploadedCount: uploadedImages.length,
            errorCount: errors.length
          }
        });

        res.json({
          success: true,
          message: `Uploaded ${uploadedImages.length} images successfully${errors.length > 0 ? `, ${errors.length} failed` : ''}`,
          data: {
            uploaded: uploadedImages,
            errors: errors.length > 0 ? errors : undefined
          }
        });
      });
    } catch (error) {
      console.error('Upload images error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Upload Property Documents
   */
  async uploadDocuments(req, res) {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        const { propertyId } = req.params;
        const userId = req.user.id;
        const userRoles = req.user.roles;

        // Check property access
        const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
        if (!hasAccess) {
          return res.status(403).json({ error: 'Not authorized to upload documents for this property' });
        }

        const property = await Property.findByPk(propertyId);
        if (!property) {
          return res.status(404).json({ error: 'Property not found' });
        }

        if (!req.files || !req.files.documents || req.files.documents.length === 0) {
          return res.status(400).json({ error: 'No documents provided' });
        }

        const uploadedDocuments = [];
        const errors = [];

        // Process each document
        for (const file of req.files.documents) {
          try {
            // Upload to cloud storage
            const uploadResult = await uploadFile(file, {
              folder: `properties/${propertyId}/documents`,
              resourceType: 'raw' // For documents
            });

            // Create document record
            const document = await PropertyDocument.create({
              propertyId,
              name: path.parse(file.originalname).name,
              url: uploadResult.url,
              type: this.getDocumentType(file.originalname),
              size: file.size,
              mimeType: file.mimetype,
              metadata: {
                originalName: file.originalname,
                uploaderId: userId
              },
              uploadedBy: userId
            });

            uploadedDocuments.push({
              id: document.id,
              name: document.name,
              url: document.url,
              type: document.type,
              size: document.size,
              mimeType: document.mimeType
            });
          } catch (error) {
            console.error(`Failed to upload document ${file.originalname}:`, error);
            errors.push({
              fileName: file.originalname,
              error: error.message
            });
          }
        }

        // Create audit log
        await AuditLog.create({
          userId,
          action: 'PROPERTY_DOCUMENTS_UPLOADED',
          details: `${uploadedDocuments.length} documents uploaded for property: ${property.name}`,
          ipAddress: req.ip,
          metadata: { 
            propertyId: property.id, 
            uploadedCount: uploadedDocuments.length,
            errorCount: errors.length
          }
        });

        res.json({
          success: true,
          message: `Uploaded ${uploadedDocuments.length} documents successfully${errors.length > 0 ? `, ${errors.length} failed` : ''}`,
          data: {
            uploaded: uploadedDocuments,
            errors: errors.length > 0 ? errors : undefined
          }
        });
      });
    } catch (error) {
      console.error('Upload documents error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Bulk Upload Property Files (Images + Documents)
   */
  async bulkUpload(req, res) {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        const { propertyId } = req.params;
        const userId = req.user.id;
        const userRoles = req.user.roles;

        // Check property access
        const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
        if (!hasAccess) {
          return res.status(403).json({ error: 'Not authorized to upload files for this property' });
        }

        const property = await Property.findByPk(propertyId);
        if (!property) {
          return res.status(404).json({ error: 'Property not found' });
        }

        const results = {
          images: { uploaded: [], errors: [] },
          documents: { uploaded: [], errors: [] }
        };

        // Process images
        if (req.files.images && req.files.images.length > 0) {
          for (const file of req.files.images) {
            try {
              const uploadResult = await uploadFile(file, {
                folder: `properties/${propertyId}/images`,
                transformation: {
                  width: 1200,
                  height: 800,
                  crop: 'limit',
                  quality: 'auto'
                }
              });

              const aiAnalysis = await processPropertyImages(uploadResult.url);

              const image = await PropertyImage.create({
                propertyId,
                url: uploadResult.url,
                type: this.getImageType(file.originalname),
                caption: file.originalname,
                metadata: {
                  originalName: file.originalname,
                  size: file.size,
                  mimeType: file.mimetype,
                  uploaderId: userId,
                  aiAnalysis
                },
                isPrimary: false,
                uploadedBy: userId
              });

              results.images.uploaded.push({
                id: image.id,
                url: image.url,
                type: image.type,
                caption: image.caption
              });
            } catch (error) {
              console.error(`Failed to upload image ${file.originalname}:`, error);
              results.images.errors.push({
                fileName: file.originalname,
                error: error.message
              });
            }
          }
        }

        // Process documents
        if (req.files.documents && req.files.documents.length > 0) {
          for (const file of req.files.documents) {
            try {
              const uploadResult = await uploadFile(file, {
                folder: `properties/${propertyId}/documents`,
                resourceType: 'raw'
              });

              const document = await PropertyDocument.create({
                propertyId,
                name: path.parse(file.originalname).name,
                url: uploadResult.url,
                type: this.getDocumentType(file.originalname),
                size: file.size,
                mimeType: file.mimetype,
                metadata: {
                  originalName: file.originalname,
                  uploaderId: userId
                },
                uploadedBy: userId
              });

              results.documents.uploaded.push({
                id: document.id,
                name: document.name,
                url: document.url,
                type: document.type,
                size: document.size
              });
            } catch (error) {
              console.error(`Failed to upload document ${file.originalname}:`, error);
              results.documents.errors.push({
                fileName: file.originalname,
                error: error.message
              });
            }
          }
        }

        // Set primary image if none exists
        const existingPrimary = await PropertyImage.findOne({
          where: { propertyId, isPrimary: true }
        });

        if (!existingPrimary && results.images.uploaded.length > 0) {
          await PropertyImage.update(
            { isPrimary: true },
            { where: { id: results.images.uploaded[0].id } }
          );
          results.images.uploaded[0].isPrimary = true;
        }

        // Create audit log
        await AuditLog.create({
          userId,
          action: 'BULK_PROPERTY_UPLOAD',
          details: `Bulk upload for property: ${property.name}. Images: ${results.images.uploaded.length}, Documents: ${results.documents.uploaded.length}`,
          ipAddress: req.ip,
          metadata: { 
            propertyId: property.id, 
            results 
          }
        });

        const totalUploaded = results.images.uploaded.length + results.documents.uploaded.length;
        const totalErrors = results.images.errors.length + results.documents.errors.length;

        res.json({
          success: true,
          message: `Uploaded ${totalUploaded} files successfully${totalErrors > 0 ? `, ${totalErrors} failed` : ''}`,
          data: results
        });
      });
    } catch (error) {
      console.error('Bulk upload error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Delete Property Image
   */
  async deleteImage(req, res) {
    try {
      const { propertyId, imageId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to delete images for this property' });
      }

      const image = await PropertyImage.findOne({
        where: { 
          id: imageId,
          propertyId 
        }
      });

      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      // Check if it's a primary image
      const isPrimary = image.isPrimary;

      // Delete from storage
      try {
        await deleteFile(image.url);
      } catch (error) {
        console.warn('Failed to delete image from storage:', error);
      }

      // Delete from database
      await image.destroy();

      // If it was primary, set a new primary image
      if (isPrimary) {
        const newPrimary = await PropertyImage.findOne({
          where: { propertyId },
          order: [['createdAt', 'ASC']]
        });

        if (newPrimary) {
          newPrimary.isPrimary = true;
          await newPrimary.save();
        }
      }

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'PROPERTY_IMAGE_DELETED',
        details: `Image deleted from property: ${propertyId}`,
        ipAddress: req.ip,
        metadata: { 
          propertyId, 
          imageId,
          wasPrimary: isPrimary 
        }
      });

      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } catch (error) {
      console.error('Delete image error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Delete Property Document
   */
  async deleteDocument(req, res) {
    try {
      const { propertyId, documentId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to delete documents for this property' });
      }

      const document = await PropertyDocument.findOne({
        where: { 
          id: documentId,
          propertyId 
        }
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
        details: `Document deleted from property: ${propertyId}`,
        ipAddress: req.ip,
        metadata: { 
          propertyId, 
          documentId 
        }
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
   * Set Primary Image
   */
  async setPrimaryImage(req, res) {
    try {
      const { propertyId, imageId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to modify images for this property' });
      }

      const image = await PropertyImage.findOne({
        where: { 
          id: imageId,
          propertyId 
        }
      });

      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      // Reset all images to non-primary
      await PropertyImage.update(
        { isPrimary: false },
        { where: { propertyId } }
      );

      // Set selected image as primary
      image.isPrimary = true;
      await image.save();

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'PRIMARY_IMAGE_SET',
        details: `Primary image set for property: ${propertyId}`,
        ipAddress: req.ip,
        metadata: { 
          propertyId, 
          imageId 
        }
      });

      res.json({
        success: true,
        message: 'Primary image set successfully',
        data: {
          imageId: image.id,
          url: image.url,
          isPrimary: true
        }
      });
    } catch (error) {
      console.error('Set primary image error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update Image Caption
   */
  async updateImageCaption(req, res) {
    try {
      const { propertyId, imageId } = req.params;
      const { caption } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (!caption) {
        return res.status(400).json({ error: 'Caption is required' });
      }

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to modify images for this property' });
      }

      const image = await PropertyImage.findOne({
        where: { 
          id: imageId,
          propertyId 
        }
      });

      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      image.caption = caption;
      await image.save();

      res.json({
        success: true,
        message: 'Image caption updated successfully',
        data: {
          imageId: image.id,
          caption: image.caption
        }
      });
    } catch (error) {
      console.error('Update image caption error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update Document Name
   */
  async updateDocumentName(req, res) {
    try {
      const { propertyId, documentId } = req.params;
      const { name } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (!name) {
        return res.status(400).json({ error: 'Document name is required' });
      }

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to modify documents for this property' });
      }

      const document = await PropertyDocument.findOne({
        where: { 
          id: documentId,
          propertyId 
        }
      });

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      document.name = name;
      await document.save();

      res.json({
        success: true,
        message: 'Document name updated successfully',
        data: {
          documentId: document.id,
          name: document.name
        }
      });
    } catch (error) {
      console.error('Update document name error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Property Images
   */
  async getPropertyImages(req, res) {
    try {
      const { propertyId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view images for this property' });
      }

      const images = await PropertyImage.findAll({
        where: { propertyId },
        order: [['isPrimary', 'DESC'], ['createdAt', 'ASC']]
      });

      res.json({
        success: true,
        data: images
      });
    } catch (error) {
      console.error('Get property images error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Property Documents
   */
  async getPropertyDocuments(req, res) {
    try {
      const { propertyId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view documents for this property' });
      }

      const documents = await PropertyDocument.findAll({
        where: { propertyId },
        order: [['createdAt', 'DESC']]
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
   * Generate Image Gallery
   */
  async generateGallery(req, res) {
    try {
      const { propertyId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to generate gallery for this property' });
      }

      const images = await PropertyImage.findAll({
        where: { propertyId },
        order: [
          ['isPrimary', 'DESC'],
          ['type', 'ASC'],
          ['createdAt', 'ASC']
        ]
      });

      // Group images by type
      const gallery = {
        primary: images.find(img => img.isPrimary) || null,
        exterior: images.filter(img => img.type === 'exterior'),
        interior: images.filter(img => img.type === 'interior'),
        amenities: images.filter(img => img.type === 'amenities'),
        floorplan: images.filter(img => img.type === 'floorplan'),
        other: images.filter(img => !['exterior', 'interior', 'amenities', 'floorplan'].includes(img.type))
      };

      res.json({
        success: true,
        data: gallery
      });
    } catch (error) {
      console.error('Generate gallery error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Reorder Images
   */
  async reorderImages(req, res) {
    try {
      const { propertyId } = req.params;
      const { imageOrder } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (!Array.isArray(imageOrder)) {
        return res.status(400).json({ error: 'Image order array is required' });
      }

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to reorder images for this property' });
      }

      // Update image order in metadata
      for (let i = 0; i < imageOrder.length; i++) {
        const imageId = imageOrder[i];
        const image = await PropertyImage.findOne({
          where: { 
            id: imageId,
            propertyId 
          }
        });

        if (image) {
          const metadata = image.metadata || {};
          metadata.order = i;
          image.metadata = metadata;
          await image.save();
        }
      }

      res.json({
        success: true,
        message: 'Images reordered successfully'
      });
    } catch (error) {
      console.error('Reorder images error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Helper: Check property access
   */
  async checkPropertyAccess(propertyId, userId, userRoles) {
    try {
      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return true;
      }

      const property = await Property.findByPk(propertyId);
      if (!property) return false;

      if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        return user.companyId === property.companyId;
      }

      if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Portfolio,
            as: 'ManagedPortfolios'
          }]
        });
        
        if (user.ManagedPortfolios && user.ManagedPortfolios.length > 0) {
          const managedPortfolioIds = user.ManagedPortfolios.map(p => p.id);
          return managedPortfolioIds.includes(property.portfolioId);
        }
        return false;
      }

      if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Property,
            as: 'ManagedProperties'
          }]
        });
        
        if (user.ManagedProperties && user.ManagedProperties.length > 0) {
          const managedPropertyIds = user.ManagedProperties.map(p => p.id);
          return managedPropertyIds.includes(property.id);
        }
        return false;
      }

      if (userRoles.includes(ROLES.LANDLORD)) {
        return property.ownerId === userId;
      }

      return false;
    } catch (error) {
      console.error('Check property access error:', error);
      return false;
    }
  }

  /**
   * Helper: Get image type from filename
   */
  getImageType(filename) {
    const lowerFilename = filename.toLowerCase();
    
    if (lowerFilename.includes('exterior') || lowerFilename.includes('outside') || lowerFilename.includes('front')) {
      return 'exterior';
    } else if (lowerFilename.includes('interior') || lowerFilename.includes('inside') || lowerFilename.includes('living') || lowerFilename.includes('bedroom') || lowerFilename.includes('kitchen') || lowerFilename.includes('bathroom')) {
      return 'interior';
    } else if (lowerFilename.includes('amenity') || lowerFilename.includes('pool') || lowerFilename.includes('gym') || lowerFilename.includes('parking')) {
      return 'amenities';
    } else if (lowerFilename.includes('floorplan') || lowerFilename.includes('plan') || lowerFilename.includes('layout')) {
      return 'floorplan';
    } else {
      return 'other';
    }
  }

  /**
   * Helper: Get document type from filename
   */
  getDocumentType(filename) {
    const lowerFilename = filename.toLowerCase();
    
    if (lowerFilename.includes('lease') || lowerFilename.includes('agreement') || lowerFilename.includes('contract')) {
      return 'lease';
    } else if (lowerFilename.includes('inspection') || lowerFilename.includes('report')) {
      return 'inspection';
    } else if (lowerFilename.includes('permit') || lowerFilename.includes('license') || lowerFilename.includes('certificate')) {
      return 'permit';
    } else if (lowerFilename.includes('insurance') || lowerFilename.includes('policy')) {
      return 'insurance';
    } else if (lowerFilename.includes('tax') || lowerFilename.includes('assessment')) {
      return 'tax';
    } else if (lowerFilename.includes('mortgage') || lowerFilename.includes('loan')) {
      return 'mortgage';
    } else if (lowerFilename.includes('warranty') || lowerFilename.includes('guarantee')) {
      return 'warranty';
    } else {
      return 'other';
    }
  }
}

module.exports = new UploadController();