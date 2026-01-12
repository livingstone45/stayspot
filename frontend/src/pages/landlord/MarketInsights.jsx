import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Home, Building2, Zap, MapPin } from 'lucide-react';

const MarketInsights = () => {
  const [activeCity, setActiveCity] = useState('Nairobi');

  const stats = [
    { label: 'CBR Rate', value: '8.5%', change: -0.3, icon: Zap, color: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Inflation', value: '5.2%', change: -0.8, icon: TrendingDown, color: 'bg-green-50', textColor: 'text-green-600' },
    { label: 'Rental Growth', value: '6.2%', change: 1.5, icon: TrendingUp, color: 'bg-orange-50', textColor: 'text-orange-600' },
    { label: 'Property Index', value: '3.8%', change: 1.2, icon: Home, color: 'bg-purple-50', textColor: 'text-purple-600' }
  ];

  const cities = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'];
  
  const cityData = {
    Nairobi: { residential: 42, commercial: 35, industrial: 15, other: 8, avgRent: 65000 },
    Mombasa: { residential: 38, commercial: 28, industrial: 20, other: 14, avgRent: 48000 },
    Kisumu: { residential: 45, commercial: 25, industrial: 18, other: 12, avgRent: 35000 },
    Nakuru: { residential: 40, commercial: 30, industrial: 18, other: 12, avgRent: 42000 },
    Eldoret: { residential: 43, commercial: 27, industrial: 16, other: 14, avgRent: 38000 }
  };

  const rentalTrends = [
    { year: '2020', avg: 45000 },
    { year: '2021', avg: 48500 },
    { year: '2022', avg: 52000 },
    { year: '2023', avg: 56500 },
    { year: '2024', avg: 59800 }
  ];

  const propertyTypes = [
    { type: 'Residential', value: 42, color: '#3B82F6' },
    { type: 'Commercial', value: 30, color: '#10B981' },
    { type: 'Industrial', value: 18, color: '#F59E0B' },
    { type: 'Mixed-Use', value: 10, color: '#8B5CF6' }
  ];

  const StatCard = ({ label, value, change, icon: Icon, color, textColor }) => (
    <div className={`${color} rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${textColor} bg-white`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
    </div>
  );

  const PieChart = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div className="flex flex-col items-center gap-6">
        <svg width="220" height="220" viewBox="0 0 220 220" className="drop-shadow-lg">
          {data.map((item, idx) => {
            const sliceAngle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + sliceAngle;
            currentAngle = endAngle;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const x1 = 110 + 90 * Math.cos(startRad);
            const y1 = 110 + 90 * Math.sin(startRad);
            const x2 = 110 + 90 * Math.cos(endRad);
            const y2 = 110 + 90 * Math.sin(endRad);
            const largeArc = sliceAngle > 180 ? 1 : 0;

            return (
              <path
                key={idx}
                d={`M 110 110 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={item.color}
                stroke="white"
                strokeWidth="3"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );
          })}
        </svg>
        <div className="grid grid-cols-2 gap-3 w-full">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
              <div className="text-sm">
                <p className="font-semibold text-gray-900">{item.type}</p>
                <p className="text-xs text-gray-600">{item.value}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const BarChart = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.avg));

    return (
      <div className="space-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="group">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-900">{item.year}</span>
              <span className="text-sm font-bold text-blue-600">KES {item.avg.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 group-hover:from-blue-600 group-hover:to-blue-700"
                style={{ width: `${(item.avg / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const currentCityData = cityData[activeCity];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 p-6">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🇰🇪</span>
          <h1 className="text-4xl font-bold text-gray-900">Kenya Market Insights</h1>
        </div>
        <p className="text-gray-600 flex items-center gap-2">
          <MapPin size={16} /> Real Estate Statistics & Analysis
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Market Share by Type</h3>
          <PieChart data={propertyTypes} />
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Rental Price Trends</h3>
          <BarChart data={rentalTrends} />
        </div>
      </div>

      {/* City Analysis */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 mb-10">
        <h3 className="text-lg font-bold text-gray-900 mb-6">City Analysis</h3>
        
        {/* City Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeCity === city
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* City Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <p className="text-xs text-gray-600 font-semibold mb-1">Residential</p>
            <p className="text-2xl font-bold text-blue-600">{currentCityData.residential}%</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <p className="text-xs text-gray-600 font-semibold mb-1">Commercial</p>
            <p className="text-2xl font-bold text-green-600">{currentCityData.commercial}%</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
            <p className="text-xs text-gray-600 font-semibold mb-1">Industrial</p>
            <p className="text-2xl font-bold text-orange-600">{currentCityData.industrial}%</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <p className="text-xs text-gray-600 font-semibold mb-1">Avg Rent</p>
            <p className="text-xl font-bold text-purple-600">KES {(currentCityData.avgRent / 1000).toFixed(0)}k</p>
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">2024 Performance Index</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Metric</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Q1</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Q2</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Q3</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Q4</th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: 'Price Growth', q1: 2.8, q2: 3.2, q3: 3.5, q4: 3.8 },
                { metric: 'Rental Growth', q1: 5.2, q2: 5.6, q3: 6.0, q4: 6.2 },
                { metric: 'Occupancy Rate', q1: 92.1, q2: 93.2, q3: 94.1, q4: 95.2 },
                { metric: 'Investment Volume', q1: 65, q2: 72, q3: 78, q4: 85 }
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{row.metric}</td>
                  {['q1', 'q2', 'q3', 'q4'].map((q, qidx) => {
                    const val = row[q];
                    const intensity = Math.min(val / 100, 1);
                    return (
                      <td
                        key={qidx}
                        className="px-4 py-4 text-center text-sm font-bold text-white rounded-lg transition-all"
                        style={{
                          backgroundColor: `rgba(59, 130, 246, ${0.2 + intensity * 0.8})`
                        }}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketInsights;
