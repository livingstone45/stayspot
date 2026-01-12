-- ============================================
-- StaySpot Database Schema
-- Version: 1.0
-- Created: 2024
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS stayspot_db;
USE stayspot_db;

-- ============================================
-- 1. CORE TABLES (Authentication & Users)
-- ============================================

-- Roles hierarchy table
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    level INT NOT NULL DEFAULT 1,
    description TEXT,
    parent_role_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_role_id) REFERENCES roles(id) ON DELETE SET NULL,
    INDEX idx_role_level (level),
    INDEX idx_parent_role (parent_role_id)
);

-- Permissions table
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_module_action (module, action),
    INDEX idx_module (module)
);

-- Role-Permission mapping
CREATE TABLE role_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    can_create BOOLEAN DEFAULT FALSE,
    can_read BOOLEAN DEFAULT FALSE,
    can_update BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role_id, permission_id),
    INDEX idx_role_id (role_id),
    INDEX idx_permission_id (permission_id)
);

-- Users table (for all user types)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    profile_image_url VARCHAR(500),
    timezone VARCHAR(50) DEFAULT 'UTC',
    locale VARCHAR(10) DEFAULT 'en_US',
    is_active BOOLEAN DEFAULT TRUE,
    is_locked BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP NULL,
    last_password_change TIMESTAMP NULL,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
);

-- User roles mapping (users can have multiple roles)
CREATE TABLE user_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_by INT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_role (user_id, role_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id),
    INDEX idx_expires_at (expires_at)
);

-- User permissions override (for specific user permissions)
CREATE TABLE user_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    permission_id INT NOT NULL,
    can_create BOOLEAN DEFAULT FALSE,
    can_read BOOLEAN DEFAULT FALSE,
    can_update BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_permission (user_id, permission_id),
    INDEX idx_user_id (user_id),
    INDEX idx_permission_id (permission_id)
);

-- ============================================
-- 2. COMPANY & ORGANIZATION STRUCTURE
-- ============================================

-- Companies table
CREATE TABLE companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    tax_id VARCHAR(50),
    company_type ENUM('property_management', 'real_estate', 'corporate', 'individual', 'other') DEFAULT 'property_management',
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'USA',
    postal_code VARCHAR(20),
    timezone VARCHAR(50) DEFAULT 'UTC',
    currency VARCHAR(3) DEFAULT 'USD',
    subscription_plan ENUM('free', 'basic', 'professional', 'enterprise') DEFAULT 'free',
    subscription_status ENUM('active', 'pending', 'suspended', 'cancelled') DEFAULT 'pending',
    subscription_expires_at TIMESTAMP NULL,
    max_users INT DEFAULT 5,
    max_properties INT DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_company_type (company_type),
    INDEX idx_subscription_status (subscription_status),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
);

-- Company users (employees/members)
CREATE TABLE company_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    user_id INT NOT NULL,
    job_title VARCHAR(100),
    department VARCHAR(100),
    employee_id VARCHAR(50),
    hire_date DATE,
    is_primary_contact BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    permissions JSON, -- Custom permissions for this user in this company
    invitation_token VARCHAR(100),
    invitation_sent_at TIMESTAMP NULL,
    invitation_accepted_at TIMESTAMP NULL,
    invitation_expires_at TIMESTAMP NULL,
    status ENUM('pending', 'active', 'suspended', 'inactive') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_company_user (company_id, user_id),
    INDEX idx_company_id (company_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_invitation_token (invitation_token)
);

-- Portfolios (group of properties)
CREATE TABLE portfolios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    company_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    portfolio_type ENUM('residential', 'commercial', 'mixed', 'vacation', 'corporate') DEFAULT 'residential',
    manager_id INT NULL,
    total_units INT DEFAULT 0,
    total_value DECIMAL(15,2) DEFAULT 0.00,
    target_return DECIMAL(5,2) DEFAULT 0.00,
    location_city VARCHAR(100),
    location_state VARCHAR(100),
    location_country VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_company_id (company_id),
    INDEX idx_portfolio_type (portfolio_type),
    INDEX idx_is_active (is_active),
    INDEX idx_manager_id (manager_id)
);

-- ============================================
-- 3. PROPERTIES & UNITS MANAGEMENT
-- ============================================

-- Properties table (buildings/complexes)
CREATE TABLE properties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    portfolio_id INT NULL,
    owner_id INT NULL, -- Landlord user
    assigned_manager_id INT NULL, -- Property manager
    name VARCHAR(255) NOT NULL,
    property_type ENUM('single_family', 'multi_family', 'apartment', 'condo', 'townhouse', 'commercial', 'vacation', 'corporate_housing') DEFAULT 'apartment',
    property_subtype VARCHAR(100),
    
    -- Location with geospatial data
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'USA',
    postal_code VARCHAR(20) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    geo_hash VARCHAR(12),
    neighborhood VARCHAR(100),
    county VARCHAR(100),
    
    -- Property details
    year_built YEAR,
    total_units INT DEFAULT 1,
    total_area_sqft DECIMAL(10,2),
    lot_size_sqft DECIMAL(10,2),
    stories INT DEFAULT 1,
    parking_spaces INT DEFAULT 0,
    amenities JSON, -- Pool, gym, etc.
    
    -- Status & dates
    status ENUM('active', 'under_construction', 'renovation', 'inactive', 'sold') DEFAULT 'active',
    acquisition_date DATE,
    acquisition_price DECIMAL(15,2),
    current_value DECIMAL(15,2),
    
    -- Financial
    property_tax DECIMAL(10,2) DEFAULT 0.00,
    insurance_cost DECIMAL(10,2) DEFAULT 0.00,
    hoa_fees DECIMAL(10,2) DEFAULT 0.00,
    management_fee_percent DECIMAL(5,2) DEFAULT 0.00,
    
    -- Automation & settings
    auto_upload_to_website BOOLEAN DEFAULT TRUE,
    auto_syndicate BOOLEAN DEFAULT FALSE,
    show_on_website BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_by INT NOT NULL,
    updated_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE SET NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_manager_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_portfolio_id (portfolio_id),
    INDEX idx_owner_id (owner_id),
    INDEX idx_assigned_manager_id (assigned_manager_id),
    INDEX idx_property_type (property_type),
    INDEX idx_status (status),
    INDEX idx_city_state (city, state),
    INDEX idx_geo_hash (geo_hash),
    INDEX idx_latitude (latitude),
    INDEX idx_longitude (longitude),
    INDEX idx_created_at (created_at)
);

-- Units within properties (apartments/offices)
CREATE TABLE units (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    property_id INT NOT NULL,
    unit_number VARCHAR(20) NOT NULL,
    unit_name VARCHAR(100),
    unit_type ENUM('studio', '1bed', '2bed', '3bed', '4bed', 'office', 'retail', 'warehouse', 'other') DEFAULT '1bed',
    
    -- Unit details
    bedrooms INT DEFAULT 1,
    bathrooms DECIMAL(3,1) DEFAULT 1.0,
    area_sqft DECIMAL(10,2),
    floor_number INT DEFAULT 1,
    floor_plan_url VARCHAR(500),
    
    -- Features
    features JSON, -- balcony, fireplace, etc.
    appliances JSON, -- included appliances
    parking_spot VARCHAR(50),
    storage_unit VARCHAR(50),
    
    -- Status
    status ENUM('vacant', 'occupied', 'under_maintenance', 'renovation', 'reserved') DEFAULT 'vacant',
    availability_date DATE,
    show_unit BOOLEAN DEFAULT TRUE,
    
    -- Rent details
    market_rent DECIMAL(10,2) DEFAULT 0.00,
    current_rent DECIMAL(10,2) DEFAULT 0.00,
    deposit_amount DECIMAL(10,2) DEFAULT 0.00,
    deposit_held DECIMAL(10,2) DEFAULT 0.00,
    utilities_included JSON, -- which utilities are included
    
    -- Furnishing
    is_furnished BOOLEAN DEFAULT FALSE,
    furniture_list JSON,
    condition_rating INT DEFAULT 5, -- 1-10 scale
    
    -- Short-term rental specific
    is_short_term_rental BOOLEAN DEFAULT FALSE,
    min_stay_nights INT DEFAULT 1,
    max_stay_nights INT DEFAULT 30,
    cleaning_fee DECIMAL(8,2) DEFAULT 0.00,
    service_fee_percent DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    UNIQUE KEY unique_property_unit (property_id, unit_number),
    
    INDEX idx_property_id (property_id),
    INDEX idx_status (status),
    INDEX idx_unit_type (unit_type),
    INDEX idx_is_short_term_rental (is_short_term_rental),
    INDEX idx_availability_date (availability_date)
);

-- Property images
CREATE TABLE property_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    property_id INT NOT NULL,
    unit_id INT NULL,
    image_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    image_type ENUM('exterior', 'interior', 'floor_plan', 'amenity', 'document', 'other') DEFAULT 'interior',
    category VARCHAR(50), -- living_room, kitchen, bathroom, etc.
    caption VARCHAR(255),
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    width INT,
    height INT,
    file_size INT,
    mime_type VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    uploaded_by INT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    
    INDEX idx_property_id (property_id),
    INDEX idx_unit_id (unit_id),
    INDEX idx_image_type (image_type),
    INDEX idx_display_order (display_order),
    INDEX idx_is_primary (is_primary)
);

-- Property documents
CREATE TABLE property_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    property_id INT NOT NULL,
    unit_id INT NULL,
    document_type ENUM('deed', 'survey', 'inspection', 'permit', 'certificate', 'insurance', 'tax', 'other') DEFAULT 'other',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255),
    file_size INT,
    mime_type VARCHAR(50),
    version VARCHAR(20) DEFAULT '1.0',
    expiry_date DATE,
    is_required BOOLEAN DEFAULT FALSE,
    uploaded_by INT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    
    INDEX idx_property_id (property_id),
    INDEX idx_document_type (document_type),
    INDEX idx_expiry_date (expiry_date)
);

-- ============================================
-- 4. TENANTS & LEASES MANAGEMENT
-- ============================================

-- Tenants table
CREATE TABLE tenants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    user_id INT NULL, -- Link to user account if exists
    company_id INT NULL, -- For corporate tenants
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    date_of_birth DATE,
    ssn_last_four VARCHAR(4),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    profile_image_url VARCHAR(500),
    occupation VARCHAR(100),
    employer VARCHAR(255),
    employer_phone VARCHAR(20),
    annual_income DECIMAL(12,2),
    credit_score INT,
    background_check_status ENUM('pending', 'approved', 'rejected', 'not_required') DEFAULT 'pending',
    background_check_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    preferences JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
    
    INDEX idx_user_id (user_id),
    INDEX idx_email (email),
    INDEX idx_is_active (is_active),
    INDEX idx_background_check_status (background_check_status)
);

-- Tenant addresses (historical)
CREATE TABLE tenant_addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    address_type ENUM('current', 'previous', 'permanent') DEFAULT 'current',
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    start_date DATE,
    end_date DATE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_address_type (address_type)
);

-- Lease agreements
CREATE TABLE leases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    unit_id INT NOT NULL,
    tenant_id INT NOT NULL,
    lease_number VARCHAR(50) NOT NULL UNIQUE,
    lease_type ENUM('residential', 'commercial', 'month_to_month', 'fixed_term', 'corporate') DEFAULT 'fixed_term',
    
    -- Term details
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    original_end_date DATE,
    is_auto_renew BOOLEAN DEFAULT FALSE,
    renewal_term_months INT DEFAULT 12,
    notice_days INT DEFAULT 30,
    
    -- Financial terms
    monthly_rent DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2) DEFAULT 0.00,
    pet_deposit DECIMAL(10,2) DEFAULT 0.00,
    other_deposit DECIMAL(10,2) DEFAULT 0.00,
    rent_due_day INT DEFAULT 1,
    late_fee_percent DECIMAL(5,2) DEFAULT 5.00,
    late_fee_flat DECIMAL(8,2) DEFAULT 50.00,
    grace_period_days INT DEFAULT 5,
    
    -- Utilities
    utilities_included JSON,
    
    -- Occupants
    occupants_count INT DEFAULT 1,
    occupants_details JSON,
    
    -- Pets
    pets_allowed BOOLEAN DEFAULT FALSE,
    pet_details JSON,
    
    -- Vehicles
    vehicles_allowed INT DEFAULT 1,
    vehicle_details JSON,
    
    -- Status
    status ENUM('draft', 'pending', 'active', 'expired', 'terminated', 'renewed', 'breached') DEFAULT 'draft',
    termination_date DATE,
    termination_reason TEXT,
    
    -- Signatures
    signed_by_tenant BOOLEAN DEFAULT FALSE,
    signed_by_landlord BOOLEAN DEFAULT FALSE,
    tenant_signature_date DATE,
    landlord_signature_date DATE,
    document_url VARCHAR(500),
    
    -- Management
    created_by INT NOT NULL,
    approved_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_unit_id (unit_id),
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_lease_number (lease_number),
    INDEX idx_status (status),
    INDEX idx_start_end_date (start_date, end_date),
    INDEX idx_created_by (created_by)
);

-- Lease terms history (for rent increases/changes)
CREATE TABLE lease_terms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lease_id INT NOT NULL,
    effective_date DATE NOT NULL,
    monthly_rent DECIMAL(10,2) NOT NULL,
    term_end_date DATE,
    change_reason VARCHAR(255),
    changed_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (lease_id) REFERENCES leases(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id),
    
    INDEX idx_lease_id (lease_id),
    INDEX idx_effective_date (effective_date)
);

-- ============================================
-- 5. MAINTENANCE & WORK ORDERS
-- ============================================

-- Maintenance requests
CREATE TABLE maintenance_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    unit_id INT NOT NULL,
    tenant_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('plumbing', 'electrical', 'heating', 'appliance', 'structural', 'pest', 'cleaning', 'other') DEFAULT 'other',
    subcategory VARCHAR(100),
    priority ENUM('emergency', 'urgent', 'routine', 'preventive') DEFAULT 'routine',
    
    -- Location details
    specific_location VARCHAR(255),
    
    -- Status tracking
    status ENUM('submitted', 'assigned', 'in_progress', 'completed', 'cancelled', 'on_hold') DEFAULT 'submitted',
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    desired_date DATE,
    preferred_time VARCHAR(50),
    
    -- Access information
    access_instructions TEXT,
    tenant_present_required BOOLEAN DEFAULT FALSE,
    
    -- Media
    image_urls JSON,
    
    -- Tenant satisfaction
    tenant_rating INT, -- 1-5
    tenant_feedback TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    
    INDEX idx_unit_id (unit_id),
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_category (category),
    INDEX idx_priority (priority),
    INDEX idx_status (status),
    INDEX idx_submission_date (submission_date)
);

-- Vendors/Contractors
CREATE TABLE vendors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    company_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    service_categories JSON NOT NULL,
    license_number VARCHAR(100),
    insurance_expiry DATE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_jobs INT DEFAULT 0,
    average_response_hours INT,
    hourly_rate DECIMAL(8,2),
    minimum_charge DECIMAL(8,2),
    service_areas JSON,
    is_certified BOOLEAN DEFAULT FALSE,
    is_preferred BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    
    INDEX idx_company_id (company_id),
    INDEX idx_rating (rating),
    INDEX idx_is_preferred (is_preferred),
    INDEX idx_is_active (is_active),
    INDEX idx_is_certified (is_certified)
);

-- Work orders
CREATE TABLE work_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    maintenance_request_id INT NULL,
    property_id INT NOT NULL,
    unit_id INT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('repair', 'maintenance', 'inspection', 'installation', 'renovation') DEFAULT 'repair',
    priority ENUM('emergency', 'high', 'medium', 'low') DEFAULT 'medium',
    status ENUM('pending', 'assigned', 'scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    
    -- Assignment
    assigned_to_vendor_id INT NULL,
    assigned_to_user_id INT NULL, -- internal staff
    assigned_by INT NULL,
    assigned_at TIMESTAMP NULL,
    
    -- Scheduling
    scheduled_date DATE,
    scheduled_start_time TIME,
    scheduled_end_time TIME,
    estimated_hours DECIMAL(5,2),
    actual_start_time TIMESTAMP NULL,
    actual_end_time TIMESTAMP NULL,
    actual_hours DECIMAL(5,2),
    
    -- Cost tracking
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    cost_breakdown JSON,
    approved_by INT NULL,
    approval_date DATE,
    
    -- Completion
    completed_by INT NULL,
    completed_at TIMESTAMP NULL,
    completion_notes TEXT,
    quality_rating INT, -- 1-5
    before_images JSON,
    after_images JSON,
    
    -- Follow-up
    warranty_months INT DEFAULT 0,
    follow_up_date DATE,
    
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (maintenance_request_id) REFERENCES maintenance_requests(id) ON DELETE SET NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to_vendor_id) REFERENCES vendors(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (completed_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id),
    
    INDEX idx_property_id (property_id),
    INDEX idx_unit_id (unit_id),
    INDEX idx_assigned_to_vendor (assigned_to_vendor_id),
    INDEX idx_assigned_to_user (assigned_to_user_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_scheduled_date (scheduled_date),
    INDEX idx_created_by (created_by)
);

-- ============================================
-- 6. TASKS & ASSIGNMENTS MANAGEMENT
-- ============================================

-- Task templates
CREATE TABLE task_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    company_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('inspection', 'maintenance', 'administrative', 'marketing', 'financial', 'tenant', 'other') DEFAULT 'administrative',
    subcategory VARCHAR(100),
    estimated_duration_minutes INT,
    skill_required VARCHAR(100),
    instructions TEXT,
    checklist JSON,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern JSON, -- cron expression or frequency
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    
    INDEX idx_company_id (company_id),
    INDEX idx_category (category),
    INDEX idx_is_recurring (is_recurring)
);

