import React, { useState, useEffect } from 'react';
import { Building, Users, DollarSign, ArrowUpRight, BarChart3, Activity, Download, Globe, Zap, Shield, AlertCircle, CheckCircle, Truck } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';
import axios from 'axios';

const CompanyDashboard = () => {
  const { isDarkMode } = useThemeMode();
  const [timeRange, setTimeRange] = useState('month');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moderators, setModerators] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const mockData = {
    stats: [
      { label: 'Total Properties', value: 1240, change: '+8.5%', icon: Building, color: 'blue' },
      { label: 'Active Users', value: '45.2K', change: '+12.3%', icon: Users, color: 'purple' },
      { label: 'Platform Revenue', value: 'KES 245M', change: '+18.7%', icon: DollarSign, color: 'green' },
      { label: 'System Health', value: '99.8%', change: '+0.2%', icon: Zap, color: 'orange' },
      { label: 'Moderators', value: 12, change: '+2', icon: Shield, color: 'blue' }
    ],
    moderators: [
      { id: 1, name: 'James Kipchoge', email: 'james@example.com', status: 'active', actions: 245 },
      { id: 2, name: 'Mary Wanjiru', email: 'mary@example.com', status: 'active', actions: 189 },
      { id: 3, name: 'Peter Omondi', email: 'peter@example.com', status: 'active', actions: 156 }
    ],
    drivers: [
      { id: 1, name: 'James Kipchoge', email: 'james@example.com', status: 'active', trips: 245 },
      { id: 2, name: 'Mary Wanjiru', email: 'mary@example.com', status: 'active', trips: 189 }
    ],
    bookings: [
      { id: 'BK001', passenger_name: 'Peter Omondi', status: 'completed', fare: 2500 },
      { id: 'BK002', passenger_name: 'Grace Muthoni', status: 'in_progress', fare: 1800 },
      { id: 'BK003', passenger_name: 'David Kiplagat', status: 'pending', fare: 1200 },
      { id: 'BK004', passenger_name: 'Amina Hassan', status: 'completed', fare: 950 },
      { id: 'BK005', passenger_name: 'Samuel Kariuki', status: 'accepted', fare: 1500 }
    ],
    revenue: [
      { month: 'Jan', percent: 60 }, { month: 'Feb', percent: 65 }, { month: 'Mar', percent: 70 },
      { month: 'Apr', percent: 75 }, { month: 'May', percent: 78 }, { month: 'Jun', percent: 82 }
    ],
    companies: [
      { name: 'Nairobi Transport Ltd', revenue: 'KES 245K' },
      { name: 'Mombasa Logistics Co', revenue: 'KES 187K' },
      { name: 'Kisumu Rentals Ltd', revenue: 'KES 156K' },
      { name: 'Nakuru Management', revenue: 'KES 134K' },
      { name: 'Eldoret Properties', revenue: 'KES 98K' }
    ]
  };

  useEffect(() => {
    fetchDashboardData();
    fetchModerators();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/management/dashboard`, {
        params: { period: timeRange },
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });
      
      if (response.data?.success && response.data?.data) {
        setData(response.data.data);
      } else {
        setData(mockData);
      }
    } catch (error) {
      console.log('Using mock data:', error.message);
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const fetchModerators = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/security/user-roles?limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });
      if (response.data?.data) {
        setModerators(response.data.data);
      } else {
        setModerators(mockData.moderators);
      }
    } catch (error) {
      setModerators(mockData.moderators);
    }
  };

  const displayData = data || mockData;
  const stats = displayData.stats || mockData.stats;
  const revenue = displayData.revenue || mockData.revenue;
  const companies = displayData.companies || mockData.companies;
  const displayModerators = moderators.length > 0 ? moderators : mockData.moderators;
  const displayDrivers = displayData.drivers || mockData.drivers;
  const displayBookings = displayData.bookings || mockData.bookings;

  const colorMap = { blue: 'from-blue-500 to-blue-600', purple: 'from-purple-500 to-purple-600', green: 'from-green-500 to-green-600', orange: 'from-orange-500 to-orange-600' };

  const getStatusColor = (status) => {
    const colors = {
      active: 'text-green-600',
      inactive: 'text-red-600',
      completed: 'text-green-600',
      in_progress: 'text-blue-600',
      pending: 'text-yellow-600',
      accepted: 'text-blue-600'
    };
    return colors[status] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Dashboard</h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>System-wide analytics and management</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className={`px-4 py-2 rounded-lg border font-semibold ${isDarkMode ? 'border-slate-700 bg-slate-800 text-white' : 'border-purple-200 bg-white text-slate-900'}`}>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`rounded-2xl shadow-xl p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/80 border-purple-200/50'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${colorMap[stat.color]} rounded-lg shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                  <ArrowUpRight className="w-4 h-4" />
                  {stat.change}
                </div>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
              <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`lg:col-span-2 rounded-2xl shadow-xl p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/80 border-purple-200/50'}`}>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Revenue Trend</h2>
          </div>
          <div className="space-y-4">
            {revenue.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.month}</span>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>KES {(1.8 + idx * 0.15).toFixed(2)}M</span>
                </div>
                <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full" style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl shadow-xl p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/80 border-purple-200/50'}`}>
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Moderators</h2>
          </div>
          <div className="space-y-3">
            {displayModerators.slice(0, 4).map((mod, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{mod.name}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{mod.email}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {mod.status === 'active' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`rounded-2xl shadow-xl p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/80 border-purple-200/50'}`}>
          <div className="flex items-center gap-2 mb-6">
            <Truck className="w-5 h-5 text-orange-600" />
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Active Drivers</h2>
          </div>
          <div className="space-y-3">
            {displayDrivers.map((driver, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{driver.name}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{driver.email}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{driver.trips} trips</p>
                    <span className={`text-xs font-semibold ${getStatusColor(driver.status)}`}>{driver.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl shadow-xl p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/80 border-purple-200/50'}`}>
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Bookings</h2>
          </div>
          <div className="space-y-3">
            {displayBookings.slice(0, 5).map((booking, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{booking.passenger_name}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{booking.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">KES {booking.fare}</p>
                    <span className={`text-xs font-semibold ${getStatusColor(booking.status)}`}>{booking.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`rounded-2xl shadow-xl p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/80 border-purple-200/50'}`}>
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-blue-600" />
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Top Companies</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {companies.map((company, idx) => (
            <div key={idx} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{company.name}</p>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">{company.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
