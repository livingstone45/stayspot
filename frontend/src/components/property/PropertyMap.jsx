import React, { useState, useEffect, useRef } from 'react';
import {
  MapPinIcon,
  GlobeAltIcon,
  PlusIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';

const PropertyMap = ({
  latitude,
  longitude,
  address,
  height = '400px',
  width = '100%',
  zoom = 14,
  markers = [],
  onLocationSelect,
  interactive = true,
  showSearch = true,
  className = '',
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [userLocation, setUserLocation] = useState(null);
  
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // Initialize map
  useEffect(() => {
    if (!apiKey || !window.google) {
      loadGoogleMapsScript();
      return;
    }
    
    initMap();
  }, [apiKey]);
  
  // Update map when location changes
  useEffect(() => {
    if (map && latitude && longitude) {
      const position = { lat: latitude, lng: longitude };
      
      map.setCenter(position);
      map.setZoom(currentZoom);
      
      // Update or create marker
      if (marker) {
        marker.setPosition(position);
      } else {
        const newMarker = new window.google.maps.Marker({
          position,
          map,
          title: address || 'Property Location',
          draggable: interactive,
          animation: window.google.maps.Animation.DROP,
        });
        
        if (interactive) {
          newMarker.addListener('dragend', (e) => {
            const newPosition = e.latLng.toJSON();
            if (onLocationSelect) {
              onLocationSelect(newPosition.lat, newPosition.lng, null);
            }
          });
        }
        
        setMarker(newMarker);
      }
    }
  }, [map, latitude, longitude, address, interactive]);
  
  // Add additional markers
  useEffect(() => {
    if (!map || !window.google || markers.length === 0) return;
    
    // Clear existing markers except the main one
    // (In a real app, you'd manage multiple markers properly)
    
    markers.forEach((markerData, index) => {
      if (markerData.latitude && markerData.longitude) {
        const marker = new window.google.maps.Marker({
          position: { lat: markerData.latitude, lng: markerData.longitude },
          map,
          title: markerData.title || `Property ${index + 1}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: markerData.color || '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
        });
        
        if (markerData.info) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-semibold text-gray-900">${markerData.title || 'Property'}</h3>
                <p class="text-sm text-gray-600 mt-1">${markerData.info}</p>
              </div>
            `,
          });
          
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        }
      }
    });
  }, [map, markers]);
  
  const loadGoogleMapsScript = () => {
    if (window.google) return;
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);
  };
  
  const initMap = () => {
    if (!window.google || !mapRef.current) return;
    
    const defaultCenter = latitude && longitude 
      ? { lat: latitude, lng: longitude }
      : { lat: 40.7128, lng: -74.0060 }; // New York default
    
    const mapOptions = {
      center: defaultCenter,
      zoom: currentZoom,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      streetViewControl: false,
      fullscreenControl: true,
      mapTypeControl: true,
      zoomControl: false, // We'll create custom controls
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'transit',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    };
    
    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    
    // Add custom zoom controls
    const zoomControlDiv = document.createElement('div');
    zoomControlDiv.className = 'custom-zoom-control';
    
    const zoomInButton = document.createElement('button');
    zoomInButton.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>';
    zoomInButton.className = 'bg-white p-2 rounded-t-lg border-b border-gray-200 hover:bg-gray-50';
    zoomInButton.title = 'Zoom in';
    zoomInButton.onclick = () => {
      newMap.setZoom(newMap.getZoom() + 1);
      setCurrentZoom(newMap.getZoom());
    };
    
    const zoomOutButton = document.createElement('button');
    zoomOutButton.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>';
    zoomOutButton.className = 'bg-white p-2 rounded-b-lg hover:bg-gray-50';
    zoomOutButton.title = 'Zoom out';
    zoomOutButton.onclick = () => {
      newMap.setZoom(newMap.getZoom() - 1);
      setCurrentZoom(newMap.getZoom());
    };
    
    zoomControlDiv.appendChild(zoomInButton);
    zoomControlDiv.appendChild(zoomOutButton);
    
    newMap.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomControlDiv);
    
    // Add location control
    if (interactive && navigator.geolocation) {
      const locationControlDiv = document.createElement('div');
      locationControlDiv.className = 'custom-location-control';
      
      const locationButton = document.createElement('button');
      locationButton.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>';
      locationButton.className = 'bg-white p-2 rounded-lg shadow hover:bg-gray-50';
      locationButton.title = 'Use my location';
      locationButton.onclick = getUserLocation;
      
      locationControlDiv.appendChild(locationButton);
      newMap.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(locationControlDiv);
    }
    
    // Add click listener for map if interactive
    if (interactive && onLocationSelect) {
      newMap.addListener('click', (e) => {
        const position = e.latLng.toJSON();
        
        // Clear existing marker
        if (marker) {
          marker.setMap(null);
        }
        
        // Create new marker at clicked location
        const newMarker = new window.google.maps.Marker({
          position,
          map: newMap,
          draggable: true,
          animation: window.google.maps.Animation.DROP,
        });
        
        newMarker.addListener('dragend', (dragEvent) => {
          const dragPosition = dragEvent.latLng.toJSON();
          if (onLocationSelect) {
            onLocationSelect(dragPosition.lat, dragPosition.lng, null);
          }
        });
        
        setMarker(newMarker);
        
        // Reverse geocode to get address
        reverseGeocode(position.lat, position.lng);
      });
    }
    
    setMap(newMap);
  };
  
  const reverseGeocode = (lat, lng) => {
    if (!window.google || !onLocationSelect) return;
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        onLocationSelect(lat, lng, results[0].formatted_address);
      } else {
        onLocationSelect(lat, lng, null);
      }
    });
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !window.google) return;
    
    setIsLoading(true);
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      setIsLoading(false);
      
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const address = results[0].formatted_address;
        
        if (map) {
          map.setCenter(location);
          map.setZoom(16);
          setCurrentZoom(16);
        }
        
        if (onLocationSelect) {
          onLocationSelect(location.lat(), location.lng(), address);
        }
        
        setSearchQuery('');
      } else {
        alert('Location not found. Please try a different search.');
      }
    });
  };
  
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        setUserLocation({ lat: userLat, lng: userLng });
        
        if (map) {
          map.setCenter({ lat: userLat, lng: userLng });
          map.setZoom(16);
          setCurrentZoom(16);
        }
        
        // Add user location marker
        if (window.google) {
          new window.google.maps.Marker({
            position: { lat: userLat, lng: userLng },
            map,
            title: 'Your Location',
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#10B981',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
            },
          });
        }
        
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        alert('Unable to retrieve your location: ' + error.message);
      }
    );
  };
  
  const zoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1);
      setCurrentZoom(map.getZoom());
    }
  };
  
  const zoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1);
      setCurrentZoom(map.getZoom());
    }
  };
  
  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
      {/* Map Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <GlobeAltIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="font-semibold text-gray-900">Property Location</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Zoom: {currentZoom}x
            </span>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={zoomOut}
                className="p-2 bg-white hover:bg-gray-50 border-r border-gray-300"
                disabled={!map}
              >
                <MinusIcon className="h-4 w-4 text-gray-700" />
              </button>
              <button
                onClick={zoomIn}
                className="p-2 bg-white hover:bg-gray-50"
                disabled={!map}
              >
                <PlusIcon className="h-4 w-4 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Address Display */}
        {address && (
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{address}</span>
          </div>
        )}
      </div>
      
      {/* Search Bar */}
      {showSearch && interactive && (
        <div className="p-4 border-b border-gray-200">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for an address or place..."
              className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            <MapPinIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className="absolute right-3 top-2.5 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      )}
      
      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapRef}
          style={{ height, width }}
          className="bg-gray-100"
        >
          {/* Fallback content if maps fail to load */}
          <div className="h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
            <GlobeAltIcon className="h-12 w-12 mb-4" />
            <p>Loading map...</p>
            {!apiKey && (
              <p className="text-sm mt-2 text-center px-4">
                Google Maps API key is required. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.
              </p>
            )}
          </div>
        </div>
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading location...</p>
            </div>
          </div>
        )}
        
        {/* Coordinates display */}
        {interactive && latitude && longitude && (
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
            <p className="text-xs text-gray-600">Coordinates</p>
            <p className="text-sm font-mono">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
          </div>
        )}
        
        {/* Instructions */}
        {interactive && onLocationSelect && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm max-w-xs">
            <p className="text-sm text-gray-700">
              <strong>Click on the map</strong> to set property location or drag the marker to adjust.
            </p>
          </div>
        )}
      </div>
      
      {/* Legend for multiple markers */}
      {markers.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Property Locations</h4>
          <div className="flex flex-wrap gap-2">
            {markers.map((markerData, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: markerData.color || '#3B82F6' }}
                ></div>
                <span className="text-sm text-gray-600">{markerData.title || `Property ${index + 1}`}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;