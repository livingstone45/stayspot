import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/management/Sidebar';
import {
  Building, Users, DollarSign, TrendingUp, TrendingDown, AlertTriangle,
  Calendar, CheckCircle, XCircle, Clock, MapPin, Filter, Search, Plus,
  RefreshCw, Eye, Edit2, MoreVertical, BarChart3, PieChart, Activity,
  Download, Trash2, ChevronDown, ChevronUp, X
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { managementAPI } from '../../services/managementAPI';

const ManagementDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Properties state
  const [properties, setProperties] = useState([]);
  const [propertyFilters, setPropertyFilters] = useState({
    status: 'all',
    type: 'all',
    minRent: 0,
    maxRent: 10000
  });

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [taskFilters, setTaskFilters] = useState({
    status: 'all',
    priority: 'all',
    type: 'all'
  });

  // Maintenance state
  const [maintenance, setMaintenance] = useState([]);
  const [maintenanceFilters, setMaintenanceFilters] = useState({
    status: 'all',
    priority: 'all'
  });

  // Dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState({
    totalProperties: 0,
    occupiedProperties: 0,
    vacancyRate: 0,
    totalRevenue: 0,
    pendingTasks: 0,
    activeMaintenance: 0,
    collectionRate: 98.5,
    tenantSatisfaction: 4.7,
  });

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [dashData, propsData, tasksData, maintData] = await Promise.all([
        managementAPI.getDashboardCharts(timeRange).catch(() => generateDashboardData()),
        managementAPI.getProperties().catch(() => generateProperties()),
        managementAPI.getTasks().catch(() => generateTasks()),
        managementAPI.getMaintenance().catch(() => generateMaintenance()),
      ]);

      setDashboardData(dashData);
      setProperties(propsData.data || propsData);
      setTasks(tasksData.data || tasksData);
      setMaintenance(maintData.data || maintData);
      calculateStats(propsData.data || propsData, tasksData.data || tasksData, maintData.data || maintData);
    } catch (error) {
      console.error('Failed to load data:', error);
      const mockProps = generateProperties();
      const mockTasks = generateTasks();
      const mockMaint = generateMaintenance();
      setDashboardData(generateDashboardData());
      setProperties(mockProps);
      setTasks(mockTasks);
      setMaintenance(mockMaint);
      calculateStats(mockProps, mockTasks, mockMaint);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (props, tasksData, maintData) => {
    const totalProps = props.length;
    const occupied = props.filter(p => p.status === 'occupied').length;
    const totalRev = props.reduce((sum, p) => sum + (p.rent || 0), 0);
    const pendingTasks = tasksData.filter(t => t.status === 'pending').length;
    const activeMaint = maintData.filter(m => m.status === 'pending' || m.status === 'in_progress').length;

    setStats({
      totalProperties: totalProps,
      occupiedProperties: occupied,
      vacancyRate: ((totalProps - occupied) / totalProps * 100).toFixed(1),
      totalRevenue: totalRev,
      pendingTasks,
      activeMaintenance: activeMaint,
      collectionRate: 98.5,
      tenantSatisfaction: 4.7,
    });
  };

  const generateDashboardData = () => ({
    monthlyRevenue: Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      revenue: Math.floor(Math.random() * 50000) + 80000,
      expenses: Math.floor(Math.random() * 30000) + 50000,
    })),
    occupancyTrend: Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      occupancy: 85 + Math.random() * 15,
    })),
    propertyStatus: [
      { name: 'Occupied', value: 42, color: '#10b981' },
      { name: 'Vacant', value: 6, color: '#f59e0b' },
      { name: 'Maintenance', value: 2, color: '#ef4444' },
    ],
    taskStatus: [
      { name: 'Completed', value: 45, color: '#10b981' },
      { name: 'In Progress', value: 23, color: '#3b82f6' },
      { name: 'Pending', value: 12, color: '#f59e0b' },
    ],
    maintenancePriority: [
      { name: 'Emergency', value: 3, color: '#ef4444' },
      { name: 'Urgent', value: 7, color: '#f97316' },
      { name: 'Routine', value: 15, color: '#10b981' },
    ],
    recentActivities: [
      { id: 1, type: 'lease_signed', property: '123 Main St', tenant: 'John Smith', time: '2 hours ago' },
      { id: 2, type: 'payment_received', property: '456 Oak Ave', amount: 2500, time: '4 hours ago' },
      { id: 3, type: 'maintenance_completed', property: '789 Pine Rd', issue: 'Plumbing', time: '1 day ago' },
    ],
  });

  const generateProperties = () => {
    const addresses = ['123 Main St', '456 Oak Ave', '789 Pine Rd', '101 Maple Dr', '202 Elm Blvd', '303 Cedar Ln'];
    return addresses.map((addr, i) => ({
      id: `prop-${i + 1}`,
      address: addr,
      status: i < 4 ? 'occupied' : 'vacant',
      type: i % 2 === 0 ? 'apartment' : 'house',
      bedrooms: Math.floor(Math.random() * 4) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      rent: Math.floor(Math.random() * 5000) + 2000,
      tenants: Math.floor(Math.random() * 4) + 1,
      lastInspection: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      maintenanceRequests: Math.floor(Math.random() * 5),
    }));
  };

  const generateTasks = () => {
    const taskTypes = ['inspection', 'maintenance', 'administrative', 'tenant', 'financial'];
    const priorities = ['urgent', 'high', 'medium', 'low'];
    return Array.from({ length: 10 }, (_, i) => ({
      id: `task-${i + 1}`,
      title: `${taskTypes[i % taskTypes.length]} task`,
      type: taskTypes[i % taskTypes.length],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: Math.random() > 0.5 ? 'pending' : 'in_progress',
      dueDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      property: `Property ${Math.floor(Math.random() * 6) + 1}`,
    }));
  };

  const generateMaintenance = () => {
    const issues = ['Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Structural'];
    const priorities = ['emergency', 'urgent', 'routine'];
    return Array.from({ length: 8 }, (_, i) => ({
      id: `maint-${i + 1}`,
      property: `Property ${Math.floor(Math.random() * 6) + 1}`,
      issue: issues[i % issues.length],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: Math.random() > 0.5 ? 'pending' : 'in_progress',
      reportedDate: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedCost: Math.floor(Math.random() * 2000) + 500,
    }));
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = p.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = propertyFilters.status === 'all' || p.status === propertyFilters.status;
      const matchesType = propertyFilters.type === 'all' || p.type === propertyFilters.type;
      const matchesRent = p.rent >= propertyFilters.minRent && p.rent <= propertyFilters.maxRent;
      return matchesSearch && matchesStatus && matchesType && matchesRent;
    });
  }, [properties, searchTerm, propertyFilters]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = taskFilters.status === 'all' || t.status === taskFilters.status;
      const matchesPriority = taskFilters.priority === 'all' || t.priority === taskFilters.priority;
      const matchesType = taskFilters.type === 'all' || t.type === taskFilters.type;
      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });
  }, [tasks, searchTerm, taskFilters]);

  const filteredMaintenance = useMemo(() => {
    return maintenance.filter(m => {
      const matchesSearch = m.issue.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = maintenanceFilters.status === 'all' || m.status === maintenanceFilters.status;
      const matchesPriority = maintenanceFilters.priority === 'all' || m.priority === maintenanceFilters.priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [maintenance, searchTerm, maintenanceFilters]);

  const exportToCSV = (data, filename) => {
    if (!data.length) return;
    const csv = [Object.keys(data[0]).join(','), ...data.map(row => Object.values(row).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  if (loading && !dashboardData) {
    return <div className="min-h-screen bg-gray-50 p-8"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentUser={{ name: 'John Manager', role: 'Property Manager' }} />
      
      <div className="md:ml-64">
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Management Dashboard</h1>
                <p className="mt-2 text-gray-600">Overview of your property management operations</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-3">
                <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
                <button onClick={loadAllData} disabled={loading} className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon={Building} label="Total Properties" value={stats.totalProperties} trend={`${stats.occupiedProperties} occupied`} color="blue" />
              <StatCard icon={DollarSign} label="Monthly Revenue" value={`$${(stats.totalRevenue).toLocaleString()}`} trend="+12.5%" color="green" />
              <StatCard icon={Clock} label="Pending Tasks" value={stats.pendingTasks} trend={`${tasks.filter(t => t.priority === 'urgent').length} urgent`} color="yellow" />
              <StatCard icon={Activity} label="Active Maintenance" value={stats.activeMaintenance} trend={`${maintenance.filter(m => m.priority === 'emergency').length} emergency`} color="red" />
            </div>

            {/* Navigation Tabs */}
            <div className="mb-8 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {['overview', 'properties', 'tasks', 'maintenance', 'financial', 'analytics'].map((tab) => (
                  <button key={tab} onClick={() => setViewMode(tab)} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${viewMode === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Overview Tab */}
            {viewMode === 'overview' && dashboardData && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <ChartCard title="Monthly Revenue & Expenses">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dashboardData.monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#3b82f6" />
                        <Bar dataKey="expenses" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Occupancy Trend">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dashboardData.occupancyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="occupancy" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <ChartCard title="Property Status">
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPie data={dashboardData.propertyStatus} innerRadius={60} outerRadius={100}>
                        {dashboardData.propertyStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Task Status">
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPie data={dashboardData.taskStatus} innerRadius={60} outerRadius={100}>
                        {dashboardData.taskStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Maintenance Priority">
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPie data={dashboardData.maintenancePriority} innerRadius={60} outerRadius={100}>
                        {dashboardData.maintenancePriority.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>
              </div>
            )}

            {/* Properties Tab */}
            {viewMode === 'properties' && (
              <DataTableSection title="Properties" data={filteredProperties} columns={['address', 'status', 'type', 'rent', 'tenants']} filters={propertyFilters} setFilters={setPropertyFilters} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onExport={() => exportToCSV(filteredProperties, 'properties.csv')} />
            )}

            {/* Tasks Tab */}
            {viewMode === 'tasks' && (
              <DataTableSection title="Tasks" data={filteredTasks} columns={['title', 'type', 'priority', 'status', 'dueDate']} filters={taskFilters} setFilters={setTaskFilters} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onExport={() => exportToCSV(filteredTasks, 'tasks.csv')} />
            )}

            {/* Maintenance Tab */}
            {viewMode === 'maintenance' && (
              <DataTableSection title="Maintenance Requests" data={filteredMaintenance} columns={['property', 'issue', 'priority', 'status', 'estimatedCost']} filters={maintenanceFilters} setFilters={setMaintenanceFilters} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onExport={() => exportToCSV(filteredMaintenance, 'maintenance.csv')} />
            )}

            {/* Financial Tab */}
            {viewMode === 'financial' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FinancialCard title="Total Revenue" value="$125,000" change="+12.5%" />
                  <FinancialCard title="Total Expenses" value="$85,000" change="-5.1%" />
                  <FinancialCard title="Net Income" value="$40,000" change="+8.7%" />
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {viewMode === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <ChartCard title="Property Distribution">
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPie data={dashboardData?.propertyStatus || []}>
                        {dashboardData?.propertyStatus?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm text-green-600">
        <TrendingUp className="w-4 h-4 mr-1" />
        <span>{trend}</span>
      </div>
    </div>
  );
};

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

const FinancialCard = ({ title, value, change }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <p className="text-sm font-medium text-gray-600">{title}</p>
    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    <p className="text-sm text-green-600 mt-2">{change} from last month</p>
  </div>
);

const DataTableSection = ({ title, data, columns, filters, setFilters, searchTerm, setSearchTerm, onExport }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="flex items-center space-x-3">
        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button onClick={onExport} className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200">
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {col.replace(/([A-Z])/g, ' $1').trim()}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {typeof row[col] === 'boolean' ? (row[col] ? 'Yes' : 'No') : row[col]}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="mt-4 text-sm text-gray-500">
      Showing {data.length} results
    </div>
  </div>
);

export default ManagementDashboard;
