import React from 'react';
import { 
  Wrench, Clock, CheckCircle, AlertCircle, 
  User, MapPin, Calendar, MessageSquare,
  ChevronRight, Phone, Mail, ExternalLink
} from 'lucide-react';

const MaintenanceCard = ({ request, onViewDetails, onAssign, onUpdateStatus, onMessage }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency': return 'bg-red-100 text-red-800 border border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <Wrench className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900">{request.title || request.type}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)} flex items-center space-x-1`}>
                {getStatusIcon(request.status)}
                <span className="capitalize">{request.status.replace('-', ' ')}</span>
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(request.priority)}`}>
                {request.priority} priority
              </span>
            </div>
            <p className="mt-2 text-gray-600">{request.description}</p>
          </div>
          <button
            onClick={() => onViewDetails && onViewDetails(request.id)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Property Info */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>Property</span>
            </h4>
            <p className="font-medium text-gray-900">{request.propertyName}</p>
            <p className="text-sm text-gray-600">{request.unit}</p>
            <p className="text-xs text-gray-500 mt-1">{request.propertyAddress}</p>
          </div>

          {/* Tenant Info */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>Requested By</span>
            </h4>
            <p className="font-medium text-gray-900">{request.tenantName}</p>
            <div className="flex items-center space-x-2 mt-1">
              <a 
                href={`tel:${request.tenantPhone}`}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <Phone className="w-3 h-3" />
                <span>{request.tenantPhone}</span>
              </a>
              <a 
                href={`mailto:${request.tenantEmail}`}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <Mail className="w-3 h-3" />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Dates</span>
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Requested:</span>
                <span className="text-sm font-medium">{request.requestDate}</span>
              </div>
              {request.scheduledDate && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Scheduled:</span>
                  <span className="text-sm font-medium">{request.scheduledDate}</span>
                </div>
              )}
              {request.completedDate && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed:</span>
                  <span className="text-sm font-medium">{request.completedDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>Assigned To</span>
            </h4>
            {request.assignedTo ? (
              <div>
                <p className="font-medium text-gray-900">{request.assignedTo.name}</p>
                <p className="text-sm text-gray-600">{request.assignedTo.role}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <a 
                    href={`tel:${request.assignedTo.phone}`}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                  <button
                    onClick={() => onMessage && onMessage(request.assignedTo.id)}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Not assigned</p>
                <button
                  onClick={() => onAssign && onAssign(request.id)}
                  className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Assign Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Categories and Tags */}
        {(request.categories || request.tags) && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {request.categories?.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                >
                  {category}
                </span>
              ))}
              {request.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Photos */}
        {request.photos && request.photos.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Photos</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {request.photos.slice(0, 4).map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <img
                    src={photo.thumbnail || photo.url}
                    alt={`Maintenance photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 3 && request.photos.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-medium">
                        +{request.photos.length - 4} more
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cost Estimate */}
        {request.costEstimate && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Cost Estimate</h4>
                <p className="text-2xl font-bold text-gray-900">${request.costEstimate}</p>
                {request.approvedBy && (
                  <p className="text-sm text-gray-600 mt-1">
                    Approved by {request.approvedBy} on {request.approvedDate}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {!request.costApproved && (
                  <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                    Approve Cost
                  </button>
                )}
                <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                  View Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">ID: {request.id}</span>
            {request.updatedAt && (
              <span className="text-sm text-gray-500">
                Updated: {request.updatedAt}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {request.status === 'pending' && (
              <>
                <button
                  onClick={() => onUpdateStatus && onUpdateStatus(request.id, 'in-progress')}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  Start Work
                </button>
                <button
                  onClick={() => onUpdateStatus && onUpdateStatus(request.id, 'cancelled')}
                  className="px-3 py-1.5 border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50"
                >
                  Cancel
                </button>
              </>
            )}
            {request.status === 'in-progress' && (
              <>
                <button
                  onClick={() => onUpdateStatus && onUpdateStatus(request.id, 'completed')}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                >
                  Mark Complete
                </button>
                <button
                  onClick={() => onMessage && onMessage(request.tenantId)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center space-x-1"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message Tenant</span>
                </button>
              </>
            )}
            <button
              onClick={() => onViewDetails && onViewDetails(request.id)}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center space-x-1"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCard;