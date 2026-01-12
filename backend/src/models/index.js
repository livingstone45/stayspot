const { Sequelize } = require('sequelize');
const { sequelize } = require('../database');

// Import all models
const User = require('./User');
const Role = require('./Role');
const Permission = require('./Permission');
const UserRole = require('./UserRole');
const Property = require('./Property');
const PropertyImage = require('./PropertyImage');
const PropertyDocument = require('./PropertyDocument');
const Unit = require('./Unit');
const Tenant = require('./Tenant');
const Lease = require('./Lease');
const MaintenanceRequest = require('./MaintenanceRequest');
const WorkOrder = require('./WorkOrder');
const Vendor = require('./Vendor');
const Task = require('./Task');
const Assignment = require('./Assignment');
const Invitation = require('./Invitation');
const Portfolio = require('./Portfolio');
const Company = require('./Company');
const Payment = require('./Payment');
const Transaction = require('./Transaction');
const Message = require('./Message');
const Notification = require('./Notification');
const AuditLog = require('./AuditLog');
const Integration = require('./Integration');
const MarketData = require('./MarketData');

// Define associations

// User associations
User.belongsToMany(Role, { through: UserRole, as: 'roles', foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRole, as: 'users', foreignKey: 'roleId' });

// Role-Permission associations
Role.belongsToMany(Permission, { through: 'RolePermissions', as: 'permissions' });
Permission.belongsToMany(Role, { through: 'RolePermissions', as: 'roles' });

// Company associations
Company.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
User.hasMany(Company, { as: 'ownedCompanies', foreignKey: 'ownerId' });

// Portfolio associations
Portfolio.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
Portfolio.belongsTo(User, { as: 'manager', foreignKey: 'managerId' });
Portfolio.belongsTo(Company, { as: 'company', foreignKey: 'companyId' });
User.hasMany(Portfolio, { as: 'ownedPortfolios', foreignKey: 'ownerId' });
User.hasMany(Portfolio, { as: 'managedPortfolios', foreignKey: 'managerId' });
Company.hasMany(Portfolio, { as: 'portfolios', foreignKey: 'companyId' });

// Property associations
Property.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
Property.belongsTo(User, { as: 'manager', foreignKey: 'managerId' });
Property.belongsTo(Company, { as: 'company', foreignKey: 'companyId' });
Property.belongsTo(Portfolio, { as: 'portfolio', foreignKey: 'portfolioId' });
User.hasMany(Property, { as: 'ownedProperties', foreignKey: 'ownerId' });
User.hasMany(Property, { as: 'managedProperties', foreignKey: 'managerId' });
Company.hasMany(Property, { as: 'properties', foreignKey: 'companyId' });
Portfolio.hasMany(Property, { as: 'properties', foreignKey: 'portfolioId' });

// Property Image associations
PropertyImage.belongsTo(Property, { as: 'property', foreignKey: 'propertyId' });
PropertyImage.belongsTo(Unit, { as: 'unit', foreignKey: 'unitId' });
PropertyImage.belongsTo(User, { as: 'uploader', foreignKey: 'uploadedBy' });
Property.hasMany(PropertyImage, { as: 'images', foreignKey: 'propertyId' });
Unit.hasMany(PropertyImage, { as: 'images', foreignKey: 'unitId' });

// Property Document associations
PropertyDocument.belongsTo(Property, { as: 'property', foreignKey: 'propertyId' });
PropertyDocument.belongsTo(User, { as: 'uploader', foreignKey: 'uploadedBy' });
Property.hasMany(PropertyDocument, { as: 'documents', foreignKey: 'propertyId' });

// Unit associations
Unit.belongsTo(Property, { as: 'property', foreignKey: 'propertyId' });
Unit.belongsTo(Tenant, { as: 'currentTenant', foreignKey: 'currentTenantId' });
Unit.belongsTo(Lease, { as: 'currentLease', foreignKey: 'currentLeaseId' });
Property.hasMany(Unit, { as: 'units', foreignKey: 'propertyId' });

// Tenant associations
Tenant.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasOne(Tenant, { as: 'tenantProfile', foreignKey: 'userId' });

// Lease associations
Lease.belongsTo(Property, { as: 'property', foreignKey: 'propertyId' });
Lease.belongsTo(Unit, { as: 'unit', foreignKey: 'unitId' });
Lease.belongsTo(Tenant, { as: 'tenant', foreignKey: 'tenantId' });
Lease.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Property.hasMany(Lease, { as: 'leases', foreignKey: 'propertyId' });
Unit.hasMany(Lease, { as: 'leases', foreignKey: 'unitId' });
Tenant.hasMany(Lease, { as: 'leases', foreignKey: 'tenantId' });

// Maintenance Request associations
MaintenanceRequest.belongsTo(Property, { as: 'property', foreignKey: 'propertyId' });
MaintenanceRequest.belongsTo(Unit, { as: 'unit', foreignKey: 'unitId' });
MaintenanceRequest.belongsTo(User, { as: 'requester', foreignKey: 'requestedBy' });
MaintenanceRequest.belongsTo(User, { as: 'assignee', foreignKey: 'assignedTo' });
Property.hasMany(MaintenanceRequest, { as: 'maintenanceRequests', foreignKey: 'propertyId' });
Unit.hasMany(MaintenanceRequest, { as: 'maintenanceRequests', foreignKey: 'unitId' });

// Work Order associations
WorkOrder.belongsTo(MaintenanceRequest, { as: 'maintenanceRequest', foreignKey: 'maintenanceRequestId' });
WorkOrder.belongsTo(Property, { as: 'property', foreignKey: 'propertyId' });
WorkOrder.belongsTo(Unit, { as: 'unit', foreignKey: 'unitId' });
WorkOrder.belongsTo(User, { as: 'assignee', foreignKey: 'assignedTo' });
WorkOrder.belongsTo(Vendor, { as: 'vendor', foreignKey: 'vendorId' });
WorkOrder.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
MaintenanceRequest.hasMany(WorkOrder, { as: 'workOrders', foreignKey: 'maintenanceRequestId' });
Property.hasMany(WorkOrder, { as: 'workOrders', foreignKey: 'propertyId' });
Unit.hasMany(WorkOrder, { as: 'workOrders', foreignKey: 'unitId' });
Vendor.hasMany(WorkOrder, { as: 'workOrders', foreignKey: 'vendorId' });

// Vendor associations
Vendor.belongsTo(Company, { as: 'company', foreignKey: 'companyId' });
Company.hasMany(Vendor, { as: 'vendors', foreignKey: 'companyId' });

// Task associations
Task.belongsTo(Property, { as: 'property', foreignKey: 'propertyId' });
Task.belongsTo(Unit, { as: 'unit', foreignKey: 'unitId' });
Task.belongsTo(User, { as: 'assignee', foreignKey: 'assignedTo' });
Task.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Task.belongsTo(User, { as: 'completedByUser', foreignKey: 'completedBy' });
Task.belongsTo(Company, { as: 'company', foreignKey: 'companyId' });
Property.hasMany(Task, { as: 'tasks', foreignKey: 'propertyId' });
Unit.hasMany(Task, { as: 'tasks', foreignKey: 'unitId' });
Company.hasMany(Task, { as: 'tasks', foreignKey: 'companyId' });

// Assignment associations
Assignment.belongsTo(Task, { as: 'task', foreignKey: 'taskId' });
Assignment.belongsTo(User, { as: 'assignee', foreignKey: 'assignedTo' });
Assignment.belongsTo(User, { as: 'assigner', foreignKey: 'assignedBy' });
Task.hasMany(Assignment, { as: 'assignments', foreignKey: 'taskId' });

