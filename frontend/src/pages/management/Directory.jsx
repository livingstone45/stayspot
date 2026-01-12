import React, { useState } from 'react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { Search, Mail, Phone, MapPin, Building, Users, MessageSquare, Download, Grid3x3, List } from 'lucide-react';

const Directory = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProperty, setFilterProperty] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const tenants = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      property: 'Westside Apartments',
      unit: '101',
      joinDate: '2023-01-15',
      status: 'active',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 234-5678',
      property: 'Downtown Lofts',
      unit: '202',
      joinDate: '2023-06-01',
      status: 'active',
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+1 (555) 345-6789',
      property: 'Riverside Complex',
      unit: '303',
      joinDate: '2022-03-10',
      status: 'active',
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+1 (555) 456-7890',
      property: 'Midtown Towers',
      unit: '104',
      joinDate: '2023-09-01',
      status: 'active',
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david@example.com',
      phone: '+1 (555) 567-8901',
      property: 'Lakeside Residences',
      unit: '205',
      joinDate: '2023-02-20',
      status: 'active',
    },
    {
      id: 6,
      name: 'Jessica Martinez',
      email: 'jessica@example.com',
      phone: '+1 (555) 678-9012',
      property: 'Hillside Villas',
      unit: '401',
      joinDate: '2023-07-15',
      status: 'active',
    },
    {
      id: 7,
      name: 'Robert Taylor',
      email: 'robert@example.com',
      phone: '+1 (555) 789-0123',
      property: 'Westside Apartments',
      unit: '205',
      joinDate: '2023-04-10',
      status: 'active',
    },
    {
      id: 8,
      name: 'Lisa Anderson',
      email: 'lisa@example.com',
      phone: '+1 (555) 890-1234',
      property: 'Downtown Lofts',
      unit: '305',
      joinDate: '2023-08-05',
      status: 'active',
    },
  ];

  const properties = ['all', ...new Set(tenants.map(t => t.property))];

  const filtered = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.phone.includes(searchTerm);
    const matchesProperty = filterProperty === 'all' || tenant.property === filterProperty;
    return matchesSearch && matchesProperty;
  });

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>Tenant Directory</h1>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Complete contact information for all tenants</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium">
            <Download size={18} />
            Export
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`rounded-xl shadow-sm p-6 border-l-4 border-orange-600 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Tenants</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{tenants.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-50">
                <Users className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Tenants</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{tenants.filter(t => t.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-50">
                <Building className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-cyan-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Properties</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{properties.length - 1}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-cyan-50">
                <MapPin className="text-cyan-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={`rounded-xl shadow-sm p-6 mb-8 border ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300'}`}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={filterProperty}
                onChange={(e) => setFilterProperty(e.target.value)}
                className={`px-4 py-2 border rounded-lg font-medium transition ${isDarkMode ? 'border-slate-600 bg-slate-800 text-white hover:border-slate-500' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'}`}
              >
                <option value="all">All Properties</option>
                {properties.slice(1).map(prop => (
                  <option key={prop} value={prop}>{prop}</option>
                ))}
              </select>
              <div className="flex rounded-lg border border-slate-300 bg-white">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 transition ${viewMode === 'grid' ? 'bg-orange-100 text-orange-700' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 transition border-l border-slate-300 ${viewMode === 'list' ? 'bg-orange-100 text-orange-700' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(tenant => (
              <div key={tenant.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 border-b border-slate-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{tenant.name}</h3>
                      <p className="text-sm text-slate-600">{tenant.property} - Unit {tenant.unit}</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Active
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3 mb-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-orange-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-600 font-medium">Email</p>
                        <p className="text-sm text-slate-900 truncate">{tenant.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-orange-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-slate-600 font-medium">Phone</p>
                        <p className="text-sm text-slate-900">{tenant.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium">Property</span>
                      <span className="text-sm font-semibold text-slate-900">{tenant.property}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium">Unit</span>
                      <span className="text-sm font-semibold text-slate-900">{tenant.unit}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium">Member Since</span>
                      <span className="text-sm font-semibold text-slate-900">{new Date(tenant.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium text-sm">
                      <Mail size={16} />
                      Email
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition font-medium text-sm">
                      <Phone size={16} />
                      Call
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium text-sm">
                      <MessageSquare size={16} />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Property</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Unit</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Member Since</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(tenant => (
                  <tr key={tenant.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{tenant.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{tenant.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{tenant.phone}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{tenant.property}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{tenant.unit}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{new Date(tenant.joinDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded transition">
                          <Mail size={16} />
                        </button>
                        <button className="p-2 text-orange-600 hover:bg-orange-50 rounded transition">
                          <Phone size={16} />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition">
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Users className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No tenants found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Results Count */}
        {filtered.length > 0 && (
          <div className="mt-8 text-center text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filtered.length}</span> of <span className="font-semibold text-slate-900">{tenants.length}</span> tenants
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory;
