const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;
const path = require('path');
const { logger } = require('../../utils/logger');

class StorageService {
  constructor() {
    this.isCloudinaryEnabled = false;
    this.localStoragePath = process.env.UPLOAD_PATH || './uploads';
    this.init();
  }

  init() {
    if (process.env.CLOUDINARY_URL) {
      this.isCloudinaryEnabled = true;
      logger.info('Storage service initialized with Cloudinary');
    } else {
      logger.info('Storage service using local storage');
      this.ensureLocalDirectory();
    }
  }

  async ensureLocalDirectory() {
    try {
      await fs.mkdir(this.localStoragePath, { recursive: true });
    } catch (error) {
      logger.error('Failed to create upload directory:', error);
    }
  }

  async uploadFile(file, options = {}) {
    const { folder = 'uploads', allowedTypes = [], maxSize = 10 * 1024 * 1024 } = options;

    // Validate file
    this.validateFile(file, allowedTypes, maxSize);

    if (this.isCloudinaryEnabled) {
      return await this.uploadToCloudinary(file, folder);
    } else {
      return await this.uploadToLocal(file, folder);
    }
  }

  async uploadBuffer(buffer, options = {}) {
    const { filename, folder = 'uploads', mimetype = 'application/octet-stream' } = options;

    if (this.isCloudinaryEnabled) {
      return await this.uploadBufferToCloudinary(buffer, filename, folder);
    } else {
      return await this.uploadBufferToLocal(buffer, filename, folder);
    }
  }

  async uploadToCloudinary(file, folder) {
    try {
      const result = await cloudinary.uploader.upload(file.path || file.buffer, {
        folder,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true
      });

      return {
        filename: result.public_id,
        path: result.public_id,
        url: result.secure_url,
        size: result.bytes,
        format: result.format
      };
    } catch (error) {
      logger.error('Cloudinary upload failed:', error);
      throw new Error('File upload failed');
    }
  }

  async uploadBufferToCloudinary(buffer, filename, folder) {
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
            public_id: filename
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      return {
        filename: result.public_id,
        path: result.public_id,
        url: result.secure_url,
        size: result.bytes,
        format: result.format
      };
    } catch (error) {
      logger.error('Cloudinary buffer upload failed:', error);
      throw new Error('File upload failed');
    }
  }

  async uploadToLocal(file, folder) {
    const filename = this.generateFilename(file.originalname);
    const folderPath = path.join(this.localStoragePath, folder);
    const filePath = path.join(folderPath, filename);

    // Ensure directory exists
    await fs.mkdir(folderPath, { recursive: true });

    // Write file
    if (file.buffer) {
      await fs.writeFile(filePath, file.buffer);
    } else if (file.path) {
      await fs.copyFile(file.path, filePath);
    } else {
      throw new Error('Invalid file data');
    }

    return {
      filename,
      path: filePath,
      url: `/uploads/${folder}/${filename}`,
      size: file.size
    };
  }

  async uploadBufferToLocal(buffer, filename, folder) {
    const folderPath = path.join(this.localStoragePath, folder);
    const filePath = path.join(folderPath, filename);

    await fs.mkdir(folderPath, { recursive: true });
    await fs.writeFile(filePath, buffer);

    return {
      filename,
      path: filePath,
      url: `/uploads/${folder}/${filename}`,
      size: buffer.length
    };
  }

  async deleteFile(filePath) {
    if (this.isCloudinaryEnabled) {
      return await this.deleteFromCloudinary(filePath);
    } else {
      return await this.deleteFromLocal(filePath);
    }
  }

  async deleteFileByUrl(url) {
    if (this.isCloudinaryEnabled) {
      const publicId = this.extractPublicIdFromUrl(url);
      return await this.deleteFromCloudinary(publicId);
    } else {
      const filePath = path.join(this.localStoragePath, url.replace('/uploads/', ''));
      return await this.deleteFromLocal(filePath);
    }
  }

  async deleteFromCloudinary(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return { success: true };
    } catch (error) {
      logger.error('Cloudinary delete failed:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteFromLocal(filePath) {
    try {
      await fs.unlink(filePath);
      return { success: true };
    } catch (error) {
      logger.error('Local file delete failed:', error);
      return { success: false, error: error.message };
    }
  }

  async generateSignedUrl(filePath, expiresIn = 3600) {
    if (this.isCloudinaryEnabled) {
      return cloudinary.utils.private_download_url(filePath, 'image', {
        expires_at: Math.floor(Date.now() / 1000) + expiresIn
      });
    } else {
      // For local storage, return the direct URL (in production, use a signed URL service)
      return filePath;
    }
  }

  validateFile(file, allowedTypes, maxSize) {
    if (file.size > maxSize) {
      throw new Error(`File size exceeds limit of ${maxSize} bytes`);
    }

    if (allowedTypes.length > 0) {
      const ext = path.extname(file.originalname).toLowerCase().substring(1);
      if (!allowedTypes.includes(ext)) {
        throw new Error(`File type ${ext} not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      }
    }
  }

  generateFilename(originalName) {
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    
    return `${name}_${timestamp}_${random}${ext}`;
  }

  extractPublicIdFromUrl(url) {
    // Extract public ID from Cloudinary URL
    const matches = url.match(/\/v\d+\/(.+)\./);
    return matches ? matches[1] : url;
  }
}

module.exports = new StorageService();