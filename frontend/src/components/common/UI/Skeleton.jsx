import React from 'react';

const Skeleton = ({ 
  width = "100%", 
  height = "1rem", 
  className = "",
  variant = "rectangular",
  animation = true 
}) => {
  const baseClasses = `
    bg-gray-200 
    ${animation ? 'animate-pulse' : ''}
    ${variant === 'circular' ? 'rounded-full' : 'rounded'}
    ${className}
  `;

  return (
    <div 
      className={baseClasses}
      style={{ width, height }}
    />
  );
};

const SkeletonText = ({ lines = 3, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton 
        key={index}
        height="0.75rem"
        width={index === lines - 1 ? "75%" : "100%"}
      />
    ))}
  </div>
);

const SkeletonCard = ({ className = "" }) => (
  <div className={`p-4 border border-gray-200 rounded-lg ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <Skeleton variant="circular" width="3rem" height="3rem" />
      <div className="flex-1">
        <Skeleton height="1rem" width="60%" className="mb-2" />
        <Skeleton height="0.75rem" width="40%" />
      </div>
    </div>
    <SkeletonText lines={3} />
  </div>
);

const SkeletonTable = ({ rows = 5, columns = 4, className = "" }) => (
  <div className={`space-y-4 ${className}`}>
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} height="1.5rem" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} height="1rem" />
        ))}
      </div>
    ))}
  </div>
);

Skeleton.Text = SkeletonText;
Skeleton.Card = SkeletonCard;
Skeleton.Table = SkeletonTable;

export default Skeleton;