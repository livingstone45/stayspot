const express = require('express');
const { body, param, query } = require('express-validator');
const ticketController = require('../controllers/support/ticket.controller');
const { auth } = require('../middleware/auth');
const { validation } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Tickets
router.get('/tickets', auth, asyncHandler(ticketController.getTickets));
router.get('/tickets/:ticketId', auth, param('ticketId').isUUID(), validation, asyncHandler(ticketController.getTicket));
router.put('/tickets/:ticketId', auth, param('ticketId').isUUID(), validation, asyncHandler(ticketController.updateTicket));
router.post('/tickets/:ticketId/reply', auth, param('ticketId').isUUID(), [body('message').trim().isLength({ min: 1 })], validation, asyncHandler(ticketController.replyToTicket));
router.get('/tickets/stats', auth, asyncHandler(ticketController.getTicketStats));

// Conversations (Chat)
router.get('/conversations', auth, asyncHandler(ticketController.getConversations));
router.get('/conversations/:conversationId/messages', auth, param('conversationId').isUUID(), validation, asyncHandler(ticketController.getMessages));
router.post('/conversations/:conversationId/messages', auth, param('conversationId').isUUID(), [body('message').trim().isLength({ min: 1 })], validation, asyncHandler(ticketController.sendMessage));

// Knowledge Base
router.get('/kb', auth, asyncHandler(ticketController.getArticles));

// Issues
router.get('/issues', auth, asyncHandler(ticketController.getIssues));

// Reports
router.get('/reports', auth, asyncHandler(ticketController.getReports));

module.exports = router;
