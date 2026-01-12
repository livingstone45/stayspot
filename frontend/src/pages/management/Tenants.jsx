import React, { useState } from 'react';
import { Search, Plus, Mail, Phone, Calendar, AlertCircle, CheckCircle, Eye, Edit2, Trash2, Users, TrendingUp, Clock, AlertTriangle, Grid3x3, List } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const Tenants = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const tenants = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      property: 'Westside Apartments - 101',
      leaseStart: '2023-01-15',
      leaseEnd: '2024-01-14',
      status: 'active',
      rentPaid: true,
      moveInDate: '2023-01-15',
      avatar: 'https://via.placeholder.com/100?text=JS'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 234-5678',
      property: 'Downtown Lofts - 202',
      leaseStart: '2023-06-01',
      leaseEnd: '2024-05-31',
      status: 'active',
      rentPaid: false,
      moveInDate: '2023-06-01',
      avatar: 'https://via.placeholder.com/100?text=SJ'
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+1 (555) 345-6789',
      property: 'Riverside Complex - 303',
      leaseStart: '2022-03-10',
      leaseEnd: '2024-03-09',
      status: 'renewal',
      rentPaid: true,
      moveInDate: '2022-03-10',
      avatar: 'https://via.placeholder.com/100?text=MB'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+1 (555) 456-7890',
      property: 'Midtown Towers - 104',
      leaseStart: '2023-09-01',
      leaseEnd: '2024-08-31',
      status: 'active',
      rentPaid: true,
      moveInDate: '2023-09-01',
      avatar: 'https://via.placeholder.com/100?text=ED'
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david@example.com',
      phone: '+1 (555) 567-8901',
      property: 'Lakeside Residences - 205',
      leaseStart: '2023-02-20',
      leaseEnd: '2025-02-19',
      status: 'active',
      rentPaid: true,
      moveInDate: '2023-02-20',
      avatar: 'https://via.placeholder.com/100?text=DW'
    },
    {
      id: 6,
      name: 'Jessica Martinez',
      email: 'jessica@example.com',
      phone: '+1 (555) 678-9012',
      property: 'Hillside Villas - 401',
      leaseStart: '2023-07-15',
      leaseEnd: '2024-07-14',
      status: 'active',
      rentPaid: false,
      moveInDate: '2023-07-15',
      avatar: 'https://via.placeholder.com/100?text=JM'
    },
  ];

  const stats = [
    { label: 'Total Tenants', value: tenants.length, icon: Users, color: 'orange' },
    { label: 'Active Leases', value: tenants.filter(t => t.status === 'active').length, icon: CheckCircle, color: 'green' },
    { label: 'Renewals Due', value: tenants.filter(t => t.status === 'renewal').length, icon: Clock, color: 'cyan' },
    { label: 'Rent Pending', value: tenants.filter(t => !t.rentPaid).length, icon: AlertTriangle, color: 'red' },
  ];

  const statusColors = {
    active: { bg: isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700', label: 'Active' },
    renewal: { bg: isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700', label: 'Renewal Due' },
    inactive: { bg: isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700', label: 'Inactive' },
  };

  const filtered = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || tenant.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={`min-h-screen p-6 transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Tenants</h1>
            <p className={isDarkMode ? 'text-gray-400' : 'text-slate-600'}>Manage and monitor all your tenants</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition font-medium">
            <Plus size={18} />
            Add Tenant
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const colorMap = {
              orange: isDarkMode ? 'border-orange-600 bg-orange-900/20' : 'border-orange-600 bg-orange-50',
              green: isDarkMode ? 'border-green-600 bg-green-900/20' : 'border-green-600 bg-green-50',
              cyan: isDarkMode ? 'border-cyan-600 bg-cyan-900/20' : 'border-cyan-600 bg-cyan-50',
              red: isDarkMode ? 'border-red-600 bg-red-900/20' : 'border-red-600 bg-red-50',
            };
            const iconColorMap = {
              orange: 'text-orange-600',
              green: 'text-green-600',
              cyan: 'text-cyan-600',
              red: 'text-red-600',
            };
            return (
              <div key={idx} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 border-l-4 ${colorMap[stat.color]} transition-colors`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>{stat.label}</p>
                    <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[stat.color]}`}>
                    <stat.icon className={`${iconColorMap[stat.color]}`} size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 mb-8 border ${isDarkMode ? 'border-gray-700' : 'border-slate-200'} transition-colors`}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search tenants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-slate-300 bg-white text-slate-900 placeholder-slate-500'
                  }`}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white hover:border-gray-500' 
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="renewal">Renewal Due</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className={`flex rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-300 bg-white'}`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 transition ${viewMode === 'grid' ? (isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-orange-100 text-orange-700') : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-slate-600 hover:text-slate-900')}`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 transition ${isDarkMode ? 'border-l border-gray-600' : 'border-l border-slate-300'} ${viewMode === 'list' ? (isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-orange-100 text-orange-700') : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-slate-600 hover:text-slate-900')}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(tenant => {
              const status = statusColors[tenant.status];
              const daysUntilExpiry = Math.ceil((new Date(tenant.leaseEnd) - new Date()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={tenant.id} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow`}>
                  <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-orange-50 to-amber-50'} p-6 ${isDarkMode ? 'border-gray-600' : 'border-slate-200'} border-b`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-lg">
                          {tenant.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tenant.name}</h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>{tenant.property}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.bg}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className={`space-y-3 mb-4 pb-4 ${isDarkMode ? 'border-gray-700' : 'border-slate-200'} border-b`}>
                      <div className={`flex items-center gap-3 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                        <Mail size={16} className="text-orange-600 flex-shrink-0" />
                        <span className="text-sm">{tenant.email}</span>
                      </div>
                      <div className={`flex items-center gap-3 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                        <Phone size={16} className="text-orange-600 flex-shrink-0" />
                        <span className="text-sm">{tenant.phone}</span>
                      </div>
                    </div>

                    <div className={`space-y-3 mb-4 pb-4 ${isDarkMode ? 'border-gray-700' : 'border-slate-200'} border-b`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Lease Expires</span>
                        <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{new Date(tenant.leaseEnd).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Days Remaining</span>
                        <span className={`text-sm font-semibold ${daysUntilExpiry < 90 ? 'text-red-600' : 'text-green-600'}`}>
                          {daysUntilExpiry} days
                        </span>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${tenant.rentPaid ? (isDarkMode ? 'bg-green-900/30' : 'bg-green-50') : (isDarkMode ? 'bg-red-900/30' : 'bg-red-50')}`}>
                      {tenant.rentPaid ? (
                        <>
                          <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>Rent Paid</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>Rent Pending</span>
                        </>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition font-medium text-sm ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                        <Eye size={16} />
                        View
                      </button>
                      <button className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition font-medium text-sm ${isDarkMode ? 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}>
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition font-medium text-sm ${isDarkMode ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border overflow-hidden transition-colors`}>
            <table className="w-full">
              <thead>
                <tr className={`${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-slate-200 bg-slate-50'} border-b`}>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Name</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Property</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Email</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Phone</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Status</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Lease Expires</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Rent</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(tenant => {
                  const status = statusColors[tenant.status];
                  return (
                    <tr key={tenant.id} className={`${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-slate-200 hover:bg-slate-50'} border-b transition`}>
                      <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tenant.name}</td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>{tenant.property}</td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>{tenant.email}</td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>{tenant.phone}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.bg}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>{new Date(tenant.leaseEnd).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {tenant.rentPaid ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <AlertCircle size={16} className="text-red-600" />
                          )}
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>{tenant.rentPaid ? 'Paid' : 'Pending'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className={`p-2 rounded transition ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                            <Eye size={16} />
                          </button>
                          <button className={`p-2 rounded transition ${isDarkMode ? 'text-purple-400 hover:bg-purple-900/30' : 'text-orange-600 hover:bg-orange-50'}`}>
                            <Edit2 size={16} />
                          </button>
                          <button className={`p-2 rounded transition ${isDarkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50'}`}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Users className={`mx-auto h-16 w-16 mb-4 ${isDarkMode ? 'text-gray-600' : 'text-slate-300'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No tenants found</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Try adjusting your search or filters</p>
            <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition font-medium">
              Add Tenant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tenants;
