import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Navigation, Clock, AlertCircle, Zap, X, Loader, Activity } from 'lucide-react';
import Alert from '../../../components/common/UI/Alert';
import { useTheme } from '../../../contexts/ThemeContext';

const mockTrips = [
  { id: 1, driver_name: 'James Kipchoge', driver_phone: '+254-722-123456', driver_id: 1, passenger_name: 'Peter Omondi', pickup_location: 'Nairobi CBD', dropoff_location: 'Jomo Kenyatta Airport', latitude: -1.3195, longitude: 36.9271, status: 'in_progress', created_at: new Date(Date.now() - 1200000).toISOString() },
  { id: 2, driver_name: 'Mary Wanjiru', driver_phone: '+254-733-234567', driver_id: 2, passenger_name: 'Grace Muthoni', pickup_location: 'Westlands', dropoff_location: 'Karen', latitude: -1.2921, longitude: 36.8025, status: 'in_progress', created_at: new Date(Date.now() - 600000).toISOString() },
  { id: 3, driver_name: 'James Kipchoge', driver_phone: '+254-722-123456', driver_id: 1, passenger_name: 'David Kiplagat', pickup_location: 'Mombasa Road', dropoff_location: 'Thika', latitude: -1.2500, longitude: 36.7500, status: 'accepted', created_at: new Date(Date.now() - 300000).toISOString() }
];

const Tracking = () => {
  const { isDarkMode } = useTheme();
  const [activeTrips, setActiveTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActiveTrips();
    const interval = setInterval(fetchActiveTrips, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchActiveTrips = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/transportation/tracking', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch tracking data');
      const data = await response.json();
      setActiveTrips(data.data || []);
    } catch (err) {
      setActiveTrips(mockTrips);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBgColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      accepted: 'bg-blue-500',
      in_progress: 'bg-green-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Live Tracking</h1>
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Monitor active trips in real-time</p>
        </div>

        {/* Active Trips Count */}
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-6 rounded-xl shadow border mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Active Trips</p>
              <p className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activeTrips.length}</p>
            </div>
            <div className={`p-4 rounded-full ${getStatusBgColor('in_progress')} animate-pulse`}>
              <Activity className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Map View Placeholder */}
        <div className={`${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700' : 'bg-gradient-to-br from-blue-50 to-blue-100'} rounded-xl shadow mb-6 overflow-hidden border`}>
          <div className="w-full h-80 flex items-center justify-center">
            <div className="text-center">
              <MapPin className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`} />
              <p className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Live Map View</p>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Showing {activeTrips.length} active trips across Kenya</p>
            </div>
          </div>
        </div>

        {/* Active Trips List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : activeTrips.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {activeTrips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => setSelectedTrip(trip)}
                className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} rounded-xl shadow border hover:shadow-lg transition-all cursor-pointer overflow-hidden ${
                  selectedTrip?.id === trip.id ? 'ring-2 ring-orange-500' : ''
                }`}
              >
                {/* Status Bar */}
                <div className={`h-1 ${getStatusBgColor(trip.status)}`}></div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {trip.driver_name}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        {trip.passenger_name}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
                      {trip.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-3">
                      <MapPin className={`w-5 h-5 mt-0.5 flex-shrink-0 text-green-600`} />
                      <div>
                        <p className={`text-xs font-semibold text-orange-400`}>Pickup</p>
                        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{trip.pickup_location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Navigation className={`w-5 h-5 mt-0.5 flex-shrink-0 text-red-600`} />
                      <div>
                        <p className={`text-xs font-semibold text-orange-400`}>Dropoff</p>
                        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{trip.dropoff_location}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg mb-4 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'} border`}>
                    <p className={`text-xs font-semibold text-orange-400 mb-1`}>Current Location</p>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {trip.latitude?.toFixed(4)}, {trip.longitude?.toFixed(4)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{trip.driver_phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        {new Date(trip.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} p-12 rounded-xl shadow text-center mb-8`}>
            <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
            <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>No active trips at the moment</p>
          </div>
        )}

        {/* Selected Trip Details */}
        {selectedTrip && (
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} rounded-xl shadow border p-6`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Trip Details</h2>
              <button
                onClick={() => setSelectedTrip(null)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className={`text-xs font-semibold text-orange-400 mb-1`}>Driver</p>
                <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedTrip.driver_name}</p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{selectedTrip.driver_phone}</p>
              </div>

              <div>
                <p className={`text-xs font-semibold text-orange-400 mb-1`}>Passenger</p>
                <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedTrip.passenger_name}</p>
              </div>

              <div>
                <p className={`text-xs font-semibold text-orange-400 mb-1`}>Current Location</p>
                <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedTrip.latitude?.toFixed(4)}, {selectedTrip.longitude?.toFixed(4)}
                </p>
              </div>

              <div>
                <p className={`text-xs font-semibold text-orange-400 mb-1`}>Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedTrip.status)}`}>
                  {selectedTrip.status}
                </span>
              </div>

              <div className="md:col-span-2">
                <p className={`text-xs font-semibold text-orange-400 mb-2`}>Route</p>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'} border space-y-2`}>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      From: {selectedTrip.pickup_location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-red-600" />
                    <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      To: {selectedTrip.dropoff_location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
