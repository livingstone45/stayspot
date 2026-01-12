import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const initialState = {
  // Tasks data
  tasks: [],
  currentTask: null,
  selectedTasks: [],
  
  // Related data
  templates: [],
  categories: [],
  comments: [],
  attachments: [],
  
  // Loading states
  loading: false,
  tasksLoading: false,
  templatesLoading: false,
  
  // Error states
  error: null,
  tasksError: null,
  templatesError: null,
  
  // Filters and search
  filters: {
    status: 'all',
    priority: 'all',
    category: 'all',
    assignee: 'all',
    dueDate: 'all',
    tags: [],
    search: '',
    sortBy: 'dueDate',
    sortOrder: 'asc'
  },
  
  // Pagination
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  },
  
  // View preferences
  viewMode: 'list', // list, kanban, calendar
  groupBy: 'status', // status, priority, assignee, category
  showCompleted: false,
  compactView: false,
  
  // Kanban board state
  kanbanColumns: [
    { id: 'pending', title: 'Pending', tasks: [] },
    { id: 'in_progress', title: 'In Progress', tasks: [] },
    { id: 'review', title: 'Review', tasks: [] },
    { id: 'completed', title: 'Completed', tasks: [] }
  ],
  
  // Calendar state
  calendarView: 'month', // month, week, day
  calendarDate: new Date().toISOString().split('T')[0],
  
  // Bulk operations
  bulkOperations: {
    selected: [],
    operation: null,
    progress: 0,
    results: []
  },
  
  // Form states
  taskForm: {
    data: {},
    errors: {},
    touched: {},
    isSubmitting: false
  },
  
  // Real-time updates
  realTimeEnabled: true,
  lastSync: null,
  
  // Notifications
  notifications: {
    dueSoon: [],
    overdue: [],
    assigned: []
  },
  
  // Analytics
  analytics: {
    completionRate: 0,
    averageCompletionTime: 0,
    tasksByStatus: {},
    tasksByPriority: {},
    tasksByCategory: {},
    productivityTrends: []
  }
};

