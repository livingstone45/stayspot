import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useThemeMode } from '../hooks/useThemeMode';
import { User, Lock, LogOut, X, Mail, Phone, MapPin, Calendar, Home, Edit2, Upload, Camera } from 'lucide-react';

const TenantLayout = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, getClassNames } = useThemeMode();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditAccountModal, setShowEditAccountModal] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [cryptoData, setCryptoData] = useState(null);
  const [profileImage] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.firstName);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [accountForm, setAccountForm] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
    zipCode: user.zipCode || '',
  });
  const [accountImage, setAccountImage] = useState(profileImage);
  const [imagePreview, setImagePreview] = useState(profileImage);
  const [savedMessage, setSavedMessage] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    // Fetch additional profile data from random user API
    const fetchProfileData = async () => {
      setLoadingProfile(true);
      try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        if (data.results && data.results[0]) {
          const userData = data.results[0];
          setProfileData({
            phone: userData.phone,
            location: `${userData.location.city}, ${userData.location.state}`,
            country: userData.location.country,
            joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            status: 'Active Tenant',
            accountVerified: true,
            rentalHistory: '2 years',
            rating: 4.8,
            image: userData.picture.large,
          });
        }
      } catch (error) {
        console.log('Could not fetch online profile data, using defaults');
        setProfileData({
          phone: user.phone || '+1 (555) 123-4567',
          location: 'Los Angeles, CA',
          country: 'United States',
          joinDate: 'Jan 2024',
          status: 'Active Tenant',
          accountVerified: true,
          rentalHistory: '2 years',
          rating: 4.8,
          image: profileImage,
        });
      }
      setLoadingProfile(false);
    };

    fetchProfileData();
  }, [user.firstName, profileImage]);

  useEffect(() => {
    // Fetch internet data: weather, news, exchange rates, crypto
    const fetchInternetData = async () => {
      try {
        // Fetch weather data (using Open-Meteo free API - no key needed)
        const weatherResponse = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=34.0522&longitude=-118.2437&current=temperature_2m,weather_code&timezone=America/Los_Angeles'
        );
        const weatherJson = await weatherResponse.json();
        if (weatherJson.current) {
          setWeatherData({
            temp: Math.round(weatherJson.current.temperature_2m),
            condition: weatherJson.current.weather_code,
            location: 'Los Angeles, CA',
          });
        }

        // Fetch crypto data (Bitcoin, Ethereum prices)
        const cryptoResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_market_cap=true&include_24hr_change=true'
        );
        const cryptoJson = await cryptoResponse.json();
        if (cryptoJson.bitcoin && cryptoJson.ethereum) {
          setCryptoData({
            bitcoin: {
              price: cryptoJson.bitcoin.usd,
              change: cryptoJson.bitcoin.usd_24h_change,
              market_cap: cryptoJson.bitcoin.usd_market_cap,
            },
            ethereum: {
              price: cryptoJson.ethereum.usd,
              change: cryptoJson.ethereum.usd_24h_change,
              market_cap: cryptoJson.ethereum.usd_market_cap,
            },
          });
        }

        // Fetch exchange rates (USD to major currencies)
        const exchangeResponse = await fetch(
          'https://api.exchangerate-api.com/v4/latest/USD'
        );
        const exchangeJson = await exchangeResponse.json();
        if (exchangeJson.rates) {
          setExchangeRate({
            eur: exchangeJson.rates.EUR,
            gbp: exchangeJson.rates.GBP,
            jpy: exchangeJson.rates.JPY,
            aud: exchangeJson.rates.AUD,
          });
        }

        // Fetch news data (using NewsAPI alternative - JSONPlaceholder fallback)
        const newsResponse = await fetch(
          'https://jsonplaceholder.typicode.com/posts?_limit=3'
        );
        const newsJson = await newsResponse.json();
        if (Array.isArray(newsJson)) {
          setNewsData(newsJson.slice(0, 3));
        }
      } catch (error) {
        console.log('Could not fetch internet data:', error);
      }
    };

    fetchInternetData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth/login');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSavedMessage('Passwords do not match!');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setSavedMessage('Password must be at least 8 characters long');
      return;
    }
    setSavedMessage('Password changed successfully!');
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setAccountImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditAccount = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      ...accountForm,
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setSavedMessage('Account information updated successfully!');
    setShowEditAccountModal(false);
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const menuItems = [
    { label: 'Dashboard', path: '/tenant', icon: '📊' },
    { label: 'Payments', path: '/tenant/payments', icon: '💳' },
    { label: 'Maintenance', path: '/tenant/maintenance', icon: '🔧' },
    { label: 'Messages', path: '/tenant/messages', icon: '💬' },
    { label: 'My Unit', path: '/tenant/my-unit', icon: '🏠' },
    { label: 'Documents', path: '/tenant/documents', icon: '📄' },
    { label: 'Lease', path: '/tenant/lease', icon: '📋' },
    { label: 'Settings', path: '/tenant/settings', icon: '⚙️' },
    { label: 'Resources', path: '/tenant/resources', icon: '📚' },
    { label: 'Market Info', path: '/tenant/market-info', icon: '📈' },
    { label: 'Neighborhood', path: '/tenant/neighborhood', icon: '🗺️' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${getClassNames.background}`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm sticky top-0 z-100 border-b transition-colors duration-300`}>
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`bg-none border-none text-2xl cursor-pointer ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
            >
              ☰
            </button>
            <Link to="/tenant" className={`text-xl font-bold no-underline flex items-center gap-2 transition-colors duration-300 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${isDark ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-blue-600 to-blue-700'}`}>
                SS
              </div>
              StaySpot
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {user.firstName} {user.lastName}
            </span>
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:shadow-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
              </button>
              
              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <div className={`absolute right-0 mt-2 w-72 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  {/* Profile Header */}
                  <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <img src={profileData?.image || profileImage} alt="Profile" className="w-14 h-14 rounded-full object-cover" />
                      <div className="flex-1">
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {user.firstName} {user.lastName}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                          ● {profileData?.status || 'Active'}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                          Verified Tenant
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-xs font-semibold mb-3 uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Contact Info
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {profileData?.phone || '+1 (555) 123-4567'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Location & Address */}
                  <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-xs font-semibold mb-3 uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Location
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {profileData?.location || 'Los Angeles, CA'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Home size={16} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Unit 402 • Sunset Apartments
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rental Stats */}
                  <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-xs font-semibold mb-3 uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Account Stats
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`p-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Joined
                        </p>
                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {profileData?.joinDate || 'Jan 2024'}
                        </p>
                      </div>
                      <div className={`p-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Rating
                        </p>
                        <p className={`text-sm font-semibold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                          ⭐ {profileData?.rating || 4.8}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lease Information */}
                  <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-xs font-semibold mb-3 uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Lease Info
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Active Since
                        </span>
                        <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Jan 1, 2024
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Expires
                        </span>
                        <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Dec 31, 2025
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Status
                        </span>
                        <span className={`text-sm font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                          ✓ Active
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className={`p-2 ${isDark ? 'bg-gray-750' : 'bg-gray-50'}`}>
                    <button
                      onClick={() => {
                        setShowEditAccountModal(true);
                        setShowProfileMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <Edit2 size={18} />
                      <span>Edit Account</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowPasswordModal(true);
                        setShowProfileMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <Lock size={18} />
                      <span>Change Password</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowProfileMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition text-red-600 ${isDark ? 'hover:bg-red-900 hover:bg-opacity-20' : 'hover:bg-red-50'}`}
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className={`transition-all duration-300 overflow-hidden flex flex-col min-h-0 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}
          style={{ width: sidebarOpen ? '280px' : '0' }}>
          <nav className="p-4 flex-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 no-underline text-sm font-medium transition-all duration-200 rounded-lg mx-1 mb-1 ${
                  isActive(item.path)
                    ? isDark
                      ? 'bg-blue-900 bg-opacity-30 text-blue-400 border-l-4 border-blue-400'
                      : 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : isDark
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                <div className="flex flex-col gap-1">
                  <span>{item.label}</span>
                  <span className={`text-xs font-normal ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Page</span>
                </div>
              </Link>
            ))}

            {/* Internet Data Widgets */}
            <div className={`mt-6 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`px-6 text-xs font-semibold uppercase mb-3 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Live Data
              </p>

              {/* Weather Widget */}
              {weatherData && (
                <div className={`mx-1 mb-3 p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    🌤️ Weather
                  </p>
                  <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {weatherData.temp}°F
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {weatherData.location}
                  </p>
                </div>
              )}

              {/* Crypto Widget */}
              {cryptoData && (
                <div className={`mx-1 mb-3 p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-orange-50'}`}>
                  <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    ₿ Bitcoin
                  </p>
                  <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ${cryptoData.bitcoin.price?.toLocaleString() || 'N/A'}
                  </p>
                  <p className={`text-xs ${cryptoData.bitcoin.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {cryptoData.bitcoin.change?.toFixed(2)}% (24h)
                  </p>
                </div>
              )}

              {/* ETH Widget */}
              {cryptoData && (
                <div className={`mx-1 mb-3 p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Ξ Ethereum
                  </p>
                  <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ${cryptoData.ethereum.price?.toLocaleString() || 'N/A'}
                  </p>
                  <p className={`text-xs ${cryptoData.ethereum.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {cryptoData.ethereum.change?.toFixed(2)}% (24h)
                  </p>
                </div>
              )}

              {/* Exchange Rate Widget */}
              {exchangeRate && (
                <div className={`mx-1 mb-3 p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    💱 USD Exchange
                  </p>
                  <div className="space-y-1">
                    <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      EUR: {exchangeRate.eur?.toFixed(2)}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      GBP: {exchangeRate.gbp?.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto min-h-0 flex flex-col transition-colors duration-300 ${getClassNames.background}`}>
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t transition-colors duration-300 px-8 py-6`}>
        <div className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>&copy; {new Date().getFullYear()} StaySpot. All rights reserved.</p>
        </div>
      </footer>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg max-w-md w-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Change Password</h3>
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className={`p-1 rounded hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition`}
              >
                <X size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
              </button>
            </div>
            
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              {savedMessage && (
                <div className={`p-3 rounded-lg text-sm ${savedMessage.includes('successfully') ? isDark ? 'bg-green-900 bg-opacity-20 text-green-300' : 'bg-green-50 text-green-800' : isDark ? 'bg-red-900 bg-opacity-20 text-red-300' : 'bg-red-50 text-red-800'}`}>
                  {savedMessage}
                </div>
              )}
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Current Password
                </label>
                <input 
                  type="password" 
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  New Password
                </label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Must be at least 8 characters long
                </p>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirm New Password
                </label>
                <input 
                  type="password" 
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Change Password
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition font-medium ${isDark ? 'border-gray-700 text-white hover:bg-gray-700' : 'border-gray-300 text-gray-900 hover:bg-gray-100'}`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {showEditAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} sticky top-0 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Edit Account</h3>
              <button 
                onClick={() => {
                  setShowEditAccountModal(false);
                  setImagePreview(profileImage);
                  setAccountForm({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    address: user.address || '',
                    city: user.city || '',
                    state: user.state || '',
                    zipCode: user.zipCode || '',
                  });
                }}
                className={`p-1 rounded hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition`}
              >
                <X size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
              </button>
            </div>
            
            <form onSubmit={handleEditAccount} className="p-6 space-y-6">
              {/* Success/Error Message */}
              {savedMessage && (
                <div className={`p-4 rounded-lg text-sm font-medium ${savedMessage.includes('successfully') ? isDark ? 'bg-green-900 bg-opacity-20 text-green-300' : 'bg-green-50 text-green-800' : isDark ? 'bg-red-900 bg-opacity-20 text-red-300' : 'bg-red-50 text-red-800'}`}>
                  {savedMessage}
                </div>
              )}

              {/* Profile Picture Section */}
              <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-700 bg-opacity-50' : 'bg-blue-50 border border-blue-200'}`}>
                <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile Picture</h4>
                <div className="flex items-center gap-6">
                  {/* Image Preview */}
                  <div className={`w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                    <img 
                      src={imagePreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Upload Button */}
                  <div className="flex-1">
                    <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer transition ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                      <Camera size={18} />
                      <span>Upload Photo</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      JPG, PNG or GIF (max. 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div>
                <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={accountForm.firstName}
                      onChange={(e) => setAccountForm({...accountForm, firstName: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition`}
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={accountForm.lastName}
                      onChange={(e) => setAccountForm({...accountForm, lastName: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition`}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      value={accountForm.email}
                      onChange={(e) => setAccountForm({...accountForm, email: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition`}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      value={accountForm.phone}
                      onChange={(e) => setAccountForm({...accountForm, phone: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div>
                <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Address Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Street Address */}
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Street Address
                    </label>
                    <input 
                      type="text" 
                      value={accountForm.address}
                      onChange={(e) => setAccountForm({...accountForm, address: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition`}
                      placeholder="123 Main Street"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      City
                    </label>
                    <input 
                      type="text" 
                      value={accountForm.city}
                      onChange={(e) => setAccountForm({...accountForm, city: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition`}
                      placeholder="Los Angeles"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      State / Province
                    </label>
                    <input 
                      type="text" 
                      value={accountForm.state}
                      onChange={(e) => setAccountForm({...accountForm, state: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition`}
                      placeholder="CA"
                    />
                  </div>

                  {/* ZIP Code */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      ZIP / Postal Code
                    </label>
                    <input 
                      type="text" 
                      value={accountForm.zipCode}
                      onChange={(e) => setAccountForm({...accountForm, zipCode: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition`}
                      placeholder="90001"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t" style={{borderColor: isDark ? '#374151' : '#e5e7eb'}}>
                <button 
                  type="submit"
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  <Upload size={18} />
                  Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditAccountModal(false);
                    setImagePreview(profileImage);
                    setAccountForm({
                      firstName: user.firstName || '',
                      lastName: user.lastName || '',
                      email: user.email || '',
                      phone: user.phone || '',
                      address: user.address || '',
                      city: user.city || '',
                      state: user.state || '',
                      zipCode: user.zipCode || '',
                    });
                  }}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold border-2 transition ${isDark ? 'border-gray-700 text-white hover:bg-gray-700' : 'border-gray-300 text-gray-900 hover:bg-gray-100'}`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantLayout;
