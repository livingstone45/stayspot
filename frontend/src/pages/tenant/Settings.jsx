import React, { useState, useEffect } from 'react';
import { Moon, Sun, Palette, Bell, Lock, Eye, LogOut, Save, X, User, Mail, Phone, Camera, Shield, Smartphone, Key, Activity } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const SettingsPage = () => {
  const { currentTheme, setTheme, resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('account');
  const [profileImage, setProfileImage] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=John');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [accountData, setAccountData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    apartmentNumber: '402',
    moveInDate: '2024-01-01',
  });

  const [editingAccount, setEditingAccount] = useState(false);
  const [tempAccountData, setTempAccountData] = useState(accountData);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    paymentReminders: true,
    maintenanceUpdates: true,
    announcementNotifications: true,
  });

  const [savedMessage, setSavedMessage] = useState('');

  const themes = [
    { id: 'light', name: 'Light', icon: Sun, description: 'Clean and bright interface' },
    { id: 'dark', name: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { id: 'blue', name: 'Ocean Blue', icon: Palette, description: 'Cool and professional' },
    { id: 'green', name: 'Forest Green', icon: Palette, description: 'Natural and calm' },
    { id: 'purple', name: 'Purple', icon: Palette, description: 'Modern and elegant' },
    { id: 'coral', name: 'Coral', icon: Palette, description: 'Warm and inviting' },
  ];

  const handleThemeChange = (themeId) => {
    setTheme(themeId);
    localStorage.setItem('theme', themeId);
    setSavedMessage('Theme updated successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleSettingChange = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveAccount = () => {
    setAccountData(tempAccountData);
    setEditingAccount(false);
    setSavedMessage('Profile updated successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result);
        setSavedMessage('Profile picture updated!');
        setTimeout(() => setSavedMessage(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('tenant-settings', JSON.stringify(settings));
    setSavedMessage('Notification settings saved!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSavedMessage('Passwords do not match!');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setSavedMessage('Password must be at least 8 characters long');
      return;
    }
    // Here you would typically make an API call to change the password
    setSavedMessage('Password changed successfully!');
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSavedMessage(''), 3000);
  };

  // Determine if we're in dark mode
  const isDark = resolvedTheme === 'dark';

  // Standardized layout classes
  const containerClasses = `${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 min-h-screen`;
  const cardClasses = `${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`;
  const titleClasses = `${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-bold mb-2`;
  const subtitleClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-8`;
  const textClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'}`;

  // Helper functions for cleaner JSX
  const getContainerClasses = () => 
    `rounded-lg shadow p-8 mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`;

  const getHeadingClasses = () => 
    `text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`;

  const getTextClasses = () => 
    `text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`;

  const getIconColor = (color = 'blue') => {
    const colorMap = {
      blue: isDark ? 'text-blue-400' : 'text-blue-600',
      yellow: isDark ? 'text-yellow-400' : 'text-yellow-600',
      red: isDark ? 'text-red-400' : 'text-red-600',
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={titleClasses}>Settings</h1>
        <p className={subtitleClasses}>Customize your experience and preferences</p>
      </div>

      {/* Saved Message */}
      {savedMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center justify-between">
          <span>✓ {savedMessage}</span>
          <button onClick={() => setSavedMessage('')}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Theme Selection */}
      <div className={getContainerClasses()}>
        <div className="flex items-center gap-3 mb-6">
          <Palette className={getIconColor('blue')} size={24} />
          <h2 className={getHeadingClasses()}>Choose Your Theme</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((t) => {
            const IconComponent = t.icon;
            const isActive = currentTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                  className={`p-6 rounded-lg border-2 transition transform hover:scale-105 ${
                    isActive
                      ? isDark
                        ? 'border-blue-400 bg-blue-900 bg-opacity-20'
                        : 'border-blue-600 bg-blue-50'
                      : isDark
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <IconComponent className={
                      isActive ? 'text-blue-600' : getIconColor()
                    } size={20} />
                    <h3 className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {t.name}
                    </h3>
                  </div>
                  <p className={getTextClasses()}>
                    {t.description}
                  </p>
                  {isActive && (
                    <div className="mt-4 text-center">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                  )}
              </button>
            );
          })}
        </div>
      </div>

        {/* Notification Settings */}
        <div className={getContainerClasses()}>
          <div className="flex items-center gap-3 mb-6">
            <Bell className={getIconColor('yellow')} size={24} />
            <h2 className={getHeadingClasses()}>Notification Preferences</h2>
          </div>

          <div className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
              { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive updates via text message' },
              { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser notifications' },
              { key: 'paymentReminders', label: 'Payment Reminders', description: 'Get reminded when rent is due' },
              { key: 'maintenanceUpdates', label: 'Maintenance Updates', description: 'Get updates on maintenance requests' },
              { key: 'announcementNotifications', label: 'Announcements', description: 'Receive building announcements' },
            ].map(item => (
              <div key={item.key} className={`flex items-center justify-between p-4 rounded-lg ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
              } transition`}>
                <div>
                  <p className={`font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.label}
                  </p>
                  <p className={getTextClasses()}>
                    {item.description}
                  </p>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[item.key]}
                    onChange={() => handleSettingChange(item.key)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {settings[item.key] ? 'On' : 'Off'}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Save size={20} />
            Save Settings
          </button>
          <button className={`px-6 py-3 rounded-lg border-2 transition font-medium ${
            isDark
              ? 'border-gray-700 text-white hover:bg-gray-700'
              : 'border-gray-300 text-gray-900 hover:bg-gray-100'
          }`}>
            Cancel
          </button>
        </div>

        {/* Footer Info */}
        <div className={`mt-12 p-6 rounded-lg ${
          isDark ? 'bg-gray-800' : 'bg-blue-50'
        } border ${
          isDark ? 'border-gray-700' : 'border-blue-200'
        }`}>
          <p className={`font-semibold mb-2 ${
            isDark ? 'text-blue-400' : 'text-blue-900'
          }`}>
            💡 Tip
          </p>
          <p className={isDark ? 'text-gray-400' : 'text-blue-800'}>
            Your preferences are saved to your browser. If you clear your browsing data, your settings may be reset. Email notifications are recommended for important updates about your rent and maintenance.
          </p>
        </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg max-w-md w-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Change Password</h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className={`p-1 rounded hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition`}
              >
                <X size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
              </button>
            </div>
            
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Current Password
                </label>
                <input 
                  type="password" 
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  New Password
                </label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Must be at least 8 characters long
                </p>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirm New Password
                </label>
                <input 
                  type="password" 
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Change Password
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition font-medium ${isDark ? 'border-gray-700 text-white hover:bg-gray-700' : 'border-gray-300 text-gray-900 hover:bg-gray-100'}`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
