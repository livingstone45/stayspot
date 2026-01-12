import React, { useState } from 'react';
import { Bell, Search, User, Menu, X, LogOut, Settings, Clock, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotifications } from '../../../hooks/useNotifications';

const Header = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { allNotifications, unreadCount, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userRoles = {
    'system_admin': 'System Admin',
    'company_admin': 'Company Admin',
    'property_manager': 'Property Manager',
    'landlord': 'Landlord',
    'tenant': 'Tenant'
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'success': return 'bg-green-100 text-green-600';
      case 'warning': return 'bg-yellow-100 text-yellow-600';
      case 'error': return 'bg-red-100 text-red-600';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  const recentNotifications = allNotifications.slice(0, 5);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left section - Menu toggle and logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            >
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SS</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:inline">
                StaySpot
              </span>
            </div>
          </div>

          {/* Middle section - Navigation and Search */}
          <div className="flex-1 max-w-2xl mx-4 flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-6">
              <a href="/relocation" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
                Relocation
              </a>
            </nav>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search properties, tenants, or tasks..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Right section - User menu and notifications */}
          <div className="flex items-center gap-2">
            {/* Search button for mobile */}
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden">
              <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors"
                title="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsNotificationOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Bell className="h-5 w-5" />
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {recentNotifications.length > 0 ? (
                        recentNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                              !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                            onClick={() => {
                              markAsRead(notification.id);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Clock className="h-3 w-3 text-gray-400" />
                                  <p className="text-xs text-gray-500 dark:text-gray-500">
                                    {notification.time || 'Just now'}
                                  </p>
                                  {!notification.read && (
                                    <span className="ml-auto h-2 w-2 bg-blue-600 rounded-full"></span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            No notifications yet
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                      <button
                        onClick={() => {
                          navigate('/management/communications/notifications');
                          setIsNotificationOpen(false);
                        }}
                        className="w-full text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                      >
                        View all notifications →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium">
                  {user?.name ? getInitials(user.name) : 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {userRoles[user?.role] || 'User'}
                  </p>
                </div>
              </button>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-lg">
                          {user?.name ? getInitials(user.name) : 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user?.email || 'user@example.com'}
                          </p>
                          <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-full">
                            {userRoles[user?.role] || 'User'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 space-y-1">
                      <a
                        href={`/${user?.role}/profile`}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span className="font-medium">My Profile</span>
                      </a>
                      <a
                        href={`/${user?.role}/settings`}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span className="font-medium">Account Settings</span>
                      </a>
                    </div>
                    <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition font-medium"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
