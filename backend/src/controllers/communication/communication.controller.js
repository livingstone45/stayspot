const db = require('../../config/database');

// Messages
exports.getMessages = async (req, res) => {
  const { search, recipient, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = `SELECT m.*, u.name as sender_name, u.email as sender_email 
    FROM messages m 
    LEFT JOIN users u ON m.sender_id = u.id 
    WHERE m.company_id = ?`;
  const params = [req.user.companyId];

  if (search) {
    query += ' AND (m.subject LIKE ? OR m.body LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (recipient) {
    query += ' AND m.recipient_id = ?';
    params.push(recipient);
  }

  query += ` ORDER BY m.created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  const messages = await db.query(query, params);
  const countResult = await db.query('SELECT COUNT(*) as total FROM messages WHERE company_id = ?', [req.user.companyId]);

  res.json({
    data: messages,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: countResult[0].total }
  });
};

exports.getMessage = async (req, res) => {
  const { messageId } = req.params;
  const message = await db.query(`
    SELECT m.*, u.name as sender_name, u.email as sender_email 
    FROM messages m 
    LEFT JOIN users u ON m.sender_id = u.id 
    WHERE m.id = ? AND m.company_id = ?
  `, [messageId, req.user.companyId]);

  if (!message.length) return res.status(404).json({ error: 'Message not found' });
  
  await db.query('UPDATE messages SET is_read = 1 WHERE id = ?', [messageId]);
  res.json({ data: message[0] });
};

exports.sendMessage = async (req, res) => {
  const { recipient_id, subject, body } = req.body;

  const result = await db.query(
    'INSERT INTO messages (company_id, sender_id, recipient_id, subject, body, is_read, created_at) VALUES (?, ?, ?, ?, ?, 0, NOW())',
    [req.user.companyId, req.user.id, recipient_id, subject, body]
  );

  res.status(201).json({ data: { id: result.insertId, message: 'Message sent successfully' } });
};

exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  await db.query('DELETE FROM messages WHERE id = ? AND company_id = ?', [messageId, req.user.companyId]);
  res.json({ message: 'Message deleted' });
};

exports.getMessageStats = async (req, res) => {
  const stats = await db.query(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread,
      SUM(CASE WHEN is_read = 1 THEN 1 ELSE 0 END) as read
    FROM messages WHERE company_id = ?
  `, [req.user.companyId]);

  res.json({ data: stats[0] });
};

// Announcements
exports.getAnnouncements = async (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = `SELECT a.*, u.name as author_name FROM announcements a 
    LEFT JOIN users u ON a.author_id = u.id 
    WHERE a.company_id = ?`;
  const params = [req.user.companyId];

  if (search) {
    query += ' AND (a.title LIKE ? OR a.content LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (status) {
    query += ' AND a.status = ?';
    params.push(status);
  }

  query += ` ORDER BY a.created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  const announcements = await db.query(query, params);
  const countResult = await db.query('SELECT COUNT(*) as total FROM announcements WHERE company_id = ?', [req.user.companyId]);

  res.json({
    data: announcements,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: countResult[0].total }
  });
};

exports.getAnnouncement = async (req, res) => {
  const { announcementId } = req.params;
  const announcement = await db.query(`
    SELECT a.*, u.name as author_name FROM announcements a 
    LEFT JOIN users u ON a.author_id = u.id 
    WHERE a.id = ? AND a.company_id = ?
  `, [announcementId, req.user.companyId]);

  if (!announcement.length) return res.status(404).json({ error: 'Announcement not found' });
  res.json({ data: announcement[0] });
};

exports.createAnnouncement = async (req, res) => {
  const { title, content, status, priority } = req.body;

  const result = await db.query(
    'INSERT INTO announcements (company_id, author_id, title, content, status, priority, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
    [req.user.companyId, req.user.id, title, content, status, priority]
  );

  res.status(201).json({ data: { id: result.insertId, message: 'Announcement created' } });
};

exports.updateAnnouncement = async (req, res) => {
  const { announcementId } = req.params;
  const { title, content, status, priority } = req.body;

  await db.query(
    'UPDATE announcements SET title = ?, content = ?, status = ?, priority = ?, updated_at = NOW() WHERE id = ? AND company_id = ?',
    [title, content, status, priority, announcementId, req.user.companyId]
  );

  res.json({ message: 'Announcement updated' });
};

exports.deleteAnnouncement = async (req, res) => {
  const { announcementId } = req.params;
  await db.query('DELETE FROM announcements WHERE id = ? AND company_id = ?', [announcementId, req.user.companyId]);
  res.json({ message: 'Announcement deleted' });
};

exports.getAnnouncementStats = async (req, res) => {
  const stats = await db.query(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
      SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
      SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority
    FROM announcements WHERE company_id = ?
  `, [req.user.companyId]);

  res.json({ data: stats[0] });
};

