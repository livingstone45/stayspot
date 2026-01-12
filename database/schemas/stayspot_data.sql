-- StaySpot Database Sample Data
-- Insert sample data into all tables for development and testing

SET FOREIGN_KEY_CHECKS = 0;

-- Insert Companies
INSERT INTO companies (id, name, email, phone, website, description, industry, size, address, city, state, country, zip_code, subscription_tier, is_active, is_verified) VALUES
('comp-001', 'Urban Properties Management', 'info@urbanpm.com', '555-0101', 'urbanpm.com', 'Leading property management company', 'Real Estate', 'Large', '100 Main St', 'New York', 'NY', 'USA', '10001', 'premium', 1, 1),
('comp-002', 'Suburban Rentals LLC', 'contact@suburbanrentals.com', '555-0102', 'suburbanrentals.com', 'Suburban property specialists', 'Real Estate', 'Medium', '200 Oak Ave', 'Chicago', 'IL', 'USA', '60601', 'professional', 1, 1),
('comp-003', 'Coastal Homes Management', 'hello@coastalhomes.com', '555-0103', 'coastalhomes.com', 'Beachfront property management', 'Real Estate', 'Small', '300 Beach Rd', 'Miami', 'FL', 'USA', '33101', 'basic', 1, 1),
('comp-004', 'Downtown Development Corp', 'dev@downtown.com', '555-0104', 'downtown.com', 'Urban development company', 'Real Estate', 'Large', '400 Center St', 'Los Angeles', 'CA', 'USA', '90001', 'premium', 1, 1),
('comp-005', 'Mountain View Properties', 'mv@mountainview.com', '555-0105', 'mountainview.com', 'Mountain resort management', 'Real Estate', 'Medium', '500 Summit Dr', 'Denver', 'CO', 'USA', '80202', 'professional', 1, 1),
('comp-006', 'Desert Oasis Homes', 'info@desertoasis.com', '555-0106', 'desertoasis.com', 'Desert property specialists', 'Real Estate', 'Small', '600 Cactus Ln', 'Phoenix', 'AZ', 'USA', '85001', 'basic', 1, 1),
('comp-007', 'Forest Green Management', 'contact@forestgreen.com', '555-0107', 'forestgreen.com', 'Eco-friendly properties', 'Real Estate', 'Medium', '700 Pine Rd', 'Seattle', 'WA', 'USA', '98101', 'professional', 1, 1),
('comp-008', 'Harbor Point Properties', 'info@harborpoint.com', '555-0108', 'harborpoint.com', 'Waterfront specialists', 'Real Estate', 'Large', '800 Harbor Ave', 'Boston', 'MA', 'USA', '02101', 'premium', 1, 1),
('comp-009', 'Lakeside Living Inc', 'lakeside@living.com', '555-0109', 'lakesideliving.com', 'Lake property management', 'Real Estate', 'Small', '900 Lake Dr', 'Minneapolis', 'MN', 'USA', '55401', 'basic', 1, 1),
('comp-010', 'Valley Estates Management', 'vest@valley.com', '555-0110', 'valleyestates.com', 'Valley region properties', 'Real Estate', 'Medium', '1000 Valley Way', 'Houston', 'TX', 'USA', '77001', 'professional', 1, 1);

-- Insert Roles
INSERT INTO roles (id, company_id, name, display_name, description, is_system_role, is_active) VALUES
('role-001', 'comp-001', 'admin', 'Administrator', 'Full system access', 1, 1),
('role-002', 'comp-001', 'manager', 'Property Manager', 'Manage properties and tenants', 0, 1),
('role-003', 'comp-001', 'landlord', 'Landlord', 'Manage owned properties', 0, 1),
('role-004', 'comp-001', 'tenant', 'Tenant', 'Tenant access', 0, 1),
('role-005', 'comp-001', 'vendor', 'Vendor', 'Service provider', 0, 1),
('role-006', 'comp-002', 'admin', 'Administrator', 'Full system access', 1, 1),
('role-007', 'comp-002', 'manager', 'Property Manager', 'Manage properties and tenants', 0, 1),
('role-008', 'comp-003', 'admin', 'Administrator', 'Full system access', 1, 1),
('role-009', 'comp-004', 'admin', 'Administrator', 'Full system access', 1, 1),
('role-010', 'comp-005', 'admin', 'Administrator', 'Full system access', 1, 1);

