import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import Header from '../components/common/Layout/Header';
import Sidebar from '../components/common/Layout/Sidebar';
import { HomeIcon, BuildingOfficeIcon, UserGroupIcon, CurrencyDollarIcon, WrenchScrewdriverIcon, ChartBarIcon, DocumentTextIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const LandlordLayout = () => {
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/landlord',
      icon: HomeIcon,
      permission: 'view_landlord_dashboard',
    },
    {
      name: 'My Properties',
      href: '/landlord/properties',
      icon: BuildingOfficeIcon,
      permission: 'view_own_properties',
    },
    {
      name: 'Tenants',
      href: '/landlord/tenants',
      icon: UserGroupIcon,
      permission: 'view_own_tenants',
    },
    {
      name: 'Financials',
      href: '/landlord/financials',
      icon: CurrencyDollarIcon,
      permission: 'view_own_financials',
    },
    {
      name: 'Maintenance',
      href: '/landlord/maintenance',
      icon: WrenchScrewdriverIcon,
      permission: 'view_own_maintenance',
    },
    {
      name: 'Reports',
      href: '/landlord/reports',
      icon: ChartBarIcon,
      permission: 'view_own_reports',
    },
    {
      name: 'Communications',
      href: '/landlord/communications',
      icon: DocumentTextIcon,
      permission: 'view_own_communications',
    },
    {
      name: 'Settings',
      href: '/landlord/settings',
      icon: Cog6ToothIcon,
      permission: 'edit_landlord_profile',
    },
  ];

  const filteredNavigation = navigationItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        user={user}
        onLogout={handleLogout}
        portalType="landlord"
        showNotifications={true}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
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

export default LandlordLayout;