export const useTaskStore = create(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Basic actions
        setLoading: (loading) => set((state) => {
          state.loading = loading;
        }),

        setError: (error) => set((state) => {
          state.error = error;
          state.loading = false;
        }),

        clearError: () => set((state) => {
          state.error = null;
          state.tasksError = null;
          state.templatesError = null;
        }),

        // Tasks actions
        fetchTasks: async (params = {}) => {
          set((state) => {
            state.tasksLoading = true;
            state.tasksError = null;
          });

          try {
            const { filters, pagination } = get();
            const queryParams = new URLSearchParams({
              ...filters,
              ...pagination,
              ...params
            }).toString();

            const response = await fetch(`${API_BASE}/tasks?${queryParams}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to fetch tasks');
            }

            set((state) => {
              state.tasks = data.tasks || [];
              state.pagination = data.pagination || state.pagination;
              state.tasksLoading = false;
              state.lastSync = Date.now();
              
              // Update kanban columns
              get().updateKanbanColumns();
              
              // Update analytics
              get().calculateAnalytics();
            });

            return data;
          } catch (err) {
            set((state) => {
              state.tasksError = err.message;
              state.tasksLoading = false;
            });
            throw err;
          }
        },

        fetchTask: async (taskId) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to fetch task');
            }

            set((state) => {
              state.currentTask = data.task;
              state.comments = data.task.comments || [];
              state.attachments = data.task.attachments || [];
              state.loading = false;
            });

            return data.task;
          } catch (err) {
            set((state) => {
              state.error = err.message;
              state.loading = false;
            });
            throw err;
          }
        },

        createTask: async (taskData) => {
          set((state) => {
            state.taskForm.isSubmitting = true;
            state.taskForm.errors = {};
          });

          try {
            const response = await fetch(`${API_BASE}/tasks`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(taskData)
            });

            const data = await response.json();

            if (!response.ok) {
              if (data.errors) {
                set((state) => {
                  state.taskForm.errors = data.errors;
                });
              }
              throw new Error(data.message || 'Failed to create task');
            }

            set((state) => {
              state.tasks.unshift(data.task);
              state.pagination.total += 1;
              state.taskForm.isSubmitting = false;
              state.taskForm.data = {};
              state.taskForm.errors = {};
              state.taskForm.touched = {};
              
              // Update kanban and analytics
              get().updateKanbanColumns();
              get().calculateAnalytics();
            });

            return data.task;
          } catch (err) {
            set((state) => {
              state.taskForm.isSubmitting = false;
              if (!state.taskForm.errors || Object.keys(state.taskForm.errors).length === 0) {
                state.error = err.message;
              }
            });
            throw err;
          }
        },

        updateTask: async (taskId, updates) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(updates)
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to update task');
            }

            set((state) => {
              // Update in tasks list
              const index = state.tasks.findIndex(t => t.id === taskId);
              if (index !== -1) {
                state.tasks[index] = data.task;
              }
              
              // Update current task if it's the same
              if (state.currentTask?.id === taskId) {
                state.currentTask = data.task;
              }
              
              state.loading = false;
              
              // Update kanban and analytics
              get().updateKanbanColumns();
              get().calculateAnalytics();
            });

            return data.task;
          } catch (err) {
            set((state) => {
              state.error = err.message;
              state.loading = false;
            });
            throw err;
          }
        },

        deleteTask: async (taskId) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || 'Failed to delete task');
            }

            set((state) => {
              state.tasks = state.tasks.filter(t => t.id !== taskId);
              state.selectedTasks = state.selectedTasks.filter(id => id !== taskId);
              
              if (state.currentTask?.id === taskId) {
                state.currentTask = null;
              }
              
              state.pagination.total = Math.max(0, state.pagination.total - 1);
              state.loading = false;
              
              // Update kanban and analytics
              get().updateKanbanColumns();
              get().calculateAnalytics();
            });

            return true;
          } catch (err) {
            set((state) => {
              state.error = err.message;
              state.loading = false;
            });
            throw err;
          }
        },

        // Task status actions
        updateTaskStatus: async (taskId, status, notes = '') => {
          try {
            const response = await fetch(`${API_BASE}/tasks/${taskId}/status`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ status, notes })
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to update task status');
            }

            set((state) => {
              const index = state.tasks.findIndex(t => t.id === taskId);
              if (index !== -1) {
                state.tasks[index] = data.task;
              }
              
              if (state.currentTask?.id === taskId) {
                state.currentTask = data.task;
              }
              
              // Update kanban and analytics
              get().updateKanbanColumns();
              get().calculateAnalytics();
            });

            return data.task;
          } catch (err) {
            set((state) => {
              state.error = err.message;
            });
            throw err;
          }
        },

        assignTask: async (taskId, assigneeId) => {
          try {
            const response = await fetch(`${API_BASE}/tasks/${taskId}/assign`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ assigneeId })
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to assign task');
            }

            set((state) => {
              const index = state.tasks.findIndex(t => t.id === taskId);
              if (index !== -1) {
                state.tasks[index] = data.task;
              }
              
              if (state.currentTask?.id === taskId) {
                state.currentTask = data.task;
              }
            });

            return data.task;
          } catch (err) {
            set((state) => {
              state.error = err.message;
            });
            throw err;
          }
        },

        // Comments actions
        addComment: async (taskId, comment) => {
          try {
            const response = await fetch(`${API_BASE}/tasks/${taskId}/comments`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ comment })
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to add comment');
            }

            set((state) => {
              state.comments.unshift(data.comment);
              
              // Update task in list if it exists
              const taskIndex = state.tasks.findIndex(t => t.id === taskId);
              if (taskIndex !== -1) {
                state.tasks[taskIndex].commentCount = (state.tasks[taskIndex].commentCount || 0) + 1;
              }
            });

            return data.comment;
          } catch (err) {
            set((state) => {
              state.error = err.message;
            });
            throw err;
          }
        },

        // Attachments actions
        uploadAttachment: async (taskId, file) => {
          try {
            const formData = new FormData();
            formData.append('attachment', file);

            const response = await fetch(`${API_BASE}/tasks/${taskId}/attachments`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              body: formData
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to upload attachment');
            }

            set((state) => {
              state.attachments.unshift(data.attachment);
              
              // Update task in list if it exists
              const taskIndex = state.tasks.findIndex(t => t.id === taskId);
              if (taskIndex !== -1) {
                state.tasks[taskIndex].attachmentCount = (state.tasks[taskIndex].attachmentCount || 0) + 1;
              }
            });

            return data.attachment;
          } catch (err) {
            set((state) => {
              state.error = err.message;
            });
            throw err;
          }
        },

        // Templates actions
        fetchTemplates: async () => {
          set((state) => {
            state.templatesLoading = true;
            state.templatesError = null;
          });

          try {
            const response = await fetch(`${API_BASE}/tasks/templates`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to fetch templates');
            }

            set((state) => {
              state.templates = data.templates || [];
              state.templatesLoading = false;
            });

            return data.templates;
          } catch (err) {
            set((state) => {
              state.templatesError = err.message;
              state.templatesLoading = false;
            });
            throw err;
          }
        },

        createTaskFromTemplate: async (templateId, taskData = {}) => {
          try {
            const response = await fetch(`${API_BASE}/tasks/templates/${templateId}/create`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(taskData)
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to create task from template');
            }

            set((state) => {
              state.tasks.unshift(data.task);
              state.pagination.total += 1;
              
              // Update kanban and analytics
              get().updateKanbanColumns();
              get().calculateAnalytics();
            });

            return data.task;
          } catch (err) {
            set((state) => {
              state.error = err.message;
            });
            throw err;
          }
        },

        // Bulk operations
        bulkUpdateTasks: async (taskIds, updates) => {
          set((state) => {
            state.bulkOperations.operation = 'update';
            state.bulkOperations.progress = 0;
            state.bulkOperations.results = [];
          });

          try {
            const response = await fetch(`${API_BASE}/tasks/bulk-update`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ taskIds, updates })
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Bulk update failed');
            }

            set((state) => {
              // Update tasks in state
              data.updatedTasks.forEach(updatedTask => {
                const index = state.tasks.findIndex(t => t.id === updatedTask.id);
                if (index !== -1) {
                  state.tasks[index] = updatedTask;
                }
              });

              state.bulkOperations.operation = null;
              state.bulkOperations.progress = 100;
              state.bulkOperations.results = data.updatedTasks;
              
              // Update kanban and analytics
              get().updateKanbanColumns();
              get().calculateAnalytics();
            });

            return data.updatedTasks;
          } catch (err) {
            set((state) => {
              state.bulkOperations.operation = null;
              state.error = err.message;
            });
            throw err;
          }
        },

        // Search and filter actions
        setFilters: (newFilters) => set((state) => {
          state.filters = { ...state.filters, ...newFilters };
          state.pagination.page = 1; // Reset to first page
        }),

        setPagination: (newPagination) => set((state) => {
          state.pagination = { ...state.pagination, ...newPagination };
        }),

        searchTasks: async (searchTerm, searchFilters = {}) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const params = new URLSearchParams({
              search: searchTerm,
              ...searchFilters
            }).toString();

            const response = await fetch(`${API_BASE}/tasks/search?${params}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Search failed');
            }

            set((state) => {
              state.loading = false;
            });

            return data.tasks || [];
          } catch (err) {
            set((state) => {
              state.error = err.message;
              state.loading = false;
            });
            throw err;
          }
        },

        // Selection actions
        setSelectedTasks: (taskIds) => set((state) => {
          state.selectedTasks = taskIds;
        }),

        toggleTaskSelection: (taskId) => set((state) => {
          const index = state.selectedTasks.indexOf(taskId);
          if (index === -1) {
            state.selectedTasks.push(taskId);
          } else {
            state.selectedTasks.splice(index, 1);
          }
        }),

        selectAllTasks: () => set((state) => {
          state.selectedTasks = state.tasks.map(t => t.id);
        }),

        clearSelection: () => set((state) => {
          state.selectedTasks = [];
        }),

        // View preferences
        setViewMode: (mode) => set((state) => {
          state.viewMode = mode;
        }),

        setGroupBy: (groupBy) => set((state) => {
          state.groupBy = groupBy;
          get().updateKanbanColumns();
        }),

        toggleShowCompleted: () => set((state) => {
          state.showCompleted = !state.showCompleted;
        }),

        toggleCompactView: () => set((state) => {
          state.compactView = !state.compactView;
        }),

        // Kanban actions
        updateKanbanColumns: () => set((state) => {
          const { tasks, groupBy } = state;
          
          if (groupBy === 'status') {
            state.kanbanColumns = [
              { id: 'pending', title: 'Pending', tasks: tasks.filter(t => t.status === 'pending') },
              { id: 'in_progress', title: 'In Progress', tasks: tasks.filter(t => t.status === 'in_progress') },
              { id: 'review', title: 'Review', tasks: tasks.filter(t => t.status === 'review') },
              { id: 'completed', title: 'Completed', tasks: tasks.filter(t => t.status === 'completed') }
            ];
          } else if (groupBy === 'priority') {
            state.kanbanColumns = [
              { id: 'low', title: 'Low Priority', tasks: tasks.filter(t => t.priority === 'low') },
              { id: 'medium', title: 'Medium Priority', tasks: tasks.filter(t => t.priority === 'medium') },
              { id: 'high', title: 'High Priority', tasks: tasks.filter(t => t.priority === 'high') },
              { id: 'urgent', title: 'Urgent', tasks: tasks.filter(t => t.priority === 'urgent') }
            ];
          }
        }),

        moveTaskToColumn: async (taskId, newStatus) => {
          await get().updateTaskStatus(taskId, newStatus);
        },

        // Calendar actions
        setCalendarView: (view) => set((state) => {
          state.calendarView = view;
        }),

        setCalendarDate: (date) => set((state) => {
          state.calendarDate = date;
        }),

        // Form management
        updateTaskForm: (updates) => set((state) => {
          state.taskForm.data = { ...state.taskForm.data, ...updates };
        }),

        setTaskFormErrors: (errors) => set((state) => {
          state.taskForm.errors = errors;
        }),

        setTaskFormTouched: (field, touched = true) => set((state) => {
          state.taskForm.touched[field] = touched;
        }),

        resetTaskForm: () => set((state) => {
          state.taskForm = {
            data: {},
            errors: {},
            touched: {},
            isSubmitting: false
          };
        }),

        // Analytics
        calculateAnalytics: () => set((state) => {
          const { tasks } = state;
          const totalTasks = tasks.length;
          const completedTasks = tasks.filter(t => t.status === 'completed').length;
          
          state.analytics = {
            completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
            averageCompletionTime: calculateAverageCompletionTime(tasks),
            tasksByStatus: tasks.reduce((acc, task) => {
              acc[task.status] = (acc[task.status] || 0) + 1;
              return acc;
            }, {}),
            tasksByPriority: tasks.reduce((acc, task) => {
              acc[task.priority] = (acc[task.priority] || 0) + 1;
              return acc;
            }, {}),
            tasksByCategory: tasks.reduce((acc, task) => {
              acc[task.category] = (acc[task.category] || 0) + 1;
              return acc;
            }, {}),
            productivityTrends: calculateProductivityTrends(tasks)
          };
        }),

        // Real-time updates
        toggleRealTime: (enabled) => set((state) => {
          state.realTimeEnabled = enabled;
        }),

        // Computed getters
        getFilteredTasks: () => {
          const { tasks, filters, showCompleted } = get();
          
          return tasks.filter(task => {
            if (!showCompleted && task.status === 'completed') return false;
            
            const matchesStatus = filters.status === 'all' || task.status === filters.status;
            const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
            const matchesCategory = filters.category === 'all' || task.category === filters.category;
            const matchesAssignee = filters.assignee === 'all' || task.assigneeId === filters.assignee;
            const matchesTags = filters.tags.length === 0 || 
              filters.tags.every(tag => task.tags?.includes(tag));
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

            return matchesStatus && matchesPriority && matchesCategory && 
                   matchesAssignee && matchesTags && matchesSearch && matchesDueDate;
          });
        },

        getMyTasks: () => {
          const { tasks } = get();
          const userId = JSON.parse(localStorage.getItem('auth-store') || '{}').state?.user?.id;
          
          return tasks.filter(task => task.assigneeId === userId);
        },

        getTaskStats: () => {
          const { tasks } = get();
          const now = new Date();
          
          return {
            total: tasks.length,
            completed: tasks.filter(t => t.status === 'completed').length,
            inProgress: tasks.filter(t => t.status === 'in_progress').length,
            pending: tasks.filter(t => t.status === 'pending').length,
            overdue: tasks.filter(t => new Date(t.dueDate) < now && t.status !== 'completed').length,
            dueToday: tasks.filter(t => {
              const dueDate = new Date(t.dueDate);
              return dueDate.toDateString() === now.toDateString();
            }).length,
            byPriority: tasks.reduce((acc, task) => {
              acc[task.priority] = (acc[task.priority] || 0) + 1;
              return acc;
            }, {}),
            byCategory: tasks.reduce((acc, task) => {
              acc[task.category] = (acc[task.category] || 0) + 1;
              return acc;
            }, {})
          };
        }
      })),
      {
        name: 'task-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          filters: state.filters,
          viewMode: state.viewMode,
          groupBy: state.groupBy,
          showCompleted: state.showCompleted,
          compactView: state.compactView,
          calendarView: state.calendarView,
          realTimeEnabled: state.realTimeEnabled
        })
      }
    )
  )
);

// Helper functions
function calculateAverageCompletionTime(tasks) {
  const completedTasks = tasks.filter(t => t.status === 'completed' && t.completedAt && t.createdAt);
  
  if (completedTasks.length === 0) return 0;
  
  const totalTime = completedTasks.reduce((sum, task) => {
    const completionTime = new Date(task.completedAt) - new Date(task.createdAt);
    return sum + completionTime;
  }, 0);
  
  return totalTime / completedTasks.length / (1000 * 60 * 60 * 24); // Convert to days
}

function calculateProductivityTrends(tasks) {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date: date.toISOString().split('T')[0],
      completed: 0,
      created: 0
    };
  }).reverse();

  tasks.forEach(task => {
    if (task.completedAt) {
      const completedDate = new Date(task.completedAt).toISOString().split('T')[0];
      const dayData = last30Days.find(d => d.date === completedDate);
      if (dayData) dayData.completed++;
    }
    
    if (task.createdAt) {
      const createdDate = new Date(task.createdAt).toISOString().split('T')[0];
      const dayData = last30Days.find(d => d.date === createdDate);
      if (dayData) dayData.created++;
    }
  });

  return last30Days;
}

export default useTaskStore;