import React, { useState } from 'react';
import { Search, Plus, MapPin, DollarSign, Building2, TrendingUp, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import AddPropertyModal from '../../components/common/AddPropertyModal';

const Properties = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [properties, setProperties] = useState([
    { id: 1, propertyName: 'Sunset Apartments', address: 'Westlands, Nairobi', propertyType: 'apartment', numberOfUnits: 12, monthlyIncome: 180000, propertyValue: 5000000, occupancy: 100, roi: 14.2, status: 'active', image: 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=500&h=300&fit=crop', createdAt: new Date(Date.now() - 1000000) },
    { id: 2, propertyName: 'Downtown Complex', address: 'CBD, Nairobi', propertyType: 'apartment', numberOfUnits: 8, monthlyIncome: 120000, propertyValue: 3500000, occupancy: 75, roi: 12.8, status: 'active', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop', createdAt: new Date(Date.now() - 2000000) },
    { id: 3, propertyName: 'Riverside Towers', address: 'Riverside, Nairobi', propertyType: 'apartment', numberOfUnits: 15, monthlyIncome: 225000, propertyValue: 6000000, occupancy: 100, roi: 15.6, status: 'active', image: 'https://images.unsplash.com/photo-1512207736139-c1b5d6b8c131?w=500&h=300&fit=crop', createdAt: new Date(Date.now() - 500000) },
    { id: 4, propertyName: 'Hillside Residences', address: 'Kilimani, Nairobi', propertyType: 'house', numberOfUnits: 6, monthlyIncome: 90000, propertyValue: 2500000, occupancy: 100, roi: 13.5, status: 'maintenance', image: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=500&h=300&fit=crop', createdAt: new Date(Date.now() - 3000000) },
    { id: 5, propertyName: 'Garden View Estate', address: 'Lavington, Nairobi', propertyType: 'apartment', numberOfUnits: 10, monthlyIncome: 150000, propertyValue: 4200000, occupancy: 90, roi: 14.0, status: 'active', image: 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=500&h=300&fit=crop', createdAt: new Date(Date.now() - 100000) },
    { id: 6, propertyName: 'Modern Heights', address: 'Upperhill, Nairobi', propertyType: 'apartment', numberOfUnits: 20, monthlyIncome: 280000, propertyValue: 7500000, occupancy: 95, roi: 16.2, status: 'active', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop', createdAt: new Date(Date.now() - 200000) },
    { id: 7, propertyName: 'Parkside Villas', address: 'Muthaiga, Nairobi', propertyType: 'house', numberOfUnits: 5, monthlyIncome: 75000, propertyValue: 2000000, occupancy: 80, roi: 12.0, status: 'active', image: 'https://images.unsplash.com/photo-1512207736139-c1b5d6b8c131?w=500&h=300&fit=crop', createdAt: new Date(Date.now() - 4000000) },
    { id: 8, propertyName: 'Central Plaza', address: 'Nairobi CBD', propertyType: 'commercial', numberOfUnits: 25, monthlyIncome: 350000, propertyValue: 9000000, occupancy: 100, roi: 17.5, status: 'active', image: 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=500&h=300&fit=crop', createdAt: new Date(Date.now() - 5000000) },
  ]);

  const handleAddProperty = (formData) => {
    const newProperty = {
      id: Date.now(),
      ...formData,
      occupancy: 100,
      roi: 12.5,
      status: 'active',
      createdAt: new Date()
    };
    setProperties([newProperty, ...properties]);
    setCurrentPage(1);
    setShowModal(false);
  };

  let filteredProperties = properties.filter(p => {
    const matchesSearch = p.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) || p.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  filteredProperties.sort((a, b) => b.createdAt - a.createdAt);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const displayedProperties = filteredProperties.slice(startIdx, startIdx + itemsPerPage);

  const stats = {
    total: properties.length,
    totalValue: properties.reduce((sum, p) => sum + p.propertyValue, 0),
    totalIncome: properties.reduce((sum, p) => sum + p.monthlyIncome, 0),
    avgOccupancy: Math.round(properties.reduce((sum, p) => sum + p.occupancy, 0) / properties.length)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="w-full mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">My Properties</h1>
          <p className="text-gray-600">Manage your property portfolio</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-md p-6 border-2 border-indigo-200">
            <p className="text-indigo-700 text-sm font-semibold mb-2">Total Properties</p>
            <p className="text-3xl font-bold text-indigo-900">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-6 border-2 border-purple-200">
            <p className="text-purple-700 text-sm font-semibold mb-2">Portfolio Value</p>
            <p className="text-3xl font-bold text-purple-900">KES {(stats.totalValue / 1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl shadow-md p-6 border-2 border-pink-200">
            <p className="text-pink-700 text-sm font-semibold mb-2">Monthly Income</p>
            <p className="text-3xl font-bold text-pink-900">KES {(stats.totalIncome / 1000).toFixed(0)}k</p>
          </div>
          <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl shadow-md p-6 border-2 border-rose-200">
            <p className="text-rose-700 text-sm font-semibold mb-2">Avg Occupancy</p>
            <p className="text-3xl font-bold text-rose-900">{stats.avgOccupancy}%</p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-indigo-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative w-full lg:w-auto">
              <Search className="absolute left-3 top-3 text-indigo-400" size={20} />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto">
              <Filter size={18} className="text-indigo-600" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold whitespace-nowrap w-full lg:w-auto justify-center shadow-md"
            >
              <Plus size={20} /> Add Property
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {displayedProperties.map(property => (
            <div key={property.id} className="bg-white rounded-lg shadow-sm border-2 border-indigo-100 overflow-hidden hover:shadow-md transition-all">
              {/* Image */}
              <div className="relative h-28 bg-gray-200 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.propertyName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className={`absolute top-1 right-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize text-white ${
                  property.status === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-orange-500 to-red-600'
}`}>
                  {property.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-3 space-y-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 truncate">{property.propertyName}</h3>
                  <p className="text-gray-600 text-xs truncate">{property.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-1">
                  <div className="bg-indigo-50 rounded p-1 border border-indigo-200">
                    <p className="text-gray-600 text-xs font-semibold">Units</p>
                    <p className="text-sm font-bold text-indigo-600">{property.numberOfUnits}</p>
                  </div>
                  <div className="bg-purple-50 rounded p-1 border border-purple-200">
                    <p className="text-gray-600 text-xs font-semibold">Income</p>
                    <p className="text-sm font-bold text-purple-600">KES {(property.monthlyIncome / 1000).toFixed(0)}k</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1">
                  <div className="bg-pink-50 rounded p-1 border border-pink-200">
                    <p className="text-gray-600 text-xs font-semibold">Value</p>
                    <p className="text-sm font-bold text-pink-600">KES {(property.propertyValue / 1000000).toFixed(1)}M</p>
                  </div>
                  <div className="bg-rose-50 rounded p-1 border border-rose-200">
                    <p className="text-gray-600 text-xs font-semibold">ROI</p>
                    <p className="text-sm font-bold text-rose-600">{property.roi}%</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-semibold text-gray-700">Occupancy</p>
                    <p className="text-xs font-bold text-gray-900">{property.occupancy}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-1 rounded-full transition-all"
                      style={{ width: `${property.occupancy}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-1 pt-1">
                  <button className="flex-1 px-2 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded text-xs font-medium hover:from-indigo-700 hover:to-purple-700 transition">
                    View
                  </button>
                  <button className="flex-1 px-2 py-1 border border-indigo-300 text-indigo-700 rounded text-xs font-medium hover:bg-indigo-50 transition">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border-2 border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-semibold transition ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border-2 border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Empty State */}
        {displayedProperties.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg font-medium">No properties found</p>
            <p className="text-gray-500 text-sm">Try adjusting your search or add a new property</p>
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddProperty}
      />
    </div>
  );
};

export default Properties;
