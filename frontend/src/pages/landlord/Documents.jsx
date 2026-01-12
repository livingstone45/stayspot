import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useThemeMode } from '../../hooks/useThemeMode';
import { Upload, Download, Trash2, FileText, Lock, Shield, Wrench, Plus, X } from 'lucide-react';

const LandlordDocuments = () => {
  const { user } = useAuth();
  const { isDark } = useThemeMode();
  const [activeTab, setActiveTab] = useState('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({ name: '', category: 'contract', date: '', file: null });
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Lease Agreement - Unit 101', type: 'contract', date: '2024-01-15', size: '2.4 MB' },
    { id: 2, name: 'Property Insurance Policy', type: 'insurance', date: '2024-01-10', size: '1.8 MB' },
    { id: 3, name: 'Maintenance Log 2024', type: 'maintenance', date: '2024-01-05', size: '0.5 MB' },
    { id: 4, name: 'Tenant Application - John Doe', type: 'application', date: '2023-12-20', size: '3.2 MB' }
  ]);

  const inputClasses = `w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500' : 'bg-white border-gray-300 focus:border-indigo-500'} focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold`;

  const handleUpload = () => {
    if (!uploadData.name.trim()) {
      alert('Please enter document name');
      return;
    }
    setUploading(true);
    setTimeout(() => {
      const newDoc = {
        id: documents.length + 1,
        name: uploadData.name,
        type: uploadData.category,
        date: uploadData.date || new Date().toLocaleDateString(),
        size: '1.2 MB'
      };
      setDocuments([newDoc, ...documents]);
      setUploadData({ name: '', category: 'contract', date: '', file: null });
      setShowUploadForm(false);
      setUploading(false);
    }, 1000);
  };

  const handleDownload = (docId) => {
    const doc = documents.find(d => d.id === docId);
    alert(`Downloading: ${doc.name}\n\nFile size: ${doc.size}`);
  };

  const handleDelete = (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(d => d.id !== docId));
    }
  };

  const getCategoryColor = (type) => {
    switch(type) {
      case 'contract': return 'from-blue-500 to-cyan-500';
      case 'insurance': return 'from-emerald-500 to-teal-500';
      case 'maintenance': return 'from-orange-500 to-amber-500';
      case 'application': return 'from-purple-500 to-pink-500';
      default: return 'from-indigo-500 to-purple-500';
    }
  };

  const getCategoryBadgeColor = (type) => {
    switch(type) {
      case 'contract': return 'bg-blue-100 text-blue-700';
      case 'insurance': return 'bg-emerald-100 text-emerald-700';
      case 'maintenance': return 'bg-orange-100 text-orange-700';
      case 'application': return 'bg-purple-100 text-purple-700';
      default: return 'bg-indigo-100 text-indigo-700';
    }
  };

  return (
    <div className={`${isDark ? 'bg-gray-950' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'} min-h-screen p-8`}>
      <div className="mb-10">
        <h1 className={`${isDark ? 'text-white' : 'text-gray-900'} text-5xl font-black mb-2`}>Documents</h1>
        <p className={`${isDark ? 'text-gray-500' : 'text-gray-600'} text-base`}>Manage contracts, insurance, and important files</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-2">Total Documents</p>
          <p className="text-4xl font-black">{documents.length}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-2">Contracts</p>
          <p className="text-4xl font-black">{documents.filter(d => d.type === 'contract').length}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-orange-100 text-xs font-bold uppercase tracking-wider mb-2">Insurance</p>
          <p className="text-4xl font-black">{documents.filter(d => d.type === 'insurance').length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-purple-100 text-xs font-bold uppercase tracking-wider mb-2">Storage Used</p>
          <p className="text-4xl font-black">7.9 GB</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 mb-8 border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-black`}>Upload Documents</h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>Add new contracts, insurance, and maintenance files</p>
          </div>
          <button 
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition font-bold flex items-center gap-2"
          >
            <Plus size={20} /> Upload
          </button>
        </div>

        {showUploadForm && (
          <div className={`p-8 rounded-2xl border-2 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'}`}>
            <div className="space-y-6">
              <div>
                <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-3`}>📝 Document Name *</label>
                <input 
                  type="text" 
                  value={uploadData.name}
                  onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                  placeholder="e.g., Lease Agreement - Unit 101" 
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-3`}>🏷️ Category</label>
                  <select 
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                    className={inputClasses}
                  >
                    <option value="contract">Contract</option>
                    <option value="insurance">Insurance</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="application">Application</option>
                  </select>
                </div>
                <div>
                  <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-3`}>📅 Date</label>
                  <input 
                    type="date" 
                    value={uploadData.date}
                    onChange={(e) => setUploadData({ ...uploadData, date: e.target.value })}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-3`}>📎 File Upload</label>
                <div className={`p-8 rounded-xl border-2 border-dashed text-center cursor-pointer transition ${isDark ? 'bg-gray-600 border-gray-500 hover:bg-gray-500' : 'bg-white border-indigo-300 hover:bg-indigo-50'}`}>
                  <input 
                    type="file" 
                    onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] })}
                    className="hidden" 
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <p className="text-4xl mb-3">📤</p>
                    <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold text-lg`}>Drag & drop your file here</p>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>or click to browse</p>
                    {uploadData.file && <p className="text-green-600 font-bold mt-3">✓ {uploadData.file.name}</p>}
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50 text-lg"
                >
                  {uploading ? '⏳ Uploading...' : '✓ Upload Document'}
                </button>
                <button 
                  onClick={() => setShowUploadForm(false)}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold transition text-lg ${isDark ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Document Categories */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 mb-8 border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-black mb-6`}>📁 Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['contract', 'insurance', 'maintenance', 'application'].map(type => (
            <div key={type} className={`p-6 rounded-xl border-2 cursor-pointer transition hover:shadow-lg bg-gradient-to-br ${getCategoryColor(type)} text-white`}>
              <p className="font-bold mb-2 text-lg">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
              <p className="text-sm opacity-90 mb-3">{documents.filter(d => d.type === type).length} documents</p>
              <span className="text-sm font-bold opacity-75">View All →</span>
            </div>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-black mb-6`}>📄 All Documents</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-4 px-4 font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Document Name</th>
                <th className={`text-left py-4 px-4 font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Type</th>
                <th className={`text-left py-4 px-4 font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Date</th>
                <th className={`text-left py-4 px-4 font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Size</th>
                <th className={`text-left py-4 px-4 font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className={`border-b ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition`}>
                  <td className={`py-4 px-4 ${isDark ? 'text-white' : 'text-gray-900'} font-semibold`}>📄 {doc.name}</td>
                  <td className={`py-4 px-4`}>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getCategoryBadgeColor(doc.type)}`}>
                      {doc.type}
                    </span>
                  </td>
                  <td className={`py-4 px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{doc.date}</td>
                  <td className={`py-4 px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{doc.size}</td>
                  <td className="py-4 px-4">
                    <div className="flex gap-3">
                      <button onClick={() => handleDownload(doc.id)} className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 transition">
                        <Download size={16} /> Download
                      </button>
                      <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 transition">
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LandlordDocuments;
