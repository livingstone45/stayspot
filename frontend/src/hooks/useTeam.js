import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { usePermissions } from './usePermissions';

export const useTeam = () => {
  const { apiCall, user } = useAuth();
  const { hasPermission, canManageUser } = usePermissions();
  
  const [teamMembers, setTeamMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [currentMember, setCurrentMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    role: 'all',
    department: 'all',
    status: 'all',
    search: ''
  });

  const fetchTeamMembers = useCallback(async (params = {}) => {
    if (!hasPermission('users.view')) {
      setError('Access denied to view team members');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        ...filters,
        ...params
      }).toString();

      const data = await apiCall(`/team/members?${queryParams}`);
      setTeamMembers(data.members || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, filters]);

  const fetchTeamMember = useCallback(async (memberId) => {
    if (!hasPermission('users.view')) {
      setError('Access denied to view team member');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/team/members/${memberId}`);
      setCurrentMember(data.member);
      return data.member;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const inviteTeamMember = useCallback(async (invitationData) => {
    if (!hasPermission('users.manage')) {
      setError('Access denied to invite team members');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/team/invite', {
        method: 'POST',
        body: JSON.stringify({
          ...invitationData,
          invitedBy: user.id,
          companyId: user.companyId
        })
      });

      setInvitations(prev => [data.invitation, ...prev]);
      return data.invitation;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, user]);

  const updateTeamMember = useCallback(async (memberId, updates) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!canManageUser(member)) {
      setError('Access denied to update this team member');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/team/members/${memberId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId ? data.member : member
        )
      );

      if (currentMember?.id === memberId) {
        setCurrentMember(data.member);
      }

      return data.member;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, canManageUser, teamMembers, currentMember]);

  const deactivateTeamMember = useCallback(async (memberId, reason = '') => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!canManageUser(member)) {
      setError('Access denied to deactivate this team member');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/team/members/${memberId}/deactivate`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      });

      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId ? { ...member, status: 'inactive' } : member
        )
      );

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, canManageUser, teamMembers]);

  const reactivateTeamMember = useCallback(async (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!canManageUser(member)) {
      setError('Access denied to reactivate this team member');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/team/members/${memberId}/reactivate`, {
        method: 'POST'
      });

      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId ? { ...member, status: 'active' } : member
        )
      );

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, canManageUser, teamMembers]);

  const fetchInvitations = useCallback(async () => {
    if (!hasPermission('users.view')) {
      setError('Access denied to view invitations');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/team/invitations');
      setInvitations(data.invitations || []);
      return data.invitations;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const resendInvitation = useCallback(async (invitationId) => {
    if (!hasPermission('users.manage')) {
      setError('Access denied to resend invitations');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/team/invitations/${invitationId}/resend`, {
        method: 'POST'
      });

      setInvitations(prev => 
        prev.map(invitation => 
          invitation.id === invitationId ? data.invitation : invitation
        )
      );

      return data.invitation;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const revokeInvitation = useCallback(async (invitationId) => {
    if (!hasPermission('users.manage')) {
      setError('Access denied to revoke invitations');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiCall(`/team/invitations/${invitationId}/revoke`, {
        method: 'POST'
      });

      setInvitations(prev => 
        prev.map(invitation => 
          invitation.id === invitationId 
            ? { ...invitation, status: 'revoked' } 
            : invitation
        )
      );

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/team/departments');
      setDepartments(data.departments || []);
      return data.departments;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const createDepartment = useCallback(async (departmentData) => {
    if (!hasPermission('company.manage')) {
      setError('Access denied to create departments');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/team/departments', {
        method: 'POST',
        body: JSON.stringify(departmentData)
      });

      setDepartments(prev => [data.department, ...prev]);
      return data.department;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/team/roles');
      setRoles(data.roles || []);
      return data.roles;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const assignRole = useCallback(async (memberId, roleId) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!canManageUser(member)) {
      setError('Access denied to assign roles');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/team/members/${memberId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ roleId })
      });

      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId ? data.member : member
        )
      );

      return data.member;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, canManageUser, teamMembers]);

  const assignProperties = useCallback(async (memberId, propertyIds) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!canManageUser(member)) {
      setError('Access denied to assign properties');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/team/members/${memberId}/properties`, {
        method: 'PUT',
        body: JSON.stringify({ propertyIds })
      });

      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId ? data.member : member
        )
      );

      return data.member;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, canManageUser, teamMembers]);

  const getTeamPerformance = useCallback(async (timeframe = '30d') => {
    if (!hasPermission('reports.view')) {
      setError('Access denied to view team performance');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/team/performance?timeframe=${timeframe}`);
      return data.performance;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const searchTeamMembers = useCallback(async (searchTerm, searchFilters = {}) => {
    if (!hasPermission('users.view')) {
      setError('Access denied to search team members');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        search: searchTerm,
        ...searchFilters
      }).toString();

      const data = await apiCall(`/team/search?${params}`);
      return data.members || [];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  // Computed values
  const filteredTeamMembers = useMemo(() => {
    return teamMembers.filter(member => {
      const matchesRole = filters.role === 'all' || member.role === filters.role;
      const matchesDepartment = filters.department === 'all' || member.department === filters.department;
      const matchesStatus = filters.status === 'all' || member.status === filters.status;
      const matchesSearch = !filters.search || 
        member.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        member.email?.toLowerCase().includes(filters.search.toLowerCase());

      return matchesRole && matchesDepartment && matchesStatus && matchesSearch;
    });
  }, [teamMembers, filters]);

  const teamStats = useMemo(() => {
    return {
      total: teamMembers.length,
      active: teamMembers.filter(m => m.status === 'active').length,
      inactive: teamMembers.filter(m => m.status === 'inactive').length,
      pending: invitations.filter(i => i.status === 'pending').length,
      byRole: teamMembers.reduce((acc, member) => {
        acc[member.role] = (acc[member.role] || 0) + 1;
        return acc;
      }, {}),
      byDepartment: teamMembers.reduce((acc, member) => {
        acc[member.department] = (acc[member.department] || 0) + 1;
        return acc;
      }, {})
    };
  }, [teamMembers, invitations]);

  const pendingInvitations = useMemo(() => {
    return invitations.filter(invitation => invitation.status === 'pending');
  }, [invitations]);

  // Initialize data
  useEffect(() => {
    if (hasPermission('users.view')) {
      fetchTeamMembers();
      fetchInvitations();
      fetchDepartments();
      fetchRoles();
    }
  }, [hasPermission]);

  return {
    // State
    teamMembers: filteredTeamMembers,
    allTeamMembers: teamMembers,
    currentMember,
    invitations,
    pendingInvitations,
    departments,
    roles,
    loading,
    error,
    filters,
    teamStats,

    // Actions
    fetchTeamMembers,
    fetchTeamMember,
    inviteTeamMember,
    updateTeamMember,
    deactivateTeamMember,
    reactivateTeamMember,
    fetchInvitations,
    resendInvitation,
    revokeInvitation,
    fetchDepartments,
    createDepartment,
    fetchRoles,
    assignRole,
    assignProperties,
    getTeamPerformance,
    searchTeamMembers,
    setFilters,
    setError,
    setCurrentMember
  };
};

export default useTeam;