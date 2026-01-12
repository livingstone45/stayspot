import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Smile, Plus, X, Loader, MessageCircle } from 'lucide-react';
import Alert from '../../../components/common/UI/Alert';
import { useTheme } from '../../../contexts/ThemeContext';

const mockConversations = [
  { id: 1, sender_name: 'James Kipchoge', sender_email: 'james@example.com', subject: 'Trip Update', body: 'Hi, I wanted to discuss the upcoming trip...', created_at: new Date(Date.now() - 3600000).toISOString(), is_read: false, recipient_id: 1 },
  { id: 2, sender_name: 'Mary Wanjiru', sender_email: 'mary@example.com', subject: 'Schedule Change', body: 'Can we reschedule our meeting for tomorrow?', created_at: new Date(Date.now() - 7200000).toISOString(), is_read: true, recipient_id: 2 }
];

const mockMessages = [
  { id: 1, sender_name: 'James Kipchoge', body: 'Hi, I wanted to discuss the upcoming trip...', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, sender_name: 'James Kipchoge', body: 'Are you available next week?', created_at: new Date(Date.now() - 1800000).toISOString() }
];

const Messages = () => {
  const { isDarkMode } = useTheme();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [messageText, setMessageText] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatRecipient, setNewChatRecipient] = useState('');
  const [newChatSubject, setNewChatSubject] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, [search]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ limit: 50, ...(search && { search }) });
      
      const response = await fetch(`/api/communication/messages?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch conversations');
      const data = await response.json();
      setConversations(data.data || []);
    } catch (err) {
      setConversations(mockConversations);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/communication/messages/${messageId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch message');
      const data = await response.json();
      setMessages(Array.isArray(data.data) ? data.data : [data.data]);
    } catch (err) {
      setMessages(mockMessages);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now(),
      sender_name: 'You',
      body: messageText,
      created_at: new Date().toISOString()
    };

    setMessages([...messages, newMessage]);
    setMessageText('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/communication/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient_id: selectedConversation.recipient_id,
          subject: selectedConversation.subject,
          body: messageText
        })
      });

      if (!response.ok) throw new Error('Failed to send message');
      fetchConversations();
    } catch (err) {
      console.error('Send error:', err);
    }
  };

  const handleNewChat = async () => {
    if (!newChatRecipient || !newChatSubject) {
      setError('Please fill all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/communication/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient_id: newChatRecipient,
          subject: newChatSubject,
          body: ''
        })
      });

      if (!response.ok) throw new Error('Failed to create conversation');
      setNewChatRecipient('');
      setNewChatSubject('');
      setShowNewChat(false);
      fetchConversations();
    } catch (err) {
      setError(err.message);
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  const formatTime = (date) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diffMs = now - msgDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return msgDate.toLocaleDateString();
  };

  return (
    <div className={`h-screen flex ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Sidebar */}
      <div className={`w-96 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
        {/* Header */}
        <div className={`p-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Messages</h1>
            <button
              onClick={() => setShowNewChat(true)}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-orange-400' : 'bg-gray-100 hover:bg-gray-200 text-orange-600'}`}
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="relative">
            <Search className={`absolute left-3 top-3 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="w-6 h-6 animate-spin text-orange-600" />
            </div>
          ) : conversations.length > 0 ? (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={`p-4 cursor-pointer transition-all border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-100'} ${
                  selectedConversation?.id === conv.id
                    ? isDarkMode ? 'bg-slate-700' : 'bg-orange-50'
                    : isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 bg-gradient-to-r from-orange-600 to-orange-700`}>
                    {getInitials(conv.sender_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{conv.sender_name}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{formatTime(conv.created_at)}</p>
                    </div>
                    <p className={`text-sm truncate ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{conv.subject}</p>
                    <p className={`text-xs truncate ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>{conv.body?.slice(0, 40)}</p>
                  </div>
                  {!conv.is_read && (
                    <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <MessageCircle className={`w-12 h-12 mb-3 ${isDarkMode ? 'text-slate-600' : 'text-gray-300'}`} />
              <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>No conversations</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className={`p-4 border-b ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-white'} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-r from-orange-600 to-orange-700`}>
                  {getInitials(selectedConversation.sender_name)}
                </div>
                <div>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedConversation.sender_name}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{selectedConversation.sender_email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <Phone className="w-5 h-5" />
                </button>
                <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <Video className="w-5 h-5" />
                </button>
                <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const isYourMessage = msg.sender_name === 'You';
                  return (
                    <div key={msg.id} className={`flex items-start gap-3 ${isYourMessage ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${isYourMessage ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-orange-600 to-orange-700'}`}>
                        {getInitials(msg.sender_name)}
                      </div>
                      <div className={isYourMessage ? 'text-right' : ''}>
                        <p className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{msg.sender_name}</p>
                        <div className={`max-w-xs px-4 py-2 rounded-2xl ${isYourMessage ? (isDarkMode ? 'bg-blue-600' : 'bg-blue-500') : (isDarkMode ? 'bg-slate-800' : 'bg-gray-100')}`}>
                          <p className={isYourMessage ? 'text-white' : (isDarkMode ? 'text-slate-200' : 'text-gray-900')}>{msg.body}</p>
                        </div>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>No messages yet</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className={`p-4 border-t ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-3">
                <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-orange-500' : 'hover:bg-gray-100 text-orange-600'}`}>
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className={`flex-1 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
                />
                <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className={`p-2 rounded-full transition-colors ${messageText.trim() ? (isDarkMode ? 'text-orange-500 hover:bg-slate-700' : 'text-orange-600 hover:bg-gray-100') : (isDarkMode ? 'text-slate-600' : 'text-gray-400')}`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-r from-orange-600 to-orange-700`}>
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <p className={`text-lg font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl shadow-2xl max-w-md w-full border border-slate-800">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Start New Message</h2>
              <button
                onClick={() => setShowNewChat(false)}
                className="text-orange-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-orange-400 mb-2">Recipient ID</label>
                <input
                  type="text"
                  value={newChatRecipient}
                  onChange={(e) => setNewChatRecipient(e.target.value)}
                  placeholder="Enter recipient ID"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-orange-400 mb-2">Subject</label>
                <input
                  type="text"
                  value={newChatSubject}
                  onChange={(e) => setNewChatSubject(e.target.value)}
                  placeholder="Message subject"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={handleNewChat}
                disabled={!newChatRecipient.trim() || !newChatSubject.trim()}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Create
              </button>
              <button
                onClick={() => setShowNewChat(false)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-all border border-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
