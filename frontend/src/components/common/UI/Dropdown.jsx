import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Dropdown = ({ 
  trigger, 
  children, 
  align = "left",
  className = "",
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 transform -translate-x-1/2"
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            inline-flex justify-center items-center w-full rounded-md border border-gray-300 
            shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 
            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {trigger}
          <ChevronDownIcon className={`ml-2 h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className={`
          absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 
          focus:outline-none ${alignmentClasses[align]}
        `}>
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ children, onClick, className = "", disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 
      hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed ${className}
    `}
  >
    {children}
  </button>
);

Dropdown.Item = DropdownItem;

export default Dropdown;