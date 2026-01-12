/**
 * Landlord routes configuration
 * Handles all landlord portal routes for individual property owners
 */

import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load landlord pages
const LandlordLayout = lazy(() => import('../layouts/LandlordLayout'));
const LandlordDashboard = lazy(() => import('../pages/landlord/Dashboard'));
const LandlordOverview = lazy(() => import('../pages/landlord/Dashboard'));

// Property Management
const LandlordProperties = lazy(() => import('../pages/landlord/Properties'));
const LandlordPropertyDetails = lazy(() => import('../pages/landlord/Properties'));
const LandlordPropertyAdd = lazy(() => import('../pages/landlord/MyProperties'));
const LandlordPropertyEdit = lazy(() => import('../pages/landlord/Properties'));

// Unit Management
const LandlordUnits = lazy(() => import('../pages/landlord/MyProperties'));
const LandlordUnitDetails = lazy(() => import('../pages/landlord/MyProperties'));

// Tenant Management
const LandlordTenants = lazy(() => import('../pages/landlord/Tenants'));
const LandlordTenantDetails = lazy(() => import('../pages/landlord/Tenants'));
const LandlordTenantApplications = lazy(() => import('../pages/landlord/Tenants'));

// Lease Management
const LandlordLeases = lazy(() => import('../pages/landlord/MyProperties'));
const LandlordLeaseDetails = lazy(() => import('../pages/landlord/MyProperties'));
const LandlordLeaseCreate = lazy(() => import('../pages/landlord/MyProperties'));

// Financial Management
const LandlordFinancials = lazy(() => import('../pages/landlord/Financials'));
const LandlordIncome = lazy(() => import('../pages/landlord/Financials'));
const LandlordExpenses = lazy(() => import('../pages/landlord/Financials'));
const LandlordStatements = lazy(() => import('../pages/landlord/Financials'));
const LandlordTaxReports = lazy(() => import('../pages/landlord/Reports'));

// Maintenance
const LandlordMaintenance = lazy(() => import('../pages/landlord/Maintenance'));
const LandlordMaintenanceRequests = lazy(() => import('../pages/landlord/Maintenance'));
const LandlordMaintenanceHistory = lazy(() => import('../pages/landlord/Maintenance'));

// Communications
const LandlordCommunications = lazy(() => import('../pages/landlord/Communications'));
const LandlordMessages = lazy(() => import('../pages/landlord/Communications'));
const LandlordAnnouncements = lazy(() => import('../pages/landlord/Communications'));

// Documents
const LandlordDocuments = lazy(() => import('../pages/landlord/Documents'));
const LandlordContracts = lazy(() => import('../pages/landlord/Documents'));
const LandlordInsurance = lazy(() => import('../pages/landlord/Documents'));

// Reports
const LandlordReports = lazy(() => import('../pages/landlord/Reports'));
const LandlordAnalytics = lazy(() => import('../pages/landlord/Analytics'));
const LandlordMarketInsights = lazy(() => import('../pages/landlord/MarketInsights'));
const LandlordAddProperty = lazy(() => import('../pages/landlord/AddNewProperty'));

// Calendar
const LandlordCalendar = lazy(() => import('../pages/landlord/Calendar'));

// Alerts
const LandlordAlerts = lazy(() => import('../pages/landlord/Alerts'));

// Integrations
const LandlordIntegrations = lazy(() => import('../pages/landlord/Integrations'));

// Settings
const LandlordSettings = lazy(() => import('../pages/landlord/Settings'));
const LandlordProfile = lazy(() => import('../pages/landlord/Settings'));
const LandlordPreferences = lazy(() => import('../pages/landlord/Settings'));
const LandlordNotifications = lazy(() => import('../pages/landlord/Settings'));

/**
 * Landlord routes component
 * Handles all landlord portal routing
 */
const LandlordRoutes = () => {
  return (
    <Routes>
      <Route element={<LandlordLayout />}>
        {/* Dashboard */}
        <Route path="" element={<LandlordDashboard />} />
        <Route path="overview" element={<LandlordOverview />} />

        {/* Property Management */}
        <Route path="properties" element={<LandlordProperties />} />
        <Route path="properties/add" element={<LandlordAddProperty />} />
        <Route path="properties/:id" element={<LandlordPropertyDetails />} />
        <Route path="properties/:id/edit" element={<LandlordPropertyEdit />} />

        {/* Unit Management */}
        <Route path="units" element={<LandlordUnits />} />
        <Route path="units/:id" element={<LandlordUnitDetails />} />

        {/* Tenant Management */}
        <Route path="tenants" element={<LandlordTenants />} />
        <Route path="tenants/:id" element={<LandlordTenantDetails />} />
        <Route path="tenants/applications" element={<LandlordTenantApplications />} />

        {/* Lease Management */}
        <Route path="leases" element={<LandlordLeases />} />
        <Route path="leases/:id" element={<LandlordLeaseDetails />} />
        <Route path="leases/create" element={<LandlordLeaseCreate />} />

        {/* Financial Management */}
        <Route path="financials" element={<LandlordFinancials />} />
        <Route path="financials/income" element={<LandlordIncome />} />
        <Route path="financials/expenses" element={<LandlordExpenses />} />
        <Route path="financials/statements" element={<LandlordStatements />} />
        <Route path="financials/tax-reports" element={<LandlordTaxReports />} />

        {/* Maintenance */}
        <Route path="maintenance" element={<LandlordMaintenance />} />
        <Route path="maintenance/requests" element={<LandlordMaintenanceRequests />} />
        <Route path="maintenance/history" element={<LandlordMaintenanceHistory />} />

        {/* Communications */}
        <Route path="communications" element={<LandlordCommunications />} />
        <Route path="messages" element={<LandlordMessages />} />
        <Route path="announcements" element={<LandlordAnnouncements />} />

        {/* Documents */}
        <Route path="documents" element={<LandlordDocuments />} />
        <Route path="documents/contracts" element={<LandlordDocuments />} />
        <Route path="documents/insurance" element={<LandlordDocuments />} />

        {/* Reports */}
        <Route path="reports" element={<LandlordReports />} />
        <Route path="analytics" element={<LandlordAnalytics />} />
        <Route path="market-insights" element={<LandlordMarketInsights />} />

        {/* Calendar */}
        <Route path="calendar" element={<LandlordCalendar />} />

        {/* Alerts */}
        <Route path="alerts" element={<LandlordAlerts />} />

        {/* Integrations */}
        <Route path="integrations" element={<LandlordIntegrations />} />

        {/* Settings */}
        <Route path="settings" element={<LandlordSettings />} />
        <Route path="settings/profile" element={<LandlordProfile />} />
        <Route path="settings/preferences" element={<LandlordPreferences />} />
        <Route path="settings/notifications" element={<LandlordNotifications />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/landlord" replace />} />
      </Route>
    </Routes>
  );
};

export default LandlordRoutes;
