import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Alert from '../../components/common/UI/Alert';
import Loader from '../../components/common/UI/Loader';
import { useTheme } from '../../contexts/ThemeContext';

const SupportReports = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalTickets: 0,
    avgResolutionTime: 0,
    satisfactionRate: 0,
    activeAgents: 0,
    openTickets: 0,
    resolvedTickets: 0
  });
  const [dateRange, setDateRange] = useState('month');

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/support/reports?period=${dateRange}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      setStats(data.data || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className={`${cardClass} p-6 rounded-lg shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${textSecondaryClass}`}>{label}</p>
          <p className={`text-3xl font-bold ${textClass} mt-2`}>{value}</p>
        </div>
        <Icon className={`w-12 h-12 text-${color}-500 opacity-50`} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen ${bgClass} p-6`}>
        <div className="max-w-7xl mx-auto">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${textClass}`}>Support Reports</h1>
            <p className={`${textSecondaryClass}`}>Analytics and performance metrics</p>
          </div>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className={`px-4 py-2 rounded-lg border font-semibold ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'}`}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Tickets" value={stats.totalTickets} icon={BarChart3} color="blue" />
          <StatCard label="Avg Resolution Time" value={`${stats.avgResolutionTime}h`} icon={Clock} color="orange" />
          <StatCard label="Satisfaction Rate" value={`${stats.satisfactionRate}%`} icon={TrendingUp} color="green" />
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Active Agents" value={stats.activeAgents} icon={Users} color="purple" />
          <StatCard label="Open Tickets" value={stats.openTickets} icon={AlertCircle} color="red" />
          <StatCard label="Resolved Tickets" value={stats.resolvedTickets} icon={CheckCircle} color="green" />
        </div>

        {/* Performance Chart */}
        <div className={`${cardClass} rounded-lg shadow p-6`}>
          <h2 className={`text-xl font-bold ${textClass} mb-6`}>Performance Overview</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className={textSecondaryClass}>Ticket Resolution Rate</span>
                <span className={`font-bold ${textClass}`}>{stats.satisfactionRate}%</span>
              </div>
              <div className={`w-full h-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" 
                  style={{ width: `${stats.satisfactionRate}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className={textSecondaryClass}>Agent Utilization</span>
                <span className={`font-bold ${textClass}`}>75%</span>
              </div>
              <div className={`w-full h-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" 
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className={textSecondaryClass}>First Response Time</span>
                <span className={`font-bold ${textClass}`}>2.5 hours</span>
              </div>
              <div className={`w-full h-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full" 
                  style={{ width: '60%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportReports;
