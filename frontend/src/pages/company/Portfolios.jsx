import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Building,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  BarChart3,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const CompanyPortfolios = () => {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    region: 'all'
  });
  const [selectedPortfolios, setSelectedPortfolios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [expandedPortfolios, setExpandedPortfolios] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'residential',
    region: '',
    manager: '',
    properties: [],
    targetROI: '',
    riskLevel: 'medium',
    status: 'active',
    color: '#3B82F6'
  });
  const itemsPerPage = 10;

  const portfolioTypes = [
    { value: 'residential', label: 'Residential', color: 'bg-blue-100 text-blue-800' },
    { value: 'commercial', label: 'Commercial', color: 'bg-green-100 text-green-800' },
    { value: 'mixed_use', label: 'Mixed Use', color: 'bg-purple-100 text-purple-800' },
    { value: 'vacation', label: 'Vacation Rental', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'luxury', label: 'Luxury', color: 'bg-pink-100 text-pink-800' },
    { value: 'affordable', label: 'Affordable Housing', color: 'bg-indigo-100 text-indigo-800' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'planning', label: 'Planning', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'under_development', label: 'Under Development', color: 'bg-blue-100 text-blue-800' },
    { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
    { value: 'sold', label: 'Sold', color: 'bg-red-100 text-red-800' },
  ];

  const riskLevels = [
    { value: 'low', label: 'Low Risk', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium Risk', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High Risk', color: 'bg-red-100 text-red-800' },
  ];

  const regions = [
    'North America',
    'Europe',
    'Asia Pacific',
    'Middle East',
    'Africa',
    'Latin America',
    'Australia'
  ];

  useEffect(() => {
    loadPortfolios();
  }, []);

  useEffect(() => {
    filterPortfolios();
  }, [portfolios, searchTerm, filters]);

  const loadPortfolios = async () => {
    setLoading(true);
    try {
      const data = await getPortfolios();
      setPortfolios(data);
    } catch (error) {
      console.error('Failed to load portfolios:', error);
      // Use sample data for demo
      setPortfolios(generateSamplePortfolios());
    } finally {
      setLoading(false);
    }
  };

  const generateSamplePortfolios = () => {
    const portfolios = [];
    const names = [
      'Urban Residential Portfolio',
      'Commercial Office Spaces',
      'Luxury Vacation Properties',
      'Affordable Housing Initiative',
      'Mixed-Use Development',
      'Student Housing Portfolio',
      'Senior Living Communities',
      'Industrial Warehouse Portfolio',
      'Retail Center Portfolio',
      'Medical Office Buildings'
    ];
    
    const managers = [
      'John Smith',
      'Sarah Johnson',
      'Mike Wilson',
      'Emily Davis',
      'Robert Brown'
    ];
    
    for (let i = 0; i < 8; i++) {
      const type = portfolioTypes[Math.floor(Math.random() * portfolioTypes.length)].value;
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)].value;
      const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)].value;
      const region = regions[Math.floor(Math.random() * regions.length)];
      const totalProperties = Math.floor(Math.random() * 50) + 10;
      const occupiedProperties = Math.floor(totalProperties * (0.7 + Math.random() * 0.25));
      const totalValue = Math.floor(Math.random() * 50000000) + 10000000;
      const monthlyRevenue = Math.floor(totalValue * 0.005);
      const annualROI = 5 + Math.random() * 10;
      const performance = 70 + Math.random() * 30;
      
      portfolios.push({
        id: `portfolio-${i + 1}`,
        name: names[i],
        description: `A portfolio of ${type.replace('_', ' ')} properties focusing on ${region.toLowerCase()} market.`,
        type,
        status,
        riskLevel,
        region,
        manager: managers[Math.floor(Math.random() * managers.length)],
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        
        // Statistics
        stats: {
          totalProperties,
          occupiedProperties,
          vacancyRate: ((totalProperties - occupiedProperties) / totalProperties * 100).toFixed(1),
          totalValue,
          monthlyRevenue,
          annualExpenses: monthlyRevenue * 12 * 0.6,
          netIncome: monthlyRevenue * 12 * 0.4,
          annualROI: annualROI.toFixed(1),
          performance: performance.toFixed(1),
          avgPropertyValue: Math.floor(totalValue / totalProperties),
          avgMonthlyRent: Math.floor(monthlyRevenue / occupiedProperties),
        },
        
        // Performance metrics
        performance: {
          occupancyTrend: Math.random() > 0.5 ? 'up' : 'down',
          revenueTrend: Math.random() > 0.5 ? 'up' : 'down',
          valuationTrend: Math.random() > 0.5 ? 'up' : 'down',
          occupancyChange: (Math.random() * 10 - 5).toFixed(1),
          revenueChange: (Math.random() * 15 - 5).toFixed(1),
          valuationChange: (Math.random() * 20 - 5).toFixed(1),
        },
        
        // Properties in portfolio (simplified)
        properties: Array.from({ length: Math.min(5, totalProperties) }, (_, j) => ({
          id: `prop-${i}-${j}`,
          name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${j + 1}`,
          address: `${j + 100} Main St, City ${j + 1}`,
          status: j % 4 === 0 ? 'available' : 'occupied',
          value: Math.floor(Math.random() * 2000000) + 500000,
          monthlyRent: Math.floor(Math.random() * 10000) + 2000,
        })),
        
        // Goals
        goals: {
          targetROI: (annualROI + 2).toFixed(1),
          targetProperties: totalProperties + 5,
          targetRevenue: monthlyRevenue * 1.2,
          timeline: '12 months',
        },
      });
    }
    
    return portfolios;
  };

  const filterPortfolios = () => {
    let filtered = [...portfolios];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(portfolio => 
        portfolio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        portfolio.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        portfolio.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
        portfolio.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(portfolio => portfolio.status === filters.status);
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(portfolio => portfolio.type === filters.type);
    }

    // Region filter
    if (filters.region !== 'all') {
      filtered = filtered.filter(portfolio => portfolio.region === filters.region);
    }

    setFilteredPortfolios(filtered);
    setCurrentPage(1);
  };

  const handleSelectPortfolio = (portfolioId) => {
    if (selectedPortfolios.includes(portfolioId)) {
      setSelectedPortfolios(selectedPortfolios.filter(id => id !== portfolioId));
    } else {
      setSelectedPortfolios([...selectedPortfolios, portfolioId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedPortfolios.length === paginatedPortfolios.length) {
      setSelectedPortfolios([]);
    } else {
      setSelectedPortfolios(paginatedPortfolios.map(portfolio => portfolio.id));
    }
  };

  const togglePortfolioExpansion = (portfolioId) => {
    if (expandedPortfolios.includes(portfolioId)) {
      setExpandedPortfolios(expandedPortfolios.filter(id => id !== portfolioId));
    } else {
      setExpandedPortfolios([...expandedPortfolios, portfolioId]);
    }
  };

  const handleCreatePortfolio = async () => {
    try {
      await createPortfolio(formData);
      loadPortfolios();
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create portfolio:', error);
    }
  };

  const handleUpdatePortfolio = async () => {
    if (!editingPortfolio) return;
    
    try {
      await updatePortfolio(editingPortfolio.id, formData);
      loadPortfolios();
      setShowEditModal(false);
      setEditingPortfolio(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update portfolio:', error);
    }
  };

  const handleDeletePortfolio = async () => {
    if (!portfolioToDelete) return;
    
    try {
      await deletePortfolio(portfolioToDelete.id);
      loadPortfolios();
      setShowDeleteModal(false);
      setPortfolioToDelete(null);
    } catch (error) {
      console.error('Failed to delete portfolio:', error);
    }
  };

  const handleExportPortfolio = async (portfolioId) => {
    try {
      const portfolio = portfolios.find(p => p.id === portfolioId);
      if (portfolio) {
        await exportPortfolio(portfolio);
      }
    } catch (error) {
      console.error('Failed to export portfolio:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'residential',
      region: '',
      manager: '',
      properties: [],
      targetROI: '',
      riskLevel: 'medium',
      status: 'active',
      color: '#3B82F6'
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredPortfolios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPortfolios = filteredPortfolios.slice(startIndex, startIndex + itemsPerPage);

  const getTrendIcon = (trend) => {
    if (trend === 'up') {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Portfolios</h1>
              <p className="mt-2 text-gray-600">
                Manage and analyze your property portfolios
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={() => {/* Bulk export */}}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Portfolio
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { 
              label: 'Total Portfolios', 
              value: portfolios.length,
              change: '+2',
              color: 'blue'
            },
            { 
              label: 'Total Properties', 
              value: portfolios.reduce((sum, p) => sum + p.stats.totalProperties, 0),
              change: '+12',
              color: 'green'
            },
            { 
              label: 'Total Value', 
              value: `$${(portfolios.reduce((sum, p) => sum + p.stats.totalValue, 0) / 1000000).toFixed(1)}M`,
              change: '+5.2%',
              color: 'purple'
            },
            { 
              label: 'Avg ROI', 
              value: `${(portfolios.reduce((sum, p) => sum + parseFloat(p.stats.annualROI), 0) / portfolios.length).toFixed(1)}%`,
              change: '+0.8%',
              color: 'orange'
            },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <div className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'} flex items-center mt-2`}>
                {stat.change.startsWith('+') ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search portfolios by name, manager, or region..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setFilters({ status: 'all', type: 'all', region: 'all' })}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Reset
              </button>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
                
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  {portfolioTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                
                <select
                  value={filters.region}
                  onChange={(e) => setFilters({...filters, region: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Regions</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolios List */}
        <div className="space-y-6">
          {paginatedPortfolios.map((portfolio) => {
            const isExpanded = expandedPortfolios.includes(portfolio.id);
            
            return (
              <div key={portfolio.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Portfolio Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: portfolio.color }}
                      >
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">{portfolio.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              portfolioTypes.find(t => t.value === portfolio.type)?.color || 'bg-gray-100 text-gray-800'
                            }`}>
                              {portfolioTypes.find(t => t.value === portfolio.type)?.label || portfolio.type}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              statusOptions.find(s => s.value === portfolio.status)?.color || 'bg-gray-100 text-gray-800'
                            }`}>
                              {statusOptions.find(s => s.value === portfolio.status)?.label || portfolio.status}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              riskLevels.find(r => r.value === portfolio.riskLevel)?.color || 'bg-gray-100 text-gray-800'
                            }`}>
                              {riskLevels.find(r => r.value === portfolio.riskLevel)?.label || portfolio.riskLevel}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{portfolio.description}</p>
                        <div className="flex items-center space-x-4 mt-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            {portfolio.region}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-1" />
                            Managed by {portfolio.manager}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            Created {new Date(portfolio.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedPortfolios.includes(portfolio.id)}
                        onChange={() => handleSelectPortfolio(portfolio.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => togglePortfolioExpansion(portfolio.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Properties</p>
                      <p className="text-lg font-bold text-gray-900">{portfolio.stats.totalProperties}</p>
                      <p className="text-xs text-gray-500">{portfolio.stats.occupiedProperties} occupied</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Total Value</p>
                      <p className="text-lg font-bold text-gray-900">
                        ${(portfolio.stats.totalValue / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Monthly Revenue</p>
                      <p className="text-lg font-bold text-gray-900">
                        ${portfolio.stats.monthlyRevenue.toLocaleString()}
                      </p>
                      <div className="flex items-center text-xs">
                        {getTrendIcon(portfolio.performance.revenueTrend)}
                        <span className={`ml-1 ${portfolio.performance.revenueChange.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                          {portfolio.performance.revenueChange}%
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Annual ROI</p>
                      <p className="text-lg font-bold text-gray-900">{portfolio.stats.annualROI}%</p>
                      <p className="text-xs text-gray-500">Target: {portfolio.goals.targetROI}%</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Vacancy Rate</p>
                      <p className="text-lg font-bold text-gray-900">{portfolio.stats.vacancyRate}%</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Performance</p>
                      <p className={`text-lg font-bold ${getPerformanceColor(parseFloat(portfolio.stats.performance)).split(' ')[1]}`}>
                        {portfolio.stats.performance}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Properties List */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">Properties in Portfolio</h4>
                        <div className="space-y-3">
                          {portfolio.properties.map((property, index) => (
                            <div key={property.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                              <div>
                                <p className="font-medium text-gray-900">{property.name}</p>
                                <p className="text-sm text-gray-600">{property.address}</p>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  property.status === 'occupied' 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {property.status}
                                </span>
                                <span className="font-medium">
                                  ${property.monthlyRent.toLocaleString()}/mo
                                </span>
                              </div>
                            </div>
                          ))}
                          <button className="w-full py-2 text-center text-blue-600 hover:text-blue-800 border border-dashed border-gray-300 rounded-lg">
                            + Add More Properties
                          </button>
                        </div>
                      </div>

                      {/* Performance and Goals */}
                      <div>
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Performance Trends</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Occupancy Rate</span>
                              <div className="flex items-center">
                                {getTrendIcon(portfolio.performance.occupancyTrend)}
                                <span className={`ml-2 font-medium ${
                                  portfolio.performance.occupancyChange.startsWith('-') 
                                    ? 'text-red-600' 
                                    : 'text-green-600'
                                }`}>
                                  {portfolio.performance.occupancyChange}%
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Revenue Growth</span>
                              <div className="flex items-center">
                                {getTrendIcon(portfolio.performance.revenueTrend)}
                                <span className={`ml-2 font-medium ${
                                  portfolio.performance.revenueChange.startsWith('-') 
                                    ? 'text-red-600' 
                                    : 'text-green-600'
                                }`}>
                                  {portfolio.performance.revenueChange}%
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Valuation Change</span>
                              <div className="flex items-center">
                                {getTrendIcon(portfolio.performance.valuationTrend)}
                                <span className={`ml-2 font-medium ${
                                  portfolio.performance.valuationChange.startsWith('-') 
                                    ? 'text-red-600' 
                                    : 'text-green-600'
                                }`}>
                                  {portfolio.performance.valuationChange}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Portfolio Goals</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Target ROI</span>
                              <span className="font-medium">{portfolio.goals.targetROI}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Target Properties</span>
                              <span className="font-medium">{portfolio.goals.targetProperties}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Target Monthly Revenue</span>
                              <span className="font-medium">
                                ${portfolio.goals.targetRevenue.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Timeline</span>
                              <span className="font-medium">{portfolio.goals.timeline}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => handleExportPortfolio(portfolio.id)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </button>
                      <button
                        onClick={() => {
                          setEditingPortfolio(portfolio);
                          setFormData({
                            name: portfolio.name,
                            description: portfolio.description,
                            type: portfolio.type,
                            region: portfolio.region,
                            manager: portfolio.manager,
                            properties: portfolio.properties,
                            targetROI: portfolio.goals.targetROI,
                            riskLevel: portfolio.riskLevel,
                            status: portfolio.status,
                            color: portfolio.color
                          });
                          setShowEditModal(true);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPortfolio(portfolio);
                          setShowDetailsModal(true);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          setPortfolioToDelete(portfolio);
                          setShowDeleteModal(true);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {filteredPortfolios.length > itemsPerPage && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-8 rounded-lg">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredPortfolios.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredPortfolios.length}</span> portfolios
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronUp className="h-5 w-5 rotate-90" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronUp className="h-5 w-5 -rotate-90" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Create Portfolio Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Create New Portfolio</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    &times;
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Urban Residential Portfolio"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the portfolio..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio Type *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {portfolioTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Region *
                      </label>
                      <select
                        value={formData.region}
                        onChange={(e) => setFormData({...formData, region: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select region</option>
                        {regions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio Manager *
                      </label>
                      <input
                        type="text"
                        value={formData.manager}
                        onChange={(e) => setFormData({...formData, manager: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., John Smith"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target ROI (%)
                      </label>
                      <input
                        type="number"
                        value={formData.targetROI}
                        onChange={(e) => setFormData({...formData, targetROI: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 8.5"
                        step="0.1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Risk Level
                      </label>
                      <select
                        value={formData.riskLevel}
                        onChange={(e) => setFormData({...formData, riskLevel: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {riskLevels.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {statusOptions.map(status => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={formData.color}
                          onChange={(e) => setFormData({...formData, color: e.target.value})}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.color}
                          onChange={(e) => setFormData({...formData, color: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="#3B82F6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePortfolio}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Create Portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Portfolio Modal */}
        {showEditModal && editingPortfolio && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Edit Portfolio</h3>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingPortfolio(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    &times;
                  </button>
                </div>
                
                {/* Same form fields as create modal */}
                <div className="space-y-6">
                  {/* Form fields would go here - same as create modal */}
                </div>
                
                <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingPortfolio(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdatePortfolio}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Update Portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && portfolioToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Delete Portfolio</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Are you sure you want to delete "{portfolioToDelete.name}"?
                    </p>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-800">
                    This action cannot be undone. All properties in this portfolio will be moved to 
                    "Uncategorized" and all associated data will be permanently deleted.
                  </p>
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setPortfolioToDelete(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeletePortfolio}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                  >
                    Delete Portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Details Modal */}
        {showDetailsModal && selectedPortfolio && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-14 h-14 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: selectedPortfolio.color }}
                    >
                      <Building className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedPortfolio.name}</h3>
                      <p className="text-gray-600 mt-1">{selectedPortfolio.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedPortfolio(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    &times;
                  </button>
                </div>
                
                {/* Detailed portfolio view would go here */}
                <div className="mt-6">
                  <p>Detailed portfolio information and analytics...</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolios;