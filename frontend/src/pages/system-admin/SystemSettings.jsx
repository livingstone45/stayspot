import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RefreshCw, 
  Shield, 
  Globe, 
  Mail, 
  Database,
  Cloud,
  Lock,
  Bell,
  Users,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SystemAdminSystemSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({});
  const [formData, setFormData] = useState({});
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'sms', name: 'SMS', icon: Bell },
    { id: 'database', name: 'Database', icon: Database },
    { id: 'storage', name: 'Storage', icon: Cloud },
    { id: 'users', name: 'User Settings', icon: Users },
    { id: 'billing', name: 'Billing', icon: DollarSign },
    { id: 'logs', name: 'Logs & Audit', icon: FileText },
  ];

  const defaultSettings = {
    general: {
      siteName: 'StaySpot',
      siteUrl: 'https://stayspot.com',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      defaultLanguage: 'en',
      maintenanceMode: false,
      enableRegistration: true,
      enableEmailVerification: true,
    },
    security: {
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireLowercase: true,
      passwordRequireNumbers: true,
      passwordRequireSymbols: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      enable2FA: false,
      require2FA: false,
      ipWhitelist: '',
      enableGeoBlocking: false,
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: '',
      smtpPassword: '',
      smtpEncryption: 'tls',
      fromEmail: 'noreply@stayspot.com',
      fromName: 'StaySpot',
      enableNotifications: true,
      enableWelcomeEmail: true,
      enablePasswordReset: true,
      enablePaymentReceipts: true,
    },
    sms: {
      provider: 'twilio',
      twilioAccountSid: '',
      twilioAuthToken: '',
      twilioPhoneNumber: '',
      enableSMSNotifications: true,
      enableLoginAlerts: false,
      enablePaymentAlerts: true,
      enableMaintenanceAlerts: true,
    },
    database: {
      backupFrequency: 'daily',
      backupRetention: 30,
      enableAutoBackup: true,
      backupPath: '/backups',
      enableReplication: false,
      replicationHost: '',
      replicationPort: 3306,
      replicationUsername: '',
      replicationPassword: '',
    },
    storage: {
      storageProvider: 'local',
      s3AccessKey: '',
      s3SecretKey: '',
      s3Bucket: '',
      s3Region: 'us-east-1',
      maxFileSize: 10,
      allowedFileTypes: 'jpg,jpeg,png,pdf,doc,docx',
      enableCDN: false,
      cdnUrl: '',
    },
    users: {
      defaultUserRole: 'tenant',
      enableProfileCompletion: true,
      enableActivityLogging: true,
      maxDevicesPerUser: 5,
      enableTermsAcceptance: true,
      requirePhoneVerification: false,
      enableUserImport: true,
      enableUserExport: true,
    },
    billing: {
      currency: 'USD',
      taxRate: 0,
      enableAutoInvoicing: true,
      invoiceDueDays: 30,
      lateFeePercentage: 5,
      enablePaymentReminders: true,
      reminderDays: [7, 3, 1],
      enableReceiptGeneration: true,
      paymentMethods: ['credit_card', 'bank_transfer'],
    },
    logs: {
      enableAccessLogs: true,
      enableErrorLogs: true,
      enableAuditLogs: true,
      logRetentionDays: 90,
      enableLogRotation: true,
      logLevel: 'info',
      enableRealTimeMonitoring: false,
      alertThreshold: 1000,
    },
  };

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings[activeTab]) {
      setFormData(settings[activeTab]);
    }
  }, [activeTab, settings]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getSystemSettings();
      setSettings(data);
      setFormData(data[activeTab] || defaultSettings[activeTab]);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setSettings(defaultSettings);
      setFormData(defaultSettings[activeTab]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage({ type: '', text: '' });

    try {
      await updateSystemSettings(activeTab, formData);
      setSettings(prev => ({
        ...prev,
        [activeTab]: formData
      }));
      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setTesting(true);
    try {
      await testEmail();
      setSaveMessage({ type: 'success', text: 'Test email sent successfully!' });
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to send test email.' });
    } finally {
      setTesting(false);
    }
  };

  const handleTestSMS = async () => {
    setTesting(true);
    try {
      await testSMS();
      setSaveMessage({ type: 'success', text: 'Test SMS sent successfully!' });
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to send test SMS.' });
    } finally {
      setTesting(false);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setFormData(defaultSettings[activeTab]);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  name="siteName"
                  value={formData.siteName || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site URL
                </label>
                <input
                  type="url"
                  name="siteUrl"
                  value={formData.siteUrl || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={formData.timezone || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Language
                </label>
                <select
                  name="defaultLanguage"
                  value={formData.defaultLanguage || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  name="maintenanceMode"
                  checked={formData.maintenanceMode || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                  Enable Maintenance Mode
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableRegistration"
                  name="enableRegistration"
                  checked={formData.enableRegistration || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableRegistration" className="ml-2 block text-sm text-gray-700">
                  Enable User Registration
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableEmailVerification"
                  name="enableEmailVerification"
                  checked={formData.enableEmailVerification || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableEmailVerification" className="ml-2 block text-sm text-gray-700">
                  Require Email Verification
                </label>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Password Policy</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    name="passwordMinLength"
                    value={formData.passwordMinLength || 8}
                    onChange={handleChange}
                    min="6"
                    max="32"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    name="sessionTimeout"
                    value={formData.sessionTimeout || 30}
                    onChange={handleChange}
                    min="5"
                    max="1440"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="passwordRequireUppercase"
                    name="passwordRequireUppercase"
                    checked={formData.passwordRequireUppercase || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="passwordRequireUppercase" className="ml-2 block text-sm text-gray-700">
                    Require uppercase letters
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="passwordRequireLowercase"
                    name="passwordRequireLowercase"
                    checked={formData.passwordRequireLowercase || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="passwordRequireLowercase" className="ml-2 block text-sm text-gray-700">
                    Require lowercase letters
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="passwordRequireNumbers"
                    name="passwordRequireNumbers"
                    checked={formData.passwordRequireNumbers || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="passwordRequireNumbers" className="ml-2 block text-sm text-gray-700">
                    Require numbers
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="passwordRequireSymbols"
                    name="passwordRequireSymbols"
                    checked={formData.passwordRequireSymbols || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="passwordRequireSymbols" className="ml-2 block text-sm text-gray-700">
                    Require symbols
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  name="maxLoginAttempts"
                  value={formData.maxLoginAttempts || 5}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lockout Duration (minutes)
                </label>
                <input
                  type="number"
                  name="lockoutDuration"
                  value={formData.lockoutDuration || 15}
                  onChange={handleChange}
                  min="1"
                  max="1440"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enable2FA"
                  name="enable2FA"
                  checked={formData.enable2FA || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enable2FA" className="ml-2 block text-sm text-gray-700">
                  Enable Two-Factor Authentication
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="require2FA"
                  name="require2FA"
                  checked={formData.require2FA || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="require2FA" className="ml-2 block text-sm text-gray-700">
                  Require 2FA for all users
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableGeoBlocking"
                  name="enableGeoBlocking"
                  checked={formData.enableGeoBlocking || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableGeoBlocking" className="ml-2 block text-sm text-gray-700">
                  Enable Geographic Blocking
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IP Whitelist (comma-separated)
              </label>
              <textarea
                name="ipWhitelist"
                value={formData.ipWhitelist || ''}
                onChange={handleChange}
                rows="3"
                placeholder="192.168.1.1, 10.0.0.0/24"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-4">SMTP Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    name="smtpHost"
                    value={formData.smtpHost || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    name="smtpPort"
                    value={formData.smtpPort || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    name="smtpUsername"
                    value={formData.smtpUsername || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    name="smtpPassword"
                    value={formData.smtpPassword || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Encryption
                  </label>
                  <select
                    name="smtpEncryption"
                    value={formData.smtpEncryption || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                    <option value="">None</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleTestEmail}
                    disabled={testing}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {testing ? 'Testing...' : 'Test Email Settings'}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Email
                </label>
                <input
                  type="email"
                  name="fromEmail"
                  value={formData.fromEmail || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Name
                </label>
                <input
                  type="text"
                  name="fromName"
                  value={formData.fromName || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Email Notifications</h4>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableNotifications"
                  name="enableNotifications"
                  checked={formData.enableNotifications || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableNotifications" className="ml-2 block text-sm text-gray-700">
                  Enable Email Notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableWelcomeEmail"
                  name="enableWelcomeEmail"
                  checked={formData.enableWelcomeEmail || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableWelcomeEmail" className="ml-2 block text-sm text-gray-700">
                  Send Welcome Email
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enablePasswordReset"
                  name="enablePasswordReset"
                  checked={formData.enablePasswordReset || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enablePasswordReset" className="ml-2 block text-sm text-gray-700">
                  Enable Password Reset Emails
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enablePaymentReceipts"
                  name="enablePaymentReceipts"
                  checked={formData.enablePaymentReceipts || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enablePaymentReceipts" className="ml-2 block text-sm text-gray-700">
                  Send Payment Receipts
                </label>
              </div>
            </div>
          </div>
        );

      case 'sms':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-4">SMS Provider Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provider
                  </label>
                  <select
                    name="provider"
                    value={formData.provider || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="twilio">Twilio</option>
                    <option value="nexmo">Vonage (Nexmo)</option>
                    <option value="plivo">Plivo</option>
                    <option value="aws">Amazon SNS</option>
                  </select>
                </div>
                {formData.provider === 'twilio' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twilio Account SID
                      </label>
                      <input
                        type="text"
                        name="twilioAccountSid"
                        value={formData.twilioAccountSid || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twilio Auth Token
                      </label>
                      <input
                        type="password"
                        name="twilioAuthToken"
                        value={formData.twilioAuthToken || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twilio Phone Number
                      </label>
                      <input
                        type="text"
                        name="twilioPhoneNumber"
                        value={formData.twilioPhoneNumber || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}
                <div className="flex items-end">
                  <button
                    onClick={handleTestSMS}
                    disabled={testing}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {testing ? 'Testing...' : 'Test SMS Settings'}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">SMS Notifications</h4>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableSMSNotifications"
                  name="enableSMSNotifications"
                  checked={formData.enableSMSNotifications || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableSMSNotifications" className="ml-2 block text-sm text-gray-700">
                  Enable SMS Notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableLoginAlerts"
                  name="enableLoginAlerts"
                  checked={formData.enableLoginAlerts || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableLoginAlerts" className="ml-2 block text-sm text-gray-700">
                  Send Login Alerts
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enablePaymentAlerts"
                  name="enablePaymentAlerts"
                  checked={formData.enablePaymentAlerts || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enablePaymentAlerts" className="ml-2 block text-sm text-gray-700">
                  Send Payment Alerts
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableMaintenanceAlerts"
                  name="enableMaintenanceAlerts"
                  checked={formData.enableMaintenanceAlerts || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableMaintenanceAlerts" className="ml-2 block text-sm text-gray-700">
                  Send Maintenance Alerts
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings for {tabs.find(t => t.id === activeTab)?.name}</h3>
            <p className="text-gray-600">
              Configure settings for this section. Changes are saved automatically.
            </p>
          </div>
        );
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
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="mt-2 text-gray-600">
            Configure global system settings and preferences
          </p>
        </div>

        {/* Save Message */}
        {saveMessage.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            saveMessage.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <div className="flex items-center">
              {saveMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 mr-2" />
              )}
              {saveMessage.text}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {tabs.find(t => t.id === activeTab)?.name} Settings
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Configure settings related to {tabs.find(t => t.id === activeTab)?.name.toLowerCase()}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleResetToDefault}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset to Default
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {renderTabContent()}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Danger Zone</h3>
              <p className="text-sm text-red-700 mt-1">
                These actions are irreversible. Please proceed with caution.
              </p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {/* Clear all logs */}}
              className="px-4 py-3 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 text-sm font-medium"
            >
              Clear All Logs
            </button>
            <button
              onClick={() => {/* Purge cache */}}
              className="px-4 py-3 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 text-sm font-medium"
            >
              Purge System Cache
            </button>
            <button
              onClick={() => {/* Reset all settings */}}
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
            >
              Reset All Settings to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAdminSystemSettings;