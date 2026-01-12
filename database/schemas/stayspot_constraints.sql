-- StaySpot Database Constraints and Triggers
-- Additional constraints, checks, and database triggers for data integrity

-- Add Check Constraints
ALTER TABLE users ADD CONSTRAINT chk_email_format CHECK (email LIKE '%@%.%');
ALTER TABLE users ADD CONSTRAINT chk_status_valid CHECK (status IN ('active', 'inactive', 'suspended', 'banned', 'pending'));

ALTER TABLE properties ADD CONSTRAINT chk_monthly_rent_positive CHECK (monthly_rent > 0);
ALTER TABLE properties ADD CONSTRAINT chk_bedrooms_non_negative CHECK (bedrooms >= 0);
ALTER TABLE properties ADD CONSTRAINT chk_bathrooms_non_negative CHECK (bathrooms >= 0);

ALTER TABLE lease_agreements ADD CONSTRAINT chk_lease_dates CHECK (start_date < end_date);
ALTER TABLE lease_agreements ADD CONSTRAINT chk_lease_rent_positive CHECK (monthly_rent > 0);

ALTER TABLE tasks ADD CONSTRAINT chk_task_due_date CHECK (due_date >= CURDATE());
ALTER TABLE tasks ADD CONSTRAINT chk_task_status_valid CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'on_hold', 'overdue', 'scheduled', 'waiting_approval'));

ALTER TABLE units ADD CONSTRAINT chk_unit_rent_positive CHECK (monthly_rent > 0);
ALTER TABLE units ADD CONSTRAINT chk_unit_status_valid CHECK (status IN ('available', 'occupied', 'maintenance', 'renovation', 'reserved', 'unavailable'));

ALTER TABLE work_orders ADD CONSTRAINT chk_work_order_status CHECK (status IN ('created', 'assigned', 'in_progress', 'completed', 'cancelled', 'on_hold', 'waiting_parts', 'waiting_approval', 'quality_check'));

-- Create indexes for performance optimization

-- User-related indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Company-related indexes
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_email ON companies(email);
CREATE INDEX idx_companies_created_at ON companies(created_at);

-- Property-related indexes
CREATE INDEX idx_properties_company ON properties(company_id);
CREATE INDEX idx_properties_city_state ON properties(city, state);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_rental_status ON properties(rental_status);
CREATE INDEX idx_properties_created_at ON properties(created_at);

-- Task-related indexes
CREATE INDEX idx_tasks_company ON tasks(company_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_priority ON tasks(priority);

-- Lease-related indexes
CREATE INDEX idx_leases_property ON lease_agreements(property_id);
CREATE INDEX idx_leases_tenant ON lease_agreements(tenant_id);
CREATE INDEX idx_leases_status ON lease_agreements(status);

-- Maintenance-related indexes
CREATE INDEX idx_maintenance_property ON maintenance_requests(property_id);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX idx_work_orders_property ON work_orders(property_id);
CREATE INDEX idx_work_orders_vendor ON work_orders(vendor_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);

-- User sessions and audit indexes
CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);
CREATE INDEX idx_audit_user ON user_audit_logs(user_id);
CREATE INDEX idx_audit_entity ON user_audit_logs(entity_type);
CREATE INDEX idx_audit_timestamp ON user_audit_logs(timestamp);

-- Create Triggers

-- Trigger: Update company updated_at timestamp
DELIMITER $$
CREATE TRIGGER trg_companies_update_timestamp
BEFORE UPDATE ON companies
FOR EACH ROW
BEGIN
  SET NEW.updated_at = NOW();
END$$
DELIMITER ;

-- Trigger: Update user updated_at timestamp
DELIMITER $$
CREATE TRIGGER trg_users_update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
  SET NEW.updated_at = NOW();
END$$
DELIMITER ;

-- Trigger: Update properties updated_at timestamp
DELIMITER $$
CREATE TRIGGER trg_properties_update_timestamp
BEFORE UPDATE ON properties
FOR EACH ROW
BEGIN
  SET NEW.updated_at = NOW();
