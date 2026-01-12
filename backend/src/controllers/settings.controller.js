const db = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

exports.getSettings = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const [settings] = await db.query(
      'SELECT * FROM company_settings WHERE company_id = ?',
      [companyId]
    );
    res.json({ success: true, data: settings[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { company_name, company_email, company_phone, timezone, language, currency } = req.body;

    await db.query(
      'UPDATE company_settings SET company_name = ?, company_email = ?, company_phone = ?, timezone = ?, language = ?, currency = ? WHERE company_id = ?',
      [company_name, company_email, company_phone, timezone, language, currency, companyId]
    );

    res.json({ success: true, message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardWidgets = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const [widgets] = await db.query(
      'SELECT * FROM dashboard_widgets WHERE company_id = ? ORDER BY position ASC',
      [companyId]
    );
    res.json({ success: true, data: widgets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDashboardWidgets = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { widgets } = req.body;

    for (const widget of widgets) {
      await db.query(
        'UPDATE dashboard_widgets SET enabled = ?, position = ?, size = ? WHERE id = ? AND company_id = ?',
        [widget.enabled, widget.position, widget.size, widget.id, companyId]
      );
    }

    res.json({ success: true, message: 'Dashboard updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNotificationSettings = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const [settings] = await db.query(
      'SELECT * FROM notification_settings WHERE company_id = ?',
      [companyId]
    );
    res.json({ success: true, data: settings[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateNotificationSettings = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { email_alerts, sms_alerts, push_notifications, digest_frequency } = req.body;

    await db.query(
      'UPDATE notification_settings SET email_alerts = ?, sms_alerts = ?, push_notifications = ?, digest_frequency = ? WHERE company_id = ?',
      [email_alerts, sms_alerts, push_notifications, digest_frequency, companyId]
    );

    res.json({ success: true, message: 'Notification settings updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getIntegrations = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const [integrations] = await db.query(
      'SELECT * FROM integrations WHERE company_id = ?',
      [companyId]
    );
    res.json({ success: true, data: integrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateIntegration = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { integrationId } = req.params;
    const { enabled, config } = req.body;

    await db.query(
      'UPDATE integrations SET enabled = ?, config = ? WHERE id = ? AND company_id = ?',
      [enabled, JSON.stringify(config), integrationId, companyId]
    );

    res.json({ success: true, message: 'Integration updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSecuritySettings = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const [settings] = await db.query(
      'SELECT * FROM security_settings WHERE company_id = ?',
      [companyId]
    );
    res.json({ success: true, data: settings[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSecuritySettings = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { two_factor_auth, session_timeout, ip_whitelist, password_policy } = req.body;

    await db.query(
      'UPDATE security_settings SET two_factor_auth = ?, session_timeout = ?, ip_whitelist = ?, password_policy = ? WHERE company_id = ?',
      [two_factor_auth, session_timeout, ip_whitelist, password_policy, companyId]
    );

    res.json({ success: true, message: 'Security settings updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAPIKeys = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const [keys] = await db.query(
      'SELECT id, name, key_prefix, created_at, last_used FROM api_keys WHERE company_id = ?',
      [companyId]
    );
    res.json({ success: true, data: keys });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAPIKey = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { name } = req.body;
    const id = uuidv4();
    const key = `sk_${uuidv4().replace(/-/g, '')}`;
    const key_prefix = key.substring(0, 10);

    await db.query(
      'INSERT INTO api_keys (id, company_id, name, key, key_prefix, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [id, companyId, name, key, key_prefix]
    );

    res.json({ success: true, data: { id, name, key, key_prefix } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAPIKey = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { keyId } = req.params;

    await db.query(
      'DELETE FROM api_keys WHERE id = ? AND company_id = ?',
      [keyId, companyId]
    );

    res.json({ success: true, message: 'API key deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWebhooks = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const [webhooks] = await db.query(
      'SELECT * FROM webhooks WHERE company_id = ?',
      [companyId]
    );
    res.json({ success: true, data: webhooks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createWebhook = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { url, events } = req.body;
    const id = uuidv4();

    await db.query(
      'INSERT INTO webhooks (id, company_id, url, events, active, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [id, companyId, url, JSON.stringify(events), true]
    );

    res.json({ success: true, data: { id, url, events } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteWebhook = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { webhookId } = req.params;

    await db.query(
      'DELETE FROM webhooks WHERE id = ? AND company_id = ?',
      [webhookId, companyId]
    );

    res.json({ success: true, message: 'Webhook deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSettingsStats = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    const [stats] = await db.query(
      `SELECT 
        (SELECT COUNT(*) FROM api_keys WHERE company_id = ?) as total_api_keys,
        (SELECT COUNT(*) FROM webhooks WHERE company_id = ? AND active = true) as active_webhooks,
        (SELECT COUNT(*) FROM integrations WHERE company_id = ? AND enabled = true) as enabled_integrations`,
      [companyId, companyId, companyId]
    );

    res.json({ success: true, data: stats[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
