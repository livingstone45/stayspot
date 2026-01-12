import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useThemeMode } from '../../hooks/useThemeMode';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, DollarSign, Home, Users, BarChart3, PieChart, Activity, Plus } from 'lucide-react';
import AddPropertyModal from '../../components/common/AddPropertyModal';

const Dashboard = () => {
  const { user } = useAuth();
  const { isDark, resolvedTheme } = useThemeMode();
  const [themeKey, setThemeKey] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [properties, setProperties] = useState([]);

  const mockData = {
    properties: [
      { id: 1, name: 'Sunset Apartments', units: 4, occupied: 4, income: 8500, expenses: 1200, image: '🏢', roi: 14.2, occupancyRate: 100 },
      { id: 2, name: 'Downtown Complex', units: 3, occupied: 2, income: 5000, expenses: 900, image: '🏬', roi: 12.8, occupancyRate: 67 },
      { id: 3, name: 'Riverside Towers', units: 5, occupied: 5, income: 10500, expenses: 1500, image: '🏗️', roi: 15.6, occupancyRate: 100 },
      { id: 4, name: 'Hillside Residences', units: 2, occupied: 2, income: 4200, expenses: 650, image: '🏠', roi: 13.5, occupancyRate: 100 },
      { id: 5, name: 'Central Hub', units: 6, occupied: 6, income: 11000, expenses: 1800, image: '🏢', roi: 16.1, occupancyRate: 100 },
    ],
    financials: {
      monthlyRevenue: 56200,
      monthlyExpenses: 12400,
      netIncome: 43800,
      ytdGrowth: 18.5,
      avgOccupancy: 92.5,
      cashFlow: 45000,
      projectedAnnualRevenue: 673200,
      expenseRatio: 22.1
    },
    occupancy: {
      total: 20,
      occupied: 18,
      vacant: 2,
      leased: 18,
      maintenance: 0,
      trending: 'up'
    },
    maintenance: [
      { id: 1, unit: '305', issue: 'Plumbing issue', priority: 'urgent', created: '2 hours ago', status: 'open', cost: 450 },
      { id: 2, unit: '401', issue: 'HVAC maintenance', priority: 'high', created: '1 day ago', status: 'in-progress', cost: 320 },
      { id: 3, unit: '102', issue: 'Door repair', priority: 'medium', created: '2 days ago', status: 'scheduled', cost: 150 },
      { id: 4, unit: '203', issue: 'Electrical inspection', priority: 'low', created: '5 days ago', status: 'scheduled', cost: 200 },
      { id: 5, unit: '501', issue: 'Window replacement', priority: 'medium', created: '1 week ago', status: 'in-progress', cost: 680 },
    ],
    payments: [
      { id: 1, tenant: 'John Doe', unit: '101', amount: 1200, date: '2 hours ago', status: 'received' },
      { id: 2, tenant: 'Jane Smith', unit: '201', amount: 1500, date: '1 day ago', status: 'received' },
      { id: 3, tenant: 'Bob Wilson', unit: '301', amount: 1350, date: '3 days ago', status: 'received' },
      { id: 4, tenant: 'Alice Brown', unit: '401', amount: 1400, date: '5 days ago', status: 'pending' },
    ],
    alerts: [
      { id: 1, type: 'maintenance', message: 'Urgent: Plumbing issue in Unit 305', priority: 'urgent', timestamp: '2 hours ago' },
      { id: 2, type: 'payment', message: 'Payment pending from Unit 401 - Due in 3 days', priority: 'high', timestamp: '1 day ago' },
      { id: 3, type: 'lease', message: 'Lease expiring for Unit 501 in 30 days', priority: 'medium', timestamp: '5 days ago' },
      { id: 4, type: 'inspection', message: 'Annual inspection scheduled for Unit 201 - Tomorrow', priority: 'medium', timestamp: '1 week ago' },
    ],
    performance: {
      avgRent: 2450,
      capRate: 11.8,
      cashOnCash: 8.9,
      propertyValue: 2480000
    },
    trends: {
      revenue: [45000, 38000, 42000, 55000, 52000, 56200],
      expenses: [8000, 9500, 8200, 10500, 11200, 12400],
      months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        setThemeKey(prev => prev + 1);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    setThemeKey(prev => prev + 1);
  }, [resolvedTheme]);

  const containerClasses = `${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 min-h-screen font-sans`;
  const cardClasses = `${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`;
  const titleClasses = `${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-bold mb-2`;
  const subtitleClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-8`;
  const textClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'}`;
  const statValueClasses = `${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold`;

  const KPICard = ({ icon, label, value, change, trend, color = 'blue' }) => {
    const colorClasses = {
      green: isDark ? 'bg-green-900 border-green-700 text-green-400' : 'bg-green-50 border-green-200 text-green-600',
      blue: isDark ? 'bg-blue-900 border-blue-700 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600',
      orange: isDark ? 'bg-orange-900 border-orange-700 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-600',
      red: isDark ? 'bg-red-900 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-600',
      purple: isDark ? 'bg-purple-900 border-purple-700 text-purple-400' : 'bg-purple-50 border-purple-200 text-purple-600',
    };
    
    const bgColor = colorClasses[color] || colorClasses.blue;
    const isTrendingUp = trend === 'up';

    return (
      <div className={`${cardClasses} hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${bgColor} border`}>
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 ${isTrendingUp ? 'text-green-600' : 'text-red-600'} text-sm font-semibold`}>
              {isTrendingUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {change}
            </div>
          )}
        </div>
        <p className={`${textClasses} text-xs mb-2 uppercase tracking-wide font-medium`}>{label}</p>
        <p className={`${statValueClasses}`}>{value}</p>
      </div>
    );
  };

  const renderRevenueChart = () => {
    const { revenue, expenses, months } = mockData.trends;
    const maxValue = Math.max(...revenue, ...expenses);
    
    return (
      <div className={cardClasses}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-bold flex items-center gap-2`}>
            <BarChart3 size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
            Revenue vs Expenses
          </h2>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={`px-3 py-1 rounded text-sm ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} border`}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
        
        <svg viewBox="0 0 600 280" className="w-full" style={{ height: '220px' }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {[0, 1, 2, 3, 4].map(i => (
            <line key={`gridline-${i}`} x1="60" y1={50 + i * 40} x2="580" y2={50 + i * 40} 
                  stroke={isDark ? '#374151' : '#e5e7eb'} strokeWidth="1" />
          ))}
          
          <line x1="60" y1="30" x2="60" y2="220" stroke={isDark ? '#6b7280' : '#d1d5db'} strokeWidth="2" />
          <line x1="60" y1="220" x2="580" y2="220" stroke={isDark ? '#6b7280' : '#d1d5db'} strokeWidth="2" />
          
          {revenue.map((value, i) => {
            const barHeight = (value / maxValue) * 160;
            const expenseHeight = (expenses[i] / maxValue) * 160;
            const x = 70 + i * 75;
            const y = 220 - barHeight;
            const expenseY = 220 - expenseHeight;
            return (
              <g key={`bar-${i}`}>
                <rect x={x} y={y} width="18" height={barHeight} fill="#3b82f6" opacity="0.8" rx="3" />
                <rect x={x + 22} y={expenseY} width="18" height={expenseHeight} fill="#ef4444" opacity="0.8" rx="3" />
                <text x={x + 20} y="240" textAnchor="middle" fontSize="12" fill={isDark ? '#9ca3af' : '#6b7280'}>
                  {months[i]}
                </text>
              </g>
            );
          })}
          
          <rect x="70" y="10" width="12" height="12" fill="#3b82f6" />
          <text x="90" y="18" fontSize="11" fill={isDark ? '#d1d5db' : '#374151'}>Revenue</text>
          
          <rect x="200" y="10" width="12" height="12" fill="#ef4444" />
          <text x="220" y="18" fontSize="11" fill={isDark ? '#d1d5db' : '#374151'}>Expenses</text>
        </svg>
      </div>
    );
  };

  return (
    <div key={themeKey} className={containerClasses}>
      <div className="mb-8">
        <h1 className={titleClasses}>Welcome back, {user?.firstName}! 👋</h1>
        <p className={subtitleClasses}>Real-time portfolio performance dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard 
          icon={<Home size={24} />}
          label="Total Properties"
          value={mockData.properties.length}
          change="+2"
          trend="up"
          color="green"
        />
        <KPICard 
          icon={<Users size={24} />}
          label="Occupancy Rate"
          value={`${mockData.occupancy.occupied}/${mockData.occupancy.total}`}
          change="+2.3%"
          trend="up"
          color="blue"
        />
        <KPICard 
          icon={<DollarSign size={24} />}
          label="Monthly Revenue"
          value={`$${mockData.financials.monthlyRevenue.toLocaleString()}`}
          change="+12%"
          trend="up"
          color="green"
        />
        <KPICard 
          icon={<AlertCircle size={24} />}
          label="Maintenance Issues"
          value={mockData.maintenance.length}
          change={mockData.maintenance.filter(m => m.priority === 'urgent').length + ' Urgent'}
          trend={mockData.maintenance.length > 0 ? 'down' : 'up'}
          color={mockData.maintenance.length > 0 ? 'red' : 'green'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className={`lg:col-span-2 ${cardClasses}`}>
          {renderRevenueChart()}
        </div>

        <div className={cardClasses}>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-bold mb-4 flex items-center gap-2`}>
            <PieChart size={20} className={isDark ? 'text-orange-400' : 'text-orange-600'} />
            Key Metrics
          </h2>
          
          <div className="space-y-4">
            {[
              { label: 'Avg Rent/Unit', value: `$${mockData.performance.avgRent}` },
              { label: 'Cap Rate', value: `${mockData.performance.capRate}%` },
              { label: 'Cash-on-Cash', value: `${mockData.performance.cashOnCash}%` },
              { label: 'Portfolio Value', value: `$${(mockData.performance.propertyValue / 1000000).toFixed(1)}M` },
            ].map((item, idx) => (
              <div key={idx} className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={textClasses}>{item.label}</p>
                <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-bold`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className={`lg:col-span-2 ${cardClasses}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-bold`}>🏘️ Property Portfolio</h2>
            <button
              onClick={() => setShowAddPropertyModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <Plus size={18} /> Add Property
            </button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {mockData.properties.map((prop) => (
              <div key={prop.id} className={`p-4 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold`}>{prop.name}</p>
                    <p className={`text-xs ${textClasses}`}>{prop.units} units • {prop.occupied}/{prop.units} occupied</p>
                  </div>
                  <span className="text-2xl">{prop.image}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(prop.occupied / prop.units) * 100}%` }}></div>
                    </div>
                  </div>
                  <span className={`ml-3 ${isDark ? 'text-green-400' : 'text-green-600'} font-bold`}>${prop.income.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cardClasses}>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-bold mb-4`}>📊 Financial Summary</h2>
          <div className="space-y-4">
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <p className={`text-xs ${textClasses} mb-1`}>Net Income</p>
              <p className={`${isDark ? 'text-blue-400' : 'text-blue-600'} text-2xl font-bold`}>${mockData.financials.netIncome.toLocaleString()}</p>
            </div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
              <p className={`text-xs ${textClasses} mb-1`}>YTD Growth</p>
              <p className={`${isDark ? 'text-green-400' : 'text-green-600'} text-2xl font-bold`}>+{mockData.financials.ytdGrowth}%</p>
            </div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <p className={`text-xs ${textClasses} mb-1`}>Expense Ratio</p>
              <p className={`${isDark ? 'text-purple-400' : 'text-purple-600'} text-2xl font-bold`}>{mockData.financials.expenseRatio}%</p>
            </div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-orange-50'}`}>
              <p className={`text-xs ${textClasses} mb-1`}>Annual Projection</p>
              <p className={`${isDark ? 'text-orange-400' : 'text-orange-600'} text-2xl font-bold`}>${(mockData.financials.projectedAnnualRevenue / 1000).toFixed(0)}k</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cardClasses}>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-bold mb-4 flex items-center gap-2`}>
            <AlertCircle size={20} className={isDark ? 'text-orange-400' : 'text-orange-600'} />
            Maintenance Queue
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {mockData.maintenance.map((item) => {
              const priorityColors = {
                urgent: isDark ? 'border-red-700 bg-red-900 text-red-300' : 'border-red-200 bg-red-50 text-red-700',
                high: isDark ? 'border-orange-700 bg-orange-900 text-orange-300' : 'border-orange-200 bg-orange-50 text-orange-700',
                medium: isDark ? 'border-yellow-700 bg-yellow-900 text-yellow-300' : 'border-yellow-200 bg-yellow-50 text-yellow-700',
                low: isDark ? 'border-gray-700 bg-gray-700 text-gray-300' : 'border-gray-200 bg-gray-50 text-gray-700',
              };
              
              return (
                <div key={item.id} className={`p-3 rounded-lg border ${priorityColors[item.priority]}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-sm">Unit {item.unit}</p>
                      <p className="text-xs opacity-75">{item.issue}</p>
                    </div>
                    <span className="text-xs font-bold uppercase">{item.status}</span>
                  </div>
                  <p className="text-xs opacity-70">{item.created} • Est. ${item.cost}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className={cardClasses}>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-bold mb-4 flex items-center gap-2`}>
            <Activity size={20} className={isDark ? 'text-green-400' : 'text-green-600'} />
            Recent Activity
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {mockData.payments.slice(0, 3).map((payment) => (
              <div key={`payment-${payment.id}`} className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-green-50'} border-l-4 border-green-500`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{payment.tenant}</p>
                    <p className={`text-xs ${textClasses}`}>Unit {payment.unit} • {payment.date}</p>
                  </div>
                  <span className={`font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>+${payment.amount}</span>
                </div>
              </div>
            ))}
            
            {mockData.alerts.slice(0, 2).map((alert) => (
              <div key={`alert-${alert.id}`} className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-amber-50'} border-l-4 ${alert.priority === 'urgent' ? 'border-red-500' : 'border-amber-500'}`}>
                <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{alert.message}</p>
                <p className={`text-xs ${textClasses} mt-1`}>{alert.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddPropertyModal
        isOpen={showAddPropertyModal}
        onClose={() => setShowAddPropertyModal(false)}
        onAdd={(formData) => {
          setProperties([...properties, { ...formData, id: Date.now() }]);
          setShowAddPropertyModal(false);
        }}
      />
    </div>
  );
};

export default Dashboard;
