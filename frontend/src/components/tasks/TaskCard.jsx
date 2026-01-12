import React, { useState } from 'react';
import {
  CheckCircle, Clock, AlertCircle, User,
  Calendar, Tag, MessageSquare, Paperclip,
  ChevronDown, MoreVertical, Edit, Trash2,
  ArrowUpRight, Flag, Bell, Eye
} from 'lucide-react';

const TaskCard = ({ task, onViewDetails, onEdit, onDelete, onComplete, onAssign }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'critical': { color: 'red', icon: AlertCircle, text: 'Critical' },
      'high': { color: 'orange', icon: Flag, text: 'High' },
      'medium': { color: 'yellow', icon: Flag, text: 'Medium' },
      'low': { color: 'green', icon: Flag, text: 'Low' }
    };

    const config = priorityConfig[priority] || priorityConfig['medium'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { color: 'green', icon: CheckCircle, text: 'Completed' },
      'in-progress': { color: 'blue', icon: Clock, text: 'In Progress' },
      'pending': { color: 'yellow', icon: Clock, text: 'Pending' },
      'overdue': { color: 'red', icon: AlertCircle, text: 'Overdue' },
      'cancelled': { color: 'gray', icon: AlertCircle, text: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig['pending'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const calculateDueStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'due-today';
    if (diffDays <= 2) return 'due-soon';
    return 'future';
  };

  const getDueStatusText = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  const getDueStatusColor = (dueDate) => {
    const status = calculateDueStatus(dueDate);
    switch (status) {
      case 'overdue': return 'text-red-600';
      case 'due-today': return 'text-orange-600';
      case 'due-soon': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                {getStatusBadge(task.status)}
                {getPriorityBadge(task.priority)}
              </div>
              <div className="flex items-center space-x-2">
                {task.reminder && (
                  <Bell className="w-4 h-4 text-yellow-500" />
                )}
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mt-2">{task.description}</p>
          </div>
        </div>

        {showMenu && (
          <div className="absolute right-6 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <button
              onClick={() => {
                setShowMenu(false);
                onViewDetails && onViewDetails(task.id);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                onEdit && onEdit(task.id);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Task</span>
            </button>
            {task.status !== 'completed' && (
              <button
                onClick={() => {
                  setShowMenu(false);
                  onComplete && onComplete(task.id);
                }}
                className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark Complete</span>
              </button>
            )}
            <div className="border-t border-gray-200">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onDelete && onDelete(task.id);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Task</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dates */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500 flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Dates</span>
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Created:</span>
                <span className="text-sm font-medium">{formatDate(task.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Due Date:</span>
                <span className={`text-sm font-medium ${getDueStatusColor(task.dueDate)}`}>
                  {formatDate(task.dueDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm font-medium ${getDueStatusColor(task.dueDate)}`}>
                  {getDueStatusText(task.dueDate)}
                </span>
              </div>
              {task.completedAt && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed:</span>
                  <span className="text-sm font-medium text-green-600">
                    {formatDate(task.completedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Assignee & Creator */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500 flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>People</span>
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Assigned To</p>
                {task.assignee ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {task.assignee.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.assignee.name}</p>
                      <p className="text-xs text-gray-500">{task.assignee.role}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Not assigned</p>
                      <button
                        onClick={() => onAssign && onAssign(task.id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Assign now
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Created By</p>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {task.createdBy.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-900">{task.createdBy.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags & Attachments */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500 flex items-center space-x-1">
              <Tag className="w-4 h-4" />
              <span>Details</span>
            </h4>
            <div className="space-y-3">
              {task.tags && task.tags.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {task.attachments && task.attachments.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Attachments</p>
                  <div className="flex items-center space-x-2">
                    <Paperclip className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {task.attachments.length} file{task.attachments.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
              {task.comments && task.comments.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Comments</p>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {task.progress !== undefined && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-900">Progress</span>
              <span className="text-sm font-medium text-gray-900">{task.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Related Property */}
        {task.property && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Related Property</h4>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{task.property.name}</p>
                  <p className="text-xs text-gray-500">{task.property.address}</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Property
              </button>
            </div>
          </div>
        )}

        {/* Collapsible Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-6 w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
        >
          <span className="font-medium text-gray-900">
            {showDetails ? 'Hide Details' : 'Show Details'}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showDetails ? 'transform rotate-180' : ''}`} />
        </button>

        {showDetails && (
          <div className="mt-4 space-y-4">
            {/* Additional Notes */}
            {task.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Notes</h4>
                <p className="text-sm text-gray-600">{task.notes}</p>
              </div>
            )}

            {/* Subtasks */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Subtasks</h4>
                <div className="space-y-2">
                  {task.subtasks.map((subtask, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          readOnly
                        />
                        <span className={`text-sm ${subtask.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {subtask.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {subtask.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Time Tracking */}
            {task.timeTracking && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Time Tracking</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">Estimated</p>
                    <p className="text-sm font-medium text-gray-900">{task.timeTracking.estimated} hours</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">Logged</p>
                    <p className="text-sm font-medium text-gray-900">{task.timeTracking.logged} hours</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">ID: {task.id}</span>
            {task.updatedAt && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-600">
                  Updated: {formatDate(task.updatedAt)}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {task.status !== 'completed' && (
              <button
                onClick={() => onComplete && onComplete(task.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete Task</span>
              </button>
            )}
            <button
              onClick={() => onViewDetails && onViewDetails(task.id)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import missing icons
const Building = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
  </svg>
);

export default TaskCard;