import React, { useState } from 'react';
import { FileText, Download, Eye, Share, Filter, Search, Plus, Trash2 } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const DocumentsPage = () => {
  const { isDark, getClassNames } = useThemeMode();
  const containerClasses = `${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 min-h-screen`;
  const cardClasses = `${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`;
  const titleClasses = `${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-bold mb-2`;
  const subtitleClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-8`;
  const textClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'}`;
  const [documents] = useState([
    { id: 1, name: 'Lease Agreement', type: 'PDF', size: '2.4 MB', date: '2024-01-01', category: 'Lease', status: 'verified' },
    { id: 2, name: 'Move-in Inspection Report', type: 'PDF', size: '1.8 MB', date: '2024-01-05', category: 'Report', status: 'verified' },
    { id: 3, name: 'Rent Receipt - January 2025', type: 'PDF', size: '0.5 MB', date: '2025-01-05', category: 'Receipt', status: 'verified' },
    { id: 4, name: 'Rent Receipt - December 2024', type: 'PDF', size: '0.5 MB', date: '2024-12-05', category: 'Receipt', status: 'verified' },
    { id: 5, name: 'Building Rules & Regulations', type: 'PDF', size: '3.2 MB', date: '2024-01-01', category: 'Rules', status: 'verified' },
    { id: 6, name: 'Emergency Contacts List', type: 'PDF', size: '0.8 MB', date: '2024-02-01', category: 'Contacts', status: 'verified' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const filteredDocs = documents.filter(doc =>
    (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     doc.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === 'all' || doc.category === filterCategory)
  );

  const categories = ['all', 'Lease', 'Receipt', 'Report', 'Rules', 'Contacts'];

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={titleClasses}>📄 Documents</h1>
        <p className={subtitleClasses}>Access your lease, receipts, and important documents</p>
      </div>

      {/* Search & Filter */}
      <div className={`${cardClasses} mb-8`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className={`absolute left-3 top-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 bg-white'}`}
              />
            </div>
            <div className="flex items-center gap-4">
              <Filter size={20} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 bg-white'}`}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`rounded-lg p-4 shadow text-center ${getClassNames.surface}`}>
            <p className={`${getClassNames.textSecondary} text-sm`}>Total Documents</p>
            <p className={`text-3xl font-bold ${getClassNames.text}`}>{documents.length}</p>
          </div>
          <div className={`rounded-lg p-4 shadow text-center ${getClassNames.surface}`}>
            <p className={`${getClassNames.textSecondary} text-sm`}>Receipts</p>
            <p className="text-3xl font-bold text-blue-600">{documents.filter(d => d.category === 'Receipt').length}</p>
          </div>
          <div className={`rounded-lg p-4 shadow text-center ${getClassNames.surface}`}>
            <p className={`${getClassNames.textSecondary} text-sm`}>Reports</p>
            <p className="text-3xl font-bold text-green-600">{documents.filter(d => d.category === 'Report').length}</p>
          </div>
          <div className={`rounded-lg p-4 shadow text-center ${getClassNames.surface}`}>
            <p className={`${getClassNames.textSecondary} text-sm`}>Verified</p>
            <p className="text-3xl font-bold text-green-600">✓ All</p>
          </div>
        </div>

        {/* Documents Table */}
        <div className={`rounded-lg shadow overflow-hidden ${getClassNames.surface}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} border-b ${getClassNames.border}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Document</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Category</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Date</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Size</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Status</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${getClassNames.border}`}>
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className={`transition ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText size={24} className="text-blue-600" />
                        <div>
                          <p className={`font-medium ${getClassNames.text}`}>{doc.name}</p>
                          <p className={`text-xs ${getClassNames.textSecondary}`}>{doc.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDark ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-700'}`}>
                        {doc.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${getClassNames.textSecondary}`}>
                      {new Date(doc.date).toLocaleDateString()}
                    </td>
                    <td className={`px-6 py-4 text-sm ${getClassNames.textSecondary}`}>
                      {doc.size}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                        ✓ {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className={`p-2 rounded transition text-blue-600 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-blue-100'}`} title="View">
                          <Eye size={18} />
                        </button>
                        <button className={`p-2 rounded transition text-green-600 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-green-100'}`} title="Download">
                          <Download size={18} />
                        </button>
                        <button className={`p-2 rounded transition text-purple-600 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-purple-100'}`} title="Share">
                          <Share size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Document Request Section */}
        <div className={`mt-8 rounded-lg p-6 border ${isDark ? 'bg-gray-700 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
          <div className="flex items-start gap-4">
            <Plus size={24} className="text-blue-600 mt-1" />
            <div className="flex-1">
              <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>Need a Document?</h2>
              <p className={`mb-4 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                Request additional copies of your lease, receipts, or other documents from property management.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-medium">
                Request Document
              </button>
            </div>
          </div>
        </div>

        {/* Important Documents Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`rounded-lg shadow p-6 ${getClassNames.surface}`}>
            <h3 className={`text-lg font-semibold mb-4 ${getClassNames.text}`}>📋 Essential Documents</h3>
            <div className="space-y-3">
              <div className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <span className={`font-medium ${getClassNames.text}`}>Lease Agreement</span>
                <button className="text-blue-600 hover:text-blue-700">View</button>
              </div>
              <div className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <span className={`font-medium ${getClassNames.text}`}>Move-in Report</span>
                <button className="text-blue-600 hover:text-blue-700">View</button>
              </div>
              <div className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <span className={`font-medium ${getClassNames.text}`}>House Rules</span>
                <button className="text-blue-600 hover:text-blue-700">View</button>
              </div>
            </div>
          </div>

          <div className={`rounded-lg shadow p-6 ${getClassNames.surface}`}>
            <h3 className={`text-lg font-semibold mb-4 ${getClassNames.text}`}>💾 Download All</h3>
            <p className={`mb-4 ${getClassNames.textSecondary}`}>Download all your documents in one ZIP file for backup.</p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition font-medium flex items-center justify-center gap-2">
              <Download size={20} /> Download All Documents
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className={`mt-8 rounded-lg p-6 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${getClassNames.text}`}>❓ Help & Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded p-4 ${getClassNames.surface}`}>
              <p className={`font-medium mb-2 ${getClassNames.text}`}>Lost your lease?</p>
              <p className={`text-sm ${getClassNames.textSecondary}`}>Contact property management to request a new copy.</p>
            </div>
            <div className={`rounded p-4 ${getClassNames.surface}`}>
              <p className={`font-medium mb-2 ${getClassNames.text}`}>Need a reference letter?</p>
              <p className={`text-sm ${getClassNames.textSecondary}`}>Landlords typically provide these upon request after lease ends.</p>
            </div>
          </div>
        </div>
    </div>
  );
};

export default DocumentsPage;
