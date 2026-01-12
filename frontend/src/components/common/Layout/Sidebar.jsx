import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  Wrench, 
  DollarSign, 
  Calendar,
  FileText,
  Settings,
  BarChart3,
  Bell,
  MapPin,
  Home,
  Briefcase,
  ClipboardCheck,
  MessageSquare,
  Shield,
  Globe,
  ChevronDown,
  ChevronRight,
  Moon,
  Sun,
  TrendingUp,
  Send,
  AlertCircle,
  Plug,
  HelpCircle,
  Target,
  Clock,
  Eye,
  PieChart,
  LineChart,
  CheckCircle,
  AlertTriangle,
  Zap,
  CreditCard,
  Inbox,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import MarketInsightsLink from '../MarketInsightsLink';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleSection = (section) => {
    setExpandedSections(prev => (({
      ...prev,
      [section]: !prev[section]
    })));
  };

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const getNavItems = () => {
    const baseItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        path: user?.role === 'landlord' ? '/landlord' : 
              user?.role === 'property_manager' ? '/management' : 
              user?.role === 'company_admin' ? '/company' : 
              user?.role === 'system_admin' ? '/admin' : 
              '/tenant'
      }
    ];

    if (user?.role === 'system_admin') {
      return [
        ...baseItems,
        {
          id: 'users',
          label: 'Users',
          icon: <Users className="h-5 w-5" />,
          path: '/admin/users'
        },
        {
          id: 'roles',
          label: 'Roles & Permissions',
          icon: <Shield className="h-5 w-5" />,
          path: '/admin/roles'
        },
        {
          id: 'system',
          label: 'System Settings',
          icon: <Settings className="h-5 w-5" />,
          path: '/admin/system'
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: <BarChart3 className="h-5 w-5" />,
          path: '/admin/analytics'
        },
        {
          id: 'integrations',
          label: 'Integrations',
          icon: <Globe className="h-5 w-5" />,
          path: '/admin/integrations'
        }
      ];
    }

    if (user?.role === 'company_admin') {
      return [
        ...baseItems,
        {
          id: 'properties',
          label: 'Properties',
          icon: <Building className="h-5 w-5" />,
          path: '/company/properties',
          children: [
            { label: 'All Properties', path: '/company/properties' },
            { label: 'Add Property', path: '/company/properties/add' },
            { label: 'Portfolios', path: '/company/portfolios' }
          ]
        },
        {
          id: 'teams',
          label: 'Team Management',
          icon: <Users className="h-5 w-5" />,
          path: '/company/teams',
          children: [
            { label: 'Team Members', path: '/company/teams' },
            { label: 'Invitations', path: '/company/invitations' },
            { label: 'Roles & Permissions', path: '/company/roles' }
          ]
        },
        {
          id: 'tenants',
          label: 'Tenants',
          icon: <Users className="h-5 w-5" />,
          path: '/company/tenants'
        },
        {
          id: 'maintenance',
          label: 'Maintenance',
          icon: <Wrench className="h-5 w-5" />,
          path: '/company/maintenance'
        },
        {
          id: 'financial',
          label: 'Financial',
          icon: <DollarSign className="h-5 w-5" />,
          path: '/company/financial',
          children: [
            { label: 'Payments', path: '/company/financial/payments' },
            { label: 'Invoices', path: '/company/financial/invoices' },
            { label: 'Reports', path: '/company/financial/reports' }
          ]
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: <BarChart3 className="h-5 w-5" />,
          path: '/company/reports'
        },
        {
          id: 'settings',
          label: 'Company Settings',
          icon: <Settings className="h-5 w-5" />,
          path: '/company/settings'
        }
      ];
    }

    if (user?.role === 'property_manager') {
      return [
        ...baseItems,
        {
          id: 'properties',
          label: 'Properties',
          icon: <Building className="h-5 w-5" />,
          path: '/management/properties',
          children: [
            { label: 'My Properties', path: '/management/properties' },
            { label: 'Add Property', path: '/management/properties/add' },
            { label: 'Property Map', path: '/management/properties/map' },
            { label: 'Occupancy', path: '/management/properties/occupancy' }
          ]
        },
        {
          id: 'tenants',
          label: 'Tenants',
          icon: <Users className="h-5 w-5" />,
          path: '/management/tenants',
          children: [
            { label: 'All Tenants', path: '/management/tenants' },
            { label: 'Active Leases', path: '/management/tenants/active' },
            { label: 'Lease Renewals', path: '/management/tenants/renewals' },
            { label: 'Tenant Directory', path: '/management/tenants/directory' }
          ]
        },
        {
          id: 'tasks',
          label: 'Tasks',
          icon: <ClipboardCheck className="h-5 w-5" />,
          path: '/management/tasks',
          children: [
            { label: 'My Tasks', path: '/management/tasks' },
            { label: 'Assign Tasks', path: '/management/tasks/assign' },
            { label: 'Task Board', path: '/management/tasks/board' },
            { label: 'Completed', path: '/management/tasks/completed' }
          ]
        },
        {
          id: 'maintenance',
          label: 'Maintenance',
          icon: <Wrench className="h-5 w-5" />,
          path: '/management/maintenance',
          children: [
            { label: 'Requests', path: '/management/maintenance' },
            { label: 'Work Orders', path: '/management/maintenance/work-orders' },
            { label: 'Vendors', path: '/management/maintenance/vendors' },
            { label: 'Schedule', path: '/management/maintenance/schedule' }
          ]
        },
        {
          id: 'financial',
          label: 'Financial',
          icon: <DollarSign className="h-5 w-5" />,
          path: '/management/financial',
          children: [
            { label: 'Rent Collection', path: '/management/financial/rent' },
            { label: 'Invoices', path: '/management/financial/invoices' },
            { label: 'Expenses', path: '/management/financial/expenses' },
            { label: 'Reports', path: '/management/financial/reports' }
          ]
        },
        {
          id: 'communications',
          label: 'Communications',
          icon: <MessageSquare className="h-5 w-5" />,
          path: '/management/communications',
          children: [
            { label: 'Messages', path: '/management/communications' },
            { label: 'Announcements', path: '/management/communications/announcements' },
            { label: 'Notifications', path: '/management/communications/notifications' }
          ]
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: <PieChart className="h-5 w-5" />,
          path: '/management/analytics',
          children: [
            { label: 'Overview', path: '/management/analytics' },
            { label: 'Revenue', path: '/management/analytics/revenue' },
            { label: 'Occupancy', path: '/management/analytics/occupancy' },
            { label: 'Performance', path: '/management/analytics/performance' }
          ]
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: <BarChart3 className="h-5 w-5" />,
          path: '/management/reports',
          children: [
            { label: 'Financial Reports', path: '/management/reports/financial' },
            { label: 'Occupancy Reports', path: '/management/reports/occupancy' },
            { label: 'Maintenance Reports', path: '/management/reports/maintenance' },
            { label: 'Export Data', path: '/management/reports/export' }
          ]
        },
        {
          id: 'calendar',
          label: 'Calendar',
          icon: <Calendar className="h-5 w-5" />,
          path: '/management/calendar'
        },
        {
          id: 'documents',
          label: 'Documents',
          icon: <FileText className="h-5 w-5" />,
          path: '/management/documents',
          children: [
            { label: 'Lease Templates', path: '/management/documents/templates' },
            { label: 'Signed Leases', path: '/management/documents/leases' },
            { label: 'Notices', path: '/management/documents/notices' }
          ]
        },
        {
          id: 'alerts',
          label: 'Alerts',
          icon: <AlertTriangle className="h-5 w-5" />,
          path: '/management/alerts'
        },
        {
          id: 'invitations',
          label: 'Invitations',
          icon: <Send className="h-5 w-5" />,
          path: '/management/invitations/send',
          children: [
            { label: 'Send Invitation', path: '/management/invitations/send' },
            { label: 'Pending', path: '/management/invitations/pending' },
            { label: 'Accepted', path: '/management/invitations/accepted' },
            { label: 'Declined', path: '/management/invitations/declined' }
          ]
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <Settings className="h-5 w-5" />,
          path: '/management/settings'
        }
      ];
    }

    if (user?.role === 'landlord') {
      return [
        ...baseItems,
        {
          id: 'properties',
          label: 'My Properties',
          icon: <Home className="h-5 w-5" />,
          path: '/landlord/properties'
        },
        {
          id: 'tenants',
          label: 'Tenants',
          icon: <Users className="h-5 w-5" />,
          path: '/landlord/tenants'
        },
        {
          id: 'communications',
          label: 'Communications',
          icon: <MessageSquare className="h-5 w-5" />,
          path: '/landlord/communications'
        },
        {
          id: 'financial',
          label: 'Financial',
          icon: <DollarSign className="h-5 w-5" />,
          path: '/landlord/financials'
        },
        {
          id: 'maintenance',
          label: 'Maintenance',
          icon: <Wrench className="h-5 w-5" />,
          path: '/landlord/maintenance'
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: <TrendingUp className="h-5 w-5" />,
          path: '/landlord/analytics'
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: <BarChart3 className="h-5 w-5" />,
          path: '/landlord/reports'
        },
        {
          id: 'calendar',
          label: 'Calendar',
          icon: <Calendar className="h-5 w-5" />,
          path: '/landlord/calendar'
        },
        {
          id: 'documents',
          label: 'Documents',
          icon: <FileText className="h-5 w-5" />,
          path: '/landlord/documents'
        },
        {
          id: 'alerts',
          label: 'Alerts',
          icon: <AlertCircle className="h-5 w-5" />,
          path: '/landlord/alerts'
        },
        {
          id: 'integrations',
          label: 'Integrations',
          icon: <Plug className="h-5 w-5" />,
          path: '/landlord/integrations'
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <Settings className="h-5 w-5" />,
          path: '/landlord/settings'
        }
      ];
    }

    if (user?.role === 'tenant') {
      return [
        {
          id: 'dashboard',
          label: 'My Dashboard',
          icon: <LayoutDashboard className="h-5 w-5" />,
          path: '/tenant/dashboard'
        },
        {
          id: 'unit',
          label: 'My Unit',
          icon: <Home className="h-5 w-5" />,
          path: '/tenant/unit'
        },
        {
          id: 'payments',
          label: 'Payments',
          icon: <DollarSign className="h-5 w-5" />,
          path: '/tenant/payments'
        },
        {
          id: 'maintenance',
          label: 'Maintenance',
          icon: <Wrench className="h-5 w-5" />,
          path: '/tenant/maintenance'
        },
        {
          id: 'documents',
          label: 'Documents',
          icon: <FileText className="h-5 w-5" />,
          path: '/tenant/documents'
        },
        {
          id: 'messages',
          label: 'Messages',
          icon: <MessageSquare className="h-5 w-5" />,
          path: '/tenant/messages'
        }
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const NavItem = ({ item, level = 0 }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections[item.id];
    const active = isActive(item.path);

    return (
      <div>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleSection(item.id);
            } else {
              navigate(item.path);
            }
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200 ${
            active && !hasChildren
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </div>
          {hasChildren && (
            <span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </span>
          )}
        </button>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children.map((child, index) => (
              <button
                key={index}
                onClick={() => navigate(child.path)}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isActive(child.path)
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={{ paddingLeft: `${(level + 1) * 20 + 12}px` }}
              >
                {child.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-200 ease-in-out`}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                StaySpot
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role === 'system_admin' && 'System Admin Portal'}
                {user?.role === 'company_admin' && 'Company Dashboard'}
                {user?.role === 'property_manager' && 'Property Management'}
                {user?.role === 'landlord' && 'Landlord Portal'}
                {user?.role === 'tenant' && 'Tenant Portal'}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </div>

          {user?.role === 'company_admin' && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/company/properties/add')}
                  className="w-full flex items-center gap-3 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                >
                  <Home className="h-5 w-5" />
                  <span className="font-medium">Add Property</span>
                </button>
                <button
                  onClick={() => navigate('/company/invitations')}
                  className="w-full flex items-center gap-3 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
                >
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Invite Team Member</span>
                </button>
              </div>
            </div>
          )}

          {user?.role === 'property_manager' && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/management/properties/add')}
                  className="w-full flex items-center gap-3 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                >
                  <Home className="h-5 w-5" />
                  <span className="font-medium">Add Property</span>
                </button>
                <button
                  onClick={() => navigate('/management/tasks/assign')}
                  className="w-full flex items-center gap-3 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
                >
                  <ClipboardCheck className="h-5 w-5" />
                  <span className="font-medium">Assign Task</span>
                </button>
                <button
                  onClick={() => navigate('/management/maintenance')}
                  className="w-full flex items-center gap-3 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors duration-200"
                >
                  <Wrench className="h-5 w-5" />
                  <span className="font-medium">View Maintenance</span>
                </button>
                <button
                  onClick={() => navigate('/management/financial/rent')}
                  className="w-full flex items-center gap-3 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="font-medium">Rent Collection</span>
                </button>
              </div>
            </div>
          )}

          {user?.role === 'landlord' && (
            <MarketInsightsLink />
          )}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium">
              {user?.name?.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDarkMode ? (
                <>
                  <Sun className="h-4 w-4" />
                  <span className="text-sm font-medium">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  <span className="text-sm font-medium">Dark Mode</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                const settingsPath = user?.role === 'landlord' ? '/landlord/settings' :
                                    user?.role === 'property_manager' ? '/management/settings' :
                                    user?.role === 'company_admin' ? '/company/settings' :
                                    user?.role === 'system_admin' ? '/admin/settings' :
                                    '/tenant/settings';
                navigate(settingsPath);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Settings</span>
            </button>

            <button
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">Help</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
