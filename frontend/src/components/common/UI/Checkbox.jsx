import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

const Checkbox = ({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  indeterminate = false,
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

  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          ref={(input) => {
            if (input) input.indeterminate = indeterminate;
          }}
          className={`
            ${sizeClasses[size]} text-primary-600 border-gray-300 rounded
            focus:ring-primary-500 focus:ring-2 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />
      </div>
      
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label className={`
              font-medium text-gray-900 cursor-pointer
              ${textSizeClasses[size]}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}>
              {label}
            </label>
          )}
          {description && (
            <p className={`
              text-gray-500 mt-1
              ${size === 'sm' ? 'text-xs' : 'text-sm'}
            `}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const CheckboxGroup = ({ 
  options = [], 
  value = [], 
  onChange, 
  label,
  className = "" 
}) => {
  const handleChange = (optionValue, checked) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter(v => v !== optionValue));
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            checked={value.includes(option.value)}
            onChange={(checked) => handleChange(option.value, checked)}
            label={option.label}
            description={option.description}
          />
        ))}
      </div>
    </div>
  );
};

Checkbox.Group = CheckboxGroup;

export default Checkbox;