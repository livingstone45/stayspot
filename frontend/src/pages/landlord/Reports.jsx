import React, { useState } from 'react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { Download, Eye, FileText, TrendingUp, BarChart3, PieChart, Calendar } from 'lucide-react';

const Reports = () => {
  const { isDark } = useThemeMode();
  const [reportType, setReportType] = useState('occupancy');
  const [dateRange, setDateRange] = useState('month');
  const [generating, setGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [reports, setReports] = useState([
    { id: 1, title: 'Monthly Financial Report', type: 'financial', date: '2024-01-15', size: '2.4 MB', icon: '💰' },
    { id: 2, title: 'Occupancy Analysis', type: 'occupancy', date: '2024-01-10', size: '1.8 MB', icon: '📊' },
    { id: 3, title: 'Maintenance Summary', type: 'maintenance', date: '2024-01-05', size: '1.2 MB', icon: '🔧' },
    { id: 4, title: 'Tenant Performance', type: 'tenant', date: '2023-12-28', size: '3.1 MB', icon: '👥' }
  ]);

  const inputClasses = `px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500' : 'bg-white border-gray-300 focus:border-indigo-500'} focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold`;

  const handleGenerateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      const newReport = {
        type: reportType,
        range: dateRange,
        date: new Date().toLocaleDateString(),
        size: '2.4 MB'
      };
      setGeneratedReport(newReport);
      setReports([{ id: reports.length + 1, title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, type: reportType, date: new Date().toLocaleDateString(), size: '2.4 MB', icon: '📄' }, ...reports]);
      setGenerating(false);
    }, 1500);
  };

  const handleViewReport = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    alert(`Viewing Report: ${report.title}\n\nType: ${report.type}\nDate: ${report.date}\nSize: ${report.size}`);
  };

  const handleDownloadReport = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    alert(`Downloading: ${report.title}\n\nFile size: ${report.size}`);
  };

  const getReportColor = (type) => {
    switch(type) {
      case 'financial': return 'from-emerald-500 to-teal-500';
      case 'occupancy': return 'from-blue-500 to-cyan-500';
      case 'maintenance': return 'from-orange-500 to-amber-500';
      case 'tenant': return 'from-purple-500 to-pink-500';
      default: return 'from-indigo-500 to-purple-500';
    }
  };

  return (
    <div className={`${isDark ? 'bg-gray-950' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'} p-8 min-h-screen`}>
      <div className="mb-10">
        <h1 className={`${isDark ? 'text-white' : 'text-gray-900'} text-5xl font-black mb-2`}>Reports</h1>
        <p className={`${isDark ? 'text-gray-500' : 'text-gray-600'} text-base`}>Generate and manage comprehensive business reports</p>
      </div>

      {/* Generate Report Card */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 mb-8 border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-black mb-6 flex items-center gap-3`}>
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl text-white">
            <FileText size={24} />
          </div>
          Generate New Report
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={`block ${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold mb-3`}>Report Type</label>
            <select 
              value={reportType} 
              onChange={(e) => setReportType(e.target.value)} 
              className={inputClasses}
            >
              <option value="occupancy">Occupancy Report</option>
              <option value="financial">Financial Report</option>
              <option value="maintenance">Maintenance Report</option>
              <option value="tenant">Tenant Report</option>
            </select>
          </div>
          <div>
            <label className={`block ${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold mb-3`}>Date Range</label>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)} 
              className={inputClasses}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleGenerateReport}
              disabled={generating}
              className={`w-full px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${generating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'} bg-gradient-to-r from-indigo-600 to-purple-600 text-white`}
            >
              <TrendingUp size={20} /> {generating ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {generatedReport && (
        <div className={`${isDark ? 'bg-green-900 bg-opacity-30 border-green-700' : 'bg-green-50 border-green-300'} rounded-2xl p-6 mb-8 border-2`}>
          <p className="text-green-600 font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">✓</span> Report Generated Successfully
          </p>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold text-lg`}>{generatedReport.type.charAt(0).toUpperCase() + generatedReport.type.slice(1)} Report</p>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>{generatedReport.date} • {generatedReport.size}</p>
            <div className="mt-4 flex gap-3">
              <button onClick={() => handleViewReport(reports[0].id)} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition font-bold flex items-center gap-2 text-sm">
                <Eye size={16} /> View
              </button>
              <button onClick={() => handleDownloadReport(reports[0].id)} className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition font-bold flex items-center gap-2 text-sm">
                <Download size={16} /> Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Reports */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-black mb-6`}>Recent Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <div key={report.id} className={`p-6 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-150'} transition-all`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${getReportColor(report.type)} text-white`}>
                  <BarChart3 size={24} />
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-lg ${report.type === 'financial' ? 'bg-emerald-100 text-emerald-700' : report.type === 'occupancy' ? 'bg-blue-100 text-blue-700' : report.type === 'maintenance' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                  {report.type.toUpperCase()}
                </span>
              </div>
              <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold text-lg mb-1`}>{report.title}</p>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4 flex items-center gap-2`}>
                <Calendar size={14} /> {report.date} • {report.size}
              </p>
              <div className="flex gap-2">
                <button onClick={() => handleViewReport(report.id)} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
                  <Eye size={16} /> View
                </button>
                <button onClick={() => handleDownloadReport(report.id)} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${isDark ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                  <Download size={16} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
