import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';

export const useSocket = (namespace = '') => {
  const { user, token, isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  const socketRef = useRef(null);
  const listenersRef = useRef(new Map());
  const reconnectTimeoutRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);

  const maxReconnectAttempts = 5;
  const reconnectDelay = 1000;
  const heartbeatInterval = 30000; // 30 seconds

  const connect = useCallback(() => {
    if (!isAuthenticated || !token || socketRef.current?.connected) return;

    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    const socketPath = namespace ? `/${namespace}` : '';

    try {
      const socket = io(`${socketUrl}${socketPath}`, {
        auth: {
          token,
          userId: user?.id,
          companyId: user?.companyId
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: false, // Handle reconnection manually
        forceNew: true
      });

      socket.on('connect', () => {
        console.log(`Socket connected to ${socketUrl}${socketPath}`);
        setConnected(true);
        setError(null);
        setReconnectAttempts(0);
        setLastActivity(Date.now());

        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          socket.emit('ping', Date.now());
        }, heartbeatInterval);
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setConnected(false);
        
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }

        // Attempt reconnection for certain disconnect reasons
        if (reason === 'io server disconnect' || reason === 'transport close') {
          handleReconnect();
        }
      });

      socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        setError(err.message);
        setConnected(false);
        handleReconnect();
      });

      socket.on('error', (err) => {
        console.error('Socket error:', err);
        setError(err.message);
      });

      socket.on('pong', (timestamp) => {
        setLastActivity(timestamp);
      });

      socket.on('auth_error', (err) => {
        console.error('Socket authentication error:', err);
        setError('Authentication failed');
        disconnect();
      });

      // Re-register existing listeners
      listenersRef.current.forEach((callback, event) => {
        socket.on(event, callback);
      });

      socketRef.current = socket;
    } catch (err) {
      console.error('Failed to create socket connection:', err);
      setError(err.message);
    }
  }, [isAuthenticated, token, user, namespace]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setConnected(false);
    setReconnectAttempts(0);
  }, []);

  const handleReconnect = useCallback(() => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      setError('Maximum reconnection attempts reached');
      return;
    }

    const delay = reconnectDelay * Math.pow(2, reconnectAttempts);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      setReconnectAttempts(prev => prev + 1);
      connect();
    }, delay);
  }, [reconnectAttempts, connect]);

  const emit = useCallback((event, data, callback) => {
    if (!socketRef.current?.connected) {
      console.warn('Socket not connected, cannot emit event:', event);
      return false;
    }

    try {
      if (callback) {
        socketRef.current.emit(event, data, callback);
      } else {
        socketRef.current.emit(event, data);
      }
      return true;
    } catch (err) {
      console.error('Error emitting socket event:', err);
      setError(err.message);
      return false;
    }
  }, []);

  const on = useCallback((event, callback) => {
    if (!event || typeof callback !== 'function') return;

    // Store listener for reconnection
    listenersRef.current.set(event, callback);

    // Register with current socket if connected
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }

    // Return cleanup function
    return () => {
      listenersRef.current.delete(event);
      if (socketRef.current) {
        socketRef.current.off(event, callback);
      }
    };
  }, []);

  const off = useCallback((event, callback) => {
    listenersRef.current.delete(event);
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  }, []);

  const once = useCallback((event, callback) => {
    if (!socketRef.current?.connected) return;

    socketRef.current.once(event, callback);
  }, []);

  // Real-time communication helpers
  const joinRoom = useCallback((room) => {
    return emit('join_room', { room });
  }, [emit]);

  const leaveRoom = useCallback((room) => {
    return emit('leave_room', { room });
  }, [emit]);

  const sendMessage = useCallback((room, message, type = 'message') => {
    return emit('send_message', {
      room,
      message,
      type,
      sender: user?.id,
      timestamp: Date.now()
    });
  }, [emit, user]);

  const broadcastUpdate = useCallback((type, data) => {
    return emit('broadcast_update', {
      type,
      data,
      sender: user?.id,
      timestamp: Date.now()
    });
  }, [emit, user]);

  const subscribeToUpdates = useCallback((entityType, entityId, callback) => {
    const event = `${entityType}_update_${entityId}`;
    return on(event, callback);
  }, [on]);

  const unsubscribeFromUpdates = useCallback((entityType, entityId, callback) => {
    const event = `${entityType}_update_${entityId}`;
    off(event, callback);
  }, [off]);

  // Property-specific helpers
  const joinPropertyRoom = useCallback((propertyId) => {
    return joinRoom(`property_${propertyId}`);
  }, [joinRoom]);

  const leavePropertyRoom = useCallback((propertyId) => {
    return leaveRoom(`property_${propertyId}`);
  }, [leaveRoom]);

  const subscribeToPropertyUpdates = useCallback((propertyId, callback) => {
    return subscribeToUpdates('property', propertyId, callback);
  }, [subscribeToUpdates]);

  // Task-specific helpers
  const subscribeToTaskUpdates = useCallback((taskId, callback) => {
    return subscribeToUpdates('task', taskId, callback);
  }, [subscribeToUpdates]);

  const notifyTaskUpdate = useCallback((taskId, updateType, data) => {
    return emit('task_update', {
      taskId,
      updateType,
      data,
      updatedBy: user?.id,
      timestamp: Date.now()
    });
  }, [emit, user]);

  // Maintenance-specific helpers
  const subscribeToMaintenanceUpdates = useCallback((requestId, callback) => {
    return subscribeToUpdates('maintenance', requestId, callback);
  }, [subscribeToUpdates]);

  const notifyMaintenanceUpdate = useCallback((requestId, updateType, data) => {
    return emit('maintenance_update', {
      requestId,
      updateType,
      data,
      updatedBy: user?.id,
      timestamp: Date.now()
    });
  }, [emit, user]);

  // Team communication helpers
  const joinTeamRoom = useCallback(() => {
    if (user?.companyId) {
      return joinRoom(`company_${user.companyId}`);
    }
  }, [joinRoom, user]);

  const sendTeamMessage = useCallback((message, type = 'message') => {
    if (user?.companyId) {
      return sendMessage(`company_${user.companyId}`, message, type);
    }
  }, [sendMessage, user]);

  // Notification helpers
  const subscribeToNotifications = useCallback((callback) => {
    return on('notification', callback);
  }, [on]);

  const markNotificationAsRead = useCallback((notificationId) => {
    return emit('mark_notification_read', { notificationId });
  }, [emit]);

  // Connection status helpers
  const isConnected = useCallback(() => {
    return connected && socketRef.current?.connected;
  }, [connected]);

  const getConnectionStatus = useCallback(() => {
    return {
      connected,
      reconnectAttempts,
      lastActivity: new Date(lastActivity),
      error
    };
  }, [connected, reconnectAttempts, lastActivity, error]);

  const forceReconnect = useCallback(() => {
    disconnect();
    setReconnectAttempts(0);
    setTimeout(connect, 1000);
  }, [disconnect, connect]);

  // Initialize connection
  useEffect(() => {
    if (isAuthenticated && token) {
      connect();
    } else {
      disconnect();
    }

    return disconnect;
  }, [isAuthenticated, token, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    // Connection state
    connected,
    error,
    reconnectAttempts,
    lastActivity,

    // Core socket methods
    emit,
    on,
    off,
    once,
    connect,
    disconnect,
    forceReconnect,

    // Room management
    joinRoom,
    leaveRoom,
    sendMessage,
    broadcastUpdate,

    // Entity subscriptions
    subscribeToUpdates,
    unsubscribeFromUpdates,

    // Property helpers
    joinPropertyRoom,
    leavePropertyRoom,
    subscribeToPropertyUpdates,

    // Task helpers
    subscribeToTaskUpdates,
    notifyTaskUpdate,

    // Maintenance helpers
    subscribeToMaintenanceUpdates,
    notifyMaintenanceUpdate,

    // Team communication
    joinTeamRoom,
    sendTeamMessage,

    // Notifications
    subscribeToNotifications,
    markNotificationAsRead,

    // Status helpers
    isConnected,
    getConnectionStatus
  };
};

export default useSocket;