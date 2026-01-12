const express = require('express');
const { query, param, body } = require('express-validator');
const communicationController = require('../controllers/communication/communication.controller');
const { auth, requirePermission } = require('../middleware/auth');
const { validation } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Messages
router.get('/messages',
  auth,
  requirePermission('message:view'),
  [
    query('search').optional().trim().isLength({ max: 100 }),
    query('recipient').optional().isUUID(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(communicationController.getMessages)
);

router.get('/messages/:messageId',
  auth,
  requirePermission('message:view'),
  param('messageId').isUUID(),
  validation,
  asyncHandler(communicationController.getMessage)
);

router.post('/messages',
  auth,
  requirePermission('message:send'),
  [
    body('recipient_id').isUUID(),
    body('subject').trim().isLength({ min: 1, max: 200 }),
    body('body').trim().isLength({ min: 1, max: 5000 })
  ],
  validation,
  asyncHandler(communicationController.sendMessage)
);

router.delete('/messages/:messageId',
  auth,
  requirePermission('message:delete'),
  param('messageId').isUUID(),
  validation,
  asyncHandler(communicationController.deleteMessage)
);

router.get('/messages/stats/summary',
  auth,
  requirePermission('message:view'),
  asyncHandler(communicationController.getMessageStats)
);

// Announcements
router.get('/announcements',
  auth,
  requirePermission('announcement:view'),
  [
    query('search').optional().trim().isLength({ max: 100 }),
    query('status').optional().isIn(['draft', 'published', 'archived']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(communicationController.getAnnouncements)
);

router.get('/announcements/:announcementId',
  auth,
  requirePermission('announcement:view'),
  param('announcementId').isUUID(),
  validation,
  asyncHandler(communicationController.getAnnouncement)
);

router.post('/announcements',
  auth,
  requirePermission('announcement:create'),
  [
    body('title').trim().isLength({ min: 1, max: 200 }),
    body('content').trim().isLength({ min: 1, max: 5000 }),
    body('status').isIn(['draft', 'published', 'archived']),
    body('priority').optional().isIn(['low', 'medium', 'high'])
  ],
  validation,
  asyncHandler(communicationController.createAnnouncement)
);

router.put('/announcements/:announcementId',
  auth,
  requirePermission('announcement:edit'),
  param('announcementId').isUUID(),
  [
    body('title').optional().trim().isLength({ min: 1, max: 200 }),
    body('content').optional().trim().isLength({ min: 1, max: 5000 }),
    body('status').optional().isIn(['draft', 'published', 'archived']),
    body('priority').optional().isIn(['low', 'medium', 'high'])
  ],
  validation,
  asyncHandler(communicationController.updateAnnouncement)
);

router.delete('/announcements/:announcementId',
  auth,
  requirePermission('announcement:delete'),
  param('announcementId').isUUID(),
  validation,
  asyncHandler(communicationController.deleteAnnouncement)
);

router.get('/announcements/stats/summary',
  auth,
  requirePermission('announcement:view'),
  asyncHandler(communicationController.getAnnouncementStats)
);

// Notifications
router.get('/notifications',
  auth,
  requirePermission('notification:view'),
  [
    query('type').optional().isIn(['message', 'announcement', 'alert', 'system']),
    query('read').optional().isIn(['true', 'false']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(communicationController.getNotifications)
);

router.put('/notifications/:notificationId/read',
  auth,
  requirePermission('notification:edit'),
  param('notificationId').isUUID(),
  validation,
  asyncHandler(communicationController.markNotificationAsRead)
);

router.put('/notifications/read-all',
  auth,
  requirePermission('notification:edit'),
  asyncHandler(communicationController.markAllNotificationsAsRead)
);

router.delete('/notifications/:notificationId',
  auth,
  requirePermission('notification:delete'),
  param('notificationId').isUUID(),
  validation,
  asyncHandler(communicationController.deleteNotification)
);

router.get('/notifications/stats/summary',
  auth,
  requirePermission('notification:view'),
  asyncHandler(communicationController.getNotificationStats)
);

// Templates
router.get('/templates',
  auth,
  requirePermission('template:view'),
  [
    query('search').optional().trim().isLength({ max: 100 }),
    query('type').optional().isIn(['email', 'sms', 'push']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(communicationController.getTemplates)
);

router.get('/templates/:templateId',
  auth,
  requirePermission('template:view'),
  param('templateId').isUUID(),
  validation,
  asyncHandler(communicationController.getTemplate)
);

router.post('/templates',
  auth,
  requirePermission('template:create'),
  [
    body('name').trim().isLength({ min: 1, max: 100 }),
    body('type').isIn(['email', 'sms', 'push']),
    body('subject').optional().trim().isLength({ max: 200 }),
    body('content').trim().isLength({ min: 1, max: 5000 })
  ],
  validation,
  asyncHandler(communicationController.createTemplate)
);

router.put('/templates/:templateId',
  auth,
  requirePermission('template:edit'),
  param('templateId').isUUID(),
  [
    body('name').optional().trim().isLength({ min: 1, max: 100 }),
    body('type').optional().isIn(['email', 'sms', 'push']),
    body('subject').optional().trim().isLength({ max: 200 }),
    body('content').optional().trim().isLength({ min: 1, max: 5000 })
  ],
  validation,
  asyncHandler(communicationController.updateTemplate)
);

router.delete('/templates/:templateId',
  auth,
  requirePermission('template:delete'),
  param('templateId').isUUID(),
  validation,
  asyncHandler(communicationController.deleteTemplate)
);

router.get('/templates/stats/summary',
  auth,
  requirePermission('template:view'),
  asyncHandler(communicationController.getTemplateStats)
);

// Logs
router.get('/logs',
  auth,
  requirePermission('log:view'),
  [
    query('action').optional().isIn(['send', 'publish', 'delete', 'update']),
    query('user_id').optional().isUUID(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(communicationController.getLogs)
);

router.get('/logs/stats/summary',
  auth,
  requirePermission('log:view'),
  asyncHandler(communicationController.getLogStats)
);

router.get('/logs/stats/by-action',
  auth,
  requirePermission('log:view'),
  asyncHandler(communicationController.getLogsByAction)
);

module.exports = router;
