import React, { useState, useEffect } from 'react';
import { Settings, Bell, Lock, Code, Webhook, Eye, Copy, Trash2, Plus, X, Save, AlertCircle, Palette, Mail, Database } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const CompanySettings = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState(null);

  const [companySettings, setCompanySettings] = useState({ company_name: '', company_email: '', company_phone: '', timezone: 'UTC', language: 'en', currency: 'USD' });
  const [notificationSettings, setNotificationSettings] = useState({ email_alerts: true, sms_alerts: false, push_notifications: true, digest_frequency: 'daily' });
  const [securitySettings, setSecuritySettings] = useState({ two_factor_auth: false, session_timeout: 30, ip_whitelist: [], password_policy: {} });
  const [widgets, setWidgets] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [showApiModal, setShowApiModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [apiKeyName, setApiKeyName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [themeSettings, setThemeSettings] = useState({ primary_color: '#3B82F6', secondary_color: '#8B5CF6', accent_color: '#EC4899', font_family: 'Inter' });
  const [emailSettings, setEmailSettings] = useState({ smtp_host: '', smtp_port: 587, from_email: '', from_name: '' });
  const [backupSettings, setBackupSettings] = useState({ auto_backup: true, backup_frequency: 'daily', retention_days: 30 });

  useEffect(() => {
    fetchAllData();
  }, [activeTab]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (activeTab === 'general') {
        const res = await fetch('/api/settings/company', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setCompanySettings((await res.json()).data);
      } else if (activeTab === 'notifications') {
        const res = await fetch('/api/settings/notifications', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setNotificationSettings((await res.json()).data);
      } else if (activeTab === 'security') {
        const res = await fetch('/api/settings/security', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setSecuritySettings((await res.json()).data);
      } else if (activeTab === 'dashboard') {
        const res = await fetch('/api/settings/dashboard/widgets', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setWidgets((await res.json()).data);
      } else if (activeTab === 'integrations') {
        const res = await fetch('/api/settings/integrations', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setIntegrations((await res.json()).data);
      } else if (activeTab === 'api') {
        const res = await fetch('/api/settings/api-keys', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setApiKeys((await res.json()).data);
      } else if (activeTab === 'webhooks') {
        const res = await fetch('/api/settings/webhooks', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setWebhooks((await res.json()).data);
      }

      const statsRes = await fetch('/api/settings/stats', { headers: { 'Authorization': `Bearer ${token}` } });
      if (statsRes.ok) setStats((await statsRes.json()).data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompanySettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/settings/company', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(companySettings)
      });
      if (!res.ok) throw new Error('Failed to save');
      setSuccess('Company settings saved');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationSettings)
      });
      if (!res.ok) throw new Error('Failed to save');
      setSuccess('Notification settings saved');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveSecurity = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/settings/security', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(securitySettings)
      });
      if (!res.ok) throw new Error('Failed to save');
      setSuccess('Security settings saved');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateApiKey = async () => {
    if (!apiKeyName) {
      setError('API key name required');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/settings/api-keys', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: apiKeyName })
      });
      if (!res.ok) throw new Error('Failed to create');
      setApiKeyName('');
      setShowApiModal(false);
      fetchAllData();
      setSuccess('API key created');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteApiKey = async (keyId) => {
    if (!window.confirm('Delete this API key?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/settings/api-keys/${keyId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateWebhook = async () => {
    if (!webhookUrl || webhookEvents.length === 0) {
      setError('URL and events required');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/settings/webhooks', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl, events: webhookEvents })
      });
      if (!res.ok) throw new Error('Failed to create');
      setWebhookUrl('');
      setWebhookEvents([]);
      setShowWebhookModal(false);
      fetchAllData();
      setSuccess('Webhook created');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteWebhook = async (webhookId) => {
    if (!window.confirm('Delete this webhook?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/settings/webhooks/${webhookId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {error && <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800'}`}>{error}</div>}
        {success && <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800'}`}>{success}</div>}

        <div className="mb-8">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Customize your dashboard and manage integrations</p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>API Keys</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total_api_keys}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Webhooks</p>
              <p className="text-2xl font-bold text-green-600">{stats.active_webhooks}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Integrations</p>
              <p className="text-2xl font-bold text-purple-600">{stats.enabled_integrations}</p>
            </div>
          </div>
        )}

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex border-b overflow-x-auto">
            {['general', 'themes', 'notifications', 'security', 'email', 'backup', 'integrations', 'api', 'webhooks'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 px-6 py-4 font-medium whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : activeTab === 'general' ? (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Company Name</label>
                  <input type="text" value={companySettings.company_name} onChange={(e) => setCompanySettings({...companySettings, company_name: e.target.value})} className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                  <input type="email" value={companySettings.company_email} onChange={(e) => setCompanySettings({...companySettings, company_email: e.target.value})} className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone</label>
                  <input type="tel" value={companySettings.company_phone} onChange={(e) => setCompanySettings({...companySettings, company_phone: e.target.value})} className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Timezone</label>
                    <select value={companySettings.timezone} onChange={(e) => setCompanySettings({...companySettings, timezone: e.target.value})} className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}>
                      <option>UTC</option>
                      <option>EST</option>
                      <option>CST</option>
                      <option>PST</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Language</label>
                    <select value={companySettings.language} onChange={(e) => setCompanySettings({...companySettings, language: e.target.value})} className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Currency</label>
                    <select value={companySettings.currency} onChange={(e) => setCompanySettings({...companySettings, currency: e.target.value})} className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleSaveCompanySettings} className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" /> Save Changes
                </button>
              </div>
            ) : activeTab === 'notifications' ? (
              <div className="space-y-6 max-w-2xl">
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={notificationSettings.email_alerts} onChange={(e) => setNotificationSettings({...notificationSettings, email_alerts: e.target.checked})} className="w-4 h-4 rounded" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Email Alerts</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={notificationSettings.sms_alerts} onChange={(e) => setNotificationSettings({...notificationSettings, sms_alerts: e.target.checked})} className="w-4 h-4 rounded" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>SMS Alerts</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={notificationSettings.push_notifications} onChange={(e) => setNotificationSettings({...notificationSettings, push_notifications: e.target.checked})} className="w-4 h-4 rounded" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Push Notifications</span>
                  </label>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Digest Frequency</label>
                  <select value={notificationSettings.digest_frequency} onChange={(e) => setNotificationSettings({...notificationSettings, digest_frequency: e.target.value})} className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}>
                    <option value="instant">Instant</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <button onClick={handleSaveNotifications} className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" /> Save Changes
                </button>
              </div>
            ) : activeTab === 'security' ? (
              <div className="space-y-6 max-w-2xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={securitySettings.two_factor_auth} onChange={(e) => setSecuritySettings({...securitySettings, two_factor_auth: e.target.checked})} className="w-4 h-4 rounded" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Two-Factor Authentication</span>
                </label>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Session Timeout (minutes)</label>
                  <input type="number" value={securitySettings.session_timeout} onChange={(e) => setSecuritySettings({...securitySettings, session_timeout: parseInt(e.target.value)})} min="5" max="1440" className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`} />
                </div>
                <button onClick={handleSaveSecurity} className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" /> Save Changes
                </button>
              </div>
            ) : activeTab === 'themes' ? (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className={`block text-sm font-medium mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Color Scheme</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Primary</label>
                      <input type="color" value={themeSettings.primary_color} onChange={(e) => setThemeSettings({...themeSettings, primary_color: e.target.value})} className="w-full h-10 rounded-lg cursor-pointer" />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Secondary</label>
                      <input type="color" value={themeSettings.secondary_color} onChange={(e) => setThemeSettings({...themeSettings, secondary_color: e.target.value})} className="w-full h-10 rounded-lg cursor-pointer" />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Accent</label>
                      <input type="color" value={themeSettings.accent_color} onChange={(e) => setThemeSettings({...themeSettings, accent_color: e.target.value})} className="w-full h-10 rounded-lg cursor-pointer" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Font Family</label>
                  <select value={themeSettings.font_family} onChange={(e) => setThemeSettings({...themeSettings, font_family: e.target.value})} className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}>
                    <option value="Inter">Inter</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Playfair">Playfair Display</option>
                  </select>
                </div>
                <button onClick={handleSaveCompanySettings} className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" /> Save Theme
                </button>
              </div>
            ) : activeTab === 'email' ? (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>SMTP Host</label>
                  <input type="text" value={emailSettings.smtp_host} onChange={(e) => setEmailSettings({...emailSettings, smtp_host: e.target.value})} placeholder="smtp.gmail.com" className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>From Email</label>
                  <input type="email" value={emailSettings.from_email} onChange={(e) => setEmailSettings({...emailSettings, from_email: e.target.value})} className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>From Name</label>
                  <input type="text" value={emailSettings.from_name} onChange={(e) => setEmailSettings({...emailSettings, from_name: e.target.value})} className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`} />
                </div>
                <button onClick={handleSaveCompanySettings} className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" /> Save Email Settings
                </button>
              </div>
            ) : activeTab === 'backup' ? (
              <div className="space-y-6 max-w-2xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={backupSettings.auto_backup} onChange={(e) => setBackupSettings({...backupSettings, auto_backup: e.target.checked})} className="w-4 h-4 rounded" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Enable Automatic Backups</span>
                </label>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Backup Frequency</label>
                  <select value={backupSettings.backup_frequency} onChange={(e) => setBackupSettings({...backupSettings, backup_frequency: e.target.value})} className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Retention Days</label>
                  <input type="number" value={backupSettings.retention_days} onChange={(e) => setBackupSettings({...backupSettings, retention_days: parseInt(e.target.value)})} min="7" max="365" className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`} />
                </div>
                <button onClick={handleSaveCompanySettings} className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" /> Save Backup Settings
                </button>
              </div>
            ) : activeTab === 'integrations' ? (
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Integration management coming soon</p>
              </div>
            ) : activeTab === 'dashboard' ? (
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Dashboard customization coming soon</p>
              </div>
            ) : activeTab === 'api' ? (
              <div className="space-y-4">
                <button onClick={() => setShowApiModal(true)} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Create API Key
                </button>
                {apiKeys.map((key) => (
                  <div key={key.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} flex items-center justify-between`}>
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{key.name}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{key.key_prefix}...</p>
                    </div>
                    <button onClick={() => handleDeleteApiKey(key.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : activeTab === 'webhooks' ? (
              <div className="space-y-4">
                <button onClick={() => setShowWebhookModal(true)} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Create Webhook
                </button>
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} flex items-center justify-between`}>
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{webhook.url}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{webhook.active ? 'Active' : 'Inactive'}</p>
                    </div>
                    <button onClick={() => handleDeleteWebhook(webhook.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Coming soon</p>
              </div>
            )}
          </div>
        </div>

        {/* API Key Modal */}
        {showApiModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg max-w-md w-full`}>
              <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-start`}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create API Key</h2>
                <button onClick={() => setShowApiModal(false)} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6 space-y-4">
                <input type="text" placeholder="API Key Name" value={apiKeyName} onChange={(e) => setApiKeyName(e.target.value)} className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`} />
              </div>
              <div className={`p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex gap-3`}>
                <button onClick={handleCreateApiKey} className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium">Create</button>
                <button onClick={() => setShowApiModal(false)} className={`flex-1 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'} font-medium`}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Webhook Modal */}
        {showWebhookModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg max-w-md w-full`}>
              <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-start`}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create Webhook</h2>
                <button onClick={() => setShowWebhookModal(false)} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6 space-y-4">
                <input type="url" placeholder="Webhook URL" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`} />
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Events</label>
                  {['user.created', 'user.updated', 'payment.completed', 'order.placed'].map((event) => (
                    <label key={event} className="flex items-center gap-2 cursor-pointer mb-2">
                      <input type="checkbox" checked={webhookEvents.includes(event)} onChange={(e) => setWebhookEvents(e.target.checked ? [...webhookEvents, event] : webhookEvents.filter(ev => ev !== event))} className="w-4 h-4 rounded" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{event}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className={`p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex gap-3`}>
                <button onClick={handleCreateWebhook} className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium">Create</button>
                <button onClick={() => setShowWebhookModal(false)} className={`flex-1 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'} font-medium`}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySettings;
