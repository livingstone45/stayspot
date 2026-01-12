const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    'uploads/properties',
    'uploads/properties/images',
    'uploads/properties/documents',
    'uploads/profiles',
    'uploads/temp'
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/temp';
    
    if (file.fieldname === 'propertyImages') {
      uploadPath = 'uploads/properties/images';
    } else if (file.fieldname === 'propertyDocuments') {
      uploadPath = 'uploads/properties/documents';
    } else if (file.fieldname === 'profileImage') {
      uploadPath = 'uploads/profiles';
    } else if (file.fieldname === 'tenantDocuments') {
      uploadPath = 'uploads/tenants/documents';
    } else if (file.fieldname === 'maintenanceImages') {
      uploadPath = 'uploads/maintenance';
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${uniqueId}${ext}`;
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp|bmp/;
  const allowedDocumentTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv/;
  const allowedVideoTypes = /mp4|mov|avi|wmv|flv|mkv/;
  
  const ext = path.extname(file.originalname).toLowerCase().substring(1);
  
  // Check file type based on fieldname
  if (file.fieldname.includes('Image') || file.fieldname.includes('image')) {
    if (allowedImageTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, bmp)'), false);
    }
  } else if (file.fieldname.includes('Document') || file.fieldname.includes('document')) {
    if (allowedDocumentTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only document files are allowed (pdf, doc, docx, xls, xlsx, ppt, pptx, txt, csv)'), false);
    }
  } else if (file.fieldname.includes('Video') || file.fieldname.includes('video')) {
    if (allowedVideoTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed (mp4, mov, avi, wmv, flv, mkv)'), false);
    }
  } else {
    // Default: allow both images and documents
    if (allowedImageTypes.test(ext) || allowedDocumentTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
    files: 20 // Max 20 files per request
  }
});

/**
 * Process and optimize uploaded images
 */
const processImage = async (filePath, options = {}) => {
  try {
    const {
      width = 1920,
      height = 1080,
      quality = 80,
      format = 'webp',
      createThumbnail = true
    } = options;

    const processedImagePath = filePath.replace(path.extname(filePath), `.${format}`);
    
    // Process main image
    await sharp(filePath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFormat(format, { quality })
      .toFile(processedImagePath);

    // Create thumbnail if requested
    if (createThumbnail) {
      const thumbnailPath = filePath.replace(
        path.extname(filePath),
        `_thumb.${format}`
      );
      
      await sharp(filePath)
        .resize(400, 400, {
          fit: 'cover',
          position: 'center'
        })
        .toFormat(format, { quality: 70 })
        .toFile(thumbnailPath);
    }

    // Delete original if processed successfully
    if (filePath !== processedImagePath) {
      fs.unlinkSync(filePath);
    }

    return processedImagePath;
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error('Failed to process image');
  }
};

/**
 * Middleware for handling file uploads with specific configurations
 */
const uploadMiddleware = {
  // Single file uploads
  singleImage: upload.single('image'),
  singleDocument: upload.single('document'),
  
  // Property specific uploads
  propertyImages: upload.array('propertyImages', 20),
  propertyDocuments: upload.array('propertyDocuments', 10),
  
  // Profile uploads
  profileImage: upload.single('profileImage'),
  
  // Mixed uploads
  mixedUpload: upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'documents', maxCount: 5 },
    { name: 'videos', maxCount: 3 }
  ]),
  
  // Multiple files with any fieldname
  anyFiles: upload.any(),
  
  /**
   * Validate file upload results
   */
  validateUpload: (req, res, next) => {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No files were uploaded'
        });
      }
    }
    next();
  },
  
  /**
   * Clean up uploaded files on error
   */
  cleanupOnError: (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function (data) {
      // If error response, clean up uploaded files
      if (res.statusCode >= 400) {
        try {
          const files = req.files || [];
          if (req.file) files.push(req.file);
          
          files.forEach(file => {
            if (file.path && fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
        } catch (cleanupError) {
          console.error('Error cleaning up files:', cleanupError);
        }
      }
      
      originalSend.call(this, data);
    };
    
    next();
  },
  
  /**
   * Get file URLs for response
   */
  getFileUrls: (files, baseUrl = process.env.BASE_URL || 'http://localhost:5000') => {
    if (!files) return [];
    
    const fileArray = Array.isArray(files) ? files : [files];
    
    return fileArray.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `${baseUrl}/${file.path.replace(/\\/g, '/')}`,
      path: file.path
    }));
  },
  
  processImage
};

module.exports = {
  ...uploadMiddleware,
  upload
};