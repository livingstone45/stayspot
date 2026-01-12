const express = require('express');
const { body, param } = require('express-validator');
const settingsController = require('../controllers/settings.controller');
const { auth } = require('../middleware/auth');
const { validation } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Company Settings
router.get('/company', auth, asyncHandler(settingsController.getSettings));
router.put('/company', auth, [
  body('company_name').optional().trim().isLength({ min: 1, max: 100 }),
  body('company_email').optional().isEmail(),
  body('company_phone').optional().trim(),
  body('timezone').optional().trim(),
  body('language').optional().trim(),
  body('currency').optional().trim()
], validation, asyncHandler(settingsController.updateSettings));

// Dashboard Widgets
router.get('/dashboard/widgets', auth, asyncHandler(settingsController.getDashboardWidgets));
router.put('/dashboard/widgets', auth, [
  body('widgets').isArray()
], validation, asyncHandler(settingsController.updateDashboardWidgets));

// Notification Settings
router.get('/notifications', auth, asyncHandler(settingsController.getNotificationSettings));
router.put('/notifications', auth, [
  body('email_alerts').optional().isBoolean(),
  body('sms_alerts').optional().isBoolean(),
  body('push_notifications').optional().isBoolean(),
  body('digest_frequency').optional().trim()
], validation, asyncHandler(settingsController.updateNotificationSettings));

// Integrations
router.get('/integrations', auth, asyncHandler(settingsController.getIntegrations));
router.put('/integrations/:integrationId', auth, [
  param('integrationId').isUUID(),
  body('enabled').isBoolean(),
  body('config').optional().isObject()
], validation, asyncHandler(settingsController.updateIntegration));

// Security Settings
router.get('/security', auth, asyncHandler(settingsController.getSecuritySettings));
router.put('/security', auth, [
  body('two_factor_auth').optional().isBoolean(),
  body('session_timeout').optional().isInt({ min: 5, max: 1440 }),
  body('ip_whitelist').optional().isArray(),
  body('password_policy').optional().isObject()
], validation, asyncHandler(settingsController.updateSecuritySettings));

// API Keys
router.get('/api-keys', auth, asyncHandler(settingsController.getAPIKeys));
router.post('/api-keys', auth, [
  body('name').trim().isLength({ min: 1, max: 100 })
], validation, asyncHandler(settingsController.createAPIKey));
router.delete('/api-keys/:keyId', auth, [
  param('keyId').isUUID()
], validation, asyncHandler(settingsController.deleteAPIKey));

// Webhooks
router.get('/webhooks', auth, asyncHandler(settingsController.getWebhooks));
router.post('/webhooks', auth, [
  body('url').isURL(),
  body('events').isArray()
], validation, asyncHandler(settingsController.createWebhook));
router.delete('/webhooks/:webhookId', auth, [
  param('webhookId').isUUID()
], validation, asyncHandler(settingsController.deleteWebhook));

// Settings Stats
router.get('/stats', auth, asyncHandler(settingsController.getSettingsStats));

module.exports = router;
