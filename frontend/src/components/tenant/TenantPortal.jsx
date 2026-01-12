import React, { useState, useEffect } from 'react';
import { 
  Home, Bell, FileText, Wrench, CreditCard, 
  MessageSquare, Calendar, Settings, LogOut,
  ChevronRight, AlertCircle, CheckCircle, Clock,
  DollarSign, Download, Upload, Eye, Edit
} from 'lucide-react';

const TenantPortal = ({ tenantId }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tenantData, setTenantData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Mock data - replace with API calls
    setTenantData({
      id: tenantId,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      property: 'Sunset Apartments',
      unit: 'A-205',
      address: '123 Main St, San Francisco, CA 94105',
      leaseStart: '2024-01-01',
      leaseEnd: '2024-12-31',
      rentAmount: 2500,
      nextPaymentDue: '2024-03-01',
      lateFee: 100,
      balance: 0
    });

    setNotifications([
      { id: 1, type: 'payment', title: 'Rent Due Reminder', message: 'Rent payment due in 3 days', date: '2024-02-27', read: false },
      { id: 2, type: 'maintenance', title: 'Maintenance Completed', message: 'Your plumbing repair has been completed', date: '2024-02-25', read: true },
      { id: 3, type: 'announcement', title: 'Building Maintenance', message: 'Elevator maintenance scheduled for March 5', date: '2024-02-24', read: true }
    ]);

    setMaintenanceRequests([
      { id: 1, type: 'Plumbing', description: 'Kitchen sink leaking', status: 'completed', date: '2024-02-20', priority: 'high', assignedTo: 'John Smith' },
      { id: 2, type: 'Electrical', description: 'Bedroom light not working', status: 'in-progress', date: '2024-02-25', priority: 'medium', assignedTo: 'Mike Johnson' },
      { id: 3, type: 'HVAC', description: 'AC not cooling properly', status: 'pending', date: '2024-02-28', priority: 'low', assignedTo: null }
    ]);

    setPayments([
      { id: 1, date: '2024-02-01', amount: 2500, method: 'Bank Transfer', status: 'paid', receipt: 'receipt_001.pdf' },
      { id: 2, date: '2024-01-01', amount: 2500, method: 'Credit Card', status: 'paid', receipt: 'receipt_002.pdf' },
      { id: 3, date: '2023-12-01', amount: 2500, method: 'Bank Transfer', status: 'paid', receipt: 'receipt_003.pdf' }
    ]);

    setDocuments([
      { id: 1, name: 'Lease Agreement', type: 'pdf', date: '2024-01-01', size: '2.4 MB', url: '#' },
      { id: 2, name: 'House Rules', type: 'pdf', date: '2024-01-01', size: '1.2 MB', url: '#' },
      { id: 3, name: 'Move-in Checklist', type: 'pdf', date: '2024-01-01', size: '0.8 MB', url: '#' }
    ]);

    setMessages([
      { id: 1, from: 'Property Manager', message: 'Maintenance scheduled for tomorrow at 10 AM', date: '2024-02-26', read: true },
      { id: 2, from: 'Maintenance Team', message: 'Your work order has been assigned', date: '2024-02-25', read: false }
    ]);
  }, [tenantId]);

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out...');
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleNewMaintenanceRequest = () => {
    // Open maintenance request form
    console.log('Open maintenance request form');
  };

  const handlePayment = () => {
    // Open payment form
    console.log('Open payment form');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {tenantData?.name}!</h2>
            <p className="mt-2 opacity-90">Here's what's happening with your rental</p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg">
            <Home className="w-8 h-8" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <p className="text-sm opacity-90">Current Unit</p>
            <p className="text-xl font-bold mt-1">{tenantData?.unit}</p>
            <p className="text-sm opacity-90">{tenantData?.property}</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <p className="text-sm opacity-90">Next Payment Due</p>
            <p className="text-xl font-bold mt-1">{tenantData?.nextPaymentDue}</p>
            <p className="text-sm opacity-90">${tenantData?.rentAmount}</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <p className="text-sm opacity-90">Lease Ends</p>
            <p className="text-xl font-bold mt-1">{tenantData?.leaseEnd}</p>
            <p className="text-sm opacity-90">Auto-renewal enabled</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={handlePayment}
          className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors"
        >
          <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <span className="font-medium text-gray-900">Make Payment</span>
        </button>
        <button 
          onClick={handleNewMaintenanceRequest}
          className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors"
        >
          <Wrench className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <span className="font-medium text-gray-900">Request Maintenance</span>
        </button>
        <button 
          onClick={() => setActiveTab('messages')}
          className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors"
        >
          <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <span className="font-medium text-gray-900">Message Manager</span>
        </button>
        <button 
          onClick={() => setActiveTab('documents')}
          className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors"
        >
          <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <span className="font-medium text-gray-900">View Documents</span>
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <Bell className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {notifications.slice(0, 3).map(notification => (
            <div 
              key={notification.id} 
              className={`flex items-center justify-between p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${notification.read ? 'bg-gray-200' : 'bg-blue-100'}`}>
                  <Bell className={`w-4 h-4 ${notification.read ? 'text-gray-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{notification.date}</span>
                {!notification.read && (
                  <button 
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {notifications.length > 3 && (
          <button 
            onClick={() => setActiveTab('notifications')}
            className="mt-4 w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View all notifications ({notifications.length})
          </button>
        )}
      </div>

      {/* Maintenance Requests */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Maintenance Requests</h3>
          <Wrench className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {maintenanceRequests.map(request => (
            <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  request.status === 'completed' ? 'bg-green-100' : 
                  request.status === 'in-progress' ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  {request.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : request.status === 'in-progress' ? (
                    <Clock className="w-4 h-4 text-yellow-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{request.type}</p>
                  <p className="text-sm text-gray-600">{request.description}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      request.priority === 'high' ? 'bg-red-100 text-red-800' :
                      request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {request.priority} priority
                    </span>
                    <span className="text-xs text-gray-500">{request.date}</span>
                  </div>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Details
              </button>
            </div>
          ))}
        </div>
        <button 
          onClick={handleNewMaintenanceRequest}
          className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          New Maintenance Request
        </button>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
            <p className="text-gray-600 mt-1">View and download your payment receipts</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handlePayment}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <DollarSign className="w-4 h-4" />
              <span>Make Payment</span>
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.method}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.receipt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Eye className="w-4 h-4 inline mr-1" />
                      View
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Download className="w-4 h-4 inline mr-1" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Next Payment Due</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">${tenantData?.rentAmount}</p>
              <p className="text-sm text-blue-700 mt-1">Due on {tenantData?.nextPaymentDue}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-900">Current Balance</p>
              <p className="text-2xl font-bold text-green-900 mt-1">${tenantData?.balance}</p>
              <p className="text-sm text-green-700 mt-1">No overdue payments</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-purple-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-900">Late Fee</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">${tenantData?.lateFee}</p>
              <p className="text-sm text-purple-700 mt-1">Applies 5 days after due date</p>
            </div>
            <AlertCircle className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaintenance = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Maintenance Requests</h3>
          <p className="text-gray-600 mt-1">Track and manage your maintenance requests</p>
        </div>
        <button 
          onClick={handleNewMaintenanceRequest}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Wrench className="w-4 h-4" />
          <span>New Request</span>
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{maintenanceRequests.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {maintenanceRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {maintenanceRequests.filter(r => r.status === 'in-progress').length}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {maintenanceRequests.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Recent Requests</h4>
        </div>
        <div className="divide-y divide-gray-200">
          {maintenanceRequests.map(request => (
            <div key={request.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      request.status === 'completed' ? 'bg-green-100 text-green-800' :
                      request.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      request.priority === 'high' ? 'bg-red-100 text-red-800' :
                      request.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {request.priority} priority
                    </span>
                    <span className="text-sm text-gray-500">{request.date}</span>
                  </div>
                  <h5 className="mt-3 font-medium text-gray-900">{request.type}</h5>
                  <p className="mt-1 text-gray-600">{request.description}</p>
                  {request.assignedTo && (
                    <p className="mt-2 text-sm text-gray-500">
                      Assigned to: <span className="font-medium">{request.assignedTo}</span>
                    </p>
                  )}
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
          <p className="text-gray-600 mt-1">Access and download your rental documents</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Download All</span>
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map(doc => (
          <div key={doc.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-gray-500 uppercase">{doc.type}</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">{doc.name}</h4>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{doc.date}</span>
              <span>{doc.size}</span>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-medium text-gray-900 mb-4">Upload Documents</h4>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Click to upload or drag and drop
              </span>
              <span className="mt-1 block text-sm text-gray-500">
                PDF, JPG, PNG up to 10MB
              </span>
              <input
                type="file"
                multiple
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <button
                type="button"
                onClick={() => document.querySelector('input[type="file"]').click()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Select Files
              </button>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="bg-white rounded-xl border border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
      </div>
      <div className="p-6 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`p-4 rounded-lg ${msg.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-gray-900">{msg.from}</span>
              <span className="text-sm text-gray-500">{msg.date}</span>
            </div>
            <p className="text-gray-600">{msg.message}</p>
            {!msg.read && (
              <div className="mt-3 flex justify-end">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Mark as read
                </button>
              </div>
            )}
          </div>
        ))}
        <div className="pt-4 border-t border-gray-200">
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Type your message here..."
          />
          <div className="mt-3 flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <p className="text-gray-600 mt-1">Stay updated with your rental activities</p>
        </div>
        <button 
          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-6 ${notification.read ? '' : 'bg-blue-50'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${notification.read ? 'bg-gray-100' : 'bg-blue-100'}`}>
                    <Bell className={`w-5 h-5 ${notification.read ? 'text-gray-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{notification.title}</h5>
                    <p className="mt-1 text-gray-600">{notification.message}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{notification.date}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        notification.type === 'payment' ? 'bg-green-100 text-green-800' :
                        notification.type === 'maintenance' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {notification.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                  <button className="text-gray-400 hover:text-gray-600">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue={tenantData?.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                defaultValue={tenantData?.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                defaultValue={tenantData?.phone}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
              <input
                type="text"
                placeholder="Emergency contact name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notification Preferences</label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Email notifications</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700">Push notifications</span>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Password</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'payments': return renderPayments();
      case 'maintenance': return renderMaintenance();
      case 'documents': return renderDocuments();
      case 'messages': return renderMessages();
      case 'notifications': return renderNotifications();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Home className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">StaySpot Tenant Portal</h1>
                <p className="text-sm text-gray-600">Welcome to your rental dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                  <Bell className="w-6 h-6" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{tenantData?.name}</p>
                  <p className="text-xs text-gray-500">Tenant • {tenantData?.unit}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-medium text-blue-600">
                    {tenantData?.name?.charAt(0)}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3 mb-8 lg:mb-0">
            <nav className="bg-white rounded-xl shadow-sm p-4 space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Home },
                { id: 'payments', label: 'Payments', icon: CreditCard },
                { id: 'maintenance', label: 'Maintenance', icon: Wrench },
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'messages', label: 'Messages', icon: MessageSquare },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${
                        activeTab === item.id ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {activeTab === item.id && <ChevronRight className="w-5 h-5 text-blue-600" />}
                  </button>
                );
              })}
            </nav>

            {/* Quick Info */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
              <h4 className="font-medium text-gray-900 mb-3">Quick Info</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Unit</span>
                  <span className="font-medium">{tenantData?.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rent</span>
                  <span className="font-medium">${tenantData?.rentAmount}/month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Next Payment</span>
                  <span className="font-medium">{tenantData?.nextPaymentDue}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lease End</span>
                  <span className="font-medium">{tenantData?.leaseEnd}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TenantPortal;