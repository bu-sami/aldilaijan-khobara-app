-- Database Schema for Aldilaijan and Khobara Web Application

-- Create separate schemas for each business
CREATE SCHEMA IF NOT EXISTS shared;
CREATE SCHEMA IF NOT EXISTS aldilaijan;
CREATE SCHEMA IF NOT EXISTS khobara;

-- Set search path
SET search_path TO shared, aldilaijan, khobara, public;

-- Shared Schema Tables

-- Users Table
CREATE TABLE shared.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name_ar VARCHAR(100),
    last_name_ar VARCHAR(100),
    first_name_en VARCHAR(100),
    last_name_en VARCHAR(100),
    phone VARCHAR(20),
    role_id INTEGER REFERENCES shared.roles(id),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles Table
CREATE TABLE shared.roles (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL,
    description_ar VARCHAR(255),
    description_en VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions Table
CREATE TABLE shared.permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role_Permissions Table
CREATE TABLE shared.role_permissions (
    role_id INTEGER REFERENCES shared.roles(id),
    permission_id INTEGER REFERENCES shared.permissions(id),
    PRIMARY KEY (role_id, permission_id)
);

-- Audit_Logs Table
CREATE TABLE shared.audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES shared.users(id),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings Table
CREATE TABLE shared.settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    value TEXT,
    description VARCHAR(255),
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Locations Table (Governorates, Areas)
CREATE TABLE shared.locations (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES shared.locations(id),
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    type VARCHAR(20) NOT NULL, -- 'governorate', 'area', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Aldilaijan Schema Tables

-- Properties Table
CREATE TABLE aldilaijan.properties (
    id SERIAL PRIMARY KEY,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    description_ar VARCHAR(1000),
    description_en VARCHAR(1000),
    property_type_id INTEGER REFERENCES aldilaijan.property_types(id),
    status_id INTEGER REFERENCES aldilaijan.property_statuses(id),
    price DECIMAL(12, 2),
    area_sqm DECIMAL(10, 2),
    bedrooms INTEGER,
    bathrooms INTEGER,
    location_id INTEGER REFERENCES shared.locations(id),
    address_ar VARCHAR(255),
    address_en VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    paci_number VARCHAR(50) UNIQUE,
    featured BOOLEAN DEFAULT FALSE,
    agent_id INTEGER REFERENCES shared.users(id),
    owner_id INTEGER REFERENCES aldilaijan.clients(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property_Types Table
CREATE TABLE aldilaijan.property_types (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property_Statuses Table
CREATE TABLE aldilaijan.property_statuses (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(50) NOT NULL,
    name_en VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property_Images Table
CREATE TABLE aldilaijan.property_images (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES aldilaijan.properties(id),
    image_path VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property_Features Table
CREATE TABLE aldilaijan.property_features (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property_Feature_Mappings Table
CREATE TABLE aldilaijan.property_feature_mappings (
    property_id INTEGER REFERENCES aldilaijan.properties(id),
    feature_id INTEGER REFERENCES aldilaijan.property_features(id),
    PRIMARY KEY (property_id, feature_id)
);

-- Clients Table
CREATE TABLE aldilaijan.clients (
    id SERIAL PRIMARY KEY,
    first_name_ar VARCHAR(100) NOT NULL,
    last_name_ar VARCHAR(100) NOT NULL,
    first_name_en VARCHAR(100),
    last_name_en VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    address_ar VARCHAR(255),
    address_en VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE aldilaijan.transactions (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES aldilaijan.properties(id),
    transaction_type_id INTEGER REFERENCES aldilaijan.transaction_types(id),
    client_id INTEGER REFERENCES aldilaijan.clients(id),
    agent_id INTEGER REFERENCES shared.users(id),
    amount DECIMAL(12, 2) NOT NULL,
    commission DECIMAL(12, 2),
    transaction_date DATE NOT NULL,
    moj_reference VARCHAR(100),
    notes TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transaction_Types Table
CREATE TABLE aldilaijan.transaction_types (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(50) NOT NULL,
    name_en VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MOJ_Transactions Table (Ministry of Justice)
CREATE TABLE aldilaijan.moj_transactions (
    id SERIAL PRIMARY KEY,
    reference_number VARCHAR(100) UNIQUE NOT NULL,
    property_type_id INTEGER REFERENCES aldilaijan.property_types(id),
    location_id INTEGER REFERENCES shared.locations(id),
    area_sqm DECIMAL(10, 2),
    price DECIMAL(12, 2),
    transaction_date DATE,
    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed BOOLEAN DEFAULT FALSE,
    matched_property_id INTEGER REFERENCES aldilaijan.properties(id)
);

-- Khobara Schema Tables

-- Valuation_Requests Table
CREATE TABLE khobara.valuation_requests (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES khobara.clients(id),
    property_id INTEGER REFERENCES khobara.properties(id),
    request_type_id INTEGER REFERENCES khobara.valuation_request_types(id),
    status_id INTEGER REFERENCES khobara.valuation_statuses(id),
    purpose_ar VARCHAR(255),
    purpose_en VARCHAR(255),
    requested_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    inspection_date TIMESTAMP,
    completion_date TIMESTAMP,
    assigned_appraiser_id INTEGER REFERENCES shared.users(id),
    fee DECIMAL(10, 2),
    payment_status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Valuation_Request_Types Table
CREATE TABLE khobara.valuation_request_types (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    description_ar VARCHAR(255),
    description_en VARCHAR(255),
    base_fee DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Valuation_Statuses Table
CREATE TABLE khobara.valuation_statuses (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(50) NOT NULL,
    name_en VARCHAR(50),
    color VARCHAR(7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Valuation_Reports Table
CREATE TABLE khobara.valuation_reports (
    id SERIAL PRIMARY KEY,
    valuation_request_id INTEGER REFERENCES khobara.valuation_requests(id),
    report_number VARCHAR(50) UNIQUE NOT NULL,
    valuation_date DATE NOT NULL,
    market_value DECIMAL(12, 2) NOT NULL,
    valuation_approach_id INTEGER REFERENCES khobara.valuation_approaches(id),
    report_file_path VARCHAR(255),
    approved_by INTEGER REFERENCES shared.users(id),
    approval_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Valuation_Approaches Table
CREATE TABLE khobara.valuation_approaches (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    description_ar VARCHAR(255),
    description_en VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties Table (for Khobara)
CREATE TABLE khobara.properties (
    id SERIAL PRIMARY KEY,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    property_type_id INTEGER REFERENCES khobara.property_types(id),
    area_sqm DECIMAL(10, 2),
    location_id INTEGER REFERENCES shared.locations(id),
    address_ar VARCHAR(255),
    address_en VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    paci_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property_Types Table (for Khobara)
CREATE TABLE khobara.property_types (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clients Table (for Khobara)
CREATE TABLE khobara.clients (
    id SERIAL PRIMARY KEY,
    first_name_ar VARCHAR(100) NOT NULL,
    last_name_ar VARCHAR(100) NOT NULL,
    first_name_en VARCHAR(100),
    last_name_en VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    address_ar VARCHAR(255),
    address_en VARCHAR(255),
    client_type VARCHAR(50), -- 'individual', 'company', 'government'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market_Data Table
CREATE TABLE khobara.market_data (
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES shared.locations(id),
    property_type_id INTEGER REFERENCES khobara.property_types(id),
    transaction_date DATE,
    price_per_sqm DECIMAL(10, 2),
    source VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property_Documents Table
CREATE TABLE khobara.property_documents (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES khobara.properties(id),
    document_type VARCHAR(50),
    file_path VARCHAR(255) NOT NULL,
    uploaded_by INTEGER REFERENCES shared.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Valuation_Report_Templates Table
CREATE TABLE khobara.valuation_report_templates (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    template_content TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance optimization

-- Shared schema indexes
CREATE INDEX idx_users_role_id ON shared.users(role_id);
CREATE INDEX idx_role_permissions_role_id ON shared.role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON shared.role_permissions(permission_id);
CREATE INDEX idx_audit_logs_user_id ON shared.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type_entity_id ON shared.audit_logs(entity_type, entity_id);
CREATE INDEX idx_locations_parent_id ON shared.locations(parent_id);
CREATE INDEX idx_locations_type ON shared.locations(type);

-- Aldilaijan schema indexes
CREATE INDEX idx_properties_property_type_id ON aldilaijan.properties(property_type_id);
CREATE INDEX idx_properties_status_id ON aldilaijan.properties(status_id);
CREATE INDEX idx_properties_location_id ON aldilaijan.properties(location_id);
CREATE INDEX idx_properties_agent_id ON aldilaijan.properties(agent_id);
CREATE INDEX idx_properties_owner_id ON aldilaijan.properties(owner_id);
CREATE INDEX idx_properties_paci_number ON aldilaijan.properties(paci_number);
CREATE INDEX idx_property_images_property_id ON aldilaijan.property_images(property_id);
CREATE INDEX idx_property_feature_mappings_property_id ON aldilaijan.property_feature_mappings(property_id);
CREATE INDEX idx_property_feature_mappings_feature_id ON aldilaijan.property_feature_mappings(feature_id);
CREATE INDEX idx_transactions_property_id ON aldilaijan.transactions(property_id);
CREATE INDEX idx_transactions_transaction_type_id ON aldilaijan.transactions(transaction_type_id);
CREATE INDEX idx_transactions_client_id ON aldilaijan.transactions(client_id);
CREATE INDEX idx_transactions_agent_id ON aldilaijan.transactions(agent_id);
CREATE INDEX idx_moj_transactions_property_type_id ON aldilaijan.moj_transactions(property_type_id);
CREATE INDEX idx_moj_transactions_location_id ON aldilaijan.moj_transactions(location_id);
CREATE INDEX idx_moj_transactions_matched_property_id ON aldilaijan.moj_transactions(matched_property_id);

-- Khobara schema indexes
CREATE INDEX idx_valuation_requests_client_id ON khobara.valuation_requests(client_id);
CREATE INDEX idx_valuation_requests_property_id ON khobara.valuation_requests(property_id);
CREATE INDEX idx_valuation_requests_request_type_id ON khobara.valuation_requests(request_type_id);
CREATE INDEX idx_valuation_requests_status_id ON khobara.valuation_requests(status_id);
CREATE INDEX idx_valuation_requests_assigned_appraiser_id ON khobara.valuation_requests(assigned_appraiser_id);
CREATE INDEX idx_valuation_reports_valuation_request_id ON khobara.valuation_reports(valuation_request_id);
CREATE INDEX idx_valuation_reports_valuation_approach_id ON khobara.valuation_reports(valuation_approach_id);
CREATE INDEX idx_valuation_reports_approved_by ON khobara.valuation_reports(approved_by);
CREATE INDEX idx_properties_khobara_property_type_id ON khobara.properties(property_type_id);
CREATE INDEX idx_properties_khobara_location_id ON khobara.properties(location_id);
CREATE INDEX idx_properties_khobara_paci_number ON khobara.properties(paci_number);
CREATE INDEX idx_market_data_location_id ON khobara.market_data(location_id);
CREATE INDEX idx_market_data_property_type_id ON khobara.market_data(property_type_id);
CREATE INDEX idx_property_documents_property_id ON khobara.property_documents(property_id);
CREATE INDEX idx_property_documents_uploaded_by ON khobara.property_documents(uploaded_by);
