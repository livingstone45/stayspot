import React, { useState } from 'react';
import { Home, MapPin, DoorOpen, Sofa, Zap, Droplet, Smartphone } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const MyUnitPage = () => {
  const { isDark, getClassNames } = useThemeMode();
  const containerClasses = `${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 min-h-screen`;
  const cardClasses = `${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`;
  const titleClasses = `${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-bold mb-2`;
  const subtitleClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-8`;
  const textClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'}`;
  const [unitData] = useState({
    unitNumber: '402',
    propertyName: 'Sunset Apartments',
    address: '123 Main Street, Los Angeles, CA 90001',
    floor: '4th Floor',
    bedrooms: 2,
    bathrooms: 1.5,
    squareFeet: 850,
    furnishing: 'Unfurnished',
    moveInDate: '2024-01-01',
    leaseEndDate: '2025-12-31',
    monthlyRent: 1500,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1565182999555-2142414f6c5b?w=500&h=400&fit=crop',
    ],
    amenities: ['WiFi', 'Parking', 'Gym', 'Pool', 'Laundry', 'Garden'],
    utilities: ['Water', 'Electricity', 'Gas', 'Trash'],
  });

  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={titleClasses}>🏠 My Unit</h1>
        <p className={subtitleClasses}>Unit {unitData.unitNumber} • {unitData.propertyName}</p>
      </div>

      {/* Image Gallery */}
      <div className={`${cardClasses} overflow-hidden mb-8`}>
          <div className="relative">
            <img
              src={unitData.images[selectedImage]}
              alt="Unit"
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="p-4 flex gap-2 overflow-x-auto">
            {unitData.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                  selectedImage === idx ? 'border-blue-600' : isDark ? 'border-gray-600' : 'border-gray-200'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Unit Details */}
            <div className={`rounded-lg shadow p-6 ${getClassNames.surface}`}>
              <h2 className={`text-xl font-semibold mb-6 ${getClassNames.text}`}>Unit Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <Home size={24} className="text-blue-600 mt-1" />
                  <div>
                    <p className={`text-sm ${getClassNames.textSecondary}`}>Unit Number</p>
                    <p className={`font-semibold ${getClassNames.text}`}>{unitData.unitNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <DoorOpen size={24} className="text-blue-600 mt-1" />
                  <div>
                    <p className={`text-sm ${getClassNames.textSecondary}`}>Floor</p>
                    <p className={`font-semibold ${getClassNames.text}`}>{unitData.floor}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Sofa size={24} className="text-blue-600 mt-1" />
                  <div>
                    <p className={`text-sm ${getClassNames.textSecondary}`}>Bedrooms</p>
                    <p className={`font-semibold ${getClassNames.text}`}>{unitData.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Sofa size={24} className="text-blue-600 mt-1" />
                  <div>
                    <p className={`text-sm ${getClassNames.textSecondary}`}>Bathrooms</p>
                    <p className={`font-semibold ${getClassNames.text}`}>{unitData.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin size={24} className="text-blue-600 mt-1" />
                  <div>
                    <p className={`text-sm ${getClassNames.textSecondary}`}>Square Feet</p>
                    <p className={`font-semibold ${getClassNames.text}`}>{unitData.squareFeet} sq ft</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Sofa size={24} className="text-blue-600 mt-1" />
                  <div>
                    <p className={`text-sm ${getClassNames.textSecondary}`}>Furnishing</p>
                    <p className={`font-semibold ${getClassNames.text}`}>{unitData.furnishing}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address & Location */}
            <div className={`rounded-lg shadow p-6 ${getClassNames.surface}`}>
              <h2 className={`text-xl font-semibold mb-4 ${getClassNames.text}`}>Location</h2>
              <div className="flex items-start gap-4">
                <MapPin size={24} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className={`font-semibold ${getClassNames.text}`}>{unitData.propertyName}</p>
                  <p className={getClassNames.textSecondary}>{unitData.address}</p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium mt-2">Get Directions →</button>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className={`rounded-lg shadow p-6 ${getClassNames.surface}`}>
              <h2 className={`text-xl font-semibold mb-4 ${getClassNames.text}`}>Building Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {unitData.amenities.map((amenity, idx) => (
                  <div key={idx} className={`flex items-center gap-2 p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <span className="text-blue-600">✓</span>
                    <span className={`font-medium text-sm ${getClassNames.text}`}>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Utilities */}
            <div className={`rounded-lg shadow p-6 ${getClassNames.surface}`}>
              <h2 className={`text-xl font-semibold mb-4 ${getClassNames.text}`}>Utilities Included</h2>
              <div className="grid grid-cols-2 gap-4">
                {unitData.utilities.map((utility, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'}`}>
                    {utility === 'Water' && <Droplet size={20} className="text-green-600" />}
                    {utility === 'Electricity' && <Zap size={20} className="text-green-600" />}
                    {utility === 'Gas' && <Zap size={20} className="text-green-600" />}
                    {utility === 'Trash' && <Smartphone size={20} className="text-green-600" />}
                    <span className={`font-medium text-sm ${getClassNames.text}`}>{utility}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lease Summary */}
            <div className={`rounded-lg shadow p-6 ${getClassNames.surface}`}>
              <h2 className={`text-lg font-semibold mb-4 ${getClassNames.text}`}>Lease Summary</h2>
              <div className="space-y-4">
                <div>
                  <p className={`text-sm ${getClassNames.textSecondary}`}>Monthly Rent</p>
                  <p className={`text-2xl font-bold ${getClassNames.text}`}>${unitData.monthlyRent.toLocaleString()}</p>
                </div>
                <div className={`${getClassNames.border} border-t pt-4`}>
                  <p className={`text-sm ${getClassNames.textSecondary}`}>Move-in Date</p>
                  <p className={`font-semibold ${getClassNames.text}`}>{new Date(unitData.moveInDate).toLocaleDateString()}</p>
                </div>
                <div className={`${getClassNames.border} border-t pt-4`}>
                  <p className={`text-sm ${getClassNames.textSecondary}`}>Lease End Date</p>
                  <p className={`font-semibold ${getClassNames.text}`}>{new Date(unitData.leaseEndDate).toLocaleDateString()}</p>
                </div>
                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium">
                  View Lease Agreement
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 hover:bg-blue-100 rounded font-medium text-blue-900 transition">
                  📋 Submit Move Report
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-blue-100 rounded font-medium text-blue-900 transition">
                  🔑 Report Key Issue
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-blue-100 rounded font-medium text-blue-900 transition">
                  📸 Document Condition
                </button>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">Contact property management for:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Unit access issues</li>
                  <li>Lease questions</li>
                  <li>Maintenance concerns</li>
                </ul>
                <button className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition font-medium">
                  Contact Management
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default MyUnitPage;
