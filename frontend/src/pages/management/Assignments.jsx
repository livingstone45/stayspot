import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Building,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Download,
  Upload,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MessageSquare,
  Share2,
  BarChart3,
  UserCheck,
  UserX
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AssignmentCalendar from '../../../components/assignments/AssignmentCalendar';
import AssignmentFilters from '../../../components/assignments/AssignmentFilters';
import TeamMemberList from '../../../components/assignments/TeamMemberList';
import AssignmentAnalytics from '../../../components/assignments/AssignmentAnalytics';

const Assignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    assignee: 'all',
    property: 'all',
    dateRange: 'all',
    type: 'all',
  });
  const [viewMode, setViewMode] = useState('calendar'); // calendar, list, grid
  const [selectedAssignments, setSelectedAssignments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const assignmentTypes = [
    { id: 'maintenance', label: 'Maintenance', color: 'bg-blue-100 text-blue-800' },
    { id: 'inspection', label: 'Inspection', color: 'bg-green-100 text-green-800' },
    { id: 'showing', label: 'Property Showing', color: 'bg-purple-100 text-purple-800' },
    { id: 'meeting', label: 'Meeting', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'training', label: 'Training', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' },
  ];

  const statusOptions = [
    { id: 'scheduled', label: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
    { id: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { id: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { id: 'no_show', label: 'No Show', color: 'bg-gray-100 text-gray-800' },
  ];

  const properties = [
    { id: 'property-1', name: '123 Main St', type: 'apartment' },
    { id: 'property-2', name: '456 Oak Ave', type: 'house' },
    { id: 'property-3', name: '789 Pine Rd', type: 'condo' },
    { id: 'property-4', name: '101 Maple Dr', type: 'commercial' },
  ];

  useEffect(() => {
    loadAssignments();
    loadTeamMembers();
  }, []);

  useEffect(() => {
    filterAndSortAssignments();
  }, [assignments, searchTerm, filters, sortBy, sortOrder]);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const data = await getAssignments();
      setAssignments(data);
    } catch (error) {
      console.error('Failed to load assignments:', error);
      setAssignments(generateSampleAssignments(25));
    } finally {
      setLoading(false);
    }
  };

  const loadTeamMembers = async () => {
    try {
      const data = await getTeamMembers();
      setTeamMembers(data);
    } catch (error) {
      console.error('Failed to load team members:', error);
      setTeamMembers(generateSampleTeamMembers());
    }
  };

  const generateSampleAssignments = (count) => {
    const assignments = [];
    const today = new Date();
    
    for (let i = 0; i < count; i++) {
      const type = assignmentTypes[Math.floor(Math.random() * assignmentTypes.length)];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      const property = properties[Math.floor(Math.random() * properties.length)];
      const assignee = teamMembers[Math.floor(Math.random() * teamMembers.length)] || teamMembers[0];
      
      // Generate random dates
      const startDate = new Date(today);
      startDate.setDate(today.getDate() + Math.floor(Math.random() * 30));
      startDate.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 4) * 15, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + Math.floor(Math.random() * 4) + 1);
      
      assignments.push({
        id: `assignment-${i + 1}`,
        title: `${type.label} at ${property.name}`,
        description: `Complete ${type.label.toLowerCase()} assignment at ${property.name}. Please ensure all tasks are completed according to standards.`,
        type: type.id,
        status: status.id,
        assignee: assignee.id,
        property: property.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        duration: Math.round((endDate - startDate) / (1000 * 60 * 60) * 10) / 10, // hours
        priority: Math.random() > 0.7 ? 'high' : 'normal',
        notes: Math.random() > 0.5 ? 'Bring necessary equipment and documents.' : null,
        completedNotes: status.id === 'completed' ? 'Assignment completed successfully. All tasks checked.' : null,
        completedAt: status.id === 'completed' ? endDate.toISOString() : null,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    
    return assignments;
  };

  const generateSampleTeamMembers = () => {
    return [
      { id: 'member-1', name: 'John Smith', role: 'Maintenance Supervisor', email: 'john@stayspot.com', phone: '+1 (555) 123-4567', status: 'active', avatar: null },
      { id: 'member-2', name: 'Sarah Johnson', role: 'Property Inspector', email: 'sarah@stayspot.com', phone: '+1 (555) 987-6543', status: 'active', avatar: null },
      { id: 'member-3', name: 'Mike Wilson', role: 'Maintenance Technician', email: 'mike@stayspot.com', phone: '+1 (555) 456-7890', status: 'active', avatar: null },
      { id: 'member-4', name: 'Emily Davis', role: 'Showing Agent', email: 'emily@stayspot.com', phone: '+1 (555) 234-5678', status: 'active', avatar: null },
      { id: 'member-5', name: 'Robert Brown', role: 'Training Coordinator', email: 'robert@stayspot.com', phone: '+1 (555) 345-6789', status: 'inactive', avatar: null },
    ];
  };

  const filterAndSortAssignments = () => {
    let filtered = [...assignments];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(assignment => assignment.status === filters.status);
    }

    // Assignee filter
    if (filters.assignee !== 'all') {
      filtered = filtered.filter(assignment => assignment.assignee === filters.assignee);
    }

    // Property filter
    if (filters.property !== 'all') {
      filtered = filtered.filter(assignment => assignment.property === filters.property);
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(assignment => assignment.type === filters.type);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate, endDate;
      
      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'tomorrow':
          startDate = new Date(now);
          startDate.setDate(now.getDate() + 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'this_week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - now.getDay());
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'next_week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - now.getDay() + 7);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'past':
          endDate = new Date(now);
          endDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(assignment => new Date(assignment.endDate) < endDate);
          break;
      }
      
      if (filters.dateRange !== 'past') {
        filtered = filtered.filter(assignment => {
          const assignmentDate = new Date(assignment.startDate);
          return assignmentDate >= startDate && assignmentDate <= endDate;
        });
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.startDate).getTime();
          bValue = new Date(b.startDate).getTime();
          break;
        case 'status':
          const statusOrder = { scheduled: 0, in_progress: 1, completed: 2, cancelled: 3, no_show: 4 };
          aValue = statusOrder[a.status] || 5;
          bValue = statusOrder[b.status] || 5;
          break;
        case 'priority':
          const priorityOrder = { high: 0, normal: 1 };
          aValue = priorityOrder[a.priority] || 2;
          bValue = priorityOrder[b.priority] || 2;
          break;
        case 'assignee':
          const assigneeA = teamMembers.find(m => m.id === a.assignee)?.name || '';
          const assigneeB = teamMembers.find(m => m.id === b.assignee)?.name || '';
          aValue = assigneeA.toLowerCase();
          bValue = assigneeB.toLowerCase();
          break;
        default:
          aValue = a.startDate;
          bValue = b.startDate;
      }
      
      return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    setFilteredAssignments(filtered);
    setCurrentPage(1);
  };

  const handleSelectAssignment = (assignmentId) => {
    if (selectedAssignments.includes(assignmentId)) {
      setSelectedAssignments(selectedAssignments.filter(id => id !== assignmentId));
    } else {
      setSelectedAssignments([...selectedAssignments, assignmentId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedAssignments.length === paginatedAssignments.length) {
      setSelectedAssignments([]);
    } else {
      setSelectedAssignments(paginatedAssignments.map(assignment => assignment.id));
    }
  };

  const handleUpdateStatus = async (assignmentId, newStatus) => {
    try {
      await updateAssignment(assignmentId, { status: newStatus });
      loadAssignments();
    } catch (error) {
      console.error('Failed to update assignment status:', error);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(assignmentId);
        loadAssignments();
      } catch (error) {
        console.error('Failed to delete assignment:', error);
      }
    }
  };

  const handleExportAssignments = async (format) => {
    try {
      await exportAssignments({
        format,
        assignments: selectedAssignments.length > 0 ? selectedAssignments : filteredAssignments,
      });
    } catch (error) {
      console.error('Failed to export assignments:', error);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssignments = filteredAssignments.slice(startIndex, startIndex + itemsPerPage);

  const getAssignmentStats = () => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const stats = {
      total: assignments.length,
      scheduled: assignments.filter(a => a.status === 'scheduled').length,
      inProgress: assignments.filter(a => a.status === 'in_progress').length,
      completed: assignments.filter(a => a.status === 'completed').length,
      today: assignments.filter(a => {
        const assignmentDate = new Date(a.startDate);
        return assignmentDate >= today && assignmentDate <= new Date(today.getTime() + 24 * 60 * 60 * 1000);
      }).length,
      overdue: assignments.filter(a => 
        new Date(a.endDate) < now && 
        !['completed', 'cancelled'].includes(a.status)
      ).length,
    };
    
    stats.completionRate = stats.total > 0 ? (stats.completed / stats.total * 100).toFixed(1) : 0;
    
    return stats;
  };

  const stats = getAssignmentStats();

  const getAssigneeName = (assigneeId) => {
    const member = teamMembers.find(m => m.id === assigneeId);
    return member ? member.name : 'Unassigned';
  };

  const getPropertyName = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : 'No Property';
  };

  if (loading && assignments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
              <p className="mt-2 text-gray-600">
                Schedule and manage team assignments across properties
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </button>
              <button
                onClick={() => setShowTeamModal(true)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Manage Team
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Assignment
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Panel */}
        {showAnalytics && (
          <AssignmentAnalytics assignments={assignments} teamMembers={teamMembers} />
        )}

        {/* Assignment Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Total Assignments</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Scheduled</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.scheduled}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.inProgress}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completed}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Today</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.today}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Overdue</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.overdue}</p>
          </div>
        </div>

        {/* Team Member Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
            <button
              onClick={() => setShowTeamModal(true)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {teamMembers.slice(0, 5).map((member) => {
              const memberAssignments = assignments.filter(a => a.assignee === member.id);
              const activeAssignments = memberAssignments.filter(a => 
                ['scheduled', 'in_progress'].includes(a.status)
              );
              
              return (
                <div key={member.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-600">Active Assignments</p>
                    <p className="text-lg font-bold text-gray-900">{activeAssignments.length}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assignments by title, description, or assignee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* View Controls */}
            <div className="flex items-center space-x-3">
              <AssignmentFilters
                filters={filters}
                onFilterChange={setFilters}
                teamMembers={teamMembers}
                properties={properties}
                assignmentTypes={assignmentTypes}
                onClearFilters={() => setFilters({
                  status: 'all',
                  assignee: 'all',
                  property: 'all',
                  dateRange: 'all',
                  type: 'all',
                })}
              />
              
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    viewMode === 'calendar'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Calendar
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 text-sm font-medium ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-1" />
                  List
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Building className="w-4 h-4 inline mr-1" />
                  Grid
                </button>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="status">Status</option>
                <option value="priority">Priority</option>
                <option value="assignee">Assignee</option>
              </select>
              
              <button
                onClick={() => handleSort(sortBy)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Selected Assignments Actions */}
        {selectedAssignments.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                <p className="text-sm font-medium text-blue-900">
                  {selectedAssignments.length} assignments selected
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Bulk Update Status
                </button>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Bulk Reassign
                </button>
                <button className="text-sm text-red-600 hover:text-red-800">
                  Bulk Delete
                </button>
                <button
                  onClick={() => setSelectedAssignments([])}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assignments Display */}
        {viewMode === 'calendar' ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Assignment Calendar</h3>
            <AssignmentCalendar assignments={filteredAssignments} teamMembers={teamMembers} />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedAssignments.map((assignment) => {
              const type = assignmentTypes.find(t => t.id === assignment.type);
              const status = statusOptions.find(s => s.id === assignment.status);
              const assignee = teamMembers.find(m => m.id === assignment.assignee);
              const property = properties.find(p => p.id === assignment.property);
              const isOverdue = new Date(assignment.endDate) < new Date() && !['completed', 'cancelled'].includes(assignment.status);
              
              return (
                <div key={assignment.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${type?.color || 'bg-gray-100 text-gray-800'} mb-2`}>
                          {type?.label || 'Assignment'}
                        </span>
                        <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedAssignments.includes(assignment.id)}
                        onChange={() => handleSelectAssignment(assignment.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{assignment.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{assignee?.name || 'Unassigned'}</span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status?.color || 'bg-gray-100 text-gray-800'}`}>
                          {status?.label || assignment.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Building className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{property?.name || 'No Property'}</span>
                      </div>
                      
                      <div className={`flex items-center ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                        <Calendar className="w-4 h-4 mr-2" />
                        <div>
                          <p className="text-sm">
                            {new Date(assignment.startDate).toLocaleDateString()} •{' '}
                            {new Date(assignment.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                            {new Date(assignment.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {isOverdue && (
                            <p className="text-xs text-red-600">Overdue</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{assignment.duration} hours</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleUpdateStatus(assignment.id, assignment.status === 'completed' ? 'scheduled' : 'completed')}
                          className={`p-1 rounded ${
                            assignment.status === 'completed'
                              ? 'text-green-600 hover:text-green-800'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedAssignments.length === paginatedAssignments.length && paginatedAssignments.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedAssignments.map((assignment) => {
                    const type = assignmentTypes.find(t => t.id === assignment.type);
                    const status = statusOptions.find(s => s.id === assignment.status);
                    const assignee = teamMembers.find(m => m.id === assignment.assignee);
                    const property = properties.find(p => p.id === assignment.property);
                    const isOverdue = new Date(assignment.endDate) < new Date() && !['completed', 'cancelled'].includes(assignment.status);
                    
                    return (
                      <tr key={assignment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedAssignments.includes(assignment.id)}
                            onChange={() => handleSelectAssignment(assignment.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">{assignment.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${type?.color || 'bg-gray-100 text-gray-800'}`}>
                            {type?.label || assignment.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{assignee?.name || 'Unassigned'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{property?.name || 'No Property'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                            <p className="text-sm">
                              {new Date(assignment.startDate).toLocaleDateString()}
                            </p>
                            <p className="text-xs">
                              {new Date(assignment.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                              {new Date(assignment.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {isOverdue && (
                              <p className="text-xs text-red-600 mt-1">Overdue</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={assignment.status}
                            onChange={(e) => handleUpdateStatus(assignment.id, e.target.value)}
                            className={`text-xs font-medium px-2 py-1 rounded ${status?.color || 'bg-gray-100 text-gray-800'}`}
                          >
                            {statusOptions.map(s => (
                              <option key={s.id} value={s.id}>{s.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleUpdateStatus(assignment.id, assignment.status === 'completed' ? 'scheduled' : 'completed')}
                              className={`p-1 rounded ${
                                assignment.status === 'completed'
                                  ? 'text-green-600 hover:text-green-800'
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAssignment(assignment.id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredAssignments.length > itemsPerPage && (
          <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredAssignments.length)}</span>{' '}
                  of <span className="font-medium">{filteredAssignments.length}</span> assignments
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronUp className="h-5 w-5 -rotate-90" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || Object.values(filters).some(f => f !== 'all')
                ? 'Try changing your search or filters'
                : 'Get started by creating your first assignment'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Assignment
              </button>
            </div>
          </div>
        )}

        {/* Create Assignment Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Create New Assignment</h3>
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
                      Assignment Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter assignment title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe the assignment details..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assignment Type *
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {assignmentTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assign To *
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select team member</option>
                        {teamMembers.filter(m => m.status === 'active').map(member => (
                          <option key={member.id} value={member.id}>{member.name} ({member.role})</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">No Property</option>
                        {properties.map(property => (
                          <option key={property.id} value={property.id}>{property.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Any additional notes or instructions..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                    Create Assignment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Management Modal */}
        {showTeamModal && (
          <TeamMemberList
            teamMembers={teamMembers}
            onClose={() => setShowTeamModal(false)}
            onTeamUpdate={(updatedTeam) => setTeamMembers(updatedTeam)}
          />
        )}
      </div>
    </div>
  );
};

export default Assignments;