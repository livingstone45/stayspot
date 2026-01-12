import React, { useState } from 'react';
import { Download, FileText, Calendar, Clock, CheckCircle, AlertCircle, Settings } from 'lucide-react';

const ExportReports = () => {
  const [selectedReports, setSelectedReports] = useState([]);
  const [format, setFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState('month');
  const [includeCharts, setIncludeCharts] = useState(true);

  const reports = [
    { id: 'financial', name: 'Financial Report', description: 'Income statement, balance sheet, and cash flow analysis', icon: '💰' },
    { id: 'occupancy', name: 'Occupancy Report', description: 'Occupancy rates, vacancy analysis, and lease expirations', icon: '🏠' },
    { id: 'maintenance', name: 'Maintenance Report', description: 'Work orders, vendor performance, and maintenance costs', icon: '🔧' },
    { id: 'performance', name: 'Performance Report', description: 'KPIs, efficiency metrics, and property comparisons', icon: '📊' },
    { id: 'revenue', name: 'Revenue Report', description: 'Revenue trends, payment methods, and collection rates', icon: '💵' },
    { id: 'tenant', name: 'Tenant Report', description: 'Tenant information, lease details, and contact information', icon: '👥' }
  ];

  const exportHistory = [
    { id: 1, name: 'Financial Report - June 2024', format: 'PDF', date: '2024-06-20', size: '2.4 MB', status: 'completed' },
    { id: 2, name: 'Occupancy Report - June 2024', format: 'Excel', date: '2024-06-18', size: '1.2 MB', status: 'completed' },
    { id: 3, name: 'Maintenance Report - June 2024', format: 'PDF', date: '2024-06-15', size: '3.1 MB', status: 'completed' },
    { id: 4, name: 'Performance Report - Q2 2024', format: 'Excel', date: '2024-06-10', size: '1.8 MB', status: 'completed' },
    { id: 5, name: 'Revenue Report - June 2024', format: 'PDF', date: '2024-06-05', size: '2.7 MB', status: 'completed' }
  ];

  const toggleReport = (id) => {
    setSelectedReports(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    if (selectedReports.length === 0) {
      alert('Please select at least one report');
      return;
    }
    alert(`Exporting ${selectedReports.length} report(s) as ${format.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Export Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Generate and download comprehensive reports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Select Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => toggleReport(report.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedReports.includes(report.id)
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(report.id)}
                      onChange={() => {}}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{report.icon}</span>
                        <p className="font-medium text-gray-900 dark:text-white">{report.name}</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{report.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Export Options</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Format</label>
                <div className="space-y-2">
                  {['pdf', 'excel', 'csv'].map((fmt) => (
                    <label key={fmt} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="format"
                        value={fmt}
                        checked={format === fmt}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-4 h-4 text-orange-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{fmt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900 focus:outline-none"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCharts}
                    onChange={(e) => setIncludeCharts(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Include Charts & Graphs</span>
                </label>
              </div>

              <button
                onClick={handleExport}
                className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                Export Reports
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Export History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Report Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Format</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Size</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {exportHistory.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{item.format}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{item.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{item.size}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 flex items-center gap-1 w-fit">
                        <CheckCircle className="h-3 w-3" />
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium text-sm flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Scheduled Exports
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-gray-900 dark:text-white">Monthly Financial Report</h3>
                <span className="text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">Active</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Every 1st of the month at 9:00 AM</p>
              <button className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium">Edit Schedule</button>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-gray-900 dark:text-white">Weekly Occupancy Report</h3>
                <span className="text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">Active</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Every Monday at 8:00 AM</p>
              <button className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium">Edit Schedule</button>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-gray-900 dark:text-white">Quarterly Performance Report</h3>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">Inactive</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Every 1st of quarter at 10:00 AM</p>
              <button className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium">Enable Schedule</button>
            </div>
          </div>

          <button className="mt-6 px-4 py-2 border border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors font-medium flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Create New Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportReports;
