const db = require('../../config/database');

// Audit Logs
exports.getAuditLogs = async (req, res) => {
  const { action, user_id, resource_type, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  let query = `SELECT a.*, u.name as user_name FROM audit_logs a 
    LEFT JOIN users u ON a.user_id = u.id 
    WHERE a.company_id = ?`;
  const params = [req.user.companyId];

  if (action) {
    query += ' AND a.action = ?';
    params.push(action);
  }

  if (user_id) {
    query += ' AND a.user_id = ?';
    params.push(user_id);
  }

  if (resource_type) {
    query += ' AND a.resource_type = ?';
    params.push(resource_type);
  }

  query += ` ORDER BY a.created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  const logs = await db.query(query, params);
  const countResult = await db.query('SELECT COUNT(*) as total FROM audit_logs WHERE company_id = ?', [req.user.companyId]);

  res.json({
    data: logs,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: countResult[0].total }
  });
};

exports.getAuditLog = async (req, res) => {
  const { logId } = req.params;
  const log = await db.query(`
    SELECT a.*, u.name as user_name, u.email as user_email 
    FROM audit_logs a 
    LEFT JOIN users u ON a.user_id = u.id 
    WHERE a.id = ? AND a.company_id = ?
  `, [logId, req.user.companyId]);

  if (!log.length) return res.status(404).json({ error: 'Log not found' });
  res.json({ data: log[0] });
};

exports.createAuditLog = async (req, res) => {
  const { action, resource_type, resource_id, changes, ip_address, user_agent } = req.body;

  const result = await db.query(
    `INSERT INTO audit_logs (company_id, user_id, action, resource_type, resource_id, changes, ip_address, user_agent, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [req.user.companyId, req.user.id, action, resource_type, resource_id, JSON.stringify(changes), ip_address, user_agent]
  );

  res.status(201).json({ data: { id: result.insertId, message: 'Audit log created' } });
};

exports.getAuditStats = async (req, res) => {
  const stats = await db.query(`
    SELECT 
      COUNT(*) as total_logs,
      COUNT(DISTINCT user_id) as active_users,
      COUNT(DISTINCT resource_type) as resource_types,
      COUNT(DISTINCT action) as action_types
    FROM audit_logs WHERE company_id = ?
  `, [req.user.companyId]);

  res.json({ data: stats[0] });
};

exports.getAuditLogsByAction = async (req, res) => {
  const actionStats = await db.query(`
    SELECT action, COUNT(*) as count 
    FROM audit_logs 
    WHERE company_id = ? 
    GROUP BY action 
    ORDER BY count DESC
  `, [req.user.companyId]);

  res.json({ data: actionStats });
};

exports.getAuditLogsByUser = async (req, res) => {
  const userStats = await db.query(`
    SELECT u.id, u.name, COUNT(a.id) as activity_count 
    FROM users u 
    LEFT JOIN audit_logs a ON u.id = a.user_id 
    WHERE u.company_id = ? 
    GROUP BY u.id 
    ORDER BY activity_count DESC 
    LIMIT 10
  `, [req.user.companyId]);

  res.json({ data: userStats });
};

exports.getAuditLogsByResource = async (req, res) => {
  const resourceStats = await db.query(`
    SELECT resource_type, COUNT(*) as count 
    FROM audit_logs 
    WHERE company_id = ? 
    GROUP BY resource_type 
    ORDER BY count DESC
  `, [req.user.companyId]);

  res.json({ data: resourceStats });
};

exports.getAuditTimeline = async (req, res) => {
  const { days = 30 } = req.query;

  const timeline = await db.query(`
    SELECT DATE(created_at) as date, COUNT(*) as count 
    FROM audit_logs 
    WHERE company_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY DATE(created_at) 
    ORDER BY date ASC
  `, [req.user.companyId, parseInt(days)]);

  res.json({ data: timeline });
};

exports.exportAuditLogs = async (req, res) => {
  const { action, user_id, resource_type, format = 'csv' } = req.query;

  let query = `SELECT a.*, u.name as user_name FROM audit_logs a 
    LEFT JOIN users u ON a.user_id = u.id 
    WHERE a.company_id = ?`;
  const params = [req.user.companyId];

  if (action) {
    query += ' AND a.action = ?';
    params.push(action);
  }

  if (user_id) {
    query += ' AND a.user_id = ?';
    params.push(user_id);
  }

  if (resource_type) {
    query += ' AND a.resource_type = ?';
    params.push(resource_type);
  }

  query += ' ORDER BY a.created_at DESC';

  const logs = await db.query(query, params);

  if (format === 'json') {
    res.json({ data: logs });
  } else {
    // CSV format
    const csv = [
      ['Date', 'User', 'Action', 'Resource Type', 'Resource ID', 'IP Address', 'Changes'].join(','),
      ...logs.map(log => [
        new Date(log.created_at).toLocaleString(),
        log.user_name,
        log.action,
        log.resource_type,
        log.resource_id,
        log.ip_address,
        log.changes
      ].map(v => `"${v}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');
    res.send(csv);
  }
};