-- Tasks
CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    template_id INT NULL,
    company_id INT NOT NULL,
    portfolio_id INT NULL,
    property_id INT NULL,
    unit_id INT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type ENUM('manual', 'auto_generated', 'recurring') DEFAULT 'manual',
    category VARCHAR(100),
    priority ENUM('critical', 'high', 'medium', 'low') DEFAULT 'medium',
    status ENUM('pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'overdue') DEFAULT 'pending',
    
    -- Assignment
    assigned_to_user_id INT NULL,
    assigned_to_role_id INT NULL,
    assigned_by INT NULL,
    assigned_at TIMESTAMP NULL,
    
    -- Scheduling
    due_date DATE,
    due_time TIME,
    start_date DATE,
    start_time TIME,
    estimated_duration_minutes INT,
    actual_duration_minutes INT,
    actual_start_time TIMESTAMP NULL,
    actual_end_time TIMESTAMP NULL,
    
    -- Requirements
    required_skills JSON,
    required_tools JSON,
    
    -- Dependencies
    depends_on_task_id INT NULL,
    
    -- Completion
    completed_by INT NULL,
    completed_at TIMESTAMP NULL,
    completion_notes TEXT,
    completion_rating INT, -- 1-5
    attachments JSON,
    
    -- Recurrence
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_id INT NULL,
    next_recurrence_date DATE,
    
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (template_id) REFERENCES task_templates(id) ON DELETE SET NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE SET NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to_role_id) REFERENCES roles(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (depends_on_task_id) REFERENCES tasks(id) ON DELETE SET NULL,
    FOREIGN KEY (completed_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id),
    
    INDEX idx_company_id (company_id),
    INDEX idx_property_id (property_id),
    INDEX idx_assigned_to_user (assigned_to_user_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_due_date (due_date),
    INDEX idx_category (category),
    INDEX idx_is_recurring (is_recurring)
);

-- Task assignments history
CREATE TABLE task_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    assigned_to_user_id INT NOT NULL,
    assigned_by INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unassigned_at TIMESTAMP NULL,
    unassigned_by INT NULL,
    unassigned_reason TEXT,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id),
    FOREIGN KEY (unassigned_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_task_id (task_id),
    INDEX idx_assigned_to_user (assigned_to_user_id)
);

-- ============================================
-- 7. FINANCIAL MANAGEMENT
-- ============================================

-- Payments
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    lease_id INT NOT NULL,
    tenant_id INT NOT NULL,
    unit_id INT NOT NULL,
    payment_type ENUM('rent', 'deposit', 'fee', 'utility', 'other') DEFAULT 'rent',
    description VARCHAR(255),
    
    -- Amount details
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0.00,
    balance DECIMAL(10,2) DEFAULT 0.00,
    
    -- Due dates
    due_date DATE NOT NULL,
    period_start_date DATE,
    period_end_date DATE,
    
    -- Payment details
    payment_method ENUM('credit_card', 'bank_transfer', 'check', 'cash', 'digital_wallet', 'other') DEFAULT 'bank_transfer',
    payment_date DATE,
    payment_reference VARCHAR(100),
    processor_transaction_id VARCHAR(100),
    processor_response JSON,
    
    -- Status
    status ENUM('pending', 'partial', 'paid', 'overdue', 'cancelled', 'refunded') DEFAULT 'pending',
    late_fee_applied DECIMAL(8,2) DEFAULT 0.00,
    late_fee_waived BOOLEAN DEFAULT FALSE,
    
    -- Receipt
    receipt_number VARCHAR(50),
    receipt_url VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (lease_id) REFERENCES leases(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    
    INDEX idx_lease_id (lease_id),
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_unit_id (unit_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date),
    INDEX idx_payment_date (payment_date),
    INDEX idx_receipt_number (receipt_number)
);

-- Transactions (all financial transactions)
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    company_id INT NOT NULL,
    portfolio_id INT NULL,
    property_id INT NULL,
    unit_id INT NULL,
    
    -- Transaction details
    transaction_type ENUM('income', 'expense', 'transfer', 'adjustment') DEFAULT 'income',
    category ENUM('rent', 'management_fee', 'maintenance', 'utility', 'tax', 'insurance', 'payroll', 'supplies', 'other') DEFAULT 'other',
    subcategory VARCHAR(100),
    
    -- Amount
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    exchange_rate DECIMAL(10,6) DEFAULT 1.000000,
    
    -- Dates
    transaction_date DATE NOT NULL,
    posting_date DATE,
    
    -- Parties
    payer_payee_name VARCHAR(255),
    payer_payee_id INT NULL, -- vendor_id or tenant_id
    payer_payee_type ENUM('tenant', 'vendor', 'owner', 'employee', 'other') DEFAULT 'other',
    
    -- Reference
    reference_number VARCHAR(100),
    description TEXT,
    memo TEXT,
    
    -- Payment method
    payment_method VARCHAR(50),
    check_number VARCHAR(50),
    
    -- Status
    status ENUM('pending', 'cleared', 'reconciled', 'void') DEFAULT 'pending',
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_id INT NULL,
    
    -- Accounting
    gl_account_code VARCHAR(50),
    is_tax_deductible BOOLEAN DEFAULT FALSE,
    tax_category VARCHAR(50),
    
    -- Attachments
    document_url VARCHAR(500),
    
    created_by INT NOT NULL,
    approved_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE SET NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_company_id (company_id),
    INDEX idx_property_id (property_id),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_category (category),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_status (status),
    INDEX idx_payer_payee (payer_payee_id, payer_payee_type)
);