END$$
DELIMITER ;

-- Trigger: Update tasks updated_at timestamp
DELIMITER $$
CREATE TRIGGER trg_tasks_update_timestamp
BEFORE UPDATE ON tasks
FOR EACH ROW
BEGIN
  SET NEW.updated_at = NOW();
END$$
DELIMITER ;

-- Trigger: Audit log for user creation
DELIMITER $$
CREATE TRIGGER trg_audit_user_create
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  INSERT INTO user_audit_logs (id, user_id, action, action_type, entity_type, entity_id, status, timestamp)
  VALUES (UUID(), NEW.id, 'create_user', 'CREATE', 'users', NEW.id, 'success', NOW());
END$$
DELIMITER ;

-- Trigger: Audit log for user updates
DELIMITER $$
CREATE TRIGGER trg_audit_user_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  IF NEW.email != OLD.email OR NEW.status != OLD.status THEN
    INSERT INTO user_audit_logs (id, user_id, action, action_type, entity_type, entity_id, old_values, new_values, status, timestamp)
    VALUES (UUID(), NEW.id, 'update_user', 'UPDATE', 'users', NEW.id, 
            CONCAT('{"email":"', OLD.email, '","status":"', OLD.status, '"}'),
            CONCAT('{"email":"', NEW.email, '","status":"', NEW.status, '"}'),
            'success', NOW());
  END IF;
END$$
DELIMITER ;

-- Trigger: Audit log for user deletion (soft delete)
DELIMITER $$
CREATE TRIGGER trg_audit_user_delete
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
  IF NEW.is_deleted = TRUE AND OLD.is_deleted = FALSE THEN
    INSERT INTO user_audit_logs (id, user_id, action, action_type, entity_type, entity_id, status, timestamp)
    VALUES (UUID(), NEW.id, 'delete_user', 'DELETE', 'users', NEW.id, 'success', NOW());
  END IF;
END$$
DELIMITER ;

-- Trigger: Update property maintenance timestamp
DELIMITER $$
CREATE TRIGGER trg_property_maintenance_timestamp
BEFORE UPDATE ON property_maintenance
FOR EACH ROW
BEGIN
  SET NEW.updated_at = NOW();
END$$
DELIMITER ;

-- Trigger: Update lease agreement timestamp
DELIMITER $$
CREATE TRIGGER trg_lease_update_timestamp
BEFORE UPDATE ON lease_agreements
FOR EACH ROW
BEGIN
  SET NEW.updated_at = NOW();
END$$
DELIMITER ;

-- Trigger: Update maintenance request timestamp
DELIMITER $$
CREATE TRIGGER trg_maintenance_request_timestamp
BEFORE UPDATE ON maintenance_requests
FOR EACH ROW
BEGIN
  SET NEW.updated_at = NOW();
END$$
DELIMITER ;

-- Trigger: Update work order timestamp
DELIMITER $$
CREATE TRIGGER trg_work_order_timestamp
BEFORE UPDATE ON work_orders
FOR EACH ROW
BEGIN
  SET NEW.updated_at = NOW();
END$$
DELIMITER ;

-- Trigger: Update task comment timestamp
DELIMITER $$
CREATE TRIGGER trg_task_comment_timestamp
BEFORE UPDATE ON task_comments
FOR EACH ROW
BEGIN
  SET NEW.updated_at = NOW();
END$$
DELIMITER ;

-- Trigger: Update user notifications timestamp
DELIMITER $$
CREATE TRIGGER trg_notification_timestamp
BEFORE UPDATE ON user_notifications
FOR EACH ROW
BEGIN
  SET NEW.updated_at = NOW();
END$$
DELIMITER ;

-- Trigger: Enforce non-negative lease deposit
DELIMITER $$
CREATE TRIGGER trg_lease_deposit_check
BEFORE INSERT ON lease_agreements
FOR EACH ROW
BEGIN
  IF COALESCE(NEW.security_deposit, 0) < 0 OR COALESCE(NEW.pet_deposit, 0) < 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Deposits cannot be negative';
  END IF;
