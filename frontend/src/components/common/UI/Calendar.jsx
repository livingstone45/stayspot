import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const Calendar = ({
  selectedDate,
  onDateSelect,
  events = [],
  minDate,
  maxDate,
  className = ""
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      const dayEvents = events.filter(event => 
        isSameDay(new Date(event.date), day)
      );

      const isDisabled = 
        (minDate && day < minDate) || 
        (maxDate && day > maxDate);

      days.push(
        <div
          className={`
            relative p-2 cursor-pointer border border-gray-100 min-h-[80px]
            ${!isSameMonth(day, monthStart) ? 'text-gray-400 bg-gray-50' : 'text-gray-900'}
            ${isSameDay(day, selectedDate) ? 'bg-primary-100 border-primary-300' : 'hover:bg-gray-50'}
            ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          key={day}
          onClick={() => !isDisabled && onDateSelect?.(cloneDay)}
        >
          <span className="text-sm font-medium">{formattedDate}</span>
          
          {dayEvents.length > 0 && (
            <div className="mt-1 space-y-1">
              {dayEvents.slice(0, 2).map((event, index) => (
                <div
                  key={index}
                  className={`
                    text-xs px-1 py-0.5 rounded truncate
                    ${event.type === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                      event.type === 'payment' ? 'bg-green-100 text-green-800' :
                      event.type === 'inspection' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }
                  `}
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{dayEvents.length - 2} more
                </div>
              )}
            </div>
          )}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day}>
        {days}
      </div>
    );
    days = [];
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 border-b">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="divide-y">
        {rows}
      </div>
    </div>
  );
};

export default Calendar;