import React from 'react';

const StatusBadge = ({ status, size = "md", className = "" }) => {
  const statusConfig = {
    active: { color: 'bg-green-100 text-green-800', label: 'Active' },
    inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
    rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
    completed: { color: 'bg-blue-100 text-blue-800', label: 'Completed' },
    cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
    published: { color: 'bg-green-100 text-green-800', label: 'Published' },
    archived: { color: 'bg-gray-100 text-gray-800', label: 'Archived' },
    overdue: { color: 'bg-red-100 text-red-800', label: 'Overdue' },
    paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
    unpaid: { color: 'bg-red-100 text-red-800', label: 'Unpaid' },
    partial: { color: 'bg-yellow-100 text-yellow-800', label: 'Partial' },
    occupied: { color: 'bg-green-100 text-green-800', label: 'Occupied' },
    vacant: { color: 'bg-gray-100 text-gray-800', label: 'Vacant' },
    maintenance: { color: 'bg-orange-100 text-orange-800', label: 'Maintenance' }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <span className={`
      inline-flex items-center rounded-full font-medium
      ${config.color} ${sizeClasses[size]} ${className}
    `}>
      {config.label}
    </span>
  );
};

export default StatusBadge;