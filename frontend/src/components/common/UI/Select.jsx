import React, { forwardRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const Select = forwardRef(({
  label,
  options = [],
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  searchable = false,
  multiple = false,
  className = '',
  containerClassName = '',
  labelClassName = '',
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(search.toLowerCase()) ||
        option.value.toString().toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const getSelectedLabel = () => {
    if (multiple) {
      const selectedOptions = options.filter(option => value.includes(option.value));
      if (selectedOptions.length === 0) return placeholder;
      return selectedOptions.map(opt => opt.label).join(', ');
    }
    const selectedOption = options.find(option => option.value === value);
    return selectedOption?.label || placeholder;
  };

  const handleSelect = (optionValue) => {
    if (multiple) {
      const newValue = value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const isSelected = (optionValue) => {
    return multiple ? value.includes(optionValue) : value === optionValue;
  };

  return (
    <div className={`mb-4 relative ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className={`block text-sm font-medium mb-2 ${
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
          } ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          ref={ref}
          id={selectId}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            w-full px-4 py-2 border rounded-lg transition-colors duration-200
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${error ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${className}
          `.trim()}
          {...props}
        >
          <div className="flex items-center justify-between">
            <span className={`truncate ${!value || (multiple && value.length === 0) ? 'text-gray-400 dark:text-gray-500' : ''}`}>
              {getSelectedLabel()}
            </span>
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
          </div>
        </button>

        {isOpen && !disabled && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
              {searchable && (
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
              )}

              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                  No options found
                </div>
              ) : (
                <div className="py-1">
                  {filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`
                        w-full flex items-center justify-between px-4 py-2 text-left
                        hover:bg-gray-100 dark:hover:bg-gray-700
                        transition-colors duration-200
                        ${isSelected(option.value) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {option.icon && (
                          <span className="text-gray-500 dark:text-gray-400">
                            {option.icon}
                          </span>
                        )}
                        <span className={isSelected(option.value) ? 'text-blue-600 dark:text-blue-300 font-medium' : 'text-gray-700 dark:text-gray-300'}>
                          {option.label}
                        </span>
                      </div>
                      {isSelected(option.value) && (
                        <Check className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
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

Select.displayName = 'Select';

export default Select;