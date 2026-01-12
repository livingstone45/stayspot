import React, { useState, useEffect } from 'react';
import {
  Plus, Filter, Search, MoreVertical,
  Users, Calendar, Tag, ArrowUpDown,
  X, CheckCircle, Clock, AlertCircle,
  ChevronDown, Download, Printer, Eye
} from 'lucide-react';
import TaskCard from './TaskCard';

const TaskBoard = ({ 
  tasks = [], 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onViewTask,
  onAssignTask,
  onFilterChange,
  onExport,
  onPrint
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignee: 'all',
    category: 'all'
  });
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [groupBy, setGroupBy] = useState('status');
  const [selectedView, setSelectedView] = useState('board');
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Status columns for board view
  const statusColumns = [
    { id: 'pending', title: 'Pending', color: 'yellow', icon: Clock, tasks: [] },
    { id: 'in-progress', title: 'In Progress', color: 'blue', icon: Clock, tasks: [] },
    { id: 'completed', title: 'Completed', color: 'green', icon: CheckCircle, tasks: [] },
    { id: 'overdue', title: 'Overdue', color: 'red', icon: AlertCircle, tasks: [] }
  ];

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status !== 'all' && task.status !== filters.status) return false;

    // Priority filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;

    // Assignee filter
    if (filters.assignee !== 'all' && task.assignee?.id !== filters.assignee) return false;

    // Category filter
    if (filters.category !== 'all' && task.category !== filters.category) return false;

    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'dueDate':
        aValue = new Date(a.dueDate);
        bValue = new Date(b.dueDate);
        break;
      case 'priority':
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        aValue = priorityOrder[a.priority] || 3;
        bValue = priorityOrder[b.priority] || 3;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      default:
        aValue = a[sortBy];
        bValue = b[sortBy];
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Group tasks for board view
  useEffect(() => {
    if (groupBy === 'status') {
      statusColumns.forEach(column => {
        column.tasks = sortedTasks.filter(task => task.status === column.id);
      });
    }
    // Add other grouping logic here (assignee, priority, etc.)
  }, [sortedTasks, groupBy]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleBulkAction = (action) => {
    // Handle bulk actions (complete, delete, assign, etc.)
    console.log(`${action} selected tasks:`, selectedTasks);
    setSelectedTasks([]);
  };

  const renderBoardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statusColumns.map(column => {
        const Icon = column.icon;
        return (
          <div key={column.id} className="bg-gray-50 rounded-xl p-4">
            <div className={`flex items-center justify-between p-3 rounded-lg bg-${column.color}-50 border border-${column.color}-200 mb-4`}>
              <div className="flex items-center space-x-2">
                <Icon className={`w-5 h-5 text-${column.color}-600`} />
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium bg-${column.color}-100 text-${column.color}-800 rounded-full`}>
                {column.tasks.length}
              </span>
            </div>
            
            <div className="space-y-4">
              {column.tasks.map(task => (
                <div 
                  key={task.id} 
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md cursor-move"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600 mt-1 truncate">{task.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => toggleTaskSelection(task.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    {task.assignee && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{task.assignee.name.split(' ')[0]}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      task.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                    <button
                      onClick={() => onViewTask && onViewTask(task.id)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
              
              {column.tasks.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">No tasks in this column</p>
                  <button
                    onClick={() => onAddTask && onAddTask({ status: column.id })}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Add a task
                  </button>
                </div>
              )}
              
              <button
                onClick={() => onAddTask && onAddTask({ status: column.id })}
                className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  checked={selectedTasks.length === sortedTasks.length && sortedTasks.length > 0}
                  onChange={() => {
                    if (selectedTasks.length === sortedTasks.length) {
                      setSelectedTasks([]);
                    } else {
                      setSelectedTasks(sortedTasks.map(t => t.id));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center space-x-1">
                  <span>Task</span>
                  {sortBy === 'title' && (
                    <ArrowUpDown className={`w-4 h-4 ${sortDirection === 'asc' ? '' : 'transform rotate-180'}`} />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('priority')}
              >
                Priority
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('dueDate')}
              >
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => toggleTaskSelection(task.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-500 mt-1 truncate max-w-xs">{task.description}</p>
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {task.tags.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{task.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.priority === 'critical' ? 'bg-red-100 text-red-800' :
                    task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {task.assignee ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {task.assignee.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900">{task.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Unassigned</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewTask && onViewTask(task.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditTask && onEditTask(task.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onAssignTask && onAssignTask(task.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Assign"
                    >
                      <Users className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Task Board</h2>
          <p className="text-gray-600 mt-2">Manage and track all tasks across properties</p>
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
            onClick={onAddTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setSelectedView('board')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  selectedView === 'board' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Board View
              </button>
              <button
                onClick={() => setSelectedView('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  selectedView === 'list' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List View
              </button>
            </div>

            {/* Group By */}
            <div className="relative">
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="status">Group by Status</option>
                <option value="priority">Group by Priority</option>
                <option value="assignee">Group by Assignee</option>
                <option value="category">Group by Category</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <div className="relative">
              <select
                value={filters.priority}
                onChange={(e) => {
                  const newFilters = { ...filters, priority: e.target.value };
                  setFilters(newFilters);
                  onFilterChange && onFilterChange(newFilters);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
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
                <option value="unassigned">Unassigned</option>
                {/* Add assignee options dynamically */}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="relative">
              <select
                value={filters.category}
                onChange={(e) => {
                  const newFilters = { ...filters, category: e.target.value };
                  setFilters(newFilters);
                  onFilterChange && onFilterChange(newFilters);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Categories</option>
                <option value="maintenance">Maintenance</option>
                <option value="inspection">Inspection</option>
                <option value="cleaning">Cleaning</option>
                <option value="administrative">Administrative</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedTasks.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleBulkAction('complete')}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                >
                  Mark Complete
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedTasks([])}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{tasks.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {tasks.filter(t => t.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {tasks.filter(t => t.status === 'in-progress').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {tasks.filter(t => t.status === 'overdue').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Task View */}
      {selectedView === 'board' ? renderBoardView() : renderListView()}

      {/* Drag & Drop Instructions */}
      {selectedView === 'board' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">Drag & Drop</p>
              <p className="text-sm text-blue-700">
                Drag tasks between columns to update their status. Click on a task to view details.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Import missing icons
const Edit = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

export default TaskBoard;