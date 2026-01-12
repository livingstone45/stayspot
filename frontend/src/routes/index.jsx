import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const PublicRoutes = lazy(() => import('./PublicRoutes'));
const AuthRoutes = lazy(() => import('./AuthRoutes'));

const LoadingSpinner = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div>Loading...</div>
  </div>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
