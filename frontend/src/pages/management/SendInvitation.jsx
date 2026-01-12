import React, { useState } from 'react';
import { Send, Mail, User, Shield, AlertCircle, CheckCircle, Users, ArrowRight, Zap, CheckSquare, Calendar } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const SendInvitation = () => {
  const { isDarkMode } = useThemeMode();
  const [tab, setTab] = useState('invite');
  const [inviteData, setInviteData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'property_manager'
  });
  const [taskData, setTaskData] = useState({
    workerId: '',
    taskTitle: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const roles = [
    { id: 'property_manager', label: 'Property Manager', desc: 'Manage properties and tenants', icon: '🏢' },
    { id: 'marketer', label: 'Marketer', desc: 'Handle marketing campaigns', icon: '📢' },
    { id: 'accountant', label: 'Accountant', desc: 'Manage financial records', icon: '💰' },
    { id: 'hr', label: 'HR', desc: 'Human resources management', icon: '👥' }
  ];

  const handleInviteChange = (e) => {
    const { name, value } = e.target;
    setInviteData(prev => ({ ...prev, [name]: value }));
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/management/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Invitation sent successfully!' });
        setInviteData({ email: '', firstName: '', lastName: '', role: 'property_manager' });
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: 'Failed to send invitation' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error sending invitation' });
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/management/tasks/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Task assigned successfully!' });
        setTaskData({ workerId: '', taskTitle: '', description: '', dueDate: '', priority: 'medium' });
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: 'Failed to assign task' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error assigning task' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-purple-200/50 bg-white/40'} backdrop-blur-xl sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Team Management</h1>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Invite workers and assign tasks</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setTab('invite')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                tab === 'invite'
                  ? 'bg-purple-600 text-white'
                  : isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Send className="w-4 h-4 inline mr-2" />
              Invite Worker
            </button>
            <button
              onClick={() => setTab('task')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                tab === 'task'
                  ? 'bg-purple-600 text-white'
                  : isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckSquare className="w-4 h-4 inline mr-2" />
              Assign Task
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border backdrop-blur-sm ${
            message.type === 'success' 
              ? isDarkMode ? 'bg-emerald-900/20 border-emerald-700' : 'bg-emerald-50 border-emerald-300'
              : isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-300'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            ) : (
              <AlertCircle className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            )}
            <span className={isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}>{message.text}</span>
          </div>
        )}

        {/* Invite Tab */}
        {tab === 'invite' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleInviteSubmit} className={`rounded-2xl shadow-xl p-8 border backdrop-blur-sm ${
                isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/80 border-purple-200/50'
              }`}>
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className={`absolute left-4 top-4 w-5 h-5 transition ${isDarkMode ? 'text-slate-500 group-focus-within:text-purple-400' : 'text-slate-400 group-focus-within:text-purple-600'}`} />
                      <input
                        type="email"
                        name="email"
                        value={inviteData.email}
                        onChange={handleInviteChange}
                        required
                        placeholder="john.doe@example.com"
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                          isDarkMode ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500' : 'border-purple-200 bg-white placeholder-slate-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        First Name
                      </label>
                      <div className="relative group">
                        <User className={`absolute left-4 top-4 w-5 h-5 transition ${isDarkMode ? 'text-slate-500 group-focus-within:text-purple-400' : 'text-slate-400 group-focus-within:text-purple-600'}`} />
                        <input
                          type="text"
                          name="firstName"
                          value={inviteData.firstName}
                          onChange={handleInviteChange}
                          required
                          placeholder="John"
                          className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                            isDarkMode ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500' : 'border-purple-200 bg-white placeholder-slate-400'
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        Last Name
                      </label>
                      <div className="relative group">
                        <User className={`absolute left-4 top-4 w-5 h-5 transition ${isDarkMode ? 'text-slate-500 group-focus-within:text-purple-400' : 'text-slate-400 group-focus-within:text-purple-600'}`} />
                        <input
                          type="text"
                          name="lastName"
                          value={inviteData.lastName}
                          onChange={handleInviteChange}
                          required
                          placeholder="Doe"
                          className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                            isDarkMode ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500' : 'border-purple-200 bg-white placeholder-slate-400'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      Role
                    </label>
                    <div className="relative group">
                      <Shield className={`absolute left-4 top-4 w-5 h-5 transition ${isDarkMode ? 'text-slate-500 group-focus-within:text-purple-400' : 'text-slate-400 group-focus-within:text-purple-600'}`} />
                      <select
                        name="role"
                        value={inviteData.role}
                        onChange={handleInviteChange}
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                          isDarkMode ? 'border-slate-700 bg-slate-800 text-white' : 'border-purple-200 bg-white'
                        }`}
                      >
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Send className="w-5 h-5" />
                    {loading ? 'Sending...' : 'Send Invitation'}
                  </button>
                </div>
              </form>
            </div>

            <div className={`rounded-2xl shadow-xl p-6 border backdrop-blur-sm ${
              isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/80 border-purple-200/50'
            }`}>
              <div className="flex items-center gap-2 mb-5">
                <Zap className="w-5 h-5 text-purple-600" />
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Available Roles</h3>
              </div>
              <div className="space-y-3">
                {roles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => setInviteData(prev => ({ ...prev, role: role.id }))}
                    className={`w-full p-4 rounded-xl border-2 transition text-left ${
                      inviteData.role === role.id
                        ? isDarkMode ? 'bg-purple-900/30 border-purple-600 shadow-lg' : 'bg-purple-50 border-purple-400 shadow-lg'
                        : isDarkMode ? 'border-slate-700 hover:border-slate-600' : 'border-purple-200/50 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{role.label}</p>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{role.desc}</p>
                      </div>
                      {inviteData.role === role.id && <ArrowRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-1" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Task Tab */}
        {tab === 'task' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleTaskSubmit} className={`rounded-2xl shadow-xl p-8 border backdrop-blur-sm ${
                isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/80 border-purple-200/50'
              }`}>
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      Select Worker
                    </label>
                    <div className="relative group">
                      <User className={`absolute left-4 top-4 w-5 h-5 transition ${isDarkMode ? 'text-slate-500 group-focus-within:text-purple-400' : 'text-slate-400 group-focus-within:text-purple-600'}`} />
                      <select
                        name="workerId"
                        value={taskData.workerId}
                        onChange={handleTaskChange}
                        required
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                          isDarkMode ? 'border-slate-700 bg-slate-800 text-white' : 'border-purple-200 bg-white'
                        }`}
                      >
                        <option value="">Choose a worker...</option>
                        <option value="1">John Doe - Property Manager</option>
                        <option value="2">Jane Smith - Marketer</option>
                        <option value="3">Mike Johnson - Accountant</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      Task Title
                    </label>
                    <input
                      type="text"
                      name="taskTitle"
                      value={taskData.taskTitle}
                      onChange={handleTaskChange}
                      required
                      placeholder="Enter task title"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                        isDarkMode ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500' : 'border-purple-200 bg-white placeholder-slate-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={taskData.description}
                      onChange={handleTaskChange}
                      required
                      placeholder="Enter task description"
                      rows="4"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                        isDarkMode ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500' : 'border-purple-200 bg-white placeholder-slate-400'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        Due Date
                      </label>
                      <div className="relative group">
                        <Calendar className={`absolute left-4 top-4 w-5 h-5 transition ${isDarkMode ? 'text-slate-500 group-focus-within:text-purple-400' : 'text-slate-400 group-focus-within:text-purple-600'}`} />
                        <input
                          type="date"
                          name="dueDate"
                          value={taskData.dueDate}
                          onChange={handleTaskChange}
                          required
                          className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                            isDarkMode ? 'border-slate-700 bg-slate-800 text-white' : 'border-purple-200 bg-white'
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={taskData.priority}
                        onChange={handleTaskChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                          isDarkMode ? 'border-slate-700 bg-slate-800 text-white' : 'border-purple-200 bg-white'
                        }`}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <CheckSquare className="w-5 h-5" />
                    {loading ? 'Assigning...' : 'Assign Task'}
                  </button>
                </div>
              </form>
            </div>

            <div className={`rounded-2xl shadow-xl p-6 border backdrop-blur-sm ${
              isDarkMode ? 'bg-indigo-900/20 border-indigo-700' : 'bg-indigo-50 border-indigo-200'
            }`}>
              <div className="flex gap-3">
                <AlertCircle className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <div>
                  <p className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>Task Assignment</p>
                  <p className={`text-xs ${isDarkMode ? 'text-indigo-300/80' : 'text-indigo-700'}`}>
                    Assign tasks to workers with due dates and priority levels. Workers will receive notifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendInvitation;
