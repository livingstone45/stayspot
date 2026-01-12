import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-white mt-12">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <span className="mr-2">🏠</span>StaySpot
            </h3>
            <p className="text-gray-400 mb-4">The all-in-one platform for property management.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white text-xl">f</a>
              <a href="#" className="text-gray-400 hover:text-white text-xl">𝕏</a>
              <a href="#" className="text-gray-400 hover:text-white text-xl">in</a>
              <a href="#" className="text-gray-400 hover:text-white text-xl">📷</a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold mb-4 text-white">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/features" className="hover:text-white transition">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link to="/security" className="hover:text-white transition">Security</Link></li>
              <li><Link to="/integrations" className="hover:text-white transition">Integrations</Link></li>
              <li><Link to="/roadmap" className="hover:text-white transition">Roadmap</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link to="/press" className="hover:text-white transition">Press</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-4 text-white">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/help" className="hover:text-white transition">Help Center</Link></li>
              <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link to="/docs" className="hover:text-white transition">Documentation</Link></li>
              <li><Link to="/api" className="hover:text-white transition">API Reference</Link></li>
              <li><Link to="/community" className="hover:text-white transition">Community</Link></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-bold mb-4 text-white">Legal & Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-white transition">Cookie Policy</Link></li>
              <li><Link to="/support" className="hover:text-white transition">Support</Link></li>
              <li><Link to="/status" className="hover:text-white transition">Status Page</Link></li>
            </ul>
          </div>

          {/* Stay Updated Newsletter */}
          <div>
            <h4 className="font-bold mb-4 text-white">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">Get the latest property management tips, updates, and insights delivered to your inbox.</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-gray-900 focus:outline-none text-sm"
                required
              />
              <button type="submit" className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition text-sm">
                Subscribe
              </button>
            </form>
            {subscribed && <p className="text-green-400 mt-2 text-sm">✓ Thank you for subscribing!</p>}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              <p>&copy; 2024 StaySpot. All rights reserved.</p>
            </div>

            {/* Quick Links */}
            <div className="text-gray-400 text-sm text-center space-x-4">
              <a href="#" className="hover:text-white transition">English</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition">Accessibility</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition">Report Issue</a>
            </div>

            {/* Version */}
            <div className="text-gray-400 text-sm text-right">
              <p>v2.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
