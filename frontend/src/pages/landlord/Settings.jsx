import React, { useState } from 'react';
import { User, Lock, Bell, Save, Eye, EyeOff, Check } from 'lucide-react';

const LandlordSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+254 712 345 678',
    company: 'Property Management Co',
    bio: 'Professional property manager with 5+ years experience'
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    paymentAlerts: true,
    maintenanceUpdates: true,
    tenantMessages: true,
    weeklyReport: true
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">Account Settings ⚙️</h1>
          <p className="text-gray-600">Manage your profile, security, and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'profile'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="inline mr-2" size={18} /> Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'security'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lock className="inline mr-2" size={18} /> Security
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'notifications'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bell className="inline mr-2" size={18} /> Notifications
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-8 border-2 border-purple-200">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4 shadow-lg">
                    JD
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{formData.firstName} {formData.lastName}</h3>
                  <p className="text-sm text-purple-600 font-semibold mb-4">Landlord</p>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition font-medium shadow-md">
                    Change Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-100 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleProfileChange}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition font-semibold flex items-center justify-center gap-2 shadow-md"
                  >
                    <Save size={18} /> Save Changes
                  </button>
                </div>

                {saved && (
                  <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg flex items-center gap-2 text-green-700 font-semibold">
                    <Check size={18} /> Profile updated successfully!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Change Password */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-8 border-2 border-orange-200">
              <h3 className="text-xl font-bold text-orange-900 mb-6">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-orange-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={securityData.currentPassword}
                    onChange={handleSecurityChange}
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-orange-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={securityData.newPassword}
                      onChange={handleSecurityChange}
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-orange-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-orange-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={securityData.confirmPassword}
                    onChange={handleSecurityChange}
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <button className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition font-semibold shadow-md">
                  Update Password
                </button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl shadow-lg p-8 border-2 border-cyan-200">
              <h3 className="text-xl font-bold text-cyan-900 mb-6">Security Options</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white border-2 border-cyan-300 rounded-lg">
                  <h4 className="font-semibold text-cyan-900 mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-cyan-700 mb-4">Add an extra layer of security to your account</p>
                  <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition font-medium text-sm shadow-md">
                    Enable 2FA
                  </button>
                </div>

                <div className="p-4 bg-white border-2 border-cyan-300 rounded-lg">
                  <h4 className="font-semibold text-cyan-900 mb-2">Active Sessions</h4>
                  <p className="text-sm text-cyan-700 mb-4">Manage your active login sessions</p>
                  <button className="px-4 py-2 border-2 border-cyan-300 text-cyan-700 rounded-lg hover:bg-cyan-50 transition font-medium text-sm">
                    View Sessions
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl shadow-lg p-8 border-2 border-teal-200 max-w-2xl">
            <h3 className="text-xl font-bold text-teal-900 mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email', color: 'teal' },
                { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive alerts via SMS', color: 'emerald' },
                { key: 'paymentAlerts', label: 'Payment Alerts', desc: 'Get notified about rent payments', color: 'cyan' },
                { key: 'maintenanceUpdates', label: 'Maintenance Updates', desc: 'Updates on maintenance requests', color: 'blue' },
                { key: 'tenantMessages', label: 'Tenant Messages', desc: 'New messages from tenants', color: 'indigo' },
                { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive weekly summary reports', color: 'violet' }
              ].map(({ key, label, desc, color }) => (
                <div key={key} className="flex items-center justify-between p-4 bg-white border-2 border-teal-200 rounded-lg hover:shadow-md transition">
                  <div>
                    <p className="font-semibold text-gray-900">{label}</p>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange(key)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                      notifications[key] ? `bg-gradient-to-r from-${color}-500 to-${color}-600` : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                        notifications[key] ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandlordSettings;
