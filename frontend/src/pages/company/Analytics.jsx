import React, { useState } from 'react';
import { CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Layout from '../../components/common/Layout/Layout';
import StatsCard from '../../components/dashboard/StatsCard';
import Chart from '../../components/dashboard/Chart';
import Select from '../../components/common/UI/Select';
import Tabs from '../../components/common/UI/Tabs';

const CompanyAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const stats = [
    { title: 'Total Revenue', value: '$124,500', change: '+12%', trend: 'up' },
    { title: 'Occupancy Rate', value: '94.2%', change: '+2.1%', trend: 'up' },
    { title: 'Active Properties', value: '48', change: '+3', trend: 'up' },
    { title: 'Maintenance Requests', value: '12', change: '-8', trend: 'down' }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 45000, expenses: 32000 },
    { month: 'Feb', revenue: 52000, expenses: 35000 },
    { month: 'Mar', revenue: 48000, expenses: 33000 },
    { month: 'Apr', revenue: 61000, expenses: 38000 },
    { month: 'May', revenue: 55000, expenses: 36000 },
    { month: 'Jun', revenue: 67000, expenses: 41000 }
  ];

  const occupancyData = [
    { month: 'Jan', rate: 92 },
    { month: 'Feb', rate: 89 },
    { month: 'Mar', rate: 94 },
    { month: 'Apr', rate: 96 },
    { month: 'May', rate: 93 },
    { month: 'Jun', rate: 94 }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Track your portfolio performance</p>
          </div>
          <Select
            value={timeRange}
            onChange={setTimeRange}
            options={[
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
              { value: '90d', label: 'Last 3 months' },
              { value: '1y', label: 'Last year' }
            ]}
            icon={CalendarIcon}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <Tabs defaultTab={0}>
          <Tabs.Panel label="Revenue">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Revenue vs Expenses
              </h3>
              <Chart
                type="bar"
                data={revenueData}
                xKey="month"
                yKeys={['revenue', 'expenses']}
                colors={['#3B82F6', '#EF4444']}
                height={300}
              />
            </div>
          </Tabs.Panel>
          
          <Tabs.Panel label="Occupancy">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Occupancy Rate Trend
              </h3>
              <Chart
                type="line"
                data={occupancyData}
                xKey="month"
                yKeys={['rate']}
                colors={['#10B981']}
                height={300}
              />
            </div>
          </Tabs.Panel>
          
          <Tabs.Panel label="Properties">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Property Performance
              </h3>
              <div className="text-center py-12 text-gray-500">
                Property performance charts coming soon...
              </div>
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CompanyAnalytics;