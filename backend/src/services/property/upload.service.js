const imageService = require('../file/image.service');
const documentService = require('../file/document.service');
const { PropertyImage, PropertyDocument } = require('../../models');

class PropertyUploadService {
  async uploadPropertyImages(propertyId, files, uploadedBy, unitId = null) {
    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const image = await imageService.uploadImage({
          propertyId,
          unitId,
          file,
          type: this.detectImageType(file.originalname, i),
          uploadedBy
        });

        // Set first image as main if no main image exists
        if (i === 0) {
          const existingMain = await PropertyImage.findOne({
            where: { property_id: propertyId, is_main: true }
          });
          
          if (!existingMain) {
            await image.update({ is_main: true });
          }
        }

        results.push({ success: true, image });
      } catch (error) {
        results.push({ 
          success: false, 
          filename: file.originalname, 
          error: error.message 
        });
      }
    }

    return {
      uploaded: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }

  async uploadPropertyDocuments(propertyId, files, uploadedBy) {
    const results = [];

    for (const file of files) {
      try {
        const document = await documentService.uploadDocument({
          propertyId,
          file,
          type: this.detectDocumentType(file.originalname),
          uploadedBy
        });

        results.push({ success: true, document });
      } catch (error) {
        results.push({ 
          success: false, 
          filename: file.originalname, 
          error: error.message 
        });
      }
    }

    return {
      uploaded: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }

  async reorderImages(propertyId, imageOrders) {
    const updates = imageOrders.map(({ imageId, order }) => 
      PropertyImage.update(
        { display_order: order },
        { where: { id: imageId, property_id: propertyId } }
      )
    );

    await Promise.all(updates);
    return { success: true };
  }

  async setMainImage(propertyId, imageId) {
    // Reset all images to not main
    await PropertyImage.update(
      { is_main: false },
      { where: { property_id: propertyId } }
    );

    // Set selected image as main
    const image = await PropertyImage.findOne({
      where: { id: imageId, property_id: propertyId }
    });

    if (!image) {
      throw new Error('Image not found');
    }

    await image.update({ is_main: true });
    return image;
  }

  async deletePropertyImage(imageId, propertyId) {
    const image = await PropertyImage.findOne({
      where: { id: imageId, property_id: propertyId }
    });

    if (!image) {
      throw new Error('Image not found');
    }

    await imageService.deleteImage(imageId);
    return { success: true };
  }

  async deletePropertyDocument(documentId, propertyId) {
    const document = await PropertyDocument.findOne({
      where: { id: documentId, property_id: propertyId }
    });

    if (!document) {
      throw new Error('Document not found');
    }

    await documentService.deleteDocument(documentId);
    return { success: true };
  }

  detectImageType(filename, index = 0) {
    const name = filename.toLowerCase();
    
    if (name.includes('exterior') || name.includes('outside')) return 'exterior';
    if (name.includes('interior') || name.includes('inside')) return 'interior';
    if (name.includes('kitchen')) return 'kitchen';
    if (name.includes('bathroom')) return 'bathroom';
    if (name.includes('bedroom')) return 'bedroom';
    if (name.includes('living')) return 'living_room';
    if (name.includes('amenity') || name.includes('pool') || name.includes('gym')) return 'amenity';
    if (index === 0) return 'main';
    
    return 'other';
  }

  detectDocumentType(filename) {
    const name = filename.toLowerCase();
    
    if (name.includes('lease')) return 'lease';
    if (name.includes('insurance')) return 'insurance';
    if (name.includes('inspection')) return 'inspection';
    if (name.includes('certificate')) return 'certificate';
    if (name.includes('deed') || name.includes('title')) return 'deed';
    if (name.includes('tax')) return 'tax_document';
    if (name.includes('permit')) return 'permit';
    if (name.includes('warranty')) return 'warranty';
    
    return 'other';
  }

  async getUploadStatistics(propertyId) {
    const [imageCount, documentCount] = await Promise.all([
      PropertyImage.count({ where: { property_id: propertyId } }),
      PropertyDocument.count({ where: { property_id: propertyId } })
    ]);

    const totalSize = await PropertyImage.sum('file_size', { 
      where: { property_id: propertyId } 
    }) + await PropertyDocument.sum('file_size', { 
      where: { property_id: propertyId } 
    });

    return {
      imageCount,
      documentCount,
      totalFiles: imageCount + documentCount,
      totalSize: totalSize || 0
    };
  }

  async validateUpload(file, type = 'image') {
    const maxSizes = {
      image: 10 * 1024 * 1024, // 10MB
      document: 50 * 1024 * 1024 // 50MB
    };

    const allowedTypes = {
      image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      document: ['pdf', 'doc', 'docx', 'txt', 'rtf']
    };

    if (file.size > maxSizes[type]) {
      throw new Error(`File too large. Maximum size: ${maxSizes[type] / 1024 / 1024}MB`);
    }

    const ext = file.originalname.split('.').pop().toLowerCase();
    if (!allowedTypes[type].includes(ext)) {
      throw new Error(`Invalid file type. Allowed: ${allowedTypes[type].join(', ')}`);
    }

    return true;
  }
}

module.exports = new PropertyUploadService();