import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Send,
  Copy,
  Download,
  Calendar,
  Users,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const CompanyInvitations = () => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const [filteredInvitations, setFilteredInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    role: 'all',
    dateSent: 'all'
  });
  const [selectedInvitations, setSelectedInvitations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invitationToDelete, setInvitationToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [inviteData, setInviteData] = useState({
    emails: '',
    role: 'property_manager',
    department: 'operations',
    message: '',
    sendEmail: true,
    expirationDays: 7
  });
  const [sending, setSending] = useState(false);
  const itemsPerPage = 10;

  const roles = [
    { value: 'property_manager', label: 'Property Manager', color: 'bg-green-100 text-green-800' },
    { value: 'leasing_agent', label: 'Leasing Agent', color: 'bg-blue-100 text-blue-800' },
    { value: 'maintenance_supervisor', label: 'Maintenance Supervisor', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'account_manager', label: 'Account Manager', color: 'bg-purple-100 text-purple-800' },
    { value: 'marketing_specialist', label: 'Marketing Specialist', color: 'bg-pink-100 text-pink-800' },
    { value: 'financial_analyst', label: 'Financial Analyst', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'admin_assistant', label: 'Admin Assistant', color: 'bg-gray-100 text-gray-800' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'accepted', label: 'Accepted', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'expired', label: 'Expired', color: 'bg-red-100 text-red-800', icon: XCircle },
    { value: 'revoked', label: 'Revoked', color: 'bg-gray-100 text-gray-800', icon: XCircle },
    { value: 'sent', label: 'Sent', color: 'bg-blue-100 text-blue-800', icon: Send },
  ];

  useEffect(() => {
    loadInvitations();
  }, []);

  useEffect(() => {
    filterInvitations();
  }, [invitations, searchTerm, filters]);

  const loadInvitations = async () => {
    setLoading(true);
    try {
      const data = await getInvitations();
      setInvitations(data);
    } catch (error) {
      console.error('Failed to load invitations:', error);
      // Use sample data for demo
      setInvitations(generateSampleInvitations());
    } finally {
      setLoading(false);
    }
  };

  const generateSampleInvitations = () => {
    const invitations = [];
    const emails = [
      'john.smith@example.com',
      'sarah.johnson@example.com',
      'mike.wilson@example.com',
      'emily.davis@example.com',
      'robert.brown@example.com',
      'jennifer.lee@example.com',
      'david.miller@example.com',
      'lisa.taylor@example.com',
      'james.anderson@example.com',
      'maria.garcia@example.com'
    ];
    
    const rolesList = ['property_manager', 'leasing_agent', 'maintenance_supervisor', 'account_manager', 'marketing_specialist'];
    const statuses = ['pending', 'accepted', 'expired', 'revoked', 'sent'];
    
    for (let i = 0; i < 25; i++) {
      const email = emails[Math.floor(Math.random() * emails.length)];
      const role = rolesList[Math.floor(Math.random() * rolesList.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const sentDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const expiresDate = new Date(sentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      invitations.push({
        id: `inv-${i + 1}`,
        email,
        role,
        status,
        sentDate: sentDate.toISOString(),
        expiresDate: expiresDate.toISOString(),
        invitedBy: 'John Doe',
        department: 'operations',
        token: `invite-token-${Math.random().toString(36).substr(2, 9)}`,
        lastReminder: i % 3 === 0 ? new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString() : null,
        remindersSent: Math.floor(Math.random() * 3),
        message: i % 2 === 0 ? 'Welcome to our team! We look forward to working with you.' : '',
        metadata: {
          ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
    }
    
    return invitations;
  };

  const filterInvitations = () => {
    let filtered = [...invitations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(invitation => 
        invitation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invitation.invitedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invitation.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(invitation => invitation.status === filters.status);
    }

    // Role filter
    if (filters.role !== 'all') {
      filtered = filtered.filter(invitation => invitation.role === filters.role);
    }

    // Date filter
    if (filters.dateSent !== 'all') {
      const now = new Date();
      let cutoff = new Date();
      
      switch(filters.dateSent) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoff.setMonth(now.getMonth() - 3);
          break;
      }
      
      filtered = filtered.filter(invitation => new Date(invitation.sentDate) > cutoff);
    }

    setFilteredInvitations(filtered);
    setCurrentPage(1);
  };

  const handleSelectInvitation = (invitationId) => {
    if (selectedInvitations.includes(invitationId)) {
      setSelectedInvitations(selectedInvitations.filter(id => id !== invitationId));
    } else {
      setSelectedInvitations([...selectedInvitations, invitationId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedInvitations.length === paginatedInvitations.length) {
      setSelectedInvitations([]);
    } else {
      setSelectedInvitations(paginatedInvitations.map(invitation => invitation.id));
    }
  };

  const handleSendInvitation = async () => {
    setSending(true);
    try {
      // Parse multiple emails
      const emails = inviteData.emails.split(/[,;\s]+/).filter(email => email.trim());
      
      for (const email of emails) {
        await sendInvitation({
          ...inviteData,
          email: email.trim()
        });
      }
      
      loadInvitations();
      setShowSendModal(false);
      setInviteData({
        emails: '',
        role: 'property_manager',
        department: 'operations',
        message: '',
        sendEmail: true,
        expirationDays: 7
      });
    } catch (error) {
      console.error('Failed to send invitation:', error);
    } finally {
      setSending(false);
    }
  };

  const handleResendInvitation = async (invitationId) => {
    try {
      await resendInvitation(invitationId);
      loadInvitations();
    } catch (error) {
      console.error('Failed to resend invitation:', error);
    }
  };

  const handleRevokeInvitation = async (invitationId) => {
    try {
      await updateInvitation(invitationId, { status: 'revoked' });
      loadInvitations();
    } catch (error) {
      console.error('Failed to revoke invitation:', error);
    }
  };

  const handleDeleteInvitation = async () => {
    if (!invitationToDelete) return;
    
    try {
      await deleteInvitation(invitationToDelete.id);
      loadInvitations();
      setShowDeleteModal(false);
      setInvitationToDelete(null);
    } catch (error) {
      console.error('Failed to delete invitation:', error);
    }
  };

  const handleCopyInviteLink = (token) => {
    const link = `${window.location.origin}/accept-invitation/${token}`;
    navigator.clipboard.writeText(link);
    // Show toast notification
    alert('Invitation link copied to clipboard!');
  };

  const handleExport = () => {
    const exportData = selectedInvitations.length > 0 
      ? invitations.filter(invitation => selectedInvitations.includes(invitation.id))
      : invitations;
    
    const csvContent = [
      ['Email', 'Role', 'Status', 'Sent Date', 'Expires', 'Invited By', 'Department'],
      ...exportData.map(invitation => [
        invitation.email,
        roles.find(r => r.value === invitation.role)?.label || invitation.role,
        statusOptions.find(s => s.value === invitation.status)?.label || invitation.status,
        new Date(invitation.sentDate).toLocaleDateString(),
        new Date(invitation.expiresDate).toLocaleDateString(),
        invitation.invitedBy,
        invitation.department
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invitations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Pagination
  const totalPages = Math.ceil(filteredInvitations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvitations = filteredInvitations.slice(startIndex, startIndex + itemsPerPage);

  const getDaysUntilExpiry = (expiresDate) => {
    const now = new Date();
    const expiry = new Date(expiresDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isExpiringSoon = (expiresDate) => {
    const days = getDaysUntilExpiry(expiresDate);
    return days > 0 && days <= 3;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invitations</h1>
              <p className="mt-2 text-gray-600">
                Manage team member invitations and access requests
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => setShowSendModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Send Invitation
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Invitations', value: invitations.length, color: 'blue' },
            { label: 'Pending', value: invitations.filter(i => i.status === 'pending').length, color: 'yellow' },
            { label: 'Accepted', value: invitations.filter(i => i.status === 'accepted').length, color: 'green' },
            { label: 'Expiring Soon', value: invitations.filter(i => i.status === 'pending' && isExpiringSoon(i.expiresDate)).length, color: 'red' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search invitations by email, role, or inviter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setFilters({ status: 'all', role: 'all', dateSent: 'all' })}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Reset
              </button>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
                
                <select
                  value={filters.role}
                  onChange={(e) => setFilters({...filters, role: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Roles</option>
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
                
                <select
                  value={filters.dateSent}
                  onChange={(e) => setFilters({...filters, dateSent: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedInvitations.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">
                    {selectedInvitations.length} invitation{selectedInvitations.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {/* Bulk resend */}}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
                  >
                    Resend Selected
                  </button>
                  <button
                    onClick={() => {/* Bulk revoke */}}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
                  >
                    Revoke Selected
                  </button>
                  <button
                    onClick={() => setSelectedInvitations([])}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Invitations Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedInvitations.length === paginatedInvitations.length && paginatedInvitations.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invitation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedInvitations.map((invitation) => {
                  const StatusIcon = statusOptions.find(s => s.value === invitation.status)?.icon || Clock;
                  const daysUntilExpiry = getDaysUntilExpiry(invitation.expiresDate);
                  const isExpiring = isExpiringSoon(invitation.expiresDate);
                  
                  return (
                    <tr key={invitation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedInvitations.includes(invitation.id)}
                          onChange={() => handleSelectInvitation(invitation.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Mail className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {invitation.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              Invited by {invitation.invitedBy}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Department: {invitation.department}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            roles.find(r => r.value === invitation.role)?.color || 'bg-gray-100 text-gray-800'
                          }`}>
                            {roles.find(r => r.value === invitation.role)?.label || invitation.role}
                          </span>
                          <div className="flex items-center">
                            <StatusIcon className={`w-4 h-4 mr-2 ${
                              invitation.status === 'pending' ? 'text-yellow-500' :
                              invitation.status === 'accepted' ? 'text-green-500' :
                              invitation.status === 'expired' ? 'text-red-500' :
                              'text-gray-500'
                            }`} />
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              statusOptions.find(s => s.value === invitation.status)?.color || 'bg-gray-100 text-gray-800'
                            }`}>
                              {statusOptions.find(s => s.value === invitation.status)?.label || invitation.status}
                            </span>
                          </div>
                          {invitation.remindersSent > 0 && (
                            <div className="text-xs text-gray-500">
                              {invitation.remindersSent} reminder{invitation.remindersSent !== 1 ? 's' : ''} sent
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="w-3 h-3 mr-2 text-gray-400" />
                            Sent: {new Date(invitation.sentDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="w-3 h-3 mr-2 text-gray-400" />
                            Expires: {new Date(invitation.expiresDate).toLocaleDateString()}
                          </div>
                          {invitation.status === 'pending' && (
                            <div className={`text-xs ${isExpiring ? 'text-red-600' : 'text-gray-500'}`}>
                              {daysUntilExpiry > 0 
                                ? `${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''} remaining`
                                : 'Expired'}
                              {isExpiring && (
                                <AlertTriangle className="w-3 h-3 inline ml-1" />
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {invitation.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleResendInvitation(invitation.id)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Resend"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleCopyInviteLink(invitation.token)}
                                className="text-purple-600 hover:text-purple-900"
                                title="Copy Link"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRevokeInvitation(invitation.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Revoke"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              setSelectedInvitation(invitation);
                              setShowDetailsModal(true);
                            }}
                            className="text-gray-600 hover:text-gray-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setInvitationToDelete(invitation);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredInvitations.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredInvitations.length}</span> invitations
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredInvitations.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invitations found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filters.status !== 'all' || filters.role !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No invitations have been sent yet'}
            </p>
            <button
              onClick={() => setShowSendModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Send First Invitation
            </button>
          </div>
        )}

        {/* Send Invitation Modal */}
        {showSendModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Send Invitation
                  </h3>
                  <button
                    onClick={() => setShowSendModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Addresses *
                    </label>
                    <textarea
                      value={inviteData.emails}
                      onChange={(e) => setInviteData({...inviteData, emails: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email addresses separated by commas, semicolons, or new lines"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You can invite multiple team members at once
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role *
                      </label>
                      <select
                        value={inviteData.role}
                        onChange={(e) => setInviteData({...inviteData, role: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        {roles.map(role => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <select
                        value={inviteData.department}
                        onChange={(e) => setInviteData({...inviteData, department: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="operations">Operations</option>
                        <option value="leasing">Leasing</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="finance">Finance</option>
                        <option value="marketing">Marketing</option>
                        <option value="admin">Administration</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiration Days
                    </label>
                    <select
                      value={inviteData.expirationDays}
                      onChange={(e) => setInviteData({...inviteData, expirationDays: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="1">1 Day</option>
                      <option value="3">3 Days</option>
                      <option value="7">7 Days</option>
                      <option value="14">14 Days</option>
                      <option value="30">30 Days</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      The invitation will expire after this period
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Personal Message (Optional)
                    </label>
                    <textarea
                      value={inviteData.message}
                      onChange={(e) => setInviteData({...inviteData, message: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a personal welcome message..."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sendEmail"
                      checked={inviteData.sendEmail}
                      onChange={(e) => setInviteData({...inviteData, sendEmail: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sendEmail" className="ml-2 block text-sm text-gray-700">
                      Send invitation email
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowSendModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendInvitation}
                    disabled={sending || !inviteData.emails.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {sending ? (
                      <div className="flex items-center">
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      'Send Invitations'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && invitationToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete Invitation
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete the invitation to {invitationToDelete.email}?
                This action cannot be undone.
              </p>
              {invitationToDelete.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">Pending Invitation</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        This invitation is still pending. Deleting it will prevent the user from accepting it.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setInvitationToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteInvitation}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Invitation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedInvitation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Invitation Details
                  </h3>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedInvitation(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{selectedInvitation.email}</h4>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          roles.find(r => r.value === selectedInvitation.role)?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {roles.find(r => r.value === selectedInvitation.role)?.label || selectedInvitation.role}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusOptions.find(s => s.value === selectedInvitation.status)?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {statusOptions.find(s => s.value === selectedInvitation.status)?.label || selectedInvitation.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Invitation Details</h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Invited By:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedInvitation.invitedBy}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Department:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedInvitation.department}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Sent Date:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(selectedInvitation.sentDate).toLocaleDateString()} at{' '}
                            {new Date(selectedInvitation.sentDate).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Expires:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(selectedInvitation.expiresDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Status Information</h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Days Remaining:</span>
                          <span className={`text-sm font-medium ${
                            getDaysUntilExpiry(selectedInvitation.expiresDate) <= 3 ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {getDaysUntilExpiry(selectedInvitation.expiresDate)} days
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Reminders Sent:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedInvitation.remindersSent}
                          </span>
                        </div>
                        {selectedInvitation.lastReminder && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Last Reminder:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {new Date(selectedInvitation.lastReminder).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Invitation Message */}
                  {selectedInvitation.message && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Personal Message</h5>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700 italic">"{selectedInvitation.message}"</p>
                      </div>
                    </div>
                  )}

                  {/* Invitation Link */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Invitation Link</h5>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2 font-mono text-sm truncate">
                        {`${window.location.origin}/accept-invitation/${selectedInvitation.token}`}
                      </div>
                      <button
                        onClick={() => handleCopyInviteLink(selectedInvitation.token)}
                        className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </button>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Technical Details</h5>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <pre className="text-xs text-gray-100 overflow-x-auto">
                        {JSON.stringify(selectedInvitation.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-3">
                    {selectedInvitation.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleResendInvitation(selectedInvitation.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Resend Invitation
                        </button>
                        <button
                          onClick={() => handleRevokeInvitation(selectedInvitation.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Revoke Invitation
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedInvitation(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyInvitations;