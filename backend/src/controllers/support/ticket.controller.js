const { SupportTicket, TicketReply, Conversation, Message, KBArticle, SupportIssue, User } = require('../../models');
const { Op } = require('sequelize');

class SupportTicketController {
  async getTickets(req, res) {
    try {
      const { search, status, priority, page = 1, limit = 20 } = req.query;
      const where = {};
      
      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (search) {
        where[Op.or] = [
          { subject: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const offset = (page - 1) * limit;
      const { count, rows } = await SupportTicket.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset,
        raw: true
      });

      const allTickets = await SupportTicket.findAll({ attributes: ['status'], raw: true });
      const stats = {
        total: allTickets.length,
        open: allTickets.filter(t => t.status === 'open').length,
        inProgress: allTickets.filter(t => t.status === 'in_progress').length,
        resolved: allTickets.filter(t => t.status === 'resolved').length,
        closed: allTickets.filter(t => t.status === 'closed').length
      };

      res.json({ success: true, data: rows, stats, pagination: { total: count, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(count / limit) } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTicket(req, res) {
    try {
      const ticket = await SupportTicket.findByPk(req.params.ticketId, { include: [{ model: TicketReply, as: 'replies' }], raw: true });
      if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
      res.json({ success: true, data: ticket });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateTicket(req, res) {
    try {
      const { status } = req.body;
      const ticket = await SupportTicket.findByPk(req.params.ticketId);
      if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
      ticket.status = status;
      await ticket.save();
      res.json({ success: true, message: 'Ticket updated', data: ticket });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async replyToTicket(req, res) {
    try {
      const { message } = req.body;
      const ticket = await SupportTicket.findByPk(req.params.ticketId);
      if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
      const reply = await TicketReply.create({ ticketId: req.params.ticketId, userId: req.user.id, message });
      res.json({ success: true, message: 'Reply sent', data: reply });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTicketStats(req, res) {
    try {
      const tickets = await SupportTicket.findAll({ attributes: ['status'], raw: true });
      const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        closed: tickets.filter(t => t.status === 'closed').length
      };
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getConversations(req, res) {
    try {
      const { search } = req.query;
      const where = {};
      if (search) where.name = { [Op.iLike]: `%${search}%` };
      
      const conversations = await Conversation.findAll({ where, order: [['updatedAt', 'DESC']], raw: true });
      res.json({ success: true, data: conversations });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMessages(req, res) {
    try {
      const messages = await Message.findAll({ where: { conversationId: req.params.conversationId }, order: [['createdAt', 'ASC']], raw: true });
      res.json({ success: true, data: messages });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async sendMessage(req, res) {
    try {
      const { message } = req.body;
      const msg = await Message.create({ conversationId: req.params.conversationId, userId: req.user.id, message, isOwn: true });
      res.json({ success: true, data: msg });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getArticles(req, res) {
    try {
      const { search, category } = req.query;
      const where = {};
      if (search) where.title = { [Op.iLike]: `%${search}%` };
      if (category) where.category = category;
      
      const articles = await KBArticle.findAll({ where, raw: true });
      const categories = await KBArticle.findAll({ attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']], raw: true });
      res.json({ success: true, data: articles, categories: categories.map(c => c.category) });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getIssues(req, res) {
    try {
      const { search, severity, status } = req.query;
      const where = {};
      if (search) where.title = { [Op.iLike]: `%${search}%` };
      if (severity) where.severity = severity;
      if (status) where.status = status;
      
      const issues = await SupportIssue.findAll({ where, raw: true });
      const allIssues = await SupportIssue.findAll({ attributes: ['severity'], raw: true });
      const stats = {
        total: allIssues.length,
        critical: allIssues.filter(i => i.severity === 'critical').length,
        high: allIssues.filter(i => i.severity === 'high').length,
        medium: allIssues.filter(i => i.severity === 'medium').length,
        low: allIssues.filter(i => i.severity === 'low').length
      };
      res.json({ success: true, data: issues, stats });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getReports(req, res) {
    try {
      const { period = 'month' } = req.query;
      const tickets = await SupportTicket.findAll({ raw: true });
      const data = {
        totalTickets: tickets.length,
        avgResolutionTime: 24,
        satisfactionRate: 92,
        activeAgents: 5,
        openTickets: tickets.filter(t => t.status === 'open').length,
        resolvedTickets: tickets.filter(t => t.status === 'resolved').length
      };
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SupportTicketController();
