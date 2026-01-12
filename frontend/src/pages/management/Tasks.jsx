import React, { useState } from 'react';
import { Search, Plus, CheckCircle, Clock, AlertCircle, Trash2, Edit2, Filter, Calendar, User, Flag } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const Tasks = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const tasks = [
    {
      id: 1,
      title: 'Follow up with John Smith',
      description: 'Check on lease renewal status',
      property: 'Westside Apartments - 101',
      assignee: 'Sarah Manager',
      dueDate: '2024-01-20',
      priority: 'high',
      status: 'pending',
      createdDate: '2024-01-10',
    },
    {
      id: 2,
      title: 'Inspect Unit 202',
      description: 'Monthly property inspection',
      property: 'Downtown Lofts - 202',
      assignee: 'Mike Inspector',
      dueDate: '2024-01-18',
      priority: 'medium',
      status: 'in-progress',
      createdDate: '2024-01-08',
    },
    {
      id: 3,
      title: 'Process rent payment',
      description: 'Collect and process January rent',
      property: 'Riverside Complex',
      assignee: 'Finance Team',
      dueDate: '2024-01-15',
      priority: 'high',
      status: 'completed',
      createdDate: '2024-01-05',
    },
    {
      id: 4,
      title: 'Fix leaky faucet',
      description: 'Maintenance request for Unit 303',
      property: 'Riverside Complex - 303',
      assignee: 'John Maintenance',
      dueDate: '2024-01-22',
      priority: 'medium',
      status: 'pending',
      createdDate: '2024-01-12',
    },
    {
      id: 5,
      title: 'Send renewal notices',
      description: 'Send lease renewal notices to expiring tenants',
      property: 'All Properties',
      assignee: 'Admin Team',
      dueDate: '2024-01-25',
      priority: 'high',
      status: 'pending',
      createdDate: '2024-01-10',
    },
    {
      id: 6,
      title: 'Update tenant directory',
      description: 'Update contact information in system',
      property: 'All Properties',
      assignee: 'Sarah Manager',
      dueDate: '2024-01-30',
      priority: 'low',
      status: 'pending',
      createdDate: '2024-01-11',
    },
  ];

  const stats = [
    { label: 'Total Tasks', value: tasks.length, icon: CheckCircle, color: 'orange' },
    { label: 'Pending', value: tasks.filter(t => t.status === 'pending').length, icon: Clock, color: 'amber' },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, icon: AlertCircle, color: 'blue' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, icon: CheckCircle, color: 'green' },
  ];

  const statusColors = {
    pending: { bg: isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700', label: 'Pending' },
    'in-progress': { bg: isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700', label: 'In Progress' },
    completed: { bg: isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700', label: 'Completed' },
  };

  const priorityColors = {
    high: { bg: isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700', label: 'High' },
    medium: { bg: isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-700', label: 'Medium' },
    low: { bg: isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700', label: 'Low' },
  };

  const filtered = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const isOverdue = (dueDate) => new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();

  return (
    <div className={`min-h-screen p-6 transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Tasks</h1>
            <p className={isDarkMode ? 'text-gray-400' : 'text-slate-600'}>Manage and track all management tasks</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition font-medium">
            <Plus size={18} />
            New Task
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const colorMap = {
              orange: isDarkMode ? 'border-orange-600 bg-orange-900/20' : 'border-orange-600 bg-orange-50',
              amber: isDarkMode ? 'border-amber-600 bg-amber-900/20' : 'border-amber-600 bg-amber-50',
              blue: isDarkMode ? 'border-blue-600 bg-blue-900/20' : 'border-blue-600 bg-blue-50',
              green: isDarkMode ? 'border-green-600 bg-green-900/20' : 'border-green-600 bg-green-50',
            };
            const iconColorMap = {
              orange: 'text-orange-600',
              amber: 'text-amber-600',
              blue: 'text-blue-600',
              green: 'text-green-600',
            };
            return (
              <div key={idx} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 border-l-4 ${colorMap[stat.color]} transition-colors`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>{stat.label}</p>
                    <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[stat.color]}`}>
                    <stat.icon className={`${iconColorMap[stat.color]}`} size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 mb-8 border ${isDarkMode ? 'border-gray-700' : 'border-slate-200'} transition-colors`}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-slate-300 bg-white text-slate-900 placeholder-slate-500'
                  }`}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white hover:border-gray-500' 
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white hover:border-gray-500' 
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map(task => {
            const status = statusColors[task.status];
            const priority = priorityColors[task.priority];
            const overdue = isOverdue(task.dueDate);
            
            return (
              <div key={task.id} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow`}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{task.title}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.bg}`}>
                          {status.label}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${priority.bg}`}>
                          {priority.label}
                        </span>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>{task.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className={`p-2 rounded transition ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                        <Edit2 size={16} />
                      </button>
                      <button className={`p-2 rounded transition ${isDarkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50'}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 ${isDarkMode ? 'border-gray-700' : 'border-slate-200'} border-t`}>
                    <div>
                      <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Property</p>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{task.property}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium mb-1 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                        <User size={14} />
                        Assignee
                      </p>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{task.assignee}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium mb-1 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                        <Calendar size={14} />
                        Due Date
                      </p>
                      <p className={`text-sm font-semibold ${overdue ? 'text-red-600' : (isDarkMode ? 'text-white' : 'text-slate-900')}`}>
                        {new Date(task.dueDate).toLocaleDateString()}
                        {overdue && <span className="text-xs ml-1">(Overdue)</span>}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Created</p>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{new Date(task.createdDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <CheckCircle className={`mx-auto h-16 w-16 mb-4 ${isDarkMode ? 'text-gray-600' : 'text-slate-300'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No tasks found</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Try adjusting your search or filters</p>
            <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition font-medium">
              New Task
            </button>
          </div>
        )}

        {filtered.length > 0 && (
          <div className={`mt-8 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
            Showing <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{filtered.length}</span> of <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tasks.length}</span> tasks
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
