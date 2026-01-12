import React, { useState, useEffect } from 'react';
import {
  Settings, Key, Link, RefreshCw,
  CheckCircle, AlertCircle, Clock, X,
  ChevronDown, Plus, Trash2, Edit,
  Eye, Copy, ExternalLink, Server
} from 'lucide-react';

const ApiIntegration = ({ integrations = [], onAdd, onEdit, onDelete, onTest, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [showApiKey, setShowApiKey] = useState({});
  const [testResults, setTestResults] = useState({});
  const [isTesting, setIsTesting] = useState(false);

  const integrationTypes = [
    { id: 'payment', name: 'Payment Processing', icon: '💳', color: 'green' },
    { id: 'screening', name: 'Tenant Screening', icon: '🔍', color: 'blue' },
    { id: 'marketing', name: 'Marketing', icon: '📢', color: 'purple' },
    { id: 'accounting', name: 'Accounting', icon: '📊', color: 'orange' },
    { id: 'smart_home', name: 'Smart Home', icon: '🏠', color: 'teal' },
    { id: 'document', name: 'Document Management', icon: '📄', color: 'gray' },
    { id: 'communication', name: 'Communication', icon: '💬', color: 'pink' },
    { id: 'analytics', name: 'Analytics', icon: '📈', color: 'yellow' }
  ];

  const getIntegrationStatus = (integration) => {
    if (!integration.isActive) return { color: 'gray', text: 'Inactive', icon: Clock };
    if (integration.lastSync && new Date(integration.lastSync) > new Date(Date.now() - 3600000)) {
      return { color: 'green', text: 'Active', icon: CheckCircle };
    }
    if (integration.lastError) return { color: 'red', text: 'Error', icon: AlertCircle };
    return { color: 'yellow', text: 'Needs Setup', icon: AlertCircle };
  };

  const handleTestConnection = async (integrationId) => {
    setIsTesting(true);
    try {
      // Mock API test
      await new Promise(resolve => setTimeout(resolve, 1000));
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      setTestResults(prev => ({
        ...prev,
        [integrationId]: {
          success,
          message: success ? 'Connection successful' : 'Connection failed',
          timestamp: new Date().toISOString()
        }
      }));
      
      if (onTest) {
        onTest(integrationId, success);
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [integrationId]: {
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

  const filteredIntegrations = integrations.filter(integration => {
    if (activeTab === 'active') return integration.isActive;
    if (activeTab === 'inactive') return !integration.isActive;
    if (activeTab === 'needs_setup') return !integration.isConfigured;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API Integrations</h2>
          <p className="text-gray-600 mt-2">Connect and manage third-party services</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Integration</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['all', 'active', 'inactive', 'needs_setup'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </nav>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map(integration => {
          const status = getIntegrationStatus(integration);
          const StatusIcon = status.icon;
          const integrationType = integrationTypes.find(t => t.id === integration.type) || integrationTypes[0];
          const testResult = testResults[integration.id];

          return (
            <div key={integration.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`text-2xl ${`text-${integrationType.color}-600`}`}>
                      {integrationType.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                      <p className="text-sm text-gray-600">{integrationType.name}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-800`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.text}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* API Endpoint */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      API Endpoint
                    </label>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <code className="text-sm text-gray-700 truncate">
                        {integration.apiEndpoint}
                      </code>
                      <button
                        onClick={() => copyToClipboard(integration.apiEndpoint)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Copy URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* API Key */}
                  {integration.apiKey && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        API Key
                      </label>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <code className="text-sm text-gray-700 truncate">
                          {showApiKey[integration.id] 
                            ? integration.apiKey 
                            : '••••••••••••••••'}
                        </code>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => setShowApiKey(prev => ({
                              ...prev,
                              [integration.id]: !prev[integration.id]
                            }))}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title={showApiKey[integration.id] ? 'Hide' : 'Show'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => copyToClipboard(integration.apiKey)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Copy"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sync Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Last Sync</p>
                      <p className="text-sm font-medium text-gray-900">
                        {integration.lastSync 
                          ? new Date(integration.lastSync).toLocaleTimeString()
                          : 'Never'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Sync Frequency</p>
                      <p className="text-sm font-medium text-gray-900">
                        {integration.syncFrequency || 'Manual'}
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

              {/* Card Footer */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTestConnection(integration.id)}
                      disabled={isTesting}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center space-x-1 ${
                        isTesting
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      <Link className="w-4 h-4" />
                      <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                    </button>
                    <button
                      onClick={() => window.open(integration.docsUrl, '_blank')}
                      className="p-1.5 text-gray-400 hover:text-gray-600"
                      title="Documentation"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit && onEdit(integration.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-600"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(integration.id)}
                      className="p-1.5 text-red-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Available Integrations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Available Integrations</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {integrationTypes.map(type => (
            <div
              key={type.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
              onClick={() => onAdd && onAdd(type.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`text-2xl ${`text-${type.color}-600`}`}>
                  {type.icon}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{type.name}</p>
                  <p className="text-xs text-gray-500">Click to add</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Documentation */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">API Documentation</h3>
            <p className="text-gray-600 mt-1">Access our API documentation and integration guides</p>
          </div>
          <button
            onClick={() => window.open('/api-docs', '_blank')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Documentation</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Key className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">API Keys</h4>
            </div>
            <p className="text-sm text-gray-600">
              Generate and manage your API keys for secure integration
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Server className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-gray-900">Webhooks</h4>
            </div>
            <p className="text-sm text-gray-600">
              Set up webhooks for real-time notifications and updates
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Settings className="w-5 h-5 text-purple-600" />
              <h4 className="font-medium text-gray-900">Rate Limits</h4>
            </div>
            <p className="text-sm text-gray-600">
              Understand API rate limits and best practices for integration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiIntegration;