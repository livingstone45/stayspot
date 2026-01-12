import React, { useState } from 'react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { Search, Plus, Calendar, AlertCircle, CheckCircle, Clock, Send, Download, Eye, Edit2, Trash2, TrendingUp, Grid3x3, List } from 'lucide-react';

const Renewals = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const renewals = [
    {
      id: 1,
      tenantName: 'John Smith',
      property: 'Westside Apartments - 101',
      currentRent: 2500,
      proposedRent: 2600,
      leaseEndDate: '2024-01-14',
      daysUntilExpiry: 45,
      status: 'pending',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
    },
    {
      id: 2,
      tenantName: 'Michael Brown',
      property: 'Riverside Complex - 303',
      currentRent: 2800,
      proposedRent: 2900,
      leaseEndDate: '2024-03-09',
      daysUntilExpiry: 15,
      status: 'urgent',
      email: 'michael@example.com',
      phone: '+1 (555) 345-6789',
    },
    {
      id: 3,
      tenantName: 'Emily Davis',
      property: 'Midtown Towers - 104',
      currentRent: 3500,
      proposedRent: 3650,
      leaseEndDate: '2024-08-31',
      daysUntilExpiry: 180,
      status: 'pending',
      email: 'emily@example.com',
      phone: '+1 (555) 456-7890',
    },
    {
      id: 4,
      tenantName: 'Sarah Johnson',
      property: 'Downtown Lofts - 202',
      currentRent: 3200,
      proposedRent: 3350,
      leaseEndDate: '2024-05-31',
      daysUntilExpiry: 90,
      status: 'accepted',
      email: 'sarah@example.com',
      phone: '+1 (555) 234-5678',
    },
    {
      id: 5,
      tenantName: 'David Wilson',
      property: 'Lakeside Residences - 205',
      currentRent: 2200,
      proposedRent: 2300,
      leaseEndDate: '2025-02-19',
      daysUntilExpiry: 365,
      status: 'pending',
      email: 'david@example.com',
      phone: '+1 (555) 567-8901',
    },
    {
      id: 6,
      tenantName: 'Jessica Martinez',
      property: 'Hillside Villas - 401',
      currentRent: 2900,
      proposedRent: 3000,
      leaseEndDate: '2024-07-14',
      daysUntilExpiry: 160,
      status: 'rejected',
      email: 'jessica@example.com',
      phone: '+1 (555) 678-9012',
    },
  ];

  const stats = [
    { label: 'Total Renewals', value: renewals.length, icon: Calendar, color: 'orange' },
    { label: 'Pending', value: renewals.filter(r => r.status === 'pending').length, icon: Clock, color: 'amber' },
    { label: 'Urgent', value: renewals.filter(r => r.status === 'urgent').length, icon: AlertCircle, color: 'red' },
    { label: 'Accepted', value: renewals.filter(r => r.status === 'accepted').length, icon: CheckCircle, color: 'green' },
  ];

  const statusColors = {
    pending: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Pending', icon: Clock },
    urgent: { bg: 'bg-red-100', text: 'text-red-700', label: 'Urgent', icon: AlertCircle },
    accepted: { bg: 'bg-green-100', text: 'text-green-700', label: 'Accepted', icon: CheckCircle },
    rejected: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Rejected', icon: AlertCircle },
  };

  const filtered = renewals.filter(renewal => {
    const matchesSearch = renewal.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         renewal.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         renewal.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || renewal.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>Lease Renewals</h1>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Manage and track upcoming lease renewals</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium">
            <Plus size={18} />
            New Renewal
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const colorMap = {
              orange: 'border-orange-600 bg-orange-50',
              amber: 'border-amber-600 bg-amber-50',
              red: 'border-red-600 bg-red-50',
              green: 'border-green-600 bg-green-50',
            };
            const iconColorMap = {
              orange: 'text-orange-600',
              amber: 'text-amber-600',
              red: 'text-red-600',
              green: 'text-green-600',
            };
            return (
              <div key={idx} className={`rounded-xl shadow-sm p-6 border-l-4 ${colorMap[stat.color]} ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[stat.color]}`}>
                    <stat.icon className={`${iconColorMap[stat.color]}`} size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className={`rounded-xl shadow-sm p-6 mb-8 border ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search renewals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300'}`}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-4 py-2 border rounded-lg font-medium transition ${isDarkMode ? 'border-slate-600 bg-slate-800 text-white hover:border-slate-500' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'}`}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="urgent">Urgent</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map(renewal => {
              const status = statusColors[renewal.status];
              const StatusIcon = status.icon;
              const rentIncrease = renewal.proposedRent - renewal.currentRent;
              const increasePercent = ((rentIncrease / renewal.currentRent) * 100).toFixed(1);
              
              return (
                <div key={renewal.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 border-b border-slate-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{renewal.tenantName}</h3>
                        <p className="text-sm text-slate-600">{renewal.property}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                        <StatusIcon size={14} />
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4 pb-4 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-orange-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-slate-600">Lease Expires</p>
                          <p className="text-sm font-semibold text-slate-900">{new Date(renewal.leaseEndDate).toLocaleDateString()}</p>
                        </div>
                        <div className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${renewal.daysUntilExpiry < 30 ? 'bg-red-100 text-red-700' : renewal.daysUntilExpiry < 90 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                          {renewal.daysUntilExpiry} days
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 pb-4 border-b border-slate-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-600 font-medium mb-1">Current Rent</p>
                          <p className="text-2xl font-bold text-slate-900">${renewal.currentRent.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-medium mb-1">Proposed Rent</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-slate-900">${renewal.proposedRent.toLocaleString()}</p>
                            <span className={`text-xs font-semibold ${rentIncrease >= 0 ? 'text-orange-600' : 'text-green-600'}`}>
                              {rentIncrease >= 0 ? '+' : ''}{increasePercent}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 pb-4 border-b border-slate-200 space-y-2">
                      <p className="text-xs text-slate-600 font-medium">Contact</p>
                      <p className="text-sm text-slate-700">{renewal.email}</p>
                      <p className="text-sm text-slate-700">{renewal.phone}</p>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium text-sm">
                        <Eye size={16} />
                        View
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition font-medium text-sm">
                        <Send size={16} />
                        Send
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium text-sm">
                        <CheckCircle size={16} />
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tenant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Property</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Current Rent</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Proposed Rent</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Expires</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Days Left</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(renewal => {
                  const status = statusColors[renewal.status];
                  const rentIncrease = renewal.proposedRent - renewal.currentRent;
                  const increasePercent = ((rentIncrease / renewal.currentRent) * 100).toFixed(1);
                  
                  return (
                    <tr key={renewal.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{renewal.tenantName}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{renewal.property}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">${renewal.currentRent.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900 font-medium">${renewal.proposedRent.toLocaleString()}</span>
                          <span className={`text-xs font-semibold ${rentIncrease >= 0 ? 'text-orange-600' : 'text-green-600'}`}>
                            {rentIncrease >= 0 ? '+' : ''}{increasePercent}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">{new Date(renewal.leaseEndDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${renewal.daysUntilExpiry < 30 ? 'bg-red-100 text-red-700' : renewal.daysUntilExpiry < 90 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                          {renewal.daysUntilExpiry} days
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded transition">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-orange-600 hover:bg-orange-50 rounded transition">
                            <Send size={16} />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded transition">
                            <CheckCircle size={16} />
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

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No renewals found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your search or filters</p>
            <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium">
              New Renewal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Renewals;
