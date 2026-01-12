import React, { useState } from 'react';
import { Plus, AlertCircle, CheckCircle, Clock, Wrench } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const MaintenancePage = () => {
  const { isDark, getClassNames } = useThemeMode();
  const containerClasses = `${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 min-h-screen`;
  const cardClasses = `${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`;
  const titleClasses = `${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-bold mb-2`;
  const subtitleClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-8`;
  const textClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'}`;
  const [requests] = useState([
    { id: 1, title: 'Water Leak in Bathroom', description: 'Leak under the sink', priority: 'high', status: 'in-progress', date: '2025-12-15', category: 'Plumbing', image: '💧' },
    { id: 2, title: 'Door Lock Issue', description: 'Front door lock not working properly', priority: 'medium', status: 'pending', date: '2025-12-18', category: 'Hardware', image: '🔒' },
    { id: 3, title: 'AC Not Cooling', description: 'Air conditioner not blowing cold air', priority: 'high', status: 'pending', date: '2025-12-19', category: 'HVAC', image: '❄️' },
    { id: 4, title: 'Broken Window', description: 'Crack in bedroom window', priority: 'medium', status: 'completed', date: '2025-12-10', category: 'Window', image: '🪟' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    image: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Maintenance request submitted:', formData);
    setShowForm(false);
    setFormData({ title: '', description: '', category: 'other', priority: 'medium', image: null });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={20} />;
      case 'in-progress': return <Clock size={20} />;
      default: return <AlertCircle size={20} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={titleClasses}>🔧 Maintenance Requests</h1>
        <p className={subtitleClasses}>Submit and track maintenance issues</p>
      </div>

      {/* Submit Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition flex items-center gap-2 font-medium"
      >
        <Plus size={20} /> Submit Maintenance Request
      </button>

      {/* Submit Form */}
      {showForm && (
        <div className={cardClasses + ' mb-8'}>
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Submit Maintenance Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${textClasses}`}>Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Leaky faucet"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textClasses}`}>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="hvac">HVAC</option>
                  <option value="hardware">Hardware</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textClasses}`}>Description</label>
              <textarea
                required
                placeholder="Describe the issue in detail..."
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textClasses}`}>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium"
              >
                Submit Request
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={`flex-1 py-2 rounded-lg transition font-medium border ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className={cardClasses + ' text-center'}>
          <p className={`text-sm font-medium mb-2 ${textClasses}`}>Total Requests</p>
          <p className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{requests.length}</p>
        </div>
        <div className={cardClasses + ' text-center'}>
          <p className={`text-sm font-medium mb-2 ${textClasses}`}>Pending</p>
          <p className="text-4xl font-bold text-yellow-600">{requests.filter(r => r.status === 'pending').length}</p>
        </div>
        <div className={cardClasses + ' text-center'}>
          <p className={`text-sm font-medium mb-2 ${textClasses}`}>In Progress</p>
          <p className="text-4xl font-bold text-blue-600">{requests.filter(r => r.status === 'in-progress').length}</p>
        </div>
        <div className={cardClasses + ' text-center'}>
          <p className={`text-sm font-medium mb-2 ${textClasses}`}>Completed</p>
          <p className="text-4xl font-bold text-green-600">{requests.filter(r => r.status === 'completed').length}</p>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className={cardClasses + ' mb-8'}>
        <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>🚨 Emergency Contacts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-red-50'} border-2 ${isDark ? 'border-red-900' : 'border-red-200'}`}>
            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-red-300' : 'text-red-700'}`}>Emergency Maintenance</p>
            <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>+1 (555) 911-MAINT</p>
            <p className={`text-xs ${textClasses} mt-1`}>Available 24/7 for emergencies</p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-orange-50'} border-2 ${isDark ? 'border-orange-900' : 'border-orange-200'}`}>
            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>Maintenance Team</p>
            <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>+1 (555) 123-REPAIR</p>
            <p className={`text-xs ${textClasses} mt-1`}>Business hours only</p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'} border-2 ${isDark ? 'border-blue-900' : 'border-blue-200'}`}>
            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>Property Manager</p>
            <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>+1 (555) 456-MGMT</p>
            <p className={`text-xs ${textClasses} mt-1`}>For urgent issues</p>
          </div>
        </div>
      </div>

      {/* Maintenance Tips Section */}
      <div className={cardClasses + ' mb-8'}>
        <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>💡 Maintenance Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Before Submitting a Request</h4>
            <ul className={`text-sm space-y-2 ${textClasses}`}>
              <li>✓ Provide clear details about the issue</li>
              <li>✓ Include photos if possible</li>
              <li>✓ Note when the problem started</li>
              <li>✓ Indicate preferred contact times</li>
            </ul>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Common Issues</h4>
            <ul className={`text-sm space-y-2 ${textClasses}`}>
              <li>🚿 Plumbing: Leaks, slow drains</li>
              <li>⚡ Electrical: Outlets, switches</li>
              <li>❄️ HVAC: Temperature control</li>
              <li>🪟 Doors/Windows: Locks, seals</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <div key={request.id} className={cardClasses + ' overflow-hidden hover:shadow-lg transition'}>
            <div className="h-20 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-4xl -m-6 mb-6">
              {request.image}
            </div>
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{request.title}</h3>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
              <p className={`text-sm mb-4 ${textClasses}`}>{request.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(request.priority)}`}>
                    {request.priority.toUpperCase()}
                  </span>
                  <span className={`text-xs ${textClasses}`}>{request.category}</span>
                </div>
              </div>
              <div className={`flex items-center justify-between text-xs ${textClasses} border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
                <span>Submitted: {new Date(request.date).toLocaleDateString()}</span>
                <button className="text-blue-600 hover:text-blue-700 font-medium">View Details →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenancePage;