-- Owner distributions
CREATE TABLE owner_distributions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    owner_id INT NOT NULL,
    property_id INT NOT NULL,
    period_start_date DATE NOT NULL,
    period_end_date DATE NOT NULL,
    total_income DECIMAL(12,2) DEFAULT 0.00,
    total_expenses DECIMAL(12,2) DEFAULT 0.00,
    management_fee DECIMAL(10,2) DEFAULT 0.00,
    net_amount DECIMAL(12,2) DEFAULT 0.00,
    distribution_amount DECIMAL(12,2) DEFAULT 0.00,
    distribution_date DATE,
    distribution_method ENUM('check', 'bank_transfer', 'paypal', 'other') DEFAULT 'bank_transfer',
    reference_number VARCHAR(100),
    status ENUM('pending', 'processed', 'cancelled') DEFAULT 'pending',
    statement_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    
    INDEX idx_owner_id (owner_id),
    INDEX idx_property_id (property_id),
    INDEX idx_period (period_start_date, period_end_date),
    INDEX idx_status (status),
    INDEX idx_distribution_date (distribution_date)
);

-- ============================================
-- 8. INVITATIONS & COLLABORATION
-- ============================================

-- Invitations
CREATE TABLE invitations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    company_id INT NOT NULL,
    invited_by INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(100) NOT NULL UNIQUE,
    role_id INT NOT NULL,
    permissions JSON, -- Custom permissions for this invitation
    
    -- Scope
    portfolio_id INT NULL,
    property_id INT NULL,
    access_level ENUM('company', 'portfolio', 'property', 'unit') DEFAULT 'company',
    
    -- Status
    status ENUM('pending', 'accepted', 'expired', 'revoked', 'declined') DEFAULT 'pending',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP NULL,
    accepted_by_user_id INT NULL,
    
    -- Message
    personal_message TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (invited_by) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE SET NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
    FOREIGN KEY (accepted_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_company_id (company_id),
    INDEX idx_email (email),
    INDEX idx_token (token),
    INDEX idx_status (status),
    INDEX idx_expires_at (expires_at),
    INDEX idx_invited_by (invited_by)
);

-- ============================================
-- 9. MARKET DATA & INTEGRATIONS
-- ============================================

-- Market data (aggregated from external sources)
CREATE TABLE market_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    source VARCHAR(50) NOT NULL, -- 'zillow', 'rentometer', 'mls', 'coStar'
    data_type ENUM('rent_comps', 'property_values', 'vacancy_rates', 'market_trends') DEFAULT 'rent_comps',
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    neighborhood VARCHAR(100),
    property_type VARCHAR(50),
    bedrooms INT,
    bathrooms DECIMAL(3,1),
    avg_rent DECIMAL(10,2),
    median_rent DECIMAL(10,2),
    min_rent DECIMAL(10,2),
    max_rent DECIMAL(10,2),
    avg_price_per_sqft DECIMAL(8,2),
    vacancy_rate DECIMAL(5,2),
    days_on_market_avg INT,
    data_date DATE NOT NULL,
    sample_size INT,
    confidence_score DECIMAL(3,2),
    raw_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_location (city, state, neighborhood),
    INDEX idx_property_type (property_type),
    INDEX idx_data_date (data_date),
    INDEX idx_source (source, data_type)
);

-- External API integrations
CREATE TABLE integrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    integration_type ENUM('payment', 'listing', 'screening', 'utility', 'smart_home', 'accounting', 'other') DEFAULT 'other',
    provider VARCHAR(100) NOT NULL, -- 'stripe', 'zillow', 'transunion', 'quickbooks'
    name VARCHAR(255) NOT NULL,
    api_key VARCHAR(500),
    api_secret VARCHAR(500),
    access_token VARCHAR(1000),
    refresh_token VARCHAR(500),
    token_expires_at TIMESTAMP NULL,
    webhook_url VARCHAR(500),
    webhook_secret VARCHAR(100),
    config JSON,
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP NULL,
    sync_status ENUM('success', 'failed', 'pending') DEFAULT 'pending',
    sync_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_company_integration (company_id, integration_type, provider),
    INDEX idx_company_id (company_id),
    INDEX idx_integration_type (integration_type),
    INDEX idx_is_active (is_active)
);

-- ============================================
-- 10. COMMUNICATION & NOTIFICATIONS
-- ============================================

-- Messages (internal communication)
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    company_id INT NOT NULL,
    thread_id VARCHAR(100),
    sender_id INT NOT NULL,
    recipient_id INT NULL, -- NULL for group messages
    recipient_role_id INT NULL,
    subject VARCHAR(255),
    body TEXT NOT NULL,
    message_type ENUM('direct', 'task', 'property', 'maintenance', 'financial', 'announcement') DEFAULT 'direct',
    
    -- References
    property_id INT NULL,
    unit_id INT NULL,
    task_id INT NULL,
    maintenance_request_id INT NULL,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    is_important BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    
    -- Attachments
    attachments JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (recipient_role_id) REFERENCES roles(id) ON DELETE SET NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL,
    FOREIGN KEY (maintenance_request_id) REFERENCES maintenance_requests(id) ON DELETE SET NULL,
    
    INDEX idx_company_id (company_id),
    INDEX idx_sender_id (sender_id),
    INDEX idx_recipient_id (recipient_id),
    INDEX idx_thread_id (thread_id),
    INDEX idx_created_at (created_at),
    INDEX idx_is_read (is_read)
);

-- Notifications (system notifications)
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    user_id INT NOT NULL,
    notification_type ENUM('system', 'task', 'payment', 'maintenance', 'message', 'alert', 'reminder') DEFAULT 'system',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    
    -- Actions
    action_url VARCHAR(500),
    action_label VARCHAR(50),
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    is_dismissed BOOLEAN DEFAULT FALSE,
    dismissed_at TIMESTAMP NULL,
    
    -- Expiry
    expires_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_notification_type (notification_type),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    INDEX idx_expires_at (expires_at)
);

