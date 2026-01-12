import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Loader from '../UI/Loader';
import Toast from '../UI/Toast';

const Layout = ({ children }) => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // For public pages or authentication pages
  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
    );
  }

  // For authenticated users with role-specific layouts
  const getLayoutClass = () => {
    switch (user.role) {
      case 'system_admin':
        return 'bg-gray-50 dark:bg-gray-900';
      case 'company_admin':
        return 'bg-blue-50/30 dark:bg-gray-900';
      case 'property_manager':
        return 'bg-green-50/30 dark:bg-gray-900';
      case 'landlord':
        return 'bg-purple-50/30 dark:bg-gray-900';
      case 'tenant':
        return 'bg-indigo-50/30 dark:bg-gray-900';
      default:
        return 'bg-gray-50 dark:bg-gray-900';
    }
  };

  return (
    <div className={`min-h-screen ${getLayoutClass()}`}>
      {/* Toast container */}
      <Toast />
      
      {/* Main layout */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          
          {/* Main content area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
          
          {/* Footer - Only show on certain pages */}
          {!['/tenant', '/landlord'].some(path => window.location.pathname.startsWith(path)) && (
            <Footer />
          )}
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader size="lg" />
        </div>
      )}
    </div>
  );
};

export default Layout;