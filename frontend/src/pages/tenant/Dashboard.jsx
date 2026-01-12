import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useThemeMode } from '../../hooks/useThemeMode';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark, getClassNames } = useThemeMode();
  
  const [stats] = useState({
    rentDue: 0,
    rentPaid: 0,
    maintenanceRequests: 0,
    messages: 0,
    documents: 0,
    leaseEndDate: null,
  });
  const [tenantData] = useState({
    unitNumber: 'N/A',
    propertyName: 'N/A',
    leaseStartDate: null,
    leaseEndDate: null,
    monthlyRent: 0,
    status: 'active',
  });
  const [announcements] = useState([]);
  const [contacts] = useState([]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getClassNames.background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${getClassNames.text}`}>
            Welcome, {user?.firstName || 'Tenant'}!
          </h1>
          <p className={`mt-1 text-sm ${getClassNames.textSecondary}`}>
            Your unit: {tenantData?.unitNumber} • Property: {tenantData?.propertyName}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className={`rounded-lg shadow p-6 ${getClassNames.surface}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`${getClassNames.textSecondary} text-sm font-medium`}>Rent Due</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  ${stats.rentDue?.toLocaleString()}
                </p>
              </div>
              <div className="text-3xl">🏠</div>
            </div>
            <button
              onClick={() => navigate('/tenant/payments')}
              className="mt-4 w-full px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              Pay Rent →
            </button>
          </div>

          <div className={`rounded-lg shadow p-6 ${getClassNames.surface}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`${getClassNames.textSecondary} text-sm font-medium`}>Rent Paid</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ${stats.rentPaid?.toLocaleString()}
                </p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
            <p className="text-xs text-gray-500 mt-4">This period</p>
          </div>

          <div className={`rounded-lg shadow p-6 ${getClassNames.surface}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`${getClassNames.textSecondary} text-sm font-medium`}>Lease Ends On</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats.leaseEndDate
                    ? new Date(stats.leaseEndDate).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div className="text-3xl">📅</div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Lease information</p>
          </div>

          <div className={`rounded-lg shadow p-6 ${getClassNames.surface}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`${getClassNames.textSecondary} text-sm font-medium`}>Maintenance Requests</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {stats.maintenanceRequests}
                </p>
              </div>
              <div className="text-3xl">🔧</div>
            </div>
            <button
              onClick={() => navigate('/tenant/maintenance')}
              className="mt-4 w-full px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              View Requests →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">New Messages</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {stats.messages}
                </p>
              </div>
              <div className="text-3xl">💬</div>
            </div>
            <button
              onClick={() => navigate('/tenant/messages')}
              className="mt-4 w-full px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              View Messages →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Documents</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  {stats.documents}
                </p>
              </div>
              <div className="text-3xl">📄</div>
            </div>
            <button
              onClick={() => navigate('/tenant/documents')}
              className="mt-4 w-full px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              View Documents →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">My Unit</p>
                <p className="text-3xl font-bold text-cyan-600 mt-2">
                  Unit Info
                </p>
              </div>
              <div className="text-3xl">🏠</div>
            </div>
            <button
              onClick={() => navigate('/tenant/my-unit')}
              className="mt-4 w-full px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              View Unit →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Lease</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  Active
                </p>
              </div>
              <div className="text-3xl">📋</div>
            </div>
            <button
              onClick={() => navigate('/tenant/lease')}
              className="mt-4 w-full px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              View Lease →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Settings</p>
                <p className="text-3xl font-bold text-gray-600 mt-2">
                  Config
                </p>
              </div>
              <div className="text-3xl">⚙️</div>
            </div>
            <button
              onClick={() => navigate('/tenant/settings')}
              className="mt-4 w-full px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              Go to Settings →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/tenant/payments')}
                className="w-full px-4 py-3 text-left bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium"
              >
                💳 Pay Rent Online
              </button>
              <button
                onClick={() => navigate('/tenant/maintenance')}
                className="w-full px-4 py-3 text-left bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-medium"
              >
                🔧 Request Maintenance
              </button>
              <button
                onClick={() => navigate('/tenant/messages')}
                className="w-full px-4 py-3 text-left bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition font-medium"
              >
                💬 Send Message
              </button>
              <button
                onClick={() => navigate('/tenant/documents')}
                className="w-full px-4 py-3 text-left bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition font-medium"
              >
                📄 View Documents
              </button>
              <button
                onClick={() => navigate('/tenant/my-unit')}
                className="w-full px-4 py-3 text-left bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100 transition font-medium"
              >
                🏠 View My Unit
              </button>
              <button
                onClick={() => navigate('/tenant/lease')}
                className="w-full px-4 py-3 text-left bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition font-medium"
              >
                📋 View Lease
              </button>
              <button
                onClick={() => navigate('/tenant/settings')}
                className="w-full px-4 py-3 text-left bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
              >
                ⚙️ Settings
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Lease Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Unit Number:</span>
                <span className="font-medium">{tenantData?.unitNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lease Start:</span>
                <span className="font-medium">
                  {tenantData?.leaseStartDate
                    ? new Date(tenantData.leaseStartDate).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lease End:</span>
                <span className="font-medium">
                  {tenantData?.leaseEndDate
                    ? new Date(tenantData.leaseEndDate).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Rent:</span>
                <span className="font-medium">
                  ${tenantData?.monthlyRent?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lease Status:</span>
                <span
                  className={`font-medium px-2 py-1 rounded text-xs ${
                    tenantData?.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {tenantData?.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2">Important Notice</h3>
          <p className="text-blue-800 text-sm mb-4">
            Please keep all your rent payments up to date. If you have any
            questions or concerns, don't hesitate to contact your property
            manager.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Contact Property Manager
          </button>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            Need assistance?{' '}
            <a
              href="mailto:support@stayspot.com"
              className="text-blue-600 hover:underline"
            >
              Contact us
            </a>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow mt-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              📢 Announcements
            </h2>
          </div>
          <div className="divide-y">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div key={announcement.id} className="p-6 hover:bg-gray-50 transition">
                  <p className="text-sm text-gray-500">Posted on {new Date(announcement.date).toLocaleDateString()}</p>
                  <h3 className="font-bold text-gray-900 mt-2">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-700 text-sm mt-2">
                    {announcement.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No announcements available
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="font-bold text-green-900 mb-3">📚 Helpful Resources</h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-center gap-2">
                <span>✓</span>
                <button className="hover:underline">Lease Agreement</button>
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                <button className="hover:underline">Payment Terms</button>
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                <button className="hover:underline">Maintenance Policy</button>
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                <button className="hover:underline">FAQ</button>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <h3 className="font-bold text-yellow-900 mb-3">⚠️ Important Reminders</h3>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li>• Rent is due on the 1st of each month</li>
              <li>• Late fees apply after the 5th</li>
              <li>• Report maintenance within 24 hours</li>
              <li>• Keep lease terms in your records</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mt-8 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            📞 Quick Contacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <div key={contact.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 font-semibold uppercase">{contact.type}</p>
                  <p className="font-bold text-gray-900 mt-2">{contact.email}</p>
                  <p className="text-sm text-gray-600">{contact.phone}</p>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 py-4">
                No contacts available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
