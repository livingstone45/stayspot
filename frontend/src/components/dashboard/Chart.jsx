import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { ChartBarIcon, ChartPieIcon } from '@heroicons/react/24/outline';
import { TrendingUp } from 'lucide-react';

const Chart = ({
  type = 'line',
  data = [],
  height = 300,
  title,
  description,
  colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'],
  xAxisKey = 'name',
  yAxisKeys = ['value'],
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  stacked = false,
  loading = false,
  onDataPointClick,
}) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [viewMode, setViewMode] = useState(type);
  const chartRef = useRef(null);

  // Sample data if none provided
  const sampleData = [
    { name: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
    { name: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
    { name: 'Mar', revenue: 9800, expenses: 2000, profit: 7800 },
    { name: 'Apr', revenue: 3908, expenses: 2780, profit: 1128 },
    { name: 'May', revenue: 4800, expenses: 1890, profit: 2910 },
    { name: 'Jun', revenue: 3800, expenses: 2390, profit: 1410 },
    { name: 'Jul', revenue: 4300, expenses: 3490, profit: 810 },
  ];

  const chartData = data.length > 0 ? data : sampleData;

  const renderChart = () => {
    switch (viewMode) {
      case 'line':
        return (
          <LineChart data={chartData}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis dataKey={xAxisKey} stroke="#666" />
            <YAxis stroke="#666" />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            {yAxisKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, onClick: onDataPointClick }}
              />
            ))}
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart data={chartData}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis dataKey={xAxisKey} stroke="#666" />
            <YAxis stroke="#666" />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            {yAxisKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
                onClick={onDataPointClick}
                stackId={stacked ? 'stack' : undefined}
              />
            ))}
          </BarChart>
        );
      
      case 'area':
        return (
          <AreaChart data={chartData}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis dataKey={xAxisKey} stroke="#666" />
            <YAxis stroke="#666" />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            {yAxisKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );
      
      case 'pie':
        const pieData = yAxisKeys.map((key, index) => ({
          name: key,
          value: chartData.reduce((sum, item) => sum + (item[key] || 0), 0),
          color: colors[index % colors.length],
        }));

        const RADIAN = Math.PI / 180;
        const renderCustomizedLabel = ({
          cx, cy, midAngle, innerRadius, outerRadius, percent, index,
        }) => {
          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);

          return (
            <text
              x={x}
              y={y}
              fill="white"
              textAnchor={x > cx ? 'start' : 'end'}
              dominantBaseline="central"
              className="text-sm font-medium"
            >
              {`${(percent * 100).toFixed(0)}%`}
            </text>
          );
        };

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onClick={onDataPointClick}
              activeIndex={activeIndex}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
          </PieChart>
        );
      
      default:
        return null;
    }
  };

  const chartTypes = [
    { id: 'line', label: 'Line Chart', icon: TrendingUp },
    { id: 'bar', label: 'Bar Chart', icon: ChartBarIcon },
    { id: 'pie', label: 'Pie Chart', icon: ChartPieIcon },
    { id: 'area', label: 'Area Chart', icon: TrendingUp },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>}
        {description && <p className="text-sm text-gray-600 mb-6">{description}</p>}
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
        
        <div className="flex space-x-2">
          {chartTypes.map((chartType) => {
            const Icon = chartType.icon;
            return (
              <button
                key={chartType.id}
                onClick={() => setViewMode(chartType.id)}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === chartType.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                title={chartType.label}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Chart statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {yAxisKeys.map((key, index) => {
          const total = chartData.reduce((sum, item) => sum + (item[key] || 0), 0);
          const avg = total / chartData.length;
          const lastValue = chartData[chartData.length - 1]?.[key] || 0;
          const prevValue = chartData[chartData.length - 2]?.[key] || 0;
          const change = prevValue ? ((lastValue - prevValue) / prevValue) * 100 : 0;

          return (
            <div key={key} className="text-center">
              <p className="text-sm font-medium text-gray-600 capitalize">{key.replace(/_/g, ' ')}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {key.includes('revenue') || key.includes('profit') || key.includes('expense')
                  ? `$${total.toLocaleString()}`
                  : total.toLocaleString()}
              </p>
              <div className="flex items-center justify-center mt-1">
                {change !== 0 && (
                  <>
                    {change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <svg className="h-4 w-4 text-red-500 mr-1 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    )}
                    <span className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(change).toFixed(1)}%
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Predefined chart types for common use cases
export const RevenueChart = (props) => (
  <Chart
    type="line"
    title="Revenue Trends"
    description="Monthly revenue and expenses overview"
    yAxisKeys={['revenue', 'expenses', 'profit']}
    colors={['#10B981', '#EF4444', '#3B82F6']}
    {...props}
  />
);

export const OccupancyChart = (props) => (
  <Chart
    type="area"
    title="Occupancy Rate"
    description="Property occupancy over time"
    yAxisKeys={['occupancy']}
    colors={['#8B5CF6']}
    format="percent"
    {...props}
  />
);

export const MaintenanceChart = (props) => (
  <Chart
    type="bar"
    title="Maintenance Requests"
    description="Requests by status and priority"
    yAxisKeys={['pending', 'in_progress', 'completed']}
    colors={['#F59E0B', '#3B82F6', '#10B981']}
    stacked
    {...props}
  />
);

export const PropertyDistributionChart = (props) => (
  <Chart
    type="pie"
    title="Property Distribution"
    description="Properties by type and status"
    yAxisKeys={['residential', 'commercial', 'vacation']}
    colors={['#3B82F6', '#8B5CF6', '#F59E0B']}
    {...props}
  />
);

export default Chart;