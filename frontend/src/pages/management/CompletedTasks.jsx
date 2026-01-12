import React, { useState } from 'react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { Search, CheckCircle, Calendar, User, Clock, Download, Filter } from 'lucide-react';

const CompletedTasks = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('all');

  const completedTasks = [
    {
      id: 1,
      title: 'Process rent payment',
      property: 'Riverside Complex',
      assignee: 'Finance Team',
      completedDate: '2024-01-15',
      dueDate: '2024-01-15',
      priority: 'high',
      completionTime: '2 hours',
    },
    {
      id: 2,
      title: 'Monthly inspection',
      property: 'Downtown Lofts',
      assignee: 'Mike Inspector',
      completedDate: '2024-01-10',
      dueDate: '2024-01-12',
      priority: 'medium',
      completionTime: '1 day early',
    },
    {
      id: 3,
      title: 'Tenant screening',
      property: 'Westside Apartments',
      assignee: 'Sarah Manager',
      completedDate: '2024-01-08',
      dueDate: '2024-01-10',
      priority: 'high',
      completionTime: '2 days early',
    },
    {
      id: 4,
      title: 'Maintenance report',
      property: 'Midtown Towers',
      assignee: 'John Maintenance',
      completedDate: '2024-01-05',
      dueDate: '2024-01-05',
      priority: 'medium',
      completionTime: 'On time',
    },
    {
      id: 5,
      title: 'Lease renewal',
      property: 'Lakeside Residences',
      assignee: 'Admin Team',
      completedDate: '2024-01-03',
      dueDate: '2024-01-05',
      priority: 'high',
      completionTime: '2 days early',
    },
    {
      id: 6,
      title: 'Property walkthrough',
      property: 'Hillside Villas',
      assignee: 'Mike Inspector',
      completedDate: '2023-12-28',
      dueDate: '2023-12-30',
      priority: 'low',
      completionTime: '2 days early',
    },
  ];

  const filtered = completedTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.property.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = [
    { label: 'Total Completed', value: completedTasks.length, color: 'green' },
    { label: 'On Time', value: completedTasks.filter(t => t.completionTime === 'On time').length, color: 'blue' },
    { label: 'Early', value: completedTasks.filter(t => t.completionTime.includes('early')).length, color: 'emerald' },
    { label: 'This Month', value: completedTasks.filter(t => new Date(t.completedDate).getMonth() === new Date().getMonth()).length, color: 'slate' },
  ];

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-orange-100 text-orange-700',
    low: 'bg-green-100 text-green-700',
  };

  const getCompletionStatus = (completionTime) => {
    if (completionTime === 'On time') return { bg: 'bg-blue-50', text: 'text-blue-700', icon: '✓' };
    if (completionTime.includes('early')) return { bg: 'bg-green-50', text: 'text-green-700', icon: '⚡' };
    return { bg: 'bg-slate-50', text: 'text-slate-700', icon: '→' };
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>Completed Tasks</h1>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>View all finished tasks and completion history</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
            <Download size={18} />
            Export Report
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const colorMap = {
              green: 'border-green-600 bg-green-50',
              blue: 'border-blue-600 bg-blue-50',
              emerald: 'border-emerald-600 bg-emerald-50',
              slate: 'border-slate-600 bg-slate-50',
            };
            const iconColorMap = {
              green: 'text-green-600',
              blue: 'text-blue-600',
              emerald: 'text-emerald-600',
              slate: 'text-slate-600',
            };
            return (
              <div key={idx} className={`rounded-xl shadow-sm p-6 border-l-4 ${colorMap[stat.color]} ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className={`rounded-xl shadow-sm p-6 mb-8 border ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search completed tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300'}`}
                />
              </div>
            </div>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium hover:border-slate-400 transition"
            >
              <option value="all">All Time</option>
              <option value="january">January 2024</option>
              <option value="december">December 2023</option>
            </select>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filtered.map(task => {
            const status = getCompletionStatus(task.completionTime);
            const isEarly = task.completionTime.includes('early');
            
            return (
              <div key={task.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="text-green-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">{task.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{task.property}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                    <div>
                      <p className="text-xs text-slate-600 font-medium mb-1 flex items-center gap-1">
                        <Calendar size={14} />
                        Completed
                      </p>
                      <p className="text-sm font-semibold text-slate-900">{new Date(task.completedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium mb-1 flex items-center gap-1">
                        <Calendar size={14} />
                        Due Date
                      </p>
                      <p className="text-sm font-semibold text-slate-900">{new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium mb-1 flex items-center gap-1">
                        <User size={14} />
                        Assignee
                      </p>
                      <p className="text-sm font-semibold text-slate-900">{task.assignee}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium mb-1 flex items-center gap-1">
                        <Clock size={14} />
                        Completion
                      </p>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                        <span>{status.icon}</span>
                        {task.completionTime}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <CheckCircle className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No completed tasks found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Summary */}
        {filtered.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-6">
            <h3 className="font-bold text-slate-900 mb-3">Completion Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-600 font-medium">Average Completion Time</p>
                <p className="text-2xl font-bold text-green-600 mt-1">On Schedule</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Completion Rate</p>
                <p className="text-2xl font-bold text-green-600 mt-1">100%</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Tasks Completed Early</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{completedTasks.filter(t => t.completionTime.includes('early')).length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedTasks;
