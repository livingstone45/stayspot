/**
 * Management routes configuration
 * Handles all property management routes for property managers and management staff
 */

import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ManagementLayout from '../layouts/ManagementLayout';

const LoadingSpinner = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div>Loading...</div>
  </div>
);

// Lazy load management pages
const ManagementDashboard = lazy(() => import('../pages/management/DashboardSimple'));
const ManagementOverview = lazy(() => import('../pages/management/DashboardSimple'));
const ManagementInvitations = lazy(() => import('../pages/management/SendInvitation'));
const ManagementPendingInvitations = lazy(() => import('../pages/management/PendingInvitations'));
const ManagementAcceptedInvitations = lazy(() => import('../pages/management/AcceptedInvitations'));
const ManagementDeclinedInvitations = lazy(() => import('../pages/management/DeclinedInvitations'));

// Property Management
const ManagementProperties = lazy(() => import('../pages/management/Properties'));
const ManagementAddProperty = lazy(() => import('../pages/management/AddProperty'));
const ManagementPropertiesMap = lazy(() => import('../pages/management/PropertiesMap'));
const ManagementPropertyDetails = lazy(() => import('../pages/management/PropertyList'));
const ManagementPropertyUnits = lazy(() => import('../pages/management/PropertyList'));
const ManagementPropertyTenants = lazy(() => import('../pages/management/Tenants'));
const ManagementPropertyMaintenance = lazy(() => import('../pages/management/Maintenance'));
const ManagementPropertyFinancials = lazy(() => import('../pages/management/PropertyList'));

// Unit Management
const ManagementUnits = lazy(() => import('../pages/management/PropertyList'));
const ManagementUnitDetails = lazy(() => import('../pages/management/PropertyList'));
const ManagementUnitAvailability = lazy(() => import('../pages/management/PropertyList'));

// Tenant Management
const ManagementTenants = lazy(() => import('../pages/management/Tenants'));
const ManagementTenantDetails = lazy(() => import('../pages/management/Tenants'));
const ManagementTenantScreening = lazy(() => import('../pages/management/Tenants'));
const ManagementTenantCommunications = lazy(() => import('../pages/management/Communications'));

// Lease Management
const ManagementLeases = lazy(() => import('../pages/management/PropertyList'));
const ManagementLeaseDetails = lazy(() => import('../pages/management/PropertyList'));
const ManagementLeaseRenewals = lazy(() => import('../pages/management/PropertyList'));
const ManagementLeaseViolations = lazy(() => import('../pages/management/PropertyList'));

// Maintenance Management
const ManagementMaintenance = lazy(() => import('../pages/management/Maintenance'));
const ManagementWorkOrders = lazy(() => import('../pages/management/Maintenance'));
const ManagementWorkOrderDetails = lazy(() => import('../pages/management/Maintenance'));
const ManagementPreventiveMaintenance = lazy(() => import('../pages/management/Maintenance'));
const ManagementVendors = lazy(() => import('../pages/management/Vendors'));
const ManagementSchedule = lazy(() => import('../pages/management/Schedule'));
const ManagementInventory = lazy(() => import('../pages/management/Maintenance'));

// Financial Management
const ManagementFinancials = lazy(() => import('../pages/management/Financial'));
const ManagementRentRoll = lazy(() => import('../pages/management/Financial'));
const ManagementInvoices = lazy(() => import('../pages/management/Invoices'));
const ManagementExpenses = lazy(() => import('../pages/management/Expenses'));
const ManagementBudgets = lazy(() => import('../pages/management/Financial'));

// Inspections
const ManagementInspections = lazy(() => import('../pages/management/Maintenance'));
const ManagementInspectionDetails = lazy(() => import('../pages/management/Maintenance'));
const ManagementInspectionSchedule = lazy(() => import('../pages/management/Maintenance'));
const ManagementInspectionReports = lazy(() => import('../pages/management/Maintenance'));

