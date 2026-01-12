import React, { useState, useEffect } from 'react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { MapPin, Coffee, Utensils, ShoppingBag, AlertCircle, Star, Phone, MapIcon } from 'lucide-react';

const Neighborhood = () => {
  const { isDark, getClassNames } = useThemeMode();
  const [places, setPlaces] = useState([]);
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNeighborhoodData();
  }, []);

  const fetchNeighborhoodData = async () => {
    setLoading(true);
    try {
      // Fetch weather forecast
      const weatherResponse = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=34.0522&longitude=-118.2437&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=America/Los_Angeles&forecast_days=7'
      );
      const weatherData = await weatherResponse.json();
      if (weatherData.daily) {
        setWeatherForecast(weatherData.daily);
      }

      // Simulate local places data
      const nearbyPlaces = [
        {
          id: 1,
          name: 'Central Market',
          type: 'Grocery Store',
          icon: '🛒',
          rating: 4.5,
          distance: '0.3 mi',
          address: '123 Main St, Los Angeles, CA',
          phone: '(213) 555-0123',
          hours: '6am - 11pm'
        },
        {
          id: 2,
          name: 'Riverside Coffee',
          type: 'Café',
          icon: '☕',
          rating: 4.8,
          distance: '0.5 mi',
          address: '456 Oak Ave, Los Angeles, CA',
          phone: '(213) 555-0124',
          hours: '7am - 9pm'
        },
        {
          id: 3,
          name: 'Local Pizzeria',
          type: 'Restaurant',
          icon: '🍕',
          rating: 4.6,
          distance: '0.4 mi',
          address: '789 Elm St, Los Angeles, CA',
          phone: '(213) 555-0125',
          hours: '11am - 11pm'
        },
        {
          id: 4,
          name: 'Park Recreation Center',
          type: 'Park',
          icon: '🏞️',
          rating: 4.4,
          distance: '0.2 mi',
          address: '321 Park Dr, Los Angeles, CA',
          phone: '(213) 555-0126',
          hours: 'Dawn - Dusk'
        },
        {
          id: 5,
          name: 'City Hospital',
          type: 'Healthcare',
          icon: '🏥',
          rating: 4.3,
          distance: '0.8 mi',
          address: '654 Medical Way, Los Angeles, CA',
          phone: '(213) 555-0127',
          hours: '24/7'
        },
        {
          id: 6,
          name: 'Public Library',
          type: 'Library',
          icon: '📚',
          rating: 4.7,
          distance: '0.6 mi',
          address: '987 Book Lane, Los Angeles, CA',
          phone: '(213) 555-0128',
          hours: '9am - 8pm'
        }
      ];

      setPlaces(nearbyPlaces);
    } catch (error) {
      console.error('Error fetching neighborhood data:', error);
    }
    setLoading(false);
  };

  const containerClasses = `${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`;
  const cardClasses = `${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`;
  const titleClasses = `${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold mb-6`;
  const textClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'}`;

  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️';
    if (code === 1 || code === 2) return '🌤️';
    if (code === 3) return '☁️';
    if (code === 45 || code === 48) return '🌫️';
    if (code === 51 || code === 61) return '🌧️';
    if (code === 71 || code === 85) return '❄️';
    return '🌡️';
  };

  if (loading) {
    return (
      <div className={containerClasses}>
        <div className="text-center py-12">
          <p className={titleClasses}>Loading neighborhood data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <MapIcon className={isDark ? 'text-blue-400' : 'text-blue-600'} />
          <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'} font-semibold`}>Los Angeles, CA</span>
        </div>
        <h1 className={titleClasses}>🗺️ Neighborhood Guide</h1>
        <p className={textClasses}>
          Discover nearby amenities, places, and local information
        </p>
      </div>

      {/* Weather Forecast */}
      {weatherForecast.time && (
        <div className="mb-8">
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-4`}>
            ☀️ 7-Day Weather Forecast
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
            {weatherForecast.time.slice(0, 7).map((date, idx) => (
              <div key={idx} className={`${cardClasses} text-center`}>
                <p className={`${textClasses} text-xs mb-2`}>
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className="text-2xl mb-2">{getWeatherIcon(weatherForecast.weather_code[idx])}</p>
                <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold text-sm`}>
                  {Math.round(weatherForecast.temperature_2m_max[idx])}°F
                </p>
                <p className={`${textClasses} text-xs`}>
                  {Math.round(weatherForecast.temperature_2m_min[idx])}°F
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Population', value: '3.9M', desc: 'Greater LA' },
          { label: 'Avg Income', value: '$72K', desc: 'Per household' },
          { label: 'Safety Score', value: '7.2/10', desc: 'Moderate' },
          { label: 'Cost of Living', value: '135', desc: 'Above average' }
        ].map((stat, idx) => (
          <div key={idx} className={cardClasses}>
            <p className={`${textClasses} text-xs mb-1`}>{stat.label}</p>
            <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-1`}>{stat.value}</p>
            <p className={`${textClasses} text-xs`}>{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Nearby Places */}
      <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-4`}>
        📍 Nearby Places & Services
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {places.map((place) => (
          <div key={place.id} className={`${cardClasses} cursor-pointer hover:shadow-lg transition`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-3xl">{place.icon}</span>
                <div className="flex-1">
                  <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold`}>{place.name}</h3>
                  <p className={`${textClasses} text-xs mb-2`}>{place.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm font-semibold`}>
                  {place.rating}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={14} className={textClasses} />
                <span className={textClasses}>{place.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className={textClasses} />
                <span className={textClasses}>{place.phone}</span>
              </div>
              <div className={`flex items-center gap-2 pt-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <span className={`${textClasses} text-xs`}>⏰ {place.hours}</span>
                <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'} text-xs font-semibold ml-auto`}>
                  {place.distance}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Community Tips */}
      <div className={`p-6 rounded-lg ${isDark ? 'bg-green-900 bg-opacity-30 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
        <h3 className={`${isDark ? 'text-green-300' : 'text-green-900'} font-bold mb-3 flex items-center gap-2`}>
          💡 Community Tips
        </h3>
        <ul className={`space-y-2 text-sm ${isDark ? 'text-green-200' : 'text-green-800'}`}>
          <li>• Best time to visit parks: Early morning (6-9am) or evening (5-8pm)</li>
          <li>• Public transportation: Bus routes 2, 4, 6 run through this area</li>
          <li>• Farmer's Market: Every Saturday 9am-2pm at Central Park</li>
          <li>• Street Cleaning: Monday & Thursday 8am-10am (no parking)</li>
          <li>• Community Events: Check the neighborhood bulletin board monthly</li>
        </ul>
      </div>
    </div>
  );
};

export default Neighborhood;
