import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { usePermissions } from './usePermissions';

export const useTasks = () => {
  const { apiCall, user } = useAuth();
  const { hasPermission, canView } = usePermissions();
  
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    assignee: 'all',
    dueDate: 'all',
    search: ''
  });

  const fetchTasks = useCallback(async (params = {}) => {
    if (!hasPermission('tasks.view')) {
      setError('Access denied to view tasks');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        ...filters,
        ...params
      }).toString();

      const data = await apiCall(`/tasks?${queryParams}`);
      setTasks(data.tasks || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, filters]);

  const fetchTask = useCallback(async (taskId) => {
    if (!hasPermission('tasks.view')) {
      setError('Access denied to view task');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/tasks/${taskId}`);
      setCurrentTask(data.task);
      return data.task;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const createTask = useCallback(async (taskData) => {
    if (!hasPermission('tasks.create')) {
      setError('Access denied to create tasks');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          ...taskData,
          createdBy: user.id,
          companyId: user.companyId
        })
      });

      setTasks(prev => [data.task, ...prev]);
      return data.task;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, user]);

  const updateTask = useCallback(async (taskId, updates) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || (!hasPermission('tasks.manage') && task.assigneeId !== user.id && task.createdBy !== user.id)) {
      setError('Access denied to update this task');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? data.task : task
        )
      );

      if (currentTask?.id === taskId) {
        setCurrentTask(data.task);
      }

      return data.task;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, tasks, currentTask, user]);

  const deleteTask = useCallback(async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || (!hasPermission('tasks.manage') && task.createdBy !== user.id)) {
      setError('Access denied to delete this task');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiCall(`/tasks/${taskId}`, {
        method: 'DELETE'
      });

      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      if (currentTask?.id === taskId) {
        setCurrentTask(null);
      }

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, tasks, currentTask, user]);

  const assignTask = useCallback(async (taskId, assigneeId) => {
    if (!hasPermission('tasks.manage')) {
      setError('Access denied to assign tasks');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/tasks/${taskId}/assign`, {
        method: 'POST',
        body: JSON.stringify({ assigneeId })
      });

      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? data.task : task
        )
      );

      return data.task;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const updateTaskStatus = useCallback(async (taskId, status, notes = '') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || (!hasPermission('tasks.manage') && task.assigneeId !== user.id)) {
      setError('Access denied to update task status');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/tasks/${taskId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes })
      });

      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? data.task : task
        )
      );

      if (currentTask?.id === taskId) {
        setCurrentTask(data.task);
      }

      return data.task;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, tasks, currentTask, user]);

  const addTaskComment = useCallback(async (taskId, comment) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !canView('tasks')) {
      setError('Access denied to comment on this task');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/tasks/${taskId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          comment,
          authorId: user.id
        })
      });

      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, comments: [...(task.comments || []), data.comment] }
            : task
        )
      );

      return data.comment;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, canView, tasks, user]);

  const uploadTaskAttachment = useCallback(async (taskId, file) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || (!hasPermission('tasks.manage') && task.assigneeId !== user.id && task.createdBy !== user.id)) {
      setError('Access denied to upload attachments');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('attachment', file);

      const data = await apiCall(`/tasks/${taskId}/attachments`, {
        method: 'POST',
        body: formData,
        headers: {} // Remove Content-Type for FormData
      });

      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, attachments: [...(task.attachments || []), data.attachment] }
            : task
        )
      );

      return data.attachment;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, tasks, user]);

  const fetchTaskTemplates = useCallback(async () => {
    if (!hasPermission('tasks.view')) {
      setError('Access denied to view task templates');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/tasks/templates');
      setTemplates(data.templates || []);
      return data.templates;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const createTaskFromTemplate = useCallback(async (templateId, taskData = {}) => {
    if (!hasPermission('tasks.create')) {
      setError('Access denied to create tasks');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/tasks/templates/${templateId}/create`, {
        method: 'POST',
        body: JSON.stringify({
          ...taskData,
          createdBy: user.id
        })
      });

      setTasks(prev => [data.task, ...prev]);
      return data.task;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, user]);

  const createRecurringTask = useCallback(async (taskData, recurrencePattern) => {
    if (!hasPermission('tasks.create')) {
      setError('Access denied to create recurring tasks');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/tasks/recurring', {
        method: 'POST',
        body: JSON.stringify({
          ...taskData,
          recurrencePattern,
          createdBy: user.id
        })
      });

      return data.recurringTask;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, user]);

  const fetchTaskCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/tasks/categories');
      setCategories(data.categories || []);
      return data.categories;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const getTaskAnalytics = useCallback(async (timeframe = '30d') => {
    if (!hasPermission('reports.view')) {
      setError('Access denied to view task analytics');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/tasks/analytics?timeframe=${timeframe}`);
      return data.analytics;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const searchTasks = useCallback(async (searchTerm, searchFilters = {}) => {
    if (!hasPermission('tasks.view')) {
      setError('Access denied to search tasks');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        search: searchTerm,
        ...searchFilters
      }).toString();

      const data = await apiCall(`/tasks/search?${params}`);
      return data.tasks || [];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const bulkUpdateTasks = useCallback(async (taskIds, updates) => {
    if (!hasPermission('tasks.manage')) {
      setError('Access denied to bulk update tasks');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/tasks/bulk-update', {
        method: 'PUT',
        body: JSON.stringify({ taskIds, updates })
      });

      setTasks(prev => 
        prev.map(task => 
          taskIds.includes(task.id) 
            ? { ...task, ...updates }
            : task
        )
      );

      return data.updatedTasks;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  // Computed values
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus = filters.status === 'all' || task.status === filters.status;
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
      const matchesCategory = filters.category === 'all' || task.category === filters.category;
      const matchesAssignee = filters.assignee === 'all' || task.assigneeId === filters.assignee;
      const matchesSearch = !filters.search || 
        task.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase());

      let matchesDueDate = true;
      if (filters.dueDate !== 'all') {
        const today = new Date();
        const taskDueDate = new Date(task.dueDate);
        
        switch (filters.dueDate) {
          case 'overdue':
            matchesDueDate = taskDueDate < today && task.status !== 'completed';
            break;
          case 'today':
            matchesDueDate = taskDueDate.toDateString() === today.toDateString();
            break;
          case 'week':
            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            matchesDueDate = taskDueDate >= today && taskDueDate <= weekFromNow;
            break;
          default:
            matchesDueDate = true;
        }
      }

      return matchesStatus && matchesPriority && matchesCategory && matchesAssignee && matchesSearch && matchesDueDate;
    });
  }, [tasks, filters]);

  const myTasks = useMemo(() => {
    return tasks.filter(task => task.assigneeId === user?.id);
  }, [tasks, user]);

  const taskStats = useMemo(() => {
    const now = new Date();
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      pending: tasks.filter(t => t.status === 'pending').length,
      overdue: tasks.filter(t => new Date(t.dueDate) < now && t.status !== 'completed').length,
      myTasks: myTasks.length,
      myOverdue: myTasks.filter(t => new Date(t.dueDate) < now && t.status !== 'completed').length,
      byPriority: tasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
      }, {}),
      byCategory: tasks.reduce((acc, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1;
        return acc;
      }, {})
    };
  }, [tasks, myTasks]);

  // Initialize data
  useEffect(() => {
    if (hasPermission('tasks.view')) {
      fetchTasks();
      fetchTaskTemplates();
      fetchTaskCategories();
    }
  }, [hasPermission]);

  return {
    // State
    tasks: filteredTasks,
    allTasks: tasks,
    myTasks,
    currentTask,
    templates,
    categories,
    loading,
    error,
    filters,
    taskStats,

    // Actions
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    updateTaskStatus,
    addTaskComment,
    uploadTaskAttachment,
    fetchTaskTemplates,
    createTaskFromTemplate,
    createRecurringTask,
    fetchTaskCategories,
    getTaskAnalytics,
    searchTasks,
    bulkUpdateTasks,
    setFilters,
    setError,
    setCurrentTask
  };
};

export default useTasks;