import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from './useAuth';

export const useNotifications = () => {
  const { apiCall, user, isAuthenticated } = useAuth();
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priority: 'all',
    search: ''
  });

  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const fetchNotifications = useCallback(async (params = {}) => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        ...filters,
        ...params
      }).toString();

      const data = await apiCall(`/notifications?${queryParams}`);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, isAuthenticated, filters]);

  const markAsRead = useCallback(async (notificationId) => {
    if (!isAuthenticated) return;

    try {
      await apiCall(`/notifications/${notificationId}/read`, {
        method: 'PUT'
      });

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true, readAt: new Date().toISOString() }
            : notification
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall, isAuthenticated]);

  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      await apiCall('/notifications/read-all', {
        method: 'PUT'
      });

      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          read: true,
          readAt: new Date().toISOString()
        }))
      );

      setUnreadCount(0);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, isAuthenticated]);

  const deleteNotification = useCallback(async (notificationId) => {
    if (!isAuthenticated) return;

    try {
      await apiCall(`/notifications/${notificationId}`, {
        method: 'DELETE'
      });

      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiCall, isAuthenticated, notifications]);

  const deleteAllRead = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      await apiCall('/notifications/delete-read', {
        method: 'DELETE'
      });

      setNotifications(prev => prev.filter(notification => !notification.read));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, isAuthenticated]);

  const createNotification = useCallback(async (notificationData) => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/notifications', {
        method: 'POST',
        body: JSON.stringify({
          ...notificationData,
          userId: user.id
        })
      });

      setNotifications(prev => [data.notification, ...prev]);
      if (!data.notification.read) {
        setUnreadCount(prev => prev + 1);
      }

      return data.notification;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, isAuthenticated, user]);

  const sendBulkNotification = useCallback(async (notificationData, userIds) => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/notifications/bulk', {
        method: 'POST',
        body: JSON.stringify({
          ...notificationData,
          userIds,
          senderId: user.id
        })
      });

      return data.notifications;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, isAuthenticated, user]);

  const fetchPreferences = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/notifications/preferences');
      setPreferences(data.preferences || {});
      return data.preferences;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, isAuthenticated]);

  const updatePreferences = useCallback(async (newPreferences) => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/notifications/preferences', {
        method: 'PUT',
        body: JSON.stringify(newPreferences)
      });

      setPreferences(data.preferences);
      return data.preferences;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, isAuthenticated]);

  const subscribeToRealTime = useCallback(() => {
    if (!isAuthenticated || !realTimeEnabled || eventSourceRef.current) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const eventSource = new EventSource(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/notifications/stream?token=${token}`
      );

      eventSource.onopen = () => {
        console.log('Notification stream connected');
        reconnectAttempts.current = 0;
        setError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data);
          
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);

          // Show browser notification if permission granted
          if (Notification.permission === 'granted' && preferences.browserNotifications) {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/favicon.ico',
              tag: notification.id
            });
          }

          // Play sound if enabled
          if (preferences.soundNotifications) {
            const audio = new Audio('/notification-sound.mp3');
            audio.play().catch(() => {}); // Ignore errors
          }
        } catch (err) {
          console.error('Error parsing notification:', err);
        }
      };

      eventSource.onerror = (event) => {
        console.error('Notification stream error:', event);
        eventSource.close();
        eventSourceRef.current = null;

        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000;
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            subscribeToRealTime();
          }, delay);
        } else {
          setError('Failed to maintain real-time connection');
        }
      };

      eventSourceRef.current = eventSource;
    } catch (err) {
      console.error('Failed to establish notification stream:', err);
      setError('Failed to connect to real-time notifications');
    }
  }, [isAuthenticated, realTimeEnabled, preferences]);

  const unsubscribeFromRealTime = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    reconnectAttempts.current = 0;
  }, []);

  const requestBrowserPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      setError('Browser notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      setError('Browser notifications are blocked');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (err) {
      setError('Failed to request notification permission');
      return false;
    }
  }, []);

  const testNotification = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      await createNotification({
        title: 'Test Notification',
        message: 'This is a test notification to verify your settings.',
        type: 'info',
        priority: 'low'
      });
    } catch (err) {
      setError('Failed to send test notification');
    }
  }, [createNotification, isAuthenticated]);

  const getNotificationsByType = useCallback((type) => {
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.read);
  }, [notifications]);

  const getRecentNotifications = useCallback((hours = 24) => {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return notifications.filter(notification => 
      new Date(notification.createdAt) > cutoff
    );
  }, [notifications]);

  // Computed values
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesType = filters.type === 'all' || notification.type === filters.type;
      const matchesStatus = filters.status === 'all' || 
        (filters.status === 'read' && notification.read) ||
        (filters.status === 'unread' && !notification.read);
      const matchesPriority = filters.priority === 'all' || notification.priority === filters.priority;
      const matchesSearch = !filters.search || 
        notification.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        notification.message?.toLowerCase().includes(filters.search.toLowerCase());

      return matchesType && matchesStatus && matchesPriority && matchesSearch;
    });
  }, [notifications, filters]);

  const notificationStats = useMemo(() => {
    return {
      total: notifications.length,
      unread: unreadCount,
      read: notifications.length - unreadCount,
      byType: notifications.reduce((acc, notification) => {
        acc[notification.type] = (acc[notification.type] || 0) + 1;
        return acc;
      }, {}),
      byPriority: notifications.reduce((acc, notification) => {
        acc[notification.priority] = (acc[notification.priority] || 0) + 1;
        return acc;
      }, {}),
      recent: getRecentNotifications().length
    };
  }, [notifications, unreadCount, getRecentNotifications]);

  // Initialize and cleanup
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchPreferences();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && realTimeEnabled) {
      subscribeToRealTime();
    } else {
      unsubscribeFromRealTime();
    }

    return unsubscribeFromRealTime;
  }, [isAuthenticated, realTimeEnabled, subscribeToRealTime, unsubscribeFromRealTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unsubscribeFromRealTime();
    };
  }, [unsubscribeFromRealTime]);

  return {
    // State
    notifications: filteredNotifications,
    allNotifications: notifications,
    unreadCount,
    preferences,
    loading,
    error,
    filters,
    notificationStats,
    realTimeEnabled,

    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    createNotification,
    sendBulkNotification,
    fetchPreferences,
    updatePreferences,
    subscribeToRealTime,
    unsubscribeFromRealTime,
    requestBrowserPermission,
    testNotification,
    getNotificationsByType,
    getUnreadNotifications,
    getRecentNotifications,
    setFilters,
    setError,
    setRealTimeEnabled
  };
};

export default useNotifications;