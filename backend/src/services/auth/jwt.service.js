const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const redis = require('../../config/redis');

class JWTService {
  constructor() {
    this.accessSecret = process.env.JWT_SECRET || 'stayspot-secret-key';
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'stayspot-refresh-secret';
    this.verifySecret = process.env.JWT_VERIFY_SECRET || 'stayspot-verify-secret';
    this.resetSecret = process.env.JWT_RESET_SECRET || 'stayspot-reset-secret';
  }

  /**
   * Generate access token
   */
  generateAccessToken(payload, expiresIn = '15m') {
    return jwt.sign(payload, this.accessSecret, { expiresIn });
  }

  /**
   * Generate refresh token
   */
  generateRefreshToken(payload, expiresIn = '7d') {
    return jwt.sign(payload, this.refreshSecret, { expiresIn });
  }

  /**
   * Generate email verification token
   */
  generateVerificationToken(payload, expiresIn = '24h') {
    return jwt.sign(payload, this.verifySecret, { expiresIn });
  }

  /**
   * Generate password reset token
   */
  generateResetToken(payload, expiresIn = '1h') {
    return jwt.sign(payload, this.resetSecret, { expiresIn });
  }

  /**
   * Generate invitation token
   */
  generateInvitationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessSecret);
    } catch (error) {
      throw new Error(`Invalid access token: ${error.message}`);
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshSecret);
    } catch (error) {
      throw new Error(`Invalid refresh token: ${error.message}`);
    }
  }

  /**
   * Verify email verification token
   */
  verifyVerificationToken(token) {
    try {
      return jwt.verify(token, this.verifySecret);
    } catch (error) {
      throw new Error(`Invalid verification token: ${error.message}`);
    }
  }

  /**
   * Verify password reset token
   */
  verifyResetToken(token) {
    try {
      return jwt.verify(token, this.resetSecret);
    } catch (error) {
      throw new Error(`Invalid reset token: ${error.message}`);
    }
  }

  /**
   * Decode token without verification
   */
  decodeToken(token) {
    return jwt.decode(token);
  }

  /**
   * Get token expiration
   */
  getTokenExpiration(token) {
    const decoded = this.decodeToken(token);
    return decoded ? decoded.exp : null;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token) {
    const exp = this.getTokenExpiration(token);
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  }

  /**
   * Store refresh token in Redis
   */
  async storeRefreshToken(userId, token, expiresIn = 604800) { // 7 days in seconds
    const key = `refresh_token:${userId}`;
    await redis.set(key, token, expiresIn);
  }

  /**
   * Get refresh token from Redis
   */
  async getRefreshToken(userId) {
    const key = `refresh_token:${userId}`;
    return await redis.get(key);
  }

  /**
   * Remove refresh token from Redis
   */
  async removeRefreshToken(userId) {
    const key = `refresh_token:${userId}`;
    await redis.del(key);
  }

  /**
   * Blacklist token (for logout)
   */
  async blacklistToken(token, expiresIn) {
    const key = `blacklist_token:${token}`;
    await redis.set(key, 'blacklisted', expiresIn);
  }

  /**
   * Check if token is blacklisted
   */
  async isTokenBlacklisted(token) {
    const key = `blacklist_token:${token}`;
    const result = await redis.exists(key);
    return result === 1;
  }

  /**
   * Generate token pair (access + refresh)
   */
  generateTokenPair(user) {
    const accessPayload = {
      id: user.id,
      email: user.email,
      roles: user.roles?.map(role => role.name) || []
    };

    const refreshPayload = {
      id: user.id,
      email: user.email
    };

    const accessToken = this.generateAccessToken(accessPayload);
    const refreshToken = this.generateRefreshToken(refreshPayload);

    return { accessToken, refreshToken };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = this.verifyRefreshToken(refreshToken);

      // Check if refresh token exists in Redis
      const storedToken = await this.getRefreshToken(decoded.id);
      if (!storedToken || storedToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      // Generate new token pair
      const user = { id: decoded.id, email: decoded.email };
      const tokens = this.generateTokenPair(user);

      // Update refresh token in Redis
      await this.storeRefreshToken(decoded.id, tokens.refreshToken);

      return {
        success: true,
        tokens,
        message: 'Token refreshed successfully'
      };
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  /**
   * Generate API key for service-to-service communication
   */
  generateApiKey(serviceName, permissions = []) {
    const payload = {
      service: serviceName,
      permissions,
      type: 'api_key',
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, this.accessSecret, { expiresIn: '365d' });
  }

  /**
   * Verify API key
   */
  verifyApiKey(token) {
    try {
      const decoded = jwt.verify(token, this.accessSecret);
      
      if (decoded.type !== 'api_key') {
        throw new Error('Invalid token type');
      }

      return {
        valid: true,
        service: decoded.service,
        permissions: decoded.permissions || []
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Generate short-lived token for one-time operations
   */
  generateOneTimeToken(payload, expiresIn = '5m') {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    // Store hash in Redis with expiration
    const key = `one_time_token:${tokenHash}`;
    redis.set(key, JSON.stringify(payload), parseInt(expiresIn) || 300);

    return token;
  }

  /**
   * Verify and consume one-time token
   */
  async verifyOneTimeToken(token) {
    try {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const key = `one_time_token:${tokenHash}`;
      
      const data = await redis.get(key);
      if (!data) {
        throw new Error('Invalid or expired token');
      }

      // Delete token after verification (one-time use)
      await redis.del(key);

      return {
        valid: true,
        payload: JSON.parse(data)
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Generate token for file upload
   */
  generateUploadToken(userId, allowedTypes = [], maxSize = 10485760) { // 10MB default
    const payload = {
      userId,
      allowedTypes,
      maxSize,
      type: 'upload',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
    };

    return jwt.sign(payload, this.accessSecret);
  }

  /**
   * Verify upload token
   */
  verifyUploadToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessSecret);
      
      if (decoded.type !== 'upload') {
        throw new Error('Invalid token type');
      }

      return {
        valid: true,
        userId: decoded.userId,
        allowedTypes: decoded.allowedTypes || [],
        maxSize: decoded.maxSize || 10485760
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Get token information without verification
   */
  inspectToken(token) {
    try {
      const decoded = jwt.decode(token, { complete: true });
      
      if (!decoded) {
        throw new Error('Invalid token format');
      }

      const now = Math.floor(Date.now() / 1000);
      const isExpired = decoded.payload.exp ? decoded.payload.exp < now : false;
      const expiresIn = decoded.payload.exp ? decoded.payload.exp - now : null;

      return {
        header: decoded.header,
        payload: decoded.payload,
        isExpired,
        expiresIn,
        issuedAt: decoded.payload.iat ? new Date(decoded.payload.iat * 1000) : null,
        expiresAt: decoded.payload.exp ? new Date(decoded.payload.exp * 1000) : null
      };
    } catch (error) {
      throw new Error(`Token inspection failed: ${error.message}`);
    }
  }
}

module.exports = new JWTService();