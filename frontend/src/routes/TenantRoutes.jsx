import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import TenantLayout from '../layouts/TenantLayout';

const TenantDashboard = lazy(() => import('../pages/tenant/DashboardImproved'));
const TenantPayments = lazy(() => import('../pages/tenant/PaymentsImproved'));
const TenantMaintenance = lazy(() => import('../pages/tenant/MaintenanceImproved'));
const TenantMessages = lazy(() => import('../pages/tenant/MessagesImproved'));
const TenantProperty = lazy(() => import('../pages/tenant/MyUnitImproved'));
const TenantDocuments = lazy(() => import('../pages/tenant/DocumentsImproved'));
const TenantLease = lazy(() => import('../pages/tenant/Lease'));
const TenantSettings = lazy(() => import('../pages/tenant/Settings'));
const TenantResources = lazy(() => import('../pages/tenant/Resources'));
const TenantMarketInfo = lazy(() => import('../pages/tenant/MarketInfo'));
const TenantNeighborhood = lazy(() => import('../pages/tenant/Neighborhood'));

const LoadingSpinner = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div>Loading...</div>
  </div>
);

const TenantRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<TenantLayout />}>
          <Route index element={<TenantDashboard />} />
          <Route path="payments" element={<TenantPayments />} />
          <Route path="maintenance" element={<TenantMaintenance />} />
          <Route path="messages" element={<TenantMessages />} />
          <Route path="my-unit" element={<TenantProperty />} />
          <Route path="documents" element={<TenantDocuments />} />
          <Route path="lease" element={<TenantLease />} />
          <Route path="settings" element={<TenantSettings />} />
          <Route path="resources" element={<TenantResources />} />
          <Route path="market-info" element={<TenantMarketInfo />} />
          <Route path="neighborhood" element={<TenantNeighborhood />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default TenantRoutes;
