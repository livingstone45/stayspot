import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useThemeMode } from '../../hooks/useThemeMode';
import { Plus, Search, Filter, TrendingUp, AlertCircle } from 'lucide-react';

const MyProperties = () => {
  const { user } = useAuth();
  const { isDark } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const properties = [
    { id: 1, name: 'Sunset Apartments', address: '123 Main St', units: 4, occupied: 3, revenue: 8500, status: 'active', occupancy: 75, roi: 14.2, issues: 0 },
    { id: 2, name: 'Downtown Complex', address: '456 Oak Ave', units: 5, occupied: 4, revenue: 12000, status: 'active', occupancy: 80, roi: 12.8, issues: 1 },
    { id: 3, name: 'Riverside Towers', address: '789 Pine Rd', units: 4, occupied: 4, revenue: 15500, status: 'active', occupancy: 100, roi: 15.6, issues: 0 },
    { id: 4, name: 'Hillside Residences', address: '321 Elm St', units: 3, occupied: 3, revenue: 9200, status: 'active', occupancy: 100, roi: 13.5, issues: 0 },
    { id: 5, name: 'Central Hub', address: '654 Maple Ave', units: 5, occupied: 4, revenue: 11000, status: 'active', occupancy: 80, roi: 16.1, issues: 2 }
  ];

  const containerClasses = `${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 min-h-screen`;
  const cardClasses = `${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`;
  const titleClasses = `${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-bold mb-2`;
  const textClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'}`;

  const totalValue = properties.reduce((sum, p) => sum + p.revenue, 0);
  const totalUnits = properties.reduce((sum, p) => sum + p.units, 0);
  const totalOccupied = properties.reduce((sum, p) => sum + p.occupied, 0);

  return (
    <div className={containerClasses}>
      <h1 className={titleClasses}>My Properties</h1>
      <p className={`${textClasses} mb-8`}>Quick overview of your rental properties</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className={cardClasses}>
          <p className={textClasses}>Total Properties</p>
          <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-bold`}>{properties.length}</p>
        </div>
        <div className={cardClasses}>
          <p className={textClasses}>Total Units</p>
          <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-bold`}>{totalUnits}</p>
        </div>
        <div className={cardClasses}>
          <p className={textClasses}>Occupied</p>
          <p className={`${isDark ? 'text-green-400' : 'text-green-600'} text-3xl font-bold`}>{totalOccupied}</p>
        </div>
        <div className={cardClasses}>
          <p className={textClasses}>Monthly Revenue</p>
          <p className={`${isDark ? 'text-green-400' : 'text-green-600'} text-3xl font-bold`}>${totalValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap items-center">
        <div className="flex-1 relative min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search properties..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={`px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
          <Plus size={18} /> Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(prop => (
          <div key={prop.id} className={cardClasses}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold text-lg`}>{prop.name}</h3>
                <p className={textClasses}>{prop.address}</p>
              </div>
              <span className={`px-3 py-1 rounded text-xs font-medium ${isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`}>Active</span>
            </div>

            {prop.issues > 0 && (
              <div className={`p-2 rounded mb-3 flex items-center gap-2 text-xs ${isDark ? 'bg-red-900 text-red-300' : 'bg-red-50 text-red-800'}`}>
                <AlertCircle size={14} />
                <span>{prop.issues} issue{prop.issues > 1 ? 's' : ''}</span>
              </div>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className={textClasses}>Units</span>
                <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold`}>{prop.occupied}/{prop.units}</span>
              </div>
              <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(prop.occupied/prop.units)*100}%` }}></div>
              </div>
              <div className="flex justify-between">
                <span className={textClasses}>Monthly Revenue</span>
                <span className={`${isDark ? 'text-green-400' : 'text-green-600'} font-bold`}>${prop.revenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className={textClasses}>ROI</span>
                <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'} font-bold flex items-center gap-1`}>
                  <TrendingUp size={14} /> {prop.roi}%
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className={`flex-1 px-3 py-2 rounded text-sm font-medium ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>View</button>
              <button className={`flex-1 px-3 py-2 rounded text-sm font-medium ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProperties;
