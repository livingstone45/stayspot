import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, Users, CheckCircle, XCircle, Clock, BarChart3, PieChart } from 'lucide-react';
import Button from '../../components/common/UI/Button';
import Alert from '../../components/common/UI/Alert';
import Loader from '../../components/common/UI/Loader';
import { useTheme } from '../../contexts/ThemeContext';

const VerificationReports = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    tenants: { total: 0, pending: 0, verified: 0, rejected: 0, underReview: 0 },
    landlords: { total: 0, pending: 0, verified: 0, rejected: 0, underReview: 0 },
    managers: { total: 0, pending: 0, verified: 0, rejected: 0, underReview: 0 }
  });
  const [dateRange, setDateRange] = useState('month');

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [tenants, landlords, managers] = await Promise.all([
        fetch(`/api/management/tenants/verification/stats`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
        fetch(`/api/management/landlords/verification/stats`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
        fetch(`/api/management/managers/verification/stats`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json())
      ]);

      setStats({
        tenants: tenants.data || {},
        landlords: landlords.data || {},
        managers: managers.data || {}
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/management/${type}/verification/export?format=csv`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-verification-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Export failed');
    }
  };

  const getVerificationRate = (data) => {
    if (!data.total) return 0;
    return Math.round((data.verified / data.total) * 100);
  };

  const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className={`${cardClass} p-4 rounded-lg shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${textSecondaryClass}`}>{label}</p>
          <p className={`text-2xl font-bold ${textClass}`}>{value}</p>
        </div>
        <Icon className={`w-8 h-8 text-${color}-500 opacity-50`} />
      </div>
    </div>
  );

  const TypeSection = ({ title, data, type }) => (
    <div className={`${cardClass} rounded-lg shadow p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold ${textClass}`}>{title}</h3>
        <Button variant="secondary" onClick={() => handleExport(type)} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total" value={data.total} icon={Users} color="blue" />
        <StatCard label="Verified" value={data.verified} icon={CheckCircle} color="green" />
        <StatCard label="Pending" value={data.pending} icon={Clock} color="yellow" />
        <StatCard label="Rejected" value={data.rejected} icon={XCircle} color="red" />
        <StatCard label="Under Review" value={data.underReview} icon={TrendingUp} color="purple" />
      </div>

      <div className={`border-t ${borderClass} pt-6`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className={`text-sm font-medium ${textSecondaryClass} mb-4`}>Verification Rate</p>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" 
                    style={{ width: `${getVerificationRate(data)}%` }}
                  ></div>
                </div>
              </div>
              <p className={`text-2xl font-bold ${textClass}`}>{getVerificationRate(data)}%</p>
            </div>
          </div>

          <div>
            <p className={`text-sm font-medium ${textSecondaryClass} mb-4`}>Status Breakdown</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={textSecondaryClass}>Verified</span>
                <span className={`font-medium ${textClass}`}>{data.verified}/{data.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={textSecondaryClass}>Pending</span>
                <span className={`font-medium ${textClass}`}>{data.pending}/{data.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={textSecondaryClass}>Rejected</span>
                <span className={`font-medium ${textClass}`}>{data.rejected}/{data.total}</span>
              </div>
            </div>
          </div>
        </div>
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

  const totalStats = {
    total: stats.tenants.total + stats.landlords.total + stats.managers.total,
    verified: (stats.tenants.verified || 0) + (stats.landlords.verified || 0) + (stats.managers.verified || 0),
    pending: (stats.tenants.pending || 0) + (stats.landlords.pending || 0) + (stats.managers.pending || 0),
    rejected: (stats.tenants.rejected || 0) + (stats.landlords.rejected || 0) + (stats.managers.rejected || 0),
    underReview: (stats.tenants.underReview || 0) + (stats.landlords.underReview || 0) + (stats.managers.underReview || 0)
  };

  return (
    <div className={`min-h-screen ${bgClass} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${textClass}`}>Verification Reports</h1>
            <p className={`${textSecondaryClass}`}>Analytics and statistics for all verifications</p>
          </div>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className={`px-4 py-2 rounded-lg border font-semibold ${borderClass} ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <StatCard label="Total Verifications" value={totalStats.total} icon={Users} color="blue" />
          <StatCard label="Verified" value={totalStats.verified} icon={CheckCircle} color="green" />
          <StatCard label="Pending" value={totalStats.pending} icon={Clock} color="yellow" />
          <StatCard label="Rejected" value={totalStats.rejected} icon={XCircle} color="red" />
          <StatCard label="Under Review" value={totalStats.underReview} icon={TrendingUp} color="purple" />
        </div>

        {/* Overall Summary */}
        <div className={`${cardClass} rounded-lg shadow p-6 mb-8`}>
          <h2 className={`text-xl font-bold ${textClass} mb-6`}>Overall Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className={`text-sm font-medium ${textSecondaryClass} mb-4`}>Overall Verification Rate</p>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <div className={`w-full h-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" 
                      style={{ width: `${getVerificationRate(totalStats)}%` }}
                    ></div>
                  </div>
                </div>
                <p className={`text-3xl font-bold ${textClass}`}>{getVerificationRate(totalStats)}%</p>
              </div>
            </div>

            <div>
              <p className={`text-sm font-medium ${textSecondaryClass} mb-4`}>Distribution by Type</p>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={textSecondaryClass}>Tenants</span>
                  <span className={`font-medium ${textClass}`}>{stats.tenants.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className={textSecondaryClass}>Landlords</span>
                  <span className={`font-medium ${textClass}`}>{stats.landlords.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className={textSecondaryClass}>Managers</span>
                  <span className={`font-medium ${textClass}`}>{stats.managers.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Type-specific Reports */}
        <div className="space-y-8">
          <TypeSection title="Tenant Verifications" data={stats.tenants} type="tenants" />
          <TypeSection title="Landlord Verifications" data={stats.landlords} type="landlords" />
          <TypeSection title="Manager Verifications" data={stats.managers} type="managers" />
        </div>
      </div>
    </div>
  );
};

export default VerificationReports;
