import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Collapsible = ({
  title,
  children,
  defaultOpen = false,
  disabled = false,
  variant = 'default',
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const variants = {
    default: {
      container: 'border border-gray-200 rounded-lg',
      header: 'px-4 py-3 bg-gray-50 hover:bg-gray-100',
      content: 'px-4 py-3 border-t border-gray-200'
    },
    card: {
      container: 'bg-white shadow rounded-lg',
      header: 'px-6 py-4 hover:bg-gray-50',
      content: 'px-6 py-4 border-t border-gray-200'
    },
    minimal: {
      container: '',
      header: 'py-2 hover:bg-gray-50 rounded',
      content: 'py-2'
    }
  };

  const variantStyles = variants[variant];

  return (
    <div className={`${variantStyles.container} ${className}`}>
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between text-left focus:outline-none
          focus:ring-2 focus:ring-primary-500 focus:ring-inset
          ${variantStyles.header}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          transition-colors duration-200
        `}
      >
        <span className="font-medium text-gray-900">{title}</span>
        <div className="ml-2 flex-shrink-0">
          {isOpen ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </button>
      
      {isOpen && (
        <div className={variantStyles.content}>
          {children}
        </div>
      )}
    </div>
  );
};

const CollapsibleGroup = ({ 
  items = [], 
  allowMultiple = false,
  variant = 'default',
  className = "" 
}) => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    
    if (allowMultiple) {
      if (newOpenItems.has(index)) {
        newOpenItems.delete(index);
      } else {
        newOpenItems.add(index);
      }
    } else {
      if (newOpenItems.has(index)) {
        newOpenItems.clear();
      } else {
        newOpenItems.clear();
        newOpenItems.add(index);
      }
    }
    
    setOpenItems(newOpenItems);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <Collapsible
          key={index}
          title={item.title}
          defaultOpen={openItems.has(index)}
          variant={variant}
          className={openItems.has(index) ? 'ring-1 ring-primary-500' : ''}
        >
          <div onClick={() => toggleItem(index)}>
            {item.content}
          </div>
        </Collapsible>
      ))}
    </div>
  );
};

Collapsible.Group = CollapsibleGroup;

export default Collapsible;