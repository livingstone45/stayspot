const db = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

exports.getComplianceOverview = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    const [standards] = await db.query(
      'SELECT COUNT(*) as total FROM compliance_standards WHERE company_id = ?',
      [companyId]
    );

    const [certifications] = await db.query(
      'SELECT COUNT(*) as total FROM compliance_certifications WHERE company_id = ? AND status = ?',
      [companyId, 'active']
    );

    const [audits] = await db.query(
      'SELECT COUNT(*) as total FROM compliance_audits WHERE company_id = ? AND status = ?',
      [companyId, 'completed']
    );

    const [violations] = await db.query(
      'SELECT COUNT(*) as total FROM compliance_violations WHERE company_id = ? AND status = ?',
      [companyId, 'open']
    );

    res.json({
      success: true,
      data: {
        total_standards: standards[0].total,
        active_certifications: certifications[0].total,
        completed_audits: audits[0].total,
        open_violations: violations[0].total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getComplianceStandards = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM compliance_standards WHERE company_id = ?';
    const params = [companyId];

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [standards] = await db.query(query, params);

    res.json({ success: true, data: standards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createComplianceStandard = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { name, description, category, requirements } = req.body;

    const id = uuidv4();
    await db.query(
      'INSERT INTO compliance_standards (id, company_id, name, description, category, requirements, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [id, companyId, name, description, category, JSON.stringify(requirements), 'active']
    );

    res.json({ success: true, data: { id, name, description, category } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCertifications = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM compliance_certifications WHERE company_id = ?';
    const params = [companyId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY expiry_date ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [certifications] = await db.query(query, params);

    res.json({ success: true, data: certifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCertification = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { name, issuer, issue_date, expiry_date, certificate_number } = req.body;

    const id = uuidv4();
    const status = new Date(expiry_date) > new Date() ? 'active' : 'expired';

    await db.query(
      'INSERT INTO compliance_certifications (id, company_id, name, issuer, issue_date, expiry_date, certificate_number, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [id, companyId, name, issuer, issue_date, expiry_date, certificate_number, status]
    );

    res.json({ success: true, data: { id, name, issuer, status } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAudits = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM compliance_audits WHERE company_id = ?';
    const params = [companyId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY audit_date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [audits] = await db.query(query, params);

    res.json({ success: true, data: audits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAudit = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { audit_type, audit_date, auditor, findings, status } = req.body;

    const id = uuidv4();
    await db.query(
      'INSERT INTO compliance_audits (id, company_id, audit_type, audit_date, auditor, findings, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [id, companyId, audit_type, audit_date, auditor, JSON.stringify(findings), status]
    );

    res.json({ success: true, data: { id, audit_type, audit_date, status } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getViolations = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM compliance_violations WHERE company_id = ?';
    const params = [companyId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [violations] = await db.query(query, params);

    res.json({ success: true, data: violations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createViolation = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { standard_id, description, severity, remediation_plan } = req.body;

    const id = uuidv4();
    await db.query(
      'INSERT INTO compliance_violations (id, company_id, standard_id, description, severity, remediation_plan, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [id, companyId, standard_id, description, severity, remediation_plan, 'open']
    );

    res.json({ success: true, data: { id, description, severity, status: 'open' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateViolationStatus = async (req, res) => {
  try {
    const { violationId } = req.params;
    const { status } = req.body;

    await db.query(
      'UPDATE compliance_violations SET status = ? WHERE id = ?',
      [status, violationId]
    );

    res.json({ success: true, message: 'Violation updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getComplianceReports = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [reports] = await db.query(
      'SELECT * FROM compliance_reports WHERE company_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [companyId, parseInt(limit), offset]
    );

    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateComplianceReport = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { report_type, period } = req.body;

    const id = uuidv4();
    await db.query(
      'INSERT INTO compliance_reports (id, company_id, report_type, period, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [id, companyId, report_type, period, 'generated']
    );

    res.json({ success: true, data: { id, report_type, period, status: 'generated' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getComplianceStats = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    const [stats] = await db.query(
      `SELECT 
        (SELECT COUNT(*) FROM compliance_standards WHERE company_id = ?) as total_standards,
        (SELECT COUNT(*) FROM compliance_certifications WHERE company_id = ? AND status = 'active') as active_certifications,
        (SELECT COUNT(*) FROM compliance_audits WHERE company_id = ? AND status = 'completed') as completed_audits,
        (SELECT COUNT(*) FROM compliance_violations WHERE company_id = ? AND status = 'open') as open_violations,
        (SELECT COUNT(*) FROM compliance_violations WHERE company_id = ? AND status = 'resolved') as resolved_violations`,
      [companyId, companyId, companyId, companyId, companyId]
    );

    res.json({ success: true, data: stats[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
