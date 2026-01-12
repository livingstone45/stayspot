const db = require('../../config/database');

// Data Overview
exports.getDataOverview = async (req, res) => {
  const overview = await db.query(`
    SELECT 
      (SELECT COUNT(*) FROM users WHERE company_id = ?) as total_users,
      (SELECT COUNT(*) FROM properties WHERE company_id = ?) as total_properties,
      (SELECT COUNT(*) FROM tenants WHERE company_id = ?) as total_tenants,
      (SELECT COUNT(*) FROM payments WHERE company_id = ?) as total_payments,
      (SELECT SUM(file_size) FROM documents WHERE company_id = ?) as total_storage
  `, [req.user.companyId, req.user.companyId, req.user.companyId, req.user.companyId, req.user.companyId]);

  res.json({ data: overview[0] });
};

// Data Backups
exports.getBackups = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const backups = await db.query(`
    SELECT * FROM data_backups 
    WHERE company_id = ? 
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `, [req.user.companyId, parseInt(limit), offset]);

  const countResult = await db.query('SELECT COUNT(*) as total FROM data_backups WHERE company_id = ?', [req.user.companyId]);

  res.json({
    data: backups,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: countResult[0].total }
  });
};

exports.createBackup = async (req, res) => {
  const { backup_type, description } = req.body;

  const result = await db.query(
    `INSERT INTO data_backups (company_id, backup_type, description, status, created_at) 
     VALUES (?, ?, ?, 'completed', NOW())`,
    [req.user.companyId, backup_type, description]
  );

  res.status(201).json({ data: { id: result.insertId, message: 'Backup created' } });
};

exports.restoreBackup = async (req, res) => {
  const { backupId } = req.params;

  await db.query(
    'UPDATE data_backups SET restored_at = NOW() WHERE id = ? AND company_id = ?',
    [backupId, req.user.companyId]
  );

  res.json({ message: 'Backup restored' });
};

exports.deleteBackup = async (req, res) => {
  const { backupId } = req.params;

  await db.query('DELETE FROM data_backups WHERE id = ? AND company_id = ?', [backupId, req.user.companyId]);
  res.json({ message: 'Backup deleted' });
};

// Data Retention
exports.getRetentionPolicies = async (req, res) => {
  const policies = await db.query(`
    SELECT * FROM retention_policies 
    WHERE company_id = ? 
    ORDER BY created_at DESC
  `, [req.user.companyId]);

  res.json({ data: policies });
};

exports.updateRetentionPolicy = async (req, res) => {
  const { policyId } = req.params;
  const { retention_days, auto_delete } = req.body;

  await db.query(
    'UPDATE retention_policies SET retention_days = ?, auto_delete = ?, updated_at = NOW() WHERE id = ? AND company_id = ?',
    [retention_days, auto_delete, policyId, req.user.companyId]
  );

  res.json({ message: 'Policy updated' });
};

// Data Export
exports.getExportRequests = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const requests = await db.query(`
    SELECT * FROM export_requests 
    WHERE company_id = ? 
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `, [req.user.companyId, parseInt(limit), offset]);

  const countResult = await db.query('SELECT COUNT(*) as total FROM export_requests WHERE company_id = ?', [req.user.companyId]);

  res.json({
    data: requests,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: countResult[0].total }
  });
};

exports.createExportRequest = async (req, res) => {
  const { data_type, format } = req.body;

  const result = await db.query(
    `INSERT INTO export_requests (company_id, user_id, data_type, format, status, created_at) 
     VALUES (?, ?, ?, ?, 'pending', NOW())`,
    [req.user.companyId, req.user.id, data_type, format]
  );

  res.status(201).json({ data: { id: result.insertId, message: 'Export request created' } });
};

// Data Privacy
exports.getPrivacySettings = async (req, res) => {
  const settings = await db.query(`
    SELECT * FROM privacy_settings 
    WHERE company_id = ?
  `, [req.user.companyId]);

  res.json({ data: settings[0] || {} });
};

exports.updatePrivacySettings = async (req, res) => {
  const { data_encryption, anonymization, gdpr_compliant } = req.body;

  await db.query(
    `INSERT INTO privacy_settings (company_id, data_encryption, anonymization, gdpr_compliant, updated_at) 
     VALUES (?, ?, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE 
     data_encryption = ?, anonymization = ?, gdpr_compliant = ?, updated_at = NOW()`,
    [req.user.companyId, data_encryption, anonymization, gdpr_compliant, data_encryption, anonymization, gdpr_compliant]
  );

  res.json({ message: 'Privacy settings updated' });
};

// Data Deletion Requests
exports.getDeletionRequests = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM deletion_requests WHERE company_id = ?';
  const params = [req.user.companyId];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  const requests = await db.query(query, params);
  const countResult = await db.query('SELECT COUNT(*) as total FROM deletion_requests WHERE company_id = ?', [req.user.companyId]);

  res.json({
    data: requests,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: countResult[0].total }
  });
};

exports.createDeletionRequest = async (req, res) => {
  const { user_id, reason } = req.body;

  const result = await db.query(
    `INSERT INTO deletion_requests (company_id, user_id, reason, status, created_at) 
     VALUES (?, ?, ?, 'pending', NOW())`,
    [req.user.companyId, user_id, reason]
  );

  res.status(201).json({ data: { id: result.insertId, message: 'Deletion request created' } });
};

exports.approveDeletionRequest = async (req, res) => {
  const { requestId } = req.params;

  await db.query(
    'UPDATE deletion_requests SET status = ?, approved_at = NOW() WHERE id = ? AND company_id = ?',
    ['approved', requestId, req.user.companyId]
  );

  res.json({ message: 'Deletion request approved' });
};

// Data Statistics
exports.getDataStats = async (req, res) => {
  const stats = await db.query(`
    SELECT 
      (SELECT COUNT(*) FROM data_backups WHERE company_id = ?) as total_backups,
      (SELECT COUNT(*) FROM export_requests WHERE company_id = ?) as total_exports,
      (SELECT COUNT(*) FROM deletion_requests WHERE company_id = ?) as total_deletions,
      (SELECT COUNT(*) FROM deletion_requests WHERE company_id = ? AND status = 'pending') as pending_deletions
  `, [req.user.companyId, req.user.companyId, req.user.companyId, req.user.companyId]);

  res.json({ data: stats[0] });
};
