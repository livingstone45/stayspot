import React, { useState } from 'react';
import { Building, MapPin, DollarSign, Users, Search, Plus, Eye, Edit2, Trash2, Filter, Download, TrendingUp } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const Properties = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const properties = [
    {
      id: 1,
      name: 'Westside Apartments',
      address: '123 Main St, New York, NY',
      type: 'Apartment',
      status: 'occupied',
      rent: 2500,
      units: 24,
      occupied: 23,
      vacant: 1,
      occupancy: 96,
      image: 'https://via.placeholder.com/400x300?text=Westside+Apartments',
    },
    {
      id: 2,
      name: 'Downtown Lofts',
      address: '456 Oak Ave, Brooklyn, NY',
      type: 'Loft',
      status: 'occupied',
      rent: 3200,
      units: 18,
      occupied: 16,
      vacant: 2,
      occupancy: 89,
      image: 'https://via.placeholder.com/400x300?text=Downtown+Lofts',
    },
    {
      id: 3,
      name: 'Riverside Complex',
      address: '789 Pine Rd, Queens, NY',
      type: 'Complex',
      status: 'occupied',
      rent: 2800,
      units: 32,
      occupied: 29,
      vacant: 3,
      occupancy: 91,
      image: 'https://via.placeholder.com/400x300?text=Riverside+Complex',
    },
    {
      id: 4,
      name: 'Midtown Towers',
      address: '321 Maple Dr, Manhattan, NY',
      type: 'Tower',
      status: 'maintenance',
      rent: 3500,
      units: 28,
      occupied: 25,
      vacant: 3,
      occupancy: 89,
      image: 'https://via.placeholder.com/400x300?text=Midtown+Towers',
    },
    {
      id: 5,
      name: 'Lakeside Residences',
      address: '654 Elm Blvd, Bronx, NY',
      type: 'Residential',
      status: 'occupied',
      rent: 2200,
      units: 22,
      occupied: 21,
      vacant: 1,
      occupancy: 95,
      image: 'https://via.placeholder.com/400x300?text=Lakeside+Residences',
    },
    {
      id: 6,
      name: 'Hillside Villas',
      address: '987 Cedar Ln, Staten Island, NY',
      type: 'Villa',
      status: 'vacant',
      rent: 2900,
      units: 32,
      occupied: 27,
      vacant: 5,
      occupancy: 84,
      image: 'https://via.placeholder.com/400x300?text=Hillside+Villas',
    },
  ];

  const stats = [
    { label: 'Total Properties', value: properties.length, icon: Building, color: 'orange' },
    { label: 'Total Units', value: properties.reduce((sum, p) => sum + p.units, 0), icon: Users, color: 'cyan' },
    { label: 'Monthly Revenue', value: `$${(properties.reduce((sum, p) => sum + p.rent * p.occupied, 0) / 1000).toFixed(0)}k`, icon: DollarSign, color: 'green' },
    { label: 'Avg Occupancy', value: `${Math.round(properties.reduce((sum, p) => sum + p.occupancy, 0) / properties.length)}%`, icon: TrendingUp, color: 'purple' },
  ];

  const statusColors = {
    occupied: { bg: isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700', label: 'Occupied' },
    vacant: { bg: isDarkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700', label: 'Vacant' },
    maintenance: { bg: isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700', label: 'Maintenance' },
  };

  const filtered = properties.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`min-h-screen p-6 transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Properties</h1>
            <p className={isDarkMode ? 'text-gray-400' : 'text-slate-600'}>Manage and monitor all your properties</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition font-medium">
            <Plus size={18} />
            Add Property
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const colorMap = {
              orange: isDarkMode ? 'border-orange-600 bg-orange-900/20' : 'border-orange-600 bg-orange-50',
              cyan: isDarkMode ? 'border-cyan-600 bg-cyan-900/20' : 'border-cyan-600 bg-cyan-50',
              green: isDarkMode ? 'border-green-600 bg-green-900/20' : 'border-green-600 bg-green-50',
              purple: isDarkMode ? 'border-purple-600 bg-purple-900/20' : 'border-purple-600 bg-purple-50',
            };
            const iconColorMap = {
              orange: 'text-orange-600',
              cyan: 'text-cyan-600',
              green: 'text-green-600',
              purple: 'text-purple-600',
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
                  placeholder="Search properties..."
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
                <option value="occupied">Occupied</option>
                <option value="vacant">Vacant</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <button className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition font-medium ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}>
                <Download size={18} />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((property) => {
            const status = statusColors[property.status];
            return (
              <div key={property.id} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow`}>
                <div className={`relative h-48 ${isDarkMode ? 'bg-gray-700' : 'bg-slate-200'} overflow-hidden`}>
                  <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.bg}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-slate-700 border-slate-300'} border`}>
                      {property.type}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{property.name}</h3>
                  <div className={`flex items-center gap-1 text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    <MapPin size={16} />
                    {property.address}
                  </div>

                  <div className={`grid grid-cols-3 gap-3 mb-4 pb-4 ${isDarkMode ? 'border-gray-700' : 'border-slate-200'} border-b`}>
                    <div>
                      <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Units</p>
                      <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{property.units}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Occupied</p>
                      <p className="text-lg font-bold text-green-600">{property.occupied}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Vacant</p>
                      <p className="text-lg font-bold text-red-600">{property.vacant}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Occupancy</p>
                      <p className="text-sm font-bold text-orange-600">{property.occupancy}%</p>
                    </div>
                    <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-slate-200'}`}>
                      <div
                        className="h-2 rounded-full bg-orange-600 transition-all"
                        style={{ width: `${property.occupancy}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className={`mb-4 pb-4 ${isDarkMode ? 'border-gray-700' : 'border-slate-200'} border-b`}>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Monthly Rent</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>${property.rent.toLocaleString()}</p>
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

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Building className={`mx-auto h-16 w-16 mb-4 ${isDarkMode ? 'text-gray-600' : 'text-slate-300'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No properties found</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Try adjusting your search or filters</p>
            <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition font-medium">
              Add Property
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
