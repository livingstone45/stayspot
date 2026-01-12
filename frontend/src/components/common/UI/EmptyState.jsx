import React from 'react';
import Button from './Button';

const EmptyState = ({ 
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  className = ""
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && (
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <Icon className="h-12 w-12" />
        </div>
      )}
      
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        {title}
      </h3>
      
      {description && (
        <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
          {description}
        </p>
      )}
      
      {action && actionLabel && (
        <div className="mt-6">
          <Button onClick={action} variant="primary">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;