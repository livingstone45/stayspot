import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, MessageSquare, Clock, CheckCircle, AlertCircle, Trash2, Download } from 'lucide-react';
import Button from '../../components/common/UI/Button';
import Modal from '../../components/common/UI/Modal';
import Select from '../../components/common/UI/Select';
import Alert from '../../components/common/UI/Alert';
import Loader from '../../components/common/UI/Loader';
import { useTheme } from '../../contexts/ThemeContext';

const SupportTickets = () => {
  const { isDarkMode } = useTheme();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 });
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  useEffect(() => {
    fetchTickets();
  }, [search, status, priority, page]);

  const mockTickets = [
    { id: 'TKT001', subject: 'Login issue', description: 'Cannot login to account', priority: 'high', status: 'open', createdAt: new Date(Date.now() - 2*24*60*60*1000) },
    { id: 'TKT002', subject: 'Payment failed', description: 'Payment processing error', priority: 'urgent', status: 'in_progress', createdAt: new Date(Date.now() - 5*24*60*60*1000) },
    { id: 'TKT003', subject: 'Feature request', description: 'Request for new feature', priority: 'low', status: 'resolved', createdAt: new Date(Date.now() - 1*24*60*60*1000) },
    { id: 'TKT004', subject: 'Bug report', description: 'App crashes on startup', priority: 'high', status: 'in_progress', createdAt: new Date(Date.now() - 10*24*60*60*1000) },
    { id: 'TKT005', subject: 'Account deletion', description: 'Request to delete account', priority: 'medium', status: 'open', createdAt: new Date(Date.now() - 3*24*60*60*1000) }
  ];

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page, limit: 20, ...(search && { search }), ...(status && { status }), ...(priority && { priority }) });
      
      const response = await fetch(`/api/support/tickets?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const filtered = mockTickets.filter(t => 
          (!search || t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search)) &&
          (!status || t.status === status) &&
          (!priority || t.priority === priority)
        );
        setTickets(filtered);
        setStats({
          total: mockTickets.length,
          open: mockTickets.filter(t => t.status === 'open').length,
          inProgress: mockTickets.filter(t => t.status === 'in_progress').length,
          resolved: mockTickets.filter(t => t.status === 'resolved').length,
          closed: mockTickets.filter(t => t.status === 'closed').length
        });
        setPagination({ total: filtered.length, pages: 1 });
        setLoading(false);
        return;
      }
      const data = await response.json();
      
      setTickets(data.data || []);
      setStats(data.stats || {});
      setPagination(data.pagination || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/support/tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: replyText })
      });

      if (!response.ok) throw new Error('Failed to send reply');
      
      setSuccess('Reply sent successfully');
      setShowReply(false);
      setReplyText('');
      fetchTickets();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/support/tickets/${selectedTicket.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update ticket');
      
      setSuccess('Ticket updated successfully');
      setShowDetail(false);
      fetchTickets();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (p) => {
    const colors = { low: 'blue', medium: 'yellow', high: 'orange', urgent: 'red' };
    return colors[p] || 'gray';
  };

  const getStatusColor = (s) => {
    const colors = { open: 'red', 'in_progress': 'yellow', resolved: 'green', closed: 'gray' };
    return colors[s] || 'gray';
  };

  const getStatusLabel = (s) => {
    const labels = { open: 'Open', 'in_progress': 'In Progress', resolved: 'Resolved', closed: 'Closed' };
    return labels[s] || s;
  };

  return (
    <div className={`min-h-screen ${bgClass} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${textClass}`}>Support Tickets</h1>
            <p className={`${textSecondaryClass}`}>Manage customer support requests</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Ticket
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, icon: MessageSquare },
            { label: 'Open', value: stats.open, icon: AlertCircle },
            { label: 'In Progress', value: stats.inProgress, icon: Clock },
            { label: 'Resolved', value: stats.resolved, icon: CheckCircle },
            { label: 'Closed', value: stats.closed, icon: CheckCircle }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`${cardClass} p-4 rounded-lg shadow`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${textSecondaryClass}`}>{stat.label}</p>
                    <p className={`text-2xl font-bold ${textClass}`}>{stat.value}</p>
                  </div>
                  <Icon className="w-8 h-8 opacity-50" />
                </div>
              </div>
            );
          })}
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {/* Filters */}
        <div className={`${cardClass} rounded-lg shadow p-6 mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textClass}`}>Search</label>
              <input
                type="text"
                placeholder="Ticket ID, subject..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${borderClass} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textClass}`}>Status</label>
              <Select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'open', label: 'Open' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'resolved', label: 'Resolved' },
                  { value: 'closed', label: 'Closed' }
                ]}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textClass}`}>Priority</label>
              <Select
                value={priority}
                onChange={(e) => { setPriority(e.target.value); setPage(1); }}
                options={[
                  { value: '', label: 'All Priority' },
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'urgent', label: 'Urgent' }
                ]}
              />
            </div>
            <div className="flex items-end">
              <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <Loader />
        ) : tickets.length > 0 ? (
          <div className={`${cardClass} rounded-lg shadow overflow-hidden`}>
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Ticket ID</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Subject</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Priority</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Status</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Created</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, idx) => (
                  <tr key={ticket.id} className={idx % 2 === 0 ? '' : isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <td className={`px-6 py-4 text-sm font-medium ${textClass}`}>#{ticket.id?.slice(0, 8)}</td>
                    <td className={`px-6 py-4 text-sm ${textClass}`}>{ticket.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${getPriorityColor(ticket.priority)}-100 text-${getPriorityColor(ticket.priority)}-800`}>
                        {ticket.priority?.charAt(0).toUpperCase() + ticket.priority?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${getStatusColor(ticket.status)}-100 text-${getStatusColor(ticket.status)}-800`}>
                        {getStatusLabel(ticket.status)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${textClass}`}>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSelectedTicket(ticket); setShowDetail(true); }}
                          className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => { setSelectedTicket(ticket); setShowReply(true); }}
                          className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                        >
                          <MessageSquare className="w-4 h-4 text-green-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className={`px-6 py-4 border-t ${borderClass} flex items-center justify-between`}>
                <p className={`text-sm ${textSecondaryClass}`}>Page {page} of {pagination.pages}</p>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
                    Previous
                  </Button>
                  <Button variant="secondary" onClick={() => setPage(Math.min(pagination.pages, page + 1))} disabled={page === pagination.pages}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={`${cardClass} rounded-lg shadow p-12 text-center`}>
            <MessageSquare className={`w-12 h-12 ${textSecondaryClass} mx-auto mb-4`} />
            <p className={textSecondaryClass}>No tickets found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Ticket Details">
        {selectedTicket && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm ${textSecondaryClass}`}>Ticket ID</p>
                <p className={`font-medium ${textClass}`}>#{selectedTicket.id?.slice(0, 8)}</p>
              </div>
              <div>
                <p className={`text-sm ${textSecondaryClass}`}>Status</p>
                <p className={`font-medium ${textClass}`}>{getStatusLabel(selectedTicket.status)}</p>
              </div>
            </div>
            <div>
              <p className={`text-sm ${textSecondaryClass}`}>Subject</p>
              <p className={`font-medium ${textClass}`}>{selectedTicket.subject}</p>
            </div>
            <div>
              <p className={`text-sm ${textSecondaryClass}`}>Description</p>
              <p className={`${textClass} ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded mt-1`}>
                {selectedTicket.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm ${textSecondaryClass}`}>Priority</p>
                <p className={`font-medium ${textClass}`}>{selectedTicket.priority?.charAt(0).toUpperCase() + selectedTicket.priority?.slice(1)}</p>
              </div>
              <div>
                <p className={`text-sm ${textSecondaryClass}`}>Created</p>
                <p className={`font-medium ${textClass}`}>{new Date(selectedTicket.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-4 border-t border-gray-300">
              <Button variant="secondary" onClick={() => setShowDetail(false)}>Close</Button>
              <Select
                value={selectedTicket.status}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                options={[
                  { value: 'open', label: 'Open' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'resolved', label: 'Resolved' },
                  { value: 'closed', label: 'Closed' }
                ]}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Reply Modal */}
      <Modal isOpen={showReply} onClose={() => setShowReply(false)} title="Reply to Ticket">
        <div className="space-y-4">
          <div>
            <p className={`text-sm ${textSecondaryClass} mb-2`}>Ticket: {selectedTicket?.subject}</p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>Message</label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              className={`w-full border rounded-lg p-3 h-32 ${borderClass} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowReply(false)}>Cancel</Button>
            <Button onClick={handleReply} disabled={!replyText || loading}>{loading ? 'Sending...' : 'Send Reply'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SupportTickets;
