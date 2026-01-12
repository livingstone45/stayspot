import React, { useState } from 'react';
import {
  Menu, X, ChevronDown, LogOut, Settings, User, Bell,
  BarChart3, Building, Users, DollarSign, Wrench, MessageSquare,
  FileText, Calendar, TrendingUp, Home, Shield, HelpCircle,
  Globe, Moon, Sun, Search, Zap, AlertCircle, CheckCircle,
  ClipboardList, Briefcase, PieChart, TrendingDown, Lock,
  Eye, EyeOff, Phone, Mail, MapPin, Clock, MoreVertical, Send, Plus
} from 'lucide-react';

const EnhancedSidebar = ({ isOpen, setIsOpen, currentUser = {} }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const menuSections = [
    {
      title: 'MAIN',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: Home,
          path: '/management',
          badge: null,
          description: 'Overview & analytics'
        }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        {
          id: 'properties',
          label: 'Properties',
          icon: Building,
          description: 'Manage all properties',
          submenu: [
            { label: 'All Properties', path: '/management/properties', icon: Building },
            { label: 'Add Property', path: '/management/properties/add', icon: Plus },
            { label: 'Inspections', path: '/management/properties/inspections', icon: CheckCircle },
            { label: 'Maintenance', path: '/management/maintenance', icon: Wrench },
            { label: 'Repairs', path: '/management/repairs', icon: Zap },
            { label: 'Occupancy', path: '/management/occupancy', icon: Users }
          ]
        },
        {
          id: 'tenants',
          label: 'Tenants',
          icon: Users,
          description: 'Tenant management',
          submenu: [
            { label: 'All Tenants', path: '/management/tenants', icon: Users },
            { label: 'Lease Management', path: '/management/lease', icon: FileText },
            { label: 'Communications', path: '/management/communication', icon: MessageSquare },
            { label: 'Complaints', path: '/management/complaints', icon: AlertCircle },
            { label: 'Payments', path: '/management/tenant-payments', icon: DollarSign },
            { label: 'Documents', path: '/management/tenant-documents', icon: FileText }
          ]
        },
        {
          id: 'tasks',
          label: 'Tasks',
          icon: ClipboardList,
          path: '/management/tasks',
          badge: 5,
          description: 'Task management'
        }
      ]
    },
    {
      title: 'FINANCIAL',
      items: [
        {
          id: 'financial',
          label: 'Financial',
          icon: DollarSign,
          description: 'Financial management',
          submenu: [
            { label: 'Revenue', path: '/management/financial/revenue', icon: TrendingUp },
            { label: 'Expenses', path: '/management/financial/expenses', icon: TrendingDown },
            { label: 'Reports', path: '/management/financial/reports', icon: BarChart3 },
            { label: 'Invoices', path: '/management/financial/invoices', icon: FileText },
            { label: 'Payments', path: '/management/financial/payments', icon: DollarSign },
            { label: 'Budget', path: '/management/financial/budget', icon: PieChart }
          ]
        }
      ]
    },
    {
      title: 'ANALYTICS & REPORTS',
      items: [
        {
          id: 'analytics',
          label: 'Analytics',
          icon: TrendingUp,
          description: 'Analytics & insights',
          submenu: [
            { label: 'Overview', path: '/management/analytics', icon: BarChart3 },
            { label: 'Reports', path: '/management/analytics/reports', icon: FileText },
            { label: 'Occupancy', path: '/management/analytics/occupancy', icon: PieChart },
            { label: 'Performance', path: '/management/analytics/performance', icon: TrendingUp },
            { label: 'Trends', path: '/management/analytics/trends', icon: BarChart3 },
            { label: 'Forecasts', path: '/management/analytics/forecasts', icon: TrendingUp }
          ]
        }
      ]
    },
    {
      title: 'COMMUNICATION',
      items: [
        {
          id: 'messages',
          label: 'Messages',
          icon: MessageSquare,
          path: '/management/messages',
          badge: 3,
          description: 'Messaging system'
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: Bell,
          path: '/management/notifications',
          badge: 2,
          description: 'System notifications'
        }
      ]
    },
    {
      title: 'DOCUMENTS & FILES',
      items: [
        {
          id: 'documents',
          label: 'Documents',
          icon: FileText,
          description: 'Document management',
          submenu: [
            { label: 'All Documents', path: '/management/documents', icon: FileText },
            { label: 'Templates', path: '/management/documents/templates', icon: FileText },
            { label: 'Contracts', path: '/management/documents/contracts', icon: Briefcase },
            { label: 'Agreements', path: '/management/documents/agreements', icon: FileText },
            { label: 'Reports', path: '/management/documents/reports', icon: BarChart3 },
            { label: 'Archive', path: '/management/documents/archive', icon: Clock }
          ]
        }
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        {
          id: 'invitations',
          label: 'Invitations',
          icon: Send,
          description: 'Manage invitations',
          submenu: [
            { label: 'Send Invitation', path: '/management/invitations/send', icon: Send },
            { label: 'Pending', path: '/management/invitations/pending', icon: Clock },
            { label: 'Accepted', path: '/management/invitations/accepted', icon: CheckCircle },
            { label: 'Declined', path: '/management/invitations/declined', icon: AlertCircle }
          ]
        },
        {
          id: 'team',
          label: 'Team',
          icon: Users,
          description: 'Team management',
          submenu: [
            { label: 'Team Members', path: '/management/team', icon: Users },
            { label: 'Roles', path: '/management/team/roles', icon: Shield },
            { label: 'Permissions', path: '/management/team/permissions', icon: Lock },
            { label: 'Activity Log', path: '/management/team/activity', icon: Clock }
          ]
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: Settings,
          description: 'System settings',
          submenu: [
            { label: 'General', path: '/management/settings/general', icon: Settings },
            { label: 'Security', path: '/management/settings/security', icon: Shield },
            { label: 'Integrations', path: '/management/settings/integrations', icon: Zap },
            { label: 'Preferences', path: '/management/settings/preferences', icon: Settings }
          ]
        }
      ]
    },
    {
      title: 'SUPPORT',
      items: [
        {
          id: 'help',
          label: 'Help & Support',
          icon: HelpCircle,
          path: '/help',
          description: 'Get help'
        }
      ]
    }
  ];

  const toggleSubmenu = (id) => {
    setExpandedMenu(expandedMenu === id ? null : id);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  const filteredSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-shadow"
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
        className={`fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } overflow-y-auto shadow-xl`}
      >
        {/* Header */}
        <div className="sticky top-0 p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <Building className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">StaySpot</h1>
              <p className="text-xs text-blue-100">Management Pro</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {currentUser.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentUser.role || 'Property Manager'}
              </p>
            </div>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Menu Sections */}
        <nav className="p-4 space-y-6">
          {filteredSections.map((section) => (
            <div key={section.title}>
              <p className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <div key={item.id}>
                    {item.submenu ? (
                      <>
                        <button
                          onClick={() => toggleSubmenu(item.id)}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors group"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <item.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                            <div className="text-left">
                              <p className="text-sm font-semibold">{item.label}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {item.badge && (
                              <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                                {item.badge}
                              </span>
                            )}
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                expandedMenu === item.id ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </button>
                        {expandedMenu === item.id && (
                          <div className="ml-4 mt-2 space-y-1 border-l-2 border-blue-300 dark:border-blue-700 pl-4">
                            {item.submenu.map((subitem, idx) => (
                              <a
                                key={idx}
                                href={subitem.path}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors group"
                              >
                                <subitem.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                <span>{subitem.label}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <a
                        href={item.path}
                        className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <item.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                          <div className="text-left">
                            <p className="text-sm font-semibold">{item.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                          </div>
                        </div>
                        {item.badge && (
                          <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200 dark:border-gray-700" />

        {/* Theme & Logout */}
        <div className="p-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-500" />
            )}
            <span className="text-sm font-semibold">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            v2.0.0 • ISO 9001:2015
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            © 2024 StaySpot Management
          </p>
        </div>
      </aside>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="md:ml-72 px-6 py-4 flex items-center justify-between">
          <div className="hidden md:block">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Management Dashboard
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Welcome back, {currentUser.name || 'Admin'}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Wrapper */}
      <div className="md:ml-72 pt-20 md:pt-0">
        {/* Content goes here */}
      </div>
    </>
  );
};

export default EnhancedSidebar;
