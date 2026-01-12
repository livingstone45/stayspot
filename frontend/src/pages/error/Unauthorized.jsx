import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleRequestAccess = () => {
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 3000);
  };

  const permissionLevels = [
    {
      role: 'Admin',
      access: 'Full Access to All Features',
      color: 'bg-red-100 text-red-900',
      permissions: ['Manage Users', 'System Settings', 'View All Properties', 'Financial Reports']
    },
    {
      role: 'Manager',
      access: 'Limited Management Access',
      color: 'bg-orange-100 text-orange-900',
      permissions: ['Manage Properties', 'View Tenants', 'Process Payments', 'Generate Reports']
    },
    {
      role: 'Landlord',
      access: 'Own Properties Only',
      color: 'bg-yellow-100 text-yellow-900',
      permissions: ['View Own Properties', 'Manage Tenants', 'View Financials', 'Submit Requests']
    },
    {
      role: 'Tenant',
      access: 'Own Unit Only',
      color: 'bg-green-100 text-green-900',
      permissions: ['View Unit Info', 'Submit Requests', 'View Lease', 'Message Management']
    }
  ];

  const commonReasons = [
    {
      icon: '📋',
      title: 'Account Not Verified',
      description: 'Your email or phone may not be verified yet. Check your email for verification link.'
    },
    {
      icon: '💳',
      title: 'Subscription Expired',
      description: 'Your subscription plan has expired. Renew your plan to regain access.'
    },
    {
      icon: '🏢',
      title: 'Organization Access',
      description: 'You haven\'t been invited to this organization. Contact the administrator.'
    },
    {
      icon: '⏰',
      title: 'Time-Limited Access',
      description: 'Your temporary access has expired. Request an extension from your administrator.'
    },
    {
      icon: '🔄',
      title: 'Account Status',
      description: 'Your account may be suspended. Contact support for details.'
    }
  ];

  const faqs = [
    {
      q: 'How do I request access to a resource?',
      a: 'Click the "Request Access" button below or contact your organization administrator. They can grant you the required permissions.'
    },
    {
      q: 'Can I upgrade my subscription?',
      a: 'Yes! Visit your Account Settings to view available plans or contact our sales team for custom solutions.'
    },
    {
      q: 'Why did my access get revoked?',
      a: 'Access changes can occur due to subscription expiration, account deactivation, role changes, or security reasons. Contact support for specific details.'
    },
    {
      q: 'What\'s the difference between roles?',
      a: 'Different roles have different permission levels. Admins manage systems, Managers handle operations, Landlords control properties, and Tenants access their units.'
    },
    {
      q: 'How long does access requests take?',
      a: 'Most access requests are processed within 24 hours. You\'ll receive an email notification once approved.'
    },
    {
      q: 'Can I have multiple roles?',
      a: 'Yes! You can be a Tenant and Landlord simultaneously. Each role has its own access level and dashboard.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-9xl font-bold text-red-300 opacity-50 mb-4">403</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-xl text-gray-600">
            You don't have permission to access this resource.
          </p>
          <div className="text-8xl mt-6 mb-6">🔐</div>
        </div>

        {/* Current User Info */}
        {user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-center">
            <p className="text-sm text-blue-900">
              Logged in as: <strong>{user.email}</strong> ({user.role || 'User'})
            </p>
          </div>
        )}

        {/* Why This Happened */}
        <div className="bg-white border border-red-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-red-900 mb-4">⚠️ Why You See This</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {commonReasons.map((reason, idx) => (
              <div key={idx} className="p-4 bg-red-50 rounded border border-red-100">
                <div className="text-3xl mb-2">{reason.icon}</div>
                <p className="font-medium text-red-900">{reason.title}</p>
                <p className="text-sm text-red-700 mt-2">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Permission Levels */}
        <div className="bg-white border border-orange-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-orange-900 mb-4">🔑 Permission Levels</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {permissionLevels.map((level, idx) => (
              <div key={idx} className={`p-4 rounded-lg ${level.color}`}>
                <h3 className="font-bold text-lg">{level.role}</h3>
                <p className="text-sm opacity-90 mb-3">{level.access}</p>
                <div className="text-xs space-y-1">
                  {level.permissions.map((perm, pidx) => (
                    <p key={pidx}>✓ {perm}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white border border-yellow-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-yellow-900 mb-4">📋 What You Can Do</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium flex items-center justify-center gap-2"
            >
              ← Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
            >
              🏠 Go to Homepage
            </button>
            <button
              onClick={handleRequestAccess}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
            >
              ✉️ Request Access
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-medium flex items-center justify-center gap-2"
            >
              💬 Contact Support
            </button>
          </div>
          {requestSent && (
            <p className="text-green-600 text-center font-medium">✓ Access request sent! We'll notify you within 24 hours.</p>
          )}
        </div>

        {/* Troubleshooting */}
        <div className="bg-white border border-purple-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">🔧 Troubleshooting Steps</h2>
          <ol className="space-y-3">
            {[
              'Try logging out and logging back in (Session refresh)',
              'Clear your browser cache and cookies',
              'Try using a different browser or private browsing mode',
              'Check if your subscription plan is still active',
              'Verify your account email is confirmed',
              'Contact your organization administrator for role confirmation',
              'Wait 5-10 minutes as changes may be syncing'
            ].map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 bg-purple-50 rounded border border-purple-100">
                <span className="font-bold text-purple-600 text-lg min-w-8">{idx + 1}</span>
                <span className="text-purple-900">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* User Options */}
        <div className="bg-white border border-green-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-green-900 mb-4">👤 Account Options</h2>
          {user ? (
            <div className="space-y-3">
              <button
                onClick={() => navigate('/settings')}
                className="w-full px-6 py-3 bg-green-100 text-green-900 rounded-lg hover:bg-green-200 transition font-medium text-left"
              >
                ⚙️ Go to Account Settings
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="w-full px-6 py-3 bg-green-50 text-green-900 rounded-lg hover:bg-green-100 transition font-medium text-left"
              >
                👥 View My Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 bg-red-100 text-red-900 rounded-lg hover:bg-red-200 transition font-medium text-left"
              >
                🚪 Logout and Try Different Account
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-600 mb-4">You're not logged in. Try logging in with a different account.</p>
              <button
                onClick={() => navigate('/auth/login')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                🔑 Log In
              </button>
              <button
                onClick={() => navigate('/auth/register')}
                className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
              >
                ➕ Create Account
              </button>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="bg-white border border-indigo-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="border border-indigo-200 rounded p-4 bg-indigo-50 cursor-pointer hover:bg-indigo-100 transition"
                open={expandedFaq === idx}
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
              >
                <summary className="font-medium text-indigo-900 cursor-pointer select-none">
                  {faq.q}
                </summary>
                <p className="text-indigo-700 mt-2 text-sm">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">🆘 Need Immediate Help?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="mailto:support@stayspot.com"
              className="p-4 bg-red-500 rounded-lg hover:bg-red-400 transition text-center font-medium"
            >
              📧 Email Support<br/>
              <span className="text-sm">support@stayspot.com</span>
            </a>
            <a
              href="tel:1-800-STAYSPOT"
              className="p-4 bg-red-500 rounded-lg hover:bg-red-400 transition text-center font-medium"
            >
              📞 Call Us<br/>
              <span className="text-sm">1-800-STAYSPOT</span>
            </a>
            <button
              onClick={() => navigate('/contact')}
              className="p-4 bg-red-500 rounded-lg hover:bg-red-400 transition text-center font-medium"
            >
              💬 Live Chat<br/>
              <span className="text-sm">24/7 Support Available</span>
            </button>
          </div>
        </div>

        {/* Related Links */}
        <div className="bg-white border border-indigo-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">🔗 Helpful Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="/docs/permissions"
              className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition border border-indigo-200"
            >
              <p className="font-medium text-indigo-900 mb-1">📖 Permission Guide</p>
              <p className="text-sm text-indigo-700">Learn about different user roles and permissions</p>
            </a>
            <a
              href="/docs/subscription"
              className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition border border-indigo-200"
            >
              <p className="font-medium text-indigo-900 mb-1">💳 Subscription Plans</p>
              <p className="text-sm text-indigo-700">Compare plans and find the right fit</p>
            </a>
            <a
              href="/docs/account-setup"
              className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition border border-indigo-200"
            >
              <p className="font-medium text-indigo-900 mb-1">⚙️ Account Setup Guide</p>
              <p className="text-sm text-indigo-700">Step-by-step account configuration</p>
            </a>
            <a
              href="/docs/security"
              className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition border border-indigo-200"
            >
              <p className="font-medium text-indigo-900 mb-1">🔒 Security Settings</p>
              <p className="text-sm text-indigo-700">Manage your account security and privacy</p>
            </a>
          </div>
        </div>

        {/* Subscription Tiers Info */}
        <div className="bg-white border border-teal-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-teal-900 mb-4">💰 Upgrade Options</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-6 bg-teal-50 rounded-lg border border-teal-200">
              <h3 className="text-xl font-bold text-teal-900 mb-2">Basic</h3>
              <p className="text-teal-700 mb-3">Perfect for individuals</p>
              <ul className="text-sm text-teal-800 space-y-1">
                <li>✓ View own unit</li>
                <li>✓ Submit requests</li>
                <li>✓ Basic messaging</li>
              </ul>
              <p className="font-bold text-teal-900 mt-4">Free</p>
            </div>
            <div className="p-6 bg-teal-50 rounded-lg border-2 border-teal-500 relative">
              <div className="absolute top-2 right-2 bg-teal-500 text-white px-2 py-1 text-xs rounded">POPULAR</div>
              <h3 className="text-xl font-bold text-teal-900 mb-2">Pro</h3>
              <p className="text-teal-700 mb-3">For property management</p>
              <ul className="text-sm text-teal-800 space-y-1">
                <li>✓ Manage multiple units</li>
                <li>✓ Advanced reporting</li>
                <li>✓ Priority support</li>
              </ul>
              <p className="font-bold text-teal-900 mt-4">$29/month</p>
            </div>
            <div className="p-6 bg-teal-50 rounded-lg border border-teal-200">
              <h3 className="text-xl font-bold text-teal-900 mb-2">Enterprise</h3>
              <p className="text-teal-700 mb-3">For large portfolios</p>
              <ul className="text-sm text-teal-800 space-y-1">
                <li>✓ Unlimited properties</li>
                <li>✓ Custom features</li>
                <li>✓ Dedicated support</li>
              </ul>
              <p className="font-bold text-teal-900 mt-4">Custom</p>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={() => navigate('/pricing')}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
            >
              View All Plans
            </button>
          </div>
        </div>

        {/* What is Your Role */}
        <div className="bg-white border border-pink-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-pink-900 mb-4">🎯 What is Your Role?</h2>
          <div className="space-y-3">
            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200 cursor-pointer hover:bg-pink-100 transition">
              <p className="font-medium text-pink-900">👨‍💼 I'm a Tenant</p>
              <p className="text-sm text-pink-700">I rent a unit and need access to my lease and requests</p>
              <button
                onClick={() => navigate('/auth/login')}
                className="mt-2 text-pink-600 hover:text-pink-700 text-sm font-medium"
              >
                Go to Tenant Portal →
              </button>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200 cursor-pointer hover:bg-pink-100 transition">
              <p className="font-medium text-pink-900">🏘️ I'm a Landlord</p>
              <p className="text-sm text-pink-700">I own properties and manage tenants</p>
              <button
                onClick={() => navigate('/auth/login')}
                className="mt-2 text-pink-600 hover:text-pink-700 text-sm font-medium"
              >
                Go to Landlord Dashboard →
              </button>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200 cursor-pointer hover:bg-pink-100 transition">
              <p className="font-medium text-pink-900">🏢 I'm a Manager</p>
              <p className="text-sm text-pink-700">I manage properties for clients</p>
              <button
                onClick={() => navigate('/auth/login')}
                className="mt-2 text-pink-600 hover:text-pink-700 text-sm font-medium"
              >
                Go to Management Console →
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-gray-600 text-sm border-t border-gray-300 pt-8">
          <p>Error Code: 403 | Status: Unauthorized Access</p>
          <p className="mt-2">
            If you believe this is an error, please{' '}
            <button
              onClick={() => navigate('/contact')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              report this issue
            </button>
          </p>
          <p className="mt-4 text-xs text-gray-500">
            Need help? Contact our support team at support@stayspot.com or call 1-800-STAYSPOT
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
