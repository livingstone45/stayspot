import React, { useState } from 'react';
import { Search, Plus, Mail, Phone, FileText, CheckCircle, AlertCircle, TrendingUp, X } from 'lucide-react';

const LandlordTenants = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentTenants, setCurrentTenants] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '(555) 123-4567', unit: '2A', property: 'Sunset Apartments', rent: 1200, leaseEnd: '2025-01-15', rating: 4.8, paymentStatus: 'on-time', moveInDate: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '(555) 234-5678', unit: '1B', property: 'Downtown Complex', rent: 1500, leaseEnd: '2025-06-20', rating: 4.9, paymentStatus: 'on-time', moveInDate: '2022-06-20' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '(555) 345-6789', unit: '3C', property: 'Riverside Towers', rent: 1350, leaseEnd: '2025-09-01', rating: 4.5, paymentStatus: 'pending', moveInDate: '2023-09-01' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '(555) 456-7890', unit: '4D', property: 'Hillside Residences', rent: 1400, leaseEnd: '2026-03-10', rating: 5.0, paymentStatus: 'on-time', moveInDate: '2023-03-10' },
  ]);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', unit: '', property: '', rent: '', leaseEnd: '' });

  const handleAddTenant = () => {
    if (formData.name && formData.email && formData.unit && formData.rent) {
      const newTenant = {
        id: currentTenants.length + 1,
        ...formData,
        rent: parseInt(formData.rent),
        rating: 4.5,
        paymentStatus: 'on-time',
        moveInDate: new Date().toISOString().split('T')[0]
      };
      setCurrentTenants([...currentTenants, newTenant]);
      setFormData({ name: '', email: '', phone: '', unit: '', property: '', rent: '', leaseEnd: '' });
      setShowModal(false);
    }
  };

  const applications = [
    { id: 1, name: 'Mike Johnson', email: 'mike@example.com', phone: '(555) 456-7890', unit: '2B', property: 'Sunset Apartments', creditScore: 750, income: 65000, status: 'pending', appliedDate: '2024-12-18' },
    { id: 2, name: 'Sarah Davis', email: 'sarah@example.com', phone: '(555) 567-8901', unit: '1C', property: 'Downtown Complex', creditScore: 720, income: 55000, status: 'reviewing', appliedDate: '2024-12-15' },
    { id: 3, name: 'Tom Martinez', email: 'tom@example.com', phone: '(555) 678-9012', unit: '3A', property: 'Central Hub', creditScore: 780, income: 75000, status: 'approved', appliedDate: '2024-12-10' },
  ];

  const filteredTenants = currentTenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApplications = applications.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalTenants: currentTenants.length,
    onTimePayments: currentTenants.filter(t => t.paymentStatus === 'on-time').length,
    monthlyIncome: currentTenants.reduce((sum, t) => sum + t.rent, 0),
    applications: applications.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">Tenant Management 👥</h1>
        <p className="text-gray-600">Manage tenants, applications, and communications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-md p-6 border-2 border-teal-200">
          <p className="text-teal-700 text-sm font-semibold mb-1">Active Tenants</p>
          <p className="text-3xl font-bold text-teal-900">{stats.totalTenants}</p>
          <p className="text-teal-600 text-xs mt-2">✓ All active</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl shadow-md p-6 border-2 border-cyan-200">
          <p className="text-cyan-700 text-sm font-semibold mb-1">On-Time Payments</p>
          <p className="text-3xl font-bold text-cyan-900">{stats.onTimePayments}/{stats.totalTenants}</p>
          <p className="text-cyan-600 text-xs mt-2">{((stats.onTimePayments / stats.totalTenants) * 100).toFixed(0)}% rate</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-md p-6 border-2 border-emerald-200">
          <p className="text-emerald-700 text-sm font-semibold mb-1">Monthly Income</p>
          <p className="text-3xl font-bold text-emerald-900">${stats.monthlyIncome.toLocaleString()}</p>
          <p className="text-emerald-600 text-xs mt-2">From rent</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border-2 border-blue-200">
          <p className="text-blue-700 text-sm font-semibold mb-1">Applications</p>
          <p className="text-3xl font-bold text-blue-900">{stats.applications}</p>
          <p className="text-blue-600 text-xs mt-2">Pending review</p>
        </div>
      </div>

      {/* Search & Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-teal-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-3 text-teal-400" size={20} />
            <input
              type="text"
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition flex items-center gap-2 font-semibold shadow-md">
            <Plus size={20} /> Add Tenant
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md border-2 border-teal-100 mb-8 overflow-hidden">
        <div className="flex border-b-2 border-teal-100">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'current'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Current Tenants ({currentTenants.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'applications'
                ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Applications ({applications.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-0">
          {activeTab === 'current' && (
            <div className="divide-y divide-teal-100">
              {filteredTenants.map((tenant) => (
                <div key={tenant.id} className="p-6 hover:bg-teal-50 transition flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {tenant.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900">{tenant.name}</h3>
                        <p className="text-gray-600 text-sm">Unit {tenant.unit} • {tenant.property}</p>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-8 ml-4">
                    <div className="text-center">
                      <p className="text-gray-600 text-xs font-semibold mb-1">Rent</p>
                      <p className="text-base font-bold text-emerald-600">${tenant.rent}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 text-xs font-semibold mb-1">Rating</p>
                      <p className="text-base font-bold text-yellow-600">⭐ {tenant.rating}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 text-xs font-semibold mb-1">Lease Ends</p>
                      <p className="text-sm text-gray-900">{tenant.leaseEnd}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      tenant.paymentStatus === 'on-time'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {tenant.paymentStatus === 'on-time' ? '✓ On Time' : '⏰ Pending'}
                    </span>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button className="p-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition shadow-md" title="Message">
                      <Mail size={18} />
                    </button>
                    <button className="p-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition" title="Call">
                      <Phone size={18} />
                    </button>
                    <button className="p-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition" title="Documents">
                      <FileText size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="divide-y divide-cyan-100">
              {filteredApplications.map((app) => (
                <div key={app.id} className="p-6 hover:bg-cyan-50 transition flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {app.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900">{app.name}</h3>
                        <p className="text-gray-600 text-sm">Unit {app.unit} • {app.property}</p>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-8 ml-4">
                    <div className="text-center">
                      <p className="text-gray-600 text-xs font-semibold mb-1">Credit</p>
                      <p className="text-base font-bold text-gray-900">{app.creditScore}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 text-xs font-semibold mb-1">Income</p>
                      <p className="text-base font-bold text-gray-900">${(app.income / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 text-xs font-semibold mb-1">Applied</p>
                      <p className="text-sm text-gray-900">{app.appliedDate}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      app.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'reviewing'
                        ? 'bg-cyan-100 text-cyan-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition text-sm font-medium shadow-md">
                      Approve
                    </button>
                    <button className="px-3 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition text-sm font-medium shadow-md">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Tenant Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-8 py-8 flex justify-between items-start rounded-t-2xl">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Add New Tenant</h2>
                <p className="text-teal-100 text-sm">Fill in the details below to add a new tenant to your property</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <span className="text-teal-600 font-bold">👤</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="px-4 py-3 border-2 border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="px-4 py-3 border-2 border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-cyan-600 font-bold">🏠</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Property & Unit</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Property Name"
                    value={formData.property}
                    onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                    className="px-4 py-3 border-2 border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Unit Number (e.g., 2A)"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="px-4 py-3 border-2 border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-600 font-bold">💰</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Lease Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent (KES)</label>
                    <input
                      type="number"
                      placeholder="e.g., 15000"
                      value={formData.rent}
                      onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lease End Date</label>
                    <input
                      type="date"
                      value={formData.leaseEnd}
                      onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-8 border-t-2 border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTenant}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition font-semibold flex items-center justify-center gap-2 shadow-md"
              >
                <Plus size={20} /> Add Tenant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordTenants;
