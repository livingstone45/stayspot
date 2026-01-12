import React, { useState } from 'react';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

const TeamMemberCard = ({
  member,
  onEdit,
  onDelete,
  onAssignRole,
  onToggleActive,
  currentUserRole,
  showActions = true,
  variant = 'grid',
  loading = false,
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
  
  if (!member) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <UserCircleIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No member data available</p>
      </div>
    );
  }
  
  const {
    id,
    name,
    email,
    phone,
    role,
    department,
    joinDate,
    lastActive,
    isActive,
    avatar,
    assignedProperties = 0,
    completedTasks = 0,
    performanceScore = 0,
    permissions = [],
  } = member;
  
  // Role configuration
  const roleConfig = {
    system_admin: { label: 'System Admin', color: 'bg-red-100 text-red-800' },
    company_admin: { label: 'Company Admin', color: 'bg-purple-100 text-purple-800' },
    property_manager: { label: 'Property Manager', color: 'bg-blue-100 text-blue-800' },
    leasing_specialist: { label: 'Leasing Specialist', color: 'bg-green-100 text-green-800' },
    maintenance_supervisor: { label: 'Maintenance Supervisor', color: 'bg-orange-100 text-orange-800' },
    maintenance_tech: { label: 'Maintenance Tech', color: 'bg-yellow-100 text-yellow-800' },
    marketing_specialist: { label: 'Marketing Specialist', color: 'bg-pink-100 text-pink-800' },
    financial_controller: { label: 'Financial Controller', color: 'bg-indigo-100 text-indigo-800' },
    landlord: { label: 'Property Owner', color: 'bg-gray-100 text-gray-800' },
    tenant: { label: 'Tenant', color: 'bg-gray-100 text-gray-800' },
  };
  
  // Department configuration
  const departmentConfig = {
    operations: { label: 'Operations', color: 'bg-blue-50 text-blue-700' },
    leasing: { label: 'Leasing', color: 'bg-green-50 text-green-700' },
    maintenance: { label: 'Maintenance', color: 'bg-orange-50 text-orange-700' },
    marketing: { label: 'Marketing', color: 'bg-pink-50 text-pink-700' },
    finance: { label: 'Finance', color: 'bg-indigo-50 text-indigo-700' },
    admin: { label: 'Administration', color: 'bg-gray-50 text-gray-700' },
    owner: { label: 'Ownership', color: 'bg-purple-50 text-purple-700' },
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const formatLastActive = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d ago`;
    return formatDate(dateString);
  };
  
  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };
  
  const canEdit = ['system_admin', 'company_admin'].includes(currentUserRole);
  const canDelete = currentUserRole === 'system_admin';
  const canAssignRole = ['system_admin', 'company_admin'].includes(currentUserRole);
  const canToggleActive = ['system_admin', 'company_admin'].includes(currentUserRole);
  
  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit && canEdit) onEdit(member);
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete && canDelete) onDelete(member);
  };
  
  const handleToggleActive = (e) => {
    e.stopPropagation();
    if (onToggleActive && canToggleActive) onToggleActive(member, !isActive);
  };
  
  const cardClasses = `
    bg-white rounded-xl shadow-sm border transition-all duration-200 overflow-hidden
    ${variant === 'list' ? 'flex' : ''}
    ${isActive ? 'border-gray-200 hover:border-gray-300' : 'border-gray-100 bg-gray-50'}
    ${(onEdit || onDelete) ? 'cursor-pointer hover:shadow-md' : ''}
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
                alt={name}
                className={`${variant === 'list' ? 'h-16 w-16' : 'h-24 w-24'} rounded-full object-cover border-2 ${isActive ? 'border-blue-200' : 'border-gray-200'}`}
              />
            ) : (
              <div className={`${variant === 'list' ? 'h-16 w-16' : 'h-24 w-24'} rounded-full ${isActive ? 'bg-blue-100' : 'bg-gray-100'} flex items-center justify-center`}>
                <UserCircleIcon className={`${variant === 'list' ? 'h-12 w-12' : 'h-16 w-16'} ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
              </div>
            )}
          </div>
          
          <div className={`${variant === 'list' ? 'flex-1 min-w-0' : ''}`}>
            <div className={`flex ${variant === 'list' ? 'items-start justify-between' : 'flex-col items-center'}`}>
              <div className={`${variant === 'list' ? 'flex-1 min-w-0' : 'mb-2'}`}>
                <h3 className={`font-semibold text-gray-900 truncate ${variant === 'list' ? 'text-lg' : 'text-xl'}`}>
                  {name}
                </h3>
                <p className="text-sm text-gray-600 truncate">{email}</p>
              </div>
              
              {variant === 'list' && (
                <div className="flex items-center space-x-2 ml-4">
                  {isActive ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            
            {/* Role and Department */}
            <div className={`flex flex-wrap gap-2 ${variant === 'list' ? 'mt-3' : 'mt-4 justify-center'}`}>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleConfig[role]?.color || 'bg-gray-100 text-gray-800'}`}>
                {roleConfig[role]?.label || role}
              </span>
              
              {department && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${departmentConfig[department]?.color || 'bg-gray-100 text-gray-800'}`}>
                  {departmentConfig[department]?.label || department}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className={`${variant === 'list' ? 'mt-4' : 'mt-6'}`}>
          <div className="grid grid-cols-2 gap-3">
            {phone && (
              <div className="flex items-center text-sm text-gray-600">
                <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{phone}</span>
              </div>
            )}
            
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Joined {formatDate(joinDate)}</span>
            </div>
            
            {variant === 'list' && lastActive && (
              <div className="col-span-2 flex items-center text-sm text-gray-600">
                <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Last active: {formatLastActive(lastActive)}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className={`${variant === 'list' ? 'mt-6' : 'mt-6'} grid grid-cols-3 gap-4`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{assignedProperties}</div>
            <div className="text-xs text-gray-500">Properties</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{completedTasks}</div>
            <div className="text-xs text-gray-500">Tasks</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${getPerformanceColor(performanceScore).split(' ')[0]}`}>
              {performanceScore}%
            </div>
            <div className="text-xs text-gray-500">Performance</div>
          </div>
        </div>
        
        {/* Permissions Preview */}
        {permissions.length > 0 && variant === 'list' && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Key Permissions:</p>
            <div className="flex flex-wrap gap-1">
              {permissions.slice(0, 4).map((permission, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {permission}
                </span>
              ))}
              {permissions.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{permissions.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        {showActions && (canEdit || canDelete || canToggleActive) && (
          <div className={`${variant === 'list' ? 'mt-6' : 'mt-6'} pt-4 border-t border-gray-200`}>
            <div className="flex justify-between">
              <div className="flex space-x-2">
                {canEdit && onEdit && (
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                )}
                
                {canAssignRole && onAssignRole && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAssignRole(member);
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    Change Role
                  </button>
                )}
              </div>
              
              <div className="flex space-x-2">
                {canToggleActive && (
                  <button
                    onClick={handleToggleActive}
                    className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                        : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <XCircleIcon className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </button>
                )}
                
                {canDelete && onDelete && (
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center p-2 border border-transparent text-sm font-medium rounded-lg text-red-700 hover:bg-red-50 transition-colors"
                    title="Delete member"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
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
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-700">Active</span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 bg-gray-400 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Inactive</span>
                </>
              )}
            </div>
            
            <span className="text-xs text-gray-500">
              {lastActive ? formatLastActive(lastActive) : 'Never active'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// List view variant
export const TeamMemberListCard = (props) => (
  <TeamMemberCard variant="list" {...props} />
);

// Compact card for dashboards
export const TeamMemberCompactCard = ({ member, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
  >
    <div className="flex items-center">
      {member.avatar ? (
        <img
          src={member.avatar}
          alt={member.name}
          className="h-10 w-10 rounded-full object-cover mr-3"
        />
      ) : (
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
          <UserCircleIcon className="h-6 w-6 text-blue-400" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{member.name}</h4>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 truncate mr-3">{member.role}</span>
          {member.isActive ? (
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          ) : (
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Invitation card
export const InvitationCard = ({ invitation, onResend, onCancel, onAccept, currentUserRole }) => {
  const {
    id,
    email,
    invitedBy,
    role,
    status,
    sentAt,
    expiresAt,
    properties,
  } = invitation;
  
  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800' },
    expired: { label: 'Expired', color: 'bg-red-100 text-red-800' },
    cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const canResend = ['system_admin', 'company_admin'].includes(currentUserRole) && status === 'pending';
  const canCancel = ['system_admin', 'company_admin'].includes(currentUserRole) && ['pending', 'accepted'].includes(status);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{email}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Invited by {invitedBy} • {formatDate(sentAt)}
          </p>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[status]?.color || 'bg-gray-100 text-gray-800'}`}>
          {statusConfig[status]?.label || status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Role</p>
          <p className="font-medium">{role}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Expires</p>
          <p className="font-medium">{formatDate(expiresAt)}</p>
        </div>
      </div>
      
      {properties && properties.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Assigned Properties</p>
          <div className="flex flex-wrap gap-2">
            {properties.slice(0, 3).map((property, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
              >
                {property}
              </span>
            ))}
            {properties.length > 3 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                +{properties.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
      
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          {canResend && onResend && (
            <button
              onClick={() => onResend(invitation)}
              className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Resend Invitation
            </button>
          )}
          
          {canCancel && onCancel && (
            <button
              onClick={() => onCancel(invitation)}
              className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700"
            >
              Cancel Invitation
            </button>
          )}
        </div>
        
        {onAccept && status === 'pending' && (
          <button
            onClick={() => onAccept(invitation)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Accept Invitation
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;