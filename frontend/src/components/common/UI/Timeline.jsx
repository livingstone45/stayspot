import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const Timeline = ({ events = [], className = "" }) => {
  return (
    <div className={`flow-root ${className}`}>
      <ul className="-mb-8">
        {events.map((event, index) => (
          <li key={event.id || index}>
            <div className="relative pb-8">
              {index !== events.length - 1 && (
                <span 
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" 
                  aria-hidden="true" 
                />
              )}
              
              <div className="relative flex space-x-3">
                {/* Event Icon */}
                <div className={`
                  flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white
                  ${event.type === 'success' ? 'bg-green-500' :
                    event.type === 'warning' ? 'bg-yellow-500' :
                    event.type === 'error' ? 'bg-red-500' :
                    'bg-gray-400'
                  }
                `}>
                  {event.icon ? (
                    <event.icon className="h-5 w-5 text-white" />
                  ) : (
                    <div className="h-2 w-2 bg-white rounded-full" />
                  )}
                </div>

                {/* Event Content */}
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-900">
                      {event.title}
                      {event.user && (
                        <span className="font-medium text-gray-900"> by {event.user}</span>
                      )}
                    </p>
                    {event.description && (
                      <p className="mt-1 text-sm text-gray-500">{event.description}</p>
                    )}
                    {event.metadata && (
                      <div className="mt-2 text-xs text-gray-400">
                        {Object.entries(event.metadata).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span> {value}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime={event.timestamp}>
                      {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;