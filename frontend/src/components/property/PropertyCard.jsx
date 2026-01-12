import React, { useState } from 'react';
import {
  HomeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserIcon,
  StarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const PropertyCard = ({
  property,
  onView,
  onEdit,
  onDelete,
  onSelect,
  selected = false,
  showActions = true,
  showStatus = true,
  showMetrics = true,
  variant = 'grid',
  loading = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(property?.isFavorite || false);
  const [imageError, setImageError] = useState(false);

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${variant === 'grid' ? '' : 'flex'}`}>
        <div className={`${variant === 'grid' ? 'h-48' : 'w-64'} bg-gray-200 animate-pulse`}></div>
        <div className="p-6 flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
          <div className="flex space-x-4">
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <HomeIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No property data available</p>
      </div>
    );
  }

  const {
    id,
    title,
    address,
    city,
    state,
    zipCode,
    propertyType,
    status,
    price,
    bedrooms,
    bathrooms,
    squareFeet,
    images = [],
    occupancyRate,
    revenue,
    lastUpdated,
    isActive,
    tags = [],
  } = property;

  // Status configuration
  const statusConfig = {
    vacant: { label: 'Vacant', color: 'bg-red-100 text-red-800' },
    occupied: { label: 'Occupied', color: 'bg-green-100 text-green-800' },
    maintenance: { label: 'Maintenance', color: 'bg-orange-100 text-orange-800' },
    listed: { label: 'Listed', color: 'bg-blue-100 text-blue-800' },
    unlisted: { label: 'Unlisted', color: 'bg-gray-100 text-gray-800' },
    sold: { label: 'Sold', color: 'bg-purple-100 text-purple-800' },
  };

  // Property type icons
  const propertyTypeIcons = {
    apartment: '🏢',
    house: '🏠',
    condo: '🏘️',
    townhouse: '🏡',
    commercial: '🏢',
    vacation: '🏖️',
    bnb: '🛌',
    default: '🏠',
  };

  const mainImage = images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  
  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // TODO: API call to update favorite status
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleCardClick = (e) => {
    if (onSelect) {
      onSelect(property, !selected);
    } else if (onView) {
      onView(property);
    }
  };

  const cardClasses = `
    bg-white rounded-xl shadow-sm border transition-all duration-200 overflow-hidden
    ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}
    ${onSelect || onView ? 'cursor-pointer hover:shadow-md' : ''}
    ${variant === 'list' ? 'flex' : ''}
  `;

  return (
    <div className={cardClasses} onClick={handleCardClick}>
      {/* Image section */}
      <div className={`relative ${variant === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
        <div className={`${variant === 'list' ? 'h-full' : 'h-48'} relative overflow-hidden`}>
          {imageError ? (
            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
              <HomeIcon className="h-12 w-12 text-gray-400" />
            </div>
          ) : (
            <img
              src={mainImage}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              onError={() => setImageError(true)}
            />
          )}
          
          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? (
              <StarIconSolid className="h-5 w-5 text-yellow-500" />
            ) : (
              <StarIcon className="h-5 w-5 text-gray-400 hover:text-yellow-500" />
            )}
          </button>
          
          {/* Status badge */}
          {showStatus && status && (
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusConfig[status]?.color || statusConfig.vacant.color}`}>
                {statusConfig[status]?.label || status}
              </span>
            </div>
          )}
          
          {/* Property type */}
          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            <span className="mr-2">{propertyTypeIcons[propertyType] || propertyTypeIcons.default}</span>
            <span className="capitalize">{propertyType || 'Property'}</span>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">
                {[address, city, state, zipCode].filter(Boolean).join(', ')}
              </span>
            </div>
          </div>
          
          {onSelect && (
            <div className="ml-4">
              <input
                type="checkbox"
                checked={selected}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelect(property, e.target.checked);
                }}
                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Property specs */}
        <div className="grid grid-cols-3 gap-4 my-4">
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-500 mb-1">
              <UserIcon className="h-4 w-4 mr-1" />
              <span className="text-sm">Bed</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {bedrooms || '-'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-500 mb-1">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Bath</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {bathrooms || '-'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-500 mb-1">
              <HomeIcon className="h-4 w-4 mr-1" />
              <span className="text-sm">Sq Ft</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {squareFeet ? squareFeet.toLocaleString() : '-'}
            </div>
          </div>
        </div>

        {/* Price and metrics */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-gray-900">
              {formatPrice(price)}
              <span className="text-sm font-normal text-gray-500">/month</span>
            </div>
            
            {showMetrics && occupancyRate !== undefined && (
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{occupancyRate}%</div>
                <div className="text-xs text-gray-500">Occupancy</div>
              </div>
            )}
          </div>
          
          {showMetrics && revenue !== undefined && (
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
              <span>Revenue: {formatPrice(revenue)}/month</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Last updated */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <ClockIcon className="h-4 w-4 mr-1" />
          <span>Updated {formatDate(lastUpdated)}</span>
          {isActive ? (
            <CheckCircleIcon className="h-4 w-4 text-green-500 ml-2" />
          ) : (
            <XCircleIcon className="h-4 w-4 text-red-500 ml-2" />
          )}
        </div>

        {/* Action buttons */}
        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onView) onView(property);
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                View
              </button>
              
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(property);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </button>
              )}
            </div>
            
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(property);
                }}
                className="inline-flex items-center p-2 border border-transparent text-sm font-medium rounded-lg text-red-700 hover:bg-red-50 transition-colors"
                title="Delete property"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// List view variant
export const PropertyListCard = (props) => (
  <PropertyCard variant="list" {...props} />
);

// Grid view variant
export const PropertyGridCard = (props) => (
  <PropertyCard variant="grid" {...props} />
);

// Compact card for dashboards
export const PropertyCompactCard = ({ property, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
  >
    <div className="flex items-start">
      <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center mr-4">
        <HomeIcon className="h-8 w-8 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{property.title}</h4>
        <p className="text-sm text-gray-500 truncate">{property.address}</p>
        <div className="flex items-center mt-2">
          <span className="text-sm font-medium text-gray-900">
            {property.price ? `$${property.price}/mo` : 'N/A'}
          </span>
          <span className={`mx-3 px-2 py-1 text-xs rounded-full ${
            property.status === 'occupied' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {property.status === 'occupied' ? 'Occupied' : 'Vacant'}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default PropertyCard;