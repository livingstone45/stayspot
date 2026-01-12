import React, { useState, useEffect } from 'react';
import {
  Link, Key, Server, Clock, CheckCircle,
  AlertCircle, Plus, Trash2, Edit, Eye,
  Copy, RefreshCw, ChevronDown, Filter,
  Bell, ExternalLink, Settings, Zap
} from 'lucide-react';

const WebhookSettings = ({ 
  webhooks = [],
  onAddWebhook,
  onEditWebhook,
  onDeleteWebhook,
  onTestWebhook,
  onRegenerateSecret,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState('active');
  const [showSecret, setShowSecret] = useState({});
  const [testResults, setTestResults] = useState({});
  const [isTesting, setIsTesting] = useState(false);
  const [filters, setFilters] = useState({
    eventType: 'all',
    status: 'all'
  });

  const eventTypes = [
    { value: 'tenant.created', label: 'Tenant Created', description: 'When a new tenant is added' },
    { value: 'tenant.updated', label: 'Tenant Updated', description: 'When tenant information is updated' },
    { value: 'tenant.deleted', label: 'Tenant Deleted', description: 'When a tenant is removed' },
    { value: 'payment.received', label: 'Payment Received', description: 'When a payment is received' },
    { value: 'payment.failed', label: 'Payment Failed', description: 'When a payment fails' },
    { value: 'maintenance.created', label: 'Maintenance Created', description: 'When a maintenance request is created' },
    { value: 'maintenance.updated', label: 'Maintenance Updated', description: 'When maintenance status changes' },
    { value: 'maintenance.completed', label: 'Maintenance Completed', description: 'When maintenance is completed' },
    { value: 'property.created', label: 'Property Created', description: 'When a new property is added' },
    { value: 'property.updated', label: 'Property Updated', description: 'When property information is updated' },
    { value: 'lease.created', label: 'Lease Created', description: 'When a new lease is created' },
    { value: 'lease.expiring', label: 'Lease Expiring', description: 'When a lease is about to expire' },
    { value: 'inspection.scheduled', label: 'Inspection Scheduled', description: 'When an inspection is scheduled' },
    { value: 'inspection.completed', label: 'Inspection Completed', description: 'When an inspection is completed' }
  ];

  const getWebhookStatus = (webhook) => {
    if (!webhook.isActive) return { color: 'gray', text: 'Inactive', icon: AlertCircle };
    if (webhook.lastDelivery && webhook.lastDelivery.success) {
      return { color: 'green', text: 'Active', icon: CheckCircle };
    }
    if (webhook.lastDelivery && !webhook.lastDelivery.success) {
      return { color: 'red', text: 'Failing', icon: AlertCircle };
    }
    return { color: 'yellow', text: 'Pending', icon: Clock };
  };

  const handleTestWebhook = async (webhookId) => {
    setIsTesting(true);
    try {
      // Mock API test
      await new Promise(resolve => setTimeout(resolve, 1000));
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      setTestResults(prev => ({
        ...prev,
        [webhookId]: {
          success,
          message: success ? 'Webhook test successful' : 'Webhook test failed',
          timestamp: new Date().toISOString()
        }
      }));
      
      if (onTestWebhook) {
        onTestWebhook(webhookId, success);
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [webhookId]: {
          success: false,
          message: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  const filteredWebhooks = webhooks.filter(webhook => {
    if (activeTab === 'active') return webhook.isActive;
    if (activeTab === 'inactive') return !webhook.isActive;
    if (activeTab === 'failing') {
      const status = getWebhookStatus(webhook);
      return status.text === 'Failing';
    }
    
    // Apply additional filters
    if (filters.eventType !== 'all' && webhook.events.every(event => event !== filters.eventType)) {
      return false;
    }
    
    if (filters.status !== 'all') {
      const status = getWebhookStatus(webhook);
      if (filters.status === 'active' && status.text !== 'Active') return false;
      if (filters.status === 'failing' && status.text !== 'Failing') return false;
      if (filters.status === 'inactive' && status.text !== 'Inactive') return false;
    }
    
    return true;
  });

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Webhook Settings</h2>
          <p className="text-gray-600 mt-2">Configure webhooks for real-time notifications</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.open('/api/webhooks', '_blank')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Documentation</span>
          </button>
          <button
            onClick={onAddWebhook}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Webhook</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {['all', 'active', 'inactive', 'failing'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'failing' && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                  {webhooks.filter(w => getWebhookStatus(w).text === 'Failing').length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Event Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
            <div className="relative">
              <select
                value={filters.eventType}
                onChange={(e) => setFilters(prev => ({ ...prev, eventType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Event Types</option>
                {eventTypes.map(event => (
                  <option key={event.value} value={event.value}>
                    {event.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="failing">Failing</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search webhooks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Webhooks List */}
      <div className="space-y-4">
        {filteredWebhooks.map(webhook => {
          const status = getWebhookStatus(webhook);
          const StatusIcon = status.icon;
          const testResult = testResults[webhook.id];

          return (
            <div key={webhook.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
              {/* Webhook Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Link className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">{webhook.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-800`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.text}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{webhook.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {webhook.events.map(event => {
                          const eventType = eventTypes.find(e => e.value === event);
                          return (
                            <span
                              key={event}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded"
                            >
                              {eventType?.label || event}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTestWebhook(webhook.id)}
                      disabled={isTesting}
                      className={`p-2 rounded-lg ${
                        isTesting
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                      title="Test Webhook"
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditWebhook && onEditWebhook(webhook.id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Webhook Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* URL & Secret */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        <Server className="inline w-4 h-4 mr-1" />
                        Webhook URL
                      </label>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <code className="text-sm text-gray-700 truncate">
                          {webhook.url}
                        </code>
                        <button
                          onClick={() => copyToClipboard(webhook.url)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        <Key className="inline w-4 h-4 mr-1" />
                        Secret Key
                      </label>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <code className="text-sm text-gray-700 truncate">
                          {showSecret[webhook.id] 
                            ? webhook.secret 
                            : '••••••••••••••••'}
                        </code>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => setShowSecret(prev => ({
                              ...prev,
                              [webhook.id]: !prev[webhook.id]
                            }))}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title={showSecret[webhook.id] ? 'Hide' : 'Show'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => copyToClipboard(webhook.secret)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Copy"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRegenerateSecret && onRegenerateSecret(webhook.id)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Regenerate"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status & Statistics */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Last Delivery</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDateTime(webhook.lastDelivery?.timestamp)}
                        </p>
                        {webhook.lastDelivery && (
                          <p className={`text-xs ${
                            webhook.lastDelivery.success ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {webhook.lastDelivery.success ? 'Success' : 'Failed'}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Deliveries</p>
                        <p className="text-sm font-medium text-gray-900">
                          {webhook.deliveryCount || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Success Rate</p>
                        <p className="text-sm font-medium text-gray-900">
                          {webhook.successRate || 0}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Created</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDateTime(webhook.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Test Result */}
                    {testResult && (
                      <div className={`p-3 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {testResult.success ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className={`text-sm font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                              {testResult.message}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(testResult.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={webhook.retryOnFailure}
                        readOnly
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Retry on failure</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={webhook.includePayload}
                        readOnly
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Include full payload</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={webhook.verifySSL}
                        readOnly
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Verify SSL</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Webhook Footer */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">ID: {webhook.id}</span>
                    {webhook.updatedAt && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-600">
                          Updated: {formatDateTime(webhook.updatedAt)}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onDeleteWebhook && onDeleteWebhook(webhook.id)}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                    <button
                      onClick={() => onEditWebhook && onEditWebhook(webhook.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configure</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredWebhooks.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Link className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No webhooks found</h3>
            <p className="text-gray-600 mt-2">
              {activeTab === 'all' 
                ? 'Get started by creating your first webhook'
                : `No ${activeTab} webhooks found`}
            </p>
            <button
              onClick={onAddWebhook}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Webhook
            </button>
          </div>
        )}
      </div>

      {/* Webhook Documentation */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Webhook Documentation</h3>
            <p className="text-gray-600 mt-1">Learn how to set up and use webhooks</p>
          </div>
          <button
            onClick={() => window.open('/api/webhooks/docs', '_blank')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Full Docs</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Bell className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">Event Types</h4>
            </div>
            <p className="text-sm text-gray-600">
              Learn about all available event types and their payload structures
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Key className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-gray-900">Security</h4>
            </div>
            <p className="text-sm text-gray-600">
              Understand webhook security, signature verification, and best practices
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Server className="w-5 h-5 text-purple-600" />
              <h4 className="font-medium text-gray-900">Testing</h4>
            </div>
            <p className="text-sm text-gray-600">
              Learn how to test your webhooks using our testing tools and sandbox
            </p>
          </div>
        </div>
      </div>

      {/* Sample Payload */}
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Sample Webhook Payload</h3>
          <button
            onClick={() => copyToClipboard(JSON.stringify({
              event: 'payment.received',
              data: {
                id: 'pay_123456',
                amount: 2500,
                currency: 'USD',
                tenant: { id: 'tenant_123', name: 'John Doe' },
                property: { id: 'prop_123', name: 'Sunset Apartments' },
                unit: 'A-205'
              },
              timestamp: new Date().toISOString()
            }, null, 2))}
            className="px-3 py-1 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>
        </div>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          {JSON.stringify({
            event: 'payment.received',
            data: {
              id: 'pay_123456',
              amount: 2500,
              currency: 'USD',
              tenant: { id: 'tenant_123', name: 'John Doe' },
              property: { id: 'prop_123', name: 'Sunset Apartments' },
              unit: 'A-205'
            },
            timestamp: new Date().toISOString()
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default WebhookSettings;