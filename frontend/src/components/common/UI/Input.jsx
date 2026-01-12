import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  required = false,
  disabled = false,
  prefix,
  suffix,
  className = '',
  containerClassName = '',
  labelClassName = '',
  ...props
}, ref) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const inputClasses = `
    w-full px-4 py-2 border rounded-lg transition-colors duration-200
    bg-white dark:bg-gray-800
    text-gray-900 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${error ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${prefix ? 'pl-10' : ''}
    ${suffix ? 'pr-10' : ''}
    ${className}
  `.trim();

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium mb-2 ${
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
          } ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400">{prefix}</span>
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />

        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400">{suffix}</span>
          </div>
        )}

        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;