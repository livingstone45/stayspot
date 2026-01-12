import React, { useState } from 'react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { ArrowLeft, Save, X, CheckCircle, Bell, Mail, Calendar, User, FileText } from 'lucide-react';

const TaskAssign = () => {
  const { isDarkMode } = useThemeMode();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property: '',
    assignee: '',
    dueDate: '',
    priority: 'medium',
  });
  const [submitted, setSubmitted] = useState(false);

  const properties = [
    'Westside Apartments',
    'Downtown Lofts',
    'Riverside Complex',
    'Midtown Towers',
    'Lakeside Residences',
    'Hillside Villas',
  ];

  const assignees = [
    { name: 'Sarah Manager', email: 'sarah@example.com', role: 'Property Manager' },
    { name: 'Mike Inspector', email: 'mike@example.com', role: 'Inspector' },
    { name: 'John Maintenance', email: 'john@example.com', role: 'Maintenance' },
    { name: 'Finance Team', email: 'finance@example.com', role: 'Finance' },
    { name: 'Admin Team', email: 'admin@example.com', role: 'Administration' },
    { name: 'David Wilson', email: 'david@example.com', role: 'Assistant Manager' },
  ];

  const selectedAssignee = assignees.find(a => a.name === formData.assignee);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        title: '',
        description: '',
        property: '',
        assignee: '',
        dueDate: '',
        priority: 'medium',
      });
      setSubmitted(false);
    }, 3000);
  };

  const isFormValid = formData.title && formData.description && formData.property && formData.assignee && formData.dueDate;

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-rose-50 via-slate-50 to-pink-50'}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button className="p-2 hover:bg-white rounded-lg transition">
            <ArrowLeft className="text-rose-600" size={24} />
          </button>
          <div>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Create & Assign Task</h1>
            <p className={`mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Delegate work to your team members</p>
          </div>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-green-900">Task assigned successfully!</p>
              <p className="text-sm text-green-700">Notification sent to {formData.assignee}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className={`rounded-2xl shadow-lg p-8 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-rose-100'}`}>
              {/* Task Title */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-rose-600" />
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Follow up with tenant"
                  className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-rose-50/30"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-900 mb-3">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide details about the task..."
                  rows="4"
                  className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none bg-rose-50/30"
                />
              </div>

              {/* Property & Assignee Row */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-3">
                    Property *
                  </label>
                  <select
                    name="property"
                    value={formData.property}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-rose-50/30"
                  >
                    <option value="">Select property</option>
                    {properties.map(prop => (
                      <option key={prop} value={prop}>{prop}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Calendar size={18} className="text-rose-600" />
                    Due Date *
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-rose-50/30"
                  />
                </div>
              </div>

              {/* Assignee */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <User size={18} className="text-rose-600" />
                  Assign To *
                </label>
                <select
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-rose-50/30"
                >
                  <option value="">Select team member</option>
                  {assignees.map(person => (
                    <option key={person.name} value={person.name}>{person.name}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-900 mb-3">
                  Priority Level
                </label>
                <div className="flex gap-3">
                  {['low', 'medium', 'high'].map(level => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={level}
                        checked={formData.priority === level}
                        onChange={handleChange}
                        className="w-4 h-4 text-rose-600"
                      />
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        formData.priority === level
                          ? level === 'high' ? 'bg-red-100 text-red-700' : level === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                          : 'text-slate-700'
                      }`}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-semibold flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`flex-1 px-4 py-3 rounded-lg transition font-semibold flex items-center justify-center gap-2 ${
                    isFormValid
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-700 hover:to-pink-700 shadow-lg'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Save size={18} />
                  Assign Task
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignee Preview */}
            {selectedAssignee ? (
              <div className="bg-white rounded-2xl shadow-lg border border-rose-100 overflow-hidden">
                <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-6">
                  <h3 className="text-lg font-bold text-white">Assigning To</h3>
                </div>
                <div className="p-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto">
                    {selectedAssignee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 text-center mb-1">{selectedAssignee.name}</h4>
                  <p className="text-sm text-slate-600 text-center mb-4">{selectedAssignee.role}</p>
                  
                  <div className="space-y-3 pt-4 border-t border-rose-100">
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-rose-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-600 font-semibold">Email</p>
                        <p className="text-sm text-slate-900">{selectedAssignee.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-6 text-center">
                <p className="text-slate-600 font-medium">Select a team member to preview</p>
              </div>
            )}

            {/* Notification Info */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl shadow-lg border border-pink-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <Bell className="text-rose-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-rose-900">Notifications</h4>
                  <p className="text-sm text-rose-700 mt-1">
                    {selectedAssignee 
                      ? `${selectedAssignee.name} will be notified`
                      : 'Team member will be notified'}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-rose-700 font-medium">
                <p>✓ Email notification</p>
                <p>✓ In-app alert</p>
                <p>✓ Dashboard update</p>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-6">
              <h4 className="font-bold text-slate-900 mb-4">Quick Tips</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>Be clear and specific</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>Set realistic deadlines</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>Mark urgent tasks</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>Follow up regularly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAssign;
