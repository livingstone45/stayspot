import React, { useState, useRef, useEffect } from 'react';

const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  label,
  showValue = true,
  formatValue,
  disabled = false,
  className = ""
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleMouseDown = (e) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || disabled) return;
    updateValue(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newValue = min + percentage * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    
    onChange(Math.max(min, Math.min(max, steppedValue)));
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const displayValue = formatValue ? formatValue(value) : value;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          {showValue && (
            <span className="text-sm text-gray-500">{displayValue}</span>
          )}
        </div>
      )}
      
      <div className="relative">
        {/* Track */}
        <div
          ref={sliderRef}
          className={`
            relative h-2 bg-gray-200 rounded-full cursor-pointer
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onMouseDown={handleMouseDown}
        >
          {/* Progress */}
          <div
            className="absolute h-2 bg-primary-600 rounded-full"
            style={{ width: `${percentage}%` }}
          />
          
          {/* Thumb */}
          <div
            className={`
              absolute top-1/2 w-5 h-5 bg-white border-2 border-primary-600 rounded-full
              transform -translate-y-1/2 -translate-x-1/2 cursor-pointer
              ${isDragging ? 'scale-110' : 'hover:scale-105'}
              ${disabled ? 'cursor-not-allowed' : ''}
              transition-transform duration-150
            `}
            style={{ left: `${percentage}%` }}
          />
        </div>
        
        {/* Min/Max Labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatValue ? formatValue(min) : min}</span>
          <span>{formatValue ? formatValue(max) : max}</span>
        </div>
      </div>
    </div>
  );
};

const RangeSlider = ({
  min = 0,
  max = 100,
  step = 1,
  value = [min, max],
  onChange,
  label,
  showValues = true,
  formatValue,
  disabled = false,
  className = ""
}) => {
  const [isDragging, setIsDragging] = useState(null);
  const sliderRef = useRef(null);

  const [minValue, maxValue] = value;
  const minPercentage = ((minValue - min) / (max - min)) * 100;
  const maxPercentage = ((maxValue - min) / (max - min)) * 100;

  const handleMouseDown = (thumb) => (e) => {
    if (disabled) return;
    setIsDragging(thumb);
    updateValue(e, thumb);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || disabled) return;
    updateValue(e, isDragging);
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const updateValue = (e, thumb) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newValue = min + percentage * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    
    if (thumb === 'min') {
      const clampedValue = Math.max(min, Math.min(maxValue, steppedValue));
      onChange([clampedValue, maxValue]);
    } else {
      const clampedValue = Math.max(minValue, Math.min(max, steppedValue));
      onChange([minValue, clampedValue]);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          {showValues && (
            <span className="text-sm text-gray-500">
              {formatValue ? formatValue(minValue) : minValue} - {formatValue ? formatValue(maxValue) : maxValue}
            </span>
          )}
        </div>
      )}
      
      <div className="relative">
        <div
          ref={sliderRef}
          className={`
            relative h-2 bg-gray-200 rounded-full
            ${disabled ? 'opacity-50' : ''}
          `}
        >
          {/* Progress */}
          <div
            className="absolute h-2 bg-primary-600 rounded-full"
            style={{ 
              left: `${minPercentage}%`, 
              width: `${maxPercentage - minPercentage}%` 
            }}
          />
          
          {/* Min Thumb */}
          <div
            className={`
              absolute top-1/2 w-5 h-5 bg-white border-2 border-primary-600 rounded-full
              transform -translate-y-1/2 -translate-x-1/2 cursor-pointer z-10
              ${isDragging === 'min' ? 'scale-110' : 'hover:scale-105'}
              ${disabled ? 'cursor-not-allowed' : ''}
              transition-transform duration-150
            `}
            style={{ left: `${minPercentage}%` }}
            onMouseDown={handleMouseDown('min')}
          />
          
          {/* Max Thumb */}
          <div
            className={`
              absolute top-1/2 w-5 h-5 bg-white border-2 border-primary-600 rounded-full
              transform -translate-y-1/2 -translate-x-1/2 cursor-pointer z-10
              ${isDragging === 'max' ? 'scale-110' : 'hover:scale-105'}
              ${disabled ? 'cursor-not-allowed' : ''}
              transition-transform duration-150
            `}
            style={{ left: `${maxPercentage}%` }}
            onMouseDown={handleMouseDown('max')}
          />
        </div>
      </div>
    </div>
  );
};

Slider.Range = RangeSlider;

export default Slider;