-- Insert Permissions
INSERT INTO user_permissions (id, code, name, description, category, is_system) VALUES
('perm-001', 'property:create', 'Create Property', 'Can create new properties', 'property', 1),
('perm-002', 'property:read', 'Read Property', 'Can view properties', 'property', 1),
('perm-003', 'property:update', 'Update Property', 'Can update property details', 'property', 1),
('perm-004', 'property:delete', 'Delete Property', 'Can delete properties', 'property', 1),
('perm-005', 'user:create', 'Create User', 'Can create new users', 'user', 1),
('perm-006', 'user:read', 'Read User', 'Can view users', 'user', 1),
('perm-007', 'user:update', 'Update User', 'Can update users', 'user', 1),
('perm-008', 'user:delete', 'Delete User', 'Can delete users', 'user', 1),
('perm-009', 'task:create', 'Create Task', 'Can create tasks', 'task', 1),
('perm-010', 'task:manage', 'Manage Tasks', 'Can manage all tasks', 'task', 1);

-- Insert Users
INSERT INTO users (id, email, username, password_hash, first_name, last_name, phone, address, city, state, country, zip_code, status, email_verified, is_active) VALUES
('user-001', 'john.admin@urbanpm.com', 'johnadmin', 'hash_placeholder_001', 'John', 'Anderson', '555-1001', '100 Main St', 'New York', 'NY', 'USA', '10001', 'active', 1, 1),
('user-002', 'sarah.manager@urbanpm.com', 'sarahman', 'hash_placeholder_002', 'Sarah', 'Manager', '555-1002', '102 Main St', 'New York', 'NY', 'USA', '10001', 'active', 1, 1),
('user-003', 'michael.landlord@urbanpm.com', 'michaelll', 'hash_placeholder_003', 'Michael', 'Landlord', '555-1003', '104 Main St', 'New York', 'NY', 'USA', '10001', 'active', 1, 1),
('user-004', 'emily.tenant@urbanpm.com', 'emilyten', 'hash_placeholder_004', 'Emily', 'Tenant', '555-1004', '106 Main St', 'New York', 'NY', 'USA', '10001', 'active', 1, 1),
('user-005', 'david.vendor@urbanpm.com', 'davidven', 'hash_placeholder_005', 'David', 'Vendor', '555-1005', '108 Main St', 'New York', 'NY', 'USA', '10001', 'active', 1, 1),
('user-006', 'jessica.admin@suburbanrentals.com', 'jessicaadm', 'hash_placeholder_006', 'Jessica', 'Admin', '555-1006', '200 Oak Ave', 'Chicago', 'IL', 'USA', '60601', 'active', 1, 1),
('user-007', 'robert.manager@suburbanrentals.com', 'robertman', 'hash_placeholder_007', 'Robert', 'Manager', '555-1007', '202 Oak Ave', 'Chicago', 'IL', 'USA', '60601', 'active', 1, 1),
('user-008', 'amanda.landlord@suburbanrentals.com', 'amandall', 'hash_placeholder_008', 'Amanda', 'Landlord', '555-1008', '204 Oak Ave', 'Chicago', 'IL', 'USA', '60601', 'active', 1, 1),
('user-009', 'mark.tenant@suburbanrentals.com', 'markten', 'hash_placeholder_009', 'Mark', 'Tenant', '555-1009', '206 Oak Ave', 'Chicago', 'IL', 'USA', '60601', 'active', 1, 1),
('user-010', 'lisa.maintenance@suburbanrentals.com', 'lisamain', 'hash_placeholder_010', 'Lisa', 'Maintenance', '555-1010', '208 Oak Ave', 'Chicago', 'IL', 'USA', '60601', 'active', 1, 1),
('user-011', 'james.admin@coastalhomes.com', 'jamesadm', 'hash_placeholder_011', 'James', 'Admin', '555-1011', '300 Beach Rd', 'Miami', 'FL', 'USA', '33101', 'active', 1, 1),
('user-012', 'nicole.manager@coastalhomes.com', 'nicoleman', 'hash_placeholder_012', 'Nicole', 'Manager', '555-1012', '302 Beach Rd', 'Miami', 'FL', 'USA', '33101', 'active', 1, 1),
('user-013', 'christopher.landlord@downtown.com', 'christll', 'hash_placeholder_013', 'Christopher', 'Landlord', '555-1013', '400 Center St', 'Los Angeles', 'CA', 'USA', '90001', 'active', 1, 1),
('user-014', 'sophia.tenant@downtown.com', 'sophiaten', 'hash_placeholder_014', 'Sophia', 'Tenant', '555-1014', '402 Center St', 'Los Angeles', 'CA', 'USA', '90001', 'active', 1, 1),
('user-015', 'daniel.vendor@downtown.com', 'danielven', 'hash_placeholder_015', 'Daniel', 'Vendor', '555-1015', '404 Center St', 'Los Angeles', 'CA', 'USA', '90001', 'active', 1, 1),
('user-016', 'katherine.admin@mountainview.com', 'katherineadm', 'hash_placeholder_016', 'Katherine', 'Admin', '555-1016', '500 Summit Dr', 'Denver', 'CO', 'USA', '80202', 'active', 1, 1),
('user-017', 'andrew.manager@mountainview.com', 'andrewman', 'hash_placeholder_017', 'Andrew', 'Manager', '555-1017', '502 Summit Dr', 'Denver', 'CO', 'USA', '80202', 'active', 1, 1),
('user-018', 'rachel.landlord@desertoasis.com', 'rachelll', 'hash_placeholder_018', 'Rachel', 'Landlord', '555-1018', '600 Cactus Ln', 'Phoenix', 'AZ', 'USA', '85001', 'active', 1, 1),
('user-019', 'thomas.tenant@forestgreen.com', 'thomasten', 'hash_placeholder_019', 'Thomas', 'Tenant', '555-1019', '700 Pine Rd', 'Seattle', 'WA', 'USA', '98101', 'active', 1, 1),
('user-020', 'barbara.vendor@harborpoint.com', 'barbaraven', 'hash_placeholder_020', 'Barbara', 'Vendor', '555-1020', '800 Harbor Ave', 'Boston', 'MA', 'USA', '02101', 'active', 1, 1);

