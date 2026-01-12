import React, { useState } from 'react';
import { MessageSquare, Send, Search, Plus, Phone, Video, MoreVertical, Paperclip, Smile, X, Bell, Megaphone, Users, Clock, Check, CheckCheck } from 'lucide-react';

const Communications = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  const conversations = [
    {
      id: 1,
      name: 'John Smith',
      property: 'Apt 101',
      avatar: '👨',
      lastMessage: 'Thanks for fixing the faucet!',
      timestamp: '2h',
      unread: 0,
      online: true,
      messages: [
        { id: 1, sender: 'John', text: 'Hi, the faucet is still leaking', time: '10:30 AM', read: true },
        { id: 2, sender: 'You', text: 'I\'ll send a plumber today', time: '10:45 AM', read: true },
        { id: 3, sender: 'John', text: 'Thanks for fixing the faucet!', time: '2:15 PM', read: true }
      ]
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      property: 'Apt 202',
      avatar: '👩',
      lastMessage: 'When can I move in?',
      timestamp: '1h',
      unread: 1,
      online: true,
      messages: [
        { id: 1, sender: 'Sarah', text: 'When can I move in?', time: '11:00 AM', read: false }
      ]
    },
    {
      id: 3,
      name: 'Michael Brown',
      property: 'Apt 303',
      avatar: '👨‍💼',
      lastMessage: 'Lease renewal looks good',
      timestamp: '5h',
      unread: 0,
      online: false,
      messages: [
        { id: 1, sender: 'Michael', text: 'Lease renewal looks good', time: '9:30 AM', read: true }
      ]
    },
    {
      id: 4,
      name: 'Emily Davis',
      property: 'Apt 104',
      avatar: '👩‍🦰',
      lastMessage: 'Can you send the lease?',
      timestamp: '3h',
      unread: 0,
      online: true,
      messages: [
        { id: 1, sender: 'Emily', text: 'Can you send the lease?', time: '1:00 PM', read: true }
      ]
    }
  ];

  const announcements = [
    {
      id: 1,
      title: 'Scheduled Maintenance',
      content: 'Building-wide water system maintenance on Jan 20th from 8 AM to 12 PM',
      date: '2024-01-15',
      recipients: 'All Tenants',
      status: 'published'
    },
    {
      id: 2,
      title: 'Rent Payment Reminder',
      content: 'Reminder: Rent is due on the 1st of each month.',
      date: '2024-01-10',
      recipients: 'All Tenants',
      status: 'published'
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      setMessageText('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAnnouncements(!showAnnouncements)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <Megaphone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <Plus className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Conversations List */}
        <div className="w-full md:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  selectedConversation?.id === conv.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xl">
                      {conv.avatar}
                    </div>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{conv.name}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{conv.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{conv.property}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {conv.unread}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-1 flex-col bg-white dark:bg-gray-800">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-lg">
                      {selectedConversation.avatar}
                    </div>
                    {selectedConversation.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">{selectedConversation.name}</h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{selectedConversation.online ? 'Active now' : 'Offline'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <Video className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                {selectedConversation.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2.5 rounded-2xl ${
                      msg.sender === 'You'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                      <div className={`flex items-center gap-1 mt-1 text-xs ${msg.sender === 'You' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        <span>{msg.time}</span>
                        {msg.sender === 'You' && (
                          msg.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-end gap-3">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <Paperclip className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <Smile className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Announcements Modal */}
      {showAnnouncements && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Announcements</h2>
              <button onClick={() => setShowAnnouncements(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {announcements.map(ann => (
                <div key={ann.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{ann.title}</h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{ann.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{ann.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>{new Date(ann.date).toLocaleDateString()}</span>
                    <span>{ann.recipients}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communications;
