import React from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const Alert = ({
  type = "info",
  title,
  message,
  onClose,
  actions,
  className = ""
}) => {
  const config = {
    success: {
      icon: CheckCircleIcon,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-400",
      titleColor: "text-green-800",
      textColor: "text-green-700"
    },
    error: {
      icon: XCircleIcon,
      bgColor: "bg-red-50",
      borderColor: "border-red-200", 
      iconColor: "text-red-400",
      titleColor: "text-red-800",
      textColor: "text-red-700"
    },
    warning: {
      icon: ExclamationTriangleIcon,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-400", 
      titleColor: "text-yellow-800",
      textColor: "text-yellow-700"
    },
    info: {
      icon: InformationCircleIcon,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-400",
      titleColor: "text-blue-800", 
      textColor: "text-blue-700"
    }
  };

  const { icon: Icon, bgColor, borderColor, iconColor, titleColor, textColor } = config[type];

  return (
    <div className={`
      rounded-md border p-4 ${bgColor} ${borderColor} ${className}
    `}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${titleColor}`}>
              {title}
            </h3>
          )}
          
          {message && (
            <div className={`${title ? 'mt-2' : ''} text-sm ${textColor}`}>
              {typeof message === 'string' ? <p>{message}</p> : message}
            </div>
          )}
          
          {actions && (
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={action.onClick}
                    className={`
                      rounded-md px-2 py-1.5 text-sm font-medium focus:outline-none
                      focus:ring-2 focus:ring-offset-2 focus:ring-offset-${bgColor.split('-')[1]}-50
                      ${action.primary 
                        ? `${titleColor} hover:bg-${bgColor.split('-')[1]}-100 focus:ring-${bgColor.split('-')[1]}-600`
                        : `${textColor} hover:bg-${bgColor.split('-')[1]}-100 focus:ring-${bgColor.split('-')[1]}-600`
                      }
                    `}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`
                  inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${iconColor} hover:${bgColor} focus:ring-offset-${bgColor.split('-')[1]}-50 focus:ring-${bgColor.split('-')[1]}-600
                `}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;