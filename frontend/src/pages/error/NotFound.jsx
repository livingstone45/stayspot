import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const relatedPages = [
    { name: 'Landlord Dashboard', path: '/landlord/dashboard' },
    { name: 'Tenant Portal', path: '/tenant/dashboard' },
    { name: 'Browse Properties', path: '/properties' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Support', path: '/contact' },
    { name: 'Help Center', path: '/help' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Blog', path: '/blog' },
    { name: 'Community', path: '/community' },
    { name: 'Status Page', path: '/status' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="text-center">
          {/* Error Code */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-blue-600 opacity-20 mb-4">
              404
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Page Not Found</h1>
            <p className="text-xl text-gray-600 mt-4">
              Sorry, the page you're looking for doesn't exist.
            </p>
          </div>

          {/* Illustration */}
          <div className="text-6xl mb-8 animate-bounce">🔍</div>

          {/* URL Information */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">The URL you were trying to access:</p>
            <p className="font-mono text-sm text-blue-600 break-all bg-gray-50 p-3 rounded mb-4">
              {location.pathname}
            </p>
            <p className="text-gray-700">
              This page doesn't exist. It might have been moved, renamed, or deleted.
            </p>
          </div>

          {/* Common Navigation Destinations */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-yellow-900 mb-4">🔗 Quick Navigation</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              <button
                onClick={() => navigate('/landlord/dashboard')}
                className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition"
              >
                Landlord
              </button>
              <button
                onClick={() => navigate('/tenant/dashboard')}
                className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition"
              >
                Tenant
              </button>
              <button
                onClick={() => navigate('/properties')}
                className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition"
              >
                Properties
              </button>
              <button
                onClick={() => navigate('/about')}
                className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition"
              >
                About
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition"
              >
                Pricing
              </button>
              <button
                onClick={() => navigate('/faq')}
                className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition"
              >
                FAQ
              </button>
            </div>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">💡 Tip: Try searching for keywords related to what you need</p>
          </form>

          {/* Troubleshooting Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="font-bold text-blue-900 mb-3">Troubleshooting Tips:</h2>
            <div className="space-y-2 text-left text-sm text-blue-800">
              <p className="flex items-start gap-2">
                <span className="text-lg">✓</span>
                <span>Double-check the URL in your address bar for typos</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-lg">✓</span>
                <span>Clear your browser cache and try again</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-lg">✓</span>
                <span>Make sure you're logged in if this is a protected page</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-lg">✓</span>
                <span>Check that your subscription or access is still active</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              ← Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Go to Homepage
            </button>
          </div>

          {/* Related Pages */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="font-bold text-gray-900 mb-6">Popular Pages & Resources</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {relatedPages.map((page, index) => (
                <button
                  key={index}
                  onClick={() => navigate(page.path)}
                  className="px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition text-sm font-medium border border-gray-200 hover:border-blue-300"
                >
                  {page.name}
                </button>
              ))}
            </div>
          </div>

          {/* What to do next */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-8 border border-blue-200">
            <h2 className="font-bold text-blue-900 mb-4">What to Do Next:</h2>
            <ol className="space-y-3 text-sm text-blue-800">
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">1</span>
                <span>Double-check the URL in your browser's address bar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">2</span>
                <span>Try using our navigation menu to find the page</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">3</span>
                <span>Use the search feature above to look for what you need</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">4</span>
                <span>Clear your browser cache and try again</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">5</span>
                <span>Contact support if you think this is an error</span>
              </li>
            </ol>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-8 border-t border-gray-300">
            <p className="text-gray-600 mb-4">Still need help?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/contact')}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Contact Support
              </button>
              <span className="text-gray-400 hidden sm:block">•</span>
              <button
                onClick={() => navigate('/help')}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                View Help Center
              </button>
              <span className="text-gray-400 hidden sm:block">•</span>
              <a
                href="mailto:support@stayspot.com"
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Email Support
              </a>
            </div>
          </div>

          {/* Common Issues & Solutions */}
          <div className="mt-8 bg-gray-100 rounded-lg p-6 text-left">
            <h3 className="font-bold text-gray-900 mb-4">Common Reasons for 404 Errors:</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-medium text-gray-900">Typo in URL</p>
                <p className="text-xs text-gray-600">Check the spelling and make sure there are no extra spaces</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Outdated Bookmark</p>
                <p className="text-xs text-gray-600">The page may have been restructured. Use navigation instead</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Lost Permission</p>
                <p className="text-xs text-gray-600">Your access may have changed. Contact your administrator</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Page Removed</p>
                <p className="text-xs text-gray-600">The content may no longer exist. Check the site map</p>
              </div>
            </div>
          </div>

          {/* Site Map */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-900 mb-4">Site Map</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-900 mb-2">For Landlords</p>
                <ul className="space-y-1 text-gray-600">
                  <li>
                    <button onClick={() => navigate('/landlord/dashboard')} className="hover:text-blue-600">
                      → Dashboard
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/landlord/properties')} className="hover:text-blue-600">
                      → My Properties
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/landlord/financials')} className="hover:text-blue-600">
                      → Financial Reports
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/landlord/maintenance')} className="hover:text-blue-600">
                      → Maintenance
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">For Tenants</p>
                <ul className="space-y-1 text-gray-600">
                  <li>
                    <button onClick={() => navigate('/tenant/dashboard')} className="hover:text-blue-600">
                      → Dashboard
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/tenant/unit')} className="hover:text-blue-600">
                      → My Unit
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/tenant/documents')} className="hover:text-blue-600">
                      → Documents
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/tenant/messages')} className="hover:text-blue-600">
                      → Messages
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Status Code Info */}
          <div className="mt-8 text-xs text-gray-500">
            <p>Error Code: 404 Not Found</p>
            <p>Request ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>

          {/* FAQ */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4 text-left text-sm">
              <details className="border border-gray-200 rounded p-3 cursor-pointer">
                <summary className="font-medium text-gray-900">Why am I seeing a 404 error?</summary>
                <p className="text-gray-600 mt-2">A 404 error means the page or resource you're trying to access doesn't exist on the server. This could be due to a wrong URL, deleted content, or the page being moved.</p>
              </details>
              <details className="border border-gray-200 rounded p-3 cursor-pointer">
                <summary className="font-medium text-gray-900">How can I fix this error?</summary>
                <p className="text-gray-600 mt-2">Try going back to the previous page, check the URL for typos, or use the main navigation menu to find what you're looking for. If you believe this is an error, contact our support team.</p>
              </details>
              <details className="border border-gray-200 rounded p-3 cursor-pointer">
                <summary className="font-medium text-gray-900">Is this a problem with my account?</summary>
                <p className="text-gray-600 mt-2">A 404 error is not related to your account. It simply means the specific page wasn't found. Your account is fine, and you can continue using StaySpot as normal.</p>
              </details>
              <details className="border border-gray-200 rounded p-3 cursor-pointer">
                <summary className="font-medium text-gray-900">What should I do next?</summary>
                <p className="text-gray-600 mt-2">Use the navigation menu to find the page you're looking for, try using the search function, or contact our support team if you need further assistance.</p>
              </details>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-bold text-blue-900 mb-2">📚 Knowledge Base</p>
              <p className="text-sm text-blue-800 mb-3">Explore our comprehensive guides and documentation</p>
              <button
                onClick={() => navigate('/knowledge-base')}
                className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Visit Knowledge Base
              </button>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="font-bold text-green-900 mb-2">💬 Live Support</p>
              <p className="text-sm text-green-800 mb-3">Chat with our support team for immediate help</p>
              <button
                onClick={() => navigate('/support/chat')}
                className="text-sm px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Start Chat
              </button>
            </div>
          </div>

          {/* Report Page Issue */}
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-bold text-red-900 mb-2">🐛 Report an Issue</h3>
            <p className="text-sm text-red-800 mb-4">
              If you believe this is an error or if you found this page by following a link on our site, please let us know.
            </p>
            <button
              onClick={() => navigate('/report-issue')}
              className="text-sm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Report This Issue
            </button>
          </div>

          {/* Browser Tips */}
          <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-purple-900 mb-3">💻 Browser Tips</h3>
            <ul className="text-sm text-purple-800 space-y-2">
              <li>• Try opening StaySpot in a different browser</li>
              <li>• Disable browser extensions that might interfere</li>
              <li>• Try a private/incognito browsing window</li>
              <li>• Update your browser to the latest version</li>
              <li>• Make sure JavaScript is enabled in your browser</li>
            </ul>
          </div>

          {/* Last Resort Links */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-4">Last resort - try these emergency links:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button onClick={() => window.location.href = '/'} className="text-xs text-blue-600 hover:text-blue-700 underline">Force Home</button>
              <span className="text-gray-400">•</span>
              <button onClick={() => window.location.reload()} className="text-xs text-blue-600 hover:text-blue-700 underline">Refresh Page</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
