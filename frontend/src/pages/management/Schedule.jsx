import React, { useState } from 'react';
import { Plus, Search, Calendar, Clock, MapPin, User, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, X, Wrench, Building2, Clock3, Users } from 'lucide-react';

const Schedule = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    property: '',
    time: '10:00',
    vendor: '',
    type: 'preventive',
    priority: 'medium'
  });

  const [schedules, setSchedules] = useState([
    {
      id: 1,
      title: 'HVAC Maintenance',
      property: 'Apt 101',
      date: '2024-01-15',
      time: '10:00 AM',
      vendor: 'Cool Air Services',
      type: 'preventive',
      status: 'scheduled',
      priority: 'medium'
    },
    {
      id: 2,
      title: 'Plumbing Inspection',
      property: 'Apt 202',
      date: '2024-01-18',
      time: '2:00 PM',
      vendor: 'Quick Plumbing',
      type: 'inspection',
      status: 'scheduled',
      priority: 'high'
    },
    {
      id: 3,
      title: 'Electrical Safety Check',
      property: 'Apt 303',
      date: '2024-01-22',
      time: '9:00 AM',
      vendor: 'Electric Pro',
      type: 'inspection',
      status: 'scheduled',
      priority: 'high'
    },
    {
      id: 4,
      title: 'Pest Control',
      property: 'Apt 104',
      date: '2024-01-25',
      time: '11:00 AM',
      vendor: 'Pest Masters',
      type: 'preventive',
      status: 'scheduled',
      priority: 'low'
    },
    {
      id: 5,
      title: 'Fire Extinguisher Check',
      property: 'Building A',
      date: '2024-01-28',
      time: '3:00 PM',
      vendor: 'Safety Plus',
      type: 'compliance',
      status: 'scheduled',
      priority: 'high'
    },
    {
      id: 6,
      title: 'Roof Inspection',
      property: 'Building B',
      date: '2024-02-05',
      time: '10:00 AM',
      vendor: 'Roof Experts',
      type: 'inspection',
      status: 'scheduled',
      priority: 'medium'
    }
  ]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getSchedulesForDate = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return schedules.filter(s => s.date === dateStr);
  };

  const handleDateClick = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setShowModal(true);
  };

  const handleAddSchedule = () => {
    if (!formData.title || !formData.property || !formData.vendor) {
      alert('Please fill all required fields');
      return;
    }
    
    const newSchedule = {
      id: schedules.length + 1,
      ...formData,
      date: selectedDate,
      time: formData.time + ' AM',
      status: 'scheduled'
    };
    
    setSchedules([...schedules, newSchedule]);
    setShowModal(false);
    setFormData({
      title: '',
      property: '',
      time: '10:00',
      vendor: '',
      type: 'preventive',
      priority: 'medium'
    });
  };

  const filtered = schedules.filter(schedule => {
    const matchesSearch = schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || schedule.type === filterType;
    return matchesSearch && matchesType;
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'preventive': return 'bg-blue-100 text-blue-800';
      case 'inspection': return 'bg-purple-100 text-purple-800';
      case 'compliance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Maintenance Schedule</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Plan and track scheduled maintenance</p>
          </div>
          <button onClick={() => { setSelectedDate(null); setShowModal(true); }} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Schedule Maintenance
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              {/* Month Navigation */}
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                  const daySchedules = day ? getSchedulesForDate(day) : [];
                  return (
                    <div
                      key={idx}
                      onClick={() => day && handleDateClick(day)}
                      className={`min-h-20 p-2 rounded border cursor-pointer transition-colors ${
                        day
                          ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                          : 'border-transparent'
                      }`}
                    >
                      {day && (
                        <>
                          <div className="font-semibold text-gray-900 dark:text-white mb-1">{day}</div>
                          <div className="space-y-1">
                            {daySchedules.slice(0, 2).map(schedule => (
                              <div
                                key={schedule.id}
                                className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-2 py-1 rounded truncate"
                              >
                                {schedule.title}
                              </div>
                            ))}
                            {daySchedules.length > 2 && (
                              <div className="text-xs text-gray-600 dark:text-gray-400 px-2">
                                +{daySchedules.length - 2} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upcoming</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {schedules.slice(0, 5).map(schedule => (
                <div key={schedule.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{schedule.title}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    {new Date(schedule.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    {schedule.time}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getTypeColor(schedule.type)}`}>
                      {schedule.type}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getPriorityColor(schedule.priority)}`}>
                      {schedule.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex gap-4 mb-6 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search schedules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="preventive">Preventive</option>
              <option value="inspection">Inspection</option>
              <option value="compliance">Compliance</option>
            </select>
          </div>

          <div className="space-y-4">
            {filtered.map(schedule => (
              <div key={schedule.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{schedule.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{schedule.property}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(schedule.type)}`}>
                      {schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(schedule.priority)}`}>
                      {schedule.priority.charAt(0).toUpperCase() + schedule.priority.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{new Date(schedule.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{schedule.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{schedule.vendor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400 capitalize">{schedule.status}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 py-2 rounded hover:bg-orange-100 dark:hover:bg-orange-900/30 text-sm font-medium">
                    View Details
                  </button>
                  <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium">
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No schedules found</p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 px-8 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Schedule</h2>
                  <p className="text-orange-50 text-sm mt-1">
                    {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'New Schedule'}
                  </p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-4">
              {/* Section 1: Basic Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Maintenance Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="HVAC Maintenance"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Property Location *</label>
                  <input
                    type="text"
                    value={formData.property}
                    onChange={(e) => setFormData({...formData, property: e.target.value})}
                    placeholder="Apt 101"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Section 2: Schedule Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide">Schedule Details</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Time</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Service Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900 focus:outline-none transition-all"
                    >
                      <option value="preventive">Preventive</option>
                      <option value="inspection">Inspection</option>
                      <option value="compliance">Compliance</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Vendor & Priority */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide">Vendor & Priority</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Service Vendor *</label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                    placeholder="Cool Air Services"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Priority Level</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900 focus:outline-none transition-all"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSchedule}
                  className="flex-1 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
