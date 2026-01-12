import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const initialState = {
  // Notifications data
  notifications: [],
  unreadCount: 0,
  
  // Loading states
  loading: false,
  markingAsRead: false,
  
  // Error states
  error: null,
  
  // Filters
  filters: {
    type: 'all',
    status: 'all',
    priority: 'all',
    category: 'all',
    search: ''
  },
  
  // Pagination
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasMore: true
  },
  
  // Preferences
  preferences: {
    email: true,
    push: true,
    sms: false,
    browser: true,
    sound: true,
    vibration: true,
    doNotDisturb: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    categories: {
      maintenance: true,
      payments: true,
      leases: true,
      messages: true,
      system: true,
      marketing: false,
      security: true,
      reminders: true
    },
    frequency: {
      immediate: true,
      daily: false,
      weekly: false
    }
  },
  
  // Real-time connection
  realTimeEnabled: true,
  connectionStatus: 'disconnected', // disconnected, connecting, connected, error
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,
  
  // Queue for offline notifications
  queue: [],
  
  // Sound and vibration
  soundEnabled: true,
  vibrationEnabled: true,
  
  // Browser notification permission
  browserPermission: 'default', // default, granted, denied
  
  // Notification templates
  templates: [],
  
  // Analytics
  analytics: {
    totalSent: 0,
    totalRead: 0,
    readRate: 0,
    byType: {},
    byCategory: {},
    byPriority: {},
    trends: []
  },
  
  // Bulk operations
  bulkOperations: {
    selected: [],
    operation: null,
    progress: 0
  },
  
  // Toast notifications (in-app)
  toasts: [],
  toastCounter: 0,
  
  // Last sync timestamp
  lastSync: null
};

export const useNotificationStore = create(
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
        }),

        // Notifications actions
        fetchNotifications: async (params = {}) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const { filters, pagination } = get();
            const queryParams = new URLSearchParams({
              ...filters,
              page: params.page || pagination.page,
              limit: params.limit || pagination.limit,
              ...params
            }).toString();

            const response = await fetch(`${API_BASE}/notifications?${queryParams}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to fetch notifications');
            }

            set((state) => {
              if (params.page === 1 || !params.page) {
                // Replace notifications for first page or refresh
                state.notifications = data.notifications || [];
              } else {
                // Append for pagination
                state.notifications.push(...(data.notifications || []));
              }
              
              state.unreadCount = data.unreadCount || 0;
              state.pagination = {
                ...state.pagination,
                page: data.pagination?.page || state.pagination.page,
                total: data.pagination?.total || 0,
                hasMore: data.pagination?.hasMore || false
              };
              state.loading = false;
              state.lastSync = Date.now();
            });

            return data;
          } catch (err) {
            set((state) => {
              state.error = err.message;
              state.loading = false;
            });
            throw err;
          }
        },

        loadMoreNotifications: async () => {
          const { pagination, loading } = get();
          
          if (loading || !pagination.hasMore) return;

          await get().fetchNotifications({ page: pagination.page + 1 });
        },

        markAsRead: async (notificationId) => {
          set((state) => {
            state.markingAsRead = true;
          });

          try {
            const response = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
              method: 'PUT',
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || 'Failed to mark as read');
            }

            set((state) => {
              const notification = state.notifications.find(n => n.id === notificationId);
              if (notification && !notification.read) {
                notification.read = true;
                notification.readAt = new Date().toISOString();
                state.unreadCount = Math.max(0, state.unreadCount - 1);
              }
              state.markingAsRead = false;
            });

            return true;
          } catch (err) {
            set((state) => {
              state.error = err.message;
              state.markingAsRead = false;
            });
            throw err;
          }
        },

        markAllAsRead: async () => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await fetch(`${API_BASE}/notifications/read-all`, {
              method: 'PUT',
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || 'Failed to mark all as read');
            }

            set((state) => {
              state.notifications.forEach(notification => {
                if (!notification.read) {
                  notification.read = true;
                  notification.readAt = new Date().toISOString();
                }
              });
              state.unreadCount = 0;
              state.loading = false;
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

        deleteNotification: async (notificationId) => {
          try {
            const response = await fetch(`${API_BASE}/notifications/${notificationId}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || 'Failed to delete notification');
            }

            set((state) => {
              const notification = state.notifications.find(n => n.id === notificationId);
              if (notification && !notification.read) {
                state.unreadCount = Math.max(0, state.unreadCount - 1);
              }
              state.notifications = state.notifications.filter(n => n.id !== notificationId);
              state.pagination.total = Math.max(0, state.pagination.total - 1);
            });

            return true;
          } catch (err) {
            set((state) => {
              state.error = err.message;
            });
            throw err;
          }
        },

        deleteAllRead: async () => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await fetch(`${API_BASE}/notifications/delete-read`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || 'Failed to delete read notifications');
            }

            set((state) => {
              const readCount = state.notifications.filter(n => n.read).length;
              state.notifications = state.notifications.filter(n => !n.read);
              state.pagination.total = Math.max(0, state.pagination.total - readCount);
              state.loading = false;
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

        // Add new notification (from real-time or manual)
        addNotification: (notification) => set((state) => {
          // Avoid duplicates
          if (!state.notifications.find(n => n.id === notification.id)) {
            state.notifications.unshift(notification);
            
            if (!notification.read) {
              state.unreadCount += 1;
            }
            
            state.pagination.total += 1;
            
            // Show browser notification if enabled
            get().showBrowserNotification(notification);
            
            // Play sound if enabled
            get().playNotificationSound();
            
            // Vibrate if enabled
            get().vibrateDevice();
            
            // Add to toast if high priority
            if (notification.priority === 'high' || notification.priority === 'urgent') {
              get().addToast({
                type: 'notification',
                title: notification.title,
                message: notification.message,
                priority: notification.priority,
                duration: notification.priority === 'urgent' ? 0 : 5000 // Urgent stays until dismissed
              });
            }
          }
        }),

        // Preferences actions
        fetchPreferences: async () => {
          try {
            const response = await fetch(`${API_BASE}/notifications/preferences`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to fetch preferences');
            }

            set((state) => {
              state.preferences = { ...state.preferences, ...data.preferences };
            });

            return data.preferences;
          } catch (err) {
            set((state) => {
              state.error = err.message;
            });
            throw err;
          }
        },

        updatePreferences: async (newPreferences) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await fetch(`${API_BASE}/notifications/preferences`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(newPreferences)
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to update preferences');
            }

            set((state) => {
              state.preferences = { ...state.preferences, ...data.preferences };
              state.loading = false;
            });

            return data.preferences;
          } catch (err) {
            set((state) => {
              state.error = err.message;
              state.loading = false;
            });
            throw err;
          }
        },

        // Browser notification permission
        requestBrowserPermission: async () => {
          if (!('Notification' in window)) {
            set((state) => {
              state.error = 'Browser notifications not supported';
              state.browserPermission = 'denied';
            });
            return false;
          }

          if (Notification.permission === 'granted') {
            set((state) => {
              state.browserPermission = 'granted';
            });
            return true;
          }

          if (Notification.permission === 'denied') {
            set((state) => {
              state.browserPermission = 'denied';
            });
            return false;
          }

          try {
            const permission = await Notification.requestPermission();
            
            set((state) => {
              state.browserPermission = permission;
            });

            if (permission === 'granted') {
              // Update preferences to enable browser notifications
              await get().updatePreferences({ browser: true });
              return true;
            }

            return false;
          } catch (err) {
            set((state) => {
              state.error = 'Failed to request notification permission';
              state.browserPermission = 'denied';
            });
            return false;
          }
        },

        showBrowserNotification: (notification) => {
          const { preferences, browserPermission } = get();
          
          if (!preferences.browser || browserPermission !== 'granted') return;

          // Check quiet hours
          if (preferences.quietHours.enabled) {
            const now = new Date();
            const currentTime = now.getHours() * 100 + now.getMinutes();
            const startTime = parseInt(preferences.quietHours.start.replace(':', ''));
            const endTime = parseInt(preferences.quietHours.end.replace(':', ''));
            
            if (startTime > endTime) { // Overnight quiet hours
              if (currentTime >= startTime || currentTime <= endTime) return;
            } else { // Same day quiet hours
              if (currentTime >= startTime && currentTime <= endTime) return;
            }
          }

          // Check do not disturb
          if (preferences.doNotDisturb) return;

          // Check category preferences
          if (!preferences.categories[notification.category]) return;

          const browserNotification = new Notification(notification.title, {
            body: notification.message,
            icon: notification.icon || '/favicon.ico',
            tag: notification.id,
            badge: '/badge-icon.png',
            data: notification,
            requireInteraction: notification.priority === 'urgent',
            silent: !preferences.sound
          });

          browserNotification.onclick = () => {
            window.focus();
            get().markAsRead(notification.id);
            browserNotification.close();
            
            // Navigate to relevant page if URL provided
            if (notification.actionUrl) {
              window.location.href = notification.actionUrl;
            }
          };

          // Auto-close after 5 seconds for low priority notifications
          if (notification.priority === 'low') {
            setTimeout(() => {
              browserNotification.close();
            }, 5000);
          }
        },

        playNotificationSound: () => {
          const { preferences, soundEnabled } = get();
          
          if (!preferences.sound || !soundEnabled) return;

          // Create and play audio
          const audio = new Audio('/notification-sound.mp3');
          audio.volume = 0.5;
          audio.play().catch(() => {
            // Ignore errors (user interaction required)
          });
        },

        vibrateDevice: () => {
          const { preferences, vibrationEnabled } = get();
          
          if (!preferences.vibration || !vibrationEnabled) return;
          
          if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
        },

        // Toast notifications (in-app)
        addToast: (toast) => set((state) => {
          const id = state.toastCounter + 1;
          const newToast = {
            id,
            ...toast,
            timestamp: Date.now()
          };
          
          state.toasts.unshift(newToast);
          state.toastCounter = id;
          
          // Auto-remove after duration (if specified)
          if (toast.duration && toast.duration > 0) {
            setTimeout(() => {
              get().removeToast(id);
            }, toast.duration);
          }
        }),

        removeToast: (toastId) => set((state) => {
          state.toasts = state.toasts.filter(t => t.id !== toastId);
        }),

        clearAllToasts: () => set((state) => {
          state.toasts = [];
        }),

        // Filters and search
        setFilters: (newFilters) => set((state) => {
          state.filters = { ...state.filters, ...newFilters };
          state.pagination.page = 1; // Reset pagination
        }),

        searchNotifications: async (searchTerm) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await fetch(`${API_BASE}/notifications/search?q=${encodeURIComponent(searchTerm)}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Search failed');
            }

            set((state) => {
              state.loading = false;
            });

            return data.notifications || [];
          } catch (err) {
            set((state) => {
              state.error = err.message;
              state.loading = false;
            });
            throw err;
          }
        },

        // Bulk operations
        bulkMarkAsRead: async (notificationIds) => {
          set((state) => {
            state.bulkOperations.operation = 'mark_read';
            state.bulkOperations.progress = 0;
          });

          try {
            const response = await fetch(`${API_BASE}/notifications/bulk-read`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ notificationIds })
            });

            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || 'Bulk mark as read failed');
            }

            set((state) => {
              let unreadReduced = 0;
              notificationIds.forEach(id => {
                const notification = state.notifications.find(n => n.id === id);
                if (notification && !notification.read) {
                  notification.read = true;
                  notification.readAt = new Date().toISOString();
                  unreadReduced++;
                }
              });
              
              state.unreadCount = Math.max(0, state.unreadCount - unreadReduced);
              state.bulkOperations.operation = null;
              state.bulkOperations.progress = 100;
            });

            return true;
          } catch (err) {
            set((state) => {
              state.bulkOperations.operation = null;
              state.error = err.message;
            });
            throw err;
          }
        },

        bulkDelete: async (notificationIds) => {
          set((state) => {
            state.bulkOperations.operation = 'delete';
            state.bulkOperations.progress = 0;
          });

          try {
            const response = await fetch(`${API_BASE}/notifications/bulk-delete`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ notificationIds })
            });

            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || 'Bulk delete failed');
            }

            set((state) => {
              let unreadReduced = 0;
              notificationIds.forEach(id => {
                const notification = state.notifications.find(n => n.id === id);
                if (notification && !notification.read) {
                  unreadReduced++;
                }
              });
              
              state.notifications = state.notifications.filter(n => !notificationIds.includes(n.id));
              state.unreadCount = Math.max(0, state.unreadCount - unreadReduced);
              state.pagination.total = Math.max(0, state.pagination.total - notificationIds.length);
              state.bulkOperations.operation = null;
              state.bulkOperations.progress = 100;
            });

            return true;
          } catch (err) {
            set((state) => {
              state.bulkOperations.operation = null;
              state.error = err.message;
            });
            throw err;
          }
        },

        // Selection
        setBulkSelected: (notificationIds) => set((state) => {
          state.bulkOperations.selected = notificationIds;
        }),

        toggleBulkSelection: (notificationId) => set((state) => {
          const index = state.bulkOperations.selected.indexOf(notificationId);
          if (index === -1) {
            state.bulkOperations.selected.push(notificationId);
          } else {
            state.bulkOperations.selected.splice(index, 1);
          }
        }),

        selectAllNotifications: () => set((state) => {
          state.bulkOperations.selected = state.notifications.map(n => n.id);
        }),

        clearBulkSelection: () => set((state) => {
          state.bulkOperations.selected = [];
        }),

        // Real-time connection management
        setConnectionStatus: (status) => set((state) => {
          state.connectionStatus = status;
        }),

        setReconnectAttempts: (attempts) => set((state) => {
          state.reconnectAttempts = attempts;
        }),

        toggleRealTime: (enabled) => set((state) => {
          state.realTimeEnabled = enabled;
        }),

        toggleSound: (enabled) => set((state) => {
          state.soundEnabled = enabled;
        }),

        toggleVibration: (enabled) => set((state) => {
          state.vibrationEnabled = enabled;
        }),

        // Queue management (for offline notifications)
        addToQueue: (notification) => set((state) => {
          state.queue.push(notification);
        }),

        removeFromQueue: (notificationId) => set((state) => {
          state.queue = state.queue.filter(n => n.id !== notificationId);
        }),

        clearQueue: () => set((state) => {
          state.queue = [];
        }),

        processQueue: async () => {
          const { queue, connectionStatus } = get();
          
          if (queue.length === 0 || connectionStatus !== 'connected') return;

          for (const queuedNotification of queue) {
            try {
              await fetch(`${API_BASE}/notifications/sync`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(queuedNotification)
              });
              
              get().removeFromQueue(queuedNotification.id);
            } catch (err) {
              console.error('Failed to sync queued notification:', err);
              break; // Stop processing if sync fails
            }
          }
        },

        // Analytics
        fetchAnalytics: async (timeframe = '30d') => {
          try {
            const response = await fetch(`${API_BASE}/notifications/analytics?timeframe=${timeframe}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to fetch analytics');
            }

            set((state) => {
              state.analytics = data.analytics;
            });

            return data.analytics;
          } catch (err) {
            set((state) => {
              state.error = err.message;
            });
            throw err;
          }
        },

        // Computed getters
        getFilteredNotifications: () => {
          const { notifications, filters } = get();
          
          return notifications.filter(notification => {
            const matchesType = filters.type === 'all' || notification.type === filters.type;
            const matchesStatus = filters.status === 'all' || 
              (filters.status === 'read' && notification.read) ||
              (filters.status === 'unread' && !notification.read);
            const matchesPriority = filters.priority === 'all' || notification.priority === filters.priority;
            const matchesCategory = filters.category === 'all' || notification.category === filters.category;
            const matchesSearch = !filters.search || 
              notification.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
              notification.message?.toLowerCase().includes(filters.search.toLowerCase());

            return matchesType && matchesStatus && matchesPriority && matchesCategory && matchesSearch;
          });
        },

        getUnreadNotifications: () => {
          const { notifications } = get();
          return notifications.filter(n => !n.read);
        },

        getRecentNotifications: (hours = 24) => {
          const { notifications } = get();
          const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
          return notifications.filter(n => new Date(n.createdAt) > cutoff);
        },

        getNotificationStats: () => {
          const { notifications, unreadCount } = get();
          
          return {
            total: notifications.length,
            unread: unreadCount,
            read: notifications.length - unreadCount,
            byType: notifications.reduce((acc, n) => {
              acc[n.type] = (acc[n.type] || 0) + 1;
              return acc;
            }, {}),
            byPriority: notifications.reduce((acc, n) => {
              acc[n.priority] = (acc[n.priority] || 0) + 1;
              return acc;
            }, {}),
            byCategory: notifications.reduce((acc, n) => {
              acc[n.category] = (acc[n.category] || 0) + 1;
              return acc;
            }, {}),
            recent: get().getRecentNotifications().length
          };
        }
      })),
      {
        name: 'notification-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          preferences: state.preferences,
          realTimeEnabled: state.realTimeEnabled,
          soundEnabled: state.soundEnabled,
          vibrationEnabled: state.vibrationEnabled,
          browserPermission: state.browserPermission,
          filters: state.filters
        })
      }
    )
  )
);

// Initialize browser permission status
if (typeof window !== 'undefined' && 'Notification' in window) {
  useNotificationStore.setState({ browserPermission: Notification.permission });
}

export default useNotificationStore;