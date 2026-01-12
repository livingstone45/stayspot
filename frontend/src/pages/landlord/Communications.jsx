import React, { useState } from 'react';
import { Send, Search, Plus, Phone, Video, MoreVertical, Paperclip, Smile } from 'lucide-react';

const LandlordCommunications = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    { id: 1, name: 'John Doe', role: 'Tenant', unit: '2A', lastMessage: 'Thanks for fixing the AC!', time: '2 min', unread: 2, avatar: 'JD', color: 'from-rose-400 to-pink-600' },
    { id: 2, name: 'Jane Smith', role: 'Tenant', unit: '1B', lastMessage: 'When can I move in?', time: '1 hour', unread: 0, avatar: 'JS', color: 'from-amber-400 to-orange-600' },
    { id: 3, name: 'Bob Wilson', role: 'Maintenance', unit: 'Staff', lastMessage: 'Work order completed', time: '3 hours', unread: 0, avatar: 'BW', color: 'from-emerald-400 to-teal-600' },
    { id: 4, name: 'Alice Brown', role: 'Tenant', unit: '3C', lastMessage: 'Rent payment received', time: 'Yesterday', unread: 0, avatar: 'AB', color: 'from-violet-400 to-purple-600' },
    { id: 5, name: 'Mike Johnson', role: 'Tenant', unit: '4D', lastMessage: 'Can I get a lease extension?', time: '2 days', unread: 1, avatar: 'MJ', color: 'from-cyan-400 to-blue-600' },
  ];

  const messages = [
    { id: 1, sender: 'John Doe', text: 'Hi, is the apartment still available?', time: '10:30 AM', isOwn: false },
    { id: 2, sender: 'You', text: 'Yes, it is! Would you like to schedule a viewing?', time: '10:35 AM', isOwn: true },
    { id: 3, sender: 'John Doe', text: 'That would be great! How about tomorrow at 2 PM?', time: '10:40 AM', isOwn: false },
    { id: 4, sender: 'You', text: 'Perfect! I\'ll see you then. The address is 123 Main St.', time: '10:42 AM', isOwn: true },
    { id: 5, sender: 'John Doe', text: 'Thanks for fixing the AC!', time: '2:15 PM', isOwn: false },
  ];

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentChat = conversations.find(c => c.id === selectedChat);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50 p-6">
      <div className="w-full mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent mb-2">Communications 💬</h1>
          <p className="text-gray-600">Manage conversations with tenants and staff</p>
        </div>

        {/* Main Chat Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border-2 border-rose-100 flex flex-col overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b-2 border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-rose-400" size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto space-y-2 p-3">
              {filteredConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`w-full p-3 rounded-xl transition-all text-left ${
                    selectedChat === conv.id
                      ? 'bg-gradient-to-r from-rose-100 to-pink-100 border-2 border-rose-400'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${conv.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      {conv.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900">{conv.name}</h3>
                        <span className="text-xs text-gray-500">{conv.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{conv.role} • {conv.unit}</p>
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <div className="w-6 h-6 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {conv.unread}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* New Message Button */}
            <div className="p-4 border-t-2 border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg hover:from-rose-700 hover:to-pink-700 transition font-semibold flex items-center justify-center gap-2 shadow-md">
                <Plus size={18} /> New Message
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border-2 border-amber-100 flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b-2 border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentChat?.color} flex items-center justify-center text-white font-bold shadow-md`}>
                  {currentChat?.avatar}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{currentChat?.name}</h2>
                  <p className="text-xs text-gray-600">{currentChat?.role} • {currentChat?.unit}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-amber-100 rounded-lg transition text-amber-600">
                  <Phone size={18} />
                </button>
                <button className="p-2 hover:bg-amber-100 rounded-lg transition text-amber-600">
                  <Video size={18} />
                </button>
                <button className="p-2 hover:bg-amber-100 rounded-lg transition text-amber-600">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-amber-50">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                    msg.isOwn
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-none'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 rounded-bl-none'
                  } shadow-md`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.isOwn ? 'text-amber-100' : 'text-gray-600'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t-2 border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex gap-3">
                <button className="p-3 hover:bg-amber-100 rounded-lg transition text-amber-600">
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button className="p-3 hover:bg-amber-100 rounded-lg transition text-amber-600">
                  <Smile size={18} />
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-semibold flex items-center gap-2 shadow-md">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordCommunications;