-- ============================================
-- 11. AUDIT & SYSTEM LOGS
-- ============================================

-- Audit logs
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    company_id INT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    entity_uuid VARCHAR(36),
    
    -- Changes
    old_values JSON,
    new_values JSON,
    changed_fields JSON,
    
    -- Context
    ip_address VARCHAR(45),
    user_agent TEXT,
    request_url VARCHAR(500),
    request_method VARCHAR(10),
    
    -- Status
    status ENUM('success', 'failure', 'warning') DEFAULT 'success',
    error_message TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_company_id (company_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- System logs
CREATE TABLE system_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    log_level ENUM('error', 'warning', 'info', 'debug') DEFAULT 'info',
    component VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    stack_trace TEXT,
    ip_address VARCHAR(45),
    user_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_log_level (log_level),
    INDEX idx_component (component),
    INDEX idx_created_at (created_at),
    INDEX idx_user_id (user_id)
);

-- ============================================
-- 12. WEBSITE & PUBLIC LISTINGS
-- ============================================

-- Website listings
CREATE TABLE website_listings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    unit_id INT NOT NULL,
    listing_type ENUM('rent', 'sale', 'short_term') DEFAULT 'rent',
    status ENUM('draft', 'published', 'unpublished', 'rented', 'sold') DEFAULT 'draft',
    
    -- Listing details
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    highlights JSON,
    features JSON,
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    price_period ENUM('monthly', 'weekly', 'daily', 'yearly') DEFAULT 'monthly',
    deposit_amount DECIMAL(10,2),
    utilities_included JSON,
    
    -- Availability
    available_from DATE,
    available_to DATE,
    min_lease_months INT DEFAULT 12,
    show_on_website BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    
    -- SEO
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    slug VARCHAR(255) UNIQUE,
    
    -- Stats
    views_count INT DEFAULT 0,
    inquiries_count INT DEFAULT 0,
    last_viewed_at TIMESTAMP NULL,
    
    -- Syndication
    syndicated_to JSON, -- Platforms where listed
    last_syndicated_at TIMESTAMP NULL,
    
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL,
    
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    
    UNIQUE KEY unique_unit_listing (unit_id, listing_type),
    INDEX idx_property_id (property_id),
    INDEX idx_unit_id (unit_id),
    INDEX idx_status (status),
    INDEX idx_listing_type (listing_type),
    INDEX idx_available_from (available_from),
    INDEX idx_show_on_website (show_on_website),
    INDEX idx_featured (featured),
    INDEX idx_slug (slug)
);

-- ============================================
-- 13. RELOCATION SERVICES
-- ============================================

-- Relocation requests
CREATE TABLE relocation_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    company_id INT NULL, -- Corporate client
    tenant_id INT NULL, -- Individual tenant
    contact_name VARCHAR(200) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    
    -- Relocation details
    relocation_type ENUM('corporate', 'individual', 'military', 'student') DEFAULT 'individual',
    from_city VARCHAR(100),
    from_state VARCHAR(100),
    from_country VARCHAR(100),
    to_city VARCHAR(100) NOT NULL,
    to_state VARCHAR(100) NOT NULL,
    to_country VARCHAR(100) DEFAULT 'USA',
    
    -- Requirements
    property_type_preferences JSON,
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    bedrooms_min INT,
    bathrooms_min DECIMAL(3,1),
    move_in_date DATE,
    lease_term_months INT,
    special_requirements TEXT,
    
    -- Status
    status ENUM('inquiry', 'assigned', 'searching', 'viewing', 'application', 'completed', 'cancelled') DEFAULT 'inquiry',
    assigned_to_user_id INT NULL,
    
    -- Results
    matched_properties JSON,
    selected_property_id INT NULL,
    selected_unit_id INT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (selected_property_id) REFERENCES properties(id) ON DELETE SET NULL,
    FOREIGN KEY (selected_unit_id) REFERENCES units(id) ON DELETE SET NULL,
    
    INDEX idx_company_id (company_id),
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_status (status),
    INDEX idx_to_location (to_city, to_state),
    INDEX idx_move_in_date (move_in_date)
);

-- ============================================
-- STORED PROCEDURES & FUNCTIONS
-- ============================================

-- Function to generate next lease number
DELIMITER //
CREATE FUNCTION generate_lease_number(company_prefix VARCHAR(10))
RETURNS VARCHAR(50)
DETERMINISTIC
BEGIN
    DECLARE next_num INT;
    DECLARE year_part VARCHAR(4);
    DECLARE month_part VARCHAR(2);
    DECLARE new_lease_number VARCHAR(50);
    
    SET year_part = YEAR(CURDATE());
    SET month_part = LPAD(MONTH(CURDATE()), 2, '0');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(lease_number, -4) AS UNSIGNED)), 0) + 1
    INTO next_num
    FROM leases
    WHERE lease_number LIKE CONCAT(company_prefix, '-', year_part, month_part, '-%');
    
    SET new_lease_number = CONCAT(company_prefix, '-', year_part, month_part, '-', LPAD(next_num, 4, '0'));
    
    RETURN new_lease_number;
END //
DELIMITER ;

-- Procedure to update property statistics
DELIMITER //
CREATE PROCEDURE update_property_stats(IN property_id_param INT)
BEGIN
    DECLARE total_units_count INT;
    DECLARE occupied_units_count INT;
    DECLARE total_rent DECIMAL(12,2);
    
    -- Get counts
    SELECT COUNT(*), SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END)
    INTO total_units_count, occupied_units_count
    FROM units
    WHERE property_id = property_id_param;
    
    -- Get total rent
    SELECT COALESCE(SUM(l.monthly_rent), 0)
    INTO total_rent
    FROM leases l
    JOIN units u ON l.unit_id = u.id
    WHERE u.property_id = property_id_param
    AND l.status = 'active'
    AND CURDATE() BETWEEN l.start_date AND COALESCE(l.end_date, CURDATE());
    
    -- Update property
    UPDATE properties 
    SET 
        total_units = total_units_count,
        current_value = CASE 
            WHEN total_units_count > 0 THEN total_rent * 12 * 10 -- 10x annual rent
            ELSE current_value 
        END
    WHERE id = property_id_param;
END //
DELIMITER ;

-- Trigger to update property stats when unit status changes
DELIMITER //
CREATE TRIGGER after_unit_status_update
AFTER UPDATE ON units
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status OR OLD.current_rent != NEW.current_rent THEN
        CALL update_property_stats(NEW.property_id);
    END IF;
END //
DELIMITER ;

-- Trigger to update property stats when lease changes
DELIMITER //
CREATE TRIGGER after_lease_update
AFTER UPDATE ON leases
FOR EACH ROW
BEGIN
    DECLARE property_id_val INT;
    
    IF OLD.status != NEW.status OR OLD.monthly_rent != NEW.monthly_rent THEN
        SELECT u.property_id INTO property_id_val
        FROM units u
        WHERE u.id = NEW.unit_id;
        
        CALL update_property_stats(property_id_val);
    END IF;
END //
DELIMITER ;

-- ============================================
-- VIEWS FOR REPORTING
-- ============================================

-- View for property summary
CREATE VIEW property_summary_view AS
SELECT 
    p.id,
    p.uuid,
    p.name,
    p.property_type,
    p.city,
    p.state,
    p.total_units,
    COUNT(DISTINCT u.id) as active_units,
    SUM(CASE WHEN u.status = 'occupied' THEN 1 ELSE 0 END) as occupied_units,
    SUM(CASE WHEN u.status = 'vacant' THEN 1 ELSE 0 END) as vacant_units,
    COALESCE(SUM(CASE WHEN l.status = 'active' THEN l.monthly_rent ELSE 0 END), 0) as monthly_rent_roll,
    p.current_value,
    p.assigned_manager_id,
    u2.first_name as manager_first_name,
    u2.last_name as manager_last_name
FROM properties p
LEFT JOIN units u ON p.id = u.property_id
LEFT JOIN leases l ON u.id = l.unit_id AND l.status = 'active'
LEFT JOIN users u2 ON p.assigned_manager_id = u2.id
GROUP BY p.id, p.uuid, p.name, p.property_type, p.city, p.state, p.total_units, p.current_value, p.assigned_manager_id, u2.first_name, u2.last_name;

-- View for portfolio performance
CREATE VIEW portfolio_performance_view AS
SELECT 
    po.id as portfolio_id,
    po.name as portfolio_name,
    po.portfolio_type,
    COUNT(DISTINCT p.id) as property_count,
    COUNT(DISTINCT u.id) as unit_count,
    SUM(CASE WHEN u.status = 'occupied' THEN 1 ELSE 0 END) as occupied_units,
    ROUND(SUM(CASE WHEN u.status = 'occupied' THEN 1 ELSE 0 END) * 100.0 / COUNT(DISTINCT u.id), 2) as occupancy_rate,
    COALESCE(SUM(CASE WHEN l.status = 'active' THEN l.monthly_rent ELSE 0 END), 0) as monthly_rent_roll,
    COALESCE(SUM(CASE WHEN l.status = 'active' THEN l.monthly_rent * 12 ELSE 0 END), 0) as annual_rent_roll,
    COALESCE(SUM(p.current_value), 0) as total_value,
    AVG(p.current_value) as avg_property_value
FROM portfolios po
LEFT JOIN properties p ON po.id = p.portfolio_id
LEFT JOIN units u ON p.id = u.property_id
LEFT JOIN leases l ON u.id = l.unit_id AND l.status = 'active'
GROUP BY po.id, po.name, po.portfolio_type;

-- View for tenant dashboard
CREATE VIEW tenant_dashboard_view AS
SELECT 
    t.id as tenant_id,
    t.uuid as tenant_uuid,
    CONCAT(t.first_name, ' ', t.last_name) as tenant_name,
    t.email,
    t.phone,
    l.id as lease_id,
    l.lease_number,
    l.status as lease_status,
    l.start_date,
    l.end_date,
    l.monthly_rent,
    u.id as unit_id,
    u.unit_number,
    p.id as property_id,
    p.name as property_name,
    p.address_line1,
    p.city,
    p.state,
    COALESCE(SUM(CASE WHEN py.status = 'paid' THEN py.amount_paid ELSE 0 END), 0) as total_paid,
    COALESCE(SUM(CASE WHEN py.status IN ('pending', 'overdue') THEN py.amount_due - py.amount_paid ELSE 0 END), 0) as balance_due,
    COUNT(DISTINCT mr.id) as maintenance_requests,
    SUM(CASE WHEN mr.status IN ('submitted', 'assigned') THEN 1 ELSE 0 END) as open_requests
FROM tenants t
LEFT JOIN leases l ON t.id = l.tenant_id AND l.status = 'active'
LEFT JOIN units u ON l.unit_id = u.id
LEFT JOIN properties p ON u.property_id = p.id
LEFT JOIN payments py ON l.id = py.lease_id
LEFT JOIN maintenance_requests mr ON t.id = mr.tenant_id AND mr.status IN ('submitted', 'assigned', 'in_progress')
GROUP BY t.id, t.uuid, t.first_name, t.last_name, t.email, t.phone, l.id, l.lease_number, l.status, l.start_date, l.end_date, l.monthly_rent, u.id, u.unit_number, p.id, p.name, p.address_line1, p.city, p.state;

