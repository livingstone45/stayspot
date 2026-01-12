import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, X } from 'lucide-react';

const ManagementCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 5, 1));
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState({
    '5': { title: 'Maintenance', time: '10:00 AM', type: 'maintenance' },
    '10': { title: 'Meeting', time: '2:00 PM', type: 'meeting' },
    '12': { title: 'Rent', time: '9:00 AM', type: 'financial' },
    '15': { title: 'Walkthrough', time: '11:00 AM', type: 'inspection' },
    '20': { title: 'Lease', time: '1:00 PM', type: 'lease' },
    '25': { title: 'Budget', time: '10:00 AM', type: 'financial' }
  });
  const [formData, setFormData] = useState({ title: '', time: '', type: 'maintenance' });

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDay = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDay(currentDate);
  const days = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const handleEventClick = (day) => {
    if (events[day]) {
      setEditingEvent(day);
      setFormData(events[day]);
    } else {
      setEditingEvent(day);
      setFormData({ title: '', time: '', type: 'maintenance' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (formData.title.trim()) {
      setEvents(prev => ({
        ...prev,
        [editingEvent]: formData
      }));
      setShowModal(false);
      setEditingEvent(null);
      setFormData({ title: '', time: '', type: 'maintenance' });
    }
  };

  const handleDelete = () => {
    setEvents(prev => {
      const newEvents = { ...prev };
      delete newEvents[editingEvent];
      return newEvents;
    });
    setShowModal(false);
    setEditingEvent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Click events to edit or add new events</p>
          </div>
          <button
            onClick={() => {
              setEditingEvent(null);
              setFormData({ title: '', time: '', type: 'maintenance' });
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Event
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{monthName}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 text-sm py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((day, idx) => (
                <div
                  key={idx}
                  onClick={() => day && handleEventClick(day)}
                  className={`min-h-24 p-2 rounded-lg border cursor-pointer transition-all ${
                    day
                      ? events[day]
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800'
                  }`}
                >
                  {day && (
                    <>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{day}</p>
                      {events[day] && (
                        <div className="mt-1 text-xs px-2 py-1 rounded bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 truncate font-medium">
                          {events[day].title}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Upcoming Events</h2>
            <div className="space-y-3">
              {Object.entries(events).map(([day, event]) => (
                <div
                  key={day}
                  onClick={() => handleEventClick(day)}
                  className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <p className="font-medium text-sm">Jun {day} - {event.title}</p>
                  <p className="text-xs mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Event Types</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Maintenance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-purple-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Meeting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Financial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingEvent ? `Edit Event - June ${editingEvent}` : 'Add Event'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Event title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="maintenance">Maintenance</option>
                <option value="meeting">Meeting</option>
                <option value="financial">Financial</option>
                <option value="inspection">Inspection</option>
                <option value="lease">Lease</option>
              </select>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                {editingEvent && events[editingEvent] && (
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementCalendar;
