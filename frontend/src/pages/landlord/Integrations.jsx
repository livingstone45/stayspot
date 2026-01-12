import React, { useState, useEffect } from 'react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { useAuth } from '../../hooks/useAuth';
import { Plug, Check, Plus, Loader, AlertCircle } from 'lucide-react';
import { getIntegrations, connectIntegration, disconnectIntegration } from '../../utils/landlordApi';

const Integrations = () => {
  const { isDark } = useThemeMode();
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [stats, setStats] = useState({
    connected: 0,
    available: 0,
    ready: 0,
  });

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getIntegrations();
      const intList = Array.isArray(response.data) ? response.data : response;
      
      setIntegrations(intList);
      
      // Calculate stats
      setStats({
        connected: intList.filter(i => i.connected).length,
        available: intList.length,
        ready: intList.filter(i => !i.connected).length,
      });
    } catch (err) {
      setError(err.message || 'Failed to load integrations');
      console.error('Error loading integrations:', err);
      // Fallback to sample data
      const sampleIntegrations = [
        { id: 1, name: 'Stripe Payments', description: 'Accept rent payments via credit card', connected: true },
        { id: 2, name: 'QuickBooks', description: 'Sync financial data with accounting software', connected: false },
        { id: 3, name: 'Slack Notifications', description: 'Receive alerts via Slack', connected: true },
        { id: 4, name: 'Google Calendar', description: 'Sync events with Google Calendar', connected: false },
        { id: 5, name: 'Zapier', description: 'Automate workflows with Zapier', connected: false },
      ];
      setIntegrations(sampleIntegrations);
      setStats({
        connected: 2,
        available: 5,
        ready: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleIntegration = async (id, currentlyConnected) => {
    setConnecting(id);
    try {
      if (currentlyConnected) {
        await disconnectIntegration(id);
      } else {
        await connectIntegration(id);
      }
      await loadIntegrations();
    } catch (err) {
      setError(err.message || 'Failed to update integration');
      console.error('Error toggling integration:', err);
    } finally {
      setConnecting(null);
    }
  };

  const containerClasses = `${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 min-h-screen`;
  const cardClasses = `${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`;
  const titleClasses = `${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-bold mb-2`;
  const textClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'}`;
  const statCardClasses = `${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`;

  return (
    <div className={containerClasses}>
      {/* Portfolio Header */}
      <div className={`${cardClasses} mb-8`}>
        <h1 className={titleClasses}>Welcome back!</h1>
        <p className={textClasses}>Manage your investment properties and track performance in real-time</p>
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className={statCardClasses}>
            <p className={`${textClasses} text-sm`}>Active Properties</p>
            <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>0</p>
          </div>
          <div className={statCardClasses}>
            <p className={`${textClasses} text-sm`}>Total Units</p>
            <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>0</p>
          </div>
          <div className={statCardClasses}>
            <p className={`${textClasses} text-sm`}>Occupied Units</p>
            <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>0</p>
          </div>
          <div className={statCardClasses}>
            <p className={`${textClasses} text-sm`}>Vacancy Rate</p>
            <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>0%</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className={titleClasses}>Welcome back, {user?.firstName || 'User'}!</h1>
        <p className={textClasses}>Manage your investment properties and track performance in real-time</p>
      </div>

      {/* Connected Apps Summary */}
      {error && (
        <div className={`mb-6 p-4 rounded-lg border ${isDark ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-800'} flex gap-3`}>
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin mr-2" size={24} />
          <p className={textClasses}>Loading integrations...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={cardClasses}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textClasses} text-sm font-medium mb-1`}>Connected Apps</p>
                <p className={`${isDark ? 'text-green-400' : 'text-green-600'} text-2xl font-bold`}>{stats.connected}</p>
              </div>
              <Check className={`${isDark ? 'text-green-400' : 'text-green-600'}`} size={32} />
            </div>
          </div>

          <div className={cardClasses}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textClasses} text-sm font-medium mb-1`}>Available Apps</p>
                <p className={`${isDark ? 'text-blue-400' : 'text-blue-600'} text-2xl font-bold`}>{stats.available}</p>
              </div>
              <Plug className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`} size={32} />
            </div>
          </div>

          <div className={cardClasses}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textClasses} text-sm font-medium mb-1`}>Ready to Connect</p>
                <p className={`${isDark ? 'text-orange-400' : 'text-orange-600'} text-2xl font-bold`}>{stats.ready}</p>
              </div>
              <Plus className={`${isDark ? 'text-orange-400' : 'text-orange-600'}`} size={32} />
            </div>
          </div>
        </div>
      )}

      {/* Integration List */}
      <div className={cardClasses}>
        <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-6`}>Available Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map(integration => (
            <div key={integration.id} className={`border rounded-lg p-4 ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'} flex justify-between items-start`}>
              <div className="flex-1">
                <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-1`}>{integration.name}</h3>
                <p className={`${textClasses} text-sm mb-3`}>{integration.description}</p>
                {integration.connected ? (
                  <span className={`inline-block px-3 py-1 text-xs rounded font-medium ${isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                    ✓ Connected
                  </span>
                ) : (
                  <span className={`inline-block px-3 py-1 text-xs rounded font-medium ${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                    Not Connected
                  </span>
                )}
              </div>
              <button 
                onClick={() => handleToggleIntegration(integration.id, integration.connected)}
                disabled={connecting === integration.id}
                className={`ml-3 px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 ${
                  integration.connected 
                    ? (isDark ? 'text-red-400 hover:bg-red-900' : 'text-red-600 hover:bg-red-100')
                    : (isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white')
                }`}
              >
                {connecting === integration.id ? 'Processing...' : (integration.connected ? 'Disconnect' : 'Connect')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Integrations;
