import React, { useState } from 'react';
import { 
  Building, Phone, Mail, MapPin, Star, 
  DollarSign, Clock, CheckCircle, AlertCircle,
  Wrench, User, ExternalLink, MessageSquare,
  MoreVertical, Edit, Trash2, Eye
} from 'lucide-react';

const VendorCard = ({ vendor, onViewDetails, onEdit, onDelete, onMessage, onAssignWork }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 text-yellow-400 fill-current" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { color: 'green', icon: CheckCircle, text: 'Active' },
      'inactive': { color: 'gray', icon: Clock, text: 'Inactive' },
      'pending': { color: 'yellow', icon: Clock, text: 'Pending' },
      'suspended': { color: 'red', icon: AlertCircle, text: 'Suspended' }
    };

    const config = statusConfig[status] || statusConfig['inactive'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                {getStatusBadge(vendor.status)}
              </div>
              <p className="text-gray-600 mt-1">{vendor.serviceType}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  {getRatingStars(vendor.rating)}
                  <span className="text-sm text-gray-600 ml-1">
                    {vendor.rating.toFixed(1)} ({vendor.reviewCount} reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-500">•</span>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">{vendor.completedJobs} jobs</span>
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
                    onViewDetails && onViewDetails(vendor.id);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit && onEdit(vendor.id);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Vendor</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onAssignWork && onAssignWork(vendor.id);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Assign Work</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onMessage && onMessage(vendor.id);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
                <div className="border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete && onDelete(vendor.id);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Vendor</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500 flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>Contact Person</span>
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{vendor.contactPerson}</p>
                  <p className="text-sm text-gray-600">{vendor.contactPosition}</p>
                </div>
              </div>
              <div className="space-y-2">
                <a 
                  href={`tel:${vendor.phone}`}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <Phone className="w-4 h-4" />
                  <span>{vendor.phone}</span>
                </a>
                <a 
                  href={`mailto:${vendor.email}`}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <Mail className="w-4 h-4" />
                  <span>{vendor.email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500 flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>Location</span>
            </h4>
            <div className="space-y-2">
              <p className="text-gray-900">{vendor.address}</p>
              <p className="text-sm text-gray-600">{vendor.city}, {vendor.state} {vendor.zipCode}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Service Area: {vendor.serviceArea} miles</span>
                <span>•</span>
                <span>Response Time: {vendor.responseTime}</span>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500 flex items-center space-x-1">
              <Wrench className="w-4 h-4" />
              <span>Service Details</span>
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Hourly Rate:</span>
                <span className="font-medium">${vendor.hourlyRate}/hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Minimum Charge:</span>
                <span className="font-medium">${vendor.minimumCharge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Insurance:</span>
                <span className={`font-medium ${vendor.insurance ? 'text-green-600' : 'text-red-600'}`}>
                  {vendor.insurance ? 'Covered' : 'Not Covered'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">License:</span>
                <span className={`font-medium ${vendor.license ? 'text-green-600' : 'text-yellow-600'}`}>
                  {vendor.license ? vendor.license : 'Not Provided'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Specializations */}
        {vendor.specializations && vendor.specializations.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Specializations</h4>
            <div className="flex flex-wrap gap-2">
              {vendor.specializations.map((specialization, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg"
                >
                  {specialization}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-4">Performance Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{vendor.completionRate}%</p>
              <p className="text-xs text-gray-600">On-time Completion</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{vendor.averageRating.toFixed(1)}</p>
              <p className="text-xs text-gray-600">Average Rating</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{vendor.activeJobs}</p>
              <p className="text-xs text-gray-600">Active Jobs</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">${vendor.totalSpent}</p>
              <p className="text-xs text-gray-600">Total Spent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Added: {vendor.createdAt}
            </span>
            {vendor.lastJobDate && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-600">
                  Last Job: {vendor.lastJobDate}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onMessage && onMessage(vendor.id)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Message</span>
            </button>
            <button
              onClick={() => onAssignWork && onAssignWork(vendor.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Wrench className="w-4 h-4" />
              <span>Assign Work</span>
            </button>
            <button
              onClick={() => onViewDetails && onViewDetails(vendor.id)}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="View Details"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;