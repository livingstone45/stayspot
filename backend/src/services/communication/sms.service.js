const twilio = require('twilio');
const { logger } = require('../../utils/logger');

class SMSService {
  constructor() {
    this.client = null;
    this.isEnabled = false;
    this.init();
  }

  init() {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      this.isEnabled = true;
      logger.info('SMS service initialized with Twilio');
    } else {
      logger.warn('SMS service not configured - Twilio credentials missing');
    }
  }

  async sendSMS(to, message) {
    if (!this.isEnabled) {
      logger.warn('SMS service not enabled');
      return { success: false, error: 'SMS service not configured' };
    }

    try {
      const result = await this.client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
      });

      logger.info(`SMS sent to ${to}: ${result.sid}`);
      return { success: true, sid: result.sid };
    } catch (error) {
      logger.error('SMS sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendMaintenanceUpdate(phoneNumber, data) {
    const { tenantName, requestTitle, status } = data;
    const message = `Hi ${tenantName}, your maintenance request "${requestTitle}" has been updated to: ${status}`;
    
    return await this.sendSMS(phoneNumber, message);
  }

  async sendPaymentReminder(phoneNumber, data) {
    const { tenantName, amount, dueDate } = data;
    const message = `Hi ${tenantName}, reminder: Your rent payment of $${amount} is due on ${dueDate}`;
    
    return await this.sendSMS(phoneNumber, message);
  }

  async sendEmergencyAlert(phoneNumber, data) {
    const { propertyName, message: alertMessage } = data;
    const message = `EMERGENCY ALERT - ${propertyName}: ${alertMessage}`;
    
    return await this.sendSMS(phoneNumber, message);
  }

  async sendLeaseReminder(phoneNumber, data) {
    const { tenantName, expiryDate } = data;
    const message = `Hi ${tenantName}, your lease expires on ${expiryDate}. Please contact us for renewal options.`;
    
    return await this.sendSMS(phoneNumber, message);
  }

  async sendBulkSMS(messages) {
    if (!this.isEnabled) {
      return { success: false, error: 'SMS service not configured' };
    }

    const results = [];
    
    for (const { to, message } of messages) {
      const result = await this.sendSMS(to, message);
      results.push({ to, ...result });
    }

    return results;
  }

  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    }
    
    return phoneNumber; // Return as-is if already formatted
  }

  validatePhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }
}

module.exports = new SMSService();