// Invitation associations
Invitation.belongsTo(Role, { as: 'role', foreignKey: 'roleId' });
Invitation.belongsTo(Company, { as: 'company', foreignKey: 'companyId' });
Invitation.belongsTo(User, { as: 'inviter', foreignKey: 'invitedBy' });
Invitation.belongsTo(User, { as: 'accepter', foreignKey: 'acceptedBy' });
Company.hasMany(Invitation, { as: 'invitations', foreignKey: 'companyId' });

// Payment associations
Payment.belongsTo(Property, { as: 'property', foreignKey: 'propertyId' });
Payment.belongsTo(Unit, { as: 'unit', foreignKey: 'unitId' });
Payment.belongsTo(Lease, { as: 'lease', foreignKey: 'leaseId' });
Payment.belongsTo(User, { as: 'payer', foreignKey: 'payerId' });
Payment.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });
Property.hasMany(Payment, { as: 'payments', foreignKey: 'propertyId' });
Unit.hasMany(Payment, { as: 'payments', foreignKey: 'unitId' });
Lease.hasMany(Payment, { as: 'payments', foreignKey: 'leaseId' });

// Transaction associations
Transaction.belongsTo(Property, { as: 'property', foreignKey: 'propertyId' });
Transaction.belongsTo(Unit, { as: 'unit', foreignKey: 'unitId' });
Transaction.belongsTo(Payment, { as: 'payment', foreignKey: 'paymentId' });
Transaction.belongsTo(Vendor, { as: 'vendor', foreignKey: 'vendorId' });
Transaction.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Transaction.belongsTo(Company, { as: 'company', foreignKey: 'companyId' });
Property.hasMany(Transaction, { as: 'transactions', foreignKey: 'propertyId' });
Unit.hasMany(Transaction, { as: 'transactions', foreignKey: 'unitId' });
Payment.hasOne(Transaction, { as: 'transaction', foreignKey: 'paymentId' });
Company.hasMany(Transaction, { as: 'transactions', foreignKey: 'companyId' });

// Message associations
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });
Message.belongsTo(Property, { as: 'property', foreignKey: 'propertyId' });
Message.belongsTo(Unit, { as: 'unit', foreignKey: 'unitId' });
Message.belongsTo(Message, { as: 'parent', foreignKey: 'parentId' });
Message.hasMany(Message, { as: 'replies', foreignKey: 'parentId' });
Property.hasMany(Message, { as: 'messages', foreignKey: 'propertyId' });
Unit.hasMany(Message, { as: 'messages', foreignKey: 'unitId' });

// Notification associations
Notification.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Notification.belongsTo(Property, { as: 'property', foreignKey: 'propertyId' });
Notification.belongsTo(Unit, { as: 'unit', foreignKey: 'unitId' });
User.hasMany(Notification, { as: 'notifications', foreignKey: 'userId' });
Property.hasMany(Notification, { as: 'notifications', foreignKey: 'propertyId' });
Unit.hasMany(Notification, { as: 'notifications', foreignKey: 'unitId' });

// Audit Log associations
AuditLog.belongsTo(User, { as: 'user', foreignKey: 'userId' });
AuditLog.belongsTo(Company, { as: 'company', foreignKey: 'companyId' });
User.hasMany(AuditLog, { as: 'auditLogs', foreignKey: 'userId' });
Company.hasMany(AuditLog, { as: 'auditLogs', foreignKey: 'companyId' });

// Integration associations
Integration.belongsTo(Company, { as: 'company', foreignKey: 'companyId' });
Integration.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Company.hasMany(Integration, { as: 'integrations', foreignKey: 'companyId' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Role,
  Permission,
  UserRole,
  Property,
  PropertyImage,
  PropertyDocument,
  Unit,
  Tenant,
  Lease,
  MaintenanceRequest,
  WorkOrder,
  Vendor,
  Task,
  Assignment,
  Invitation,
  Portfolio,
  Company,
  Payment,
  Transaction,
  Message,
  Notification,
  AuditLog,
  Integration,
  MarketData,
};