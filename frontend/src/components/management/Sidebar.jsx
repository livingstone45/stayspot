import React, { useState } from 'react';
import {
  Menu, X, ChevronDown, LogOut, Settings, User, Bell,
  BarChart3, Building, Users, DollarSign, Wrench, MessageSquare,
  FileText, Calendar, TrendingUp, Home, Shield, HelpCircle,
  Globe, Moon, Sun, Search, Mail
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, currentUser = {} }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/management',
      badge: null
    },
    {
      id: 'properties',
      label: 'Properties',
      icon: Building,
      submenu: [
        { label: 'All Properties', path: '/management/properties' },
        { label: 'Add Property', path: '/management/properties/add' },
        { label: 'Inspections', path: '/management/properties/inspections' },
        { label: 'Maintenance', path: '/management/maintenance' }
      ]
    },
    {
      id: 'tenants',
      label: 'Tenants',
      icon: Users,
      submenu: [
        { label: 'All Tenants', path: '/management/tenants' },
        { label: 'Lease Management', path: '/management/lease' },
        { label: 'Communications', path: '/management/communication' },
        { label: 'Complaints', path: '/management/complaints' }
      ]
    },
    {
      id: 'financial',
      label: 'Financial',
      icon: DollarSign,
      submenu: [
        { label: 'Revenue', path: '/management/financial/revenue' },
        { label: 'Expenses', path: '/management/financial/expenses' },
        { label: 'Reports', path: '/management/financial/reports' },
        { label: 'Invoices', path: '/management/financial/invoices' }
      ]
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: Calendar,
      path: '/management/tasks',
      badge: 5
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      submenu: [
        { label: 'Overview', path: '/management/analytics' },
        { label: 'Reports', path: '/management/analytics/reports' },
        { label: 'Occupancy', path: '/management/analytics/occupancy' },
        { label: 'Performance', path: '/management/analytics/performance' }
      ]
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      path: '/management/documents'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      path: '/management/messages',
      badge: 3
    },
    {
      id: 'invitations',
      label: 'Invitations',
      icon: Mail,
      path: '/management/invitations',
      badge: 2
    }
  ];

  const bottomMenuItems = [
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      path: '/help'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings'
    }
  ];

  const toggleSubmenu = (id) => {
    setExpandedMenu(expandedMenu === id ? null : id);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-blue-600 text-white"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } overflow-y-auto`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">StaySpot</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Management</p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {currentUser.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentUser.role || 'Property Manager'}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Main Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.id)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedMenu === item.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedMenu === item.id && (
                    <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                      {item.submenu.map((subitem, idx) => (
                        <a
                          key={idx}
                          href={subitem.path}
                          className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          {subitem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a
                  href={item.path}
                  className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </a>
              )}
            </div>
          ))}
        </nav>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200 dark:border-gray-800" />

        {/* Bottom Menu */}
        <nav className="p-4 space-y-2">
          {bottomMenuItems.map((item) => (
            <a
              key={item.id}
              href={item.path}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Theme & Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            v1.0.0 • ISO 9001:2015
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            © 2024 StaySpot Management
          </p>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="md:ml-64">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="hidden md:block">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Management Dashboard
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-800">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {currentUser.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {currentUser.role || 'Manager'}
                  </p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default Sidebar;
