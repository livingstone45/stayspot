import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/common/Layout/Header';
import Sidebar from '../components/common/Layout/Sidebar';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user}
        onLogout={handleLogout}
        portalType="admin"
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 pb-8">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {/* Breadcrumb */}
              <div className="mb-6">
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-4">
                    <li>
                      <div className="flex items-center">
                        <Link to="/admin" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                          Admin
                        </Link>
                      </div>
                    </li>
                    {location.pathname.split('/').slice(2).map((segment, index, array) => (
                      <li key={segment}>
                        <div className="flex items-center">
                          <svg className="h-5 w-5 flex-shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          <Link to={`/admin/${array.slice(0, index + 1).join('/')}`} className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 capitalize">
                            {segment.replace('-', ' ')}
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>

              {/* Portal Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
                <p className="mt-2 text-sm text-gray-600">Welcome back, {user?.name}. Manage system settings and users.</p>
              </div>

              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
