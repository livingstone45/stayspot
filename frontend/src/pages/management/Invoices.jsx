import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Eye, FileText, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import InvoiceCard from '../../components/financial/InvoiceCard';

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewInvoice, setShowNewInvoice] = useState(false);

  // Sample invoice data
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNumber: 'INV-2024-001',
      status: 'paid',
      description: 'Monthly Rent - January 2024',
      issueDate: '2024-01-01',
      dueDate: '2024-01-15',
      clientName: 'John Doe',
      clientEmail: 'john@example.com',
      clientPhone: '(555) 123-4567',
      clientAddress: '123 Main St, Apt 101',
      propertyName: 'Downtown Apartments',
      unitNumber: 'Unit 101',
      propertyAddress: '123 Main St, City, State',
      subtotal: 1500,
      tax: 0,
      taxRate: 0,
      discount: 0,
      total: 1500,
      balance: 0,
      paymentDate: '2024-01-10',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN-2024-001',
      createdDate: '2024-01-01',
      updatedDate: '2024-01-10',
      sentDate: '2024-01-01',
      items: [{ description: 'Monthly Rent', quantity: 1, unitPrice: 1500, amount: 1500, details: 'January 2024' }],
      notes: 'Thank you for your payment.'
    },
    {
      id: 2,
      invoiceNumber: 'INV-2024-002',
      status: 'pending',
      description: 'Monthly Rent - February 2024',
      issueDate: '2024-02-01',
      dueDate: '2024-02-15',
      clientName: 'Jane Smith',
      clientEmail: 'jane@example.com',
      clientPhone: '(555) 234-5678',
      clientAddress: '456 Oak Ave, Apt 202',
      propertyName: 'Riverside Complex',
      unitNumber: 'Unit 202',
      propertyAddress: '456 Oak Ave, City, State',
      subtotal: 1800,
      tax: 144,
      taxRate: 8,
      discount: 0,
      total: 1944,
      balance: 1944,
      paymentDate: null,
      paymentMethod: null,
      transactionId: null,
      createdDate: '2024-02-01',
      updatedDate: null,
      sentDate: '2024-02-01',
      items: [{ description: 'Monthly Rent', quantity: 1, unitPrice: 1800, amount: 1800, details: 'February 2024' }],
      notes: 'Payment due by February 15, 2024.'
    },
    {
      id: 3,
      invoiceNumber: 'INV-2024-003',
      status: 'overdue',
      description: 'Monthly Rent - December 2023',
      issueDate: '2023-12-01',
      dueDate: '2023-12-15',
      clientName: 'Mike Johnson',
      clientEmail: 'mike@example.com',
      clientPhone: '(555) 345-6789',
      clientAddress: '789 Pine Rd, Apt 303',
      propertyName: 'Hillside Residences',
      unitNumber: 'Unit 303',
      propertyAddress: '789 Pine Rd, City, State',
      subtotal: 1600,
      tax: 128,
      taxRate: 8,
      discount: 0,
      total: 1728,
      balance: 1728,
      paymentDate: null,
      paymentMethod: null,
      transactionId: null,
      createdDate: '2023-12-01',
      updatedDate: null,
      sentDate: '2023-12-01',
      items: [{ description: 'Monthly Rent', quantity: 1, unitPrice: 1600, amount: 1600, details: 'December 2023' }],
      notes: 'URGENT: Payment overdue. Please remit immediately.'
    },
    {
      id: 4,
      invoiceNumber: 'INV-2024-004',
      status: 'draft',
      description: 'Maintenance Services - March 2024',
      issueDate: '2024-03-01',
      dueDate: '2024-03-20',
      clientName: 'Sarah Williams',
      clientEmail: 'sarah@example.com',
      clientPhone: '(555) 456-7890',
      clientAddress: '321 Elm St, Apt 404',
      propertyName: 'Garden Plaza',
      unitNumber: 'Unit 404',
      propertyAddress: '321 Elm St, City, State',
      subtotal: 500,
      tax: 40,
      taxRate: 8,
      discount: 50,
      total: 490,
      balance: 490,
      paymentDate: null,
      paymentMethod: null,
      transactionId: null,
      createdDate: '2024-03-01',
      updatedDate: null,
      sentDate: null,
      items: [
        { description: 'HVAC Maintenance', quantity: 1, unitPrice: 300, amount: 300, details: 'Annual service' },
        { description: 'Plumbing Repair', quantity: 1, unitPrice: 200, amount: 200, details: 'Leak repair' }
      ],
      notes: 'Draft invoice - pending approval.'
    }
  ]);

  const stats = [
    {
      label: 'Total Invoices',
      value: invoices.length,
      icon: FileText,
      color: 'blue'
    },
    {
      label: 'Total Revenue',
      value: `$${invoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Pending',
      value: invoices.filter(inv => inv.status === 'pending').length,
      icon: AlertCircle,
      color: 'yellow'
    },
    {
      label: 'Overdue',
      value: invoices.filter(inv => inv.status === 'overdue').length,
      icon: TrendingUp,
      color: 'red'
    }
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleView = (id) => {
    console.log('View invoice:', id);
  };

  const handleDownload = (id) => {
    console.log('Download invoice:', id);
  };

  const handlePrint = (id) => {
    console.log('Print invoice:', id);
  };

  const handleSend = (id) => {
    console.log('Send invoice:', id);
  };

  const handleMarkPaid = (id) => {
    setInvoices(invoices.map(inv => 
      inv.id === id ? { ...inv, status: 'paid', paymentDate: new Date().toISOString().split('T')[0], balance: 0 } : inv
    ));
  };

  const handleArchive = (id) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track all invoices</p>
          </div>
          <button
            onClick={() => setShowNewInvoice(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="h-5 w-5" />
            New Invoice
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
              green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
              yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
              red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            };
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by invoice #, client, or property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Export */}
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map(invoice => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              onView={handleView}
              onDownload={handleDownload}
              onPrint={handlePrint}
              onSend={handleSend}
              onMarkPaid={handleMarkPaid}
              onArchive={handleArchive}
            />
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No invoices found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
