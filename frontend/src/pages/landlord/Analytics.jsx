import React, { useState, useEffect } from 'react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { BarChart3, TrendingUp, Download, Filter, ZoomIn, PieChart, LineChart } from 'lucide-react';

const Analytics = () => {
  const { isDark } = useThemeMode();
  const [timeRange, setTimeRange] = useState('month');
  const [analyticsData, setAnalyticsData] = useState({
    revenue: [],
    occupancy: [],
    expenses: [],
    metrics: {},
    propertyPerformance: [],
    tenantMetrics: {}
  });
  const [selectedProperty, setSelectedProperty] = useState('all');

  useEffect(() => {
    const mockAnalytics = {
      revenue: [
        { month: 'Jul', value: 45000, avg: 42000, target: 50000 },
        { month: 'Aug', value: 38000, avg: 42000, target: 50000 },
        { month: 'Sep', value: 42000, avg: 42000, target: 50000 },
        { month: 'Oct', value: 55000, avg: 48000, target: 50000 },
        { month: 'Nov', value: 52000, avg: 50000, target: 50000 },
        { month: 'Dec', value: 56200, avg: 51000, target: 50000 },
      ],
      occupancy: [
        { property: 'Sunset Apartments', rate: 100, units: 4, income: 8500, trend: 'up' },
        { property: 'Downtown Complex', rate: 66, units: 2, income: 5000, trend: 'down' },
        { property: 'Riverside Towers', rate: 100, units: 5, income: 10500, trend: 'stable' },
        { property: 'Hillside Residences', rate: 100, units: 2, income: 4200, trend: 'up' },
        { property: 'Central Hub', rate: 100, units: 6, income: 11000, trend: 'up' },
      ],
      expenses: [
        { category: 'Maintenance', value: 3420, percent: 27.5, trend: 'up' },
        { category: 'Utilities', value: 1800, percent: 14.5, trend: 'stable' },
        { category: 'Property Tax', value: 2800, percent: 22.6, trend: 'stable' },
        { category: 'Insurance', value: 1800, percent: 14.5, trend: 'down' },
        { category: 'Management', value: 2000, percent: 16.1, trend: 'up' },
      ],
      metrics: {
        revenueGrowth: 12.5,
        occupancyTrend: 2.3,
        expenseRatio: 23.4,
        avgRent: 2450,
        propertyValue: 2480000,
        cashOnCash: 8.9,
        roi: 14.2,
        capRate: 11.8,
        tenantRetention: 94.5,
        maintenanceCost: 3420,
        avgLeaseLength: 24
      },
      propertyPerformance: [
        { name: 'Sunset Apartments', revenue: 8500, expenses: 1200, net: 7300, occupancy: 100 },
        { name: 'Downtown Complex', revenue: 5000, expenses: 900, net: 4100, occupancy: 66 },
        { name: 'Riverside Towers', revenue: 10500, expenses: 1500, net: 9000, occupancy: 100 },
        { name: 'Hillside Residences', revenue: 4200, expenses: 650, net: 3550, occupancy: 100 },
        { name: 'Central Hub', revenue: 11000, expenses: 1800, net: 9200, occupancy: 100 },
      ],
      tenantMetrics: {
        totalTenants: 18,
        onTimePayments: 94.5,
        averageStay: 24,
        turnoverRate: 5.5,
        maintenanceRequests: 12,
        avgResponseTime: 2.3
      }
    };
    setAnalyticsData(mockAnalytics);
  }, [timeRange]);

  const containerClasses = `${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 min-h-screen`;
  const cardClasses = `${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`;
  const titleClasses = `${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-bold mb-2`;
  const textClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'}`;

  const renderComparisonChart = () => {
    const { revenue } = analyticsData;
    const maxValue = 65000;

    return (
      <svg viewBox="0 0 700 320" className="w-full" style={{ height: '280px' }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="targetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3, 4].map(i => (
          <line key={`gridline-${i}`} x1="70" y1={50 + i * 50} x2="680" y2={50 + i * 50} 
                stroke={isDark ? '#374151' : '#e5e7eb'} strokeWidth="1" />
        ))}

        <line x1="70" y1="30" x2="70" y2="270" stroke={isDark ? '#6b7280' : '#d1d5db'} strokeWidth="2" />
        <line x1="70" y1="270" x2="680" y2="270" stroke={isDark ? '#6b7280' : '#d1d5db'} strokeWidth="2" />

        {[0, 1, 2, 3, 4].map(i => (
          <text key={`y-label-${i}`} x="60" y={270 - i * 50 + 5} textAnchor="end" fontSize="11" fill={isDark ? '#9ca3af' : '#6b7280'}>
            ${(i * 13).toFixed(0)}k
          </text>
        ))}

        {revenue.map((data, i) => {
          const x = 90 + i * 95;
          const barHeight = (data.value / maxValue) * 200;
          const targetHeight = (data.target / maxValue) * 200;

          return (
            <g key={`month-${i}`}>
              <rect x={x} y={270 - barHeight} width="20" height={barHeight} fill="#3b82f6" opacity="0.8" rx="3" />
              <line x1={x + 25} y1={270 - targetHeight} x2={x + 35} y2={270 - targetHeight} stroke="#10b981" strokeWidth="2" strokeDasharray="4" />
              <text x={x + 20} y="290" textAnchor="middle" fontSize="12" fill={isDark ? '#9ca3af' : '#6b7280'}>
                {data.month}
              </text>
              <text x={x + 20} y={270 - barHeight - 8} textAnchor="middle" fontSize="10" fill={isDark ? '#d1d5db' : '#374151'} fontWeight="bold">
                ${(data.value / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}

        <rect x="90" y="15" width="12" height="12" fill="#3b82f6" />
        <text x="110" y="23" fontSize="12" fill={isDark ? '#d1d5db' : '#374151'}>Actual Revenue</text>

        <line x1="280" y1="21" x2="300" y2="21" stroke="#10b981" strokeWidth="2" strokeDasharray="4" />
        <text x="310" y="23" fontSize="12" fill={isDark ? '#d1d5db' : '#374151'}>Target</text>
      </svg>
    );
  };

  return (
    <div className={containerClasses}>
      <div className="mb-8">
        <h1 className={titleClasses}>Analytics & Insights 📊</h1>
        <p className={`${textClasses} mb-4`}>Comprehensive portfolio performance analysis</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex gap-2">
          {['week', 'month', 'quarter', 'year'].map(range => (
            <button 
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range 
                  ? (isDark ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-600 text-white shadow-lg')
                  : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        <select 
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
          className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border`}
        >
          <option value="all">All Properties</option>
          <option value="sunset">Sunset Apartments</option>
          <option value="downtown">Downtown Complex</option>
          <option value="riverside">Riverside Towers</option>
          <option value="hillside">Hillside Residences</option>
          <option value="central">Central Hub</option>
        </select>

        <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-all`}>
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className={cardClasses}>
          <p className={`${textClasses} text-xs uppercase mb-2 font-semibold`}>Revenue Growth</p>
          <p className={`${isDark ? 'text-green-400' : 'text-green-600'} text-3xl font-bold`}>+{analyticsData.metrics.revenueGrowth}%</p>
          <p className={`${textClasses} text-xs mt-2`}>vs last period</p>
        </div>

        <div className={cardClasses}>
          <p className={`${textClasses} text-xs uppercase mb-2 font-semibold`}>Occupancy Trend</p>
          <p className={`${isDark ? 'text-blue-400' : 'text-blue-600'} text-3xl font-bold`}>+{analyticsData.metrics.occupancyTrend}%</p>
          <p className={`${textClasses} text-xs mt-2`}>Month-over-month</p>
        </div>

        <div className={cardClasses}>
          <p className={`${textClasses} text-xs uppercase mb-2 font-semibold`}>Expense Ratio</p>
          <p className={`${isDark ? 'text-orange-400' : 'text-orange-600'} text-3xl font-bold`}>{analyticsData.metrics.expenseRatio}%</p>
          <p className={`${textClasses} text-xs mt-2`}>of revenue</p>
        </div>

        <div className={cardClasses}>
          <p className={`${textClasses} text-xs uppercase mb-2 font-semibold`}>Tenant Retention</p>
          <p className={`${isDark ? 'text-purple-400' : 'text-purple-600'} text-3xl font-bold`}>{analyticsData.metrics.tenantRetention}%</p>
          <p className={`${textClasses} text-xs mt-2`}>Retention rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className={cardClasses}>
          <p className={textClasses}>Avg Rent/Unit</p>
          <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>${analyticsData.metrics.avgRent}</p>
          <p className="text-green-600 text-xs mt-1">+3% YoY</p>
        </div>

        <div className={cardClasses}>
          <p className={textClasses}>ROI</p>
          <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>{analyticsData.metrics.roi}%</p>
          <p className="text-green-600 text-xs mt-1">Total return</p>
        </div>

        <div className={cardClasses}>
          <p className={textClasses}>Cap Rate</p>
          <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>{analyticsData.metrics.capRate}%</p>
          <p className="text-green-600 text-xs mt-1">Market rate</p>
        </div>

        <div className={cardClasses}>
          <p className={textClasses}>Avg Lease Length</p>
          <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>{analyticsData.metrics.avgLeaseLength} mo</p>
          <p className="text-green-600 text-xs mt-1">Stability</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className={cardClasses}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold flex items-center gap-2`}>
              <BarChart3 size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
              Revenue Performance
            </h2>
            <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <ZoomIn size={18} />
            </button>
          </div>
          {renderComparisonChart()}
        </div>

        <div className={cardClasses}>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-4`}>Property Occupancy Rates</h2>
          <div className="space-y-4">
            {analyticsData.occupancy.map((prop, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className={textClasses}>{prop.property}</span>
                  <div className="text-right">
                    <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold`}>{prop.rate}%</span>
                    <span className={`${textClasses} text-xs ml-2`}>(${prop.income.toLocaleString()})</span>
                  </div>
                </div>
                <div className={`w-full rounded-full h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-3 rounded-full ${prop.rate === 100 ? 'bg-green-500' : prop.rate >= 80 ? 'bg-blue-500' : 'bg-orange-500'}`}
                    style={{ width: `${prop.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cardClasses}>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-4`}>Expense Breakdown</h2>
          <div className="space-y-4">
            {analyticsData.expenses.map((expense, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className={textClasses}>{expense.category}</span>
                  <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold`}>
                    ${expense.value.toLocaleString()}
                  </span>
                </div>
                <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                    style={{ width: `${expense.percent}%` }}
                  ></div>
                </div>
                <p className={`text-xs ${textClasses} mt-1`}>{expense.percent}% of total</p>
              </div>
            ))}
          </div>
        </div>

        <div className={cardClasses}>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-4`}>Tenant Metrics</h2>
          <div className="space-y-3">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-green-50'} border-l-4 border-green-500`}>
              <p className={textClasses}>On-Time Payments</p>
              <p className={`${isDark ? 'text-green-400' : 'text-green-600'} text-2xl font-bold`}>{analyticsData.tenantMetrics.onTimePayments}%</p>
            </div>

            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'} border-l-4 border-blue-500`}>
              <p className={textClasses}>Avg Response Time</p>
              <p className={`${isDark ? 'text-blue-400' : 'text-blue-600'} text-2xl font-bold`}>{analyticsData.tenantMetrics.avgResponseTime} hrs</p>
            </div>

            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-purple-50'} border-l-4 border-purple-500`}>
              <p className={textClasses}>Turnover Rate</p>
              <p className={`${isDark ? 'text-purple-400' : 'text-purple-600'} text-2xl font-bold`}>{analyticsData.tenantMetrics.turnoverRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
