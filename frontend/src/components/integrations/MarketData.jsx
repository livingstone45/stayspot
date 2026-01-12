import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, MapPin,
  Building, Users, Calendar, Filter,
  Download, RefreshCw, ChevronDown, Search,
  Eye, Share2, BarChart3, PieChart
} from 'lucide-react';

const MarketData = ({ 
  data,
  onDateRangeChange,
  onLocationFilter,
  onExport,
  onRefresh,
  isLoading = false
}) => {
  const [dateRange, setDateRange] = useState('month');
  const [locationFilter, setLocationFilter] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [viewMode, setViewMode] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual API data
  const mockMarketData = {
    overview: {
      averageRent: 2500,
      rentGrowth: 3.2,
      vacancyRate: 4.1,
      occupancyRate: 95.9,
      averageDaysOnMarket: 21,
      rentalYield: 6.8,
      priceToRentRatio: 18.5
    },
    trends: [
      { month: 'Jan', rent: 2400, occupancy: 94.5, newListings: 45 },
      { month: 'Feb', rent: 2450, occupancy: 95.0, newListings: 52 },
      { month: 'Mar', rent: 2500, occupancy: 95.9, newListings: 48 },
      { month: 'Apr', rent: 2550, occupancy: 96.2, newListings: 55 },
      { month: 'May', rent: 2600, occupancy: 96.5, newListings: 60 },
      { month: 'Jun', rent: 2650, occupancy: 96.8, newListings: 58 }
    ],
    neighborhoods: [
      { name: 'Downtown', avgRent: 3200, rentGrowth: 4.2, vacancy: 3.2, rentalYield: 7.2 },
      { name: 'Northside', avgRent: 2800, rentGrowth: 3.8, vacancy: 3.8, rentalYield: 6.8 },
      { name: 'East End', avgRent: 2200, rentGrowth: 2.9, vacancy: 4.5, rentalYield: 6.2 },
      { name: 'West Hills', avgRent: 3500, rentGrowth: 5.1, vacancy: 2.8, rentalYield: 7.8 },
      { name: 'Southgate', avgRent: 1900, rentGrowth: 2.5, vacancy: 5.2, rentalYield: 5.8 }
    ],
    propertyTypes: [
      { type: 'Apartment', avgRent: 2500, occupancy: 95.5, yield: 6.8 },
      { type: 'Condo', avgRent: 2800, occupancy: 96.2, yield: 7.2 },
      { type: 'Townhouse', avgRent: 2200, occupancy: 94.8, yield: 6.4 },
      { type: 'Single Family', avgRent: 3200, occupancy: 95.1, yield: 7.5 },
      { type: 'Studio', avgRent: 1800, occupancy: 93.5, yield: 6.0 }
    ],
    competitorAnalysis: [
      { name: 'Competitor A', avgRent: 2450, occupancy: 94.8, rating: 4.2 },
      { name: 'Competitor B', avgRent: 2550, occupancy: 95.3, rating: 4.5 },
      { name: 'Competitor C', avgRent: 2400, occupancy: 94.2, rating: 4.0 },
      { name: 'Competitor D', avgRent: 2600, occupancy: 95.8, rating: 4.7 },
      { name: 'Competitor E', avgRent: 2500, occupancy: 95.9, rating: 4.6 }
    ]
  };

  const dateRanges = [
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last 90 Days' },
    { value: 'year', label: 'Last 12 Months' },
    { value: 'all', label: 'All Time' }
  ];

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'downtown', label: 'Downtown' },
    { value: 'northside', label: 'Northside' },
    { value: 'east_end', label: 'East End' },
    { value: 'west_hills', label: 'West Hills' },
    { value: 'southgate', label: 'Southgate' }
  ];

  const propertyTypesOptions = [
    { value: 'all', label: 'All Property Types' },
    { value: 'apartment', label: 'Apartments' },
    { value: 'condo', label: 'Condos' },
    { value: 'townhouse', label: 'Townhouses' },
    { value: 'single_family', label: 'Single Family' },
    { value: 'studio', label: 'Studios' }
  ];

  const viewModes = [
    { value: 'overview', label: 'Overview', icon: BarChart3 },
    { value: 'trends', label: 'Trends', icon: TrendingUp },
    { value: 'neighborhoods', label: 'Neighborhoods', icon: MapPin },
    { value: 'competitors', label: 'Competitors', icon: Building }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Rent</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(mockMarketData.overview.averageRent)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">
                +{mockMarketData.overview.rentGrowth}% growth
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {mockMarketData.overview.occupancyRate}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Vacancy: {mockMarketData.overview.vacancyRate}%
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Days on Market</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {mockMarketData.overview.averageDaysOnMarket}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center text-green-600">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">-2 days from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rental Yield</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {mockMarketData.overview.rentalYield}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Price-to-Rent: {mockMarketData.overview.priceToRentRatio}
            </p>
          </div>
        </div>
      </div>

      {/* Rent Trends Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Rent Trends</h3>
            <p className="text-gray-600 mt-1">Monthly average rent over time</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
              6 Months
            </button>
            <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
              1 Year
            </button>
            <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
              2 Years
            </button>
          </div>
        </div>
        
        {/* Simple Chart */}
        <div className="h-64 flex items-end space-x-2 pt-8">
          {mockMarketData.trends.map((month, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-3/4 bg-blue-500 rounded-t"
                style={{ height: `${(month.rent / 3000) * 100}px` }}
                title={`$${month.rent}`}
              ></div>
              <span className="text-xs text-gray-500 mt-2">{month.month}</span>
              <span className="text-xs font-medium mt-1">${month.rent}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Neighborhood Performance */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Neighborhood Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Neighborhood</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Rent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent Growth</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vacancy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rental Yield</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendation</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockMarketData.neighborhoods.map((neighborhood, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="font-medium text-gray-900">{neighborhood.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(neighborhood.avgRent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center ${neighborhood.rentGrowth >= 3 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {neighborhood.rentGrowth >= 3 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      <span className="font-medium">{formatPercentage(neighborhood.rentGrowth)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className={`h-2 rounded-full ${neighborhood.vacancy < 4 ? 'bg-green-500' : neighborhood.vacancy < 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${neighborhood.vacancy}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{formatPercentage(neighborhood.vacancy)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-medium ${neighborhood.rentalYield >= 7 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {formatPercentage(neighborhood.rentalYield)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      neighborhood.rentalYield >= 7 && neighborhood.vacancy < 4
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {neighborhood.rentalYield >= 7 && neighborhood.vacancy < 4 ? 'High Potential' : 'Moderate'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      {/* Detailed Trends Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Trends Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Rent vs Occupancy */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Rent vs Occupancy Rate</h4>
            <div className="space-y-4">
              {mockMarketData.trends.map((month, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{month.month}</span>
                    <span className="text-gray-600">Rent: ${month.rent} • Occupancy: {month.occupancy}%</span>
                  </div>
                  <div className="flex space-x-1">
                    <div 
                      className="bg-blue-500 h-3 rounded"
                      style={{ width: `${(month.rent / 3000) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-green-500 h-3 rounded"
                      style={{ width: `${month.occupancy}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Listings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">New Listings Trend</h4>
            <div className="space-y-4">
              {mockMarketData.trends.map((month, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{month.month}</span>
                    <span className="text-gray-600">{month.newListings} new listings</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-purple-500 h-3 rounded-full"
                      style={{ width: `${(month.newListings / 60) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Property Type Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Property Type Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Rent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rental Yield</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demand Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Share</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockMarketData.propertyTypes.map((property, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="font-medium text-gray-900">{property.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(property.avgRent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${property.occupancy}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{property.occupancy}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-medium ${property.yield >= 7 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {property.yield}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      property.occupancy >= 96 ? 'bg-green-100 text-green-800' :
                      property.occupancy >= 95 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {property.occupancy >= 96 ? 'High' :
                       property.occupancy >= 95 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(index + 1) * 20}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{((index + 1) * 20)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCompetitors = () => (
    <div className="space-y-6">
      {/* Competitor Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Competitor Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMarketData.competitorAnalysis.map((competitor, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{competitor.name}</h4>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-lg ${star <= Math.floor(competitor.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{competitor.rating.toFixed(1)}</span>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Rent</span>
                  <span className="font-medium">{formatCurrency(competitor.avgRent)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Occupancy</span>
                  <span className="font-medium">{competitor.occupancy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price Difference</span>
                  <span className={`font-medium ${competitor.avgRent > 2500 ? 'text-red-600' : 'text-green-600'}`}>
                    {competitor.avgRent > 2500 ? '+' : ''}{formatCurrency(competitor.avgRent - 2500)}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    competitor.avgRent > 2500 ? 'bg-red-100 text-red-800' :
                    competitor.avgRent < 2500 ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {competitor.avgRent > 2500 ? 'Above Market' :
                     competitor.avgRent < 2500 ? 'Below Market' : 'Market Rate'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Position */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Position Analysis</h3>
        <div className="space-y-6">
          {/* Rent Comparison */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Rent Comparison</h4>
            <div className="space-y-2">
              {mockMarketData.competitorAnalysis.map((competitor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-32">
                      <span className="text-sm text-gray-600">{competitor.name}</span>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: `${(competitor.avgRent / 3000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="w-20 text-right font-medium">
                    {formatCurrency(competitor.avgRent)}
                  </span>
                </div>
              ))}
              {/* Your Properties */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-32">
                    <span className="text-sm font-medium text-green-600">Your Properties</span>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${(2500 / 3000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="w-20 text-right font-bold text-green-600">
                  {formatCurrency(2500)}
                </span>
              </div>
            </div>
          </div>

          {/* Occupancy Comparison */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Occupancy Rate Comparison</h4>
            <div className="space-y-2">
              {mockMarketData.competitorAnalysis.map((competitor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-32">
                      <span className="text-sm text-gray-600">{competitor.name}</span>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-purple-500 h-3 rounded-full"
                        style={{ width: `${competitor.occupancy}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="w-20 text-right font-medium">
                    {competitor.occupancy}%
                  </span>
                </div>
              ))}
              {/* Your Properties */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-32">
                    <span className="text-sm font-medium text-green-600">Your Properties</span>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${95.9}%` }}
                    ></div>
                  </div>
                </div>
                <span className="w-20 text-right font-bold text-green-600">
                  95.9%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch (viewMode) {
      case 'overview': return renderOverview();
      case 'trends': return renderTrends();
      case 'competitors': return renderCompetitors();
      default: return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Market Data & Analytics</h2>
          <p className="text-gray-600 mt-2">Real-time market insights and competitive analysis</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onExport}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>Share Report</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          {/* View Mode */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {viewModes.map(mode => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.value}
                  onClick={() => setViewMode(mode.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    viewMode === mode.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{mode.label}</span>
                </button>
              );
            })}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Date Range */}
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value);
                  onDateRangeChange && onDateRangeChange(e.target.value);
                }}
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Location Filter */}
            <div className="relative">
              <select
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  onLocationFilter && onLocationFilter(e.target.value);
                }}
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                {locations.map(location => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Property Type Filter */}
            <div className="relative">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                {propertyTypesOptions.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search market data..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {renderView()}

      {/* Data Source Info */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Data Sources</h3>
            <p className="text-gray-600 mt-2">
              Market data is aggregated from multiple sources including MLS, public records, 
              and proprietary analytics. Updated daily.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                MLS Data
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Public Records
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                Rental Platforms
              </span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                Proprietary Analytics
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketData;