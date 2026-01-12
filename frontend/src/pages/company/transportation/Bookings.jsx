import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, DollarSign, CheckCircle, XCircle, Clock, X, Loader, Calendar } from 'lucide-react';
import Alert from '../../../components/common/UI/Alert';
import { useTheme } from '../../../contexts/ThemeContext';

const mockBookings = [
  { id: 'BK001', passenger_name: 'Peter Omondi', pickup_location: 'Nairobi CBD', dropoff_location: 'Jomo Kenyatta Airport', fare: 2500, status: 'completed', driver_name: 'James Kipchoge', driver_phone: '+254-722-123456', vehicle_number: 'KCA-123A', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'BK002', passenger_name: 'Grace Muthoni', pickup_location: 'Westlands', dropoff_location: 'Karen', fare: 1800, status: 'in_progress', driver_name: 'Mary Wanjiru', driver_phone: '+254-733-234567', vehicle_number: 'KCB-456B', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'BK003', passenger_name: 'David Kiplagat', pickup_location: 'Mombasa Road', dropoff_location: 'Thika', fare: 1200, status: 'pending', driver_name: null, driver_phone: null, vehicle_number: null, created_at: new Date().toISOString() },
  { id: 'BK004', passenger_name: 'Amina Hassan', pickup_location: 'Kilimani', dropoff_location: 'Nairobi Hospital', fare: 950, status: 'completed', driver_name: 'James Kipchoge', driver_phone: '+254-722-123456', vehicle_number: 'KCA-123A', created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 'BK005', passenger_name: 'Samuel Kariuki', pickup_location: 'Upper Hill', dropoff_location: 'Parklands', fare: 1500, status: 'accepted', driver_name: 'Mary Wanjiru', driver_phone: '+254-733-234567', vehicle_number: 'KCB-456B', created_at: new Date(Date.now() - 7200000).toISOString() }
];

const Bookings = () => {
  const { isDarkMode } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [search, status]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ limit: 50, ...(search && { search }), ...(status && { status }) });
      
      const response = await fetch(`/api/transportation/bookings?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data.data || []);
    } catch (err) {
      setBookings(mockBookings);
      setStats({ total: 5, completed: 2, pending: 1, total_revenue: 200 });
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/transportation/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update booking');
      fetchBookings();
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      accepted: <CheckCircle className="w-4 h-4" />,
      in_progress: <Clock className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />
    };
    return icons[status];
  };

  const filteredBookings = bookings.filter(b => {
    const matchSearch = b.passenger_name.toLowerCase().includes(search.toLowerCase()) || b.id.includes(search);
    const matchStatus = !status || b.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-6xl mx-auto">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Bookings</h1>
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Manage all transportation bookings</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-6 rounded-xl shadow border`}>
              <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Total Bookings</p>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-6 rounded-xl shadow border`}>
              <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-6 rounded-xl shadow border`}>
              <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-6 rounded-xl shadow border`}>
              <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Total Revenue</p>
              <p className="text-3xl font-bold text-orange-600">${stats.total_revenue?.toFixed(2) || '0'}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-4 rounded-xl shadow mb-6 flex gap-4 border`}>
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-3 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search by name or booking ID..."
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
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} rounded-xl shadow border p-6 hover:shadow-lg transition-all`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {booking.passenger_name}
                    </h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(booking.created_at).toLocaleDateString()} at {new Date(booking.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)} {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Pickup</p>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{booking.pickup_location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Dropoff</p>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{booking.dropoff_location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Fare</p>
                      <p className="font-semibold text-green-600">${booking.fare?.toFixed(2) || '0'}</p>
                    </div>
                  </div>
                </div>

                {booking.driver_name && (
                  <div className={`p-3 rounded-lg mb-4 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'} border`}>
                    <p className={`text-xs font-semibold text-orange-400 mb-1`}>Driver Assigned</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{booking.driver_name}</p>
                        <p className={`text-sm flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          <Phone className="w-3 h-3" /> {booking.driver_phone}
                        </p>
                      </div>
                      <div className={`text-right ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        <p className="text-xs">Vehicle</p>
                        <p className="font-semibold">{booking.vehicle_number}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => handleViewBooking(booking)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold hover:from-orange-700 hover:to-orange-800 transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-12 text-center`}>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>No bookings found</p>
          </div>
        )}

        {/* Booking Detail Modal */}
        {showModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-800 max-h-96 overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 rounded-t-2xl flex justify-between items-center sticky top-0">
                <h2 className="text-xl font-bold text-white">Booking Details</h2>
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
                    <p className="text-xs text-orange-400 font-semibold mb-1">Passenger</p>
                    <p className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>{selectedBooking.passenger_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-400 font-semibold mb-1">Booking ID</p>
                    <p className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>{selectedBooking.id}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-orange-400 font-semibold mb-1">Pickup Location</p>
                  <p className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>{selectedBooking.pickup_location}</p>
                </div>

                <div>
                  <p className="text-xs text-orange-400 font-semibold mb-1">Dropoff Location</p>
                  <p className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>{selectedBooking.dropoff_location}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-orange-400 font-semibold mb-1">Fare</p>
                    <p className="text-2xl font-bold text-green-600">${selectedBooking.fare?.toFixed(2) || '0'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-400 font-semibold mb-1">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${getStatusColor(selectedBooking.status)}`}>
                      {getStatusIcon(selectedBooking.status)} {selectedBooking.status}
                    </span>
                  </div>
                </div>

                {selectedBooking.driver_name && (
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'} border`}>
                    <p className="text-xs text-orange-400 font-semibold mb-2">Driver Information</p>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedBooking.driver_name}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{selectedBooking.driver_phone}</p>
                    {selectedBooking.vehicle_number && (
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Vehicle: {selectedBooking.vehicle_number}</p>
                    )}
                  </div>
                )}

                <div>
                  <p className="text-xs text-orange-400 font-semibold mb-1">Booked At</p>
                  <p className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>{new Date(selectedBooking.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 flex gap-3 border-t border-slate-700">
                {selectedBooking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(selectedBooking.id, 'accepted')}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Accept
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedBooking.id, 'cancelled')}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> Cancel
                    </button>
                  </>
                )}
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

export default Bookings;
