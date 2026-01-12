import React, { useState } from 'react';
import { Wrench, Plus, Search, Filter, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';
import WorkOrderForm from '../../components/WorkOrderForm';

const Maintenance = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showWorkOrderForm, setShowWorkOrderForm] = useState(false);
  
  const [workOrders, setWorkOrders] = useState([
    {
      id: 1,
      title: 'Leaky Faucet',
      property: 'Apt 101',
      tenant: 'John Smith',
      priority: 'high',
      status: 'in-progress',
      date: '2024-01-10',
      vendor: 'Quick Plumbing',
      cost: 150
    },
    {
      id: 2,
      title: 'AC Not Working',
      property: 'Apt 202',
      tenant: 'Sarah Johnson',
      priority: 'urgent',
      status: 'pending',
      date: '2024-01-12',
      vendor: 'Cool Air Services',
      cost: 350
    },
    {
      id: 3,
      title: 'Door Lock Repair',
      property: 'Apt 303',
      tenant: 'Michael Brown',
      priority: 'medium',
      status: 'completed',
      date: '2024-01-08',
      vendor: 'Security Plus',
      cost: 200
    },
    {
      id: 4,
      title: 'Paint Wall',
      property: 'Apt 104',
      tenant: 'Emily Davis',
      priority: 'low',
      status: 'pending',
      date: '2024-01-11',
      vendor: 'Paint Masters',
      cost: 300
    }
  ]);

  const stats = [
    { label: 'Total Requests', value: workOrders.length.toString(), icon: Wrench, color: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'In Progress', value: workOrders.filter(w => w.status === 'in-progress').length.toString(), icon: Clock, color: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { label: 'Completed', value: workOrders.filter(w => w.status === 'completed').length.toString(), icon: CheckCircle, color: 'bg-green-100 dark:bg-green-900/20' },
    { label: 'Avg Cost', value: '$245', icon: Zap, color: 'bg-purple-100 dark:bg-purple-900/20' }
  ];

  const handleAddWorkOrder = (formData) => {
    const newOrder = {
      id: workOrders.length + 1,
      title: formData.title,
      property: formData.property,
      tenant: 'New Tenant',
      priority: formData.priority,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      vendor: formData.assignedTo || 'Unassigned',
      cost: parseInt(formData.estimatedCost) || 0
    };
    setWorkOrders([...workOrders, newOrder]);
    setShowWorkOrderForm(false);
  };

  const filtered = workOrders.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || req.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800';
      case 'high': return isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-800';
      case 'medium': return isDarkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
      case 'low': return isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800';
      default: return isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800';
      case 'in-progress': return isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800';
      case 'pending': return isDarkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
      default: return isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen p-6 transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Maintenance</h1>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Track and manage maintenance requests</p>
          </div>
          <button onClick={() => setShowWorkOrderForm(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
            <Plus className="h-5 w-5" />
            New Request
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`${stat.color} rounded-lg p-6 transition-colors`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                    <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
              </div>
            );
          })}
        </div>

        <div className={`rounded-lg shadow p-4 mb-6 transition-colors ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-2 border rounded-lg transition-colors ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map(request => (
            <div key={request.id} className={`rounded-lg shadow hover:shadow-lg transition-all p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{request.title}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{request.property} • {request.tenant}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(request.priority)}`}>
                    {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                    {request.status === 'in-progress' ? 'In Progress' : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Date Reported</p>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{new Date(request.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Vendor</p>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{request.vendor}</p>
                </div>
                <div>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Estimated Cost</p>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${request.cost}</p>
                </div>
                <div>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Days Open</p>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{Math.floor((new Date() - new Date(request.date)) / (1000 * 60 * 60 * 24))} days</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}>
                  View Details
                </button>
                <button className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No maintenance requests found</p>
          </div>
        )}
      </div>

      {showWorkOrderForm && <WorkOrderForm onClose={() => setShowWorkOrderForm(false)} onSubmit={handleAddWorkOrder} />}
    </div>
  );
};

export default Maintenance;
