import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const Communication = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(
    searchParams.get('tenantId') || null
  );
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageType, setMessageType] = useState('message');
  const [subject, setSubject] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchTenants();
    if (selectedTenant) {
      fetchMessages(selectedTenant);
    }
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:5000/api/tenants',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTenants(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tenants');
      console.error('Error fetching tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (tenantId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/communications/${tenantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(
        (msg) =>
          msg.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((msg) => msg.type === filterType);
    }

    setFilteredMessages(filtered);
    setCurrentPage(1);
  }, [messages, searchTerm, filterType]);

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMessages = filteredMessages.slice(startIndex, endIndex);

  const handleSelectTenant = (tenantId) => {
    setSelectedTenant(tenantId);
    setMessages([]);
    setMessageText('');
    setSubject('');
    fetchMessages(tenantId);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!selectedTenant) {
      setError('Please select a tenant');
      return;
    }

    if (!messageText.trim()) {
      setError('Message cannot be empty');
      return;
    }

    try {
      setSendingMessage(true);
      await axios.post(
        `http://localhost:5000/api/communications`,
        {
          tenantId: selectedTenant,
          message: messageText,
          subject: subject || 'No Subject',
          type: messageType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessageText('');
      setSubject('');
      setMessageType('message');
      await fetchMessages(selectedTenant);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/communications/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete message');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Communication</h1>
          <p className="mt-1 text-sm text-gray-600">
            Send messages to tenants and view communication history
          </p>
        </div>

        {error && <ErrorAlert message={error} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tenants List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">Tenants</h2>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {tenants.map((tenant) => (
                  <button
                    key={tenant.id}
                    onClick={() => handleSelectTenant(tenant.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition ${
                      selectedTenant === tenant.id
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : ''
                    }`}
                  >
                    <h3 className="font-medium text-gray-900">
                      {tenant.firstName} {tenant.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{tenant.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Unit: {tenant.unitNumber || 'N/A'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="lg:col-span-2">
            {selectedTenant ? (
              <div className="space-y-6">
                {/* Message Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="message">Message</option>
                    <option value="announcement">Announcement</option>
                    <option value="alert">Alert</option>
                    <option value="notice">Notice</option>
                  </select>
                  <div className="text-right text-sm text-gray-600 self-center">
                    {filteredMessages.length} messages
                  </div>
                </div>

                {/* Messages List */}
                <div className="bg-white rounded-lg shadow space-y-4">
                  <div className="p-4 border-b max-h-96 overflow-y-auto">
                    {paginatedMessages.length > 0 ? (
                      <div className="space-y-4">
                        {paginatedMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className="p-4 border rounded-lg hover:bg-gray-50 transition"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {msg.subject}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  {new Date(msg.createdAt).toLocaleString()}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    msg.type === 'message'
                                      ? 'bg-blue-100 text-blue-800'
                                      : msg.type === 'announcement'
                                      ? 'bg-green-100 text-green-800'
                                      : msg.type === 'alert'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {msg.type}
                                </span>
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-700">{msg.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">
                        No messages yet
                      </p>
                    )}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="p-4 border-t flex justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                      >
                        Prev
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>

                {/* Send Message Form */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Send Message
                  </h3>
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message Type
                      </label>
                      <select
                        value={messageType}
                        onChange={(e) => setMessageType(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="message">Message</option>
                        <option value="announcement">Announcement</option>
                        <option value="alert">Alert</option>
                        <option value="notice">Notice</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Message subject"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Write your message here..."
                        rows="6"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sendingMessage}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {sendingMessage ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600">Select a tenant to view messages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communication;
