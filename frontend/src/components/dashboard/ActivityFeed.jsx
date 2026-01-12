import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  HomeIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

const ActivityFeed = ({
  activities = [],
  loading = false,
  title = 'Recent Activity',
  showFilters = true,
  maxItems = 10,
  onActivityClick,
  emptyMessage = 'No recent activity',
}) => {
  const [filter, setFilter] = useState('all');
  const [filteredActivities, setFilteredActivities] = useState(activities);

  const activityTypes = {
    all: { label: 'All Activities', color: 'gray' },
    property: { label: 'Property Updates', color: 'blue', icon: HomeIcon },
    tenant: { label: 'Tenant Activities', color: 'purple', icon: UserIcon },
    maintenance: { label: 'Maintenance', color: 'orange', icon: WrenchScrewdriverIcon },
    financial: { label: 'Financial', color: 'green', icon: CurrencyDollarIcon },
    document: { label: 'Documents', color: 'indigo', icon: DocumentTextIcon },
    system: { label: 'System', color: 'red', icon: ExclamationTriangleIcon },
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-800',
    failed: 'bg-red-100 text-red-800',
  };

  const sampleActivities = [
    {
      id: 1,
      type: 'property',
      title: 'New property added',
      description: 'Ocean View Villa was added to the portfolio',
      user: 'John Manager',
      userRole: 'Property Manager',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      priority: 'info',
      status: 'completed',
      metadata: { propertyId: '123', action: 'create' },
    },
    {
      id: 2,
      type: 'tenant',
      title: 'Lease application submitted',
      description: 'Sarah Johnson applied for Apartment 4B',
      user: 'Sarah Johnson',
      userRole: 'Applicant',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      priority: 'medium',
      status: 'pending',
      metadata: { applicationId: '456', unitId: '4B' },
    },
    {
      id: 3,
      type: 'maintenance',
      title: 'Maintenance request created',
      description: 'Plumbing issue reported in Unit 3A',
      user: 'Michael Tenant',
      userRole: 'Tenant',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      priority: 'high',
      status: 'in_progress',
      metadata: { requestId: '789', unit: '3A', category: 'plumbing' },
    },
    {
      id: 4,
      type: 'financial',
      title: 'Rent payment received',
      description: '$1,200 received for Unit 2B - January rent',
      user: 'David Owner',
      userRole: 'Property Owner',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      priority: 'info',
      status: 'completed',
      metadata: { amount: 1200, unit: '2B', month: 'January' },
    },
    {
      id: 5,
      type: 'document',
      title: 'Lease agreement signed',
      description: 'New lease agreement for Unit 5C has been digitally signed',
      user: 'Emma Leasing',
      userRole: 'Leasing Agent',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      priority: 'medium',
      status: 'completed',
      metadata: { leaseId: '101', unit: '5C', tenant: 'Robert Chen' },
    },
    {
      id: 6,
      type: 'system',
      title: 'Automated backup completed',
      description: 'Daily system backup completed successfully',
      user: 'System',
      userRole: 'Automated',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      priority: 'low',
      status: 'completed',
      metadata: { backupId: '2024-01-15', size: '2.4GB' },
    },
  ];

  const displayActivities = activities.length > 0 ? activities : sampleActivities;

  useEffect(() => {
    if (filter === 'all') {
      setFilteredActivities(displayActivities.slice(0, maxItems));
    } else {
      setFilteredActivities(
        displayActivities
          .filter(activity => activity.type === filter)
          .slice(0, maxItems)
      );
    }
  }, [filter, displayActivities, maxItems]);

  const getActivityIcon = (type) => {
    const Icon = activityTypes[type]?.icon || ClockIcon;
    const colorClass = `text-${activityTypes[type]?.color || 'gray'}-600`;
    return <Icon className={`h-5 w-5 ${colorClass}`} />;
  };

  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Just now';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {showFilters && (
          <div className="flex space-x-2">
            {Object.entries(activityTypes).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  filter === key
                    ? `bg-${config.color}-100 text-${config.color}-700`
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <ClockIcon className="h-full w-full" />
            </div>
            <p className="mt-2 text-gray-600">{emptyMessage}</p>
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const TypeIcon = activityTypes[activity.type]?.icon || ClockIcon;
            const typeColor = activityTypes[activity.type]?.color || 'gray';

            return (
              <div
                key={activity.id}
                className={`flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                  onActivityClick ? 'hover:shadow-sm' : ''
                }`}
                onClick={() => onActivityClick && onActivityClick(activity)}
              >
                <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-${typeColor}-100 flex items-center justify-center`}>
                  <TypeIcon className={`h-5 w-5 text-${typeColor}-600`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                    <span className="text-xs text-gray-500">
                      {formatTime(activity.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  
                  <div className="flex items-center mt-2 space-x-3">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-600">
                        {activity.user} • {activity.userRole}
                      </span>
                    </div>
                    
                    {activity.priority && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[activity.priority]}`}>
                        {activity.priority.charAt(0).toUpperCase() + activity.priority.slice(1)}
                      </span>
                    )}
                    
                    {activity.status && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[activity.status]}`}>
                        {activity.status.replace('_', ' ').charAt(0).toUpperCase() + activity.status.replace('_', ' ').slice(1)}
                      </span>
                    )}
                  </div>
                </div>

                {activity.status === 'completed' && (
                  <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                )}
              </div>
            );
          })
        )}
      </div>

      {displayActivities.length > maxItems && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => setFilteredActivities(displayActivities)}
            className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all activities ({displayActivities.length})
          </button>
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <DocumentTextIcon className="h-4 w-4 mr-2" />
          Generate Report
        </button>
        <button className="flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          <ClockIcon className="h-4 w-4 mr-2" />
          Mark All Read
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;