-- View for financial overview
CREATE VIEW financial_overview_view AS
SELECT 
    c.id as company_id,
    c.name as company_name,
    DATE_FORMAT(t.transaction_date, '%Y-%m') as month,
    SUM(CASE WHEN t.transaction_type = 'income' THEN t.amount ELSE 0 END) as total_income,
    SUM(CASE WHEN t.transaction_type = 'expense' THEN t.amount ELSE 0 END) as total_expenses,
    SUM(CASE WHEN t.transaction_type = 'income' THEN t.amount ELSE 0 END) - 
    SUM(CASE WHEN t.transaction_type = 'expense' THEN t.amount ELSE 0 END) as net_income,
    COUNT(DISTINCT CASE WHEN t.transaction_type = 'income' THEN t.id END) as income_transactions,
    COUNT(DISTINCT CASE WHEN t.transaction_type = 'expense' THEN t.id END) as expense_transactions
FROM companies c
LEFT JOIN transactions t ON c.id = t.company_id
WHERE t.status = 'cleared'
GROUP BY c.id, c.name, DATE_FORMAT(t.transaction_date, '%Y-%m')
ORDER BY month DESC;

-- ============================================
-- INITIAL DATA SEEDING
-- ============================================

-- Insert default roles
INSERT INTO roles (name, level, description) VALUES
('system_admin', 1, 'Full system access'),
('company_owner', 2, 'Company owner/admin'),
('portfolio_manager', 3, 'Manages multiple properties/portfolios'),
('property_manager', 4, 'Manages individual properties'),
('leasing_specialist', 5, 'Handles leasing and tenant relations'),
('maintenance_supervisor', 5, 'Oversees maintenance operations'),
('maintenance_technician', 6, 'Performs maintenance tasks'),
('vendor_coordinator', 5, 'Manages vendor relationships'),
('marketing_specialist', 5, 'Handles property marketing'),
('financial_controller', 5, 'Manages financial operations'),
('tenant', 10, 'Tenant/resident access');

-- Insert sample company
INSERT INTO companies (name, legal_name, email, phone, company_type, address_line1, city, state, country, postal_code, subscription_plan, subscription_status, max_users, max_properties) VALUES
('StaySpot Management', 'StaySpot Property Management LLC', 'admin@stayspot.com', '+1-555-123-4567', 'property_management', '123 Business Ave', 'New York', 'NY', 'USA', '10001', 'enterprise', 'active', 100, 1000);

-- Create system admin user (password: Admin@123 - should be hashed in application)
INSERT INTO users (email, password_hash, first_name, last_name, phone, email_verified, is_active) VALUES
('admin@stayspot.com', '$2b$10$YourHashedPasswordHere', 'System', 'Administrator', '+1-555-000-0001', TRUE, TRUE);

-- Assign system admin role
INSERT INTO user_roles (user_id, role_id, assigned_by) VALUES
(1, 1, 1);

-- Add company user relationship
INSERT INTO company_users (company_id, user_id, job_title, is_primary_contact, is_admin, status) VALUES
(1, 1, 'System Administrator', TRUE, TRUE, 'active');

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Composite indexes for common queries
CREATE INDEX idx_properties_location ON properties(city, state, country);
CREATE INDEX idx_units_property_status ON units(property_id, status);
CREATE INDEX idx_leases_unit_status ON leases(unit_id, status);
CREATE INDEX idx_payments_lease_status ON payments(lease_id, status, due_date);
CREATE INDEX idx_tasks_assigned_status ON tasks(assigned_to_user_id, status, due_date);
CREATE INDEX idx_maintenance_unit_status ON maintenance_requests(unit_id, status, priority);
CREATE INDEX idx_transactions_company_date ON transactions(company_id, transaction_date, transaction_type);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read, created_at);
CREATE INDEX idx_messages_thread ON messages(thread_id, created_at);
CREATE INDEX idx_audit_entity_date ON audit_logs(entity_type, entity_id, created_at);
CREATE INDEX idx_market_location_type ON market_data(city, state, property_type, data_date);

-- Create FULLTEXT indexes for search (only on VARCHAR/TEXT columns)
CREATE FULLTEXT INDEX idx_properties_search ON properties(name, address_line1, city, state, neighborhood);
CREATE FULLTEXT INDEX idx_tenants_search ON tenants(first_name, last_name, email);
CREATE FULLTEXT INDEX idx_tasks_search ON tasks(title, description);
CREATE FULLTEXT INDEX idx_website_listings_search ON website_listings(title, description);

-- ============================================
-- COMMENTS AND DOCUMENTATION
-- ============================================

-- Add comments to tables
ALTER TABLE properties COMMENT = 'Properties/buildings managed in the system';
ALTER TABLE units COMMENT = 'Individual units within properties (apartments, offices)';
ALTER TABLE leases COMMENT = 'Lease agreements between landlords and tenants';
ALTER TABLE tasks COMMENT = 'Tasks and assignments for team members';
ALTER TABLE invitations COMMENT = 'User invitations with role assignments';
ALTER TABLE market_data COMMENT = 'Aggregated market data from external sources';

-- ============================================
-- DATABASE USERS AND PERMISSIONS
-- ============================================
-- NOTE: These commands may require root/admin privileges
-- If you get "Access denied" errors, skip these and create users via cPanel instead

-- Create application user
-- Uncomment the lines below and run separately if needed
-- CREATE USER 'stayspot_app'@'localhost' IDENTIFIED BY 'StrongPassword123!';
-- GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON stayspot_db.* TO 'stayspot_app'@'localhost';

-- Create read-only user for reports
-- CREATE USER 'stayspot_report'@'localhost' IDENTIFIED BY 'ReportPass123!';
-- GRANT SELECT ON stayspot_db.* TO 'stayspot_report'@'localhost';
-- GRANT SELECT ON stayspot_db.* TO 'stayspot_report'@'%';

-- Create backup user
-- CREATE USER 'stayspot_backup'@'localhost' IDENTIFIED BY 'BackupPass123!';
-- GRANT SELECT, LOCK TABLES ON stayspot_db.* TO 'stayspot_backup'@'localhost';

-- FLUSH PRIVILEGES;

-- ============================================
-- END OF DATABASE SCHEMA
-- ============================================