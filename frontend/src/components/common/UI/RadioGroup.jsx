import React from 'react';

const RadioGroup = ({
  options = [],
  value,
  onChange,
  name,
  label,
  description,
  disabled = false,
  direction = "vertical",
  size = "md",
  className = ""
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const containerClasses = direction === "horizontal" 
    ? "flex flex-wrap gap-6" 
    : "space-y-3";

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}
      
      {description && (
        <p className="text-sm text-gray-500 mb-3">{description}</p>
      )}

      <div className={containerClasses}>
        {options.map((option) => (
          <div key={option.value} className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={disabled || option.disabled}
                className={`
                  ${sizeClasses[size]} text-primary-600 border-gray-300
                  focus:ring-primary-500 focus:ring-2 focus:ring-offset-0
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />
            </div>
            
            <div className="ml-3">
              <label 
                className={`
                  font-medium text-gray-900 cursor-pointer
                  ${textSizeClasses[size]}
                  ${disabled || option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {option.label}
              </label>
              {option.description && (
                <p className={`
                  text-gray-500 mt-1
                  ${size === 'sm' ? 'text-xs' : 'text-sm'}
                `}>
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;