import React, { useState, useRef } from 'react';
import { Upload, X, Image, File, Video, FileText } from 'lucide-react';

const FormUpload = ({
  name,
  label,
  value = [],
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  multiple = false,
  accept = 'image/*,.pdf,.doc,.docx',
  maxSize = 10 * 1024 * 1024, // 10MB
  className = '',
  containerClassName = '',
  labelClassName = '',
  ...props
}) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = [];

    for (const file of fileArray) {
      if (file.size > maxSize) {
        alert(`File ${file.name} exceeds maximum size of ${maxSize / (1024 * 1024)}MB`);
        continue;
      }

      if (accept && !isFileTypeAccepted(file, accept)) {
        alert(`File ${file.name} type not allowed`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      const newFiles = multiple ? [...value, ...validFiles] : [validFiles[0]];
      onChange({
        target: {
          name,
          value: newFiles
        }
      });
    }
  };

  const isFileTypeAccepted = (file, acceptPattern) => {
    const patterns = acceptPattern.split(',').map(pattern => pattern.trim());
    return patterns.some(pattern => {
      if (pattern.endsWith('/*')) {
        const type = pattern.split('/')[0];
        return file.type.startsWith(type + '/');
      }
      if (pattern.startsWith('.')) {
        return file.name.toLowerCase().endsWith(pattern.toLowerCase());
      }
      return file.type === pattern;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange({
      target: {
        name,
        value: newFiles
      }
    });
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="h-8 w-8 text-purple-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label
          className={`block text-sm font-medium mb-2 ${
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
          } ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200
          ${dragOver ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 dark:border-gray-600'}
          ${error ? 'border-red-300 dark:border-red-700' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
          {...props}
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
            <Upload className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {accept} • Max {maxSize / (1024 * 1024)}MB per file
            </p>
          </div>
        </div>
      </div>

      {/* Preview uploaded files */}
      {value && value.length > 0 && (
        <div className="mt-4 space-y-3">
          {value.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {file.type?.startsWith('image/') ? (
                  <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={file instanceof File ? URL.createObjectURL(file) : file}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    {getFileIcon(file)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default FormUpload;