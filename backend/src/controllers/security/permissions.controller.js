const db = require('../../config/database');

// Roles
exports.getRoles = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM roles WHERE company_id = ?';
  const params = [req.user.companyId];

  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  const roles = await db.query(query, params);
  const countResult = await db.query('SELECT COUNT(*) as total FROM roles WHERE company_id = ?', [req.user.companyId]);

  res.json({
    data: roles,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: countResult[0].total }
  });
};

exports.getRole = async (req, res) => {
  const { roleId } = req.params;
  const role = await db.query('SELECT * FROM roles WHERE id = ? AND company_id = ?', [roleId, req.user.companyId]);

  if (!role.length) return res.status(404).json({ error: 'Role not found' });

  const permissions = await db.query('SELECT p.* FROM permissions p JOIN role_permissions rp ON p.id = rp.permission_id WHERE rp.role_id = ?', [roleId]);
  const users = await db.query('SELECT COUNT(*) as count FROM user_roles WHERE role_id = ?', [roleId]);

  res.json({ data: { ...role[0], permissions, userCount: users[0].count } });
};

exports.createRole = async (req, res) => {
  const { name, description, permissions } = req.body;

  const result = await db.query(
    'INSERT INTO roles (company_id, name, description, created_at) VALUES (?, ?, ?, NOW())',
    [req.user.companyId, name, description]
  );

  if (permissions && permissions.length > 0) {
    for (const permId of permissions) {
      await db.query('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)', [result.insertId, permId]);
    }
  }

  res.status(201).json({ data: { id: result.insertId, message: 'Role created' } });
};

exports.updateRole = async (req, res) => {
  const { roleId } = req.params;
  const { name, description, permissions } = req.body;

  await db.query('UPDATE roles SET name = ?, description = ?, updated_at = NOW() WHERE id = ? AND company_id = ?',
    [name, description, roleId, req.user.companyId]);

  if (permissions) {
    await db.query('DELETE FROM role_permissions WHERE role_id = ?', [roleId]);
    for (const permId of permissions) {
      await db.query('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)', [roleId, permId]);
    }
  }

  res.json({ message: 'Role updated' });
};

exports.deleteRole = async (req, res) => {
  const { roleId } = req.params;
  await db.query('DELETE FROM role_permissions WHERE role_id = ?', [roleId]);
  await db.query('DELETE FROM roles WHERE id = ? AND company_id = ?', [roleId, req.user.companyId]);
  res.json({ message: 'Role deleted' });
};

// Permissions
exports.getPermissions = async (req, res) => {
  const { category } = req.query;

  let query = 'SELECT * FROM permissions';
  const params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY category, name';

  const permissions = await db.query(query, params);
  res.json({ data: permissions });
};

exports.getPermissionCategories = async (req, res) => {
  const categories = await db.query('SELECT DISTINCT category FROM permissions ORDER BY category');
  res.json({ data: categories });
};

// User Roles
exports.getUserRoles = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = `SELECT u.id, u.name, u.email, GROUP_CONCAT(r.name) as roles 
    FROM users u 
    LEFT JOIN user_roles ur ON u.id = ur.user_id 
    LEFT JOIN roles r ON ur.role_id = r.id 
    WHERE u.company_id = ?`;
  const params = [req.user.companyId];

  if (search) {
    query += ' AND (u.name LIKE ? OR u.email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ` GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  const users = await db.query(query, params);
  const countResult = await db.query('SELECT COUNT(*) as total FROM users WHERE company_id = ?', [req.user.companyId]);

  res.json({
    data: users,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: countResult[0].total }
  });
};

exports.assignRoleToUser = async (req, res) => {
  const { userId, roleId } = req.body;

  await db.query('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, roleId]);
  res.json({ message: 'Role assigned' });
};

exports.removeRoleFromUser = async (req, res) => {
  const { userId, roleId } = req.body;

  await db.query('DELETE FROM user_roles WHERE user_id = ? AND role_id = ?', [userId, roleId]);
  res.json({ message: 'Role removed' });
};

// Stats
exports.getPermissionStats = async (req, res) => {
  const stats = await db.query(`
    SELECT 
      (SELECT COUNT(*) FROM roles WHERE company_id = ?) as total_roles,
      (SELECT COUNT(*) FROM permissions) as total_permissions,
      (SELECT COUNT(DISTINCT user_id) FROM user_roles WHERE role_id IN (SELECT id FROM roles WHERE company_id = ?)) as users_with_roles
  `, [req.user.companyId, req.user.companyId]);

  res.json({ data: stats[0] });
};
