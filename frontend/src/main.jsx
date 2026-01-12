/**
 * Application entry point
 * Sets up React app with necessary polyfills and error handling
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Polyfills for older browsers
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Global error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Send error to monitoring service in production
  if (import.meta.env.PROD && window.gtag) {
    window.gtag('event', 'exception', {
      description: event.error?.message || 'Unknown error',
      fatal: false
    });
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Send error to monitoring service in production
  if (import.meta.env.PROD && window.gtag) {
    window.gtag('event', 'exception', {
      description: event.reason?.message || 'Unhandled promise rejection',
      fatal: false
    });
  }
});

// Performance monitoring
if (import.meta.env.PROD && 'performance' in window) {
  window.addEventListener('load', () => {
    // Measure and report performance metrics
    const perfData = performance.getEntriesByType('navigation')[0];
    
    if (perfData && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: 'load',
        value: Math.round(perfData.loadEventEnd - perfData.fetchStart)
      });
    }
  });
}

// Initialize React app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Hot module replacement for development
if (import.meta.hot) {
  import.meta.hot.accept();
}