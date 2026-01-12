import React, { useState } from 'react';
import {
  FileText, DollarSign, Calendar, User,
  Building, Download, Printer, Eye,
  Mail, CheckCircle, Clock, AlertCircle,
  MoreVertical, Copy, Share, Archive,
  ChevronDown, ExternalLink, CreditCard
} from 'lucide-react';

const InvoiceCard = ({ invoice, onView, onDownload, onPrint, onSend, onMarkPaid, onArchive }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'paid': { color: 'green', icon: CheckCircle, text: 'Paid' },
      'pending': { color: 'yellow', icon: Clock, text: 'Pending' },
      'overdue': { color: 'red', icon: AlertCircle, text: 'Overdue' },
      'draft': { color: 'gray', icon: FileText, text: 'Draft' },
      'cancelled': { color: 'gray', icon: AlertCircle, text: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig['draft'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getDueDateStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 3) return 'due-soon';
    return 'future';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900">Invoice #{invoice.invoiceNumber}</h3>
                {getStatusBadge(invoice.status)}
                {invoice.status === 'pending' && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    getDueDateStatus(invoice.dueDate) === 'overdue' ? 'bg-red-100 text-red-800' :
                    getDueDateStatus(invoice.dueDate) === 'due-soon' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {calculateDaysUntilDue(invoice.dueDate) < 0 
                      ? `${Math.abs(calculateDaysUntilDue(invoice.dueDate))} days overdue`
                      : `Due in ${calculateDaysUntilDue(invoice.dueDate)} days`
                    }
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-1">{invoice.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>Issued: {invoice.issueDate}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>Due: {invoice.dueDate}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onView && onView(invoice.id);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Invoice</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDownload && onDownload(invoice.id);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onPrint && onPrint(invoice.id);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onSend && onSend(invoice.id);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send to Client</span>
                </button>
                {invoice.status === 'pending' && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onMarkPaid && onMarkPaid(invoice.id);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark as Paid</span>
                  </button>
                )}
                <div className="border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onArchive && onArchive(invoice.id);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Archive className="w-4 h-4" />
                    <span>Archive</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Client Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500 flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>Bill To</span>
            </h4>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">{invoice.clientName}</p>
              <p className="text-sm text-gray-600">{invoice.clientEmail}</p>
              <p className="text-sm text-gray-600">{invoice.clientPhone}</p>
              <p className="text-xs text-gray-500">{invoice.clientAddress}</p>
            </div>
          </div>

          {/* Property Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500 flex items-center space-x-1">
              <Building className="w-4 h-4" />
              <span>Property</span>
            </h4>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">{invoice.propertyName}</p>
              <p className="text-sm text-gray-600">{invoice.unitNumber}</p>
              <p className="text-xs text-gray-500">{invoice.propertyAddress}</p>
            </div>
          </div>

          {/* Amount Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500 flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>Amount</span>
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tax ({invoice.taxRate}%):</span>
                  <span className="font-medium">{formatCurrency(invoice.tax)}</span>
                </div>
              )}
              {invoice.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Discount:</span>
                  <span className="font-medium text-green-600">-{formatCurrency(invoice.discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-gray-900">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500 flex items-center space-x-1">
              <CreditCard className="w-4 h-4" />
              <span>Payment</span>
            </h4>
            <div className="space-y-3">
              {invoice.paymentDate ? (
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Paid on:</span>
                    <span className="text-sm font-medium text-green-600">{invoice.paymentDate}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Method: {invoice.paymentMethod}</span>
                    {invoice.transactionId && (
                      <p className="text-xs text-gray-500 mt-1">Transaction: {invoice.transactionId}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Awaiting payment</p>
                  {getDueDateStatus(invoice.dueDate) === 'overdue' && (
                    <p className="text-xs text-red-600 font-medium">Payment overdue</p>
                  )}
                </div>
              )}
              {invoice.balance > 0 && (
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Balance Due:</span>
                    <span className="font-medium text-red-600">{formatCurrency(invoice.balance)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Summary (Collapsible) */}
        <div className="mt-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            <span className="font-medium text-gray-900">Invoice Items</span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showDetails ? 'transform rotate-180' : ''}`} />
          </button>
          
          {showDetails && (
            <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <p className="font-medium">{item.description}</p>
                          {item.details && (
                            <p className="text-xs text-gray-500 mt-1">{item.details}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      Subtotal
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.subtotal)}
                    </td>
                  </tr>
                  {invoice.tax > 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Tax ({invoice.taxRate}%)
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.tax)}
                      </td>
                    </tr>
                  )}
                  {invoice.discount > 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Discount
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-green-600">
                        -{formatCurrency(invoice.discount)}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right text-lg font-bold text-gray-900">
                      Total
                    </td>
                    <td className="px-6 py-4 text-lg font-bold text-gray-900">
                      {formatCurrency(invoice.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Notes</h4>
            <p className="text-sm text-gray-600">{invoice.notes}</p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Created: {invoice.createdDate}</span>
              {invoice.updatedDate && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-600">
                    Updated: {invoice.updatedDate}
                  </span>
                </>
              )}
            </div>
            {invoice.sentDate && (
              <>
                <span className="text-gray-300">•</span>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Mail className="w-3 h-3" />
                  <span>Sent: {invoice.sentDate}</span>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {/* Quick Actions */}
            <button
              onClick={() => onView && onView(invoice.id)}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="View Details"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDownload && onDownload(invoice.id)}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => onPrint && onPrint(invoice.id)}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="Print"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={() => onSend && onSend(invoice.id)}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="Send to Client"
            >
              <Mail className="w-5 h-5" />
            </button>
            
            {/* Payment Button for Pending Invoices */}
            {invoice.status === 'pending' && (
              <button
                onClick={() => onMarkPaid && onMarkPaid(invoice.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark as Paid</span>
              </button>
            )}
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(invoice.invoiceNumber);
                // Show toast notification
              }}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="Copy Invoice Number"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;