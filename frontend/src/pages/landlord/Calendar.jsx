import React, { useState } from 'react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { useAuth } from '../../hooks/useAuth';
import { Calendar, ChevronLeft, ChevronRight, Plus, X, Clock, MapPin, Users } from 'lucide-react';

const CalendarPage = () => {
  const { isDark } = useThemeMode();
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 11));
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', type: 'meeting', time: '', description: '', priority: 'medium' });
  const [events, setEvents] = useState([
    { id: 1, date: '2025-12-25', title: 'Lease Renewal - Unit 101', type: 'renewal', time: '10:00 AM', description: 'Annual lease renewal', priority: 'high' },
    { id: 2, date: '2025-12-28', title: 'Property Inspection', type: 'inspection', time: '2:00 PM', description: 'Quarterly inspection', priority: 'medium' },
    { id: 3, date: '2025-12-20', title: 'Tenant Meeting', type: 'meeting', time: '3:00 PM', description: 'Discuss maintenance issues', priority: 'low' },
  ]);

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleDateClick = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setShowEventModal(true);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!eventForm.title || !selectedDate) return;
    
    const newEvent = {
      id: events.length + 1,
      date: selectedDate,
      ...eventForm
    };
    
    setEvents([...events, newEvent]);
    setEventForm({ title: '', type: 'meeting', time: '', description: '', priority: 'medium' });
    setShowEventModal(false);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const getEventColor = (type) => {
    switch(type) {
      case 'renewal': return 'from-emerald-500 to-teal-500';
      case 'inspection': return 'from-blue-500 to-cyan-500';
      case 'meeting': return 'from-purple-500 to-pink-500';
      case 'maintenance': return 'from-orange-500 to-amber-500';
      default: return 'from-indigo-500 to-purple-500';
    }
  };

  const getEventBadgeColor = (type) => {
    switch(type) {
      case 'renewal': return 'bg-emerald-100 text-emerald-700';
      case 'inspection': return 'bg-blue-100 text-blue-700';
      case 'meeting': return 'bg-purple-100 text-purple-700';
      case 'maintenance': return 'bg-orange-100 text-orange-700';
      default: return 'bg-indigo-100 text-indigo-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const calendarDays = Array.from({ length: firstDay }).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  return (
    <div className={`${isDark ? 'bg-gray-950' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'} p-8 min-h-screen`}>
      <div className="mb-10">
        <h1 className={`${isDark ? 'text-white' : 'text-gray-900'} text-5xl font-black mb-2`}>Calendar</h1>
        <p className={`${isDark ? 'text-gray-500' : 'text-gray-600'} text-base`}>Plan and manage events, inspections, and lease renewals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className={`lg:col-span-2 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} 
              className={`p-3 rounded-xl transition ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-black`}>
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} 
              className={`p-3 rounded-xl transition ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className={`text-center py-3 font-bold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              const dayEvents = day ? getEventsForDate(day) : [];
              return (
                <div
                  key={idx}
                  onClick={() => day && handleDateClick(day)}
                  className={`min-h-24 p-2 rounded-xl border-2 cursor-pointer transition ${
                    day 
                      ? (isDark ? 'bg-gray-700 border-gray-600 hover:border-indigo-500' : 'bg-gray-50 border-gray-200 hover:border-indigo-500')
                      : (isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200')
                  }`}
                >
                  {day && (
                    <>
                      <p className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{day}</p>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div key={event.id} className={`text-xs px-2 py-1 rounded-lg bg-gradient-to-r ${getEventColor(event.type)} text-white truncate`}>
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <p className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>+{dayEvents.length - 2} more</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-black mb-6`}>Upcoming Events</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {events.sort((a, b) => new Date(a.date) - new Date(b.date)).map(event => (
              <div key={event.id} className={`p-4 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold text-sm`}>{event.title}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${getEventBadgeColor(event.type)}`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${getPriorityColor(event.priority)}`}>
                        {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteEvent(event.id)}
                    className={`p-1 rounded-lg transition ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} space-y-1 mt-3`}>
                  <p className="flex items-center gap-2">
                    <Calendar size={14} /> {new Date(event.date).toLocaleDateString()}
                  </p>
                  {event.time && (
                    <p className="flex items-center gap-2">
                      <Clock size={14} /> {event.time}
                    </p>
                  )}
                  {event.description && (
                    <p className="mt-2">{event.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-2xl w-full p-8`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-black`}>✨ Create Event</h3>
              <button onClick={() => setShowEventModal(false)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-3`}>📅 Date</label>
                  <input
                    type="text"
                    value={selectedDate || ''}
                    disabled
                    className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-600'} font-semibold`}
                  />
                </div>
                <div>
                  <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-3`}>⏰ Time</label>
                  <input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold`}
                  />
                </div>
              </div>

              <div>
                <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-3`}>📝 Event Title *</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold`}
                  placeholder="e.g., Lease Renewal - Unit 101"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-3`}>🏷️ Event Type</label>
                  <select
                    value={eventForm.type}
                    onChange={(e) => setEventForm({...eventForm, type: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold`}
                  >
                    <option value="meeting">Meeting</option>
                    <option value="renewal">Lease Renewal</option>
                    <option value="inspection">Inspection</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-3`}>🎯 Priority</label>
                  <select
                    value={eventForm.priority}
                    onChange={(e) => setEventForm({...eventForm, priority: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-3`}>📋 Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold`}
                  placeholder="Add event details and notes..."
                  rows="4"
                />
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold transition text-lg ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition text-lg"
                >
                  ✓ Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
