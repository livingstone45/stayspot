import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const initialState = {
  // User state
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  
  // Loading states
  loading: false,
  loginLoading: false,
  registerLoading: false,
  
  // Error states
  error: null,
  loginError: null,
  registerError: null,
  
  // Session management
  sessionExpiry: null,
  lastActivity: Date.now(),
  loginAttempts: 0,
  isLocked: false,
  lockoutExpiry: null,
  
  // Security features
  twoFactorRequired: false,
  twoFactorToken: null,
  rememberMe: false,
  
  // Permissions and roles
  permissions: [],
  role: null,
  company: null,
  
  // Device and session info
  deviceId: null,
  sessionId: null,
  ipAddress: null,
  userAgent: null,
  
  // Preferences
  preferences: {
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    notifications: true
  },
  
  // Activity tracking
  activityLog: [],
  loginHistory: []
};

export const useAuthStore = create(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Actions
        setLoading: (loading) => set((state) => {
          state.loading = loading;
        }),

        setError: (error) => set((state) => {
          state.error = error;
          state.loading = false;
        }),

        clearError: () => set((state) => {
          state.error = null;
          state.loginError = null;
          state.registerError = null;
        }),

        updateActivity: () => set((state) => {
          state.lastActivity = Date.now();
        }),

        // Authentication actions
        login: async (credentials) => {
          set((state) => {
            state.loginLoading = true;
            state.loginError = null;
          });

          try {
            const response = await fetch(`${API_BASE}/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...credentials,
                deviceId: get().deviceId || generateDeviceId(),
                userAgent: navigator.userAgent
              })
            });

            const data = await response.json();

            if (!response.ok) {
              if (data.code === 'ACCOUNT_LOCKED') {
                set((state) => {
                  state.isLocked = true;
                  state.lockoutExpiry = data.lockoutExpiry;
                });
              }
              
              if (data.code === 'TWO_FACTOR_REQUIRED') {
                set((state) => {
                  state.twoFactorRequired = true;
                  state.twoFactorToken = data.twoFactorToken;
                });
              }

              set((state) => {
                state.loginAttempts += 1;
                state.loginError = data.message;
                state.loginLoading = false;
              });

              return { success: false, message: data.message, code: data.code };
            }

            // Successful login
            set((state) => {
              state.user = data.user;
              state.token = data.token;
              state.refreshToken = data.refreshToken;
              state.isAuthenticated = true;
              state.permissions = data.user.permissions || [];
              state.role = data.user.role;
              state.company = data.user.company;
              state.sessionExpiry = data.expiresAt;
              state.sessionId = data.sessionId;
              state.rememberMe = credentials.rememberMe || false;
              state.loginAttempts = 0;
              state.isLocked = false;
              state.twoFactorRequired = false;
              state.twoFactorToken = null;
              state.loginLoading = false;
              state.loginError = null;
              state.lastActivity = Date.now();
              
              // Add to login history
              state.loginHistory.unshift({
                timestamp: Date.now(),
                ipAddress: data.ipAddress,
                userAgent: navigator.userAgent,
                success: true
              });
              
              // Keep only last 10 login attempts
              if (state.loginHistory.length > 10) {
                state.loginHistory = state.loginHistory.slice(0, 10);
              }
            });

            return { success: true, user: data.user };
          } catch (err) {
            set((state) => {
              state.loginError = err.message;
              state.loginLoading = false;
            });
            return { success: false, message: err.message };
          }
        },

        verifyTwoFactor: async (code) => {
          set((state) => {
            state.loginLoading = true;
            state.loginError = null;
          });

          try {
            const response = await fetch(`${API_BASE}/auth/verify-2fa`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                token: get().twoFactorToken,
                code
              })
            });

            const data = await response.json();

            if (!response.ok) {
              set((state) => {
                state.loginError = data.message;
                state.loginLoading = false;
              });
              return { success: false, message: data.message };
            }

            // Complete login after 2FA verification
            set((state) => {
              state.user = data.user;
              state.token = data.token;
              state.refreshToken = data.refreshToken;
              state.isAuthenticated = true;
              state.permissions = data.user.permissions || [];
              state.role = data.user.role;
              state.company = data.user.company;
              state.sessionExpiry = data.expiresAt;
              state.twoFactorRequired = false;
              state.twoFactorToken = null;
              state.loginLoading = false;
              state.lastActivity = Date.now();
            });

            return { success: true, user: data.user };
          } catch (err) {
            set((state) => {
              state.loginError = err.message;
              state.loginLoading = false;
            });
            return { success: false, message: err.message };
          }
        },

        register: async (userData) => {
          set((state) => {
            state.registerLoading = true;
            state.registerError = null;
          });

          try {
            const response = await fetch(`${API_BASE}/auth/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
              set((state) => {
                state.registerError = data.message;
                state.registerLoading = false;
              });
              return { success: false, message: data.message };
            }

            set((state) => {
              state.registerLoading = false;
            });

            return { success: true, message: data.message };
          } catch (err) {
            set((state) => {
              state.registerError = err.message;
              state.registerLoading = false;
            });
            return { success: false, message: err.message };
          }
        },

        logout: async (reason = 'user_logout') => {
          const { token } = get();

          try {
            if (token) {
              await fetch(`${API_BASE}/auth/logout`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ reason })
              });
            }
          } catch (err) {
            console.error('Logout API call failed:', err);
          }

          // Clear state
          set((state) => {
            const rememberMe = state.rememberMe;
            const deviceId = state.deviceId;
            const loginHistory = state.loginHistory;
            
            Object.assign(state, initialState);
            
            // Preserve some data if remember me is enabled
            if (rememberMe) {
              state.rememberMe = true;
              state.deviceId = deviceId;
              state.loginHistory = loginHistory;
            }
          });
        },

        refreshToken: async () => {
          const { refreshToken } = get();
          
          if (!refreshToken) {
            get().logout('no_refresh_token');
            return false;
          }

          try {
            const response = await fetch(`${API_BASE}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken })
            });

            const data = await response.json();

            if (!response.ok) {
              get().logout('refresh_failed');
              return false;
            }

            set((state) => {
              state.token = data.token;
              state.refreshToken = data.refreshToken;
              state.sessionExpiry = data.expiresAt;
              state.lastActivity = Date.now();
            });

            return true;
          } catch (err) {
            get().logout('refresh_error');
            return false;
          }
        },

        updateProfile: async (profileData) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await fetch(`${API_BASE}/auth/profile`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${get().token}`
              },
              body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (!response.ok) {
              set((state) => {
                state.error = data.message;
                state.loading = false;
              });
              return { success: false, message: data.message };
            }

            set((state) => {
              state.user = { ...state.user, ...data.user };
              state.loading = false;
            });

            return { success: true, user: data.user };
          } catch (err) {
            set((state) => {
              state.error = err.message;
              state.loading = false;
            });
            return { success: false, message: err.message };
          }
        },

        changePassword: async (passwordData) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await fetch(`${API_BASE}/auth/change-password`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${get().token}`
              },
              body: JSON.stringify(passwordData)
            });

            const data = await response.json();

            if (!response.ok) {
              set((state) => {
                state.error = data.message;
                state.loading = false;
              });
              return { success: false, message: data.message };
            }

            set((state) => {
              state.loading = false;
            });

            return { success: true, message: data.message };
          } catch (err) {
            set((state) => {
              state.error = err.message;
              state.loading = false;
            });
            return { success: false, message: err.message };
          }
        },

        forgotPassword: async (email) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await fetch(`${API_BASE}/auth/forgot-password`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
            });

            const data = await response.json();

            set((state) => {
              state.loading = false;
            });

            return {
              success: response.ok,
              message: data.message
            };
          } catch (err) {
            set((state) => {
              state.error = err.message;
              state.loading = false;
            });
            return { success: false, message: err.message };
          }
        },

        resetPassword: async (resetData) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await fetch(`${API_BASE}/auth/reset-password`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(resetData)
            });

            const data = await response.json();

            set((state) => {
              state.loading = false;
            });

            return {
              success: response.ok,
              message: data.message
            };
          } catch (err) {
            set((state) => {
              state.error = err.message;
              state.loading = false;
            });
            return { success: false, message: err.message };
          }
        },

        verifyToken: async () => {
          const { token } = get();
          
          if (!token) {
            set((state) => {
              state.loading = false;
            });
            return false;
          }

          try {
            const response = await fetch(`${API_BASE}/auth/verify`, {
              headers: { Authorization: `Bearer ${token}` }
            });

            const data = await response.json();

            if (!response.ok) {
              get().logout('token_invalid');
              return false;
            }

            set((state) => {
              state.user = data.user;
              state.permissions = data.user.permissions || [];
              state.role = data.user.role;
              state.company = data.user.company;
              state.loading = false;
            });

            return true;
          } catch (err) {
            get().logout('verify_error');
            return false;
          }
        },

        updatePreferences: async (newPreferences) => {
          set((state) => {
            state.preferences = { ...state.preferences, ...newPreferences };
          });

          try {
            await fetch(`${API_BASE}/auth/preferences`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${get().token}`
              },
              body: JSON.stringify(newPreferences)
            });
          } catch (err) {
            console.error('Failed to sync preferences:', err);
          }
        },

        // Permission helpers
        hasPermission: (permission) => {
          const { isAuthenticated, role, permissions } = get();
          if (!isAuthenticated) return false;
          if (role === 'system_admin') return true;
          return permissions.includes(permission);
        },

        hasRole: (targetRole) => {
          const { isAuthenticated, role } = get();
          return isAuthenticated && role === targetRole;
        },

        hasAnyRole: (roles) => {
          const { isAuthenticated, role } = get();
          return isAuthenticated && roles.includes(role);
        },

        // Session management
        checkSession: () => {
          const { sessionExpiry, isAuthenticated } = get();
          
          if (!isAuthenticated) return false;
          
          if (sessionExpiry && Date.now() > sessionExpiry) {
            get().logout('session_expired');
            return false;
          }
          
          return true;
        },

        extendSession: async () => {
          const { token } = get();
          
          if (!token) return false;

          try {
            const response = await fetch(`${API_BASE}/auth/extend-session`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` }
            });

            const data = await response.json();

            if (response.ok) {
              set((state) => {
                state.sessionExpiry = data.expiresAt;
                state.lastActivity = Date.now();
              });
              return true;
            }
          } catch (err) {
            console.error('Failed to extend session:', err);
          }

          return false;
        },

        // Activity logging
        logActivity: (activity) => {
          set((state) => {
            state.activityLog.unshift({
              ...activity,
              timestamp: Date.now(),
              userId: state.user?.id
            });
            
            // Keep only last 50 activities
            if (state.activityLog.length > 50) {
              state.activityLog = state.activityLog.slice(0, 50);
            }
          });
        },

        // Device management
        generateDeviceId: () => {
          const deviceId = generateDeviceId();
          set((state) => {
            state.deviceId = deviceId;
          });
          return deviceId;
        },

        // Initialize auth store
        initializeAuth: async () => {
          set((state) => {
            state.loading = true;
          });
          
          try {
            const token = get().token;
            if (token) {
              await get().verifyToken();
            }
          } catch (err) {
            console.error('Auth initialization failed:', err);
          } finally {
            set((state) => {
              state.loading = false;
            });
          }
        }
      })),
      {
        name: 'auth-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
          rememberMe: state.rememberMe,
          deviceId: state.deviceId,
          preferences: state.preferences,
          loginHistory: state.loginHistory
        })
      }
    )
  )
);

// Helper functions
function generateDeviceId() {
  return 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Auto-refresh token before expiry
useAuthStore.subscribe(
  (state) => state.sessionExpiry,
  (sessionExpiry) => {
    if (sessionExpiry) {
      const timeUntilExpiry = sessionExpiry - Date.now();
      const refreshTime = timeUntilExpiry - 300000; // Refresh 5 minutes before expiry

      if (refreshTime > 0) {
        setTimeout(() => {
          const { isAuthenticated } = useAuthStore.getState();
          if (isAuthenticated) {
            useAuthStore.getState().refreshToken();
          }
        }, refreshTime);
      }
    }
  }
);

// Session check interval
setInterval(() => {
  const { isAuthenticated, checkSession } = useAuthStore.getState();
  if (isAuthenticated) {
    checkSession();
  }
}, 60000); // Check every minute

export default useAuthStore;