END$$
DELIMITER ;

-- Trigger: Enforce non-negative property rent
DELIMITER $$
CREATE TRIGGER trg_property_rent_check
BEFORE INSERT ON properties
FOR EACH ROW
BEGIN
  IF NEW.monthly_rent < 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Monthly rent cannot be negative';
  END IF;
END$$
DELIMITER ;

-- Trigger: Validate work order cost
DELIMITER $$
CREATE TRIGGER trg_work_order_cost_check
BEFORE INSERT ON work_orders
FOR EACH ROW
BEGIN
  IF COALESCE(NEW.estimated_cost, 0) < 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Estimated cost cannot be negative';
  END IF;
END$$
DELIMITER ;

-- Trigger: Validate task priority values
DELIMITER $$
CREATE TRIGGER trg_task_priority_check
BEFORE INSERT ON tasks
FOR EACH ROW
BEGIN
  IF NEW.priority NOT IN ('low', 'medium', 'high', 'urgent', 'emergency') THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Invalid task priority value';
  END IF;
END$$
DELIMITER ;

-- Views for common queries

-- View: Active Properties
CREATE OR REPLACE VIEW v_active_properties AS
SELECT 
  p.id,
  p.title,
  p.property_type,
  p.street,
  p.city,
  p.state,
  p.monthly_rent,
  p.bedrooms,
  p.bathrooms,
  p.rental_status,
  c.name as company_name
FROM properties p
JOIN companies c ON p.company_id = c.id
WHERE p.is_active = TRUE AND p.is_deleted = FALSE;

-- View: Occupancy Summary
CREATE OR REPLACE VIEW v_occupancy_summary AS
SELECT 
  p.id,
  p.title,
  COUNT(l.id) as total_leases,
  SUM(CASE WHEN l.status = 'active' THEN 1 ELSE 0 END) as active_leases,
  SUM(CASE WHEN l.status = 'expired' THEN 1 ELSE 0 END) as expired_leases,
  p.monthly_rent
FROM properties p
LEFT JOIN lease_agreements l ON p.id = l.property_id
GROUP BY p.id, p.title, p.monthly_rent;

-- View: Pending Tasks
CREATE OR REPLACE VIEW v_pending_tasks AS
SELECT 
  t.id,
  t.title,
  t.priority,
  t.due_date,
  t.assigned_to,
  u.first_name,
  u.last_name,
  p.title as property_title,
  c.name as company_name
FROM tasks t
LEFT JOIN users u ON t.assigned_to = u.id
LEFT JOIN properties p ON t.property_id = p.id
LEFT JOIN companies c ON t.company_id = c.id
WHERE t.status IN ('pending', 'in_progress', 'overdue')
ORDER BY t.due_date ASC;

-- View: Maintenance Issues
CREATE OR REPLACE VIEW v_maintenance_issues AS
SELECT 
  mr.id,
  mr.title,
  mr.category,
  mr.priority,
  mr.status,
  p.title as property_title,
  p.city,
  COUNT(wo.id) as work_orders
FROM maintenance_requests mr
LEFT JOIN properties p ON mr.property_id = p.id
LEFT JOIN work_orders wo ON mr.id = wo.maintenance_request_id
GROUP BY mr.id, mr.title, mr.category, mr.priority, mr.status, p.title, p.city;

-- View: User Activity Summary
CREATE OR REPLACE VIEW v_user_activity AS
SELECT 
  u.id,
  u.first_name,
  u.last_name,
  u.email,
  u.status,
  COUNT(DISTINCT ual.id) as audit_count,
  MAX(ual.timestamp) as last_activity
FROM users u
LEFT JOIN user_audit_logs ual ON u.id = ual.user_id
GROUP BY u.id, u.first_name, u.last_name, u.email, u.status;
