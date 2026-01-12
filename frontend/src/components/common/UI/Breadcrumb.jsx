import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

const Breadcrumb = ({ items = [], className = "" }) => {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
            )}
            
            {item.href ? (
              <Link
                to={item.href}
                className={`
                  text-sm font-medium hover:text-gray-700 transition-colors
                  ${index === items.length - 1 
                    ? 'text-gray-500 cursor-default pointer-events-none' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {index === 0 && item.icon !== false && (
                  <HomeIcon className="h-4 w-4 inline mr-1" />
                )}
                {item.label}
              </Link>
            ) : (
              <span className={`
                text-sm font-medium
                ${index === items.length - 1 ? 'text-gray-500' : 'text-gray-600'}
              `}>
                {index === 0 && item.icon !== false && (
                  <HomeIcon className="h-4 w-4 inline mr-1" />
                )}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;