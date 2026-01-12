import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
  Database,
  Mail,
  Bell,
  CreditCard,
  MapPin,
  Shield,
  Zap,
  Link,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  Upload,
  Play,
  StopCircle,
  TestTube
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SystemAdminIntegrations = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState(null);
  const [testingIntegration, setTestingIntegration] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'payment',
    provider: '',
    status: 'inactive',
    apiKey: '',
    apiSecret: '',
    webhookUrl: '',
    settings: {},
    enabled: false,
    autoSync: false,
    syncFrequency: 'daily'
  });

  const categories = [
    { id: 'all', name: 'All Integrations', color: 'gray', icon: Globe },
    { id: 'payment', name: 'Payment Gateways', color: 'green', icon: CreditCard },
    { id: 'email', name: 'Email Services', color: 'blue', icon: Mail },
    { id: 'sms', name: 'SMS Services', color: 'purple', icon: Bell },
    { id: 'map', name: 'Mapping Services', color: 'red', icon: MapPin },
    { id: 'background', name: 'Background Check', color: 'yellow', icon: Shield },
    { id: 'accounting', name: 'Accounting', color: 'indigo', icon: Database },
    { id: 'market', name: 'Market Data', color: 'orange', icon: Globe },
    { id: 'api', name: 'API Services', color: 'cyan', icon: Zap },
  ];

  const providers = {
    payment: [
      { id: 'stripe', name: 'Stripe', icon: CreditCard },
      { id: 'paypal', name: 'PayPal', icon: CreditCard },
      { id: 'square', name: 'Square', icon: CreditCard },
      { id: 'braintree', name: 'Braintree', icon: CreditCard },
    ],
    email: [
      { id: 'sendgrid', name: 'SendGrid', icon: Mail },
      { id: 'mailgun', name: 'Mailgun', icon: Mail },
      { id: 'amazon_ses', name: 'Amazon SES', icon: Mail },
      { id: 'postmark', name: 'Postmark', icon: Mail },
    ],
    sms: [
      { id: 'twilio', name: 'Twilio', icon: Bell },
      { id: 'nexmo', name: 'Vonage (Nexmo)', icon: Bell },
      { id: 'plivo', name: 'Plivo', icon: Bell },
      { id: 'aws_sns', name: 'Amazon SNS', icon: Bell },
    ],
    map: [
      { id: 'google_maps', name: 'Google Maps', icon: MapPin },
      { id: 'mapbox', name: 'Mapbox', icon: MapPin },
      { id: 'here', name: 'HERE Maps', icon: MapPin },
    ],
    background: [
      { id: 'checkr', name: 'Checkr', icon: Shield },
      { id: 'goodhire', name: 'GoodHire', icon: Shield },
      { id: 'hireright', name: 'HireRight', icon: Shield },
    ],
    accounting: [
      { id: 'quickbooks', name: 'QuickBooks', icon: Database },
      { id: 'xero', name: 'Xero', icon: Database },
      { id: 'freshbooks', name: 'FreshBooks', icon: Database },
    ],
    market: [
      { id: 'zillow', name: 'Zillow', icon: Globe },
      { id: 'realtor', name: 'Realtor.com', icon: Globe },
      { id: 'rentometer', name: 'Rentometer', icon: Globe },
      { id: 'costar', name: 'CoStar', icon: Globe },
    ],
    api: [
      { id: 'rest', name: 'REST API', icon: Zap },
      { id: 'graphql', name: 'GraphQL', icon: Zap },
      { id: 'webhook', name: 'Webhook', icon: Zap },
    ],
  };

  const sampleIntegrations = [
    {
      id: 'stripe_1',
      name: 'Stripe Payment Gateway',
      type: 'payment',
      provider: 'stripe',
      status: 'active',
      enabled: true,
      lastSync: '2024-01-15T10:30:00Z',
      nextSync: '2024-01-16T10:30:00Z',
      syncStatus: 'success',
      autoSync: true,
      syncFrequency: 'hourly',
      settings: {
        apiKey: 'sk_live_***',
        webhookSecret: 'whsec_***',
        currency: 'USD',
        enableRecurring: true,
      },
      stats: {
        totalTransactions: 12485,
        successful: 12400,
        failed: 85,
        last24h: 245,
      },
      health: {
        status: 'healthy',
        latency: 45,
        lastChecked: '2024-01-15T10:29:00Z',
      }
    },
    {
      id: 'sendgrid_1',
      name: 'SendGrid Email Service',
      type: 'email',
      provider: 'sendgrid',
      status: 'active',
      enabled: true,
      lastSync: '2024-01-15T09:15:00Z',
      nextSync: '2024-01-15T10:15:00Z',
      syncStatus: 'success',
      autoSync: true,
      syncFrequency: 'hourly',
      settings: {
        apiKey: 'SG.***',
        fromEmail: 'noreply@stayspot.com',
        fromName: 'StaySpot',
        templates: {
          welcome: 'd-***',
          passwordReset: 'd-***',
          paymentReceipt: 'd-***',
        }
      },
      stats: {
        emailsSent: 89245,
        delivered: 88500,
        bounced: 745,
        opened: 45218,
        clicked: 12485,
      },
      health: {
        status: 'healthy',
        latency: 120,
        lastChecked: '2024-01-15T09:14:00Z',
      }
    },
    {
      id: 'twilio_1',
      name: 'Twilio SMS Service',
      type: 'sms',
      provider: 'twilio',
      status: 'active',
      enabled: true,
      lastSync: '2024-01-15T08:45:00Z',
      nextSync: '2024-01-15T09:45:00Z',
      syncStatus: 'success',
      autoSync: true,
      syncFrequency: 'hourly',
      settings: {
        accountSid: 'AC***',
        authToken: '***',
        phoneNumber: '+1234567890',
        enableAlerts: true,
      },
      stats: {
        smsSent: 12485,
        delivered: 12400,
        failed: 85,
        last24h: 245,
      },
      health: {
        status: 'healthy',
        latency: 85,
        lastChecked: '2024-01-15T08:44:00Z',
      }
    },
    {
      id: 'google_maps_1',
      name: 'Google Maps Integration',
      type: 'map',
      provider: 'google_maps',
      status: 'active',
      enabled: true,
      lastSync: '2024-01-15T07:30:00Z',
      nextSync: '2024-01-16T07:30:00Z',
      syncStatus: 'success',
      autoSync: true,
      syncFrequency: 'daily',
      settings: {
        apiKey: 'AIza***',
        enableGeocoding: true,
        enablePlaces: true,
        enableDirections: true,
      },
      stats: {
        geocodingRequests: 89245,
        mapViews: 124852,
        placesSearches: 45218,
        last24h: 1245,
      },
      health: {
        status: 'healthy',
        latency: 65,
        lastChecked: '2024-01-15T07:29:00Z',
      }
    },
    {
      id: 'checkr_1',
      name: 'Checkr Background Checks',
      type: 'background',
      provider: 'checkr',
      status: 'active',
      enabled: true,
      lastSync: '2024-01-15T06:15:00Z',
      nextSync: '2024-01-16T06:15:00Z',
      syncStatus: 'success',
      autoSync: true,
      syncFrequency: 'daily',
      settings: {
        apiKey: '***',
        enableTenantScreening: true,
        enableEmployeeScreening: true,
        autoRequest: true,
      },
      stats: {
        screenings: 2458,
        completed: 2415,
        pending: 43,
        last24h: 45,
      },
      health: {
        status: 'healthy',
        latency: 150,
        lastChecked: '2024-01-15T06:14:00Z',
      }
    },
    {
      id: 'quickbooks_1',
      name: 'QuickBooks Accounting',
      type: 'accounting',
      provider: 'quickbooks',
      status: 'inactive',
      enabled: false,
      lastSync: '2024-01-10T12:00:00Z',
      nextSync: null,
      syncStatus: 'error',
      autoSync: false,
      syncFrequency: 'daily',
      settings: {
        clientId: '***',
        clientSecret: '***',
        refreshToken: '***',
        enableSync: false,
      },
      stats: {
        transactionsSynced: 8924,
        lastSyncDate: '2024-01-10',
        errors: 5,
      },
      health: {
        status: 'unhealthy',
        latency: null,
        lastChecked: '2024-01-10T12:00:00Z',
        error: 'Authentication failed'
      }
    },
    {
      id: 'zillow_1',
      name: 'Zillow Market Data',
      type: 'market',
      provider: 'zillow',
      status: 'active',
      enabled: true,
      lastSync: '2024-01-15T05:30:00Z',
      nextSync: '2024-01-16T05:30:00Z',
      syncStatus: 'success',
      autoSync: true,
      syncFrequency: 'daily',
      settings: {
        apiKey: '***',
        enablePropertyData: true,
        enableRentEstimates: true,
        enableMarketTrends: true,
      },
      stats: {
        propertiesFetched: 89245,
        estimatesGenerated: 45218,
        last24h: 1245,
      },
      health: {
        status: 'healthy',
        latency: 200,
        lastChecked: '2024-01-15T05:29:00Z',
      }
    },
  ];

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setLoading(true);
    try {
      const data = await getIntegrations();
      setIntegrations(data);
    } catch (error) {
      console.error('Failed to load integrations:', error);
      setIntegrations(sampleIntegrations);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIntegration = async () => {
    try {
      await addIntegration(formData);
      loadIntegrations();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to add integration:', error);
    }
  };

  const handleUpdateIntegration = async () => {
    if (!editingIntegration) return;
    
    try {
      await updateIntegration(editingIntegration.id, formData);
      loadIntegrations();
      setShowEditModal(false);
      setEditingIntegration(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update integration:', error);
    }
  };

  const handleDeleteIntegration = async (id) => {
    if (window.confirm('Are you sure you want to delete this integration?')) {
      try {
        await deleteIntegration(id);
        loadIntegrations();
      } catch (error) {
        console.error('Failed to delete integration:', error);
      }
    }
  };

  const handleTestIntegration = async () => {
    if (!testingIntegration) return;
    
    setTestResult(null);
    try {
      const result = await testIntegration(testingIntegration.id);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: error.message || 'Test failed',
        timestamp: new Date().toISOString()
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'payment',
      provider: '',
      status: 'inactive',
      apiKey: '',
      apiSecret: '',
      webhookUrl: '',
      settings: {},
      enabled: false,
      autoSync: false,
      syncFrequency: 'daily'
    });
  };

  const filteredIntegrations = integrations.filter(integration => 
    activeCategory === 'all' || integration.type === activeCategory
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health) => {
    switch (health?.status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'unhealthy': return 'bg-red-100 text-red-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
              <p className="mt-2 text-gray-600">
                Manage third-party integrations and API connections
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Integration
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const count = integrations.filter(i => category.id === 'all' || i.type === category.id).length;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? `bg-${category.color}-100 text-${category.color}-800 border border-${category.color}-300`
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeCategory === category.id
                      ? `bg-${category.color}-200 text-${category.color}-900`
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => {
            const providerInfo = providers[integration.type]?.find(p => p.id === integration.provider);
            const Icon = providerInfo?.icon || Globe;
            const category = categories.find(c => c.id === integration.type);
            
            return (
              <div key={integration.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${category ? `bg-${category.color}-100` : 'bg-gray-100'} mr-4`}>
                        <Icon className={`w-6 h-6 ${category ? `text-${category.color}-600` : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(integration.status)} mr-2`}>
                            {integration.status}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getHealthColor(integration.health)}`}>
                            {integration.health?.status || 'unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          setEditingIntegration(integration);
                          setFormData(integration);
                          setShowEditModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteIntegration(integration.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Last Sync</p>
                      <p className="text-sm font-medium text-gray-900">
                        {integration.lastSync ? new Date(integration.lastSync).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Next Sync</p>
                      <p className="text-sm font-medium text-gray-900">
                        {integration.nextSync ? new Date(integration.nextSync).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Health Status */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Health Status</span>
                      {integration.health?.latency && (
                        <span className="text-xs text-gray-500">{integration.health.latency}ms</span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          integration.health?.status === 'healthy' ? 'bg-green-500' :
                          integration.health?.status === 'unhealthy' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: integration.health?.status === 'healthy' ? '100%' : '50%' }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setTestingIntegration(integration);
                          setShowTestModal(true);
                        }}
                        className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                      >
                        <TestTube className="w-3 h-3 mr-1" />
                        Test
                      </button>
                      <button
                        onClick={() => {/* View details */}}
                        className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Details
                      </button>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        integration.enabled ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <span className="text-xs text-gray-600">
                        {integration.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
            <p className="text-gray-600 mb-6">
              {activeCategory !== 'all'
                ? 'No integrations in this category'
                : 'No integrations have been configured yet'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Integration
            </button>
          </div>
        )}

        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {showEditModal ? 'Edit Integration' : 'Add New Integration'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setEditingIntegration(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Integration Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Stripe Payment Gateway"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            type: e.target.value,
                            provider: ''
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.filter(c => c.id !== 'all').map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provider
                      </label>
                      <select
                        value={formData.provider}
                        onChange={(e) => setFormData({...formData, provider: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Provider</option>
                        {providers[formData.type]?.map(provider => (
                          <option key={provider.id} value={provider.id}>{provider.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={formData.apiKey}
                      onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter API key"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Secret
                    </label>
                    <input
                      type="password"
                      value={formData.apiSecret}
                      onChange={(e) => setFormData({...formData, apiSecret: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter API secret"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Webhook URL
                    </label>
                    <input
                      type="url"
                      value={formData.webhookUrl}
                      onChange={(e) => setFormData({...formData, webhookUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://api.example.com/webhook"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enabled"
                        checked={formData.enabled}
                        onChange={(e) => setFormData({...formData, enabled: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enabled" className="ml-2 block text-sm text-gray-700">
                        Enable Integration
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="autoSync"
                        checked={formData.autoSync}
                        onChange={(e) => setFormData({...formData, autoSync: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="autoSync" className="ml-2 block text-sm text-gray-700">
                        Enable Auto Sync
                      </label>
                    </div>
                  </div>

                  {formData.autoSync && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sync Frequency
                      </label>
                      <select
                        value={formData.syncFrequency}
                        onChange={(e) => setFormData({...formData, syncFrequency: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setEditingIntegration(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={showEditModal ? handleUpdateIntegration : handleAddIntegration}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {showEditModal ? 'Update Integration' : 'Add Integration'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Modal */}
        {showTestModal && testingIntegration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Test Integration
                </h3>
                <button
                  onClick={() => {
                    setShowTestModal(false);
                    setTestingIntegration(null);
                    setTestResult(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Testing connection to <strong>{testingIntegration.name}</strong>
                </p>
                
                {testResult ? (
                  <div className={`p-4 rounded-lg ${
                    testResult.success 
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                    <div className="flex items-center">
                      {testResult.success ? (
                        <CheckCircle className="w-5 h-5 mr-2" />
                      ) : (
                        <XCircle className="w-5 h-5 mr-2" />
                      )}
                      <div>
                        <p className="font-medium">{testResult.success ? 'Test Successful' : 'Test Failed'}</p>
                        <p className="text-sm mt-1">{testResult.message}</p>
                        {testResult.timestamp && (
                          <p className="text-xs mt-2">
                            {new Date(testResult.timestamp).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <TestTube className="w-5 h-5 text-blue-600 mr-2" />
                      <p className="text-blue-700">Ready to test the integration</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowTestModal(false);
                    setTestingIntegration(null);
                    setTestResult(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={handleTestIntegration}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run Test
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemAdminIntegrations;