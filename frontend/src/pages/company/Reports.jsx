import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Eye,
  Printer,
  Share2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Users,
  DollarSign,
  Building,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ReportChart from '../../../components/charts/ReportChart';
import DateRangePicker from '../../../components/common/DateRangePicker';

const Reports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateRange: 'last30days'
  });
  const [selectedReports, setSelectedReports] = useState([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState('financial');
  const [customDateRange, setCustomDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  });

  const reportTypes = [
    { id: 'financial', label: 'Financial Reports', icon: DollarSign, color: 'blue' },
    { id: 'occupancy', label: 'Occupancy Reports', icon: Building, color: 'green' },
    { id: 'maintenance', label: 'Maintenance Reports', icon: Activity, color: 'yellow' },
    { id: 'tenant', label: 'Tenant Reports', icon: Users, color: 'purple' },
    { id: 'compliance', label: 'Compliance Reports', icon: CheckCircle, color: 'red' },
    { id: 'portfolio', label: 'Portfolio Reports', icon: BarChart3, color: 'indigo' },
  ];

  const statusOptions = [
    { id: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { id: 'generating', label: 'Generating', color: 'bg-blue-100 text-blue-800' },
    { id: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
    { id: 'scheduled', label: 'Scheduled', color: 'bg-yellow-100 text-yellow-800' },
  ];

  const dateRangeOptions = [
    { id: 'last7days', label: 'Last 7 days' },
    { id: 'last30days', label: 'Last 30 days' },
    { id: 'last90days', label: 'Last 90 days' },
    { id: 'this_month', label: 'This month' },
    { id: 'last_month', label: 'Last month' },
    { id: 'this_quarter', label: 'This quarter' },
    { id: 'last_quarter', label: 'Last quarter' },
    { id: 'this_year', label: 'This year' },
    { id: 'last_year', label: 'Last year' },
    { id: 'custom', label: 'Custom range' },
  ];

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, filters]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error('Failed to load reports:', error);
      setReports(generateSampleReports());
    } finally {
      setLoading(false);
    }
  };

  const generateSampleReports = () => {
    const reports = [];
    const reportNames = [
      'Q4 2023 Financial Summary',
      'Monthly Occupancy Analysis',
      'Maintenance Cost Report',
      'Tenant Satisfaction Survey Results',
      'Portfolio Performance Review',
      'Rent Collection Report',
      'Property Valuation Update',
      'Compliance Audit Results',
      'Expense Breakdown Analysis',
      'Revenue Forecast Q1 2024'
    ];
    
    const authors = ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emily Davis'];
    
    for (let i = 0; i < 10; i++) {
      const type = reportTypes[Math.floor(Math.random() * reportTypes.length)];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      const dateRange = dateRangeOptions[Math.floor(Math.random() * dateRangeOptions.length)];
      const size = Math.floor(Math.random() * 5000) + 1000;
      const pages = Math.floor(Math.random() * 50) + 10;
      
      reports.push({
        id: `report-${i + 1}`,
        name: reportNames[i],
        type: type.id,
        status: status.id,
        dateRange: dateRange.id,
        generatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        generatedBy: authors[Math.floor(Math.random() * authors.length)],
        size,
        pages,
        downloadCount: Math.floor(Math.random() * 50),
        scheduled: Math.random() > 0.7,
        scheduledTime: Math.random() > 0.7 ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null,
        
        // Summary data
        summary: {
          totalProperties: Math.floor(Math.random() * 100) + 20,
          totalRevenue: Math.floor(Math.random() * 1000000) + 500000,
          totalExpenses: Math.floor(Math.random() * 500000) + 200000,
          occupancyRate: 70 + Math.random() * 25,
          avgRent: Math.floor(Math.random() * 3000) + 1000,
          collectionRate: 85 + Math.random() * 12,
        },
        
        // Key metrics
        metrics: [
          { label: 'Revenue Growth', value: `${(Math.random() * 20 - 5).toFixed(1)}%`, trend: Math.random() > 0.5 ? 'up' : 'down' },
          { label: 'Occupancy Rate', value: `${(70 + Math.random() * 25).toFixed(1)}%`, trend: Math.random() > 0.5 ? 'up' : 'down' },
          { label: 'NOI', value: `$${Math.floor(Math.random() * 500000) + 200000}`, trend: Math.random() > 0.5 ? 'up' : 'down' },
          { label: 'Cap Rate', value: `${(5 + Math.random() * 5).toFixed(1)}%`, trend: Math.random() > 0.5 ? 'up' : 'down' },
        ],
        
        // Charts data
        chartData: Array.from({ length: 12 }, (_, j) => ({
          month: j + 1,
          revenue: Math.floor(Math.random() * 100000) + 50000,
          expenses: Math.floor(Math.random() * 60000) + 30000,
          occupancy: 70 + Math.random() * 25,
        })),
      });
    }
    
    return reports;
  };

  const filterReports = () => {
    let filtered = [...reports];

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(report => report.type === filters.type);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(report => report.status === filters.status);
    }

    if (filters.dateRange !== 'all') {
      filtered = filtered.filter(report => report.dateRange === filters.dateRange);
    }

    setFilteredReports(filtered);
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const reportData = {
        type: reportType,
        dateRange: filters.dateRange === 'custom' ? customDateRange : filters.dateRange,
        format: 'pdf',
        includeCharts: true,
        detailed: true,
      };
      
      const result = await generateReport(reportData);
      if (result) {
        loadReports();
        setShowGenerateModal(false);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleExportReport = async (reportId, format = 'pdf') => {
    try {
      const report = reports.find(r => r.id === reportId);
      if (report) {
        await exportReport(report, format);
      }
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  const handleSelectReport = (reportId) => {
    if (selectedReports.includes(reportId)) {
      setSelectedReports(selectedReports.filter(id => id !== reportId));
    } else {
      setSelectedReports([...selectedReports, reportId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredReports.map(report => report.id));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'generating':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
              <p className="mt-2 text-gray-600">
                Generate, view, and manage business reports
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <button
                onClick={() => setShowGenerateModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  {reportTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  {statusOptions.map(status => (
                    <option key={status.id} value={status.id}>{status.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {dateRangeOptions.map(range => (
                    <option key={range.id} value={range.id}>{range.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {filters.dateRange === 'custom' && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Date Range
                </label>
                <DateRangePicker
                  startDate={customDateRange.start}
                  endDate={customDateRange.end}
                  onChange={setCustomDateRange}
                />
              </div>
            )}
            
            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setFilters({ type: 'all', status: 'all', dateRange: 'last30days' })}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
              >
                Reset Filters
              </button>
              <button
                onClick={filterReports}
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { 
              label: 'Total Reports', 
              value: reports.length,
              icon: FileText,
              color: 'blue'
            },
            { 
              label: 'Completed', 
              value: reports.filter(r => r.status === 'completed').length,
              icon: CheckCircle,
              color: 'green'
            },
            { 
              label: 'Scheduled', 
              value: reports.filter(r => r.scheduled).length,
              icon: Calendar,
              color: 'yellow'
            },
            { 
              label: 'Avg. Size', 
              value: formatFileSize(reports.reduce((sum, r) => sum + r.size, 0) / reports.length),
              icon: TrendingUp,
              color: 'purple'
            },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-${stat.color}-100 mr-3`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Actions */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Filter className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {selectedReports.length === filteredReports.length ? 'Deselect All' : 'Select All'}
              </button>
              
              {selectedReports.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {/* Bulk download */}}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download ({selectedReports.length})
                  </button>
                  <button
                    onClick={() => {/* Bulk delete */}}
                    className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Delete ({selectedReports.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const TypeIcon = reportTypes.find(t => t.id === report.type)?.icon || FileText;
            const statusConfig = statusOptions.find(s => s.id === report.status);
            
            return (
              <div key={report.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={() => handleSelectReport(report.id)}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      
                      <div className={`p-3 rounded-lg bg-${reportTypes.find(t => t.id === report.type)?.color || 'gray'}-100`}>
                        <TypeIcon className={`w-6 h-6 text-${reportTypes.find(t => t.id === report.type)?.color || 'gray'}-600`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig?.color || 'bg-gray-100 text-gray-800'}`}>
                                {getStatusIcon(report.status)}
                                <span className="ml-1">{statusConfig?.label || report.status}</span>
                              </span>
                              <span className="text-sm text-gray-600">
                                {dateRangeOptions.find(r => r.id === report.dateRange)?.label}
                              </span>
                              <span className="text-sm text-gray-600">
                                Generated by {report.generatedBy}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {new Date(report.generatedAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatFileSize(report.size)} • {report.pages} pages
                            </p>
                          </div>
                        </div>
                        
                        {/* Report Preview */}
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                          {report.metrics.map((metric, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-600">{metric.label}</p>
                              <div className="flex items-center mt-1">
                                <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                                {metric.trend === 'up' ? (
                                  <TrendingUp className="w-4 h-4 text-green-500 ml-2" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-500 ml-2" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="flex items-center space-x-3 mt-4">
                          <button
                            onClick={() => handleExportReport(report.id, 'pdf')}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download PDF
                          </button>
                          <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </button>
                          <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                            <Printer className="w-4 h-4 mr-1" />
                            Print
                          </button>
                          <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </button>
                          {report.scheduled && report.scheduledTime && (
                            <button className="flex items-center text-sm text-yellow-600 hover:text-yellow-800">
                              <Calendar className="w-4 h-4 mr-1" />
                              Scheduled for {new Date(report.scheduledTime).toLocaleDateString()}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filters.type !== 'all' || filters.status !== 'all'
                ? 'Try changing your filters or search term'
                : 'Get started by generating your first report'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowGenerateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileText className="h-5 w-5 mr-2" />
                Generate Report
              </button>
            </div>
          </div>
        )}

        {/* Generate Report Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Generate New Report</h3>
                  <button
                    onClick={() => setShowGenerateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    &times;
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Type *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {reportTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setReportType(type.id)}
                          className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg ${
                            reportType === type.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-200'
                          }`}
                        >
                          <type.icon className={`w-8 h-8 text-${type.color}-600 mb-2`} />
                          <span className="text-sm font-medium text-gray-900">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range *
                    </label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {dateRangeOptions.map(range => (
                        <option key={range.id} value={range.id}>{range.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {filters.dateRange === 'custom' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Date Range
                      </label>
                      <DateRangePicker
                        startDate={customDateRange.start}
                        endDate={customDateRange.end}
                        onChange={setCustomDateRange}
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Format
                    </label>
                    <div className="flex space-x-4">
                      {['pdf', 'excel', 'csv'].map(format => (
                        <label key={format} className="flex items-center">
                          <input
                            type="radio"
                            name="format"
                            value={format}
                            defaultChecked={format === 'pdf'}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {format.toUpperCase()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Include charts and graphs
                      </span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Send report via email when complete
                      </span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Schedule recurring report
                      </span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowGenerateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerateReport}
                    disabled={generating}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin mr-2 inline" />
                        Generating...
                      </>
                    ) : (
                      'Generate Report'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;