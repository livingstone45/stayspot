const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

class CloudinaryService {
  constructor() {
    this.cloudinary = cloudinary;
  }

  /**
   * Upload image to Cloudinary
   * @param {Buffer|string} file - File buffer or base64 string
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result
   */
  async uploadImage(file, options = {}) {
    try {
      const uploadOptions = {
        folder: options.folder || 'stayspot/properties',
        resource_type: 'image',
        transformation: [
          { width: 1920, height: 1080, crop: 'limit' },
          { quality: 'auto:good' }
        ],
        ...options
      };

      let result;
      if (Buffer.isBuffer(file)) {
        result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(file);
        });
      } else {
        result = await cloudinary.uploader.upload(file, uploadOptions);
      }

      return {
        success: true,
        public_id: result.public_id,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  /**
   * Upload multiple images
   * @param {Array} files - Array of file buffers or base64 strings
   * @param {Object} options - Upload options
   * @returns {Promise<Array>} Array of upload results
   */
  async uploadMultipleImages(files, options = {}) {
    const uploadPromises = files.map((file, index) => 
      this.uploadImage(file, { 
        ...options, 
        folder: `${options.folder || 'stayspot/properties'}/batch_${Date.now()}` 
      })
    );
    return Promise.all(uploadPromises);
  }

  /**
   * Delete image from Cloudinary
   * @param {string} publicId - Public ID of the image
   * @returns {Promise<Object>} Delete result
   */
  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return {
        success: result.result === 'ok',
        message: result.result === 'ok' ? 'Image deleted successfully' : 'Failed to delete image'
      };
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error(`Image deletion failed: ${error.message}`);
    }
  }

  /**
   * Generate image URL with transformations
   * @param {string} publicId - Public ID of the image
   * @param {Object} transformations - Cloudinary transformations
   * @returns {string} Transformed image URL
   */
  generateImageUrl(publicId, transformations = {}) {
    return cloudinary.url(publicId, {
      secure: true,
      transformation: [
        { width: transformations.width || 800, crop: 'scale' },
        { quality: transformations.quality || 'auto:good' },
        { format: transformations.format || 'auto' }
      ]
    });
  }
}

module.exports = new CloudinaryService();