import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

const initialState = {
  notifications: [],
  unreadCount: 0,
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
      marketing: false
    }
  },
  filters: {
    type: 'all',
    status: 'all',
    priority: 'all',
    search: ''
  },
  loading: false,
  error: null,
  realTimeEnabled: true,
  connectionStatus: 'disconnected',
  lastSync: null,
  queue: [],
  retryAttempts: 0,
  maxRetries: 3,
  soundEnabled: true,
  vibrationEnabled: true
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload.notifications,
        unreadCount: action.payload.unreadCount,
        loading: false,
        error: null,
        lastSync: Date.now()
      };
    
    case 'ADD_NOTIFICATION':
      const newNotification = action.payload;
      const updatedNotifications = [newNotification, ...state.notifications];
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: newNotification.read ? state.unreadCount : state.unreadCount + 1
      };
    
    case 'UPDATE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload.id ? action.payload : notification
        )
      };
    
    case 'MARK_AS_READ':
      const notificationToRead = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload 
            ? { ...notification, read: true, readAt: new Date().toISOString() }
            : notification
        ),
        unreadCount: notificationToRead && !notificationToRead.read 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount
      };
    
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          read: true,
          readAt: new Date().toISOString()
        })),
        unreadCount: 0
      };
    
    case 'DELETE_NOTIFICATION':
      const notificationToDelete = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
        unreadCount: notificationToDelete && !notificationToDelete.read 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount
      };
    
    case 'DELETE_ALL_READ':
      return {
        ...state,
        notifications: state.notifications.filter(notification => !notification.read)
      };
    
    case 'SET_PREFERENCES':
      return { ...state, preferences: action.payload };
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };
    
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };
    
    case 'TOGGLE_REAL_TIME':
      return { ...state, realTimeEnabled: action.payload };
    
    case 'ADD_TO_QUEUE':
      return { ...state, queue: [...state.queue, action.payload] };
    
    case 'REMOVE_FROM_QUEUE':
      return {
        ...state,
        queue: state.queue.filter(item => item.id !== action.payload)
      };
    
    case 'CLEAR_QUEUE':
      return { ...state, queue: [] };
    
    case 'SET_RETRY_ATTEMPTS':
      return { ...state, retryAttempts: action.payload };
    
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: action.payload };
    
    case 'TOGGLE_VIBRATION':
      return { ...state, vibrationEnabled: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { apiCall, isAuthenticated, user } = useAuth();
  
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const audioRef = useRef(null);
  const serviceWorkerRef = useRef(null);

  const fetchNotifications = useCallback(async (params = {}) => {
    if (!isAuthenticated) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const queryParams = new URLSearchParams({
        ...state.filters,
        ...params
      }).toString();

      const data = await apiCall(`/notifications?${queryParams}`);
      
      dispatch({
        type: 'SET_NOTIFICATIONS',
        payload: {
          notifications: data.notifications || [],
          unreadCount: data.unreadCount || 0
        }
      });
      
      return data;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, isAuthenticated, state.filters]);

  const markAsRead = useCallback(async (notificationId) => {
    if (!isAuthenticated) return;

    try {
      await apiCall(`/notifications/${notificationId}/read`, {
        method: 'PUT'
      });

      dispatch({ type: 'MARK_AS_READ', payload: notificationId });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, isAuthenticated]);

  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await apiCall('/notifications/read-all', {
        method: 'PUT'
      });

      dispatch({ type: 'MARK_ALL_AS_READ' });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [apiCall, isAuthenticated]);

  const deleteNotification = useCallback(async (notificationId) => {
    if (!isAuthenticated) return;

    try {
      await apiCall(`/notifications/${notificationId}`, {
        method: 'DELETE'
      });

      dispatch({ type: 'DELETE_NOTIFICATION', payload: notificationId });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, isAuthenticated]);

  const deleteAllRead = useCallback(async () => {
    if (!isAuthenticated) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await apiCall('/notifications/delete-read', {
        method: 'DELETE'
      });

      dispatch({ type: 'DELETE_ALL_READ' });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [apiCall, isAuthenticated]);

  const createNotification = useCallback(async (notificationData) => {
    if (!isAuthenticated) return;

    try {
      const data = await apiCall('/notifications', {
        method: 'POST',
        body: JSON.stringify({
          ...notificationData,
          userId: user?.id
        })
      });

      dispatch({ type: 'ADD_NOTIFICATION', payload: data.notification });
      return data.notification;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, isAuthenticated, user]);

  const sendBulkNotification = useCallback(async (notificationData, userIds) => {
    if (!isAuthenticated) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const data = await apiCall('/notifications/bulk', {
        method: 'POST',
        body: JSON.stringify({
          ...notificationData,
          userIds,
          senderId: user?.id
        })
      });

      dispatch({ type: 'SET_LOADING', payload: false });
      return data.notifications;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, isAuthenticated, user]);

  const fetchPreferences = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const data = await apiCall('/notifications/preferences');
      dispatch({ type: 'SET_PREFERENCES', payload: data.preferences || state.preferences });
      return data.preferences;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, isAuthenticated, state.preferences]);

  const updatePreferences = useCallback(async (newPreferences) => {
    if (!isAuthenticated) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const data = await apiCall('/notifications/preferences', {
        method: 'PUT',
        body: JSON.stringify(newPreferences)
      });

      dispatch({ type: 'SET_PREFERENCES', payload: data.preferences });
      dispatch({ type: 'SET_LOADING', payload: false });
      return data.preferences;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, isAuthenticated]);

  const requestBrowserPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      dispatch({ type: 'SET_ERROR', payload: 'Browser notifications not supported' });
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      dispatch({ type: 'SET_ERROR', payload: 'Browser notifications are blocked' });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      
      if (granted) {
        dispatch({ type: 'UPDATE_PREFERENCES', payload: { browser: true } });
      }
      
      return granted;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to request notification permission' });
      return false;
    }
  }, []);

  const showBrowserNotification = useCallback((notification) => {
    if (!state.preferences.browser || Notification.permission !== 'granted') return;

    // Check quiet hours
    if (state.preferences.quietHours.enabled) {
      const now = new Date();
      const currentTime = now.getHours() * 100 + now.getMinutes();
      const startTime = parseInt(state.preferences.quietHours.start.replace(':', ''));
      const endTime = parseInt(state.preferences.quietHours.end.replace(':', ''));
      
      if (startTime > endTime) { // Overnight quiet hours
        if (currentTime >= startTime || currentTime <= endTime) return;
      } else { // Same day quiet hours
        if (currentTime >= startTime && currentTime <= endTime) return;
      }
    }

    // Check do not disturb
    if (state.preferences.doNotDisturb) return;

    // Check category preferences
    if (!state.preferences.categories[notification.category]) return;

    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: notification.icon || '/favicon.ico',
      tag: notification.id,
      badge: '/badge-icon.png',
      data: notification,
      requireInteraction: notification.priority === 'high',
      silent: !state.preferences.sound
    });

    browserNotification.onclick = () => {
      window.focus();
      markAsRead(notification.id);
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
  }, [state.preferences, markAsRead]);

  const playNotificationSound = useCallback(() => {
    if (!state.preferences.sound || !state.soundEnabled) return;

    if (!audioRef.current) {
      audioRef.current = new Audio('/notification-sound.mp3');
      audioRef.current.volume = 0.5;
    }

    audioRef.current.play().catch(() => {
      // Ignore audio play errors (user interaction required)
    });
  }, [state.preferences.sound, state.soundEnabled]);

  const vibrateDevice = useCallback(() => {
    if (!state.preferences.vibration || !state.vibrationEnabled) return;
    
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }, [state.preferences.vibration, state.vibrationEnabled]);

  const handleNewNotification = useCallback((notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    // Show browser notification
    showBrowserNotification(notification);
    
    // Play sound
    playNotificationSound();
    
    // Vibrate device
    vibrateDevice();
    
    // Add to queue for offline handling
    if (state.connectionStatus === 'disconnected') {
      dispatch({ type: 'ADD_TO_QUEUE', payload: notification });
    }
  }, [showBrowserNotification, playNotificationSound, vibrateDevice, state.connectionStatus]);

  const subscribeToRealTime = useCallback(() => {
    if (!isAuthenticated || !state.realTimeEnabled || eventSourceRef.current) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connecting' });
      
      const eventSource = new EventSource(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/notifications/stream?token=${token}`
      );

      eventSource.onopen = () => {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });
        dispatch({ type: 'SET_RETRY_ATTEMPTS', payload: 0 });
        dispatch({ type: 'CLEAR_ERROR' });
      };

      eventSource.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data);
          handleNewNotification(notification);
        } catch (err) {
          console.error('Error parsing notification:', err);
        }
      };

      eventSource.onerror = (event) => {
        console.error('Notification stream error:', event);
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' });
        eventSource.close();
        eventSourceRef.current = null;

        // Attempt to reconnect with exponential backoff
        if (state.retryAttempts < state.maxRetries) {
          const delay = Math.pow(2, state.retryAttempts) * 1000;
          reconnectTimeoutRef.current = setTimeout(() => {
            dispatch({ type: 'SET_RETRY_ATTEMPTS', payload: state.retryAttempts + 1 });
            subscribeToRealTime();
          }, delay);
        } else {
          dispatch({ type: 'SET_ERROR', payload: 'Failed to maintain real-time connection' });
        }
      };

      eventSourceRef.current = eventSource;
    } catch (err) {
      console.error('Failed to establish notification stream:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to connect to real-time notifications' });
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' });
    }
  }, [isAuthenticated, state.realTimeEnabled, state.retryAttempts, state.maxRetries, handleNewNotification]);

  const unsubscribeFromRealTime = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' });
    dispatch({ type: 'SET_RETRY_ATTEMPTS', payload: 0 });
  }, []);

  const processQueue = useCallback(async () => {
    if (state.queue.length === 0 || state.connectionStatus !== 'connected') return;

    for (const queuedNotification of state.queue) {
      try {
        await apiCall('/notifications/sync', {
          method: 'POST',
          body: JSON.stringify(queuedNotification)
        });
        
        dispatch({ type: 'REMOVE_FROM_QUEUE', payload: queuedNotification.id });
      } catch (err) {
        console.error('Failed to sync queued notification:', err);
        break; // Stop processing if sync fails
      }
    }
  }, [state.queue, state.connectionStatus, apiCall]);

  const setFilters = useCallback((newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  }, []);

  const toggleRealTime = useCallback((enabled) => {
    dispatch({ type: 'TOGGLE_REAL_TIME', payload: enabled });
    
    if (enabled) {
      subscribeToRealTime();
    } else {
      unsubscribeFromRealTime();
    }
  }, [subscribeToRealTime, unsubscribeFromRealTime]);

  const toggleSound = useCallback((enabled) => {
    dispatch({ type: 'TOGGLE_SOUND', payload: enabled });
  }, []);

  const toggleVibration = useCallback((enabled) => {
    dispatch({ type: 'TOGGLE_VIBRATION', payload: enabled });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Computed values
  const filteredNotifications = useMemo(() => {
    return state.notifications.filter(notification => {
      const matchesType = state.filters.type === 'all' || notification.type === state.filters.type;
      const matchesStatus = state.filters.status === 'all' || 
        (state.filters.status === 'read' && notification.read) ||
        (state.filters.status === 'unread' && !notification.read);
      const matchesPriority = state.filters.priority === 'all' || notification.priority === state.filters.priority;
      const matchesSearch = !state.filters.search || 
        notification.title?.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        notification.message?.toLowerCase().includes(state.filters.search.toLowerCase());

      return matchesType && matchesStatus && matchesPriority && matchesSearch;
    });
  }, [state.notifications, state.filters]);

  const notificationStats = useMemo(() => {
    return {
      total: state.notifications.length,
      unread: state.unreadCount,
      read: state.notifications.length - state.unreadCount,
      byType: state.notifications.reduce((acc, notification) => {
        acc[notification.type] = (acc[notification.type] || 0) + 1;
        return acc;
      }, {}),
      byPriority: state.notifications.reduce((acc, notification) => {
        acc[notification.priority] = (acc[notification.priority] || 0) + 1;
        return acc;
      }, {}),
      recent: state.notifications.filter(n => 
        Date.now() - new Date(n.createdAt).getTime() < 24 * 60 * 60 * 1000
      ).length
    };
  }, [state.notifications, state.unreadCount]);

  // Initialize
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchPreferences();
    }
  }, [isAuthenticated]);

  // Real-time connection management
  useEffect(() => {
    if (isAuthenticated && state.realTimeEnabled) {
      subscribeToRealTime();
    } else {
      unsubscribeFromRealTime();
    }

    return unsubscribeFromRealTime;
  }, [isAuthenticated, state.realTimeEnabled, subscribeToRealTime, unsubscribeFromRealTime]);

  // Process queue when connection is restored
  useEffect(() => {
    if (state.connectionStatus === 'connected') {
      processQueue();
    }
  }, [state.connectionStatus, processQueue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unsubscribeFromRealTime();
    };
  }, [unsubscribeFromRealTime]);

  const value = useMemo(() => ({
    ...state,
    filteredNotifications,
    notificationStats,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    createNotification,
    sendBulkNotification,
    fetchPreferences,
    updatePreferences,
    requestBrowserPermission,
    subscribeToRealTime,
    unsubscribeFromRealTime,
    setFilters,
    toggleRealTime,
    toggleSound,
    toggleVibration,
    clearError
  }), [
    state,
    filteredNotifications,
    notificationStats,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    createNotification,
    sendBulkNotification,
    fetchPreferences,
    updatePreferences,
    requestBrowserPermission,
    subscribeToRealTime,
    unsubscribeFromRealTime,
    setFilters,
    toggleRealTime,
    toggleSound,
    toggleVibration,
    clearError
  ]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;