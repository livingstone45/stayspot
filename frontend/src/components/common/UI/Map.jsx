import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut, Layers } from 'lucide-react';

const Map = ({
  center = { lat: 40.7128, lng: -74.0060 },
  zoom = 12,
  markers = [],
  onMarkerClick,
  onMapClick,
  interactive = true,
  className = '',
  style = {},
  height = '400px',
  showControls = true,
  tileLayer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}) => {
  const mapRef = useRef(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !mapLoaded) {
      const loadLeaflet = async () => {
        const L = await import('leaflet');
        require('leaflet/dist/leaflet.css');

        if (mapRef.current && !mapRef.current._leaflet_id) {
          const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom);

          L.tileLayer(tileLayer, {
            attribution,
            maxZoom: 19,
          }).addTo(map);

          // Add markers
          markers.forEach(markerData => {
            const marker = L.marker([markerData.lat, markerData.lng])
              .addTo(map)
              .bindPopup(markerData.title || 'Location');

            if (onMarkerClick) {
              marker.on('click', () => onMarkerClick(markerData));
            }
          });

          // Handle map click
          if (onMapClick) {
            map.on('click', (e) => {
              onMapClick({
                lat: e.latlng.lat,
                lng: e.latlng.lng
              });
            });
          }

          // Track zoom changes
          map.on('zoomend', () => {
            setCurrentZoom(map.getZoom());
          });

          mapRef.current._map = map;
          setMapLoaded(true);
        }
      };

      loadLeaflet();
    }

    return () => {
      if (mapRef.current?._map) {
        mapRef.current._map.remove();
        mapRef.current._map = null;
      }
    };
  }, [center, zoom, markers, tileLayer, attribution]);

  const handleZoomIn = () => {
    if (mapRef.current?._map) {
      mapRef.current._map.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current?._map) {
      mapRef.current._map.zoomOut();
    }
  };

  const handleCenterMap = () => {
    if (mapRef.current?._map) {
      mapRef.current._map.setView([center.lat, center.lng], currentZoom);
    }
  };

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`} style={{ ...style, height }}>
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ height: '100%' }}
      />
      
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            title="Zoom in"
          >
            <ZoomIn className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            title="Zoom out"
          >
            <ZoomOut className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={handleCenterMap}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            title="Center map"
          >
            <Navigation className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      )}

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map attribution */}
      <div className="absolute bottom-0 left-0 right-0 p-2 text-xs text-gray-600 dark:text-gray-400 bg-white/90 dark:bg-gray-900/90">
        {attribution && (
          <div dangerouslySetInnerHTML={{ __html: attribution }} />
        )}
      </div>
    </div>
  );
};

// Simple marker component for lists
export const Marker = ({ color = 'blue', size = 'md', className = '' }) => {
  const colors = {
    blue: 'text-blue-500',
    red: 'text-red-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500',
    gray: 'text-gray-500',
  };

  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <MapPin className={`${colors[color]} ${sizes[size]} ${className}`} />
  );
};

export default Map;