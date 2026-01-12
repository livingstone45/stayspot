import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Mail,
  Phone,
  Building,
  Shield,
  CheckCircle,
  XCircle,
  Download,
  Upload,
  RefreshCw,
  Users,
  Clock,
  Calendar,
  Star
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const CompanyTeams = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState([]);
  const [filteredTeam, setFilteredTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    department: 'all'
  });
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'property_manager',
    department: 'operations',
    sendInvite: true
  });
  const itemsPerPage = 10;

  const roles = [
    { value: 'property_manager', label: 'Property Manager', color: 'bg-green-100 text-green-800' },
    { value: 'leasing_agent', label: 'Leasing Agent', color: 'bg-blue-100 text-blue-800' },
    { value: 'maintenance_supervisor', label: 'Maintenance Supervisor', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'account_manager', label: 'Account Manager', color: 'bg-purple-100 text-purple-800' },
    { value: 'marketing_specialist', label: 'Marketing Specialist', color: 'bg-pink-100 text-pink-800' },
    { value: 'financial_analyst', label: 'Financial Analyst', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'admin_assistant', label: 'Admin Assistant', color: 'bg-gray-100 text-gray-800' },
  ];

  const departments = [
    { value: 'operations', label: 'Operations', color: 'blue' },
    { value: 'leasing', label: 'Leasing', color: 'green' },
    { value: 'maintenance', label: 'Maintenance', color: 'yellow' },
    { value: 'finance', label: 'Finance', color: 'purple' },
    { value: 'marketing', label: 'Marketing', color: 'pink' },
    { value: 'admin', label: 'Administration', color: 'gray' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'away', label: 'Away', color: 'bg-blue-100 text-blue-800' },
    { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
    { value: 'suspended', label: 'Suspended', color: 'bg-red-100 text-red-800' },
  ];

  useEffect(() => {
    loadTeam();
  }, []);

  useEffect(() => {
    filterTeam();
  }, [team, searchTerm, filters]);

  const loadTeam = async () => {
    setLoading(true);
    try {
      const data = await getTeamMembers();
      setTeam(data);
    } catch (error) {
      console.error('Failed to load team:', error);
      // Use sample data for demo
      setTeam(generateSampleTeam());
    } finally {
      setLoading(false);
    }
  };

  const generateSampleTeam = () => {
    const team = [];
    const names = [
      'John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emily Davis', 'Robert Brown',
      'Jennifer Lee', 'David Miller', 'Lisa Taylor', 'James Anderson', 'Maria Garcia',
      'William Martinez', 'Jessica Thomas', 'Christopher Moore', 'Amanda Jackson',
      'Daniel White', 'Michelle Harris', 'Joseph Clark', 'Ashley Lewis', 'Matthew Walker'
    ];
    
    const departmentsList = ['operations', 'leasing', 'maintenance', 'finance', 'marketing', 'admin'];
    const rolesList = ['property_manager', 'leasing_agent', 'maintenance_supervisor', 'account_manager', 'marketing_specialist', 'financial_analyst', 'admin_assistant'];

    for (let i = 0; i < 18; i++) {
      const name = names[i];
      const email = name.toLowerCase().replace(' ', '.') + '@company.com';
      const role = rolesList[Math.floor(Math.random() * rolesList.length)];
      const department = departmentsList[Math.floor(Math.random() * departmentsList.length)];
      const status = i < 12 ? 'active' : i < 15 ? 'pending' : i < 17 ? 'away' : 'inactive';
      
      team.push({
        id: `member-${i + 1}`,
        name,
        email,
        phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
        role,
        department,
        status,
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        properties: Math.floor(Math.random() * 50),
        tasks: Math.floor(Math.random() * 20),
        performance: Math.floor(Math.random() * 30) + 70,
        avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
        permissions: {
          properties: ['view', 'edit'],
          tenants: ['view'],
          maintenance: ['view', 'create'],
          financials: i % 3 === 0 ? ['view'] : [],
        }
      });
    }
    
    return team;
  };

  const filterTeam = () => {
    let filtered = [...team];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (filters.role !== 'all') {
      filtered = filtered.filter(member => member.role === filters.role);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(member => member.status === filters.status);
    }

    // Department filter
    if (filters.department !== 'all') {
      filtered = filtered.filter(member => member.department === filters.department);
    }

    setFilteredTeam(filtered);
    setCurrentPage(1);
  };

  const handleSelectMember = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === paginatedTeam.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(paginatedTeam.map(member => member.id));
    }
  };

  const handleInvite = async () => {
    try {
      await inviteTeamMember(inviteData);
      loadTeam();
      setShowInviteModal(false);
      setInviteData({
        email: '',
        role: 'property_manager',
        department: 'operations',
        sendInvite: true
      });
    } catch (error) {
      console.error('Failed to invite team member:', error);
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    
    try {
      await deleteTeamMember(memberToDelete.id);
      loadTeam();
      setShowDeleteModal(false);
      setMemberToDelete(null);
    } catch (error) {
      console.error('Failed to delete team member:', error);
    }
  };

  const handleExport = () => {
    const exportData = selectedMembers.length > 0 
      ? team.filter(member => selectedMembers.includes(member.id))
      : team;
    
    const csvContent = [
      ['Name', 'Email', 'Role', 'Department', 'Status', 'Join Date', 'Last Active', 'Properties', 'Performance'],
      ...exportData.map(member => [
        member.name,
        member.email,
        roles.find(r => r.value === member.role)?.label || member.role,
        departments.find(d => d.value === member.department)?.label || member.department,
        statusOptions.find(s => s.value === member.status)?.label || member.status,
        new Date(member.joinDate).toLocaleDateString(),
        new Date(member.lastActive).toLocaleDateString(),
        member.properties,
        `${member.performance}%`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team-members-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Pagination
  const totalPages = Math.ceil(filteredTeam.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTeam = filteredTeam.slice(startIndex, startIndex + itemsPerPage);

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
              <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
              <p className="mt-2 text-gray-600">
                Manage your company team members and their permissions
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Team Member
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Team', value: team.length, color: 'blue' },
            { label: 'Active', value: team.filter(m => m.status === 'active').length, color: 'green' },
            { label: 'Pending', value: team.filter(m => m.status === 'pending').length, color: 'yellow' },
            { label: 'Avg Performance', value: `${Math.round(team.reduce((sum, m) => sum + m.performance, 0) / team.length)}%`, color: 'purple' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
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
                  placeholder="Search team members by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setFilters({ role: 'all', status: 'all', department: 'all' })}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Reset
              </button>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filters.role}
                  onChange={(e) => setFilters({...filters, role: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Roles</option>
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
                
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
                  value={filters.department}
                  onChange={(e) => setFilters({...filters, department: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedMembers.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">
                    {selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {/* Bulk activate */}}
                    className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => {/* Bulk deactivate */}}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => {/* Bulk delete */}}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Team Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedMembers.length === paginatedTeam.length && paginatedTeam.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedTeam.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => handleSelectMember(member.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {member.email}
                          </div>
                          {member.phone && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {member.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          roles.find(r => r.value === member.role)?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {roles.find(r => r.value === member.role)?.label || member.role}
                        </span>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Building className="w-3 h-3 mr-1" />
                          {departments.find(d => d.value === member.department)?.label || member.department}
                        </div>
                        {member.properties > 0 && (
                          <div className="text-xs text-gray-500">
                            {member.properties} properties
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          {member.status === 'active' ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm text-green-700">Active</span>
                            </>
                          ) : member.status === 'pending' ? (
                            <>
                              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                              <span className="text-sm text-yellow-700">Pending</span>
                            </>
                          ) : member.status === 'away' ? (
                            <>
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                              <span className="text-sm text-blue-700">Away</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Inactive</span>
                            </>
                          )}
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPerformanceColor(member.performance)}`}>
                            <Star className="w-3 h-3 mr-1" />
                            {member.performance}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Joined {new Date(member.joinDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Last active {new Date(member.lastActive).toLocaleDateString()}
                        </div>
                        {member.tasks > 0 && (
                          <div className="text-xs">
                            {member.tasks} active tasks
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {/* Edit member */}}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setMemberToDelete(member);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredTeam.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredTeam.length}</span> members
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredTeam.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filters.role !== 'all' || filters.status !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No team members have been added yet'}
            </p>
            <button
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite First Team Member
            </button>
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Invite Team Member
                </h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteData.email}
                    onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="team.member@company.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={inviteData.role}
                      onChange={(e) => setInviteData({...inviteData, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={inviteData.department}
                      onChange={(e) => setInviteData({...inviteData, department: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {departments.map(dept => (
                        <option key={dept.value} value={dept.value}>{dept.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sendInvite"
                    checked={inviteData.sendInvite}
                    onChange={(e) => setInviteData({...inviteData, sendInvite: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sendInvite" className="ml-2 block text-sm text-gray-700">
                    Send invitation email
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && memberToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Remove Team Member
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to remove {memberToDelete.name} from the team?
                This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setMemberToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteMember}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Remove Member
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Team Member Details
                  </h3>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedMember(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedMember.avatar}
                      alt={selectedMember.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{selectedMember.name}</h4>
                      <p className="text-gray-600">{selectedMember.email}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          roles.find(r => r.value === selectedMember.role)?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {roles.find(r => r.value === selectedMember.role)?.label || selectedMember.role}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusOptions.find(s => s.value === selectedMember.status)?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {statusOptions.find(s => s.value === selectedMember.status)?.label || selectedMember.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Department */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h5>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{selectedMember.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{selectedMember.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Department & Performance</h5>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Building className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {departments.find(d => d.value === selectedMember.department)?.label || selectedMember.department}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{selectedMember.performance}%</span>
                          <div className="ml-2 text-xs text-gray-500">Performance Score</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Stats */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Activity & Statistics</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Properties</p>
                        <p className="text-lg font-bold text-gray-900">{selectedMember.properties}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Active Tasks</p>
                        <p className="text-lg font-bold text-gray-900">{selectedMember.tasks}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Join Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(selectedMember.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Last Active</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(selectedMember.lastActive).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Permissions</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(selectedMember.permissions || {}).map(([module, perms]) => (
                        <div key={module} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs font-medium text-gray-900 capitalize">{module}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {perms.map((perm, index) => (
                              <span key={index} className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                                {perm}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedMember(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {/* Edit member */}}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Edit Member
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyTeams;