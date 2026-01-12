const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { sequelize } = require('../../database');
const { User, Role, Company, Invitation, AuditLog } = require('../../models');
const { sendEmail } = require('../../services/communication/email.service');
const { generateToken, verifyToken } = require('../../services/auth/jwt.service');
const { validateLogin, validateUser, validatePasswordReset } = require('../../utils/validators/user.validator');
const { ROLES, PERMISSIONS } = require('../../utils/constants/roles');

/**
 * Authentication Controller
 * Handles user authentication, registration, and password management
 */
class AuthController {
  /**
   * User Login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password required' });
      }

      // Find user using raw SQL
      const users = await sequelize.query(
        'SELECT id, email, password_hash, first_name, last_name, phone FROM users WHERE email = ? LIMIT 1',
        { replacements: [email.toLowerCase().trim()], type: sequelize.QueryTypes.SELECT }
      );

      if (!users || users.length === 0) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      const user = users[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      // Update last login
      await sequelize.query(
        'UPDATE users SET updated_at = NOW() WHERE email = ?',
        { replacements: [email.toLowerCase().trim()] }
      );

      // Get user role
      let role = 'tenant';
      try {
        const userRoles = await sequelize.query(
          'SELECT r.name FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = ? AND ur.is_active = true LIMIT 1',
          { replacements: [user.id], type: sequelize.QueryTypes.SELECT }
        );
        
        if (userRoles && userRoles.length > 0) {
          role = userRoles[0].name;
        }
      } catch (roleError) {
        console.warn('Error fetching user role:', roleError.message);
      }

      // Generate token
      const accessToken = jwt.sign(
        { id: user.id, email: user.email, role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Prepare user data
      const userData = {
        id: user.id,
        email: user.email,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone || '',
        role
      };

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userData,
          tokens: {
            accessToken,
            expiresIn: '24h'
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }/**
 * User Registration - Simple Version
 */
async register(req, res) {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;
    console.log('Register called with email:', email);

    // Quick validation
    if (!email || !password || !firstName || !lastName) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: firstName, lastName, email, password' 
      });
    }

    // Check if user exists using raw query to avoid model field issues
    console.log('About to check if user exists with raw SQL');
    try {
      const existingUser = await sequelize.query(
        'SELECT id FROM users WHERE email = ?',
        { replacements: [email.toLowerCase().trim()], type: sequelize.QueryTypes.SELECT }
      );
      
      if (existingUser && existingUser.length > 0) {
        return res.status(409).json({ success: false, error: 'Email already registered' });
      }
    } catch (e) {
      console.warn('Error checking existing user:', e.message);
      // Continue anyway - user might not exist
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user using raw query to avoid model field issues
    let userId;
    try {
      console.log('About to INSERT user');
      const result = await sequelize.query(
        `INSERT INTO users (email, password, password_hash, first_name, last_name, phone, is_active, email_verified, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, true, false, NOW(), NOW())`,
        { replacements: [email.toLowerCase().trim(), hashedPassword, hashedPassword, firstName.trim(), lastName.trim(), phone || ''] }
      );
      console.log('INSERT successful');
      
      // Get the user ID we just created
      console.log('Fetching newly created user');
      const newUser = await sequelize.query(
        'SELECT id, email, first_name, last_name, phone FROM users WHERE email = ? LIMIT 1',
        { replacements: [email.toLowerCase().trim()], type: sequelize.QueryTypes.SELECT }
      );
      console.log('User fetch successful, newUser:', newUser);
      
      if (newUser && newUser.length > 0) {
        userId = newUser[0].id;
        console.log('User ID extracted:', userId);
      }
    } catch (e) {
      console.error('Error creating user - full error:', e);
      console.error('Error creating user:', e.message);
      return res.status(500).json({ success: false, error: 'Failed to create user account' });
    }

    // Generate token
    const accessToken = jwt.sign(
      { id: userId, email: email.toLowerCase().trim(), role: role || 'tenant' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const userData = {
      id: userId,
      email: email.toLowerCase().trim(),
      firstName: firstName,
      lastName: lastName,
      phone: phone || '',
      role: role || 'tenant'
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        userId: userId,
        user: userData,
        tokens: {
          accessToken,
          expiresIn: '24h'
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
}

  /**
   * Refresh Access Token
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' });
      }

      // Verify refresh token
      const decoded = verifyToken(refreshToken, 'refresh');
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      // Find user with refresh token
      const user = await User.findOne({
        where: { 
          id: decoded.id,
          refreshToken,
          isActive: true
        },
        include: [{ model: Role }]
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      // Generate new access token
      const accessToken = generateToken(
        { 
          id: user.id, 
          email: user.email,
          roles: user.Roles.map(role => role.name)
        },
        'access'
      );

      res.json({
        success: true,
        data: {
          accessToken,
          expiresIn: process.env.JWT_ACCESS_EXPIRY || '1h'
        }
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Logout
   */
  async logout(req, res) {
    try {
      const userId = req.user.id;

      // Clear refresh token
      await User.update(
        { refreshToken: null },
        { where: { id: userId } }
      );

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'LOGOUT',
        details: 'User logged out',
        ipAddress: req.ip
      });

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Forgot Password
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const user = await User.findOne({ where: { email, isActive: true } });
      if (!user) {
        // Don't reveal that user doesn't exist
        return res.json({
          success: true,
          message: 'If an account exists with this email, you will receive a password reset link.'
        });
      }

      // Generate reset token
      const resetToken = generateToken(
        { id: user.id, email: user.email },
        'passwordReset'
      );

      // Save reset token and expiry
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();

      // Send reset email (non-blocking)
      sendEmail({
        to: email,
        subject: 'StaySpot - Password Reset Request',
        template: 'password-reset',
        data: {
          name: `${user.firstName} ${user.lastName}`,
          resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
        }
      }).catch(err => console.warn('Email service error:', err.message));

      // Create audit log
      await AuditLog.create({
        userId: user.id,
        action: 'PASSWORD_RESET_REQUEST',
        details: 'Password reset requested',
        ipAddress: req.ip
      });

      res.json({
        success: true,
        message: 'Password reset link sent to your email.'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Reset Password
   */
  async resetPassword(req, res) {
    try {
      const { error } = validatePasswordReset(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const { token, newPassword } = req.body;

      // Verify token
      const decoded = verifyToken(token, 'passwordReset');
      if (!decoded) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      const user = await User.findOne({
        where: {
          id: decoded.id,
          passwordResetToken: token,
          passwordResetExpires: { [Op.gt]: new Date() },
          isActive: true
        }
      });

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password and clear reset token
      user.password = hashedPassword;
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save();

      // Send confirmation email (non-blocking)
      sendEmail({
        to: user.email,
        subject: 'StaySpot - Password Reset Successful',
        template: 'password-reset-confirmation',
        data: {
          name: `${user.firstName} ${user.lastName}`
        }
      }).catch(err => console.warn('Email service error:', err.message));

      // Create audit log
      await AuditLog.create({
        userId: user.id,
        action: 'PASSWORD_RESET_COMPLETE',
        details: 'Password reset completed successfully',
        ipAddress: req.ip
      });

      res.json({
        success: true,
        message: 'Password has been reset successfully.'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Verify Email
   */
  async verifyEmail(req, res) {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({ error: 'Verification token required' });
      }

      const decoded = verifyToken(token, 'verification');
      if (!decoded) {
        return res.status(400).json({ error: 'Invalid or expired verification token' });
      }

      const user = await User.findOne({
        where: { 
          id: decoded.id,
          email: decoded.email,
          emailVerified: false
        }
      });

      if (!user) {
        return res.status(400).json({ error: 'Invalid verification token or email already verified' });
      }

      // Verify email
      user.emailVerified = true;
      user.emailVerifiedAt = new Date();
      await user.save();

      // Create audit log
      await AuditLog.create({
        userId: user.id,
        action: 'EMAIL_VERIFIED',
        details: 'Email verified successfully'
      });

      res.json({
        success: true,
        message: 'Email verified successfully. You can now log in.'
      });
    } catch (error) {
      console.error('Verify email error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Current User Profile
   */
  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password', 'refreshToken'] },
        include: [
          {
            model: Role,
            through: { attributes: [] }
          },
          { 
            model: Company
          }
        ]
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Format response
      const userData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        roles: user.Roles.map(role => ({
          id: role.id,
          name: role.name
        })),
        company: user.Company ? {
          id: user.Company.id,
          name: user.Company.name,
          logo: user.Company.logo
        } : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.json({
        success: true,
        data: userData
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update Profile
   */
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { firstName, lastName, phone, avatar } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update fields
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (phone) user.phone = phone;
      if (avatar) user.avatar = avatar;

      await user.save();

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'PROFILE_UPDATE',
        details: 'User profile updated',
        ipAddress: req.ip
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          avatar: user.avatar
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Change Password
   */
  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      // Send notification email (non-blocking)
      sendEmail({
        to: user.email,
        subject: 'StaySpot - Password Changed',
        template: 'password-changed',
        data: {
          name: `${user.firstName} ${user.lastName}`
        }
      }).catch(err => console.warn('Email service error:', err.message));

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'PASSWORD_CHANGED',
        details: 'Password changed successfully',
        ipAddress: req.ip
      });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new AuthController();