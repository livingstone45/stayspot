import React, { useState } from 'react';
import {
  PlusIcon,
  ArrowUpTrayIcon,
  UserPlusIcon,
  DocumentPlusIcon,
  HomeIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  BellIcon,
  CogIcon,
  ChartBarIcon,
  UsersIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({
  userRole,
  title = 'Quick Actions',
  showHeader = true,
  columns = 3,
  onActionClick,
  customActions = [],
}) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  // Default actions available for all roles
  const defaultActions = [
    {
      id: 'add_property',
      label: 'Add Property',
      description: 'Add new property to portfolio',
      icon: HomeIcon,
      color: 'blue',
      roles: ['system_admin', 'company_admin', 'property_manager', 'landlord'],
      path: '/properties/add',
      shortcut: 'P',
    },
    {
      id: 'upload_properties',
      label: 'Bulk Upload',
      description: 'Upload multiple properties',
      icon: ArrowUpTrayIcon,
      color: 'purple',
      roles: ['system_admin', 'company_admin', 'property_manager'],
      path: '/properties/upload',
      shortcut: 'B',
    },
    {
      id: 'invite_user',
      label: 'Invite User',
      description: 'Invite team members or tenants',
      icon: UserPlusIcon,
      color: 'green',
      roles: ['system_admin', 'company_admin', 'property_manager'],
      path: '/team/invite',
      shortcut: 'I',
    },
    {
      id: 'create_maintenance',
      label: 'Maintenance Request',
      description: 'Create new maintenance ticket',
      icon: WrenchScrewdriverIcon,
      color: 'orange',
      roles: ['system_admin', 'company_admin', 'property_manager', 'landlord', 'tenant', 'maintenance_tech'],
      path: '/maintenance/create',
      shortcut: 'M',
    },
    {
      id: 'record_payment',
      label: 'Record Payment',
      description: 'Record rent or expense payment',
      icon: CurrencyDollarIcon,
      color: 'emerald',
      roles: ['system_admin', 'company_admin', 'property_manager', 'landlord'],
      path: '/financial/payments/record',
      shortcut: '$',
    },
    {
      id: 'generate_report',
      label: 'Generate Report',
      description: 'Create financial or occupancy report',
      icon: ChartBarIcon,
      color: 'indigo',
      roles: ['system_admin', 'company_admin', 'property_manager', 'landlord'],
      path: '/reports/generate',
      shortcut: 'R',
    },
    {
      id: 'add_document',
      label: 'Add Document',
      description: 'Upload lease or property document',
      icon: DocumentPlusIcon,
      color: 'pink',
      roles: ['system_admin', 'company_admin', 'property_manager', 'landlord', 'tenant'],
      path: '/documents/upload',
      shortcut: 'D',
    },
    {
      id: 'send_notification',
      label: 'Send Notification',
      description: 'Send announcement to tenants',
      icon: BellIcon,
      color: 'yellow',
      roles: ['system_admin', 'company_admin', 'property_manager', 'landlord'],
      path: '/communication/notify',
      shortcut: 'N',
    },
    {
      id: 'manage_team',
      label: 'Manage Team',
      description: 'View and manage team members',
      icon: UsersIcon,
      color: 'cyan',
      roles: ['system_admin', 'company_admin'],
      path: '/team/manage',
      shortcut: 'T',
    },
    {
      id: 'system_settings',
      label: 'System Settings',
      description: 'Configure system preferences',
      icon: CogIcon,
      color: 'gray',
      roles: ['system_admin'],
      path: '/system/settings',
      shortcut: 'S',
    },
    {
      id: 'view_portfolio',
      label: 'View Portfolio',
      description: 'See all properties overview',
      icon: BuildingOfficeIcon,
      color: 'teal',
      roles: ['system_admin', 'company_admin', 'property_manager', 'landlord'],
      path: '/properties/portfolio',
      shortcut: 'V',
    },
    {
      id: 'quick_tour',
      label: 'Take a Tour',
      description: 'Learn about dashboard features',
      icon: PlusIcon,
      color: 'amber',
      roles: ['system_admin', 'company_admin', 'property_manager', 'landlord', 'tenant'],
      path: '/help/tour',
      shortcut: '?',
    },
  ];

  // Role-specific actions
  const roleBasedActions = {
    tenant: [
      {
        id: 'pay_rent',
        label: 'Pay Rent',
        description: 'Make rental payment',
        icon: CurrencyDollarIcon,
        color: 'green',
        path: '/tenant/payments/pay',
        shortcut: 'P',
      },
      {
        id: 'request_maintenance',
        label: 'Request Maintenance',
        description: 'Submit maintenance request',
        icon: WrenchScrewdriverIcon,
        color: 'orange',
        path: '/tenant/maintenance/request',
        shortcut: 'M',
      },
      {
        id: 'view_documents',
        label: 'View Documents',
        description: 'Access lease and documents',
        icon: DocumentPlusIcon,
        color: 'blue',
        path: '/tenant/documents',
        shortcut: 'D',
      },
      {
        id: 'contact_manager',
        label: 'Contact Manager',
        description: 'Message property manager',
        icon: BellIcon,
        color: 'purple',
        path: '/tenant/messages/new',
        shortcut: 'C',
      },
    ],
    maintenance_tech: [
      {
        id: 'view_assignments',
        label: 'My Assignments',
        description: 'View assigned work orders',
        icon: WrenchScrewdriverIcon,
        color: 'orange',
        path: '/maintenance/assignments',
        shortcut: 'A',
      },
      {
        id: 'update_status',
        label: 'Update Status',
        description: 'Update work order progress',
        icon: CogIcon,
        color: 'blue',
        path: '/maintenance/status',
        shortcut: 'U',
      },
      {
        id: 'add_notes',
        label: 'Add Notes',
        description: 'Add notes to work orders',
        icon: DocumentPlusIcon,
        color: 'green',
        path: '/maintenance/notes',
        shortcut: 'N',
      },
    ],
  };

  // Combine actions based on user role
  const getFilteredActions = () => {
    let actions = [...defaultActions, ...customActions];
    
    // Filter by user role
    if (userRole) {
      actions = actions.filter(action => 
        !action.roles || action.roles.includes(userRole)
      );
    }
    
    // Add role-specific actions
    if (roleBasedActions[userRole]) {
      actions = [...actions, ...roleBasedActions[userRole]];
    }
    
    return expanded ? actions : actions.slice(0, 6);
  };

  const actions = getFilteredActions();
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }[columns] || 'grid-cols-2 md:grid-cols-3';

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
    indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
    pink: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
    yellow: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
    cyan: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100',
    gray: 'bg-gray-50 text-gray-600 hover:bg-gray-100',
    teal: 'bg-teal-50 text-teal-600 hover:bg-teal-100',
    amber: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
  };

  const handleActionClick = (action) => {
    if (onActionClick) {
      onActionClick(action);
    } else if (action.path) {
      navigate(action.path);
    }
  };

  // Keyboard shortcut listener
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      // Only trigger if not typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      const action = actions.find(a => 
        a.shortcut && a.shortup.toLowerCase() === e.key.toLowerCase()
      );
      
      if (action) {
        handleActionClick(action);
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [actions]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Quickly access common tasks and features
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              Press <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-700">?</kbd> for shortcuts
            </span>
          </div>
        </div>
      )}

      <div className={`grid ${gridCols} gap-4`}>
        {actions.map((action) => {
          const Icon = action.icon;
          const colorClass = colorClasses[action.color] || colorClasses.blue;
          
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`group relative flex flex-col items-center justify-center p-4 rounded-xl transition-all ${colorClass} hover:scale-[1.02] active:scale-[0.98]`}
              title={`${action.label}: ${action.description} (Press ${action.shortcut})`}
            >
              <div className="mb-3">
                <Icon className="h-8 w-8" />
              </div>
              <h4 className="text-sm font-medium mb-1">{action.label}</h4>
              <p className="text-xs text-gray-600 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                {action.description}
              </p>
              
              {/* Keyboard shortcut badge */}
              {action.shortcut && (
                <div className="absolute top-2 right-2">
                  <span className="text-xs font-mono bg-white/80 text-gray-700 px-1.5 py-0.5 rounded">
                    {action.shortcut}
                  </span>
                </div>
              )}
              
              {/* Quick action indicator */}
              <div className="absolute bottom-2 left-2 w-6 h-1 bg-current opacity-20 rounded-full"></div>
            </button>
          );
        })}
        
        {/* Add custom action button */}
        {customActions.length === 0 && userRole === 'system_admin' && (
          <button
            onClick={() => navigate('/system/quick-actions/customize')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
          >
            <PlusIcon className="h-8 w-8 mb-3" />
            <h4 className="text-sm font-medium">Customize</h4>
            <p className="text-xs mt-1">Add custom quick actions</p>
          </button>
        )}
      </div>

      {actions.length > 6 && (
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            {expanded ? (
              <>
                Show Less
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                Show More Actions ({actions.length - 6} more)
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* Recent actions (if available) */}
      {userRole && ['system_admin', 'company_admin', 'property_manager'].includes(userRole) && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recently Used</h4>
          <div className="flex flex-wrap gap-2">
            {actions.slice(0, 3).map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 text-sm font-medium transition-colors"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Pre-configured QuickActions for different user roles
export const SystemAdminQuickActions = (props) => (
  <QuickActions
    userRole="system_admin"
    title="System Administration"
    columns={4}
    {...props}
  />
);

export const CompanyAdminQuickActions = (props) => (
  <QuickActions
    userRole="company_admin"
    title="Company Management"
    columns={3}
    {...props}
  />
);

export const PropertyManagerQuickActions = (props) => (
  <QuickActions
    userRole="property_manager"
    title="Property Management"
    columns={3}
    {...props}
  />
);

export const LandlordQuickActions = (props) => (
  <QuickActions
    userRole="landlord"
    title="Owner Dashboard"
    columns={2}
    {...props}
  />
);

export const TenantQuickActions = (props) => (
  <QuickActions
    userRole="tenant"
    title="Tenant Portal"
    columns={2}
    {...props}
  />
);

export default QuickActions;