-- Insert Portfolios
INSERT INTO portfolios (id, company_id, name, description, owner_id, total_properties, total_units) VALUES
('port-001', 'comp-001', 'Manhattan Portfolio', 'Premium Manhattan properties', 'user-001', 15, 48),
('port-002', 'comp-001', 'Brooklyn Division', 'Brooklyn residential units', 'user-002', 20, 65),
('port-003', 'comp-002', 'Suburban Midwest', 'Midwest suburban properties', 'user-006', 12, 35),
('port-004', 'comp-003', 'Coastal Premium', 'Beachfront luxury properties', 'user-011', 8, 20),
('port-005', 'comp-004', 'Downtown LA', 'Downtown Los Angeles properties', 'user-013', 25, 85);

-- Insert Properties
INSERT INTO properties (id, company_id, portfolio_id, title, property_type, status, rental_status, street, city, state, country, zip_code, total_area, bedrooms, bathrooms, monthly_rent, owner_id) VALUES
('prop-001', 'comp-001', 'port-001', 'Luxury Upper West Side Apartment', 'apartment', 'active', 'occupied', '100 Central Park West', 'New York', 'NY', 'USA', '10023', 2500, 4, 3, 5000, 'user-003'),
('prop-002', 'comp-001', 'port-001', 'Modern Midtown Studio', 'studio', 'active', 'available', '500 5th Avenue', 'New York', 'NY', 'USA', '10110', 600, 1, 1, 2000, 'user-003'),
('prop-003', 'comp-001', 'port-001', 'Chelsea Loft', 'apartment', 'active', 'occupied', '200 10th Avenue', 'New York', 'NY', 'USA', '10011', 1800, 3, 2, 4500, 'user-003'),
('prop-004', 'comp-001', 'port-002', 'Brooklyn Brownstone', 'townhouse', 'active', 'occupied', '300 Henry Street', 'New York', 'NY', 'USA', '11201', 3000, 5, 3, 6000, 'user-002'),
('prop-005', 'comp-001', 'port-002', 'Park Slope Condo', 'condo', 'active', 'available', '400 7th Avenue', 'New York', 'NY', 'USA', '11215', 1500, 2, 2, 3500, 'user-002'),
('prop-006', 'comp-002', 'port-003', 'Suburban Family Home', 'house', 'active', 'occupied', '100 Oak Drive', 'Chicago', 'IL', 'USA', '60301', 3500, 4, 2.5, 3500, 'user-008'),
('prop-007', 'comp-002', 'port-003', 'Executive Townhome', 'townhouse', 'active', 'available', '200 Elm Street', 'Chicago', 'IL', 'USA', '60302', 2800, 3, 2, 3200, 'user-008'),
('prop-008', 'comp-002', 'port-003', 'Cozy Apartment', 'apartment', 'active', 'occupied', '300 Maple Avenue', 'Chicago', 'IL', 'USA', '60303', 1200, 2, 1, 2000, 'user-007'),
('prop-009', 'comp-003', 'port-004', 'Beachfront Penthouse', 'villa', 'active', 'occupied', '1000 Ocean Drive', 'Miami', 'FL', 'USA', '33139', 4500, 5, 4, 8000, 'user-018'),
('prop-010', 'comp-003', 'port-004', 'Oceanview Resort Condo', 'condo', 'active', 'available', '1100 Collins Avenue', 'Miami', 'FL', 'USA', '33140', 2200, 3, 2, 5000, 'user-012'),
('prop-011', 'comp-004', 'port-005', 'Downtown Office Loft', 'office', 'active', 'occupied', '500 South Flower', 'Los Angeles', 'CA', 'USA', '90071', 2000, 0, 1, 4500, 'user-013'),
('prop-012', 'comp-004', 'port-005', 'Arts District Apartment', 'apartment', 'active', 'available', '1200 E 4th Street', 'Los Angeles', 'CA', 'USA', '90013', 1600, 2, 2, 3200, 'user-013'),
('prop-013', 'comp-004', 'port-005', 'Silver Lake House', 'house', 'active', 'occupied', '1600 Sunset Boulevard', 'Los Angeles', 'CA', 'USA', '90027', 2500, 3, 2, 4000, 'user-013'),
('prop-014', 'comp-005', 'port-005', 'Mountain Lodge', 'house', 'maintenance', 'maintenance', '2000 Summit Trail', 'Denver', 'CO', 'USA', '80219', 4000, 6, 4, 6000, 'user-016'),
('prop-015', 'comp-005', 'port-005', 'Ski Resort Cabin', 'villa', 'active', 'available', '2200 Powder Peak', 'Denver', 'CO', 'USA', '80220', 3200, 4, 3, 5500, 'user-016'),
('prop-016', 'comp-003', 'port-004', 'Beach Cottage', 'house', 'active', 'occupied', '1300 Beach Street', 'Miami', 'FL', 'USA', '33141', 2000, 3, 2, 4500, 'user-012'),
('prop-017', 'comp-002', 'port-003', 'Garden Apartment', 'apartment', 'active', 'available', '400 Birch Lane', 'Chicago', 'IL', 'USA', '60304', 1400, 2, 1.5, 2200, 'user-007'),
('prop-018', 'comp-001', 'port-001', 'Upper East Side Penthouse', 'apartment', 'active', 'available', '700 Park Avenue', 'New York', 'NY', 'USA', '10065', 3500, 5, 4, 10000, 'user-003'),
('prop-019', 'comp-004', 'port-005', 'West Hollywood Villa', 'villa', 'active', 'occupied', '1800 Laurel Canyon', 'Los Angeles', 'CA', 'USA', '90046', 3800, 4, 3.5, 7500, 'user-013'),
('prop-020', 'comp-005', 'port-005', 'Boulder Creek Estate', 'house', 'active', 'available', '2300 Creek Road', 'Denver', 'CO', 'USA', '80302', 4500, 5, 4, 7000, 'user-016');

-- Insert Property Utilities
INSERT INTO property_utilities (id, property_id, utility_type, provider_name, payment_status) VALUES
('util-001', 'prop-001', 'electricity', 'City Electric Co', 'tenant_paid'),
('util-002', 'prop-001', 'water', 'Municipal Water', 'included'),
('util-003', 'prop-002', 'electricity', 'City Electric Co', 'tenant_paid'),
('util-004', 'prop-003', 'gas', 'Natural Gas Co', 'tenant_paid'),
('util-005', 'prop-004', 'electricity', 'State Power', 'tenant_paid'),
('util-006', 'prop-005', 'water', 'Municipal Water', 'included');

-- Insert Lease Agreements
INSERT INTO lease_agreements (id, property_id, tenant_id, start_date, end_date, monthly_rent, security_deposit, status, signed_by_tenant, signed_by_landlord) VALUES
('lease-001', 'prop-001', 'user-004', '2023-01-01', '2024-12-31', 5000, 10000, 'active', 1, 1),
('lease-002', 'prop-003', 'user-009', '2023-06-01', '2025-05-31', 4500, 9000, 'active', 1, 1),
('lease-003', 'prop-004', 'user-014', '2023-03-15', '2025-03-14', 6000, 12000, 'active', 1, 1),
('lease-004', 'prop-008', 'user-019', '2023-09-01', '2024-08-31', 2000, 4000, 'active', 1, 1),
('lease-005', 'prop-009', 'user-004', '2023-02-01', '2026-01-31', 8000, 16000, 'active', 1, 1),
('lease-006', 'prop-013', 'user-009', '2023-07-15', '2025-07-14', 4000, 8000, 'active', 1, 1),
('lease-007', 'prop-016', 'user-014', '2023-08-01', '2025-07-31', 4500, 9000, 'active', 1, 1),
('lease-008', 'prop-019', 'user-004', '2023-10-01', '2026-09-30', 7500, 15000, 'active', 1, 1);

