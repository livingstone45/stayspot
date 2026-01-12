import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Phone, Mail, Star, X, Loader } from 'lucide-react';
import Alert from '../../../components/common/UI/Alert';
import { useTheme } from '../../../contexts/ThemeContext';

const mockDrivers = [
  { id: 1, name: 'James Kipchoge', email: 'james.kipchoge@example.com', phone: '+254-722-123456', license_number: 'DL/KE/001', status: 'active', rating: 4.8 },
  { id: 2, name: 'Mary Wanjiru', email: 'mary.wanjiru@example.com', phone: '+254-733-234567', license_number: 'DL/KE/002', status: 'active', rating: 4.9 }
];

const Drivers = () => {
  const { isDarkMode } = useTheme();
  const [drivers, setDrivers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    license_number: '',
    license_expiry: '',
    vehicle_type: '',
    vehicle_number: '',
    insurance_number: '',
    address: '',
    status: 'active'
  });

  useEffect(() => {
    fetchDrivers();
  }, [search, status]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ limit: 50, ...(search && { search }), ...(status && { status }) });
      
      const response = await fetch(`/api/transportation/drivers?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch drivers');
      const data = await response.json();
      setDrivers(data.data || []);
    } catch (err) {
      setDrivers(mockDrivers);
      setStats({ total: 2, active: 2, on_trip: 0, avg_rating: 4.85 });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDriver = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.license_number || !formData.vehicle_type || !formData.vehicle_number) {
      setError('Please fill all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/transportation/drivers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to add driver');
      setFormData({
        name: '',
        email: '',
        phone: '',
        license_number: '',
        license_expiry: '',
        vehicle_type: '',
        vehicle_number: '',
        insurance_number: '',
        address: '',
        status: 'active'
      });
      setShowAddForm(false);
      fetchDrivers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewDriver = (driver) => {
    setSelectedDriver(driver);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      on_trip: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredDrivers = drivers.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !status || d.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Drivers</h1>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Manage your transportation drivers</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all"
          >
            <Plus className="w-5 h-5" /> Add Driver
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-6 rounded-xl shadow border`}>
              <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Total Drivers</p>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-6 rounded-xl shadow border`}>
              <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Active</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-6 rounded-xl shadow border`}>
              <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>On Trip</p>
              <p className="text-3xl font-bold text-blue-600">{stats.on_trip}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-6 rounded-xl shadow border`}>
              <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Avg Rating</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.avg_rating?.toFixed(1) || 'N/A'}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-4 rounded-xl shadow mb-6 flex gap-4 border`}>
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-3 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search drivers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100'}`}
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-100'}`}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_trip">On Trip</option>
          </select>
        </div>

        {/* Drivers Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : filteredDrivers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map((driver) => (
              <div
                key={driver.id}
                className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} rounded-xl shadow border p-6 hover:shadow-lg transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-600 to-orange-700 flex items-center justify-center text-white font-bold">
                      {driver.name?.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{driver.name}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{driver.license_number}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                    {driver.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    <Phone className="w-4 h-4 text-orange-600" /> {driver.phone}
                  </p>
                  <p className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    <Mail className="w-4 h-4 text-orange-600" /> {driver.email}
                  </p>
                  <p className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {driver.rating?.toFixed(1) || 'N/A'}
                  </p>
                </div>

                <button
                  onClick={() => handleViewDriver(driver)}
                  className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold hover:from-orange-700 hover:to-orange-800 transition-all"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-12 text-center`}>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>No drivers found</p>
          </div>
        )}

        {/* Add Driver Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl shadow-2xl max-w-md w-full border border-slate-800">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Add New Driver</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-orange-200 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {/* Personal Info */}
                <div className="border-b border-slate-700 pb-4">
                  <p className="text-xs font-bold text-orange-400 uppercase mb-3">Personal Information</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-orange-400 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Smith"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-orange-400 mb-1">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-orange-400 mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1-555-0101"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-orange-400 mb-1">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="123 Main St, City"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* License Info */}
                <div className="border-b border-slate-700 pb-4">
                  <p className="text-xs font-bold text-orange-400 uppercase mb-3">License Information</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-orange-400 mb-1">License Number *</label>
                      <input
                        type="text"
                        value={formData.license_number}
                        onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                        placeholder="DL123456"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-orange-400 mb-1">License Expiry</label>
                      <input
                        type="date"
                        value={formData.license_expiry}
                        onChange={(e) => setFormData({ ...formData, license_expiry: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="border-b border-slate-700 pb-4">
                  <p className="text-xs font-bold text-orange-400 uppercase mb-3">Vehicle Information</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-orange-400 mb-1">Vehicle Type *</label>
                      <select
                        value={formData.vehicle_type}
                        onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                      >
                        <option value="">Select vehicle type</option>
                        <option value="sedan">Sedan</option>
                        <option value="suv">SUV</option>
                        <option value="van">Van</option>
                        <option value="truck">Truck</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-orange-400 mb-1">Vehicle Number *</label>
                      <input
                        type="text"
                        value={formData.vehicle_number}
                        onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                        placeholder="ABC-1234"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-orange-400 mb-1">Insurance Number</label>
                      <input
                        type="text"
                        value={formData.insurance_number}
                        onChange={(e) => setFormData({ ...formData, insurance_number: e.target.value })}
                        placeholder="INS123456"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-orange-400 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={handleAddDriver}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold hover:from-orange-700 hover:to-orange-800 transition-all"
                >
                  Add Driver
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-all border border-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Driver Detail Modal */}
        {showModal && selectedDriver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl shadow-2xl max-w-md w-full border border-slate-800">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">{selectedDriver.name}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-orange-200 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-orange-400 font-semibold mb-1">Phone</p>
                  <p className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>{selectedDriver.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-orange-400 font-semibold mb-1">Email</p>
                  <p className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>{selectedDriver.email}</p>
                </div>
                <div>
                  <p className="text-sm text-orange-400 font-semibold mb-1">License Number</p>
                  <p className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>{selectedDriver.license_number}</p>
                </div>
                <div>
                  <p className="text-sm text-orange-400 font-semibold mb-1">Rating</p>
                  <p className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>{selectedDriver.rating?.toFixed(1) || 'N/A'} ⭐</p>
                </div>
              </div>

              {/* Button */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold hover:from-orange-700 hover:to-orange-800 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drivers;
