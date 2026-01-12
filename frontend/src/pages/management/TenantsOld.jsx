import React, { useState } from 'react';
import { Search, Filter, Plus, Mail, Phone, MapPin, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

const Tenants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const tenants = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      property: 'Apartment 101',
      leaseStart: '2023-01-15',
      leaseEnd: '2024-01-14',
      status: 'active',
      rentPaid: true,
      moveInDate: '2023-01-15'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 234-5678',
      property: 'Apartment 202',
      leaseStart: '2023-06-01',
      leaseEnd: '2024-05-31',
      status: 'active',
      rentPaid: false,
      moveInDate: '2023-06-01'
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+1 (555) 345-6789',
      property: 'Apartment 303',
      leaseStart: '2022-03-10',
      leaseEnd: '2024-03-09',
      status: 'renewal',
      rentPaid: true,
      moveInDate: '2022-03-10'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+1 (555) 456-7890',
      property: 'Apartment 104',
      leaseStart: '2023-09-01',
      leaseEnd: '2024-08-31',
      status: 'active',
      rentPaid: true,
      moveInDate: '2023-09-01'
    }
  ];

  const filtered = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || tenant.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'renewal': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tenants</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all your tenants</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Tenant
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="renewal">Renewal</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Tenants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(tenant => (
            <div key={tenant.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tenant.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{tenant.property}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tenant.status)}`}>
                  {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  {tenant.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4" />
                  {tenant.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  {new Date(tenant.leaseEnd).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                {tenant.rentPaid ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {tenant.rentPaid ? 'Rent Paid' : 'Rent Pending'}
                </span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-sm font-medium">
                  View Details
                </button>
                <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium">
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No tenants found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tenants;
