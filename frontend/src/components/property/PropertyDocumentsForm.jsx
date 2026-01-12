import React, { useState, useEffect } from 'react';
import { FileUpload, Trash2, Download, Eye, Filter, Plus, Calendar, Tag } from 'lucide-react';
import Button from '../common/UI/Button';
import Modal from '../common/UI/Modal';
import Input from '../common/UI/Input';
import Select from '../common/UI/Select';
import Alert from '../common/UI/Alert';
import DataTable from '../common/UI/DataTable';
import Loader from '../common/UI/Loader';

const DOCUMENT_TYPES = [
  { value: 'deed', label: 'Deed' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'inspection', label: 'Inspection Report' },
  { value: 'lease_template', label: 'Lease Template' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'permit', label: 'Permit' },
  { value: 'tax_document', label: 'Tax Document' },
  { value: 'financial', label: 'Financial' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'other', label: 'Other' }
];

const PropertyDocumentsForm = ({ propertyId, onClose, onSuccess }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    document: null,
    name: '',
    description: '',
    type: 'other',
    expiryDate: '',
    isPublic: false
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    type: 'other',
    expiryDate: '',
    isPublic: false
  });

  useEffect(() => {
    fetchDocuments();
  }, [propertyId, filterType, sortBy, sortOrder]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        sortBy,
        sortOrder,
        ...(filterType && { type: filterType })
      });

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      const response = await fetch(
        `/api/management/properties/${propertyId}/documents?${params}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch documents');
      }
      
      const data = await response.json();
      setDocuments(data.data || []);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.document) {
      setError('Please select a file');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const formData = new FormData();
      formData.append('document', uploadForm.document);
      if (uploadForm.name) formData.append('name', uploadForm.name);
      if (uploadForm.description) formData.append('description', uploadForm.description);
      formData.append('type', uploadForm.type);
      if (uploadForm.expiryDate) formData.append('expiryDate', uploadForm.expiryDate);
      formData.append('isPublic', uploadForm.isPublic);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      const response = await fetch(
        `/api/management/properties/${propertyId}/documents`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload document');
      }
      
      setSuccess('Document uploaded successfully');
      setShowUploadModal(false);
      setUploadForm({
        document: null,
        name: '',
        description: '',
        type: 'other',
        expiryDate: '',
        isPublic: false
      });
      fetchDocuments();
      onSuccess?.();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      const response = await fetch(
        `/api/management/properties/${propertyId}/documents/${selectedDocument.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editForm)
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update document');
      }
      
      setSuccess('Document updated successfully');
      setShowEditModal(false);
      fetchDocuments();
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      const response = await fetch(
        `/api/management/properties/${propertyId}/documents/${documentId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete document');
      }
      
      setSuccess('Document deleted successfully');
      fetchDocuments();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (document) => {
    setSelectedDocument(document);
    setEditForm({
      name: document.name,
      description: document.description || '',
      type: document.type,
      expiryDate: document.expiryDate ? document.expiryDate.split('T')[0] : '',
      isPublic: document.isPublic
    });
    setShowEditModal(true);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 && days <= 30;
  };

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-2">
          <FileUpload className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{row.name}</span>
        </div>
      )
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <Tag className="w-4 h-4 inline mr-1" />
      ) && (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
          {DOCUMENT_TYPES.find(t => t.value === row.type)?.label || row.type}
        </span>
      )
    },
    {
      header: 'Size',
      accessor: 'size',
      render: (row) => formatFileSize(row.size)
    },
    {
      header: 'Uploaded',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt)
    },
    {
      header: 'Expiry',
      accessor: 'expiryDate',
      render: (row) => (
        row.expiryDate ? (
          <div className={isExpiringSoon(row.expiryDate) ? 'text-red-600 font-medium' : ''}>
            {formatDate(row.expiryDate)}
            {isExpiringSoon(row.expiryDate) && (
              <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                Expiring Soon
              </span>
            )}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (row) => (
        <div className="flex gap-2">
          <a
            href={row.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 hover:bg-gray-100 rounded"
            title="Download"
          >
            <Download className="w-4 h-4 text-blue-600" />
          </a>
          <button
            onClick={() => handleEdit(row)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Edit"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Property Documents</h2>
        <Button
          onClick={() => setShowUploadModal(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Upload Document
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Filter by Type</label>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: '', label: 'All Types' },
              ...DOCUMENT_TYPES
            ]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Sort By</label>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'createdAt', label: 'Date Uploaded' },
              { value: 'name', label: 'Name' },
              { value: 'type', label: 'Type' },
              { value: 'size', label: 'Size' }
            ]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Order</label>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            options={[
              { value: 'DESC', label: 'Descending' },
              { value: 'ASC', label: 'Ascending' }
            ]}
          />
        </div>
      </div>

      {/* Documents Table */}
      {loading ? (
        <Loader />
      ) : documents.length > 0 ? (
        <DataTable columns={columns} data={documents} />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No documents uploaded yet</p>
          <Button
            onClick={() => setShowUploadModal(true)}
            variant="secondary"
            className="mt-4"
          >
            Upload First Document
          </Button>
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Document"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Document File *</label>
            <input
              type="file"
              name="document"
              onChange={handleUploadChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <Input
            label="Document Name"
            name="name"
            value={uploadForm.name}
            onChange={handleUploadChange}
            placeholder="Leave blank to use filename"
          />

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={uploadForm.description}
              onChange={handleUploadChange}
              placeholder="Optional description"
              className="w-full border rounded-lg p-2 h-24"
            />
          </div>

          <Select
            label="Document Type"
            name="type"
            value={uploadForm.type}
            onChange={handleUploadChange}
            options={DOCUMENT_TYPES}
          />

          <Input
            label="Expiry Date"
            type="date"
            name="expiryDate"
            value={uploadForm.expiryDate}
            onChange={handleUploadChange}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublic"
              checked={uploadForm.isPublic}
              onChange={handleUploadChange}
              className="rounded"
            />
            <label className="text-sm">Make this document public</label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowUploadModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Document"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Document Name"
            name="name"
            value={editForm.name}
            onChange={handleEditChange}
          />

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={editForm.description}
              onChange={handleEditChange}
              className="w-full border rounded-lg p-2 h-24"
            />
          </div>

          <Select
            label="Document Type"
            name="type"
            value={editForm.type}
            onChange={handleEditChange}
            options={DOCUMENT_TYPES}
          />

          <Input
            label="Expiry Date"
            type="date"
            name="expiryDate"
            value={editForm.expiryDate}
            onChange={handleEditChange}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublic"
              checked={editForm.isPublic}
              onChange={handleEditChange}
              className="rounded"
            />
            <label className="text-sm">Make this document public</label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PropertyDocumentsForm;
