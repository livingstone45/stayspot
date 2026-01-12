import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, Pin, Smile } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const MessagesPage = () => {
  const { isDark } = useThemeMode();
  
  const containerClasses = `${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 min-h-screen`;
  const cardClasses = `${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg`;
  const titleClasses = `${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-bold mb-2`;
  const subtitleClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-8`;
  const textClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'}`;

  const expressions = ['👍', '❤️', '😂', '😮', '😢', '😡', '🙏', '🎉', '👏', '🔥', '✨', '👀'];

  const [selectedConversation, setSelectedConversation] = useState(0);
  const [messageText, setMessageText] = useState('');
  const [showExpressions, setShowExpressions] = useState(false);
  const [allMessages, setAllMessages] = useState([
    { id: 1, sender: 'Property Manager', avatar: '👨‍💼', message: 'Hi there! We have a maintenance request for your unit.', time: '9:30 AM', isOwn: false },
    { id: 2, sender: 'You', avatar: '👤', message: 'Yes, I noticed the sink is leaking', time: '9:45 AM', isOwn: true },
    { id: 3, sender: 'Property Manager', avatar: '👨‍💼', message: 'The maintenance team will visit tomorrow at 10am', time: '10:00 AM', isOwn: false },
    { id: 4, sender: 'You', avatar: '👤', message: 'Perfect! Thank you for arranging it quickly', time: '10:15 AM', isOwn: true }
  ]);
  const [conversations] = useState([
    {
      id: 1,
      name: 'Property Manager',
      avatar: '👨‍💼',
      lastMessage: 'The maintenance team will visit tomorrow at 10am',
      timestamp: '2 hours ago',
      unread: 2,
      pinned: true
    },
    {
      id: 2,
      name: 'Building Support',
      avatar: '🏢',
      lastMessage: 'Your package has been received at the front desk',
      timestamp: '1 day ago',
      unread: 0,
      pinned: false
    },
    {
      id: 3,
      name: 'Billing Department',
      avatar: '💳',
      lastMessage: 'Payment received - Thank you!',
      timestamp: '3 days ago',
      unread: 0,
      pinned: false
    },
    {
      id: 4,
      name: 'Tenant Association',
      avatar: '👥',
      lastMessage: 'Community meeting scheduled for Saturday',
      timestamp: '5 days ago',
      unread: 0,
      pinned: false
    }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: allMessages.length + 1,
        sender: 'You',
        avatar: '👤',
        message: messageText,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setAllMessages([...allMessages, newMessage]);
      setMessageText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={containerClasses}>
      <div className="mb-8">
        <h1 className={titleClasses}>💬 Messages</h1>
        <p className={subtitleClasses}>Communicate with property management and support</p>
      </div>

      <div className={`${cardClasses} flex flex-col lg:flex-row gap-0 overflow-hidden`} style={{ height: '600px' }}>
        <div className={`lg:w-1/3 border-r ${isDark ? 'border-gray-700' : 'border-gray-200'} flex flex-col`}>
          <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`flex items-center px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
              <Search size={18} className={textClasses} />
              <input
                type="text"
                placeholder="Search conversations..."
                className={`flex-1 ml-2 bg-transparent outline-none ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv, idx) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(idx)}
                className={`p-4 border-b cursor-pointer transition ${
                  selectedConversation === idx
                    ? isDark ? 'bg-blue-900 bg-opacity-30 border-blue-600' : 'bg-blue-50 border-blue-200'
                    : isDark ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{conv.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold truncate`}>
                        {conv.name}
                      </h3>
                      {conv.pinned && <Pin size={14} className={textClasses} />}
                    </div>
                    <p className={`${textClasses} text-sm truncate mb-1`}>{conv.lastMessage}</p>
                    <p className={`${textClasses} text-xs`}>{conv.timestamp}</p>
                  </div>
                  {conv.unread > 0 && (
                    <div className={`${isDark ? 'bg-blue-600' : 'bg-blue-600'} text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0`}>
                      {conv.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{conversations[selectedConversation]?.avatar}</span>
              <div>
                <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold`}>
                  {conversations[selectedConversation]?.name}
                </h2>
                <p className={`${textClasses} text-xs`}>Active now</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {allMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                {!msg.isOwn && <span className="text-2xl">{msg.avatar}</span>}
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.isOwn
                      ? isDark ? 'bg-blue-600' : 'bg-blue-600 text-white'
                      : isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                >
                  <p className={`${msg.isOwn ? (isDark ? 'text-white' : 'text-white') : isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {msg.message}
                  </p>
                  <p className={`text-xs mt-1 ${msg.isOwn ? isDark ? 'text-blue-200' : 'text-blue-100' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {msg.time}
                  </p>
                </div>
                {msg.isOwn && <span className="text-2xl">👤</span>}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
              <div className="relative">
                <button
                  onClick={() => setShowExpressions(!showExpressions)}
                  className={`p-2 rounded transition ${isDark ? 'hover:bg-gray-600 text-yellow-400' : 'hover:bg-gray-100 text-yellow-500'}`}
                >
                  <Smile size={18} />
                </button>

                {showExpressions && (
                  <div className={`absolute bottom-12 left-0 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border rounded-lg p-3 grid grid-cols-4 gap-2 w-56 shadow-lg`}>
                    {expressions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setMessageText(messageText + emoji);
                          setShowExpressions(false);
                        }}
                        className={`text-2xl p-2 rounded transition ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={`flex-1 bg-transparent outline-none ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className={`p-2 rounded transition ${isDark ? 'hover:bg-gray-600 text-blue-400 disabled:text-gray-600' : 'hover:bg-gray-100 text-blue-600 disabled:text-gray-400'}`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
