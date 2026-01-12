import React, { useState } from 'react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { Plus, Clock, AlertCircle, CheckCircle, Trash2, Edit2, Flag, Calendar, User } from 'lucide-react';

const TaskBoard = () => {
  const { isDarkMode } = useThemeMode();
  const [tasks, setTasks] = useState({
    pending: [
      { id: 1, title: 'Follow up with John Smith', priority: 'high', dueDate: '2024-01-20', assignee: 'Sarah Manager' },
      { id: 2, title: 'Send renewal notices', priority: 'high', dueDate: '2024-01-25', assignee: 'Admin Team' },
      { id: 3, title: 'Update tenant directory', priority: 'low', dueDate: '2024-01-30', assignee: 'Sarah Manager' },
    ],
    'in-progress': [
      { id: 4, title: 'Inspect Unit 202', priority: 'medium', dueDate: '2024-01-18', assignee: 'Mike Inspector' },
      { id: 5, title: 'Fix leaky faucet', priority: 'medium', dueDate: '2024-01-22', assignee: 'John Maintenance' },
    ],
    completed: [
      { id: 6, title: 'Process rent payment', priority: 'high', dueDate: '2024-01-15', assignee: 'Finance Team' },
      { id: 7, title: 'Monthly inspection', priority: 'medium', dueDate: '2024-01-10', assignee: 'Mike Inspector' },
    ],
  });

  const columns = [
    { id: 'pending', title: 'Pending', color: 'amber', icon: Clock },
    { id: 'in-progress', title: 'In Progress', color: 'blue', icon: AlertCircle },
    { id: 'completed', title: 'Completed', color: 'green', icon: CheckCircle },
  ];

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-orange-100 text-orange-700',
    low: 'bg-green-100 text-green-700',
  };

  const colorMap = {
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', header: 'bg-amber-100', icon: 'text-amber-600' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', header: 'bg-blue-100', icon: 'text-blue-600' },
    green: { bg: 'bg-green-50', border: 'border-green-200', header: 'bg-green-100', icon: 'text-green-600' },
  };

  const stats = [
    { label: 'Total Tasks', value: Object.values(tasks).flat().length, color: 'slate' },
    { label: 'Pending', value: tasks.pending.length, color: 'amber' },
    { label: 'In Progress', value: tasks['in-progress'].length, color: 'blue' },
    { label: 'Completed', value: tasks.completed.length, color: 'green' },
  ];

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>Task Board</h1>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Manage tasks across different stages</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-medium">
            <Plus size={18} />
            New Task
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const colorClass = stat.color === 'slate' ? isDarkMode ? 'border-slate-500 bg-slate-800' : 'border-slate-600 bg-slate-50' : 
                              stat.color === 'amber' ? isDarkMode ? 'border-amber-500 bg-slate-800' : 'border-amber-600 bg-amber-50' :
                              stat.color === 'blue' ? isDarkMode ? 'border-blue-500 bg-slate-800' : 'border-blue-600 bg-blue-50' :
                              isDarkMode ? 'border-green-500 bg-slate-800' : 'border-green-600 bg-green-50';
            return (
              <div key={idx} className={`rounded-xl shadow-sm p-6 border-l-4 ${colorClass} ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => {
            const ColumnIcon = column.icon;
            const colors = colorMap[column.color];
            const columnTasks = tasks[column.id];

            return (
              <div key={column.id} className={`${colors.bg} rounded-2xl border-2 ${colors.border} overflow-hidden`}>
                {/* Column Header */}
                <div className={`${colors.header} p-6 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <ColumnIcon className={`${colors.icon}`} size={24} />
                    <div>
                      <h2 className="font-bold text-slate-900">{column.title}</h2>
                      <p className="text-sm text-slate-600">{columnTasks.length} tasks</p>
                    </div>
                  </div>
                </div>

                {/* Tasks Container */}
                <div className="p-4 space-y-3 min-h-96 max-h-96 overflow-y-auto">
                  {columnTasks.length > 0 ? (
                    columnTasks.map(task => (
                      <div
                        key={task.id}
                        className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition cursor-move group"
                      >
                        {/* Priority Badge */}
                        <div className="flex items-start justify-between mb-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                            <button className="p-1 text-slate-600 hover:bg-slate-100 rounded">
                              <Edit2 size={14} />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Task Title */}
                        <h3 className="font-semibold text-slate-900 mb-3 text-sm">{task.title}</h3>

                        {/* Task Meta */}
                        <div className="space-y-2 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-slate-400" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-slate-400" />
                            <span>{task.assignee}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      <p className="text-sm">No tasks yet</p>
                    </div>
                  )}
                </div>

                {/* Add Task Button */}
                <div className="p-4 border-t border-slate-200">
                  <button className={`w-full py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 ${
                    column.color === 'amber' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' :
                    column.color === 'blue' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                    'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}>
                    <Plus size={16} />
                    Add Task
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Priority Levels</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">High</span>
              <span className="text-sm text-slate-600">Urgent tasks</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">Medium</span>
              <span className="text-sm text-slate-600">Important tasks</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Low</span>
              <span className="text-sm text-slate-600">Regular tasks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
