import React from 'react';

const Spinner = ({ 
  size = 'md', 
  color = 'primary',
  className = "" 
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

const SpinnerOverlay = ({ 
  show = false, 
  message = "Loading...",
  size = 'lg',
  className = "" 
}) => {
  if (!show) return null;

  return (
    <div className={`
      fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50
      ${className}
    `}>
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
        <Spinner size={size} />
        {message && (
          <p className="text-gray-700 text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

const SpinnerButton = ({ 
  loading = false, 
  children, 
  disabled,
  className = "",
  ...props 
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center
        ${loading ? 'cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <Spinner 
          size="sm" 
          color="white" 
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" 
        />
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
};

Spinner.Overlay = SpinnerOverlay;
Spinner.Button = SpinnerButton;

export default Spinner;