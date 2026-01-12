const nodemailer = require('nodemailer');
const { logger } = require('./logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail({ to, subject, html, text, attachments = [] }) {
    try {
      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to,
        subject,
        html,
        text,
        attachments
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${to}`);
      return result;
    } catch (error) {
      logger.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(user) {
    const html = `
      <h1>Welcome to StaySpot!</h1>
      <p>Hello ${user.first_name},</p>
      <p>Your account has been created successfully.</p>
    `;
    
    return this.sendEmail({
      to: user.email,
      subject: 'Welcome to StaySpot',
      html
    });
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    const html = `
      <h1>Password Reset</h1>
      <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
      <p>This link expires in 1 hour.</p>
    `;
    
    return this.sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html
    });
  }

  async sendInvitationEmail(invitation) {
    const inviteUrl = `${process.env.FRONTEND_URL}/auth/accept-invitation?token=${invitation.token}`;
    const html = `
      <h1>You're Invited to StaySpot</h1>
      <p>You've been invited to join ${invitation.company?.name}.</p>
      <p><a href="${inviteUrl}">Accept Invitation</a></p>
    `;
    
    return this.sendEmail({
      to: invitation.email,
      subject: 'Invitation to StaySpot',
      html
    });
  }
}

module.exports = new EmailService();