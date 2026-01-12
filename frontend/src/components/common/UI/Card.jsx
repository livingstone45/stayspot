import React from 'react';
import { MoreVertical } from 'lucide-react';

const Card = ({
  children,
  title,
  subtitle,
  actions,
  footer,
  variant = 'default',
  className = '',
  titleClassName = '',
  bodyClassName = '',
  footerClassName = '',
  hoverable = false,
  onClick,
  ...props
}) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg border border-transparent',
    ghost: 'bg-transparent border border-gray-200 dark:border-gray-700',
    primary: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800',
    success: 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800',
    danger: 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800',
  };

  const baseClasses = 'rounded-lg overflow-hidden transition-all duration-200';
  const hoverClasses = hoverable ? 'hover:shadow-md hover:-translate-y-0.5' : '';

  return (
    <div
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${hoverClasses}
        ${className}
        ${onClick ? 'cursor-pointer' : ''}
      `.trim()}
      onClick={onClick}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className={`text-lg font-semibold text-gray-900 dark:text-white truncate ${titleClassName}`}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      <div className={`px-6 py-4 ${bodyClassName}`}>
        {children}
      </div>

      {footer && (
        <div className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 ${className}`}>
    {children}
  </div>
);

export default Card;