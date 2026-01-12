import React from 'react';

const Loader = ({ size = 'md', variant = 'primary', className = '' }) => {
  const sizes = {
    xs: 'h-4 w-4 border-2',
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  };

  const variants = {
    primary: 'border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400',
    white: 'border-gray-200 border-t-white',
    gray: 'border-gray-200 border-t-gray-600',
    success: 'border-green-200 border-t-green-600',
    warning: 'border-yellow-200 border-t-yellow-600',
    danger: 'border-red-200 border-t-red-600',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          ${sizes[size]}
          ${variants[variant]}
          rounded-full animate-spin
          ${className}
        `}
      />
    </div>
  );
};

export const LoadingOverlay = ({ message = 'Loading...', className = '' }) => (
  <div className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}>
    <div className="text-center">
      <Loader size="lg" />
      {message && (
        <p className="mt-4 text-white font-medium">{message}</p>
      )}
    </div>
  </div>
);

export const LoadingSpinner = ({ size = 'md', className = '' }) => (
  <div className={`inline-flex items-center justify-center ${className}`}>
    <Loader size={size} />
  </div>
);

export default Loader;