// Analytics
const ManagementAnalytics = lazy(() => import('../pages/management/Analytics'));
const ManagementRevenueAnalytics = lazy(() => import('../pages/management/RevenueAnalytics'));
const ManagementOccupancyAnalytics = lazy(() => import('../pages/management/Occupancy'));
const ManagementPerformanceAnalytics = lazy(() => import('../pages/management/PerformanceAnalytics'));

// Reports
const ManagementReports = lazy(() => import('../pages/management/ExportReports'));
const ManagementFinancialReports = lazy(() => import('../pages/management/FinancialReports'));
const ManagementOccupancyReports = lazy(() => import('../pages/management/OccupancyReports'));
const ManagementMaintenanceReports = lazy(() => import('../pages/management/MaintenanceReports'));

// Occupancy
const ManagementOccupancy = lazy(() => import('../pages/management/Occupancy'));

// Renewals
const ManagementRenewals = lazy(() => import('../pages/management/Renewals'));

// Directory
const ManagementDirectory = lazy(() => import('../pages/management/Directory'));

// Task Assign
const ManagementTaskAssign = lazy(() => import('../pages/management/TaskAssign'));

// Task Board
const ManagementTaskBoard = lazy(() => import('../pages/management/TaskBoard'));

// Completed Tasks
const ManagementCompletedTasks = lazy(() => import('../pages/management/CompletedTasks'));

// Calendar & Tasks
const ManagementCalendar = lazy(() => import('../pages/management/Calendar'));
const ManagementTasks = lazy(() => import('../pages/management/Tasks'));

// Announcements
const ManagementAnnouncements = lazy(() => import('../pages/management/Announcements'));

// Notifications
const ManagementNotifications = lazy(() => import('../pages/management/Notifications'));

// Alerts
const ManagementAlerts = lazy(() => import('../pages/management/Alerts'));

// Settings
const ManagementSettings = lazy(() => import('../pages/management/Settings'));

// Documents
const ManagementDocumentTemplates = lazy(() => import('../pages/management/DocumentTemplates'));
const ManagementDocumentLeases = lazy(() => import('../pages/management/DocumentLeases'));
const ManagementDocumentNotices = lazy(() => import('../pages/management/DocumentNotices'));

/**
 * Management routes component
 * Handles all property management routing
 */
