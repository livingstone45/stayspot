import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronUpDownIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const AssignmentBoard = ({
  assignments = [],
  teamMembers = [],
  properties = [],
  onAssignmentUpdate,
  onAssignmentCreate,
  onAssignmentDelete,
  onDragEnd,
  loading = false,
  currentUserRole,
  showFilters = true,
}) => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedTeamMember, setSelectedTeamMember] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    propertyId: '',
    assignedTo: [],
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    estimatedHours: 2,
    category: 'maintenance',
  });
  
  // Status columns
  const columns = [
    { id: 'pending', title: 'Pending', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'assigned', title: 'Assigned', color: 'bg-blue-50 border-blue-200' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-orange-50 border-orange-200' },
    { id: 'review', title: 'Review', color: 'bg-purple-50 border-purple-200' },
    { id: 'completed', title: 'Completed', color: 'bg-green-50 border-green-200' },
  ];
  
  // Priority configuration
  const priorityConfig = {
    high: { label: 'High', color: 'bg-red-100 text-red-800' },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    low: { label: 'Low', color: 'bg-green-100 text-green-800' },
  };
  
  // Category configuration
  const categoryConfig = {
    maintenance: { label: 'Maintenance', icon: '🔧', color: 'bg-orange-100 text-orange-800' },
    inspection: { label: 'Inspection', icon: '🔍', color: 'bg-blue-100 text-blue-800' },
    cleaning: { label: 'Cleaning', icon: '🧹', color: 'bg-green-100 text-green-800' },
    administrative: { label: 'Administrative', icon: '📋', color: 'bg-purple-100 text-purple-800' },
    marketing: { label: 'Marketing', icon: '📢', color: 'bg-pink-100 text-pink-800' },
    financial: { label: 'Financial', icon: '💰', color: 'bg-emerald-100 text-emerald-800' },
  };
  
  // Sample data if none provided
  const sampleAssignments = [
    {
      id: '1',
      title: 'Fix leaky faucet in Unit 3B',
      description: 'Kitchen faucet has been leaking for 2 days',
      propertyId: 'prop1',
      assignedTo: ['user1', 'user2'],
      priority: 'high',
      status: 'assigned',
      dueDate: '2024-01-20',
      estimatedHours: 2,
      actualHours: 0,
      category: 'maintenance',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-16',
      createdBy: 'manager1',
    },
    {
      id: '2',
      title: 'Quarterly property inspection',
      description: 'Complete full property inspection and safety check',
      propertyId: 'prop2',
      assignedTo: ['user3'],
      priority: 'medium',
      status: 'pending',
      dueDate: '2024-01-25',
      estimatedHours: 4,
      actualHours: 0,
      category: 'inspection',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-14',
      createdBy: 'manager1',
    },
    {
      id: '3',
      title: 'Deep clean vacant unit',
      description: 'Prepare unit 5A for new tenant move-in',
      propertyId: 'prop3',
      assignedTo: ['user4'],
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2024-01-18',
      estimatedHours: 6,
      actualHours: 3,
      category: 'cleaning',
      createdAt: '2024-01-13',
      updatedAt: '2024-01-16',
      createdBy: 'manager2',
    },
    {
      id: '4',
      title: 'Update property listing photos',
      description: 'Take new photos for marketing materials',
      propertyId: 'prop1',
      assignedTo: ['user5'],
      priority: 'low',
      status: 'review',
      dueDate: '2024-01-30',
      estimatedHours: 3,
      actualHours: 3,
      category: 'marketing',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-16',
      createdBy: 'manager3',
    },
    {
      id: '5',
      title: 'Monthly rent collection report',
      description: 'Generate and distribute rent collection report',
      propertyId: 'all',
      assignedTo: ['user6'],
      priority: 'medium',
      status: 'completed',
      dueDate: '2024-01-15',
      estimatedHours: 2,
      actualHours: 1.5,
      category: 'financial',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15',
      createdBy: 'manager1',
    },
  ];
  
  const sampleTeamMembers = [
    { id: 'user1', name: 'John Technician', role: 'maintenance_tech', avatar: '' },
    { id: 'user2', name: 'Sarah Manager', role: 'property_manager', avatar: '' },
    { id: 'user3', name: 'Mike Inspector', role: 'maintenance_supervisor', avatar: '' },
    { id: 'user4', name: 'Lisa Cleaner', role: 'maintenance_tech', avatar: '' },
    { id: 'user5', name: 'David Photographer', role: 'marketing_specialist', avatar: '' },
    { id: 'user6', name: 'Emma Accountant', role: 'financial_controller', avatar: '' },
  ];
  
  const sampleProperties = [
    { id: 'prop1', title: 'Ocean View Villa', address: '123 Beach Blvd' },
    { id: 'prop2', title: 'Downtown Loft', address: '456 Main St' },
    { id: 'prop3', title: 'Garden Cottage', address: '789 Oak Ave' },
  ];
  
  const displayAssignments = assignments.length > 0 ? assignments : sampleAssignments;
  const displayTeamMembers = teamMembers.length > 0 ? teamMembers : sampleTeamMembers;
  const displayProperties = properties.length > 0 ? properties : sampleProperties;
  
  // Filter assignments
  const filteredAssignments = displayAssignments.filter(assignment => {
    // Status filter
    if (filter !== 'all' && assignment.status !== filter) return false;
    
    // Property filter
    if (selectedProperty !== 'all' && assignment.propertyId !== selectedProperty) {
      if (assignment.propertyId !== 'all') return false;
    }
    
    // Team member filter
    if (selectedTeamMember !== 'all' && !assignment.assignedTo.includes(selectedTeamMember)) {
      return false;
    }
    
    // Search query
    if (searchQuery && !assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !assignment.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Group assignments by status
  const groupedAssignments = columns.reduce((acc, column) => {
    acc[column.id] = filteredAssignments.filter(a => a.status === column.id);
    return acc;
  }, {});
  
  const getPropertyName = (propertyId) => {
    if (propertyId === 'all') return 'All Properties';
    const property = displayProperties.find(p => p.id === propertyId);
    return property ? property.title : 'Unknown Property';
  };
  
  const getTeamMemberName = (memberId) => {
    const member = displayTeamMembers.find(m => m.id === memberId);
    return member ? member.name : 'Unknown';
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    return due < today && due.toDateString() !== today.toDateString();
  };
  
  const handleCreateAssignment = (e) => {
    e.preventDefault();
    
    if (!newAssignment.title.trim() || !newAssignment.propertyId) {
      alert('Please fill in all required fields');
      return;
    }
    
    const assignmentData = {
      ...newAssignment,
      id: `assign_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: 'current_user',
      actualHours: 0,
    };
    
    if (onAssignmentCreate) {
      onAssignmentCreate(assignmentData);
    }
    
    setNewAssignment({
      title: '',
      description: '',
      propertyId: '',
      assignedTo: [],
      priority: 'medium',
      status: 'pending',
      dueDate: '',
      estimatedHours: 2,
      category: 'maintenance',
    });
    
    setShowCreateForm(false);
  };
  
  const handleStatusChange = (assignmentId, newStatus) => {
    const assignment = displayAssignments.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    const updatedAssignment = { ...assignment, status: newStatus };
    
    if (onAssignmentUpdate) {
      onAssignmentUpdate(assignmentId, updatedAssignment);
    }
  };
  
  const handleDeleteAssignment = (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      if (onAssignmentDelete) {
        onAssignmentDelete(assignmentId);
      }
    }
  };
  
  const canCreateAssignment = ['system_admin', 'company_admin', 'property_manager', 'maintenance_supervisor'].includes(currentUserRole);
  const canEditAssignment = (assignment) => {
    const userRoles = ['system_admin', 'company_admin'];
    if (userRoles.includes(currentUserRole)) return true;
    if (currentUserRole === 'property_manager') return true;
    if (currentUserRole === 'maintenance_supervisor') return assignment.category === 'maintenance';
    return false;
  };
  
  const canDeleteAssignment = (assignment) => {
    const userRoles = ['system_admin', 'company_admin'];
    if (userRoles.includes(currentUserRole)) return true;
    if (currentUserRole === 'property_manager') return assignment.createdBy === 'current_user';
    return false;
  };
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reorder within same column
      if (onDragEnd) {
        onDragEnd(result);
      }
    } else {
      // Move to different column (status change)
      handleStatusChange(draggableId, destination.droppableId);
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-96 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Assignment Board</h3>
            <p className="text-gray-600 mt-1">
              Manage and track tasks across your team and properties
            </p>
          </div>
          
          {canCreateAssignment && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Assignment
            </button>
          )}
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Assignments
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or description..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                {columns.map(column => (
                  <option key={column.id} value={column.id}>{column.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Property
              </label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Properties</option>
                {displayProperties.map(property => (
                  <option key={property.id} value={property.id}>{property.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Team Member
              </label>
              <select
                value={selectedTeamMember}
                onChange={(e) => setSelectedTeamMember(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Team Members</option>
                {displayTeamMembers.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Active filters */}
          {(filter !== 'all' || selectedProperty !== 'all' || selectedTeamMember !== 'all' || searchQuery) && (
            <div className="mt-4 flex items-center">
              <FunnelIcon className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600 mr-3">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {filter !== 'all' && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Status: {columns.find(c => c.id === filter)?.title}
                  </span>
                )}
                {selectedProperty !== 'all' && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Property: {getPropertyName(selectedProperty)}
                  </span>
                )}
                {selectedTeamMember !== 'all' && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    Team Member: {getTeamMemberName(selectedTeamMember)}
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                    Search: "{searchQuery}"
                  </span>
                )}
                <button
                  onClick={() => {
                    setFilter('all');
                    setSelectedProperty('all');
                    setSelectedTeamMember('all');
                    setSearchQuery('');
                  }}
                  className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full hover:bg-gray-200"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Create Assignment Form */}
      {showCreateForm && (
        <div className="mb-6 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Create New Assignment</h4>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleCreateAssignment}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="Enter assignment title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property *
                </label>
                <select
                  value={newAssignment.propertyId}
                  onChange={(e) => setNewAssignment({ ...newAssignment, propertyId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select property</option>
                  {displayProperties.map(property => (
                    <option key={property.id} value={property.id}>{property.title}</option>
                  ))}
                  <option value="all">All Properties</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  rows={3}
                  placeholder="Describe the assignment details..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newAssignment.priority}
                    onChange={(e) => setNewAssignment({ ...newAssignment, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newAssignment.category}
                    onChange={(e) => setNewAssignment({ ...newAssignment, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign To
                </label>
                <select
                  multiple
                  value={newAssignment.assignedTo}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setNewAssignment({ ...newAssignment, assignedTo: selected });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  size={4}
                >
                  {displayTeamMembers.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Hold Ctrl/Cmd to select multiple team members
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={newAssignment.estimatedHours}
                    onChange={(e) => setNewAssignment({ ...newAssignment, estimatedHours: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Assignment
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Assignment Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {columns.map(column => {
            const columnAssignments = groupedAssignments[column.id] || [];
            
            return (
              <div
                key={column.id}
                className={`border rounded-lg ${column.color}`}
              >
                {/* Column Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{column.title}</h4>
                      <span className="text-sm text-gray-600">
                        {columnAssignments.length} assignment{columnAssignments.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                {/* Column Content */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-2 min-h-[400px] ${snapshot.isDraggingOver ? 'bg-gray-100' : ''}`}
                    >
                      {columnAssignments.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-gray-400 mb-2">No assignments</div>
                          <div className="text-sm text-gray-500">Drag assignments here</div>
                        </div>
                      ) : (
                        columnAssignments.map((assignment, index) => (
                          <Draggable
                            key={assignment.id}
                            draggableId={assignment.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-3 bg-white rounded-lg border shadow-sm ${
                                  snapshot.isDragging ? 'shadow-lg' : ''
                                }`}
                              >
                                {/* Assignment Card */}
                                <div className="p-4">
                                  {/* Header */}
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityConfig[assignment.priority]?.color}`}>
                                        {priorityConfig[assignment.priority]?.label}
                                      </span>
                                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${categoryConfig[assignment.category]?.color}`}>
                                        {categoryConfig[assignment.category]?.icon} {categoryConfig[assignment.category]?.label}
                                      </span>
                                    </div>
                                    
                                    <div className="flex space-x-1">
                                      {canEditAssignment(assignment) && (
                                        <button
                                          onClick={() => {
                                            // Edit functionality
                                            alert(`Edit assignment ${assignment.id}`);
                                          }}
                                          className="p-1 text-gray-400 hover:text-blue-600"
                                          title="Edit"
                                        >
                                          <PencilIcon className="h-4 w-4" />
                                        </button>
                                      )}
                                      
                                      {canDeleteAssignment(assignment) && (
                                        <button
                                          onClick={() => handleDeleteAssignment(assignment.id)}
                                          className="p-1 text-gray-400 hover:text-red-600"
                                          title="Delete"
                                        >
                                          <TrashIcon className="h-4 w-4" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Title and Description */}
                                  <h5 className="font-medium text-gray-900 mb-2">{assignment.title}</h5>
                                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {assignment.description}
                                  </p>
                                  
                                  {/* Property */}
                                  <div className="flex items-center text-sm text-gray-600 mb-2">
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span>{getPropertyName(assignment.propertyId)}</span>
                                  </div>
                                  
                                  {/* Due Date */}
                                  <div className="flex items-center text-sm text-gray-600 mb-4">
                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                    <span className={isOverdue(assignment.dueDate) ? 'text-red-600 font-medium' : ''}>
                                      {formatDate(assignment.dueDate)}
                                      {isOverdue(assignment.dueDate) && ' (Overdue)'}
                                    </span>
                                  </div>
                                  
                                  {/* Assigned To */}
                                  <div className="mb-4">
                                    <div className="flex items-center text-sm text-gray-600 mb-2">
                                      <UserGroupIcon className="h-4 w-4 mr-2" />
                                      <span>Assigned to:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {assignment.assignedTo.slice(0, 3).map(memberId => (
                                        <span
                                          key={memberId}
                                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                        >
                                          {getTeamMemberName(memberId)}
                                        </span>
                                      ))}
                                      {assignment.assignedTo.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                          +{assignment.assignedTo.length - 3} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Time Tracking */}
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                      <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                                      <span className="text-gray-600">
                                        {assignment.actualHours || 0}h / {assignment.estimatedHours}h
                                      </span>
                                    </div>
                                    
                                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-green-500"
                                        style={{ width: `${Math.min((assignment.actualHours || 0) / assignment.estimatedHours * 100, 100)}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  
                                  {/* Status Navigation */}
                                  <div className="mt-4 pt-3 border-t border-gray-200">
                                    <div className="flex justify-between">
                                      {column.id !== 'pending' && (
                                        <button
                                          onClick={() => handleStatusChange(assignment.id, columns[columns.findIndex(c => c.id === column.id) - 1]?.id)}
                                          className="text-xs text-gray-600 hover:text-gray-900"
                                        >
                                          <ArrowLeftIcon className="h-3 w-3 inline mr-1" />
                                          Move back
                                        </button>
                                      )}
                                      
                                      {column.id !== 'completed' && (
                                        <button
                                          onClick={() => handleStatusChange(assignment.id, columns[columns.findIndex(c => c.id === column.id) + 1]?.id)}
                                          className="text-xs text-gray-600 hover:text-gray-900 ml-auto"
                                        >
                                          Move forward
                                          <ArrowRightIcon className="h-3 w-3 inline ml-1" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
      
      {/* Statistics */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Assignment Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{displayAssignments.length}</p>
          </div>
          
          {columns.map(column => {
            const count = groupedAssignments[column.id]?.length || 0;
            const percentage = displayAssignments.length > 0 ? (count / displayAssignments.length * 100).toFixed(0) : 0;
            
            return (
              <div key={column.id} className={`rounded-lg p-4 ${column.color.replace('border-', 'bg-').replace('200', '50')}`}>
                <p className="text-sm">{column.title}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold">{count}</p>
                  <span className="ml-2 text-sm text-gray-600">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Quick Actions</h4>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              // Generate report
              alert('Assignment report generated');
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate Report
          </button>
          
          <button
            onClick={() => {
              // Bulk update
              alert('Bulk update dialog would open here');
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Bulk Update Status
          </button>
          
          <button
            onClick={() => {
              // Print view
              window.print();
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentBoard;