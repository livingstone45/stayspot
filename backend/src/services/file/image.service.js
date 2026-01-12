const { PropertyImage } = require('../../models');
const storageService = require('./storage.service');
const sharp = require('sharp');
const path = require('path');

class ImageService {
  async uploadImage(imageData) {
    const { propertyId, unitId, file, type, title, description, uploadedBy } = imageData;

    // Process image
    const processedImages = await this.processImage(file);

    // Upload all versions to storage
    const uploadResults = await Promise.all([
      storageService.uploadBuffer(processedImages.original, {
        filename: `original_${file.originalname}`,
        folder: `properties/${propertyId}/images`,
        mimetype: file.mimetype
      }),
      storageService.uploadBuffer(processedImages.large, {
        filename: `large_${file.originalname}`,
        folder: `properties/${propertyId}/images`,
        mimetype: 'image/jpeg'
      }),
      storageService.uploadBuffer(processedImages.medium, {
        filename: `medium_${file.originalname}`,
        folder: `properties/${propertyId}/images`,
        mimetype: 'image/jpeg'
      }),
      storageService.uploadBuffer(processedImages.thumbnail, {
        filename: `thumb_${file.originalname}`,
        folder: `properties/${propertyId}/images`,
        mimetype: 'image/jpeg'
      })
    ]);

    // Save image record
    const image = await PropertyImage.create({
      property_id: propertyId,
      unit_id: unitId,
      title: title || file.originalname,
      description,
      original_url: uploadResults[0].url,
      large_url: uploadResults[1].url,
      medium_url: uploadResults[2].url,
      thumbnail_url: uploadResults[3].url,
      file_size: file.size,
      width: processedImages.metadata.width,
      height: processedImages.metadata.height,
      type,
      uploaded_by: uploadedBy
    });

    return image;
  }

  async processImage(file) {
    const image = sharp(file.buffer);
    const metadata = await image.metadata();

    const [original, large, medium, thumbnail] = await Promise.all([
      image.toBuffer(),
      image.resize(1200, 800, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 90 }).toBuffer(),
      image.resize(600, 400, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 85 }).toBuffer(),
      image.resize(300, 200, { fit: 'cover' }).jpeg({ quality: 80 }).toBuffer()
    ]);

    return {
      original,
      large,
      medium,
      thumbnail,
      metadata
    };
  }

  async getImages(propertyId, filters = {}) {
    const { unitId, type, limit = 50, offset = 0 } = filters;
    
    const where = { property_id: propertyId };
    if (unitId) where.unit_id = unitId;
    if (type) where.type = type;

    return await PropertyImage.findAndCountAll({
      where,
      limit,
      offset,
      order: [['display_order', 'ASC'], ['created_at', 'DESC']]
    });
  }

  async getImage(imageId) {
    return await PropertyImage.findByPk(imageId);
  }

  async updateImage(imageId, updateData) {
    const image = await PropertyImage.findByPk(imageId);
    if (!image) {
      throw new Error('Image not found');
    }

    return await image.update(updateData);
  }

  async deleteImage(imageId) {
    const image = await PropertyImage.findByPk(imageId);
    if (!image) {
      throw new Error('Image not found');
    }

    // Delete all image versions from storage
    await Promise.all([
      storageService.deleteFileByUrl(image.original_url),
      storageService.deleteFileByUrl(image.large_url),
      storageService.deleteFileByUrl(image.medium_url),
      storageService.deleteFileByUrl(image.thumbnail_url)
    ]);

    // Delete database record
    await image.destroy();

    return { success: true };
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

  async bulkUpload(propertyId, files, uploadedBy, unitId = null) {
    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const image = await this.uploadImage({
          propertyId,
          unitId,
          file,
          type: this.detectImageType(file, i),
          uploadedBy
        });
        results.push({ success: true, image });
      } catch (error) {
        results.push({ success: false, filename: file.originalname, error: error.message });
      }
    }

    return results;
  }

  detectImageType(file, index) {
    const filename = file.originalname.toLowerCase();
    
    if (filename.includes('exterior') || filename.includes('outside')) return 'exterior';
    if (filename.includes('interior') || filename.includes('inside')) return 'interior';
    if (filename.includes('kitchen')) return 'kitchen';
    if (filename.includes('bathroom')) return 'bathroom';
    if (filename.includes('bedroom')) return 'bedroom';
    if (filename.includes('living')) return 'living_room';
    if (index === 0) return 'main'; // First image is usually main
    
    return 'other';
  }

  async setMainImage(imageId, propertyId) {
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

    return await image.update({ is_main: true });
  }

  async getMainImage(propertyId) {
    return await PropertyImage.findOne({
      where: { property_id: propertyId, is_main: true }
    });
  }
}

module.exports = new ImageService();