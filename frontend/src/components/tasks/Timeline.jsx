import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, User, Building,
  CheckCircle, AlertCircle, X, Plus,
  ChevronDown, Filter, Download, Printer,
  MessageSquare, MapPin, Tag, ExternalLink
} from 'lucide-react';

const Timeline = ({ 
  events = [],
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onViewDetails,
  onFilterChange,
  onExport,
  onPrint,
  viewMode = 'day' // 'day', 'week', 'month', 'agenda'
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filters, setFilters] = useState({
    type: 'all',
    property: 'all',
    assignee: 'all',
    status: 'all'
  });
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Mock data - replace with actual API data
  const mockEvents = [
    {
      id: 1,
      title: 'Property Inspection',
      description: 'Routine inspection of Sunset Apartments',
      type: 'inspection',
      status: 'scheduled',
      startTime: '2024-03-15T09:00:00',
      endTime: '2024-03-15T11:00:00',
      property: { id: 1, name: 'Sunset Apartments', address: '123 Main St' },
      assignee: { id: 1, name: 'John Smith', role: 'Inspector' },
      attendees: [
        { id: 1, name: 'Sarah Johnson', role: 'Property Manager' },
        { id: 2, name: 'Mike Wilson', role: 'Maintenance Supervisor' }
      ],
      color: 'blue',
      reminders: ['1 day before', '1 hour before']
    },
    {
      id: 2,
      title: 'Tenant Move-in',
      description: 'New tenant moving into unit A-205',
      type: 'move-in',
      status: 'confirmed',
      startTime: '2024-03-15T14:00:00',
      endTime: '2024-03-15T16:00:00',
      property: { id: 1, name: 'Sunset Apartments', address: '123 Main St' },
      tenant: { id: 1, name: 'Emma Davis', unit: 'A-205' },
      assignee: { id: 2, name: 'Lisa Brown', role: 'Leasing Agent' },
      color: 'green',
      reminders: ['2 days before']
    },
    {
      id: 3,
      title: 'Maintenance Repair',
      description: 'Plumbing repair in unit B-301',
      type: 'maintenance',
      status: 'in-progress',
      startTime: '2024-03-16T10:00:00',
      endTime: '2024-03-16T12:00:00',
      property: { id: 2, name: 'River View Condos', address: '456 Oak Ave' },
      assignee: { id: 3, name: 'Robert Taylor', role: 'Maintenance Tech' },
      vendor: { id: 1, name: 'Quick Fix Plumbing' },
      color: 'orange',
      priority: 'high'
    },
    {
      id: 4,
      title: 'Lease Renewal Meeting',
      description: 'Discuss lease renewal terms with tenant',
      type: 'meeting',
      status: 'pending',
      startTime: '2024-03-17T15:00:00',
      endTime: '2024-03-17T16:00:00',
      property: { id: 1, name: 'Sunset Apartments', address: '123 Main St' },
      tenant: { id: 2, name: 'James Wilson', unit: 'B-102' },
      assignee: { id: 4, name: 'David Lee', role: 'Property Manager' },
      color: 'purple'
    }
  ];

  const eventTypes = [
    { value: 'inspection', label: 'Inspections', color: 'blue' },
    { value: 'maintenance', label: 'Maintenance', color: 'orange' },
    { value: 'meeting', label: 'Meetings', color: 'purple' },
    { value: 'move-in', label: 'Move-ins', color: 'green' },
    { value: 'move-out', label: 'Move-outs', color: 'red' },
    { value: 'showing', label: 'Property Showings', color: 'yellow' },
    { value: 'other', label: 'Other', color: 'gray' }
  ];

  const statusColors = {
    'scheduled': 'bg-blue-100 text-blue-800',
    'confirmed': 'bg-green-100 text-green-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-gray-100 text-gray-800',
    'cancelled': 'bg-red-100 text-red-800',
    'pending': 'bg-orange-100 text-orange-800'
  };

  // Filter events
  const filteredEvents = mockEvents.filter(event => {
    if (filters.type !== 'all' && event.type !== filters.type) return false;
    if (filters.property !== 'all' && event.property?.id !== parseInt(filters.property)) return false;
    if (filters.assignee !== 'all' && event.assignee?.id !== parseInt(filters.assignee)) return false;
    if (filters.status !== 'all' && event.status !== filters.status) return false;
    return true;
  });

  // Group events by date
  const eventsByDate = filteredEvents.reduce((groups, event) => {
    const date = new Date(event.startTime).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(eventsByDate).sort();

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getEventColor = (color) => {
    const colorClasses = {
      blue: 'bg-blue-100 border-blue-300 text-blue-800',
      green: 'bg-green-100 border-green-300 text-green-800',
      orange: 'bg-orange-100 border-orange-300 text-orange-800',
      purple: 'bg-purple-100 border-purple-300 text-purple-800',
      red: 'bg-red-100 border-red-300 text-red-800',
      yellow: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      gray: 'bg-gray-100 border-gray-300 text-gray-800'
    };
    return colorClasses[color] || colorClasses.blue;
  };

  const getEventTypeIcon = (type) => {
    const typeIcons = {
      'inspection': '🔍',
      'maintenance': '🛠️',
      'meeting': '🤝',
      'move-in': '📦',
      'move-out': '🚚',
      'showing': '🏠',
      'other': '📅'
    };
    return typeIcons[type] || '📅';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Timeline</h2>
          <p className="text-gray-600 mt-2">View and manage all scheduled events and activities</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onPrint}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button
            onClick={onExport}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={onAddEvent}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          {/* Date Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedDate(prev => {
                const newDate = new Date(prev);
                newDate.setDate(newDate.getDate() - 1);
                return newDate;
              })}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ←
            </button>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })}
              </p>
            </div>
            <button
              onClick={() => setSelectedDate(prev => {
                const newDate = new Date(prev);
                newDate.setDate(newDate.getDate() + 1);
                return newDate;
              })}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              →
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Today
            </button>
          </div>

          {/* View Mode */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {['day', 'week', 'month', 'agenda'].map(mode => (
              <button
                key={mode}
                onClick={() => viewMode !== mode && console.log('Change view to:', mode)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  viewMode === mode 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
            <div className="relative">
              <select
                value={filters.type}
                onChange={(e) => {
                  const newFilters = { ...filters, type: e.target.value };
                  setFilters(newFilters);
                  onFilterChange && onFilterChange(newFilters);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Types</option>
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => {
                  const newFilters = { ...filters, status: e.target.value };
                  setFilters(newFilters);
                  onFilterChange && onFilterChange(newFilters);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Property Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property</label>
            <div className="relative">
              <select
                value={filters.property}
                onChange={(e) => {
                  const newFilters = { ...filters, property: e.target.value };
                  setFilters(newFilters);
                  onFilterChange && onFilterChange(newFilters);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Properties</option>
                <option value="1">Sunset Apartments</option>
                <option value="2">River View Condos</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Assignee Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
            <div className="relative">
              <select
                value={filters.assignee}
                onChange={(e) => {
                  const newFilters = { ...filters, assignee: e.target.value };
                  setFilters(newFilters);
                  onFilterChange && onFilterChange(newFilters);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Assignees</option>
                <option value="1">John Smith</option>
                <option value="2">Lisa Brown</option>
                <option value="3">Robert Taylor</option>
                <option value="4">David Lee</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {sortedDates.map(date => (
          <div key={date} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Date Header */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-gray-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {formatDate(eventsByDate[date][0].startTime)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {eventsByDate[date].length} event{eventsByDate[date].length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onAddEvent && onAddEvent({ startTime: date })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Event</span>
                </button>
              </div>
            </div>

            {/* Events List */}
            <div className="divide-y divide-gray-200">
              {eventsByDate[date]
                .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                .map(event => (
                  <div 
                    key={event.id} 
                    className="p-6 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Time */}
                      <div className="w-24 flex-shrink-0">
                        <div className="text-sm font-medium text-gray-900">
                          {formatTime(event.startTime)}
                        </div>
                        <div className="text-xs text-gray-500">
                          to {formatTime(event.endTime)}
                        </div>
                      </div>

                      {/* Event Type Indicator */}
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${getEventColor(event.color)}`}>
                          {getEventTypeIcon(event.type)}
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{event.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                            
                            <div className="mt-3 flex flex-wrap gap-2">
                              {/* Status */}
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[event.status]}`}>
                                {event.status}
                              </span>
                              
                              {/* Property */}
                              {event.property && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full flex items-center space-x-1">
                                  <Building className="w-3 h-3" />
                                  <span>{event.property.name}</span>
                                </span>
                              )}
                              
                              {/* Assignee */}
                              {event.assignee && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center space-x-1">
                                  <User className="w-3 h-3" />
                                  <span>{event.assignee.name}</span>
                                </span>
                              )}
                              
                              {/* Priority */}
                              {event.priority && (
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  event.priority === 'high' ? 'bg-red-100 text-red-800' :
                                  event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {event.priority} priority
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Quick Actions */}
                          <div className="flex items-center space-x-2">
                            {event.reminders && event.reminders.length > 0 && (
                              <span className="text-xs text-gray-500 flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{event.reminders.length} reminder{event.reminders.length !== 1 ? 's' : ''}</span>
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewDetails && onViewDetails(event.id);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="View Details"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Additional Info */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {event.tenant && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <User className="w-4 h-4 text-gray-400" />
                              <div>
                                <span className="font-medium">{event.tenant.name}</span>
                                <span className="text-gray-500 ml-2">Unit {event.tenant.unit}</span>
                              </div>
                            </div>
                          )}
                          
                          {event.vendor && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Building className="w-4 h-4 text-gray-400" />
                              <span>Vendor: {event.vendor.name}</span>
                            </div>
                          )}
                          
                          {event.attendees && event.attendees.length > 0 && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <User className="w-4 h-4 text-gray-400" />
                              <span>{event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        ))}
        
        {sortedDates.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No events found</h3>
            <p className="text-gray-600 mt-2">Try adjusting your filters or add a new event</p>
            <button
              onClick={onAddEvent}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add New Event
            </button>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h3>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedEvent.status]}`}>
                      {selectedEvent.status}
                    </span>
                    <span className="text-sm text-gray-600">
                      {formatDate(selectedEvent.startTime)} • {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Event Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                  <p className="text-gray-900">{selectedEvent.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Location</h4>
                    {selectedEvent.property && (
                      <div className="flex items-start space-x-3">
                        <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedEvent.property.name}</p>
                          <p className="text-sm text-gray-600">{selectedEvent.property.address}</p>
                          {selectedEvent.tenant && (
                            <p className="text-sm text-gray-500 mt-1">Unit: {selectedEvent.tenant.unit}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">People</h4>
                    <div className="space-y-3">
                      {selectedEvent.assignee && (
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {selectedEvent.assignee.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{selectedEvent.assignee.name}</p>
                            <p className="text-sm text-gray-600">{selectedEvent.assignee.role}</p>
                          </div>
                        </div>
                      )}
                      
                      {selectedEvent.tenant && (
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-green-600">
                              {selectedEvent.tenant.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{selectedEvent.tenant.name}</p>
                            <p className="text-sm text-gray-600">Tenant • Unit {selectedEvent.tenant.unit}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Reminders */}
                {selectedEvent.reminders && selectedEvent.reminders.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Reminders</h4>
                    <div className="space-y-2">
                      {selectedEvent.reminders.map((reminder, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{reminder}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Attendees */}
                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Attendees</h4>
                    <div className="space-y-3">
                      {selectedEvent.attendees.map((attendee, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {attendee.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{attendee.name}</p>
                            <p className="text-sm text-gray-600">{attendee.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Modal Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    onDeleteEvent && onDeleteEvent(selectedEvent.id);
                    setSelectedEvent(null);
                  }}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                >
                  Cancel Event
                </button>
                <button
                  onClick={() => {
                    onEditEvent && onEditEvent(selectedEvent.id);
                    setSelectedEvent(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => onViewDetails && onViewDetails(selectedEvent.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;