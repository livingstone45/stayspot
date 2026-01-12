import React from 'react';
import { UserIcon } from '@heroicons/react/24/solid';

const Avatar = ({ 
  src, 
  alt, 
  size = "md", 
  name, 
  className = "",
  onClick 
}) => {
  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8", 
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
    "2xl": "h-20 w-20"
  };

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base", 
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl"
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const baseClasses = `
    inline-flex items-center justify-center rounded-full bg-gray-500 
    overflow-hidden ${sizeClasses[size]} ${className}
    ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
  `;

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        onClick={onClick}
        className={baseClasses}
      />
    );
  }

  if (name) {
    return (
      <div 
        onClick={onClick}
        className={`${baseClasses} bg-primary-600 text-white font-medium ${textSizeClasses[size]}`}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div onClick={onClick} className={`${baseClasses} bg-gray-300`}>
      <UserIcon className={`${sizeClasses[size]} text-gray-600`} />
    </div>
  );
};

export default Avatar;