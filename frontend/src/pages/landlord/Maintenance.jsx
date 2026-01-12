import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Wrench, Plus, X, Upload, DollarSign, FileText } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const Maintenance = () => {
  const { isDark } = useThemeMode();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    property: '',
    category: 'general',
    priority: 'medium',
    description: '',
    dueDate: '',
    assignee: '',
    estimatedCost: '',
    notes: ''
  });
  const [maintenanceRequests, setMaintenanceRequests] = useState([
    { id: 1, title: 'Plumbing Issue', property: 'Unit 305', priority: 'urgent', status: 'open', cost: 450, created: '2 hours ago', dueDate: '2024-12-21', assignee: 'John Smith', description: 'Water leak in bathroom', category: 'plumbing' },
    { id: 2, title: 'HVAC Maintenance', property: 'Unit 102', priority: 'high', status: 'in_progress', cost: 320, created: '1 day ago', dueDate: '2024-12-22', assignee: 'Mike Johnson', description: 'Annual HVAC inspection', category: 'hvac' },
    { id: 3, title: 'Door Lock Repair', property: 'Unit 201', priority: 'medium', status: 'completed', cost: 150, created: '2 days ago', dueDate: '2024-12-20', assignee: 'Sarah Davis', description: 'Front door lock replacement', category: 'general' },
    { id: 4, title: 'Electrical Inspection', property: 'Unit 203', priority: 'low', status: 'scheduled', cost: 200, created: '5 days ago', dueDate: '2024-12-28', assignee: 'Tom Wilson', description: 'Annual electrical safety inspection', category: 'electrical' },
    { id: 5, title: 'Window Replacement', property: 'Unit 501', priority: 'medium', status: 'in_progress', cost: 680, created: '1 week ago', dueDate: '2024-12-25', assignee: 'John Smith', description: 'Replace broken window pane', category: 'general' },
    { id: 6, title: 'Roof Inspection', property: 'Central Hub', priority: 'high', status: 'scheduled', cost: 500, created: '3 days ago', dueDate: '2024-12-27', assignee: 'Mike Johnson', description: 'Quarterly roof inspection', category: 'roofing' },
  ]);

  const categories = ['general', 'plumbing', 'electrical', 'hvac', 'roofing', 'painting', 'carpentry'];
  const assignees = ['John Smith', 'Mike Johnson', 'Sarah Davis', 'Tom Wilson', 'Lisa Anderson'];

  const summary = {
    totalRequests: maintenanceRequests.length,
    pending: maintenanceRequests.filter(r => r.status === 'open').length,
    inProgress: maintenanceRequests.filter(r => r.status === 'in_progress').length,
    completed: maintenanceRequests.filter(r => r.status === 'completed').length,
    scheduled: maintenanceRequests.filter(r => r.status === 'scheduled').length,
    totalCost: maintenanceRequests.reduce((sum, r) => sum + r.cost, 0),
  };

  const costAnalysis = [
    { category: 'Plumbing', count: 3, cost: 1200, percent: 35 },
    { category: 'HVAC', count: 2, cost: 800, percent: 25 },
    { category: 'Electrical', count: 2, cost: 600, percent: 20 },
    { category: 'General', count: 1, cost: 300, percent: 10 },
    { category: 'Other', count: 1, cost: 200, percent: 10 },
  ];

  const filteredRequests = maintenanceRequests.filter(req => {
    const statusMatch = filterStatus === 'all' || req.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || req.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.property || !formData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newRequest = {
      id: maintenanceRequests.length + 1,
      ...formData,
      status: 'open',
      cost: parseInt(formData.estimatedCost) || 0,
      created: 'just now'
    };
    
    setMaintenanceRequests([newRequest, ...maintenanceRequests]);
    setFormData({ title: '', property: '', category: 'general', priority: 'medium', description: '', dueDate: '', assignee: '', estimatedCost: '', notes: '' });
    setStep(1);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setStep(1);
    setFormData({ title: '', property: '', category: 'general', priority: 'medium', description: '', dueDate: '', assignee: '', estimatedCost: '', notes: '' });
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'open': return <AlertCircle size={16} />;
      case 'in_progress': return <Clock size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'scheduled': return <Wrench size={16} />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-orange-600';
      case 'open': return 'text-red-600';
      case 'scheduled': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`${isDark ? 'bg-gray-950' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'} min-h-screen p-8`}>
      <div className="mb-10">
        <h1 className={`${isDark ? 'text-white' : 'text-gray-900'} text-5xl font-black mb-2`}>Maintenance</h1>
        <p className={`${isDark ? 'text-gray-500' : 'text-gray-600'} text-base`}>Track and manage all maintenance requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-2">Total Requests</p>
          <p className="text-4xl font-black">{summary.totalRequests}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-red-100 text-xs font-bold uppercase tracking-wider mb-2">Pending</p>
          <p className="text-4xl font-black">{summary.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-orange-100 text-xs font-bold uppercase tracking-wider mb-2">In Progress</p>
          <p className="text-4xl font-black">{summary.inProgress}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-green-100 text-xs font-bold uppercase tracking-wider mb-2">Completed</p>
          <p className="text-4xl font-black">{summary.completed}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-purple-100 text-xs font-bold uppercase tracking-wider mb-2">Scheduled</p>
          <p className="text-4xl font-black">{summary.scheduled}</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-violet-100 text-xs font-bold uppercase tracking-wider mb-2">Total Cost</p>
          <p className="text-3xl font-black">${(summary.totalCost / 1000).toFixed(1)}k</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-black`}>Maintenance Requests</h2>
            <button 
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition font-bold flex items-center gap-2"
            >
              <Plus size={18} /> New Request
            </button>
          </div>

          <div className="flex gap-3 mb-6 flex-wrap">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredRequests.map((req) => (
              <div key={req.id} className={`p-4 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} transition-colors`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold`}>{req.title}</p>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border-2 ${getPriorityColor(req.priority)}`}>
                        {req.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '0.875rem' }}>{req.property}</p>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs mt-1`}>{req.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold`}>${req.cost}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{req.created}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={getStatusColor(req.status)}>
                      {getStatusIcon(req.status)}
                    </span>
                    <span className={`text-xs font-bold ${getStatusColor(req.status)}`}>
                      {req.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>• {req.assignee}</span>
                  </div>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Due: {req.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-black mb-5`}>Cost by Category</h2>
          <div className="space-y-4">
            {costAnalysis.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '0.875rem' }}>{item.category}</span>
                  <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold text-sm`}>${item.cost.toLocaleString()}</span>
                </div>
                <div className="w-full rounded-full h-3 bg-gray-200">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{item.percent}% • {item.count} requests</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-2xl w-full p-8`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-black`}>New Maintenance Request</h3>
              <button onClick={closeModal} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <X size={24} />
              </button>
            </div>

            <div className="flex gap-2 mb-8">
              {[1, 2, 3].map(s => (
                <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : (isDark ? 'bg-gray-700' : 'bg-gray-200')}`}></div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-2`}>Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        placeholder="e.g., Plumbing Issue"
                      />
                    </div>
                    <div>
                      <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-2`}>Property *</label>
                      <input
                        type="text"
                        value={formData.property}
                        onChange={(e) => setFormData({...formData, property: e.target.value})}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        placeholder="e.g., Unit 305"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-2`}>Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      >
                        {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-2`}>Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-2`}>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="Describe the issue in detail..."
                      rows="4"
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-2`}>Due Date *</label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-2`}>Assignee</label>
                      <select
                        value={formData.assignee}
                        onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      >
                        <option value="">Select assignee</option>
                        {assignees.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-2 flex items-center gap-2`}>
                      <DollarSign size={16} /> Estimated Cost
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedCost}
                      onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold block mb-2 flex items-center gap-2`}>
                      <FileText size={16} /> Additional Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="Any additional information..."
                      rows="3"
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'} border-2 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                  <h4 className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold mb-4`}>Review Request</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Title:</span><span className={isDark ? 'text-white' : 'text-gray-900'} style={{fontWeight: '600'}}>{formData.title}</span></div>
                    <div className="flex justify-between"><span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Property:</span><span className={isDark ? 'text-white' : 'text-gray-900'} style={{fontWeight: '600'}}>{formData.property}</span></div>
                    <div className="flex justify-between"><span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Category:</span><span className={isDark ? 'text-white' : 'text-gray-900'} style={{fontWeight: '600'}}>{formData.category}</span></div>
                    <div className="flex justify-between"><span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Priority:</span><span className={isDark ? 'text-white' : 'text-gray-900'} style={{fontWeight: '600'}}>{formData.priority}</span></div>
                    <div className="flex justify-between"><span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Due Date:</span><span className={isDark ? 'text-white' : 'text-gray-900'} style={{fontWeight: '600'}}>{formData.dueDate}</span></div>
                    <div className="flex justify-between"><span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Assignee:</span><span className={isDark ? 'text-white' : 'text-gray-900'} style={{fontWeight: '600'}}>{formData.assignee || 'Unassigned'}</span></div>
                    <div className="flex justify-between"><span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Est. Cost:</span><span className={isDark ? 'text-white' : 'text-gray-900'} style={{fontWeight: '600'}}>${formData.estimatedCost || '0'}</span></div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => step > 1 ? setStep(step - 1) : closeModal()}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold transition ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
                >
                  {step === 1 ? 'Cancel' : 'Back'}
                </button>
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition"
                  >
                    Create Request
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
