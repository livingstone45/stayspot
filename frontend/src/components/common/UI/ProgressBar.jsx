import React from 'react';

const ProgressBar = ({ 
  value, 
  max = 100, 
  size = "md", 
  color = "primary",
  showLabel = false,
  label,
  className = ""
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeClasses = {
    sm: "h-2",
    md: "h-3", 
    lg: "h-4"
  };

  const colorClasses = {
    primary: "bg-primary-600",
    success: "bg-green-600",
    warning: "bg-yellow-600", 
    danger: "bg-red-600",
    info: "bg-blue-600"
  };

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex justify-between text-sm text-gray-700 mb-1">
          <span>{label}</span>
          {showLabel && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div 
          className={`${sizeClasses[size]} rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;