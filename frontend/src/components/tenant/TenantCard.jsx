import React, { useState } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

const TenantCard = ({
  tenant,
  onView,
  onEdit,
  onDelete,
  onMessage,
  onLeaseView,
  onPayment,
  showActions = true,
  variant = 'grid',
  loading = false,
  currentUserRole,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="flex items-start">
          <div className="h-16 w-16 bg-gray-200 rounded-full mr-4"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!tenant) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No tenant data available</p>
      </div>
    );
  }
  
  const {
    id,
    firstName,
    lastName,
    email,
    phone,
    avatar,
    lease,
    property,
    moveInDate,
    moveOutDate,
    rentAmount,
    securityDeposit,
    paymentStatus,
    leaseStatus,
    notes,
    emergencyContact,
    pets = [],
    vehicles = [],
    isActive,
    lastPaymentDate,
    nextPaymentDate,
    balance,
  } = tenant;
  
  const fullName = `${firstName} ${lastName}`;
  const propertyName = property?.title || 'Unknown Property';
  const unitNumber = lease?.unitNumber || 'N/A';
  const leaseEndDate = lease?.endDate || moveOutDate;
  
  // Status configuration
  const statusConfig = {
    active: { label: 'Active', color: 'bg-green-100 text-green-800' },
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    inactive: { label: 'Inactive', color: 'bg-red-100 text-red-800' },
    evicted: { label: 'Evicted', color: 'bg-gray-100 text-gray-800' },
    transferred: { label: 'Transferred', color: 'bg-blue-100 text-blue-800' },
  };
  
  const paymentStatusConfig = {
    paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    overdue: { label: 'Overdue', color: 'bg-red-100 text-red-800' },
    partial: { label: 'Partial', color: 'bg-blue-100 text-blue-800' },
  };
  
  const leaseStatusConfig = {
    active: { label: 'Active', color: 'bg-green-100 text-green-800' },
    expired: { label: 'Expired', color: 'bg-red-100 text-red-800' },
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    terminated: { label: 'Terminated', color: 'bg-gray-100 text-gray-800' },
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const getDaysUntilPayment = () => {
    if (!nextPaymentDate) return null;
    const today = new Date();
    const paymentDate = new Date(nextPaymentDate);
    const diffTime = paymentDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const canEdit = ['system_admin', 'company_admin', 'property_manager'].includes(currentUserRole);
  const canDelete = ['system_admin', 'company_admin'].includes(currentUserRole);
  const canMessage = ['system_admin', 'company_admin', 'property_manager', 'leasing_specialist'].includes(currentUserRole);
  
  const handleView = (e) => {
    e.stopPropagation();
    if (onView) onView(tenant);
  };
  
  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit && canEdit) onEdit(tenant);
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete && canDelete) onDelete(tenant);
  };
  
  const handleMessage = (e) => {
    e.stopPropagation();
    if (onMessage && canMessage) onMessage(tenant);
  };
  
  const handleLeaseView = (e) => {
    e.stopPropagation();
    if (onLeaseView) onLeaseView(tenant);
  };
  
  const handlePayment = (e) => {
    e.stopPropagation();
    if (onPayment) onPayment(tenant);
  };
  
  const cardClasses = `
    bg-white rounded-xl shadow-sm border transition-all duration-200 overflow-hidden
    ${variant === 'list' ? 'flex' : ''}
    ${isActive ? 'border-gray-200 hover:border-gray-300' : 'border-gray-100 bg-gray-50'}
    ${(onView || onEdit) ? 'cursor-pointer hover:shadow-md' : ''}
  `;
  
  return (
    <div
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`p-6 ${variant === 'list' ? 'flex items-start flex-1' : ''}`}>
        {/* Avatar and Basic Info */}
        <div className={`flex ${variant === 'list' ? 'items-start flex-1' : 'flex-col items-center text-center mb-4'}`}>
          <div className={`${variant === 'list' ? 'mr-4' : 'mb-4'}`}>
            {avatar ? (
              <img
                src={avatar}
                alt={fullName}
                className={`${variant === 'list' ? 'h-16 w-16' : 'h-24 w-24'} rounded-full object-cover border-2 ${isActive ? 'border-blue-200' : 'border-gray-200'}`}
              />
            ) : (
              <div className={`${variant === 'list' ? 'h-16 w-16' : 'h-24 w-24'} rounded-full ${isActive ? 'bg-blue-100' : 'bg-gray-100'} flex items-center justify-center`}>
                <UserIcon className={`${variant === 'list' ? 'h-12 w-12' : 'h-16 w-16'} ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
              </div>
            )}
          </div>
          
          <div className={`${variant === 'list' ? 'flex-1 min-w-0' : ''}`}>
            <div className={`flex ${variant === 'list' ? 'items-start justify-between' : 'flex-col items-center'}`}>
              <div className={`${variant === 'list' ? 'flex-1 min-w-0' : 'mb-2'}`}>
                <h3 className={`font-semibold text-gray-900 truncate ${variant === 'list' ? 'text-lg' : 'text-xl'}`}>
                  {fullName}
                </h3>
                <p className="text-sm text-gray-600 truncate">{email}</p>
              </div>
              
              {variant === 'list' && (
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[tenant.status || (isActive ? 'active' : 'inactive')]?.color}`}>
                    {statusConfig[tenant.status || (isActive ? 'active' : 'inactive')]?.label}
                  </span>
                </div>
              )}
            </div>
            
            {/* Contact Info */}
            <div className={`${variant === 'list' ? 'mt-3' : 'mt-4'}`}>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{phone || 'No phone'}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <HomeIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{propertyName} • Unit {unitNumber}</span>
              </div>
            </div>
            
            {/* Status Badges */}
            {variant !== 'list' && (
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[tenant.status || (isActive ? 'active' : 'inactive')]?.color}`}>
                  {statusConfig[tenant.status || (isActive ? 'active' : 'inactive')]?.label}
                </span>
                
                {paymentStatus && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStatusConfig[paymentStatus]?.color}`}>
                    {paymentStatusConfig[paymentStatus]?.label}
                  </span>
                )}
                
                {leaseStatus && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${leaseStatusConfig[leaseStatus]?.color}`}>
                    {leaseStatusConfig[leaseStatus]?.label}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Financial Information */}
        <div className={`${variant === 'list' ? 'mt-4' : 'mt-6'} grid grid-cols-2 gap-4`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(rentAmount)}</div>
            <div className="text-xs text-gray-500">Monthly Rent</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              balance > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {formatCurrency(balance || 0)}
            </div>
            <div className="text-xs text-gray-500">Balance</div>
          </div>
        </div>
        
        {/* Lease Dates */}
        <div className={`${variant === 'list' ? 'mt-4' : 'mt-6'}`}>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center text-sm text-gray-600 mb-1">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>Move In</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {formatDate(moveInDate)}
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center text-sm text-gray-600 mb-1">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>Lease End</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {formatDate(leaseEndDate)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Next Payment */}
        {nextPaymentDate && (
          <div className={`${variant === 'list' ? 'mt-4' : 'mt-6'} p-3 bg-blue-50 rounded-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Next Payment</p>
                <p className="text-xs text-blue-700">{formatDate(nextPaymentDate)}</p>
              </div>
              
              {getDaysUntilPayment() !== null && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  getDaysUntilPayment() <= 0
                    ? 'bg-red-100 text-red-800'
                    : getDaysUntilPayment() <= 7
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {getDaysUntilPayment() <= 0
                    ? 'Due now'
                    : `${getDaysUntilPayment()} day${getDaysUntilPayment() !== 1 ? 's' : ''}`}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Pets & Vehicles */}
        {(pets.length > 0 || vehicles.length > 0) && variant === 'list' && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {pets.length > 0 && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  🐾 {pets.length} pet{pets.length !== 1 ? 's' : ''}
                </span>
              )}
              
              {vehicles.length > 0 && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                  🚗 {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        {showActions && (
          <div className={`${variant === 'list' ? 'mt-6' : 'mt-6'} pt-4 border-t border-gray-200`}>
            <div className="flex justify-between">
              <div className="flex space-x-2">
                {onView && (
                  <button
                    onClick={handleView}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    View
                  </button>
                )}
                
                {canMessage && onMessage && (
                  <button
                    onClick={handleMessage}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                    Message
                  </button>
                )}
              </div>
              
              <div className="flex space-x-2">
                {canEdit && onEdit && (
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center p-2 border border-transparent text-sm font-medium rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
                    title="Edit tenant"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                )}
                
                {canDelete && onDelete && (
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center p-2 border border-transparent text-sm font-medium rounded-lg text-red-700 hover:bg-red-50 transition-colors"
                    title="Delete tenant"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Quick Actions Row */}
            <div className="mt-3 flex justify-between">
              {onLeaseView && (
                <button
                  onClick={handleLeaseView}
                  className="text-xs font-medium text-gray-600 hover:text-gray-900"
                >
                  <DocumentTextIcon className="h-3 w-3 inline mr-1" />
                  View Lease
                </button>
              )}
              
              {onPayment && (
                <button
                  onClick={handlePayment}
                  className="text-xs font-medium text-green-600 hover:text-green-900"
                >
                  <CurrencyDollarIcon className="h-3 w-3 inline mr-1" />
                  Record Payment
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Status Indicator */}
      {variant !== 'list' && (
        <div className={`px-4 py-2 ${isActive ? 'bg-green-50' : 'bg-gray-100'} border-t border-gray-200`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isActive ? (
                <>
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-green-700">Active Tenant</span>
                </>
              ) : (
                <>
                  <XCircleIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Inactive</span>
                </>
              )}
            </div>
            
            <span className="text-xs text-gray-500">
              {lastPaymentDate ? `Last paid: ${formatDate(lastPaymentDate)}` : 'No payments'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// List view variant
export const TenantListCard = (props) => (
  <TenantCard variant="list" {...props} />
);

// Compact card for dashboards
export const TenantCompactCard = ({ tenant, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
  >
    <div className="flex items-center">
      {tenant.avatar ? (
        <img
          src={tenant.avatar}
          alt={tenant.firstName}
          className="h-10 w-10 rounded-full object-cover mr-3"
        />
      ) : (
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
          <UserIcon className="h-6 w-6 text-blue-400" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">
          {tenant.firstName} {tenant.lastName}
        </h4>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 truncate mr-3">
            {tenant.property?.title || 'No property'}
          </span>
          {tenant.isActive ? (
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          ) : (
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
          )}
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900">
          ${tenant.rentAmount || 0}
        </div>
        <div className="text-xs text-gray-500">/month</div>
      </div>
    </div>
  </div>
);

export default TenantCard;