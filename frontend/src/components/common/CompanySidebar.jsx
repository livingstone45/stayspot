import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, CreditCard, Home, CheckCircle, Users, Headphones, 
  Truck, MessageSquare, Settings, ChevronDown, Menu, X, Shield,
  Building2, DollarSign, AlertCircle, FileCheck, UserCheck, Share2, Send
} from 'lucide-react';

const CompanySidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/company',
      badge: null
    },
    {
      label: 'Payment Management',
      icon: CreditCard,
      submenu: [
        { label: 'All Payments', path: '/company/payments' },
        { label: 'Payment History', path: '/company/payments/history' },
        { label: 'Invoices', path: '/company/payments/invoices' },
        { label: 'Refunds', path: '/company/payments/refunds' },
        { label: 'Payment Settings', path: '/company/payments/settings' },
        { label: 'Pay Others', path: '/company/pay-others' }
      ]
    },
    {
      label: 'Property Management',
      icon: Home,
      submenu: [
        { label: 'All Properties', path: '/company/properties' },
        { label: 'Property Verification', path: '/company/properties/verification' },
        { label: 'BNB & Guest Houses', path: '/company/properties/bnb' },
        { label: 'Pending Approvals', path: '/company/properties/pending', badge: '12' },
        { label: 'Property Documents', path: '/company/properties/documents' }
      ]
    },
    {
      label: 'User Verification',
      icon: UserCheck,
      submenu: [
        { label: 'Verify Tenants', path: '/company/verification/tenants' },
        { label: 'Verify Landlords', path: '/company/verification/landlords' },
        { label: 'Verify Managers', path: '/company/verification/managers' },
        { label: 'Pending Verification', path: '/company/verification/pending', badge: '8' },
        { label: 'Verification Reports', path: '/company/verification/reports' }
      ]
    },
    {
      label: 'Client Support',
      icon: Headphones,
      submenu: [
        { label: 'Support Tickets', path: '/company/support/tickets', badge: '5' },
        { label: 'Live Chat', path: '/company/support/chat' },
        { label: 'Knowledge Base', path: '/company/support/kb' },
        { label: 'Issue Resolution', path: '/company/support/issues' },
        { label: 'Support Reports', path: '/company/support/reports' }
      ]
    },
    {
      label: 'Transportation',
      icon: Truck,
      submenu: [
        { label: 'Driver Management', path: '/company/transportation/drivers' },
        { label: 'Bookings', path: '/company/transportation/bookings' },
        { label: 'Routes & Tracking', path: '/company/transportation/tracking' },
        { label: 'Vehicle Fleet', path: '/company/transportation/fleet' },
        { label: 'Earnings Report', path: '/company/transportation/earnings' }
      ]
    },
    {
      label: 'System Communication',
      icon: MessageSquare,
      submenu: [
        { label: 'Messages', path: '/company/communication/messages' },
        { label: 'Announcements', path: '/company/communication/announcements' },
        { label: 'Notifications', path: '/company/communication/notifications' },
        { label: 'Email Templates', path: '/company/communication/templates' },
        { label: 'Communication Logs', path: '/company/communication/logs' }
      ]
    },
    {
      label: 'Security & Compliance',
      icon: Shield,
      submenu: [
        { label: 'User Permissions', path: '/company/security/permissions' },
        { label: 'Audit Logs', path: '/company/security/audit' },
        { label: 'Data Protection', path: '/company/security/data' },
        { label: 'Compliance Reports', path: '/company/security/compliance' }
      ]
    },
    {
      label: 'Sharing & Collaboration',
      icon: Share2,
      path: '/company/sharing'
    },
    {
      label: 'Settings',
      icon: Settings,
      path: '/company/settings'
    }
  ];

  const isActive = (path) => location.pathname === path;
  const isSubmenuActive = (submenu) => submenu?.some(item => isActive(item.path));

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-orange-600 text-white rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-y-auto transition-transform duration-300 z-40 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">StaySpot</h1>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const hasSubmenu = item.submenu;
            const isItemActive = isActive(item.path) || isSubmenuActive(item.submenu);

            return (
              <div key={idx}>
                {hasSubmenu ? (
                  <button
                    onClick={() => setExpandedMenu(expandedMenu === idx ? null : idx)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                      isSubmenuActive(item.submenu)
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition ${expandedMenu === idx ? 'rotate-180' : ''}`}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition ${
                      isActive(item.path)
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-xs bg-red-600 px-2 py-1 rounded-full">{item.badge}</span>
                    )}
                  </Link>
                )}

                {/* Submenu */}
                {hasSubmenu && expandedMenu === idx && (
                  <div className="mt-2 ml-4 space-y-1 border-l border-slate-700 pl-4">
                    {item.submenu.map((subitem, subidx) => (
                      <Link
                        key={subidx}
                        to={subitem.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm transition ${
                          isActive(subitem.path)
                            ? 'bg-orange-600 text-white'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        <span>{subitem.label}</span>
                        {subitem.badge && (
                          <span className="text-xs bg-red-600 px-2 py-0.5 rounded-full">{subitem.badge}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-900">
          <div className="text-xs text-slate-400 text-center">
            <p>StaySpot Admin v1.0</p>
            <p className="mt-1">© 2024 All Rights Reserved</p>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default CompanySidebar;
