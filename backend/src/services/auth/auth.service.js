const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, Role, Company, Invitation, Permission } = require('../../models');
const mailService = require('../../config/mail');
const redis = require('../../config/redis');

class AuthService {
  constructor() {
    this.tokenBlacklist = new Set();
  }

  /**
   * Register a new user
   */
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ 
        where: { email: userData.email } 
      });
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user
      const user = await User.create({
        ...userData,
        password: hashedPassword,
        is_active: true,
        email_verified: false
      });

      // Assign default role if not provided
      let role;
      if (userData.role_id) {
        role = await Role.findByPk(userData.role_id);
      } else {
        role = await Role.findOne({ where: { name: 'tenant' } });
      }

      if (role) {
        await user.addRole(role);
      }

      // Send welcome email
      await mailService.sendWelcomeEmail(
        user.email, 
        `${user.first_name} ${user.last_name}`,
        role?.name || 'User'
      );

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      return {
        success: true,
        user: userResponse,
        tokens,
        message: 'User registered successfully'
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      // Find user with roles
      const user = await User.findOne({
        where: { email },
        include: [
          {
            model: Role,
            through: { attributes: [] },
            attributes: ['id', 'name', 'level'],
            include: [
              {
                model: Permission,
                through: { attributes: [] },
                attributes: ['id', 'name', 'action', 'resource']
              }
            ]
          },
          {
            model: Company,
            attributes: ['id', 'name', 'is_active']
          }
        ]
      });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (!user.is_active) {
        throw new Error('Account is deactivated. Please contact support.');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      await user.update({ last_login: new Date() });

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Store refresh token in Redis
      await redis.set(
        `refresh_token:${user.id}`,
        tokens.refreshToken,
        7 * 24 * 60 * 60 // 7 days
      );

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      return {
        success: true,
        user: userResponse,
        tokens,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Logout user
   */
  async logout(userId, accessToken) {
    try {
      // Add token to blacklist
      const tokenKey = `blacklist_token:${accessToken}`;
      const tokenExp = jwt.decode(accessToken).exp;
      const ttl = Math.max(tokenExp - Math.floor(Date.now() / 1000), 0);
      
      if (ttl > 0) {
        await redis.set(tokenKey, 'blacklisted', ttl);
      }

      // Remove refresh token
      await redis.del(`refresh_token:${userId}`);

      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'stayspot-refresh-secret'
      );

      // Check if refresh token exists in Redis
      const storedToken = await redis.get(`refresh_token:${decoded.id}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      // Get user
      const user = await User.findByPk(decoded.id, {
        include: [
          {
            model: Role,
            through: { attributes: [] },
            attributes: ['id', 'name', 'level']
          }
        ]
      });

      if (!user || !user.is_active) {
        throw new Error('User not found or inactive');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Update refresh token in Redis
      await redis.set(
        `refresh_token:${user.id}`,
        tokens.refreshToken,
        7 * 24 * 60 * 60 // 7 days
      );

      return {
        success: true,
        tokens,
        message: 'Token refreshed successfully'
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  /**
   * Generate JWT tokens
   */
  async generateTokens(user) {
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles?.map(role => role.name) || []
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'stayspot-secret-key',
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || 'stayspot-refresh-secret',
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email) {
    try {
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        // Don't reveal that user doesn't exist for security
        return {
          success: true,
          message: 'If your email exists, you will receive reset instructions'
        };
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      // Set token expiration (1 hour)
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

      // Save token to user
      await user.update({
        reset_token: resetTokenHash,
        reset_token_expiry: resetTokenExpiry
      });

      // Send reset email
      await mailService.sendPasswordResetEmail(user.email, resetToken);

      return {
        success: true,
        message: 'Password reset instructions sent to email'
      };
    } catch (error) {
      console.error('Password reset request error:', error);
      throw new Error(`Password reset request failed: ${error.message}`);
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token, newPassword) {
    try {
      // Hash token for comparison
      const tokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      // Find user with valid token
      const user = await User.findOne({
        where: {
          reset_token: tokenHash,
          reset_token_expiry: { [Op.gt]: new Date() }
        }
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password and clear reset token
      await user.update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
        password_changed_at: new Date()
      });

      return {
        success: true,
        message: 'Password reset successfully'
      };
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }

  /**
   * Change password (authenticated)
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await user.update({
        password: hashedPassword,
        password_changed_at: new Date()
      });

      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      console.error('Password change error:', error);
      throw new Error(`Password change failed: ${error.message}`);
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(token) {
    try {
      // Decode token
      const decoded = jwt.verify(
        token,
        process.env.JWT_VERIFY_SECRET || 'stayspot-verify-secret'
      );

      const user = await User.findByPk(decoded.id);

      if (!user) {
        throw new Error('Invalid verification token');
      }

      if (user.email_verified) {
        throw new Error('Email already verified');
      }

      // Mark email as verified
      await user.update({ email_verified: true });

      return {
        success: true,
        message: 'Email verified successfully'
      };
    } catch (error) {
      console.error('Email verification error:', error);
      throw new Error(`Email verification failed: ${error.message}`);
    }
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(userId) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error('User not found');
      }

      if (user.email_verified) {
        throw new Error('Email already verified');
      }

      // Generate verification token
      const verificationToken = jwt.sign(
        { id: user.id },
        process.env.JWT_VERIFY_SECRET || 'stayspot-verify-secret',
        { expiresIn: '24h' }
      );

      // TODO: Send verification email
      // This would be similar to password reset email but for verification

      return {
        success: true,
        message: 'Verification email sent'
      };
    } catch (error) {
      console.error('Send verification email error:', error);
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  }

  /**
   * Check if token is blacklisted
   */
  async isTokenBlacklisted(token) {
    const tokenKey = `blacklist_token:${token}`;
    const isBlacklisted = await redis.exists(tokenKey);
    return isBlacklisted === 1;
  }

  /**
   * Get user permissions
   */
  async getUserPermissions(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Role,
            through: { attributes: [] },
            include: [
              {
                model: Permission,
                through: { attributes: [] },
                attributes: ['id', 'name', 'action', 'resource']
              }
            ]
          }
        ]
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Flatten permissions from all roles
      const permissions = user.roles.reduce((acc, role) => {
        role.permissions.forEach(permission => {
          acc[`${permission.resource}:${permission.action}`] = true;
        });
        return acc;
      }, {});

      return {
        success: true,
        permissions,
        roles: user.roles.map(role => role.name)
      };
    } catch (error) {
      console.error('Get permissions error:', error);
      throw new Error(`Failed to get user permissions: ${error.message}`);
    }
  }

  /**
   * Validate invitation token
   */
  async validateInvitation(token) {
    try {
      const invitation = await Invitation.findOne({
        where: {
          token,
          status: 'pending',
          expires_at: { [Op.gt]: new Date() }
        },
        include: [
          {
            model: User,
            as: 'inviter',
            attributes: ['id', 'first_name', 'last_name', 'email']
          },
          {
            model: Role,
            attributes: ['id', 'name', 'level']
          },
          {
            model: Company,
            attributes: ['id', 'name']
          }
        ]
      });

      if (!invitation) {
        throw new Error('Invalid or expired invitation');
      }

      return {
        success: true,
        invitation,
        message: 'Invitation is valid'
      };
    } catch (error) {
      console.error('Invitation validation error:', error);
      throw new Error(`Invitation validation failed: ${error.message}`);
    }
  }
}

module.exports = new AuthService();