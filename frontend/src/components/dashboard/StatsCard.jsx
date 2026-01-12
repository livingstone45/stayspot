import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, CurrencyDollarIcon, HomeIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  color = 'blue',
  loading = false,
  format = 'number',
  prefix = '',
  suffix = '',
  onClick 
}) => {
  const icons = {
    revenue: CurrencyDollarIcon,
    properties: HomeIcon,
    tenants: UserGroupIcon,
    occupancy: ClockIcon,
  };

  const IconComponent = typeof icon === 'string' ? icons[icon] : icon;
  
  const colors = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-100 text-blue-600',
      text: 'text-blue-600',
    },
    green: {
      bg: 'bg-green-50',
      icon: 'bg-green-100 text-green-600',
      text: 'text-green-600',
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'bg-orange-100 text-orange-600',
      text: 'text-orange-600',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-purple-100 text-purple-600',
      text: 'text-purple-600',
    },
    red: {
      bg: 'bg-red-50',
      icon: 'bg-red-100 text-red-600',
      text: 'text-red-600',
    },
  };

  const selectedColor = colors[color] || colors.blue;

  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    }
    
    if (format === 'percent') {
      return `${val}%`;
    }
    
    return `${prefix}${val.toLocaleString()}${suffix}`;
  };

  return (
    <div 
      className={`${selectedColor.bg} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${onClick ? 'hover:scale-[1.02] transition-transform' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900">
              {formatValue(value)}
            </p>
          )}
          
          {change !== undefined && !loading && (
            <div className="flex items-center mt-2">
              {changeType === 'increase' ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}% {changeType === 'increase' ? 'increase' : 'decrease'}
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          )}
        </div>
        
        {IconComponent && (
          <div className={`${selectedColor.icon} p-3 rounded-lg`}>
            <IconComponent className="h-6 w-6" />
          </div>
        )}
      </div>
      
      {/* Additional context or action button */}
      {onClick && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
            View details
            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

// Example usage with predefined types
export const RevenueCard = ({ value, change, loading, onClick }) => (
  <StatsCard
    title="Monthly Revenue"
    value={value}
    change={change}
    changeType={change >= 0 ? 'increase' : 'decrease'}
    icon="revenue"
    color="green"
    format="currency"
    loading={loading}
    onClick={onClick}
  />
);

export const PropertiesCard = ({ value, change, loading, onClick }) => (
  <StatsCard
    title="Total Properties"
    value={value}
    change={change}
    changeType={change >= 0 ? 'increase' : 'decrease'}
    icon="properties"
    color="blue"
    loading={loading}
    onClick={onClick}
  />
);

export const TenantsCard = ({ value, change, loading, onClick }) => (
  <StatsCard
    title="Active Tenants"
    value={value}
    change={change}
    changeType={change >= 0 ? 'increase' : 'decrease'}
    icon="tenants"
    color="purple"
    loading={loading}
    onClick={onClick}
  />
);

export const OccupancyCard = ({ value, change, loading, onClick }) => (
  <StatsCard
    title="Occupancy Rate"
    value={value}
    change={change}
    changeType={change >= 0 ? 'increase' : 'decrease'}
    icon="occupancy"
    color="orange"
    format="percent"
    loading={loading}
    onClick={onClick}
  />
);

export default StatsCard;