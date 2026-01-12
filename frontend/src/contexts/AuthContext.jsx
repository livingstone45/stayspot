import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: false,
  loading: true,
  error: null,
  permissions: [],
  role: null,
  company: null,
  lastActivity: Date.now(),
  sessionExpiry: null,
  loginAttempts: 0,
  isLocked: false,
  twoFactorRequired: false,
  rememberMe: localStorage.getItem('rememberMe') === 'true'
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        permissions: action.payload.user.permissions || [],
        role: action.payload.user.role,
        company: action.payload.user.company,
        sessionExpiry: action.payload.expiresAt,
        loading: false,
        error: null,
        loginAttempts: 0,
        isLocked: false,
        twoFactorRequired: false,
        lastActivity: Date.now()
      };
    
    case 'LOGIN_FAILED':
      return {
        ...state,
        loginAttempts: state.loginAttempts + 1,
        isLocked: state.loginAttempts >= 4,
        error: action.payload,
        loading: false,
        twoFactorRequired: action.payload.includes('2FA')
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        token: null,
        refreshToken: null,
        loading: false,
        rememberMe: state.rememberMe
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        lastActivity: Date.now()
      };
    
    case 'UPDATE_PERMISSIONS':
      return {
        ...state,
        permissions: action.payload,
        lastActivity: Date.now()
      };
    
    case 'TOKEN_REFRESHED':
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        sessionExpiry: action.payload.expiresAt,
        lastActivity: Date.now()
      };
    
    case 'SESSION_EXPIRED':
      return {
        ...initialState,
        token: null,
        refreshToken: null,
        loading: false,
        error: 'Session expired. Please login again.',
        rememberMe: state.rememberMe
      };
    
    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        lastActivity: Date.now()
      };
    
    case 'SET_REMEMBER_ME':
      return {
        ...state,
        rememberMe: action.payload
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    case 'UNLOCK_ACCOUNT':
      return {
        ...state,
        isLocked: false,
        loginAttempts: 0
      };
    
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const apiCall = useCallback(async (endpoint, options = {}) => {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(state.token && { Authorization: `Bearer ${state.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && state.token) {
          await refreshToken();
          return apiCall(endpoint, options);
        }
        throw new Error(data.message || 'API request failed');
      }

      dispatch({ type: 'UPDATE_ACTIVITY' });
      return data;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [state.token, API_BASE]);

  const login = useCallback(async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        dispatch({ type: 'LOGIN_FAILED', payload: data.message });
        return { success: false, message: data.message };
      }

      // Store tokens
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', credentials.email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userEmail');
      }

      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      
      // Redirect based on user role
      const redirectPath = getRedirectPath(data.user.role);
      navigate(redirectPath);

      return { success: true, user: data.user };
    } catch (err) {
      dispatch({ type: 'LOGIN_FAILED', payload: err.message });
      return { success: false, message: err.message };
    }
  }, [API_BASE, navigate]);

  const logout = useCallback(async (reason = 'user_logout') => {
    try {
      if (state.token) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state.token}`,
          },
          body: JSON.stringify({ reason }),
        });
      }
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      // Clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      if (!state.rememberMe) {
        localStorage.removeItem('userEmail');
      }

      dispatch({ type: 'LOGOUT' });
      navigate('/login');
    }
  }, [state.token, state.rememberMe, API_BASE, navigate]);

  const refreshToken = useCallback(async () => {
    if (!state.refreshToken) {
      dispatch({ type: 'SESSION_EXPIRED' });
      navigate('/login');
      return false;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: state.refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        dispatch({ type: 'SESSION_EXPIRED' });
        navigate('/login');
        return false;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);

      dispatch({ type: 'TOKEN_REFRESHED', payload: data });
      return true;
    } catch (err) {
      dispatch({ type: 'SESSION_EXPIRED' });
      navigate('/login');
      return false;
    }
  }, [state.refreshToken, API_BASE, navigate]);

  const register = useCallback(async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        dispatch({ type: 'SET_ERROR', payload: data.message });
        return { success: false, message: data.message };
      }

      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: true, message: data.message };
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      return { success: false, message: err.message };
    }
  }, [API_BASE]);

  const updateProfile = useCallback(async (profileData) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const data = await apiCall('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      dispatch({ type: 'UPDATE_USER', payload: data.user });
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [apiCall]);

  const changePassword = useCallback(async (passwordData) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const data = await apiCall('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(passwordData),
      });

      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: true, message: data.message };
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, message: err.message };
    }
  }, [apiCall]);

  const forgotPassword = useCallback(async (email) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      dispatch({ type: 'SET_LOADING', payload: false });

      return {
        success: response.ok,
        message: data.message
      };
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      return { success: false, message: err.message };
    }
  }, [API_BASE]);

  const resetPassword = useCallback(async (resetData) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetData),
      });

      const data = await response.json();
      dispatch({ type: 'SET_LOADING', payload: false });

      return {
        success: response.ok,
        message: data.message
      };
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      return { success: false, message: err.message };
    }
  }, [API_BASE]);

  const verifyToken = useCallback(async () => {
    if (!state.token) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }

    try {
      const data = await apiCall('/auth/verify');
      dispatch({ type: 'UPDATE_USER', payload: data.user });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (err) {
      logout('token_invalid');
      return false;
    }
  }, [state.token, apiCall, logout]);

  const getRedirectPath = useCallback((role) => {
    const rolePaths = {
      system_admin: '/admin/dashboard',
      company_admin: '/company/dashboard',
      company_owner: '/company/overview',
      portfolio_manager: '/portfolio/dashboard',
      property_manager: '/properties/dashboard',
      leasing_specialist: '/leasing/dashboard',
      maintenance_supervisor: '/maintenance/dashboard',
      marketing_specialist: '/marketing/dashboard',
      financial_controller: '/financials/dashboard',
      landlord: '/landlord/dashboard',
      tenant: '/tenant/dashboard',
      vendor: '/vendor/dashboard',
      inspector: '/inspector/dashboard',
      accountant: '/accounting/dashboard'
    };

    return rolePaths[role] || '/dashboard';
  }, []);

  const hasPermission = useCallback((permission) => {
    if (!state.isAuthenticated || !state.user) return false;
    if (state.role === 'system_admin') return true;
    return state.permissions.includes(permission);
  }, [state.isAuthenticated, state.user, state.role, state.permissions]);

  const hasRole = useCallback((role) => {
    return state.isAuthenticated && state.role === role;
  }, [state.isAuthenticated, state.role]);

  const hasAnyRole = useCallback((roles) => {
    return state.isAuthenticated && roles.includes(state.role);
  }, [state.isAuthenticated, state.role]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const updateActivity = useCallback(() => {
    dispatch({ type: 'UPDATE_ACTIVITY' });
  }, []);

  // Session management
  useEffect(() => {
    const checkSession = () => {
      if (state.sessionExpiry && Date.now() > state.sessionExpiry) {
        dispatch({ type: 'SESSION_EXPIRED' });
        navigate('/login');
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [state.sessionExpiry, navigate]);

  // Auto-refresh token
  useEffect(() => {
    if (state.token && state.sessionExpiry) {
      const timeUntilExpiry = state.sessionExpiry - Date.now();
      const refreshTime = timeUntilExpiry - 300000; // Refresh 5 minutes before expiry

      if (refreshTime > 0) {
        const timeout = setTimeout(refreshToken, refreshTime);
        return () => clearTimeout(timeout);
      }
    }
  }, [state.token, state.sessionExpiry, refreshToken]);

  // Initialize auth state
  useEffect(() => {
    if (state.token) {
      verifyToken();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Activity tracking
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handleActivity = () => updateActivity();

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [updateActivity]);

  const value = {
    ...state,
    login,
    logout,
    register,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshToken,
    verifyToken,
    hasPermission,
    hasRole,
    hasAnyRole,
    clearError,
    updateActivity,
    apiCall,
    getRedirectPath
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;