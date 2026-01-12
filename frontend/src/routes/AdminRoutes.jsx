/**
 * Admin routes configuration
 * Handles all system administration routes for system admins
 */

import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ADMIN_ROUTES } from '../utils/constants/routes';
import AdminLayout from '../layouts/AdminLayout';

// Lazy load admin pages
const AdminDashboard = lazy(() => import('../pages/system-admin/Dashboard'));
const AdminOverview = lazy(() => import('../pages/system-admin/Dashboard'));

// System Management
const SystemManagement = lazy(() => import('../pages/system-admin/SystemSettings'));
const SystemSettings = lazy(() => import('../pages/system-admin/SystemSettings'));
const SystemConfig = lazy(() => import('../pages/system-admin/SystemSettings'));
const SystemMonitoring = lazy(() => import('../pages/system-admin/SystemSettings'));
const SystemLogs = lazy(() => import('../pages/system-admin/AuditLogs'));
const SystemBackup = lazy(() => import('../pages/system-admin/SystemSettings'));
const SystemHealth = lazy(() => import('../pages/system-admin/SystemSettings'));

// User Management
const UserManagement = lazy(() => import('../pages/system-admin/Users'));
const UserDetails = lazy(() => import('../pages/system-admin/Users'));
const UserCreate = lazy(() => import('../pages/system-admin/Users'));
const UserEdit = lazy(() => import('../pages/system-admin/Users'));

// Role Management
const RoleManagement = lazy(() => import('../pages/system-admin/Roles'));
const RoleDetails = lazy(() => import('../pages/system-admin/Roles'));
const RoleCreate = lazy(() => import('../pages/system-admin/Roles'));
const RoleEdit = lazy(() => import('../pages/system-admin/Roles'));
const PermissionManagement = lazy(() => import('../pages/system-admin/Permissions'));

// Company Management
const CompanyManagement = lazy(() => import('../pages/system-admin/Dashboard'));
const CompanyDetails = lazy(() => import('../pages/system-admin/Dashboard'));
const CompanyCreate = lazy(() => import('../pages/system-admin/Dashboard'));
const CompanyEdit = lazy(() => import('../pages/system-admin/Dashboard'));

// Analytics & Reports
const AdminAnalytics = lazy(() => import('../pages/system-admin/Analytics'));
const AdminReports = lazy(() => import('../pages/system-admin/Analytics'));
const AuditLogs = lazy(() => import('../pages/system-admin/AuditLogs'));

// Integrations
const IntegrationManagement = lazy(() => import('../pages/system-admin/Integrations'));
const WebhookManagement = lazy(() => import('../pages/system-admin/Integrations'));
const ApiKeyManagement = lazy(() => import('../pages/system-admin/Integrations'));

// Notifications
const NotificationManagement = lazy(() => import('../pages/system-admin/Dashboard'));
const NotificationTemplates = lazy(() => import('../pages/system-admin/Dashboard'));

// Support
const SupportManagement = lazy(() => import('../pages/system-admin/Dashboard'));
const TicketManagement = lazy(() => import('../pages/system-admin/Dashboard'));
const TicketDetails = lazy(() => import('../pages/system-admin/Dashboard'));

/**
 * Admin routes component
 * Handles all system administration routing
 */
const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/overview" element={<AdminOverview />} />

        {/* System Management */}
        <Route path="/system" element={<SystemManagement />} />
        <Route path="/system/settings" element={<SystemSettings />} />
        <Route path="/system/config" element={<SystemConfig />} />
        <Route path="/system/monitoring" element={<SystemMonitoring />} />
        <Route path="/system/logs" element={<SystemLogs />} />
        <Route path="/system/backup" element={<SystemBackup />} />
        <Route path="/system/health" element={<SystemHealth />} />

        {/* User Management */}
        <Route path="/users" element={<UserManagement />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/users/create" element={<UserCreate />} />
        <Route path="/users/:id/edit" element={<UserEdit />} />

        {/* Role Management */}
        <Route path="/roles" element={<RoleManagement />} />
        <Route path="/roles/:id" element={<RoleDetails />} />
        <Route path="/roles/create" element={<RoleCreate />} />
        <Route path="/roles/:id/edit" element={<RoleEdit />} />
        <Route path="/permissions" element={<PermissionManagement />} />

        {/* Company Management */}
        <Route path="/companies" element={<CompanyManagement />} />
        <Route path="/companies/:id" element={<CompanyDetails />} />
        <Route path="/companies/create" element={<CompanyCreate />} />
        <Route path="/companies/:id/edit" element={<CompanyEdit />} />

        {/* Analytics & Reports */}
        <Route path="/analytics" element={<AdminAnalytics />} />
        <Route path="/reports" element={<AdminReports />} />
        <Route path="/audit-logs" element={<AuditLogs />} />

        {/* Integrations */}
        <Route path="/integrations" element={<IntegrationManagement />} />
        <Route path="/webhooks" element={<WebhookManagement />} />
        <Route path="/api-keys" element={<ApiKeyManagement />} />

        {/* Notifications */}
        <Route path="/notifications" element={<NotificationManagement />} />
        <Route path="/notifications/templates" element={<NotificationTemplates />} />

        {/* Support */}
        <Route path="/support" element={<SupportManagement />} />
        <Route path="/support/tickets" element={<TicketManagement />} />
        <Route path="/support/tickets/:id" element={<TicketDetails />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;