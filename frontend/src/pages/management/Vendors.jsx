import React, { useState } from 'react';
import { Plus, Search, Filter, Star, Phone, Mail, MapPin, Briefcase, DollarSign, TrendingUp, AlertCircle, Grid3x3, List } from 'lucide-react';
import VendorForm from '../../components/VendorForm';

const Vendors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showVendorForm, setShowVendorForm] = useState(false);

  const initialVendors = [
    {
      id: 1,
      name: 'Quick Plumbing',
      category: 'plumbing',
      rating: 4.8,
      reviews: 24,
      phone: '(555) 123-4567',
      email: 'contact@quickplumbing.com',
      address: '123 Main St, City',
      status: 'active',
      avgCost: 150,
      jobsCompleted: 45,
      responseTime: '2 hours'
    },
    {
      id: 2,
      name: 'Cool Air Services',
      category: 'hvac',
      rating: 4.6,
      reviews: 18,
      phone: '(555) 234-5678',
      email: 'info@coolairservices.com',
      address: '456 Oak Ave, City',
      status: 'active',
      avgCost: 350,
      jobsCompleted: 32,
      responseTime: '4 hours'
    },
    {
      id: 3,
      name: 'Security Plus',
      category: 'locksmith',
      rating: 4.9,
      reviews: 31,
      phone: '(555) 345-6789',
      email: 'support@securityplus.com',
      address: '789 Pine Rd, City',
      status: 'active',
      avgCost: 200,
      jobsCompleted: 58,
      responseTime: '1 hour'
    },
    {
      id: 4,
      name: 'Paint Masters',
      category: 'painting',
      rating: 4.5,
      reviews: 15,
      phone: '(555) 456-7890',
      email: 'hello@paintmasters.com',
      address: '321 Elm St, City',
      status: 'active',
      avgCost: 300,
      jobsCompleted: 28,
      responseTime: '3 hours'
    },
    {
      id: 5,
      name: 'Electric Pro',
      category: 'electrical',
      rating: 4.7,
      reviews: 22,
      phone: '(555) 567-8901',
      email: 'contact@electricpro.com',
      address: '654 Maple Dr, City',
      status: 'active',
      avgCost: 280,
      jobsCompleted: 41,
      responseTime: '2 hours'
    },
    {
      id: 6,
      name: 'Carpet Cleaners Inc',
      category: 'cleaning',
      rating: 4.4,
      reviews: 12,
      phone: '(555) 678-9012',
      email: 'info@carpetcleaners.com',
      address: '987 Cedar Ln, City',
      status: 'inactive',
      avgCost: 120,
      jobsCompleted: 19,
      responseTime: '5 hours'
    }
  ];

  const [vendorList, setVendorList] = useState(initialVendors);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'hvac', label: 'HVAC' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'locksmith', label: 'Locksmith' },
    { value: 'painting', label: 'Painting' },
    { value: 'cleaning', label: 'Cleaning' }
  ];

  const handleAddVendor = (formData) => {
    const newVendor = {
      id: vendorList.length + 1,
      name: formData.name,
      category: formData.category,
      phone: formData.phone,
      email: formData.email,
      address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
      status: 'active',
      rating: 4.5,
      reviews: 0,
      avgCost: 0,
      jobsCompleted: 0,
      responseTime: '2-3 hours'
    };
    setVendorList([...vendorList, newVendor]);
    setShowVendorForm(false);
  };

  const filtered = vendorList.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || vendor.category === filterCategory;
    const matchesRating = filterRating === 'all' || vendor.rating >= parseFloat(filterRating);
    return matchesSearch && matchesCategory && matchesRating;
  });

  const getCategoryColor = (category) => {
    const colors = {
      plumbing: 'bg-blue-100 text-blue-800',
      hvac: 'bg-cyan-100 text-cyan-800',
      electrical: 'bg-yellow-100 text-yellow-800',
      locksmith: 'bg-purple-100 text-purple-800',
      painting: 'bg-pink-100 text-pink-800',
      cleaning: 'bg-green-100 text-green-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const stats = [
    { label: 'Total Vendors', value: vendorList.length, icon: Briefcase, color: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Active', value: vendorList.filter(v => v.status === 'active').length, icon: TrendingUp, color: 'bg-green-100 dark:bg-green-900/20' },
    { label: 'Avg Rating', value: (vendorList.reduce((sum, v) => sum + v.rating, 0) / vendorList.length).toFixed(1), icon: Star, color: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { label: 'Avg Response', value: '2.8h', icon: AlertCircle, color: 'bg-purple-100 dark:bg-purple-900/20' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vendors</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage maintenance service providers</p>
          </div>
          <button onClick={() => setShowVendorForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Vendor
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`${stat.color} rounded-lg p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                  </div>
                  <Icon className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4 flex-col md:flex-row items-end">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Ratings</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>
            <div className="flex gap-2 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(vendor => (
              <div key={vendor.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{vendor.name}</h3>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(vendor.category)}`}>
                        {vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${vendor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {vendor.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(vendor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{vendor.rating}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">({vendor.reviews})</span>
                  </div>
                </div>
                <div className="p-6 space-y-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a href={`tel:${vendor.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">{vendor.phone}</a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${vendor.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{vendor.email}</a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{vendor.address}</span>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-3 gap-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Jobs Done</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{vendor.jobsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Avg Cost</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">${vendor.avgCost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Response</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{vendor.responseTime}</p>
                  </div>
                </div>
                <div className="p-6 flex gap-2">
                  <button className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-sm font-medium">
                    View Profile
                  </button>
                  <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {filtered.map(vendor => (
              <div key={vendor.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{vendor.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(vendor.category)}`}>
                        {vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(vendor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{vendor.rating}</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">({vendor.reviews} reviews)</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${vendor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {vendor.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Phone</p>
                    <a href={`tel:${vendor.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">{vendor.phone}</a>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Email</p>
                    <a href={`mailto:${vendor.email}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium truncate">{vendor.email}</a>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Jobs Done</p>
                    <p className="font-bold text-gray-900 dark:text-white">{vendor.jobsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Avg Cost</p>
                    <p className="font-bold text-gray-900 dark:text-white">${vendor.avgCost}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Response</p>
                    <p className="font-bold text-gray-900 dark:text-white">{vendor.responseTime}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-sm font-medium">
                    View Profile
                  </button>
                  <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No vendors found</p>
          </div>
        )}
      </div>

      {showVendorForm && <VendorForm onClose={() => setShowVendorForm(false)} onSubmit={handleAddVendor} />}
    </div>
  );
};

export default Vendors;
