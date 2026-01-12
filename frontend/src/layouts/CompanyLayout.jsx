import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanySidebar from '../components/common/CompanySidebar';
import { useThemeMode } from '../hooks/useThemeMode';
import { LogOut, User, Lock } from 'lucide-react';

const CompanyLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isDarkMode } = useThemeMode();
  const navigate = useNavigate();
  const user = { name: 'Admin User', email: 'admin@stayspot.com' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleChangePassword = () => {
    navigate('/company/settings');
    setShowUserMenu(false);
  };

  const handleAccount = () => {
    navigate('/company/settings');
    setShowUserMenu(false);
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <CompanySidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <CompanySidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`border-b ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} px-6 py-4 flex items-center justify-between lg:hidden`}>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>StaySpot Admin</h1>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          >
            <svg className={`w-6 h-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Desktop Header */}
        <div className={`hidden lg:flex border-b ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} px-6 py-4 items-center justify-between`}>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>StaySpot Admin</h1>
          <div className="flex items-center gap-4">
            <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
              <svg className={`w-6 h-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${isDarkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-600 hover:bg-orange-700'}`}
              >
                {user.name.charAt(0)}
              </button>
              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
                  <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{user.email}</p>
                  </div>
                  <button 
                    onClick={handleAccount}
                    className={`w-full text-left px-4 py-2 flex items-center gap-2 ${isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-900'}`}
                  >
                    <User className="w-4 h-4" /> Account
                  </button>
                  <button 
                    onClick={handleChangePassword}
                    className={`w-full text-left px-4 py-2 flex items-center gap-2 ${isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-900'}`}
                  >
                    <Lock className="w-4 h-4" /> Change Password
                  </button>
                  <button 
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-2 flex items-center gap-2 border-t ${isDarkMode ? 'border-slate-700 hover:bg-slate-700 text-red-400' : 'border-slate-200 hover:bg-slate-100 text-red-600'}`}
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className={`flex-1 overflow-auto ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CompanyLayout;
