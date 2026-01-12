import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const Rating = ({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  readonly = false,
  showValue = false,
  precision = 1,
  className = ""
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  };

  const handleClick = (rating) => {
    if (readonly || !onChange) return;
    onChange(rating);
  };

  const handleMouseEnter = (rating) => {
    if (readonly) return;
    setHoverValue(rating);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverValue(0);
  };

  const getStarValue = (index) => {
    const starValue = index + 1;
    const currentValue = hoverValue || value;
    
    if (precision === 0.5) {
      if (currentValue >= starValue) return 1;
      if (currentValue >= starValue - 0.5) return 0.5;
      return 0;
    }
    
    return currentValue >= starValue ? 1 : 0;
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex">
        {Array.from({ length: max }, (_, index) => {
          const starValue = getStarValue(index);
          const isHalf = starValue === 0.5;
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(index + 1)}
              onMouseEnter={() => handleMouseEnter(index + 1)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={`
                relative focus:outline-none
                ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
                transition-transform duration-150
              `}
            >
              {isHalf ? (
                <div className="relative">
                  <StarOutlineIcon className={`${sizeClasses[size]} text-gray-300`} />
                  <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                    <StarIcon className={`${sizeClasses[size]} text-yellow-400`} />
                  </div>
                </div>
              ) : starValue === 1 ? (
                <StarIcon className={`${sizeClasses[size]} text-yellow-400`} />
              ) : (
                <StarOutlineIcon className={`${sizeClasses[size]} text-gray-300`} />
              )}
            </button>
          );
        })}
      </div>
      
      {showValue && (
        <span className="text-sm text-gray-600 ml-2">
          {value.toFixed(precision === 0.5 ? 1 : 0)} / {max}
        </span>
      )}
    </div>
  );
};

const RatingDisplay = ({ 
  value = 0, 
  max = 5, 
  size = 'md', 
  showValue = true,
  reviewCount,
  className = "" 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex">
        {Array.from({ length: max }, (_, index) => {
          const filled = value > index;
          const isHalf = value > index && value < index + 1;
          
          return (
            <div key={index} className="relative">
              {isHalf ? (
                <>
                  <StarOutlineIcon className={`${sizeClasses[size]} text-gray-300`} />
                  <div 
                    className="absolute inset-0 overflow-hidden" 
                    style={{ width: `${(value - index) * 100}%` }}
                  >
                    <StarIcon className={`${sizeClasses[size]} text-yellow-400`} />
                  </div>
                </>
              ) : filled ? (
                <StarIcon className={`${sizeClasses[size]} text-yellow-400`} />
              ) : (
                <StarOutlineIcon className={`${sizeClasses[size]} text-gray-300`} />
              )}
            </div>
          );
        })}
      </div>
      
      {showValue && (
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <span>{value.toFixed(1)}</span>
          {reviewCount && (
            <span>({reviewCount} reviews)</span>
          )}
        </div>
      )}
    </div>
  );
};

Rating.Display = RatingDisplay;

export default Rating;