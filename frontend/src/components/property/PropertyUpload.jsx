import React, { useState, useRef } from 'react';
import {
  ArrowUpTrayIcon,
  DocumentArrowUpIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
  PhotoIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';
import Button from '../common/UI/Button';

const PropertyUpload = ({
  onUploadComplete,
  onCancel,
  title = 'Bulk Property Upload',
  description = 'Upload multiple properties via CSV or Excel file',
  acceptedFormats = ['.csv', '.xlsx', '.xls'],
  maxFileSize = 10, // MB
  sampleFileUrl = '/samples/properties-sample.csv',
}) => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, processing, complete, error
  const [validationResults, setValidationResults] = useState(null);
  const [uploadStats, setUploadStats] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [mapping, setMapping] = useState({});
  const [autoMapping, setAutoMapping] = useState(true);
  
  const fileInputRef = useRef(null);
  
  // Sample CSV headers for mapping
  const sampleHeaders = [
    'property_title',
    'address',
    'city',
    'state',
    'zip_code',
    'property_type',
    'bedrooms',
    'bathrooms',
    'square_feet',
    'monthly_rent',
    'property_status',
    'year_built',
    'description',
  ];

  const requiredFields = [
    'property_title',
    'address',
    'city',
    'state',
    'zip_code',
    'property_type',
    'monthly_rent',
  ];

  const fieldDescriptions = {
    property_title: 'Property Title (e.g., Ocean View Villa)',
    address: 'Street Address',
    city: 'City',
    state: 'State (2-letter code)',
    zip_code: 'ZIP Code',
    property_type: 'Property Type (apartment, house, condo, etc.)',
    bedrooms: 'Number of Bedrooms',
    bathrooms: 'Number of Bathrooms',
    square_feet: 'Square Footage',
    monthly_rent: 'Monthly Rent Amount',
    property_status: 'Status (listed, occupied, vacant, etc.)',
    year_built: 'Year Built',
    description: 'Property Description',
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndAddFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    validateAndAddFiles(selectedFiles);
  };

  const validateAndAddFiles = (fileList) => {
    const validFiles = [];
    const errors = [];
    
    fileList.forEach(file => {
      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxFileSize) {
        errors.push(`${file.name}: File size exceeds ${maxFileSize}MB limit`);
        return;
      }
      
      // Check file extension
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!acceptedFormats.includes(fileExtension)) {
        errors.push(`${file.name}: Invalid file format. Accepted formats: ${acceptedFormats.join(', ')}`);
        return;
      }
      
      validFiles.push(file);
    });
    
    if (errors.length > 0) {
      alert(errors.join('\n'));
    }
    
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      // Auto-process the first file for preview
      if (validFiles[0] && !validationResults) {
        processFileForPreview(validFiles[0]);
      }
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (index === 0) {
      setValidationResults(null);
      setMapping({});
    }
  };

  const processFileForPreview = async (file) => {
    setUploadStatus('processing');
    
    try {
      // Simulate file processing
      const text = await readFileAsText(file);
      const rows = parseCSV(text);
      
      if (rows.length < 2) {
        throw new Error('File must contain at least a header row and one data row');
      }
      
      const headers = rows[0];
      const sampleData = rows.slice(1, 3); // First 2 data rows for preview
      
      // Auto-map headers to our expected fields
      const autoMapped = {};
      if (autoMapping) {
        headers.forEach(header => {
          const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '_');
          const matchedField = sampleHeaders.find(field => 
            normalizedHeader.includes(field) || field.includes(normalizedHeader)
          );
          if (matchedField) {
            autoMapped[header] = matchedField;
          }
        });
      }
      
      setMapping(autoMapped);
      
      // Validate data
      const validation = validateData(headers, rows.slice(1), autoMapped);
      setValidationResults(validation);
      
      setUploadStatus('idle');
    } catch (error) {
      setUploadStatus('error');
      alert(`Error processing file: ${error.message}`);
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const parseCSV = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    return lines.map(line => {
      // Simple CSV parsing (for demo - use a library like PapaParse in production)
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      
      result.push(current);
      return result;
    });
  };

  const validateData = (headers, dataRows, mapping) => {
    const results = {
      isValid: true,
      totalRows: dataRows.length,
      validRows: 0,
      invalidRows: 0,
      errors: [],
      warnings: [],
      sampleData: dataRows.slice(0, 5),
    };
    
    // Check required fields are mapped
    const mappedFields = Object.values(mapping);
    const missingRequired = requiredFields.filter(field => !mappedFields.includes(field));
    
    if (missingRequired.length > 0) {
      results.isValid = false;
      results.errors.push(`Missing required field mappings: ${missingRequired.join(', ')}`);
    }
    
    // Validate sample data
    dataRows.slice(0, 10).forEach((row, rowIndex) => {
      const rowErrors = [];
      
      headers.forEach((header, colIndex) => {
        const field = mapping[header];
        const value = row[colIndex]?.trim();
        
        if (!field) return;
        
        // Field-specific validation
        switch(field) {
          case 'monthly_rent':
            if (value && isNaN(Number(value))) {
              rowErrors.push(`${field}: Must be a number`);
            }
            break;
          case 'bedrooms':
          case 'bathrooms':
          case 'square_feet':
          case 'year_built':
            if (value && isNaN(Number(value))) {
              rowErrors.push(`${field}: Must be a number`);
            }
            break;
          case 'state':
            if (value && value.length !== 2) {
              rowErrors.push(`${field}: State must be 2-letter code`);
            }
            break;
        }
        
        // Required field validation
        if (requiredFields.includes(field) && !value) {
          rowErrors.push(`${field}: Required field is empty`);
        }
      });
      
      if (rowErrors.length > 0) {
        results.invalidRows++;
        if (rowIndex < 3) {
          results.errors.push(`Row ${rowIndex + 2}: ${rowErrors.join('; ')}`);
        }
      } else {
        results.validRows++;
      }
    });
    
    // Calculate statistics
    const errorRate = (results.invalidRows / results.totalRows) * 100;
    if (errorRate > 20) {
      results.warnings.push(`High error rate detected: ${errorRate.toFixed(1)}% of rows have issues`);
    }
    
    return results;
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploadStatus('uploading');
    setUploadProgress({});
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => ({
        ...prev,
        [files[0].name]: Math.min((prev[files[0].name] || 0) + 10, 90),
      }));
    }, 200);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      
      // Set final progress
      setUploadProgress(prev => ({
        ...prev,
        [files[0].name]: 100,
      }));
      
      // Simulate processing
      setUploadStatus('processing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate upload stats
      const stats = {
        total: validationResults.totalRows,
        successful: validationResults.validRows,
        failed: validationResults.invalidRows,
        skipped: 0,
        duplicates: 0,
      };
      
      setUploadStats(stats);
      setUploadStatus('complete');
      
      if (onUploadComplete) {
        onUploadComplete({
          file: files[0],
          stats,
          validationResults,
          mapping,
        });
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus('error');
      alert(`Upload failed: ${error.message}`);
    }
  };

  const downloadSampleFile = () => {
    // Create sample CSV content
    const sampleContent = [
      sampleHeaders.join(','),
      'Ocean View Villa,123 Beach Blvd,Santa Monica,CA,90401,apartment,2,2,1200,3500,listed,2018,Beautiful ocean view apartment with modern amenities',
      'Downtown Loft,456 Main St,Los Angeles,CA,90014,condo,1,1,800,2800,occupied,2020,Modern loft in downtown with city views',
      'Garden Cottage,789 Oak Ave,Pasadena,CA,91101,house,3,2,1800,4200,vacant,2015,Charming cottage with garden and updated kitchen',
    ].join('\n');
    
    const blob = new Blob([sampleContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'properties-sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetUpload = () => {
    setFiles([]);
    setUploadStatus('idle');
    setValidationResults(null);
    setUploadStats(null);
    setMapping({});
  };

  const handleMappingChange = (header, field) => {
    setMapping(prev => ({
      ...prev,
      [header]: field,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>

      {/* Step 1: File Selection */}
      {files.length === 0 ? (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
            <CloudArrowUpIcon className="h-full w-full" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop files here</h3>
          <p className="text-gray-600 mb-6">
            Upload CSV or Excel files. Maximum file size: {maxFileSize}MB
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            icon={ArrowUpTrayIcon}
          >
            Select Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFormats.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
          <p className="text-sm text-gray-500 mt-4">
            Supported formats: {acceptedFormats.join(', ')}
          </p>
        </div>
      ) : (
        <>
          {/* File List */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Files</h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center flex-1">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                      <p className="text-sm text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {uploadProgress[file.name] !== undefined && (
                      <div className="w-32">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${uploadProgress[file.name]}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          {uploadProgress[file.name]}%
                        </p>
                      </div>
                    )}
                    
                    {index === 0 && validationResults && (
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        validationResults.isValid
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {validationResults.isValid ? 'Valid' : 'Invalid'}
                      </div>
                    )}
                    
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Field Mapping */}
          {validationResults && files.length > 0 && (
            <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-semibold text-gray-900">Field Mapping</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Map your CSV columns to StaySpot property fields
                </p>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={autoMapping}
                      onChange={(e) => setAutoMapping(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Auto-detect field mappings
                    </span>
                  </label>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CSV Column
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Map to Field
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sample Value
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {validationResults.sampleData[0]?.map((value, index) => {
                        const header = validationResults.sampleData[0][index];
                        const sampleValue = validationResults.sampleData[1]?.[index] || 'No sample';
                        const mappedField = mapping[header];
                        const isRequired = requiredFields.includes(mappedField);
                        
                        return (
                          <tr key={index}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {header}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <select
                                value={mappedField || ''}
                                onChange={(e) => handleMappingChange(header, e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select field...</option>
                                {sampleHeaders.map(field => (
                                  <option key={field} value={field}>
                                    {fieldDescriptions[field] || field}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                              {sampleValue}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {mappedField ? (
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  isRequired
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {isRequired ? 'Required' : 'Optional'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Not Mapped
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Validation Results */}
          {validationResults && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Rows</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {validationResults.totalRows}
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600">Valid Rows</p>
                  <p className="text-2xl font-bold text-green-700">
                    {validationResults.validRows}
                  </p>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-sm text-red-600">Invalid Rows</p>
                  <p className="text-2xl font-bold text-red-700">
                    {validationResults.invalidRows}
                  </p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600">Success Rate</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {validationResults.totalRows > 0
                      ? ((validationResults.validRows / validationResults.totalRows) * 100).toFixed(1)
                      : 0}%
                  </p>
                </div>
              </div>
              
              {/* Errors & Warnings */}
              {validationResults.errors.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                    <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                    Errors ({validationResults.errors.length})
                  </h4>
                  <div className="bg-red-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                    {validationResults.errors.map((error, index) => (
                      <p key={index} className="text-sm text-red-700 mb-1">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              
              {validationResults.warnings.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-yellow-700 mb-2 flex items-center">
                    <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                    Warnings ({validationResults.warnings.length})
                  </h4>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    {validationResults.warnings.map((warning, index) => (
                      <p key={index} className="text-sm text-yellow-700 mb-1">
                        {warning}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Status */}
          {uploadStatus === 'complete' && uploadStats && (
            <div className="mb-6 bg-green-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-green-900">Upload Complete!</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">Properties Added</p>
                  <p className="text-2xl font-bold text-green-600">
                    {uploadStats.successful}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">
                    {uploadStats.failed}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">Skipped</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {uploadStats.skipped}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">Duplicates</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {uploadStats.duplicates}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={resetUpload}
                  variant="outline"
                >
                  Upload Another File
                </Button>
                <Button onClick={() => window.location.href = '/properties'}>
                  View Properties
                </Button>
              </div>
            </div>
          )}
          
          {uploadStatus === 'error' && (
            <div className="mb-6 bg-red-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <ExclamationCircleIcon className="h-8 w-8 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-red-900">Upload Failed</h3>
              </div>
              <p className="text-red-700 mb-4">
                There was an error processing your upload. Please check your file and try again.
              </p>
              <Button
                onClick={resetUpload}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                onClick={downloadSampleFile}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                Download Sample File
              </button>
              
              <button
                onClick={resetUpload}
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-500"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Clear All
              </button>
            </div>
            
            <div className="flex space-x-3">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
                >
                  Cancel
                </Button>
              )}
              
              <Button
                onClick={handleUpload}
                loading={uploadStatus === 'uploading' || uploadStatus === 'processing'}
                disabled={
                  files.length === 0 ||
                  uploadStatus === 'uploading' ||
                  uploadStatus === 'processing' ||
                  uploadStatus === 'complete' ||
                  (validationResults && !validationResults.isValid)
                }
                icon={uploadStatus === 'complete' ? CheckCircleIcon : ArrowUpTrayIcon}
              >
                {uploadStatus === 'complete' ? 'Uploaded' : 'Upload Properties'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyUpload;