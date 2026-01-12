import React, { useState } from 'react';
import { Truck, Plus, Search, Filter, MapPin, Star, CheckCircle, AlertCircle, Eye, Edit, Download } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const TransportationManagement = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = [
    { label: 'Active Drivers', value: '156', icon: '👨‍✈️', color: 'blue' },
    { label: 'Active Bookings', value: '42', icon: '🚗', color: 'green' },
    { label: 'Fleet Vehicles', value: '89', icon: '🚙', color: 'orange' },
    { label: 'Daily Revenue', value: '$4,250', icon: '💰', color: 'purple' }
  ];

  const drivers = [
    { id: 'DRV-001', name: 'John Smith', phone: '+1-555-0101', status: 'active', rating: 4.8, trips: 245, earnings: '$2,450', vehicle: 'Toyota Prius' },
    { id: 'DRV-002', name: 'Sarah Johnson', phone: '+1-555-0102', status: 'active', rating: 4.9, trips: 312, earnings: '$3,120', vehicle: 'Honda Civic' },
    { id: 'DRV-003', name: 'Mike Brown', phone: '+1-555-0103', status: 'inactive', rating: 4.6, trips: 189, earnings: '$1,890', vehicle: 'Ford Focus' },
    { id: 'DRV-004', name: 'Emma Davis', phone: '+1-555-0104', status: 'active', rating: 4.7, trips: 267, earnings: '$2,670', vehicle: 'Hyundai Elantra' },
    { id: 'DRV-005', name: 'Robert Wilson', phone: '+1-555-0105', status: 'active', rating: 4.5, trips: 198, earnings: '$1,980', vehicle: 'Mazda 3' }
  ];

  const bookings = [
    { id: 'BKG-001', passenger: 'Alice Cooper', driver: 'John Smith', pickup: '123 Main St', dropoff: '456 Oak Ave', status: 'completed', fare: '$25.50', date: '2024-01-15' },
    { id: 'BKG-002', passenger: 'Bob Taylor', driver: 'Sarah Johnson', pickup: '789 Pine Rd', dropoff: '321 Elm St', status: 'in-progress', fare: '$18.75', date: '2024-01-15' },
    { id: 'BKG-003', passenger: 'Carol White', driver: 'Emma Davis', pickup: '654 Maple Dr', dropoff: '987 Cedar Ln', status: 'completed', fare: '$32.00', date: '2024-01-15' },
    { id: 'BKG-004', passenger: 'David Green', driver: 'Robert Wilson', pickup: '111 Birch Ct', dropoff: '222 Spruce Way', status: 'pending', fare: '$21.25', date: '2024-01-15' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800',
      inactive: isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800',
      'in-progress': isDarkMode ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
      completed: isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800',
      pending: isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-800'
    };
    return colors[status];
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: <CheckCircle className="w-5 h-5 text-green-600" />,
      inactive: <AlertCircle className="w-5 h-5 text-red-600" />,
      'in-progress': <Truck className="w-5 h-5 text-yellow-600" />,
      completed: <CheckCircle className="w-5 h-5 text-green-600" />,
      pending: <AlertCircle className="w-5 h-5 text-blue-600" />
    };
    return icons[status];
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/40'} backdrop-blur-xl sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Transportation Management</h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Manage drivers, bookings & fleet vehicles</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
              <Plus className="w-5 h-5" /> Add Driver
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
              <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Drivers Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Driver Management</h2>
            <button className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-slate-100'}`}>
              <Download className="w-5 h-5" /> Export
            </button>
          </div>

          {/* Drivers Search & Filter */}
          <div className={`rounded-xl shadow p-6 border mb-6 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by driver name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Drivers Table */}
          <div className={`rounded-xl shadow border overflow-hidden ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`border-b ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Driver ID</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Name</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Phone</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Vehicle</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Status</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Rating</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Trips</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Earnings</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver, idx) => (
                    <tr key={idx} className={`border-b ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <td className={`px-6 py-4 text-sm font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>{driver.id}</td>
                      <td className={`px-6 py-4 text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{driver.name}</td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{driver.phone}</td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{driver.vehicle}</td>
                      <td className={`px-6 py-4 text-sm`}>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(driver.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(driver.status)}`}>
                            {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm`}>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{driver.rating}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{driver.trips}</td>
                      <td className={`px-6 py-4 text-sm font-bold text-green-600`}>{driver.earnings}</td>
                      <td className={`px-6 py-4 text-sm flex gap-2`}>
                        <button className={`p-2 rounded hover:bg-slate-700 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className={`p-2 rounded hover:bg-slate-700 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div>
          <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Bookings</h2>

          {/* Bookings Table */}
          <div className={`rounded-xl shadow border overflow-hidden ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`border-b ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Booking ID</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Passenger</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Driver</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Pickup</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Dropoff</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Status</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Fare</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, idx) => (
                    <tr key={idx} className={`border-b ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <td className={`px-6 py-4 text-sm font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>{booking.id}</td>
                      <td className={`px-6 py-4 text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{booking.passenger}</td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{booking.driver}</td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{booking.pickup}</td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{booking.dropoff}</td>
                      <td className={`px-6 py-4 text-sm`}>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status === 'in-progress' ? 'In Progress' : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-bold text-green-600`}>{booking.fare}</td>
                      <td className={`px-6 py-4 text-sm flex gap-2`}>
                        <button className={`p-2 rounded hover:bg-slate-700 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                          <MapPin className="w-4 h-4" />
                        </button>
                        <button className={`p-2 rounded hover:bg-slate-700 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportationManagement;
