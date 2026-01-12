const nodemailer = require('nodemailer');
require('dotenv').config();

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('❌ SMTP connection error:', error);
      } else {
        console.log('✅ SMTP server is ready to send messages');
      }
    });
  }

  /**
   * Send email
   * @param {Object} options - Email options
   * @returns {Promise<Object>} Send result
   */
  async sendMail(options) {
    try {
      const mailOptions = {
        from: `"StaySpot" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        ...options
      };

      const info = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: info.messageId,
        response: info.response
      };
    } catch (error) {
      console.error('Email send error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Send welcome email to new user
   * @param {string} email - User email
   * @param {string} name - User name
   * @param {string} role - User role
   * @returns {Promise<Object>} Send result
   */
  async sendWelcomeEmail(email, name, role) {
    const subject = 'Welcome to StaySpot!';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to StaySpot!</h1>
            <p>Your Professional Rental Management Platform</p>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Your account has been successfully created with the <strong>${role}</strong> role.</p>
            <p>You can now access your dashboard and start managing properties efficiently.</p>
            <a href="${process.env.FRONTEND_URL}/login" class="button">Login to Dashboard</a>
            <p>If you have any questions, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} StaySpot. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendMail({ to: email, subject, html });
  }

  /**
   * Send invitation email
   * @param {string} email - Invitee email
   * @param {string} inviterName - Inviter's name
   * @param {string} role - Assigned role
   * @param {string} token - Invitation token
   * @returns {Promise<Object>} Send result
   */
  async sendInvitationEmail(email, inviterName, role, token) {
    const subject = `You're invited to join StaySpot as ${role}`;
    const invitationLink = `${process.env.FRONTEND_URL}/invitation/accept?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); padding: 40px; text-align: center; color: white; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .role-badge { display: inline-block; padding: 5px 15px; background: #E8F5E9; color: #2E7D32; border-radius: 20px; font-weight: bold; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Team Invitation</h1>
            <p>Join StaySpot's Professional Network</p>
          </div>
          <div class="content">
            <h2>Hello,</h2>
            <p><strong>${inviterName}</strong> has invited you to join StaySpot as a <span class="role-badge">${role}</span>.</p>
            <p>StaySpot is a comprehensive property management platform that helps professionals manage rental properties efficiently.</p>
            <a href="${invitationLink}" class="button">Accept Invitation</a>
            <p><small>This invitation link will expire in 7 days.</small></p>
            <p>If you did not expect this invitation, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} StaySpot. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendMail({ to: email, subject, html });
  }

  /**
   * Send password reset email
   * @param {string} email - User email
   * @param {string} token - Reset token
   * @returns {Promise<Object>} Send result
   */
  async sendPasswordResetEmail(email, token) {
    const subject = 'Reset Your StaySpot Password';
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); padding: 40px; text-align: center; color: white; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 30px; background: #FF9800; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset</h1>
            <p>StaySpot Account Security</p>
          </div>
          <div class="content">
            <h2>Hello,</h2>
            <p>We received a request to reset your StaySpot account password.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p><small>This link will expire in 1 hour for security reasons.</small></p>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} StaySpot. All rights reserved.</p>
            <p>This is an automated security message.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendMail({ to: email, subject, html });
  }

  /**
   * Send notification email for property updates
   * @param {string} email - Recipient email
   * @param {string} propertyName - Property name
   * @param {string} action - Action performed
   * @param {Object} details - Additional details
   * @returns {Promise<Object>} Send result
   */
  async sendPropertyUpdateEmail(email, propertyName, action, details = {}) {
    const subject = `Property Update: ${propertyName}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); padding: 40px; text-align: center; color: white; }
          .content { padding: 30px; background: #f9f9f9; }
          .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2196F3; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Property Update Notification</h1>
            <p>StaySpot Management System</p>
          </div>
          <div class="content">
            <h2>Hello,</h2>
            <p>The property <strong>${propertyName}</strong> has been ${action}.</p>
            <div class="details">
              <h3>Update Details:</h3>
              ${Object.entries(details).map(([key, value]) => 
                `<p><strong>${key}:</strong> ${value}</p>`
              ).join('')}
            </div>
            <p>You can view the updated property details in your StaySpot dashboard.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} StaySpot. All rights reserved.</p>
            <p>This is an automated notification from StaySpot.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendMail({ to: email, subject, html });
  }
}

module.exports = new MailService();