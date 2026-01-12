import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  User,
  Building,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  Shield,
  Globe,
  Database
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SystemAdminAuditLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    actionType: 'all',
    userId: '',
    dateRange: 'today',
    severity: 'all'
  });
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const itemsPerPage = 15;

  const actionTypes = [
    { value: 'all', label: 'All Actions' },
    { value: 'login', label: 'Login', color: 'blue', icon: Shield },
    { value: 'logout', label: 'Logout', color: 'gray', icon: Shield },
    { value: 'create', label: 'Create', color: 'green', icon: CheckCircle },
    { value: 'update', label: 'Update', color: 'yellow', icon: RefreshCw },
    { value: 'delete', label: 'Delete', color: 'red', icon: XCircle },
    { value: 'read', label: 'Read', color: 'blue', icon: Eye },
    { value: 'export', label: 'Export', color: 'purple', icon: Download },
    { value: 'import', label: 'Import', color: 'indigo', icon: Download },
    { value: 'system', label: 'System', color: 'orange', icon: Database },
    { value: 'security', label: 'Security', color: 'red', icon: Shield },
    { value: 'api', label: 'API', color: 'cyan', icon: Globe },
  ];

  const severityLevels = [
    { value: 'info', label: 'Info', color: 'bg-blue-100 text-blue-800' },
    { value: 'success', label: 'Success', color: 'bg-green-100 text-green-800' },
    { value: 'warning', label: 'Warning', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'error', label: 'Error', color: 'bg-red-100 text-red-800' },
    { value: 'critical', label: 'Critical', color: 'bg-purple-100 text-purple-800' },
  ];

  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last 90 Days' },
    { value: 'year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' },
  ];

  useEffect(() => {
    loadLogs();
  }, [filters.dateRange]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await getAuditLogs(filters);
      setLogs(data);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      // Use sample data for demo
      setLogs(generateSampleLogs());
    } finally {
      setLoading(false);
    }
  };

  const generateSampleLogs = () => {
    const actions = ['login', 'logout', 'create', 'update', 'delete', 'read', 'export', 'system', 'security'];
    const severities = ['info', 'success', 'warning', 'error', 'critical'];
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'system_admin' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'company_admin' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'property_manager' },
      { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'landlord' },
      { id: 5, name: 'System', email: 'system@stayspot.com', role: 'system' },
    ];
    const entities = ['User', 'Property', 'Company', 'Role', 'Permission', 'Payment', 'Maintenance', 'Tenant', 'Lease'];
    
    const logs = [];
    for (let i = 0; i < 150; i++) {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      const entity = entities[Math.floor(Math.random() * entities.length)];
      const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      logs.push({
        id: `log-${i + 1}`,
        action,
        severity,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        entityType: entity,
        entityId: `ent-${Math.floor(Math.random() * 1000)}`,
        description: `${action.charAt(0).toUpperCase() + action.slice(1)} ${entity.toLowerCase()}`,
        details: {
          ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'New York, NY, USA',
          changes: action === 'update' ? {
            before: { status: 'pending' },
            after: { status: 'active' }
          } : null,
          metadata: {}
        },
        timestamp: timestamp.toISOString(),
        source: user.role === 'system' ? 'system' : 'user'
      });
    }
    
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const handleSelectLog = (logId) => {
    if (selectedLogs.includes(logId)) {
      setSelectedLogs(selectedLogs.filter(id => id !== logId));
    } else {
      setSelectedLogs([...selectedLogs, logId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedLogs.length === filteredLogs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(filteredLogs.map(log => log.id));
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = selectedLogs.length > 0 
        ? logs.filter(log => selectedLogs.includes(log.id))
        : logs;
      
      await exportAuditLogs(data);
    } catch (error) {
      console.error('Failed to export logs:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleClearLogs = async () => {
    if (window.confirm('Are you sure you want to clear all audit logs? This action cannot be undone.')) {
      setClearing(true);
      try {
        await clearAuditLogs();
        loadLogs();
        setSelectedLogs([]);
      } catch (error) {
        console.error('Failed to clear logs:', error);
      } finally {
        setClearing(false);
      }
    }
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = filters.actionType === 'all' || log.action === filters.actionType;
    const matchesSeverity = filters.severity === 'all' || log.severity === filters.severity;
    
    return matchesSearch && matchesAction && matchesSeverity;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const getActionIcon = (action) => {
    const actionType = actionTypes.find(a => a.value === action);
    if (actionType && actionType.icon) {
      const Icon = actionType.icon;
      return <Icon className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const getActionColor = (action) => {
    const actionType = actionTypes.find(a => a.value === action);
    return actionType ? actionType.color : 'gray';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
              <p className="mt-2 text-gray-600">
                Monitor and review system activities and user actions
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {exporting ? 'Exporting...' : 'Export'}
              </button>
              <button
                onClick={loadLogs}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Logs', value: logs.length, color: 'blue' },
            { label: 'Today', value: logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length, color: 'green' },
            { label: 'Errors', value: logs.filter(l => l.severity === 'error' || l.severity === 'critical').length, color: 'red' },
            { label: 'Active Users', value: new Set(logs.filter(l => l.action === 'login').map(l => l.userId)).size, color: 'purple' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search logs by user, action, or entity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filters.actionType}
                  onChange={(e) => setFilters({...filters, actionType: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {actionTypes.map(action => (
                    <option key={action.value} value={action.value}>{action.label}</option>
                  ))}
                </select>
                
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({...filters, severity: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Severity</option>
                  {severityLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
                
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {dateRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedLogs.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">
                    {selectedLogs.length} log{selectedLogs.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleExport}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
                  >
                    Export Selected
                  </button>
                  <button
                    onClick={() => setSelectedLogs([])}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLogs.length === paginatedLogs.length && paginatedLogs.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedLogs.includes(log.id)}
                        onChange={() => handleSelectLog(log.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 bg-${getActionColor(log.action)}-100`}>
                          <div className={`text-${getActionColor(log.action)}-600`}>
                            {getActionIcon(log.action)}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 capitalize">{log.action}</div>
                          <div className="text-xs text-gray-500">{log.source}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                          <div className="text-xs text-gray-500">{log.userEmail}</div>
                          <div className="text-xs text-gray-400">{log.userRole}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.entityType}</div>
                      <div className="text-xs text-gray-500">ID: {log.entityId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{log.description}</div>
                      {log.details?.ip && (
                        <div className="text-xs text-gray-500">IP: {log.details.ip}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        severityLevels.find(s => s.value === log.severity)?.color || 'bg-gray-100 text-gray-800'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(log)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredLogs.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredLogs.length}</span> logs
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clear All Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleClearLogs}
            disabled={clearing || logs.length === 0}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {clearing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Clearing...
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 mr-2" />
                Clear All Logs ({logs.length})
              </>
            )}
          </button>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Audit Log Details
                  </h3>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedLog(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Action Information</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-500">Action Type</span>
                          <div className="flex items-center mt-1">
                            <div className={`p-2 rounded-lg mr-3 bg-${getActionColor(selectedLog.action)}-100`}>
                              <div className={`text-${getActionColor(selectedLog.action)}-600`}>
                                {getActionIcon(selectedLog.action)}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 capitalize">{selectedLog.action}</div>
                              <div className="text-xs text-gray-500">{selectedLog.source}</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Description</span>
                          <p className="text-sm text-gray-900 mt-1">{selectedLog.description}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Severity</span>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              severityLevels.find(s => s.value === selectedLog.severity)?.color || 'bg-gray-100 text-gray-800'
                            }`}>
                              {selectedLog.severity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">User Information</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-500">User</span>
                          <div className="flex items-center mt-1">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{selectedLog.userName}</div>
                              <div className="text-xs text-gray-500">{selectedLog.userEmail}</div>
                              <div className="text-xs text-gray-400">{selectedLog.userRole}</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Timestamp</span>
                          <div className="flex items-center mt-1 text-sm text-gray-900">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {new Date(selectedLog.timestamp).toLocaleDateString()}
                            <Clock className="w-4 h-4 ml-4 mr-2 text-gray-400" />
                            {new Date(selectedLog.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Entity Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Entity Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-500">Entity Type</span>
                        <p className="text-sm text-gray-900 mt-1">{selectedLog.entityType}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Entity ID</span>
                        <p className="text-sm text-gray-900 mt-1 font-mono">{selectedLog.entityId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Technical Details</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-gray-500">IP Address</span>
                          <p className="text-sm text-gray-900 mt-1 font-mono">
                            {selectedLog.details?.ip || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Location</span>
                          <p className="text-sm text-gray-900 mt-1">
                            {selectedLog.details?.location || 'N/A'}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-xs text-gray-500">User Agent</span>
                          <p className="text-sm text-gray-900 mt-1 font-mono text-sm">
                            {selectedLog.details?.userAgent || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Changes */}
                  {selectedLog.details?.changes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Changes Made</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-xs font-medium text-gray-600 mb-2">Before</h5>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <pre className="text-xs text-red-800 overflow-x-auto">
                              {JSON.stringify(selectedLog.details.changes.before, null, 2)}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <h5 className="text-xs font-medium text-gray-600 mb-2">After</h5>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <pre className="text-xs text-green-800 overflow-x-auto">
                              {JSON.stringify(selectedLog.details.changes.after, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Raw Data */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Raw Log Data</h4>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <pre className="text-xs text-gray-100 overflow-x-auto">
                        {JSON.stringify(selectedLog, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedLog(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      // Export this single log
                      const blob = new Blob([JSON.stringify(selectedLog, null, 2)], { type: 'application/json' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `audit-log-${selectedLog.id}.json`;
                      a.click();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Export This Log
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

export default SystemAdminAuditLogs;