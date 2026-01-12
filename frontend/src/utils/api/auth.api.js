import api, { tokenManager } from './axios';

/**
 * Authentication API endpoints
 * Handles user authentication, registration, and session management
 */
class AuthAPI {
  constructor() {
    this.endpoints = {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
      verifyEmail: '/auth/verify-email',
      resendVerification: '/auth/resend-verification',
      changePassword: '/auth/change-password',
      profile: '/auth/profile',
      updateProfile: '/auth/profile',
      twoFactor: '/auth/2fa',
      sessions: '/auth/sessions',
      permissions: '/auth/permissions',
      roles: '/auth/roles'
    };
  }

  /**
   * User login
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @param {boolean} credentials.rememberMe - Remember user session
   * @returns {Promise<Object>} User data and tokens
   */
  async login(credentials) {
    try {
      console.log('🔄 Login attempt for:', credentials.email);
      const response = await api.post(this.endpoints.login, {
        email: credentials.email?.toLowerCase().trim(),
        password: credentials.password,
        rememberMe: credentials.rememberMe || false
      });

      console.log('✅ Login response:', response.data);
      
      const { user, accessToken, refreshToken, permissions, roles } = response.data.data;

      // Store tokens
      tokenManager.setTokens(accessToken, refreshToken);

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('permissions', JSON.stringify(permissions || []));
      localStorage.setItem('roles', JSON.stringify(roles || []));

      console.log('✅ Login successful, tokens stored');
      
      return {
        user,
        accessToken,
        refreshToken,
        permissions,
        roles
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Error details:', {
        message: error.message,
        type: error.type,
        status: error.status,
        response: error.response
      });
      throw error;
    }
  }

  /**
   * User registration
   * @param {Object} userData - Registration data
   * @returns {Promise<Object>} Registration result
   */
  async register(userData) {
    try {
      const response = await api.post(this.endpoints.register, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email?.toLowerCase().trim(),
        phone: userData.phone,
        password: userData.password,
        acceptTerms: userData.acceptTerms,
        role: userData.role
      });

      return response.data.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * User logout
   * @param {boolean} allDevices - Logout from all devices
   * @returns {Promise<void>}
   */
  async logout(allDevices = false) {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      
      if (refreshToken) {
        await api.post(this.endpoints.logout, {
          refreshToken,
          allDevices
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call result
      this.clearAuthData();
    }
  }

  /**
   * Refresh access token
   * @returns {Promise<Object>} New tokens
   */
  async refreshToken() {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post(this.endpoints.refresh, {
        refreshToken
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;

      // Update tokens
      tokenManager.setTokens(accessToken, newRefreshToken);

      return {
        accessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuthData();
      throw error;
    }
  }

  /**
   * Forgot password
   * @param {string} email - User email
   * @returns {Promise<Object>} Reset instructions
   */
  async forgotPassword(email) {
    try {
      const response = await api.post(this.endpoints.forgotPassword, {
        email: email.toLowerCase().trim()
      });

      return response.data.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  /**
   * Reset password
   * @param {Object} resetData - Reset password data
   * @returns {Promise<Object>} Reset result
   */
  async resetPassword(resetData) {
    try {
      const response = await api.post(this.endpoints.resetPassword, resetData);
      return response.data.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  /**
   * Verify email
   * @param {string} token - Verification token
   * @returns {Promise<Object>} Verification result
   */
  async verifyEmail(token) {
    try {
      const response = await api.post(this.endpoints.verifyEmail, { token });
      return response.data.data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  /**
   * Resend verification email
   * @param {string} email - User email
   * @returns {Promise<Object>} Resend result
   */
  async resendVerification(email) {
    try {
      const response = await api.post(this.endpoints.resendVerification, {
        email: email.toLowerCase().trim()
      });
      return response.data.data;
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  }

  /**
   * Change password
   * @param {Object} passwordData - Password change data
   * @returns {Promise<Object>} Change result
   */
  async changePassword(passwordData) {
    try {
      const response = await api.put(this.endpoints.changePassword, passwordData);
      return response.data.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   * @returns {Promise<Object>} User profile
   */
  async getProfile() {
    try {
      const response = await api.get(this.endpoints.profile);
      const user = response.data.data;

      // Update stored user data
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @returns {Promise<Object>} Updated profile
   */
  async updateProfile(profileData) {
    try {
      const response = await api.put(this.endpoints.updateProfile, profileData);
      const user = response.data.data;

      // Update stored user data
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Setup two-factor authentication
   * @param {Object} twoFactorData - 2FA setup data
   * @returns {Promise<Object>} 2FA setup result
   */
  async setupTwoFactor(twoFactorData) {
    try {
      const response = await api.post(this.endpoints.twoFactor, twoFactorData);
      return response.data.data;
    } catch (error) {
      console.error('2FA setup error:', error);
      throw error;
    }
  }

  /**
   * Verify two-factor authentication
   * @param {string} code - 2FA code
   * @returns {Promise<Object>} Verification result
   */
  async verifyTwoFactor(code) {
    try {
      const response = await api.post(`${this.endpoints.twoFactor}/verify`, { code });
      return response.data.data;
    } catch (error) {
      console.error('2FA verification error:', error);
      throw error;
    }
  }

  /**
   * Disable two-factor authentication
   * @param {string} password - User password
   * @returns {Promise<Object>} Disable result
   */
  async disableTwoFactor(password) {
    try {
      const response = await api.delete(this.endpoints.twoFactor, {
        data: { password }
      });
      return response.data.data;
    } catch (error) {
      console.error('2FA disable error:', error);
      throw error;
    }
  }

  /**
   * Get active sessions
   * @returns {Promise<Array>} Active sessions
   */
  async getSessions() {
    try {
      const response = await api.get(this.endpoints.sessions);
      return response.data.data;
    } catch (error) {
      console.error('Get sessions error:', error);
      throw error;
    }
  }

  /**
   * Revoke session
   * @param {string} sessionId - Session ID to revoke
   * @returns {Promise<Object>} Revoke result
   */
  async revokeSession(sessionId) {
    try {
      const response = await api.delete(`${this.endpoints.sessions}/${sessionId}`);
      return response.data.data;
    } catch (error) {
      console.error('Revoke session error:', error);
      throw error;
    }
  }

  /**
   * Get user permissions
   * @returns {Promise<Array>} User permissions
   */
  async getPermissions() {
    try {
      const response = await api.get(this.endpoints.permissions);
      const permissions = response.data.data;

      // Update stored permissions
      localStorage.setItem('permissions', JSON.stringify(permissions));

      return permissions;
    } catch (error) {
      console.error('Get permissions error:', error);
      throw error;
    }
  }

  /**
   * Get user roles
   * @returns {Promise<Array>} User roles
   */
  async getRoles() {
    try {
      const response = await api.get(this.endpoints.roles);
      const roles = response.data.data;

      // Update stored roles
      localStorage.setItem('roles', JSON.stringify(roles));

      return roles;
    } catch (error) {
      console.error('Get roles error:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const token = tokenManager.getAccessToken();
    return token && !tokenManager.isTokenExpired(token);
  }

  /**
   * Get current user from localStorage
   * @returns {Object|null} Current user
   */
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get stored permissions
   * @returns {Array} User permissions
   */
  getStoredPermissions() {
    try {
      const permissions = localStorage.getItem('permissions');
      return permissions ? JSON.parse(permissions) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get stored roles
   * @returns {Array} User roles
   */
  getStoredRoles() {
    try {
      const roles = localStorage.getItem('roles');
      return roles ? JSON.parse(roles) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear authentication data
   */
  clearAuthData() {
    tokenManager.clearTokens();
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    localStorage.removeItem('roles');
  }

  /**
   * Get device information for security tracking
   * @returns {Object} Device info
   */
  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: {
        width: screen.width,
        height: screen.height
      }
    };
  }
}

// Create and export singleton instance
const authAPI = new AuthAPI();
export default authAPI;