-- Insert Property Maintenance
INSERT INTO property_maintenance (id, property_id, roof_condition, foundation_condition, plumbing_condition, electrical_condition, last_inspection_date) VALUES
('maint-001', 'prop-001', 'excellent', 'excellent', 'good', 'excellent', '2023-12-15'),
('maint-002', 'prop-003', 'good', 'good', 'good', 'good', '2023-11-20'),
('maint-003', 'prop-004', 'good', 'excellent', 'good', 'good', '2023-10-10'),
('maint-004', 'prop-006', 'fair', 'good', 'good', 'fair', '2023-09-05'),
('maint-005', 'prop-009', 'excellent', 'excellent', 'excellent', 'excellent', '2023-12-01'),
('maint-006', 'prop-013', 'good', 'good', 'good', 'good', '2023-11-15');

-- Insert Tasks
INSERT INTO tasks (id, company_id, property_id, title, task_type, status, priority, assigned_to, created_by, due_date) VALUES
('task-001', 'comp-001', 'prop-001', 'Roof inspection', 'maintenance', 'pending', 'high', 'user-005', 'user-001', '2024-02-15'),
('task-002', 'comp-001', 'prop-002', 'Paint apartment', 'maintenance', 'in_progress', 'medium', 'user-005', 'user-002', '2024-02-20'),
('task-003', 'comp-001', 'prop-003', 'Fix plumbing', 'maintenance', 'completed', 'urgent', 'user-005', 'user-001', '2024-02-10'),
('task-004', 'comp-002', 'prop-006', 'Landscape lawn', 'maintenance', 'pending', 'low', 'user-010', 'user-006', '2024-03-01'),
('task-005', 'comp-002', 'prop-007', 'HVAC maintenance', 'maintenance', 'in_progress', 'medium', 'user-010', 'user-007', '2024-02-18'),
('task-006', 'comp-003', 'prop-009', 'Deep cleaning', 'maintenance', 'pending', 'medium', 'user-020', 'user-011', '2024-02-25'),
('task-007', 'comp-003', 'prop-010', 'Pool maintenance', 'maintenance', 'completed', 'high', 'user-020', 'user-012', '2024-02-12'),
('task-008', 'comp-004', 'prop-011', 'Replace carpet', 'maintenance', 'pending', 'medium', 'user-015', 'user-013', '2024-02-22'),
('task-009', 'comp-004', 'prop-013', 'Update electrical', 'maintenance', 'in_progress', 'high', 'user-015', 'user-013', '2024-02-28'),
('task-010', 'comp-001', 'prop-005', 'Tenant screening', 'administrative', 'pending', 'medium', 'user-002', 'user-001', '2024-02-17'),
('task-011', 'comp-002', 'prop-008', 'Rent collection', 'financial', 'completed', 'high', 'user-006', 'user-007', '2024-02-05'),
('task-012', 'comp-003', 'prop-010', 'Insurance renewal', 'administrative', 'pending', 'high', 'user-011', 'user-012', '2024-02-20'),
('task-013', 'comp-004', 'prop-012', 'Market analysis', 'administrative', 'in_progress', 'medium', 'user-013', 'user-013', '2024-03-05'),
('task-014', 'comp-001', 'prop-018', 'Spring maintenance check', 'maintenance', 'pending', 'medium', 'user-005', 'user-002', '2024-03-15'),
('task-015', 'comp-005', 'prop-014', 'Inspection preparation', 'inspection', 'pending', 'high', 'user-017', 'user-016', '2024-02-26'),
('task-016', 'comp-001', 'prop-001', 'Annual audit', 'administrative', 'pending', 'medium', 'user-001', 'user-001', '2024-03-10'),
('task-017', 'comp-002', 'prop-006', 'Property appraisal', 'inspection', 'pending', 'high', 'user-007', 'user-006', '2024-02-28'),
('task-018', 'comp-003', 'prop-009', 'Guest satisfaction survey', 'administrative', 'completed', 'low', 'user-011', 'user-012', '2024-02-08'),
('task-019', 'comp-004', 'prop-013', 'Marketing photoshoot', 'marketing', 'pending', 'medium', 'user-013', 'user-013', '2024-03-20'),
('task-020', 'comp-005', 'prop-015', 'Availability update', 'administrative', 'pending', 'low', 'user-016', 'user-016', '2024-03-01');

