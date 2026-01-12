import React from 'react';

const Switch = ({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  className = ""
}) => {
  const sizeClasses = {
    sm: {
      container: "h-5 w-9",
      toggle: "h-4 w-4",
      translate: "translate-x-4"
    },
    md: {
      container: "h-6 w-11", 
      toggle: "h-5 w-5",
      translate: "translate-x-5"
    },
    lg: {
      container: "h-7 w-14",
      toggle: "h-6 w-6", 
      translate: "translate-x-7"
    }
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const classes = sizeClasses[size];

  return (
    <div className={`flex items-start ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && onChange?.(!checked)}
        disabled={disabled}
        className={`
          relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full
          cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none
          focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
          ${classes.container}
          ${checked ? 'bg-primary-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block rounded-full bg-white shadow transform
            ring-0 transition ease-in-out duration-200
            ${classes.toggle}
            ${checked ? classes.translate : 'translate-x-0'}
          `}
        />
      </button>
      
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

export default Switch;