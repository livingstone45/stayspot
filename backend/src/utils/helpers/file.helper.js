const fs = require('fs').promises;
const path = require('path');
const mime = require('mime-types');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const logger = require('../../config/logger');

class FileHelper {
  /**
   * Create directory if it doesn't exist
   * @param {string} dirPath - Directory path
   */
  static async ensureDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath);
    } catch (error) {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Get file extension from filename or mime type
   * @param {string} filename - Filename or mime type
   * @returns {string} File extension
   */
  static getFileExtension(filename) {
    const ext = path.extname(filename).toLowerCase();
    if (ext) return ext.substring(1);
    
    const mimeType = mime.lookup(filename);
    return mime.extension(mimeType) || '';
  }

  /**
   * Get mime type from filename
   * @param {string} filename - Filename
   * @returns {string} Mime type
   */
  static getMimeType(filename) {
    return mime.lookup(filename) || 'application/octet-stream';
  }

  /**
   * Check if file is an image
   * @param {string} filename - Filename
   * @returns {boolean} True if image
   */
  static isImage(filename) {
    const mimeType = this.getMimeType(filename);
    return mimeType.startsWith('image/');
  }

  /**
   * Check if file is a document
   * @param {string} filename - Filename
   * @returns {boolean} True if document
   */
  static isDocument(filename) {
    const mimeType = this.getMimeType(filename);
    return mimeType.startsWith('application/pdf') ||
           mimeType.includes('document') ||
           mimeType.includes('text/');
  }

  /**
   * Check if file is a video
   * @param {string} filename - Filename
   * @returns {boolean} True if video
   */
  static isVideo(filename) {
    const mimeType = this.getMimeType(filename);
    return mimeType.startsWith('video/');
  }

  /**
   * Generate unique filename with UUID
   * @param {string} originalName - Original filename
   * @returns {string} Unique filename
   */
  static generateUniqueFilename(originalName) {
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    const uuid = uuidv4();
    
    return `${name}-${uuid}${ext}`;
  }

  /**
   * Process and resize image
   * @param {Buffer} buffer - Image buffer
   * @param {Object} options - Resize options
   * @returns {Promise<Buffer>} Processed image buffer
   */
  static async processImage(buffer, options = {}) {
    const {
      width = 800,
      height = 600,
      quality = 80,
      format = 'jpeg'
    } = options;

    try {
      let image = sharp(buffer);
      
      // Get image metadata
      const metadata = await image.metadata();
      
      // Resize if needed
      if (metadata.width > width || metadata.height > height) {
        image = image.resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }
      
      // Convert to specified format
      switch (format.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          image = image.jpeg({ quality });
          break;
        case 'png':
          image = image.png({ quality });
          break;
        case 'webp':
          image = image.webp({ quality });
          break;
        default:
          image = image.jpeg({ quality });
      }
      
      return await image.toBuffer();
    } catch (error) {
      logger.error('Image processing failed:', error);
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  /**
   * Create thumbnail from image
   * @param {Buffer} buffer - Image buffer
   * @param {Object} options - Thumbnail options
   * @returns {Promise<Buffer>} Thumbnail buffer
   */
  static async createThumbnail(buffer, options = {}) {
    const {
      width = 200,
      height = 200,
      quality = 70,
      format = 'jpeg'
    } = options;

    try {
      let image = sharp(buffer);
      
      // Create thumbnail
      image = image.resize(width, height, {
        fit: 'cover',
        position: 'center'
      });
      
      // Convert to specified format
      switch (format.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          image = image.jpeg({ quality });
          break;
        case 'png':
          image = image.png({ quality });
          break;
        case 'webp':
          image = image.webp({ quality });
          break;
        default:
          image = image.jpeg({ quality });
      }
      
      return await image.toBuffer();
    } catch (error) {
      logger.error('Thumbnail creation failed:', error);
      throw new Error(`Thumbnail creation failed: ${error.message}`);
    }
  }

  /**
   * Validate file size
   * @param {number} size - File size in bytes
   * @param {number} maxSize - Maximum size in MB
   * @returns {boolean} True if valid
   */
  static validateFileSize(size, maxSize = 10) {
    const maxSizeBytes = maxSize * 1024 * 1024;
    return size <= maxSizeBytes;
  }

  /**
   * Get file size in readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted size
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Read file as buffer
   * @param {string} filePath - File path
   * @returns {Promise<Buffer>} File buffer
   */
  static async readFile(filePath) {
    try {
      return await fs.readFile(filePath);
    } catch (error) {
      logger.error(`Failed to read file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Write buffer to file
   * @param {string} filePath - File path
   * @param {Buffer} buffer - File buffer
   * @returns {Promise<void>}
   */
  static async writeFile(filePath, buffer) {
    try {
      await this.ensureDirectoryExists(path.dirname(filePath));
      await fs.writeFile(filePath, buffer);
    } catch (error) {
      logger.error(`Failed to write file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Delete file
   * @param {string} filePath - File path
   * @returns {Promise<void>}
   */
  static async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        logger.error(`Failed to delete file: ${filePath}`, error);
        throw error;
      }
    }
  }

  /**
   * Move file
   * @param {string} source - Source path
   * @param {string} destination - Destination path
   * @returns {Promise<void>}
   */
  static async moveFile(source, destination) {
    try {
      await this.ensureDirectoryExists(path.dirname(destination));
      await fs.rename(source, destination);
    } catch (error) {
      logger.error(`Failed to move file from ${source} to ${destination}`, error);
      throw error;
    }
  }

  /**
   * Copy file
   * @param {string} source - Source path
   * @param {string} destination - Destination path
   * @returns {Promise<void>}
   */
  static async copyFile(source, destination) {
    try {
      await this.ensureDirectoryExists(path.dirname(destination));
      await fs.copyFile(source, destination);
    } catch (error) {
      logger.error(`Failed to copy file from ${source} to ${destination}`, error);
      throw error;
    }
  }

  /**
   * Get file information
   * @param {string} filePath - File path
   * @returns {Promise<Object>} File info
   */
  static async getFileInfo(filePath) {
    try {
      const stats = await fs.stat(filePath);
      const ext = path.extname(filePath);
      const mimeType = this.getMimeType(filePath);
      
      return {
        path: filePath,
        name: path.basename(filePath),
        extension: ext.substring(1),
        mimeType,
        size: stats.size,
        sizeFormatted: this.formatFileSize(stats.size),
        created: stats.birthtime,
        modified: stats.mtime,
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile()
      };
    } catch (error) {
      logger.error(`Failed to get file info: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * List files in directory
   * @param {string} dirPath - Directory path
   * @param {Object} options - Options
   * @returns {Promise<Array>} File list
   */
  static async listFiles(dirPath, options = {}) {
    const {
      recursive = false,
      includeDirectories = false,
      filter = null
    } = options;

    try {
      const files = await fs.readdir(dirPath);
      const result = [];

      for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory() && recursive) {
          const subFiles = await this.listFiles(fullPath, options);
          result.push(...subFiles);
        }

        if ((includeDirectories && stats.isDirectory()) || stats.isFile()) {
          const fileInfo = await this.getFileInfo(fullPath);
          
          if (!filter || filter(fileInfo)) {
            result.push(fileInfo);
          }
        }
      }

      return result;
    } catch (error) {
      logger.error(`Failed to list files in: ${dirPath}`, error);
      throw error;
    }
  }

  /**
   * Clean up temporary files older than specified hours
   * @param {string} dirPath - Directory path
   * @param {number} hours - Hours threshold
   * @returns {Promise<number>} Number of files deleted
   */
  static async cleanupOldFiles(dirPath, hours = 24) {
    try {
      const files = await this.listFiles(dirPath);
      const cutoff = Date.now() - (hours * 60 * 60 * 1000);
      let deletedCount = 0;

      for (const file of files) {
        if (file.modified.getTime() < cutoff) {
          await this.deleteFile(file.path);
          deletedCount++;
        }
      }

      logger.info(`Cleaned up ${deletedCount} old files from ${dirPath}`);
      return deletedCount;
    } catch (error) {
      logger.error(`Failed to cleanup files in: ${dirPath}`, error);
      throw error;
    }
  }

  /**
   * Validate allowed file types
   * @param {string} filename - Filename
   * @param {Array} allowedTypes - Allowed mime types
   * @returns {boolean} True if allowed
   */
  static isAllowedFileType(filename, allowedTypes) {
    const mimeType = this.getMimeType(filename);
    return allowedTypes.includes(mimeType);
  }

  /**
   * Generate file hash
   * @param {Buffer} buffer - File buffer
   * @param {string} algorithm - Hash algorithm
   * @returns {string} Hash string
   */
  static generateFileHash(buffer, algorithm = 'sha256') {
    const crypto = require('crypto');
    const hash = crypto.createHash(algorithm);
    hash.update(buffer);
    return hash.digest('hex');
  }
}

module.exports = FileHelper;