-- Insert Maintenance Requests
INSERT INTO maintenance_requests (id, property_id, requester_id, title, description, category, request_type, priority, status) VALUES
('mreq-001', 'prop-001', 'user-004', 'Broken window', 'Large crack in living room window', 'general', 'repair', 'high', 'pending'),
('mreq-002', 'prop-002', 'user-004', 'Water leak', 'Bathroom ceiling leak', 'plumbing', 'repair', 'urgent', 'in_progress'),
('mreq-003', 'prop-003', 'user-009', 'AC not working', 'Air conditioning needs repair', 'hvac', 'repair', 'high', 'pending'),
('mreq-004', 'prop-006', 'user-009', 'Stove broken', 'Kitchen stove not heating', 'appliances', 'replacement', 'medium', 'pending'),
('mreq-005', 'prop-008', 'user-019', 'Door lock issue', 'Front door lock stuck', 'general', 'repair', 'medium', 'pending'),
('mreq-006', 'prop-010', 'user-004', 'Pool filter clean', 'Pool maintenance needed', 'maintenance', 'preventive', 'low', 'pending'),
('mreq-007', 'prop-012', 'user-014', 'Wall crack', 'Visible crack on bedroom wall', 'general', 'inspection', 'medium', 'pending'),
('mreq-008', 'prop-013', 'user-009', 'Bathroom tile', 'Cracked bathroom floor tiles', 'general', 'replacement', 'low', 'pending');

-- Insert Work Orders
INSERT INTO work_orders (id, property_id, maintenance_request_id, vendor_id, title, category, priority, status, estimated_cost) VALUES
('wo-001', 'prop-001', 'mreq-001', 'user-005', 'Window Replacement', 'general', 'high', 'assigned', 500),
('wo-002', 'prop-002', 'mreq-002', 'user-010', 'Plumbing Repair', 'plumbing', 'urgent', 'in_progress', 300),
('wo-003', 'prop-003', 'mreq-003', 'user-015', 'AC Repair', 'hvac', 'high', 'assigned', 400),
('wo-004', 'prop-006', 'mreq-004', 'user-020', 'Stove Replacement', 'appliances', 'medium', 'pending', 800),
('wo-005', 'prop-010', 'mreq-006', 'user-020', 'Pool Maintenance', 'maintenance', 'low', 'assigned', 150),
('wo-006', 'prop-013', 'mreq-008', 'user-015', 'Tile Replacement', 'general', 'low', 'pending', 600);

SET FOREIGN_KEY_CHECKS = 1;
