/**
 * File utilities for handling file operations, validation, and processing
 * Provides comprehensive file handling functions
 */

/**
 * File type categories
 */
export const FILE_CATEGORIES = {
  IMAGE: 'image',
  DOCUMENT: 'document',
  VIDEO: 'video',
  AUDIO: 'audio',
  ARCHIVE: 'archive',
  SPREADSHEET: 'spreadsheet',
  PRESENTATION: 'presentation',
  CODE: 'code',
  OTHER: 'other'
};

/**
 * MIME type mappings
 */
export const MIME_TYPES = {
  // Images
  'image/jpeg': { category: FILE_CATEGORIES.IMAGE, extensions: ['.jpg', '.jpeg'], icon: '🖼️' },
  'image/png': { category: FILE_CATEGORIES.IMAGE, extensions: ['.png'], icon: '🖼️' },
  'image/gif': { category: FILE_CATEGORIES.IMAGE, extensions: ['.gif'], icon: '🖼️' },
  'image/webp': { category: FILE_CATEGORIES.IMAGE, extensions: ['.webp'], icon: '🖼️' },
  'image/svg+xml': { category: FILE_CATEGORIES.IMAGE, extensions: ['.svg'], icon: '🖼️' },
  'image/bmp': { category: FILE_CATEGORIES.IMAGE, extensions: ['.bmp'], icon: '🖼️' },
  'image/tiff': { category: FILE_CATEGORIES.IMAGE, extensions: ['.tiff', '.tif'], icon: '🖼️' },

  // Documents
  'application/pdf': { category: FILE_CATEGORIES.DOCUMENT, extensions: ['.pdf'], icon: '📄' },
  'application/msword': { category: FILE_CATEGORIES.DOCUMENT, extensions: ['.doc'], icon: '📝' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { 
    category: FILE_CATEGORIES.DOCUMENT, extensions: ['.docx'], icon: '📝' 
  },
  'text/plain': { category: FILE_CATEGORIES.DOCUMENT, extensions: ['.txt'], icon: '📄' },
  'text/rtf': { category: FILE_CATEGORIES.DOCUMENT, extensions: ['.rtf'], icon: '📄' },

  // Spreadsheets
  'application/vnd.ms-excel': { category: FILE_CATEGORIES.SPREADSHEET, extensions: ['.xls'], icon: '📊' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { 
    category: FILE_CATEGORIES.SPREADSHEET, extensions: ['.xlsx'], icon: '📊' 
  },
  'text/csv': { category: FILE_CATEGORIES.SPREADSHEET, extensions: ['.csv'], icon: '📊' },

  // Presentations
  'application/vnd.ms-powerpoint': { category: FILE_CATEGORIES.PRESENTATION, extensions: ['.ppt'], icon: '📽️' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { 
    category: FILE_CATEGORIES.PRESENTATION, extensions: ['.pptx'], icon: '📽️' 
  },

  // Videos
  'video/mp4': { category: FILE_CATEGORIES.VIDEO, extensions: ['.mp4'], icon: '🎥' },
  'video/avi': { category: FILE_CATEGORIES.VIDEO, extensions: ['.avi'], icon: '🎥' },
  'video/mov': { category: FILE_CATEGORIES.VIDEO, extensions: ['.mov'], icon: '🎥' },
  'video/wmv': { category: FILE_CATEGORIES.VIDEO, extensions: ['.wmv'], icon: '🎥' },
  'video/webm': { category: FILE_CATEGORIES.VIDEO, extensions: ['.webm'], icon: '🎥' },

  // Audio
  'audio/mp3': { category: FILE_CATEGORIES.AUDIO, extensions: ['.mp3'], icon: '🎵' },
  'audio/wav': { category: FILE_CATEGORIES.AUDIO, extensions: ['.wav'], icon: '🎵' },
  'audio/ogg': { category: FILE_CATEGORIES.AUDIO, extensions: ['.ogg'], icon: '🎵' },
  'audio/aac': { category: FILE_CATEGORIES.AUDIO, extensions: ['.aac'], icon: '🎵' },

  // Archives
  'application/zip': { category: FILE_CATEGORIES.ARCHIVE, extensions: ['.zip'], icon: '🗜️' },
  'application/x-rar-compressed': { category: FILE_CATEGORIES.ARCHIVE, extensions: ['.rar'], icon: '🗜️' },
  'application/x-7z-compressed': { category: FILE_CATEGORIES.ARCHIVE, extensions: ['.7z'], icon: '🗜️' },
  'application/x-tar': { category: FILE_CATEGORIES.ARCHIVE, extensions: ['.tar'], icon: '🗜️' },
  'application/gzip': { category: FILE_CATEGORIES.ARCHIVE, extensions: ['.gz'], icon: '🗜️' },

  // Code
  'text/javascript': { category: FILE_CATEGORIES.CODE, extensions: ['.js'], icon: '💻' },
  'text/html': { category: FILE_CATEGORIES.CODE, extensions: ['.html'], icon: '💻' },
  'text/css': { category: FILE_CATEGORIES.CODE, extensions: ['.css'], icon: '💻' },
  'application/json': { category: FILE_CATEGORIES.CODE, extensions: ['.json'], icon: '💻' },
  'text/xml': { category: FILE_CATEGORIES.CODE, extensions: ['.xml'], icon: '💻' }
};

/**
 * File size units
 */
const SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

/**
 * Maximum file sizes by category (in bytes)
 */
export const MAX_FILE_SIZES = {
  [FILE_CATEGORIES.IMAGE]: 10 * 1024 * 1024, // 10MB
  [FILE_CATEGORIES.DOCUMENT]: 50 * 1024 * 1024, // 50MB
  [FILE_CATEGORIES.VIDEO]: 500 * 1024 * 1024, // 500MB
  [FILE_CATEGORIES.AUDIO]: 100 * 1024 * 1024, // 100MB
  [FILE_CATEGORIES.ARCHIVE]: 100 * 1024 * 1024, // 100MB
  [FILE_CATEGORIES.SPREADSHEET]: 25 * 1024 * 1024, // 25MB
  [FILE_CATEGORIES.PRESENTATION]: 100 * 1024 * 1024, // 100MB
  [FILE_CATEGORIES.CODE]: 5 * 1024 * 1024, // 5MB
  [FILE_CATEGORIES.OTHER]: 25 * 1024 * 1024 // 25MB
};

/**
 * Get file information from File object
 * @param {File} file - File object
 * @returns {Object} File information
 */
export const getFileInfo = (file) => {
  if (!file || !(file instanceof File)) {
    return null;
  }

  const extension = getFileExtension(file.name);
  const mimeInfo = MIME_TYPES[file.type] || { 
    category: FILE_CATEGORIES.OTHER, 
    extensions: [extension], 
    icon: '📎' 
  };

  return {
    name: file.name,
    size: file.size,
    type: file.type,
    extension,
    category: mimeInfo.category,
    icon: mimeInfo.icon,
    lastModified: file.lastModified ? new Date(file.lastModified) : null,
    formattedSize: formatFileSize(file.size),
    isImage: mimeInfo.category === FILE_CATEGORIES.IMAGE,
    isDocument: mimeInfo.category === FILE_CATEGORIES.DOCUMENT,
    isVideo: mimeInfo.category === FILE_CATEGORIES.VIDEO,
    isAudio: mimeInfo.category === FILE_CATEGORIES.AUDIO
  };
};

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 B';
  if (!bytes || isNaN(bytes)) return 'Unknown';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${size} ${SIZE_UNITS[i]}`;
};

/**
 * Get file extension from filename
 * @param {string} filename - Filename
 * @returns {string} File extension (with dot)
 */
export const getFileExtension = (filename) => {
  if (!filename || typeof filename !== 'string') return '';
  
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) return '';
  
  return filename.substring(lastDotIndex).toLowerCase();
};

/**
 * Get filename without extension
 * @param {string} filename - Filename
 * @returns {string} Filename without extension
 */
export const getFileNameWithoutExtension = (filename) => {
  if (!filename || typeof filename !== 'string') return '';
  
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return filename;
  
  return filename.substring(0, lastDotIndex);
};

/**
 * Validate file against constraints
 * @param {File} file - File to validate
 * @param {Object} constraints - Validation constraints
 * @returns {Object} Validation result
 */
export const validateFile = (file, constraints = {}) => {
  const {
    maxSize,
    allowedTypes = [],
    allowedExtensions = [],
    allowedCategories = [],
    required = false
  } = constraints;

  if (!file) {
    if (required) {
      return { isValid: false, error: 'File is required' };
    }
    return { isValid: true };
  }

  if (!(file instanceof File)) {
    return { isValid: false, error: 'Invalid file object' };
  }

  const fileInfo = getFileInfo(file);

  // Size validation
  const sizeLimit = maxSize || MAX_FILE_SIZES[fileInfo.category] || MAX_FILE_SIZES[FILE_CATEGORIES.OTHER];
  if (file.size > sizeLimit) {
    return {
      isValid: false,
      error: `File size (${fileInfo.formattedSize}) exceeds limit (${formatFileSize(sizeLimit)})`
    };
  }

  // Type validation
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type '${file.type}' is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  // Extension validation
  if (allowedExtensions.length > 0 && !allowedExtensions.includes(fileInfo.extension)) {
    return {
      isValid: false,
      error: `File extension '${fileInfo.extension}' is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`
    };
  }

  // Category validation
  if (allowedCategories.length > 0 && !allowedCategories.includes(fileInfo.category)) {
    return {
      isValid: false,
      error: `File category '${fileInfo.category}' is not allowed. Allowed categories: ${allowedCategories.join(', ')}`
    };
  }

  return { isValid: true, fileInfo };
};

/**
 * Read file as text
 * @param {File} file - File to read
 * @param {string} encoding - Text encoding (default: utf-8)
 * @returns {Promise<string>} File content as text
 */
export const readFileAsText = (file, encoding = 'utf-8') => {
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof File)) {
      reject(new Error('Invalid file'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file, encoding);
  });
};

/**
 * Read file as data URL (base64)
 * @param {File} file - File to read
 * @returns {Promise<string>} File content as data URL
 */
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof File)) {
      reject(new Error('Invalid file'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Read file as array buffer
 * @param {File} file - File to read
 * @returns {Promise<ArrayBuffer>} File content as array buffer
 */
export const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof File)) {
      reject(new Error('Invalid file'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Compress image file
 * @param {File} file - Image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} Compressed image file
 */
export const compressImage = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      outputFormat = 'image/jpeg'
    } = options;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: outputFormat,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        } else {
          reject(new Error('Failed to compress image'));
        }
      }, outputFormat, quality);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Generate thumbnail for image file
 * @param {File} file - Image file
 * @param {Object} options - Thumbnail options
 * @returns {Promise<string>} Thumbnail data URL
 */
export const generateThumbnail = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    const {
      width = 150,
      height = 150,
      quality = 0.8,
      format = 'image/jpeg'
    } = options;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;

      // Calculate crop dimensions to maintain aspect ratio
      const aspectRatio = img.width / img.height;
      const targetAspectRatio = width / height;

      let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;

      if (aspectRatio > targetAspectRatio) {
        // Image is wider than target
        sourceWidth = img.height * targetAspectRatio;
        sourceX = (img.width - sourceWidth) / 2;
      } else {
        // Image is taller than target
        sourceHeight = img.width / targetAspectRatio;
        sourceY = (img.height - sourceHeight) / 2;
      }

      ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
      
      const dataURL = canvas.toDataURL(format, quality);
      resolve(dataURL);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Download file from URL
 * @param {string} url - File URL
 * @param {string} filename - Desired filename
 * @returns {Promise<void>} Download promise
 */
export const downloadFile = async (url, filename) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

/**
 * Download blob as file
 * @param {Blob} blob - Blob to download
 * @param {string} filename - Filename
 */
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Convert file to different format (for images)
 * @param {File} file - Source file
 * @param {string} targetFormat - Target MIME type
 * @param {number} quality - Quality (0-1)
 * @returns {Promise<File>} Converted file
 */
export const convertImageFormat = (file, targetFormat, quality = 0.9) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const extension = targetFormat.split('/')[1];
          const newFilename = getFileNameWithoutExtension(file.name) + '.' + extension;
          
          const convertedFile = new File([blob], newFilename, {
            type: targetFormat,
            lastModified: Date.now()
          });
          resolve(convertedFile);
        } else {
          reject(new Error('Failed to convert image'));
        }
      }, targetFormat, quality);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Create file from text content
 * @param {string} content - Text content
 * @param {string} filename - Filename
 * @param {string} mimeType - MIME type
 * @returns {File} Created file
 */
export const createFileFromText = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  return new File([blob], filename, { type: mimeType, lastModified: Date.now() });
};

/**
 * Create file from JSON object
 * @param {Object} data - Data object
 * @param {string} filename - Filename
 * @returns {File} Created JSON file
 */
export const createJSONFile = (data, filename) => {
  const content = JSON.stringify(data, null, 2);
  return createFileFromText(content, filename, 'application/json');
};

/**
 * Create CSV file from array of objects
 * @param {Array} data - Array of objects
 * @param {string} filename - Filename
 * @param {Array} headers - Optional custom headers
 * @returns {File} Created CSV file
 */
export const createCSVFile = (data, filename, headers = null) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Data must be a non-empty array');
  }

  const csvHeaders = headers || Object.keys(data[0]);
  const csvRows = [
    csvHeaders.join(','),
    ...data.map(row => 
      csvHeaders.map(header => {
        const value = row[header] || '';
        // Escape commas and quotes
        return typeof value === 'string' && (value.includes(',') || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    )
  ];

  const content = csvRows.join('\n');
  return createFileFromText(content, filename, 'text/csv');
};

/**
 * Parse CSV file content
 * @param {string} csvContent - CSV content
 * @param {Object} options - Parsing options
 * @returns {Array} Parsed data array
 */
export const parseCSV = (csvContent, options = {}) => {
  const { delimiter = ',', hasHeaders = true, skipEmptyLines = true } = options;
  
  const lines = csvContent.split('\n');
  if (skipEmptyLines) {
    lines.filter(line => line.trim() !== '');
  }

  if (lines.length === 0) return [];

  const headers = hasHeaders ? lines[0].split(delimiter) : null;
  const dataLines = hasHeaders ? lines.slice(1) : lines;

  return dataLines.map((line, index) => {
    const values = line.split(delimiter);
    
    if (headers) {
      const row = {};
      headers.forEach((header, i) => {
        row[header.trim()] = values[i] ? values[i].trim() : '';
      });
      return row;
    } else {
      return values.map(value => value.trim());
    }
  });
};

/**
 * Get file icon based on file type
 * @param {string} filename - Filename or MIME type
 * @returns {string} File icon emoji
 */
export const getFileIcon = (filename) => {
  if (!filename) return '📎';

  // Check by MIME type first
  const mimeInfo = MIME_TYPES[filename];
  if (mimeInfo) return mimeInfo.icon;

  // Check by extension
  const extension = getFileExtension(filename);
  for (const [mimeType, info] of Object.entries(MIME_TYPES)) {
    if (info.extensions.includes(extension)) {
      return info.icon;
    }
  }

  return '📎'; // Default icon
};

/**
 * Check if file is an image
 * @param {File|string} file - File object or MIME type
 * @returns {boolean} Whether file is an image
 */
export const isImageFile = (file) => {
  const mimeType = typeof file === 'string' ? file : file?.type;
  return mimeType ? mimeType.startsWith('image/') : false;
};

/**
 * Check if file is a document
 * @param {File|string} file - File object or MIME type
 * @returns {boolean} Whether file is a document
 */
export const isDocumentFile = (file) => {
  const mimeType = typeof file === 'string' ? file : file?.type;
  if (!mimeType) return false;
  
  const mimeInfo = MIME_TYPES[mimeType];
  return mimeInfo?.category === FILE_CATEGORIES.DOCUMENT;
};

/**
 * Check if file is a video
 * @param {File|string} file - File object or MIME type
 * @returns {boolean} Whether file is a video
 */
export const isVideoFile = (file) => {
  const mimeType = typeof file === 'string' ? file : file?.type;
  return mimeType ? mimeType.startsWith('video/') : false;
};

/**
 * Check if file is audio
 * @param {File|string} file - File object or MIME type
 * @returns {boolean} Whether file is audio
 */
export const isAudioFile = (file) => {
  const mimeType = typeof file === 'string' ? file : file?.type;
  return mimeType ? mimeType.startsWith('audio/') : false;
};

// Export all file utilities
export default {
  FILE_CATEGORIES,
  MIME_TYPES,
  MAX_FILE_SIZES,
  getFileInfo,
  formatFileSize,
  getFileExtension,
  getFileNameWithoutExtension,
  validateFile,
  readFileAsText,
  readFileAsDataURL,
  readFileAsArrayBuffer,
  compressImage,
  generateThumbnail,
  downloadFile,
  downloadBlob,
  convertImageFormat,
  createFileFromText,
  createJSONFile,
  createCSVFile,
  parseCSV,
  getFileIcon,
  isImageFile,
  isDocumentFile,
  isVideoFile,
  isAudioFile
};