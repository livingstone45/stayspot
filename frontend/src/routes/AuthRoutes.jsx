import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const RegisterRolePage = lazy(() => import('../pages/auth/RegisterRolePage'));
const RegisterTenantPage = lazy(() => import('../pages/auth/RegisterTenantPage'));
const RegisterLandlordPage = lazy(() => import('../pages/auth/RegisterLandlordPage'));
const RegisterPropertyManagerPage = lazy(() => import('../pages/auth/RegisterPropertyManagerPage'));
const RegisterCompanyPage = lazy(() => import('../pages/auth/RegisterCompanyPage'));
const RegisterInvestorPage = lazy(() => import('../pages/auth/RegisterInvestorPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));

const LoadingSpinner = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div>Loading...</div>
  </div>
);

const AuthRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterRolePage />} />
        <Route path="/register/tenant" element={<RegisterTenantPage />} />
        <Route path="/register/landlord" element={<RegisterLandlordPage />} />
        <Route path="/register/property-manager" element={<RegisterPropertyManagerPage />} />
        <Route path="/register/company" element={<RegisterCompanyPage />} />
        <Route path="/register/investor" element={<RegisterInvestorPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AuthRoutes;
