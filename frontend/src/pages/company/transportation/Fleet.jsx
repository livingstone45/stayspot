import React, { useState, useEffect } from 'react';
import { Search, Plus, Wrench, AlertTriangle, CheckCircle, Truck, X, Loader, Calendar } from 'lucide-react';
import Alert from '../../../components/common/UI/Alert';
import { useTheme } from '../../../contexts/ThemeContext';

const mockVehicles = [
  { id: 1, model: 'Toyota Hiace', vehicle_number: 'KCA-123A', registration_number: 'KCA123A', year: 2022, status: 'active', maintenance_date: '2024-06-15', notes: 'Nairobi - Mombasa route' },
  { id: 2, model: 'Nissan Caravan', vehicle_number: 'KCB-456B', registration_number: 'KCB456B', year: 2021, status: 'active', maintenance_date: '2024-07-20', notes: 'Nairobi - Kisumu route' },
  { id: 3, model: 'Toyota Probox', vehicle_number: 'KCC-789C', registration_number: 'KCC789C', year: 2023, status: 'maintenance', maintenance_date: '2024-05-10', notes: 'Engine service at Nairobi' },
  { id: 4, model: 'Isuzu NPR', vehicle_number: 'KCD-012D', registration_number: 'KCD012D', year: 2020, status: 'active', maintenance_date: '2024-08-05', notes: 'Cargo transport - Mombasa' },
  { id: 5, model: 'Toyota Quantum', vehicle_number: 'KCE-345E', registration_number: 'KCE345E', year: 2022, status: 'inactive', maintenance_date: '2024-09-12', notes: 'Awaiting repairs in Nairobi' }
];

const Fleet = () => {
  const { isDarkMode } = useTheme();
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, [search, status]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ limit: 50, ...(search && { search }), ...(status && { status }) });
      
      const response = await fetch(`/api/transportation/fleet?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch vehicles');
      const data = await response.json();
      setVehicles(data.data || []);
    } catch (err) {
      setVehicles(mockVehicles);
      setStats({ total: 5, active: 3, maintenance: 1, inactive: 1 });
    } finally {
      setLoading(false);
    }
  };

  const handleViewVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  const handleUpdateStatus = async (vehicleId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/transportation/fleet/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update vehicle');
      fetchVehicles();
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: <CheckCircle className="w-5 h-5 text-green-600" />,
      maintenance: <Wrench className="w-5 h-5 text-yellow-600" />,
      inactive: <AlertTriangle className="w-5 h-5 text-red-600" />
    };
    return icons[status] || <Truck className="w-5 h-5" />;
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchSearch = v.model.toLowerCase().includes(search.toLowerCase()) || v.vehicle_number.includes(search);
    const matchStatus = !status || v.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Fleet Management</h1>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Manage your vehicle fleet</p>
          </div>
          <button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all">
            <Plus className="w-5 h-5" /> Add Vehicle
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-6 rounded-xl shadow border`}>
              <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Total Vehicles</p>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-6 rounded-xl shadow border`}>
              <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Active</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-6 rounded-xl shadow border`}>
              <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Maintenance</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.maintenance}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-6 rounded-xl shadow border`}>
              <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Inactive</p>
              <p className="text-3xl font-bold text-red-600">{stats.inactive}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-4 rounded-xl shadow mb-6 flex gap-4 border`}>
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-3 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search vehicles..."
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
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} rounded-xl shadow border hover:shadow-lg transition-all overflow-hidden`}
              >
                {/* Header */}
                <div className={`p-6 bg-gradient-to-r from-orange-600 to-orange-700`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Truck className="w-8 h-8 text-white" />
                      <div>
                        <h3 className="font-semibold text-white">{vehicle.model}</h3>
                        <p className="text-xs text-orange-100">{vehicle.vehicle_number}</p>
                      </div>
                    </div>
                    {getStatusIcon(vehicle.status)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className={`text-xs font-semibold text-orange-400 mb-1`}>Registration</p>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{vehicle.registration_number}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold text-orange-400 mb-1`}>Year</p>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{vehicle.year}</p>
                    </div>
                  </div>

                  <div>
                    <p className={`text-xs font-semibold text-orange-400 mb-1`}>Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>

                  {vehicle.maintenance_date && (
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'} border`}>
                      <p className={`text-xs font-semibold text-orange-400 mb-1 flex items-center gap-1`}>
                        <Calendar className="w-3 h-3" /> Next Maintenance
                      </p>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {new Date(vehicle.maintenance_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleViewVehicle(vehicle)}
                    className="w-full mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold hover:from-orange-700 hover:to-orange-800 transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-12 text-center`}>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>No vehicles found</p>
          </div>
        )}

        {/* Vehicle Detail Modal */}
        {showModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-800 max-h-96 overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 rounded-t-2xl flex justify-between items-center sticky top-0">
                <h2 className="text-xl font-bold text-white">{selectedVehicle.model}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-orange-200 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-orange-400 font-semibold mb-1">Vehicle Number</p>
                    <p className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>{selectedVehicle.vehicle_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-400 font-semibold mb-1">Registration</p>
                    <p className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>{selectedVehicle.registration_number}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-orange-400 font-semibold mb-1">Year</p>
                    <p className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>{selectedVehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-400 font-semibold mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedVehicle.status)}`}>
                      {selectedVehicle.status}
                    </span>
                  </div>
                </div>

                {selectedVehicle.maintenance_date && (
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'} border`}>
                    <p className="text-xs text-orange-400 font-semibold mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Next Maintenance
                    </p>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(selectedVehicle.maintenance_date).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {selectedVehicle.notes && (
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'} border`}>
                    <p className="text-xs text-orange-400 font-semibold mb-1">Notes</p>
                    <p className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>{selectedVehicle.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 flex gap-3 border-t border-slate-700">
                {selectedVehicle.status !== 'maintenance' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedVehicle.id, 'maintenance')}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-semibold hover:from-yellow-700 hover:to-yellow-800 transition-all flex items-center justify-center gap-2"
                  >
                    <Wrench className="w-4 h-4" /> Maintenance
                  </button>
                )}
                <button
                  onClick={() => handleUpdateStatus(selectedVehicle.id, selectedVehicle.status === 'active' ? 'inactive' : 'active')}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold hover:from-orange-700 hover:to-orange-800 transition-all"
                >
                  {selectedVehicle.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-all border border-slate-700"
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

export default Fleet;