const ManagementRoutes = () => {
  return (
    <ManagementLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Dashboard - index route */}
          <Route index element={<ManagementDashboard />} />
          <Route path="overview" element={<ManagementOverview />} />

          {/* Property Management */}
          <Route path="properties" element={<ManagementProperties />} />
          <Route path="properties/add" element={<ManagementAddProperty />} />
          <Route path="properties/map" element={<ManagementPropertiesMap />} />
          <Route path="properties/occupancy" element={<ManagementOccupancy />} />
          <Route path="properties/:id" element={<ManagementPropertyDetails />} />
          <Route path="properties/:id/units" element={<ManagementPropertyUnits />} />
          <Route path="properties/:id/tenants" element={<ManagementPropertyTenants />} />
          <Route path="properties/:id/maintenance" element={<ManagementPropertyMaintenance />} />
          <Route path="properties/:id/financials" element={<ManagementPropertyFinancials />} />

          {/* Unit Management */}
          <Route path="units" element={<ManagementUnits />} />
          <Route path="units/:id" element={<ManagementUnitDetails />} />
          <Route path="units/availability" element={<ManagementUnitAvailability />} />

          {/* Tenant Management */}
          <Route path="tenants" element={<ManagementTenants />} />
          <Route path="tenants/:id" element={<ManagementTenantDetails />} />
          <Route path="tenants/active" element={<ManagementTenants />} />
          <Route path="tenants/renewals" element={<ManagementRenewals />} />
          <Route path="tenants/directory" element={<ManagementDirectory />} />
          <Route path="tenants/screening" element={<ManagementTenantScreening />} />

          {/* Lease Management */}
          <Route path="leases" element={<ManagementLeases />} />
          <Route path="leases/:id" element={<ManagementLeaseDetails />} />
          <Route path="leases/renewals" element={<ManagementLeaseRenewals />} />
          <Route path="leases/violations" element={<ManagementLeaseViolations />} />

          {/* Maintenance Management */}
          <Route path="maintenance" element={<ManagementMaintenance />} />
          <Route path="maintenance/work-orders" element={<ManagementMaintenance />} />
          <Route path="maintenance/work-orders/:id" element={<ManagementWorkOrderDetails />} />
          <Route path="maintenance/preventive" element={<ManagementPreventiveMaintenance />} />
          <Route path="maintenance/vendors" element={<ManagementVendors />} />
          <Route path="maintenance/schedule" element={<ManagementSchedule />} />
          <Route path="maintenance/inventory" element={<ManagementInventory />} />

          {/* Financial Management */}
          <Route path="financial/rent" element={<ManagementRentRoll />} />
          <Route path="financial/invoices" element={<ManagementInvoices />} />
          <Route path="financial/expenses" element={<ManagementExpenses />} />
          <Route path="financial/reports" element={<ManagementBudgets />} />
          <Route path="financial" element={<ManagementFinancials />} />

          {/* Inspections */}
          <Route path="inspections" element={<ManagementInspections />} />
          <Route path="inspections/:id" element={<ManagementInspectionDetails />} />
          <Route path="inspections/schedule" element={<ManagementInspectionSchedule />} />
          <Route path="inspections/reports" element={<ManagementInspectionReports />} />

          {/* Analytics */}
          <Route path="analytics" element={<ManagementAnalytics />} />
          <Route path="analytics/revenue" element={<ManagementRevenueAnalytics />} />
          <Route path="analytics/occupancy" element={<ManagementOccupancyAnalytics />} />
          <Route path="analytics/performance" element={<ManagementPerformanceAnalytics />} />

          {/* Reports */}
          <Route path="reports" element={<ManagementReports />} />
          <Route path="reports/financial" element={<ManagementFinancialReports />} />
          <Route path="reports/occupancy" element={<ManagementOccupancyReports />} />
          <Route path="reports/maintenance" element={<ManagementMaintenanceReports />} />
          <Route path="reports/export" element={<ManagementReports />} />

          {/* Communications */}
          <Route path="communications" element={<ManagementTenantCommunications />} />
          <Route path="communications/announcements" element={<ManagementAnnouncements />} />
          <Route path="communications/notifications" element={<ManagementNotifications />} />

          {/* Calendar & Tasks */}
          <Route path="calendar" element={<ManagementCalendar />} />
          <Route path="tasks" element={<ManagementTasks />} />
          <Route path="tasks/assign" element={<ManagementTaskAssign />} />
          <Route path="tasks/board" element={<ManagementTaskBoard />} />
          <Route path="tasks/completed" element={<ManagementCompletedTasks />} />

          {/* Alerts */}
          <Route path="alerts" element={<ManagementAlerts />} />

          {/* Settings */}
          <Route path="settings" element={<ManagementSettings />} />

          {/* Invitations */}
          <Route path="invitations/send" element={<ManagementInvitations />} />
          <Route path="invitations/pending" element={<ManagementPendingInvitations />} />
          <Route path="invitations/accepted" element={<ManagementAcceptedInvitations />} />
          <Route path="invitations/declined" element={<ManagementDeclinedInvitations />} />

          {/* Documents */}
          <Route path="documents/templates" element={<ManagementDocumentTemplates />} />
          <Route path="documents/leases" element={<ManagementDocumentLeases />} />
          <Route path="documents/notices" element={<ManagementDocumentNotices />} />
        </Routes>
      </Suspense>
    </ManagementLayout>
  );
};

export default ManagementRoutes;
