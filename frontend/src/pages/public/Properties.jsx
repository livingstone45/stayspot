import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../../components/common/Footer';
import { 
  Search, 
  MapPin, 
  Home, 
  Bath, 
  Bed, 
  Square, 
  DollarSign, 
  ChevronDown,
  ChevronUp,
  Filter,
  Grid,
  List,
  Star,
  Heart,
  Eye,
  MessageCircle,
  Map,
  Zap,
  TrendingUp
} from 'lucide-react';

const PropertiesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [bedroomFilter, setBedroomFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [expandedFilters, setExpandedFilters] = useState(true);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        setAllProperties(data);
      } else {
        console.error('Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultProperties = [
    {
      id: 1,
      name: 'Luxury 3-Bedroom Apartment',
      location: 'Westlands, Nairobi',
      price: 85000,
      bedrooms: 3,
      bathrooms: 2,
      area: 150,
      type: 'apartment',
      status: 'Active',
      views: 30,
      enquiries: 4,
      featured: true,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=500&h=500&fit=crop'
    },
    {
      id: 2,
      name: 'Modern Bedsitter Studio',
      location: 'Kilimani, Nairobi',
      price: 35000,
      bedrooms: 1,
      bathrooms: 1,
      area: 45,
      type: 'studio',
      status: 'Pending',
      views: 18,
      enquiries: 2,
      featured: false,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=500&fit=crop'
    },
    {
      id: 3,
      name: 'Family Townhouse 4-Rooms',
      location: 'Runda, Nairobi',
      price: 120000,
      bedrooms: 4,
      bathrooms: 3,
      area: 200,
      type: 'townhouse',
      status: 'Just Listed',
      views: 45,
      enquiries: 6,
      featured: true,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=500&fit=crop'
    },
    {
      id: 4,
      name: 'Cozy 2-Bedroom Flat',
      location: 'Karen, Nairobi',
      price: 65000,
      bedrooms: 2,
      bathrooms: 1,
      area: 95,
      type: 'apartment',
      status: 'Active',
      views: 22,
      enquiries: 3,
      featured: false,
      image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=500&h=500&fit=crop'
    },
    {
      id: 5,
      name: 'Commercial Office Space',
      location: 'Upper Hill, Nairobi',
      price: 150000,
      bedrooms: 0,
      bathrooms: 2,
      area: 250,
      type: 'office',
      status: 'Active',
      views: 58,
      enquiries: 8,
      featured: true,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=500&fit=crop'
    },
    {
      id: 6,
      name: 'Luxury Villa with Garden',
      location: 'Muthaiga, Nairobi',
      price: 250000,
      bedrooms: 5,
      bathrooms: 4,
      area: 400,
      type: 'villa',
      status: 'Active',
      views: 72,
      enquiries: 12,
      featured: true,
      image: 'https://images.unsplash.com/photo-1512917774080-9264f475f850?w=500&h=500&fit=crop'
    },
    {
      id: 7,
      name: 'Modern 3-Bedroom Apartment',
      location: 'Lavington, Nairobi',
      price: 95000,
      bedrooms: 3,
      bathrooms: 2,
      area: 160,
      type: 'apartment',
      status: 'Active',
      views: 41,
      enquiries: 5,
      featured: false,
      image: 'https://images.unsplash.com/photo-1560440021-33f237b74a8d?w=500&h=500&fit=crop'
    },
    {
      id: 8,
      name: 'Spacious 2-Bedroom Townhouse',
      location: 'Parklands, Nairobi',
      price: 75000,
      bedrooms: 2,
      bathrooms: 2,
      area: 110,
      type: 'townhouse',
      status: 'Active',
      views: 35,
      enquiries: 4,
      featured: false,
      image: 'https://images.unsplash.com/photo-1570129477492-45b003d3e8d3?w=500&h=500&fit=crop'
    },
    {
      id: 9,
      name: 'Elegant 4-Bedroom Villa',
      location: 'Nyari, Nairobi',
      price: 180000,
      bedrooms: 4,
      bathrooms: 3,
      area: 280,
      type: 'villa',
      status: 'Active',
      views: 63,
      enquiries: 9,
      featured: false,
      image: 'https://images.unsplash.com/photo-1564013999919-ab600027ffc6?w=500&h=500&fit=crop'
    },
    {
      id: 10,
      name: 'Cozy Studio Apartment',
      location: 'Eastleigh, Nairobi',
      price: 28000,
      bedrooms: 1,
      bathrooms: 1,
      area: 35,
      type: 'studio',
      status: 'Active',
      views: 12,
      enquiries: 1,
      featured: false,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=500&fit=crop'
    },
    {
      id: 11,
      name: 'Premium 3-Bedroom Penthouse',
      location: 'Kileleshwa, Nairobi',
      price: 125000,
      bedrooms: 3,
      bathrooms: 3,
      area: 180,
      type: 'apartment',
      status: 'Active',
      views: 38,
      enquiries: 5,
      featured: true,
      image: 'https://images.unsplash.com/photo-1512917774080-9264f475f850?w=500&h=500&fit=crop'
    },
    {
      id: 12,
      name: 'Spacious 5-Bedroom Family Home',
      location: 'Spring Valley, Nairobi',
      price: 200000,
      bedrooms: 5,
      bathrooms: 4,
      area: 350,
      type: 'villa',
      status: 'Active',
      views: 55,
      enquiries: 8,
      featured: false,
      image: 'https://images.unsplash.com/photo-1570129477492-45b003d3e8d3?w=500&h=500&fit=crop'
    }
  ];

  const properties = allProperties.length > 0 ? allProperties : defaultProperties;

  // Filter properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || property.type === selectedType;
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    const matchesBedrooms = bedroomFilter === 'all' || (bedroomFilter === '5+' ? property.bedrooms >= 5 : property.bedrooms === parseInt(bedroomFilter));
    
    return matchesSearch && matchesType && matchesPrice && matchesBedrooms;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return b.id - a.id;
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const locations = ['Nairobi', 'Karen', 'Kilimani', 'Westlands', 'Runda', 'Lavington', 'Parklands', 'Upper Hill', 'Muthaiga'];
  const propertyTypes = ['apartment', 'studio', 'townhouse', 'villa', 'office'];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 text-white py-20 px-4">
        <div className="absolute top-20 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto relative z-10"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse Available Properties</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">Discover your perfect property from our extensive collection of apartments, villas, townhouses, and more.</p>
          </div>

          {/* Quick Search */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white text-slate-900"
                />
              </div>
              <button className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition flex items-center gap-2">
                <Search size={18} />
                Search
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-4xl font-bold text-orange-600 mb-2">{properties.length}+</div>
              <p className="text-slate-600">Properties Available</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="text-4xl font-bold text-orange-600 mb-2">50K+</div>
              <p className="text-slate-600">Happy Tenants</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <p className="text-slate-600">Customer Support</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <div className="text-4xl font-bold text-orange-600 mb-2">15+</div>
              <p className="text-slate-600">Years Experience</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl p-6 sticky top-20 border border-slate-200 shadow-sm">
                <button
                  onClick={() => setExpandedFilters(!expandedFilters)}
                  className="w-full flex items-center justify-between font-bold text-lg text-slate-900 mb-6 pb-4 border-b-2 border-orange-200"
                >
                  <span className="flex items-center gap-2">
                    <Filter size={20} className="text-orange-600" />
                    Filters
                  </span>
                  {expandedFilters ? <ChevronUp size={20} className="text-orange-600" /> : <ChevronDown size={20} className="text-orange-600" />}
                </button>

                {expandedFilters && (
                  <div className="space-y-6">
                    {/* Price Range */}
                    <div>
                      <label className="block font-bold text-slate-900 mb-4 text-sm">Price Range</label>
                      <div className="bg-gradient-to-r from-orange-50 to-slate-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-600">KES {priceRange[0].toLocaleString()}</span>
                          <span className="text-xs font-semibold text-orange-600">KES {priceRange[1].toLocaleString()}</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="500000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        className="w-full accent-orange-500"
                      />
                    </div>

                    {/* Property Type */}
                    <div>
                      <label className="block font-bold text-slate-900 mb-3 text-sm">Property Type</label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white text-slate-900 font-medium"
                      >
                        <option value="all">All Types</option>
                        {propertyTypes.map(type => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block font-bold text-slate-900 mb-3 text-sm">Location</label>
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white text-slate-900 font-medium"
                      >
                        <option value="all">All Locations</option>
                        {locations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <label className="block font-bold text-slate-900 mb-3 text-sm">Bedrooms</label>
                      <select
                        value={bedroomFilter}
                        onChange={(e) => setBedroomFilter(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white text-slate-900 font-medium"
                      >
                        <option value="all">All</option>
                        <option value="1">1 Bedroom</option>
                        <option value="2">2 Bedrooms</option>
                        <option value="3">3 Bedrooms</option>
                        <option value="4">4 Bedrooms</option>
                        <option value="5+">5+ Bedrooms</option>
                      </select>
                    </div>

                    {/* Quick Price Presets */}
                    <div>
                      <label className="block font-bold text-slate-900 mb-3 text-sm">Quick Presets</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setPriceRange([0, 50000])} className="px-3 py-2 bg-slate-100 hover:bg-orange-100 text-slate-900 rounded-lg text-xs font-semibold transition">Under 50K</button>
                        <button onClick={() => setPriceRange([0, 100000])} className="px-3 py-2 bg-slate-100 hover:bg-orange-100 text-slate-900 rounded-lg text-xs font-semibold transition">Under 100K</button>
                        <button onClick={() => setPriceRange([100000, 200000])} className="px-3 py-2 bg-slate-100 hover:bg-orange-100 text-slate-900 rounded-lg text-xs font-semibold transition">100K-200K</button>
                        <button onClick={() => setPriceRange([200000, 500000])} className="px-3 py-2 bg-slate-100 hover:bg-orange-100 text-slate-900 rounded-lg text-xs font-semibold transition">200K+</button>
                      </div>
                    </div>

                    {/* Popular Locations */}
                    <div>
                      <label className="block font-bold text-slate-900 mb-3 text-sm">Popular Areas</label>
                      <div className="space-y-2">
                        {['Westlands', 'Karen', 'Kilimani'].map(loc => (
                          <button key={loc} onClick={() => setSelectedLocation(loc)} className="w-full text-left px-3 py-2 bg-slate-50 hover:bg-orange-50 text-slate-900 rounded-lg text-sm font-medium transition border border-slate-200 hover:border-orange-300">
                            {loc}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Clear Filters */}
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedType('all');
                        setSelectedLocation('all');
                        setPriceRange([0, 500000]);
                        setBedroomFilter('all');
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition shadow-md"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Properties Grid */}
            <div className="md:col-span-3">
              {/* Top Controls */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-900">{sortedProperties.length}</span> properties found
                </div>
                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="flex gap-2 bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'text-slate-600'}`}
                    >
                      <Grid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'text-slate-600'}`}
                    >
                      <List size={20} />
                    </button>
                  </div>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="views">Most Viewed</option>
                  </select>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {[...Array(6)].map((_, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
                      <div className="w-full h-64 bg-slate-200"></div>
                      <div className="p-6 space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        <div className="grid grid-cols-3 gap-2 py-4">
                          {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded"></div>)}
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && sortedProperties.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-xl">
                  <Home size={48} className="mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No properties found</h3>
                  <p className="text-slate-600">Try adjusting your filters to find what you're looking for.</p>
                </div>
              )}

              {/* Properties */}
              {!loading && sortedProperties.length > 0 && (
                <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {sortedProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className={`group ${viewMode === 'list' ? 'flex gap-4 bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all' : 'bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all'}`}
                    >
                      {/* Image */}
                      <Link
                        to={`/property/${property.id}`}
                        className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'w-full'} ${viewMode === 'list' ? 'h-48' : 'h-64'}`}
                      >
                        <img
                          src={property.image || 'https://via.placeholder.com/400x300'}
                          alt={property.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {property.featured && (
                          <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Featured
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Heart size={18} className="text-red-500" />
                        </div>
                      </Link>

                      {/* Content */}
                      <div className={`${viewMode === 'list' ? 'flex-1 p-4' : 'p-6'}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-2">{property.name}</h3>
                            <div className="flex items-center gap-1 text-slate-600 text-sm">
                              <MapPin size={16} />
                              {property.location}
                            </div>
                          </div>
                        </div>

                        {/* Features */}
                        <div className={`grid grid-cols-${viewMode === 'list' ? '4' : '3'} gap-2 mb-4 py-4 border-y border-slate-100`}>
                          {property.bedrooms > 0 && (
                            <div className="text-center p-2 bg-slate-50 rounded">
                              <Bed size={18} className="text-slate-600 mx-auto mb-1" />
                              <span className="text-xs font-bold text-slate-900">{property.bedrooms}</span>
                              <p className="text-xs text-slate-500">Beds</p>
                            </div>
                          )}
                          <div className="text-center p-2 bg-slate-50 rounded">
                            <Bath size={18} className="text-slate-600 mx-auto mb-1" />
                            <span className="text-xs font-bold text-slate-900">{property.bathrooms}</span>
                            <p className="text-xs text-slate-500">Baths</p>
                          </div>
                          <div className="text-center p-2 bg-slate-50 rounded">
                            <Square size={18} className="text-slate-600 mx-auto mb-1" />
                            <span className="text-xs font-bold text-slate-900">{property.area}</span>
                            <p className="text-xs text-slate-500">Sq Ft</p>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-orange-600">KES {property.price.toLocaleString()}</p>
                            <p className="text-xs text-slate-500">/month</p>
                          </div>
                          <Link
                            to={`/property/${property.id}`}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition text-sm"
                          >
                            View Details
                          </Link>
                        </div>

                        {/* Stats */}
                        {viewMode === 'grid' && (
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <Eye size={14} />
                              {property.views} views
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle size={14} />
                              {property.enquiries} enquiries
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && sortedProperties.length > 12 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition">Previous</button>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">1</button>
                  <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition">2</button>
                  <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition">3</button>
                  <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition">Next</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      {properties.filter(p => p.featured).length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Featured Properties</h2>
              <p className="text-xl text-slate-600">Handpicked premium properties for you</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {properties.filter(p => p.featured).slice(0, 3).map((property, idx) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img src={property.image} alt={property.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white text-2xl font-bold">KES {property.price.toLocaleString()}</p>
                      <p className="text-white/80 text-sm">/month</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{property.name}</h3>
                    <p className="text-slate-600 text-sm mb-4 flex items-center gap-1">
                      <MapPin size={16} />
                      {property.location}
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-4 py-4 border-y border-slate-100">
                      {property.bedrooms > 0 && <div className="text-center"><Bed size={16} className="mx-auto mb-1 text-slate-600" /><span className="text-xs font-bold">{property.bedrooms}</span></div>}
                      <div className="text-center"><Bath size={16} className="mx-auto mb-1 text-slate-600" /><span className="text-xs font-bold">{property.bathrooms}</span></div>
                      <div className="text-center"><Square size={16} className="mx-auto mb-1 text-slate-600" /><span className="text-xs font-bold">{property.area}</span></div>
                    </div>
                    <Link to={`/property/${property.id}`} className="w-full py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition text-center">
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Find your perfect property in 4 simple steps</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Search, title: 'Search', desc: 'Browse our extensive collection of properties' },
              { icon: Eye, title: 'View Details', desc: 'Check photos, features, and pricing' },
              { icon: MessageCircle, title: 'Contact', desc: 'Reach out to landlords directly' },
              { icon: Home, title: 'Move In', desc: 'Complete the process and move in' }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {idx + 1}
                  </div>
                  <Icon size={32} className="text-orange-600 mx-auto mb-4" />
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Post Your Property CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Didn't find what you're looking for?</h2>
              <p className="text-xl opacity-90 mb-8">Post your property and reach thousands of potential tenants today.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/landlord/add-property"
                  className="inline-flex items-center justify-center bg-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition"
                >
                  <Home size={20} className="mr-2" />
                  Post Your Property
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden md:block"
            >
              <div className="relative h-96 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-2xl border border-orange-400/30 flex items-center justify-center">
                <Home size={120} className="text-orange-400/40" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PropertiesPage;
