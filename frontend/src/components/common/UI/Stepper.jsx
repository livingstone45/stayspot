import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

const Stepper = ({ 
  steps = [], 
  currentStep = 0, 
  orientation = 'horizontal',
  className = "" 
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={`${isHorizontal ? 'flex items-center' : 'flex flex-col'} ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <div key={index} className={`
            flex items-center
            ${isHorizontal ? 'flex-row' : 'flex-col'}
            ${index < steps.length - 1 ? (isHorizontal ? 'flex-1' : 'mb-4') : ''}
          `}>
            <div className={`
              flex items-center
              ${isHorizontal ? 'flex-row' : 'flex-col text-center'}
            `}>
              {/* Step Circle */}
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium
                ${isCompleted 
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : isCurrent
                  ? 'border-primary-600 text-primary-600 bg-white'
                  : 'border-gray-300 text-gray-500 bg-white'
                }
              `}>
                {isCompleted ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <div className={`
                ${isHorizontal ? 'ml-3' : 'mt-2'}
              `}>
                <div className={`
                  text-sm font-medium
                  ${isCurrent ? 'text-primary-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'}
                `}>
                  {step.title}
                </div>
                {step.description && (
                  <div className={`
                    text-xs mt-1
                    ${isCurrent ? 'text-primary-500' : 'text-gray-400'}
                  `}>
                    {step.description}
                  </div>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`
                ${isHorizontal 
                  ? 'flex-1 h-0.5 mx-4' 
                  : 'w-0.5 h-8 mx-auto'
                }
                ${isCompleted ? 'bg-primary-600' : 'bg-gray-300'}
              `} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;