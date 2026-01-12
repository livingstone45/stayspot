import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Zap, BarChart3, Calendar, Download, Filter, ArrowUpDown } from 'lucide-react';
import Alert from '../../../components/common/UI/Alert';
import { useTheme } from '../../../contexts/ThemeContext';

const Earnings = () => {
  const { isDarkMode } = useTheme();
  const [earnings, setEarnings] = useState([]);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('month');
  const [sortBy, setSortBy] = useState('earnings');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchDriver, setSearchDriver] = useState('');

  useEffect(() => {
    fetchEarnings();
    fetchStats();
    fetchChartData();
  }, [period, sortBy, sortOrder, searchDriver]);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ period, limit: 50 });
      
      const response = await fetch(`/api/transportation/earnings?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch earnings');
      const data = await response.json();
      setEarnings(data.data || []);
    } catch (err) {
      console.error('Earnings fetch error:', err);
      setEarnings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ period });
      
      const response = await fetch(`/api/transportation/earnings/stats?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data.data || {
        total_earnings: 0,
        total_trips: 0,
        avg_fare: 0,
        max_fare: 0
      });
    } catch (err) {
      console.error('Stats fetch error:', err);
      setStats({
        total_earnings: 0,
        total_trips: 0,
        avg_fare: 0,
        max_fare: 0
      });
    }
  };

  const fetchChartData = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ period });
      
      const response = await fetch(`/api/transportation/earnings/chart?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch chart data');
      const data = await response.json();
      setChartData(data.data || []);
    } catch (err) {
      console.error('Chart data fetch error:', err);
      setChartData([]);
    }
  };

  const filteredAndSortedEarnings = earnings
    .filter(e => e.name?.toLowerCase().includes(searchDriver.toLowerCase()))
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === 'earnings') {
        aVal = a.total_earnings || 0;
        bVal = b.total_earnings || 0;
      }
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Earnings</h1>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Track driver earnings and revenue</p>
          </div>
          <div className="flex gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-white text-gray-900 border-gray-200'} border`}
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold hover:from-orange-700 hover:to-orange-800 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-6 rounded-xl shadow border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Total Earnings</p>
                  <p className="text-3xl font-bold text-green-600">KES {(stats.total_earnings || 0).toLocaleString()}</p>
                </div>
                <DollarSign className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-6 rounded-xl shadow border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Total Trips</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.total_trips || 0}</p>
                </div>
                <Zap className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-6 rounded-xl shadow border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Avg Fare</p>
                  <p className="text-3xl font-bold text-purple-600">KES {(stats.avg_fare || 0).toLocaleString()}</p>
                </div>
                <BarChart3 className="w-12 h-12 text-purple-500 opacity-20" />
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-6 rounded-xl shadow border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Max Fare</p>
                  <p className="text-3xl font-bold text-orange-600">KES {(stats.max_fare || 0).toLocaleString()}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-orange-500 opacity-20" />
              </div>
            </div>
          </div>
        )}

        {/* Chart */}
        {chartData.length > 0 && (
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-6 rounded-xl shadow border mb-8`}>
            <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Earnings Trend</h2>
            
            <div className="h-64 flex items-end justify-around gap-2">
              {chartData.map((data, idx) => {
                const maxEarnings = Math.max(...chartData.map(d => d.earnings || 0));
                const height = maxEarnings > 0 ? (data.earnings / maxEarnings) * 100 : 0;
                
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex items-end justify-center h-48">
                      <div
                        className="w-full bg-gradient-to-t from-orange-600 to-orange-500 rounded-t-lg transition-all hover:from-orange-700 hover:to-orange-600"
                        style={{ height: `${height}%` }}
                        title={`KES ${data.earnings || 0}`}
                      />
                    </div>
                    <p className={`text-xs mt-2 text-center ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      {data.period?.slice(0, 3) || 'N/A'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Earnings Table */}
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} rounded-xl shadow border overflow-hidden`}>
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Top Earners</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search driver..."
                  value={searchDriver}
                  onChange={(e) => setSearchDriver(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900'}`}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            </div>
          ) : earnings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Driver</th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} cursor-pointer hover:text-orange-500`} onClick={() => handleSort('trips')}>
                      <div className="flex items-center gap-2">
                        Trips {sortBy === 'trips' && <ArrowUpDown className="w-4 h-4" />}
                      </div>
                    </th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} cursor-pointer hover:text-orange-500`} onClick={() => handleSort('earnings')}>
                      <div className="flex items-center gap-2">
                        Earnings {sortBy === 'earnings' && <ArrowUpDown className="w-4 h-4" />}
                      </div>
                    </th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} cursor-pointer hover:text-orange-500`} onClick={() => handleSort('avg_rating')}>
                      <div className="flex items-center gap-2">
                        Rating {sortBy === 'avg_rating' && <ArrowUpDown className="w-4 h-4" />}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
                  {filteredAndSortedEarnings.map((driver, idx) => (
                    <tr key={driver.id} className={isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}>
                      <td className={`px-6 py-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-600 to-orange-700 flex items-center justify-center text-white font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-medium">{driver.name || 'N/A'}</p>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{driver.phone || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                          {driver.trips || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-lg font-bold text-green-600">KES {(driver.total_earnings || 0).toLocaleString()}</p>
                      </td>
                      <td className={`px-6 py-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                        <div className="flex items-center gap-1">
                          <span>⭐</span>
                          {(driver.avg_rating || 0).toFixed(1)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>No earnings data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Earnings;
