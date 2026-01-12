import React, { useState } from 'react';
import { Settings, Bell, CreditCard, Lock, Save, Palette, Users, Key, Download, Upload, LogOut, CheckCircle } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const ManagementSettings = () => {
  const { currentTheme, setTheme } = useThemeMode();
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      companyName: 'Property Management Co.',
      email: 'admin@propertymanagement.com',
      phone: '+1 (555) 123-4567',
      timezone: 'America/New_York',
      currency: 'USD',
      language: 'English'
    },
    appearance: {
      theme: currentTheme,
      compactMode: false,
      animationsEnabled: true
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      maintenanceNotifications: true,
      leaseExpiryNotifications: true,
      rentPaymentReminders: true,
      dailyDigest: false,
      weeklyReport: true
    },
    integrations: {
      slackIntegration: false,
      googleCalendar: true,
      zapierIntegration: false,
      webhooksEnabled: true
    },
    billing: {
      billingEmail: 'billing@propertymanagement.com',
      billingCycle: 'monthly',
      autoRenew: true,
      invoiceFormat: 'PDF',
      taxId: 'XX-XXXXXXX'
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: '30',
      passwordExpiry: '90',
      ipWhitelist: false,
      apiKeyRotation: '90'
    },
    data: {
      autoBackup: true,
      backupFrequency: 'daily',
      dataRetention: '365',
      gdprCompliance: true
    }
  });

  const handleGeneralChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      general: { ...prev.general, [field]: value }
    }));
  };

  const handleAppearanceChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      appearance: { ...prev.appearance, [field]: value }
    }));
  };

  const handleNotificationChange = (field) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: !prev.notifications[field] }
    }));
  };

  const handleIntegrationChange = (field) => {
    setSettings(prev => ({
      ...prev,
      integrations: { ...prev.integrations, [field]: !prev.integrations[field] }
    }));
  };

  const handleBillingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      billing: { ...prev.billing, [field]: value }
    }));
  };

  const handleSecurityChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [field]: value }
    }));
  };

  const handleDataChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value }
    }));
  };

  const handleThemeChange = (themeName) => {
    setTheme(themeName);
    handleAppearanceChange('theme', themeName);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Settings className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <Users className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'data', label: 'Data', icon: <Download className="w-4 h-4" /> }
  ];

  const themeOptions = [
    { name: 'light', label: 'Light', color: 'bg-white border border-gray-300' },
    { name: 'dark', label: 'Dark', color: 'bg-gray-900 border border-gray-700' },
    { name: 'blue', label: 'Blue', color: 'bg-blue-600' },
    { name: 'purple', label: 'Purple', color: 'bg-purple-600' },
    { name: 'green', label: 'Green', color: 'bg-green-600' },
    { name: 'coral', label: 'Coral', color: 'bg-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap text-sm md:text-base ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={settings.general.companyName}
                    onChange={(e) => handleGeneralChange('companyName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={settings.general.email}
                      onChange={(e) => handleGeneralChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={settings.general.phone}
                      onChange={(e) => handleGeneralChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option>America/New_York</option>
                      <option>America/Chicago</option>
                      <option>America/Denver</option>
                      <option>America/Los_Angeles</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</label>
                    <select
                      value={settings.general.currency}
                      onChange={(e) => handleGeneralChange('currency', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                      <option>CAD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                    <select
                      value={settings.general.language}
                      onChange={(e) => handleGeneralChange('language', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Theme</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {themeOptions.map(theme => (
                      <button
                        key={theme.name}
                        onClick={() => handleThemeChange(theme.name)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          currentTheme === theme.name
                            ? 'border-purple-600 ring-2 ring-purple-400'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-400'
                        }`}
                      >
                        <div className={`w-full h-12 rounded mb-2 ${theme.color}`}></div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{theme.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={settings.appearance.compactMode}
                      onChange={(e) => handleAppearanceChange('compactMode', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Compact Mode</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={settings.appearance.animationsEnabled}
                      onChange={(e) => handleAppearanceChange('animationsEnabled', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Animations</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handleNotificationChange(key)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {key.replace(/([A-Z])/g, ' $1').trim().charAt(0).toUpperCase() + key.replace(/([A-Z])/g, ' $1').trim().slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-4">
                {Object.entries(settings.integrations).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {key.replace(/([A-Z])/g, ' $1').trim().charAt(0).toUpperCase() + key.replace(/([A-Z])/g, ' $1').trim().slice(1)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Connect and sync with external services</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handleIntegrationChange(key)}
                        className="w-4 h-4 rounded"
                      />
                    </label>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Billing Email</label>
                  <input
                    type="email"
                    value={settings.billing.billingEmail}
                    onChange={(e) => handleBillingChange('billingEmail', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Billing Cycle</label>
                    <select
                      value={settings.billing.billingCycle}
                      onChange={(e) => handleBillingChange('billingCycle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option>monthly</option>
                      <option>quarterly</option>
                      <option>annual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Invoice Format</label>
                    <select
                      value={settings.billing.invoiceFormat}
                      onChange={(e) => handleBillingChange('invoiceFormat', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option>PDF</option>
                      <option>Email</option>
                      <option>Both</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tax ID</label>
                  <input
                    type="text"
                    value={settings.billing.taxId}
                    onChange={(e) => handleBillingChange('taxId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.billing.autoRenew}
                    onChange={(e) => handleBillingChange('autoRenew', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-renew subscription</span>
                </label>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password Expiry (days)</label>
                    <input
                      type="number"
                      value={settings.security.passwordExpiry}
                      onChange={(e) => handleSecurityChange('passwordExpiry', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">API Key Rotation (days)</label>
                    <input
                      type="number"
                      value={settings.security.apiKeyRotation}
                      onChange={(e) => handleSecurityChange('apiKeyRotation', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.security.ipWhitelist}
                    onChange={(e) => handleSecurityChange('ipWhitelist', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">IP Whitelist</span>
                </label>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={settings.data.autoBackup}
                      onChange={(e) => handleDataChange('autoBackup', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Automatic Backups</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={settings.data.gdprCompliance}
                      onChange={(e) => handleDataChange('gdprCompliance', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">GDPR Compliance Mode</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Backup Frequency</label>
                    <select
                      value={settings.data.backupFrequency}
                      onChange={(e) => handleDataChange('backupFrequency', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option>hourly</option>
                      <option>daily</option>
                      <option>weekly</option>
                      <option>monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Retention (days)</label>
                    <input
                      type="number"
                      value={settings.data.dataRetention}
                      onChange={(e) => handleDataChange('dataRetention', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Export Data
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Upload className="w-4 h-4" />
                    Import Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mb-8">
          <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Actions</h3>
          <div className="flex flex-col md:flex-row gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Key className="w-4 h-4" />
              Change Password
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out All Devices
            </button>
          </div>
        </div>

        {saved && (
          <div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-700">
            <CheckCircle className="w-5 h-5" />
            Settings saved successfully
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagementSettings;
