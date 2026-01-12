import React, { useState } from 'react';
import { Plus, Search, Filter, Mail, CheckCircle, Clock, XCircle, Trash2, Send, Eye, MoreVertical, User, Building } from 'lucide-react';

const Invitations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [invitations, setInvitations] = useState([
    { id: 1, type: 'tenant', name: 'John Doe', email: 'john@example.com', property: 'Downtown Apartments - Unit 101', status: 'pending', sentDate: '2024-03-15', expiresDate: '2024-03-22' },
    { id: 2, type: 'tenant', name: 'Sarah Johnson', email: 'sarah@example.com', property: 'Riverside Complex - Unit 202', status: 'accepted', sentDate: '2024-03-10', acceptedDate: '2024-03-12' },
    { id: 3, type: 'vendor', name: 'Cool Air Services', email: 'contact@coolairservices.com', property: 'HVAC Maintenance', status: 'pending', sentDate: '2024-03-14', expiresDate: '2024-03-21' },
    { id: 4, type: 'tenant', name: 'Mike Brown', email: 'mike@example.com', property: 'Hillside Residences - Unit 303', status: 'rejected', sentDate: '2024-03-08', rejectedDate: '2024-03-09' },
    { id: 5, type: 'vendor', name: 'Quick Plumbing', email: 'info@quickplumbing.com', property: 'Plumbing Services', status: 'accepted', sentDate: '2024-03-05', acceptedDate: '2024-03-06' },
    { id: 6, type: 'tenant', name: 'Emily Davis', email: 'emily@example.com', property: 'Garden Plaza - Unit 404', status: 'pending', sentDate: '2024-03-16', expiresDate: '2024-03-23' }
  ]);

  const stats = [
    { label: 'Total Invitations', value: invitations.length, icon: Mail, color: 'blue' },
    { label: 'Pending', value: invitations.filter(inv => inv.status === 'pending').length, icon: Clock, color: 'yellow' },
    { label: 'Accepted', value: invitations.filter(inv => inv.status === 'accepted').length, icon: CheckCircle, color: 'green' },
    { label: 'Rejected', value: invitations.filter(inv => inv.status === 'rejected').length, icon: XCircle, color: 'red' }
  ];

  const filteredInvitations = invitations.filter(inv => {
    const matchesSearch = inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || inv.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id) => {
    setInvitations(invitations.filter(inv => inv.id !== id));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-700 dark:text-yellow-300' };
      case 'accepted': return { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-300' };
      case 'rejected': return { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300' };
      default: return { bg: 'bg-gray-50 dark:bg-gray-900/20', border: 'border-gray-200 dark:border-gray-800', text: 'text-gray-700 dark:text-gray-300' };
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200';
      case 'accepted': return 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getTypeColor = (type) => {
    return type === 'tenant' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200' : 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Invitations</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage tenant and vendor invitations</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
            <Plus className="h-5 w-5" />
            Send Invitation
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
              yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
              green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
              red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            };
            return (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invitations List */}
      <div className="space-y-4">
        {filteredInvitations.length > 0 ? (
          filteredInvitations.map(invitation => {
            const colors = getStatusColor(invitation.status);
            return (
              <div key={invitation.id} className={`rounded-xl border ${colors.bg} ${colors.border} hover:shadow-md transition-all`}>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2.5 rounded-lg ${invitation.type === 'tenant' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
                          {invitation.type === 'tenant' ? (
                            <User className={`h-5 w-5 ${invitation.type === 'tenant' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />
                          ) : (
                            <Building className={`h-5 w-5 ${invitation.type === 'tenant' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{invitation.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{invitation.email}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{invitation.property}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>Sent: {invitation.sentDate}</span>
                        {invitation.status === 'pending' && <span>• Expires: {invitation.expiresDate}</span>}
                        {invitation.status === 'accepted' && <span>• Accepted: {invitation.acceptedDate}</span>}
                        {invitation.status === 'rejected' && <span>• Rejected: {invitation.rejectedDate}</span>}
                      </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadge(invitation.status)}`}>
                        {invitation.status === 'pending' && '⏳ Pending'}
                        {invitation.status === 'accepted' && '✓ Accepted'}
                        {invitation.status === 'rejected' && '✕ Rejected'}
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${getTypeColor(invitation.type)}`}>
                        {invitation.type === 'tenant' ? '👤 Tenant' : '🏢 Vendor'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    {invitation.status === 'pending' && (
                      <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                        <Send className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(invitation.id)} className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
            <Mail className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No invitations found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invitations;
