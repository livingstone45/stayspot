import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, MessageCircle, Clock } from 'lucide-react';
import Alert from '../../components/common/UI/Alert';
import { useTheme } from '../../contexts/ThemeContext';

const SupportChat = () => {
  const { isDarkMode } = useTheme();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const mockConversations = [
    { id: 1, name: 'Sarah Johnson', status: 'online', avatar: 'SJ', lastMessage: 'Thanks for your help!', updatedAt: new Date(Date.now() - 5*60*1000), messages: [
      { id: 1, message: 'Hi, I need help with my account', isOwn: false, createdAt: new Date(Date.now() - 30*60*1000) },
      { id: 2, message: 'Sure, what seems to be the issue?', isOwn: true, createdAt: new Date(Date.now() - 28*60*1000) },
      { id: 3, message: 'I cannot reset my password', isOwn: false, createdAt: new Date(Date.now() - 25*60*1000) },
      { id: 4, message: 'Let me help you with that. Check your email for reset link', isOwn: true, createdAt: new Date(Date.now() - 20*60*1000) },
      { id: 5, message: 'Thanks for your help!', isOwn: false, createdAt: new Date(Date.now() - 5*60*1000) }
    ]},
    { id: 2, name: 'Mike Chen', status: 'online', avatar: 'MC', lastMessage: 'When will the feature be available?', updatedAt: new Date(Date.now() - 15*60*1000), messages: [
      { id: 1, message: 'Hi, do you have any updates on the new feature?', isOwn: false, createdAt: new Date(Date.now() - 45*60*1000) },
      { id: 2, message: 'Yes, we are working on it', isOwn: true, createdAt: new Date(Date.now() - 40*60*1000) },
      { id: 3, message: 'When will the feature be available?', isOwn: false, createdAt: new Date(Date.now() - 15*60*1000) }
    ]}
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages(conversation.messages);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    const newMessage = { id: messages.length + 1, message: messageText, isOwn: true, createdAt: new Date() };
    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  return (
    <div className={`h-screen flex ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {/* Sidebar */}
      <div className={`w-80 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-slate-200'} border-r backdrop-blur-xl flex flex-col`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-slate-800 bg-gradient-to-r from-blue-900/20 to-slate-900' : 'border-slate-200 bg-gradient-to-r from-blue-50 to-white'}`}>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4`}>Live Chat</h1>
          <div className="relative">
            <Search className={`absolute left-3 top-3 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search conversations..."
              className={`w-full pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-800 text-white placeholder-slate-500' : 'bg-slate-100 text-slate-900 placeholder-slate-400'}`}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto space-y-2 p-3">
          {mockConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => handleSelectConversation(conv)}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                selectedConversation?.id === conv.id
                  ? isDarkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-300'
                  : isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
              } border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm relative ${isDarkMode ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
                  {conv.avatar}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{conv.name}</p>
                  <p className={`text-sm truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{conv.lastMessage}</p>
                </div>
                <p className={`text-xs whitespace-nowrap ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className={`p-6 border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/40'} backdrop-blur-xl flex items-center justify-between`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm relative ${isDarkMode ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
                  {selectedConversation.avatar}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <p className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedConversation.name}</p>
                  <p className={`text-sm flex items-center gap-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> Active now
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                  <Phone className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                </button>
                <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                  <Video className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                </button>
                <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                  <MoreVertical className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-5 py-3 rounded-2xl shadow-sm ${
                    msg.isOwn
                      ? isDarkMode ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : isDarkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-900 border border-slate-200'
                  }`}>
                    <p className="break-words">{msg.message}</p>
                    <p className={`text-xs mt-2 ${msg.isOwn ? 'text-blue-100' : isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className={`p-6 border-t ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/40'} backdrop-blur-xl`}>
              <div className="flex items-center gap-3">
                <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-blue-400' : 'hover:bg-slate-100 text-blue-500'}`}>
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className={`flex-1 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-800 text-white placeholder-slate-500' : 'bg-white text-slate-900 placeholder-slate-400 border border-slate-200'}`}
                />
                <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}>
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className={`p-2 rounded-full transition-colors ${messageText.trim() ? (isDarkMode ? 'text-blue-400 hover:bg-slate-800' : 'text-blue-500 hover:bg-slate-100') : (isDarkMode ? 'text-slate-600' : 'text-slate-400')}`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-xl`}>
                <MessageCircle className={`w-12 h-12 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
              </div>
              <p className={`text-xl font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Select a conversation</p>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Choose a user to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportChat;
