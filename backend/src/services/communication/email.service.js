const nodemailer = require('nodemailer');
const { logger } = require('../../utils/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.templates = {
      welcome: this.welcomeTemplate,
      passwordReset: this.passwordResetTemplate,
      invitation: this.invitationTemplate,
      maintenanceUpdate: this.maintenanceUpdateTemplate,
      paymentReminder: this.paymentReminderTemplate,
      leaseExpiry: this.leaseExpiryTemplate
    };
  }

  getTransporter() {
    if (!this.transporter) {
      this.transporter = this.createTransporter();
    }
    return this.transporter;
  }

  createTransporter() {
    return nodemailer.createTransport({
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

      const result = await this.getTransporter().sendMail(mailOptions);
      logger.info(`Email sent to ${to}: ${subject}`);
      return result;
    } catch (error) {
      logger.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendTemplateEmail(template, to, data) {
    if (!this.templates[template]) {
      throw new Error(`Template ${template} not found`);
    }

    const { subject, html, text } = this.templates[template](data);
    return this.sendEmail({ to, subject, html, text });
  }

  welcomeTemplate(data) {
    const { firstName, companyName } = data;
    return {
      subject: `Welcome to ${companyName || 'StaySpot'}!`,
      html: `
        <h1>Welcome ${firstName}!</h1>
        <p>Your account has been created successfully.</p>
        <p>You can now access your dashboard and start managing your properties.</p>
      `,
      text: `Welcome ${firstName}! Your account has been created successfully.`
    };
  }

  passwordResetTemplate(data) {
    const { firstName, resetUrl } = data;
    return {
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>Hi ${firstName},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `,
      text: `Password reset requested. Visit: ${resetUrl}`
    };
  }

  invitationTemplate(data) {
    const { firstName, companyName, inviteUrl, roleName } = data;
    return {
      subject: `Invitation to join ${companyName}`,
      html: `
        <h1>You're Invited!</h1>
        <p>You've been invited to join ${companyName} as a ${roleName}.</p>
        <a href="${inviteUrl}">Accept Invitation</a>
        <p>This invitation expires in 7 days.</p>
      `,
      text: `You're invited to join ${companyName}. Visit: ${inviteUrl}`
    };
  }

  maintenanceUpdateTemplate(data) {
    const { tenantName, propertyName, requestTitle, status } = data;
    return {
      subject: `Maintenance Update: ${requestTitle}`,
      html: `
        <h1>Maintenance Update</h1>
        <p>Hi ${tenantName},</p>
        <p>Your maintenance request for ${propertyName} has been updated.</p>
        <p><strong>Request:</strong> ${requestTitle}</p>
        <p><strong>Status:</strong> ${status}</p>
      `,
      text: `Maintenance update: ${requestTitle} - Status: ${status}`
    };
  }

  paymentReminderTemplate(data) {
    const { tenantName, amount, dueDate, propertyName } = data;
    return {
      subject: 'Payment Reminder',
      html: `
        <h1>Payment Reminder</h1>
        <p>Hi ${tenantName},</p>
        <p>This is a reminder that your rent payment is due.</p>
        <p><strong>Property:</strong> ${propertyName}</p>
        <p><strong>Amount:</strong> $${amount}</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
      `,
      text: `Payment reminder: $${amount} due on ${dueDate} for ${propertyName}`
    };
  }

  leaseExpiryTemplate(data) {
    const { tenantName, propertyName, expiryDate } = data;
    return {
      subject: 'Lease Expiry Notice',
      html: `
        <h1>Lease Expiry Notice</h1>
        <p>Hi ${tenantName},</p>
        <p>Your lease for ${propertyName} is expiring on ${expiryDate}.</p>
        <p>Please contact us to discuss renewal options.</p>
      `,
      text: `Lease expiry notice: ${propertyName} expires on ${expiryDate}`
    };
  }

  async sendBulkEmails(emails) {
    const results = [];
    
    for (const email of emails) {
      try {
        const result = await this.sendEmail(email);
        results.push({ success: true, email: email.to, result });
      } catch (error) {
        results.push({ success: false, email: email.to, error: error.message });
      }
    }

    return results;
  }
}

module.exports = new EmailService();