// Notifications
exports.getNotifications = async (req, res) => {
  const { type, read, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM notifications WHERE company_id = ?';
  const params = [req.user.companyId];

  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }

  if (read !== undefined) {
    query += ' AND is_read = ?';
    params.push(read === 'true' ? 1 : 0);
  }

  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  const notifications = await db.query(query, params);
  const countResult = await db.query('SELECT COUNT(*) as total FROM notifications WHERE company_id = ?', [req.user.companyId]);

  res.json({
    data: notifications,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: countResult[0].total }
  });
};

exports.markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;
  await db.query('UPDATE notifications SET is_read = 1 WHERE id = ? AND company_id = ?', [notificationId, req.user.companyId]);
  res.json({ message: 'Notification marked as read' });
};

exports.markAllNotificationsAsRead = async (req, res) => {
  await db.query('UPDATE notifications SET is_read = 1 WHERE company_id = ?', [req.user.companyId]);
  res.json({ message: 'All notifications marked as read' });
};

exports.deleteNotification = async (req, res) => {
  const { notificationId } = req.params;
  await db.query('DELETE FROM notifications WHERE id = ? AND company_id = ?', [notificationId, req.user.companyId]);
  res.json({ message: 'Notification deleted' });
};

exports.getNotificationStats = async (req, res) => {
  const stats = await db.query(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread,
      COUNT(DISTINCT type) as types
    FROM notifications WHERE company_id = ?
  `, [req.user.companyId]);

  res.json({ data: stats[0] });
};

// Templates
exports.getTemplates = async (req, res) => {
  const { search, type, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM message_templates WHERE company_id = ?';
  const params = [req.user.companyId];

  if (search) {
    query += ' AND (name LIKE ? OR content LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }

  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  const templates = await db.query(query, params);
  const countResult = await db.query('SELECT COUNT(*) as total FROM message_templates WHERE company_id = ?', [req.user.companyId]);

  res.json({
    data: templates,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: countResult[0].total }
  });
};

exports.getTemplate = async (req, res) => {
  const { templateId } = req.params;
  const template = await db.query('SELECT * FROM message_templates WHERE id = ? AND company_id = ?', [templateId, req.user.companyId]);

  if (!template.length) return res.status(404).json({ error: 'Template not found' });
  res.json({ data: template[0] });
};

exports.createTemplate = async (req, res) => {
  const { name, type, subject, content } = req.body;

  const result = await db.query(
    'INSERT INTO message_templates (company_id, name, type, subject, content, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
    [req.user.companyId, name, type, subject, content]
  );

  res.status(201).json({ data: { id: result.insertId, message: 'Template created' } });
};

exports.updateTemplate = async (req, res) => {
  const { templateId } = req.params;
  const { name, type, subject, content } = req.body;

  await db.query(
    'UPDATE message_templates SET name = ?, type = ?, subject = ?, content = ?, updated_at = NOW() WHERE id = ? AND company_id = ?',
    [name, type, subject, content, templateId, req.user.companyId]
  );

  res.json({ message: 'Template updated' });
};

exports.deleteTemplate = async (req, res) => {
  const { templateId } = req.params;
  await db.query('DELETE FROM message_templates WHERE id = ? AND company_id = ?', [templateId, req.user.companyId]);
  res.json({ message: 'Template deleted' });
};

exports.getTemplateStats = async (req, res) => {
  const stats = await db.query(`
    SELECT 
      COUNT(*) as total,
      COUNT(DISTINCT type) as types
    FROM message_templates WHERE company_id = ?
  `, [req.user.companyId]);

  res.json({ data: stats[0] });
};

// Logs
exports.getLogs = async (req, res) => {
  const { action, user_id, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = `SELECT l.*, u.name as user_name FROM communication_logs l 
    LEFT JOIN users u ON l.user_id = u.id 
    WHERE l.company_id = ?`;
  const params = [req.user.companyId];

  if (action) {
    query += ' AND l.action = ?';
    params.push(action);
  }

  if (user_id) {
    query += ' AND l.user_id = ?';
    params.push(user_id);
  }

  query += ` ORDER BY l.created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  const logs = await db.query(query, params);
  const countResult = await db.query('SELECT COUNT(*) as total FROM communication_logs WHERE company_id = ?', [req.user.companyId]);

  res.json({
    data: logs,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: countResult[0].total }
  });
};

exports.getLogStats = async (req, res) => {
  const stats = await db.query(`
    SELECT 
      COUNT(*) as total,
      COUNT(DISTINCT action) as actions,
      COUNT(DISTINCT user_id) as users
    FROM communication_logs WHERE company_id = ?
  `, [req.user.companyId]);

  res.json({ data: stats[0] });
};

exports.getLogsByAction = async (req, res) => {
  const actionStats = await db.query(`
    SELECT action, COUNT(*) as count 
    FROM communication_logs 
    WHERE company_id = ? 
    GROUP BY action 
    ORDER BY count DESC
  `, [req.user.companyId]);

  res.json({ data: actionStats });
};
