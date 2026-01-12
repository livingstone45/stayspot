import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';

const HomePage = lazy(() => import('../pages/public/HomePage'));
const About = lazy(() => import('../pages/public/About'));
const Contact = lazy(() => import('../pages/public/Contact'));
const Pricing = lazy(() => import('../pages/public/Pricing'));
const Blog = lazy(() => import('../pages/public/Blog'));
const Careers = lazy(() => import('../pages/public/Careers'));
const Press = lazy(() => import('../pages/public/Press'));
const FAQ = lazy(() => import('../pages/public/FAQ'));
const Help = lazy(() => import('../pages/public/Help'));
const Relocation = lazy(() => import('../pages/public/Relocation'));
const Properties = lazy(() => import('../pages/public/Properties'));
const TenantRoutes = lazy(() => import('./TenantRoutes'));
const LandlordRoutes = lazy(() => import('./LandlordRoutes'));
const ManagementRoutes = lazy(() => import('./ManagementRoutes'));
const CompanyRoutes = lazy(() => import('./CompanyRoutes'));
const AdminRoutes = lazy(() => import('./AdminRoutes'));

const LoadingSpinner = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div>Loading...</div>
  </div>
);

const PublicRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/properties" element={<PublicLayout><Properties /></PublicLayout>} />
        <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
        <Route path="/careers" element={<PublicLayout><Careers /></PublicLayout>} />
        <Route path="/press" element={<PublicLayout><Press /></PublicLayout>} />
        <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
        <Route path="/help" element={<PublicLayout><Help /></PublicLayout>} />
        <Route path="/relocation" element={<PublicLayout><Relocation /></PublicLayout>} />
        <Route path="/tenant/*" element={<TenantRoutes />} />
        <Route path="/landlord/*" element={<LandlordRoutes />} />
        <Route path="/management/*" element={<ManagementRoutes />} />
        <Route path="/company/*" element={
          <Suspense fallback={<LoadingSpinner />}>
            <CompanyRoutes />
          </Suspense>
        } />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default PublicRoutes;
